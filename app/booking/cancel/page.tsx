import Link from 'next/link';

export const metadata = { title: 'Payment cancelled — OBSCURA Studio' };

export default function BookingCancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="eyebrow mb-4 text-muted">No worries</p>
      <h1 className="font-display text-4xl font-light text-ink md:text-5xl">
        No problem — your slot is still reserved.
      </h1>
      <p className="mt-6 font-body text-muted">
        You cancelled the payment, but your booking is still in place. You can
        pay the deposit at any time before the call.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-6">
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
          Back to booking
        </Link>
      </div>
    </main>
  );
}
