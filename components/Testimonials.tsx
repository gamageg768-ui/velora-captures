import Reveal from '@/components/Reveal';
import { testimonials } from '@/lib/testimonials';

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-container px-5 py-28 md:px-10 md:py-36">
        <Reveal>
          <p className="eyebrow mb-12">(What clients say)</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-bg p-8 md:p-10">
                <blockquote className="font-display text-xl font-light leading-[1.4] text-ink md:text-2xl">
                  "{t.quote}"
                </blockquote>
                <footer className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-medium text-accent">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-ink">{t.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </footer>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
