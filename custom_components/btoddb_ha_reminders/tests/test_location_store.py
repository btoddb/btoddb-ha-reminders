"""
Store-level tests for LocationReminderStore.async_update_event conversion path.

Tests the behaviour when a one-shot reminder is converted to persistent (and vice
versa) by verifying that ``async_update_event`` correctly toggles the flag and
resets ``delivered_at`` when needed.  HA storage is bypassed via a no-op
``_async_persist`` so no hass instance is required.
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
from datetime import UTC, datetime
from pathlib import Path

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
LocationReminderStore = pkg.LocationReminderStore


def _make_store(events: list[LocationReminder]) -> LocationReminderStore:
    """Minimal store with no-op persistence for unit testing."""
    store = object.__new__(LocationReminderStore)
    store.events = list(events)
    store._listeners = []

    async def _noop() -> None:
        pass

    store._async_persist = _noop
    return store


def _rem(
    uid: str = "r1",
    *,
    persistent: bool = False,
    delivered_at: datetime | None = None,
) -> LocationReminder:
    return LocationReminder(
        uid=uid,
        summary="test",
        person="person.todd",
        zone="zone.home",
        trigger="enter",
        persistent=persistent,
        delivered_at=delivered_at,
    )


# --- async_update_event ----------------------------------------------------------


def test_async_update_event_flips_persistent_flag():
    store = _make_store([_rem(persistent=False)])
    found = asyncio.run(store.async_update_event("r1", persistent=True))
    assert found is True
    assert store.events[0].persistent is True


def test_async_update_event_setting_persistent_true_resets_delivered_at():
    """Converting an already-fired one-shot to persistent must reactivate it."""
    store = _make_store([_rem(persistent=False, delivered_at=NOW)])
    found = asyncio.run(store.async_update_event("r1", persistent=True))
    assert found is True
    assert store.events[0].persistent is True
    assert store.events[0].delivered_at is None


def test_async_update_event_setting_persistent_false_preserves_delivered_at():
    """Turning off persistence on a delivered reminder keeps its delivered_at stamp."""
    store = _make_store([_rem(persistent=True, delivered_at=NOW)])
    found = asyncio.run(store.async_update_event("r1", persistent=False))
    assert found is True
    assert store.events[0].persistent is False
    assert store.events[0].delivered_at == NOW


def test_async_update_event_returns_false_for_unknown_uid():
    store = _make_store([_rem(uid="r1")])
    found = asyncio.run(store.async_update_event("unknown", persistent=True))
    assert found is False
    assert store.events[0].persistent is False
