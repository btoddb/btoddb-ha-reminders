"""
Config flow for the Reminders integration.

A single config entry. The only setting is the notify target the delivery loop pushes
to (RM-6); it's a plain service string (e.g. ``notify.btoddb``) so the component is
shareable across installs. ``calendar_source`` is reserved for a future option (pick an
existing calendar vs. component-created) and is fixed to "internal" in v1.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import selector

from .const import (
    CONF_CALENDAR_NAME,
    CONF_NOTIFY_SERVICE,
    CONF_SNOOZE_DURATIONS,
    DEFAULT_CALENDAR_NAME,
    DEFAULT_NOTIFY_SERVICE,
    DEFAULT_SNOOZE_DURATIONS,
    DOMAIN,
)


def _notify_services(hass: HomeAssistant) -> list[str]:
    """Return the registered notify services as ``notify.<name>`` strings, sorted."""
    return sorted(
        f"notify.{name}" for name in hass.services.async_services_for_domain("notify")
    )


def _notify_selector(
    hass: HomeAssistant, default_notify: str
) -> selector.SelectSelector:
    # Build the dropdown from the live notify services. The current value is prepended
    # if it isn't in the list (e.g. an already-configured service that is temporarily
    # offline), so the options flow never silently resets an existing entry.
    options = _notify_services(hass)
    if default_notify and default_notify not in options:
        options = [default_notify, *options]
    return selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=options,
            mode=selector.SelectSelectorMode.DROPDOWN,
        )
    )


def _user_schema(
    hass: HomeAssistant, default_name: str, default_notify: str
) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_CALENDAR_NAME, default=default_name): vol.All(
                selector.TextSelector(), vol.Length(min=1)
            ),
            vol.Required(CONF_NOTIFY_SERVICE, default=default_notify): _notify_selector(
                hass, default_notify
            ),
        }
    )


def _snooze_durations_to_str(durations: list[int]) -> str:
    """Convert a list of snooze durations to a comma-separated display string."""
    return ", ".join(str(d) for d in durations)


def _coerce_snooze_durations(value: object) -> list[int]:
    """Validate and coerce a comma-separated string or list to ``list[int]``."""
    if isinstance(value, list):
        result = [int(v) for v in value]
    elif isinstance(value, str):
        result = [int(v.strip()) for v in value.split(",") if v.strip()]
    else:
        msg = f"Expected string or list, got {type(value).__name__}"
        raise vol.Invalid(msg)
    if not result:
        msg = "Enter at least one snooze duration in minutes."
        raise vol.Invalid(msg)
    if any(v < 1 for v in result):
        msg = "All snooze durations must be at least 1 minute."
        raise vol.Invalid(msg)
    return result


def _options_schema(
    hass: HomeAssistant, default_notify: str, default_snooze: str
) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_NOTIFY_SERVICE, default=default_notify): _notify_selector(
                hass, default_notify
            ),
            vol.Required(CONF_SNOOZE_DURATIONS, default=default_snooze): vol.All(
                selector.TextSelector(),
                _coerce_snooze_durations,
            ),
        }
    )


class RemindersConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial setup."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the (only) setup step: pick the calendar name and notify target."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            title = user_input[CONF_CALENDAR_NAME]
            return self.async_create_entry(title=title, data=user_input)
        # Pass "" as the notify default so the picker starts with no pre-selection;
        # notify.notify would only appear as a phantom option if it isn't registered.
        return self.async_show_form(
            step_id="user",
            data_schema=_user_schema(self.hass, DEFAULT_CALENDAR_NAME, ""),
        )

    @staticmethod
    @callback
    def async_get_options_flow(_config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow handler (notify target is its only field)."""
        return RemindersOptionsFlow()


class RemindersOptionsFlow(OptionsFlow):
    """Allow changing the notify target after setup."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the (only) options step: change notify target and snooze durations."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        current_notify = self.config_entry.options.get(
            CONF_NOTIFY_SERVICE
        ) or self.config_entry.data.get(CONF_NOTIFY_SERVICE, DEFAULT_NOTIFY_SERVICE)
        current_durations: list[int] = self.config_entry.options.get(
            CONF_SNOOZE_DURATIONS
        ) or self.config_entry.data.get(CONF_SNOOZE_DURATIONS, DEFAULT_SNOOZE_DURATIONS)
        return self.async_show_form(
            step_id="init",
            data_schema=_options_schema(
                self.hass,
                current_notify,
                _snooze_durations_to_str(current_durations),
            ),
        )
