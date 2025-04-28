'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/utils/supabase/client'  // ✅ 重點！改成直接拿 supabase
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 2,
      dx: Math.random() * 0.5 - 0.25,
      dy: Math.random() * 0.5 - 0.25,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#37a8ff88'
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      requestAnimationFrame(render)
    }

    render()
  }, [])

  const handleLogin = async () => {
    if (!email) {
      setMessage('請輸入有效的 Email')
      return
    }

    setMessage('寄送登入連結中...')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/education`
      }
    })

    if (error) {
      console.error(error)
      setMessage('登入失敗，請重試')
    } else {
      setMessage('已發送登入連結，請到信箱確認')
    }
  }

  return (
    <div className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <div className="z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">登入 NodeZ 管理後台</h1>
        <input
          type="email"
          placeholder="請輸入 Email"
          className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#37a8ff] text-black font-bold py-2 rounded hover:bg-[#1c7dc7]"
        >
          發送登入連結
        </button>
        {message && <p className="text-sm mt-4 text-center text-[#37a8ff]">{message}</p>}
      </div>
    </div>
  )
}
