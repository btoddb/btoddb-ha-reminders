"""
Pure delivery logic — no Home Assistant imports (RM-7, RM-7b).

This module is deliberately HA-free so its tests run under plain pytest. It owns the
reminder event shape and the watermark math: given the stored watermark and the set of
events, decide which ones are now due.
"""

from __future__ import annotations

import calendar
import dataclasses
import re
import uuid
from dataclasses import dataclass
from datetime import date, datetime, timedelta

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
    "FREQ=MONTHLY (with optional BYMONTHDAY=<1-28 or -1 for last day> or "
    "BYDAY=<1-4 or -1><MO/TU/WE/TH/FR/SA/SU>, e.g. 1FR for first Friday or -1FR for "
    "last Friday), all with optional INTERVAL=<positive integer>."
)
_DAILY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ", "INTERVAL"})
_WEEKLY_ALLOWED_KEYS: frozenset[str] = frozenset({"FREQ", "BYDAY", "INTERVAL"})
_MONTHLY_ALLOWED_KEYS: frozenset[str] = frozenset(
    {"FREQ", "BYMONTHDAY", "BYDAY", "INTERVAL"}
)

# Maximum BYMONTHDAY value that exists in every month.  29/30/31 are rejected because
# shorter months don't have those days.
_MAX_FIXED_BYMONTHDAY = 28
_UNSUPPORTED_FIXED_BYMONTHDAYS: frozenset[int] = frozenset({29, 30, 31})

# Steers users away from a fixed BYMONTHDAY that doesn't exist in every month
# (RFC 5545 would silently skip those months, which is surprising for a reminder).
_BYMONTHDAY_29_31_MSG = (
    "BYMONTHDAY=29/30/31 is not supported because not every month has that day; "
    "use BYMONTHDAY=-1 for 'last day of the month' instead."
)

# Monthly BYDAY ordinal-weekday form: 1-4 (1st-4th) or -1 (last), e.g. "1FR", "-1FR".
# The 5th occurrence is excluded because it does not exist in every month.
_MONTHLY_BYDAY_RE = re.compile(r"^(-1|[1-4])(MO|TU|WE|TH|FR|SA|SU)$")


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


def _last_day_of_month(year: int, month: int) -> int:
    """Return the number of days in ``year``-``month`` (handles leap years)."""
    return calendar.monthrange(year, month)[1]


def _nth_weekday_of_month(year: int, month: int, weekday: int, ordinal: int) -> int:
    """
    Return the day-of-month for the ``ordinal``-th occurrence of ``weekday``.

    ``ordinal`` is 1-4 for the 1st-4th occurrence, or -1 for the last occurrence.
    1-4 always exist in every month (a month is always at least 28 days = 4 full
    weeks); the 5th is deliberately unsupported since it doesn't.
    """
    last_day = _last_day_of_month(year, month)
    if ordinal == -1:
        for day in range(last_day, 0, -1):
            if date(year, month, day).weekday() == weekday:
                return day
    else:
        count = 0
        for day in range(1, last_day + 1):
            if date(year, month, day).weekday() == weekday:
                count += 1
                if count == ordinal:
                    return day
    msg = f"No occurrence #{ordinal} of weekday {weekday} in {year}-{month:02d}."
    raise ValueError(msg)


def _add_months(dt: datetime, months: int) -> tuple[int, int]:
    """Return ``(year, month)`` for ``dt``'s year/month advanced by ``months``."""
    total = dt.year * 12 + (dt.month - 1) + months
    year, month0 = divmod(total, 12)
    return year, month0 + 1


def _resolve_monthly_byday(parts: dict[str, str], year: int, month: int) -> int | None:
    """Resolve day-of-month from a monthly ``BYDAY`` ordinal-weekday."""
    byday = parts.get("BYDAY")
    if byday is None:
        return None
    match = _MONTHLY_BYDAY_RE.match(byday)
    if not match:
        return None
    ordinal = int(match.group(1))
    weekday = _BYDAY_TO_WEEKDAY[match.group(2)]
    return _nth_weekday_of_month(year, month, weekday, ordinal)


def _resolve_monthly_bymonthday(
    parts: dict[str, str], year: int, month: int
) -> int | None:
    """Resolve day-of-month from ``BYMONTHDAY`` (``-1`` = last day of month)."""
    bymonthday = parts.get("BYMONTHDAY")
    if bymonthday is None:
        return None
    try:
        n = int(bymonthday)
    except ValueError:
        return None
    if n == -1:
        return _last_day_of_month(year, month)
    if 1 <= n <= _MAX_FIXED_BYMONTHDAY:
        return n
    return None


def _resolve_monthly_day(
    parts: dict[str, str], year: int, month: int, anchor: datetime
) -> int | None:
    """Resolve the target day-of-month for a ``FREQ=MONTHLY`` rrule, or ``None``."""
    if "BYDAY" in parts:
        return _resolve_monthly_byday(parts, year, month)
    if "BYMONTHDAY" in parts:
        return _resolve_monthly_bymonthday(parts, year, month)
    # Bare FREQ=MONTHLY implies BYMONTHDAY=anchor.day, clipped to month length.
    return min(anchor.day, _last_day_of_month(year, month))


def next_occurrence(rrule: str, current: datetime) -> datetime | None:
    """
    Return the occurrence of ``rrule`` immediately following ``current``.

    Returns ``None`` if ``rrule`` is unsupported. ``DAILY``/``WEEKLY`` add a fixed
    ``timedelta`` (matches ``rrule_step``). ``MONTHLY`` adds ``INTERVAL`` months to
    ``current``'s year/month (with year rollover) and resolves the target day via
    ``BYMONTHDAY`` or ``BYDAY``, preserving the original wall-clock time and tzinfo.
    """
    parts = _parse_rrule_parts(rrule.upper())
    freq = parts.get("FREQ")
    try:
        interval = _interval(parts)
    except ValueError:
        return None
    if freq == "DAILY":
        return current + timedelta(days=interval)
    if freq == "WEEKLY":
        return current + timedelta(weeks=interval)
    if freq == "MONTHLY":
        year, month = _add_months(current, interval)
        day = _resolve_monthly_day(parts, year, month, current)
        if day is None:
            return None
        return current.replace(year=year, month=month, day=day)
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
    - ``FREQ=MONTHLY`` — advance by ``INTERVAL`` months per step (default 1); see
      ``next_occurrence`` for how the target day is resolved
    """
    if event.rrule is None:
        return None
    parts = _parse_rrule_parts(event.rrule.upper())
    if parts.get("FREQ") not in ("DAILY", "WEEKLY", "MONTHLY"):
        return None
    nxt = event.start
    while nxt <= now:
        candidate = next_occurrence(event.rrule, nxt)
        if candidate is None:
            return None
        nxt = candidate
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


def _validate_bymonthday_last_day(start: datetime) -> str | None:
    """Validate ``BYMONTHDAY=-1`` matches ``start`` being the last day of its month."""
    last_day = _last_day_of_month(start.year, start.month)
    if start.day != last_day:
        return (
            "BYMONTHDAY=-1 (last day of month) does not match the day of "
            f"'when' ({start.day}); set 'when' to day {last_day}."
        )
    return None


def _validate_bymonthday_fixed(start: datetime, n: int) -> str | None:
    """Validate a fixed ``BYMONTHDAY=n`` is in range and matches ``start``."""
    if n in _UNSUPPORTED_FIXED_BYMONTHDAYS:
        return _BYMONTHDAY_29_31_MSG
    if not 1 <= n <= _MAX_FIXED_BYMONTHDAY:
        return f"BYMONTHDAY must be 1-28 or -1, got {n}."
    if start.day != n:
        return (
            f"BYMONTHDAY={n} does not match the day of 'when' "
            f"({start.day}); set 'when' to day {n}."
        )
    return None


def _validate_bymonthday(parts: dict[str, str], start: datetime) -> str | None:
    """Validate ``BYMONTHDAY`` (or its implied form) is sane and matches ``start``."""
    bymonthday = parts.get("BYMONTHDAY")
    if bymonthday is None:
        # Bare FREQ=MONTHLY (no BYDAY either) implies BYMONTHDAY=start.day.
        if "BYDAY" not in parts and start.day > _MAX_FIXED_BYMONTHDAY:
            return _BYMONTHDAY_29_31_MSG
        return None
    try:
        n = int(bymonthday)
    except ValueError:
        return f"BYMONTHDAY must be an integer 1-28 or -1, got {bymonthday!r}."
    if n == -1:
        return _validate_bymonthday_last_day(start)
    return _validate_bymonthday_fixed(start, n)


def _validate_monthly_byday(parts: dict[str, str], start: datetime) -> str | None:
    """Validate a monthly ``BYDAY`` ordinal-weekday (e.g. ``1FR``, ``-1FR``)."""
    byday = parts.get("BYDAY")
    if byday is None:
        return None
    match = _MONTHLY_BYDAY_RE.match(byday)
    if not match:
        return (
            f"Unknown BYDAY value {byday!r} for FREQ=MONTHLY. Use an ordinal 1-4 "
            "or -1 followed by MO/TU/WE/TH/FR/SA/SU, e.g. 1FR (first Friday) or "
            "-1FR (last Friday)."
        )
    ordinal = int(match.group(1))
    weekday_code = match.group(2)
    expected_day = _nth_weekday_of_month(
        start.year, start.month, _BYDAY_TO_WEEKDAY[weekday_code], ordinal
    )
    if start.day != expected_day:
        ordinal_label = "last" if ordinal == -1 else f"#{ordinal}"
        return (
            f"BYDAY={byday} does not match 'when' ({start.date()}); set 'when' to "
            f"the {ordinal_label} {weekday_code} of that month (day {expected_day})."
        )
    return None


def _validate_monthly(parts: dict[str, str], start: datetime) -> str | None:
    """Validate the ``FREQ=MONTHLY``-specific parts of an rrule."""
    if "BYMONTHDAY" in parts and "BYDAY" in parts:
        return "BYMONTHDAY and BYDAY are mutually exclusive for FREQ=MONTHLY."
    return _validate_bymonthday(parts, start) or _validate_monthly_byday(parts, start)


def validate_rrule(rrule: str, start: datetime) -> str | None:
    """
    Validate an rrule string. Returns an error message, or ``None`` if valid.

    Supported:
    - ``FREQ=DAILY`` with optional ``INTERVAL=<positive integer>``
    - ``FREQ=WEEKLY`` with optional ``BYDAY=<MO|TU|WE|TH|FR|SA|SU>`` and optional
      ``INTERVAL=<positive integer>``
    - ``FREQ=MONTHLY`` with optional ``BYMONTHDAY=<1-28 or -1>`` or
      ``BYDAY=<1-4 or -1><MO|TU|WE|TH|FR|SA|SU>`` (mutually exclusive), and optional
      ``INTERVAL=<positive integer>``

    ``INTERVAL=N`` means "every Nth occurrence" (1 = every day/week/month, 2 = every
    other, 3 = every third, ...). Unknown keys (e.g. ``COUNT``, ``UNTIL``) are rejected
    so that the RRULE string matches the integration's actual roll-forward behaviour.

    For ``FREQ=WEEKLY;BYDAY=X``, the weekday of ``start`` must match ``X`` so that
    adding 7*INTERVAL days on each roll-forward keeps the event on the correct weekday.
    Similarly for ``FREQ=MONTHLY``, ``start`` must already land on the requested
    ``BYMONTHDAY``/``BYDAY`` so the stored anchor and the rrule agree. A fixed
    ``BYMONTHDAY=29/30/31`` is rejected (not every month has that day) in favor of
    ``BYMONTHDAY=-1`` ("last day of the month").
    """
    parts = _parse_rrule_parts(rrule.upper())
    freq = parts.get("FREQ")

    if freq == "DAILY":
        allowed = _DAILY_ALLOWED_KEYS
    elif freq == "WEEKLY":
        allowed = _WEEKLY_ALLOWED_KEYS
    elif freq == "MONTHLY":
        allowed = _MONTHLY_ALLOWED_KEYS
    else:
        return f"Unsupported rrule {rrule!r}. {_SUPPORTED_RRULE_MSG}"

    unknown = set(parts) - allowed
    if unknown:
        unknown_str = ", ".join(sorted(unknown))
        return f"Unknown RRULE part(s) {unknown_str!r}. {_SUPPORTED_RRULE_MSG}"

    err = _validate_interval(parts)
    if err is not None:
        return err
    if freq == "WEEKLY":
        return _validate_byday(parts, start)
    if freq == "MONTHLY":
        return _validate_monthly(parts, start)
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
