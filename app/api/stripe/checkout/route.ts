import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const PRICES: Record<string, number> = {
  '30min': 15000, // $150.00 in cents
  '60min': 25000, // $250.00 in cents
};

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'Payment is not configured.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { bookingId, callType } = body as { bookingId?: string; callType?: string };

  if (!bookingId || typeof bookingId !== 'string') {
    return NextResponse.json({ error: 'bookingId is required.' }, { status: 400 });
  }
  if (!callType || (callType !== '30min' && callType !== '60min')) {
    return NextResponse.json({ error: 'callType must be 30min or 60min.' }, { status: 400 });
  }

  // Lazy-import so a missing key only surfaces at request time, not at module load.
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia' });

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: PRICES[callType],
          product_data: {
            name: `OBSCURA Studio — ${callType === '30min' ? '30-minute intro' : '60-minute deep dive'} deposit`,
            description: '50% deposit to secure your discovery call slot.',
          },
        },
      },
    ],
    metadata: { bookingId },
    success_url: `${BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/booking/cancel`,
  });

  // Persist the session ID so the webhook can look up the booking later.
  const { prisma } = await import('@/lib/db');
  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
