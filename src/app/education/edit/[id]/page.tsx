'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditPostPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id || loading) return
    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (error || !data) {
        console.error('貼文讀取失敗', error)
        router.replace('/education')
      } else {
        setTitle(data.title)
        setContent(data.content)
        setTags(data.tags || [])
        setImageUrl(data.image)
      }
    }
    fetchPost()
  }, [id, loading])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
    }
  }

  const handleUpdate = async () => {
    if (!title || !content) {
      alert('請填寫完整資訊')
      return
    }
    setSubmitting(true)
    let finalImageUrl = imageUrl

    try {
      if (newImageFile) {
        const ext = newImageFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('posts-images')
          .upload(`posts/${fileName}`, newImageFile, {
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('posts-images').getPublicUrl(`posts/${fileName}`)
        finalImageUrl = data.publicUrl
      }

      const { error: updateError } = await supabase.from('posts').update({
        title,
        content,
        tags,
        image: finalImageUrl
      }).eq('id', id)

      if (updateError) throw updateError

      router.push('/education')
    } catch (err) {
      console.error(err)
      alert('更新貼文失敗')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !id) return <div className="text-white p-10">載入中...</div>

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

          {imageUrl && <img src={imageUrl} alt="預覽圖" className="w-full rounded mb-4" />}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
            disabled={submitting}
            className="w-full bg-[#37a8ff] py-3 rounded font-bold hover:bg-[#1c7dc7] transition"
          >
            {submitting ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </div>
    </ClientWrapper>
  )
}
