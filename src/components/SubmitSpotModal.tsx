import React, { useState } from 'react'
import { useTravel } from '../context/TravelContext'
import { track } from '../lib/analytics'

interface SubmitSpotModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (spot: any) => void
}

export default function SubmitSpotModal({ isOpen, onClose, onSuccess }: SubmitSpotModalProps) {
  const { triggerHaptic } = useTravel()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    location: '',
    category: 'Nature',
    difficulty: 2,
    dogFriendly: true,
    dogNotes: '',
    strollerFriendly: false,
    strollerNotes: '',
    familyFriendly: true,
    insiderStory: '',
    gps: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerHaptic([20, 50, 80])
    setSubmitted(true)
    track('spot_submitted')
    onSuccess?.(form)
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
            <span className="text-5xl block mb-3">🪙</span>
            <h3 className="font-display text-2xl font-bold text-ink mb-2">Secret Spot eingereicht!</h3>
            <p className="font-body text-sm text-ink-faint max-w-md mx-auto mb-4">
              Vielen Dank für deinen Beitrag zur Community. Dein Spot wird nach Verifizierung freigeschaltet.
            </p>
            <div className="inline-block bg-emerald-500/20 text-leaf font-mono text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              +150 XP wurden deinem Profil gutgeschrieben ✓
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
              <button type="submit" className="btn btn-primary flex-1 py-2.5 text-xs font-bold">
                🪙 Spot einreichen (+150 XP)
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
