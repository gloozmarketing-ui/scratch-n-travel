/**
 * People — "Menschen mit den gleichen Interessen finden".
 *
 * Der Match ist erklärbar: Jede Person zeigt, WARUM sie vorgeschlagen wird.
 * Kein geheimnisvoller Score, sondern sichtbare Gründe.
 */
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { findPeopleMatches, getHobbies, getUserHobbies, isDemoMode } from '../lib/community'
import type { Hobby, PersonMatch } from '../lib/community'
import TrustBadge from '../components/safety/TrustBadge'
import ReportDialog from '../components/safety/ReportDialog'
import SafetyBanner from '../components/safety/SafetyBanner'

/** Beispieldaten für den Demo-Modus (ohne Supabase konfiguriert). */
const DEMO_PEOPLE: PersonMatch[] = [
  {
    score: 82,
    sharedHobbies: [
      { id: 1, slug: 'wandern', label_de: 'Wandern', category: 'nature', icon: '🥾' },
      { id: 10, slug: 'fotografie', label_de: 'Fotografie', category: 'creative', icon: '📷' },
    ],
    reasons: ['Gemeinsame Interessen: Wandern, Fotografie', 'Beide in Lissabon'],
    profile: {
      id: 'demo-1', email: null, full_name: 'Mara Silva', handle: 'mara', avatar_url: null,
      role: 'local',
      bio: 'Architektin, gehe jeden Sonntag mit der Kamera raus. Zeige gern die Stadt abseits der Postkarten.',
      city: 'Lissabon', country: 'Portugal', languages: ['pt', 'en', 'de'],
      has_kids: false, has_pets: true, pet_types: ['dog'],
      trust_tier: 'anchor', is_verified: true, verification_kind: 'email', is_local: true,
      karma_points: 142, last_seen_at: null, created_at: '2026-08-01T10:00:00Z',
    },
  },
  {
    score: 67,
    sharedHobbies: [{ id: 15, slug: 'gastronomie', label_de: 'Gastronomie entdecken', category: 'food', icon: '🍽️' }],
    reasons: ['Beide mögt Gastronomie entdecken', 'Ihr sprecht beide Deutsch'],
    profile: {
      id: 'demo-2', email: null, full_name: 'Jonas Weber', handle: 'jonas', avatar_url: null,
      role: 'traveler',
      bio: 'Koche gern mit Leuten, die mehr als Rezepte teilen. Hier auf 3 Wochen.',
      city: 'Lissabon', country: 'Portugal', languages: ['de', 'en'],
      has_kids: false, has_pets: false, pet_types: [],
      trust_tier: 'trusted', is_verified: false, verification_kind: null, is_local: false,
      karma_points: 58, last_seen_at: null, created_at: '2026-09-02T10:00:00Z',
    },
  },
  {
    score: 54,
    sharedHobbies: [{ id: 5, slug: 'radfahren', label_de: 'Radfahren', category: 'sport', icon: '🚴' }],
    reasons: ['Beide mögt Radfahren', 'DU wohnst vor Ort — du kannst zeigen'],
    profile: {
      id: 'demo-3', email: null, full_name: 'Aiko Tanaka', handle: 'aiko', avatar_url: null,
      role: 'traveler',
      bio: 'Radreise durch Südspanien, halte an für guten Kaffee und alte Stadtmauern.',
      city: 'Lissabon', country: 'Portugal', languages: ['ja', 'en', 'de'],
      has_kids: false, has_pets: false, pet_types: [],
      trust_tier: 'member', is_verified: false, verification_kind: null, is_local: false,
      karma_points: 12, last_seen_at: null, created_at: '2026-09-10T10:00:00Z',
    },
  },
]

export default function People() {
  const { profile, user } = useAuth()
  const [matches, setMatches] = useState<PersonMatch[]>([])
  const [myHobbies, setMyHobbies] = useState<Hobby[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportTarget, setReportTarget] = useState<PersonMatch | null>(null)

  const isDemo = isDemoMode()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!profile) {
        setMatches(DEMO_PEOPLE)
        return
      }
      const mine = await getUserHobbies(profile.id)
      setMyHobbies(mine)
      const found = await findPeopleMatches(profile, mine)
      setMatches(found.length > 0 ? found : DEMO_PEOPLE)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Personen konnten nicht geladen werden.')
      setMatches(DEMO_PEOPLE)
    } finally {
      setLoading(false)
    }
  }, [profile])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--sun)', margin: 0 }}>
          Community
        </p>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0.35rem 0 0.4rem' }}>
          Menschen mit deinen Interessen
        </h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, maxWidth: 620 }}>
          Vorgeschlagen wird nach dem, was euch wirklich verbindet: gemeinsame Hobbys, gleiche
          Stadt, gleiche Sprache, gleiche Lebenssituation. Kein Zufall, keine Werbung.
        </p>
      </header>

      {myHobbies.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--ink-ghost)', fontSize: '0.68rem', margin: '0 0 0.4rem' }}>
            DEINE INTERESSEN
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {myHobbies.map((h) => (
              <span key={h.id} style={chipStyle}>
                {h.icon} {h.label_de}
              </span>
            ))}
          </div>
          <Link to="/profile" style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', display: 'inline-block', marginTop: '0.5rem' }}>
            Interessen bearbeiten →
          </Link>
        </div>
      )}

      <div style={{ marginBottom: '1.25rem' }}>
        <SafetyBanner variant="compact" />
      </div>

      {isDemo && (
        <div style={demoNoteStyle}>
          <strong style={{ color: 'var(--sun)' }}>Demo-Modus.</strong> Diese Vorschläge sind
          Beispieldaten. Mit konfiguriertem Supabase werden echte Profile geladen.
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>Suche nach passenden Leuten…</p>
      ) : matches.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
          <p style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.4rem' }}>
            Noch keine passenden Menschen
          </p>
          <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
            Das ist normal in einer jungen Stadt. Trag dich ein, damit andere dich finden
            können — oder lerne die ersten Locals persönlich kennen.
          </p>
          <Link to="/profile" style={ctaStyle}>Interessen eintragen</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {matches.map((m) => (
            <PersonCard key={m.profile.id} match={m} myId={user?.id ?? ''} onReport={() => setReportTarget(m)} />
          ))}
        </div>
      )}

      {reportTarget && user && (
        <ReportDialog
          open={!!reportTarget}
          onClose={() => setReportTarget(null)}
          myId={user.id}
          targetId={reportTarget.profile.id}
          targetName={reportTarget.profile.full_name ?? 'Diese Person'}
          onDone={() => {
            setReportTarget(null)
            void load()
          }}
        />
      )}
    </div>
  )
}


// --- Einzelne Personenkarte -------------------------------------------------

function PersonCard({
  match,
  myId,
  onReport,
}: {
  match: PersonMatch
  myId: string
  onReport: () => void
}) {
  const p = match.profile
  const isDemoEntry = p.id.startsWith('demo-')

  return (
    <article style={cardStyle}>
      <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
        <div style={avatarStyle}>
          {p.avatar_url ? (
            <img
              src={p.avatar_url}
              alt=""
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            (p.full_name ?? '?').charAt(0).toUpperCase()
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, color: 'var(--ink)', fontSize: '1rem' }}>
              {p.full_name ?? 'Unbekannt'}
            </h2>
            <TrustBadge tier={p.trust_tier} compact />
            {p.is_local && <span style={{ color: 'var(--leaf)', fontSize: '0.68rem' }}>📍 wohnt hier</span>}
          </div>

          <p style={{ margin: '0.2rem 0 0.55rem', color: 'var(--ink-ghost)', fontSize: '0.7rem' }}>
            {p.city ?? '—'}
            {p.languages?.length > 0 && ` · ${p.languages.join(', ')}`}
            {p.has_pets && ' · 🐾 Haustiere'}
            {p.has_kids && ' · 👨‍👩‍👧 Familie'}
          </p>

          {match.reasons.length > 0 && (
            <div style={{ marginBottom: '0.6rem' }}>
              {match.reasons.map((r, i) => (
                <p key={i} style={{ margin: '0 0 0.2rem', color: 'var(--sun)', fontSize: '0.74rem' }}>
                  ✓ {r}
                </p>
              ))}
            </div>
          )}

          {p.bio && (
            <p style={{ margin: '0 0 0.7rem', color: 'var(--ink-faint)', fontSize: '0.78rem', lineHeight: 1.55 }}>
              {p.bio}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/chat?with=${p.id}`}
              style={{ ...smallButtonStyle, background: 'var(--sun)', color: 'var(--card)', fontWeight: 700 }}
            >
              Nachricht
            </Link>

            {isDemoEntry || p.id === myId ? (
              <span style={{ color: 'var(--ink-ghost)', fontSize: '0.7rem' }}>Demo-Eintrag</span>
            ) : (
              <button onClick={onReport} style={{ ...smallButtonStyle, background: 'transparent' }}>
                🛡️ Sicherheit
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--sun)' }}>{match.score}</div>
          <div style={{ color: 'var(--ink-ghost)', fontSize: '0.55rem', letterSpacing: '0.1em' }}>MATCH</div>
        </div>
      </div>
    </article>
  )
}

// --- Styles ----------------------------------------------------------------

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 14,
  padding: '1rem',
}

const chipStyle: React.CSSProperties = {
  background: 'var(--sun-wash)',
  border: '1px solid var(--sun-wash)',
  color: 'var(--sun)',
  borderRadius: 999,
  padding: '0.25rem 0.7rem',
  fontSize: '0.72rem',
}

const avatarStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--sun), var(--ink-faint))',
  color: 'var(--card)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 700,
  flexShrink: 0,
  overflow: 'hidden',
}

const smallButtonStyle: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  border: '1px solid var(--line)',
  borderRadius: 8,
  color: 'var(--ink-faint)',
  fontSize: '0.72rem',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
}

const demoNoteStyle: React.CSSProperties = {
  background: 'var(--sun-wash)',
  border: '1px solid var(--sun-wash)',
  borderRadius: 10,
  padding: '0.7rem 0.9rem',
  marginBottom: '1rem',
  color: 'var(--ink-faint)',
  fontSize: '0.75rem',
  lineHeight: 1.6,
}

const errorStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta-wash)',
  borderRadius: 8,
  padding: '0.7rem 0.9rem',
  color: 'var(--terracotta)',
  fontSize: '0.78rem',
  marginBottom: '1rem',
}

const emptyStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 14,
  padding: '2rem 1.25rem',
  textAlign: 'center',
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  background: 'var(--sun)',
  color: 'var(--card)',
  borderRadius: 8,
  fontSize: '0.78rem',
  fontWeight: 700,
  textDecoration: 'none',
}

