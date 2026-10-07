import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import BookingForm from '@/components/BookingForm';

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Schedule a photography session or discovery call with Velora Captures.',
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        {/* Left: heading */}
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6">(Discovery call)</p>
            <h1 className="font-display text-4xl font-light leading-[0.95] tracking-tightest text-ink md:text-6xl">
              Let's talk
              <br />
              about your
              <br />
              <span className="italic text-accent">project.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-sm font-body leading-relaxed text-muted">
              A focused conversation — 30 or 60 minutes — to explore your brief, align
              on scope, and see if we're the right fit for each other.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Mon – Fri, 10:00 – 18:00',
                '30-minute intro or 60-minute deep dive',
                'Confirmation email sent immediately',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-mono text-xs text-muted">
                  <span className="mt-0.5 text-accent">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Decorative accent block */}
          <Reveal delay={0.15}>
            <div className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                Response time
              </p>
              <p className="mt-2 font-display text-2xl font-light text-ink">
                Within 2 business days
              </p>
              <p className="mt-1 font-body text-sm text-muted">
                For urgent enquiries, email contact.veloralabs@gmail.com directly.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right: booking form */}
        <div className="md:col-span-7">
          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-line bg-surface/30 p-6 md:p-10">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
