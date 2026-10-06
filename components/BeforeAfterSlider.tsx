'use client'
import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

type Props = { before: string; after: string; beforeLabel?: string; afterLabel?: string }

export default function BeforeAfterSlider({ before, after, beforeLabel = 'Before', afterLabel = 'After' }: Props) {
  const [position, setPosition] = useState(50) // percentage
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100))
    setPosition(pct)
  }, [])

  // Mouse events
  const onMouseDown = () => { dragging.current = true }
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePosition(e.clientX) }
  const onMouseUp = () => { dragging.current = false }

  // Touch events — prevent page scroll while dragging
  const onTouchMove = (e: React.TouchEvent) => { e.preventDefault(); updatePosition(e.touches[0].clientX) }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl select-none cursor-col-resize"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
    >
      {/* After image (base) */}
      <Image src={after} alt={afterLabel} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      {/* Before image (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <Image src={before} alt={beforeLabel} fill className="object-cover" style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
          <span className="text-ink text-sm font-bold select-none">⟺</span>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white">{beforeLabel}</span>
      <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white">{afterLabel}</span>
    </div>
  )
}
