"""
Calendar platform — a component-owned ``calendar.btoddb_reminders`` entity (RM-8).

Backed by :class:`ReminderStore`, so the existing storage-mode Reminders dashboard's
built-in calendar card keeps working unchanged. The entity refreshes whenever the store
changes (a reminder is created or pruned).
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import (
    CalendarEntity,
    CalendarEntityFeature,
    CalendarEvent,
)
from homeassistant.util import dt as dt_util

from .const import CONF_CALENDAR_NAME, DATA_STORE, DEFAULT_CALENDAR_NAME, DOMAIN

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .delivery import ReminderEvent
    from .store import ReminderStore

# Reminders are point-in-time; model each as a 1-minute calendar event.
EVENT_DURATION = timedelta(minutes=1)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the reminders calendar entity from a config entry."""
    store: ReminderStore = hass.data[DOMAIN][entry.entry_id][DATA_STORE]
    async_add_entities([ReminderCalendarEntity(store, entry)])


def _to_calendar_event(event: ReminderEvent) -> CalendarEvent:
    return CalendarEvent(
        summary=event.summary,
        start=event.start,
        end=event.start + EVENT_DURATION,
        uid=event.uid,
    )


class ReminderCalendarEntity(CalendarEntity):
    """The calendar entity for reminders."""

    _attr_has_entity_name = False
    _attr_icon = "mdi:alarm"
    _attr_should_poll = False
    _attr_supported_features = (
        CalendarEntityFeature.DELETE_EVENT | CalendarEntityFeature.UPDATE_EVENT
    )

    def __init__(self, store: ReminderStore, entry: ConfigEntry) -> None:
        """Initialize bound to the store and the owning config entry."""
        self._store = store
        self._attr_unique_id = f"{entry.entry_id}_calendar"
        self._attr_name = entry.data.get(CONF_CALENDAR_NAME, DEFAULT_CALENDAR_NAME)

    async def async_added_to_hass(self) -> None:
        """Refresh the entity whenever the store changes."""
        self.async_on_remove(self._store.async_add_listener(self.async_write_ha_state))

    @property
    def event(self) -> CalendarEvent | None:
        """The next upcoming reminder, if any."""
        now = dt_util.now()
        upcoming = sorted(
            (e for e in self._store.events if e.start >= now), key=lambda e: e.start
        )
        return _to_calendar_event(upcoming[0]) if upcoming else None

    async def async_get_events(
        self, _hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Return reminders within the requested window."""
        return [
            _to_calendar_event(e) for e in self._store.in_range(start_date, end_date)
        ]

    async def async_delete_event(
        self,
        uid: str,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Delete a reminder (e.g. from the calendar card or calendar.delete_event)."""
        await self._store.async_delete_event(uid)

    async def async_update_event(
        self,
        uid: str,
        event: CalendarEvent,
        recurrence_id: str | None = None,
        recurrence_range: str | None = None,
    ) -> None:
        """Update a reminder (e.g. from the calendar card or calendar.update_event)."""
        start = event.start if isinstance(event.start, datetime) else None
        await self._store.async_update_event(uid, summary=event.summary, start=start)
