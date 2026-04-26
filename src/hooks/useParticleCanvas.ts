'use client'
import { useEffect, useRef } from 'react'

export function useParticleCanvas(count = 140) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const mouse = { x: -999, y: -999 }
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouse)
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1.5, dx: Math.random() * 0.5 - 0.25, dy: Math.random() * 0.5 - 0.25,
    }))
    let id: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#37a8ff88'
      particles.forEach(p => {
        const mdx = mouse.x - p.x, mdy = mouse.y - p.y, dist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (dist < 180 && dist > 0) { p.x -= (mdx / dist) * (180 - dist) / 180 * 2.5; p.y -= (mdy / dist) * (180 - dist) / 180 * 2.5 }
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      })
      id = requestAnimationFrame(render)
    }
    render()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
  }, [count])

  return canvasRef
}
