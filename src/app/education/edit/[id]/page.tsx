// ✅ 改進後的 /education/edit/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) router.replace('/education')
  }, [isAdmin, loading])

  useEffect(() => {
    if (loading) return
    const stored = localStorage.getItem('posts')
    if (stored) {
      const parsed = JSON.parse(stored)
      const target = parsed.find((p: any) => p.id === id)
      if (target) {
        setPost(target)
        setTitle(target.title)
        setContent(target.content)
        setImage(target.image)
      }
    }
  }, [id, loading])

  if (loading) return <div className="text-white p-10">檢查使用者權限中...</div>
  if (!post) return <div className="text-white p-10">載入中...</div>

  const handleSave = () => {
    const stored = localStorage.getItem('posts')
    if (stored) {
      const parsed = JSON.parse(stored)
      const updated = parsed.map((p: any) =>
        p.id === id ? { ...p, title, content, image } : p
      )
      localStorage.setItem('posts', JSON.stringify(updated))
      router.push('/education')
    }
  }

  return (
    <div className="p-10 text-white min-h-screen bg-black">
      <h1 className="text-3xl font-bold mb-6">編輯貼文</h1>
      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/20 rounded"
          placeholder="標題"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/20 rounded h-40"
          placeholder="內文"
        />
        <input
          value={image ?? ''}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/20 rounded"
          placeholder="圖片 URL"
        />
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#37a8ff] text-black font-bold rounded hover:bg-[#1c7dc7]"
        >
          儲存變更
        </button>
      </div>
    </div>
  )
}