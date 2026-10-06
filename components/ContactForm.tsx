'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const budgets = ['Under $5k', '$5k – $15k', '$15k – $40k', '$40k+'];

const fieldCls =
  'w-full border-b border-line/50 bg-transparent py-3 font-body text-lg text-ink placeholder-muted/60 outline-none transition focus:border-accent';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [budget, setBudget] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, budget }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Something went wrong.');
      }
      setStatus('sent');
      form.reset();
      setBudget('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10"
          >
            <p className="eyebrow mb-4 text-accent">Message received</p>
            <h3 className="font-display text-4xl font-light text-ink md:text-5xl">
              Thank you. I’ll be in touch within two business days.
            </h3>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
            >
              ← Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            <label className="block">
              <span className="eyebrow">Your name</span>
              <input name="name" required placeholder="Jane Doe" className={fieldCls} />
            </label>
            <label className="block">
              <span className="eyebrow">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="jane@studio.com"
                className={fieldCls}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="eyebrow">Subject</span>
              <input
                name="subject"
                placeholder="Brand identity + launch photography"
                className={fieldCls}
              />
            </label>

            <div className="md:col-span-2">
              <span className="eyebrow">Budget</span>
              <div className="mt-3 flex flex-wrap gap-3">
                {budgets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition ${
                      budget === b
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-line text-muted hover:border-accent/40 hover:text-ink'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <label className="block md:col-span-2">
              <span className="eyebrow">Tell me about the project</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="A few words on scope, timeline, and what you’re hoping to make…"
                className={`${fieldCls} resize-none`}
              />
            </label>

            <div className="flex items-center gap-6 md:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-bg transition hover:bg-accent disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <span className="transition group-hover:translate-x-1">→</span>
              </button>
              {status === 'error' && (
                <span className="font-mono text-xs text-red-500">{error}</span>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
