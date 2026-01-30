#!/usr/bin/env node
/**
 * Cross-platform logical consistency check using `opencode run`.
 *
 * Default behavior: best-effort (does not fail verify if opencode is unavailable).
 * Set VERIFY_LOGICAL_STRICT=1 to make failures fatal.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ROOT = path.resolve(process.cwd())
const DOCS_ROOT = process.env.DOCS_ROOT || 'product-description'
const STRICT = process.env.VERIFY_LOGICAL_STRICT === '1'
const TIMEOUT_SEC = Number(process.env.VERIFY_LOGICAL_TIMEOUT_SEC || '45')

function nowUtcIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function runWithTimeout(cmd, args, timeoutMs) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''

    const timer = setTimeout(() => {
      try {
        p.kill('SIGKILL')
      } catch {
        // ignore
      }
      resolve({ code: 124, out, err: err || `Timed out after ${timeoutMs}ms` })
    }, timeoutMs)

    p.stdout.on('data', (d) => (out += d.toString()))
    p.stderr.on('data', (d) => (err += d.toString()))
    p.on('error', (e) => {
      clearTimeout(timer)
      resolve({ code: 127, out: '', err: String(e) })
    })
    p.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code: code ?? 1, out, err })
    })
  })
}

async function resolveOpencodeCommand() {
  if (process.platform !== 'win32') return 'opencode'

  // On Windows, opencode is often installed as `opencode.cmd`.
  const whereRes = await runWithTimeout('where', ['opencode'], 5000)
  if (whereRes.code !== 0) return 'opencode'

  const first = (whereRes.out || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.length > 0)

  return first || 'opencode'
}

async function main() {
  const docsDir = path.join(ROOT, DOCS_ROOT)
  if (!(await fileExists(docsDir))) {
    console.error(`${DOCS_ROOT} directory not found; skipping logical verify.`)
    return 0
  }

  // If opencode isn't available, skip (unless strict).
  const whichRes = await runWithTimeout(
    process.platform === 'win32' ? 'where' : 'command',
    process.platform === 'win32' ? ['opencode'] : ['-v', 'opencode'],
    5000
  )

  if (whichRes.code !== 0) {
    console.error('opencode not found; skipping logical verify.')
    return STRICT ? 1 : 0
  }

  const opencodeCmd = await resolveOpencodeCommand()
  const riskFile = path.join(docsDir, 'shared', 'risk.md')
  await fs.mkdir(path.dirname(riskFile), { recursive: true })

  const ts = nowUtcIso()
  const prompt = `<ultrawork-mode>

@docs(= ${DOCS_ROOT}/) 하위의 모든 Markdown 문서를 읽고 다음을 수행해줘:

1) 논리적 모순/누락/충돌(정의-플로우-정책-용어 불일치 포함) 목록
2) 심각도(High/Medium/Low) 분류
3) 각 항목에 "근거"로 해당 파일/섹션을 인용
4) 수정 제안(최소 변경 우선)

출력은 아래 형식의 Markdown만:

## [TIMESTAMP] Logical Review
- Summary: ...

### Findings
1. [Severity] ...

### Suggested Fixes
- ...

</ultrawork-mode>
`

  console.log('Running logical verify via OpenCode...')
  const runRes = await runWithTimeout(opencodeCmd, ['run', prompt], TIMEOUT_SEC * 1000)

  if (runRes.code !== 0) {
    console.error('opencode run failed; skipping.')
    return STRICT ? 1 : 0
  }

  const output = (runRes.out || '').replaceAll('[TIMESTAMP]', ts)
  await fs.appendFile(riskFile, `\n${output}\n`, 'utf8')
  console.log(`Appended logical review to: ${path.join(DOCS_ROOT, 'shared', 'risk.md')}`)
  return 0
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(String(err?.stack ?? err))
    process.exit(1)
  })
