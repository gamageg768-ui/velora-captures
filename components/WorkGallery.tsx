import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import Reveal from '@/components/Reveal';

export default function WorkGallery() {
  if (projects.length === 0) {
    return (
      <section className="mx-auto max-w-container px-5 py-28 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          No work added yet — add photos to lib/projects.ts
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-container px-5 py-12 md:px-10">
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.04}>
            <Link
              href={`/work/${p.slug}`}
              data-cursor="hover"
              className="frame-hover group relative mb-5 block break-inside-avoid overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 via-ink/10 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: p.tint }}
                >
                  {p.discipline}
                </span>
                <h3 className="mt-1 font-display text-2xl font-light text-white">{p.title}</h3>
                <p className="mt-1 font-mono text-[11px] text-white/60">
                  {p.client} — {p.year}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
