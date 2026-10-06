import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { projects } from '@/lib/projects';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.overview,
  };
}

export default function CaseStudyPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <article className="pt-24 md:pt-28">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "creator": { "@type": "Organization", "name": "OBSCURA Studio" },
        "dateCreated": project.year,
        "description": project.overview,
        "keywords": project.tags.join(', ')
      }} />
      {/* Hero image */}
      <section className="relative overflow-hidden">
        <div className="aspect-[16/7] w-full">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
      </section>

      <div className="mx-auto max-w-container px-5 md:px-10">
        {/* Metadata row */}
        <section className="pt-12 md:pt-16">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-8 border-b border-line pb-10">
              <div>
                <p className="eyebrow mb-3">{project.discipline}</p>
                <h1 className="font-display text-6xl font-light tracking-tightest text-ink md:text-8xl">
                  {project.title}
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-5 md:grid-cols-3">
                <div>
                  <p className="eyebrow mb-1">Client</p>
                  <p className="font-body text-sm text-ink">{project.client}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Year</p>
                  <p className="font-body text-sm text-ink">{project.year}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Overview */}
          <Reveal>
            <p className="mt-12 max-w-2xl font-display text-2xl font-light leading-[1.4] text-ink md:text-3xl">
              {project.overview}
            </p>
          </Reveal>
        </section>

        {/* 3-col text blocks */}
        <section className="mt-20 grid grid-cols-1 gap-12 border-t border-line pt-16 md:grid-cols-3">
          {[
            { label: 'Challenge', body: project.challenge },
            { label: 'Solution', body: project.solution },
            { label: 'Outcome', body: project.outcome },
          ].map((block, i) => (
            <Reveal key={block.label} delay={i * 0.07}>
              <p className="eyebrow mb-4">{block.label}</p>
              <p className="font-body leading-relaxed text-muted">{block.body}</p>
            </Reveal>
          ))}
        </section>

        {/* Image grid */}
        {project.images.length > 1 && (
          <section className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.images.map((src, i) => (
              <Reveal key={src + i} delay={i * 0.04}>
                <div className="frame-hover overflow-hidden rounded-xl">
                  <img
                    src={src}
                    alt={`${project.title} — image ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {/* Before / After slider */}
        {project.images.length >= 1 && (
          <section className="mt-20 border-t border-line pt-16">
            <Reveal>
              <p className="eyebrow mb-3">Process</p>
              <h2 className="mb-8 font-display text-3xl font-light text-ink">Before / After</h2>
              <BeforeAfterSlider
                before={project.images[0]}
                after={project.images[1] ?? project.images[0]}
              />
            </Reveal>
          </section>
        )}

        {/* Bottom navigation */}
        <div className="my-24 flex items-center justify-between border-t border-line pt-10">
          <Link
            href="/work"
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink transition-colors"
          >
            ← All work
          </Link>
          <Link
            href="/booking"
            data-cursor="hover"
            className="rounded-full border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-accent transition hover:bg-accent hover:text-white"
          >
            Book a call →
          </Link>
        </div>
      </div>
    </article>
  );
}
