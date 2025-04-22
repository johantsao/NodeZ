'use client'

import { Session } from '@supabase/auth-helpers-react'
import SupabaseProvider from '../components/SupabaseProvider'


export default function Providers({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  return (
    <SupabaseProvider initialSession={initialSession}>
      {children}
    </SupabaseProvider>
  )
}
