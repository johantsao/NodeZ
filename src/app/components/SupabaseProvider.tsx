'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import type { Database } from '@/types'
import type { Session } from '@supabase/auth-helpers-nextjs'

export default function SupabaseProvider({
  children,
  initialSession
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
