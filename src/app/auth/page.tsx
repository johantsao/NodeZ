'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      dy: Math.random() * 0.5 - 0.25
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
      setMessage('請輸入正確 Email')
      return
    }

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/education`
      }
    })

    setLoading(false)

    if (error) {
      setMessage('登入失敗，請重新嘗試')
    } else {
      setMessage('登入連結已寄出，請到信箱確認')
    }
  }

  return (
    <div className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />

      <div className="z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">登入 NodeZ 後台</h1>

        <input
          type="email"
          placeholder="請輸入 Email"
          className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#37a8ff] text-black font-bold py-2 rounded hover:bg-[#1c7dc7] transition"
        >
          {loading ? '寄送中...' : '發送登入連結'}
        </button>

        {message && (
          <p
            className={`text-sm mt-4 text-center ${
              message.includes('失敗') ? 'text-red-400' : 'text-[#37a8ff]'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
