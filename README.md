# 기획서를 위한 기획서 생성용 보일러플레이트

이 레포는 **기획자/개발자 모두가 확인 가능한 Mermaid 플로우차트 기반**으로,
"플로우 승인 → (결정 로그 append) → 문서 생성/검증" 워크플로우를 굴리기 위한 문서/규칙/스크립트 보일러플레이트입니다.

## 산출물 위치(단일 디렉토리)

개발/운영/검증에 쓰이는 산출물은 **하나의 디렉토리** 아래에 모읍니다.

기본 경로: `product-description/`

```
product-description/
  ko/                # 한국어 문서(정본)
  en/                # 영어 문서(미러)
  shared/            # 승인/결정/리스크 로그(append-only)
  rules/agents/      # 에이전트 운영 규칙/프롬프트 템플릿
```

## 강제 규칙(Non-negotiable)

1) **플로우차트 승인 없이는 문서 생성(DOC_GEN) 단계로 진행 금지**
2) **모든 의사결정/변경은 Markdown 로그에 append**
3) 플로우차트는 **Mermaid**로 고정 (` ```mermaid ` fenced code block)
4) 작업 종료 직전에 `npm run verify`를 실행해
   - 맞춤법(기술 용어 포함)
   - Mermaid 문법
   - (옵션) 논리 검증(opencode run)
   을 수행합니다.

## 빠른 시작(원샷)

```bash
./scripts/setup.sh
```

## OpenCode Web UI (선택)

```bash
opencode web
```

포트 고정:

```bash
opencode web --port 4096
```

## Antigravity 환경(선택)

`opencode-antigravity-auth` 플러그인 기반으로 `opencode auth login`을 통해 OAuth를 붙여서 쓰는 것을 전제로 합니다.
자세한 운영 규칙/설정은 `AGENTS.md` 및 `product-description/rules/agents/` 아래 문서를 따릅니다.

## Stitch MCP 산출물 (디자인 가이드)

Stitch MCP로 생성된 `png/html` 산출물은 아래에 저장합니다.

```
product-description/design/
  <topic-or-screen>/
    <name>.png
    <name>.html
```


## 워크플로우(상태 머신)

### 상태

- `DRAFT_FLOW`: 요구사항 입력 → 플로우차트 초안 생성
- `REVIEW_FLOW`: 기획자가 직관적으로 검토/수정 요청
- `APPROVED_FLOW`: “이 플로우가 올바르다” 승인
- `DOC_GEN`: 승인된 플로우 기반 문서 생성(승인 없으면 금지)
- `DOC_REVIEW`: 문서 수정(플로우 변경이면 `REVIEW_FLOW`로 롤백)
- `FINALIZED`: 산출물 확정

### 필수 산출물

- 플로우차트: `product-description/ko/03-flow-and-ux.md` (Mermaid 포함)
- 승인 기록: `product-description/shared/20_approval.md` (append-only)
- 결정 로그: `product-description/shared/30_decisions.md` (append-only)
- 리스크/논리 검증 로그: `product-description/shared/risk.md` (append-only)

## 다음 읽을 것

- 에이전트 규칙(필수): `AGENTS.md`
- 에이전트별 지침: `product-description/rules/agents/README.md`
