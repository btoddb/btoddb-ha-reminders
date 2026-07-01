# Location/Zone Based Reminders

Implement https://github.com/btoddb/ha-reminders/issues/2

**Status:** implemented (see `requirements/spec/reminders.md` LOC-* rules)
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

[x] are reminders delivered timely (fires on the zone state-change event — LOC-1/LOC-2)
[x] can a user enter a reminder (Location tab on the card -> create_location service)
[x] reminder is delivered when leaving a zone (trigger=leave — LOC-1)
[x] reminder is delivered when entering a zone (trigger=enter — LOC-1)
[x] user can review undelivered reminders (merged card list, undelivered first — LOC-6)
[x] user can see delivered reminders and the delivery time (struck-through, kept 7 days — LOC-5)
