// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgexrkgwdntnhkjcufcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZXhya2d3ZG50bmhramN1ZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTI2MjgsImV4cCI6MjA2MDgyODYyOH0.vpcacXn06IvbfKolEPcxyKqyz_EiN-Mio1Y4izwATww'

export const supabase = createClient(supabaseUrl, supabaseKey)
