# Card — CLAUDE.md

The Lovelace cards for the Reminders integration.

## `btoddb-reminders-card`

- A **Time / Location** tab toggle picks which add-row shows.
- **Time** add row (native text `input` + native `datetime-local` input + native `<button>`)
  calls the **response-only** `btoddb_ha_reminders.create` service (`returnResponse` must be
  `true`). The message uses a styled native `<input>` rather than `ha-textfield` so it
  always renders even where that HA element isn't loaded. A **Repeat** disclosure button
  below the row expands to a frequency selector (Daily / Weekly), an interval number input
  ("every N day(s)/week(s)") and, for Weekly, a row of weekday chips (Sun–Sat); these build
  the `rrule` param (`FREQ=DAILY` or `FREQ=WEEKLY;BYDAY=<MO|TU|…>`, with `;INTERVAL=N`
  appended when the interval is greater than 1) passed to `create` / `update`.
- **Location** add row (native text `input` + two `ha-entity-picker`s for person/zone + a
  native `<select>` for enter/leave + native `<button>`) calls
  `btoddb_ha_reminders.create_location`. The `persistent` flag (re-fire on every matching
  zone transition instead of once) is exposed as a **Repeat** toggle button below the row.
- The **Time** and **Location** section headings in the list are independently
  collapsible — clicking a heading (which shows a count badge and a chevron twisty) toggles
  `_timeCollapsed` / `_locationCollapsed` state, hiding or showing the rows for that group.
  The chevron rotates 90° when collapsed. `getCardSize()` counts a collapsed section as 1
  row so HA's masonry layout stays compact.
- A single merged list shows both kinds of reminder:
  - Time reminders read from the `calendar.btoddb_reminders` entity via the calendar REST
    API (`GET calendars/<entity>?start=&end=`); deleted via the `calendar/event/delete`
    websocket command.
  - Location reminders read straight off the `sensor.btoddb_location_reminders` entity's
    `reminders` attribute (no extra fetch); deleted via `btoddb_ha_reminders.delete_location`.
    Delivered ones render struck-through with their delivery time and linger 7 days.
- The list refreshes when the calendar entity's `last_updated` changes (add / fire /
  delete) and once a minute (so times stay fresh and fired reminders drop off); location
  rows re-render on any `hass` update since they read from entity state.
- After a time reminder create/update/delete, the card emits a browser-local change event
  so any `btoddb-calendar-list-card` on the same dashboard can refresh without waiting for
  Home Assistant's next entity update or the minute timer.

It is built from **stock HA web components** (`ha-card`, `ha-icon`, `ha-icon-button`)
plus native `<input>`s, native `<button>`s, and Lit — no `custom-card-helpers`.

## `btoddb-calendar-list-card`

Read-only agenda/list card for one or more Home Assistant calendar entities. It is
intended for viewing reminders alongside other events; creation, editing, and deletion
remain in `btoddb-reminders-card`.

Example config:

```yaml
type: custom:btoddb-calendar-list-card
title: Agenda
entities:
  - calendar.btoddb_reminders
  - calendar.family
days: 14
hide_end_time: auto
show_calendar_name: auto
max_items: 0
dashboard_path: /calendar?view=dayGridMonth
```

- Fetches each configured calendar from the HA calendar REST API
  (`GET calendars/<entity>?start=&end=`), merges results, sorts chronologically, and groups
  by local day, expanding multi-day events into one visible agenda row per day.
- When a `btoddb-reminders-card` on the same dashboard changes a configured reminder
  calendar, the agenda does an immediate refresh plus short retries so recurring reminders
  appear as soon as the calendar API reflects them.
- Skips empty days because day headers are emitted only for days with entries.
- `hide_end_time` supports `auto` (default), `always`, or `never`; `auto` hides the end for
  all-day entries and point-in-time entries with duration of 1 minute or less.
- `show_calendar_name` supports `auto` (show only when more than one calendar is configured),
  `always`, or `never`.
- `max_items: 0` means unlimited. The default look-ahead window is 14 days.
- Clicking anywhere on the agenda opens `dashboard_path`; blank/unset defaults to
  `/calendar?view=dayGridMonth`.
- String entries under `entities` are preferred, but object entries with
  `hide_end_time: true|false|auto|always|never` are accepted for compatibility with earlier
  plan drafts.

Both cards compile into the single `btoddb-ha-reminders.js` bundle and are registered from
`src/index.ts`.

## Source / build / deploy

- Edit only the TypeScript in `src/*.ts`. **Never hand-edit** the generated
  `../www/btoddb-ha-reminders.js` bundle (or its `.map`).
- `src/index.ts` is the entry: console banner + `customCards` registration. Its first
  `vX.Y.Z` string is the version `scripts/deploy-card` bumps — don't edit it by hand.
- Build + deploy with `scripts/deploy-card` from the repo root: it `npm install`s, bumps
  the patch version in `package.json` (and syncs the banner), runs `npm run build`
  (esbuild → `btoddb-ha-reminders.js` + `.map`), and copies the bundle into `../www/`.
- The integration serves `../www/` at `/btoddb-ha-reminders/` and auto-registers it
  as a Lovelace **resource** (content-hash-busted URL), so after a deploy just
  **hard-refresh** the browser — no manual resource to add, no HA restart.

## Versioning

`package.json` (`X.Y.Z`, plain) is bumped **only** by `scripts/deploy-card`. This is
independent of the integration's `manifest.json` version.
