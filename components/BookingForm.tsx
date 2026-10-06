'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarPicker from '@/components/CalendarPicker';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import { formatDisplayDate } from '@/lib/booking';
import { cn } from '@/lib/utils';

type Step = 'pick' | 'details' | 'done';
type Status = 'idle' | 'submitting' | 'error';
type DepositStatus = 'prompt' | 'paying' | 'skipped' | 'error';

export default function BookingForm() {
  const [step, setStep] = useState<Step>('pick');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [callType, setCallType] = useState<'30min' | '60min'>('30min');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [depositStatus, setDepositStatus] = useState<DepositStatus>('prompt');
  const [depositError, setDepositError] = useState('');

  useEffect(() => {
    if (!date) return;
    setSlot('');
    setSlotsLoading(true);
    const controller = new AbortController();
    fetch(`/api/booking/slots?date=${date}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.slots ?? []);
        setSlotsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setAvailableSlots([]);
        setSlotsLoading(false);
      });
    return () => controller.abort();
  }, [date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, callType, date, timeSlot: slot, projectNote: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setBookingId(data.id ?? null);
      setDepositStatus('prompt');
      setStep('done');
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  async function handlePayDeposit() {
    if (!bookingId) return;
    setDepositStatus('paying');
    setDepositError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, callType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment setup failed.');
      window.location.href = data.url;
    } catch (err) {
      setDepositStatus('error');
      setDepositError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  function reset() {
    setStep('pick');
    setDate('');
    setSlot('');
    setName('');
    setEmail('');
    setNote('');
    setStatus('idle');
    setErrorMsg('');
    setBookingId(null);
    setDepositStatus('prompt');
    setDepositError('');
  }

  const fieldCls =
    'w-full border-b border-line bg-transparent py-3 font-body text-lg text-ink placeholder-muted/60 outline-none transition focus:border-accent';

  return (
    <AnimatePresence mode="wait">
      {step === 'done' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10"
        >
          <p className="eyebrow mb-4 text-accent">Booking confirmed</p>
          <h3 className="font-display text-4xl font-light text-ink md:text-5xl">
            You're all set. See you soon.
          </h3>
          <p className="mt-4 font-body text-muted">
            A confirmation email is on its way to{' '}
            <strong className="text-ink">{email}</strong>. I'll send calendar details
            shortly.
          </p>

          {/* Deposit prompt — shown inline in the done state */}
          {depositStatus === 'prompt' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-10 rounded-xl border border-line bg-surface/50 p-6"
            >
              <p className="eyebrow mb-2 text-muted">Optional</p>
              <h4 className="font-display text-2xl font-light text-ink">
                Secure your slot with a 50% deposit
              </h4>
              <p className="mt-2 font-body text-sm text-muted">
                {callType === '30min'
                  ? '$150 deposit for the 30-minute intro call.'
                  : '$250 deposit for the 60-minute deep dive.'}
                {' '}No charge until your call.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handlePayDeposit}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400"
                >
                  Pay deposit →
                </button>
                <button
                  onClick={() => setDepositStatus('skipped')}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {depositStatus === 'paying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 rounded-xl border border-line bg-surface/50 p-6"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Redirecting to checkout…
              </p>
            </motion.div>
          )}

          {depositStatus === 'skipped' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-xl border border-line bg-surface/50 p-6"
            >
              <p className="eyebrow mb-1 text-accent">Slot reserved</p>
              <p className="font-body text-muted">
                No deposit needed right now. Your slot is reserved and I'll be in
                touch with details.
              </p>
            </motion.div>
          )}

          {depositStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-xl border border-line bg-surface/50 p-6"
            >
              <p className="font-mono text-xs text-red-500">{depositError}</p>
              <button
                onClick={() => setDepositStatus('prompt')}
                className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-accent link-underline"
              >
                Try again
              </button>
            </motion.div>
          )}

          <button
            onClick={reset}
            className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
          >
            ← Book another call
          </button>
        </motion.div>
      ) : step === 'pick' ? (
        <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Call type */}
          <div className="mb-8">
            <p className="eyebrow mb-3">Call type</p>
            <div className="flex flex-wrap gap-3">
              {(['30min', '60min'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCallType(t)}
                  className={cn(
                    'rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.14em] transition',
                    callType === t
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line text-muted hover:border-accent/50 hover:text-ink',
                  )}
                >
                  {t === '30min' ? '30-minute intro' : '60-minute deep dive'}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-8">
            <p className="eyebrow mb-3">Select a date</p>
            <CalendarPicker selected={date} onSelect={setDate} />
          </div>

          {/* Time slots */}
          {date && (
            <div className="mb-8">
              <p className="eyebrow mb-3">
                Available times — {formatDisplayDate(date)}
              </p>
              <TimeSlotGrid
                slots={availableSlots}
                selected={slot}
                onSelect={setSlot}
                loading={slotsLoading}
              />
            </div>
          )}

          <button
            disabled={!date || !slot}
            onClick={() => setStep('details')}
            className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 disabled:opacity-40"
          >
            Continue →
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
        >
          {/* Summary */}
          <div className="mb-8 rounded-xl border border-line bg-surface/50 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {callType === '30min' ? '30-minute intro' : '60-minute deep dive'}
            </p>
            <p className="mt-1 font-body text-ink">
              {formatDisplayDate(date)} at {slot}
            </p>
            <button
              type="button"
              onClick={() => setStep('pick')}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent link-underline"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                className={fieldCls}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@company.com"
                className={fieldCls}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="eyebrow">Project note (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="A few words on what you're working on…"
                className={`${fieldCls} resize-none`}
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Confirming…' : 'Confirm booking →'}
            </button>
            {status === 'error' && (
              <span className="font-mono text-xs text-red-500">{errorMsg}</span>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
