"""
Pure location-reminder logic — no Home Assistant imports (LOC-1, LOC-2).

This module is deliberately HA-free so its tests run under plain pytest, mirroring
``delivery.py``. It owns the location-reminder shape and the zone-transition math: given
a person's old and new state strings and the value a person's state takes while inside a
target zone, decide whether the person just *entered* or *left* that zone.

The HA layer resolves a ``zone.*`` entity_id to the string a person's state takes inside
it (``"home"`` for the home zone, else the zone's friendly name) and passes it in as
``zone_value`` — keeping this module string-only and testable.
"""

from __future__ import annotations

import difflib
import re
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

ENTER = "enter"
LEAVE = "leave"

# Person/device_tracker states that mean "no usable location yet" — never treat a
# transition into or out of these as entering/leaving a zone (avoids spurious fires on
# startup or when a tracker drops offline).
_UNKNOWN_STATES = frozenset({"", "unknown", "unavailable", "none", "None"})

# Fuzzy-matching thresholds for resolve_zone.
# A spoken name must score at least _THRESHOLD against the best candidate, and that
# candidate must lead the runner-up by at least _MARGIN — otherwise the match is
# ambiguous and we decline to guess.
_ZONE_MATCH_THRESHOLD = 0.72
_ZONE_MATCH_MARGIN = 0.08


def _normalize(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def resolve_zone(spoken: str, zones: dict[str, str]) -> str | None:
    """
    Match a spoken place name to a configured zone entity_id.

    ``zones`` maps entity_id → friendly_name (may be empty string if unknown).
    Three-tier matching:
    1. Exact entity_id match (e.g. the model already passed "zone.work").
    2. Exact normalized friendly-name or slug match (case/punctuation ignored).
    3. Fuzzy match via difflib above ``_ZONE_MATCH_THRESHOLD``, but only when the best
       candidate leads the runner-up by at least ``_ZONE_MATCH_MARGIN``; otherwise the
       match is ambiguous and ``None`` is returned.

    Returns the matched entity_id, or ``None`` when nothing matches well enough or the
    result is genuinely ambiguous.
    """
    if not spoken or not zones:
        return None

    # Tier 1: exact entity_id
    if spoken in zones:
        return spoken

    norm_spoken = _normalize(spoken)

    # Pre-compute normalized forms (name and slug) for every zone.
    norms: list[tuple[str, str, str]] = []
    for entity_id, friendly_name in zones.items():
        slug = entity_id.split(".", 1)[-1]
        norm_name = _normalize(friendly_name) if friendly_name else ""
        norm_slug = _normalize(slug)
        norms.append((entity_id, norm_name, norm_slug))

    # Tier 2: exact normalized match against friendly name or slug
    for entity_id, norm_name, norm_slug in norms:
        if norm_spoken in (norm_name, norm_slug):
            return entity_id

    # Tier 3: fuzzy match — take the best of name vs slug score for each zone
    scores: list[tuple[float, str]] = []
    for entity_id, norm_name, norm_slug in norms:
        score_name = (
            difflib.SequenceMatcher(None, norm_spoken, norm_name).ratio()
            if norm_name
            else 0.0
        )
        score_slug = difflib.SequenceMatcher(None, norm_spoken, norm_slug).ratio()
        scores.append((max(score_name, score_slug), entity_id))

    scores.sort(reverse=True)
    best_score, best_id = scores[0]
    if best_score < _ZONE_MATCH_THRESHOLD:
        return None
    runner_up = scores[1][0] if len(scores) > 1 else 0.0
    if (best_score - runner_up) < _ZONE_MATCH_MARGIN:
        return None  # ambiguous — decline to guess

    return best_id


@dataclass(frozen=True)
class LocationReminder:
    """
    A single zone-based reminder.

    ``person`` and ``zone`` are entity_ids (e.g. ``person.todd``, ``zone.work``).
    ``trigger`` is :data:`ENTER` or :data:`LEAVE`. ``delivered_at`` is ``None`` until
    the reminder fires, then a timezone-aware local datetime (one-shot — LOC-3).

    When ``persistent`` is ``True`` the reminder is never marked delivered — it re-fires
    on every matching zone transition, like a recurring time-based reminder.
    """

    uid: str
    summary: str
    person: str
    zone: str
    trigger: str
    delivered_at: datetime | None = None
    persistent: bool = False


def transition_kind(
    old_state: str | None, new_state: str | None, zone_value: str
) -> str | None:
    """
    Classify a person state change relative to one zone.

    Returns :data:`ENTER` when the person just moved into ``zone_value``, :data:`LEAVE`
    when they just moved out, and ``None`` when there is no transition or either side is
    an unknown/unavailable state (LOC-1).
    """
    old = old_state if old_state not in _UNKNOWN_STATES else None
    new = new_state if new_state not in _UNKNOWN_STATES else None
    if old is None or new is None or old == new:
        return None
    if new == zone_value:
        return ENTER
    if old == zone_value:
        return LEAVE
    return None


def triggered(
    reminders: list[LocationReminder], person: str, kind: str
) -> list[LocationReminder]:
    """Undelivered reminders for ``person`` whose trigger matches ``kind`` (LOC-2)."""
    return [
        r
        for r in reminders
        if r.delivered_at is None and r.person == person and r.trigger == kind
    ]


def format_spoken_location(trigger: str, zone_label: str) -> str:
    """
    Return a spoken phrase describing when the location reminder fires (LOC-9).

    Mirrors ``spoken_time.format_spoken_time`` — a human-readable phrase the
    conversation agent can echo verbatim rather than reading a raw entity_id.
    """
    verb = "arrive at" if trigger == ENTER else "leave"
    return f"when you {verb} {zone_label}"
