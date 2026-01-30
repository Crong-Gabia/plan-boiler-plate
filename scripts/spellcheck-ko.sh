#!/usr/bin/env bash
set -euo pipefail

# Korean spellcheck for Markdown (online-dependent).
# Creates a local venv under .spellcheck-venv.

# By default this is BEST-EFFORT (network/rate-limit failures won't fail CI).
# Set VERIFY_KO_SPELLCHECK_STRICT=1 to make failures fatal.

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

if ! need_cmd python3; then
  echo "python3 is required." >&2
  exit 1
fi

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
venv_dir="$root_dir/.spellcheck-venv"
strict="${VERIFY_KO_SPELLCHECK_STRICT:-0}"

if [[ ! -d "$venv_dir" ]]; then
  python3 -m venv "$venv_dir"
fi

set +e
"$venv_dir/bin/python" -m pip install --upgrade pip --timeout 5 --retries 0 >/dev/null 2>&1
pip_code=$?
if [[ "$pip_code" -ne 0 ]]; then
  echo "pip upgrade failed (online-dependent)." >&2
  if [[ "$strict" == "1" ]]; then
    exit "$pip_code"
  fi
  exit 0
fi

"$venv_dir/bin/python" -m pip install -r "$root_dir/scripts/requirements-ko-spellcheck.txt" --timeout 5 --retries 0 >/dev/null 2>&1
pip_code=$?
set -e

if [[ "$pip_code" -ne 0 ]]; then
  echo "Korean spellcheck dependency install failed (online-dependent)." >&2
  if [[ "$strict" == "1" ]]; then
    exit "$pip_code"
  fi
  exit 0
fi

set +e
"$venv_dir/bin/python" "$root_dir/scripts/spellcheck-ko.py" "$root_dir"
code=$?
set -e

if [[ "$code" -ne 0 ]]; then
  echo "Korean spellcheck failed (exit=$code)." >&2
  echo "This check is online-dependent and runs best-effort by default." >&2
  echo "To enforce strictly, run: npm run verify:spelling:ko" >&2
  if [[ "$strict" == "1" ]]; then
    exit "$code"
  fi
  exit 0
fi
