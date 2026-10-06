import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AVAILABLE_SLOTS, isWeekday } from '@/lib/booking';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`booking:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = body.email;
  const callType = body.callType;
  const date = typeof body.date === 'string' ? body.date : '';
  const timeSlot = body.timeSlot;
  const projectNote =
    typeof body.projectNote === 'string' ? body.projectNote.trim() : null;

  if (!name || name.length > 120)
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!isEmail(email))
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  if (callType !== '30min' && callType !== '60min')
    return NextResponse.json({ error: 'Invalid call type.' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isWeekday(date))
    return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
  if (!AVAILABLE_SLOTS.includes(timeSlot as (typeof AVAILABLE_SLOTS)[number]))
    return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 });

  const conflict = await prisma.booking.findFirst({
    where: { date, timeSlot: timeSlot as string, status: { not: 'cancelled' } },
  });
  if (conflict)
    return NextResponse.json(
      { error: 'That slot was just taken. Please choose another.' },
      { status: 409 },
    );

  try {
    const booking = await prisma.booking.create({
      data: {
        name,
        email: email as string,
        callType,
        date,
        timeSlot: timeSlot as string,
        projectNote: projectNote || null,
      },
    });

    // Import lazily so missing RESEND_API_KEY doesn't break the route
    const { sendBookingConfirmation } = await import('@/lib/email');
    sendBookingConfirmation(booking).catch(console.error);

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    console.error('booking POST failed:', err);
    return NextResponse.json({ error: 'Could not save booking.' }, { status: 500 });
  }
}
