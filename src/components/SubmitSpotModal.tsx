import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { useAuth } from '../context/AuthContext'
import { track } from '../lib/analytics'
import { submitSpot } from '../lib/community'
import { isSupabaseConfigured } from '../services/supabase'

interface SubmitSpotModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (spot: any) => void
}

/** Kategorie-Werte wie in supabase/schema.sql dokumentiert (nature | food | view | culture | activity). */
const SPOT_CATEGORIES = [
  { value: 'nature', label: 'Natur & Landschaft' },
  { value: 'food', label: 'Essen & Trinken' },
  { value: 'view', label: 'Aussichtspunkt' },
  { value: 'culture', label: 'Kultur & Geschichte' },
  { value: 'activity', label: 'Aktivität & Abenteuer' },
]

/**
 * SNT-304 — Rate-Limit: max. 5 Einreichungen pro Person pro Tag.
 * Dieser Client-Zähler ist nur Härtung gegen Doppelklicks; verbindlich erzwingt
 * das Limit der Trigger `spot_daily_limit` in supabase/schema.sql.
 */
const RATE_LIMIT_PER_DAY = 5
const RATE_LIMIT_KEY = 'snt.spot_submissions'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function submissionsToday(): number {
  try {
    const days = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) ?? '{}') as Record<string, number>
    return days[todayKey()] ?? 0
  } catch {
    return 0
  }
}

function recordSubmission(): void {
  try {
    const days = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) ?? '{}') as Record<string, number>
    days[todayKey()] = (days[todayKey()] ?? 0) + 1
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(days))
  } catch {
    // Kein Speicher verfügbar (Private Browsing) — das serverseitige Limit greift trotzdem.
  }
}

/** „38.798, -9.390“ — genau zwei Dezimalgrade, Trennzeichen Komma/Semikolon/Schrägstrich/Leerzeichen. */
function parseGps(raw: string): { lat: number; lng: number } | null {
  const m = raw
    .trim()
    .replace(/°/g, '')
    .match(/^(-?\d+(?:[.,]\d+)?)\s*(?:[,;/]|\s+)\s*(-?\d+(?:[.,]\d+)?)$/)
  if (!m) return null
  const lat = parseFloat(m[1].replace(',', '.'))
  const lng = parseFloat(m[2].replace(',', '.'))
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return { lat, lng }
}

export default function SubmitSpotModal({ isOpen, onClose, onSuccess }: SubmitSpotModalProps) {
  const { triggerHaptic } = useTravel()
  const { user, creditEvent } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  /** Wurde der Spot tatsächlich gespeichert (echter Insert) oder nur im Demo-Pfad angezeigt? */
  const [resultMode, setResultMode] = useState<'saved' | 'demo'>('saved')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    location: '',
    category: 'nature',
    difficulty: 2,
    dogFriendly: true,
    dogNotes: '',
    strollerFriendly: false,
    strollerNotes: '',
    familyFriendly: true,
    insiderStory: '',
    gps: '',
    imageUrl: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // ── SNT-302: Pflichtfeld-Validierung inkl. Koordinaten ─────────────────
    const gps = parseGps(form.gps)
    if (!gps) {
      setError('Bitte gib die Koordinaten als „Breitengrad, Längengrad“ an — z. B. 38.798, -9.390.')
      return
    }
    if (form.insiderStory.trim().length < 20) {
      setError('Der Insider-Tipp braucht mindestens 20 Zeichen — beschreibe, worauf man achten muss.')
      return
    }
    if (!/^https?:\/\/\S+$/i.test(form.imageUrl.trim())) {
      setError('Bitte gib eine Foto-URL an, die mit http:// oder https:// beginnt.')
      return
    }
    if (submissionsToday() >= RATE_LIMIT_PER_DAY) {
      setError(`Tageslimit erreicht: höchstens ${RATE_LIMIT_PER_DAY} Einreichungen pro Tag. Komm morgen wieder.`)
      return
    }

    // ── SNT-301: persistenter Insert mit created_by ────────────────────────
    setSubmitting(true)
    try {
      if (isSupabaseConfigured) {
        if (!user) {
          setError('Ohne Anmeldung können wir deinen Spot nicht zuordnen. Bitte melde dich zuerst an.')
          setSubmitting(false)
          return
        }
        await submitSpot(user.id, {
          title: form.title,
          city: form.location,
          category: form.category,
          description: form.insiderStory,
          latitude: gps.lat,
          longitude: gps.lng,
          imageUrl: form.imageUrl.trim(),
          safetyNote:
            [form.dogNotes, form.strollerNotes].map(s => s.trim()).filter(Boolean).join(' · ') || undefined,
          isDogFriendly: form.dogFriendly,
          isFamilyFriendly: form.familyFriendly,
          isStrollerFriendly: form.strollerFriendly,
        })
        // Trust-Event wird nachgereicht — der Insert ist bereits gelungen.
        void creditEvent('spot_submitted')
        setResultMode('saved')
        onSuccess?.(form)
      } else {
        // Demo-Modus: ehrlich nur anzeigen, nichts vortäuschen.
        setResultMode('demo')
        onSuccess?.(form)
      }
      track('spot_submitted')
      recordSubmission()
      triggerHaptic([20, 50, 80])
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Einreichung fehlgeschlagen. Bitte versuche es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  const difficultyLabels = [
    { level: 1, label: '1 - Sehr leicht', desc: 'Ebener Spazierweg, für jeden machbar' },
    { level: 2, label: '2 - Leicht', desc: 'Geringe Steigung, feste Wege' },
    { level: 3, label: '3 - Moderat', desc: 'Feste Wanderschuhe, einige Höhenmeter' },
    { level: 4, label: '4 - Anspruchsvoll', desc: 'Steil, Geröll, gute Trittsicherheit nötig' },
    { level: 5, label: '5 - Alpin / Extrem', desc: 'Ausgesetzte Passagen, Kletterkönnen' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="card w-full max-w-xl p-6 relative my-8 border-sun shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <span className="text-5xl block mb-3">{resultMode === 'saved' ? '✅' : '🪙'}</span>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">
              {resultMode === 'saved' ? 'Secret Spot gespeichert!' : 'Spot nur zur Anschauung eingereicht'}
            </h3>
            <p className="font-body text-sm text-ink-faint max-w-md mx-auto mb-4">
              {resultMode === 'saved'
                ? 'Dein Spot liegt jetzt als „unverified“ in der Datenbank und wird freigeschaltet, sobald 3 andere Community-Mitglieder ihn bestätigen.'
                : 'Demo-Modus: Dein Spot wurde nur in dieser Sitzung angezeigt — ohne Supabase-Backend wird nichts gespeichert, nach dem Reload ist er weg.'}
            </p>
            <div className="inline-block bg-emerald-500/20 text-leaf font-mono text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              {resultMode === 'saved'
                ? 'Herkunft: local_submitted · Trust-Event „Spot eingereicht“ gewertet ✓'
                : 'Kein Trust-Event, kein Eintrag — echte Einreichungen brauchen eine Anmeldung'}
            </div>
            <button
              onClick={() => {
                setSubmitted(false)
                onClose()
              }}
              className="btn btn-primary w-full text-xs py-2.5"
            >
              Fertig
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="font-mono text-[0.6rem] text-sun uppercase tracking-widest block font-bold">
                Community Explorer Einreichung (+150 XP)
              </span>
              <h3 className="font-display text-ink text-xl font-bold">
                Neuen Secret Spot oder Route einstellen
              </h3>
              <p className="font-body text-ink-faint text-xs">
                Teile verifizierte Geheimtipps und hilf anderen, passende Routen für Hunde & Kinderwagen zu finden.
              </p>
            </div>

            {/* MODUS-HINWEISE: nie behaupten, etwas sei gespeichert, wenn es das nicht ist */}
            {!isSupabaseConfigured && (
              <div className="bg-paper-deep border border-sun rounded-lg px-3 py-2 font-mono text-[0.66rem] text-sun leading-relaxed">
                ⚠️ Demo-Modus: Einreichungen werden nur in dieser Sitzung angezeigt und nicht gespeichert.
              </div>
            )}
            {isSupabaseConfigured && !user && (
              <div className="bg-paper-deep border border-sun rounded-lg px-3 py-2 font-mono text-[0.66rem] text-sun leading-relaxed">
                🔒 Zum Speichern musst du angemeldet sein —{' '}
                <Link to="/login" className="underline font-bold" onClick={onClose}>
                  jetzt anmelden
                </Link>
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="bg-red-950/60 border border-red-500/60 rounded-lg px-3 py-2 font-mono text-[0.68rem] text-red-300 leading-relaxed"
              >
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                  Name des Spots / der Tour
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="z. B. Geheime Klippenbucht"
                  className="field"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                  Ort / Region
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="z. B. Sintra, Portugal"
                  className="field"
                  required
                />
              </div>
            </div>

            {/* KATEGORIE & FOTO (SNT-302: Pflichtfelder) */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                  Kategorie *
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="field"
                  required
                >
                  {SPOT_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                  Foto-URL (Pflicht) *
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://…"
                  className="field"
                  required
                />
              </div>
            </div>

            {/* KOORDINATEN (SNT-302: Pflicht + Validierung) */}
            <div>
              <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                Koordinaten (Breitengrad, Längengrad) *
              </label>
              <input
                type="text"
                value={form.gps}
                onChange={e => setForm({ ...form, gps: e.target.value })}
                placeholder="z. B. 38.798, -9.390"
                className="field"
                required
              />
              <p className="font-mono text-[0.58rem] text-ink-faint mt-1 leading-relaxed">
                Dezimalgrad, Komma zwischen Breiten- und Längengrad. Prüfe, dass der Punkt wirklich im
                Geo-Bereich der angegebenen Region liegt.
              </p>
            </div>

            {/* SCHWIERIGKEITSSKALA */}
            <div>
              <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                Schwierigkeitsgrad (1–5)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {difficultyLabels.map(d => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => {
                      triggerHaptic(10)
                      setForm({ ...form, difficulty: d.level })
                    }}
                    className={`p-2 rounded-lg text-center border transition-all ${
                      form.difficulty === d.level
                        ? 'bg-sun text-ink border-line font-bold shadow-md'
                        : 'bg-paper-deep text-ink-faint border-sun'
                    }`}
                  >
                    <span className="font-display font-black text-sm block">{d.level}</span>
                    <span className="font-mono text-[0.52rem] block line-clamp-1">{d.label.split('-')[1]}</span>
                  </button>
                ))}
              </div>
              <p className="font-mono text-[0.6rem] text-sun mt-1">
                {difficultyLabels[form.difficulty - 1]?.desc}
              </p>
            </div>

            {/* HUND & KINDERWAGEN ATTRIBUTE */}
            <div className="bg-paper-deep rounded-xl p-3.5 border border-sun space-y-3">
              {/* Hund */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dogFriendly}
                    onChange={e => setForm({ ...form, dogFriendly: e.target.checked })}
                    className="w-4 h-4 rounded accent-sun"
                  />
                  <span className="font-display text-ink text-xs font-bold">🐕 Hundefreundlich</span>
                </label>
                {form.dogFriendly && (
                  <input
                    type="text"
                    value={form.dogNotes}
                    onChange={e => setForm({ ...form, dogNotes: e.target.value })}
                    placeholder="Details: z. B. Leinenpflicht, Wasserstellen vor Ort, Schatten…"
                    className="field text-xs py-1.5 mt-1.5"
                  />
                )}
              </div>

              {/* Kinderwagen */}
              <div className="pt-2 border-t border-sun">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.strollerFriendly}
                    onChange={e => setForm({ ...form, strollerFriendly: e.target.checked })}
                    className="w-4 h-4 rounded accent-sun"
                  />
                  <span className="font-display text-ink text-xs font-bold">👶 Kinderwagen- / Kleinkindtauglich</span>
                </label>
                {form.strollerFriendly && (
                  <input
                    type="text"
                    value={form.strollerNotes}
                    onChange={e => setForm({ ...form, strollerNotes: e.target.value })}
                    placeholder="Details: z. B. Asphaltierter Uferweg, keine Treppen, Wickeltisch im Café…"
                    className="field text-xs py-1.5 mt-1.5"
                  />
                )}
              </div>
            </div>

            {/* STORY & INSIDER TIPP */}
            <div>
              <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                Insider-Tipp & Story von Einheimischen
              </label>
              <textarea
                value={form.insiderStory}
                onChange={e => setForm({ ...form, insiderStory: e.target.value })}
                placeholder="Beschreibe den geheimen Pfad, worauf man achten muss, die beste Tageszeit oder lokale Legenden…"
                className="field h-20 resize-none text-xs"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex-1 py-2.5 text-xs font-bold disabled:opacity-60"
              >
                {submitting ? 'Wird gespeichert…' : '🪙 Spot einreichen'}
              </button>
              <button type="button" onClick={onClose} className="btn btn-ghost text-xs py-2.5 px-4">
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
