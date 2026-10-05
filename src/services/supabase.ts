/**
 * Supabase-Client.
 *
 * SICHERHEIT: Der anon-/publishable Key wird ausschließlich aus der Umgebung gelesen.
 * Unterstützt sowohl klassische JWT anon-Keys als auch neue Supabase Publishable Keys (sb_publishable_...).
 * Ohne gültige Konfiguration läuft die App sicher im Demo-Modus weiter.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const anonKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
)?.trim()

// Validierung: Supabase URL muss mit https:// oder http:// beginnen
const isValidUrl = Boolean(rawUrl && /^https?:\/\//i.test(rawUrl))

export const isSupabaseConfigured = Boolean(isValidUrl && anonKey)

let client: SupabaseClient | null = null

if (isSupabaseConfigured) {
  try {
    client = createClient(rawUrl!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch (err) {
    console.warn('Supabase konnte nicht initialisiert werden:', err)
    client = null
  }
}

export const supabase = client as SupabaseClient

/**
 * Sicherer Wrapper: Liefert Fehler nur bei erzwungenem db()-Aufruf
 */
export function db(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase ist nicht konfiguriert. Bitte VITE_SUPABASE_URL (z. B. https://xyz.supabase.co) und ' +
        'VITE_SUPABASE_ANON_KEY in .env setzen (siehe .env.example).',
    )
  }
  return supabase
}

