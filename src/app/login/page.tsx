'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/education`, // ✅ 指定 redirect
      }
    })

    if (error) {
      setMessage('登入失敗：' + error.message)
    } else {
      setMessage('登入連結已寄送至信箱，請查收 ✉️')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-[#37a8ff]">NodeZ 登入</h1>
        <input
          type="email"
          placeholder="請輸入 email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-black border border-white/20 mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#37a8ff] text-black py-2 rounded font-bold hover:bg-[#1c7dc7]"
        >
          傳送登入連結
        </button>
        {message && <p className="text-sm text-white mt-4">{message}</p>}
      </form>
    </div>
  )
}
