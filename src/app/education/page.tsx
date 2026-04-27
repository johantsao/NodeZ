import { supabaseServer } from '@/utils/supabase/server'
import EducationClient from './EducationClient'

export const revalidate = 60 // ISR: regenerate every 60 seconds

async function getPosts() {
  const { data, error } = await supabaseServer
    .from('posts')
    .select('id, title, image_url, tags, created_at')
    .order('created_at', { ascending: false })
  if (error) { console.error('Failed to fetch posts:', error); return [] }
  return data ?? []
}

export default async function EducationPage() {
  const posts = await getPosts()
  return <EducationClient initialPosts={posts} />
}
