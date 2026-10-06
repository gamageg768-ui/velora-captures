'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4 text-red-500">Admin error</p>
      <h2 className="mb-2 font-display text-2xl font-light text-ink">Something went wrong</h2>
      <p className="mb-6 font-mono text-sm text-muted">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-full bg-accent px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-sky-400"
      >
        Try again
      </button>
    </div>
  );
}
