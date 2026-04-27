'use server'

import { revalidatePath } from 'next/cache'

/** Revalidate all content-related pages so new/edited posts appear immediately */
export async function revalidateContent(postId?: string) {
  revalidatePath('/education', 'page')
  revalidatePath('/content', 'page')
  revalidatePath('/video', 'page')
  if (postId) revalidatePath(`/education/post/${postId}`, 'page')
}
