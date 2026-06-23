# Card — CLAUDE.md

The `btoddb-reminders-card` Lovelace card for the Reminders integration.

## What it does

- An add row (native text `input` + native `datetime-local` input + `mwc-button`) that
  calls the **response-only** `btoddb_ha_reminders.create` service (`returnResponse` must be
  `true`). The message uses a styled native `<input>` rather than `ha-textfield` so it
  always renders even where that HA element isn't loaded.
- A list of upcoming reminders read from the `calendar.btoddb_reminders` entity via the
  calendar REST API (`GET calendars/<entity>?start=&end=`), each row with an
  `ha-icon-button` that deletes via the `calendar/event/delete` websocket command.
- The list refreshes when the calendar entity's `last_updated` changes (add / fire /
  delete) and once a minute (so times stay fresh and fired reminders drop off).

It is built from **stock HA web components** (`ha-card`, `ha-icon`, `ha-icon-button`,
`mwc-button`) plus native `<input>`s and Lit — no `custom-card-helpers`.

## Source / build / deploy

- Edit only the TypeScript in `src/*.ts`. **Never hand-edit** the generated
  `../www/btoddb-ha-reminders.js` bundle (or its `.map`).
- `src/index.ts` is the entry: console banner + `customCards` registration. Its first
  `vX.Y.Z` string is the version `scripts/deploy.sh` bumps — don't edit it by hand.
- Build + deploy with `scripts/deploy.sh` from the repo root: it `npm install`s, bumps
  the patch version in `package.json` (and syncs the banner), runs `npm run build`
  (esbuild → `btoddb-ha-reminders.js` + `.map`), and copies the bundle into `../www/`.
- The integration serves `../www/` at `/btoddb-ha-reminders/` and auto-registers the
  module (`add_extra_js_url`), so after a deploy just **hard-refresh** the browser —
  no Lovelace resource to add, no HA restart.

## Versioning

`package.json` (`X.Y.Z`, plain) is bumped **only** by `scripts/deploy.sh`. This is
independent of the integration's `manifest.json` version.
