import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is not defined.')
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}

export const supabase = getSupabaseBrowserClient()

export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
