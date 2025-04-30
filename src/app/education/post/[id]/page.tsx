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
  image: string
  tags: string[]
  created_at: string
}

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { supabase, isAdmin, loading } = useSupabaseSession()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (!id || loading) return
    fetchPost()
  }, [id, loading])

  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (error) {
      console.error('貼文讀取失敗', error)
    } else {
      setPost(data)
    }
  }

  if (loading || !post) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        載入中...
      </div>
    )
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <BackgroundCanvas />

        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {[
              { name: '教學專區', path: '/education' },
              { name: '影音專區', path: '/video' },
              { name: '社群專區', path: '/community' },
            ].map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <a href={item.path}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-32 px-6 max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-4">{new Date(post.created_at).toLocaleString()}</p>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-[#37a8ff]/20 text-[#37a8ff] rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.image && (
            <img src={post.image} alt="封面圖片" className="w-full rounded-lg mb-6" onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-cover.jpg'
            }} />
          )}

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {isAdmin && (
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => router.push(`/education/edit/${post.id}`)}
                className="px-4 py-2 bg-[#37a8ff] text-black rounded hover:bg-[#1c7dc7]"
              >
                編輯貼文
              </button>
              <button
                onClick={async () => {
                  if (confirm('確定要刪除這篇貼文？')) {
                    await supabase.from('posts').delete().eq('id', post.id)
                    router.push('/education')
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                刪除貼文
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
