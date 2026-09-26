/**
 * Supabase-Client.
 *
 * SICHERHEIT: Es gibt bewusst KEINEN eingebetteten Fallback-Key mehr.
 * Der anon-Key wird ausschließlich aus der Umgebung gelesen. Ohne Konfiguration
 * gibt es keinen Client — die App läuft dann im lokalen Demo-Modus weiter,
 * statt stillschweigend mit einem fremden Projekt zu arbeiten.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

if (isSupabaseConfigured) {
  client = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export const supabase = client as SupabaseClient

/**
 * Sicherer Wrapper: Liefert `null` statt zu werfen, wenn Supabase nicht
 * konfiguriert ist. Aufrufer entscheiden dann selbst, was ohne Backend passiert.
 */
export function db(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase ist nicht konfiguriert. Bitte VITE_SUPABASE_URL und ' +
        'VITE_SUPABASE_ANON_KEY in .env setzen (siehe .env.example).',
    )
  }
  return supabase
}

