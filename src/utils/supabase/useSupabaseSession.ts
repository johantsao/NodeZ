'use client'

import { useEffect, useState } from 'react'
import { supabase } from './client'

export function useSupabaseSession() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Session Error:', error)
        setUserEmail(null)
        setIsAdmin(false)
      } else if (session) {
        const email = session.user.email
        setUserEmail(email)
        setIsAdmin(
          email === 'johantsao2014@gmail.com' || email === 'nodezblockchain@gmail.com'
        )
      } else {
        setUserEmail(null)
        setIsAdmin(false)
      }

      setLoading(false)
    }

    fetchSession()

    // 監聽登入/登出變化，立即更新
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchSession()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { supabase, userEmail, isAdmin, loading }
}
