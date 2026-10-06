import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-container flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow mb-6">(404)</p>
      <h1 className="display-fluid text-ink">
        Out of <span className="italic text-accent">frame</span>
      </h1>
      <p className="mt-6 max-w-md font-body text-muted">
        This page didn’t develop. Let’s get you back to something in focus.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-line px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-accent hover:text-accent"
      >
        Back home <span>→</span>
      </Link>
    </section>
  );
}
