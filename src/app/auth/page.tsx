'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useParticleCanvas } from '@/hooks/useParticleCanvas'

export default function AuthPage() {
  const canvasRef = useParticleCanvas()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email) { setMessage('請輸入有效的 Email'); return }
    setLoading(true)
    setMessage('寄送登入連結中...')

    const redirectTo = typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : '/auth/callback'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    })

    setLoading(false)
    if (error) { console.error(error); setMessage('登入失敗，請重試') }
    else { setMessage('已發送登入連結，請到信箱確認') }
  }

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none blur-[3px]" />
      <div className="relative min-h-screen text-white overflow-hidden">

        {/* NAV — same as all pages */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
              <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
            </Link>
            <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
              <li><Link href="/content" className="hover:text-[#37a8ff] transition">NodeZ Research</Link></li>
              <li><Link href="/education" className="hover:text-[#37a8ff] transition">教學文章</Link></li>
              <li><Link href="/video" className="hover:text-[#37a8ff] transition">影音內容</Link></li>
            </ul>
          </div>
        </nav>

        {/* LOGIN FORM */}
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-8">
              <img src="/nodez-logo.png" alt="NodeZ" className="w-16 h-16 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(55,168,255,0.3)]" />
              <h1 className="text-2xl font-bold tracking-tight">管理後台登入</h1>
              <p className="text-sm text-gray-500 mt-2">NodeZ 內容管理系統</p>
            </div>
            <div className="bg-[#080c18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <input
                type="email"
                placeholder="請輸入 Email"
                className="w-full p-3.5 mb-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#37a8ff]/50 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#37a8ff] text-white font-semibold hover:bg-[#5bb8ff] disabled:opacity-50 transition-all duration-300"
              >
                {loading ? '發送中...' : '發送登入連結'}
              </button>
              {message && (
                <p className={`text-sm mt-4 text-center ${message.includes('失敗') ? 'text-red-400' : 'text-[#37a8ff]'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
