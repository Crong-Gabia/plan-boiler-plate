# Workflow (State Machine) & Gates

Version: v1.0
Date: 2026-01-30

## 1) State machine

```mermaid
flowchart TD
  DRAFT_FLOW[ DRAFT_FLOW\nCapture requirements ] --> REVIEW_FLOW[ REVIEW_FLOW\nReview/revise flowchart ]
  REVIEW_FLOW --> APPROVED_FLOW{ APPROVED_FLOW\nFlow approved? }
  APPROVED_FLOW -- No --> REVIEW_FLOW
  APPROVED_FLOW -- Yes --> DOC_GEN[ DOC_GEN\nGenerate docs from approved flow ]
  DOC_GEN --> DOC_REVIEW[ DOC_REVIEW\nReview/revise docs ]
  DOC_REVIEW -->|Flow change needed| REVIEW_FLOW
  DOC_REVIEW --> FINALIZED[ FINALIZED\nFinalize outputs ]
```

## 2) Hard gates

- Research-first gate: update `en/00-competitive-and-policy-research.md` before drafting the flow.
- Approval gate: no DOC_GEN before an APPROVED entry exists in `shared/20_approval.md`.
- Decision log gate: append decisions/changes to `shared/30_decisions.md`.

## 3) End-of-work verification

Run `npm run verify`.
