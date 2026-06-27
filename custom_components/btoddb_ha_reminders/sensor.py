"""
Sensor platform — ``sensor.btoddb_reminders_location`` (LOC-6).

A read surface the dashboard card consumes: its state is the number of undelivered
location reminders and its ``reminders`` attribute is the full list (undelivered plus
delivered-within-retention). The card reads the list straight off the entity attributes
and re-renders when the entity updates — the same "watch ``last_updated``" pattern it
already uses for the calendar entity, so no extra REST/websocket round-trip is needed.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.sensor import SensorEntity

from .const import DATA_LOCATION_STORE, DOMAIN

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.entity_platform import AddEntitiesCallback

    from .location_store import LocationReminderStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the location-reminders sensor entity from a config entry."""
    store: LocationReminderStore = hass.data[DOMAIN][entry.entry_id][
        DATA_LOCATION_STORE
    ]
    async_add_entities([LocationRemindersSensor(store, entry)])


class LocationRemindersSensor(SensorEntity):
    """Exposes location reminders to the card via state (count) + attributes (list)."""

    _attr_has_entity_name = False
    _attr_name = "BToddB Location Reminders"
    _attr_icon = "mdi:map-marker-radius"
    _attr_should_poll = False

    def __init__(self, store: LocationReminderStore, entry: ConfigEntry) -> None:
        """Initialize bound to the location store and owning config entry."""
        self._store = store
        self._attr_unique_id = f"{entry.entry_id}_location"

    async def async_added_to_hass(self) -> None:
        """Refresh the entity whenever the store changes."""
        self.async_on_remove(self._store.async_add_listener(self.async_write_ha_state))

    @property
    def native_value(self) -> int:
        """Count of undelivered location reminders."""
        return sum(1 for e in self._store.events if e.delivered_at is None)

    @property
    def extra_state_attributes(self) -> dict:
        """The full reminder list (undelivered + delivered-within-retention)."""
        return {
            # Stable marker so the card can find this sensor even if it's renamed in the
            # entity registry, instead of hard-coding the default entity_id.
            "btoddb_ha_reminders_location": True,
            "reminders": [
                {
                    "uid": e.uid,
                    "summary": e.summary,
                    "person": e.person,
                    "zone": e.zone,
                    "trigger": e.trigger,
                    "delivered_at": (
                        e.delivered_at.isoformat() if e.delivered_at else None
                    ),
                    "persistent": e.persistent,
                }
                for e in self._store.events
            ],
        }
