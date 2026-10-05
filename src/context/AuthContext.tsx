/**
 * Auth-Context.
 *
 * Löst das Kernproblem: die Session muss einen Reload überleben. Supabase
 * persistiert die Session selbst; dieser Provider hält sie im React-Baum und
 * lädt das passende Profil samt Trust-Tier.
 */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

// ─── Route-Wächter (SNT-209) ────────────────────────────────────────────────

/** Routen, die ohne Session niemand sehen sollte. */
export const PROTECTED_ROUTES = ['/profile', '/passport', '/host', '/chat', '/people', '/meetups'] as const

/**
 * Wacht über geschützte Routen.
 *
 * Wichtig: Die Seiten selbst sind NICHT versteckt — sie rendern weiter, aber
 * ohne echte Daten. Der Wächter ersetzt nur den Inhalt, wenn wirklich keine
 * Session da ist und Supabase konfiguriert ist.
 *
 * Im Demo-Modus (kein Supabase konfiguriert) blockiert er **nicht**: dort gibt
 * es keine Anmeldung, und eine gesperrte Seite wäre ein toter Link. Stattdessen
 * erscheint ein Hinweis mit dem Grund — sonst waere nicht erklaerbar, warum eine
 * Seite leer bleibt.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, isDemo, isConfigured } = useAuth()
  const location = useLocation()

  const isProtected = (PROTECTED_ROUTES as readonly string[]).some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`),
  )

  if (!isProtected) return <>{children}</>
  if (loading) return <AuthGateNotice title="Wird geladen …" />

  // Ohne Backend gibt es keine Anmeldung — erklären statt blockieren.
  if (!isConfigured || isDemo) {
    return <AuthGateNotice title="Demo-Modus" detail="Ohne Supabase laeuft die App als Demo: Ansehen geht, Speichern und Teilen brauchen ein Konto." />
  }

  if (!user) {
    return (
      <AuthGateNotice
        title="Bitte anmelden"
        detail="Diese Seite gehoert zu deinem Reisepass."
        cta={{ to: '/login', label: 'Zur Anmeldung', state: { from: location.pathname } }}
      />
    )
  }

  return <>{children}</>
}

function AuthGateNotice({
  title,
  detail,
  cta,
}: {
  title: string
  detail?: string
  cta?: { to: string; label: string; state?: unknown }
}) {
  return (
    <div
      role="status"
      style={{
        minHeight: '52vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.7rem',
        padding: '2rem 1.2rem',
        textAlign: 'center',
      }}
    >
      <h1 className="font-display" style={{ margin: 0, fontSize: '1.35rem', color: 'var(--ink)' }}>
        {title}
      </h1>
      {detail && <p style={{ margin: 0, maxWidth: '34rem', color: 'var(--ink-faint)', fontSize: '0.9rem' }}>{detail}</p>}
      {cta && (
        <Link
          to={cta.to}
          state={cta.state}
          className="btn"
          style={{ marginTop: '0.4rem', display: 'inline-block' }}
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
