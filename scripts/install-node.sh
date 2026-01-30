#!/usr/bin/env bash
set -euo pipefail

# Installs Node.js (and npm) on macOS/Linux.
# - macOS: Homebrew
# - Debian/Ubuntu: apt
#
# NOTE: Distro package managers may provide an older Node version.

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

if need_cmd node && need_cmd npm; then
  echo "Node is already installed: $(node --version)"
  echo "npm is already installed:  $(npm --version)"
  exit 0
fi

uname_s="$(uname -s)"

if [[ "$uname_s" == "Darwin" ]]; then
  if ! need_cmd brew; then
    echo "Homebrew is required to install Node on macOS." >&2
    echo "Install Homebrew first: https://brew.sh" >&2
    exit 1
  fi

  echo "Installing Node via Homebrew..."
  brew install node
  echo "Installed: $(node --version) / npm $(npm --version)"
  exit 0
fi

if [[ "$uname_s" == "Linux" ]]; then
  if need_cmd apt-get; then
    echo "Installing Node via apt (requires sudo)..."
    sudo apt-get update
    sudo apt-get install -y nodejs npm

    if ! need_cmd node || ! need_cmd npm; then
      echo "Node/npm installation finished but commands were not found." >&2
      echo "You may need to open a new shell, or your PATH may be unusual." >&2
      exit 1
    fi

    echo "Installed: $(node --version) / npm $(npm --version)"
    exit 0
  fi

  echo "Unsupported Linux distro/package manager (apt-get not found)." >&2
  echo "Please install Node.js manually and re-run." >&2
  exit 1
fi

echo "Unsupported OS: $uname_s" >&2
exit 1
