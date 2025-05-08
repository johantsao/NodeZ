/* ─── src/app/layout.tsx ─────────────────────────────────────────────── */
import './globals.css'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/utils/supabase/types'

import BackgroundCanvas from '@/components/BackgroundCanvas'
import GlassOverlay     from '@/components/GlassOverlay'
import Providers        from './Providers'             // ← 你原本就有

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* ---------- Supabase 伺服端 Session（你原本就有） ---------- */
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  /* ---------- 全域樣板 ---------- */
  return (
    <html lang="zh-Hant">
      <body className={`${inter.className} bg-black text-white`}>
        {/* ★ 0. 粒子背景（最底層） */}
        <BackgroundCanvas particleColor="#37a8ff88" />

        {/* ★ 1. 朦朧玻璃遮罩（蓋在粒子上方、內容下方） */}
        <GlassOverlay blur={40} opacity={0.22} tint="#000" />

        {/* ★ 2. 全站 Provider + Page 本體；z-index 自然高於上面兩層 */}
        <Providers initialSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
