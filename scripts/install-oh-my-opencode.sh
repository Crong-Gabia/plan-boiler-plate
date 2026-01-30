#!/usr/bin/env bash
set -euo pipefail

# Installs Oh My OpenCode plugin via bunx.
#
# Usage:
#   ./scripts/install-oh-my-opencode.sh --claude=yes --chatgpt=no --gemini=no
#
# Notes:
# - This script does NOT log you in. After install, run `opencode` then `/connect`.

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

ensure_bun() {
  if need_cmd bun; then
    return 0
  fi

  if need_cmd brew && [[ "$(uname -s)" == "Darwin" ]]; then
    echo "Installing bun via Homebrew..."
    brew install bun
  else
    if ! need_cmd curl; then
      echo "curl is required to install bun." >&2
      exit 1
    fi
    echo "Installing bun via official installer..."
    curl -fsSL https://bun.sh/install | bash
    # bun installer typically adds to ~/.bun/bin
    export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
    export PATH="$BUN_INSTALL/bin:$PATH"
  fi

  if ! need_cmd bun; then
    echo "bun installation finished but 'bun' is not in PATH." >&2
    echo "Open a new shell and try: bun --version" >&2
    exit 1
  fi
}

claude=""
chatgpt=""
gemini=""

for arg in "$@"; do
  case "$arg" in
    --claude=*) claude="${arg#*=}" ;;
    --chatgpt=*) chatgpt="${arg#*=}" ;;
    --gemini=*) gemini="${arg#*=}" ;;
    -h|--help)
      echo "Usage: $0 --claude=<yes|no|max20> --chatgpt=<yes|no> --gemini=<yes|no>";
      exit 0
      ;;
    *)
      echo "Unknown arg: $arg" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$claude" || -z "$chatgpt" || -z "$gemini" ]]; then
  echo "Missing required flags." >&2
  echo "Example: $0 --claude=yes --chatgpt=no --gemini=no" >&2
  exit 1
fi

ensure_bun

echo "Installing Oh My OpenCode plugin..."
bunx oh-my-opencode install --no-tui --claude="$claude" --chatgpt="$chatgpt" --gemini="$gemini"

echo "Done. Verify:" 
echo "  opencode --version"
echo "  cat ~/.config/opencode/opencode.json | grep -n \"oh-my-opencode\""
