'use client'

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export function useSupabaseSession() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [isAdmin, setIsAdmin] = useState(false)

  const userEmail = session?.user?.email ?? ''

  useEffect(() => {
    const adminEmails = ['johantsao2014@gmail.com', 'nodezblockchain@gmail.com']
    setIsAdmin(adminEmails.includes(userEmail))
  }, [userEmail])

  return { supabase, session, userEmail, isAdmin }
}
