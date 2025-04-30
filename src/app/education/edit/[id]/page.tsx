'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!id || !isAdmin) return
    fetchPost()
  }, [id, isAdmin])

  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (error) {
      console.error('讀取貼文失敗', error)
      router.push('/education')
    } else {
      setTitle(data.title)
      setContent(data.content)
      setTags(data.tags || [])
      setExistingImageUrl(data.image)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('請填寫完整資訊')
      return
    }

    setUploading(true)

    try {
      let finalImageUrl = existingImageUrl

      if (croppedImage) {
        const fileName = `${uuidv4()}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('posts-images')
          .upload(`posts/${fileName}`, croppedImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg'
          })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('posts-images').getPublicUrl(`posts/${fileName}`)
        finalImageUrl = data.publicUrl
      }

      const { error } = await supabase.from('posts').update({
        title,
        content,
        tags,
        image: finalImageUrl
      }).eq('id', id)

      if (error) throw error

      router.push('/education')
    } catch (error) {
      console.error('更新貼文失敗', error)
      alert('儲存失敗，請重試')
    } finally {
      setUploading(false)
    }
  }

  if (loading || !isAdmin) return <div className="text-white p-10">載入中...</div>

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas />
        <nav className="fixed top-0 left-0 w-full flex items-center px-6 py-4 bg-black/60 backdrop-blur-xl z-50">
          <TopLogo />
        </nav>

        <div className="pt-32 px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">編輯貼文</h1>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="貼文標題"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          />

          {imagePreview ? (
            <ImageCropper image={imagePreview} onCropped={setCroppedImage} />
          ) : (
            existingImageUrl && (
              <img
                src={existingImageUrl}
                alt="封面預覽"
                className="w-full h-auto rounded mb-4 border border-white/20"
              />
            )
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
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
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
            {uploading ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>
    </ClientWrapper>
  )
}
