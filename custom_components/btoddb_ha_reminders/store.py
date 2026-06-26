"""
Persistence for reminder events and the delivery watermark (.storage/reminders).

This is the storage **seam**: the create service, the calendar entity, and the
delivery loop all go through ``ReminderStore`` and never touch storage directly. A
future "use an existing calendar" option (see the proposal in the README) becomes a
swap of this class behind the same interface, with no change to its callers.

Storing the watermark here (rather than in an ``input_datetime`` helper) is what makes
RM-7a moot: a ``Store`` value is durable and restored on load by construction, so the
"watermark must have no initial value" gotcha simply doesn't exist.
"""

from __future__ import annotations

import dataclasses
from typing import TYPE_CHECKING

from homeassistant.core import callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import STORAGE_KEY, STORAGE_VERSION
from .delivery import ReminderEvent

if TYPE_CHECKING:
    from collections.abc import Callable
    from datetime import datetime

    from homeassistant.core import HomeAssistant


class ReminderStore:
    """In-memory reminder events + watermark, persisted to HA ``.storage``."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Bind to ``hass`` storage; call ``async_load`` to populate state."""
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.events: list[ReminderEvent] = []
        self.watermark: datetime | None = None
        self._listeners: list[Callable[[], None]] = []

    async def async_load(self) -> None:
        """Load events and watermark from disk."""
        data = await self._store.async_load() or {}
        events: list[ReminderEvent] = []
        for raw in data.get("events", []):
            start = dt_util.parse_datetime(raw.get("start", ""))
            if start is None:
                continue
            events.append(
                ReminderEvent(uid=raw["uid"], summary=raw["summary"], start=start)
            )
        self.events = events
        raw_wm = data.get("watermark")
        self.watermark = dt_util.parse_datetime(raw_wm) if raw_wm else None

    @callback
    def _data(self) -> dict:
        return {
            "events": [
                {"uid": e.uid, "summary": e.summary, "start": e.start.isoformat()}
                for e in self.events
            ],
            "watermark": self.watermark.isoformat() if self.watermark else None,
        }

    async def _async_persist(self) -> None:
        await self._store.async_save(self._data())
        for listener in self._listeners:
            listener()

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        """Register a callback fired after the store changes (e.g. entity refresh)."""
        self._listeners.append(listener)

        def _remove() -> None:
            self._listeners.remove(listener)

        return _remove

    async def async_add_event(self, event: ReminderEvent) -> None:
        """Add a reminder and persist."""
        self.events.append(event)
        await self._async_persist()

    async def async_set_watermark(self, watermark: datetime) -> None:
        """Advance the delivery watermark and persist."""
        self.watermark = watermark
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
        start: datetime | None = None,
    ) -> bool:
        """Update a reminder by uid and persist. Returns True if found."""
        if summary is None and start is None:
            return any(e.uid == uid for e in self.events)
        found = False
        updated: list[ReminderEvent] = []
        for e in self.events:
            if e.uid == uid:
                found = True
                updated.append(
                    dataclasses.replace(
                        e,
                        summary=summary if summary is not None else e.summary,
                        start=start if start is not None else e.start,
                    )
                )
            else:
                updated.append(e)
        if found:
            self.events = updated
            await self._async_persist()
        return found

    async def async_prune(self, before: datetime) -> None:
        """Drop already-delivered events older than ``before`` to bound storage."""
        kept = [e for e in self.events if e.start >= before]
        if len(kept) != len(self.events):
            self.events = kept
            await self._async_persist()

    def in_range(self, start: datetime, end: datetime) -> list[ReminderEvent]:
        """Events whose start falls within ``[start, end]`` (calendar entity query)."""
        return [e for e in self.events if start <= e.start <= end]
