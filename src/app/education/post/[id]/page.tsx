'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Post {
  id: string
  title: string
  content: string
  image: string
  createdAt: string
}

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('posts')
    if (stored) {
      const posts = JSON.parse(stored) as Post[]
      const target = posts.find((p) => p.id === id)
      if (target) setPost(target)
    }
  }, [id])

  // 🛠 修正這裡：加入正確閉合標籤
  if (!post) return <div className="text-white p-8">載入中或找不到文章</div>

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 max-w-4xl mx-auto">
      <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-4">{new Date(post.createdAt).toLocaleString()}</p>
      <div className="text-lg leading-relaxed">{post.content}</div>
    </div>
  )
}
