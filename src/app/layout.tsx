import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './Providers'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import GlassOverlay from '@/components/GlassOverlay'   // 重新 work

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  // ❶ 把 session 撈出來
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* 背景 + 霧化 */}
        <BackgroundCanvas particleColor="#2ea7ff55" />
        <GlassOverlay />

        {/* ❷ 把 session 傳進 Providers */}
        <Providers initialSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
