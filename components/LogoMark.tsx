import { cn } from '@/lib/utils';

export default function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center leading-none', className)}>
      <span
        style={{
          fontFamily: 'var(--font-logo), sans-serif',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontSize: '1em',
          lineHeight: 1,
        }}
      >
        VELORA
      </span>
      <div className="flex items-center gap-2 mt-[0.3em]">
        <span
          style={{
            display: 'block',
            height: '1px',
            width: '1.6em',
            background: 'currentColor',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-logo), sans-serif',
            fontWeight: 300,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontSize: '0.42em',
            lineHeight: 1,
          }}
        >
          CAPTURES
        </span>
        <span
          style={{
            display: 'block',
            height: '1px',
            width: '1.6em',
            background: 'currentColor',
          }}
        />
      </div>
    </div>
  );
}
