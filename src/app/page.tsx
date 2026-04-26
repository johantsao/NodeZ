'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ClientWrapper from '@/components/ClientWrapper'
import PageLoader from '@/components/PageLoader'
import { i18n, Lang } from '@/lib/i18n'

const eventPhotos = [
  '/events/photo_6294080551895371452_y.jpg',
  '/events/photo_6294080551895371454_y.jpg',
  '/events/photo_6294080551895371455_y.jpg',
  '/events/photo_6294080551895371456_y.jpg',
  '/events/photo_6294080551895371457_y.jpg',
  '/events/photo_6294080551895371461_y.jpg',
]

const capsData = [
  { num: '01 / EVENTS', key: '1', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5v14"/></svg> },
  { num: '02 / CONTENT', key: '2', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg> },
  { num: '03 / COMMUNITY', key: '3', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/></svg> },
  { num: '04 / CAMPAIGNS', key: '4', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l3-9 3 9 3-6 3 6 3-4 3 4"/><path d="M3 20h18"/></svg> },
]

const channelLinks = [
  'https://www.youtube.com/@Node.Z',
  'https://www.nodezblockchain.com/',
  'https://x.com/Node_Z_',
  '#events',
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

export default function Home() {
  const [lang, setLang] = useState<Lang>('zh-TW')
  const t = (key: string) => i18n[lang]?.[key] ?? key
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [langOpen, setLangOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodez.lang') as Lang
      if (saved && i18n[saved]) { setLang(saved); return }
    } catch {}
    // Auto-detect from browser language
    const browserLang = navigator.language || ''
    if (browserLang.startsWith('zh-CN') || browserLang === 'zh-Hans') setLang('zh-CN')
    else if (browserLang.startsWith('en')) setLang('en')
    // default zh-TW
  }, [])

  // Particle background (same as /auth)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: -999, y: -999 }
    const handleMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', handleMouse)

    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1.5,
      dx: Math.random() * 0.6 - 0.3,
      dy: Math.random() * 0.6 - 0.3,
    }))

    let animId: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#37a8ff88'
      particles.forEach(p => {
        // Mouse repulsion
        const mdx = mouse.x - p.x
        const mdy = mouse.y - p.y
        const dist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 3
          p.x -= (mdx / dist) * force
          p.y -= (mdy / dist) * force
        }
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      animId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  const switchLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('nodez.lang', l) } catch {}
  }

  const isEn = lang === 'en'
  const isCN = lang === 'zh-CN'

  const navAnchors = [
    { label: isEn ? 'About' : isCN ? '关于我们' : '關於我們', href: '#about' },
    { label: isEn ? 'Services' : isCN ? '服务项目' : '服務項目', href: '#services' },
    { label: isEn ? 'Channels' : isCN ? '社群与伙伴' : '社群與夥伴', href: '#channels' },
    { label: isEn ? 'Events' : isCN ? '活动' : '活動', href: '#events' },
  ]

  const [researchOpen, setResearchOpen] = useState(false)
  const researchLinks = [
    { label: 'NodeZ Research', href: '/content' },
    { label: isEn ? 'Research' : isCN ? '调研文章' : '調研文章', href: '/education' },
    { label: isEn ? 'Videos' : isCN ? '影音内容' : '影音內容', href: '/video' },
    { label: isEn ? 'Community' : isCN ? '社群专区' : '社群專區', href: '/community' },
  ]

  return (
    <>
      <PageLoader />
      {/* Particle canvas — outside ClientWrapper to avoid z-index blocking */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <ClientWrapper>
      <div className="text-white min-h-screen font-sans relative overflow-x-hidden scroll-smooth">

        {/* ========== NAV ========== */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <a href="#top" className="flex items-center gap-2.5">
              <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
              <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
            </a>
            <ul className="hidden md:flex items-center gap-7 ml-auto text-sm font-medium text-gray-400">
              {navAnchors.map(n => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-white transition">{n.label}</a>
                </li>
              ))}
              {/* NodeZ Research — prominent with accent */}
              <li
                className="relative"
                onMouseEnter={() => setResearchOpen(true)}
                onMouseLeave={() => setResearchOpen(false)}
              >
                <Link href="/content" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#37a8ff]/10 border border-[#37a8ff]/25 text-[#37a8ff] font-semibold text-sm hover:bg-[#37a8ff]/20 transition">
                  NodeZ Research
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${researchOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </Link>
                {researchOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="bg-black/90 backdrop-blur border border-white/10 rounded-xl p-2 min-w-[160px] shadow-xl">
                      {researchLinks.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-[#37a8ff] hover:bg-white/5 rounded-lg transition"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
              {/* Globe language selector */}
              <li className="relative" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
                <button className="flex items-center gap-1 text-gray-400 hover:text-white transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  <span className="text-xs">{lang === 'zh-TW' ? '繁' : lang === 'zh-CN' ? '简' : 'EN'}</span>
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-black/90 backdrop-blur border border-white/10 rounded-xl p-1.5 min-w-[120px] shadow-xl">
                      {([['zh-TW', '繁體中文'], ['zh-CN', '简体中文'], ['en', 'English']] as [Lang, string][]).map(([code, label]) => (
                        <button
                          key={code}
                          onClick={() => switchLang(code)}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition ${lang === code ? 'text-[#37a8ff] bg-[#37a8ff]/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </ul>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-400 hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
              </svg>
            </button>
            <a href="#contact" className="hidden md:inline-flex px-4 py-2 bg-[#37a8ff] text-white text-sm font-semibold rounded-lg hover:bg-[#5bb8ff] transition">
              {t('nav.cta')}
            </a>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 space-y-4">
              {navAnchors.map(n => (
                <a key={n.href} href={n.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg text-gray-300 hover:text-[#37a8ff] transition">{n.label}</a>
              ))}
              <Link href="/content" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-[#37a8ff] font-semibold">NodeZ Research</Link>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block mt-4 text-center px-6 py-3 bg-[#37a8ff] text-white font-semibold rounded-xl">{t('nav.cta')}</a>
            </div>
          )}
        </nav>

        <div className="max-w-[1240px] mx-auto px-6 relative z-10" id="top">

          {/* ========== HERO ========== */}
          <section className="min-h-screen flex items-center pt-24 pb-20 section-glow">
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-16 items-center w-full">
              <div>
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-9"
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                >
                  {lang === 'zh-TW' && <>為 <span className="text-gradient">Web3 品牌</span>打造<br />被記住的每一刻</>}
                  {lang === 'zh-CN' && <>为 <span className="text-gradient">Web3 品牌</span>打造<br />被记住的每一刻</>}
                  {lang === 'en' && <>Building moments<br />that <span className="text-gradient">Web3 brands</span> remember</>}
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-400 leading-relaxed max-w-xl mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {lang === 'zh-TW' && '內容 × 社群 × 線下活動——為 Web3 品牌交付完整行銷解決方案。'}
                  {lang === 'zh-CN' && '内容 × 社群 × 线下活动——为 Web3 品牌交付完整营销解决方案。'}
                  {lang === 'en' && 'Content × Community × Events — end-to-end marketing for Web3 brands.'}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <a href="#contact" className="animate-breathe px-7 py-4 bg-[#37a8ff] text-white font-semibold rounded-xl hover:bg-[#5bb8ff] hover:scale-105 transition-all duration-300">{t('hero.cta1')}</a>
                  <a href="#services" className="px-7 py-4 border border-white/20 rounded-xl font-semibold hover:border-[#37a8ff] hover:text-[#37a8ff] hover:bg-[#37a8ff]/5 hover:scale-105 transition-all duration-300">{t('hero.cta2')}</a>
                </motion.div>
              </div>
              <motion.div
                className="relative flex items-center justify-center aspect-square"
                initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="absolute inset-[10%] bg-[radial-gradient(circle,rgba(55,168,255,0.25),transparent_60%)] blur-[50px] animate-pulse" />
                <img src="/nodez-logo.png" alt="NodeZ" className="relative w-3/4 max-w-[360px] drop-shadow-[0_12px_60px_rgba(55,168,255,0.35)] animate-float" />
              </motion.div>
            </div>
          </section>

          {/* ========== ABOUT ========== */}
          <section id="about" className="py-32 section-glow">
            <motion.div
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
                <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">About Us</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
                {t('about.lead').split(t('about.lead.highlight')).map((part, i, arr) => (
                  <span key={i}>{part}{i < arr.length - 1 && <span className="text-gradient">{t('about.lead.highlight')}</span>}</span>
                ))}
              </h2>
            </motion.div>

            {/* Stat counters */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
              {[
                { num: '10+', label: lang === 'en' ? 'Partner Brands' : lang === 'zh-CN' ? '合作品牌' : '合作品牌' },
                { num: '50+', label: lang === 'en' ? 'Events Held' : lang === 'zh-CN' ? '活动场次' : '活動場次' },
                { num: '3+', label: lang === 'en' ? 'Owned Media Channels' : lang === 'zh-CN' ? '自有媒体通路' : '自有媒體通路' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-gradient mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                    viewport={{ once: true }}
                  >
                    {stat.num}
                  </motion.div>
                  <div className="text-sm text-gray-400 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========== SERVICES ========== */}
          <section id="services" className="py-32 section-glow">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-20"
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
                <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">What We Do</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{t('caps.title')}</h2>
            </motion.div>

            {/* Horizontal timeline / process flow */}
            <div className="relative mb-28">
              {/* Connecting gradient line */}
              <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#37a8ff]/0 via-[#37a8ff]/60 to-[#37a8ff]/0" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
                {capsData.map((cap, idx) => (
                  <motion.div
                    key={cap.key}
                    className="flex flex-col items-center text-center px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#080c18] border-2 border-[#37a8ff] flex items-center justify-center text-[#37a8ff] font-mono text-sm font-bold mb-5 relative z-10 shadow-[0_0_20px_rgba(55,168,255,0.25)]">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base font-bold mb-2">{t(`caps.${cap.key}.title`)}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed max-w-[200px]">{t(`caps.${cap.key}.desc`)}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Service tracks — alternating left/right */}
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
                <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">Brand Solutions</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                {lang === 'en' ? 'Brand Service Plans' : lang === 'zh-CN' ? '品牌服务方案' : '品牌服務方案'}
              </h3>
            </motion.div>

            <div className="flex flex-col gap-6">
              {([
                {
                  tag: t('svc.1.tag'), title: t('svc.1.title'),
                  keywords: isEn
                    ? ['Brand Week', 'Meetup', 'Launch Events', 'KOL Distribution', 'Asia Multi-city']
                    : isCN ? ['品牌周', 'Meetup', '新功能发布', 'KOL 分发', '亚洲跨城']
                    : ['品牌週', 'Meetup', '新功能發布', 'KOL 分發', '亞洲跨城'],
                },
                {
                  tag: t('svc.2.tag'), title: t('svc.2.title'),
                  keywords: isEn
                    ? ['Token GTM', 'Listing Campaign', 'Research × PR', 'AMA Series', 'Ecosystem Partnerships']
                    : isCN ? ['代币 GTM', '上所 Campaign', 'Research × PR', 'AMA 系列', '生态牵线']
                    : ['代幣 GTM', '上所 Campaign', 'Research × PR', 'AMA 系列', '生態牽線'],
                },
                {
                  tag: t('svc.3.tag'), title: t('svc.3.title'),
                  keywords: isEn
                    ? ['Brand Translation', 'Image Upgrade', 'TW / HK / SEA Launch', 'Web3 Onboarding']
                    : isCN ? ['品牌语言转译', '形象升级', '台港东南亚落地', 'Web3 Onboarding']
                    : ['品牌語言轉譯', '形象升級', '台港東南亞落地', 'Web3 Onboarding'],
                },
              ]).map((svc, idx) => (
                <motion.div
                  key={idx}
                  className={`flex flex-col md:flex-row items-stretch gap-0 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Content side */}
                  <div className="flex-1 border-l-2 border-[#37a8ff] pl-8 py-8">
                    <span className="inline-block font-mono text-[10px] text-[#37a8ff] tracking-[0.15em] uppercase px-2.5 py-1 border border-[#37a8ff]/30 rounded-md mb-4">
                      {svc.tag}
                    </span>
                    <h3 className="text-2xl font-bold mb-5">{svc.title}</h3>
                    {/* Keyword badges — bold text, no border, typographic emphasis */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
                      {svc.keywords.map((kw, ki) => (
                        <span key={kw} className="text-[15px] md:text-base font-semibold text-white/80 hover:text-[#37a8ff] transition-colors duration-200 cursor-default tracking-wide">
                          {kw}
                          {ki < svc.keywords.length - 1 && <span className="ml-6 text-[#37a8ff]/30 font-light select-none">/</span>}
                        </span>
                      ))}
                    </div>
                    <a href="#contact" className="text-[13px] text-[#37a8ff] font-semibold inline-flex items-center gap-1.5 hover:gap-3 transition-all">
                      Contact Us <span>&rarr;</span>
                    </a>
                  </div>
                  {/* Number accent */}
                  <div className="flex-1 hidden md:flex items-center justify-center">
                    <span className="text-[120px] font-black text-[#37a8ff]/20 drop-shadow-[0_0_40px_rgba(55,168,255,0.12)] select-none">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========== CHANNELS ========== */}
          <motion.section id="channels" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
              <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">Community & Partners</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {lang === 'en' ? 'Your Brand, Our Channels' : lang === 'zh-CN' ? '品牌曝光通路' : '品牌曝光通路'}
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mb-16 leading-relaxed">
              {lang === 'en' ? 'Leverage our owned media assets to amplify your brand reach across Asia.' : lang === 'zh-CN' ? '借助我们的自有媒体资产，放大品牌在亚洲市场的触达。' : '借助我們的自有媒體資產，放大品牌在亞洲市場的觸達。'}
            </p>

            {/* Social media — full-width grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {[
                { name: 'YouTube', handle: '@Node.Z', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: 'https://www.youtube.com/@Node.Z' },
                { name: 'Twitter / X', handle: '@Node_Z_', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: 'https://x.com/Node_Z_' },
                { name: 'Instagram', handle: '@node.z_', icon: <img src="/icons/instagram.svg" alt="Instagram" className="w-7 h-7" />, href: 'https://www.instagram.com/node.z_' },
                { name: 'Telegram', handle: 'Join Group', icon: <img src="/icons/telegram.png" alt="Telegram" className="w-7 h-7" />, href: 'https://t.me/+yP-Qdy7ohLA0MzRl' },
              ].map((s, idx) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-white/8 hover:border-[#37a8ff]/30 bg-white/[0.02] hover:bg-[#37a8ff]/5 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="text-[#37a8ff] group-hover:scale-110 transition shrink-0">{s.icon}</div>
                  <div>
                    <div className="text-sm font-semibold group-hover:text-[#37a8ff] transition">{s.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{s.handle}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Platform channels — left-accent cards, 2-column */}
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: isEn ? 'YouTube Channel' : isCN ? 'YouTube 频道' : 'YouTube 頻道',
                  desc: isEn ? 'Long-form brand collaborations, interviews, and product exposure.' : isCN ? '品牌合作影片、访谈与产品曝光的长效载体。' : '品牌合作影片、訪談與產品曝光的長效載體。',
                  link: 'youtube.com/@Node.Z', href: 'https://www.youtube.com/@Node.Z',
                },
                {
                  title: isEn ? 'Research Platform' : isCN ? 'Research 平台' : 'Research 平台',
                  desc: isEn ? 'In-depth research exposure and SEO content placement for partners.' : isCN ? '为合作方提供深度研究曝光与 SEO 内容植入。' : '為合作方提供深度研究曝光與 SEO 內容植入。',
                  link: 'NodeZ Research', href: '/content',
                },
                {
                  title: isEn ? 'SaaS KOL Network' : isCN ? 'SaaS 矩阵号服务' : 'SaaS 矩陣號服務',
                  desc: isEn ? 'Automated social distribution and KOL account management at scale.' : isCN ? '自动化社群推播与 KOL 矩阵帐号代操，规模化触及目标受众。' : '自動化社群推播與 KOL 矩陣帳號代操，規模化觸及目標受眾。',
                  link: '@Node_Z_', href: 'https://x.com/Node_Z_',
                },
                {
                  title: isEn ? 'On-Ground Events' : isCN ? '线下活动能量' : '線下活動能量',
                  desc: isEn ? 'Venue, speakers, production — one-stop brand event support.' : isCN ? '场地、讲师、制作一站式支援，即时承接品牌活动需求。' : '場地、講師、製作一站式支援，即時承接品牌活動需求。',
                  link: isEn ? 'See events' : isCN ? '查看活动现场' : '查看活動現場', href: '#events',
                },
              ].map((ch, idx) => (
                <motion.div
                  key={idx}
                  className="border-l-4 border-[#37a8ff] bg-white/[0.02] rounded-r-xl pl-6 pr-6 py-6 hover:bg-white/[0.04] transition"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-bold text-[15px] mb-2">{ch.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{ch.desc}</p>
                  <a href={ch.href} target={idx < 3 ? '_blank' : undefined} className="text-[13px] text-[#37a8ff] font-semibold inline-flex items-center gap-1.5 hover:gap-3 transition-all">
                    {ch.link} <span>&rarr;</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ========== GALLERY ========== */}
          <motion.section id="events" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
              <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">Events</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('gal.title')}</h2>
            {/* Large immersive quote */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-4xl mb-16 italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              &ldquo;{t('gal.desc')}&rdquo;
            </motion.p>
            {/* Photo grid with hover zoom + overlay */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {eventPhotos.map((src, i) => {
                const overlayLabels = ['Meetup', 'Workshop', 'Networking', 'Panel', 'Community', 'Brand Week']
                return (
                  <motion.div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/3] group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <img src={src} alt="NodeZ event" className="w-full h-full object-cover transition duration-700 saturate-[0.85] group-hover:scale-110 group-hover:saturate-100" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-mono text-[#37a8ff] tracking-wider uppercase">{overlayLabels[i] || 'Event'}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ========== CONTACT ========== */}
          <section id="contact" className="py-40 text-center">
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                {isEn ? <>Let&apos;s build your next<br /><span className="text-[#37a8ff]">brand moment</span></> : isCN ? <>打造你的下一个<br /><span className="text-[#37a8ff]">品牌时刻</span></> : <>打造你的下一個<br /><span className="text-[#37a8ff]">品牌時刻</span></>}
              </h2>
              <p className="text-base text-gray-400 mb-12">
                {isEn ? 'Tell us your needs — we\'ll craft your exclusive brand marketing alpha' : isCN ? '告诉我们你的需求，我们量身打造您专属的品牌行销 Alpha' : '告訴我們你的需求，我們量身打造您專屬的品牌行銷 Alpha'}
              </p>
              <a
                href="mailto:nodezblockchain@gmail.com"
                className="animate-breathe inline-flex items-center gap-3 px-10 py-4 bg-[#37a8ff] text-white font-semibold rounded-xl hover:bg-[#5bb8ff] hover:scale-105 transition-all duration-300 text-lg"
              >
                {isEn ? 'Contact Us' : isCN ? '联系我们' : '聯繫我們'}
              </a>
            </motion.div>
          </section>

        </div>

        {/* ========== FOOTER ========== */}
        <footer className="border-t border-white/10 py-16 relative z-10">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <img src="/nodez-logo.png" alt="NodeZ" className="w-8 h-8" />
                  <span className="font-bold text-lg">Node<span className="text-[#37a8ff]">Z</span></span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Web3 品牌行銷解決方案<br/>內容 × 社群 × 線下活動
                </p>
                <a href="mailto:nodezblockchain@gmail.com" className="text-sm text-[#37a8ff] hover:underline">nodezblockchain@gmail.com</a>
              </div>
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">QUICK LINKS</h4>
                <ul className="space-y-3">
                  <li><a href="#about" className="text-sm text-gray-400 hover:text-[#37a8ff] transition">關於我們</a></li>
                  <li><a href="#services" className="text-sm text-gray-400 hover:text-[#37a8ff] transition">服務項目</a></li>
                  <li><a href="#channels" className="text-sm text-gray-400 hover:text-[#37a8ff] transition">品牌曝光通路</a></li>
                  <li><Link href="/content" className="text-sm text-gray-400 hover:text-[#37a8ff] transition">NodeZ Research</Link></li>
                </ul>
              </div>
              {/* Social */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 tracking-wide">FOLLOW US</h4>
                <div className="flex gap-4">
                  <a href="https://www.youtube.com/@Node.Z" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#37a8ff] hover:border-[#37a8ff]/30 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://x.com/Node_Z_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#37a8ff] hover:border-[#37a8ff]/30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/node.z_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#37a8ff] hover:border-[#37a8ff]/30 transition">
                    <img src="/icons/instagram.svg" alt="IG" className="w-4 h-4 opacity-60 hover:opacity-100" />
                  </a>
                  <a href="https://t.me/+yP-Qdy7ohLA0MzRl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#37a8ff] hover:border-[#37a8ff]/30 transition">
                    <img src="/icons/telegram.png" alt="TG" className="w-4 h-4 opacity-60 hover:opacity-100" />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-600">
              &copy; 2025 NodeZ. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </ClientWrapper>
    </>
  )
}
