import { NextResponse } from 'next/server'

function pickModel() {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini'
}

function pickBaseUrl() {
  return (process.env.OPENAI_BASE_URL || 'https://api.openai.com').replace(/\/$/, '')
}

export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not set' },
      { status: 500 }
    )
  }

  const body = await req.json().catch(() => null)
  const inputMessages = Array.isArray(body?.messages) ? body.messages : []

  // Keep it minimal: only accept {role, content}.
  const messages = inputMessages
    .filter((m) => m && typeof m === 'object')
    .map((m) => ({
      role: String(m.role || ''),
      content: String(m.content || ''),
    }))
    .filter((m) => (m.role === 'user' || m.role === 'assistant' || m.role === 'system') && m.content.length > 0)
    .slice(-30)

  const system = {
    role: 'system',
    content:
      'You are a helpful assistant for a planning boilerplate repo. Be concise and practical. If you need repo context, ask the user to paste relevant snippets.'
  }

  const res = await fetch(`${pickBaseUrl()}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: pickModel(),
      messages: [system, ...messages],
      temperature: 0.2,
    }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.error?.message || `Upstream error (status=${res.status})`
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const message = data?.choices?.[0]?.message?.content
  if (!message) {
    return NextResponse.json({ error: 'No message returned from model' }, { status: 500 })
  }

  return NextResponse.json({ message })
}
