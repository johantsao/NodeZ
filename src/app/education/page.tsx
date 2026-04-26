'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import { useParticleCanvas } from '@/hooks/useParticleCanvas'

interface Post {
  id: string
  title: string
  content: string
  image_url: string
  tags: string[]
  created_at: string
}

export default function EducationPage() {
  const router = useRouter()
  const { supabase, userEmail, isAdmin, loading } = useSupabaseSession()
  const canvasRef = useParticleCanvas()
  const [posts, setPosts] = useState<Post[]>([])
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortNewest, setSortNewest] = useState(true)

  /* 讀取貼文 */
  useEffect(() => {
    if (loading) return
    ;(async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setPosts(data as Post[])
    })()
  }, [loading])

  /* 刪除 */
  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除？')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) setPosts((p) => p.filter((x) => x.id !== id))
  }

  /* 所有 unique tags */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  /* 過濾 + 排序 */
  const filteredPosts = useMemo(() => {
    let result = activeTag
      ? posts.filter((p) => p.tags?.includes(activeTag))
      : posts
    if (!sortNewest) result = [...result].reverse()
    return result
  }, [posts, activeTag, sortNewest])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        載入中…
      </div>
    )

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]"
      />
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
                <li><Link href="/education" className="text-[#37a8ff] font-semibold">調研文章</Link></li>
                <li><Link href="/video" className="hover:text-[#37a8ff] transition">影音內容</Link></li>
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
          <div className="pt-28 pb-4 px-4 md:px-12 max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#37a8ff]/15 text-[#37a8ff] border border-[#37a8ff]/30 mb-5">
                Articles
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">調研文章</h1>
              <p className="text-gray-400 text-base max-w-lg mx-auto">
                深入淺出的區塊鏈與加密貨幣教學，從入門到進階一應俱全
              </p>
            </motion.div>

            {/* ADMIN NEW POST */}
            {isAdmin && (
              <div className="flex justify-end mb-6">
                <Link href="/education/new">
                  <button className="px-5 py-2.5 bg-[#37a8ff] text-black font-bold rounded-lg hover:bg-[#1c7dc7] transition text-sm">
                    + 新增貼文
                  </button>
                </Link>
              </div>
            )}

            {/* TAG FILTER BAR */}
            <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
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

            {/* POST GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredPosts.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center text-gray-500 py-20 text-lg"
                  >
                    {activeTag
                      ? `沒有標籤為「${activeTag}」的文章`
                      : isAdmin
                      ? '目前沒有貼文，快來新增一篇吧！'
                      : '目前沒有貼文，敬請期待！'}
                  </motion.p>
                ) : (
                  filteredPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3] hover:ring-2 hover:ring-[#37a8ff] transition-all duration-300"
                    >
                      <Link href={`/education/post/${post.id}`} className="block w-full h-full">
                        {/* IMAGE */}
                        {post.image_url ? (
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-600 text-sm">
                            無圖片
                          </div>
                        )}

                        {/* GRADIENT OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* CONTENT OVERLAY */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {post.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-[#37a8ff]/25 text-[#37a8ff] rounded-full backdrop-blur-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <h2 className="text-lg font-bold leading-snug line-clamp-2 group-hover:text-[#37a8ff] transition">
                            {post.title}
                          </h2>
                          <p className="text-[11px] text-gray-400 mt-1.5">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>

                      {/* ADMIN BUTTONS */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              router.push(`/education/edit/${post.id}`)
                            }}
                            className="px-3 py-1 text-xs font-medium bg-blue-500/80 backdrop-blur-sm rounded-md hover:bg-blue-500 transition"
                          >
                            編輯
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDelete(post.id)
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
    </>
  )
}
