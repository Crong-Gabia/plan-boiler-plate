# 03. Flow & UX (Mermaid)

State: `DRAFT_FLOW`

Date: 2026-01-30

## Core flow (v1)

```mermaid
flowchart TD
  U1[Organizer - internal];
  U2[Participant - internal];
  U3[Participant - guest];
  A1[Admin];

  U1 --> SSO{Sign in SSO?};
  SSO -->|Yes| C1[Create poll];
  SSO -->|No| E1[Stop];

  C1 --> C2[Define slots and timezone];
  C2 --> C3{Allow external guests?};
  C3 -->|Yes| P1[Invite internal + guest emails];
  C3 -->|No| P2[Invite internal only];

  P1 --> L1[Send invites];
  P2 --> L1;

  L1 --> V1[Internal vote link];
  V1 --> IAUTH{Internal auth};
  IAUTH -->|Ok| IVOTE[Submit availability];
  IAUTH -->|Fail| IFAIL[Access denied];

  L1 --> V2[Guest vote link token];
  V2 --> GAUTH{Token valid?};
  GAUTH -->|Yes| GVOTE[Submit availability];
  GAUTH -->|Expired/Revoked| GFAIL[Request new link];

  IVOTE --> AGG[Aggregate results];
  GVOTE --> AGG;
  AGG --> D1[Organizer dashboard];

  D1 --> D2{Pick a slot};
  D2 --> CONFIRM[Confirm meeting time];
  CONFIRM --> N1[Notify participants];

  N1 --> CAL{Calendar action};
  CAL -->|v1: ics| ICS[Provide ics download];
  CAL -->|future: write| CWRITE[Create or update calendar event];

  ICS --> RET[Auto retention policy];
  CWRITE --> RET;
  RET --> END[Archive or delete];

  A1 --> APOL[Set tenant policy guest/retention/audit];
  APOL -.-> C3;
  APOL -.-> RET;
```

## UX notes (draft)

- Poll creation: title/description, timezone, slot input helpers, guest toggle.
- Voting: show converted times, 3-state choices, low-friction guest path.
- Results: aggregation and confirmation, then `.ics` download.
