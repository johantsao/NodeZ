'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

interface Post {
  id: string
  title: string
  image: string
  created_at: string
}

export default function AdminPage() {
  const { supabase, isAdmin, loading } = useSupabaseSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchPosts()
    }
  }, [loading, isAdmin])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, image, created_at')
      .order('created_at', { ascending: false })
    if (error) console.error('讀取失敗', error)
    else setPosts(data as Post[])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這篇貼文？')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      alert('刪除失敗')
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  if (loading) return <div className="text-white p-10">載入中...</div>
  if (!isAdmin) return <div className="text-white p-10">無權限</div>

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas />
        <nav className="fixed top-0 left-0 w-full flex items-center px-6 py-4 bg-black/60 backdrop-blur-xl z-50">
          <TopLogo />
          <h1 className="ml-6 text-2xl font-bold">貼文總覽</h1>
        </nav>

        <div className="pt-32 px-6 max-w-4xl mx-auto">
          <h2 className="text-xl mb-4">所有貼文 ({posts.length})</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  {post.image && (
                    <img
                      src={post.image}
                      alt="封面"
                      className="w-24 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/fallback.jpg'
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg">{post.title}</p>
                    <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() => router.push(`/education/edit/${post.id}`)}
                    >
                      編輯
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDelete(post.id)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ClientWrapper>
  )
}
