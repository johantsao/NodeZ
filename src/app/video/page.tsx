'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import { youtubeThumbUrl } from '@/utils/youtube'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

interface Video {
  id: string; title: string; youtube_id: string; thumb_url: string | null;
  tags: string[]; created_at: string;
}

export default function VideoPage () {
  const router = useRouter()
  const { supabase, isAdmin, userEmail, loading } = useSupabaseSession()
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(()=>{
    if (loading) return
    supabase.from('videos')
      .select('*').order('created_at', { ascending:false })
      .then(({data})=> setVideos(data as Video[] ?? []))
  }, [loading])

  if (loading) return <p className="p-10 text-white">載入中…</p>

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white">
        <BackgroundCanvas />
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/nodez-logo.png" alt="NodeZ" className="w-9 h-9 drop-shadow-[0_0_10px_rgba(55,168,255,0.4)]" />
            <span className="font-bold text-xl tracking-tight">Node<span className="text-[#37a8ff]">Z</span></span>
          </Link>
          <ul className="hidden md:flex gap-7 ml-auto text-sm font-medium text-gray-400">
            <li><Link href="/" className="hover:text-[#37a8ff] transition">首頁</Link></li>
            <li><Link href="/content" className="hover:text-[#37a8ff] transition">NodeZ Research</Link></li>
            <li><Link href="/education" className="hover:text-[#37a8ff] transition">教學文章</Link></li>
            <li><Link href="/video" className="text-[#37a8ff] font-semibold">影音內容</Link></li>
            <li><Link href="/community" className="hover:text-[#37a8ff] transition">社群專區</Link></li>
          </ul>
          </div>
        </nav>

        {/* Header + 新增按鈕 */}
        <header className="pt-32 px-6 md:px-12 flex justify-between items-center">
          <h1 className="text-4xl font-bold">影音專區</h1>
          {isAdmin && (
            <Link href="/video/new" className="bg-[#37a8ff] text-black px-4 py-2 rounded
                                               hover:bg-[#1c7dc7] font-bold">
              ➕ 新增影片
            </Link>
          )}
        </header>

        {/* Card Grid */}
        <section className="px-6 md:px-12 py-12 grid gap-8
                            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.length===0 && (
            <p className="text-gray-400">
              目前沒有影片，{isAdmin?'快來新增吧！':'敬請期待！'}
            </p>
          )}

          {videos.map(v=>(
            <motion.div key={v.id}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden
                         border border-white/10 hover:border-[#37a8ff] transition">
              <Link href={`https://youtu.be/${v.youtube_id}`} target="_blank">
                <img
                  src={v.thumb_url ?? youtubeThumbUrl(v.youtube_id)}
                  alt={v.title}
                  className="w-full h-48 object-cover bg-black"
                  onError={e=>{
                    (e.target as HTMLImageElement).src='/fallback.jpg'
                  }}
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{v.title}</h2>
                <p className="text-xs text-gray-400">
                  {new Date(v.created_at).toLocaleDateString()}
                </p>
                {v.tags.length>0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {v.tags.map(t=>(
                      <span key={t} className="text-xs px-2 py-1 rounded-full
                                              bg-[#37a8ff]/20 text-[#37a8ff]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </ClientWrapper>
  )
}
