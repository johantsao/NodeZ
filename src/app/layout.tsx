import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './Providers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '../utils/supabase/types'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Providers initialSession={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
