'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useSupabaseSession() {
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email || null
      setUserEmail(email)

      if (email) {
        const admins = ['johantsao2014@gmail.com', 'nodezblockchain@gmail.com']
        setIsAdmin(admins.includes(email))
      } else {
        setIsAdmin(false)
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, userEmail, isAdmin }
}
