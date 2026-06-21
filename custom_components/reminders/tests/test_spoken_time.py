"""Spoken-time formatting cases (RM-9). HA-free."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from conftest import load_module

format_spoken_time = load_module("spoken_time").format_spoken_time

# A fixed offset stands in for local time; only the wall-clock fields matter here.
TZ = timezone(timedelta(hours=-7))
# Sunday, 2026-06-21 09:00.
NOW = datetime(2026, 6, 21, 9, 0, tzinfo=TZ)


def _at(year, month, day, hour, minute=0):
    return datetime(year, month, day, hour, minute, tzinfo=TZ)


def test_on_the_hour_omits_minutes():
    assert format_spoken_time(_at(2026, 6, 21, 18), NOW) == "today at 6 PM"


def test_with_minutes_includes_them():
    assert format_spoken_time(_at(2026, 6, 22, 18, 30), NOW) == "tomorrow at 6:30 PM"


def test_today():
    assert format_spoken_time(_at(2026, 6, 21, 12), NOW) == "today at 12 PM"


def test_tomorrow():
    assert format_spoken_time(_at(2026, 6, 22, 18), NOW) == "tomorrow at 6 PM"


def test_weekday_name_two_to_six_days_out():
    # 2026-06-24 is a Wednesday, 3 days out.
    assert format_spoken_time(_at(2026, 6, 24, 18), NOW) == "Wednesday at 6 PM"


def test_weekday_with_month_day_beyond_a_week():
    # 2026-07-13 is a Monday, 22 days out.
    assert format_spoken_time(_at(2026, 7, 13, 18), NOW) == "Monday, July 13 at 6 PM"


def test_hour_strips_leading_zero():
    assert format_spoken_time(_at(2026, 6, 21, 6), NOW) == "today at 6 AM"


def test_midnight_and_noon():
    assert format_spoken_time(_at(2026, 6, 21, 0), NOW) == "today at 12 AM"
    assert format_spoken_time(_at(2026, 6, 21, 12, 5), NOW) == "today at 12:05 PM"
