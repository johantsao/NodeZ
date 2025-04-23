'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import type { Database } from '@/utils/supabase/types'

export default function SupabaseProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: any
}) {
  const [supabase] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  )
}
