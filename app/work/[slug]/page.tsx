import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const photos = await prisma.photo.findMany({ select: { slug: true } });
  return photos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await prisma.photo.findUnique({ where: { slug: params.slug } });
  if (!photo) return {};
  return {
    title: photo.title,
    description: photo.description ?? `${photo.discipline} photography by Velora Captures.`,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const photo = await prisma.photo.findUnique({ where: { slug: params.slug } });
  if (!photo) notFound();

  return (
    <article className="pt-24 md:pt-28">
      {/* Hero image */}
      <section className="relative overflow-hidden">
        <div className="aspect-[16/9] w-full md:aspect-[16/7]">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
      </section>

      <div className="mx-auto max-w-container px-5 md:px-10">
        {/* Metadata */}
        <section className="pt-12 md:pt-16">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-8 border-b border-line pb-10">
              <div>
                <p className="eyebrow mb-3">{photo.discipline}</p>
                <h1 className="font-display text-5xl font-light tracking-tightest text-ink md:text-7xl">
                  {photo.title}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <p className="eyebrow mb-1">Client</p>
                  <p className="font-body text-sm text-ink">{photo.client}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Year</p>
                  <p className="font-body text-sm text-ink">{photo.year}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {photo.description && (
            <Reveal>
              <p className="mt-12 max-w-2xl font-display text-2xl font-light leading-[1.4] text-ink md:text-3xl">
                {photo.description}
              </p>
            </Reveal>
          )}
        </section>

        {/* Navigation */}
        <div className="my-24 flex items-center justify-between border-t border-line pt-10">
          <Link
            href="/work"
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink transition-colors"
          >
            ← All work
          </Link>
          <Link
            href="/booking"
            className="rounded-full border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-accent transition hover:bg-accent hover:text-white"
          >
            Book a session →
          </Link>
        </div>
      </div>
    </article>
  );
}
