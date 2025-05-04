'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSupabaseSession } from '@/utils/supabase/useSupabaseSession'
import ClientWrapper from '@/components/ClientWrapper'
import TopLogo from '@/components/TopLogo'
import BackgroundCanvas from '@/components/BackgroundCanvas'

interface Video {
  id: string
  title: string
  url: string
  tags: string[]
  created_at: string
}

export default function VideoPage() {
  const { supabase, userEmail, isAdmin, loading } = useSupabaseSession()
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    if (!loading) fetchVideos()
  }, [loading])

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('讀取影片失敗:', error)
    } else if (data) {
      setVideos(data as Video[])
    }
  }

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '/fallback.jpg'
  }

  return (
    <ClientWrapper>
      <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
        <BackgroundCanvas particleCount={180} blurAmount={3} particleColor="#37a8ff88" />

        <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 z-50">
          <TopLogo />
          <ul className="hidden md:flex gap-6 text-white font-medium">
            {[
              { name: '教學專區', path: '/education' },
              { name: '影音專區', path: '/video' },
              { name: '社群專區', path: '/community' }
            ].map((item) => (
              <li key={item.path} className="hover:text-[#37a8ff] transition">
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>

          {userEmail && (
            <div className="text-xs text-[#37a8ff] ml-4 hidden md:flex gap-4 items-center">
              {isAdmin ? '管理員登入中' : '一般使用者'}
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  location.href = '/auth'
                }}
                className="text-red-400 hover:underline"
              >
                登出
              </button>
            </div>
          )}
        </nav>

        <div className="pt-32 px-4 md:px-12 max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-10">影音專區</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length === 0 ? (
              <p className="text-gray-400">尚無影片，敬請期待！</p>
            ) : (
              videos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-[#37a8ff] transition duration-300"
                >
                  <img
                    src={getYouTubeThumbnail(video.url)}
                    alt={video.title}
                    className="w-full h-48 object-cover bg-black"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = '/fallback.jpg'
                    }}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[#37a8ff] transition">
                      {video.title}
                    </h2>
                    <p className="text-sm text-gray-300 mb-2">
                      {new Date(video.created_at).toLocaleString()}
                    </p>
                    {video.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-[#37a8ff]/20 text-[#37a8ff] rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
