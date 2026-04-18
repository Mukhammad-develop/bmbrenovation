'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface CounterProps {
  end: number
  suffix?: string
  duration?: number
}

export default function Counter({ end, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  return (
    <span ref={ref} className="font-display font-bold tabular-nums">
      {count}{suffix}
    </span>
  )
}
