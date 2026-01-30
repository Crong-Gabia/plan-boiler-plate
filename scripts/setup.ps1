$ErrorActionPreference = 'Stop'

function Write-Step([string]$msg) {
  Write-Host $msg
}

function Has-Command([string]$name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Ensure-Node {
  if (Has-Command node -and Has-Command npm) {
    return
  }

  Write-Step "Node.js not found. Trying to install Node.js (LTS)..."

  if (Has-Command winget) {
    # Requires App Installer / winget. May prompt depending on policy.
    Write-Host "Using winget to install OpenJS.NodeJS.LTS"
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  } elseif (Has-Command choco) {
    Write-Host "Using Chocolatey to install nodejs-lts"
    choco install nodejs-lts -y
  } else {
    Write-Error "Neither winget nor choco found. Install Node.js (LTS) from https://nodejs.org/"
    exit 1
  }

  if (-not (Has-Command node) -or -not (Has-Command npm)) {
    Write-Error "Node/npm still not found after install attempt. Restart your terminal and try again."
    exit 1
  }
}

function Ensure-OpenCode {
  if (Has-Command opencode) {
    Write-Host "opencode already installed."
    return
  }

Write-Step "OpenCode CLI not found. Installing via npm global package (best-effort)..."
  try {
    npm install -g opencode-ai
    if ($LastExitCode -ne 0) { throw "npm install -g opencode-ai failed" }
  } catch {
    Write-Warning "Failed to install opencode. Logical verify will be skipped unless opencode is installed."
  }
}

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')

Write-Step "[1/4] Ensuring Node/npm"
Ensure-Node

Write-Step "[2/4] Installing repo devDependencies"
Push-Location $Root
try {
  npm install
  if ($LastExitCode -ne 0) { exit $LastExitCode }
} finally {
  Pop-Location
}

Write-Step "[3/4] Ensuring OpenCode CLI (optional)"
Ensure-OpenCode

Write-Step "[4/4] Running verification"
Push-Location $Root
try {
  npm run verify
  if ($LastExitCode -ne 0) { exit $LastExitCode }
} finally {
  Pop-Location
}

Write-Host "Done. Next:"
Write-Host "  - OpenCode Web UI: opencode web"
Write-Host "  - Start in product-description/ko with: 00-competitive-and-policy-research.md -> 03-flow-and-ux.md"
