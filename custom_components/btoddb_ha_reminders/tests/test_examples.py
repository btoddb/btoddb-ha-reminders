"""Regression checks for copy-paste conversation-agent examples."""

from __future__ import annotations

from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[3]


def _load_example(name: str) -> list[dict]:
    return yaml.safe_load((ROOT / "examples" / name).read_text())


def test_create_reminder_function_exposes_and_forwards_rrule():
    """Voice recurring reminders need rrule in the typed function contract."""
    function = _load_example("create_reminder.function.yaml")[0]

    properties = function["spec"]["parameters"]["properties"]
    service_data = function["function"]["sequence"][0]["data"]

    assert "rrule" in properties
    assert "FREQ=DAILY" in properties["rrule"]["description"]
    assert "FREQ=WEEKLY;BYDAY=MO" in properties["rrule"]["description"]
    assert function["spec"]["parameters"]["required"] == ["message"]
    assert service_data["rrule"] == "{{ rrule }}"


def test_prompt_examples_tell_agent_to_use_rrule_for_recurring_reminders():
    for prompt_name in ("prompt-snippet.txt", "prompt-actual.txt"):
        prompt = (ROOT / "examples" / prompt_name).read_text()

        assert "call create_reminder with rrule" in prompt
        assert "FREQ=DAILY" in prompt
        assert "FREQ=WEEKLY;BYDAY=MO" in prompt
