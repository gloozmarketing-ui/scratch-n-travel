/**
 * Meetups — sichere Treffen mit netten Leuten.
 *
 * Jedes Meetup erzwingt Sicherheitsregeln über die Datenbank (RLS):
 * - Beitritt erst ab Trust-Stufe "trusted"
 * - Maximale Gruppengröße (Standard 8)
 * - Öffentlicher Ort ist Pflichtfeld
 * - Verhaltenscode muss bestätigt werden
 */
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTravel } from '../context/TravelContext'
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
import { track } from '../lib/analytics'

/**
 * SNT-512: 24h Tonight Flash-Feed
 * Spontane Treffpunkte nur für heute Abend — Einträge verfallen automatisch nach 24 Stunden.
 */
export interface TonightFlashPost {
  id: string
  title: string
  city: string
  venue: string
  venueHint?: string
  timeTonight: string
  vibe: string
  vibeIcon: string
  description: string
  authorName: string
  authorRole: 'traveler' | 'local'
  authorTier: 'anchor' | 'trusted' | 'member'
  attendeesCount: number
  isJoined?: boolean
  expiresInHours: number
}

const INITIAL_TONIGHT_POSTS: TonightFlashPost[] = [
  {
    id: 'flash-1',
    title: 'Sunset & Pastel de Nata Session',
    city: 'Lissabon',
    venue: 'Miradouro de Santa Catarina',
    venueHint: 'Auf den Stufen mit Blick auf die Tejo-Brücke',
    timeTonight: '18:45 Uhr',
    vibe: 'Sunset & Jam',
    vibeIcon: '🌅',
    description: 'Sitze mit ein paar Pastéis de Nata und Akustikgitarre da. Wer spontan Lust auf Sonnenuntergang und netten Talk hat, kommt einfach dazu!',
    authorName: 'Mara Silva',
    authorRole: 'local',
    authorTier: 'anchor',
    attendeesCount: 4,
    expiresInHours: 4,
  },
  {
    id: 'flash-2',
    title: 'Tapas & Vermut Runde im El Born',
    city: 'Barcelona',
    venue: 'Plaça de Santa Maria del Mar',
    venueHint: 'Draußen vor der Basilika an den Bänken',
    timeTonight: '20:15 Uhr',
    vibe: 'Food & Drinks',
    vibeIcon: '🍷',
    description: 'Suche nette Mitstreiter für 2–3 traditionelle Tapas-Bars im Gotischen Viertel / Born. Solo-Traveler herzlich willkommen!',
    authorName: 'Julian Weber',
    authorRole: 'traveler',
    authorTier: 'trusted',
    attendeesCount: 3,
    expiresInHours: 5,
  },
  {
    id: 'flash-3',
    title: 'Picknick am Canal Saint-Martin',
    city: 'Paris',
    venue: 'Canal Saint-Martin (Nähe Quai de Valmy)',
    venueHint: 'An der eisernen Fußgängerbrücke Passerelle',
    timeTonight: '19:15 Uhr',
    vibe: 'Picknick & Musik',
    vibeIcon: '🥖',
    description: 'Habe frisches Baguette, Käse und eine Akustik-Playlist dabei. Schauen dem Treiben am Wasser zu.',
    authorName: 'Camille Laurent',
    authorRole: 'local',
    authorTier: 'trusted',
    attendeesCount: 5,
    expiresInHours: 3,
  },
  {
    id: 'flash-4',
    title: 'Feierabend-Runde & Craft Beer',
    city: 'Berlin',
    venue: 'Mauerpark / Oderberger Straße',
    venueHint: 'Am Amphitheater-Rundbau',
    timeTonight: '19:00 Uhr',
    vibe: 'Walk & Drink',
    vibeIcon: '🍻',
    description: 'Runde durch den Park und ein Bierchen auf die Hand. Entspannter Ausklang für alle, die neu in der Stadt sind.',
    authorName: 'Felix Kraft',
    authorRole: 'local',
    authorTier: 'anchor',
    attendeesCount: 2,
    expiresInHours: 3,
  },
  {
    id: 'flash-5',
    title: 'Donaukanal Sunset Talk',
    city: 'Wien',
    venue: 'Donaukanal Promenaden-Stufen (Salztorbrücke)',
    venueHint: 'Direkt unten am Wasser auf den Sonnenstufen',
    timeTonight: '18:30 Uhr',
    vibe: 'Sunset & Talk',
    vibeIcon: '🌇',
    description: 'Kurzer spontaner Stop nach der Fahrrad-Runde. Einfach dazusetzen, quatschen und Donau-Blick genießen.',
    authorName: 'Anna Lindner',
    authorRole: 'local',
    authorTier: 'trusted',
    attendeesCount: 3,
    expiresInHours: 4,
  },
  {
    id: 'flash-6',
    title: 'Spontane Yakitori-Suche in Shinjuku',
    city: 'Tokyo',
    venue: 'Omoide Yokocho (Eingang West-Exit)',
    venueHint: 'Unter den grünen Lampions',
    timeTonight: '21:00 Uhr',
    vibe: 'Street Food',
    vibeIcon: '🍢',
    description: 'Erkunde die engen Gassen auf der Suche nach den besten gegrillten Spießen. Wer traut sich mit rein?',
    authorName: 'Kenji Sato',
    authorRole: 'local',
    authorTier: 'anchor',
    attendeesCount: 4,
    expiresInHours: 6,
  },
]

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
      karma_points: 142, certified_stops: 28, is_vip: false,
      last_seen_at: null, created_at: '2026-08-01T10:00:00Z',
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
      karma_points: 12, certified_stops: 2, is_vip: false,
      last_seen_at: null, created_at: '2026-09-10T10:00:00Z',
    },
  },
]

export default function Meetups() {
  const { profile, trustTier, user, isDemo } = useAuth()
  const { triggerHaptic } = useTravel()
  const [activeTab, setActiveTab] = useState<'tonight' | 'planned'>('tonight')
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showSafety, setShowSafety] = useState(false)
  const [showCreateTonight, setShowCreateTonight] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>('all')

  // 24h Flash feed state with localStorage persistence
  const [flashPosts, setFlashPosts] = useState<TonightFlashPost[]>(() => {
    try {
      const stored = localStorage.getItem('snt_tonight_flash_posts')
      return stored ? JSON.parse(stored) : INITIAL_TONIGHT_POSTS
    } catch {
      return INITIAL_TONIGHT_POSTS
    }
  })

  // Flash Form state
  const [newTitle, setNewTitle] = useState('')
  const [newCity, setNewCity] = useState('Lissabon')
  const [newVenue, setNewVenue] = useState('')
  const [newVenueHint, setNewVenueHint] = useState('')
  const [newTime, setNewTime] = useState('19:30')
  const [newVibe, setNewVibe] = useState('Sunset & Jam')
  const [newDesc, setNewDesc] = useState('')

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
        track('meetup_joined')
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Aktion fehlgeschlagen.')
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleJoinFlash = (id: string) => {
    triggerHaptic(20)
    setFlashPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const joined = !p.isJoined
          return {
            ...p,
            isJoined: joined,
            attendeesCount: joined ? p.attendeesCount + 1 : Math.max(0, p.attendeesCount - 1),
          }
        }
        return p
      })
      try {
        localStorage.setItem('snt_tonight_flash_posts', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const handleCreateFlash = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newVenue.trim()) return

    const newPost: TonightFlashPost = {
      id: `flash-user-${Date.now()}`,
      title: newTitle.trim(),
      city: newCity,
      venue: newVenue.trim(),
      venueHint: newVenueHint.trim() || undefined,
      timeTonight: newTime ? `${newTime} Uhr` : 'Heute Abend',
      vibe: newVibe,
      vibeIcon: newVibe.includes('Sunset') ? '🌅' : newVibe.includes('Food') ? '🍷' : newVibe.includes('Picknick') ? '🥖' : '🍻',
      description: newDesc.trim() || 'Spontanes Treffen an einem öffentlichen Ort.',
      authorName: user?.email?.split('@')[0] || profile?.full_name || 'Du (Community)',
      authorRole: 'traveler',
      authorTier: 'member',
      attendeesCount: 1,
      isJoined: true,
      expiresInHours: 24,
    }

    triggerHaptic([30, 60])
    setFlashPosts(prev => {
      const next = [newPost, ...prev]
      try {
        localStorage.setItem('snt_tonight_flash_posts', JSON.stringify(next))
      } catch {}
      return next
    })

    setNewTitle('')
    setNewVenue('')
    setNewVenueHint('')
    setNewDesc('')
    setShowCreateTonight(false)
  }

  const availableCities = useMemo(() => {
    const list = Array.from(new Set(flashPosts.map(p => p.city)))
    return ['all', ...list]
  }, [flashPosts])

  const filteredFlashPosts = useMemo(() => {
    if (selectedCity === 'all') return flashPosts
    return flashPosts.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase())
  }, [flashPosts, selectedCity])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--sun)', margin: 0 }}>
          Community Connect
        </p>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0.35rem 0 0.4rem' }}>
          Meetups & 24h Stadt-Feed
        </h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, maxWidth: 640 }}>
          Spontane Treffen heute Abend oder geplante Runden mit geprüften Locals. Öffentliche Orte,
          keine anonymen Kontakte, entspannt und sicher.
        </p>
      </header>

      {/* ── SNT-512 TAB SWITCHER ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => {
            triggerHaptic(10)
            setActiveTab('tonight')
          }}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: activeTab === 'tonight' ? '2px solid var(--sun)' : '1px solid var(--line)',
            background: activeTab === 'tonight' ? 'var(--sun-wash)' : 'var(--card)',
            color: activeTab === 'tonight' ? 'var(--ink)' : 'var(--ink-faint)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <span>🌙 Heute Abend hier ({filteredFlashPosts.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic(10)
            setActiveTab('planned')
          }}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: activeTab === 'planned' ? '2px solid var(--sun)' : '1px solid var(--line)',
            background: activeTab === 'planned' ? 'var(--sun-wash)' : 'var(--card)',
            color: activeTab === 'planned' ? 'var(--ink)' : 'var(--ink-faint)',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s',
          }}
        >
          <span>📅 Geplante Meetups ({meetups.length})</span>
        </button>
      </div>

      {activeTab === 'tonight' ? (
        /* ═══════════════════════════════════════════════════════════════════
           TAB 1: 24h TONIGHT FLASH FEED (SNT-512)
           ═══════════════════════════════════════════════════════════════════ */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {availableCities.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      triggerHaptic(10)
                      setSelectedCity(c)
                    }}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '99px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: selectedCity === c ? '1px solid var(--sun)' : '1px solid var(--line)',
                      background: selectedCity === c ? 'var(--sun)' : 'var(--card)',
                      color: selectedCity === c ? 'var(--card)' : 'var(--ink)',
                    }}
                  >
                    {c === 'all' ? '🌍 Alle Städte' : c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic(15)
                setShowCreateTonight(v => !v)
              }}
              style={primaryButtonStyle}
            >
              {showCreateTonight ? '✕ Schließen' : '➕ Für heute Abend eintragen'}
            </button>
          </div>

          {/* Formular für neuen Treffpunkt */}
          {showCreateTonight && (
            <form onSubmit={handleCreateFlash} style={{ ...cardStyle, marginBottom: '1.25rem', borderColor: 'var(--sun)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ink)' }}>
                  Spontanen Treffpunkt für heute Abend teilen (24h aktiv)
                </h3>
              </div>
              <p style={{ margin: '0 0 0.85rem', fontSize: '0.75rem', color: 'var(--ink-faint)', lineHeight: 1.5 }}>
                Nur öffentliche Plätze! Dein Eintrag ist für andere Reisende sofort sichtbar und verfällt automatisch morgen früh.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                    Titel der Runde *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Sunset & Pastel de Nata"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                    Stadt *
                  </label>
                  <select
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                  >
                    <option value="Lissabon">Lissabon (Portugal)</option>
                    <option value="Barcelona">Barcelona (Spanien)</option>
                    <option value="Paris">Paris (Frankreich)</option>
                    <option value="Berlin">Berlin (Deutschland)</option>
                    <option value="Wien">Wien (Österreich)</option>
                    <option value="Tokyo">Tokyo (Japan)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                    Öffentlicher Ort / Platz *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Miradouro de Santa Catarina"
                    value={newVenue}
                    onChange={e => setNewVenue(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                    Uhrzeit heute Abend *
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. 19:30"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                  Woran erkennt man dich vor Ort? (optional)
                </label>
                <input
                  type="text"
                  placeholder="z. B. Sitze auf den Stufen mit blauer Kappe und Gitarre"
                  value={newVenueHint}
                  onChange={e => setNewVenueHint(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                  Worum geht es kurz?
                </label>
                <textarea
                  rows={2}
                  placeholder="Beschreibe kurz die Stimmung (z. B. Ausblick genießen, Wein teilen, über Reisetipps quatschen)"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: '1px solid var(--line)', fontSize: '0.8rem', background: 'var(--card)', color: 'var(--ink)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateTonight(false)}
                  style={secondaryButtonStyle}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  style={primaryButtonStyle}
                >
                  ✓ Treffpunkt live schalten
                </button>
              </div>
            </form>
          )}

          {/* Flash Feed Cards */}
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {filteredFlashPosts.map(post => (
              <article key={post.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.25rem' }}>{post.vibeIcon}</span>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--ink)' }}>
                      {post.title}
                    </h3>
                    <span style={{ background: 'var(--paper-deep)', color: 'var(--ink)', border: '1px solid var(--line)', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: 99 }}>
                      📍 {post.city}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ background: 'var(--sun-wash)', color: 'var(--ink)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 6, whiteSpace: 'nowrap' }}>
                      ⏰ {post.timeTonight}
                    </span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#047857', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.45rem', borderRadius: 6, whiteSpace: 'nowrap' }}>
                      🟢 Noch {post.expiresInHours}h aktiv
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 0.45rem', color: 'var(--ink)', fontSize: '0.8rem', fontWeight: 600 }}>
                  📍 {post.venue}
                  {post.venueHint && (
                    <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: '0.35rem' }}>
                      ({post.venueHint})
                    </span>
                  )}
                </p>

                <p style={{ margin: '0 0 0.65rem', color: 'var(--ink-faint)', fontSize: '0.78rem', lineHeight: 1.55 }}>
                  {post.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.45rem', borderTop: '1px solid var(--line-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-ghost)' }}>
                      von {post.authorName} ({post.authorRole === 'local' ? '🏠 Local' : '🎒 Traveler'})
                    </span>
                    <TrustBadge tier={post.authorTier} compact />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-faint)' }}>
                      👥 {post.attendeesCount} {post.attendeesCount === 1 ? 'Person ist' : 'Personen sind'} dabei
                    </span>

                    <button
                      onClick={() => handleToggleJoinFlash(post.id)}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: post.isJoined ? '#10B981' : 'var(--sun-bright)',
                        color: post.isJoined ? '#FFFFFF' : '#042C2E',
                        border: '1px solid ' + (post.isJoined ? '#059669' : 'var(--sun)'),
                      }}
                    >
                      {post.isJoined ? '✓ Du bist dabei!' : 'Ich komme auch! (+1)'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════════
           TAB 2: REGULÄRE GEPLANTE MEETUPS
           ═══════════════════════════════════════════════════════════════════ */
        <div>
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
