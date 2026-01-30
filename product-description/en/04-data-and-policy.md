# 04. Data & Privacy Draft

State: `DRAFT_FLOW`

Date: 2026-01-30

## Data inventory (minimization)

- Internal users: org identifier, name/email, poll/slot/votes, operational events.
- Guests: email (invite/verification), token-based access, votes.

## Boundaries

- Tenant/workspace owns the poll data.
- Guests only access the specific poll via the invite link; no directory access.

## Retention (proposal)

- Confirmed poll: auto-delete after 90 days.
- Unconfirmed poll: auto-delete after 30 days.
- Security logs: keep minimal duration then aggregate/anonymize.

## Admin controls

- Guest enable/disable
- Retention defaults and limits
- Export and deletion workflows
