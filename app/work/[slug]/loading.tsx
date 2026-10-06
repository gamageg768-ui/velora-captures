export default function WorkSlugLoading() {
  return (
    <article className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-surface" />
      <div className="mb-16 aspect-[16/7] w-full animate-pulse rounded-2xl bg-surface" />
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-surface" />
        <div className="mt-8 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface" style={{ width: `${90 - i * 10}%` }} />
          ))}
        </div>
      </div>
    </article>
  );
}
