"""
Pure delivery logic — no Home Assistant imports (RM-7, RM-7b).

This module is deliberately HA-free so its tests run under plain pytest. It owns the
reminder event shape and the watermark math: given the stored watermark and the set of
events, decide which ones are now due.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

# Catch-up window is clamped to at most 6h in the past (RM-7b): a lost, corrupted, or
# never-initialized watermark can't flood the phone with a backlog of old reminders.
CATCHUP_FLOOR = timedelta(hours=6)

# A fresh/unknown watermark falls back to now - 2 minutes (RM-7) so a just-installed
# integration doesn't replay anything yet still catches a reminder due this minute.
FRESH_FALLBACK = timedelta(minutes=2)


@dataclass(frozen=True)
class ReminderEvent:
    """A single time-based reminder. ``start`` is a timezone-aware local datetime."""

    uid: str
    summary: str
    start: datetime


def effective_watermark(stored: datetime | None, now: datetime) -> datetime:
    """
    Resolve the effective lower bound of the delivery window.

    ``max(stored_or_fallback, now - 6h)`` — the 6h floor (RM-7b) only kicks in when the
    stored watermark is older than that or missing entirely (RM-7).
    """
    base = stored if stored is not None else now - FRESH_FALLBACK
    floor = now - CATCHUP_FLOOR
    return max(floor, base)


def due_events(
    events: list[ReminderEvent], watermark: datetime, now: datetime
) -> list[ReminderEvent]:
    """Return events whose start falls in the half-open window ``(watermark, now]``."""
    return [e for e in events if watermark < e.start <= now]
