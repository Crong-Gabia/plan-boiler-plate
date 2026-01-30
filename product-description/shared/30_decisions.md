# 결정 로그 (append-only)

> 규칙: 이 파일은 **append-only**입니다. 기존 기록을 수정/삭제하지 않습니다.

## 템플릿

```md
## [YYYY-MM-DD HH:mm KST] DECISION-0001: <결정 제목>
- Owner: <이름/역할>
- Context: <문맥>
- Options:
  1) ...
  2) ...
- Decision: <선택>
- Rationale: <근거>
- Impact:
  - Flow nodes: <A1, D3, ...>
  - Spec sections: <ko/...#섹션>
```

```md
## [YYYY-MM-DD HH:mm KST] QUESTION-0001: <오픈 질문>
- Owner: <이름/역할>
- Context: <문맥>
- Options:
  1) ...
  2) ...
- Question: <확인해야 할 질문>
- Impact:
  - Flow nodes: <A1, D3, ...>
  - Docs: <ko/...#섹션>
```

## [2026-01-30 08:22 KST] DECISION-0001: 사내 사용자 + 외부 게스트(협력사 등) 혼합 참여 지원
- Owner: 사용자(요청자)
- Context: 회의 시간 조율 서비스의 대상 사용자/권한 경계는 인증/보안/데이터 소유권에 직접 영향.
- Options:
  1) 사내 전용(SSO 사용자만)
  2) 외부 게스트 지원(회사 밖 이메일도 초대/응답 가능)
  3) 둘 다(기본은 사내, 선택적으로 게스트 허용)
- Decision: 3) 둘 다
- Rationale: 실제 회의 조율은 협력사/외부 참석자가 포함되는 케이스가 빈번.
- Impact:
  - Flow nodes: (예정) INVITE_GUEST, GUEST_VOTE, TOKEN_AUTH
  - Spec sections: ko/01-product-brief.md#scope , ko/02-requirements.md#permissions--security

## [2026-01-30 08:22 KST] QUESTION-0001: 캘린더 연동의 범위(읽기/쓰기)와 인증 방식(SSO) 확정 필요
- Owner: 문서 작성자(에이전트)
- Context: 캘린더 연동 범위는 권한 최소화, 데이터 보관, 구현 난이도/일정에 큰 영향.
- Options:
  1) v1은 비연동(링크 투표 + 확정 후 .ics 다운로드)
  2) 읽기 연동만(바쁜 시간 조회로 추천 슬롯 생성)
  3) 읽기+쓰기(확정 시 자동으로 캘린더 이벤트 생성/업데이트)
- Question: v1에서 어디까지 포함할까요?
- Impact:
  - Flow nodes: (예정) CAL_CONNECT, CAL_READ_BUSY, CAL_WRITE_EVENT
  - Docs: ko/02-requirements.md#calendar-integration
