"""Zone-transition classification + reminder filtering (LOC-1, LOC-2). HA-free."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from conftest import load_module

location = load_module("location")
LocationReminder = location.LocationReminder
transition_kind = location.transition_kind
triggered = location.triggered
ENTER = location.ENTER
LEAVE = location.LEAVE

NOW = datetime(2026, 6, 21, 12, 0, tzinfo=UTC)


def _rem(
    uid,
    person="person.todd",
    zone="zone.work",
    trigger=ENTER,
    delivered=None,
    persistent=False,
):
    return LocationReminder(
        uid=uid,
        summary=uid,
        person=person,
        zone=zone,
        trigger=trigger,
        delivered_at=delivered,
        persistent=persistent,
    )


# --- transition_kind -------------------------------------------------------------


def test_enter_named_zone():
    assert transition_kind("home", "Work", "Work") == ENTER


def test_leave_named_zone():
    assert transition_kind("Work", "not_home", "Work") == LEAVE


def test_home_zone_uses_home_state_string():
    # A person's state is the literal "home" for the home zone, not the friendly name.
    assert transition_kind("not_home", "home", "home") == ENTER
    assert transition_kind("home", "not_home", "home") == LEAVE


def test_unchanged_state_is_no_op():
    assert transition_kind("Work", "Work", "Work") is None


def test_transition_between_two_other_zones_is_not_a_match():
    # Moving from Store to Gym is neither entering nor leaving Work.
    assert transition_kind("Store", "Gym", "Work") is None


def test_unknown_old_state_ignored():
    assert transition_kind("unknown", "Work", "Work") is None


def test_unavailable_new_state_ignored():
    assert transition_kind("Work", "unavailable", "Work") is None


def test_missing_states_ignored():
    assert transition_kind(None, "Work", "Work") is None
    assert transition_kind("Work", None, "Work") is None


# --- triggered -------------------------------------------------------------------


def test_filters_by_person():
    reminders = [_rem("a", person="person.todd"), _rem("b", person="person.jane")]
    got = {r.uid for r in triggered(reminders, "person.todd", ENTER)}
    assert got == {"a"}


def test_filters_by_trigger_kind():
    reminders = [_rem("enter1", trigger=ENTER), _rem("leave1", trigger=LEAVE)]
    assert {r.uid for r in triggered(reminders, "person.todd", ENTER)} == {"enter1"}
    assert {r.uid for r in triggered(reminders, "person.todd", LEAVE)} == {"leave1"}


def test_already_delivered_excluded():
    reminders = [_rem("fresh"), _rem("done", delivered=NOW)]
    assert {r.uid for r in triggered(reminders, "person.todd", ENTER)} == {"fresh"}


def test_persistent_reminder_included_when_undelivered():
    # persistent=True with delivered_at=None behaves like a regular undelivered reminder
    reminders = [_rem("p", persistent=True)]
    assert {r.uid for r in triggered(reminders, "person.todd", ENTER)} == {"p"}


def test_persistent_reminder_excluded_when_delivered():
    # delivered_at should never be set on a persistent reminder (the store guards it),
    # but triggered() must still exclude any that somehow carry a timestamp so the
    # snapshot-in-storage case is handled correctly.
    reminders = [_rem("p", persistent=True, delivered=NOW)]
    assert triggered(reminders, "person.todd", ENTER) == []


# --- retention predicate (mirrors LocationReminderStore.async_prune) --------------


def test_prune_predicate_drops_old_delivered_keeps_recent_and_undelivered():
    before = NOW - timedelta(days=7)
    reminders = [
        _rem("undelivered"),
        _rem("recent", delivered=NOW - timedelta(days=1)),
        _rem("stale", delivered=NOW - timedelta(days=8)),
    ]
    kept = {
        r.uid for r in reminders if r.delivered_at is None or r.delivered_at >= before
    }
    assert kept == {"undelivered", "recent"}
