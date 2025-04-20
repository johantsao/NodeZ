'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import ClientWrapper from '@/app/components/ClientWrapper'

export default function NewPostPage() {
  const canvasRef = useRef(null)
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageBase64, setImageBase64] = useState('')

  // 粒子背景動畫
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!title || !content || !imageBase64) {
      alert('請填寫所有欄位')
      return
    }
    const newPost = {
      id: uuidv4(),
      title,
      content,
      image: imageBase64,
      createdAt: new Date().toISOString()
    }

    const existing = localStorage.getItem('posts')
    const posts = existing ? JSON.parse(existing) : []
    posts.push(newPost)
    localStorage.setItem('posts', JSON.stringify(posts))
    router.push('/education')
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />

        {/* 導覽列 */}
        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <img src="/logo-icon.png" alt="NodeZ Icon" className="w-8 h-8 md:w-10 md:h-10" />
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
                <a href={item.path}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 表單區塊 */}
        <div className="pt-32 px-4 md:px-12 max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-8 text-center">新增教學貼文</h1>

          <div className="space-y-6 bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10">
            <input
              type="text"
              placeholder="貼文標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-black rounded"
            />
            <textarea
              placeholder="貼文內容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 px-4 py-2 text-black rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
            {imageBase64 && (
              <img
                src={imageBase64}
                alt="preview"
                className="w-full h-48 object-cover rounded"
              />
            )}
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-2 bg-[#37a8ff] text-black font-bold rounded hover:bg-[#1c7dc7] transition"
            >
              發佈貼文
            </button>
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
