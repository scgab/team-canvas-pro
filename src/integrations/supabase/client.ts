import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://susniyygjqxfvisjwpun.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c25peXlnanF4ZnZpc2p3cHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM4MjMsImV4cCI6MjA2ODE4OTgyM30.8aYwOnAtfSJhqrO08_KdlVFk0mfstxEGTg1w8q-oHJk"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)