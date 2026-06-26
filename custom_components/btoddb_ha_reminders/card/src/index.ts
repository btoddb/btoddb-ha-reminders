// Entry point for the btoddb-ha-reminders Lovelace card bundle.
//
// The integration serves this bundle and auto-registers it as a Lovelace
// resource, so loading it just needs a browser hard-refresh — no manual resource
// to add.
//
// The version string below is bumped automatically by scripts/deploy.sh (it greps
// for the first `vX.Y.Z`), so you can confirm in the console which build loaded.

import "./reminders-card";

const VERSION = "v0.0.31";

console.info(
  `%c BTODDB-HA-REMINDERS %c ${VERSION} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);

// Advertise the card in the dashboard "Add card" picker.
window.customCards = window.customCards || [];
window.customCards.push({
  type: "btoddb-reminders-card",
  name: "BToddB Reminders",
  description: "Create reminders and see the upcoming ones.",
  preview: false,
  documentationURL: "https://github.com/btoddb/btoddb-ha-reminders",
});

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
