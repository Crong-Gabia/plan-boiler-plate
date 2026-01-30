#!/usr/bin/env bash
set -euo pipefail

# Spellcheck Markdown using cspell.
# - Uses bunx if available, otherwise npx.

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

runner=""
if need_cmd bunx; then
  runner="bunx"
elif need_cmd npx; then
  runner="npx"
fi

if [[ -z "$runner" ]]; then
  echo "Neither bunx nor npx found." >&2
  echo "Install bun (recommended for Oh My OpenCode) or install Node.js (for npx)." >&2
  exit 1
fi

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

"$runner" cspell lint \
  --config "$root_dir/cspell.json" \
  "$root_dir/**/*.md"
