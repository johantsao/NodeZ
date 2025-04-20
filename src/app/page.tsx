'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import ClientWrapper from './components/ClientWrapper'

const particleCount = 180

const generateParticles = () =>
  Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    delay: i * 0.02,
    r: Math.random() * 2 + 2
  }))

export default function Home() {
  const [particles, setParticles] = useState(generateParticles)
  const [showLogo, setShowLogo] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.3 })
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [activeNav, setActiveNav] = useState('')
  const navItems = [
    { name: '教學專區', path: '/education' },
    { name: '影音專區', path: '/video' },
    { name: '社群專區', path: '/community' }
  ]

  useEffect(() => {
    if (!inView) setShowLogo(false)
    else setShowLogo(true)
  }, [inView])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId
    let particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 2.5,
      dx: Math.random() * 0.8 - 0.4,
      dy: Math.random() * 0.8 - 0.4
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#37a8ff')
      gradient.addColorStop(0.8, '#37a8ff')
      gradient.addColorStop(1, 'rgba(55, 168, 255, 0)')
      ctx.fillStyle = gradient

      particles.forEach(p => {
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / dist
        const forceDirectionY = dy / dist
        const maxDist = 200
        const force = (maxDist - dist) / maxDist

        if (dist < maxDist) {
          p.x -= forceDirectionX * force * 2
          p.y -= forceDirectionY * force * 2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  const cardBase = 'group transition-all duration-500 rounded-2xl cursor-pointer'
  const cardHover = 'hover:bg-white/5 hover:backdrop-blur-md hover:scale-105 hover:text-blue-400 p-6 md:p-8 backdrop-saturate-150'

  return (
    <ClientWrapper>
      <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />

        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <img src="/logo-icon.png" alt="NodeZ Icon" className="w-8 h-8 md:w-10 md:h-10" />
          <ul className="hidden md:flex gap-6 text-white font-medium relative">
            {navItems.map((item) => (
              <li
                key={item.path}
                onMouseEnter={() => setActiveNav(item.path)}
                className="relative transition duration-300 hover:text-[#37a8ff] cursor-pointer"
              >
                <Link href={item.path}>{item.name}</Link>
                {activeNav === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#37a8ff]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <section className="h-[130vh] flex flex-col items-center justify-center relative z-10" ref={ref}>
          <div className="relative w-full flex justify-center items-center">
            {!showLogo && (
              <div className="absolute">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.3 }}
                    transition={{ delay: p.delay, duration: 1.4 }}
                    className="w-[6px] h-[6px] bg-blue-400 rounded-full absolute"
                  />
                ))}
              </div>
            )}
            {showLogo && (
              <motion.img
                src="/logo.png"
                alt="NodeZ Logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1.2, 1] }}
                transition={{ duration: 1 }}
                className="w-60 h-60 md:w-80 md:h-80"
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-sm text-blue-400 tracking-wide mt-8 md:text-lg text-center px-4"
          >
            Every one is Node of Z
          </motion.div>
        </section>

        <div className="absolute bottom-0 left-0 w-full h-60 bg-gradient-to-b from-transparent via-black/80 to-black backdrop-blur-[2px] z-10 pointer-events-none" />

        <section className="px-4 md:px-12 py-24 bg-black space-y-20 relative z-10">
          {[['/education', '教學專區', '提供區塊鏈基礎、技術文檔與 Layer2 深入學習內容，幫助學員完整建立知識體系。'],
            ['/video', '影音專區', '精選系列課程影片與訪談內容，讓學習更具臨場感與互動性。'],
            ['/community', '社群專區', '加入 NodeZ Discord / LINE 社群，與其他學生共學、討論與參與活動。']].map(([href, title, desc]) => (
            <motion.div
              key={href}
              className={`${cardBase} ${cardHover}`}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link href={href}>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 group-hover:text-blue-400 transition duration-300">
                  {title}
                </h2>
              </Link>
              <p className="text-gray-300 max-w-3xl leading-relaxed text-base md:text-lg opacity-0 group-hover:opacity-100 transition duration-500">
                {desc}
              </p>
            </motion.div>
          ))}
        </section>
      </div>
    </ClientWrapper>
  )
}
    