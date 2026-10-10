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
                  20 mm schwerer, freistehender Acrylglas-Block per Post. UV-hinterdruckt mit 3D-Tiefeneffekt, 
                  landesspezifischem Muster und exakten GPS-Koordinaten deines Betriebs.
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
                <span className="text-3xl">🛡️</span>
                <h3 className="font-display font-bold text-ink text-base">Highlight im Safety Radar</h3>
                <p className="font-body text-xs text-ink-faint leading-relaxed">
                  Dein Lokal wird im Safety Radar &amp; Connectivity Cockpit als geprüfter, sicherer Treffpunkt und Verified Local Partner gelistet.
                </p>
              </div>
            </div>

            {/* INTERAKTIVE BRANCHEN-VORSCHAU FÜR ALLE BUSINESS OWNER */}
            {(() => {
              const industries = [
                { id: 'cafe', icon: '☕', name: 'Cafés & Bars', venue: 'Miradouro Café & Tasca', city: 'Lisboa', gps: '38°42\'44"N · 9°07\'59"W', badge: 'VERIFIED GASTRO & CAFÉ SPOT', cta: 'Tisch reservieren · Tasting buchen (0% Gebühr)', hint: '„Geheimtipp: Zeige dem Barista diesen Stempel für den geheimen Hauswein!“', code: 'ALFAMA_SECRET' },
                { id: 'surf', icon: '🏄', name: 'Surfschulen', venue: 'Sagres Ocean & Surf Base', city: 'Sagres', gps: '37°00\'34"N · 8°56\'21"W', badge: 'VERIFIED SURF & OCEAN BASE', cta: 'Surf-Session buchen · Board leihen (0% Gebühr)', hint: '„Spot-Check: Die Surflehrer verraten dir den geheimen Sandbank-Peak bei Ebbe!“', code: 'SWELL_CHASER' },
                { id: 'wine', icon: '🍇', name: 'Weingüter & Bodegas', venue: 'Bodega Viña del Sol', city: 'Ronda', gps: '36°44\'38"N · 5°09\'54"W', badge: 'VERIFIED WINERY & CELLAR', cta: 'Weinprobe reservieren · Direktkauf (0% Gebühr)', hint: '„Kellergeheimnis: Wer den Pass vorzeigt, darf das unetikettierte Reserve-Fass probieren!“', code: 'TERROIR_GOLD' },
                { id: 'guide', icon: '🥾', name: 'Outdoor- & Bergführer', venue: 'Matterhorn Alpine Guides', city: 'Zermatt', gps: '45°58\'37"N · 7°44\'56"E', badge: 'VERIFIED ALPINE & OUTDOOR GUIDE', cta: 'Tour & Guiding anfragen (0% Gebühr)', hint: '„Bergwacht-Insider: Der Guide zeigt dir den versteckten Grat fernab aller Touristen!“', code: 'SUMMIT_SEEKER' },
                { id: 'camp', icon: '🚐', name: 'Camper & Glamping', venue: 'Costa Vicentina Eco-Camp', city: 'Aljezur', gps: '37°19\'08"N · 8°48\'12"W', badge: 'VERIFIED VANLIFE & ECO-CAMP', cta: 'Stellplatz reservieren · Glamping buchen (0% Gebühr)', hint: '„Vanlife-Community: Kostenloses Frischwasser & Feuerstelle für registrierte Explorer!“', code: 'VANLIFE_HAVEN' },
                { id: 'maker', icon: '🏺', name: 'Handwerk & Ateliers', venue: 'Cerâmica Ancestral Atelier', city: 'Caldas da Rainha', gps: '39°24\'15"N · 9°08\'05"W', badge: 'VERIFIED ARTISAN & MAKER ATELIER', cta: 'Workshop buchen · Unikat sichern (0% Gebühr)', hint: '„Meisterstück: Erhalte dein gebranntes Souvenir mit offiziellem Explorer-Signet!“', code: 'CRAFT_SOUL' },
                { id: 'cowork', icon: '💻', name: 'Coworking & Nomad Hubs', venue: 'Nomad Oasis Hub', city: 'Lisboa', gps: '38°43\'12"N · 9°08\'45"W', badge: 'VERIFIED NOMAD & COWORKING HUB', cta: 'Day-Pass sichern · Desk anfragen (0% Gebühr)', hint: '„Nomad Secret: 1 Gbit/s Glasfaser, Community-Kaffee & ruhige Call-Booths inklusive!“', code: 'DIGITAL_NOMAD' },
                { id: 'hotel', icon: '🏨', name: 'Boutique Hotels & B&Bs', venue: 'Quinta das Flores Retreat', city: 'Sintra', gps: '38°47\'52"N · 9°23\'24"W', badge: 'VERIFIED BOUTIQUE RETREAT', cta: 'Zimmer direkt anfragen · Bestpreis (0% Gebühr)', hint: '„Rezeptions-Geheimnis: Kostenloses Zimmer-Upgrade oder Welcome-Drink bei Direktbuchung!“', code: 'BOUTIQUE_KEY' },
                { id: 'bike', icon: '🚲', name: 'Bike & Gravel Verleih', venue: 'Gravel & Coast Bike Station', city: 'Lagos', gps: '37°06\'07"N · 8°40\'34"W', badge: 'VERIFIED BIKE & GRAVEL STATION', cta: 'Bike leihen · GPX Route laden (0% Gebühr)', hint: '„Trail-Tipp: Erhalte die Offline-GPX Route zu den einsamsten Küsten-Singletrails!“', code: 'GRAVEL_TRAIL' },
              ]
              const activeInd = industries.find(ind => b2bForm.category.includes(ind.name)) || industries[0]

              return (
                <div className="card p-6 sm:p-8 border-sun bg-paper-deep/50 shadow-xl space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-1">
                    <span className="font-mono text-[0.62rem] text-sun uppercase tracking-widest font-bold">
                      Für jede Art von Gastgeber &amp; Betrieb
                    </span>
                    <h3 className="font-display text-2xl font-bold text-ink">
                      Individuell gestaltet für deine Branche
                    </h3>
                    <p className="font-body text-xs text-ink-faint">
                      Egal ob Café, Surfschule, Weingut, Berghütte oder Werkstatt: Hermes generiert für jeden Partner
                      einen maßgeschneiderten Acrylglas-Block mit branchenspezifischem Call-to-Action und lokalem Easter-Egg.
                    </p>
                  </div>

                  {/* Branchen-Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
                    {industries.map(ind => (
                      <button
                        key={ind.id}
                        onClick={() => {
                          setB2bForm({
                            ...b2bForm,
                            businessName: ind.venue,
                            city: ind.city,
                            category: `${ind.icon} ${ind.name}`
                          })
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                          activeInd.id === ind.id
                            ? 'bg-ink text-white border-ink shadow-md scale-105'
                            : 'bg-card text-ink-faint border-line hover:text-ink hover:bg-sun-wash'
                        }`}
                      >
                        <span>{ind.icon}</span>
                        <span>{ind.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* LIVE MOCKUP DES ACRYLGLAS-AUFSTELLERS */}
                  <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#042c2e] text-[#D9D19B] border-2 border-[#D9D19B]/60 shadow-2xl relative overflow-hidden transition-all duration-300">
                    {/* Gold-Lichtreflex Glanzeffekt */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D9D19B]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="text-center space-y-3 relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#021c1d] border border-[#D9D19B]/40 text-[0.62rem] font-mono text-[#a8d4c0] uppercase tracking-wider">
                        ✦ 20 mm Acrylglas Block · Gelato POD 300 DPI
                      </div>

                      <div>
                        <span className="text-2xl block mb-1">{activeInd.icon}</span>
                        <p className="font-serif tracking-widest text-xs font-bold text-[#D9D19B]">SCRATCH &apos;N&apos; TRAVEL</p>
                        <p className="font-mono text-[0.6rem] text-[#a8d4c0] font-semibold tracking-wider">
                          {activeInd.badge}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D9D19B]/20">
                        <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                          {b2bForm.businessName || activeInd.venue}
                        </h4>
                        <p className="font-mono text-[0.68rem] text-[#D9D19B]">
                          📍 {(b2bForm.city || activeInd.city).toUpperCase()} · GPS: {activeInd.gps}
                        </p>
                      </div>

                      {/* QR-Container */}
                      <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex flex-col items-center justify-center shadow-lg my-2 border border-[#D9D19B]">
                        <div className="w-28 h-28 bg-[#121816] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                          📱
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                          Mit Smartphone Scannen
                        </p>
                        <p className="font-mono text-[0.65rem] text-[#D9D19B]">
                          {activeInd.cta}
                        </p>
                      </div>

                      {/* Insider Easter-Egg Box */}
                      <div className="p-2.5 rounded-xl bg-[#021c1d] border border-[#D9D19B]/40 text-left space-y-1">
                        <p className="font-mono text-[0.6rem] font-bold text-[#D9D19B]">✦ LOKALER INSIDER-HINT &amp; EASTER-EGG:</p>
                        <p className="font-serif text-[0.7rem] italic text-white leading-tight">
                          {activeInd.hint}
                        </p>
                        <p className="font-mono text-[0.58rem] text-[#a8d4c0]">
                          🔑 Codewort für Gäste in der App: <strong className="text-white">{activeInd.code}</strong>
                        </p>
                      </div>

                      {/* 0% Guarantee */}
                      <div className="pt-2 border-t border-[#D9D19B]/20 text-[0.6rem] font-mono text-[#a8d4c0]">
                        🛡️ 0% PLATTFORM-PROVISION · DIREKTE BEZAHLUNG VOR ORT
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

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
                        <option>🏄 Surfschule & Wassersport</option>
                        <option>🍇 Weingut & Bodega</option>
                        <option>🥾 Outdoor- & Bergführer</option>
                        <option>🚐 Campervan-Stellplatz & Glamping</option>
                        <option>🏺 Handwerk & Lokale Manufaktur</option>
                        <option>💻 Coworking Space & Nomad Hub</option>
                        <option>🏨 Boutique Hotel, B&B & Eco-Lodge</option>
                        <option>🚲 Bike, Gravel & E-Bike Verleih</option>
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
