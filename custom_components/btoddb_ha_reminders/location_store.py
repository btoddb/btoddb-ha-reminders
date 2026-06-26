"""
Persistence for location/zone reminders (.storage/btoddb_ha_reminders_location).

Parallel to :class:`ReminderStore` but with its own storage key so the time-based store
needs no migration (LOC-4). The create/delete services, the sensor entity, and the zone
delivery handler all go through this class and never touch storage directly.
"""

from __future__ import annotations

import dataclasses
from typing import TYPE_CHECKING

from homeassistant.core import callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import STORAGE_KEY_LOCATION, STORAGE_VERSION_LOCATION
from .location import LocationReminder

if TYPE_CHECKING:
    from collections.abc import Callable
    from datetime import datetime

    from homeassistant.core import HomeAssistant


class LocationReminderStore:
    """In-memory location reminders, persisted to HA ``.storage``."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Bind to ``hass`` storage; call ``async_load`` to populate state."""
        self._store: Store = Store(hass, STORAGE_VERSION_LOCATION, STORAGE_KEY_LOCATION)
        self.events: list[LocationReminder] = []
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        """Load reminders from disk."""
        data = await self._store.async_load() or {}
        events: list[LocationReminder] = []
        for raw in data.get("events", []):
            raw_delivered = raw.get("delivered_at")
            delivered_at = (
                dt_util.parse_datetime(raw_delivered) if raw_delivered else None
            )
            events.append(
                LocationReminder(
                    uid=raw["uid"],
                    summary=raw["summary"],
                    person=raw["person"],
                    zone=raw["zone"],
                    trigger=raw["trigger"],
                    delivered_at=delivered_at,
                )
            )
        self.events = events

    @callback
    def _data(self) -> dict:
        return {
            "events": [
                {
                    "uid": e.uid,
                    "summary": e.summary,
                    "person": e.person,
                    "zone": e.zone,
                    "trigger": e.trigger,
                    "delivered_at": (
                        e.delivered_at.isoformat() if e.delivered_at else None
                    ),
                }
                for e in self.events
            ],
        }

    async def _async_persist(self) -> None:
        await self._store.async_save(self._data())
        for listener in self._listeners:
            listener()

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Register a callback fired after the store changes (refresh / resubscribe)."""
        self._listeners.append(listener)

        def _remove() -> None:
            self._listeners.remove(listener)

        return _remove

    async def async_add_event(self, event: LocationReminder) -> None:
        """Add a reminder and persist."""
        self.events.append(event)
        await self._async_persist()

    async def async_delete_event(self, uid: str) -> None:
        """Remove a reminder by uid and persist."""
        kept = [e for e in self.events if e.uid != uid]
        if len(kept) != len(self.events):
            self.events = kept
            await self._async_persist()

    async def async_update_event(
        self,
        uid: str,
        *,
        summary: str | None = None,
        person: str | None = None,
        zone: str | None = None,
        trigger: str | None = None,
    ) -> bool:
        """Update a location reminder by uid and persist. Returns True if found."""
        if summary is None and person is None and zone is None and trigger is None:
            return any(e.uid == uid for e in self.events)
        found = False
        updated: list[LocationReminder] = []
        for e in self.events:
            if e.uid == uid:
                found = True
                updated.append(
                    dataclasses.replace(
                        e,
                        summary=summary if summary is not None else e.summary,
                        person=person if person is not None else e.person,
                        zone=zone if zone is not None else e.zone,
                        trigger=trigger if trigger is not None else e.trigger,
                    )
                )
            else:
                updated.append(e)
        if found:
            self.events = updated
            await self._async_persist()
        return found

    async def async_mark_delivered(self, uid: str, when: datetime) -> None:
        """Stamp a reminder delivered (one-shot — LOC-3) and persist."""
        changed = False
        events: list[LocationReminder] = []
        for e in self.events:
            if e.uid == uid and e.delivered_at is None:
                events.append(
                    LocationReminder(
                        uid=e.uid,
                        summary=e.summary,
                        person=e.person,
                        zone=e.zone,
                        trigger=e.trigger,
                        delivered_at=when,
                    )
                )
                changed = True
            else:
                events.append(e)
        if changed:
            self.events = events
            await self._async_persist()

    async def async_prune(self, before: datetime) -> None:
        """Drop delivered reminders whose delivery time is older than ``before``."""
        kept = [
            e for e in self.events if e.delivered_at is None or e.delivered_at >= before
        ]
        if len(kept) != len(self.events):
            self.events = kept
            await self._async_persist()

    def tracked_persons(self) -> set[str]:
        """Person entity_ids referenced by undelivered reminders (for subscriptions)."""
        return {e.person for e in self.events if e.delivered_at is None}
