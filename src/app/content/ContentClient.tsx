'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'
import Navbar from '@/components/Navbar'

interface Post { id: string; title: string; image_url: string; tags: string[]; created_at: string }
interface Video { id: string; title: string; youtube_id: string; thumb_url: string | null; tags: string[]; created_at: string }

const socials = [
  { name: 'Instagram', handle: '@node.z_', icon: '/icons/instagram.svg', desc: '追蹤每日限動 · 活動花絮', href: 'https://www.instagram.com/node.z_' },
  { name: 'Telegram', handle: 'NodeZ Group', icon: '/icons/telegram.png', desc: '搶先獲取社群公告 · 空投資訊', href: 'https://t.me/+yP-Qdy7ohLA0MzRl' },
  { name: 'LINE 社群', handle: '校園討論區', icon: '/icons/line.svg', desc: '校園同學討論區 · 問答互助', href: 'https://line.me/ti/g2/iJYYh0x-CJO2oLcCHMQOpJh1GNw--S5UtAmxDA' },
]

const revealUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.51, 0, 0.08, 1] } },
}

const revealCard = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.51, 0, 0.08, 1] } },
}

export default function ContentClient({ initialPosts, initialVideos }: { initialPosts: Post[]; initialVideos: Video[] }) {
  const { supabase, loading } = useSupabaseSession()
  const [posts] = useState<Post[]>(initialPosts)
  const [videos] = useState<Video[]>(initialVideos)

  return (
    <ClientWrapper>
      <div className="relative min-h-screen text-[#f2f2f4] overflow-x-hidden" style={{ background: '#050508' }}>
        <Navbar />

        {/* HERO */}
        <header className="pt-24 pb-4 relative z-10">
          <div className="max-w-[1240px] mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={revealUp}
              className="border-b border-white/[0.06] pb-8"
            >
              <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8a8a9a] mb-6">Research & Media</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
                NodeZ Research
              </h1>
              <p className="text-base text-[#6b6b7a] leading-relaxed max-w-xl">
                業內專業的季度報告與分析文章，影片教學與採訪企劃
              </p>
            </motion.div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="max-w-[1240px] mx-auto px-6 mt-12 relative z-10">
          {/* ARTICLES */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">最新文章</h2>
              <Link href="/education" className="text-sm text-[#3aa9f3] hover:underline">查看全部 &rarr;</Link>
            </div>
            {posts.length === 0 ? (
              <p className="text-[#555566] text-sm">目前沒有文章</p>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                {posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      ...revealCard,
                      visible: { ...revealCard.visible, transition: { ...revealCard.visible.transition, delay: idx * 0.06 } },
                    }}
                    className="snap-start shrink-0 w-[280px]"
                  >
                    <Link href={`/education/post/${post.id}`} className="group block">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] glass-card">
                        {post.image_url ? (
                          <Image src={post.image_url} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="280px" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-[#111116] flex items-center justify-center text-[#555566] text-sm">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#3aa9f3] transition">{post.title}</h3>
                          <p className="text-[11px] text-[#555566] mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* VIDEOS */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">影音內容</h2>
              <Link href="/video" className="text-sm text-[#3aa9f3] hover:underline">查看全部 &rarr;</Link>
            </div>
            {videos.length === 0 ? (
              <p className="text-[#555566] text-sm">目前沒有影片</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {videos.slice(0, 6).map((v, idx) => (
                  <motion.a
                    key={v.id}
                    href={`https://youtu.be/${v.youtube_id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="group block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      ...revealCard,
                      visible: { ...revealCard.visible, transition: { ...revealCard.visible.transition, delay: idx * 0.06 } },
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-video glass-card">
                      <Image src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)} alt={v.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="w-14 h-14 rounded-full bg-[#3aa9f3]/90 flex items-center justify-center shadow-[0_0_30px_rgba(58,169,243,0.4)]">
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

        {/* COMMUNITY SECTION */}
        <section className="relative z-10 mt-12 pb-20">
          <header className="text-center mb-12">
            <motion.h2
              className="text-4xl md:text-5xl font-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              加入 <span className="text-[#3aa9f3]">NodeZ</span> 社群
            </motion.h2>
            <p className="text-[#9a9aaa] max-w-xl mx-auto mt-3">
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
                className="group glass-card rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#3aa9f3]/30 transition-all duration-300"
              >
                <img src={s.icon} alt={s.name} className="w-14 h-14 mb-5 drop-shadow-lg group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#3aa9f3] transition">{s.name}</h3>
                <p className="text-sm text-[#9a9aaa]">{s.desc}</p>
              </motion.a>
            ))}
          </div>
        </section>

      </div>
    </ClientWrapper>
  )
}
