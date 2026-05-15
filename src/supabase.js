import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error(
    '[GeneLink] VITE_SUPABASE_URL is missing or invalid. ' +
    'Make sure it is set in your Vercel environment variables and that the project was redeployed after adding it.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error(
    '[GeneLink] VITE_SUPABASE_ANON_KEY is missing or invalid. ' +
    'Make sure it is set in your Vercel environment variables and that the project was redeployed after adding it.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
