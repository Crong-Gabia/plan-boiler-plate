# Competitive & Policy Research (Mandatory First Step)

Date: 2026-01-30

Planning target: **Internal meeting time coordination service** (default internal users, optionally supports external guests)

> Rule: For a brand-new planning request/domain, update this doc **before** creating the flowchart.

## 1) Comparable products/services (min 6)

Legend: **F** (poll/flow UX), **A** (admin/permissions), **D** (policy/security/compliance docs), **I** (calendar/email integrations)

| # | Product | 1-liner | Relevance (F/A/D/I) | Sources |
|---:|---|---|---|---|
| 1 | Doodle | Link-based scheduling polls; publishes privacy policy + subprocessors. | F/D/I | https://doodle.com/en/privacy-policy/ , https://doodle.com/en/data-subprocessors/ , https://help.doodle.com/en/articles/9457289-general-data-processing-terms |
| 2 | Calendly | Link-based scheduling; has privacy notice + subprocessor list + security/compliance overview. | F/D/I | https://calendly.com/legal/privacy-notice , https://help.calendly.com/hc/en-us/articles/360047345493-Calendly-sub-processors-GDPR-CCPA , https://help.calendly.com/hc/en-us/articles/360009867334-Calendly-Platform-Security-and-Compliance |
| 3 | SavvyCal | Scheduling links; highlights limited calendar access; publishes data processors list. | F/D/I | https://savvycal.com/privacy/ , https://savvycal.com/data-processors |
| 4 | Outlook Scheduling Poll (Microsoft) | Native Outlook scheduling poll; supports external voting via secure link; data stored in organizer mailbox. | F/A/I | https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c , https://support.microsoft.com/en-us/office/find-the-best-meeting-time-for-everyone-with-outlook-scheduling-poll-7b5ff6c7-4f65-48e6-89b8-3f053c40e382 |
| 5 | When2meet | Account-less, link-based availability grid (UX reference). | F | https://when2meet.it.com/privacy-policy/ |
| 6 | Framadate (Framasoft) | Open-source alternative to Doodle; supports poll-level auto-deletion date. | F/D | https://docs.framasoft.org/en/framadate/prise-en-main.html , https://framasoft.org/en/cgu/ |
| 7 | Simple Poll (Slack app) | Slack-native polls; positions “minimal data stored” in its policy. | F/A/D | https://biztools.simplepoll.rocks/privacy-policy/ |
| 8 | Google (Retention) | Integration expectations reference for deletion/retention (esp. Workspace/Vault). | D/I | https://policies.google.com/technologies/retention?hl=en-US , https://support.google.com/vault/answer/2990828?hl=en |
| 9 | WhatTime (되는시간) | Scheduling/booking links; explicitly documents retention/deletion and vendor processing (outsourcing), and publishes team role permissions. | A/D/I | https://whattime.co.kr/ , https://guide.whattime.co.kr/terms/privacy , https://guide.whattime.co.kr/terms/recent , https://guide.whattime.co.kr/team/permission , https://guide.whattime.co.kr/team/members |

Early stop: once you have 2–3 distinct patterns for Training/Retention/Subprocessors/Admin controls/Permissioning.

## 2) Policy patterns (Privacy / AI Terms)

### 2.1 Training

- Even if the product is not “AI-first”, users expect an explicit statement about whether data is used for model training.
- For an internal+guest scheduling tool, an explicit **“no training / no secondary use”** default reduces trust risk.

### 2.2 Retention/Deletion

- Mailbox/tenant-owned storage model: Microsoft states scheduling poll data is stored in the organizer’s mailbox, and describes what remains after deletion.
  - Source: https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c
- Vendor retention window stated: Doodle’s data processing terms mention deletion upon termination (up to a maximum period).
  - Source: https://help.doodle.com/en/articles/9457289-general-data-processing-terms
- Poll-level TTL: Framadate docs describe setting an auto-deletion date during poll creation.
  - Source: https://docs.framasoft.org/en/framadate/prise-en-main.html
- Principle of deletion on withdrawal + explicit legal/log retention: WhatTime’s privacy policy states deletion “without delay” as a principle while also listing specific retention items/reasons (e.g., service usage records / login logs).
  - Source: https://guide.whattime.co.kr/terms/privacy

### 2.3 Subprocessors

- Doodle: publishes a subprocessor list.
  - Source: https://doodle.com/en/data-subprocessors/
- Calendly: maintains a sub-processor list.
  - Source: https://help.calendly.com/hc/en-us/articles/360047345493-Calendly-sub-processors-GDPR-CCPA
- SavvyCal: maintains a data processors list.
  - Source: https://savvycal.com/data-processors
- WhatTime: the privacy policy states “no third-party provision” (“N/A”), while disclosing a vendor/outsourcing table (processing/entrustment).
  - Source: https://guide.whattime.co.kr/terms/privacy

### 2.4 Admin controls

- Admin-facing deletion/export controls matter for org deployments.
  - Example: Calendly describes deletion actions available to Owners/Admins.
    - Source: https://help.calendly.com/hc/en-us/articles/4412601189911-How-to-delete-personal-data-in-Calendly
- WhatTime: documents a team RBAC model (Super Admin / Admin / User) and clarifies which actions (e.g., user management, billing) are allowed by role.
  - Source: https://guide.whattime.co.kr/team/permission

### 2.5 Permissioning

- Link-based guest participation typically implies “anyone with the link can view/vote”; this must be explicitly designed and documented.
- Microsoft describes what’s visible on the voting page and that only organizers can access the organizer dashboard after authentication.
  - Source: https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c
- WhatTime: clarifies that removing a member from an organization is not the same as account deletion, and that reservation/page data may remain after org removal (offboarding + data retention communication pattern).
  - Source: https://guide.whattime.co.kr/team/members

## 3) Minimum policy requirements for our product (checklist)

- [ ] Define boundaries for internal users vs external guests (workspace/tenant ownership)
- [ ] Link-sharing model: token expiration/rotation; optional email binding; auditability
- [ ] Calendar integration: least-privilege scopes; clear read/write behavior
- [ ] Retention: poll/event TTL default + admin override + right-to-delete
- [ ] Deletion semantics: immediate deletion vs backups/logs/audit metadata
- [ ] Subprocessor disclosure (if any): list, purpose, region, change notice
- [ ] Admin controls: guest on/off, export, deletion, audit logs

## 4) Planning-specific notes

- No DOC_GEN before the flow is approved (gate rule).
- Append core decisions/changes to `shared/30_decisions.md`.
