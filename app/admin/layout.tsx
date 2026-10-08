import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface/50">
      <header className="border-b border-line bg-bg px-8 py-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
            Velora Captures / Admin
          </span>
          <nav className="flex gap-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            <Link href="/admin" className="hover:text-ink transition-colors">Overview</Link>
            <Link href="/admin/upload" className="hover:text-ink transition-colors">Photos</Link>
            <Link href="/admin/inquiries" className="hover:text-ink transition-colors">Inquiries</Link>
            <Link href="/admin/availability" className="hover:text-ink transition-colors">Availability</Link>
            <Link href="/" className="hover:text-ink transition-colors">← Site</Link>
          </nav>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
