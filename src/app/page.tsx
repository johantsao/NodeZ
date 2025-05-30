'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import ClientWrapper from '@/components/ClientWrapper'
import BackgroundCanvas from '@/components/BackgroundCanvas'

export default function Home() {
  const [showLogo, setShowLogo] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.3 })
  const [activeNav, setActiveNav] = useState('')
  const navItems = [
    { name: '教學專區', path: '/education' },
    { name: '影音專區', path: '/video' },
    { name: '新聞專區', path: '/news' },
    { name: '社群專區', path: '/community' },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  const cardStyle =
    'group transition-all duration-500 rounded-2xl cursor-pointer hover:bg-white/5 hover:backdrop-blur-md hover:scale-105 hover:text-blue-400 p-6 md:p-8 backdrop-saturate-150'

  useEffect(() => {
    setShowLogo(inView)
  }, [inView])

  return (
    <ClientWrapper>
      <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
        <BackgroundCanvas
          particleCount={180}
          blurAmount={3}
          particleColor="#37a8ff88"
        />

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

        <section
          className="h-[130vh] flex flex-col items-center justify-center relative z-10"
          ref={ref}
        >
          <motion.img
            src="/logo.png"
            alt="NodeZ Logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: showLogo ? 1 : 0,
              scale: showLogo ? 1 : 0.8,
            }}
            transition={{ duration: 1 }}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-blue-400 tracking-wide mt-8 md:text-lg text-center px-4"
          >
            Every one is Node of Z
          </motion.div>
        </section>

        <div className="absolute bottom-0 left-0 w-full h-60 bg-gradient-to-b from-transparent via-black/80 to-black backdrop-blur-[2px] z-10 pointer-events-none" />

        <section className="px-4 md:px-12 py-24 bg-black space-y-20 relative z-10">
          {[
            ['/education', '教學專區', '提供區塊鏈基礎、技術文檔與 Layer2 深入學習內容，幫助學員完整建立知識體系。'],
            ['/video', '影音專區', '精選系列課程影片與訪談內容，讓學習更具臨場感與互動性。'],
            ['/news', '新聞專區', '追蹤幣圈重要趨勢與項目觀察，快速掌握產業脈動。'],
            ['/community', '社群專區', '加入 NodeZ Discord / LINE 社群，與其他學生共學、討論與參與活動。'],
          ].map(([href, title, desc]) => (
            <motion.div
              key={href}
              className={cardStyle}
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
