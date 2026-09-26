/**
 * Meetups — sichere Treffen mit netten Leuten.
 *
 * Jedes Meetup erzwingt Sicherheitsregeln über die Datenbank (RLS):
 * - Beitritt erst ab Trust-Stufe "trusted"
 * - Maximale Gruppengröße (Standard 8)
 * - Öffentlicher Ort ist Pflichtfeld
 * - Verhaltenscode muss bestätigt werden
 */
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMeetups, joinMeetup, leaveMeetup, isDemoMode, MEETUP_VIBES } from '../lib/community'
import type { Meetup } from '../lib/community'
import {
  MEETUP_CODE_OF_CONDUCT,
  SAFETY_CHECKLIST,
  tierInfo,
  meetsTier,
  OFFLINE_DISCLAIMER,
} from '../lib/trust'
import TrustBadge from '../components/safety/TrustBadge'
import SafetyBanner from '../components/safety/SafetyBanner'

const DEMO_MEETUPS: Meetup[] = [
  {
    id: 'demo-m1',
    title: 'Kaffee & Stadtgespräch für Neuankömmlinge',
    description:
      'Kein Programm, kein Smalltalk-Zwang. Wir sitzen draußen, trinken Kaffee und tauschen aus, ' +
      'was einen das erste Jahr hier überrascht hat. Wer reden mag, redet.',
    host_id: 'demo-1',
    city: 'Lissabon',
    venue_name: 'Café A Brasileira',
    venue_note: 'Außenterrasse, große Tische hinten rechts. Nicht auf der Hauptstraße.',
    starts_at: new Date(Date.now() + 86400_000 * 2).toISOString(),
    ends_at: new Date(Date.now() + 86400_000 * 2 + 5400_000).toISOString(),
    max_participants: 8,
    required_tier: 'trusted',
    vibe: ['friendly_chat', 'culture_exchange'],
    hobby_ids: [],
    safety_brief:
      'Öffentlicher Ort mit Personal. Kommt, wenn ihr da seid — niemand wartet. Wenn es euch '
      + 'nicht gefällt, geht einfach. Das ist völlig in Ordnung.',
    is_public: true,
    status: 'open',
    created_at: new Date().toISOString(),
    participant_count: 5,
    is_joined: false,
    host: {
      id: 'demo-1', email: null, full_name: 'Mara Silva', handle: 'mara', avatar_url: null,
      role: 'local', bio: null, city: 'Lissabon', country: 'Portugal', languages: ['pt', 'en', 'de'],
      has_kids: false, has_pets: true, pet_types: ['dog'],
      trust_tier: 'anchor', is_verified: true, verification_kind: 'email', is_local: true,
      karma_points: 142, last_seen_at: null, created_at: '2026-08-01T10:00:00Z',
    },
  },
  {
    id: 'demo-m2',
    title: 'Sonntags-Spaziergang am Fluss',
    description:
      'Ruhige Runde, ca. 5 km, flach, mit Hund willkommen. Wir bleiben zusammen, ' +
      'aber es gibt keinen Zwang zum Reden.',
    host_id: 'demo-3',
    city: 'Lissabon',
    venue_name: 'Praça do Comércio (Fountain)',
    venue_note: 'Warte an der grossen Fontäne. Wir kommen in Zweiergruppen.',
    starts_at: new Date(Date.now() + 86400_000 * 4).toISOString(),
    ends_at: new Date(Date.now() + 86400_000 * 4 + 7200_000).toISOString(),
    max_participants: 10,
    required_tier: 'trusted',
    vibe: ['walk', 'hobby'],
    hobby_ids: [1],
    safety_brief: 'Laufschuh an. Bei Glutealhitze machen wir Pause — wir gehen nicht weiter.',
    is_public: true,
    status: 'open',
    created_at: new Date().toISOString(),
    participant_count: 7,
    is_joined: false,
    host: {
      id: 'demo-3', email: null, full_name: 'Aiko Tanaka', handle: 'aiko', avatar_url: null,
      role: 'traveler', bio: null, city: 'Lissabon', country: 'Portugal',
      languages: ['ja', 'en', 'de'], has_kids: false, has_pets: false, pet_types: [],
      trust_tier: 'member', is_verified: false, verification_kind: null, is_local: false,
      karma_points: 12, last_seen_at: null, created_at: '2026-09-10T10:00:00Z',
    },
  },
]

export default function Meetups() {

  const { profile, trustTier, user, isDemo } = useAuth()
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showSafety, setShowSafety] = useState(false)

  const canJoin = meetsTier(trustTier, 'trusted')
  const city = profile?.city ?? undefined

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const found = await getMeetups(city)
      setMeetups(found.length > 0 ? found : DEMO_MEETUPS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Meetups konnten nicht geladen werden.')
      setMeetups(DEMO_MEETUPS)
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    void load()
  }, [load])

  const toggleJoin = async (m: Meetup) => {
    if (!user) return
    setBusyId(m.id)
    setError(null)
    try {
      if (m.is_joined) {
        await leaveMeetup(m.id, user.id)
      } else {
        await joinMeetup(m.id, user.id)
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--sun)', margin: 0 }}>
          Community
        </p>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0.35rem 0 0.4rem' }}>
          Meetups
        </h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, maxWidth: 640 }}>
          Kleine Gruppen, öffentliche Orte, klare Regeln. Zu kulturaustausch, gemeinsamen
          Hobbys oder einfach für einen Kaffee mit Leuten, die nett sind.
        </p>
      </header>

      <SafetyBanner />

      {/* Gate-Hinweis wenn die Stufe nicht reicht */}
      {!canJoin && (
        <div style={gateStyle}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🔒</div>
          <p style={{ margin: '0 0 0.3rem', color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 600 }}>
            Mitmachen ab Stufe „Vertrauensvoll"
          </p>
          <p style={{ margin: '0 0 0.6rem', color: 'var(--ink-faint)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            Deine Stufe ist <strong>{tierInfo(trustTier).label}</strong>. Das ist keine Schikane:
            wir setzen eine niedrige Hürde, damit in Gruppen keine anonymen accounts auftauchen.
            Meist fehlen nur ein paar Punkte.
          </p>
          <a href="/profile" style={ctaStyle}>Fortschritt ansehen →</a>
        </div>
      )}

      {/* Checkliste aufklappbar */}
      <div style={{ margin: '1.25rem 0' }}>
        <button onClick={() => setShowSafety((v) => !v)} style={toggleButtonStyle}>
          {showSafety ? '▾' : '▸'} Vor dem ersten Mal: {SAFETY_CHECKLIST.length} Regeln für ein sicheres Treffen
        </button>

        {showSafety && (
          <div style={{ marginTop: '0.6rem', display: 'grid', gap: '0.5rem' }}>
            {SAFETY_CHECKLIST.map((c) => (
              <div key={c.title} style={checkItemStyle}>
                <span aria-hidden="true" style={{ fontSize: '1rem' }}>{c.icon}</span>
                <div>
                  <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.8rem', fontWeight: 600 }}>{c.title}</p>
                  <p style={{ margin: '0.15rem 0 0', color: 'var(--ink-faint)', fontSize: '0.74rem', lineHeight: 1.55 }}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {isDemo && (
        <div style={demoNoteStyle}>
          <strong style={{ color: 'var(--sun)' }}>Demo-Modus.</strong> Beispiel-Meetups. Mit
          konfiguriertem Supabase werden echte angezeigt.
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>Lade Meetups…</p>
      ) : meetups.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
          <p style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.4rem' }}>
            Noch keine Meetups in {city ?? 'deiner Stadt'}
          </p>
          <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
            Das ist die schwierigste Stelle zum Starten. Sei die Person, die das erste
            Treffen organisiert — der Aufwand ist klein, der Effekt groß.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {meetups.map((m) => (
            <MeetupCard
              key={m.id}
              meetup={m}
              canJoin={canJoin}
              busy={busyId === m.id}
              onToggle={() => void toggleJoin(m)}
            />
          ))}
        </div>
      )}

      {/* Verhaltenscode */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
          Was hier gilt
        </h2>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.3rem' }}>
          {MEETUP_CODE_OF_CONDUCT.map((rule) => (
            <li key={rule} style={{ color: 'var(--ink-faint)', fontSize: '0.76rem', lineHeight: 1.55 }}>
              {rule}
            </li>
          ))}
        </ul>
        <p style={{ color: 'var(--ink-ghost)', fontSize: '0.72rem', marginTop: '0.8rem', lineHeight: 1.6 }}>
          {OFFLINE_DISCLAIMER}
        </p>
      </div>
    </div>
  )
}


/** Vibes mit Icon/Label auflösen. */
function vibeLabel(value: string): { label: string; icon: string } {
  const found = MEETUP_VIBES.find((v) => v.value === value)
  return found ? { label: found.label, icon: found.icon } : { label: value, icon: '•' }
}

function MeetupCard({
  meetup,
  canJoin,
  busy,
  onToggle,
}: {
  meetup: Meetup
  canJoin: boolean
  busy: boolean
  onToggle: () => void
}) {
  const when = new Date(meetup.starts_at)
  const count = meetup.participant_count ?? 0
  const isFull = count >= meetup.max_participants

  return (
    <article style={cardStyle}>
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
        <div style={dateBoxStyle}>
          <div style={{ color: 'var(--sun)', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
            {when.toLocaleDateString('de-DE', { weekday: 'short' }).toUpperCase()}
          </div>
          <div style={{ color: 'var(--ink)', fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.1 }}>
            {when.getDate()}
          </div>
          <div style={{ color: 'var(--ink-ghost)', fontSize: '0.55rem' }}>
            {when.toLocaleDateString('de-DE', { month: 'short' }).toUpperCase()}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: '0.6rem', marginTop: '0.3rem' }}>
            {when.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, color: 'var(--ink)', fontSize: '1rem', lineHeight: 1.35 }}>
            {meetup.title}
          </h2>

          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
            {meetup.vibe?.map((v) => {
              const info = vibeLabel(v)
              return (
                <span key={v} style={vibeChipStyle}>
                  {info.icon} {info.label}
                </span>
              )
            })}
          </div>

          <p style={{ margin: '0 0 0.4rem', color: 'var(--ink-faint)', fontSize: '0.76rem' }}>
            📍 {meetup.venue_name}
            {meetup.venue_note && <span style={{ color: 'var(--ink-ghost)' }}> — {meetup.venue_note}</span>}
          </p>

          {meetup.description && (
            <p style={{ margin: '0 0 0.6rem', color: 'var(--ink-faint)', fontSize: '0.78rem', lineHeight: 1.6 }}>
              {meetup.description}
            </p>
          )}

          {meetup.safety_brief && (
            <div style={safetyBriefStyle}>
              <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.72rem', lineHeight: 1.55 }}>
                <span style={{ color: 'var(--leaf)' }}>
                  🛡️ Hinweis von {meetup.host?.full_name ?? 'dem Gastgeber'}:
                </span>{' '}
                {meetup.safety_brief}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.7rem', flexWrap: 'wrap' }}>
            {meetup.host && (
              <span style={{ color: 'var(--ink-ghost)', fontSize: '0.7rem' }}>
                von {meetup.host.full_name} <TrustBadge tier={meetup.host.trust_tier} compact />
              </span>
            )}
            <span style={{ color: isFull ? 'var(--terracotta)' : 'var(--ink-ghost)', fontSize: '0.7rem' }}>
              {count}/{meetup.max_participants} Plätze
            </span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            {meetup.is_joined ? (
              <button onClick={onToggle} disabled={busy} style={secondaryButtonStyle}>
                {busy ? 'Wird gespeichert…' : '✓ dabei — absagen'}
              </button>
            ) : (
              <button
                onClick={onToggle}
                disabled={busy || isFull || !canJoin}
                style={primaryButtonStyle}
                title={!canJoin ? 'Du musst Stufe „Vertrauensvoll" erreichen' : undefined}
              >
                {busy
                  ? 'Wird gespeichert…'
                  : isFull
                    ? 'Ausgebucht'
                    : !canJoin
                      ? '🔒 Gesperrt bis Stufe „Vertrauensvoll"'
                      : 'Dabei sein'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// --- Styles ----------------------------------------------------------------

const cardStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 14, padding: '1rem',
}
const dateBoxStyle: React.CSSProperties = {
  background: 'var(--sun-wash)', border: '1px solid var(--sun-wash)',
  borderRadius: 10, padding: '0.5rem 0.6rem', textAlign: 'center', minWidth: 58, flexShrink: 0,
}
const vibeChipStyle: React.CSSProperties = {
  background: 'var(--line)', border: '1px solid var(--line)',
  color: 'var(--ink-soft)', borderRadius: 999, padding: '0.18rem 0.6rem', fontSize: '0.68rem',
}
const safetyBriefStyle: React.CSSProperties = {
  background: 'var(--leaf-wash)', borderLeft: '2px solid var(--leaf-wash)',
  borderRadius: '0 8px 8px 0', padding: '0.5rem 0.7rem', margin: '0 0 0.5rem',
}
const primaryButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', background: 'var(--sun)', border: 'none', borderRadius: 8,
  color: 'var(--card)', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer',
}
const secondaryButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', background: 'var(--line)',
  border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink-faint)',
  fontSize: '0.76rem', cursor: 'pointer',
}
const gateStyle: React.CSSProperties = {
  background: 'var(--sun-wash)', border: '1px solid var(--sun-wash)',
  borderRadius: 12, padding: '1.1rem', textAlign: 'center', margin: '1.25rem 0',
}
const checkItemStyle: React.CSSProperties = {
  display: 'flex', gap: '0.7rem', background: 'var(--card)',
  border: '1px solid var(--line)', borderRadius: 10, padding: '0.7rem 0.85rem',
}
const toggleButtonStyle: React.CSSProperties = {
  background: 'var(--line)', border: '1px solid var(--line)',
  color: 'var(--ink-soft)', borderRadius: 10, padding: '0.6rem 0.9rem',
  fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', width: '100%',
}
const demoNoteStyle: React.CSSProperties = {
  background: 'var(--sun-wash)', border: '1px solid var(--sun-wash)',
  borderRadius: 10, padding: '0.7rem 0.9rem', marginBottom: '1rem',
  color: 'var(--ink-faint)', fontSize: '0.75rem', lineHeight: 1.6,
}
const errorStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)', border: '1px solid var(--terracotta-wash)',
  borderRadius: 8, padding: '0.7rem 0.9rem', color: 'var(--terracotta)',
  fontSize: '0.78rem', marginBottom: '1rem',
}
const emptyStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 14, padding: '2rem 1.25rem', textAlign: 'center',
}
const ctaStyle: React.CSSProperties = {
  display: 'inline-block', marginTop: '0.5rem', padding: '0.5rem 1rem',
  background: 'var(--sun)', color: 'var(--card)', borderRadius: 8,
  fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
}
