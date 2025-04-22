'use client'

import { useEffect, useState } from 'react'
import { createClient } from './client'

const ADMIN_EMAILS = ['johantsao2014@gmail.com', 'nodezblockchain@gmail.com']

export function useSupabaseSession() {
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null) // ✅ 這裡一定要是 null 起始

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setSession(session)
      const email = session?.user?.email ?? null
      setUserEmail(email)
      setIsAdmin(email !== null && ADMIN_EMAILS.includes(email)) // ✅ 明確設定 isAdmin
    }

    getSession()
  }, [])

  return { supabase, session, userEmail, isAdmin }
}
