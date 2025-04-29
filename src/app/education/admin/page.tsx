'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  created_at: string
  tags: string[]
}

export default function AdminPostListPage() {
  const router = useRouter()
  const { supabase, isAdmin, loading } = useSupabaseSession()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (loading || !isAdmin) return
    fetchPosts()
  }, [loading, isAdmin])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, tags')
      .order('created_at', { ascending: false })
    if (error) console.error('讀取貼文失敗', error)
    else setPosts(data as Post[])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        載入中...
      </div>
    )
  }

  if (!isAdmin) {
    router.push('/education')
    return null
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <BackgroundCanvas />

        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {[{ name: '教學專區', path: '/education' }, { name: '影音專區', path: '/video' }, { name: '社群專區', path: '/community' }].map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-32 px-6 max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-8">貼文管理列表</h1>

          {posts.length === 0 ? (
            <p className="text-gray-400">目前沒有貼文</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">{post.title}</h2>
                      <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
                      {post.tags && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-[#37a8ff]/20 text-[#37a8ff] rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/education/edit/${post.id}`} className="text-blue-400 hover:underline text-sm">
                        編輯
                      </Link>
                      <Link href={`/education/post/${post.id}`} className="text-[#37a8ff] hover:underline text-sm">
                        查看
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
