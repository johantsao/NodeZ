'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import { useParticleCanvas } from '@/hooks/useParticleCanvas'

interface Post {
  id: string
  title: string
  content: string
  image_url: string           // ← 修正欄位
  tags: string[]
  created_at: string
}

export default function EducationPage() {
  const router = useRouter()
  const { supabase, userEmail, isAdmin, loading } = useSupabaseSession()
  const canvasRef = useParticleCanvas()
  const [posts, setPosts] = useState<Post[]>([])

  /* 讀取貼文 */
  useEffect(() => {
    if (loading) return
    (async () => {
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
    if (!error) setPosts(p=>p.filter(x=>x.id!==id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      載入中…
    </div>
  )

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <ClientWrapper>
      <div className="relative min-h-screen text-white font-sans overflow-hidden">

        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
            <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
          </Link>
          <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
            <li><Link href="/" className="hover:text-[#37a8ff] transition">首頁</Link></li>
            <li><Link href="/content" className="hover:text-[#37a8ff] transition">NodeZ Research</Link></li>
            <li><Link href="/education" className="text-[#37a8ff] font-semibold">教學文章</Link></li>
            <li><Link href="/video" className="hover:text-[#37a8ff] transition">影音內容</Link></li>
            <li><Link href="/community" className="hover:text-[#37a8ff] transition">社群專區</Link></li>
          </ul>
          {userEmail && (
            <div className="text-xs text-[#37a8ff] ml-4 hidden md:flex gap-4 items-center">
              {isAdmin ? '管理員登入中' : '一般使用者'}
              <button
                onClick={async()=>{
                  await supabase.auth.signOut(); router.push('/auth')
                }}
                className="text-red-400 hover:underline">
                登出
              </button>
            </div>
          )}
          </div>
        </nav>

        {/* 內容 */}
        <div className="pt-32 px-4 md:px-12 max-w-6xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold">教學貼文</h1>
            {isAdmin && (
              <Link href="/education/new">
                <button className="px-4 py-2 bg-[#37a8ff] text-black font-bold rounded hover:bg-[#1c7dc7]">
                  ➕ 新增貼文
                </button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0
              ? <p className="text-gray-400">
                  目前沒有貼文，{isAdmin ? '快來新增一篇吧！' : '敬請期待！'}
                </p>
              : posts.map(post=>(
                <motion.div
                  key={post.id}
                  initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
                  transition={{ duration:0.4 }}
                  className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-[#37a8ff] transition"
                >
                  <Link href={`/education/post/${post.id}`}>
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover bg-black"
                        onError={e=>{
                          (e.target as HTMLImageElement).src='/fallback.jpg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-black text-sm text-gray-500">
                        無圖片
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[#37a8ff] transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-300 mb-2">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                    {post.tags?.length>0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.map((tag,idx)=>(
                          <span key={idx} className="px-2 py-1 text-xs bg-[#37a8ff]/20 text-[#37a8ff] rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {isAdmin && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={()=>router.push(`/education/edit/${post.id}`)}
                          className="text-sm text-blue-400 hover:underline">
                          編輯
                        </button>
                        <button
                          onClick={()=>handleDelete(post.id)}
                          className="text-sm text-red-400 hover:underline">
                          刪除
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </div>
    </ClientWrapper>
    </>
  )
}
