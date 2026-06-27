"""
Pure delivery logic — no Home Assistant imports (RM-7, RM-7b).

This module is deliberately HA-free so its tests run under plain pytest. It owns the
reminder event shape and the watermark math: given the stored watermark and the set of
events, decide which ones are now due.
"""

from __future__ import annotations

import dataclasses
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta

# Action ID prefix embedded in mobile notification snooze buttons (RM-13).
# Format: BTODDB_HA_REMINDERS_SNOOZE__{uid}__{minutes}
SNOOZE_ACTION_PREFIX = "BTODDB_HA_REMINDERS_SNOOZE"
# Notification tag prefix for per-reminder deduplication (RM-10).
SNOOZE_TAG_PREFIX = "BTODDB_HA_REMINDERS"

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


def _parse_rrule_parts(upper: str) -> dict[str, str]:
    """Parse a semicolon-separated RRULE string into a ``KEY -> VALUE`` dict."""
    parts: dict[str, str] = {}
    for token in upper.split(";"):
        if "=" in token:
            key, _, value = token.partition("=")
            parts[key.strip()] = value.strip()
    return parts


_SUPPORTED_RRULE_MSG = (
    "Supported: FREQ=DAILY, FREQ=WEEKLY (with optional BYDAY=MO/TU/WE/TH/FR/SA/SU)."
)
_DAILY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ"})
_WEEKLY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ", "BYDAY"})


def advance_recurring(event: ReminderEvent, now: datetime) -> ReminderEvent | None:
    """
    Return the next occurrence of a recurring reminder strictly after ``now``.

    Returns ``None`` if the event is not recurring or the rrule is unsupported.
    Loops from ``event.start`` until the next candidate is strictly past ``now``,
    so a missed occurrence (start slipped behind the watermark floor after an
    outage) self-heals to the nearest future slot instead of staying stuck.

    Supported RRULE values:
    - ``FREQ=DAILY`` — advance by one day per step
    - ``FREQ=WEEKLY`` — advance by seven days per step; ``BYDAY`` is validated at
      create time so the start date is always on the correct weekday
    """
    if event.rrule is None:
        return None
    parts = _parse_rrule_parts(event.rrule.upper())
    freq = parts.get("FREQ")
    if freq == "DAILY":
        step = timedelta(days=1)
    elif freq == "WEEKLY":
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

    Unknown keys (e.g. ``INTERVAL``, ``COUNT``, ``UNTIL``) are rejected so that
    the RRULE string matches the integration's actual roll-forward behaviour.

    For ``FREQ=WEEKLY;BYDAY=X``, the weekday of ``start`` must match ``X`` so that
    adding 7 days on each roll-forward keeps the event on the correct weekday.
    """
    parts = _parse_rrule_parts(rrule.upper())
    freq = parts.get("FREQ")

    if freq == "DAILY":
        allowed = _DAILY_ALLOWED_KEYS
    elif freq == "WEEKLY":
        allowed = _WEEKLY_ALLOWED_KEYS
    else:
        return f"Unsupported rrule {rrule!r}. {_SUPPORTED_RRULE_MSG}"

    unknown = set(parts) - allowed
    if unknown:
        unknown_str = ", ".join(sorted(unknown))
        return f"Unknown RRULE part(s) {unknown_str!r}. {_SUPPORTED_RRULE_MSG}"

    if freq == "WEEKLY":
        byday = parts.get("BYDAY")
        if byday is not None:
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


def resolve_notify_target(configured: str) -> tuple[str, str]:
    """Parse ``domain.service`` into ``(domain, service)``."""
    domain, _, service = configured.partition(".")
    return (domain or "notify"), (service or "notify")


def snoozed_event(
    original: ReminderEvent, now: datetime, minutes: int
) -> ReminderEvent:
    """
    Return a new one-shot copy of ``original`` set to fire ``minutes`` after ``now``.

    The summary is preserved; a fresh uid is assigned so both events are independent
    in the store.  rrule is always cleared — fires exactly once (RM-11).
    """
    return ReminderEvent(
        uid=uuid.uuid4().hex,
        summary=original.summary,
        start=now + timedelta(minutes=minutes),
        rrule=None,
    )


_MINUTES_PER_HOUR = 60


def _snooze_button_label(minutes: int) -> str:
    """Short human-readable label for a snooze action button."""
    if minutes >= _MINUTES_PER_HOUR and minutes % _MINUTES_PER_HOUR == 0:
        return f"Snooze {minutes // _MINUTES_PER_HOUR}h"
    return f"Snooze {minutes} min"


def build_snooze_notify_data(
    uid: str, snooze_durations: list[int]
) -> dict[str, object]:
    """
    Build the ``data`` additions for an actionable snooze notification (RM-10).

    Returns a dict with ``tag`` and ``actions`` to merge into the base NOTIFY_DATA.
    The ``actions`` / ``tag`` keys are honoured only by the HA Companion mobile app;
    other notify targets silently ignore them (RM-15).
    """
    actions: list[dict[str, str]] = [
        {
            "action": f"{SNOOZE_ACTION_PREFIX}__{uid}__{minutes}",
            "title": _snooze_button_label(minutes),
        }
        for minutes in snooze_durations
    ]
    actions.append({"action": f"BTODDB_HA_REMINDERS_OK__{uid}", "title": "OK"})
    return {
        "tag": f"{SNOOZE_TAG_PREFIX}__{uid}",
        "actions": actions,
    }
