#!/usr/bin/env bash
set -euo pipefail

# Logical consistency check using OpenCode run.
# Default behavior: best-effort (does not fail verify if opencode is unavailable).
# Set VERIFY_LOGICAL_STRICT=1 to make failures fatal.

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

strict="${VERIFY_LOGICAL_STRICT:-0}"
root_dir="$(cd "$(dirname "$0")/.." && pwd)"
docs_root="${DOCS_ROOT:-product-description}"
risk_file="$root_dir/$docs_root/shared/risk.md"

if [[ ! -d "$root_dir/$docs_root" ]]; then
  echo "$docs_root directory not found; skipping logical verify." >&2
  exit 0
fi

if ! need_cmd opencode; then
  echo "opencode not found; skipping logical verify." >&2
  if [[ "$strict" == "1" ]]; then
    exit 1
  fi
  exit 0
fi

mkdir -p "$(dirname "$risk_file")"

ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

prompt=$'<ultrawork-mode>\n\n@docs(= '"$docs_root"'/) 하위의 모든 Markdown 문서를 읽고 다음을 수행해줘:\n\n1) 논리적 모순/누락/충돌(정의-플로우-정책-용어 불일치 포함) 목록\n2) 심각도(High/Medium/Low) 분류\n3) 각 항목에 "근거"로 해당 파일/섹션을 인용\n4) 수정 제안(최소 변경 우선)\n\n출력은 아래 형식의 Markdown만:\n\n## [TIMESTAMP] Logical Review\n- Summary: ...\n\n### Findings\n1. [Severity] ...\n\n### Suggested Fixes\n- ...\n\n</ultrawork-mode>\n'

echo "Running logical verify via OpenCode..."
out=""
timeout_sec="${VERIFY_LOGICAL_TIMEOUT_SEC:-45}"

run_with_timeout() {
  # macOS-safe timeout using perl alarm.
  perl -e 'alarm $ARGV[0]; exec @ARGV[1..$#ARGV];' "$timeout_sec" "$@"
}

set +e
out=$(run_with_timeout opencode run "$prompt" 2>/dev/null)
code=$?
set -e

if [[ "$code" -ne 0 ]]; then
  echo "opencode run failed; skipping." >&2
  if [[ "$strict" == "1" ]]; then
    exit 1
  fi
  exit 0
fi

out="${out//\[TIMESTAMP\]/$ts}"

{
  echo ""
  echo "$out"
} >> "$risk_file"

echo "Appended logical review to: ${docs_root}/shared/risk.md"
