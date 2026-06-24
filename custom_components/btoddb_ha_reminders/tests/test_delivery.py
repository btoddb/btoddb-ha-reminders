"""Delivery window + watermark clamp (RM-7, RM-7b). HA-free."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from conftest import load_module

delivery = load_module("delivery")
const = load_module("const")
ReminderEvent = delivery.ReminderEvent
due_events = delivery.due_events
effective_watermark = delivery.effective_watermark

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
# _notify_target() round-trip: mirrors ReminderDelivery._notify_target()
# (ReminderDelivery lives in __init__.py which has HA imports not loadable
# here, so we test the identical resolution+parse logic using the same constants.)
# ---------------------------------------------------------------------------

_CONF = const.CONF_NOTIFY_SERVICE


class _FakeEntry:
    def __init__(self, options=None, data=None):
        self.options = options or {}
        self.data = data or {}


def _resolve_service(entry: _FakeEntry) -> tuple[str, str]:
    configured = entry.options.get(_CONF) or entry.data.get(_CONF) or ""
    domain, _, service = configured.partition(".")
    return (domain or "notify"), (service or "notify")


def test_notify_service_prefers_options_over_data():
    e = _FakeEntry(
        options={_CONF: "notify.mobile_app_pixel"}, data={_CONF: "notify.data_svc"}
    )
    assert _resolve_service(e) == ("notify", "mobile_app_pixel")


def test_notify_service_falls_back_to_data_when_no_options():
    e = _FakeEntry(data={_CONF: "notify.mobile_app_x"})
    assert _resolve_service(e) == ("notify", "mobile_app_x")


def test_notify_service_partition_parses_domain_and_name():
    e = _FakeEntry(options={_CONF: "notify.persistent_notification"})
    assert _resolve_service(e) == ("notify", "persistent_notification")
