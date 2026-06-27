# Reminders — component spec

This is the **engine** side of reminders: the `btoddb_ha_reminders.create` service, the
`calendar.btoddb_reminders` storage, and the delivery loop, as implemented by this
integration. The **natural-language** side (how a conversation agent is prompted and
wired to call the service — RM-1..RM-4, NL-*) lives with the Home Assistant deployment
that installs this component; see the [README](../../README.md) for the recipe.

Rule IDs are **stable** — add new IDs, never renumber or reuse. The `RM-*` numbering is
shared with the deployment spec these rules were extracted from.

## Creating a reminder

**RM-4a (constraint).** A **relative delay** ("in 5 minutes", "in 2 hours") is passed
as a minutes offset (`in_minutes`); the component computes `now() + offset`. The caller
(the model) never does clock arithmetic — small models are unreliable at it ("in 5
minutes" once landed at 3am). A specific clock time or date is passed as an absolute
local datetime (`when`). `in_minutes` takes priority if both are supplied.

**RM-5.** `btoddb_ha_reminders.create` accepts `message`, and **either** `when` (absolute ISO
8601 local datetime) **or** `in_minutes` (offset). It resolves the start time from
whichever was supplied and stores a reminder event. A naive `when` (no offset) is
interpreted in HA's configured time zone.

**RM-9 (constraint).** `btoddb_ha_reminders.create` returns response data
(`{success, message, start}`, via `SupportsResponse.ONLY`). Without a returned tool
result the conversation agent has no signal and guesses whether the reminder was set,
non-deterministically confirming or denying even when the event was stored every time.
`start` is rendered as an already **spoken-language** time string (e.g. "tomorrow at
6 PM"; minutes omitted on the hour; weekday name for 2-6 days out; weekday plus
month/day beyond a week, since a bare weekday name is ambiguous once it could refer to
more than one occurrence) rather than a raw datetime, so the agent can echo it verbatim
instead of reading an ISO/digit-clock form aloud.

## Storage

**RM-8a.** Reminders are stored by the component (`.storage/reminders`) and surfaced as
a **`calendar.btoddb_reminders`** calendar entity (a 1-minute event per reminder), so a
built-in calendar dashboard card shows upcoming reminders. The storage layer is a
**seam**: a future option to target a pre-existing calendar swaps the backend without
changing the service or delivery loop. (The user-facing dashboard itself — RM-8 — is a
deployment concern, see README.)

## Delivery

**RM-6 (constraint).** Reminders are delivered the moment they come due. The delivery
loop polls every minute (and runs a catch-up pass on Home Assistant start) and pushes
any newly-due reminder to the configured notify service with title "⏰ Reminder" and
message = the reminder text. The push is high-priority (`ttl: 0`, `priority: high`,
`importance: high`, `channel: Reminders`) so Android delivers it immediately rather than
holding it in Doze. The notify target is configurable so the component is shareable.

**RM-7.** Delivery is **watermark-based** so reminders that came due while Home
Assistant was down are still delivered. The watermark records the last check; each run
delivers events with start time in `(watermark, now]`, then advances the watermark to
`now`. A fresh/unknown watermark falls back to `now - 2 minutes`.

**RM-7a.** The watermark is persisted in the component's `.storage` and loaded on setup,
so it is durable across restarts by construction. (This supersedes the original
`input_datetime` form of RM-7a, whose "must have no `initial` value" caveat existed only
because an `input_datetime` with an `initial` disabled state-restore; a `Store` value
has no such pitfall.)

**RM-7b (constraint).** The effective watermark for the `(watermark, now]` catch-up
window is **clamped to at most 6 hours in the past** (`max(stored, now - 6h)`),
defending against a lost, corrupted, or never-initialized watermark flooding the notify
target with a backlog. The 6h floor only kicks in when the stored value is older than
that. A legitimate outage longer than 6h will therefore not re-deliver reminders that
came due more than 6h before restart — a deliberate cap; per-event dedup would remove
the tradeoff but is out of scope.

## Location / zone reminders

A second, independent kind of reminder (issue #2) delivered the moment a tracked person
enters or leaves a Home Assistant **zone**, rather than at a clock time. It reuses the
notify path and the same dashboard card but has its own pure-logic module
(`location.py`), storage (`.storage/btoddb_ha_reminders_location`), and read surface
(`sensor.btoddb_location_reminders`). Time-based rules (RM-*) are unaffected.

**LOC-1 (constraint).** A location reminder names a `person` entity, a `zone` entity, and
a `trigger` of `enter` or `leave`. When that person's state transitions **into** the zone
(`old != zone, new == zone`) an `enter` reminder fires; when it transitions **out**
(`old == zone, new != zone`) a `leave` reminder fires. A person's state is `"home"` for
the home zone and the zone's **friendly name** for any other zone, so that is the value
compared. Transitions where either side is `unknown`/`unavailable` are ignored. Delivery
pushes to the same configured notify service as time reminders, with title "📍 Reminder".

**LOC-2.** Detection is driven by `async_track_state_change_event` on the `person.*`
entities referenced by **undelivered** reminders; the subscription is recomputed whenever
the store changes, so the integration only wakes for people who have a pending reminder.

**LOC-3 (constraint).** A location reminder is **one-shot**: the first matching transition
that is **successfully pushed** stamps `delivered_at` and it never fires again. If the
notify call raises, the reminder is left pending (not crossed off, not pruned) so a later
matching transition can still deliver it — a reminder must never be marked delivered when
it never reached the user.

**LOC-4.** Location reminders persist in their own `Store`
(`.storage/btoddb_ha_reminders_location`), separate from the time-based store, so neither
needs migrating when the other changes.

**LOC-5 (suggestion).** A delivered reminder is kept (crossed off, with its delivery
timestamp) for **7 days** so the user can see when it fired, then pruned. Pruning runs on
a light periodic sweep (hourly) so retention holds even for a person who stops moving.

**LOC-6.** The reminders are surfaced to the dashboard card through the
`sensor.btoddb_location_reminders` entity: its state is the count of undelivered reminders
and its `reminders` attribute is the full list (undelivered + delivered-within-7-days).
The card reads the list from the entity attributes and re-renders on entity updates,
mirroring how it already watches the calendar entity.

**LOC-7.** Location reminders are deletable at any time (delivered or not) via the
`btoddb_ha_reminders.delete_location` service (the card's per-row delete), analogous to
`calendar/event/delete` for time reminders.

**LOC-8.** A location reminder may be marked **persistent** (`persistent: true` on
`create_location` / `update_location`). A persistent reminder is never stamped
`delivered_at` — it re-fires on every matching zone transition, exactly like a recurring
time reminder. `async_mark_delivered` is a no-op for persistent reminders; the
`tracked_persons` subscription is never released. Persistent reminders are never pruned
by the 7-day retention sweep (they have no `delivered_at` to prune on).

**LOC-out.** Non-zone locations (raw addresses) and a conversation-agent function for
creating location reminders are out of scope for now; `zone` is stored as an entity_id
string so an address-backed source can slot in later without reshaping the model.

## Snooze (time-based reminders)

**RM-10.** Every delivered time-based notification includes **actionable snooze buttons**
alongside an OK button via `data.actions` (HA Companion mobile app format). The
`data.tag` field is set per-reminder uid so that a re-delivered snooze replaces the
notification if the device is still showing it.

**RM-11.** A snooze creates a **new one-shot reminder** set to fire `minutes` after the
moment the snooze action fires. The new event gets a fresh uid and no rrule. The original
recurring series (if any) is unaffected: the recurring event has already been rolled
forward to its next occurrence before the notification was sent.

**RM-12.** Snooze durations are **configurable** in the integration Options, defaulting
to `[15, 60]` (15 min and 1 hour). The configured values appear as buttons on every
delivered time-based notification.

**RM-13 (constraint).** The `mobile_app_notification_action` event listener is
**action-namespaced**: it only acts on action ids prefixed with
`BTODDB_HA_REMINDERS_SNOOZE__`, ignoring all others so unrelated integrations' button
taps are never processed.

**RM-14.** Snooze is callable as a first-class HA service (`btoddb_ha_reminders.snooze`,
fields `uid` + `minutes`). The notification action listener delegates to this service.
The service can also be invoked directly from automations, scripts, or the dashboard card.

**RM-15 (constraint).** The `data.actions` / `data.tag` keys are honoured only by the
HA Companion mobile app. For `notify.persistent_notification` or notify groups the keys
are silently ignored — no regression for non-mobile users.
