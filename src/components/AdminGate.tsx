'use client'

import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useSupabaseSession()
  const router = useRouter()

  useEffect(() => {
    if (isAdmin === null) return  // 還在載入中，不做事
    if (isAdmin === false) {
      router.replace('/education')  // 不是管理員就踢回 education
    }
  }, [isAdmin, router])

  if (isAdmin === null) {
    return <div className="text-white p-10">檢查使用者權限中...</div>  // 載入畫面
  }

  if (isAdmin === false) {
    return null // 已經 router.replace，但保險起見 return null
  }

  return <>{children}</>
}
