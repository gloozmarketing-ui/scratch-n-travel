import React, { useState } from 'react'
import { cities, businessCategories } from '../data/data'
import { Link } from 'react-router-dom'

export default function Host() {
  const [tab, setTab] = useState<'community' | 'business'>('community')
  const [applied, setApplied] = useState(false)
  const [b2bApplied, setB2bApplied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: 'Lisbon',
    type: 'Gästezimmer (Home Sharing)',
    hobbies: 'Wandern, Kochen, Surfen',
    desc: ''
  })
  const [b2bForm, setB2bForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: 'Lisbon',
    address: '',
    category: '☕ Café & Bäckerei',
    perk: '10% Willkommens-Rabatt für Reisende'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setApplied(true)
  }

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setB2bApplied(true)
  }

  return (
    <div>
      <div className="page-header text-center">
        <p className="coord mb-1 uppercase tracking-widest text-xs">
          Open-Door Community · Zero Platform Fees · Pure Hospitality
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold">
          Host &amp; Community Portal
        </h1>
        <p className="font-script text-sun text-lg mt-1">
          Öffne deine Tür, teile deine Heimat &amp; werde weltweit eingeladen
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setTab('community')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'community'
                ? 'bg-sun text-ink shadow-lg scale-105'
                : 'bg-paper-deep text-ink-faint hover:text-ink'
            }`}
          >
            🏡 Privater Local Host &amp; Home Sharing (0 € Kostenlos)
          </button>
          <button
            onClick={() => setTab('business')}
            className={`px-5 py-2 rounded-full text-xs font-display font-bold transition-all ${
              tab === 'business'
                ? 'bg-sun text-ink shadow-lg scale-105'
                : 'bg-paper-deep text-ink-faint hover:text-ink'
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
            <div className="parchment rounded-2xl p-7 relative overflow-hidden shadow-2xl text-ink">
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="md:col-span-2 space-y-3">
                  <span className="font-mono text-xs font-bold text-terracotta bg-terracotta-wash px-3 py-1 rounded-full uppercase">
                    Kostenlose Gastfreundschaft
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-ink">
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
                    <div key={l} className="bg-ink-ghost/10 rounded-xl p-3 text-center border border-terracotta">
                      <p className="font-display text-terracotta text-xl font-black">{v}</p>
                      <p className="font-display text-ink text-xs font-bold">{l}</p>
                      <p className="font-mono text-[0.55rem] text-terracotta">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-sun shadow-2xl">
              {applied ? (
                <div className="text-center py-8 space-y-3">
                  <span className="text-5xl block">🎉</span>
                  <h3 className="font-display text-ink text-2xl font-bold">
                    Willkommen im Gastgeber-Zirkel!
                  </h3>
                  <p className="font-body text-ink-faint text-sm max-w-md mx-auto">
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
                    <h3 className="font-display text-ink text-xl font-bold">
                      Als Local Host registrieren
                    </h3>
                    <p className="font-body text-ink-faint text-xs">
                      Dauert nur 2 Minuten · Keine Kosten · Jederzeit pausierbar
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Dein Vorname / Name</label>
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
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Deine E-Mail</label>
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
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Deine Stadt / Region</label>
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
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Was möchtest du anbieten?</label>
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
                    <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Deine Hobbys &amp; Interessen (für Matchmaking)</label>
                    <input
                      type="text"
                      value={form.hobbies}
                      onChange={e => setForm({ ...form, hobbies: e.target.value })}
                      placeholder="z. B. Surfen, Wandern mit Hund, Wein, Kochen"
                      className="field text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Kurze persönliche Vorstellung</label>
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
            {/* Parchment Value Prop */}
            <div className="parchment rounded-2xl p-7 relative overflow-hidden shadow-2xl text-ink">
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="md:col-span-2 space-y-3">
                  <span className="font-mono text-xs font-bold text-leaf bg-leaf-wash px-3 py-1 rounded-full uppercase">
                    B2B Local Host Partner · 0% Provision
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-ink">
                    Bringe bewusste Entdecker direkt an deinen Tresen.
                  </h2>
                  <p className="font-body text-sm sm:text-base leading-relaxed">
                    Große Buchungsportale verlangen bis zu 25% Kommission. Bei Scratch'n'Travel zahlst du 
                    <strong> 0% Provision</strong>. Du erhältst ein unkompliziertes Starter-Kit mit physischem QR-Code 
                    Thekenaufsteller per Post. Reisende rubbeln dein Lokal frei, besuchen dich vor Ort und scannen 
                    deinen Stempel für ihren digitalen Reisepass.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['29 €', 'Monatlich', 'Jederzeit kündbar'],
                    ['📦 Kit', 'Aufsteller', 'QR-Thekenaufsteller per Post'],
                    ['0 %', 'Provision', 'Direkter Kundenkontakt'],
                    ['🛡️ Hub', 'Safety Radar', 'Verifizierte Anlaufstelle']
                  ].map(([v, l, s]) => (
                    <div key={l} className="bg-ink-ghost/10 rounded-xl p-3 text-center border border-leaf">
                      <p className="font-display text-leaf text-xl font-black">{v}</p>
                      <p className="font-display text-ink text-xs font-bold">{l}</p>
                      <p className="font-mono text-[0.55rem] text-leaf">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* B2B Starter-Kit Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 border-sun shadow-md space-y-2">
                <span className="text-3xl">📦</span>
                <h3 className="font-display font-bold text-ink text-base">Physischer QR-Thekenaufsteller</h3>
                <p className="font-body text-xs text-ink-faint leading-relaxed">
                  Kompakter, robuster Aufsteller für Tresen, Empfang oder Bar. Wetterfest und mit deinem individuellen Verifizierungs-Code.
                </p>
              </div>
              <div className="card p-6 border-sun shadow-md space-y-2">
                <span className="text-3xl">🎟️</span>
                <h3 className="font-display font-bold text-ink text-base">Digitaler Reisepass-Stempel</h3>
                <p className="font-body text-xs text-ink-faint leading-relaxed">
                  Gäste stempeln ihren Pass bei dir ab (+50 XP & Sammler-Badge). Das erzeugt virale Weiterempfehlungen und wiederkehrende Besucher.
                </p>
              </div>
              <div className="card p-6 border-sun shadow-md space-y-2">
                <span className="text-3xl">🗺️</span>
                <h3 className="font-display font-bold text-ink text-base">Highlight im Safety Radar</h3>
                <p className="font-body text-xs text-ink-faint leading-relaxed">
                  Dein Lokal wird im Safety Radar & Connectivity Cockpit als geprüfter, sicherer Treffpunkt und Verified Local Partner gelistet.
                </p>
              </div>
            </div>

            {/* B2B Application Form */}
            <div className="card p-6 sm:p-8 max-w-2xl mx-auto border-sun shadow-2xl">
              <div className="text-center mb-6">
                <span className="font-mono text-[0.62rem] text-leaf uppercase tracking-widest font-bold">
                  Starter-Kit Vorbestellung &amp; Listung
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-1">
                  Als Verified Local Partner anmelden
                </h3>
                <p className="font-body text-xs text-ink-faint mt-1">
                  14 Tage kostenloser Test. Danach 29 € / Monat, jederzeit monatlich mit einem Klick kündbar.
                </p>
              </div>

              {b2bApplied ? (
                <div className="p-6 bg-leaf-wash/20 border border-leaf rounded-xl text-center space-y-3">
                  <span className="text-4xl">🎉</span>
                  <p className="font-display text-lg text-ink font-bold">B2B Partner-Antrag eingegangen!</p>
                  <p className="font-body text-xs text-ink leading-relaxed max-w-md mx-auto">
                    Vielen Dank, <strong>{b2bForm.ownerName}</strong>! Wir prüfen deinen Eintrag für <strong>{b2bForm.businessName}</strong>. 
                    Dein physischer QR-Stempelaufsteller wird nach Freigabe direkt per Post verschickt.
                  </p>
                  <Link to="/pricing" className="btn btn-primary text-xs py-2 px-4 inline-block mt-2">
                    Abrechnung & Details im Pricing-Portal →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleB2bSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Name des Betriebs / Lokals</label>
                      <input
                        type="text"
                        required
                        value={b2bForm.businessName}
                        onChange={e => setB2bForm({ ...b2bForm, businessName: e.target.value })}
                        placeholder="z. B. Tasca do Chico / Surf Spot Sagres"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Inhaber / Ansprechpartner</label>
                      <input
                        type="text"
                        required
                        value={b2bForm.ownerName}
                        onChange={e => setB2bForm({ ...b2bForm, ownerName: e.target.value })}
                        placeholder="Dein Vor- und Nachname"
                        className="field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Geschäftliche E-Mail</label>
                      <input
                        type="email"
                        required
                        value={b2bForm.email}
                        onChange={e => setB2bForm({ ...b2bForm, email: e.target.value })}
                        placeholder="kontakt@dein-betrieb.com"
                        className="field text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Telefon / WhatsApp</label>
                      <input
                        type="tel"
                        value={b2bForm.phone}
                        onChange={e => setB2bForm({ ...b2bForm, phone: e.target.value })}
                        placeholder="+351 912 345 678"
                        className="field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Kategorie</label>
                      <select
                        value={b2bForm.category}
                        onChange={e => setB2bForm({ ...b2bForm, category: e.target.value })}
                        className="field text-sm"
                      >
                        <option>☕ Café & Bäckerei</option>
                        <option>🍷 Tasca & Traditionelles Restaurant</option>
                        <option>🏄 Surfschule & Outdoor Verleih</option>
                        <option>🏺 Handwerk & Lokale Manufaktur</option>
                        <option>🧭 Lokaler Tourguide & Erlebnisse</option>
                        <option>🍇 Weingut & Hofladen</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">Stadt / Region</label>
                      <input
                        type="text"
                        required
                        value={b2bForm.city}
                        onChange={e => setB2bForm({ ...b2bForm, city: e.target.value })}
                        placeholder="z. B. Lissabon / Wien / München"
                        className="field text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                      Lieferadresse für den physischen Stempelaufsteller
                    </label>
                    <input
                      type="text"
                      required
                      value={b2bForm.address}
                      onChange={e => setB2bForm({ ...b2bForm, address: e.target.value })}
                      placeholder="Straße, Hausnummer, PLZ & Ort"
                      className="field text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[0.62rem] text-sun uppercase block mb-1">
                      Willkommens-Geste für Scratch-Reisende
                    </label>
                    <input
                      type="text"
                      value={b2bForm.perk}
                      onChange={e => setB2bForm({ ...b2bForm, perk: e.target.value })}
                      placeholder="z. B. 10% Rabatt, Willkommens-Kaffee, kostenloser Shot"
                      className="field text-sm"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 text-xs font-bold shadow-xl">
                    📦 Starter-Kit bestellen &amp; 14 Tage testen (29 €/Mo) →
                  </button>
                </form>
              )}
            </div>

            {/* City Network Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map(c => (
                <div key={c.name} className="card p-4 flex items-center gap-4">
                  <span className="text-3xl">{c.flag}</span>
                  <div className="flex-1">
                    <p className="font-display text-ink font-bold text-sm">{c.name}</p>
                    <p className="font-mono text-[0.62rem] text-leaf">
                      {c.total} Kuratierte Spots · Partner-Netzwerk offen
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
