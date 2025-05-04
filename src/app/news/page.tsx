'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'

export default function NewsPage() {
  const news = [
    {
      title: 'NodeZ 社群月報 #1',
      summary: '看看這個月社群在 Discord 和校園發生了什麼事！',
      link: 'https://example.com/news1'
    },
    {
      title: '教育模組更新',
      summary: '我們在教學專區新增了 Layer2 教程和互動練習模塊！',
      link: 'https://example.com/news2'
    }
  ]

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <BackgroundCanvas particleCount={180} blurAmount={3} particleColor="#37a8ff88" />

        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {[
              { name: '教學專區', path: '/education' },
              { name: '影音專區', path: '/video' },
              { name: '新聞專區', path: '/news' },
              { name: '社群專區', path: '/community' }
            ].map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-32 px-6 max-w-5xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-12">新聞專區</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-[#37a8ff] transition duration-300 hover:bg-white/10"
              >
                <h2 className="text-2xl font-semibold group-hover:text-[#37a8ff] transition">{item.title}</h2>
                <p className="text-gray-300 mt-2">{item.summary}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
