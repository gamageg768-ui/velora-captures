'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'

type Photo = {
  slug: string
  title: string
  client: string
  year: string
  discipline: string
}

export default function WorkIndex({ photos }: { photos: Photo[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const disciplines = useMemo(() =>
    Array.from(new Set(photos.map(p => p.discipline))), [photos])

  const fuse = useMemo(() => new Fuse(photos, {
    keys: ['title', 'client', 'discipline'],
    threshold: 0.3,
  }), [photos])

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map(r => r.item) : photos
    if (activeTag) result = result.filter(p => p.discipline === activeTag)
    return result
  }, [query, activeTag, fuse, photos])

  if (photos.length === 0) return null

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search projects…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-full border border-line bg-surface/50 px-5 py-2.5 font-mono text-sm text-ink placeholder-muted outline-none transition focus:border-accent sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition ${
              activeTag === null ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent/50 hover:text-ink'
            }`}
          >
            All
          </button>
          {disciplines.map(d => (
            <button
              key={d}
              onClick={() => setActiveTag(activeTag === d ? null : d)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition ${
                activeTag === d ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent/50 hover:text-ink'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 flex items-end justify-between border-b border-line pb-4">
        <h2 className="h-section text-ink">Index</h2>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-muted">
          No projects match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div>
          {filtered.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor="hover"
              className="group grid grid-cols-12 items-center gap-4 border-b border-line py-6 transition-colors hover:bg-surface/40"
            >
              <span className="col-span-2 font-mono text-sm text-accent/70 md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="col-span-10 font-display text-2xl font-light text-ink transition group-hover:translate-x-2 group-hover:text-accent md:col-span-5 md:text-4xl">
                {p.title}
              </h3>
              <span className="col-span-6 col-start-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:col-span-4 md:col-start-auto">
                {p.discipline}
              </span>
              <span className="col-span-4 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:col-span-2">
                {p.year}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
