'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { createClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams()
  const { isAdmin } = useSupabaseSession()
  const supabase = createClient()

  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAdmin === false) {
      router.replace('/education')
    }
  }, [isAdmin])

  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (error) {
        console.error('載入貼文失敗', error)
        router.replace('/education')
        return
      }
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.image)
    }
    fetchPost()
  }, [id])

  if (isAdmin === null || !post) {
    return <div className="text-white p-10">載入中...</div>
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
    }
  }

  const handleSave = async () => {
    if (!title || !content) {
      alert('請填寫標題與內容')
      return
    }

    setIsSubmitting(true)

    let finalImageUrl = imageUrl

    try {
      if (newImageFile) {
        const fileExt = newImageFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `posts/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('posts-images')
          .upload(filePath, newImageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: newImageFile.type
          })

        if (uploadError) {
          console.error('圖片上傳失敗', uploadError)
          alert('圖片上傳失敗，請重試')
          setIsSubmitting(false)
          return
        }

        const { data } = supabase.storage.from('posts-images').getPublicUrl(filePath)
        finalImageUrl = data.publicUrl
      }

      const { error: updateError } = await supabase.from('posts')
        .update({
          title,
          content,
          image: finalImageUrl
        })
        .eq('id', id)

      if (updateError) {
        console.error('更新貼文失敗', updateError)
        alert('更新失敗，請重試')
        setIsSubmitting(false)
        return
      }

      router.push('/education')
    } catch (error) {
      console.error('提交失敗', error)
      alert('儲存失敗，請重試')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">編輯貼文</h1>

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
      {imageUrl && !newImageFile && (
        <img src={imageUrl} alt="原本圖片" className="w-full h-48 object-cover rounded mb-4" />
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {newImageFile && (
        <p className="text-sm text-gray-400 mb-4">
          已選擇新圖片：{newImageFile.name}
        </p>
      )}

      <button
        onClick={handleSave}
        className="bg-[#37a8ff] px-6 py-2 rounded text-black font-bold hover:bg-[#1c7dc7] transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? '儲存中...' : '儲存變更'}
      </button>
    </div>
  )
}
