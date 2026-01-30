# 경쟁사/정책 리서치 (필수 선행 단계)

작성일: 2026-01-30

대상 기획: **사내 회의 시간 조율 서비스** (기본은 사내 사용자, 옵션으로 외부 게스트 초대 지원)

> 규칙: **새로운 기획의 최초 요청**이 들어오면, 플로우차트 작성 전에 본 문서를 업데이트한다.

## 1) 유사 제품/서비스 (최소 6개)

표기: **F**(투표/플로우 UX), **A**(관리자/승인/권한), **D**(정책/보안/컴플라이언스 문서), **I**(캘린더/메일 연동)

| # | 제품 | 1-liner | 관련성 (F/A/D/I) | Sources |
|---:|---|---|---|---|
| 1 | Doodle | 링크 기반 폴/스케줄 조율. 캘린더/연락처 연동 및 서브프로세서 공개. | F/D/I | https://doodle.com/en/privacy-policy/ , https://doodle.com/en/data-subprocessors/ , https://help.doodle.com/en/articles/9457289-general-data-processing-terms |
| 2 | Calendly | 일정 링크 기반 예약/조율. 보안/컴플라이언스 문서와 서브프로세서 목록 운영. | F/D/I | https://calendly.com/legal/privacy-notice , https://help.calendly.com/hc/en-us/articles/360047345493-Calendly-sub-processors-GDPR-CCPA , https://help.calendly.com/hc/en-us/articles/360009867334-Calendly-Platform-Security-and-Compliance |
| 3 | SavvyCal | 일정 링크 기반 조율(캘린더 연결 시 최소 조회 원칙 강조). 서브프로세서/데이터 프로세서 목록 제공. | F/D/I | https://savvycal.com/privacy/ , https://savvycal.com/data-processors |
| 4 | Outlook Scheduling Poll (Microsoft) | Outlook 내장 스케줄링 폴. **조직 외부 사용자도 투표 링크로 참여 가능**. 데이터가 organizer mailbox에 저장되는 모델. | F/A/I | https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c , https://support.microsoft.com/en-us/office/find-the-best-meeting-time-for-everyone-with-outlook-scheduling-poll-7b5ff6c7-4f65-48e6-89b8-3f053c40e382 |
| 5 | When2meet | 계정 없이 링크로 시간대 체크. (간소 UX 레퍼런스) | F | https://when2meet.it.com/privacy-policy/ |
| 6 | Framadate (Framasoft) | Doodle 대체 오픈소스. **투표 생성 시 자동 삭제일 설정** 가능(사용자 자율). | F/D | https://docs.framasoft.org/en/framadate/prise-en-main.html , https://framasoft.org/en/cgu/ |
| 7 | Simple Poll (Slack app) | Slack 내 설문/투표. 최소 데이터 저장 지향(정책에 명시). | F/A/D | https://biztools.simplepoll.rocks/privacy-policy/ |
| 8 | Google (Retention) | 캘린더/워크스페이스 연동 시 기대되는 “삭제/보관” 개념 레퍼런스. | D/I | https://policies.google.com/technologies/retention?hl=en-US , https://support.google.com/vault/answer/2990828?hl=en |
| 9 | 되는시간(WhatTime) | 일정/예약 링크 기반 서비스. 개인정보 처리방침에서 처리위탁(수탁업체)와 보관/파기 원칙을 명시, 팀 권한 모델 문서화. | A/D/I | https://whattime.co.kr/ , https://guide.whattime.co.kr/terms/privacy , https://guide.whattime.co.kr/terms/recent , https://guide.whattime.co.kr/team/permission , https://guide.whattime.co.kr/team/members |

> 조기 종료 조건: Training/Retention/Subprocessors/Admin controls/Permissioning 각 항목에서 **서로 다른 패턴 2~3개**가 확보되면 추가 조사를 멈춰도 된다.

## 2) 정책 패턴 요약 (Privacy / AI Terms 중심)

### 2.1 Training(학습) 사용 여부

- 회의 시간 조율/투표 서비스들은 대체로 “AI 학습”이 핵심이 아니므로, 사용자 입장에서 **명시가 없으면 불신 요인**이 된다.
- 따라서 우리 서비스는 (AI 기능이 없더라도) **“서비스 제공 목적 외 학습/모델트레이닝 미사용”**을 기본 정책으로 명확히 적는 편이 안전하다.

### 2.2 Retention/Deletion(보관/삭제)

- **메일박스/테넌트 귀속 모델(조직 컨텐츠 저장)**: Outlook Scheduling Poll은 “poll data가 organizer mailbox에 저장”되는 구조를 밝힘. 또한 “deleted polls는 대부분 purge”하되 일부 메타데이터는 남는다고 명시.
  - Source: https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c
- **서비스 사업자 보관 + 종료 후 삭제 기간 명시**: Doodle DPA/데이터 처리 조건 문서에서 “종료 후 최대 180일 내 삭제” 같은 기간을 명시.
  - Source: https://help.doodle.com/en/articles/9457289-general-data-processing-terms
- **사용자 주도 자동 삭제(폴 단위 TTL)**: Framadate는 폴 생성 시 “자동 삭제일”을 설정할 수 있다는 흐름을 문서로 안내.
  - Source: https://docs.framasoft.org/en/framadate/prise-en-main.html
- **탈퇴 시 파기 원칙 + 일부 로그/이용기록 보관 사유 명시**: 되는시간 개인정보 처리방침은 “원칙적으로 지체 없이 파기”를 밝히면서도, “이용 기록/로그인 기록”의 보존 항목/이유를 별도로 명시.
  - Source: https://guide.whattime.co.kr/terms/privacy

### 2.3 Subprocessors(서브프로세서) 공개

- Doodle: 서비스별 Subprocessors 리스트를 페이지로 공개.
  - Source: https://doodle.com/en/data-subprocessors/
- Calendly: Sub-processors 목록을 Help Center 문서로 운영(업데이트 공지 포함).
  - Source: https://help.calendly.com/hc/en-us/articles/360047345493-Calendly-sub-processors-GDPR-CCPA
- SavvyCal: Data Processors/Sub-processors를 별도 페이지로 운영.
  - Source: https://savvycal.com/data-processors
- 되는시간: 개인정보 처리방침에서 **제3자 제공은 “해당 없음”**으로 밝히고, **처리위탁(수탁업체)** 목록을 테이블로 공개.
  - Source: https://guide.whattime.co.kr/terms/privacy

### 2.4 Admin controls(관리자 제어)

- 조직형 서비스는 “누가 어떤 데이터를 삭제/관리할 수 있는가”를 명확히 둔다.
  - 예: Calendly는 invitee 데이터 삭제를 **Owner/Admin**이 수행 가능하다는 가이드가 있음.
    - Source: https://help.calendly.com/hc/en-us/articles/4412601189911-How-to-delete-personal-data-in-Calendly
- 되는시간: 팀 권한을 “최고 관리자/관리자/사용자”로 구분하고, 사용자 관리/결제 등 권한 범위를 문서로 명시.
  - Source: https://guide.whattime.co.kr/team/permission

### 2.5 Permissioning(권한/경계)

- **링크 기반 외부 참여**는 기본적으로 “링크를 가진 자 = 접근 가능” 모델이다.
- Outlook Scheduling Poll은 투표 페이지 URL을 아는 사람이 볼 수 있는 범위를 설명하며, organizer dashboard는 organizer만(인증 필요) 접근한다고 명시.
  - Source: https://support.microsoft.com/en-us/topic/privacy-and-personal-data-protection-in-scheduling-poll-8d7d2927-cb9d-4d39-aed3-cd8c1aea5d2c
- 되는시간: 조직에서 사용자를 제거해도 “회원 탈퇴”와 동일하지 않으며, 조직 제거 시에도 예약/페이지 데이터는 삭제되지 않는다고 안내(오프보딩/데이터 보존 커뮤니케이션 패턴).
  - Source: https://guide.whattime.co.kr/team/members

## 3) 우리 제품/문서 정책으로 가져올 최소 요건(체크리스트)

### 3.1 개인정보/보안 정책 체크리스트

- [ ] **사내 사용자 vs 외부 게스트** 데이터 경계 정의(테넌트/워크스페이스)
- [ ] 링크 기반 공유 시, 접근 주체 모델 정의(예: 이메일 매칭, 토큰 만료, 재발급, 2차 인증 옵션)
- [ ] 캘린더 연동 시 권한 최소화 원칙(읽기 범위/쓰기 범위/스코프 설명)
- [ ] 데이터 보관 정책: 폴/이벤트 TTL(기본값) + 관리자 오버라이드 + 즉시 삭제(요청 기반)
- [ ] 삭제 시 “즉시 삭제 vs 백업/로그/감사 메타데이터 잔존”을 구분해 명시
- [ ] 서브프로세서가 있다면 목록/목적/리전/변경 고지 방식 문서화
- [ ] 관리자 제어: 외부 게스트 허용 on/off, 데이터 export, 삭제, 감사 로그

### 3.2 AI 관련(있다면)

- [ ] (AI 기능이 도입될 경우) 학습(Training) 사용 여부/기본값/옵트아웃/보관기간을 별도 섹션으로 명시

## 4) 이번 기획에 대한 적용(초안)

- Flow 승인 없이는 DOC_GEN 금지 (워크플로우 게이트 준수)
- 핵심 정책/요구사항 변화는 `shared/30_decisions.md`에 append
