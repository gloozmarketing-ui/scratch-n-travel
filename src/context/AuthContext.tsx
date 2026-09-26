/**
 * Auth-Context.
 *
 * Löst das Kernproblem: die Session muss einen Reload überleben. Supabase
 * persistiert die Session selbst; dieser Provider hält sie im React-Baum und
 * lädt das passende Profil samt Trust-Tier.
 */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import { getProfile, isDemoMode } from '../lib/community'
import type { Profile } from '../lib/community'
import { totalTrustPoints, computeTrustTier } from '../lib/trust'
import type { TrustEventType } from '../lib/trust'

interface AuthValue {
  /** Supabase-Session, `null` wenn niemand angemeldet ist. */
  session: Session | null
  user: User | null
  /** Passend geladenes Profil mit Trust-Tier. */
  profile: Profile | null
  /** Trust-Punkte (Summe aller Events). */
  trustPoints: number
  loading: boolean
  /** true, wenn ohne Backend gearbeitet wird (Demo-Modus). */
  isDemo: boolean
  isConfigured: boolean
  /** Verifizierungsstufe des eingeloggten Nutzers. */
  trustTier: ReturnType<typeof computeTrustTier>
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  /** Creditet einen Trust-Event (z. B. nach einem Spot-Submit). */
  creditEvent: (type: TrustEventType) => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [trustPoints, setTrustPoints] = useState(0)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const isDemo = isDemoMode()

  // --- Session laden und bei Änderungen reagieren -------------------------
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  // --- Profil laden, sobald sich jemand anmeldet --------------------------
  const refreshProfile = useCallback(async () => {
    if (!supabase || !session?.user) {
      setProfile(null)
      setTrustPoints(0)
      return
    }

    try {
      const p = await getProfile(session.user.id)
      setProfile(p)

      // Trust-Punkte aus den Events summieren
      const { data: events } = await supabase
        .from('trust_events')
        .select('event_type')
        .eq('user_id', session.user.id)

      const types = (events ?? []).map(
        (e) => (e as { event_type: TrustEventType }).event_type,
      )
      setTrustPoints(totalTrustPoints(types))
    } catch {
      setProfile(null)
    }
  }, [session])

  useEffect(() => {
    if (session?.user) void refreshProfile()
  }, [session, refreshProfile])

  // --- Aktionen -----------------------------------------------------------

  const signInWithEmail = useCallback(async (email: string): Promise<{ ok: boolean; message: string }> => {
    if (!supabase) {
      return {
        ok: false,
        message:
          'Der Login ist noch nicht eingerichtet. Bitte VITE_SUPABASE_URL und ' +
          'VITE_SUPABASE_ANON_KEY in der .env setzen.',
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      return { ok: false, message: `Login fehlgeschlagen: ${error.message}` }
    }
    return {
      ok: true,
      message: `Check deine E-Mails — der Anmeldelink ist unterwegs zu ${email.trim()}.`,
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
    setTrustPoints(0)
  }, [])

  /**
   * Creditet einen Trust-Event. Die DB hat einen UNIQUE-Constraint, deshalb
   * ist ein zweiter Versuch ein Fehler — kein Problem, das gemeldet werden muss.
   */
  const creditEvent = useCallback(
    async (type: TrustEventType) => {
      if (!supabase || !session?.user) return
      try {
        await supabase.from('trust_events').insert({ user_id: session.user.id, event_type: type, weight: 1 })
        await refreshProfile()
      } catch {
        // Duplikat oder RLS — kein Fehler für den Nutzer
      }
    },
    [session, refreshProfile],
  )

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      trustPoints,
      loading,
      isDemo,
      isConfigured: isSupabaseConfigured,
      trustTier: computeTrustTier(trustPoints),
      signInWithEmail,
      signOut,
      refreshProfile,
      creditEvent,
    }),
    [session, profile, trustPoints, loading, isDemo, signInWithEmail, signOut, refreshProfile, creditEvent],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Zugriff auf den Auth-State. Wirft, wenn außerhalb des Provider benutzt. */
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth muss innerhalb von <AuthProvider> verwendet werden.')
  return ctx
}
