import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ROOT = path.resolve(process.cwd())
const DOCS_ROOT = process.env.DOCS_ROOT || 'product-description'
const TARGET_DIR = path.join(ROOT, DOCS_ROOT)

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d.toString()))
    p.stderr.on('data', (d) => (err += d.toString()))
    p.on('close', (code) => resolve({ code: code ?? 1, out, err }))
  })
}

async function resolveMmdcCommand() {
  // Prefer local install, fallback to npx.
  const local = path.join(ROOT, 'node_modules', '.bin', process.platform === 'win32' ? 'mmdc.cmd' : 'mmdc')
  try {
    await fs.access(local)
    return { cmd: local, prefixArgs: [] }
  } catch {
    return { cmd: 'npx', prefixArgs: ['-y', '@mermaid-js/mermaid-cli', 'mmdc'] }
  }
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.idea' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else yield p
  }
}

function extractMermaidBlocks(markdown) {
  const blocks = []
  const re = /```mermaid\s*\n([\s\S]*?)\n```/g
  let m
  while ((m = re.exec(markdown)) !== null) {
    blocks.push(m[1])
  }
  return blocks
}

async function main() {
  let ok = 0
  let fail = 0

  const { cmd, prefixArgs } = await resolveMmdcCommand()
  const tmpDir = path.join(ROOT, '.tmp', 'mermaid-validate')
  await fs.mkdir(tmpDir, { recursive: true })

  try {
    await fs.access(TARGET_DIR)
  } catch {
    console.log(`No '${path.relative(ROOT, TARGET_DIR)}' directory; skipping Mermaid validation.`)
    return
  }

  for await (const file of walk(TARGET_DIR)) {
    if (!file.endsWith('.md')) continue
    const content = await fs.readFile(file, 'utf8')
    const blocks = extractMermaidBlocks(content)
    for (let i = 0; i < blocks.length; i++) {
      const diagram = blocks[i]
      try {
        const rel = path.relative(ROOT, file)
        const inFile = path.join(tmpDir, `${rel.replace(/[^a-zA-Z0-9._-]/g, '_')}.block${i + 1}.mmd`)
        const outFile = path.join(tmpDir, `${rel.replace(/[^a-zA-Z0-9._-]/g, '_')}.block${i + 1}.svg`)
        await fs.writeFile(inFile, diagram, 'utf8')

        const args = [...prefixArgs, '-i', inFile, '-o', outFile]
        const res = await run(cmd, args)
        if (res.code !== 0) {
          fail++
          console.error(`[Mermaid INVALID] ${rel} (block #${i + 1})`) 
          if (res.err.trim()) console.error(res.err.trim())
          else console.error(`mmdc exited with code ${res.code}`)
        } else {
          ok++
        }
      } catch (e) {
        fail++
        const rel = path.relative(ROOT, file)
        console.error(`[Mermaid INVALID] ${rel} (block #${i + 1})`)
        console.error(String(e?.message ?? e))
      }
    }
  }

  if (fail > 0) {
    console.error(`Mermaid validation failed: ${fail} invalid block(s), ${ok} ok.`)
    process.exit(1)
  }
  console.log(`Mermaid validation OK: ${ok} block(s).`)
}

await main()
