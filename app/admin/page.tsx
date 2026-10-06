import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [inquiryCount, bookingCount, pendingBookings, monthInquiries, recentInquiries, recentBookings] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.inquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

  return (
    <div className="max-w-4xl space-y-10">
      <h1 className="font-display text-4xl font-light text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { label: 'Total Inquiries', value: inquiryCount },
          { label: 'Total Bookings', value: bookingCount },
          { label: 'Pending Bookings', value: pendingBookings },
          { label: 'This Month', value: monthInquiries },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-bg p-6">
            <div className="font-display text-4xl font-light text-ink">{s.value}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Recent Inquiries
        </h2>
        <div className="overflow-hidden rounded-xl border border-line bg-bg">
          {recentInquiries.length === 0 ? (
            <p className="px-6 py-4 font-mono text-xs text-muted">No inquiries yet.</p>
          ) : (
            recentInquiries.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between border-b border-line px-6 py-4 last:border-0"
              >
                <div>
                  <p className="font-body text-sm text-ink">
                    {i.name}{' '}
                    <span className="text-muted">— {i.email}</span>
                  </p>
                  {i.subject && (
                    <p className="font-mono text-[11px] text-muted">{i.subject}</p>
                  )}
                </div>
                <p className="font-mono text-[11px] text-muted">
                  {new Date(i.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Recent Bookings
        </h2>
        <div className="overflow-hidden rounded-xl border border-line bg-bg">
          {recentBookings.length === 0 ? (
            <p className="px-6 py-4 font-mono text-xs text-muted">No bookings yet.</p>
          ) : (
            recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border-b border-line px-6 py-4 last:border-0"
              >
                <div>
                  <p className="font-body text-sm text-ink">
                    {b.name}{' '}
                    <span className="text-muted">— {b.email}</span>
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {b.callType} · {b.date} at {b.timeSlot}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                    b.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
