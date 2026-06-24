"""Constants for the Reminders integration."""

from __future__ import annotations

DOMAIN = "btoddb_ha_reminders"

# Config / option keys.
CONF_NOTIFY_SERVICE = "notify_service"
CONF_CALENDAR_NAME = "calendar_name"
# Reserved for a future option (pick an existing calendar vs. component-created).
# v1 is fixed to "internal" — see store.py, which is the swap seam.
CONF_CALENDAR_SOURCE = "calendar_source"

# Defaults. The default notify target is intentionally generic so the component is
# shareable; this HA configures it to notify.btoddb (see README + migration).
DEFAULT_NOTIFY_SERVICE = "notify.notify"
DEFAULT_CALENDAR_NAME = "BToddB Reminders"
CALENDAR_SOURCE_INTERNAL = "internal"

# Notification presentation (RM-6): high-priority push so Android delivers immediately
# instead of holding it in Doze until the phone is unlocked.
NOTIFY_TITLE = "⏰ Reminder"
NOTIFY_DATA: dict[str, object] = {
    "ttl": 0,
    "priority": "high",
    "importance": "high",
    "channel": "BToddB Reminders",
}

# Storage (.storage/reminders).
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

# Delivery loop cadence (RM-6): poll every minute, not the calendar trigger.
DELIVERY_INTERVAL_MINUTES = 1
