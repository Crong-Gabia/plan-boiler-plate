#!/usr/bin/env bash
set -euo pipefail

# Installs OpenCode CLI.
# Default: official install script (does NOT require Node).
# Optional: npm global install (requires Node).

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

version_ge() {
  # Usage: version_ge 1.0.150 1.0.149  => true
  # Compares dotted numeric versions.
  local a="$1" b="$2"
  local IFS=.
  local -a av bv
  read -r -a av <<<"$a"
  read -r -a bv <<<"$b"
  local i max
  max=${#av[@]}
  if (( ${#bv[@]} > max )); then max=${#bv[@]}; fi
  for ((i=0; i<max; i++)); do
    local ai="${av[i]:-0}" bi="${bv[i]:-0}"
    # strip any non-numeric suffix
    ai="${ai%%[^0-9]*}"
    bi="${bi%%[^0-9]*}"
    if ((10#$ai > 10#$bi)); then return 0; fi
    if ((10#$ai < 10#$bi)); then return 1; fi
  done
  return 0
}

required_version="1.0.150"

if need_cmd opencode; then
  current="$(opencode --version | tr -d '[:space:]' || true)"
  echo "OpenCode is already installed: $current"
  if [[ -n "$current" ]] && version_ge "$current" "$required_version"; then
    exit 0
  fi
  echo "Warning: recommended OpenCode version is >= $required_version" >&2
  exit 0
fi

install_via="${1:-curl}"

if [[ "$install_via" == "npm" ]]; then
  if ! need_cmd node || ! need_cmd npm; then
    echo "Node/npm not found. Installing Node first..." >&2
    "$(dirname "$0")/install-node.sh"
  fi
  echo "Installing OpenCode via npm..."
  npm install -g opencode-ai
elif [[ "$install_via" == "curl" ]]; then
  if ! need_cmd curl; then
    echo "curl is required." >&2
    exit 1
  fi
  echo "Installing OpenCode via official installer..."
  curl -fsSL https://opencode.ai/install | bash
else
  echo "Unknown install method: $install_via" >&2
  echo "Usage: $0 [curl|npm]" >&2
  exit 1
fi

if ! need_cmd opencode; then
  echo "OpenCode installation finished but 'opencode' is not in PATH." >&2
  echo "Open a new shell and try: opencode --version" >&2
  exit 1
fi

installed="$(opencode --version | tr -d '[:space:]' || true)"
echo "Installed OpenCode: $installed"
if [[ -n "$installed" ]] && ! version_ge "$installed" "$required_version"; then
  echo "Warning: recommended OpenCode version is >= $required_version" >&2
fi
