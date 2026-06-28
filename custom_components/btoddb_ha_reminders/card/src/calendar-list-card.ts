// Read-only agenda/list Lovelace card for one or more Home Assistant calendars.
//
// It is intentionally separate from `btoddb-reminders-card`: this card is for
// viewing a merged agenda, while the reminders card owns create/edit/delete.

import { LitElement, css, html, nothing } from "lit";

interface HassEntity {
  state: string;
  last_updated: string;
  attributes: Record<string, unknown>;
}

interface Hass {
  states: Record<string, HassEntity>;
  callApi: <T>(method: string, path: string) => Promise<T>;
}

type HideEndTimeMode = "auto" | "always" | "never";
type ShowCalendarNameMode = "auto" | "always" | "never";

interface CalendarEntityConfig {
  entity: string;
  hide_end_time?: boolean | HideEndTimeMode;
}

type CalendarEntityInput = string | CalendarEntityConfig;

interface CalendarListCardConfig {
  type: string;
  title?: string;
  dashboard_path?: string;
  entities?: CalendarEntityInput[];
  days?: number;
  hide_end_time?: boolean | HideEndTimeMode;
  show_calendar_name?: boolean | ShowCalendarNameMode;
  max_items?: number;
}

interface CalendarEvent {
  uid?: string;
  summary?: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

interface CalendarEntry {
  uid: string;
  dedupeKey: string;
  summary: string;
  start: Date;
  end: Date | null;
  displayDate: Date;
  allDay: boolean;
  calendar: string;
  calendarName: string;
  hideEndTime?: HideEndTimeMode;
}

const DEFAULT_ENTITY = "calendar.btoddb_reminders";
const DEFAULT_DAYS = 14;
const DEFAULT_DASHBOARD_PATH = "/calendar?view=dayGridMonth";
const MAX_DAYS = 365;
const POINT_EVENT_MS = 60_000;
const REMINDERS_CHANGED_EVENT = "btoddb-ha-reminders-reminders-changed";

function clampInt(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function normalizeHideMode(value: unknown, fallback: HideEndTimeMode): HideEndTimeMode {
  if (value === true) return "always";
  if (value === false) return "never";
  if (value === "always" || value === "never" || value === "auto") return value;
  return fallback;
}

function normalizeShowMode(
  value: unknown,
  fallback: ShowCalendarNameMode,
): ShowCalendarNameMode {
  if (value === true) return "always";
  if (value === false) return "never";
  if (value === "always" || value === "never" || value === "auto") return value;
  return fallback;
}

function normalizeDashboardPath(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_DASHBOARD_PATH;
  const trimmed = value.trim();
  return trimmed || DEFAULT_DASHBOARD_PATH;
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseCalendarDate(
  value: { dateTime?: string; date?: string } | undefined,
): Date | null {
  if (!value) return null;
  if (value.dateTime) {
    const parsed = new Date(value.dateTime);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value.date) return parseLocalDate(value.date);
  return null;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function startOfLocalDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function nextDay(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + 1);
  return copy;
}

function previousDay(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - 1);
  return copy;
}

function maxDate(a: Date, b: Date): Date {
  return a.getTime() > b.getTime() ? a : b;
}

function minDate(a: Date, b: Date): Date {
  return a.getTime() < b.getTime() ? a : b;
}

function lastOverlappingDate(start: Date, end: Date | null): Date {
  if (!end || end.getTime() <= start.getTime()) return start;
  return new Date(end.getTime() - 1);
}

function dedupeEntries(entries: CalendarEntry[]): CalendarEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.dedupeKey}|${dayKey(entry.displayDate)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export class BtoddbCalendarListCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass!: Hass;
  private _config: CalendarListCardConfig = { type: "" };

  setConfig(config: CalendarListCardConfig): void {
    this._config = config ?? { type: "" };
  }

  private _entities(): string[] {
    const raw = this._config.entities;
    if (!raw) return [DEFAULT_ENTITY];
    return raw
      .map((entry) => (typeof entry === "string" ? entry : entry.entity))
      .filter((entity) => !!entity);
  }

  private _fireConfigChanged(config: CalendarListCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _titleChanged(ev: Event): void {
    const title = (ev.target as HTMLInputElement).value;
    this._fireConfigChanged({ ...this._config, title });
  }

  private _dashboardPathChanged(ev: Event): void {
    const dashboardPath = (ev.target as HTMLInputElement).value.trim();
    this._fireConfigChanged({
      ...this._config,
      dashboard_path: dashboardPath || undefined,
    });
  }

  private _daysChanged(ev: Event): void {
    const days = clampInt(
      (ev.target as HTMLInputElement).value,
      DEFAULT_DAYS,
      1,
      MAX_DAYS,
    );
    this._fireConfigChanged({ ...this._config, days });
  }

  private _maxItemsChanged(ev: Event): void {
    const maxItems = clampInt(
      (ev.target as HTMLInputElement).value,
      0,
      0,
      500,
    );
    this._fireConfigChanged({ ...this._config, max_items: maxItems });
  }

  private _hideEndTimeChanged(ev: Event): void {
    const hideEndTime = normalizeHideMode(
      (ev.target as HTMLSelectElement).value,
      "auto",
    );
    this._fireConfigChanged({ ...this._config, hide_end_time: hideEndTime });
  }

  private _showCalendarNameChanged(ev: Event): void {
    const showCalendarName = normalizeShowMode(
      (ev.target as HTMLSelectElement).value,
      "auto",
    );
    this._fireConfigChanged({
      ...this._config,
      show_calendar_name: showCalendarName,
    });
  }

  private _entityChanged(index: number, ev: CustomEvent): void {
    const value = (ev.detail.value as string | undefined) ?? "";
    const entities = this._entities();
    if (value) {
      entities[index] = value;
    } else if (index < entities.length) {
      entities.splice(index, 1);
    }
    this._fireConfigChanged({ ...this._config, entities });
  }

  private _removeEntity(index: number): void {
    const entities = this._entities();
    entities.splice(index, 1);
    this._fireConfigChanged({ ...this._config, entities });
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const entities = this._entities();
    const entityRows = [...entities, ""];
    const days = this._config.days ?? DEFAULT_DAYS;
    const hideEndTime = normalizeHideMode(this._config.hide_end_time, "auto");
    const showCalendarName = normalizeShowMode(
      this._config.show_calendar_name,
      "auto",
    );
    const maxItems = this._config.max_items ?? 0;

    return html`
      <div class="card-config">
        <input
          class="field"
          type="text"
          placeholder="Title (optional)"
          .value=${this._config.title ?? ""}
          @change=${this._titleChanged}
        />

        <label>
          <span>Dashboard path</span>
          <input
            class="field"
            type="text"
            placeholder=${DEFAULT_DASHBOARD_PATH}
            .value=${this._config.dashboard_path ?? ""}
            @change=${this._dashboardPathChanged}
          />
        </label>

        <div class="entity-list">
          ${entityRows.map(
            (entity, index) => html`
              <div class="entity-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${entity}
                  .label=${index < entities.length ? "Calendar" : "Add calendar"}
                  .includeDomains=${["calendar"]}
                  @value-changed=${(ev: CustomEvent) =>
                    this._entityChanged(index, ev)}
                ></ha-entity-picker>
                ${index < entities.length
                  ? html`
                      <ha-icon-button
                        .label=${"Remove calendar"}
                        @click=${() => this._removeEntity(index)}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </ha-icon-button>
                    `
                  : nothing}
              </div>
            `,
          )}
        </div>

        <label>
          <span>Days</span>
          <input
            class="field"
            type="number"
            min="1"
            max=${MAX_DAYS}
            .value=${String(days)}
            @change=${this._daysChanged}
          />
        </label>

        <label>
          <span>Hide end time</span>
          <select
            class="field"
            .value=${hideEndTime}
            @change=${this._hideEndTimeChanged}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </label>

        <label>
          <span>Calendar name</span>
          <select
            class="field"
            .value=${showCalendarName}
            @change=${this._showCalendarNameChanged}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </label>

        <label>
          <span>Max items</span>
          <input
            class="field"
            type="number"
            min="0"
            max="500"
            .value=${String(maxItems)}
            @change=${this._maxItemsChanged}
          />
        </label>
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
    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .entity-row ha-entity-picker {
      flex: 1 1 auto;
      min-width: 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 500;
    }
    .field,
    ha-entity-picker {
      width: 100%;
    }
    .field {
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

customElements.define(
  "btoddb-calendar-list-card-editor",
  BtoddbCalendarListCardEditor,
);

export class BtoddbCalendarListCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _entries: { state: true },
    _error: { state: true },
    _loading: { state: true },
  };

  hass!: Hass;
  private _config: CalendarListCardConfig = { type: "" };
  private _entries: CalendarEntry[] = [];
  private _error = "";
  private _loading = false;

  private _lastSignature = "";
  private _refreshTimer?: number;
  private _reminderRefreshTimers: number[] = [];

  static getConfigElement() {
    return document.createElement("btoddb-calendar-list-card-editor");
  }

  static getStubConfig() {
    return {
      entities: [DEFAULT_ENTITY],
      days: DEFAULT_DAYS,
      hide_end_time: "auto",
    };
  }

  setConfig(config: CalendarListCardConfig): void {
    this._config = config ?? { type: "" };
    this._lastSignature = "";
    if (this.hass) void this._fetch();
  }

  getCardSize(): number {
    return 2 + Math.min(this._entries.length, 8);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._refreshTimer = window.setInterval(() => this._fetch(), 60_000);
    window.addEventListener(REMINDERS_CHANGED_EVENT, this._handleRemindersChanged);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._refreshTimer) window.clearInterval(this._refreshTimer);
    window.removeEventListener(REMINDERS_CHANGED_EVENT, this._handleRemindersChanged);
    this._clearReminderRefreshTimers();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (!changed.has("hass") || !this.hass) return;
    const sig = this._entities()
      .map(({ entity }) => {
        const st = this.hass.states[entity];
        return st
          ? `${entity}:${st.state}|${st.last_updated}`
          : `${entity}:missing`;
      })
      .join(";");
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      this._fetch();
    }
  }

  private _entities(): CalendarEntityConfig[] {
    const raw = this._config.entities;
    const inputs = raw === undefined ? [DEFAULT_ENTITY] : raw;
    return inputs
      .map((entry): CalendarEntityConfig => {
        if (typeof entry === "string") return { entity: entry };
        return {
          entity: entry.entity,
          hide_end_time:
            entry.hide_end_time === undefined
              ? undefined
              : normalizeHideMode(entry.hide_end_time, "auto"),
        };
      })
      .filter((entry) => !!entry.entity);
  }

  private _days(): number {
    return clampInt(this._config.days, DEFAULT_DAYS, 1, MAX_DAYS);
  }

  private _maxItems(): number {
    return clampInt(this._config.max_items, 0, 0, 500);
  }

  private _globalHideEndTime(): HideEndTimeMode {
    return normalizeHideMode(this._config.hide_end_time, "auto");
  }

  private _showCalendarNameMode(): ShowCalendarNameMode {
    return normalizeShowMode(this._config.show_calendar_name, "auto");
  }

  private _clearReminderRefreshTimers(): void {
    for (const timer of this._reminderRefreshTimers) {
      window.clearTimeout(timer);
    }
    this._reminderRefreshTimers = [];
  }

  private _scheduleReminderRefresh(): void {
    this._clearReminderRefreshTimers();
    for (const delay of [0, 1_000, 3_000]) {
      this._reminderRefreshTimers.push(
        window.setTimeout(() => {
          void this._fetch();
        }, delay),
      );
    }
  }

  private _handleRemindersChanged = (ev: Event): void => {
    const changedEntity = (ev as CustomEvent<{ entity?: string }>).detail?.entity;
    if (!changedEntity) return;
    if (!this._entities().some(({ entity }) => entity === changedEntity)) return;
    this._scheduleReminderRefresh();
  };

  private async _fetch(): Promise<void> {
    if (!this.hass) return;
    const entities = this._entities();
    if (entities.length === 0) {
      this._entries = [];
      this._error = "No calendar entities configured. Edit the card to select one.";
      return;
    }

    const missing = entities.filter(({ entity }) => !this.hass.states[entity]);
    const available = entities.filter(({ entity }) => !!this.hass.states[entity]);
    if (available.length === 0) {
      this._entries = [];
      this._error = missing.map(({ entity }) => `Entity ${entity} not found.`).join(" ");
      return;
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + this._days());
    const nowCutoff = Date.now() - POINT_EVENT_MS;

    this._loading = true;
    try {
      const results = await Promise.all(
        available.map(async (calendarConfig) => {
          try {
            const events = await this.hass.callApi<CalendarEvent[]>(
              "GET",
              `calendars/${calendarConfig.entity}` +
                `?start=${encodeURIComponent(start.toISOString())}` +
                `&end=${encodeURIComponent(end.toISOString())}`,
            );
            return {
              entries: this._normalizeEvents(events ?? [], calendarConfig, start, end),
              error: "",
            };
          } catch (err) {
            return {
              entries: [] as CalendarEntry[],
              error: `Could not load ${calendarConfig.entity}: ${this._msg(err)}`,
            };
          }
        }),
      );

      let entries = results
        .flatMap((result) => result.entries)
        .filter((entry) => {
          const eventEnd = entry.end ?? entry.start;
          return eventEnd.getTime() >= nowCutoff;
        })
        .sort((a, b) => {
          const dayDiff = a.displayDate.getTime() - b.displayDate.getTime();
          if (dayKey(a.displayDate) !== dayKey(b.displayDate)) return dayDiff;
          if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
          const aSortTime = Math.max(a.start.getTime(), a.displayDate.getTime());
          const bSortTime = Math.max(b.start.getTime(), b.displayDate.getTime());
          if (aSortTime !== bSortTime) return aSortTime - bSortTime;
          return a.summary.localeCompare(b.summary);
        });

      entries = dedupeEntries(entries);

      const maxItems = this._maxItems();
      if (maxItems > 0) entries = entries.slice(0, maxItems);

      const errors = [
        ...missing.map(({ entity }) => `Entity ${entity} not found.`),
        ...results.map((result) => result.error).filter(Boolean),
      ];
      this._entries = entries;
      this._error = errors.join(" ");
    } finally {
      this._loading = false;
    }
  }

  private _normalizeEvents(
    events: CalendarEvent[],
    calendarConfig: CalendarEntityConfig,
    windowStart: Date,
    windowEnd: Date,
  ): CalendarEntry[] {
    const state = this.hass.states[calendarConfig.entity];
    const calendarName =
      (state?.attributes?.friendly_name as string | undefined) ?? calendarConfig.entity;

    return events
      .flatMap((event, index): CalendarEntry[] => {
        const start = parseCalendarDate(event.start);
        if (!start) return [];
        const end = parseCalendarDate(event.end);
        const uid =
          event.uid ??
          `${calendarConfig.entity}-${start.toISOString()}-${event.summary ?? index}`;
        const dedupeKey = event.uid
          ? `${calendarConfig.entity}|uid:${event.uid}`
          : [
              calendarConfig.entity,
              "event",
              event.summary || "(No title)",
              start.toISOString(),
              end?.toISOString() ?? "",
            ].join("|");
        const baseEntry = {
          uid,
          dedupeKey,
          summary: event.summary || "(No title)",
          start,
          end,
          allDay: !!event.start.date,
          calendar: calendarConfig.entity,
          calendarName,
          hideEndTime:
            calendarConfig.hide_end_time === undefined
              ? undefined
              : normalizeHideMode(calendarConfig.hide_end_time, "auto"),
        };

        const firstDisplayDay = maxDate(startOfLocalDay(start), windowStart);
        const lastDisplayDay = minDate(
          startOfLocalDay(lastOverlappingDate(start, end)),
          previousDay(windowEnd),
        );
        if (firstDisplayDay.getTime() > lastDisplayDay.getTime()) return [];

        const entries: CalendarEntry[] = [];
        for (
          let displayDate = firstDisplayDay;
          displayDate.getTime() <= lastDisplayDay.getTime();
          displayDate = nextDay(displayDate)
        ) {
          entries.push({ ...baseEntry, displayDate });
        }
        return entries;
      });
  }

  private _msg(err: unknown): string {
    if (err && typeof err === "object" && "message" in err) {
      return String((err as { message: unknown }).message);
    }
    return String(err);
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

  private _formatDate(d: Date): string {
    try {
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return d.toLocaleDateString();
    }
  }

  private _formatDateTime(d: Date): string {
    try {
      return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return d.toLocaleString();
    }
  }

  private _formatDayHeader(d: Date): string {
    const today = new Date();
    if (dayKey(d) === dayKey(today)) return "Today";
    const tomorrow = nextDay(today);
    if (dayKey(d) === dayKey(tomorrow)) return "Tomorrow";
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

  private _durationMs(entry: CalendarEntry): number {
    if (!entry.end) return 0;
    return entry.end.getTime() - entry.start.getTime();
  }

  private _shouldHideEndTime(entry: CalendarEntry): boolean {
    if (entry.allDay) return true;
    const mode = entry.hideEndTime ?? this._globalHideEndTime();
    if (mode === "always") return true;
    if (mode === "never") return false;
    return this._durationMs(entry) <= POINT_EVENT_MS;
  }

  private _formatEntryTime(entry: CalendarEntry): string {
    if (entry.allDay) {
      if (!entry.end) return "All day";
      const displayEnd = previousDay(entry.end);
      if (dayKey(displayEnd) === dayKey(entry.start)) return "All day";
      return `All day, ${this._formatDate(entry.start)} - ${this._formatDate(
        displayEnd,
      )}`;
    }

    if (!entry.end || this._shouldHideEndTime(entry)) {
      return this._formatTimeOnly(entry.start);
    }
    if (dayKey(entry.start) === dayKey(entry.end)) {
      return `${this._formatTimeOnly(entry.start)} - ${this._formatTimeOnly(entry.end)}`;
    }
    return `${this._formatDateTime(entry.start)} - ${this._formatDateTime(entry.end)}`;
  }

  private _shouldShowCalendarName(): boolean {
    const mode = this._showCalendarNameMode();
    if (mode === "always") return true;
    if (mode === "never") return false;
    return this._entities().length > 1;
  }

  private _openCalendarDashboard(): void {
    window.history.pushState(
      null,
      "",
      normalizeDashboardPath(this._config.dashboard_path),
    );
    window.dispatchEvent(
      new CustomEvent("location-changed", {
        detail: { replace: false },
      }),
    );
  }

  private _handleCardKeydown(ev: KeyboardEvent): void {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    this._openCalendarDashboard();
  }

  private _renderRows() {
    const rows = [];
    let lastKey = "";
    for (const entry of this._entries) {
      const key = dayKey(entry.displayDate);
      if (key !== lastKey) {
        rows.push(
          html`<div class="day-header">${this._formatDayHeader(entry.displayDate)}</div>`,
        );
        lastKey = key;
      }
      rows.push(this._renderEntry(entry));
    }
    return rows;
  }

  private _renderEntry(entry: CalendarEntry) {
    const showCalendarName = this._shouldShowCalendarName();
    return html`
      <div class="item">
        <ha-icon
          class="leading"
          icon=${entry.allDay ? "mdi:calendar-blank" : "mdi:calendar-clock"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${entry.summary}</span>
          <span class="time">${this._formatEntryTime(entry)}</span>
          ${showCalendarName
            ? html`<span class="calendar-name">${entry.calendarName}</span>`
            : nothing}
        </div>
      </div>
    `;
  }

  render() {
    const title = this._config.title ?? "Agenda";
    return html`
      <ha-card
        .header=${title}
        role="button"
        tabindex="0"
        @click=${this._openCalendarDashboard}
        @keydown=${this._handleCardKeydown}
      >
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          ${this._entries.length === 0
            ? html`<div class="empty">
                ${this._loading ? "Loading events..." : "No upcoming events."}
              </div>`
            : html`<div class="list">${this._renderRows()}</div>`}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    .content {
      padding: 0 16px 12px;
    }
    ha-card {
      cursor: pointer;
    }
    ha-card:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .error {
      margin: 12px 0 0;
      padding: 8px;
      border-radius: 4px;
      background: var(--error-color, #db4437);
      color: white;
      font-size: 13px;
    }
    .empty {
      padding: 18px 0 8px;
      color: var(--secondary-text-color, #727272);
      font-size: 14px;
    }
    .list {
      padding-top: 8px;
    }
    .day-header {
      padding: 14px 0 6px;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .leading {
      flex: 0 0 auto;
      color: var(--primary-color, #03a9f4);
    }
    .text {
      min-width: 0;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .summary {
      overflow-wrap: anywhere;
      color: var(--primary-text-color, #212121);
      font-size: 14px;
      line-height: 1.3;
    }
    .time,
    .calendar-name {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 1.3;
    }
  `;
}

customElements.define("btoddb-calendar-list-card", BtoddbCalendarListCard);
