'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { createClient } from '@/utils/supabase/client'

interface Post {
  id: string
  title: string
  content: string
  image_url: string
  created_at: string
}

export default function EducationPage() {
  const router = useRouter()
  const { userEmail, isAdmin } = useSupabaseSession()
  const supabase = createClient()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('讀取貼文失敗:', error)
      } else if (data) {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('確定刪除這篇貼文？')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗，請稍後再試')
      return
    }

    setPosts((prev) => prev.filter((post) => post.id !== id))
    alert('刪除成功')
  }

  if (loading) {
    return (
      <div className="text-white p-10">
        <BackgroundCanvas />
        貼文載入中...
      </div>
    )
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        {/* ✅ 背景粒子動畫 */}
        <BackgroundCanvas />

        {/* ✅ 導覽列 */}
        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium relative">
            {[
              { name: '教學專區', path: '/education' },
              { name: '影音專區', path: '/video' },
              { name: '社群專區', path: '/community' }
            ].map((item) => (
              <li
                key={item.path}
                className="relative transition duration-300 hover:text-[#37a8ff] cursor-pointer"
              >
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>

          {userEmail && (
            <div className="text-xs text-[#37a8ff] ml-4 hidden md:flex gap-4 items-center">
              {isAdmin ? '管理員登入中' : '一般使用者'}
              <button
                onClick={async () => {
                  const supabase = createClient()
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

        {/* ✅ 教學內容主區 */}
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
                目前沒有貼文，{isAdmin ? '快新增一篇吧！' : '敬請期待！'}
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
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[#37a8ff] transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-300">{new Date(post.created_at).toLocaleString()}</p>
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
