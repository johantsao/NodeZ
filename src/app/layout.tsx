// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

/* ➜ 加上這 2 行 (auth-helpers & 型別) */
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/utils/supabase/types'

import Providers from './Providers'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import GlassOverlay from '@/components/GlassOverlay'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  /* 取得 Supabase session */
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <BackgroundCanvas particleColor="#2ea7ff55" />
        <GlassOverlay />

        {/* 將 session 傳進 Providers */}
        <Providers initialSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
