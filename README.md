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
  `{success, message, start}`, where `start` is a spoken-language time string
  ("tomorrow at 6 PM") for the agent to read back.
- **`calendar.btoddb_reminders`** — a calendar entity listing upcoming reminders (use it with
  a calendar dashboard card).
- **Delivery loop** — polls every minute and on startup; pushes any newly-due reminder
  to your configured notify service as a high-priority notification. A durable,
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
shows all **notify entities** registered in your HA instance — select the one you
want due reminders delivered to. You can change it later from the integration's
**Configure** button.

#### What is a notify entity?

Modern Home Assistant integrations register a *notify entity* (domain `notify`) rather
than a legacy notify service. The most common source is the **Home Assistant Companion
App** for Android or iOS: once the app is installed and your phone has connected to HA,
a `notify.mobile_app_<device>` entity appears automatically.

To verify your notify entity exists:

1. **Settings → Devices & Services → Entities** and filter by domain `notify`, or
2. Open **Developer Tools → States** and look for entities starting with `notify.`.

If the picker is empty, the Companion App is not yet connected. Install it from the
[App Store](https://apps.apple.com/app/home-assistant/id1099568401) or
[Google Play](https://play.google.com/store/apps/details?id=io.homeassistant.companion.android),
sign in to your HA instance, and the entity will appear within seconds.

Other integrations that register notify entities include pushover, ntfy, and any
integration that uses HA's modern `NotifyEntity` base class.

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
`message` / `when` / `in_minutes`, so reminders get created empty and untimed. You must
give the agent a typed function. Paste
[`examples/create_reminder.function.yaml`](examples/create_reminder.function.yaml) into
the agent's **functions** field.

### 3. Keep `response_variable` — it's mandatory, not optional

The function **must** request the service response
(`response_variable: _function_result`). Without it the tool result handed back to the
model is empty, the model has no signal either way, and it **guesses** — saying "Done"
or "I can't set that reminder right now" non-deterministically even though the reminder
was written every time. The service returns `{success, message, start}`; the prompt
tells the model to echo `start` verbatim (it's already spoken-language).

### 4. Route relative delays through `in_minutes`, never model-computed clock times

Small models are unreliable at datetime arithmetic — left to compute it, *"remind me in
5 minutes"* once landed at **3am**. The function description instructs the model to pass
`in_minutes` for relative requests and **not** compute a clock time; the home computes
`now() + offset`. Absolute times/dates go through `when` as ISO 8601 local.

### 5. Add the prompt lines that matter

From [`examples/prompt-snippet.txt`](examples/prompt-snippet.txt):

- **Inject a live "Current time" + timezone** so relative phrasing resolves. Render it
  with a template every turn — never paste a static time.
- **"Never tell the user a reminder is set unless you called create_reminder this turn
  and it returned success"** — kills false confirmations.
- **"Speak dates/times the way a person would … never ISO or digit-clock"** — so the
  model reads `start` back naturally instead of "six zero zero pm".

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
- **Location/zone** reminders ("remind me when I get home") on the same foundation.
