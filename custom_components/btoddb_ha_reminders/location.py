"""
Pure location-reminder logic — no Home Assistant imports (LOC-1, LOC-2).

This module is deliberately HA-free so its tests run under plain pytest, mirroring
``delivery.py``. It owns the location-reminder shape and the zone-transition math: given
a person's old and new state strings and the value a person's state takes while inside a
target zone, decide whether the person just *entered* or *left* that zone.

The HA layer resolves a ``zone.*`` entity_id to the string a person's state takes inside
it (``"home"`` for the home zone, else the zone's friendly name) and passes it in as
``zone_value`` — keeping this module string-only and testable.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

ENTER = "enter"
LEAVE = "leave"

# Person/device_tracker states that mean "no usable location yet" — never treat a
# transition into or out of these as entering/leaving a zone (avoids spurious fires on
# startup or when a tracker drops offline).
_UNKNOWN_STATES = frozenset({"", "unknown", "unavailable", "none", "None"})


@dataclass(frozen=True)
class LocationReminder:
    """
    A single zone-based reminder.

    ``person`` and ``zone`` are entity_ids (e.g. ``person.todd``, ``zone.work``).
    ``trigger`` is :data:`ENTER` or :data:`LEAVE`. ``delivered_at`` is ``None`` until
    the reminder fires, then a timezone-aware local datetime (one-shot — LOC-3).

    When ``persistent`` is ``True`` the reminder is never marked delivered — it re-fires
    on every matching zone transition, like a recurring time-based reminder.
    """

    uid: str
    summary: str
    person: str
    zone: str
    trigger: str
    delivered_at: datetime | None = None
    persistent: bool = False


def transition_kind(
    old_state: str | None, new_state: str | None, zone_value: str
) -> str | None:
    """
    Classify a person state change relative to one zone.

    Returns :data:`ENTER` when the person just moved into ``zone_value``, :data:`LEAVE`
    when they just moved out, and ``None`` when there is no transition or either side is
    an unknown/unavailable state (LOC-1).
    """
    old = old_state if old_state not in _UNKNOWN_STATES else None
    new = new_state if new_state not in _UNKNOWN_STATES else None
    if old is None or new is None or old == new:
        return None
    if new == zone_value:
        return ENTER
    if old == zone_value:
        return LEAVE
    return None


def triggered(
    reminders: list[LocationReminder], person: str, kind: str
) -> list[LocationReminder]:
    """Undelivered reminders for ``person`` whose trigger matches ``kind`` (LOC-2)."""
    return [
        r
        for r in reminders
        if r.delivered_at is None and r.person == person and r.trigger == kind
    ]
