'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ClientWrapper from '@/components/ClientWrapper'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import TopLogo from '@/components/TopLogo'

interface Post {
  id: string
  title: string
  content: string
  image: string
  createdAt: string
}

export default function EducationPage() {
  const canvasRef = useRef(null)
  const router = useRouter()
  const { supabase, userEmail, isAdmin } = useSupabaseSession()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 2,
      dx: Math.random() * 0.5 - 0.25,
      dy: Math.random() * 0.5 - 0.25
    }))

    const render = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      ctx!.fillStyle = '#37a8ff88'
      particles.forEach((p) => {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      requestAnimationFrame(render)
    }

    render()
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('posts')
    if (stored) {
      const parsed = JSON.parse(stored) as Post[]
      setPosts(parsed.reverse())
    }
  }, [])

  const handleDelete = (id: string) => {
    if (!confirm('確定刪除這篇貼文？')) return
    const updated = posts.filter((p) => p.id !== id)
    setPosts(updated)
    localStorage.setItem('posts', JSON.stringify(updated))
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />

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
              <p className="text-gray-400">目前沒有貼文，{isAdmin ? '快新增一篇吧！' : '敬請期待！'}</p>
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
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[#37a8ff] transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-300">{new Date(post.createdAt).toLocaleString()}</p>
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