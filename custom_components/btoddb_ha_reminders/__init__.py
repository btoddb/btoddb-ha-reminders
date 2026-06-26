"""
The Reminders integration.

Time-based reminders set in natural language (by the conversation agent — see the
README) and delivered as a high-priority push when due. This module wires up:

- the ``btoddb_ha_reminders.create`` service (RM-5) which returns a spoken-time response
  (RM-9);
- a component-owned ``calendar.btoddb_reminders`` entity (calendar platform);
- a once-a-minute delivery loop with a durable, 6h-clamped watermark
  (RM-6, RM-7, RM-7b).
"""

from __future__ import annotations

import hashlib
import logging
import uuid
from datetime import timedelta
from pathlib import Path
from typing import TYPE_CHECKING

import voluptuous as vol
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace import LOVELACE_DATA
from homeassistant.components.lovelace.resources import ResourceStorageCollection
from homeassistant.const import (
    EVENT_HOMEASSISTANT_STARTED,
    STATE_HOME,
    Platform,
)
from homeassistant.core import (
    CoreState,
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .const import (
    CONF_NOTIFY_SERVICE,
    DATA_LOCATION_STORE,
    DATA_STORE,
    DELIVERY_INTERVAL_MINUTES,
    DOMAIN,
    LOCATION_RETENTION_DAYS,
    NOTIFY_DATA,
    NOTIFY_TITLE,
    NOTIFY_TITLE_LOCATION,
)
from .delivery import (
    CATCHUP_FLOOR,
    ReminderEvent,
    advance_recurring,
    due_events,
    effective_watermark,
    resolve_notify_target,
    validate_rrule,
)
from .location import LocationReminder, transition_kind, triggered
from .location_store import LocationReminderStore
from .spoken_time import format_spoken_time
from .store import ReminderStore

if TYPE_CHECKING:
    from collections.abc import Callable
    from datetime import datetime

    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import Event
    from homeassistant.helpers.event import EventStateChangedData

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.CALENDAR, Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

# Frontend card: the built bundle in www/ is served at this URL and auto-registered
# as a Lovelace resource, so users only hard-refresh — no manual resource to add.
CARD_URL_BASE = "/btoddb-ha-reminders"
CARD_FILENAME = "btoddb-ha-reminders.js"
# A static path can only be registered once per HA run; guard with this flag.
_CARD_STATIC_PATH_KEY = f"{DOMAIN}_card_static_path"

SERVICE_CREATE = "create"
SERVICE_UPDATE = "update"
ATTR_MESSAGE = "message"
ATTR_WHEN = "when"
ATTR_IN_MINUTES = "in_minutes"
ATTR_RRULE = "rrule"

SERVICE_CREATE_LOCATION = "create_location"
SERVICE_UPDATE_LOCATION = "update_location"
SERVICE_DELETE_LOCATION = "delete_location"
ATTR_PERSON = "person"
ATTR_ZONE = "zone"
ATTR_TRIGGER = "trigger"
ATTR_UID = "uid"
TRIGGER_VALUES = ("enter", "leave")


def _optional_minutes(value: object) -> int | None:
    """
    Coerce in_minutes, tolerating ''/None.

    The agent's create_reminder function always passes
    ``in_minutes: "{{ in_minutes }}"``, which renders to an empty string whenever
    the model omits it (i.e. every absolute ``when`` request). Treat ''/None as
    "not given" rather than rejecting the call.
    """
    if value in (None, ""):
        return None
    return int(value)


CREATE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MESSAGE): cv.string,
        vol.Optional(ATTR_WHEN): vol.Any(None, cv.string),
        vol.Optional(ATTR_IN_MINUTES): _optional_minutes,
        vol.Optional(ATTR_RRULE): vol.Any(None, cv.string),
    }
)

UPDATE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_UID): cv.string,
        vol.Optional(ATTR_MESSAGE): cv.string,
        vol.Optional(ATTR_WHEN): vol.Any(None, cv.string),
        vol.Optional(ATTR_IN_MINUTES): _optional_minutes,
        vol.Optional(ATTR_RRULE): vol.Any(None, cv.string),
    }
)

CREATE_LOCATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MESSAGE): cv.string,
        # Restrict to the actual domains (LOC-1): cv.entity_id alone would accept e.g.
        # sensor.foo, creating a reminder that can never fire.
        vol.Required(ATTR_PERSON): cv.entity_domain("person"),
        vol.Required(ATTR_ZONE): cv.entity_domain("zone"),
        vol.Required(ATTR_TRIGGER): vol.In(TRIGGER_VALUES),
    }
)

UPDATE_LOCATION_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_UID): cv.string,
        vol.Optional(ATTR_MESSAGE): cv.string,
        vol.Optional(ATTR_PERSON): cv.entity_domain("person"),
        vol.Optional(ATTR_ZONE): cv.entity_domain("zone"),
        vol.Optional(ATTR_TRIGGER): vol.In(TRIGGER_VALUES),
    }
)

DELETE_LOCATION_SCHEMA = vol.Schema({vol.Required(ATTR_UID): cv.string})

# Keep pruned history a day past the catch-up floor so the calendar can still show the
# most recent fired reminders without growing unbounded.
PRUNE_RETENTION = CATCHUP_FLOOR + timedelta(days=1)

# How often delivered location reminders are swept (LOC-5). Coarse: state-change-driven
# pruning alone would never fire for a person who stops moving, so a light periodic
# sweep guarantees the 7-day retention is honored.
LOCATION_PRUNE_INTERVAL_HOURS = 1


async def async_send_notification(
    hass: HomeAssistant, domain: str, service: str, title: str, message: str
) -> bool:
    """
    Push one reminder to the notify target (shared by time + location delivery).

    Returns ``True`` on success and ``False`` if the notify call raised. Exceptions are
    caught and logged so a single failed delivery never aborts the rest of a delivery
    pass; the boolean lets the caller decide whether to record the reminder as delivered
    (a location reminder must not be crossed off if it never reached the user).
    """
    try:
        await hass.services.async_call(
            domain,
            service,
            {"title": title, "message": message, "data": dict(NOTIFY_DATA)},
            blocking=True,
        )
    except Exception:
        _LOGGER.exception("Failed to deliver reminder %r", message)
        return False
    return True


def _zone_value(hass: HomeAssistant, zone_entity_id: str) -> str:
    """
    Return the string a person's state takes while inside ``zone_entity_id``.

    A person/device_tracker reads ``"home"`` (``STATE_HOME``) for the home zone and
    the zone's **friendly name** for any other zone — so that is what we compare the
    person's state against, not the zone's entity_id slug.
    """
    if zone_entity_id == "zone.home":
        return STATE_HOME
    state = hass.states.get(zone_entity_id)
    if state is not None:
        friendly = state.attributes.get("friendly_name")
        if friendly:
            return friendly
    # Fallback when the zone entity isn't loaded: best-effort title-cased slug.
    return zone_entity_id.split(".", 1)[-1].replace("_", " ").title()


def _notify_target_for(entry: ConfigEntry) -> tuple[str, str]:
    """Resolve the configured notify target for ``entry`` into ``(domain, service)``."""
    configured = (
        entry.options.get(CONF_NOTIFY_SERVICE)
        or entry.data.get(CONF_NOTIFY_SERVICE)
        or ""
    )
    return resolve_notify_target(configured)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Reminders from a config entry."""
    store = ReminderStore(hass)
    await store.async_load()
    location_store = LocationReminderStore(hass)
    await location_store.async_load()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        DATA_STORE: store,
        DATA_LOCATION_STORE: location_store,
    }

    await _async_register_card(hass)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _async_register_service(hass, store)
    _async_register_location_services(hass, location_store)

    delivery = ReminderDelivery(hass, entry, store)
    entry.async_on_unload(
        async_track_time_interval(
            hass,
            delivery.async_tick,
            timedelta(minutes=DELIVERY_INTERVAL_MINUTES),
        )
    )

    # Location reminders fire on zone transitions, not on a timer; the delivery object
    # subscribes to the referenced person entities, re-subscribing as reminders change.
    location_delivery = LocationDelivery(hass, entry, location_store)
    location_delivery.async_start()
    entry.async_on_unload(location_delivery.async_stop)
    entry.async_on_unload(
        async_track_time_interval(
            hass,
            location_delivery.async_prune_tick,
            timedelta(hours=LOCATION_PRUNE_INTERVAL_HOURS),
        )
    )

    # Catch up immediately rather than waiting up to a minute for the first tick. On a
    # cold start, wait for HA to finish starting (mirrors the old automation's startup
    # branch); on a reload, the loop is already up so run a tick now.
    if hass.state is CoreState.running:
        entry.async_create_background_task(
            hass, delivery.async_tick(), name="reminders_startup_catchup"
        )
    else:

        async def _async_startup_catchup(_event: Event) -> None:
            await delivery.async_tick()

        # A coroutine listener is scheduled on the event loop by HA; a plain sync
        # lambda would be run in an executor thread, and calling into hass from there
        # trips HA's thread-safety guard.
        entry.async_on_unload(
            hass.bus.async_listen_once(
                EVENT_HOMEASSISTANT_STARTED, _async_startup_catchup
            )
        )

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


def _card_digest(path: Path) -> str:
    """Short content hash of the card bundle, used as a cache-busting query param."""
    return hashlib.sha256(path.read_bytes()).hexdigest()[:8]


async def _async_register_card(hass: HomeAssistant) -> None:
    """
    Make the card available to dashboards without manual resource setup.

    The card is registered as a Lovelace *resource*, not an extra frontend module
    (add_extra_js_url): extra modules are baked into index.html at render time,
    and HA's service worker caches dashboard pages stale-while-revalidate. A page
    rendered while HA was still starting (this integration not yet set up) lacks
    the module import, and clients keep getting that cached copy — cards
    intermittently fail with "custom element doesn't exist: btoddb-reminders-card"
    until the cache turns over. Resources are fetched over websocket at dashboard
    load, so they can't go stale with the page. The content-hash query param busts
    HTTP/service-worker caches whenever the bundle changes.
    """
    www_dir = Path(__file__).parent / "www"
    # Ensure the directory exists so registering the static route never fails before
    # the card has been built/deployed (scripts/deploy.sh fills it in).
    await hass.async_add_executor_job(
        lambda: www_dir.mkdir(parents=True, exist_ok=True)
    )

    # The static path can only be registered once per HA run; the resource
    # reconciliation below is idempotent and re-runs on every entry reload so a
    # rebuilt bundle's new hash is picked up.
    if not hass.data.get(_CARD_STATIC_PATH_KEY):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL_BASE, str(www_dir), cache_headers=False)]
        )
        hass.data[_CARD_STATIC_PATH_KEY] = True

    card_path = www_dir / CARD_FILENAME
    try:
        digest = await hass.async_add_executor_job(_card_digest, card_path)
    except OSError:
        _LOGGER.exception("Card bundle missing or unreadable: %s", card_path)
        return
    base_url = f"{CARD_URL_BASE}/{CARD_FILENAME}"
    url = f"{base_url}?v={digest}"

    resources = hass.data[LOVELACE_DATA].resources
    if not isinstance(resources, ResourceStorageCollection):
        # Resources are YAML-managed (read-only to us); fall back to the
        # index-injected module and accept the stale-index race.
        add_extra_js_url(hass, url)
        return

    await resources.async_get_info()  # force-load the collection from storage
    for item in resources.async_items():
        if item["url"].partition("?")[0] == base_url:
            if item["url"] != url:
                await resources.async_update_item(item["id"], {"url": url})
            return
    await resources.async_create_item({"res_type": "module", "url": url})


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.services.async_remove(DOMAIN, SERVICE_CREATE)
            hass.services.async_remove(DOMAIN, SERVICE_UPDATE)
            hass.services.async_remove(DOMAIN, SERVICE_CREATE_LOCATION)
            hass.services.async_remove(DOMAIN, SERVICE_UPDATE_LOCATION)
            hass.services.async_remove(DOMAIN, SERVICE_DELETE_LOCATION)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload when options (e.g. the notify target) change."""
    await hass.config_entries.async_reload(entry.entry_id)


def _resolve_start(
    now: datetime,
    when: str | None,
    in_minutes: int | None,
) -> datetime | None:
    """Resolve a when/in_minutes pair to a timezone-aware local datetime."""
    if in_minutes is not None:
        return now + timedelta(minutes=in_minutes)
    if when not in (None, ""):
        parsed = dt_util.parse_datetime(when)
        if parsed is not None:
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
            return dt_util.as_local(parsed)
    return None


@callback
def _async_register_service(hass: HomeAssistant, store: ReminderStore) -> None:
    """Register ``btoddb_ha_reminders.create`` and ``update`` (idempotent)."""
    if hass.services.has_service(DOMAIN, SERVICE_CREATE):
        return

    async def _handle_create(call: ServiceCall) -> ServiceResponse:
        message: str = call.data[ATTR_MESSAGE]
        now = dt_util.now()
        # in_minutes wins if both are given (RM-4a): the home computes now + offset so
        # the model never does clock arithmetic.
        start = _resolve_start(
            now, call.data.get(ATTR_WHEN), call.data.get(ATTR_IN_MINUTES)
        )
        if start is None:
            when_v = call.data.get(ATTR_WHEN)
            mins_v = call.data.get(ATTR_IN_MINUTES)
            msg = (
                f"Could not determine reminder time"
                f" (when={when_v!r}, in_minutes={mins_v!r})"
            )
            raise ServiceValidationError(msg)
        rrule: str | None = call.data.get(ATTR_RRULE) or None
        if rrule is not None:
            err = validate_rrule(rrule, start)
            if err is not None:
                raise ServiceValidationError(err)
        event = ReminderEvent(
            uid=uuid.uuid4().hex, summary=message, start=start, rrule=rrule
        )
        await store.async_add_event(event)
        return {
            "success": True,
            "message": message,
            "start": format_spoken_time(start, now),
            **({"rrule": rrule} if rrule is not None else {}),
        }

    async def _handle_update(call: ServiceCall) -> ServiceResponse:
        uid: str = call.data[ATTR_UID]
        message: str | None = call.data.get(ATTR_MESSAGE)
        now = dt_util.now()
        start = _resolve_start(
            now, call.data.get(ATTR_WHEN), call.data.get(ATTR_IN_MINUTES)
        )
        rrule_in_call = ATTR_RRULE in call.data
        new_rrule: str | None = (
            (call.data.get(ATTR_RRULE) or None) if rrule_in_call else None
        )
        if message is None and start is None and not rrule_in_call:
            msg = (
                "Provide at least one of message, when, in_minutes, or rrule to update."
            )
            raise ServiceValidationError(msg)
        if start is not None and start < now:
            msg = f"Cannot update reminder to a time in the past ({start.isoformat()})."
            raise ServiceValidationError(msg)
        if new_rrule is not None:
            check_start = start or next(
                (e.start for e in store.events if e.uid == uid), now
            )
            err = validate_rrule(new_rrule, check_start)
            if err is not None:
                raise ServiceValidationError(err)
        found = await store.async_update_event(
            uid,
            summary=message,
            start=start,
            rrule=new_rrule,
            rrule_changed=rrule_in_call,
        )
        if not found:
            msg = f"Reminder with uid {uid!r} not found."
            raise ServiceValidationError(msg)
        updated = next((e for e in store.events if e.uid == uid), None)
        return {
            "success": True,
            "message": updated.summary if updated else (message or ""),
            "start": format_spoken_time(updated.start, now) if updated else "",
        }

    hass.services.async_register(
        DOMAIN,
        SERVICE_CREATE,
        _handle_create,
        schema=CREATE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE,
        _handle_update,
        schema=UPDATE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )


@callback
def _async_register_location_services(
    hass: HomeAssistant, store: LocationReminderStore
) -> None:
    """Register location reminder services (idempotent)."""
    if hass.services.has_service(DOMAIN, SERVICE_CREATE_LOCATION):
        return

    async def _handle_create_location(call: ServiceCall) -> None:
        reminder = LocationReminder(
            uid=uuid.uuid4().hex,
            summary=call.data[ATTR_MESSAGE],
            person=call.data[ATTR_PERSON],
            zone=call.data[ATTR_ZONE],
            trigger=call.data[ATTR_TRIGGER],
        )
        await store.async_add_event(reminder)

    async def _handle_update_location(call: ServiceCall) -> None:
        uid: str = call.data[ATTR_UID]
        existing = next((e for e in store.events if e.uid == uid), None)
        if existing is None:
            msg = f"Location reminder with uid {uid!r} not found."
            raise ServiceValidationError(msg)
        if existing.delivered_at is not None:
            msg = f"Location reminder with uid {uid!r} has already been delivered."
            raise ServiceValidationError(msg)
        message: str | None = call.data.get(ATTR_MESSAGE)
        person: str | None = call.data.get(ATTR_PERSON)
        zone: str | None = call.data.get(ATTR_ZONE)
        trigger: str | None = call.data.get(ATTR_TRIGGER)
        if message is None and person is None and zone is None and trigger is None:
            msg = "Provide at least one field to update."
            raise ServiceValidationError(msg)
        await store.async_update_event(
            uid, summary=message, person=person, zone=zone, trigger=trigger
        )

    async def _handle_delete_location(call: ServiceCall) -> None:
        await store.async_delete_event(call.data[ATTR_UID])

    hass.services.async_register(
        DOMAIN,
        SERVICE_CREATE_LOCATION,
        _handle_create_location,
        schema=CREATE_LOCATION_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE_LOCATION,
        _handle_update_location,
        schema=UPDATE_LOCATION_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_DELETE_LOCATION,
        _handle_delete_location,
        schema=DELETE_LOCATION_SCHEMA,
    )


class ReminderDelivery:
    """Delivers due reminders to the configured notify service every minute."""

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: ReminderStore
    ) -> None:
        """Initialize with the store and config entry to deliver against."""
        self._hass = hass
        self._entry = entry
        self._store = store

    async def async_tick(self, _now: datetime | None = None) -> None:
        """One delivery pass over the ``(watermark, now]`` window (RM-6/RM-7)."""
        now = dt_util.now()
        watermark = effective_watermark(self._store.watermark, now)
        domain, service = _notify_target_for(self._entry)

        for event in due_events(self._store.events, watermark, now):
            await async_send_notification(
                self._hass, domain, service, NOTIFY_TITLE, event.summary
            )
            next_event = advance_recurring(event, now)
            if next_event is not None:
                await self._store.async_replace_event(event.uid, next_event)

        # Self-heal recurring events whose start slipped behind the 6h watermark
        # floor (e.g. after a long HA outage). These events are not in due_events
        # (missed the window) and would be silently pruned if left in the past —
        # advance them to the next future occurrence so they keep firing.
        for event in list(self._store.events):
            if event.rrule is not None and event.start <= watermark:
                next_event = advance_recurring(event, now)
                if next_event is not None:
                    await self._store.async_replace_event(event.uid, next_event)
                    _LOGGER.warning(
                        "Recurring reminder %r missed its scheduled time (%s); "
                        "advanced to next occurrence at %s",
                        event.summary,
                        event.start.isoformat(),
                        next_event.start.isoformat(),
                    )

        await self._store.async_set_watermark(now)
        await self._store.async_prune(now - PRUNE_RETENTION)


class LocationDelivery:
    """
    Delivers location reminders immediately on a matching zone transition (LOC-1).

    Subscribes to the ``person.*`` entities referenced by undelivered reminders and
    re-subscribes whenever the store changes, so it only wakes for people who actually
    have a pending reminder.
    """

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: LocationReminderStore
    ) -> None:
        """Initialize with the location store and config entry to deliver against."""
        self._hass = hass
        self._entry = entry
        self._store = store
        self._unsub_track: Callable[[], None] | None = None
        self._unsub_store: Callable[[], None] | None = None

    @callback
    def async_start(self) -> None:
        """Begin tracking; re-derive subscriptions whenever the store changes."""
        self._unsub_store = self._store.async_add_listener(self._resubscribe)
        self._resubscribe()

    @callback
    def async_stop(self) -> None:
        """Tear down all subscriptions (config-entry unload)."""
        if self._unsub_track is not None:
            self._unsub_track()
            self._unsub_track = None
        if self._unsub_store is not None:
            self._unsub_store()
            self._unsub_store = None

    @callback
    def _resubscribe(self) -> None:
        """Track exactly the person entities referenced by undelivered reminders."""
        if self._unsub_track is not None:
            self._unsub_track()
            self._unsub_track = None
        persons = sorted(self._store.tracked_persons())
        if persons:
            self._unsub_track = async_track_state_change_event(
                self._hass, persons, self._handle_state_change
            )

    async def _handle_state_change(self, event: Event[EventStateChangedData]) -> None:
        """Deliver any reminder whose zone transition just occurred for this person."""
        person = event.data["entity_id"]
        old = event.data["old_state"]
        new = event.data["new_state"]
        old_state = old.state if old is not None else None
        new_state = new.state if new is not None else None

        candidates = [
            r
            for r in self._store.events
            if r.delivered_at is None and r.person == person
        ]
        if not candidates:
            return

        # Classify the transition once per target zone, then deliver matches.
        by_zone: dict[str, list[LocationReminder]] = {}
        for reminder in candidates:
            by_zone.setdefault(reminder.zone, []).append(reminder)

        now = dt_util.now()
        domain, service = _notify_target_for(self._entry)
        for zone, reminders in by_zone.items():
            kind = transition_kind(old_state, new_state, _zone_value(self._hass, zone))
            if kind is None:
                continue
            for reminder in triggered(reminders, person, kind):
                # Only cross it off once the push actually went out — a failed notify
                # must leave the reminder pending so it can fire on a later transition.
                if await async_send_notification(
                    self._hass, domain, service, NOTIFY_TITLE_LOCATION, reminder.summary
                ):
                    await self._store.async_mark_delivered(reminder.uid, now)

    async def async_prune_tick(self, _now: datetime | None = None) -> None:
        """Sweep delivered reminders past the 7-day retention window (LOC-5)."""
        await self._store.async_prune(
            dt_util.now() - timedelta(days=LOCATION_RETENTION_DAYS)
        )
