import Link from 'next/link';
import WaitlistForm from './WaitlistForm';
import LogoMark from './LogoMark';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact-footer" className="relative border-t border-line bg-surface/30">
      <div className="mx-auto max-w-container px-5 py-20 md:px-10 md:py-28">
        <p className="eyebrow mb-6">Available for select work — {year}</p>
        <Link href="/contact" data-cursor="hover" className="group block">
          <h2 className="h-section max-w-5xl text-ink">
            Let's make something
            <span className="italic text-accent"> worth looking at.</span>
          </h2>
        </Link>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/contact" className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.18em] text-muted transition hover:text-ink">
            contact.veloralabs@gmail.com
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/booking"
            className="font-mono text-sm uppercase tracking-[0.18em] text-accent link-underline"
          >
            Book a discovery call →
          </Link>
          <Link
            href="/availability"
            className="font-mono text-sm uppercase tracking-[0.18em] text-muted link-underline hover:text-ink transition-colors"
          >
            View availability →
          </Link>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="eyebrow mb-3">Join the waitlist</p>
          <p className="mb-4 max-w-sm font-body text-sm text-muted">Get first notice when new project slots open.</p>
          <WaitlistForm />
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="text-[14px] text-ink" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <a href="https://instagram.com/veloracaptures" target="_blank" rel="noreferrer noopener" aria-label="Velora Captures on Instagram" className="link-underline hover:text-ink">
              Instagram
            </a>
            <Link href="/work" className="link-underline hover:text-ink">
              Work
            </Link>
          </div>
          <p className="font-mono text-[11px] text-muted/70">© {year} Velora Captures</p>
        </div>
      </div>
    </footer>
  );
}
