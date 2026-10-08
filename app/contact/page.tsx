import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Velora Captures — portrait, editorial, and commercial photography.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <Reveal>
        <p className="eyebrow mb-6">(Start a project)</p>
        <h1 className="font-display text-4xl font-light leading-[0.95] tracking-tightest text-ink md:text-6xl">
          Tell me
          <br />
          what you’re
          <br />
          <span className="italic text-accent">making.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 space-y-8">
          <div>
            <p className="eyebrow mb-2">Email</p>
            <a
              href="mailto:contact.veloralabs@gmail.com"
              className="font-display text-xl font-light text-ink link-underline"
            >
              contact.veloralabs@gmail.com
            </a>
          </div>
          <div>
            <p className="eyebrow mb-2">Availability</p>
            <p className="font-body text-muted">
              Booking selected projects for the coming season.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
