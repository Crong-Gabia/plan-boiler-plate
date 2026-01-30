#!/usr/bin/env node
/**
 * Cross-platform spelling check for Markdown using cspell.
 *
 * Scope: by default only checks DOCS_ROOT (default: product-description).
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ROOT = path.resolve(process.cwd())
const DOCS_ROOT = process.env.DOCS_ROOT || 'product-description'
const TARGET_GLOB = path.join(ROOT, DOCS_ROOT, '**', '*.md')

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit' })
    p.on('close', (code) => resolve(code ?? 1))
    p.on('error', () => resolve(1))
  })
}

async function resolveCspellCommand() {
  // Prefer local install, fallback to npx.
  const local = path.join(
    ROOT,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'cspell.cmd' : 'cspell'
  )
  try {
    await fs.access(local)
    return { cmd: local, prefixArgs: [] }
  } catch {
    return { cmd: 'npx', prefixArgs: ['-y', 'cspell'] }
  }
}

async function main() {
  // If docs root doesn't exist yet, don't fail setup/verify.
  try {
    await fs.access(path.join(ROOT, DOCS_ROOT))
  } catch {
    console.log(`No '${DOCS_ROOT}' directory; skipping spelling check.`)
    return 0
  }

  const { cmd, prefixArgs } = await resolveCspellCommand()
  const args = [...prefixArgs, 'lint', '--config', path.join(ROOT, 'cspell.json'), TARGET_GLOB]
  const code = await run(cmd, args)
  return code
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(String(err?.stack ?? err))
    process.exit(1)
  })
