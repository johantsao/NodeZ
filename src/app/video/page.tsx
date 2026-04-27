import { supabaseServer } from '@/utils/supabase/server'
import VideoClient from './VideoClient'

export const revalidate = 60 // ISR: regenerate every 60 seconds

async function getVideos() {
  const { data, error } = await supabaseServer
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('Failed to fetch videos:', error); return [] }
  return data ?? []
}

export default async function VideoPage() {
  const videos = await getVideos()
  return <VideoClient initialVideos={videos} />
}
