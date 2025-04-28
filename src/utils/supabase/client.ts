'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/utils/supabase/types'

export const supabase = createPagesBrowserClient<Database>()
