'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toMonthStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// JS getDay() 0=Sun → convert to 0=Mon..6=Sun
function getFirstDow(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function AvailabilityCalendar() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/availability?month=${toMonthStr(year, month)}`)
      .then((r) => r.json())
      .then((data: { dates: string[] }) => {
        setBlocked(new Set(data.dates));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => {
    if (isCurrentMonth) return;
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = getFirstDow(year, month);
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase();

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-20"
        >
          ←
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
        >
          →
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="mb-1 grid grid-cols-7">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={cn('grid grid-cols-7 gap-y-1', loading && 'opacity-40 pointer-events-none')}>
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(year, month, day);
          const dow = (firstDow + i) % 7; // 0=Mon 6=Sun
          const isWeekend = dow >= 5;
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isBlocked = blocked.has(dateStr);
          const available = !isWeekend && !isPast && !isBlocked;

          return (
            <div
              key={dateStr}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm',
                isToday && 'ring-1 ring-ink/20',
                available && 'bg-accent/10 text-ink',
                isBlocked && !isWeekend && 'text-muted/30',
                isWeekend && 'text-muted/25',
                isPast && !isToday && 'text-muted/20',
              )}
            >
              {day}
              {available && (
                <span className="absolute bottom-1.5 h-[3px] w-[3px] rounded-full bg-accent/60" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 border-t border-line pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-accent/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-line bg-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
}
