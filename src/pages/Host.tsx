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
    perk: '10% Willkommens-Rabatt für Reisende',
    planOption: 'quarterly', // 'quarterly' | 'monthly' | 'digital'
    secretSpecial: '',
  })

  // Interaktiver Aufsteller-Konfigurator: 0 bis 4 QR-Code Ecken
  const [cornerQrs, setCornerQrs] = useState<{
    tl: { active: boolean; type: string; title: string; hint: string; icon: string; customText?: string }
    tr: { active: boolean; type: string; title: string; hint: string; icon: string; customText?: string }
    bl: { active: boolean; type: string; title: string; hint: string; icon: string; customText?: string }
    br: { active: boolean; type: string; title: string; hint: string; icon: string; customText?: string }
  }>({
    tl: { active: true, type: 'stamp', title: 'Pass-Stempel', hint: '+50 XP für Explorer', icon: '🎟️' },
    tr: { active: true, type: 'contact', title: 'WhatsApp / 0% Chat', hint: 'Direktkontakt ohne Gebühr', icon: '💬' },
    bl: { active: true, type: 'secret', title: 'Insider Secret', hint: 'Geheimes Tages-Special', icon: '🗝️' },
    br: { active: true, type: 'routes', title: 'Lokale Routen', hint: 'Secret Spots des Hosts', icon: '🗺️' }
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
                    ['29 €', 'Ab 29 € / Mo', '3-Mo Starter: Aufsteller geschenkt'],
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

                  {/* INTERAKTIVER QR-CODE ECKEN-KONFIGURATOR (0 BIS 4 ECKEN) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-card border border-leaf/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                      <div>
                        <h4 className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-2">
                          <span>📐</span> Aufsteller-Konfigurator: QR-Code Ecken (0 bis 4 Ecken)
                        </h4>
                        <p className="font-body text-xs text-ink-faint">
                          Wähle frei, welche Ecken deines Acrylglas-Blocks mit scannbaren QR-Codes belegt werden sollen.
                        </p>
                      </div>

                      {/* Schnell-Wahl Buttons */}
                      <div className="flex flex-wrap gap-1.5 font-mono text-[0.65rem]">
                        <button
                          type="button"
                          onClick={() => {
                            setCornerQrs({
                              tl: { ...cornerQrs.tl, active: true },
                              tr: { ...cornerQrs.tr, active: true },
                              bl: { ...cornerQrs.bl, active: true },
                              br: { ...cornerQrs.br, active: true },
                            })
                          }}
                          className="px-2.5 py-1 rounded-lg border border-leaf/60 bg-leaf-wash text-leaf font-bold hover:bg-leaf hover:text-white transition-all"
                        >
                          4 Ecken (Multi-Hub)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCornerQrs({
                              tl: { ...cornerQrs.tl, active: true },
                              tr: { ...cornerQrs.tr, active: true },
                              bl: { ...cornerQrs.bl, active: false },
                              br: { ...cornerQrs.br, active: false },
                            })
                          }}
                          className="px-2.5 py-1 rounded-lg border border-sun text-ink hover:bg-sun-wash transition-all"
                        >
                          2 Ecken (Duo)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCornerQrs({
                              tl: { ...cornerQrs.tl, active: true },
                              tr: { ...cornerQrs.tr, active: false },
                              bl: { ...cornerQrs.bl, active: false },
                              br: { ...cornerQrs.br, active: false },
                            })
                          }}
                          className="px-2.5 py-1 rounded-lg border border-sun text-ink hover:bg-sun-wash transition-all"
                        >
                          1 QR (Zentriert)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCornerQrs({
                              tl: { ...cornerQrs.tl, active: false },
                              tr: { ...cornerQrs.tr, active: false },
                              bl: { ...cornerQrs.bl, active: false },
                              br: { ...cornerQrs.br, active: false },
                            })
                          }}
                          className="px-2.5 py-1 rounded-lg border border-line text-ink-faint hover:text-ink transition-all"
                        >
                          0 QR (Pure Gravur &amp; NFC)
                        </button>
                      </div>
                    </div>

                    {/* 4 Ecken Einstellungs-Grid */}
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { key: 'tl' as const, label: '↖️ Ecke Oben Links', defaultType: 'stamp' },
                        { key: 'tr' as const, label: '↗️ Ecke Oben Rechts', defaultType: 'contact' },
                        { key: 'bl' as const, label: '↙️ Ecke Unten Links', defaultType: 'secret' },
                        { key: 'br' as const, label: '↘️ Ecke Unten Rechts', defaultType: 'routes' },
                      ].map(corner => {
                        const cur = cornerQrs[corner.key]
                        const options = [
                          { type: 'stamp', title: 'Pass-Stempel (+50 XP)', hint: 'Reisepass-Stempel & Badge', icon: '🎟️' },
                          { type: 'contact', title: 'WhatsApp / Direktkontakt', hint: '0% Buchungsprovision', icon: '💬' },
                          { type: 'secret', title: 'Insider Secret / Special', hint: 'Geheimes Tages-Special', icon: '🗝️' },
                          { type: 'routes', title: 'Lokale Routen & Spots', hint: 'Geheimtipps des Wirts', icon: '🗺️' },
                          { type: 'menu', title: 'Speisekarte & Angebote', hint: 'Digitale Speisekarte', icon: '🍽️' },
                          { type: 'wifi', title: 'Gäste-WLAN Login', hint: '1-Click WiFi-Verbindung', icon: '📶' },
                          { type: 'instagram', title: 'Instagram / Fotos', hint: 'Community-Social Feed', icon: '📸' },
                          { type: 'custom', title: 'Eigene Aktion / Link', hint: 'Individuelle Host-Aktion', icon: '✏️' },
                        ]

                        return (
                          <div
                            key={corner.key}
                            className={`p-3 rounded-xl border transition-all ${
                              cur.active ? 'bg-paper-deep border-leaf/60 shadow-sm' : 'bg-card/60 border-line opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="flex items-center gap-2 cursor-pointer font-bold font-mono text-[0.65rem] text-ink">
                                <input
                                  type="checkbox"
                                  checked={cur.active}
                                  onChange={e => {
                                    setCornerQrs({
                                      ...cornerQrs,
                                      [corner.key]: { ...cur, active: e.target.checked }
                                    })
                                  }}
                                  className="rounded text-leaf focus:ring-leaf"
                                />
                                <span>{corner.label}</span>
                              </label>
                              <span className="text-base">{cur.active ? cur.icon : '⚪'}</span>
                            </div>

                            {cur.active && (
                              <div className="space-y-1.5 mt-2">
                                <select
                                  value={cur.type}
                                  onChange={e => {
                                    const match = options.find(o => o.type === e.target.value) || options[0]
                                    setCornerQrs({
                                      ...cornerQrs,
                                      [corner.key]: {
                                        ...cur,
                                        type: match.type,
                                        title: match.title,
                                        hint: match.hint,
                                        icon: match.icon
                                      }
                                    })
                                  }}
                                  className="field text-xs py-1"
                                >
                                  {options.map(opt => (
                                    <option key={opt.type} value={opt.type}>
                                      {opt.icon} {opt.title}
                                    </option>
                                  ))}
                                </select>
                                {cur.type === 'custom' && (
                                  <input
                                    type="text"
                                    placeholder="Eigener Titel / Link-Zweck"
                                    value={cur.customText || ''}
                                    onChange={e => {
                                      setCornerQrs({
                                        ...cornerQrs,
                                        [corner.key]: { ...cur, customText: e.target.value, title: e.target.value || 'Eigene Aktion' }
                                      })
                                    }}
                                    className="field text-xs py-1"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* LIVE MOCKUP DES ACRYLGLAS-AUFSTELLERS */}
                  {(() => {
                    const activeEntries = (['tl', 'tr', 'bl', 'br'] as const)
                      .map(k => ({ key: k, ...cornerQrs[k] }))
                      .filter(c => c.active)
                    const activeCount = activeEntries.length

                    return (
                      <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#042c2e] text-[#D9D19B] border-2 border-[#D9D19B]/60 shadow-2xl relative overflow-hidden transition-all duration-300">
                        {/* Gold-Lichtreflex Glanzeffekt */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D9D19B]/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="text-center space-y-3 relative z-10">
                          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#021c1d] border border-[#D9D19B]/40 text-[0.62rem] font-mono text-[#a8d4c0] uppercase tracking-wider">
                            ✦ 20 mm Acrylglas Block · Gelato POD · {activeCount} QR-{activeCount === 1 ? 'Code' : 'Ecken'}
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

                          {/* DYNAMISCHES QR-LAYOUT (0, 1, 2 ODER 3-4 ECKEN) */}
                          {activeCount === 0 && (
                            /* 0 QR CODES: PURE GRAVUR & NFC */
                            <div className="py-6 px-4 my-3 rounded-2xl bg-[#021c1d] border border-[#D9D19B]/60 text-center space-y-2">
                              <div className="w-20 h-20 mx-auto rounded-full bg-[#042c2e] border-2 border-[#D9D19B] flex items-center justify-center text-3xl shadow-lg">
                                🧭
                              </div>
                              <p className="font-serif text-xs font-bold text-white uppercase tracking-widest">
                                Pure Laser-Gravur &amp; NFC-Touch
                              </p>
                              <p className="font-mono text-[0.62rem] text-[#D9D19B]">
                                Keine QR-Codes aufgedruckt. Gäste halten ihr Smartphone an den Block für den Check-in &amp; Pass-Stempel.
                              </p>
                            </div>
                          )}

                          {activeCount === 1 && (
                            /* 1 QR CODE ZENTRIERT */
                            <div className="my-2 space-y-2">
                              <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex flex-col items-center justify-center shadow-lg border border-[#D9D19B]">
                                <div className="w-28 h-28 bg-[#121816] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                                  {activeEntries[0].icon}
                                </div>
                              </div>
                              <p className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                                {activeEntries[0].title}
                              </p>
                              <p className="font-mono text-[0.65rem] text-[#D9D19B]">
                                {activeEntries[0].hint}
                              </p>
                            </div>
                          )}

                          {activeCount === 2 && (
                            /* 2 QR CODES NEBENEINANDER (DUO) */
                            <div className="grid grid-cols-2 gap-3 my-2">
                              {activeEntries.map(entry => (
                                <div key={entry.key} className="p-2.5 rounded-xl bg-[#021c1d] border border-[#D9D19B]/40 text-center space-y-1.5">
                                  <div className="bg-white p-2 rounded-xl w-20 h-20 mx-auto flex items-center justify-center shadow">
                                    <div className="w-16 h-16 bg-[#121816] rounded-lg flex items-center justify-center text-white text-xl">
                                      {entry.icon}
                                    </div>
                                  </div>
                                  <p className="font-mono font-bold text-[0.65rem] text-white truncate">{entry.title}</p>
                                  <p className="font-mono text-[0.55rem] text-[#a8d4c0] truncate">{entry.hint}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeCount >= 3 && (
                            /* 3 BIS 4 ECKEN MULTI-HUB LAYOUT */
                            <div className="space-y-2 my-2">
                              {/* Obere Reihe */}
                              <div className="grid grid-cols-2 gap-3">
                                {(['tl', 'tr'] as const).map(k => {
                                  const c = cornerQrs[k]
                                  return (
                                    <div
                                      key={k}
                                      className={`p-2 rounded-xl border text-center transition-all ${
                                        c.active ? 'bg-[#021c1d] border-[#D9D19B]/60' : 'bg-[#021c1d]/30 border-[#D9D19B]/10 opacity-40'
                                      }`}
                                    >
                                      {c.active ? (
                                        <>
                                          <div className="bg-white p-1.5 rounded-lg w-16 h-16 mx-auto flex items-center justify-center shadow mb-1">
                                            <div className="w-13 h-13 bg-[#121816] rounded flex items-center justify-center text-white text-lg">
                                              {c.icon}
                                            </div>
                                          </div>
                                          <p className="font-mono font-bold text-[0.62rem] text-white truncate">{c.title}</p>
                                          <p className="font-mono text-[0.52rem] text-[#D9D19B] truncate">{c.hint}</p>
                                        </>
                                      ) : (
                                        <div className="h-20 flex items-center justify-center text-[#D9D19B]/40 font-mono text-[0.55rem]">
                                          Ecke Frei
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Untere Reihe */}
                              <div className="grid grid-cols-2 gap-3">
                                {(['bl', 'br'] as const).map(k => {
                                  const c = cornerQrs[k]
                                  return (
                                    <div
                                      key={k}
                                      className={`p-2 rounded-xl border text-center transition-all ${
                                        c.active ? 'bg-[#021c1d] border-[#D9D19B]/60' : 'bg-[#021c1d]/30 border-[#D9D19B]/10 opacity-40'
                                      }`}
                                    >
                                      {c.active ? (
                                        <>
                                          <div className="bg-white p-1.5 rounded-lg w-16 h-16 mx-auto flex items-center justify-center shadow mb-1">
                                            <div className="w-13 h-13 bg-[#121816] rounded flex items-center justify-center text-white text-lg">
                                              {c.icon}
                                            </div>
                                          </div>
                                          <p className="font-mono font-bold text-[0.62rem] text-white truncate">{c.title}</p>
                                          <p className="font-mono text-[0.52rem] text-[#D9D19B] truncate">{c.hint}</p>
                                        </>
                                      ) : (
                                        <div className="h-20 flex items-center justify-center text-[#D9D19B]/40 font-mono text-[0.55rem]">
                                          Ecke Frei
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Insider Easter-Egg Box */}
                          <div className="p-2.5 rounded-xl bg-[#021c1d] border border-[#D9D19B]/40 text-left space-y-1">
                            <p className="font-mono text-[0.6rem] font-bold text-[#D9D19B]">✦ LOKALER INSIDER-HINT &amp; EASTER-EGG:</p>
                            <p className="font-serif text-[0.7rem] italic text-white leading-tight">
                              {b2bForm.secretSpecial || activeInd.hint}
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
                    )
                  })()}
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
                      Dein exklusives Insider-Special für App-Nutzer (Secret Dish, Tasting-Vorteil, Board-Rabatt etc.)
                    </label>
                    <input
                      type="text"
                      value={b2bForm.secretSpecial}
                      onChange={e => setB2bForm({ ...b2bForm, secretSpecial: e.target.value })}
                      placeholder="z. B. Secret Dessert der Großmutter, unetikettierter Hauswein, 10% Surfboard-Rabatt"
                      className="field text-sm"
                    />
                    <p className="font-mono text-[0.6rem] text-ink-faint mt-1">
                      💡 Schlage etwas vor, das nicht auf der regulären Karte steht. Reisende lieben Geheimnisse und kommen gezielt deswegen zu dir!
                    </p>
                  </div>

                  {/* Tarif-Auswahl */}
                  <div className="pt-2 border-t border-line space-y-2">
                    <label className="font-mono text-[0.62rem] text-sun uppercase block font-bold">
                      Wähle dein Einstiegs-Paket:
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setB2bForm({ ...b2bForm, planOption: 'quarterly' })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          b2bForm.planOption === 'quarterly'
                            ? 'border-leaf bg-leaf-wash/30 shadow-md ring-1 ring-leaf'
                            : 'border-line bg-card hover:border-leaf/50'
                        }`}
                      >
                        <span className="font-mono text-[0.58rem] font-bold text-leaf block uppercase">⭐ Beliebteste Wahl</span>
                        <p className="font-display text-xs font-bold text-ink">3-Monate Starter</p>
                        <p className="font-mono text-[0.68rem] text-leaf font-bold">29 € / Mo</p>
                        <p className="font-mono text-[0.55rem] text-ink-faint mt-1">
                          (87 € Vorauszahlung) · <strong>Aufsteller 100% GESCHENKT</strong> (0 € Setup)
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setB2bForm({ ...b2bForm, planOption: 'monthly' })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          b2bForm.planOption === 'monthly'
                            ? 'border-leaf bg-leaf-wash/30 shadow-md ring-1 ring-leaf'
                            : 'border-line bg-card hover:border-leaf/50'
                        }`}
                      >
                        <span className="font-mono text-[0.58rem] font-bold text-ink-faint block uppercase">Monatlich Flexibel</span>
                        <p className="font-display text-xs font-bold text-ink">Monats-Abo</p>
                        <p className="font-mono text-[0.68rem] text-ink font-bold">29 € / Mo</p>
                        <p className="font-mono text-[0.55rem] text-ink-faint mt-1">
                          + 29 € einmalige Hardware-Pauschale im 1. Monat · Monatlich kündbar
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setB2bForm({ ...b2bForm, planOption: 'digital' })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          b2bForm.planOption === 'digital'
                            ? 'border-leaf bg-leaf-wash/30 shadow-md ring-1 ring-leaf'
                            : 'border-line bg-card hover:border-leaf/50'
                        }`}
                      >
                        <span className="font-mono text-[0.58rem] font-bold text-ink-faint block uppercase">Einstieg / Test</span>
                        <p className="font-display text-xs font-bold text-ink">Digital Test-Host</p>
                        <p className="font-mono text-[0.68rem] text-ink font-bold">14 € / Mo</p>
                        <p className="font-mono text-[0.55rem] text-ink-faint mt-1">
                          Rein digital in Radar &amp; Map · PDF-QR Code zum Ausdrucken
                        </p>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3.5 text-xs font-bold shadow-xl">
                    {b2bForm.planOption === 'quarterly'
                      ? '⭐ 3-Monate Starter buchen (87 € · Acrylglas-Aufsteller 100% GESCHENKT) →'
                      : b2bForm.planOption === 'monthly'
                        ? '📦 Flexibel starten (29 € / Mo + 29 € Hardware-Setup) →'
                        : '📱 Digitalen Test-Host starten (14 € / Mo · Sofort aktiv) →'}
                  </button>

                  {/* Steuerhinweis Einzelunternehmen */}
                  <div className="p-2.5 rounded-xl bg-paper-deep border border-sun text-center space-y-1">
                    <p className="font-mono text-[0.62rem] text-sun font-bold">
                      ⚖️ Steuerhinweis Einzelunternehmen (§ 19 UStG)
                    </p>
                    <p className="font-mono text-[0.58rem] text-ink-faint leading-tight">
                      Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und ausgewiesen (Kleinunternehmerstatus). Endpreise. Du erhältst eine ordnungsgemäße Rechnung für deine Buchhaltung.
                    </p>
                  </div>
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
