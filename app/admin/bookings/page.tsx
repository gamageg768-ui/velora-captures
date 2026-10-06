import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-light text-ink">Bookings</h1>
        <span className="font-mono text-xs text-muted">{bookings.length} total</span>
      </div>

      {bookings.length === 0 ? (
        <p className="font-mono text-xs text-muted">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-xl border border-line bg-bg">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b border-line">
                <tr>
                  {['Name', 'Email', 'Type', 'Date', 'Time', 'Status', 'Note'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-line/50 last:border-0 hover:bg-surface/30"
                  >
                    <td className="px-4 py-3 font-body text-sm text-ink">{b.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      <a href={`mailto:${b.email}`} className="hover:text-accent transition-colors">
                        {b.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{b.callType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink">{b.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink">{b.timeSlot}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                          b.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 font-body text-xs text-muted">
                      {b.projectNote ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
