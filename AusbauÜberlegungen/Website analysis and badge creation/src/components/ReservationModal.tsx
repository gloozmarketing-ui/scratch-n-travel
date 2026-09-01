import React, { useState } from 'react'
import { useTravel } from '../context/TravelContext'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  hostName: string
  city: string
  category: string
}

export default function ReservationModal({ isOpen, onClose, hostName, city, category }: ReservationModalProps) {
  const { user, createReservation } = useTravel()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '12:30',
    guests: 2,
    notes: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createReservation({
      hostBusiness: hostName,
      city,
      guestName: user.name,
      email: 'maria@wanderer.eu',
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      category,
      notes: form.notes,
    })
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold">
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🎉</span>
            <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-2">Reservierungsanfrage gesendet!</h3>
            <p className="font-body text-[#8A9AAA] text-sm max-w-md mx-auto mb-5">
              Deine direkte Reservierung bei <strong className="text-[#C9A84C]">{hostName}</strong> für{' '}
              <strong className="text-[#F4E4C1]">{form.guests} Personen</strong> am{' '}
              <strong className="text-[#F4E4C1]">{form.date} um {form.time} Uhr</strong> wurde erfolgreich übermittelt.
              0 % Plattformgebühr für dich und den Partner.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Zurück zur Übersicht
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider">
                0% Provision · Direkter Host-Kontakt
              </span>
              <h3 className="font-display text-[#F4E4C1] text-xl font-bold">Platz / Tisch anfragen</h3>
              <p className="font-body text-[#8A9AAA] text-sm">
                Host: <span className="text-[#C9A84C] font-semibold">{hostName}</span> ({city} · {category})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">Datum</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="field"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">Uhrzeit</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">
                Anzahl Personen / Plätze
              </label>
              <select
                value={form.guests}
                onChange={e => setForm(p => ({ ...p, guests: Number(e.target.value) }))}
                className="field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Person' : 'Personen'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase tracking-wider block mb-1">
                Spezielle Wünsche / Notizen (Hund dabei, Surfniveau, Diät)
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="field h-20 resize-none text-sm"
                placeholder="z. B. Wir reisen mit Hund, bitte einen Tisch im Außenbereich reservieren…"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Anfrage jetzt absenden →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
