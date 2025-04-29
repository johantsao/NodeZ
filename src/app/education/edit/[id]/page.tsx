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
import ImageCropper from '@/components/ImageCropper'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams()
  const { isAdmin, loading } = useSupabaseSession()

  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!id || !isAdmin) return
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
      setTags(data.tags || [])
    }
    fetchPost()
  }, [id, isAdmin])

  if (loading) return <div className="text-white p-10">檢查使用者權限中...</div>
  if (!isAdmin) {
    router.replace('/education')
    return null
  }
  if (!post) return <div className="text-white p-10">載入中...</div>

  const handleSave = async () => {
    if (!title || !content) {
      alert('請填寫標題與內容')
      return
    }

    setUploading(true)
    let finalImageUrl = post.image

    if (croppedImage) {
      const fileExt = 'png'
      const fileName = `${uuidv4()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts-images')
        .upload(fileName, croppedImage)

      if (uploadError) {
        console.error(uploadError)
        alert('圖片上傳失敗')
        setUploading(false)
        return
      }

      finalImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts-images/${fileName}`
    }

    const { error } = await supabase.from('posts').update({
      title,
      content,
      image: finalImageUrl,
      tags,
    }).eq('id', id)

    if (error) {
      console.error(error)
      alert('更新失敗')
    } else {
      router.push('/education')
    }
    setUploading(false)
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
          <ReactQuill
            value={content}
            onChange={setContent}
            className="bg-white text-black rounded mb-4"
            modules={{
              toolbar: [['bold', 'italic', 'underline'], [{ header: [1, 2, 3, false] }], ['image', 'link'], ['clean']]
            }}
          />
          <ImageCropper onCropped={setCroppedImage} />
          <input
            type="text"
            placeholder="標籤 (以逗號分隔)"
            value={tags.join(',')}
            onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
            className="w-full p-2 rounded bg-white/10 text-white mb-6"
          />
          <button
            onClick={handleSave}
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
