'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

export default function EducationPage() {
  const router = useRouter()
  const { supabase, userEmail, isAdmin, loading } = useSupabaseSession()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (loading) return
    fetchPosts()
  }, [loading])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('讀取貼文錯誤:', error)
    } else if (data) {
      setPosts(data as Post[])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這篇貼文？')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      alert('刪除失敗，請重試')
    } else {
      setPosts(posts.filter((p) => p.id !== id))
    }
  }

  if (loading) {
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
              { name: '社群專區', path: '/community' }
            ].map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
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
        </nav>

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
            {posts.length === 0 ? (
              <p className="text-gray-400">
                目前沒有貼文，{isAdmin ? '快來新增一篇吧！' : '敬請期待！'}
              </p>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-[#37a8ff] transition duration-300"
                >
                  <Link href={`/education/post/${post.id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.currentTarget.src = '/fallback.png')}
                    />
                  </Link>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[#37a8ff] transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-300 mb-2">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-[#37a8ff]/20 text-[#37a8ff] rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {isAdmin && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => router.push(`/education/edit/${post.id}`)}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-red-400 hover:underline"
                        >
                          刪除
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
