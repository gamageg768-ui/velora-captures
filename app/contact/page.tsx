import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Velora Captures — portrait, editorial, and commercial photography.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6">(Start a project)</p>
            <h1 className="font-display text-5xl font-light leading-[0.95] tracking-tightest text-ink md:text-7xl">
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
                  className="font-display text-2xl font-light text-ink link-underline"
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
        </div>

        <div className="md:col-span-7">
          <Reveal delay={0.15}>
            <div className="rounded-2xl border border-line bg-surface/30 p-6 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
