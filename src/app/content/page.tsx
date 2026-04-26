'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ClientWrapper from '@/components/ClientWrapper'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import { i18n, Lang } from '@/lib/i18n'

const sections = [
  {
    key: 'education',
    href: '/education',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  },
  {
    key: 'video',
    href: '/video',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  },
  {
    key: 'community',
    href: '/community',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
]

export default function ContentPage() {
  const [lang, setLang] = useState<Lang>('zh-TW')
  const t = (key: string) => i18n[lang]?.[key] ?? key

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodez.lang') as Lang
      if (saved && i18n[saved]) setLang(saved)
    } catch {}
  }, [])

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/nodez-logo.png" alt="NodeZ" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(55,168,255,0.4)]" />
              <span className="font-bold text-lg tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
            </Link>
            <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
              <li><Link href="/" className="hover:text-[#37a8ff] transition">Home</Link></li>
              <li><Link href="/education" className="hover:text-[#37a8ff] transition">{t('content.education')}</Link></li>
              <li><Link href="/video" className="hover:text-[#37a8ff] transition">{t('content.video')}</Link></li>
              <li><Link href="/community" className="hover:text-[#37a8ff] transition">{t('content.community')}</Link></li>
            </ul>
          </div>
        </nav>

        {/* HERO */}
        <div className="pt-32 pb-8 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('content.title')}
          </motion.h1>
          <p className="text-gray-400 max-w-xl mx-auto">{t('content.desc')}</p>
        </div>

        {/* CARDS */}
        <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          {sections.map((s, idx) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link href={s.href} className="group block p-[1px] rounded-2xl bg-gradient-to-br from-[#37a8ff33] to-transparent hover:to-[#37a8ff22] transition">
                <div className="rounded-2xl h-full bg-white/[0.03] backdrop-blur-lg p-10 flex flex-col items-center text-center group-hover:bg-white/[0.06] transition">
                  <div className="text-[#37a8ff] mb-6 group-hover:scale-110 transition">{s.icon}</div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-[#37a8ff] transition">
                    {t(`content.${s.key}`)}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t(`content.${s.key}.desc`)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none" />
      </div>
    </ClientWrapper>
  )
}
