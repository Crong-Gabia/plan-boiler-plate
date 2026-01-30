# Design outputs (Stitch MCP)

Stitch MCP로 생성되는 디자인 산출물(`.png`/`.html`)을 저장합니다.

권장 구조:

```
product-description/design/
  <topic-or-screen>/
    <name>.png
    <name>.html
    notes.md        # 선택: 의도/결정 로그 링크
```

규칙:
- 파일은 가능한 한 **쌍(png+html)**으로 유지합니다.
- 관련 결정/논의는 `product-description/shared/30_decisions.md`에 append하고, `notes.md`에서 링크로 연결합니다.
