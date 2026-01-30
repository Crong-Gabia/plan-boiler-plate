# Competitive & Policy Research (Mandatory First Step)

Date: YYYY-MM-DD

Planning target: **<your planning target / domain>**

> Rule: For a brand-new planning request/domain, update this doc **before** creating the flowchart.

## 1) Comparable products/services (min 6)

Legend: **F** (poll/flow UX), **A** (admin/permissions), **D** (policy/security/compliance docs), **I** (calendar/email integrations)

> Policy rule (recommended): include **domestic services first** (e.g., KR-based) to capture local policy patterns.

| # | Product | 1-liner | Relevance (F/A/D/I) | Sources |
|---:|---|---|---|---|
| 1 | <Domestic service #1> | <...> | <...> | <links> |
| 2 | <Domestic service #2> | <...> | <...> | <links> |
| 3 | <Domestic service #3 (optional)> | <...> | <...> | <links> |
| 4 | <Global service #1> | <...> | <...> | <links> |
| 5 | <Global service #2> | <...> | <...> | <links> |
| 6 | <Global service #3> | <...> | <...> | <links> |

Early stop: once you have 2–3 distinct patterns for Training/Retention/Subprocessors/Admin controls/Permissioning.

## 2) Policy patterns (Privacy / AI Terms)

### 2.1 Training

- <Is customer content used for training?>
- <Default: opt-in/opt-out?>

### 2.2 Retention/Deletion

- <What is retained, for how long, and how deletion works?>

### 2.3 Subprocessors

- <Do they publish subprocessor list? how do they notify changes?>

### 2.4 Admin controls

- <What admin controls exist: export/deletion/audit/policies?>

### 2.5 Permissioning

- <How is link-sharing handled? auth boundaries?>

## 3) Minimum policy requirements for our product (checklist)

- [ ] Define boundaries between user types / tenants / org ownership
- [ ] Link-sharing model: token expiration/rotation; optional email binding; auditability
- [ ] Data retention: defaults + admin override + right-to-delete
- [ ] Deletion semantics: immediate deletion vs backups/logs/audit metadata
- [ ] Subprocessor disclosure (if any): list, purpose, region, change notice
- [ ] Admin controls: export, deletion, audit logs
