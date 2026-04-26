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
  const digits = String(target).length // keep same digit count during animation

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!ref.current) return
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      }, { threshold: 0.3 })
      observer.observe(ref.current)
      return () => observer.disconnect()
    }, 2500)
    return () => clearTimeout(delay)
  }, [started])

  useEffect(() => {
    if (!started) return

    const startTime = Date.now()
    let frame: number

    // Easing function — ease out cubic for smooth deceleration
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const rawProgress = Math.min(elapsed / duration, 1)
      const progress = easeOut(rawProgress)

      if (rawProgress < 1) {
        const currentNum = Math.round(progress * target)
        // Pad to same digit count as target so width doesn't jump
        setDisplay(String(currentNum).padStart(digits, '0'))
        frame = requestAnimationFrame(animate)
      } else {
        setDisplay(String(target))
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [started, target, duration, digits])

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  )
}
