import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import WorkGallery from '@/components/WorkGallery';
import WorkIndex from '@/components/WorkIndex';
import { projects } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected photography projects — portraits, editorial, commercial, and landscape.',
};

export default function WorkPage() {
  return (
    <>
      {/* intro */}
      <section className="mx-auto max-w-container px-5 pb-10 pt-36 md:px-10 md:pb-16 md:pt-44">
        <Reveal>
          <p className="eyebrow mb-6">(Selected projects — 2026)</p>
          <h1 className="display-fluid text-ink">
            The <span className="italic text-accent">Gallery</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-lg text-muted">
            A selection of recent photography work. Browse the gallery, then scroll for the
            full project index below.
          </p>
        </Reveal>
      </section>

      <WorkGallery />

      {/* full index */}
      <section className="mx-auto max-w-container px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <WorkIndex projects={projects} />
        </Reveal>
      </section>
    </>
  );
}
