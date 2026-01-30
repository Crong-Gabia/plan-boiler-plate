# 02. Requirements

State: `DRAFT_FLOW`

Date: 2026-01-30

## Functional (v1)

### Poll creation

- Organizer creates a poll with title/description, timezone, and candidate time slots.
- Poll has a shareable voting URL and an organizer dashboard.

### Invites

- Internal participants: invite via email/directory; respond after authentication.
- Guests: invite via email; respond via token-based link; optional email verification.

### Voting

- 3-state availability (Yes/No/If-needed).
- Show times in participant’s timezone.

### Decision

- Organizer confirms a slot and notifies participants.

### Calendar

> QUESTION-0001: decide v1 scope

- Minimum: provide `.ics` download after confirmation.
- Future: calendar read (busy times) and/or write (create/update events).

### Export/Audit

- CSV export for organizer.
- Admin audit log for org deployments.

## Permissions & security

- Internal: authenticated access.
- Guest: token link; support expiration/rotation; optional email binding.
- Organizer dashboard accessible only to the organizer.
- Minimize exposure of participant identities when guests are included.

## Retention (proposal)

- Confirmed poll: auto-delete 90 days after confirmation.
- Unconfirmed poll: expire/delete after 30 days.
