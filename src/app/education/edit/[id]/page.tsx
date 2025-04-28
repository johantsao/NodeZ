'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { isAdmin } = useSupabaseSession()

  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (isAdmin === false) router.replace('/education')
  }, [isAdmin, router])

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('讀取貼文錯誤:', error)
      } else {
        setPost(data)
        setTitle(data.title)
        setContent(data.content)
        setImageUrl(data.image_url)
      }
      setLoading(false)
    }

    fetchPost()
  }, [id, supabase])

  if (isAdmin === null) {
    return <div className="text-white p-10">檢查使用者權限中...</div>
  }

  if (loading) {
    return <div className="text-white p-10">載入中...</div>
  }

  const handleSave = async () => {
    if (!title || !content) {
      alert('請填寫所有欄位')
      return
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        image_url: imageUrl,
      })
      .eq('id', id)

    if (error) {
      console.error('更新錯誤:', error)
      alert('更新失敗')
    } else {
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
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
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
