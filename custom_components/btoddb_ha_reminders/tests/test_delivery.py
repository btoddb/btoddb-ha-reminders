"""Delivery window + watermark clamp (RM-7, RM-7b). HA-free."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from conftest import load_module

delivery = load_module("delivery")
const = load_module("const")
ReminderEvent = delivery.ReminderEvent
due_events = delivery.due_events
effective_watermark = delivery.effective_watermark
resolve_notify_target = delivery.resolve_notify_target
advance_recurring = delivery.advance_recurring
validate_rrule = delivery.validate_rrule
snoozed_event = delivery.snoozed_event
build_snooze_notify_data = delivery.build_snooze_notify_data
SNOOZE_ACTION_PREFIX = delivery.SNOOZE_ACTION_PREFIX
SNOOZE_TAG_PREFIX = delivery.SNOOZE_TAG_PREFIX

TZ = UTC
NOW = datetime(2026, 6, 21, 12, 0, tzinfo=TZ)


def _ev(uid, minutes_from_now):
    return ReminderEvent(
        uid=uid, summary=uid, start=NOW + timedelta(minutes=minutes_from_now)
    )


def test_missing_watermark_falls_back_two_minutes():
    # Fresh/unknown watermark -> now - 2m (RM-7), well inside the 6h floor.
    assert effective_watermark(None, NOW) == NOW - timedelta(minutes=2)


def test_recent_watermark_passes_through():
    stored = NOW - timedelta(minutes=30)
    assert effective_watermark(stored, NOW) == stored


def test_old_watermark_clamped_to_six_hours():
    stored = NOW - timedelta(hours=20)
    assert effective_watermark(stored, NOW) == NOW - timedelta(hours=6)


def test_due_window_is_half_open():
    watermark = NOW - timedelta(minutes=5)
    events = [
        _ev("at_watermark", -5),  # == watermark -> excluded
        _ev("between", -2),  # -> included
        _ev("at_now", 0),  # == now -> included
        _ev("future", 5),  # > now -> excluded
    ]
    got = {e.uid for e in due_events(events, watermark, NOW)}
    assert got == {"between", "at_now"}


def test_nothing_due_returns_empty():
    watermark = NOW - timedelta(minutes=2)
    events = [_ev("future", 10)]
    assert due_events(events, watermark, NOW) == []


# ---------------------------------------------------------------------------
# resolve_notify_target() round-trip — the HA-free helper used by
# ReminderDelivery._notify_target() in __init__.py.
# ---------------------------------------------------------------------------

_CONF = const.CONF_NOTIFY_SERVICE


def test_resolve_notify_target_parses_domain_and_service():
    assert resolve_notify_target("notify.mobile_app_pixel") == (
        "notify",
        "mobile_app_pixel",
    )


def test_resolve_notify_target_defaults_service_when_empty():
    assert resolve_notify_target("") == ("notify", "notify")


def test_resolve_notify_target_parses_persistent_notification():
    assert resolve_notify_target("notify.persistent_notification") == (
        "notify",
        "persistent_notification",
    )


# ---------------------------------------------------------------------------
# advance_recurring() — roll-forward for recurring reminders.
# ---------------------------------------------------------------------------


def _recurring_ev(rrule):
    return ReminderEvent(uid="r1", summary="medicine", start=NOW, rrule=rrule)


def test_advance_recurring_returns_none_for_one_shot():
    event = ReminderEvent(uid="1", summary="one-shot", start=NOW)
    assert advance_recurring(event, NOW) is None


def test_advance_recurring_daily_adds_one_day():
    event = _recurring_ev("FREQ=DAILY")
    nxt = advance_recurring(event, NOW)
    assert nxt is not None
    assert nxt.start == NOW + timedelta(days=1)
    assert nxt.uid == event.uid
    assert nxt.summary == event.summary
    assert nxt.rrule == event.rrule


def test_advance_recurring_weekly_adds_seven_days():
    event = _recurring_ev("FREQ=WEEKLY;BYDAY=SU")
    nxt = advance_recurring(event, NOW)
    assert nxt is not None
    assert nxt.start == NOW + timedelta(weeks=1)
    assert nxt.rrule == event.rrule


def test_advance_recurring_weekly_all_byday_values():
    for day in ("MO", "TU", "WE", "TH", "FR", "SA", "SU"):
        event = _recurring_ev(f"FREQ=WEEKLY;BYDAY={day}")
        nxt = advance_recurring(event, NOW)
        assert nxt is not None
        assert nxt.start == NOW + timedelta(weeks=1)


def test_advance_recurring_unknown_rrule_returns_none():
    event = _recurring_ev("FREQ=MONTHLY")
    assert advance_recurring(event, NOW) is None


def test_advance_recurring_preserves_uid_and_summary():
    event = ReminderEvent(
        uid="abc123", summary="take medicine", start=NOW, rrule="FREQ=DAILY"
    )
    nxt = advance_recurring(event, NOW)
    assert nxt is not None
    assert nxt.uid == "abc123"
    assert nxt.summary == "take medicine"


def test_advance_recurring_daily_self_heals_after_multi_day_outage():
    old_start = NOW - timedelta(days=2, hours=12)
    event = ReminderEvent(
        uid="r1", summary="medicine", start=old_start, rrule="FREQ=DAILY"
    )
    nxt = advance_recurring(event, NOW)
    assert nxt is not None
    assert nxt.start > NOW
    assert nxt.start == old_start + timedelta(days=3)


def test_advance_recurring_weekly_self_heals_after_multi_week_outage():
    old_start = NOW - timedelta(weeks=2, days=3)
    event = ReminderEvent(
        uid="r2", summary="trash", start=old_start, rrule="FREQ=WEEKLY;BYDAY=SU"
    )
    nxt = advance_recurring(event, NOW)
    assert nxt is not None
    assert nxt.start > NOW
    delta = nxt.start - old_start
    assert delta.seconds == 0
    assert delta.days % 7 == 0


# ---------------------------------------------------------------------------
# validate_rrule() — creation-time guard for unsupported/malformed rrules.
# ---------------------------------------------------------------------------

# NOW = 2026-06-21 12:00 UTC — a Sunday (weekday 6 = SU).


def test_validate_rrule_daily_ok():
    assert validate_rrule("FREQ=DAILY", NOW) is None


def test_validate_rrule_daily_case_insensitive():
    assert validate_rrule("freq=daily", NOW) is None


def test_validate_rrule_weekly_no_byday_ok():
    assert validate_rrule("FREQ=WEEKLY", NOW) is None


def test_validate_rrule_weekly_byday_match_ok():
    # NOW is a Sunday — SU should pass.
    assert validate_rrule("FREQ=WEEKLY;BYDAY=SU", NOW) is None


def test_validate_rrule_weekly_byday_mismatch_returns_error():
    # NOW is a Sunday; MO should fail.
    err = validate_rrule("FREQ=WEEKLY;BYDAY=MO", NOW)
    assert err is not None
    assert "MO" in err
    assert "SU" in err


def test_validate_rrule_unsupported_freq_returns_error():
    err = validate_rrule("FREQ=MONTHLY", NOW)
    assert err is not None
    assert "Unsupported" in err


def test_validate_rrule_typo_returns_error():
    err = validate_rrule("FRQ=DAILY", NOW)
    assert err is not None


def test_validate_rrule_unknown_byday_returns_error():
    err = validate_rrule("FREQ=WEEKLY;BYDAY=XX", NOW)
    assert err is not None
    assert "XX" in err


def test_validate_rrule_daily_with_interval_rejected():
    # INTERVAL is not honoured by advance_recurring; reject it explicitly.
    err = validate_rrule("FREQ=DAILY;INTERVAL=3", NOW)
    assert err is not None
    assert "INTERVAL" in err


def test_validate_rrule_daily_with_count_rejected():
    err = validate_rrule("FREQ=DAILY;COUNT=5", NOW)
    assert err is not None
    assert "COUNT" in err


def test_validate_rrule_weekly_with_interval_rejected():
    err = validate_rrule("FREQ=WEEKLY;BYDAY=SU;INTERVAL=2", NOW)
    assert err is not None
    assert "INTERVAL" in err


def test_validate_rrule_loose_substring_not_accepted():
    # "XFREQ=DAILYX" contains "FREQ=DAILY" as a substring but must NOT pass.
    err = validate_rrule("XFREQ=DAILYX", NOW)
    assert err is not None


def test_advance_recurring_daily_interval_ignored_returns_none():
    # After the fix, an rrule with INTERVAL is invalid at create time, but if one
    # somehow reaches advance_recurring, FREQ=DAILY is still honoured (only the
    # FREQ key drives the step; unknown parts are silently ignored here).
    event = ReminderEvent(
        uid="r1", summary="test", start=NOW, rrule="FREQ=DAILY;INTERVAL=3"
    )
    nxt = advance_recurring(event, NOW)
    # advance_recurring extracts FREQ=DAILY and advances by 1 day regardless.
    assert nxt is not None
    assert nxt.start == NOW + timedelta(days=1)


# ---------------------------------------------------------------------------
# snoozed_event() — one-shot copy at now + N minutes (RM-11).
# ---------------------------------------------------------------------------


def test_snoozed_event_start_is_now_plus_minutes():
    event = _ev("orig", 0)
    snoozed = snoozed_event(event, NOW, 15)
    assert snoozed.start == NOW + timedelta(minutes=15)


def test_snoozed_event_assigns_new_uid():
    event = _ev("orig", 0)
    snoozed = snoozed_event(event, NOW, 15)
    assert snoozed.uid != event.uid


def test_snoozed_event_uid_is_unique_across_calls():
    event = _ev("orig", 0)
    s1 = snoozed_event(event, NOW, 15)
    s2 = snoozed_event(event, NOW, 15)
    assert s1.uid != s2.uid


def test_snoozed_event_preserves_summary():
    event = ReminderEvent(uid="u", summary="take medicine", start=NOW)
    snoozed = snoozed_event(event, NOW, 30)
    assert snoozed.summary == "take medicine"


def test_snoozed_event_clears_rrule():
    event = ReminderEvent(uid="r", summary="s", start=NOW, rrule="FREQ=DAILY")
    snoozed = snoozed_event(event, NOW, 15)
    assert snoozed.rrule is None


def test_snoozed_event_one_shot_has_no_rrule():
    event = _ev("orig", 0)
    snoozed = snoozed_event(event, NOW, 60)
    assert snoozed.rrule is None


# ---------------------------------------------------------------------------
# build_snooze_notify_data() — actionable notification payload (RM-10).
# ---------------------------------------------------------------------------


def test_build_snooze_notify_data_tag():
    data = build_snooze_notify_data("uid123", [15, 60])
    assert data["tag"] == f"{SNOOZE_TAG_PREFIX}__uid123"


def test_build_snooze_notify_data_action_count():
    # 2 snooze durations + 1 OK button = 3 actions total
    data = build_snooze_notify_data("uid123", [15, 60])
    assert len(data["actions"]) == 3


def test_build_snooze_notify_data_action_ids():
    data = build_snooze_notify_data("uid123", [15])
    action_ids = [a["action"] for a in data["actions"]]
    assert f"{SNOOZE_ACTION_PREFIX}__uid123__15" in action_ids


def test_build_snooze_notify_data_ok_button_present():
    data = build_snooze_notify_data("uid123", [15])
    ok_actions = [a for a in data["actions"] if a["title"] == "OK"]
    assert len(ok_actions) == 1


def test_build_snooze_notify_data_minute_label():
    data = build_snooze_notify_data("u", [15])
    titles = [a["title"] for a in data["actions"]]
    assert "Snooze 15 min" in titles


def test_build_snooze_notify_data_hour_label():
    data = build_snooze_notify_data("u", [60])
    titles = [a["title"] for a in data["actions"]]
    assert "Snooze 1h" in titles


def test_build_snooze_notify_data_two_hour_label():
    data = build_snooze_notify_data("u", [120])
    titles = [a["title"] for a in data["actions"]]
    assert "Snooze 2h" in titles


def test_build_snooze_notify_data_non_round_hour_uses_minutes():
    # 90 minutes is not a round hour so it stays as minutes
    data = build_snooze_notify_data("u", [90])
    titles = [a["title"] for a in data["actions"]]
    assert "Snooze 90 min" in titles


def test_build_snooze_notify_data_empty_durations_only_ok():
    data = build_snooze_notify_data("u", [])
    assert len(data["actions"]) == 1
    assert data["actions"][0]["title"] == "OK"
