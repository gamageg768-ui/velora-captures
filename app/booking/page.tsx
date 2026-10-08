import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

export const metadata: Metadata = {
  title: 'Availability',
  description: 'Check when Velora Captures is free for new photography projects.',
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal>
            <p className="eyebrow mb-6">(Availability)</p>
            <h1 className="font-display text-4xl font-light leading-[0.95] tracking-tightest text-ink md:text-5xl">
              When I'm
              <br />
              free to
              <br />
              <span className="italic text-accent">shoot.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xs font-body text-sm leading-relaxed text-muted">
              Highlighted dates are open for new work. See something that fits? Get in touch and we'll set it up.
            </p>
            <div className="mt-10">
              <p className="eyebrow mb-2">Email</p>
              <a
                href="mailto:contact.veloralabs@gmail.com"
                className="font-display text-lg font-light text-ink link-underline"
              >
                contact.veloralabs@gmail.com
              </a>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-line bg-surface/30 p-6 md:p-10">
              <AvailabilityCalendar />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
