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
# Action ID prefix for the dismiss ("OK") button (RM-13).
# Format: BTODDB_HA_REMINDERS_OK__{uid}
SNOOZE_OK_ACTION_PREFIX = "BTODDB_HA_REMINDERS_OK"
# Notification tag prefix for per-reminder deduplication (RM-10).
SNOOZE_TAG_PREFIX = "BTODDB_HA_REMINDERS"

# A snooze action id is "{SNOOZE_ACTION_PREFIX}__{uid}__{minutes}" — exactly three
# segments once split on the "__" separator (RM-14).
_SNOOZE_ACTION_PARTS = 3

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
    "Supported: FREQ=DAILY, FREQ=WEEKLY (with optional BYDAY=MO/TU/WE/TH/FR/SA/SU), "
    "both with optional INTERVAL=<positive integer>."
)
_DAILY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ", "INTERVAL"})
_WEEKLY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ", "BYDAY", "INTERVAL"})


def _interval(parts: dict[str, str]) -> int:
    """Parse ``INTERVAL`` from already-validated rrule parts; defaults to 1."""
    raw = parts.get("INTERVAL")
    return int(raw) if raw is not None else 1


def rrule_step(rrule: str) -> timedelta | None:
    """
    Return the recurrence step for a supported RRULE string, or ``None``.

    Parses ``FREQ`` and ``INTERVAL`` (default 1). Used by both the delivery
    path and the calendar expansion path so they stay in sync.
    """
    parts = _parse_rrule_parts(rrule.upper())
    freq = parts.get("FREQ")
    try:
        interval = _interval(parts)
    except ValueError:
        return None
    if freq == "DAILY":
        return timedelta(days=interval)
    if freq == "WEEKLY":
        return timedelta(weeks=interval)
    return None


def advance_recurring(event: ReminderEvent, now: datetime) -> ReminderEvent | None:
    """
    Return the next occurrence of a recurring reminder strictly after ``now``.

    Returns ``None`` if the event is not recurring or the rrule is unsupported.
    Loops from ``event.start`` until the next candidate is strictly past ``now``,
    so a missed occurrence (start slipped behind the watermark floor after an
    outage) self-heals to the nearest future slot instead of staying stuck.

    Supported RRULE values:
    - ``FREQ=DAILY`` — advance by ``INTERVAL`` days per step (default 1)
    - ``FREQ=WEEKLY`` — advance by ``INTERVAL`` weeks per step (default 1); ``BYDAY``
      is validated at create time so the start date is always on the correct weekday,
      and stepping by whole weeks preserves it
    """
    if event.rrule is None:
        return None
    parts = _parse_rrule_parts(event.rrule.upper())
    freq = parts.get("FREQ")
    interval = _interval(parts)
    if freq == "DAILY":
        step = timedelta(days=interval)
    elif freq == "WEEKLY":
        step = timedelta(weeks=interval)
    else:
        return None
    nxt = event.start
    while nxt <= now:
        nxt += step
    return dataclasses.replace(event, start=nxt)


def _validate_interval(parts: dict[str, str]) -> str | None:
    """Validate ``INTERVAL`` is a positive integer, if present."""
    interval_raw = parts.get("INTERVAL")
    if interval_raw is None:
        return None
    try:
        valid = int(interval_raw) >= 1
    except ValueError:
        valid = False
    if not valid:
        return f"INTERVAL must be a positive integer, got {interval_raw!r}."
    return None


def _validate_byday(parts: dict[str, str], start: datetime) -> str | None:
    """Validate ``BYDAY`` matches the weekday of ``start``, if present."""
    byday = parts.get("BYDAY")
    if byday is None:
        return None
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


def validate_rrule(rrule: str, start: datetime) -> str | None:
    """
    Validate an rrule string. Returns an error message, or ``None`` if valid.

    Supported:
    - ``FREQ=DAILY`` with optional ``INTERVAL=<positive integer>``
    - ``FREQ=WEEKLY`` with optional ``BYDAY=<MO|TU|WE|TH|FR|SA|SU>`` and optional
      ``INTERVAL=<positive integer>``

    ``INTERVAL=N`` means "every Nth occurrence" (1 = every day/week, 2 = every other,
    3 = every third, ...). Unknown keys (e.g. ``COUNT``, ``UNTIL``) are rejected so that
    the RRULE string matches the integration's actual roll-forward behaviour.

    For ``FREQ=WEEKLY;BYDAY=X``, the weekday of ``start`` must match ``X`` so that
    adding 7*INTERVAL days on each roll-forward keeps the event on the correct weekday.
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

    return _validate_interval(parts) or (
        _validate_byday(parts, start) if freq == "WEEKLY" else None
    )


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
    actions.append({"action": f"{SNOOZE_OK_ACTION_PREFIX}__{uid}", "title": "OK"})
    return {
        "tag": f"{SNOOZE_TAG_PREFIX}__{uid}",
        "actions": actions,
    }


def parse_snooze_action(action: str) -> tuple[str, int] | None:
    """
    Parse a mobile snooze action id into ``(uid, minutes)`` (RM-14).

    Mirrors the id minted by ``build_snooze_notify_data``:
    ``{SNOOZE_ACTION_PREFIX}__{uid}__{minutes}``. Returns ``None`` — telling the event
    listener to ignore the tap — for any of the three non-snooze cases:

    - the action is not a snooze action (wrong/empty prefix, e.g. the "OK" button or
      another integration's action),
    - it is malformed (not exactly three ``__``-separated segments), or
    - its minutes segment is not an integer.
    """
    if not action.startswith(f"{SNOOZE_ACTION_PREFIX}__"):
        return None
    parts = action.split("__")
    if len(parts) != _SNOOZE_ACTION_PARTS:
        return None
    uid, minutes_str = parts[1], parts[2]
    try:
        minutes = int(minutes_str)
    except ValueError:
        return None
    return uid, minutes
