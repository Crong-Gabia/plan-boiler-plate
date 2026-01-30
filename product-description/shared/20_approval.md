# 승인 로그 (append-only)

> 규칙: 이 파일은 **append-only**입니다. 기존 승인 기록을 수정/삭제하지 않습니다.
> 모든 승인은 플로우차트(예: `ko/03-flow-and-ux.md`)의 특정 버전/변경을 대상으로 해야 합니다.

## 템플릿

```md
## [YYYY-MM-DD HH:mm KST] APPROVAL-0001: <승인 대상 요약>
- Owner: <이름/역할>
- What: <무엇을 승인?>
- Why: <승인 근거>
- Alternatives: <검토한 대안>
- Decision: APPROVED | REJECTED
- Impact:
  - Flow nodes: <A1, D3, ...>
  - Docs: <ko/...#섹션>
```
