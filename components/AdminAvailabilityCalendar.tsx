'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toMonthStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getFirstDow(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function AdminAvailabilityCalendar() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchBlocked = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/availability?month=${toMonthStr(year, month)}`);
    const data: { dates: string[] } = await res.json();
    setBlocked(new Set(data.dates));
    setLoading(false);
  }, [year, month]);

  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  const toggle = async (dateStr: string) => {
    if (toggling) return;
    setToggling(dateStr);
    const isBlocked = blocked.has(dateStr);
    await fetch('/api/availability', {
      method: isBlocked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr }),
    });
    await fetchBlocked();
    setToggling(null);
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => {
    if (isCurrentMonth) return;
    if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = getFirstDow(year, month);
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink disabled:pointer-events-none disabled:opacity-20"
        >
          ←
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink">{monthLabel}</span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
        >
          →
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            {d}
          </div>
        ))}
      </div>

      <div className={cn('grid grid-cols-7 gap-y-1', loading && 'opacity-40')}>
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(year, month, day);
          const dow = (firstDow + i) % 7;
          const isWeekend = dow >= 5;
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isBlocked = blocked.has(dateStr);
          const isToggling = toggling === dateStr;
          const clickable = !isWeekend && !isPast;

          return (
            <button
              key={dateStr}
              onClick={() => clickable && toggle(dateStr)}
              disabled={!clickable || !!toggling}
              title={
                clickable
                  ? isBlocked
                    ? 'Blocked — click to open'
                    : 'Available — click to block'
                  : undefined
              }
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition',
                isToday && 'ring-1 ring-ink/20',
                clickable && !isBlocked && 'bg-accent/10 text-ink hover:bg-accent/20 cursor-pointer',
                clickable && isBlocked && 'bg-red-50 text-red-400 line-through cursor-pointer hover:bg-red-100',
                isWeekend && 'text-muted/25 cursor-default',
                isPast && !isToday && 'text-muted/20 cursor-default',
                isToggling && 'opacity-40',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-line pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-accent/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Available (click to block)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-50 border border-red-100" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Blocked (click to open)</span>
        </div>
      </div>
    </div>
  );
}
