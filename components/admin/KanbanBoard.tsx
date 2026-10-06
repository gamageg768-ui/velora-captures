'use client';

import { useState } from 'react';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: Date;
};

const COLUMNS = [
  { key: 'new', label: 'New' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'closed', label: 'Closed' },
] as const;

type Status = (typeof COLUMNS)[number]['key'];

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? '');
  const [notesOpen, setNotesOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function patchInquiry(payload: { status?: string; notes?: string }) {
    setSaving(true);
    try {
      await fetch(`/api/admin/inquiry/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    await patchInquiry({ status: next });
  }

  async function handleNotesBlur() {
    await patchInquiry({ notes });
  }

  const snippet = inquiry.subject
    ? inquiry.subject.slice(0, 60) + (inquiry.subject.length > 60 ? '…' : '')
    : inquiry.message.slice(0, 60) + (inquiry.message.length > 60 ? '…' : '');

  return (
    <div className="rounded-lg border border-line bg-surface p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-body text-sm font-medium text-ink truncate">{inquiry.name}</p>
          <p className="font-mono text-[11px] text-accent truncate">{inquiry.email}</p>
        </div>
        {inquiry.budget && (
          <span className="shrink-0 font-mono text-[10px] text-muted whitespace-nowrap">
            {inquiry.budget}
          </span>
        )}
      </div>

      {snippet && (
        <p className="font-mono text-[11px] text-muted leading-relaxed">{snippet}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={saving}
          className="flex-1 rounded border border-line bg-bg px-2 py-1 font-mono text-[11px] text-ink focus:outline-none focus:border-accent disabled:opacity-50"
        >
          {COLUMNS.map((col) => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>

        <span className="font-mono text-[10px] text-muted whitespace-nowrap">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </span>
      </div>

      <button
        onClick={() => setNotesOpen((o) => !o)}
        className="w-full text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
      >
        {notesOpen ? '▲ Notes' : '▼ Notes'}
      </button>

      {notesOpen && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={3}
          placeholder="Add internal notes…"
          className="w-full rounded border border-line bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent resize-none"
        />
      )}
    </div>
  );
}

export default function KanbanBoard({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const cards = inquiries.filter((i) => i.status === col.key);
        return (
          <div key={col.key} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{col.label}</span>
              {col.key === 'new' && cards.length > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium text-white">
                  {cards.length}
                </span>
              )}
              {col.key !== 'new' && (
                <span className="font-mono text-[10px] text-muted">{cards.length}</span>
              )}
            </div>

            <div className="flex flex-col gap-3 min-h-[120px]">
              {cards.length === 0 ? (
                <div className="rounded-lg border border-dashed border-line p-4 text-center">
                  <span className="font-mono text-[11px] text-muted">Empty</span>
                </div>
              ) : (
                cards.map((inquiry) => (
                  <InquiryCard key={inquiry.id} inquiry={inquiry} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
