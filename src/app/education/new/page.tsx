'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import { v4 as uuidv4 } from 'uuid'

export default function NewPostPage() {
  const router = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  if (loading) {
    return <div className="text-white p-10">檢查使用者權限中...</div>
  }

  if (!isAdmin) {
    router.replace('/education')
    return null
  }

  const handleSubmit = async () => {
    if (!title || !content || !imageFile) {
      alert('請填寫完整資訊')
      return
    }

    setUploading(true)

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('posts-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error(uploadError)
      alert('圖片上傳失敗')
      setUploading(false)
      return
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts-images/${fileName}`

    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        image: imageUrl,
      }
    ])

    if (error) {
      console.error(error)
      alert('新增貼文失敗')
    } else {
      router.push('/education')
    }
    setUploading(false)
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas />
        <nav className="fixed top-0 left-0 w-full flex items-center px-6 py-4 bg-black/60 backdrop-blur-xl z-50">
          <TopLogo />
        </nav>

        <div className="pt-32 px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">新增貼文</h1>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="貼文標題"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="貼文內容"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white h-40"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-white mb-4"
          />
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-[#37a8ff] py-3 rounded font-bold hover:bg-[#1c7dc7] transition"
          >
            {uploading ? '上傳中...' : '發佈貼文'}
          </button>
        </div>
      </div>
    </ClientWrapper>
  )
}
