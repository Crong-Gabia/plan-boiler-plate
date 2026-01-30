# Agents Guide

이 폴더는 OpenCode/OhMyOpenCode 에이전트가 **product-description/** 산출물을 일관되게 만들도록 하는 지침 모음입니다.

## 핵심 워크플로우(요약)

1) **(필수) 리서치**: `ko/00-competitive-and-policy-research.md` 업데이트
2) **플로우차트 초안**: Mermaid로 작성(예: `ko/03-flow-and-ux.md`)
3) **리뷰/수정**: 기획자가 직관적으로 검토할 수 있게 질문/체크리스트 제공
4) **승인**: `shared/20_approval.md`에 append
5) **결정 로그**: `shared/30_decisions.md`에 append
6) **종료 직전 검증**: `npm run verify` 실행(맞춤법/mermaid/논리)

## 에이전트 문서

- `plan.md`: 작업 분해 + 게이트 강제
- `explore.md`: 로컬 탐색
- `librarian.md`: 웹 리서치
- `oracle.md`: 설계 검토(읽기 전용)
