import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export function useSupabaseSession() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    const adminEmails = ['johantsao2014@gmail.com', 'nodezblockchain@gmail.com']
    setIsAdmin(adminEmails.includes(session.user.email))
    setLoading(false)
  }, [session])

  return {
    supabase,
    session,
    userEmail: session?.user?.email || null,
    isAdmin,
    loading,
  }
}
