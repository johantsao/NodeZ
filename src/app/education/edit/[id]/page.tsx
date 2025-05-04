'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'

import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(async () => {
  const Quill = (await import('react-quill')).default
  const ImageUploader = (await import('quill-image-uploader')).default
  const QuillLib = await import('quill')
  if (typeof window !== 'undefined' && QuillLib?.default?.register) {
    QuillLib.default.register('modules/imageUploader', ImageUploader)
  }
  return Quill
}, { ssr: false })

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (loading || !id) return
    fetchPost()
  }, [loading, id])

  const fetchPost = async () => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (error) {
      console.error('載入貼文失敗', error)
      return
    }
    setTitle(data.title || '')
    setContent(data.content || '')
    setTags(data.tags || [])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const uploadImageToSupabase = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}` // ✅ 路徑不要帶 posts/

    const { error } = await supabase.storage.from('posts-images').upload(filePath, file)
    if (error) throw error

    const { data } = supabase.storage.from('posts-images').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleUpdate = async () => {
    if (!title || !content) {
      alert('請填寫完整資訊')
      return
    }

    setUploading(true)

    try {
      let imageUrl = undefined
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile)
      }

      const updateData: any = {
        title,
        content,
        tags
      }
      if (imageUrl) updateData.image = imageUrl

      const { error } = await supabase.from('posts').update(updateData).eq('id', id)

      if (error) throw error
      router.push('/education')
    } catch (error) {
      console.error(error)
      alert('更新貼文失敗')
    } finally {
      setUploading(false)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    imageUploader: {
      upload: uploadImageToSupabase
    }
  }

  if (loading) {
    return <div className="text-white p-10">載入中...</div>
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
            placeholder="請輸入貼文標題"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          />

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
            placeholder="輸入標籤如：blockchain, defi, 教學"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white"
          />

          <div className="mb-6">
            <label className="block mb-2">貼文內容（支援圖文混排）</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="bg-white text-black rounded"
            />
          </div>

          <button
            onClick={handleUpdate}
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
