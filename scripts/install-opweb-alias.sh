#!/usr/bin/env bash
set -euo pipefail

# Adds a shell alias `opweb` -> <repo>/scripts/opweb.sh
#
# Default behavior: prints what it would do and asks to confirm.
# Non-interactive: pass --yes.

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
target="$root_dir/scripts/opweb.sh"

if [[ ! -f "$target" ]]; then
  echo "Missing: $target" >&2
  exit 1
fi

yes=0
if [[ "${1:-}" == "--yes" ]]; then
  yes=1
fi

shell_name="${SHELL:-}"
rc_file=""
if [[ "$shell_name" == *"zsh"* ]]; then
  rc_file="$HOME/.zshrc"
elif [[ "$shell_name" == *"bash"* ]]; then
  rc_file="$HOME/.bashrc"
else
  # best-effort default
  rc_file="$HOME/.zshrc"
fi

line="alias opweb=\"$target\""

echo "Will add the following line to: $rc_file"
echo "  $line"
echo ""
echo "Tip: configure proxy envs in one of:"
echo "  - $root_dir/.opweb.env"
echo "  - ~/.config/opencode/opweb.env"

if [[ "$yes" != "1" ]]; then
  read -r -p "Proceed? [y/N] " ans
  case "$ans" in
    y|Y|yes|YES) ;;
    *)
      echo "Cancelled."
      exit 0
      ;;
  esac
fi

mkdir -p "$(dirname "$rc_file")"
touch "$rc_file"

if grep -Fqx "$line" "$rc_file"; then
  echo "Already present."
else
  {
    echo ""
    echo "# plan-boiler-plate: opweb alias"
    echo "$line"
  } >> "$rc_file"
  echo "Added. Restart your shell or run: source $rc_file"
fi
