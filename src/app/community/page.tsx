// src/app/community/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ClientWrapper from '@/components/ClientWrapper'
import { useParticleCanvas } from '@/hooks/useParticleCanvas'

/** --- 共用的社群資料 --- */
const socials = [
  {
    name : 'Instagram',
    href : 'https://www.instagram.com/node.z_?igsh=MThvaXJlc25jNjI5bg%3D%3D&utm_source=qr',
    icon : '/icons/instagram.svg',
    desc : '追蹤每日限動 ‧ 活動花絮'
  },
  {
    name : 'Telegram',
    href : 'https://t.me/+yP-Qdy7ohLA0MzRl',
    icon : '/icons/telegram.png',
    desc : '搶先獲取社群公告 ‧ 空投資訊'
  },
  {
    name : 'LINE 社群',
    href : 'https://line.me/ti/g2/iJYYh0x-CJO2oLcCHMQOpJh1GNw--S5UtAmxDA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
    icon : '/icons/line.svg',
    desc : '校園同學討論區 ‧ 問答互助'
  }
]

export default function CommunityPage () {
  const canvasRef = useParticleCanvas()
  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <ClientWrapper>
      <div className="relative min-h-screen text-white overflow-hidden">

        {/* ---- NAV ---- */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
            <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
          </Link>
          <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
            <li><Link href="/content" className="hover:text-[#37a8ff] transition">NodeZ Research</Link></li>
            <li><Link href="/education" className="hover:text-[#37a8ff] transition">調研文章</Link></li>
            <li><Link href="/video" className="hover:text-[#37a8ff] transition">影音內容</Link></li>
            <li><Link href="/community" className="text-[#37a8ff] font-semibold">社群專區</Link></li>
          </ul>
          </div>
        </nav>

        {/* ---- HERO ---- */}
        <header className="pt-32 text-center space-y-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            加入 <span className="text-[#37a8ff]">NodeZ</span> 社群
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            一鍵串連區塊鏈愛好者，獲取最快消息、活動與課程！
          </p>
        </header>

        {/* ---- SOCIAL CARDS ---- */}
        <section className="mt-20 px-6 md:px-12 grid gap-10
                            sm:grid-cols-2 lg:grid-cols-3 place-items-center relative z-10">
          {socials.map((s, idx)=>(
            <motion.a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
              initial={{opacity:0, y:30, scale:0.9}}
              animate={{opacity:1, y:0,   scale:1}}
              transition={{delay:0.1*idx, duration:0.5}}
              className="group w-full max-w-sm p-[1px] rounded-2xl
                         bg-gradient-to-br from-[#37a8ff55] to-transparent hover:to-[#37a8ff33]
                         transition">
              <div className="rounded-2xl h-full w-full bg-white/5 backdrop-blur-lg
                              p-8 flex flex-col items-center text-center
                              group-hover:bg-white/[0.08] transition">
                <img src={s.icon} alt={s.name}
                     className="w-16 h-16 mb-6 drop-shadow-lg
                                group-hover:scale-110 transition" />
                <h2 className="text-2xl font-bold mb-2 group-hover:text-[#37a8ff] transition">
                  {s.name}
                </h2>
                <p className="text-sm text-gray-300">{s.desc}</p>
              </div>
            </motion.a>
          ))}
        </section>

        {/* --- 底部漸層 --- */}
        <div className="absolute bottom-0 left-0 w-full h-32
                        bg-gradient-to-b from-transparent via-black/80 to-black
                        pointer-events-none" />
      </div>
    </ClientWrapper>
    </>
  )
}
