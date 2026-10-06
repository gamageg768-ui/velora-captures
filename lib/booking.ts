export const AVAILABLE_SLOTS = [
  '10:00', '11:00', '13:00', '14:00', '15:00', '16:00',
] as const;

export type TimeSlot = (typeof AVAILABLE_SLOTS)[number];

export function isWeekday(dateStr: string): boolean {
  const d = new Date(dateStr + 'T12:00:00Z');
  const day = d.getUTCDay();
  return day >= 1 && day <= 5;
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
