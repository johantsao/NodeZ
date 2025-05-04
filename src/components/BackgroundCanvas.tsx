'use client'

import { useEffect, useRef } from 'react'

interface BackgroundCanvasProps {
  particleCount?: number
  blurAmount?: number
  particleColor?: string
}

export default function BackgroundCanvas({
  particleCount = 180,
  blurAmount = 3,
  particleColor = '#37a8ff88',
}: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 2,
      dx: Math.random() * 0.8 - 0.4,
      dy: Math.random() * 0.8 - 0.4
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = particleColor

      particles.forEach(p => {
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = Math.max(0, (200 - dist) / 200)
        const fx = dx / dist * force * 4
        const fy = dy / dist * force * 4

        p.x -= fx
        p.y -= fy

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [particleCount, particleColor])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none blur-[${blurAmount}px]`}
    />
  )
}
