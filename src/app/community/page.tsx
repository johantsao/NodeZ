// src/app/community/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

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
    icon : '/icons/telegram.svg',
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
  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* 粒子背景 & 全域霧化層 已在 app/layout.tsx 注入就不用重複 */}
        <BackgroundCanvas particleColor="#2ea7ff55" />

        {/* ---- NAV ---- */}
        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl
                         flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {[
              { name:'教學專區', path:'/education' },
              { name:'影音專區', path:'/video'      },
              { name:'社群專區', path:'/community' }
            ].map(i=>(
              <li key={i.path}
                  className="hover:text-[#37a8ff] transition">
                <Link href={i.path}>{i.name}</Link>
              </li>
            ))}
          </ul>
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
  )
}
