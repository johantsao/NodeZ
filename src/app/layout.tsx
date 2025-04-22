// src/app/layout.tsx

import './globals.css'
import { Inter } from 'next/font/google'
import { metadata } from './metadata'
import SupabaseProvider from '@/components/SupabaseProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
