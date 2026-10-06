import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/journal'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function JournalPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      {/* Back link */}
      <Link
        href="/journal"
        className="mb-12 inline-block font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-ink link-underline"
      >
        ← Journal
      </Link>

      {/* Eyebrow — date + tags */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
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
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="h-section mb-10 max-w-3xl text-ink">{post.title}</h1>

      {/* Divider */}
      <div className="mb-12 border-t border-line" />

      {/* Prose content */}
      <div className="max-w-2xl prose-journal">
        <MDXRemote source={post.content} />
      </div>

      {/* Bottom nav */}
      <div className="mt-20 flex items-center justify-between border-t border-line pt-10">
        <Link
          href="/journal"
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-ink link-underline"
        >
          ← All posts
        </Link>
        <Link
          href="/booking"
          data-cursor="hover"
          className="rounded-full border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-accent transition hover:bg-accent hover:text-white"
        >
          Book a call →
        </Link>
      </div>
    </article>
  )
}
