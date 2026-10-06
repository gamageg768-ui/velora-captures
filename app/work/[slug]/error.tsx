'use client';

import Link from 'next/link';

export default function WorkSlugError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-container flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow mb-6 text-red-500">Case study error</p>
      <h1 className="font-display text-4xl font-light text-ink">Could not load this project</h1>
      <p className="mt-4 font-body text-muted">
        Something went wrong rendering this case study.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-accent px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400"
        >
          Try again
        </button>
        <Link
          href="/work"
          className="rounded-full border border-line px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-accent hover:text-accent"
        >
          ← All work
        </Link>
      </div>
    </section>
  );
}
