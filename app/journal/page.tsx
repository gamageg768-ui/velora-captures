import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { getAllPosts } from '@/lib/journal'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes on craft — writing about design, photography, typography, and process from OBSCURA Studio.',
}

export default function JournalPage() {
  const posts = getAllPosts()

  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <Reveal>
        <p className="eyebrow mb-6">(Notes on craft)</p>
        <h1 className="display-fluid text-ink">Journal</h1>
      </Reveal>

      <div className="mt-20 border-t border-line">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 4) * 0.07}>
            <Link
              href={`/journal/${post.slug}`}
              data-cursor="hover"
              className="group block border-b border-line py-10 transition-colors hover:bg-surface/30"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <time
                      dateTime={post.date}
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                    >
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="font-mono text-[11px] text-muted/50">·</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {post.readingTime} min read
                    </span>
                  </div>

                  <h2 className="mb-3 font-display text-2xl font-light text-ink transition group-hover:text-accent md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="max-w-2xl font-body text-base leading-relaxed text-muted">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="font-mono text-sm text-accent transition group-hover:translate-x-1 sm:mt-1 sm:shrink-0">
                  Read →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}

        {posts.length === 0 && (
          <Reveal>
            <p className="py-20 text-center font-mono text-sm text-muted">
              No posts yet — check back soon.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
