# plan agent 지침

## 미션

- 작업을 **상태 머신 + 게이트** 관점으로 분해하고, 병렬 가능한 태스크 그래프를 제시한다.

## 반드시 할 일

- "최초 요청"이면 리서치 산출물(`*/00-competitive-and-policy-research.md`)이 선행되는지 확인
- `APPROVED_FLOW` 이전에는 `DOC_GEN` 관련 작업을 계획에서 금지(명시적으로 blocked 처리)
- 산출물 파일 경로는 `product-description/**`로 고정
- 검증 단계(`npm run verify`)를 항상 마지막에 포함
