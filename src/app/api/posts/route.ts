import { NextResponse } from 'next/server'

let posts: any[] = []

export async function GET() {
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const data = await req.json()
  const newPost = {
    id: Date.now(),
    title: data.title,
    content: data.content,
    coverUrl: data.coverUrl,
  }
  posts.unshift(newPost)
  return NextResponse.json({ message: 'Post created', post: newPost })
}
