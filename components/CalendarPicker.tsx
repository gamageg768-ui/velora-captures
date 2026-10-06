'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  selected: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function isWeekdayDate(d: Date) {
  return d.getDay() >= 1 && d.getDay() <= 5;
}

export default function CalendarPicker({ selected, onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Mon-first: Sunday (0) becomes 6, otherwise subtract 1
    const blanks = firstDay === 0 ? 6 : firstDay - 1;
    return { blanks, daysInMonth };
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-full p-2 text-muted transition hover:text-ink"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="rounded-full p-2 text-muted transition hover:text-ink"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day headers Mon–Sun */}
      <div className="mb-2 grid grid-cols-7">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <div
            key={d}
            className="py-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: cells.blanks }).map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {Array.from({ length: cells.daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const date = new Date(viewYear, viewMonth, day);
          const isWd = isWeekdayDate(date);
          const isPast = dateStr < todayStr;
          const isSel = dateStr === selected;
          const isToday = dateStr === todayStr;
          const disabled = !isWd || isPast;

          return (
            <button
              key={day}
              onClick={() => !disabled && onSelect(dateStr)}
              disabled={disabled}
              className={cn(
                'relative h-9 w-full rounded-lg font-mono text-sm transition',
                disabled && 'cursor-not-allowed text-line',
                !disabled && !isSel && 'text-ink hover:bg-surface',
                isSel && 'bg-accent text-white',
                isToday && !isSel && 'border border-accent text-accent',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
