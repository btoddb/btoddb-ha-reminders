# Geography / zone-based reminders

**Status:** proposed
**Touches:** scripts | automations | core (voice agent: `.storage` function/prompt/exposure)

## Goal

Let the user set **location reminders** by voice or typing — "remind me to take out the
trash when I get home" — delivered as a push the moment they arrive at (or leave) a
place. This runs alongside the existing **time-based** reminders
([../spec/reminders.md](../spec/reminders.md)), which stay unchanged.

## Why a separate mechanism

Time reminders work because *time* is a scalar that advances monotonically: a calendar
event stores the start time and `Reminder - deliver to phone` polls
`calendar.btoddb_reminders`
every minute against a watermark. A location reminder's trigger is a discrete **zone
enter/leave event** for a tracked person — there's nothing to poll — so it needs its own
storage (a queue of pending reminders) and its own trigger (person zone change).

### What exists today (verified live)
- `person.btoddb` (state `home`), tracked by `device_tracker.pixel_9_pro_xl` and
  `device_tracker.pixel_watch_4`.
- **Only `zone.home`** exists (core/YAML zone); `ha_get_zone()` returns 0 storage zones.
- Canonical version-controlled agent config:
  [../spec/voice-agent/functions.yaml](../spec/voice-agent/functions.yaml) and
  [../spec/voice-agent/prompt.txt](../spec/voice-agent/prompt.txt), shared verbatim by
  both Extended OpenAI subentries (gpt-5.4-mini + LM Studio) per NL-10.

## Behavior

1. **(constraint)** A pending location reminder is one open item on a dedicated native
   to-do list, `todo.location_reminders` (local_todo, persists in `.storage`). An open
   item = a pending reminder; delivering it removes the item.
2. **(constraint)** Item shape: `summary` = the message ("take out the trash");
   `description` = machine fields written by the script, never the model:
   `event=<arrive|leave>;state=<value>;zone=<zone.x>`. `state` is the value
   `person.btoddb` takes when in that zone (`home` for the home zone, the zone's friendly
   name otherwise) — so the delivery automation compares it directly to
   `trigger.to_state.state` / `from_state.state` with no zone-entity lookup at fire time.
3. **(constraint)** The agent uses a **distinct** typed function
   `create_location_reminder` (not an overload of `create_reminder`) — params `message`
   (required), `place` (default `home`), `event` (enum `arrive`|`leave`, default
   `arrive`). It calls `script.create_location_reminder` with
   `response_variable: _function_result` (the RM-9 lesson: without returned data the model
   guesses whether it worked). Separate functions keep each schema clean for the small
   model and follow RM-5's typed-function requirement.
4. `script.create_location_reminder` resolves `place` → zone + person-state value:
   `home`/empty → `zone.home`, value `home`; else match a `zone.*` by friendly name
   (case-insensitive). It then `todo.add_item`s onto `todo.location_reminders` and returns
   `{success: true, message, place, event}` so the agent confirms naturally.
5. **(constraint, graceful unknown place)** If no zone matches `place`, the script returns
   `{success: false, message: "I don't have a zone for '<place>' yet"}` and adds nothing;
   the agent relays that. New zones can be added later with no code change.
6. Delivery: a `Location reminder - deliver on zone change` automation triggers on any
   `person.btoddb` state change (generic, so future zones need no automation edit). It
   computes arrived = `to_state`, left = `from_state` (ignoring `not_home`/`unknown`),
   reads open items via `todo.get_items`, and for each matching item (`event=arrive` &
   `state==arrived`, or `event=leave` & `state==left`) pushes `notify.btoddb` (title
   `📍 Reminder`, high-priority `ttl:0 / priority:high / importance:high /
   channel:Reminders`, mirroring RM-6) then removes it with `todo.remove_item`.
7. Both **arrive** and **leave** are supported; each reminder is one-shot (removed on
   delivery).
8. **(constraint)** Setting a reminder while already in the target zone does **not** fire
   immediately — it fires on the next transition into/out of that zone.

## Out of scope

- Creating zones for other places (work, gym, …) — handled gracefully (rule 5), added
  later as plain zone config.
- Combined time-and-location reminders ("when I get home or by 8pm").
- Recurring location reminders (each is one-shot).
- **Downtime gap:** an arrival/departure that happens while HA is down is missed (the
  state-change event is lost). No startup catch-up — that would mis-fire reminders for the
  zone you're already in.

## Files to change

Repo: `scripts.yaml` (new `create_location_reminder` script), `automations.yaml` (new
delivery automation), [../spec/voice-agent/functions.yaml](../spec/voice-agent/functions.yaml)
(add function), [../spec/voice-agent/prompt.txt](../spec/voice-agent/prompt.txt) (add
instruction near the `create_reminder` line), and on ship, fold rules into
[../spec/reminders.md](../spec/reminders.md) (new IDs RM-10+) and update NL-3 in
[../spec/natural-language.md](../spec/natural-language.md) (expose
`script.create_location_reminder`; mention the function).

Live `.storage` (not version-controlled; apply via MCP, confirm each write per the
auto-mode constraint): create `todo.location_reminders`; expose
`script.create_location_reminder` to `conversation`; push updated `functions.yaml` +
`prompt.txt` into **both** subentries, resubmitting every field (partial updates wipe
unpassed fields — NL-10).

## Acceptance criteria

- [ ] `script.create_location_reminder(message, place=home, event=arrive)` adds a
      correctly-described item to `todo.location_reminders` and returns `success: true`.
- [ ] Same script with an unknown place returns `success: false` with the no-zone message
      and adds nothing.
- [ ] With a pending arrive-home item, a not_home→home transition fires exactly one
      `📍 Reminder` push and removes the item; same for a leave item on home→not_home.
- [ ] Via Assist / the typed Reminders box, "remind me to take out the trash when I get
      home" makes the agent call `create_location_reminder` (not `create_reminder`) and
      confirm; "when I get to work" relays the no-zone message.
- [ ] Committed `functions.yaml`/`prompt.txt` match both live subentries (NL-10 parity).
