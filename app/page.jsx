'use client'

import { useMemo, useState } from 'react'

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        padding: '6px 0',
      }}
    >
      <div
        style={{
          maxWidth: 800,
          whiteSpace: 'pre-wrap',
          borderRadius: 12,
          padding: '10px 12px',
          background: isUser ? '#111827' : '#F3F4F6',
          color: isUser ? 'white' : '#111827',
          border: isUser ? '1px solid #111827' : '1px solid #E5E7EB',
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default function Page() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Ask me anything about this boilerplate. (This is a minimal demo chat UI; configure OPENAI_API_KEY on the server to enable responses.)',
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const canSend = input.trim().length > 0 && !isSending

  const placeholder = useMemo(
    () => 'Type a message…',
    []
  )

  async function onSend() {
    const text = input.trim()
    if (!text) return

    setInput('')
    setIsSending(true)

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (status=${res.status})`)
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            `Error: ${String(e?.message ?? e)}\n\nIf you haven't set OPENAI_API_KEY, set it and restart the server.`,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ fontWeight: 700 }}>Plan Boilerplate Chat</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>
          Minimal Next.js wrapper (no auth, no persistence).
        </div>
      </header>

      <main style={{ flex: 1, padding: 16, maxWidth: 980, width: '100%', margin: '0 auto' }}>
        {messages.map((m, idx) => (
          <Message key={idx} role={m.role} content={m.content} />
        ))}
      </main>

      <footer style={{ borderTop: '1px solid #E5E7EB', padding: 12 }}>
        <div style={{ maxWidth: 980, width: '100%', margin: '0 auto', display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              padding: 10,
              borderRadius: 10,
              border: '1px solid #D1D5DB',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                if (canSend) onSend()
              }
            }}
          />
          <button
            type="button"
            disabled={!canSend}
            onClick={onSend}
            style={{
              width: 120,
              borderRadius: 10,
              border: '1px solid #111827',
              background: canSend ? '#111827' : '#9CA3AF',
              color: 'white',
              fontWeight: 600,
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
          >
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </div>
        <div style={{ maxWidth: 980, width: '100%', margin: '8px auto 0', fontSize: 12, color: '#6B7280' }}>
          Tip: Ctrl/⌘ + Enter to send.
        </div>
      </footer>
    </div>
  )
}
