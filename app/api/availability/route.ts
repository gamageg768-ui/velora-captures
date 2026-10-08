import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/availability?month=2026-10  →  { dates: ["2026-10-12", ...] }
export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get('month');
  if (!month) return NextResponse.json({ dates: [] });

  const [year, m] = month.split('-');
  const start = `${year}-${m}-01`;
  const end = `${year}-${m}-31`;

  const rows = await prisma.availability.findMany({
    where: { date: { gte: start, lte: end } },
    select: { date: true },
  });

  return NextResponse.json({ dates: rows.map((r) => r.date) });
}

// POST /api/availability  body: { date: "YYYY-MM-DD", note?: string }  →  block a date
export async function POST(req: NextRequest) {
  const { date, note } = await req.json();
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  await prisma.availability.upsert({
    where: { date },
    create: { date, note: note ?? null },
    update: { note: note ?? null },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/availability  body: { date: "YYYY-MM-DD" }  →  unblock a date
export async function DELETE(req: NextRequest) {
  const { date } = await req.json();
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  await prisma.availability.deleteMany({ where: { date } });
  return NextResponse.json({ ok: true });
}
