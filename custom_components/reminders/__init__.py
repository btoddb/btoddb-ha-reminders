"""The Reminders integration.

Time-based reminders set in natural language (by the conversation agent — see the
README) and delivered as a high-priority push when due. This module wires up:

- the ``reminders.create`` service (RM-5) which returns a spoken-time response (RM-9);
- a component-owned ``calendar.reminders`` entity (calendar platform);
- a once-a-minute delivery loop with a durable, 6h-clamped watermark (RM-6, RM-7, RM-7b).
"""

from __future__ import annotations

import logging
import uuid
from datetime import timedelta

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
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
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

from .const import (
    CONF_NOTIFY_SERVICE,
    DEFAULT_NOTIFY_SERVICE,
    DELIVERY_INTERVAL_MINUTES,
    DOMAIN,
    NOTIFY_DATA,
    NOTIFY_TITLE,
)
from .delivery import CATCHUP_FLOOR, ReminderEvent, due_events, effective_watermark
from .spoken_time import format_spoken_time
from .store import ReminderStore

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.CALENDAR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

SERVICE_CREATE = "create"
ATTR_MESSAGE = "message"
ATTR_WHEN = "when"
ATTR_IN_MINUTES = "in_minutes"

def _optional_minutes(value: object) -> int | None:
    """Coerce in_minutes, tolerating ''/None.

    The agent's create_reminder function always passes ``in_minutes: "{{ in_minutes }}"``,
    which renders to an empty string whenever the model omits it (i.e. every absolute
    ``when`` request). Treat ''/None as "not given" rather than rejecting the call.
    """
    if value in (None, ""):
        return None
    return int(value)


CREATE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MESSAGE): cv.string,
        vol.Optional(ATTR_WHEN): vol.Any(None, cv.string),
        vol.Optional(ATTR_IN_MINUTES): _optional_minutes,
    }
)

# Keep pruned history a day past the catch-up floor so the calendar can still show the
# most recent fired reminders without growing unbounded.
PRUNE_RETENTION = CATCHUP_FLOOR + timedelta(days=1)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Reminders from a config entry."""
    store = ReminderStore(hass)
    await store.async_load()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = store

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _async_register_service(hass, store)

    delivery = ReminderDelivery(hass, entry, store)
    entry.async_on_unload(
        async_track_time_interval(
            hass,
            delivery.async_tick,
            timedelta(minutes=DELIVERY_INTERVAL_MINUTES),
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

        async def _async_startup_catchup(_event) -> None:
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


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        if not hass.data[DOMAIN]:
            hass.services.async_remove(DOMAIN, SERVICE_CREATE)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload when options (e.g. the notify target) change."""
    await hass.config_entries.async_reload(entry.entry_id)


@callback
def _async_register_service(hass: HomeAssistant, store: ReminderStore) -> None:
    """Register ``reminders.create`` (idempotent; single config entry)."""
    if hass.services.has_service(DOMAIN, SERVICE_CREATE):
        return

    async def _handle_create(call: ServiceCall) -> ServiceResponse:
        message: str = call.data[ATTR_MESSAGE]
        when = call.data.get(ATTR_WHEN)
        in_minutes = call.data.get(ATTR_IN_MINUTES)
        now = dt_util.now()

        # in_minutes wins if both are given (RM-4a): the home computes now + offset so
        # the model never does clock arithmetic.
        start = None
        if in_minutes is not None:
            start = now + timedelta(minutes=in_minutes)
        elif when not in (None, ""):
            parsed = dt_util.parse_datetime(when)
            if parsed is not None:
                if parsed.tzinfo is None:
                    parsed = parsed.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                start = dt_util.as_local(parsed)

        if start is None:
            raise ServiceValidationError(
                f"Could not determine reminder time (when={when!r}, "
                f"in_minutes={in_minutes!r})"
            )

        event = ReminderEvent(uid=uuid.uuid4().hex, summary=message, start=start)
        await store.async_add_event(event)

        return {
            "success": True,
            "message": message,
            "start": format_spoken_time(start, now),
        }

    hass.services.async_register(
        DOMAIN,
        SERVICE_CREATE,
        _handle_create,
        schema=CREATE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )


class ReminderDelivery:
    """Delivers due reminders to the configured notify service every minute."""

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, store: ReminderStore
    ) -> None:
        self._hass = hass
        self._entry = entry
        self._store = store

    def _notify_target(self) -> tuple[str, str]:
        configured = (
            self._entry.options.get(CONF_NOTIFY_SERVICE)
            or self._entry.data.get(CONF_NOTIFY_SERVICE)
            or DEFAULT_NOTIFY_SERVICE
        )
        domain, _, service = configured.partition(".")
        return (domain or "notify"), (service or "notify")

    async def async_tick(self, _now=None) -> None:
        """One delivery pass over the ``(watermark, now]`` window (RM-6/RM-7)."""
        now = dt_util.now()
        watermark = effective_watermark(self._store.watermark, now)
        domain, service = self._notify_target()

        for event in due_events(self._store.events, watermark, now):
            try:
                await self._hass.services.async_call(
                    domain,
                    service,
                    {
                        "title": NOTIFY_TITLE,
                        "message": event.summary,
                        "data": dict(NOTIFY_DATA),
                    },
                    blocking=True,
                )
            except Exception:  # noqa: BLE001 - one bad push shouldn't stall delivery
                _LOGGER.exception("Failed to deliver reminder %r", event.summary)

        await self._store.async_set_watermark(now)
        await self._store.async_prune(now - PRUNE_RETENTION)
