"""
Pure delivery logic — no Home Assistant imports (RM-7, RM-7b).

This module is deliberately HA-free so its tests run under plain pytest. It owns the
reminder event shape and the watermark math: given the stored watermark and the set of
events, decide which ones are now due.
"""

from __future__ import annotations

import dataclasses
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
    rrule: str | None = None


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


_BYDAY_TO_WEEKDAY: dict[str, int] = {
    "MO": 0,
    "TU": 1,
    "WE": 2,
    "TH": 3,
    "FR": 4,
    "SA": 5,
    "SU": 6,
}
_BYDAY_NAMES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]


def advance_recurring(event: ReminderEvent, now: datetime) -> ReminderEvent | None:
    """
    Return the next occurrence of a recurring reminder strictly after ``now``.

    Returns ``None`` if the event is not recurring or the rrule is unsupported.
    Loops from ``event.start`` until the next candidate is strictly past ``now``,
    so a missed occurrence (start slipped behind the watermark floor after an
    outage) self-heals to the nearest future slot instead of staying stuck.

    Supported RRULE prefixes:
    - ``FREQ=DAILY`` — advance by one day per step
    - ``FREQ=WEEKLY`` — advance by seven days per step; ``BYDAY`` is validated at
      create time so the start date is always on the correct weekday
    """
    if event.rrule is None:
        return None
    upper = event.rrule.upper()
    if "FREQ=DAILY" in upper:
        step = timedelta(days=1)
    elif "FREQ=WEEKLY" in upper:
        step = timedelta(weeks=1)
    else:
        return None
    nxt = event.start
    while nxt <= now:
        nxt += step
    return dataclasses.replace(event, start=nxt)


def validate_rrule(rrule: str, start: datetime) -> str | None:
    """
    Validate an rrule string. Returns an error message, or ``None`` if valid.

    Supported:
    - ``FREQ=DAILY``
    - ``FREQ=WEEKLY`` with optional ``BYDAY=<MO|TU|WE|TH|FR|SA|SU>``

    For ``FREQ=WEEKLY;BYDAY=X``, the weekday of ``start`` must match ``X`` so that
    adding 7 days on each roll-forward keeps the event on the correct weekday.
    """
    upper = rrule.upper()
    if "FREQ=DAILY" in upper:
        return None
    if "FREQ=WEEKLY" in upper:
        for part in upper.split(";"):
            if part.startswith("BYDAY="):
                byday = part[6:]
                if byday not in _BYDAY_TO_WEEKDAY:
                    return f"Unknown BYDAY value {byday!r}. Use MO/TU/WE/TH/FR/SA/SU."
                expected = _BYDAY_TO_WEEKDAY[byday]
                if start.weekday() != expected:
                    actual = _BYDAY_NAMES[start.weekday()]
                    return (
                        f"BYDAY={byday} does not match the weekday of 'when' "
                        f"({actual}); set 'when' to a {byday} date."
                    )
        return None
    return (
        f"Unsupported rrule {rrule!r}. "
        f"Supported: FREQ=DAILY, "
        f"FREQ=WEEKLY (with optional BYDAY=MO/TU/WE/TH/FR/SA/SU)."
    )


def resolve_notify_target(configured: str) -> tuple[str, str]:
    """Parse ``domain.service`` into ``(domain, service)``."""
    domain, _, service = configured.partition(".")
    return (domain or "notify"), (service or "notify")
