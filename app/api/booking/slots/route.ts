import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AVAILABLE_SLOTS, isWeekday } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
  }
  if (!isWeekday(date)) {
    return NextResponse.json({ slots: [] });
  }

  const booked = await prisma.booking.findMany({
    where: { date, status: { not: 'cancelled' } },
    select: { timeSlot: true },
  });

  const bookedSet = new Set(booked.map((b) => b.timeSlot));
  const slots = AVAILABLE_SLOTS.filter((s) => !bookedSet.has(s));

  return NextResponse.json({ slots });
}
