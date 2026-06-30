"""Spoken-time formatting cases (RM-9). HA-free."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from conftest import load_module

spoken_time = load_module("spoken_time")
build_create_response = spoken_time.build_create_response
build_update_response = spoken_time.build_update_response
format_spoken_time = spoken_time.format_spoken_time
format_recurrence = spoken_time.format_recurrence

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


def test_create_response_includes_clear_confirmation():
    assert build_create_response("use gemini on github", _at(2026, 6, 21, 9), NOW) == {
        "success": True,
        "message": "use gemini on github",
        "start": "today at 9 AM",
        "confirmation": "Reminder set for today at 9 AM: use gemini on github",
    }


def test_create_response_includes_rrule_when_supplied():
    assert build_create_response(
        "stand up", _at(2026, 6, 22, 9), NOW, "FREQ=DAILY"
    ) == {
        "success": True,
        "message": "stand up",
        "start": "every day at 9 AM",
        "confirmation": "Reminder set for every day at 9 AM: stand up",
        "rrule": "FREQ=DAILY",
    }


def test_create_response_recurrence_matches_the_issue_example():
    # "Remind me every day at 2 p.m. to stand up and stretch" should read back as a
    # repeating reminder, not a one-shot "today at 2 PM" (issue #53).
    assert build_create_response(
        "stand up and stretch", _at(2026, 6, 21, 14), NOW, "FREQ=DAILY"
    ) == {
        "success": True,
        "message": "stand up and stretch",
        "start": "every day at 2 PM",
        "confirmation": "Reminder set for every day at 2 PM: stand up and stretch",
        "rrule": "FREQ=DAILY",
    }


def test_update_response_includes_clear_confirmation():
    assert build_update_response("call mom", _at(2026, 6, 24, 18, 30), NOW) == {
        "success": True,
        "message": "call mom",
        "start": "Wednesday at 6:30 PM",
        "confirmation": "Reminder updated to Wednesday at 6:30 PM: call mom",
    }


def test_update_response_includes_rrule_when_supplied():
    assert build_update_response(
        "stand up", _at(2026, 6, 22, 9), NOW, "FREQ=DAILY"
    ) == {
        "success": True,
        "message": "stand up",
        "start": "every day at 9 AM",
        "confirmation": "Reminder updated to every day at 9 AM: stand up",
        "rrule": "FREQ=DAILY",
    }


def test_format_recurrence_daily():
    assert format_recurrence(_at(2026, 6, 22, 14), NOW, "FREQ=DAILY") == (
        "every day at 2 PM"
    )


def test_format_recurrence_weekly_with_byday():
    assert (
        format_recurrence(_at(2026, 6, 22, 9), NOW, "FREQ=WEEKLY;BYDAY=MO")
        == "every Monday at 9 AM"
    )


def test_format_recurrence_weekly_without_byday_uses_start_weekday():
    # 2026-06-24 is a Wednesday.
    assert format_recurrence(_at(2026, 6, 24, 18, 30), NOW, "FREQ=WEEKLY") == (
        "every Wednesday at 6:30 PM"
    )


def test_format_recurrence_is_case_insensitive():
    assert format_recurrence(_at(2026, 6, 22, 9), NOW, "freq=daily") == (
        "every day at 9 AM"
    )


def test_format_recurrence_falls_back_for_unsupported_freq():
    # FREQ=MONTHLY is rejected by delivery.validate_rrule today, but format_recurrence
    # should still degrade gracefully rather than raise.
    assert format_recurrence(_at(2026, 6, 22, 9), NOW, "FREQ=MONTHLY") == (
        format_spoken_time(_at(2026, 6, 22, 9), NOW)
    )
