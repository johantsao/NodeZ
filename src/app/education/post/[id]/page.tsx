'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

interface Post {
  id: string
  title: string
  content: string
  image_url: string
  tags: string[]
  created_at: string
}

export default function PostDetailPage() {
  const { id } = useParams()
  const router  = useRouter()
  const { supabase, isAdmin, loading } = useSupabaseSession()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(()=>{
    if (!id || loading) return
    (async()=>{
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      if (!error) setPost(data)
    })()
  }, [id,loading])

  if (loading || !post) return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      載入中…
    </div>
  )

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <BackgroundCanvas particleColor="#2ea7ff55" />

        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
            <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
          </a>
          <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
            <li><a href="/" className="hover:text-[#37a8ff] transition">首頁</a></li>
            <li><a href="/content" className="hover:text-[#37a8ff] transition">NodeZ Research</a></li>
            <li><a href="/education" className="text-[#37a8ff] font-semibold">教學文章</a></li>
            <li><a href="/video" className="hover:text-[#37a8ff] transition">影音內容</a></li>
            <li><a href="/community" className="hover:text-[#37a8ff] transition">社群專區</a></li>
          </ul>
          </div>
        </nav>

        <article className="pt-32 px-6 max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6 break-words">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-4">
            {new Date(post.created_at).toLocaleString()}
          </p>

          {post.tags?.length>0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((t,i)=>(
                <span key={i} className="px-2 py-1 text-xs bg-[#37a8ff]/20 text-[#37a8ff] rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {post.image_url && (
            <img
              src={post.image_url}
              alt="封面圖片"
              className="w-full rounded-lg mb-6 bg-black"
              onError={e=>{
                (e.target as HTMLImageElement).src='/fallback.jpg'
              }}
            />
          )}

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {isAdmin && (
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={()=>router.push(`/education/edit/${post.id}`)}
                className="px-4 py-2 bg-[#37a8ff] text-black rounded hover:bg-[#1c7dc7]">
                編輯貼文
              </button>
              <button
                onClick={async()=>{
                  if (confirm('確定刪除？')) {
                    await supabase.from('posts').delete().eq('id', post.id)
                    router.push('/education')
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                刪除貼文
              </button>
            </div>
          )}
        </article>
      </div>
    </ClientWrapper>
  )
}
