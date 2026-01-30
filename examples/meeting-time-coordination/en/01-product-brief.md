# 01. Product Brief

State: `DRAFT_FLOW`

Date: 2026-01-30

## One-liner

An internal meeting time coordination service that lets authenticated employees (required) and external guests (optional) quickly submit availability, reach a decision, and share/apply the final schedule.

## Problem

- Availability gathering is scattered across email/chat → high coordination cost.
- Time zones and hybrid work make “when are you free?” harder.
- External attendees introduce permission and data-boundary risks.

## Goals

- Reduce back-and-forth for finding a meeting time.
- Support internal users + external guests in a single flow.
- Provide at least an `.ics` path to get the meeting into calendars.

## Non-goals (v1)

- Meeting notes/agenda management.
- Forced auto-booking as the default.
- Full resource booking (rooms/equipment).

## Scope

- Mixed participation: internal users + external guests (DECISION-0001)
- Propose slots → collect votes → decide → share

## Roles

- Organizer (internal)
- Internal participant
- Guest participant (link/token)
- Admin (tenant policy)

## Open questions

- Calendar integration scope and internal auth approach (QUESTION-0001)
