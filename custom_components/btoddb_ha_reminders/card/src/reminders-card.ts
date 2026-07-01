// The `btoddb-reminders-card` Lovelace card.
//
// Two jobs, using stock Home Assistant web components (ha-card, ha-icon-button,
// ha-icon) where they're reliably loaded, and native inputs and buttons for the
// add row so the message, datetime, and action elements always render:
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
  description?: string;
}

interface TimeItem {
  kind: "time";
  uid: string;
  summary: string;
  start: Date;
  rrule: string;
}

interface LocationItem {
  kind: "location";
  uid: string;
  summary: string;
  person: string;
  zone: string;
  trigger: string;
  persistent: boolean;
  deliveredAt: Date | null;
}

interface LocationAttr {
  uid: string;
  summary: string;
  person: string;
  zone: string;
  trigger: string;
  persistent: boolean;
  delivered_at: string | null;
}

const DEFAULT_ENTITY = "calendar.btoddb_reminders";
const REMINDERS_CHANGED_EVENT = "btoddb-ha-reminders-reminders-changed";
// Default entity_id of the location-reminders sensor. Used as a fallback only — the
// sensor is normally found by its marker attribute so a registry rename can't hide it.
const LOCATION_SENSOR_DEFAULT = "sensor.btoddb_location_reminders";
// Attribute the integration stamps on its location sensor for discovery.
const LOCATION_SENSOR_MARKER = "btoddb_ha_reminders_location";

// Weekday chip order: Sun Mon Tue Wed Thu Fri Sat
const WEEKDAY_CHIPS: { code: string; label: string }[] = [
  { code: "SU", label: "S" },
  { code: "MO", label: "M" },
  { code: "TU", label: "T" },
  { code: "WE", label: "W" },
  { code: "TH", label: "T" },
  { code: "FR", label: "F" },
  { code: "SA", label: "S" },
];

// Full day names for the BYDAY codes.
const BYDAY_FULL: Record<string, string> = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
  SU: "Sunday",
};

// JS getDay() returns 0=Sun,1=Mon,...,6=Sat; map BYDAY code → JS day index.
const BYDAY_JS_DAY: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

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
    _repeatOpen: { state: true },
    _freq: { state: true },
    _weekday: { state: true },
    _interval: { state: true },
    _monthMode: { state: true },
    _monthDay: { state: true },
    _monthOrdinal: { state: true },
    _monthWeekday: { state: true },
    _locMessage: { state: true },
    _locPerson: { state: true },
    _locZone: { state: true },
    _locTrigger: { state: true },
    _locPersistent: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _editingUid: { state: true },
    _timeCollapsed: { state: true },
    _locationCollapsed: { state: true },
  };

  hass!: Hass;
  private _config: CardConfig = { type: "" };
  private _items: TimeItem[] = [];
  private _mode: "time" | "location" = "time";
  private _message = "";
  private _when = defaultWhen();
  private _repeatOpen = false;
  private _freq: "daily" | "weekly" | "monthly" = "daily";
  private _weekday = "MO";
  private _interval = 1;
  private _monthMode: "day" | "weekday" = "day";
  private _monthDay = 1;
  private _monthOrdinal = "1";
  private _monthWeekday = "MO";
  private _locMessage = "";
  private _locPerson = "";
  private _locZone = "";
  private _locTrigger = "enter";
  private _locPersistent = false;
  private _busy = false;
  private _error = "";
  private _editingUid = "";
  private _timeCollapsed = false;
  private _locationCollapsed = false;

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
    const timeSize = this._items.length ? (this._timeCollapsed ? 1 : this._items.length) : 0;
    const locSize = locCount ? (this._locationCollapsed ? 1 : locCount) : 0;
    return 3 + Math.min(timeSize + locSize, 8);
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
      const seenUids = new Set<string>();
      this._items = (events ?? [])
        .map(
          (e): TimeItem => ({
            kind: "time",
            uid: e.uid ?? "",
            summary: e.summary,
            start: new Date(e.start.dateTime ?? e.start.date ?? ""),
            // The integration sets CalendarEvent.description = rrule so the card
            // can display the recurrence badge without HA expanding the event.
            rrule: e.description ?? "",
          }),
        )
        .filter((i) => i.start.getTime() >= cutoff || i.rrule !== "")
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .filter((i) => {
          // For recurring series the calendar API returns one entry per occurrence;
          // keep only the earliest (already sorted above) so the card shows one row
          // per series rather than 52/365 identical rows.
          if (!i.rrule) return true;
          if (seenUids.has(i.uid)) return false;
          seenUids.add(i.uid);
          return true;
        });
      this._error = "";
    } catch (err) {
      this._error = `Could not load reminders: ${this._msg(err)}`;
    }
  }

  /** Build the RRULE string from current UI state; "" when repeat is off. */
  private _buildRrule(): string {
    if (!this._repeatOpen) return "";
    const suffix = this._interval > 1 ? `;INTERVAL=${this._interval}` : "";
    if (this._freq === "daily") return `FREQ=DAILY${suffix}`;
    if (this._freq === "weekly") return `FREQ=WEEKLY;BYDAY=${this._weekday}${suffix}`;
    // monthly
    if (this._monthMode === "weekday") {
      return `FREQ=MONTHLY;BYDAY=${this._monthOrdinal}${this._monthWeekday}${suffix}`;
    }
    const bmd = this._monthDay === -1 ? "-1" : String(this._monthDay);
    return `FREQ=MONTHLY;BYMONTHDAY=${bmd}${suffix}`;
  }

  /** Set `when` to the nth ordinal weekday within its month. */
  private _adjustToMonthWeekday(when: string, ordinal: string, weekday: string): string {
    const d = new Date(when);
    const targetDow = BYDAY_JS_DAY[weekday] ?? 1;
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let day = 1;
    if (ordinal === "-1") {
      for (let i = lastDay; i >= 1; i--) {
        if (new Date(d.getFullYear(), d.getMonth(), i).getDay() === targetDow) {
          day = i;
          break;
        }
      }
    } else {
      const n = parseInt(ordinal, 10);
      let count = 0;
      for (let i = 1; i <= lastDay; i++) {
        if (new Date(d.getFullYear(), d.getMonth(), i).getDay() === targetDow) {
          if (++count === n) { day = i; break; }
        }
      }
    }
    d.setDate(day);
    return toLocalInput(d);
  }

  /** Set `when` to the given day-of-month (-1 = last day), clamped to month length. */
  private _adjustToMonthDay(when: string, day: number): string {
    const d = new Date(when);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(day === -1 ? lastDay : Math.min(day, lastDay));
    return toLocalInput(d);
  }

  /**
   * Advance `when` (datetime-local string) to the nearest date whose JS day
   * index matches `byday`.  Keeps the same time-of-day.
   */
  private _adjustToWeekday(when: string, byday: string): string {
    const target = BYDAY_JS_DAY[byday] ?? 1;
    const d = new Date(when);
    const current = d.getDay();
    const diff = (target - current + 7) % 7;
    d.setDate(d.getDate() + diff);
    return toLocalInput(d);
  }

  private _notifyTimeRemindersChanged(): void {
    window.dispatchEvent(
      new CustomEvent(REMINDERS_CHANGED_EVENT, {
        detail: { entity: this._entity },
      }),
    );
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
    const rrule = this._buildRrule();
    // Shift the anchor date to match the recurrence rule so the backend's
    // BYDAY-vs-start / BYMONTHDAY-vs-start validation always passes.
    let when = this._when;
    if (rrule && this._freq === "weekly") {
      when = this._adjustToWeekday(when, this._weekday);
    } else if (rrule && this._freq === "monthly") {
      if (this._monthMode === "weekday") {
        when = this._adjustToMonthWeekday(when, this._monthOrdinal, this._monthWeekday);
      } else {
        when = this._adjustToMonthDay(when, this._monthDay);
      }
    }
    const serviceData: Record<string, unknown> = { message, when };
    if (rrule) serviceData.rrule = rrule;
    // When editing and repeat has been turned off, explicitly clear the rrule.
    if (editingUid && !rrule) serviceData.rrule = null;

    this._busy = true;
    this._error = "";
    try {
      if (editingUid) {
        await this.hass.callService(
          "btoddb_ha_reminders",
          "update",
          { uid: editingUid, ...serviceData },
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
          serviceData,
          undefined,
          undefined,
          true,
        );
      }
      this._message = "";
      this._when = defaultWhen();
      this._repeatOpen = false;
      this._freq = "daily";
      this._weekday = "MO";
      this._interval = 1;
      this._monthMode = "day";
      this._monthDay = 1;
      this._monthOrdinal = "1";
      this._monthWeekday = "MO";
      if (!editingUid) this._timeCollapsed = false;
      await this._fetch();
      this._notifyTimeRemindersChanged();
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
      this._notifyTimeRemindersChanged();
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
          persistent: this._locPersistent,
        });
        this._editingUid = "";
      } else {
        await this.hass.callService("btoddb_ha_reminders", "create_location", {
          message,
          person: this._locPerson,
          zone: this._locZone,
          trigger: this._locTrigger,
          persistent: this._locPersistent,
        });
      }
      this._locMessage = "";
      this._locPerson = "";
      this._locZone = "";
      this._locTrigger = "enter";
      this._locPersistent = false;
      if (!editingUid) this._locationCollapsed = false;
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
    if (item.rrule) {
      this._repeatOpen = true;
      const upper = item.rrule.toUpperCase();
      const intervalMatch = upper.match(/INTERVAL=(\d+)/);
      this._interval = intervalMatch ? parseInt(intervalMatch[1], 10) : 1;
      if (upper.includes("FREQ=WEEKLY")) {
        this._freq = "weekly";
        const match = upper.match(/BYDAY=(\w+)/);
        this._weekday = match ? match[1] : "MO";
        this._monthMode = "day";
        this._monthDay = 1;
        this._monthOrdinal = "1";
        this._monthWeekday = "MO";
      } else if (upper.includes("FREQ=MONTHLY")) {
        this._freq = "monthly";
        const bydayMatch = upper.match(/BYDAY=(-?[1-4])(MO|TU|WE|TH|FR|SA|SU)/);
        if (bydayMatch) {
          this._monthMode = "weekday";
          this._monthOrdinal = bydayMatch[1];
          this._monthWeekday = bydayMatch[2];
          this._monthDay = 1;
        } else {
          this._monthMode = "day";
          const bymdMatch = upper.match(/BYMONTHDAY=(-?\d+)/);
          this._monthDay = bymdMatch ? parseInt(bymdMatch[1], 10) : item.start.getDate();
          this._monthOrdinal = "1";
          this._monthWeekday = "MO";
        }
        this._weekday = "MO";
      } else {
        this._freq = "daily";
        this._weekday = "MO";
        this._monthMode = "day";
        this._monthDay = 1;
        this._monthOrdinal = "1";
        this._monthWeekday = "MO";
      }
    } else {
      this._repeatOpen = false;
      this._freq = "daily";
      this._weekday = "MO";
      this._interval = 1;
      this._monthMode = "day";
      this._monthDay = 1;
      this._monthOrdinal = "1";
      this._monthWeekday = "MO";
    }
    this._error = "";
  }

  private _startEditLocation(item: LocationItem): void {
    this._editingUid = item.uid;
    this._mode = "location";
    this._locMessage = item.summary;
    this._locPerson = item.person;
    this._locZone = item.zone;
    this._locTrigger = item.trigger;
    this._locPersistent = item.persistent;
    this._error = "";
  }

  private _cancelEdit(): void {
    this._editingUid = "";
    this._message = "";
    this._when = defaultWhen();
    this._repeatOpen = false;
    this._freq = "daily";
    this._weekday = "MO";
    this._interval = 1;
    this._monthMode = "day";
    this._monthDay = 1;
    this._monthOrdinal = "1";
    this._monthWeekday = "MO";
    this._locMessage = "";
    this._locPerson = "";
    this._locZone = "";
    this._locTrigger = "enter";
    this._locPersistent = false;
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
      persistent: r.persistent ?? false,
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

  private _formatTimeOnly(d: Date): string {
    try {
      return d.toLocaleString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return d.toLocaleString();
    }
  }

  private _dayKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  private _formatDayHeader(d: Date): string {
    const today = new Date();
    if (this._dayKey(d) === this._dayKey(today)) return "Today";
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (this._dayKey(d) === this._dayKey(tomorrow)) return "Tomorrow";
    try {
      return d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d.toLocaleDateString();
    }
  }

  private _renderDayHeader(d: Date) {
    return html`<div class="day-header">${this._formatDayHeader(d)}</div>`;
  }

  /** "Every" / "Every other" / "Every 3rd" cadence prefix from an RRULE INTERVAL. */
  private _intervalPrefix(upper: string): string {
    const match = upper.match(/INTERVAL=(\d+)/);
    const n = match ? parseInt(match[1], 10) : 1;
    if (n <= 1) return "Every";
    if (n === 2) return "Every other";
    const suffix =
      n % 100 >= 11 && n % 100 <= 13
        ? "th"
        : { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
    return `Every ${n}${suffix}`;
  }

  /** Human-readable recurrence string, e.g. "Every other day at 9:45 AM". */
  private _formatRecurrence(rrule: string, start: Date): string {
    const time = start.toLocaleString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    const upper = rrule.toUpperCase();
    const prefix = this._intervalPrefix(upper);
    if (upper.includes("FREQ=DAILY")) return `${prefix} day at ${time}`;
    if (upper.includes("FREQ=WEEKLY")) {
      const match = upper.match(/BYDAY=(\w+)/);
      if (match) {
        const dayName = BYDAY_FULL[match[1]] ?? match[1];
        return `${prefix} ${dayName} at ${time}`;
      }
      return `${prefix === "Every" ? "Weekly" : `${prefix} week`} at ${time}`;
    }
    if (upper.includes("FREQ=MONTHLY")) {
      const bydayMatch = upper.match(/BYDAY=(-1|[1-4])(MO|TU|WE|TH|FR|SA|SU)/);
      if (bydayMatch) {
        const ordWords: Record<string, string> = {
          "1": "first", "2": "second", "3": "third", "4": "fourth", "-1": "last",
        };
        const ordWord = ordWords[bydayMatch[1]] ?? bydayMatch[1];
        const dayName = BYDAY_FULL[bydayMatch[2]] ?? bydayMatch[2];
        return `${prefix} month on the ${ordWord} ${dayName} at ${time}`;
      }
      const bymdMatch = upper.match(/BYMONTHDAY=(-?\d+)/);
      if (bymdMatch && bymdMatch[1] === "-1") {
        return `${prefix} month on the last day at ${time}`;
      }
      const day = bymdMatch ? parseInt(bymdMatch[1], 10) : start.getDate();
      const daySuffix =
        day % 100 >= 11 && day % 100 <= 13
          ? "th"
          : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ?? "th";
      return `${prefix} month on the ${day}${daySuffix} at ${time}`;
    }
    return rrule;
  }

  private _renderSwitch(checked: boolean, onChange: (val: boolean) => void) {
    return html`
      <label class="repeat-switch">
        <input
          type="checkbox"
          role="switch"
          .checked=${checked}
          @change=${(e: Event) =>
            onChange((e.target as HTMLInputElement).checked)}
        />
        <span class="repeat-switch-track"
          ><span class="repeat-switch-thumb"></span
        ></span>
        <span class="repeat-switch-label">Repeat</span>
      </label>
    `;
  }

  private _renderRepeatDisclosure() {
    return html`
      <div class="repeat-row">
        ${this._renderSwitch(this._repeatOpen, (v) => {
          this._repeatOpen = v;
        })}
        ${this._repeatOpen
          ? html`
              <div class="repeat-body">
                <select
                  class="freq-select"
                  .value=${this._freq}
                  @change=${(e: Event) => {
                    this._freq = (e.target as HTMLSelectElement)
                      .value as "daily" | "weekly" | "monthly";
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <span class="interval-label">every</span>
                <input
                  class="interval-input"
                  type="number"
                  min="1"
                  .value=${String(this._interval)}
                  @input=${(e: Event) => {
                    const n = parseInt((e.target as HTMLInputElement).value, 10);
                    this._interval = Number.isFinite(n) && n >= 1 ? n : 1;
                  }}
                />
                <span class="interval-label"
                  >${this._freq === "daily"
                    ? "day(s)"
                    : this._freq === "weekly"
                      ? "week(s)"
                      : "month(s)"}</span
                >
                ${this._freq === "weekly"
                  ? html`
                      <div class="weekday-chips">
                        ${WEEKDAY_CHIPS.map(
                          ({ code, label }) => html`
                            <button
                              type="button"
                              class="chip ${this._weekday === code
                                ? "selected"
                                : ""}"
                              title=${BYDAY_FULL[code] ?? code}
                              @click=${() => {
                                this._weekday = code;
                              }}
                            >
                              ${label}
                            </button>
                          `,
                        )}
                      </div>
                    `
                  : nothing}
                ${this._freq === "monthly"
                  ? html`
                      <div class="month-opts">
                        <select
                          class="month-mode-select"
                          .value=${this._monthMode}
                          @change=${(e: Event) => {
                            this._monthMode = (e.target as HTMLSelectElement)
                              .value as "day" | "weekday";
                          }}
                        >
                          <option value="day">Day of month</option>
                          <option value="weekday">Day of week</option>
                        </select>
                        ${this._monthMode === "day"
                          ? html`
                              <select
                                class="month-day-select"
                                .value=${String(this._monthDay)}
                                @change=${(e: Event) => {
                                  this._monthDay = parseInt(
                                    (e.target as HTMLSelectElement).value,
                                    10,
                                  );
                                }}
                              >
                                ${Array.from({ length: 28 }, (_, i) => i + 1).map(
                                  (n) => html`<option
                                    value=${n}
                                    ?selected=${this._monthDay === n}
                                  >
                                    ${n}
                                  </option>`,
                                )}
                                <option value="-1" ?selected=${this._monthDay === -1}>
                                  Last day
                                </option>
                              </select>
                            `
                          : html`
                              <select
                                class="month-ordinal-select"
                                .value=${this._monthOrdinal}
                                @change=${(e: Event) => {
                                  this._monthOrdinal = (
                                    e.target as HTMLSelectElement
                                  ).value;
                                }}
                              >
                                <option value="1">First</option>
                                <option value="2">Second</option>
                                <option value="3">Third</option>
                                <option value="4">Fourth</option>
                                <option value="-1">Last</option>
                              </select>
                              <div class="weekday-chips">
                                ${WEEKDAY_CHIPS.map(
                                  ({ code, label }) => html`
                                    <button
                                      type="button"
                                      class="chip ${this._monthWeekday === code
                                        ? "selected"
                                        : ""}"
                                      title=${BYDAY_FULL[code] ?? code}
                                      @click=${() => {
                                        this._monthWeekday = code;
                                      }}
                                    >
                                      ${label}
                                    </button>
                                  `,
                                )}
                              </div>
                            `}
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderTimeAddRow() {
    const isEditing = !!this._editingUid;
    return html`
      <div>
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
            ? html`<button
                type="button"
                class="btn btn-secondary"
                ?disabled=${this._busy}
                @click=${() => this._cancelEdit()}
              >
                Cancel
              </button>`
            : nothing}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${() => this._add()}
          >
            ${isEditing ? "Save" : "Add"}
          </button>
        </div>
        ${this._renderRepeatDisclosure()}
      </div>
    `;
  }

  private _renderLocationAddRow() {
    const isEditing = !!this._editingUid;
    return html`
      <div>
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
          ? html`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${() => this._cancelEdit()}>Cancel</button>`
          : nothing}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${() => this._addLocation()}
          >
            ${isEditing ? "Save" : "Add"}
          </button>
        </div>
        <div class="repeat-row">
          ${this._renderSwitch(this._locPersistent, (v) => {
            this._locPersistent = v;
          })}
        </div>
      </div>
    `;
  }

  private _renderTimeRows() {
    const rows = [];
    let lastKey = "";
    for (const item of this._items) {
      const key = this._dayKey(item.start);
      const dayFirst = key !== lastKey;
      if (dayFirst) {
        rows.push(this._renderDayHeader(item.start));
        lastKey = key;
      }
      rows.push(this._renderTimeItem(item, dayFirst));
    }
    return rows;
  }

  private _renderTimeItem(item: TimeItem, dayFirst = false) {
    const isRecurring = !!item.rrule;
    const sub = isRecurring
      ? this._formatRecurrence(item.rrule, item.start)
      : this._formatTimeOnly(item.start);
    return html`
      <div class="item ${isRecurring ? "recurring" : ""} ${dayFirst ? "day-first" : ""}">
        <ha-icon
          class="leading"
          icon=${isRecurring ? "mdi:repeat" : "mdi:alarm"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${item.summary}</span>
          <span class="time">${sub}</span>
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

  /** Bold, labeled heading for reminder groups; clicking toggles collapse. */
  private _renderSectionHeading(
    label: string,
    icon: string,
    count: number,
    collapsed: boolean,
    onToggle: () => void,
    controlsId: string,
  ) {
    return html`
      <button
        class="section-heading"
        aria-expanded=${collapsed ? "false" : "true"}
        aria-controls=${controlsId}
        @click=${onToggle}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span class="section-heading-label">${label}</span>
        <span class="section-heading-count">${count}</span>
        <ha-icon
          class="section-heading-chevron ${collapsed ? "collapsed" : ""}"
          icon="mdi:chevron-down"
        ></ha-icon>
      </button>
    `;
  }

  private _renderLocationItem(item: LocationItem, sectionFirst = false) {
    const verb = item.trigger === "enter" ? "Entering" : "Leaving";
    const where = `${verb} ${this._entityName(item.zone)} · ${this._entityName(
      item.person,
    )}`;
    const sub = item.deliveredAt
      ? `Delivered ${this._formatTime(item.deliveredAt)} · ${where}`
      : item.persistent
      ? `Repeating · ${where}`
      : where;
    const isPersistentActive = item.persistent && !item.deliveredAt;
    return html`
      <div class="item ${isPersistentActive ? "persistent" : ""} ${item.deliveredAt ? "delivered" : ""} ${sectionFirst ? "section-first" : ""}">
        <ha-icon class="leading" icon=${isPersistentActive ? "mdi:map-marker-path" : "mdi:map-marker"}></ha-icon>
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
          <div class="entry-panel">
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
          </div>

          ${this._error
        ? html`<div class="error">${this._error}</div>`
        : nothing}

          ${total === 0
        ? html`<div class="empty">No reminders.</div>`
        : html`
                <div class="list">
                  ${this._items.length
          ? this._renderSectionHeading("Time", "mdi:alarm", this._items.length, this._timeCollapsed, () => { this._timeCollapsed = !this._timeCollapsed; }, "section-rows-time")
          : nothing}
                  <div id="section-rows-time">${this._timeCollapsed ? nothing : this._renderTimeRows()}</div>
                  ${locItems.length
          ? this._renderSectionHeading("Location", "mdi:map-marker", locItems.length, this._locationCollapsed, () => { this._locationCollapsed = !this._locationCollapsed; }, "section-rows-location")
          : nothing}
                  <div id="section-rows-location">${this._locationCollapsed ? nothing : [...locUndelivered, ...locDelivered].map((item, i) =>
          this._renderLocationItem(item, this._items.length > 0 && i === 0),
        )}</div>
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
    .entry-panel {
      margin-top: 12px;
      padding: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 4%,
        transparent
      );
    }
    .tabs {
      display: flex;
      gap: 8px;
    }
    .entry-panel .add-row {
      padding-top: 12px;
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
    .btn {
      flex: 0 0 auto;
      height: 36px;
      padding: 0 16px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.025em;
      cursor: pointer;
      transition: box-shadow 0.15s, background 0.15s;
    }
    .btn:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
    .btn-primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
    }
    .btn-secondary {
      background: transparent;
      color: var(--primary-color, #03a9f4);
      border: 1px solid var(--primary-color, #03a9f4);
    }
    .btn-secondary:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--primary-color, #03a9f4) 10%,
        transparent
      );
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
    .day-header {
      color: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 8px 0 2px;
      margin-top: 4px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .section-heading + .day-header {
      border-top: none;
    }
    .item.day-first {
      border-top: none;
    }
    .item.section-first {
      border-top: none;
    }
    /* Filled, tinted banner for reminder groups; acts as a collapse toggle. */
    .section-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin: 14px 0 2px;
      padding: 9px 12px;
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-left: 4px solid var(--primary-color, #03a9f4);
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font-size: 12px;
      font-family: inherit;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      cursor: pointer;
      box-sizing: border-box;
    }
    .section-heading:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 20%, transparent);
    }
    .section-heading:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .list > .section-heading:first-child {
      margin-top: 0;
    }
    .section-heading ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary-color, #03a9f4);
    }
    .section-heading-label {
      flex: 1 1 auto;
    }
    .section-heading-count {
      font-weight: 400;
      font-size: 11px;
      opacity: 0.7;
      text-transform: none;
      letter-spacing: normal;
    }
    .section-heading-chevron {
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .section-heading-chevron.collapsed {
      transform: rotate(-90deg);
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
    .item.recurring .leading {
      color: var(--accent-color, var(--primary-color, #03a9f4));
    }
    .item.persistent .leading {
      color: var(--accent-color, var(--primary-color, #03a9f4));
    }
    .time {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
    }
    ha-icon-button {
      color: var(--secondary-text-color, #727272);
      flex: 0 0 auto;
    }
    /* Repeat toggle switch */
    .repeat-row {
      padding-top: 6px;
    }
    .repeat-switch {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
    }
    .repeat-switch input[type="checkbox"] {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .repeat-switch-track {
      position: relative;
      width: 36px;
      height: 20px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 10px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .repeat-switch input:checked ~ .repeat-switch-track {
      background: var(--primary-color, #03a9f4);
    }
    .repeat-switch-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    .repeat-switch input:checked ~ .repeat-switch-track .repeat-switch-thumb {
      transform: translateX(16px);
    }
    .repeat-switch input:focus-visible ~ .repeat-switch-track {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .repeat-switch-label {
      color: var(--secondary-text-color, #727272);
    }
    .repeat-switch:has(input:checked) .repeat-switch-label {
      color: var(--primary-color, #03a9f4);
    }
    .repeat-body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .freq-select {
      height: 36px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
    }
    .interval-input {
      width: 48px;
      height: 36px;
      padding: 0 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
    .interval-label {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
    }
    .weekday-chips {
      display: flex;
      gap: 4px;
    }
    .chip {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
    }
    .chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .chip:hover:not(.selected) {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .month-opts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }
    .month-mode-select,
    .month-day-select,
    .month-ordinal-select {
      height: 36px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
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
