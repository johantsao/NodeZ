import { supabaseServer } from '@/utils/supabase/server'
import ContentClient from './ContentClient'

export const revalidate = 60 // ISR: regenerate every 60 seconds

async function getData() {
  const [postsRes, videosRes] = await Promise.all([
    supabaseServer.from('posts').select('*').order('created_at', { ascending: false }),
    supabaseServer.from('videos').select('*').order('created_at', { ascending: false }),
  ])
  return {
    posts: postsRes.data ?? [],
    videos: videosRes.data ?? [],
  }
}

export default async function ContentPage() {
  const { posts, videos } = await getData()
  return <ContentClient initialPosts={posts} initialVideos={videos} />
}
