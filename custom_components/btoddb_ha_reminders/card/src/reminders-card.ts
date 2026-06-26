// The `btoddb-reminders-card` Lovelace card.
//
// Two jobs, using stock Home Assistant web components (ha-card, ha-icon-button,
// ha-icon, mwc-button) where they're reliably loaded, and native inputs for the
// add row so the message and datetime fields always render:
//   1. Type a new reminder (message + datetime) and call `btoddb_ha_reminders.create`.
//   2. List upcoming reminders, read from the `calendar.btoddb_reminders` entity, with a
//      per-row delete button (calendar/event/delete).
//
// The list is fetched from the calendar REST API and refreshed whenever the
// calendar entity changes (add / fire / delete) and once a minute (so relative
// times stay fresh and fired reminders drop off).

import { LitElement, css, html, nothing } from "lit";

interface HassEntity {
  state: string;
  last_updated: string;
  attributes: Record<string, unknown>;
}

interface Hass {
  states: Record<string, HassEntity>;
  callApi: <T>(method: string, path: string) => Promise<T>;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: unknown,
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ) => Promise<unknown>;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
}

interface CardConfig {
  type: string;
  entity?: string;
  title?: string;
}

interface CalendarEvent {
  uid?: string;
  summary: string;
  start: { dateTime?: string; date?: string };
}

interface TimeItem {
  kind: "time";
  uid: string;
  summary: string;
  start: Date;
}

interface LocationItem {
  kind: "location";
  uid: string;
  summary: string;
  person: string;
  zone: string;
  trigger: string;
  deliveredAt: Date | null;
}

interface LocationAttr {
  uid: string;
  summary: string;
  person: string;
  zone: string;
  trigger: string;
  delivered_at: string | null;
}

const DEFAULT_ENTITY = "calendar.btoddb_reminders";
// Default entity_id of the location-reminders sensor. Used as a fallback only — the
// sensor is normally found by its marker attribute so a registry rename can't hide it.
const LOCATION_SENSOR_DEFAULT = "sensor.btoddb_location_reminders";
// Attribute the integration stamps on its location sensor for discovery.
const LOCATION_SENSOR_MARKER = "btoddb_ha_reminders_location";

const pad = (n: number): string => String(n).padStart(2, "0");

/** Format a Date as the local value an `<input type="datetime-local">` expects. */
function toLocalInput(d: Date): string {
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** Default the time picker to the next whole hour. */
function defaultWhen(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return toLocalInput(d);
}

export class BtoddbRemindersCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass!: Hass;
  private _config: CardConfig = { type: "" };

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  private _titleChanged(ev: Event): void {
    const value = (ev.target as HTMLInputElement).value;
    this._fireConfigChanged({ ...this._config, title: value });
  }

  private _entityChanged(ev: CustomEvent): void {
    const value = ev.detail.value as string;
    this._fireConfigChanged({ ...this._config, entity: value });
  }

  private _fireConfigChanged(config: CardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <input
          class="title-field"
          type="text"
          placeholder="Title (optional)"
          .value=${this._config.title ?? ""}
          @change=${this._titleChanged}
        />
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity ?? ""}
          .label=${"Calendar entity"}
          .includeDomains=${["calendar"]}
          @value-changed=${this._entityChanged}
        ></ha-entity-picker>
      </div>
    `;
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .title-field,
    ha-entity-picker {
      width: 100%;
    }
    .title-field {
      height: 40px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
  `;
}

customElements.define("btoddb-reminders-card-editor", BtoddbRemindersCardEditor);

export class BtoddbRemindersCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _items: { state: true },
    _mode: { state: true },
    _message: { state: true },
    _when: { state: true },
    _locMessage: { state: true },
    _locPerson: { state: true },
    _locZone: { state: true },
    _locTrigger: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _editingUid: { state: true },
  };

  hass!: Hass;
  private _config: CardConfig = { type: "" };
  private _items: TimeItem[] = [];
  private _mode: "time" | "location" = "time";
  private _message = "";
  private _when = defaultWhen();
  private _locMessage = "";
  private _locPerson = "";
  private _locZone = "";
  private _locTrigger = "enter";
  private _busy = false;
  private _error = "";
  private _editingUid = "";

  private _entity = DEFAULT_ENTITY;
  private _lastSignature = "";
  private _refreshTimer?: number;

  static getConfigElement() {
    return document.createElement("btoddb-reminders-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config: CardConfig): void {
    this._config = config ?? { type: "" };
    this._entity = config?.entity ?? "";
  }

  getCardSize(): number {
    const locCount = this._locationItems().length;
    return 3 + Math.min(this._items.length + locCount, 8);
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Keep relative times fresh and let fired reminders fall off the list.
    this._refreshTimer = window.setInterval(() => this._fetch(), 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._refreshTimer) window.clearInterval(this._refreshTimer);
  }

  protected updated(changed: Map<string, unknown>): void {
    if (!changed.has("hass") || !this.hass) return;
    // Refetch only when the calendar entity actually changes, not on every global
    // hass update — `last_updated` advances on add / fire / delete.
    const st = this.hass.states[this._entity];
    const sig = st ? `${st.state}|${st.last_updated}` : "missing";
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      this._fetch();
    }
  }

  private async _fetch(): Promise<void> {
    if (!this.hass) return;
    if (!this._entity) {
      this._error = "No calendar entity configured. Edit the card to select one.";
      this._items = [];
      return;
    }
    if (!this.hass.states[this._entity]) {
      this._error = `Entity ${this._entity} not found. Is the Reminders integration set up?`;
      this._items = [];
      return;
    }
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    try {
      const events = await this.hass.callApi<CalendarEvent[]>(
        "GET",
        `calendars/${this._entity}` +
        `?start=${encodeURIComponent(start.toISOString())}` +
        `&end=${encodeURIComponent(end.toISOString())}`,
      );
      const cutoff = Date.now() - 60_000;
      this._items = (events ?? [])
        .map(
          (e): TimeItem => ({
            kind: "time",
            uid: e.uid ?? "",
            summary: e.summary,
            start: new Date(e.start.dateTime ?? e.start.date ?? ""),
          }),
        )
        .filter((i) => i.start.getTime() >= cutoff)
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      this._error = "";
    } catch (err) {
      this._error = `Could not load reminders: ${this._msg(err)}`;
    }
  }

  private async _add(): Promise<void> {
    const message = this._message.trim();
    if (!message) {
      this._error = "Enter a reminder message.";
      return;
    }
    if (!this._when) {
      this._error = "Pick a date and time.";
      return;
    }
    const editingUid = this._editingUid;
    this._busy = true;
    this._error = "";
    try {
      if (editingUid) {
        await this.hass.callService(
          "btoddb_ha_reminders",
          "update",
          { uid: editingUid, message, when: this._when },
          undefined,
          undefined,
          true,
        );
        this._editingUid = "";
      } else {
        // `btoddb_ha_reminders.create` is a response-only service, so returnResponse must be true.
        await this.hass.callService(
          "btoddb_ha_reminders",
          "create",
          { message, when: this._when },
          undefined,
          undefined,
          true,
        );
      }
      this._message = "";
      this._when = defaultWhen();
      await this._fetch();
    } catch (err) {
      this._error = `Could not ${editingUid ? "update" : "create"} reminder: ${this._msg(err)}`;
    } finally {
      this._busy = false;
    }
  }

  private async _delete(uid: string): Promise<void> {
    if (!uid) return;
    try {
      await this.hass.callWS({
        type: "calendar/event/delete",
        entity_id: this._entity,
        uid,
      });
      this._items = this._items.filter((i) => i.uid !== uid);
    } catch (err) {
      this._error = `Could not delete reminder: ${this._msg(err)}`;
    }
  }

  private async _addLocation(): Promise<void> {
    const message = this._locMessage.trim();
    if (!message) {
      this._error = "Enter a reminder message.";
      return;
    }
    if (!this._locPerson) {
      this._error = "Pick a person to track.";
      return;
    }
    if (!this._locZone) {
      this._error = "Pick a zone.";
      return;
    }
    const editingUid = this._editingUid;
    this._busy = true;
    this._error = "";
    try {
      if (editingUid) {
        await this.hass.callService("btoddb_ha_reminders", "update_location", {
          uid: editingUid,
          message,
          person: this._locPerson,
          zone: this._locZone,
          trigger: this._locTrigger,
        });
        this._editingUid = "";
      } else {
        await this.hass.callService("btoddb_ha_reminders", "create_location", {
          message,
          person: this._locPerson,
          zone: this._locZone,
          trigger: this._locTrigger,
        });
      }
      this._locMessage = "";
      this._locPerson = "";
      this._locZone = "";
      this._locTrigger = "enter";
    } catch (err) {
      this._error = `Could not ${editingUid ? "update" : "create"} reminder: ${this._msg(err)}`;
    } finally {
      this._busy = false;
    }
  }

  private _startEditTime(item: TimeItem): void {
    this._editingUid = item.uid;
    this._mode = "time";
    this._message = item.summary;
    this._when = toLocalInput(item.start);
    this._error = "";
  }

  private _startEditLocation(item: LocationItem): void {
    this._editingUid = item.uid;
    this._mode = "location";
    this._locMessage = item.summary;
    this._locPerson = item.person;
    this._locZone = item.zone;
    this._locTrigger = item.trigger;
    this._error = "";
  }

  private _cancelEdit(): void {
    this._editingUid = "";
    this._message = "";
    this._when = defaultWhen();
    this._locMessage = "";
    this._locPerson = "";
    this._locZone = "";
    this._locTrigger = "enter";
    this._error = "";
  }

  private async _deleteLocation(uid: string): Promise<void> {
    if (!uid) return;
    try {
      await this.hass.callService("btoddb_ha_reminders", "delete_location", {
        uid,
      });
    } catch (err) {
      this._error = `Could not delete reminder: ${this._msg(err)}`;
    }
  }

  /**
   * Entity id of the location sensor, discovered by its marker attribute so a registry
   * rename doesn't hide it. Falls back to the default id if the marker isn't found yet
   * (e.g. before the entity has loaded).
   */
  private _locationSensorId(): string {
    const states = this.hass?.states ?? {};
    if (states[LOCATION_SENSOR_DEFAULT]?.attributes?.[LOCATION_SENSOR_MARKER]) {
      return LOCATION_SENSOR_DEFAULT;
    }
    for (const [id, st] of Object.entries(states)) {
      if (id.startsWith("sensor.") && st.attributes?.[LOCATION_SENSOR_MARKER]) {
        return id;
      }
    }
    return LOCATION_SENSOR_DEFAULT;
  }

  /** Location reminders read straight off the sensor's attributes (stays live). */
  private _locationItems(): LocationItem[] {
    const st = this.hass?.states[this._locationSensorId()];
    const raw = (st?.attributes?.reminders as LocationAttr[] | undefined) ?? [];
    return raw.map((r) => ({
      kind: "location",
      uid: r.uid,
      summary: r.summary,
      person: r.person,
      zone: r.zone,
      trigger: r.trigger,
      deliveredAt: r.delivered_at ? new Date(r.delivered_at) : null,
    }));
  }

  private _entityName(entityId: string): string {
    const st = this.hass?.states[entityId];
    return (st?.attributes?.friendly_name as string) ?? entityId;
  }

  private _msg(err: unknown): string {
    if (err && typeof err === "object" && "message" in err) {
      return String((err as { message: unknown }).message);
    }
    return String(err);
  }

  private _formatTime(d: Date): string {
    try {
      return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return d.toLocaleString();
    }
  }

  private _renderTimeAddRow() {
    const isEditing = !!this._editingUid;
    return html`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._message}
          @input=${(e: Event) => {
        this._message = (e.target as HTMLInputElement).value;
      }}
          @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Enter") this._add();
      }}
        />
        <input
          class="when"
          type="datetime-local"
          .value=${this._when}
          @input=${(e: Event) => {
        this._when = (e.target as HTMLInputElement).value;
      }}
        />
        ${isEditing
        ? html`<mwc-button ?disabled=${this._busy} @click=${() => this._cancelEdit()}>Cancel</mwc-button>`
        : nothing}
        <mwc-button raised ?disabled=${this._busy} @click=${() => this._add()}>
          ${isEditing ? "Save" : "Add"}
        </mwc-button>
      </div>
    `;
  }

  private _renderLocationAddRow() {
    const isEditing = !!this._editingUid;
    return html`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._locMessage}
          @input=${(e: Event) => {
        this._locMessage = (e.target as HTMLInputElement).value;
      }}
        />
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locPerson}
          .label=${"Person"}
          .includeDomains=${["person"]}
          @value-changed=${(e: CustomEvent) => {
        this._locPerson = e.detail.value as string;
      }}
        ></ha-entity-picker>
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locZone}
          .label=${"Zone"}
          .includeDomains=${["zone"]}
          @value-changed=${(e: CustomEvent) => {
        this._locZone = e.detail.value as string;
      }}
        ></ha-entity-picker>
        <select
          class="trigger"
          .value=${this._locTrigger}
          @change=${(e: Event) => {
        this._locTrigger = (e.target as HTMLSelectElement).value;
      }}
        >
          <option value="enter">Entering</option>
          <option value="leave">Leaving</option>
        </select>
        ${isEditing
        ? html`<mwc-button ?disabled=${this._busy} @click=${() => this._cancelEdit()}>Cancel</mwc-button>`
        : nothing}
        <mwc-button
          raised
          ?disabled=${this._busy}
          @click=${() => this._addLocation()}
        >
          ${isEditing ? "Save" : "Add"}
        </mwc-button>
      </div>
    `;
  }

  private _renderTimeItem(item: TimeItem) {
    return html`
      <div class="item">
        <ha-icon class="leading" icon="mdi:alarm"></ha-icon>
        <div class="text">
          <span class="summary">${item.summary}</span>
          <span class="time">${this._formatTime(item.start)}</span>
        </div>
        <ha-icon-button
          .label=${"Edit reminder"}
          @click=${() => this._startEditTime(item)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${() => this._delete(item.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private _renderLocationItem(item: LocationItem) {
    const verb = item.trigger === "enter" ? "Entering" : "Leaving";
    const where = `${verb} ${this._entityName(item.zone)} · ${this._entityName(
      item.person,
    )}`;
    const sub = item.deliveredAt
      ? `Delivered ${this._formatTime(item.deliveredAt)} · ${where}`
      : where;
    return html`
      <div class="item ${item.deliveredAt ? "delivered" : ""}">
        <ha-icon class="leading" icon="mdi:map-marker"></ha-icon>
        <div class="text">
          <span class="summary">${item.summary}</span>
          <span class="time">${sub}</span>
        </div>
        ${!item.deliveredAt
        ? html`<ha-icon-button
              .label=${"Edit reminder"}
              @click=${() => this._startEditLocation(item)}
            >
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </ha-icon-button>`
        : nothing}
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${() => this._deleteLocation(item.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  render() {
    const title = this._config.title ?? "BToddB Reminders";
    const locItems = this._locationItems();
    const locUndelivered = locItems.filter((i) => !i.deliveredAt);
    const locDelivered = locItems
      .filter((i) => i.deliveredAt)
      .sort((a, b) => b.deliveredAt!.getTime() - a.deliveredAt!.getTime());
    const total = this._items.length + locItems.length;
    return html`
      <ha-card .header=${title}>
        <div class="content">
          <div class="tabs">
            <button
              class="tab ${this._mode === "time" ? "active" : ""}"
              @click=${() => {
        if (this._mode !== "time") { this._cancelEdit(); this._mode = "time"; }
      }}
            >
              Time
            </button>
            <button
              class="tab ${this._mode === "location" ? "active" : ""}"
              @click=${() => {
        if (this._mode !== "location") { this._cancelEdit(); this._mode = "location"; }
      }}
            >
              Location
            </button>
          </div>

          ${this._mode === "time"
        ? this._renderTimeAddRow()
        : this._renderLocationAddRow()}

          ${this._error
        ? html`<div class="error">${this._error}</div>`
        : nothing}

          ${total === 0
        ? html`<div class="empty">No reminders.</div>`
        : html`
                <div class="list">
                  ${this._items.map((item) => this._renderTimeItem(item))}
                  ${locUndelivered.map((item) =>
          this._renderLocationItem(item),
        )}
                  ${locDelivered.map((item) =>
          this._renderLocationItem(item),
        )}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    .content {
      padding: 0 16px 12px;
    }
    .tabs {
      display: flex;
      gap: 8px;
      padding-top: 8px;
    }
    .tab {
      flex: 0 0 auto;
      height: 32px;
      padding: 0 14px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color, #727272);
      font-family: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .tab.active {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      flex-wrap: wrap;
    }
    .message,
    .when,
    .trigger {
      height: 40px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
    .message {
      flex: 1 1 160px;
      min-width: 140px;
    }
    .when,
    .trigger {
      flex: 0 0 auto;
    }
    .picker {
      flex: 1 1 140px;
      min-width: 130px;
    }
    .error {
      color: var(--error-color, #db4437);
      padding: 8px 0;
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color, #727272);
      padding: 16px 0 4px;
      text-align: center;
    }
    .list {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .item:first-child {
      border-top: none;
    }
    .leading {
      color: var(--state-icon-color, var(--primary-color, #03a9f4));
      flex: 0 0 auto;
    }
    .text {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0;
    }
    .summary {
      color: var(--primary-text-color, #212121);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item.delivered .summary {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
    }
    .item.delivered .leading {
      color: var(--secondary-text-color, #727272);
    }
    .time {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
    }
    ha-icon-button {
      color: var(--secondary-text-color, #727272);
      flex: 0 0 auto;
    }
  `;
}

if (!customElements.get("btoddb-reminders-card")) {
  customElements.define("btoddb-reminders-card", BtoddbRemindersCard);
}

declare global {
  interface HTMLElementTagNameMap {
    "btoddb-reminders-card": BtoddbRemindersCard;
    "btoddb-reminders-card-editor": BtoddbRemindersCardEditor;
  }
}
