import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AVAILABLE_SLOTS, isWeekday } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/booking/manage?token=X — return booking details
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'token is required.' }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { managementToken: token },
    select: {
      id: true,
      name: true,
      date: true,
      timeSlot: true,
      callType: true,
      status: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// PATCH /api/booking/manage?token=X — cancel or reschedule
export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'token is required.' }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { managementToken: token },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking is already cancelled.' }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { action, date, timeSlot } = body as {
    action?: string;
    date?: string;
    timeSlot?: string;
  };

  if (action === 'cancel') {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    });
    return NextResponse.json({ ok: true, status: 'cancelled' });
  }

  if (action === 'reschedule') {
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'A valid date (YYYY-MM-DD) is required.' }, { status: 400 });
    }
    if (!isWeekday(date)) {
      return NextResponse.json({ error: 'Please choose a weekday.' }, { status: 400 });
    }
    if (!timeSlot || !AVAILABLE_SLOTS.includes(timeSlot as (typeof AVAILABLE_SLOTS)[number])) {
      return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 });
    }

    // Conflict check — exclude the current booking
    const conflict = await prisma.booking.findFirst({
      where: {
        date,
        timeSlot,
        status: { not: 'cancelled' },
        id: { not: booking.id },
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: 'That slot is already taken. Please choose another.' },
        { status: 409 },
      );
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { date, timeSlot },
      select: { date: true, timeSlot: true },
    });

    return NextResponse.json({ ok: true, date: updated.date, timeSlot: updated.timeSlot });
  }

  return NextResponse.json(
    { error: 'action must be "cancel" or "reschedule".' },
    { status: 400 },
  );
}
