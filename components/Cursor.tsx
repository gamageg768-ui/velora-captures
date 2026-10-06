'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (!d.dataset.ready) {
        d.dataset.ready = 'true';
        r.dataset.ready = 'true';
      }
      const target = e.target as HTMLElement | null;
      const hover = !!target?.closest('a, button, [data-cursor="hover"]');
      r.dataset.hover = hover ? 'true' : 'false';
    };

    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" aria-hidden />
      <div ref={ring} className="cursor-ring hidden md:block" aria-hidden />
    </>
  );
}
