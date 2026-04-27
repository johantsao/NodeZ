'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgexrkgwdntnhkjcufcm.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZXhya2d3ZG50bmhramN1ZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTI2MjgsImV4cCI6MjA2MDgyODYyOH0.vpcacXn06IvbfKolEPcxyKqyz_EiN-Mio1Y4izwATww'

export const supabase = createClient(supabaseUrl, supabaseKey)
