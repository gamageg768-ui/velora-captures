import Link from 'next/link';

export const metadata = { title: 'Deposit received — OBSCURA Studio' };

export default function BookingSuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="eyebrow mb-4 text-accent">Payment confirmed</p>
      <h1 className="font-display text-4xl font-light text-ink md:text-5xl">
        Deposit received. See you soon.
      </h1>
      <p className="mt-6 font-body text-muted">
        Your deposit has been processed and your slot is fully secured. I'll send
        a calendar invite and video call link shortly.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink"
      >
        ← Back home
      </Link>
    </main>
  );
}
