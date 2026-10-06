'use client'
import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const j = await res.json()
    if (res.ok) { setStatus('done'); setMsg(j.message ?? 'You\'re on the list.') }
    else { setStatus('error'); setMsg(j.error ?? 'Something went wrong.') }
  }

  if (status === 'done') return (
    <p className="font-mono text-sm text-accent">{msg}</p>
  )

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-full border border-line bg-transparent px-4 py-2 font-mono text-sm text-ink placeholder-muted outline-none transition focus:border-accent"
      />
      <button
        type="submit" disabled={status === 'loading'}
        className="rounded-full bg-accent px-5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition hover:bg-accent/90 disabled:opacity-50"
      >
        {status === 'loading' ? '…' : 'Join'}
      </button>
      {status === 'error' && <p className="mt-1 font-mono text-xs text-red-500">{msg}</p>}
    </form>
  )
}
