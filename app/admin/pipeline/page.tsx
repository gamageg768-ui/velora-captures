import { prisma } from '@/lib/db';
import KanbanBoard from '@/components/admin/KanbanBoard';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-light text-ink">Pipeline</h1>
        <span className="font-mono text-xs text-muted">{inquiries.length} inquiries</span>
      </div>

      <KanbanBoard inquiries={inquiries} />
    </div>
  );
}
