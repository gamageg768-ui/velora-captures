'use client';

import { cn } from '@/lib/utils';

type Props = {
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
  loading: boolean;
};

export default function TimeSlotGrid({ slots, selected, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="font-mono text-xs text-muted">
        No slots available for this date. Please pick another day.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={cn(
            'h-12 rounded-lg border font-mono text-sm transition',
            selected === slot
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-line text-muted hover:border-accent/50 hover:text-ink',
          )}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
