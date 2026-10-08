'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoMark from './LogoMark';

const links = [
  { href: '/work', label: 'Work', index: '01' },
  { href: '/#about', label: 'About', index: '02' },
  { href: '/#services', label: 'Services', index: '03' },
  { href: '/journal', label: 'Journal', index: '04' },
  { href: '/contact', label: 'Contact', index: '05' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[70] transition-colors duration-500',
        scrolled ? 'bg-bg/80 backdrop-blur-xl border-b border-line' : 'border-b border-transparent'
      )}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="text-ink" aria-label="Velora Captures home">
          <LogoMark className="text-[15px] md:text-[18px]" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink/70 transition hover:text-ink"
            >
              <span className="text-accent/70">{l.index}</span>
              <span className="link-underline">{l.label}</span>
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-full bg-accent px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:opacity-80"
          >
            Book a Session
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className={cn('block h-px w-6 bg-ink transition', open && 'translate-y-[6px] rotate-45')} />
            <span className={cn('block h-px w-6 bg-ink transition', open && 'opacity-0')} />
            <span className={cn('block h-px w-6 bg-ink transition', open && '-translate-y-[6px] -rotate-45')} />
          </div>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          'overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl transition-[max-height] duration-500 md:hidden',
          open ? 'max-h-[32rem]' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col px-5 py-4">
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-b border-line py-4 font-display text-xl font-light text-accent"
          >
            Book a Session
            <span className="font-mono text-xs text-accent/70">→</span>
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-line py-4 font-display text-xl font-light text-ink"
            >
              {l.label}
              <span className="font-mono text-xs text-accent/70">{l.index}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
