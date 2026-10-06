import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function WaitlistAdminPage() {
  const subscribers = await prisma.waitlist.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 font-display text-3xl font-light text-ink">Waitlist</h1>
      <p className="mb-8 font-mono text-sm text-muted">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</p>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full font-mono text-sm">
          <thead className="border-b border-line bg-surface/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-muted">Email</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em] text-muted">Joined</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(s => (
              <tr key={s.id} className="border-b border-line/50 last:border-0 hover:bg-surface/30">
                <td className="px-4 py-3 text-ink">{s.email}</td>
                <td className="px-4 py-3 text-right text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-muted">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {subscribers.length > 0 && (
        <a
          href={`data:text/plain,${subscribers.map(s=>s.email).join('\n')}`}
          download="waitlist.txt"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent link-underline"
        >
          Export emails
        </a>
      )}
    </div>
  )
}
