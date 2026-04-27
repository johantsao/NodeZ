'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'
import CardSkeleton from '@/components/CardSkeleton'
import { useParticleCanvas } from '@/hooks/useParticleCanvas'

interface Video {
  id: string
  title: string
  youtube_id: string
  thumb_url: string | null
  tags: string[]
  created_at: string
}

export default function VideoPage() {
  const router = useRouter()
  const { supabase, isAdmin, userEmail, loading } = useSupabaseSession()
  const canvasRef = useParticleCanvas()
  const [videos, setVideos] = useState<Video[]>([])
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortNewest, setSortNewest] = useState(true)

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setVideos((data as Video[]) ?? []))
      .catch(e => console.error('Failed to fetch videos:', e))
  }, [])

  /* 刪除 */
  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這部影片？')) return
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (!error) setVideos((v) => v.filter((x) => x.id !== id))
  }

  /* 所有 unique tags */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    videos.forEach((v) => v.tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [videos])

  /* 過濾 + 排序 */
  const filteredVideos = useMemo(() => {
    let result = activeTag
      ? videos.filter((v) => v.tags?.includes(activeTag))
      : videos
    if (!sortNewest) result = [...result].reverse()
    return result
  }, [videos, activeTag, sortNewest])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      {loading ? (
        <div className="min-h-screen text-white pt-32 px-4 md:px-12 max-w-6xl mx-auto relative z-10">
          <div className="mb-10">
            <div className="h-10 w-48 bg-white/5 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 bg-white/5 rounded animate-pulse" />
          </div>
          <CardSkeleton count={6} />
        </div>
      ) : (
      <ClientWrapper>
        <div className="relative min-h-screen text-white font-sans overflow-hidden">
          {/* NAV */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2.5">
                <img
                  src="/nodez-logo.png"
                  alt="NodeZ"
                  className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]"
                />
                <span className="font-bold text-xl tracking-tight">
                  Node<span className="text-[#37a8ff]">Z</span>
                </span>
              </Link>
              <ul className="hidden md:flex items-center gap-7 ml-auto text-sm font-medium text-gray-400">
                <li>
                  <Link href="/content" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#37a8ff]/10 border border-[#37a8ff]/25 text-[#37a8ff] font-semibold text-sm hover:bg-[#37a8ff]/20 transition">
                    NodeZ Research
                  </Link>
                </li>
                <li><Link href="/education" className="hover:text-[#37a8ff] transition">調研文章</Link></li>
                <li><Link href="/video" className="text-[#37a8ff] font-semibold">影音內容</Link></li>
              </ul>
              {userEmail && (
                <div className="text-xs text-[#37a8ff] ml-4 hidden md:flex gap-4 items-center">
                  {isAdmin ? '管理員登入中' : '一般使用者'}
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push('/auth')
                    }}
                    className="text-red-400 hover:underline"
                  >
                    登出
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* HERO */}
          <div className="pt-28 pb-4 px-4 md:px-12 max-w-6xl mx-auto relative z-10 safe-bottom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#37a8ff]/15 text-[#37a8ff] border border-[#37a8ff]/30 mb-5">
                Videos
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">影音內容</h1>
              <p className="text-gray-400 text-base max-w-lg mx-auto">
                精選影音教學與市場解析，用最直覺的方式掌握 Web3 脈動
              </p>
            </motion.div>

            {/* ADMIN NEW VIDEO */}
            {isAdmin && (
              <div className="flex justify-end mb-6">
                <Link href="/video/new">
                  <button className="px-5 py-2.5 bg-[#37a8ff] text-black font-bold rounded-lg hover:bg-[#1c7dc7] transition text-sm">
                    + 新增影片
                  </button>
                </Link>
              </div>
            )}

            {/* TAG FILTER BAR */}
            <div className="flex items-center gap-3 mb-4 overflow-x-auto hide-scrollbar pb-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  activeTag === null
                    ? 'bg-[#37a8ff] text-black border-[#37a8ff]'
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    activeTag === tag
                      ? 'bg-[#37a8ff] text-black border-[#37a8ff]'
                      : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* SORT TOGGLE */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setSortNewest((s) => !s)}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                {sortNewest ? '最新優先 ↓' : '最舊優先 ↑'}
              </button>
            </div>

            {/* VIDEO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                {filteredVideos.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center text-gray-500 py-20 text-lg"
                  >
                    {activeTag
                      ? `沒有標籤為「${activeTag}」的影片`
                      : isAdmin
                      ? '目前沒有影片，快來新增吧！'
                      : '目前沒有影片，敬請期待！'}
                  </motion.p>
                ) : (
                  filteredVideos.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="group relative rounded-xl overflow-hidden aspect-video hover:ring-2 hover:ring-[#37a8ff] transition-all duration-300"
                    >
                      <a
                        href={`https://youtu.be/${v.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        {/* THUMBNAIL */}
                        <Image
                          src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)}
                          alt={v.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                        />

                        {/* PLAY BUTTON OVERLAY */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="w-16 h-16 rounded-full bg-[#37a8ff]/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-[#37a8ff]/30">
                            <svg
                              className="w-7 h-7 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* GRADIENT OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* CONTENT OVERLAY */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          {v.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {v.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-[#37a8ff]/25 text-[#37a8ff] rounded-full backdrop-blur-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <h2 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-[#37a8ff] transition">
                            {v.title}
                          </h2>
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            {new Date(v.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </a>

                      {/* ADMIN DELETE */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDelete(v.id)
                            }}
                            className="px-3 py-1 text-xs font-medium bg-red-500/80 backdrop-blur-sm rounded-md hover:bg-red-500 transition"
                          >
                            刪除
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ClientWrapper>
      )}
    </>
  )
}
