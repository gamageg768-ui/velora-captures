import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-light text-ink">Inquiries</h1>
        <span className="font-mono text-xs text-muted">{inquiries.length} total</span>
      </div>

      {inquiries.length === 0 ? (
        <p className="font-mono text-xs text-muted">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((i) => (
            <div key={i.id} className="rounded-xl border border-line bg-bg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-body font-medium text-ink">{i.name}</p>
                  <a
                    href={`mailto:${i.email}`}
                    className="font-mono text-xs text-accent link-underline"
                  >
                    {i.email}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    {i.budget && (
                      <p className="font-mono text-[11px] text-muted">{i.budget}</p>
                    )}
                    <p className="font-mono text-[11px] text-muted">
                      {new Date(i.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`/api/admin/proposal/${i.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted hover:border-accent hover:text-accent transition-colors"
                  >
                    ↓ Generate PDF
                  </a>
                </div>
              </div>
              {i.subject && (
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  {i.subject}
                </p>
              )}
              <p className="mt-3 font-body text-sm leading-relaxed text-ink">
                {i.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
