import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { Link } from 'react-router-dom'

export default function Host() {
  const [tab, setTab] = useState<'community' | 'business'>('community')
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: 'Lisbon',
    type: 'Gästezimmer (Home Sharing)',
    hobbies: 'Wandern, Kochen, Surfen',
    desc: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApplied(true)
  }

  return (
    <div>
      <div className="page-header text-center">
        <p className="coord mb-1 uppercase tracking-widest text-xs">
          Open-Door Community · Zero Platform Fees · Pure Hospitality
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[#F4E4C1] font-bold">
          Host &amp; Community Portal
        </h1>
        <p className="font-script text-[rgba(201,168,76,0.6)] text-lg mt-1">
          Öffne deine Tür, teile deine Heimat &amp; werde weltweit eingeladen
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setTab('community')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'community'
                ? 'bg-[#C9A84C] text-[#0C1825] shadow-lg scale-105'
                : 'bg-[#152539] text-[#8A9AAA] hover:text-[#F4E4C1]'
            }`}
          >
            🏡 Privater Local Host &amp; Home Sharing (0 € Kostenlos)
          </button>
          <button
            onClick={() => setTab('business')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'business'
                ? 'bg-[#C9A84C] text-[#0C1825] shadow-lg scale-105'
                : 'bg-[#152539] text-[#8A9AAA] hover:text-[#F4E4C1]'
            }`}
          >
            ☕ Lokale Manufakturen &amp; Partner
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-10 max-w-5xl mx-auto pb-24 md:pb-8">

        {/* ─── TAB 1: COMMUNITY HOME SHARING ─── */}
        {tab === 'community' && (
          <>
            {/* Parchment Value Prop */}
            <div className="parchment rounded-2xl p-7 relative overflow-hidden shadow-2xl text-[#2C1810]">
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="md:col-span-2 space-y-3">
                  <span className="font-mono text-xs font-bold text-[#8B3A2A] bg-[rgba(139,58,42,0.15)] px-3 py-1 rounded-full uppercase">
                    Kostenlose Gastfreundschaft
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-[#2C1810]">
                    Teile dein Zuhause oder deine Geheimorte — und reise selbst umsonst.
                  </h2>
                  <p className="font-body text-sm sm:text-base leading-relaxed">
                    Egal ob du ein freies Gästezimmer hast, einen Stellplatz im Garten für Van-Reisende anbietest
                    oder einfach sonntags mit Reisenden wandern gehst: Du zahlst keinen Cent und verlangst kein Geld.
                    Als Gegenleistung wirst du Teil unseres weltweiten Gastfreundschafts-Netzwerks und wirst
                    von anderen Locals rund um den Globus eingeladen.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['0 €', 'Gebühren', '100% werbefrei'],
                    ['🗝️ Key', 'Open Doors', 'Weltweit eingeladen'],
                    ['❤️', 'Familiär', 'Wahre Freundschaft'],
                    ['🐕', 'Pet Friendly', 'Hunde willkommen']
                  ].map(([v, l, s]) => (
                    <div key={l} className="bg-[rgba(44,24,16,0.08)] rounded-xl p-3 text-center border border-[rgba(139,58,42,0.15)]">
                      <p className="font-display text-[#8B3A2A] text-xl font-black">{v}</p>
                      <p className="font-display text-[#2C1810] text-xs font-bold">{l}</p>
                      <p className="font-mono text-[0.55rem] text-[#8B3A2A]">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-[rgba(201,168,76,0.3)] shadow-2xl">
              {applied ? (
                <div className="text-center py-8 space-y-3">
                  <span className="text-5xl block">🎉</span>
                  <h3 className="font-display text-[#F4E4C1] text-2xl font-bold">
                    Willkommen im Gastgeber-Zirkel!
                  </h3>
                  <p className="font-body text-[#8A9AAA] text-sm max-w-md mx-auto">
                    Dein Profil als Local Host wurde eingereicht. Du erhältst in Kürze dein digitales
                    <strong> Golden Host Key Wappen</strong> für deinen Reisepass!
                  </p>
                  <Link to="/passport" className="btn btn-primary text-xs px-6 py-2.5 mt-4">
                    Zum digitalen Reisepass →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <span className="text-3xl block mb-1">🏡</span>
                    <h3 className="font-display text-[#F4E4C1] text-xl font-bold">
                      Als Local Host registrieren
                    </h3>
                    <p className="font-body text-[#8A9AAA] text-xs">
                      Dauert nur 2 Minuten · Keine Kosten · Jederzeit pausierbar
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Dein Vorname / Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="z. B. Miguel &amp; Sarah"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine E-Mail</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="host@gmail.com"
                        className="field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine Stadt / Region</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        placeholder="z. B. Sintra, Portugal"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Was möchtest du anbieten?</label>
                      <select
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                        className="field text-sm"
                      >
                        <option>Gästezimmer (Kostenlos)</option>
                        <option>Couch / Gästesofa</option>
                        <option>Garten-Camp / Van-Stellplatz</option>
                        <option>Gemeinsam Kochen &amp; Stadtführung</option>
                        <option>Nur geheime Insidertipps teilen</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Deine Hobbys &amp; Interessen (für Matchmaking)</label>
                    <input
                      type="text"
                      value={form.hobbies}
                      onChange={e => setForm({ ...form, hobbies: e.target.value })}
                      placeholder="z. B. Surfen, Wandern mit Hund, Wein, Kochen"
                      className="field text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-[#C9A84C] uppercase block mb-1">Kurze persönliche Vorstellung</label>
                    <textarea
                      rows={3}
                      value={form.desc}
                      onChange={e => setForm({ ...form, desc: e.target.value })}
                      placeholder="Erzähl ein paar Sätze über dich und warum du gerne Reisende empfängst..."
                      className="field text-sm"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold shadow-xl">
                    ✨ Gastgeber-Profil kostenlos aktivieren →
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {/* ─── TAB 2: BUSINESS / CAFES / EXPERIENCES ─── */}
        {tab === 'business' && (
          <div className="space-y-8">
            <div className="parchment rounded-xl p-6 text-[#2C1810]">
              <h3 className="font-display text-xl font-bold mb-2">B2B Partner-Programm (Zero Commission)</h3>
              <p className="font-body text-sm leading-relaxed mb-4">
                Du führst eine kleine traditionelle Tasca, ein Surf-Camp oder einen Verleih? 
                Bei uns zahlst du keine 15–20% Buchungsgebühren. Echte Reisende finden dich direkt.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map(c => (
                <div key={c.name} className="card p-4 flex items-center gap-4">
                  <span className="text-3xl">{c.flag}</span>
                  <div className="flex-1">
                    <p className="font-display text-[#F4E4C1] font-bold text-sm">{c.name}</p>
                    <p className="font-mono text-[0.62rem] text-emerald-400">
                      {c.total - c.taken} freie Partner-Plätze
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
