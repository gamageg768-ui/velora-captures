import AdminAvailabilityCalendar from '@/components/AdminAvailabilityCalendar';

export const dynamic = 'force-dynamic';

export default function AdminAvailabilityPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 font-display text-3xl font-light text-ink">Availability</h1>
      <p className="mb-8 font-mono text-sm text-muted">
        Click any weekday to toggle it blocked or open. Blocked dates appear unavailable to visitors.
      </p>
      <div className="rounded-2xl border border-line bg-bg p-8">
        <AdminAvailabilityCalendar />
      </div>
    </div>
  );
}
