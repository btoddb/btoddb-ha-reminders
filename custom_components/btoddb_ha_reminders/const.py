"""Constants for the Reminders integration."""

from __future__ import annotations

DOMAIN = "btoddb_ha_reminders"

# Config / option keys.
CONF_NOTIFY_SERVICE = "notify_service"
CONF_CALENDAR_NAME = "calendar_name"
CONF_SNOOZE_DURATIONS = "snooze_durations"
# Reserved for a future option (pick an existing calendar vs. component-created).
# v1 is fixed to "internal" — see store.py, which is the swap seam.
CONF_CALENDAR_SOURCE = "calendar_source"

# Defaults. The default notify target is intentionally generic so the component is
# shareable; this HA configures it to notify.btoddb (see README + migration).
DEFAULT_NOTIFY_SERVICE = "notify.notify"
DEFAULT_CALENDAR_NAME = "BToddB Reminders"
# Snooze durations shown as action buttons on time-based notifications (RM-12).
DEFAULT_SNOOZE_DURATIONS: list[int] = [15, 60]
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

# Keys for the per-entry runtime data dict (holds both reminder stores).
DATA_STORE = "store"
DATA_LOCATION_STORE = "location_store"

# Storage (.storage/reminders).
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

# Location reminders persist separately (.storage/btoddb_ha_reminders_location) so the
# time-based store needs no migration (LOC-4).
STORAGE_KEY_LOCATION = f"{DOMAIN}_location"
STORAGE_VERSION_LOCATION = 1

# Delivery loop cadence (RM-6): poll every minute, not the calendar trigger.
DELIVERY_INTERVAL_MINUTES = 1

# Notification presentation for a delivered location reminder (LOC-1). Same channel/
# priority as time reminders; only the title differs so the user can tell them apart.
NOTIFY_TITLE_LOCATION = "📍 Reminder"

# A delivered location reminder lingers in the UI this long after it fires (LOC-5),
# then is pruned to bound storage.
LOCATION_RETENTION_DAYS = 7
