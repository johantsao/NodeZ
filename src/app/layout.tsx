// src/app/layout.tsx
import './globals.css'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { cookies } from 'next/headers'

/* auth-helpers & types */
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/utils/supabase/types'

import Providers from './Providers'
import BackgroundCanvas from '@/components/BackgroundCanvas'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  weight: ['400', '500', '600', '700'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
})

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  /* Supabase session */
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="zh-Hant">
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans bg-black text-white`}>
        <BackgroundCanvas particleCount={180} blurAmount={3} particleColor="#37a8ff88" />

        {/* Pass session into Providers */}
        <Providers initialSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
