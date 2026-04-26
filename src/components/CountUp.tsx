'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  target: number
  suffix?: string
  duration?: number
  className?: string
}

export default function CountUp({ target, suffix = '', duration = 2000, className = '' }: CountUpProps) {
  const [display, setDisplay] = useState('0')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Trigger on scroll into view
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.5 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  // Scramble + count up animation
  useEffect(() => {
    if (!started) return

    const startTime = Date.now()
    const chars = '0123456789'
    let frame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress < 1) {
        // Scramble phase: random numbers that gradually converge
        const currentNum = Math.floor(progress * target)
        const scrambleChance = 1 - progress // less scramble as we approach target

        if (Math.random() < scrambleChance && progress < 0.8) {
          // Show random number near the current value
          const randomOffset = Math.floor(Math.random() * Math.max(target * 0.3, 5))
          setDisplay(String(Math.abs(currentNum + randomOffset - Math.floor(randomOffset / 2))))
        } else {
          setDisplay(String(currentNum))
        }
        frame = requestAnimationFrame(animate)
      } else {
        setDisplay(String(target))
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration])

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  )
}
