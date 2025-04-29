'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import ImageCropper from '@/components/ImageCropper'
import cropImage from '@/utils/cropImage'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (error) {
        console.error('載入失敗', error)
        router.replace('/education')
      } else {
        setTitle(data.title)
        setContent(data.content)
        setTags(data.tags || [])
        setImageUrl(data.image)
        setImagePreview(data.image)
      }
    }
    fetchPost()
  }, [id])

  if (loading) {
    return <div className="text-white p-10">檢查使用者權限中...</div>
  }

  if (!isAdmin) {
    router.replace('/education')
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('請填寫完整資料')
      return
    }
    setUploading(true)

    let finalImageUrl = imageUrl

    try {
      if (croppedImage) {
        const fileName = `${uuidv4()}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('posts-images')
          .upload(`posts/${fileName}`, croppedImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg',
          })
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('posts-images').getPublicUrl(`posts/${fileName}`)
        finalImageUrl = data.publicUrl
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title,
          content,
          image: finalImageUrl,
          tags,
        })
        .eq('id', id)

      if (error) throw error

      router.push('/education')
    } catch (error) {
      console.error(error)
      alert('更新失敗')
    } finally {
      setUploading(false)
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

      {imagePreview && (
        <ImageCropper image={imagePreview} onCropped={setCroppedImage} />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-white mb-4"
      />

      <input
        type="text"
        value={tags.join(',')}
        onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
        placeholder="標籤 (用逗號分隔)"
        className="w-full p-3 mb-4 rounded bg-white/10 text-white"
      />

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="bg-white text-black mb-6 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-[#37a8ff] py-3 rounded font-bold hover:bg-[#1c7dc7] transition"
      >
        {uploading ? '更新中...' : '儲存變更'}
      </button>
    </div>
  )
}
