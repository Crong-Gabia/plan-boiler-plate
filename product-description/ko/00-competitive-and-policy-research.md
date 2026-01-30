# 경쟁사/정책 리서치 (필수 선행 단계)

작성일: 2026-01-30

> 규칙: **새로운 기획의 최초 요청**이 들어오면, 플로우차트 작성 전에 본 문서를 업데이트한다.

## 1) 유사 제품/서비스 (최소 6개)

표기: **F**(Flowchart/다이어그램), **A**(Approval/승인), **D**(문서/위키/템플릿), **AI**(AI 생성/요약), **I**(업무/연동)

| # | 제품 | 1-liner | 관련성 (F/A/D/AI/I) | Sources |
|---:|---|---|---|---|
| 1 | Notion | 문서·위키·프로젝트를 한 워크스페이스에서 운영하고 Notion AI를 제공. | D/AI | https://www.notion.com/product , https://www.notion.com/product/ai |
| 2 | Confluence (Atlassian) | 팀 지식/문서용 워크스페이스 + 템플릿/AI + 승인 프로세스 가이드. | D/AI/A | https://www.atlassian.com/software/confluence , https://www.atlassian.com/work-management/project-collaboration/cross-functional-teams/approvals-process |
| 3 | ClickUp (Docs + AI PRD) | Docs로 문서-업무를 연결하고 AI로 PRD 생성 페이지를 제공. | D/AI/I | https://clickup.com/features/docs , https://clickup.com/p/features/ai/product-requirements-document-generator |
| 4 | Miro (AI documentation) | 보드의 다이어그램/플로우차트 → 문서 변환 흐름을 명시. | F/D/AI | https://miro.com/ai/software-development/ai-software-documentation/ |
| 5 | Zoom AI Companion | (정책 패턴 참고용) 보관/3rd party 보관 포함한 문서 제공. | AI | https://www.zoom.com/en/products/ai-assistant/resources/privacy-security/ |
| 6 | Microsoft 365 Copilot | (정책 패턴 참고용) 권한/경계/학습 정책 문서 제공. | AI | https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy |

> 조기 종료 조건: Training/Retention/Subprocessors/Admin controls/Permissioning 각 항목에서 **서로 다른 패턴 2~3개**가 확보되면 추가 조사를 멈춰도 된다.

## 2) 정책 패턴 요약 (Privacy / AI Terms)

### 2.1 최소 요구 체크리스트

- [ ] 프롬프트/출력/문서 내용이 **학습(Training) 사용되는지** 명시(기본값 포함)
- [ ] 보관/삭제(Retention/Deletion): 앱 레이어 vs 모델/서브프로세서 레이어 구분
- [ ] 서브프로세서(Subprocessors) 목록 + 변경 고지 방식
- [ ] 관리자 제어(Admin controls): 기능 ON/OFF, 데이터 접근 범위, 감사 로그
- [ ] 권한/경계(Permissioning): “사용자가 접근 가능한 데이터만 AI가 접근”

### 2.2 참고 근거(직접 링크)

- Notion AI 보안/프라이버시: https://www.notion.com/help/notion-ai-security-practices
- Atlassian AI Trust: https://www.atlassian.com/trust/ai
- Zoom AI Companion: https://www.zoom.com/en/products/ai-assistant/resources/privacy-security/
- Microsoft 365 Copilot: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy
- Google Workspace Gemini: https://support.google.com/a/answer/15706919?hl=en

## 3) 이번 기획에 대한 적용(초안)

- (예시) Flow 승인 없이는 DOC_GEN 금지
- (예시) 모든 결정/변경은 `shared/30_decisions.md`에 append
