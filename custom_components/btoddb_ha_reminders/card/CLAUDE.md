# Card — CLAUDE.md

The `btoddb-reminders-card` Lovelace card for the Reminders integration.

## What it does

- A **Time / Location** tab toggle picks which add-row shows.
- **Time** add row (native text `input` + native `datetime-local` input + native `<button>`)
  calls the **response-only** `btoddb_ha_reminders.create` service (`returnResponse` must be
  `true`). The message uses a styled native `<input>` rather than `ha-textfield` so it
  always renders even where that HA element isn't loaded.
- **Location** add row (native text `input` + two `ha-entity-picker`s for person/zone + a
  native `<select>` for enter/leave + native `<button>`) calls `btoddb_ha_reminders.create_location`.
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

It is built from **stock HA web components** (`ha-card`, `ha-icon`, `ha-icon-button`)
plus native `<input>`s, native `<button>`s, and Lit — no `custom-card-helpers`.

## Source / build / deploy

- Edit only the TypeScript in `src/*.ts`. **Never hand-edit** the generated
  `../www/btoddb-ha-reminders.js` bundle (or its `.map`).
- `src/index.ts` is the entry: console banner + `customCards` registration. Its first
  `vX.Y.Z` string is the version `scripts/deploy.sh` bumps — don't edit it by hand.
- Build + deploy with `scripts/deploy.sh` from the repo root: it `npm install`s, bumps
  the patch version in `package.json` (and syncs the banner), runs `npm run build`
  (esbuild → `btoddb-ha-reminders.js` + `.map`), and copies the bundle into `../www/`.
- The integration serves `../www/` at `/btoddb-ha-reminders/` and auto-registers it
  as a Lovelace **resource** (content-hash-busted URL), so after a deploy just
  **hard-refresh** the browser — no manual resource to add, no HA restart.

## Versioning

`package.json` (`X.Y.Z`, plain) is bumped **only** by `scripts/deploy.sh`. This is
independent of the integration's `manifest.json` version.
