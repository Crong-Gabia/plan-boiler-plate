#!/usr/bin/env node
/*
 * Korean spellcheck for Markdown (online-dependent).
 *
 * This script is intentionally NOT part of `npm run verify` by default.
 * It relies on the external Daum spell-check service via the `hanfix` CLI.
 *
 * Usage:
 *   node ./scripts/spellcheck-ko.mjs [rootDir]
 *   node ./scripts/spellcheck-ko.mjs product-description --max-lines 300
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

const HANGUL_RE = /[가-힣]/

function parseArgs(argv) {
  const args = {
    rootDir: undefined,
    maxLines: 300,
    delayMs: 120,
    retries: 1,
  }

  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--max-lines') {
      args.maxLines = Number(argv[++i])
      continue
    }
    if (a === '--delay-ms') {
      args.delayMs = Number(argv[++i])
      continue
    }
    if (a === '--retries') {
      args.retries = Number(argv[++i])
      continue
    }
    if (a === '-h' || a === '--help') {
      args.help = true
      continue
    }
    if (a.startsWith('-')) {
      throw new Error(`Unknown option: ${a}`)
    }
    positional.push(a)
  }

  if (positional.length > 0) {
    args.rootDir = positional[0]
  }

  return args
}

function printHelp() {
  console.log(`Korean spellcheck for Markdown (online-dependent)

Usage:
  npm run spellcheck:ko
  node ./scripts/spellcheck-ko.mjs [rootDir] [--max-lines N] [--delay-ms MS] [--retries N]

Notes:
  - Uses 'hanfix' (Daum spell checker) and requires Internet access.
  - Intended for optional/manual runs (not included in npm run verify).
`)
}

function stripMarkdownNoise(text) {
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ')
  // Remove inline code
  text = text.replace(/`[^`]*`/g, ' ')
  // Remove markdown links but keep visible text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  return text
}

function* extractKoreanLines(text) {
  const cleaned = stripMarkdownNoise(text)
  for (const raw of cleaned.split(/\r?\n/)) {
    const ln = raw.trim()
    if (!ln) continue
    if (!HANGUL_RE.test(ln)) continue
    yield ln
  }
}

async function* iterMdFiles(rootDir) {
  const stack = [rootDir]
  while (stack.length) {
    const current = stack.pop()
    let entries
    try {
      entries = await fs.readdir(current, { withFileTypes: true })
    } catch {
      continue
    }

    for (const ent of entries) {
      const p = path.join(current, ent.name)

      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === '.idea' || ent.name === '.git') continue
        stack.push(p)
        continue
      }

      if (ent.isFile() && ent.name.endsWith('.md')) {
        yield p
      }
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function runHanfix(text, { retries }) {
  const args = ['--data', text, '--include-corrected']

  for (let attempt = 0; attempt <= retries; attempt++) {
    const out = await new Promise((resolve) => {
      const child = spawn('hanfix', args, { stdio: ['ignore', 'pipe', 'pipe'] })

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (d) => {
        stdout += String(d)
      })
      child.stderr.on('data', (d) => {
        stderr += String(d)
      })
      child.on('error', (err) => {
        resolve({ ok: false, code: -1, stdout: '', stderr: String(err) })
      })
      child.on('close', (code) => {
        resolve({ ok: code === 0, code: code ?? -1, stdout, stderr })
      })
    })

    if (out.ok) return out

    // Retry for transient/network issues.
    if (attempt < retries) {
      await sleep(250 * (attempt + 1))
      continue
    }

    return out
  }

  // Unreachable
  return { ok: false, code: -1, stdout: '', stderr: 'unknown' }
}

function parseHanfixJson(stdout) {
  const start = stdout.indexOf('{')
  const end = stdout.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('hanfix output did not contain JSON')
  }
  const jsonText = stdout.slice(start, end + 1)
  return JSON.parse(jsonText)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return 0
  }
  if (!Number.isFinite(args.maxLines) || args.maxLines <= 0) {
    throw new Error(`--max-lines must be a positive number (got: ${args.maxLines})`)
  }
  if (!Number.isFinite(args.delayMs) || args.delayMs < 0) {
    throw new Error(`--delay-ms must be a number >= 0 (got: ${args.delayMs})`)
  }

  const root = path.resolve(args.rootDir ?? 'product-description')
  try {
    const st = await fs.stat(root)
    if (!st.isDirectory()) {
      console.error(`Not a directory: ${root}`)
      return 0
    }
  } catch {
    // Optional check: if docs are not present yet, don't fail.
    console.error(`Directory not found; skipping Korean spellcheck: ${root}`)
    return 0
  }

  let checked = 0
  let hadIssues = false
  let issueCount = 0

  // Cache to reduce repeated online calls.
  const cache = new Map()

  for await (const file of iterMdFiles(root)) {
    let content
    try {
      content = await fs.readFile(file, 'utf8')
    } catch {
      continue
    }

    for (const line of extractKoreanLines(content)) {
      if (checked >= args.maxLines) break
      checked++

      const key = line
      let parsed
      if (cache.has(key)) {
        parsed = cache.get(key)
      } else {
        const result = await runHanfix(line, { retries: args.retries })
        if (!result.ok) {
          const stderr = (result.stderr ?? '').trim()
          console.error(`[ERROR] hanfix failed (exit=${result.code})`)
          if (stderr) console.error(stderr)
          if (stderr.includes('ENOENT')) {
            console.error('hanfix not found. Install dependencies via: npm install')
          }
          return 2
        }
        try {
          parsed = parseHanfixJson(result.stdout)
        } catch (e) {
          console.error('[ERROR] Failed to parse hanfix JSON output')
          console.error(String(e))
          return 2
        }
        cache.set(key, parsed)
      }

      const errors = Array.isArray(parsed?.errors) ? parsed.errors : []
      if (errors.length > 0) {
        hadIssues = true
        issueCount += errors.length
        console.log(`[KO] ${path.relative(process.cwd(), file)}`)
        for (const err of errors.slice(0, 3)) {
          const original = err?.original ?? line
          const suggestions = Array.isArray(err?.suggestions) ? err.suggestions : []
          const explanation = err?.explanation
          const corrected = err?.corrected
          console.log(`  - ${original}`)
          if (corrected && corrected !== original) {
            console.log(`  + ${corrected}`)
          }
          if (suggestions.length) {
            console.log(`    suggestions: ${suggestions.slice(0, 5).join(', ')}`)
          }
          if (explanation) {
            console.log(`    note: ${String(explanation).trim()}`)
          }
        }
        if (errors.length > 3) {
          console.log(`  ...and ${errors.length - 3} more issue(s) on this line`) 
        }
      }

      if (args.delayMs > 0) {
        await sleep(args.delayMs)
      }
    }
  }

  if (checked === 0) {
    console.log('No Korean text found to check.')
    return 0
  }

  if (hadIssues) {
    console.log(`\nKorean spellcheck found ${issueCount} issue(s) (checked ${checked} line(s)).`)
    return 1
  }
  console.log(`Korean spellcheck OK (checked ${checked} line(s)).`)
  return 0
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(String(err?.stack ?? err))
    process.exit(2)
  })
