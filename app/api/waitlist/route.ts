import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (!rateLimit(`waitlist:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  if (!isEmail(body.email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
  }
  try {
    await prisma.waitlist.create({ data: { email: body.email } })
    return NextResponse.json({ message: "You're on the list. We'll be in touch." }, { status: 201 })
  } catch (e: unknown) {
    // Unique constraint = already subscribed
    if (typeof e === 'object' && e !== null && 'code' in e && (e as {code:string}).code === 'P2002') {
      return NextResponse.json({ message: "You're already on the list!" }, { status: 200 })
    }
    return NextResponse.json({ error: 'Could not subscribe.' }, { status: 500 })
  }
}
