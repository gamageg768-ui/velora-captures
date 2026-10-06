import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { AVAILABLE_SLOTS } from '@/lib/booking'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Availability',
  description: 'Check open dates for discovery calls and new project bookings.',
}

export default async function AvailabilityPage() {
  // Get all confirmed/pending bookings for the next 60 days
  const today = new Date()
  const in60 = new Date(today)
  in60.setDate(today.getDate() + 60)

  const todayStr = today.toISOString().slice(0, 10)
  const in60Str = in60.toISOString().slice(0, 10)

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: todayStr, lte: in60Str }, status: { not: 'cancelled' } },
    select: { date: true, timeSlot: true },
  })

  // Group booked slots by date
  const bookedByDate: Record<string, string[]> = {}
  for (const b of bookings) {
    if (!bookedByDate[b.date]) bookedByDate[b.date] = []
    bookedByDate[b.date].push(b.timeSlot)
  }

  // Build next 60 weekdays
  type DayInfo = { date: string; label: string; availableCount: number; isToday: boolean }
  const days: DayInfo[] = []
  const cursor = new Date(today)
  while (days.length < 60) {
    const dow = cursor.getDay()
    if (dow !== 0 && dow !== 6) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const booked = bookedByDate[dateStr] ?? []
      days.push({
        date: dateStr,
        label: cursor.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'short' }),
        availableCount: AVAILABLE_SLOTS.length - booked.length,
        isToday: dateStr === todayStr,
      })
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return (
    <section className="mx-auto max-w-container px-5 pb-32 pt-36 md:px-10 md:pt-44">
      <p className="eyebrow mb-6">(Availability)</p>
      <h1 className="h-section mb-4 text-ink">Open Slots</h1>
      <p className="mb-16 max-w-lg font-body text-muted">
        Discovery calls are available on weekdays. Green means open slots remain.{' '}
        <a href="/booking" className="ml-2 text-accent link-underline">Book a call →</a>
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {days.map(day => (
          <div
            key={day.date}
            className={`rounded-xl border p-4 transition ${
              day.availableCount === 0
                ? 'border-line bg-surface/30 opacity-50'
                : day.availableCount >= 4
                ? 'border-green-200 bg-green-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <p className={`font-mono text-[11px] uppercase tracking-[0.15em] ${day.availableCount === 0 ? 'text-muted' : day.availableCount >= 4 ? 'text-green-700' : 'text-yellow-700'}`}>
              {day.availableCount === 0 ? 'Full' : `${day.availableCount} open`}
            </p>
            <p className={`mt-1 font-display text-lg font-light ${day.isToday ? 'text-accent' : 'text-ink'}`}>
              {day.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
