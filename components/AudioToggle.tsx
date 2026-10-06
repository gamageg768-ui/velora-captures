'use client'
import { useEffect, useRef, useState } from 'react'

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const audio = new Audio('/audio/ambient.mp3')
    audio.loop = true
    audio.volume = 0.18
    audioRef.current = audio
    // Check if audio can be loaded
    audio.addEventListener('canplay', () => setAvailable(true))
    audio.addEventListener('error', () => setAvailable(false))
    return () => { audio.pause(); audio.src = '' }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setAvailable(false))
    }
  }

  if (!available) return null  // hide if no audio file

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause ambient audio' : 'Play ambient audio'}
      title={playing ? 'Pause ambient audio' : 'Play ambient audio'}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
    >
      {playing ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  )
}
