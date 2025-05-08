'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { supabase } from '@/utils/supabase/client'
import { getYoutubeId, youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

export default function NewVideoPage () {
  const router                   = useRouter()
  const { isAdmin, loading }     = useSupabaseSession()
  const [title, setTitle]        = useState('')
  const [ytUrl, setYtUrl]        = useState('')
  const [tags,  setTags]         = useState<string[]>([])
  const [uploading, setUploading]= useState(false)

  /* ------------ 提交 -------------- */
  const handleSubmit = useCallback(async()=>{
    const ytId = getYoutubeId(ytUrl)
    if (!title || !ytId){
      alert('請填寫標題並貼上有效的 YouTube 連結')
      return
    }
    setUploading(true)
    try {
      /* ① 若想抓官方縮圖可直接：youtubeThumbUrl(ytId)。
         ② 若要上傳自訂縮圖，可選檔案 + 上傳到 videos-thumbs bucket
            然後把 URL 塞到 thumb_url。示範用 ①： */
      const thumb = youtubeThumbUrl(ytId,'hq')

      const { error } = await supabase.from('videos').insert({
        id: uuidv4(),
        title,
        youtube_id: ytId,
        thumb_url : thumb,
        tags
      })
      if (error) throw error
      alert('新增影片成功！')
      router.push('/video')
    } catch(err){ console.error(err); alert('新增失敗') }
    finally{ setUploading(false) }
  },[title, ytUrl, tags])

  /* ------------ 權限 -------------- */
  if (loading) return <p className="p-10 text-white">檢查權限中…</p>
  if (!isAdmin){ router.replace('/video'); return null }

  /* ------------ UI -------------- */
  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas particleColor="#2ea7ff55" />
        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl
                        flex items-center px-6 py-4 z-50">
          <TopLogo/>
        </nav>

        <main className="pt-32 px-6 max-w-xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">新增影片</h1>

          <input value={title} onChange={e=>setTitle(e.target.value)}
                 placeholder="影片標題"
                 className="w-full p-3 rounded bg-white/10"/>

          <input value={ytUrl} onChange={e=>setYtUrl(e.target.value)}
                 placeholder="貼上 YouTube 連結"
                 className="w-full p-3 rounded bg-white/10"/>

          <input value={tags.join(',')}
                 onChange={e=>setTags(
                   e.target.value.split(',').map(t=>t.trim()).filter(Boolean)
                 )}
                 placeholder="標籤（逗號分隔）"
                 className="w-full p-3 rounded bg-white/10"/>

          {getYoutubeId(ytUrl) && (
            <img src={youtubeThumbUrl(getYoutubeId(ytUrl)!)} alt="預覽縮圖"
                 className="w-full rounded"/>
          )}

          <button onClick={handleSubmit} disabled={uploading}
                  className="w-full py-3 rounded bg-[#37a8ff] font-bold
                             hover:bg-[#1c7dc7] disabled:opacity-50">
            {uploading?'上傳中…':'發佈影片'}
          </button>
        </main>
      </div>
    </ClientWrapper>
  )
}
