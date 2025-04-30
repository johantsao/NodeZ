'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import ImageCropper from '@/components/ImageCropper'
import cropImage from '@/utils/cropImage'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import dynamic from 'next/dynamic'

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
  const [uploading, setUploading] = useState(false)
  const [existingImage, setExistingImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id || loading) return
    fetchPost()
  }, [id, loading])

  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (error || !data) {
      console.error('載入貼文失敗', error)
      router.replace('/education')
      return
    }
    setTitle(data.title)
    setContent(data.content)
    setTags(data.tags || [])
    setExistingImage(data.image)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async () => {
    if (!title || !content) {
      alert('請填寫完整內容')
      return
    }

    setUploading(true)
    let imageUrl = existingImage

    try {
      if (croppedImage) {
        const fileName = `${id}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('posts-images')
          .upload(`posts/${fileName}`, croppedImage, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/jpeg'
          })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('posts-images').getPublicUrl(`posts/${fileName}`)
        imageUrl = data.publicUrl
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({ title, content, tags, image: imageUrl })
        .eq('id', id)

      if (updateError) throw updateError
      router.push('/education')
    } catch (error) {
      console.error(error)
      alert('更新貼文失敗')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="text-white p-10">檢查權限中...</div>
  }

  if (!isAdmin) {
    router.replace('/education')
    return null
  }

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
            existingImage && <img src={existingImage} className="w-full h-48 object-cover rounded mb-4" />
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
            onClick={handleUpdate}
            disabled={uploading}
            className="w-full bg-[#37a8ff] py-3 rounded font-bold hover:bg-[#1c7dc7] transition"
          >
            {uploading ? '儲存中...' : '儲存貼文'}
          </button>
        </div>
      </div>
    </ClientWrapper>
  )
}
