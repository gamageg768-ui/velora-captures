'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_SLOTS } from '@/lib/booking';
import { formatDisplayDate } from '@/lib/booking';

type Booking = {
  id: string;
  name: string;
  date: string;
  timeSlot: string;
  callType: string;
  status: string;
};

type View =
  | 'loading'
  | 'error'
  | 'idle'
  | 'cancel-confirm'
  | 'cancelling'
  | 'cancelled'
  | 'reschedule'
  | 'rescheduling'
  | 'rescheduled';

export default function ManagePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-6 py-28">
          <p className="font-body text-muted">Loading your booking…</p>
        </main>
      }
    >
      <ManageContent />
    </Suspense>
  );
}

function ManageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<View>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  // Reschedule form state
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduledTo, setRescheduledTo] = useState<{ date: string; timeSlot: string } | null>(
    null,
  );

  useEffect(() => {
    if (!token) {
      setErrorMsg('No management token found in the URL.');
      setView('error');
      return;
    }

    fetch(`/api/booking/manage?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
          setView('error');
        } else {
          setBooking(data);
          setView('idle');
        }
      })
      .catch(() => {
        setErrorMsg('Could not load your booking. Please try again later.');
        setView('error');
      });
  }, [token]);

  async function handleCancel() {
    setView('cancelling');
    try {
      const res = await fetch(`/api/booking/manage?token=${encodeURIComponent(token)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed.');
      setView('cancelled');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setView('error');
    }
  }

  async function handleReschedule() {
    setRescheduleError('');
    if (!newDate || !newSlot) {
      setRescheduleError('Please select both a date and time slot.');
      return;
    }
    setView('rescheduling');
    try {
      const res = await fetch(`/api/booking/manage?token=${encodeURIComponent(token)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reschedule', date: newDate, timeSlot: newSlot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reschedule failed.');
      setRescheduledTo({ date: data.date, timeSlot: data.timeSlot });
      setView('rescheduled');
    } catch (err) {
      setRescheduleError(err instanceof Error ? err.message : 'Something went wrong.');
      setView('reschedule');
    }
  }

  const labelCls =
    'block font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-1';
  const inputCls =
    'w-full border-b border-line bg-transparent py-2 font-body text-ink outline-none transition focus:border-accent';

  return (
    <main className="mx-auto max-w-2xl px-6 py-28">
      <p className="eyebrow mb-6 text-muted">Manage your booking</p>

      <AnimatePresence mode="wait">
        {view === 'loading' && (
          <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-muted">
            Loading your booking…
          </motion.p>
        )}

        {view === 'error' && (
          <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-light text-ink">Something went wrong</h1>
            <p className="mt-3 font-body text-muted">{errorMsg}</p>
            <Link
              href="/"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
            >
              ← Back home
            </Link>
          </motion.div>
        )}

        {view === 'idle' && booking && (
          <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-light text-ink md:text-5xl">
              Hi, {booking.name}.
            </h1>

            {/* Booking summary */}
            <div className="mt-8 rounded-xl border border-line bg-surface/50 p-6">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className={labelCls}>Date</dt>
                  <dd className="font-body text-ink">{formatDisplayDate(booking.date)}</dd>
                </div>
                <div>
                  <dt className={labelCls}>Time</dt>
                  <dd className="font-body text-ink">{booking.timeSlot} (Lisbon / GMT+1)</dd>
                </div>
                <div>
                  <dt className={labelCls}>Type</dt>
                  <dd className="font-body text-ink">
                    {booking.callType === '30min' ? '30-minute intro' : '60-minute deep dive'}
                  </dd>
                </div>
                <div>
                  <dt className={labelCls}>Status</dt>
                  <dd className="font-body capitalize text-ink">{booking.status}</dd>
                </div>
              </dl>
            </div>

            {booking.status !== 'cancelled' && (
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setView('reschedule')}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => setView('cancel-confirm')}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-red-500"
                >
                  Cancel booking
                </button>
              </div>
            )}
          </motion.div>
        )}

        {view === 'cancel-confirm' && (
          <motion.div key="cancel-confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-3xl font-light text-ink">Are you sure?</h2>
            <p className="mt-3 font-body text-muted">
              This will cancel your booking permanently. You're welcome to book again any time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-red-400"
              >
                Yes, cancel my booking
              </button>
              <button
                onClick={() => setView('idle')}
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
              >
                Keep my booking
              </button>
            </div>
          </motion.div>
        )}

        {view === 'cancelling' && (
          <motion.p key="cancelling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-body text-muted">
            Cancelling…
          </motion.p>
        )}

        {view === 'cancelled' && (
          <motion.div key="cancelled" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow mb-4 text-muted">Booking cancelled</p>
            <h2 className="font-display text-4xl font-light text-ink md:text-5xl">
              Your booking has been cancelled.
            </h2>
            <p className="mt-4 font-body text-muted">
              No problem at all. You're welcome to book again whenever you're ready.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link
                href="/"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
              >
                ← Back home
              </Link>
              <Link
                href="/booking"
                className="font-mono text-xs uppercase tracking-[0.18em] text-accent link-underline hover:text-ink"
              >
                Book again
              </Link>
            </div>
          </motion.div>
        )}

        {(view === 'reschedule' || view === 'rescheduling') && (
          <motion.div key="reschedule" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-3xl font-light text-ink">Reschedule your call</h2>
            <p className="mt-2 font-body text-muted">Choose a new date and time for your booking.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="block">
                <span className={labelCls}>New date</span>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>New time</span>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select a time…</option>
                  {AVAILABLE_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {rescheduleError && (
              <p className="mt-3 font-mono text-xs text-red-500">{rescheduleError}</p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleReschedule}
                disabled={view === 'rescheduling'}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 disabled:opacity-50"
              >
                {view === 'rescheduling' ? 'Saving…' : 'Confirm reschedule →'}
              </button>
              <button
                onClick={() => setView('idle')}
                disabled={view === 'rescheduling'}
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink disabled:opacity-50"
              >
                ← Back
              </button>
            </div>
          </motion.div>
        )}

        {view === 'rescheduled' && rescheduledTo && (
          <motion.div key="rescheduled" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow mb-4 text-accent">Rescheduled</p>
            <h2 className="font-display text-4xl font-light text-ink md:text-5xl">
              Booking rescheduled to {formatDisplayDate(rescheduledTo.date)} at{' '}
              {rescheduledTo.timeSlot}.
            </h2>
            <p className="mt-4 font-body text-muted">
              Your slot is confirmed. I'll send updated calendar details shortly.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
            >
              ← Back home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
