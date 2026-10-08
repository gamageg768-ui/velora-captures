import Link from 'next/link';
import Marquee from '@/components/Marquee';
import Reveal from '@/components/Reveal';
import WorkPreview from '@/components/WorkPreview';
import Testimonials from '@/components/Testimonials';
import { disciplines } from '@/lib/projects';

export const dynamic = 'force-dynamic';

const services = [
  {
    n: '01',
    title: 'Portrait Sessions',
    body: 'People, expression, and connection — shot on medium format or full-frame, always in natural or practised light.',
  },
  {
    n: '02',
    title: 'Editorial & Commercial',
    body: 'Campaign imagery, lookbooks, and product stories built around the shot the client cannot get anywhere else.',
  },
  {
    n: '03',
    title: 'Events & Occasions',
    body: 'Weddings, launches, and gatherings. Fast, quiet, and always watching for the frame everyone else missed.',
  },
  {
    n: '04',
    title: 'Landscape & Architecture',
    body: 'Places as subjects — long exposures, considered vantage points, and the patience to wait for the right light.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Warm gradient background — replaces 3D canvas */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(176,136,72,0.07) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto w-full max-w-container">
          <p className="eyebrow mb-6 animate-floaty">
            Photography · Est. 2026
          </p>
          <h1 className="display-fluid text-ink">
            Velora<span className="italic text-accent"> Captures</span>
          </h1>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="max-w-xl font-body text-base leading-relaxed text-muted">
              An independent photographer for portraits, editorial, and commercial
              work. Every frame is composed deliberately and made to last.
            </p>
            <Link
              href="/work"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-accent hover:text-accent"
            >
              View the work
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      <div className="relative z-10 bg-bg">
        <Marquee items={disciplines} />

        {/* ---------------- STUDIO ---------------- */}
        <section id="about" className="mx-auto max-w-container px-5 py-28 md:px-10 md:py-40">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <Reveal>
                <p className="eyebrow">(About)</p>
              </Reveal>
            </div>
            <div className="md:col-span-9">
              <Reveal>
                <h2 className="font-display text-3xl font-light leading-[1.05] tracking-tightest text-ink md:text-5xl">
                  We treat every project like a <span className="italic text-accent">photograph</span> —
                  composed deliberately, lit with care, and printed to last.
                </h2>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- SELECTED WORK ---------------- */}
        <section className="mx-auto max-w-container px-5 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between border-b border-line pb-6">
              <h2 className="h-section text-ink">Selected Work</h2>
              <Link
                href="/work"
                className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted link-underline hover:text-ink md:inline"
              >
                All projects →
              </Link>
            </div>
          </Reveal>
          <WorkPreview />
          <div className="flex justify-center py-12">
            <Link
              href="/work"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full border border-line px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-accent hover:text-accent"
            >
              View the gallery
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* ---------------- SERVICES ---------------- */}
        <section id="services" className="border-t border-line bg-surface/30">
          <div className="mx-auto max-w-container px-5 py-28 md:px-10 md:py-36">
            <Reveal>
              <p className="eyebrow mb-12">(What we do)</p>
            </Reveal>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line/20 md:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.05}>
                  <div className="group h-full bg-bg p-8 transition-colors hover:bg-surface/60 md:p-12">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-accent/80">{s.n}</span>
                      <h3 className="font-display text-2xl font-light text-ink md:text-3xl">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-5 max-w-md font-body leading-relaxed text-muted">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- TESTIMONIALS ---------------- */}
        <Testimonials />
      </div>
    </>
  );
}
