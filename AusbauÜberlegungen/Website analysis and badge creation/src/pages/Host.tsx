import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { useTravel } from '../context/TravelContext'

export default function Host() {
  const { reservations, triggerHaptic } = useTravel()
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({
    business: '',
    category: businessCategories[0],
    city: 'Lisbon',
    email: '',
    desc: '',
  })

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">B2B Partner Programme · Flat Fee · 0% Commission</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">B2B Host Portal</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">list your business — keep 100% of your revenue</p>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        {/* INBOUND RESERVATIONS MANAGER */}
        <div className="card p-6 border-[rgba(201,168,76,0.3)] shadow-2xl">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <span className="font-mono text-[0.62rem] text-emerald-400 font-bold uppercase tracking-widest">
                ● Live Host Dashboard
              </span>
              <h2 className="font-display text-[#F4E4C1] text-xl font-bold">Eingehende Reservierungen & Anfragen</h2>
            </div>
            <span className="font-mono text-[0.65rem] bg-[rgba(201,168,76,0.15)] text-[#C9A84C] px-3 py-1 rounded-full border border-[rgba(201,168,76,0.3)]">
              {reservations.length} Buchungen aktiv
            </span>
          </div>

          <div className="space-y-3">
            {reservations.map(res => (
              <div
                key={res.id}
                className="bg-[#0C1825] rounded-xl p-4 border border-[rgba(201,168,76,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-[#C9A84C] font-bold text-sm">{res.guestName}</span>
                    <span className="font-mono text-[0.6rem] text-[#8A9AAA]">({res.email})</span>
                    <span
                      className={`font-mono text-[0.58rem] font-bold px-2 py-0.5 rounded-full ${
                        res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {res.status === 'confirmed' ? 'BESTÄTIGT' : 'OFFEN'}
                    </span>
                  </div>
                  <p className="font-body text-[#F4E4C1] text-sm">
                    <strong>{res.guests} Plätze</strong> für <em>{res.hostBusiness}</em> am{' '}
                    <strong>{res.date} um {res.time} Uhr</strong>
                  </p>
                  {res.notes && <p className="font-body text-xs text-[#8A9AAA] mt-1">Notiz: "{res.notes}"</p>}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      triggerHaptic(15)
                      alert(`Buchung ${res.id} für ${res.guestName} bestätigt!`)
                    }}
                    className="btn btn-primary text-xs py-1.5 px-3"
                  >
                    ✓ Bestätigen
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      alert(`E-Mail an ${res.email} wird geöffnet.`)
                    }}
                    className="btn btn-ghost text-xs py-1.5 px-3"
                  >
                    ✉️ Kontakt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HERO VALUE PROP */}
        <div className="parchment rounded-xl p-7 relative overflow-hidden shadow-xl border border-[rgba(139,58,42,0.2)]">
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="md:col-span-2">
              <p className="font-script text-2xl text-[#8B3A2A] mb-1">Nie wieder 15–20% Buchungsgebühren</p>
              <h2 className="font-display text-2xl text-[#2C1810] font-black mb-3">
                Monatliche Flat. 0% Provision. Deine Gäste, dein Gewinn.
              </h2>
              <p className="font-body text-[#2C1810] leading-relaxed mb-4">
                Scratch'n'Travel verbindet dich direkt mit qualitätsbewussten Reisenden, die authentische Erlebnisse suchen.
              </p>
              <button
                onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-parchment font-bold border-2 border-[#8B3A2A]"
              >
                Jetzt als Partner bewerben →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['€0', 'Provision', '0 % auf alle Buchungen'],
                ['Gold', 'Verified Badge', 'auf deinem Eintrag'],
                ['25%', 'Merch Rabatt', 'für deine Gäste'],
                ['100%', 'Gästekontakt', 'Direkte E-Mail & Chat'],
              ].map(([v, l, sub]) => (
                <div key={l} className="bg-[rgba(44,24,16,0.07)] rounded-xl p-3 text-center border border-[rgba(139,58,42,0.15)]">
                  <p className="font-display text-[#C9A84C] text-xl font-black">{v}</p>
                  <p className="font-display text-[#2C1810] text-xs font-bold">{l}</p>
                  <p className="font-mono text-[0.55rem] text-[#8B3A2A]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CITY SLOTS */}
        <div>
          <div className="section-divider mb-5">
            <span className="font-mono text-[0.68rem] tracking-widest">Verfügbare Städte-Slots</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(c => (
              <div key={c.name} className="card p-4 flex items-center gap-4">
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display text-[#F4E4C1] font-bold">{c.name}</p>
                    <span className="font-mono text-[0.58rem] border px-1.5 py-0.5 rounded-full text-[#C9A84C] border-[#C9A84C]/40">
                      {c.tier}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: c.total }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-sm ${
                          i < c.taken ? 'bg-[rgba(201,168,76,0.2)]' : 'gold-gradient'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[0.62rem] text-[#8A9AAA]">
                    {c.total - c.taken > 0 ? (
                      <span className="text-emerald-400">{c.total - c.taken} freie Slots</span>
                    ) : (
                      <span className="text-red-400">Vollbelegt — Warteliste</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply-form" className="card p-6 border-[rgba(201,168,76,0.25)]">
          <h2 className="font-display text-[#C9A84C] text-xl font-bold mb-1">Als Host-Partner bewerben</h2>
          <p className="font-body text-[#8A9AAA] mb-6">Prüfung innerhalb von 48h. Begrenzte Städte-Kontingente.</p>

          {applied ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-4">🎉</p>
              <p className="font-display text-[#F4E4C1] text-2xl font-bold mb-2">Bewerbung eingegangen!</p>
              <p className="font-body text-[#8A9AAA] max-w-md mx-auto">
                Wir prüfen deine Angaben für <strong className="text-[#C9A84C]">{form.business}</strong> und melden uns unter{' '}
                <span className="text-[#C9A84C]">{form.email || 'deiner E-Mail'}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Unternehmensname
                  </label>
                  <input
                    value={form.business}
                    onChange={e => setForm(p => ({ ...p, business: e.target.value }))}
                    className="field"
                    placeholder="z. B. Surf School Ericeira"
                  />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kategorie
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="field"
                  >
                    {businessCategories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Stadt / Region
                  </label>
                  <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="field">
                    {cities.map(c => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kontakt E-Mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="field"
                    placeholder="partner@business.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)] uppercase tracking-wider block mb-1">
                    Kurzbeschreibung
                  </label>
                  <textarea
                    value={form.desc}
                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                    className="field h-24 resize-none"
                    placeholder="Was macht dein Angebot für authentische Reisende besonders?"
                  />
                </div>
              </div>

              <button onClick={() => setApplied(true)} className="btn btn-primary w-full py-3">
                Bewerbung jetzt einreichen ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
