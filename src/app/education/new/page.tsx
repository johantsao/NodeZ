'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/utils/supabase/client'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

import 'react-quill/dist/quill.snow.css'

/* ---------- 只在 Client 載入 React-Quill ---------- */
const ReactQuill = dynamic(async () => {
  const RQ             = (await import('react-quill')).default
  const ImageUploader  = (await import('quill-image-uploader')).default
  const Quill          = (await import('quill')).default as any
  if (Quill && !Quill.imports?.['modules/imageUploader']) {
    Quill.register('modules/imageUploader', ImageUploader)
  }
  return RQ
}, { ssr: false })

/* ---------- 上傳圖片到 Supabase Storage ---------- */
const uploadImageToSupabase = async (file: File) => {
  const ext      = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${ext}`
  const filePath = `posts/${fileName}`

  const { error } = await supabase
    .storage.from('posts-images')
    .upload(filePath, file, { upsert: false, contentType: file.type })

  if (error) throw error
  const { data } = supabase.storage.from('posts-images').getPublicUrl(filePath)
  return data.publicUrl                     // 直接回傳公開網址
}

export default function NewPostPage() {
  const router               = useRouter()
  const { isAdmin, loading } = useSupabaseSession()

  const [title, setTitle]         = useState('')
  const [tags, setTags]           = useState<string[]>([])
  const [content, setContent]     = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  /* ---------- Quill 模組 ---------- */
  const quillModules = {
    toolbar: [
      [{ header:[1,2,3,false] }],
      ['bold','italic','underline','strike'],
      [{ list:'ordered' }, { list:'bullet' }],
      ['link','image'],
      ['clean']
    ],
    imageUploader: { upload: uploadImageToSupabase }
  }

  /* ---------- 發佈 ---------- */
  const handleSubmit = async () => {
    if (!title || !content) { alert('請填寫標題與內容'); return }

    setUploading(true)
    try {
      let coverUrl: string | null = null
      if (coverFile) coverUrl = await uploadImageToSupabase(coverFile)

      const { error } = await supabase.from('posts').insert({
        id         : uuidv4(),
        title,
        content,
        image_url  : coverUrl,
        tags,
        created_at : new Date().toISOString()
      })

      if (error) throw error
      router.push('/education')
    } catch (err) {
      console.error(err)
      alert('新增貼文失敗')
    } finally {
      setUploading(false)
    }
  }

  /* ---------- 權限檢查 ---------- */
  if (loading) return <p className="text-white p-10">檢查權限中…</p>
  if (!isAdmin) { router.replace('/education'); return null }

  /* ---------- UI ---------- */
  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas particleColor="#2ea7ff55" />
        <nav className="fixed top-0 left-0 w-full flex items-center px-6 py-4 bg-black/60 backdrop-blur-xl z-50">
          <TopLogo />
        </nav>

        <main className="pt-32 px-6 max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">新增貼文</h1>

          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="貼文標題"
            className="w-full p-3 rounded bg-white/10"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setCoverFile(e.target.files?.[0] || null)}
            className="w-full file:cursor-pointer"
          />

          <input
            value={tags.join(',')}
            onChange={(e)=>setTags(
              e.target.value.split(',').map(t=>t.trim()).filter(Boolean)
            )}
            placeholder="標籤 (逗號分隔)"
            className="w-full p-3 rounded bg-white/10"
          />

          <div className="bg-white text-black rounded overflow-hidden">
            {typeof window === 'undefined'
              ? <p className="p-4 text-center">載入編輯器…</p>
              : <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  className="min-h-[200px]"
                />
            }
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full py-3 rounded bg-[#37a8ff] font-bold hover:bg-[#1c7dc7] disabled:opacity-50"
          >
            {uploading ? '上傳中…' : '發佈貼文'}
          </button>
        </main>
      </div>
    </ClientWrapper>
  )
}
