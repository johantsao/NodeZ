'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { v4 as uuidv4 } from 'uuid'

export default function NewPostPage() {
  const router = useRouter()
  const { isAdmin } = useSupabaseSession()

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin !== null) {
      setLoading(false)
      if (isAdmin === false) {
        router.replace('/education')
      }
    }
  }, [isAdmin])

  if (loading) return <div className="text-white p-10">檢查使用者權限中...</div>

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!title || !content || !image) {
      alert('請填寫所有欄位')
      return
    }

    const newPost = {
      id: uuidv4(),
      title,
      content,
      image,
      createdAt: new Date().toISOString()
    }

    const existing = localStorage.getItem('posts')
    const posts = existing ? JSON.parse(existing) : []
    posts.push(newPost)
    localStorage.setItem('posts', JSON.stringify(posts))
    router.push('/education')
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
      {image && <img src={image} alt="preview" className="w-full h-48 object-cover rounded mb-4" />}

      <button
        onClick={handleSubmit}
        className="bg-[#37a8ff] px-6 py-2 rounded text-black font-bold hover:bg-[#1c7dc7] transition"
      >
        發佈貼文
      </button>
    </div>
  )
}
