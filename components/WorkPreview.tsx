import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';

export default async function WorkPreview() {
  const photos = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' }, take: 4 });

  if (photos.length === 0) return null;

  return (
    <div className="flex flex-col">
      {photos.map((p, i) => (
        <Reveal key={p.slug} delay={i * 0.05}>
          <Link
            href={`/work/${p.slug}`}
            className={cn(
              'group grid grid-cols-1 items-center gap-6 border-t border-line py-10 md:grid-cols-12 md:py-14',
            )}
          >
            <div className="md:col-span-1 font-mono text-sm text-accent/80">
              0{i + 1}
            </div>

            <div className={cn('md:col-span-5', i % 2 === 1 && 'md:order-last md:col-start-8')}>
              <div className="frame-hover overflow-hidden rounded-sm">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            <div className={cn('md:col-span-6', i % 2 === 1 && 'md:order-first md:col-start-2')}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-4xl font-light leading-none text-ink transition group-hover:text-accent md:text-6xl">
                  {p.title}
                </h3>
                <span className="font-mono text-xs text-muted">{p.year}</span>
              </div>
              {p.description && (
                <p className="mt-4 max-w-md font-body text-muted">{p.description}</p>
              )}
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                <span>{p.discipline}</span>
                <span className="h-px w-8 bg-line/30" />
                <span>{p.client}</span>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
