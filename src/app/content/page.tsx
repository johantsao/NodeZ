'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'

interface Post { id: string; title: string; image_url: string; tags: string[]; created_at: string }
interface Video { id: string; title: string; youtube_id: string; thumb_url: string | null; tags: string[]; created_at: string }

const socials = [
  { name: 'Instagram', handle: '@node.z_', icon: '/icons/instagram.svg', desc: '追蹤每日限動 · 活動花絮', href: 'https://www.instagram.com/node.z_' },
  { name: 'Telegram', handle: 'NodeZ Group', icon: '/icons/telegram.svg', desc: '搶先獲取社群公告 · 空投資訊', href: 'https://t.me/+yP-Qdy7ohLA0MzRl' },
  { name: 'LINE 社群', handle: '校園討論區', icon: '/icons/line.svg', desc: '校園同學討論區 · 問答互助', href: 'https://line.me/ti/g2/iJYYh0x-CJO2oLcCHMQOpJh1GNw--S5UtAmxDA' },
]

export default function ContentPage() {
  const { supabase, loading } = useSupabaseSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (loading) return
    ;(async () => {
      const [p, v] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
      ])
      if (p.data) setPosts(p.data as Post[])
      if (v.data) setVideos(v.data as Video[])
    })()
  }, [loading])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const mouse = { x: -999, y: -999 }
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1.5, dx: Math.random() * 0.5 - 0.25, dy: Math.random() * 0.5 - 0.25,
    }))
    let id: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#37a8ff88'
      particles.forEach(p => {
        const mdx = mouse.x - p.x, mdy = mouse.y - p.y, dist = Math.sqrt(mdx*mdx+mdy*mdy)
        if (dist < 180 && dist > 0) { p.x -= (mdx/dist)*(180-dist)/180*2.5; p.y -= (mdy/dist)*(180-dist)/180*2.5 }
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1; if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill()
      })
      id = requestAnimationFrame(render)
    }
    render()
    return () => { cancelAnimationFrame(id) }
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <ClientWrapper>
        <div className="relative min-h-screen text-white font-sans overflow-x-hidden">

          {/* NAV */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/nodez-logo.png" alt="NodeZ" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(55,168,255,0.4)]" />
                <span className="font-bold text-lg tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
              </Link>
              <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
                <li><Link href="/" className="hover:text-[#37a8ff] transition">首頁</Link></li>
                <li><span className="text-[#37a8ff] font-semibold">NodeZ Research</span></li>
                <li><Link href="/education" className="hover:text-[#37a8ff] transition">教學文章</Link></li>
                <li><Link href="/video" className="hover:text-[#37a8ff] transition">影音內容</Link></li>
              </ul>
            </div>
          </nav>

          {/* HERO */}
          <header className="pt-28 pb-4 relative z-10">
            <div className="max-w-[1240px] mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
                className="flex items-end justify-between border-b border-white/10 pb-8"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#37a8ff]/20 bg-[#37a8ff]/5 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#37a8ff] animate-pulse" />
                    <span className="font-mono text-[11px] text-[#37a8ff] tracking-[0.15em] uppercase">Research & Media</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Node<span className="text-[#37a8ff]">Z</span> Research
                  </h1>
                </div>
                <p className="hidden md:block text-sm text-gray-500 max-w-xs text-right">
                  深度研究 · 教學 · 影音 · 社群
                </p>
              </motion.div>
            </div>
          </header>

          {/* MAIN CONTENT with sidebar */}
          <div className="max-w-[1240px] mx-auto px-6 mt-12 relative z-10">
            <div className="flex gap-8">

              {/* LEFT — main content */}
              <div className="flex-1 min-w-0">

                {/* ARTICLES — horizontal scroll */}
                <div className="mb-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">最新文章</h2>
                    <Link href="/education" className="text-sm text-[#37a8ff] hover:underline">查看全部 &rarr;</Link>
                  </div>
                  {posts.length === 0 ? (
                    <p className="text-gray-500 text-sm">目前沒有文章</p>
                  ) : (
                    <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {posts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.06 }}
                          viewport={{ once: true }}
                          className="snap-start shrink-0 w-[280px]"
                        >
                          <Link href={`/education/post/${post.id}`} className="group block">
                            <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                              {post.image_url ? (
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full bg-[#080c18] flex items-center justify-center text-gray-600 text-sm">No Image</div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#37a8ff] transition">{post.title}</h3>
                                <p className="text-[11px] text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* VIDEOS — grid */}
                <div className="mb-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">影音內容</h2>
                    <Link href="/video" className="text-sm text-[#37a8ff] hover:underline">查看全部 &rarr;</Link>
                  </div>
                  {videos.length === 0 ? (
                    <p className="text-gray-500 text-sm">目前沒有影片</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {videos.slice(0, 6).map((v, idx) => (
                        <motion.a
                          key={v.id}
                          href={`https://youtu.be/${v.youtube_id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="group block"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.06 }}
                          viewport={{ once: true }}
                        >
                          <div className="relative overflow-hidden rounded-xl aspect-video">
                            <img src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)} alt={v.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <div className="w-14 h-14 rounded-full bg-[#37a8ff]/90 flex items-center justify-center shadow-[0_0_30px_rgba(55,168,255,0.4)]">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8 5 20 12 8 19"/></svg>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-sm font-semibold leading-snug line-clamp-2">{v.title}</h3>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — sticky sidebar (desktop only) */}
              <aside className="hidden lg:block w-[220px] shrink-0">
                <div className="sticky top-24 space-y-3">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">社群媒體</h3>
                  {socials.map(s => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-[#37a8ff]/30 hover:bg-[#37a8ff]/5 transition">
                      <img src={s.icon} alt={s.name} className="w-7 h-7 group-hover:scale-110 transition shrink-0" />
                      <div>
                        <div className="text-xs font-semibold group-hover:text-[#37a8ff] transition">{s.name}</div>
                        <div className="text-[10px] text-gray-500">{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </aside>

            </div>
          </div>

          {/* BOTTOM — Community section (from /community page style) */}
          <section className="relative z-10 mt-12 pb-20">
            <header className="text-center mb-12">
              <motion.h2
                className="text-4xl md:text-5xl font-extrabold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                加入 <span className="text-[#37a8ff]">NodeZ</span> 社群
              </motion.h2>
              <p className="text-gray-400 max-w-xl mx-auto mt-3">
                一鍵串連區塊鏈愛好者，獲取最快消息、活動與課程！
              </p>
            </header>
            <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-3 gap-6">
              {socials.map((s, idx) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group p-[1px] rounded-2xl bg-gradient-to-br from-[#37a8ff]/20 to-transparent hover:from-[#37a8ff]/40 transition"
                >
                  <div className="rounded-2xl h-full bg-[#080c18]/90 backdrop-blur-xl p-8 flex flex-col items-center text-center group-hover:bg-[#080c18]/70 transition">
                    <img src={s.icon} alt={s.name} className="w-14 h-14 mb-5 drop-shadow-lg group-hover:scale-110 transition" />
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#37a8ff] transition">{s.name}</h3>
                    <p className="text-sm text-gray-400">{s.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

        </div>
      </ClientWrapper>
    </>
  )
}
