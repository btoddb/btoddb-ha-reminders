# Reminders (Home Assistant custom component)

Set a reminder in **natural language** — by voice or by typing — and get a
high-priority push notification when it comes due. Parsing is done by your
conversation agent (an LLM), not by rigid exact-match sentences, so any phrasing
works: *"remind me to take out the trash at 6pm"*, *"don't let me forget to call mom in
two hours"*.

This integration owns the **engine**: a `btoddb_ha_reminders.create` service, a
`calendar.btoddb_reminders` calendar entity, and a once-a-minute delivery loop that survives
restarts. It does **not** parse language itself — that's the conversation agent's job,
and wiring it up well is the part that takes tuning. **Read
[Wiring up the conversation agent](#wiring-up-the-conversation-agent) — it's the
difference between reminders that work and reminders that randomly fail.**

## What you get

- **`btoddb_ha_reminders.create`** service — `message`, plus **either** `when` (absolute ISO 8601
  local datetime) **or** `in_minutes` (relative offset). Returns
  `{success, message, start, confirmation}`, where `confirmation` is a ready-to-say
  sentence for the agent to read back. Optional `rrule` param enables recurring
  reminders (`FREQ=DAILY` / `FREQ=WEEKLY;BYDAY=MO`), with an optional `INTERVAL=N`
  for "every other week"/"every N weeks" (or days) cadences — see
  [§4a](#4a-route-recurring-reminders-through-rrule-never-refuse-them).
- **`btoddb_ha_reminders.create_location`** service — `message`, `person` entity, `zone`
  entity, `trigger` (`enter` or `leave`). Fires the moment the person enters or leaves
  that zone. Set `persistent: true` to re-fire on every matching transition rather than
  just once. Returns `{success, message, start}` when called with `response_variable`
  (same pattern as `create`); `start` is a spoken phrase ("when you leave Work") the
  agent can echo back.
- **`calendar.btoddb_reminders`** — a calendar entity listing upcoming time-based reminders.
- **`sensor.btoddb_location_reminders`** — exposes active and recently-delivered location
  reminders; the dashboard card reads from this entity.
- **Dashboard card** (`btoddb-reminders-card`) — auto-registered as a Lovelace resource;
  add it to any dashboard to create, edit, and delete both time and location reminders
  without touching Developer Tools. No hard-refresh or manual resource setup needed after
  updates.
- **Delivery loop** — polls every minute and on startup; pushes any newly-due reminder
  to your configured notify service (`notify.*`) as a high-priority notification. A durable,
  6h-clamped watermark means reminders that came due while HA was down are still
  delivered on restart, without replaying an unbounded backlog.

## Installation

### HACS (recommended)

1. HACS → ⋮ → **Custom repositories** → add this repo's URL, category **Integration**.
2. Install **Reminders**, then restart Home Assistant.

### Manual

Copy `custom_components/btoddb_ha_reminders/` into your HA config's `custom_components/` directory
and restart.

### Configure

**Settings → Devices & Services → Add Integration → Reminders.** The setup picker
is a dropdown of every **notify service** registered in your HA instance — pick the
one you want due reminders delivered to. You can change it later from the integration's
**Configure** button.

#### Which notify service?

Anything in the `notify.*` domain works, because reminders are delivered by calling
that service with a `title`, `message`, and `data` payload. Common choices:

- **`notify.persistent_notification`** — shows the reminder as a dismissible
  notification in the HA UI (the bell menu). Always available, nothing to install, and
  a good default for testing.
- **`notify.mobile_app_<device>`** — pushes to a phone/tablet running the **Home
  Assistant Companion App** ([iOS](https://apps.apple.com/app/home-assistant/id1099568401) /
  [Android](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android)).
  The service appears automatically once the app has connected to your HA instance.
- **A notify group** (e.g. `notify.btoddb`) — fan a reminder out to several targets at
  once. Define one under **Settings → Devices & Services → Helpers**, or in YAML with
  the [`notify` group platform](https://www.home-assistant.io/integrations/group/#notify-groups).

To see what's available on your instance, open **Developer Tools → Actions** and type
`notify.` — every registered service is listed there (the same set the picker shows).

> **Note:** the picker lists notify *services*, not the newer notify *entities*. This is
> deliberate — persistent notifications and notify groups are only exposed as services,
> never as entities, so a service picker is the only way to reach them. Make sure the
> integration whose service you want is installed and connected before opening Configure —
> the dropdown only shows services that are already registered.

## Wiring up the conversation agent

The component is only half of working reminders; the other half is a conversation agent
configured to call `btoddb_ha_reminders.create` correctly. This is the part that took real tuning
— each note below is something that *failed* before it was fixed, so don't skip them.
Reference artifacts you can copy:

- [`examples/create_reminder.function.yaml`](examples/create_reminder.function.yaml) —
  the function definition.
- [`examples/prompt-snippet.txt`](examples/prompt-snippet.txt) — the system-prompt lines.

These examples target the **Extended OpenAI Conversation** integration
(`jekalmin/extended_openai_conversation`), which is what this was built and tuned on.
Any tool-calling LLM agent works if it can do the same things.

### 1. Use a tool-calling model, with enough output tokens

The agent model must support **tool/function calling**. Set **Maximum Tokens ≥ 2048** —
the integration's default of 150 truncates tool calls. A local *reasoning* model (e.g.
Qwen3 in LM Studio) needs its reasoning suppressed for voice latency — add `/no_think`
to the prompt; omit it for non-reasoning / cloud models.

### 2. Define a dedicated `create_reminder` function — don't just expose the service

A generic "call any service" function only forwards `entity_id` and **silently drops**
`message` / `when` / `in_minutes` / `rrule`, so reminders get created empty, untimed,
or one-shot when the user asked for a recurring schedule. You must give the agent a
typed function. Paste
[`examples/create_reminder.function.yaml`](examples/create_reminder.function.yaml) into
the agent's **functions** field.

### 3. Keep `response_variable` — it's mandatory, not optional

The function **must** request the service response
(`response_variable: _function_result`). Without it the tool result handed back to the
model is empty, the model has no signal either way, and it **guesses** — saying "Done"
or "I can't set that reminder right now" non-deterministically even though the reminder
was written every time. The service returns `{success, message, start, confirmation}`;
the prompt tells the model to echo `confirmation` verbatim.

### 4. Route relative delays through `in_minutes`, never model-computed clock times

Small models are unreliable at datetime arithmetic — left to compute it, *"remind me in
5 minutes"* once landed at **3am**. The function description instructs the model to pass
`in_minutes` for relative requests and **not** compute a clock time; the home computes
`now() + offset`. Absolute times/dates go through `when` as ISO 8601 local.

### 4a. Route recurring reminders through `rrule`, never refuse them

Daily and weekly time reminders are supported. For a request like *"Remind me every
day at 2 PM to stand up and stretch"*, the agent should call `create_reminder` with
`message: stand up and stretch`, `when` set to the next 2 PM, and `rrule` set to
`FREQ=DAILY`. For weekly requests, use `FREQ=WEEKLY;BYDAY=MO` with the requested
weekday; `when` must fall on the same weekday as `BYDAY` or the call is rejected.
The copied function schema includes `rrule`; without it, the model may
incorrectly claim recurring reminders are not supported.

**Every other week / every N weeks:** append `;INTERVAL=N` to `rrule` to skip
weeks (or days for `FREQ=DAILY`) between occurrences — `INTERVAL=1` (or omitted)
means every week, `INTERVAL=2` means every other week, `INTERVAL=3` means every
third week, and so on. Voice mapping for the agent: "every week" -> omit/`INTERVAL=1`,
"every other week" -> `INTERVAL=2`, "every third week" -> `INTERVAL=3`, "every
fourth week" -> `INTERVAL=4`, etc. Example: "every other Monday at 9 AM" ->
`rrule: FREQ=WEEKLY;BYDAY=MO;INTERVAL=2`.

### 5. Add the prompt lines that matter

From [`examples/prompt-snippet.txt`](examples/prompt-snippet.txt):

- **Inject a live "Current time" + timezone** so relative phrasing resolves. Render it
  with a template every turn — never paste a static time.
- **"Never tell the user a reminder is set unless you called create_reminder this turn
  and it returned success"** — kills false confirmations.
- **"Speak dates/times the way a person would … never ISO or digit-clock"** — fallback
  guardrails if the model does not echo the returned `confirmation`.

### 6. Stop false confirmations on small models: bound the context history

This is the single highest-value tuning note for small/local models. With accumulated
conversation history, a small model starts replying *"I've set a reminder"* with **no
tool call at all**. Cap lookback: set `context_threshold` **below the system-prompt
size** (≈1000) with `context_truncate_strategy: clear`. Cloud models (e.g. GPT-class)
are far less prone to this and tolerate a moderate value (≈3000) for natural follow-ups.

### 7. Expose `calendar.btoddb_reminders` to the agent; keep the allowlist tight

Expose `calendar.btoddb_reminders` to the conversation assistant. Exposing fewer entities
overall measurably improves small-model reliability — don't expose the whole house.

### 8. (Optional) Typing path and dashboard

To set reminders by typing, point a text helper's changes at your conversation agent —
an automation that sends a non-empty `input_text` value to `conversation.process`
(prefixed e.g. `Set a reminder:`) and then clears the box — and put that box plus a
calendar card bound to `calendar.btoddb_reminders` on a dashboard. The typed path must go
through the agent (the LLM does the parsing); the component can't parse language itself.

### 9. (Optional) Voice for location reminders

To set location reminders by voice ("remind me to grab the dry cleaning when I leave
work"), add `create_location_reminder` as a second agent function alongside
`create_reminder`:

1. Paste [`examples/create_location.function.yaml`](examples/create_location.function.yaml)
   into the agent's **functions** field (same place as `create_reminder`).
2. Add the location-specific lines from
   [`examples/prompt-snippet.txt`](examples/prompt-snippet.txt) (the block after the
   "Location reminders" comment) to your system prompt. These render live lists of your
   `person.*` and `zone.*` entities so the model picks real ids instead of inventing them.
3. Expose your `person.*` and `zone.*` entities to the conversation assistant so the
   rendered lists are non-empty.

The same rules apply as for `create_reminder`: use `response_variable` (already in the
example), and the model echoes `start` verbatim — it's already a natural phrase like
"when you leave Work".

### Keep your prompt/functions under version control

The agent's `prompt` and `functions` live in HA's `.storage`, which has no diff or
history and can be lost on a config-entry recreation. Keep your edited copies in a repo
and sync them deliberately; periodically diff the committed copies against the live
agent to catch drift.

## How it behaves (spec)

The full, ID'd behavior spec lives in
[`requirements/spec/reminders.md`](requirements/spec/reminders.md) (rules `RM-*`).

## Roadmap

- Option to use an **existing** calendar instead of the component-created one (the
  storage layer is already a swappable seam).
