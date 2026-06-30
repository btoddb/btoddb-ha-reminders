"""
Pure spoken-time formatting — no Home Assistant imports (RM-9, NL-11).

Renders a reminder's start as a natural spoken-language string ("tomorrow at 6 PM")
rather than a raw datetime, so the conversation agent can echo it verbatim instead of
reading an ISO/digit-clock form aloud. Ported from the Jinja in the original
``script.create_reminder`` (scripts.yaml).
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

# Beyond this many days out, a bare weekday name is ambiguous (could be more than
# one occurrence), so the month/day is spelled out too.
WEEKDAY_NAME_HORIZON_DAYS = 7

# RRULE BYDAY codes to spoken weekday names. Mirrors the BYDAY set accepted by
# ``delivery.validate_rrule``; kept local so this module stays HA/engine-import-free.
_BYDAY_TO_NAME: dict[str, str] = {
    "MO": "Monday",
    "TU": "Tuesday",
    "WE": "Wednesday",
    "TH": "Thursday",
    "FR": "Friday",
    "SA": "Saturday",
    "SU": "Sunday",
}


def _format_clock(dt: datetime) -> str:
    """Spoken clock time — "6 PM" on the hour, "6:30 PM" otherwise."""
    minute = dt.strftime("%M")
    hour = int(dt.strftime("%I"))
    meridiem = dt.strftime("%p")
    return f"{hour} {meridiem}" if minute == "00" else f"{hour}:{minute} {meridiem}"


def format_spoken_time(dt: datetime, now: datetime) -> str:
    """
    Format ``dt`` relative to ``now`` as a spoken-language time string.

    - Minutes are omitted on the hour ("6 PM", not "6:00 PM").
    - "today" / "tomorrow" for 0 / 1 days out.
    - A bare weekday name for 2-6 days out ("Monday at 6 PM").
    - Weekday plus month/day beyond a week ("Monday, July 13 at 6 PM"), since a bare
      weekday name is ambiguous once it could refer to more than one occurrence.

    Both arguments are expected to be timezone-aware local datetimes.
    """
    clock = _format_clock(dt)

    days_out = (dt.date() - now.date()).days
    if days_out == 0:
        day = "today"
    elif days_out == 1:
        day = "tomorrow"
    elif days_out < WEEKDAY_NAME_HORIZON_DAYS:
        day = dt.strftime("%A")
    else:
        day = dt.strftime("%A, %B ") + str(dt.day)

    return f"{day} at {clock}"


# Ordinal words for INTERVAL spoken phrasing ("every other week", "every third week").
# INTERVAL=1 never reaches this map; that's the bare "every ___" case.
_INTERVAL_ORDINALS: dict[int, str] = {
    2: "other",
    3: "third",
    4: "fourth",
    5: "fifth",
    6: "sixth",
    7: "seventh",
    8: "eighth",
    9: "ninth",
    10: "tenth",
}

# English ordinal suffixes are "th" for the teens (11th-20th), regardless of the
# trailing digit (which would otherwise suggest "st"/"nd"/"rd" for 11/12/13).
_ORDINAL_TEENS_LOW = 10
_ORDINAL_TEENS_HIGH = 20


def _ordinal(n: int) -> str:
    """Spoken ordinal for an arbitrary INTERVAL, e.g. 11 -> "11th", 22 -> "22nd"."""
    word = _INTERVAL_ORDINALS.get(n)
    if word is not None:
        return word
    if _ORDINAL_TEENS_LOW <= n % 100 <= _ORDINAL_TEENS_HIGH:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def _interval_prefix(interval: int) -> str:
    """Cadence prefix: "every", "every other", "every third", "every 11th", etc."""
    if interval <= 1:
        return "every"
    return f"every {_ordinal(interval)}"


def format_recurrence(start: datetime, now: datetime, rrule: str) -> str:
    """
    Render a recurring reminder's cadence ("every day at 2 PM", "every other week...").

    Covers the rrule shapes the engine actually accepts (``FREQ=DAILY`` and
    ``FREQ=WEEKLY`` with optional ``BYDAY``, both with optional ``INTERVAL`` — see
    ``delivery.validate_rrule``); anything else falls back to the one-shot spoken
    time for ``start``.
    """
    parts: dict[str, str] = {}
    for token in rrule.upper().split(";"):
        if "=" in token:
            key, _, value = token.partition("=")
            parts[key.strip()] = value.strip()

    clock = _format_clock(start)
    freq = parts.get("FREQ")
    interval_raw = parts.get("INTERVAL")
    interval = int(interval_raw) if interval_raw else 1
    prefix = _interval_prefix(interval)
    if freq == "DAILY":
        return f"{prefix} day at {clock}"
    if freq == "WEEKLY":
        byday = parts.get("BYDAY")
        weekday = _BYDAY_TO_NAME.get(byday) if byday else None
        if weekday is None:
            weekday = start.strftime("%A")
        return f"{prefix} {weekday} at {clock}"

    return format_spoken_time(start, now)


def _build_response(
    message: str,
    start: datetime,
    now: datetime,
    confirmation_prefix: str,
    rrule: str | None = None,
) -> dict[str, object]:
    """Build the service response handed back to conversation agents."""
    spoken_start = (
        format_recurrence(start, now, rrule)
        if rrule is not None
        else format_spoken_time(start, now)
    )
    response: dict[str, object] = {
        "success": True,
        "message": message,
        "start": spoken_start,
        "confirmation": f"{confirmation_prefix} {spoken_start}: {message}",
    }
    if rrule is not None:
        response["rrule"] = rrule
    return response


def build_create_response(
    message: str, start: datetime, now: datetime, rrule: str | None = None
) -> dict[str, object]:
    """Build the create service response handed back to conversation agents."""
    return _build_response(message, start, now, "Reminder set for", rrule)


def build_update_response(
    message: str, start: datetime, now: datetime, rrule: str | None = None
) -> dict[str, object]:
    """Build the update service response handed back to conversation agents."""
    return _build_response(message, start, now, "Reminder updated to", rrule)
