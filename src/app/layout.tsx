import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './Providers'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import GlassOverlay from '@/components/GlassOverlay'   // 重新 work

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <BackgroundCanvas particleColor="#2ea7ff55" />
        <GlassOverlay />     {/* 霧化層 */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
