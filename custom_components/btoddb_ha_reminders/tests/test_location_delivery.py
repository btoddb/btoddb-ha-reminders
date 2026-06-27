"""
Delivery gating for location reminders (LOC-1, LOC-3).

Exercises the real ``LocationDelivery._handle_state_change`` plus
``async_send_notification`` against lightweight fakes for hass/store/entry (the HA test
harness, pytest-homeassistant-custom-component, isn't installed). The key guarantee: a
reminder is crossed off **only** when the notify call actually succeeds — a failed push
must leave it pending so it can fire on a later transition.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
from dataclasses import replace
from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace

from conftest import load_module

location = load_module("location")
LocationReminder = location.LocationReminder

NOW = datetime(2026, 6, 21, 12, 0, tzinfo=UTC)


def _load_package():
    """Load the integration ``__init__.py`` as a package (it uses relative imports)."""
    name = "btoddb_ha_reminders_pkg"
    if name in sys.modules:
        return sys.modules[name]
    pkg_init = Path(__file__).resolve().parent.parent / "__init__.py"
    spec = importlib.util.spec_from_file_location(
        name, pkg_init, submodule_search_locations=[str(pkg_init.parent)]
    )
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


pkg = _load_package()


class _FakeServices:
    def __init__(self, *, fail: bool) -> None:
        self.fail = fail
        self.calls: list[tuple] = []

    async def async_call(self, domain, service, data, blocking) -> None:
        self.calls.append((domain, service, data, blocking))
        if self.fail:
            msg = "notify service unavailable"
            raise RuntimeError(msg)


class _FakeHass:
    def __init__(self, *, fail: bool) -> None:
        self.services = _FakeServices(fail=fail)
        self.states = SimpleNamespace(get=lambda _entity_id: None)


class _FakeStore:
    """Minimal stand-in for LocationReminderStore (handler only needs these bits)."""

    def __init__(self, events: list) -> None:
        self.events = events
        self.delivered: list[str] = []

    async def async_mark_delivered(self, uid: str, when: datetime) -> None:
        self.delivered.append(uid)
        self.events = [
            replace(e, delivered_at=when) if e.uid == uid else e for e in self.events
        ]


def _entry():
    # notify target resolves to ("notify", "foo"); options empty, data has the service.
    return SimpleNamespace(options={}, data={"notify_service": "notify.foo"})


def _enter_home_event(person="person.todd"):
    # zone.home short-circuits _zone_value to "home" with no states lookup needed.
    return SimpleNamespace(
        data={
            "entity_id": person,
            "old_state": SimpleNamespace(state="not_home"),
            "new_state": SimpleNamespace(state="home"),
        }
    )


def _reminder(persistent=False):
    return LocationReminder(
        uid="x",
        summary="grab keys",
        person="person.todd",
        zone="zone.home",
        trigger="enter",
        persistent=persistent,
    )


def test_send_notification_returns_true_on_success():
    hass = _FakeHass(fail=False)
    ok = asyncio.run(pkg.async_send_notification(hass, ("notify", "foo"), "t", "m"))
    assert ok is True
    assert len(hass.services.calls) == 1


def test_send_notification_returns_false_when_notify_raises():
    hass = _FakeHass(fail=True)
    ok = asyncio.run(pkg.async_send_notification(hass, ("notify", "foo"), "t", "m"))
    assert ok is False
    assert len(hass.services.calls) == 1  # it tried


def test_matching_transition_marks_delivered_on_success():
    hass = _FakeHass(fail=False)
    store = _FakeStore([_reminder()])
    delivery = pkg.LocationDelivery(hass, _entry(), store)
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    assert store.delivered == ["x"]
    assert len(hass.services.calls) == 1


def test_failed_notify_does_not_mark_delivered():
    hass = _FakeHass(fail=True)
    store = _FakeStore([_reminder()])
    delivery = pkg.LocationDelivery(hass, _entry(), store)
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    # It attempted the push but must NOT cross the reminder off.
    assert len(hass.services.calls) == 1
    assert store.delivered == []
    assert store.events[0].delivered_at is None


def test_persistent_reminder_not_marked_delivered_on_success():
    hass = _FakeHass(fail=False)
    store = _FakeStore([_reminder(persistent=True)])
    delivery = pkg.LocationDelivery(hass, _entry(), store)
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    # Notification was sent but the reminder must stay undelivered so it fires again.
    assert len(hass.services.calls) == 1
    assert store.delivered == []
    assert store.events[0].delivered_at is None


def test_persistent_reminder_fires_on_every_transition():
    hass = _FakeHass(fail=False)
    store = _FakeStore([_reminder(persistent=True)])
    delivery = pkg.LocationDelivery(hass, _entry(), store)
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    asyncio.run(delivery._handle_state_change(_enter_home_event()))
    assert len(hass.services.calls) == 3
    assert store.delivered == []
    assert store.events[0].delivered_at is None
