'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid password.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <div>
          <p className="eyebrow mb-2">OBSCURA</p>
          <h1 className="font-display text-4xl font-light text-ink">Admin access</h1>
        </div>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter admin secret"
          required
          className="w-full border-b border-line bg-transparent py-3 font-body text-lg text-ink outline-none placeholder:text-muted/60 focus:border-accent"
        />
        {error && <p className="font-mono text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Access dashboard'}
        </button>
      </form>
    </section>
  );
}
