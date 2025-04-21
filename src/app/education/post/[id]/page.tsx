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

  if (!post) return <div className="text-white p-8">載入中
