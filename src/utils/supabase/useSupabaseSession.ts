'use client'

import { useEffect, useState } from 'react'
import { supabase } from './client'

export function useSupabaseSession() {
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        return
      }

      const email = session.user.email
      setUserEmail(email ?? null)  // ✅ 這裡修正了！
      setIsAdmin(
        email === 'johantsao2014@gmail.com' ||
        email === 'nodezblockchain@gmail.com'
      )
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const email = session?.user.email
      setUserEmail(email ?? null)  // ✅ 這裡也修正
      setIsAdmin(
        email === 'johantsao2014@gmail.com' ||
        email === 'nodezblockchain@gmail.com'
      )
      setLoading(false)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { supabase, userEmail, isAdmin, loading }
}
