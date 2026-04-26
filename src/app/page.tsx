'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ClientWrapper from '@/components/ClientWrapper'
import BackgroundCanvas from '@/components/BackgroundCanvas'
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodez.lang') as Lang
      if (saved && i18n[saved]) setLang(saved)
    } catch {}
  }, [])

  const switchLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('nodez.lang', l) } catch {}
  }

  const navAnchors = [
    { label: '關於我們', href: '#about' },
    { label: '服務項目', href: '#services' },
    { label: '社群與夥伴', href: '#channels' },
    { label: '活動', href: '#events' },
  ]

  const [researchOpen, setResearchOpen] = useState(false)
  const researchLinks = [
    { label: '教學文章', href: '/education' },
    { label: '影音內容', href: '/video' },
    { label: '社群專區', href: '/community' },
  ]

  return (
    <ClientWrapper>
      <div className="text-white min-h-screen font-sans relative overflow-x-hidden scroll-smooth">
        {/* ========== NAV ========== */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <a href="#top" className="flex items-center gap-2.5">
              <img src="/nodez-logo.png" alt="NodeZ" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(55,168,255,0.4)]" />
              <span className="font-bold text-lg tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
            </a>
            <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
              {navAnchors.map(n => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-[#37a8ff] transition">{n.label}</a>
                </li>
              ))}
              <li
                className="relative"
                onMouseEnter={() => setResearchOpen(true)}
                onMouseLeave={() => setResearchOpen(false)}
              >
                <span className="hover:text-[#37a8ff] transition cursor-pointer inline-flex items-center gap-1">
                  NodeZ Research
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${researchOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </span>
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
            </ul>
            <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10 rounded-lg">
              {(['zh-TW', 'zh-CN', 'en', 'ko'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition ${lang === l ? 'bg-[#37a8ff] text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {l === 'zh-TW' ? '繁' : l === 'zh-CN' ? '简' : l === 'en' ? 'EN' : '한'}
                </button>
              ))}
            </div>
            <a href="#contact" className="hidden md:inline-flex px-4 py-2 bg-[#37a8ff] text-white text-sm font-semibold rounded-lg hover:bg-[#5bb8ff] transition">
              {t('nav.cta')}
            </a>
          </div>
        </nav>

        <div className="max-w-[1240px] mx-auto px-6 relative z-10" id="top">

          {/* ========== HERO ========== */}
          <section className="min-h-screen flex items-center pt-24 pb-20 border-b border-white/10">
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-16 items-center w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight mb-9">
                  {t('hero.title').split(t('hero.title.highlight')).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-[#37a8ff]">{t('hero.title.highlight')}</span>}
                    </span>
                  ))}
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-xl mb-10">{t('hero.lede')}</p>
                <div className="flex flex-wrap gap-3">
                  <a href="#contact" className="px-6 py-3.5 bg-[#37a8ff] text-white font-semibold rounded-xl hover:bg-[#5bb8ff] transition">{t('hero.cta1')}</a>
                  <a href="#services" className="px-6 py-3.5 border border-white/20 rounded-xl font-semibold hover:border-[#37a8ff] hover:text-[#37a8ff] hover:bg-[#37a8ff]/5 transition">{t('hero.cta2')}</a>
                </div>
              </motion.div>
              <motion.div
                className="relative flex items-center justify-center aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div className="absolute inset-[15%] bg-[radial-gradient(circle,rgba(55,168,255,0.18),transparent_65%)] blur-[40px]" />
                <img src="/nodez-logo.png" alt="NodeZ" className="relative w-3/4 max-w-[360px] drop-shadow-[0_12px_40px_rgba(55,168,255,0.25)]" />
              </motion.div>
            </div>
          </section>

          {/* ========== ABOUT ========== */}
          <motion.section id="about" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="font-mono text-xs text-[#37a8ff] tracking-[0.15em] uppercase mb-4 flex items-center gap-2.5">
              <span className="w-6 h-px bg-[#37a8ff]" />{t('about.label')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
              {t('about.title').split(t('about.title.highlight')).map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <span className="text-[#37a8ff]">{t('about.title.highlight')}</span>}</span>
              ))}
            </h2>
            <p className="text-base text-gray-400 max-w-2xl mb-16 leading-relaxed">{t('about.desc')}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left — lead statement in a styled card */}
              <div className="bg-gradient-to-br from-[#37a8ff]/10 to-transparent border border-[#37a8ff]/20 rounded-2xl p-10 flex items-center">
                <div className="text-2xl md:text-3xl font-bold leading-snug">
                  {t('about.lead').split(t('about.lead.highlight')).map((part, i, arr) => (
                    <span key={i}>{part}{i < arr.length - 1 && <span className="text-[#37a8ff]">{t('about.lead.highlight')}</span>}</span>
                  ))}
                </div>
              </div>
              {/* Right — body text in card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10">
                <div className="text-[15px] text-gray-300 leading-[1.9] space-y-5">
                  <p>{t('about.body1')}</p>
                  <p>{t('about.body2')}</p>
                  <p className="text-white font-medium">{t('about.body3')}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ========== SERVICES (merged Capabilities + Services) ========== */}
          <motion.section id="services" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="font-mono text-xs text-[#37a8ff] tracking-[0.15em] uppercase mb-4 flex items-center gap-2.5">
              <span className="w-6 h-px bg-[#37a8ff]" />{'02 — SERVICES'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('caps.title')}</h2>
            <p className="text-base text-gray-400 max-w-2xl mb-16 leading-relaxed">{t('caps.desc')}</p>

            {/* Capability cards — horizontal strip of 4 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
              {capsData.map(cap => (
                <div key={cap.key} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#37a8ff]/30 hover:bg-[#37a8ff]/[0.03] transition">
                  <div className="w-10 h-10 rounded-xl bg-[#37a8ff]/10 border border-[#37a8ff]/20 flex items-center justify-center text-[#37a8ff] mb-4">{cap.icon}</div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-[#37a8ff] transition">{t(`caps.${cap.key}.title`)}</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed mb-4">{t(`caps.${cap.key}.desc`)}</p>
                  <ul className="space-y-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <li key={i} className="text-[12px] text-gray-500 pl-4 relative before:absolute before:left-0 before:top-[7px] before:w-2 before:h-px before:bg-[#37a8ff]/50">
                        {t(`caps.${cap.key}.i${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Service tracks — 3 prominent cards */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#37a8ff]/10 border border-[#37a8ff]/20 flex items-center justify-center text-[#37a8ff]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{'三條服務線'}</h3>
                <p className="text-sm text-gray-500">{t('svc.desc')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map(n => (
                <div key={n} className="group p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-[#37a8ff]/30 transition">
                  <div className="bg-black/80 rounded-2xl p-7 h-full flex flex-col gap-4">
                    <span className="self-start font-mono text-[10px] text-[#37a8ff] tracking-[0.15em] uppercase px-2.5 py-1 border border-[#37a8ff]/30 rounded-md">
                      {t(`svc.${n}.tag`)}
                    </span>
                    <h3 className="text-xl font-bold group-hover:text-[#37a8ff] transition">{t(`svc.${n}.title`)}</h3>
                    <p className="text-[13px] text-gray-500 pb-3 border-b border-white/10">{t(`svc.${n}.for`)}</p>
                    <p className="text-sm text-gray-400 leading-relaxed flex-grow">{t(`svc.${n}.desc`)}</p>
                    <a href="#contact" className="text-[13px] text-[#37a8ff] font-semibold inline-flex items-center gap-1.5 hover:gap-3 transition-all mt-auto pt-3 border-t border-white/10">
                      {t('svc.cta')} <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ========== CHANNELS (社群與夥伴) ========== */}
          <motion.section id="channels" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="font-mono text-xs text-[#37a8ff] tracking-[0.15em] uppercase mb-4 flex items-center gap-2.5">
              <span className="w-6 h-px bg-[#37a8ff]" />{'04 — COMMUNITY & PARTNERS'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{'社群與夥伴'}</h2>
            <p className="text-base text-gray-400 max-w-2xl mb-16 leading-relaxed">{t('pf.desc')}</p>

            {/* Official Social Media */}
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              官方社群媒體
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { name: 'YouTube', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: 'https://www.youtube.com/@Node.Z', handle: '@Node.Z' },
                { name: 'Twitter / X', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: 'https://x.com/Node_Z_', handle: '@Node_Z_' },
                { name: 'Instagram', icon: <img src="/icons/instagram.svg" alt="Instagram" className="w-7 h-7" />, href: 'https://www.instagram.com/node.z_', handle: '@node.z_' },
                { name: 'Telegram', icon: <img src="/icons/telegram.svg" alt="Telegram" className="w-7 h-7" />, href: 'https://t.me/+yP-Qdy7ohLA0MzRl', handle: 'Join Group' },
              ].map((s, idx) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="group p-[1px] rounded-2xl bg-gradient-to-br from-[#37a8ff]/20 to-transparent hover:from-[#37a8ff]/40 transition">
                  <div className="bg-black/80 rounded-2xl p-6 h-full flex flex-col items-center text-center gap-3 group-hover:bg-black/60 transition">
                    <div className="text-[#37a8ff] group-hover:scale-110 transition">{s.icon}</div>
                    <h4 className="font-bold text-sm">{s.name}</h4>
                    <span className="text-xs text-[#37a8ff] font-mono">{s.handle}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Channel cards */}
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              官方平台與合作通路
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: t('pf.1.title'), sub: t('pf.1.sub'), desc: t('pf.1.desc'), link: 'youtube.com/@Node.Z', href: 'https://www.youtube.com/@Node.Z' },
                { title: t('pf.2.title'), sub: t('pf.2.sub'), desc: t('pf.2.desc'), link: 'nodezblockchain.com', href: 'https://www.nodezblockchain.com/' },
                { title: t('pf.3.title'), sub: t('pf.3.sub'), desc: t('pf.3.desc'), link: '@Node_Z_', href: 'https://x.com/Node_Z_' },
                { title: t('pf.4.title'), sub: t('pf.4.sub'), desc: t('pf.4.desc'), link: t('pf.4.link'), href: '#events' },
              ].map((ch, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:border-[#37a8ff]/30 transition group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#37a8ff]/10 border border-[#37a8ff]/20 flex items-center justify-center text-[#37a8ff] font-mono text-xs font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px]">{ch.title}</h4>
                      <p className="text-[11px] text-gray-500">{ch.sub}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">{ch.desc}</p>
                  <a href={ch.href} target={idx < 3 ? '_blank' : undefined} className="text-[13px] text-[#37a8ff] font-semibold inline-flex items-center gap-1.5 hover:gap-3 transition-all">
                    {ch.link} <span>&rarr;</span>
                  </a>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ========== GALLERY ========== */}
          <motion.section id="events" className="py-28 border-b border-white/10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="font-mono text-xs text-[#37a8ff] tracking-[0.15em] uppercase mb-4 flex items-center gap-2.5">
              <span className="w-6 h-px bg-[#37a8ff]" />{t('gal.label')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('gal.title')}</h2>
            <p className="text-base text-gray-400 max-w-2xl mb-16 leading-relaxed">{t('gal.desc')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {eventPhotos.map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[4/3] group">
                  <img src={src} alt="NodeZ event" className="w-full h-full object-cover transition duration-500 saturate-[0.85] group-hover:scale-105 group-hover:saturate-100" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
                </div>
              ))}
            </div>
          </motion.section>

          {/* ========== CONTACT ========== */}
          <section id="contact" className="py-32 text-center">
            <motion.div
              className="max-w-[920px] mx-auto p-16 md:p-20 bg-gradient-to-br from-white/[0.03] to-white/[0.06] border border-white/20 rounded-3xl relative overflow-hidden"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_20%,rgba(55,168,255,0.08),transparent_50%)] pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
                  {t('contact.title').split(t('contact.title.highlight')).map((part, i, arr) => (
                    <span key={i}>{part}{i < arr.length - 1 && <span className="text-[#37a8ff]">{t('contact.title.highlight')}</span>}</span>
                  ))}
                </h2>
                <p className="text-base text-gray-400 mb-10 max-w-lg mx-auto">{t('contact.sub')}</p>
                <a
                  href="mailto:nodezblockchain@gmail.com"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#37a8ff] text-white font-semibold rounded-xl shadow-[0_12px_32px_rgba(55,168,255,0.3)] hover:bg-[#5bb8ff] transition mb-12"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                  nodezblockchain@gmail.com
                </a>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  {[
                    { label: 'Website', value: 'nodezblockchain.com', href: 'https://www.nodezblockchain.com/' },
                    { label: 'YouTube', value: '@Node.Z', href: 'https://www.youtube.com/@Node.Z' },
                    { label: 'Twitter / X', value: '@Node_Z_', href: 'https://x.com/Node_Z_' },
                    { label: 'Telegram', value: t('contact.tg'), href: 'https://t.me/+W8LGh2xB5ygwN' },
                  ].map(item => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      className="p-5 bg-black/50 border border-white/10 rounded-xl text-left hover:border-[#37a8ff] hover:bg-[#37a8ff]/5 transition">
                      <div className="font-mono text-[10px] text-gray-500 tracking-[0.15em] uppercase mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-[#37a8ff] break-all">{item.value}</div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

        </div>

        {/* ========== FOOTER ========== */}
        <footer className="border-t border-white/10 py-10 text-center text-[13px] text-gray-500">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <img src="/nodez-logo.png" alt="NodeZ" className="w-5 h-5 drop-shadow-[0_0_6px_rgba(55,168,255,0.3)]" />
            <strong className="text-white font-bold">NodeZ</strong>
          </div>
          <div>{t('footer.line')}</div>
        </footer>
      </div>
    </ClientWrapper>
  )
}
