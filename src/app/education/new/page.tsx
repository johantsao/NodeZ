'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import 'react-quill/dist/quill.snow.css'

export default function NewPostPage() {
  const router = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const [uploading, setUploading] = useState(false)

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
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !content || !croppedImage) {
      alert('請填寫完整資訊')
      return
    }

    setUploading(true)

    try {
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
      const imageUrl = data.publicUrl

      const { error } = await supabase.from('posts').insert([
        {
          title,
          content,
          image: imageUrl,
          tags
        }
      ])

      if (error) throw error

      router.push('/education')
    } catch (error) {
      console.error(error)
      alert('新增貼文失敗')
    } finally {
      setUploading(false)
    }
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

          <label className="block mb-2">貼文標題</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入貼文標題"
            className="w-full p-3 mb-6 rounded bg-white/10 text-white"
          />

          <label className="block mb-2">封面圖片</label>
          {imagePreview && <ImageCropper image={imagePreview} onCropped={setCroppedImage} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white mb-6"
          />

          <label className="block mb-2">標籤（用逗號分隔）</label>
          <input
            type="text"
            value={tags.join(',')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            placeholder="輸入標籤如：blockchain, defi, 教學"
            className="w-full p-3 mb-6 rounded bg-white/10 text-white"
          />

          <label className="block mb-2">貼文內容（支援圖文混排）</label>
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
            {uploading ? '上傳中...' : '發佈貼文'}
          </button>
        </div>
      </div>
    </ClientWrapper>
  )
}
