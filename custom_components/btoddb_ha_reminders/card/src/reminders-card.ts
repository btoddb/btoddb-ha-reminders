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

interface ReminderItem {
  uid: string;
  summary: string;
  start: Date;
}

const DEFAULT_ENTITY = "calendar.btoddb_reminders";

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

export class BtoddbRemindersCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _items: { state: true },
    _message: { state: true },
    _when: { state: true },
    _busy: { state: true },
    _error: { state: true },
  };

  hass!: Hass;
  private _config: CardConfig = { type: "" };
  private _items: ReminderItem[] = [];
  private _message = "";
  private _when = defaultWhen();
  private _busy = false;
  private _error = "";

  private _entity = DEFAULT_ENTITY;
  private _lastSignature = "";
  private _refreshTimer?: number;

  setConfig(config: CardConfig): void {
    this._config = config ?? { type: "" };
    this._entity = config?.entity ?? DEFAULT_ENTITY;
  }

  getCardSize(): number {
    return 3 + Math.min(this._items.length, 8);
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
        .map((e) => ({
          uid: e.uid ?? "",
          summary: e.summary,
          start: new Date(e.start.dateTime ?? e.start.date ?? ""),
        }))
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
    this._busy = true;
    this._error = "";
    try {
      // `btoddb_ha_reminders.create` is a response-only service, so returnResponse must be true.
      await this.hass.callService(
        "btoddb_ha_reminders",
        "create",
        { message, when: this._when },
        undefined,
        undefined,
        true,
      );
      this._message = "";
      this._when = defaultWhen();
      await this._fetch();
    } catch (err) {
      this._error = `Could not create reminder: ${this._msg(err)}`;
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

  render() {
    const title = this._config.title ?? "BToddB Reminders";
    return html`
      <ha-card .header=${title}>
        <div class="content">
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
            <mwc-button
              raised
              ?disabled=${this._busy}
              @click=${() => this._add()}
            >
              Add
            </mwc-button>
          </div>

          ${this._error
        ? html`<div class="error">${this._error}</div>`
        : nothing}

          ${this._items.length === 0
        ? html`<div class="empty">No upcoming reminders.</div>`
        : html`
                <div class="list">
                  ${this._items.map(
          (item) => html`
                      <div class="item">
                        <ha-icon class="leading" icon="mdi:alarm"></ha-icon>
                        <div class="text">
                          <span class="summary">${item.summary}</span>
                          <span class="time">${this._formatTime(item.start)}</span>
                        </div>
                        <ha-icon-button
                          .label=${"Delete reminder"}
                          @click=${() => this._delete(item.uid)}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </ha-icon-button>
                      </div>
                    `,
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
    .add-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      flex-wrap: wrap;
    }
    .message,
    .when {
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
    .when {
      flex: 0 0 auto;
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

customElements.define("btoddb-reminders-card", BtoddbRemindersCard);

declare global {
  interface HTMLElementTagNameMap {
    "btoddb-reminders-card": BtoddbRemindersCard;
  }
}
