import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = body.email;
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : null;
  const budget = typeof body.budget === 'string' ? body.budget.trim() : null;

  if (!name || name.length > 120) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: 'Please include a short message.' }, { status: 400 });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: { name, email, message, subject: subject || null, budget: budget || null },
    });
    const { sendInquiryConfirmation } = await import('@/lib/email');
    sendInquiryConfirmation({ name, email: email as string, subject, budget, message }).catch(
      console.error,
    );
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('contact POST failed:', err);
    return NextResponse.json({ error: 'Could not save your message.' }, { status: 500 });
  }
}

export async function GET() {
  // Lightweight count endpoint (handy for a future dashboard).
  try {
    const count = await prisma.inquiry.count();
    return NextResponse.json({ ok: true, count });
  } catch {
    return NextResponse.json({ ok: true, count: 0 });
  }
}
