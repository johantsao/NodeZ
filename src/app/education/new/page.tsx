'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { v4 as uuidv4 } from 'uuid'

export default function NewPostPage() {
  const router = useRouter()
  const supabase = createClient()
  const { isAdmin } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isAdmin === false) router.replace('/education')
  }, [isAdmin, router])

  if (isAdmin === null) {
    return <div className="text-white p-10">檢查使用者權限中...</div>
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!title || !content || !imageFile) {
      alert('請填寫所有欄位')
      return
    }

    try {
      setUploading(true)
      const filename = `${uuidv4()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('posts-images')
        .upload(filename, imageFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase
        .storage
        .from('posts-images')
        .getPublicUrl(filename)

      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            image_url: publicUrl,
          }
        ])

      if (insertError) throw insertError

      router.push('/education')
    } catch (error) {
      console.error('上傳或儲存失敗:', error)
      alert('上傳失敗，請重試')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">新增貼文</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="貼文標題"
        className="w-full p-3 rounded bg-white/10 text-white mb-4"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="貼文內容"
        rows={5}
        className="w-full p-3 rounded bg-white/10 text-white mb-4"
      />
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
      {imageFile && <p className="text-gray-400 mb-4">已選擇圖片：{imageFile.name}</p>}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="bg-[#37a8ff] px-6 py-2 rounded text-black font-bold hover:bg-[#1c7dc7] transition disabled:opacity-50"
      >
        {uploading ? '發佈中...' : '發佈貼文'}
      </button>
    </div>
  )
}
