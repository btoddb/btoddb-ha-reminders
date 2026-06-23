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
