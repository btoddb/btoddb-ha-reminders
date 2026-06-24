# Location/Zone Based Reminders

Implement https://github.com/btoddb/btoddb-ha-reminders/issues/2

**Status:** in progress
**Touches:** location-based

## Goal

Create reminders that are delivered immediately when a person enters or leaves a zone, as defined by HA.  Integrate this new functionality with the UI of time based reminders if possible.  They can use different implementations, but from the user's perspective they are all reminders and would be nice to see undelivered reminders in one place.

## Behavior

Numbered, testable statements. Mark each as a **constraint** (must) or
**suggestion** (open to alternatives) when it isn't obvious.

1. **constraint** When a person enters or leaves a zone, the reminder is delivered
2. **constraint** Must be able to delete them
3. **suggestion** Once a location reminder is delivered, cross it off, timestamp it and keep in the UI for 7 days so a user can see when it was delivered

## UI (only if applicable)

Update the dashboard card so a location reminder can be entered.  Not sure what this might look like, it may require a new card.

## Out of scope

- Locations that aren't defined zones in HA. However, don't design yourself into a corner if I want to enter addresses later.

## Acceptance criteria

[ ] are reminders delivered timely
[ ] can a user enter a reminder
[ ] reminder is delivered when leaving a zone
[ ] reminder is delivered when entering a zone
[ ] user can review undelivered reminders
[ ] user can see delivered reminders and the delivery time
