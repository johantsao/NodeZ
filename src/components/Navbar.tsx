'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const ease = [0.51, 0, 0.08, 1] as const

type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

const labels: Record<Lang, Record<string, string>> = {
  'zh-Hant': {
    about: '關於我們', services: '服務項目', community: '社群與夥伴', events: '活動',
    research: 'NodeZ Research', articles: '調研文章', videos: '影音內容',
    contact: '聯絡我們',
  },
  'zh-Hans': {
    about: '关于我们', services: '服务项目', community: '社群与伙伴', events: '活动',
    research: 'NodeZ Research', articles: '调研文章', videos: '影音内容',
    contact: '联络我们',
  },
  'en': {
    about: 'About', services: 'Services', community: 'Community', events: 'Events',
    research: 'NodeZ Research', articles: 'Research articles', videos: 'Video content',
    contact: 'Contact us',
  },
}

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [researchOpen, setResearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLangState] = useState<Lang>('zh-Hant')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodez.lang') as Lang | null
      if (saved && labels[saved]) setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('nodez.lang', l) } catch {}
  }

  const t = (key: string) => labels[lang]?.[key] ?? labels['zh-Hant'][key] ?? key

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setResearchOpen(false)
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const langLabel: Record<Lang, string> = { 'zh-Hant': '繁', 'zh-Hans': '简', 'en': 'EN' }

  const navLinks = [
    { label: t('about'), href: '/' },
    { label: t('services'), href: '/#services' },
    { label: t('community'), href: '/#channels' },
    { label: t('events'), href: '/#events' },
  ]

  const bgClass = transparent
    ? scrolled
      ? 'bg-[#0c0c10]/92 backdrop-blur-2xl border-b border-white/[0.06]'
      : 'bg-transparent'
    : scrolled
      ? 'bg-[#0c0c10]/92 backdrop-blur-2xl border-b border-white/[0.06]'
      : 'bg-[#0c0c10]'

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${bgClass}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[52px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[10px] shrink-0">
          <Image src="/logo-z.png" alt="NodeZ" width={28} height={28} />
          <span className="text-[16px] font-semibold tracking-tight text-white">NodeZ</span>
        </Link>

        {/* Center: Nav links + Research dropdown */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="px-4 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}

          {/* NodeZ Research dropdown */}
          <div ref={dropdownRef} className="relative ml-1">
            <button
              onClick={() => setResearchOpen(!researchOpen)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-[13px] rounded-full border transition-all duration-300 ${
                researchOpen
                  ? 'border-white/20 text-white bg-white/[0.06]'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              {t('research')}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={`transition-transform duration-300 ${researchOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2.5 4 L5 6.5 L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {researchOpen && (
              <motion.div
                className="absolute top-full mt-2 right-0 bg-[#161619] border border-white/[0.08] rounded-xl py-1.5 min-w-[200px] shadow-2xl shadow-black/40"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/education" onClick={() => setResearchOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg>
                  {t('articles')}
                </Link>
                <Link href="/video" onClick={() => setResearchOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  {t('videos')}
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Globe lang + CTA */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Globe + language dropdown */}
          <div ref={langRef} className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-white/45 hover:text-white/80 transition-colors duration-300"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              <span className="text-[12px]">{langLabel[lang]}</span>
            </button>
            {langOpen && (
              <motion.div
                className="absolute top-full mt-2 right-0 bg-[#161619] border border-white/[0.08] rounded-xl py-1.5 min-w-[120px] shadow-2xl shadow-black/40"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {(['zh-Hant', 'zh-Hans', 'en'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false) }}
                    className={`block w-full text-left px-4 py-2 text-[13px] transition-all duration-200 rounded-lg ${
                      lang === l ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {l === 'zh-Hant' ? '繁體中文' : l === 'zh-Hans' ? '简体中文' : 'English'}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* CTA */}
          <a
            href="mailto:contact@nodez.io"
            className="bg-[#3aa9f3] hover:bg-[#2d9ae0] text-white text-[13px] font-semibold px-5 py-[7px] rounded-lg transition-all duration-300"
          >
            {t('contact')}
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
