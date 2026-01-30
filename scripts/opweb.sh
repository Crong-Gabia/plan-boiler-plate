#!/usr/bin/env bash
set -euo pipefail

# opweb: convenience wrapper for `opencode web`.
#
# Why: In some corporate networks, you may need proxy env vars consistently set.
# This wrapper optionally loads proxy envs from a file, then runs the web UI.
#
# Usage:
#   ./scripts/opweb.sh
#   OPWEB_PORT=4096 OPWEB_HOSTNAME=0.0.0.0 ./scripts/opweb.sh
#   ./scripts/opweb.sh --port 4096   # forwarded to opencode
#
# Proxy env file (optional; first match wins):
#   1) <repo>/.opweb.env
#   2) ~/.config/opencode/opweb.env
#
# Supported variables in env file:
#   HTTP_PROXY / HTTPS_PROXY / NO_PROXY
#   OPWEB_PORT / OPWEB_HOSTNAME

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
repo_env="$root_dir/.opweb.env"
user_env="$HOME/.config/opencode/opweb.env"

if [[ -f "$repo_env" ]]; then
  # shellcheck disable=SC1090
  source "$repo_env"
elif [[ -f "$user_env" ]]; then
  # shellcheck disable=SC1090
  source "$user_env"
fi

if ! need_cmd opencode; then
  echo "opencode not found in PATH." >&2
  echo "Install it first: ./scripts/install-opencode.sh" >&2
  exit 1
fi

port="${OPWEB_PORT:-4096}"
hostname="${OPWEB_HOSTNAME:-127.0.0.1}"

# If the caller already passed --port/--hostname, we won't override.
has_port=0
has_hostname=0
for arg in "$@"; do
  case "$arg" in
    --port|--port=*) has_port=1 ;;
    --hostname|--hostname=*) has_hostname=1 ;;
  esac
done

args=("web")
if [[ "$has_port" == "0" ]]; then
  args+=("--port" "$port")
fi
if [[ "$has_hostname" == "0" ]]; then
  args+=("--hostname" "$hostname")
fi

exec opencode "${args[@]}" "$@"
