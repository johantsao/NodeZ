'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'
import BackgroundCanvas from '@/components/BackgroundCanvas'

/* ─── Types ─── */
interface Post {
  id: string
  title: string
  content: string
  image_url: string
  tags: string[]
  created_at: string
}

interface Video {
  id: string
  title: string
  youtube_id: string
  thumb_url: string | null
  tags: string[]
  created_at: string
}

/* ─── Community Data ─── */
const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/node.z_?igsh=MThvaXJlc25jNjI5bg%3D%3D&utm_source=qr',
    icon: '/icons/instagram.svg',
    desc: '追蹤每日限動 / 活動花絮',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/+yP-Qdy7ohLA0MzRl',
    icon: '/icons/telegram.svg',
    desc: '搶先獲取社群公告 / 空投資訊',
  },
  {
    name: 'LINE 社群',
    href: 'https://line.me/ti/g2/iJYYh0x-CJO2oLcCHMQOpJh1GNw--S5UtAmxDA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
    icon: '/icons/line.svg',
    desc: '校園同學討論區 / 問答互助',
  },
]

/* ─── Nav anchors (match homepage) ─── */
const navAnchors = [
  { label: '關於我們', href: '/#about' },
  { label: '服務項目', href: '/#services' },
  { label: '社群與夥伴', href: '/#channels' },
  { label: '活動', href: '/#events' },
]

export default function ContentPage() {
  const { supabase, loading } = useSupabaseSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [videos, setVideos] = useState<Video[]>([])

  /* Fetch posts + videos */
  useEffect(() => {
    if (loading) return
    ;(async () => {
      const [postsRes, videosRes] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
      ])
      if (postsRes.data) setPosts(postsRes.data as Post[])
      if (videosRes.data) setVideos(videosRes.data as Video[])
    })()
  }, [loading])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    )

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden scroll-smooth">
        <BackgroundCanvas particleCount={180} blurAmount={3} particleColor="#37a8ff88" />

        {/* ========== NAV (match homepage style) ========== */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/nodez-logo.png"
                alt="NodeZ"
                className="w-7 h-7 drop-shadow-[0_0_8px_rgba(55,168,255,0.4)]"
              />
              <span className="font-bold text-lg tracking-tight">
                Node<span className="text-[#37a8ff]">Z</span>
              </span>
            </Link>

            <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
              {navAnchors.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[#37a8ff] transition">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-[#37a8ff] font-semibold cursor-default">
                  NodeZ Research
                </span>
              </li>
            </ul>
          </div>
        </nav>

        {/* ========== HERO ========== */}
        <header className="pt-32 pb-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Node<span className="text-[#37a8ff]">Z</span> Research
          </motion.h1>
          <motion.p
            className="text-gray-400 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            深度研究 / 教學文章 / 影音內容 / 社群連結 -- 一站式區塊鏈知識庫
          </motion.p>
        </header>

        {/* ========== ARTICLES (horizontal scroll) ========== */}
        <section className="relative z-10 px-6 md:px-12 max-w-[1240px] mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            教學文章
          </h2>

          {posts.length === 0 ? (
            <p className="text-gray-500">目前沒有文章，敬請期待！</p>
          ) : (
            <div
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="snap-start shrink-0"
                  style={{ minWidth: 300, maxWidth: 340 }}
                >
                  <Link href={`/education/post/${post.id}`} className="block group">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-[#37a8ff] transition h-full">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-44 object-cover bg-black"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/fallback.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-black/50 text-sm text-gray-600">
                          No Image
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-[#37a8ff] transition line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-[#37a8ff]/20 text-[#37a8ff]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ========== VIDEOS (3-col grid) ========== */}
        <section className="relative z-10 px-6 md:px-12 max-w-[1240px] mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            影音內容
          </h2>

          {videos.length === 0 ? (
            <p className="text-gray-500">目前沒有影片，敬請期待！</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((v, idx) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <a
                    href={`https://youtu.be/${v.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-[#37a8ff] transition">
                      <img
                        src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)}
                        alt={v.title}
                        className="w-full h-48 object-cover bg-black"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/fallback.jpg'
                        }}
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-[#37a8ff] transition line-clamp-2">
                          {v.title}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(v.created_at).toLocaleDateString()}
                        </p>
                        {v.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {v.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-[#37a8ff]/20 text-[#37a8ff]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ========== COMMUNITY LINKS ========== */}
        <section className="relative z-10 px-6 md:px-12 max-w-[1240px] mx-auto mt-16 pb-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            社群連結
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {socials.map((s, idx) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                className="group block"
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-[#37a8ff] transition p-8 flex flex-col items-center text-center group-hover:bg-white/[0.08]">
                  <img
                    src={s.icon}
                    alt={s.name}
                    className="w-14 h-14 mb-5 drop-shadow-lg group-hover:scale-110 transition"
                  />
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#37a8ff] transition">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none" />
      </div>
    </ClientWrapper>
  )
}
