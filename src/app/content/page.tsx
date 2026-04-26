'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'

interface Post { id: string; title: string; image_url: string; tags: string[]; created_at: string }
interface Video { id: string; title: string; youtube_id: string; thumb_url: string | null; tags: string[]; created_at: string }

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

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const mouse = { x: -999, y: -999 }
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1.5, dx: Math.random() * 0.5 - 0.25, dy: Math.random() * 0.5 - 0.25,
    }))
    let id: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#37a8ff88'
      particles.forEach(p => {
        const mdx = mouse.x - p.x, mdy = mouse.y - p.y, dist = Math.sqrt(mdx*mdx+mdy*mdy)
        if (dist < 180 && dist > 0) { p.x -= (mdx/dist) * (180-dist)/180 * 2.5; p.y -= (mdy/dist) * (180-dist)/180 * 2.5 }
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
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

          {/* HERO — minimal */}
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

          {/* ARTICLES */}
          <section className="relative z-10 max-w-[1240px] mx-auto px-6 mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">最新文章</h2>
              <Link href="/education" className="text-sm text-[#37a8ff] hover:underline">查看全部 &rarr;</Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-500 text-sm">目前沒有文章</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.slice(0, 6).map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/education/post/${post.id}`} className="group block">
                      <div className="relative overflow-hidden rounded-xl aspect-[16/10]">
                        {post.image_url ? (
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-[#080c18] flex items-center justify-center text-gray-600 text-sm">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#37a8ff] transition">{post.title}</h3>
                          <p className="text-[11px] text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* VIDEOS */}
          <section className="relative z-10 max-w-[1240px] mx-auto px-6 mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">影音內容</h2>
              <Link href="/video" className="text-sm text-[#37a8ff] hover:underline">查看全部 &rarr;</Link>
            </div>

            {videos.length === 0 ? (
              <p className="text-gray-500 text-sm">目前沒有影片</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.slice(0, 6).map((v, idx) => (
                  <motion.a
                    key={v.id}
                    href={`https://youtu.be/${v.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-video">
                      <img
                        src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)}
                        alt={v.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {/* Play icon */}
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
          </section>

          {/* COMMUNITY — minimal strip */}
          <section className="relative z-10 max-w-[1240px] mx-auto px-6 mt-20 pb-20">
            <h2 className="text-xl font-bold tracking-tight mb-8">社群</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Instagram', handle: '@node.z_', icon: '/icons/instagram.svg', href: 'https://www.instagram.com/node.z_' },
                { name: 'Telegram', handle: 'NodeZ Group', icon: '/icons/telegram.svg', href: 'https://t.me/+yP-Qdy7ohLA0MzRl' },
                { name: 'LINE', handle: '校園討論區', icon: '/icons/line.svg', href: 'https://line.me/ti/g2/iJYYh0x-CJO2oLcCHMQOpJh1GNw--S5UtAmxDA' },
              ].map((s, idx) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-white/8 hover:border-[#37a8ff]/30 bg-white/[0.02] hover:bg-[#37a8ff]/5 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <img src={s.icon} alt={s.name} className="w-8 h-8 group-hover:scale-110 transition shrink-0" />
                  <div>
                    <div className="text-sm font-semibold group-hover:text-[#37a8ff] transition">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.handle}</div>
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
