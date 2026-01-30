#!/usr/bin/env bash
set -euo pipefail

# One-shot setup for this repo.
# - Installs OpenCode CLI
# - Installs Oh My OpenCode plugin (optional; controlled by env vars)
# - Ensures Node/npm and installs devDependencies
# - Runs verification

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

echo "[1/4] Installing OpenCode (if missing)"
"$root_dir/scripts/install-opencode.sh" "${OPENCODE_INSTALL_METHOD:-curl}"

echo "[2/4] Ensuring Node/npm (for repo verification tooling)"
"$root_dir/scripts/install-node.sh"

echo "[3/4] Installing repo devDependencies (cspell/mermaid)"
if ! need_cmd npm; then
  echo "npm not found even after Node install." >&2
  exit 1
fi
cd "$root_dir"
npm install

echo "[4/4] Installing Oh My OpenCode plugin (optional)"
claude="${OHMY_CLAUDE:-}"
chatgpt="${OHMY_CHATGPT:-}"
gemini="${OHMY_GEMINI:-}"

if [[ -n "$claude" && -n "$chatgpt" && -n "$gemini" ]]; then
  "$root_dir/scripts/install-oh-my-opencode.sh" --claude="$claude" --chatgpt="$chatgpt" --gemini="$gemini"
else
  echo "Skipping Oh My OpenCode install (set env vars to enable):"
  echo "  OHMY_CLAUDE=<yes|no|max20> OHMY_CHATGPT=<yes|no> OHMY_GEMINI=<yes|no> ./scripts/setup.sh"
fi

echo "Running verification"
npm run verify

echo "Done. Next:" 
echo "  - OpenCode Web UI: opencode web"
echo "  - Start in product-description/ko with: 00-competitive-and-policy-research.md -> 03-flow-and-ux.md"
