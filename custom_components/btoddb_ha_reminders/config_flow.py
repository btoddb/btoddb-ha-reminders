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

from .const import CONF_NOTIFY_SERVICE, DEFAULT_NOTIFY_SERVICE, DOMAIN


def _notify_services(hass: HomeAssistant) -> list[str]:
    """Return the registered notify services as ``notify.<name>`` strings, sorted."""
    return sorted(
        f"notify.{name}" for name in hass.services.async_services_for_domain("notify")
    )


def _schema(hass: HomeAssistant, default_notify: str) -> vol.Schema:
    # Build the dropdown from the live notify services. ``custom_value`` keeps the
    # configured default selectable even when it isn't currently registered (e.g. a
    # fresh install whose default service hasn't loaded yet).
    options = _notify_services(hass)
    if default_notify and default_notify not in options:
        options = [default_notify, *options]
    return vol.Schema(
        {
            vol.Required(
                CONF_NOTIFY_SERVICE, default=default_notify
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=options,
                    mode=selector.SelectSelectorMode.DROPDOWN,
                    custom_value=True,
                )
            )
        }
    )


class RemindersConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial setup."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the (only) setup step: pick the notify target."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title="BToddB Reminders", data=user_input)
        return self.async_show_form(
            step_id="user", data_schema=_schema(self.hass, DEFAULT_NOTIFY_SERVICE)
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
        """Handle the (only) options step: change the notify target."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        current = self.config_entry.options.get(
            CONF_NOTIFY_SERVICE
        ) or self.config_entry.data.get(CONF_NOTIFY_SERVICE, DEFAULT_NOTIFY_SERVICE)
        return self.async_show_form(
            step_id="init", data_schema=_schema(self.hass, current)
        )
