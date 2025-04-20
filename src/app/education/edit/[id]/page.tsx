'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('posts')
    if (stored) {
      const parsed = JSON.parse(stored)
      const found = parsed.find((p: any) => p.id === id)
      if (!found) return router.push('/education')
      setPost(found)
      setTitle(found.title)
      setContent(found.content)
      setImage(found.image)
    }
  }, [id])

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!title || !content || !image) return alert('請填寫完整資料')
    const stored = localStorage.getItem('posts')
    const parsed = stored ? JSON.parse(stored) : []
    const updated = parsed.map((p: any) => p.id === id ? {
      ...p,
      title,
      content,
      image
    } : p)
    localStorage.setItem('posts', JSON.stringify(updated))
    router.push('/education')
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">編輯貼文</h1>
      <div className="space-y-4 max-w-xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="貼文標題"
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="貼文內容"
          rows={5}
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-white" />
        {image && <img src={image} alt="預覽圖片" className="w-full rounded mt-2" />}
        <button
          onClick={handleSave}
          className="bg-[#37a8ff] px-4 py-2 rounded text-black font-bold hover:bg-[#1c7dc7]"
        >
          💾 儲存貼文
        </button>
      </div>
    </div>
  )
}
