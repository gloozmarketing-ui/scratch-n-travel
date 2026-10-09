import React, { useState } from 'react'
import {
  countriesIntelligence,
  threatRadarItems,
  cityLegends,
  CountryIntelligence,
  ThreatCategory,
  ThreatSeverity,
  ThreatItem
} from '../data/travelIntelligence'
import { useTravel } from '../context/TravelContext'
import { useI18n } from '../lib/i18n'
import RadarThreatMap from '../components/RadarThreatMap'

type RadarMainTab = 'radar' | 'country_intel' | 'legends' | 'esim'

export default function Radar() {
  const { triggerHaptic, isProUser, grantCommunityProDays, proDaysRemaining } = useTravel()
  const { lang, t } = useI18n()

  // Selected Country (Default: Portugal, easily switchable to DE, AT, CH etc.)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('PT')
  const [mainTab, setMainTab] = useState<RadarMainTab>('radar')
  const [categoryFilter, setCategoryFilter] = useState<ThreatCategory | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | 'all'>('all')
  const [radarViewMode, setRadarViewMode] = useState<'both' | 'map' | 'list'>('both')
  
  // UI states
  const [showReport, setShowReport] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const [showVipModal, setShowVipModal] = useState(false)
  const [selectedThreatForUnlock, setSelectedThreatForUnlock] = useState<ThreatItem | null>(null)

  const activeCountry = countriesIntelligence.find(c => c.code === selectedCountryCode) || countriesIntelligence[0]

  // Filtered threats
  const countryThreats = threatRadarItems.filter(item => item.countryCode === selectedCountryCode)
  const displayedThreats = countryThreats.filter(item => {
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchSeverity = severityFilter === 'all' || item.severity === severityFilter
    return matchCategory && matchSeverity
  })

  // Filtered legends
  const countryLegends = cityLegends.filter(l => l.countryCode === selectedCountryCode)

  const handleCopyEsim = () => {
    triggerHaptic(15)
    navigator.clipboard.writeText('SCRATCH10')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const handlePlayAudio = (legendId: string) => {
    triggerHaptic(12)
    if (playingAudioId === legendId) {
      setPlayingAudioId(null)
    } else {
      setPlayingAudioId(legendId)
    }
  }

  // Visual Badges for Threat Categories
  const categoryBadge = (cat: ThreatCategory) => {
    switch (cat) {
      case 'crime':
        return { label: '🔴 Kriminalität & Scams', color: 'text-terracotta border-red-500/30 bg-red-500/10' }
      case 'nature':
        return { label: '🟠 Natur & Extremwetter', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' }
      case 'wildlife':
        return { label: '🟡 Wildtiere & Fauna', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' }
      case 'connectivity':
        return { label: '🔵 Connectivity & Notfall', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10' }
    }
  }

  const severityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'high':
        return { label: 'HOHE GEFAHR', color: 'bg-red-500 text-white font-bold' }
      case 'medium':
        return { label: 'MODERAT', color: 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30' }
      case 'advisory':
        return { label: 'HINWEIS', color: 'bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/30' }
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-28 md:pb-12 text-ink">
      {/* ─── HEADER & NOTIFICATION BAR ─── */}
      <div className="page-header border-b border-sun/30 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.68rem] font-mono font-bold bg-terracotta/10 text-terracotta border border-terracotta/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE SAFETY RADAR &amp; CONNECTIVITY
              </span>
              <span className="text-[0.68rem] font-mono text-ink-faint">
                Echtzeit-Gefahren · Notruf-Direktwahl · Stündliche Updates
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-ink font-black tracking-tight">
              Safety Radar &amp; Travel Cockpit
            </h1>
            <p className="font-body text-ink-faint text-sm mt-1 max-w-2xl">
              Farbkodierte Gefahrenwarnungen, unzensierte Kriminalitätszonen, Notrufnummern, Mautregeln und Stadt-Legenden für dein Reiseland.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic(10)
                setShowReport(!showReport)
              }}
              className="btn btn-secondary text-xs font-bold shadow-sm"
            >
              + Vorfall melden (+50 XP)
            </button>
            <button
              onClick={() => setShowVipModal(true)}
              className="btn btn-primary text-xs font-bold shadow-md bg-gradient-to-r from-terracotta to-amber-600"
            >
              ⭐ VIP Explorer Club
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ─── LÄNDER-SCHNELLAUSWAHL (DACH + TOP ZIELE) ─── */}
        <div className="card p-4 border border-sun/40 bg-paper-deep/50 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
              🌍 Reiseland wählen (inkl. DACH-Differenzierung):
            </span>
            <span className="font-mono text-xs text-sun font-bold">
              Aktuell: {activeCountry.flag} {activeCountry.name} ({activeCountry.region})
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {countriesIntelligence.map(c => {
              const isActive = c.code === selectedCountryCode
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    triggerHaptic(8)
                    setSelectedCountryCode(c.code)
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-terracotta text-white border-terracotta shadow-md scale-102'
                      : 'bg-paper text-ink border-sun/30 hover:border-terracotta/50'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span>{c.name}</span>
                  {c.region === 'DACH' && (
                    <span className={`text-[0.6rem] px-1 rounded ${isActive ? 'bg-white/20' : 'bg-ink-faint/10'}`}>
                      DACH
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── QUICK STATUS BANNER FÜR DAS LAND ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Notruf Card */}
          <div className="card p-3 border-2 border-red-500/30 bg-red-500/5 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-mono text-[0.62rem] text-terracotta uppercase font-bold tracking-wider">
                🚨 Notrufnummern ({activeCountry.code})
              </p>
              <span className="text-[0.55rem] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                Verifiziert 2026
              </span>
            </div>

            {/* Euronotruf 112 (EU-Standard) */}
            {activeCountry.emergency.universalEu && (
              <div className="mb-2 pb-1.5 border-b border-red-500/20 flex items-center justify-between">
                <div>
                  <a
                    href="tel:112"
                    className="font-display font-black text-base text-ink hover:text-red-600 transition flex items-center gap-1"
                    title="Europaweiten Euronotruf 112 wählen"
                  >
                    <span>🇪🇺 112</span>
                    <span className="text-[0.55rem] font-sans font-bold bg-terracotta text-white px-1.5 py-0.2 rounded ml-1">
                      Euronotruf
                    </span>
                  </a>
                  <p className="text-[0.55rem] text-ink-faint mt-0.5">
                    EU-weit für Polizei, Rettung &amp; Feuerwehr
                  </p>
                </div>
              </div>
            )}

            {/* Direktwahltasten */}
            <div className="grid grid-cols-3 gap-1 text-center">
              <a
                href={`tel:${activeCountry.emergency.medical}`}
                className="p-1 rounded bg-card border border-red-500/20 hover:border-red-500 text-ink block"
                title="Rettungsdienst / Notarzt anrufen"
              >
                <span className="block text-[0.72rem] font-bold text-terracotta">🚑 {activeCountry.emergency.medical}</span>
                <span className="text-[0.55rem] text-ink-faint block">Rettung</span>
              </a>
              <a
                href={`tel:${activeCountry.emergency.fire}`}
                className="p-1 rounded bg-card border border-red-500/20 hover:border-red-500 text-ink block"
                title="Feuerwehr anrufen"
              >
                <span className="block text-[0.72rem] font-bold text-terracotta">🚒 {activeCountry.emergency.fire}</span>
                <span className="text-[0.55rem] text-ink-faint block">Feuer</span>
              </a>
              <a
                href={`tel:${activeCountry.emergency.police}`}
                className="p-1 rounded bg-card border border-red-500/20 hover:border-red-500 text-ink block"
                title="Polizei anrufen"
              >
                <span className="block text-[0.72rem] font-bold text-terracotta">🚓 {activeCountry.emergency.police}</span>
                <span className="text-[0.55rem] text-ink-faint block">Polizei</span>
              </a>
            </div>
            {activeCountry.emergency.mountainOrSea && (
              <p className="text-[0.58rem] text-terracotta mt-1.5 font-mono text-center truncate" title={activeCountry.emergency.mountainOrSea}>
                ⛰️ {activeCountry.emergency.mountainOrSea}
              </p>
            )}
          </div>

          {/* Trinkwasser */}
          <div className="card p-3.5 border border-sky-500/20 bg-sky-500/5">
            <p className="font-mono text-[0.62rem] text-sky-500 uppercase font-bold tracking-wider mb-1">
              💧 Leitungswasser
            </p>
            <p className="font-display font-bold text-sm text-ink flex items-center gap-1.5">
              {activeCountry.tapWater.drinkable ? '✅ 100% Trinkbar' : '⚠️ Vorsicht / Filtern'}
            </p>
            <p className="text-[0.68rem] text-ink-faint mt-1 line-clamp-1" title={activeCountry.tapWater.note}>
              {activeCountry.tapWater.rating}
            </p>
          </div>

          {/* Bargeld / Kartenzahlung */}
          <div className="card p-3.5 border border-amber-500/20 bg-amber-500/5">
            <p className="font-mono text-[0.62rem] text-amber-500 uppercase font-bold tracking-wider mb-1">
              💳 Zahlungsmittel ({activeCountry.currency})
            </p>
            <p className="font-display font-bold text-sm text-ink truncate" title={activeCountry.payment.headline}>
              {activeCountry.payment.headline}
            </p>
            <p className="text-[0.68rem] text-ink-faint mt-1 line-clamp-1" title={activeCountry.payment.tip}>
              {activeCountry.payment.tip}
            </p>
          </div>

          {/* Maut & Straßen */}
          <div className="card p-3.5 border border-purple-500/20 bg-purple-500/5">
            <p className="font-mono text-[0.62rem] text-purple-400 uppercase font-bold tracking-wider mb-1">
              🛣️ Maut &amp; Vignetten
            </p>
            <p className="font-display font-bold text-sm text-ink truncate">
              {activeCountry.roadAndTransit.tollRequired ? '⚠️ Mautpflichtig' : '✅ Keine PKW-Maut'}
            </p>
            <p className="text-[0.68rem] text-ink-faint mt-1 line-clamp-1" title={activeCountry.roadAndTransit.tip}>
              {activeCountry.roadAndTransit.tollType || activeCountry.roadAndTransit.tip}
            </p>
          </div>
        </div>

        {/* ─── VORFALL-MELDEN MODAL / FORM ─── */}
        {showReport && (
          <div className="card p-6 border-2 border-terracotta bg-paper shadow-2xl animate-fade-in">
            <h2 className="font-display text-xl font-black text-ink mb-2">
              🚨 Neuen Vorfall / Gefahrenmeldung für {activeCountry.name} melden
            </h2>
            <p className="font-body text-xs text-ink-faint mb-4">
              Deine Meldung wird vom Hermes Safety Core verifiziert und nach Bestätigung farbkodiert auf der Live-Karte angezeigt.
            </p>

            {reportSubmitted ? (
              <div className="text-center py-6 bg-leaf-wash rounded-xl border border-leaf">
                <span className="text-3xl">🎉</span>
                <p className="font-display font-bold text-base text-ink mt-2">Meldung erfolgreich eingereicht (+50 XP)</p>
                <p className="font-body text-xs text-leaf font-bold mt-1">
                  🤝 Give &amp; Take Belohnung: Dir wurden <strong>+7 Tage VIP Radar Shield Pass</strong> gutgeschrieben!
                </p>
                <p className="font-body text-[0.72rem] text-ink-faint mt-1">
                  Alle Mikro-Gefahrenzonen und Kriminalitäts-Details sind für dich nun freigeschaltet.
                </p>
                <button
                  onClick={() => {
                    setShowReport(false)
                    setReportSubmitted(false)
                  }}
                  className="btn btn-primary text-xs mt-3 shadow-md"
                >
                  Zurück zum Radar
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-ink-faint uppercase tracking-wider block mb-1">
                    Gefahren-Kategorie
                  </label>
                  <select className="field text-xs">
                    <option>🔴 Kriminalität / Betrug / Fake-Polizei</option>
                    <option>🟠 Naturgefahr (Flut, Lawine, Klippenabbruch)</option>
                    <option>🟡 Gefährliche Wildtiere (Quallen, Zecken, Bären)</option>
                    <option>🔵 Connectivity / Roaming-Falle / Straßensperre</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-ink-faint uppercase tracking-wider block mb-1">
                    Genaue Ortschaft &amp; Region
                  </label>
                  <input className="field text-xs" placeholder={`z. B. ${activeCountry.name}, Stadtviertel...`} />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-ink-faint uppercase tracking-wider block mb-1">
                    Was ist passiert &amp; wie weicht man aus?
                  </label>
                  <textarea
                    className="field h-20 text-xs resize-none"
                    placeholder="Beschreibe die konkrete Gefahr, typische Täter-Maschen oder alternative sichere Routen..."
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    onClick={() => {
                      triggerHaptic([15, 30, 15])
                      grantCommunityProDays(7, 'Gefahr im Radar gemeldet')
                      setReportSubmitted(true)
                    }}
                    className="btn btn-primary text-xs font-bold flex-1 shadow-md"
                  >
                    Meldung absenden (+50 XP &amp; +7 Tage VIP Pass 🛡️)
                  </button>
                  <button onClick={() => setShowReport(false)} className="btn btn-ghost text-xs">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── HAUPT-TABS ─── */}
        <div className="flex items-center gap-2 border-b border-sun/40 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'radar', label: '🛡️ Farbkodiertes Gefahren-Radar', count: countryThreats.length },
            { id: 'country_intel', label: '📋 Reise-Sicherheit & Notfall-Guide' },
            { id: 'legends', label: '📜 Stadt-Legenden & Mythen (Guide-Modus)', count: countryLegends.length },
            { id: 'esim', label: `📶 eSIM & Connectivity (${activeCountry.name})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                triggerHaptic(8)
                setMainTab(t.id as RadarMainTab)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                mainTab === t.id
                  ? 'bg-ink text-white shadow-md'
                  : 'bg-paper text-ink-faint hover:text-ink hover:bg-paper-deep'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`text-[0.65rem] px-1.5 py-0.2 rounded-full ${mainTab === t.id ? 'bg-white/20' : 'bg-sun/20'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: FARBKODIERTES GEFAHREN-RADAR & INTERAKTIVE KARTE
           ═══════════════════════════════════════════════════════════════════ */}
        {mainTab === 'radar' && (
          <div className="space-y-5 animate-fade-in">
            {/* ── Status Banner (VIP Shield vs Basis / Give & Take) ── */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isProUser
                ? 'bg-leaf-wash border-leaf text-ink shadow-sm'
                : 'bg-paper-deep border-sun/60 text-ink shadow-sm'
            }`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isProUser ? '🛡️' : '⚡'}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-bold text-sm text-ink">
                        {isProUser
                          ? `VIP Radar Shield Aktiv ${proDaysRemaining > 0 ? `· Noch ${proDaysRemaining} Tage aktiv via Give & Take` : '· Pro Mitglied'}`
                          : 'Basis-Radar aktiv (3 Kern-Gefahren frei) · VIP Mikro-Hotspots gesperrt'}
                      </p>
                      {isProUser && (
                        <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full bg-leaf text-white font-bold">
                          VOLLZUGRIFF
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-ink-faint mt-0.5">
                      {isProUser
                        ? 'Du siehst alle unzensierten Kriminalitätszonen, K.O.-Tropfen Lokale und exakte Ausweichkorridore.'
                        : 'Schalte detaillierte Scam-Gassen frei (2,99 €/Monat) oder verdiene dir den VIP Pass 100% kostenlos durch 1 Tipp (+14 Tage Give & Take)!'}
                    </p>
                  </div>
                </div>

                {!isProUser && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedThreatForUnlock(countryThreats.find(t => t.isProOnly) || null)
                        setShowVipModal(true)
                      }}
                      className="btn btn-primary text-xs py-2 px-3 font-bold shadow-md bg-gradient-to-r from-amber-500 to-sun-bright text-ink"
                    >
                      🛡️ VIP Shield freischalten
                    </button>
                    <button
                      onClick={() => {
                        triggerHaptic(8)
                        setShowReport(true)
                      }}
                      className="btn btn-secondary text-xs py-2 px-3 font-bold"
                    >
                      🤝 +1 Vorfall melden (+7 Tage Pass)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Filterleiste & Ansicht-Umschalter ── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-ink-faint font-bold">Filter:</span>
                {[
                  { id: 'all', label: 'Alle' },
                  { id: 'crime', label: '🔴 Kriminalität' },
                  { id: 'nature', label: '🟠 Natur & Wetter' },
                  { id: 'wildlife', label: '🟡 Wildtiere' },
                  { id: 'connectivity', label: '🔵 Connectivity' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      triggerHaptic(5)
                      setCategoryFilter(f.id as ThreatCategory | 'all')
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                      categoryFilter === f.id
                        ? 'bg-ink text-white border-ink shadow'
                        : 'bg-paper text-ink-faint border-sun/30 hover:border-ink'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Ansicht-Umschalter (Karte / Liste) */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-paper-deep p-1 rounded-xl border border-line">
                  <button
                    onClick={() => setRadarViewMode('both')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      radarViewMode === 'both' ? 'bg-ink text-white shadow-sm' : 'text-ink-faint hover:text-ink'
                    }`}
                  >
                    ⚡ Karte &amp; Liste
                  </button>
                  <button
                    onClick={() => setRadarViewMode('map')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      radarViewMode === 'map' ? 'bg-ink text-white shadow-sm' : 'text-ink-faint hover:text-ink'
                    }`}
                  >
                    🗺️ Nur Karte
                  </button>
                  <button
                    onClick={() => setRadarViewMode('list')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      radarViewMode === 'list' ? 'bg-ink text-white shadow-sm' : 'text-ink-faint hover:text-ink'
                    }`}
                  >
                    📋 Nur Liste
                  </button>
                </div>

                {/* Schweregrad-Filter */}
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  {(['all', 'high', 'medium', 'advisory'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSeverityFilter(s)}
                      className={`px-2 py-0.5 rounded text-[0.68rem] font-mono uppercase ${
                        severityFilter === s ? 'bg-sun text-ink font-bold' : 'text-ink-faint hover:text-ink'
                      }`}
                    >
                      {s === 'all' ? 'Alle' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 🗺️ INTERAKTIVE GEFAHRENKARTE (LEAFLET LAZY) ── */}
            {(radarViewMode === 'both' || radarViewMode === 'map') && (
              <div className="animate-fade-in">
                <RadarThreatMap
                  countryCode={selectedCountryCode}
                  threats={displayedThreats}
                  isProUser={isProUser}
                  onUnlockPro={(thr) => {
                    setSelectedThreatForUnlock(thr)
                    setShowVipModal(true)
                  }}
                  height={radarViewMode === 'map' ? '540px' : '420px'}
                />
              </div>
            )}

            {/* Warnung bei Roaming für Nicht-EU */}
            {activeCountry.connectivity.roamingWarning && (
              <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-display font-bold text-sm text-ink">Wichtiger Kosten-Hinweis für {activeCountry.name}</p>
                  <p className="font-body text-xs text-ink-faint mt-0.5 leading-relaxed">
                    {activeCountry.connectivity.roamingWarning}
                  </p>
                </div>
              </div>
            )}

            {/* ── 📋 GEFAHREN-LISTE ── */}
            {(radarViewMode === 'both' || radarViewMode === 'list') && (
              <>
                {displayedThreats.length === 0 ? (
                  <div className="card p-12 text-center border border-dashed border-sun">
                    <span className="text-4xl block mb-2">🛡️</span>
                    <p className="font-display text-lg font-bold text-ink">Keine aktiven Gefahren in diesem Filter</p>
                    <p className="font-body text-xs text-ink-faint mt-1">
                      Für {activeCountry.name} liegen aktuell keine verifizierten Meldungen in dieser Kategorie vor.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {displayedThreats.map(thr => {
                      const catB = categoryBadge(thr.category)
                      const sevB = severityBadge(thr.severity)
                      const isLocked = Boolean(thr.isProOnly && !isProUser)

                      return (
                        <div
                          key={thr.id}
                          className={`card p-5 border-2 transition-all hover:shadow-md flex flex-col justify-between ${
                            isLocked
                              ? 'border-sun bg-amber-500/5 shadow-sm'
                              : thr.severity === 'high'
                              ? 'border-red-500/30 bg-red-500/5'
                              : thr.severity === 'medium'
                              ? 'border-amber-500/30 bg-amber-500/5'
                              : 'border-emerald-500/30 bg-emerald-500/5'
                          }`}
                        >
                          <div>
                            {/* Header der Karte */}
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <span className={`text-[0.62rem] font-mono px-2.5 py-0.5 rounded-full border ${catB.color} font-bold`}>
                                {catB.label}
                              </span>
                              {isLocked ? (
                                <span className="text-[0.6rem] font-mono px-2 py-0.5 rounded-full bg-sun-bright text-ink font-bold border border-sun">
                                  🔒 VIP SHIELD
                                </span>
                              ) : (
                                <span className={`text-[0.6rem] font-mono px-2 py-0.5 rounded-full ${sevB.color}`}>
                                  {sevB.label}
                                </span>
                              )}
                            </div>

                            {/* Titel & Ort */}
                            <div className="flex items-start gap-2.5 my-2">
                              <span className="text-2xl flex-shrink-0">{thr.icon}</span>
                              <div>
                                <h3 className="font-display text-base font-bold text-ink leading-snug">
                                  {thr.title}
                                </h3>
                                <p className="coord text-[0.68rem] text-sun mt-0.5">
                                  📍 {thr.area}
                                </p>
                              </div>
                            </div>

                            {/* Beschreibung */}
                            <p className="font-body text-xs text-ink-faint leading-relaxed my-2">
                              {thr.desc}
                            </p>

                            {/* Ausweichempfehlung oder Lock-Box */}
                            {isLocked ? (
                              <div className="bg-amber-500/10 p-3 rounded-lg border border-sun/50 my-2">
                                <p className="font-mono text-[0.62rem] text-terracotta uppercase font-bold tracking-wider mb-0.5">
                                  🔒 VIP Radar Shield Schutzbereich:
                                </p>
                                <p className="font-body text-xs text-ink font-semibold leading-relaxed">
                                  {thr.proShieldReason || 'Exakter GPS-Gefahrenradius, Täter-Maschen & sichere Ausweichrouten.'}
                                </p>
                                <button
                                  onClick={() => {
                                    setSelectedThreatForUnlock(thr)
                                    setShowVipModal(true)
                                  }}
                                  className="btn btn-primary text-xs py-2 px-3 font-bold mt-2 w-full shadow-md"
                                >
                                  🛡️ Diese Mikro-Gefahrenzone freischalten
                                </button>
                              </div>
                            ) : (
                              <div className="bg-paper-deep/80 p-3 rounded-lg border border-sun/30 my-2">
                                <p className="font-mono text-[0.62rem] text-terracotta uppercase font-bold tracking-wider mb-0.5">
                                  💡 Handlungsempfehlung:
                                </p>
                                <p className="font-body text-xs text-ink font-medium leading-relaxed">
                                  {thr.advice}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-[0.65rem] font-mono text-ink-faint pt-2 border-t border-sun/20">
                            <span>🕒 {thr.timeAgo}</span>
                            <span className="text-emerald-600 font-bold">
                              ✓ {thr.verifiedReports} Bestätigungen
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: REISE-SICHERHEIT & NOTFALL-GUIDE
           ═══════════════════════════════════════════════════════════════════ */}
        {mainTab === 'country_intel' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6 border border-sun">
              <h2 className="font-display text-2xl font-black text-ink mb-1 flex items-center gap-2">
                <span>{activeCountry.flag}</span>
                <span>Länder-Sicherheits-Dossier: {activeCountry.name}</span>
              </h2>
              <p className="font-body text-xs text-ink-faint mb-6">
                Alles, worauf Individual-Touristen und Backpacker in {activeCountry.name} achten müssen.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Notruf Cockpit */}
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                  <h3 className="font-display font-bold text-base text-terracotta flex items-center gap-2">
                    <span>🚨</span> Notrufnummern mit Schnellwahl
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-red-500/20">
                      <span className="text-ink-faint">Polizei:</span>
                      <a href={`tel:${activeCountry.emergency.police}`} className="font-mono font-bold text-ink hover:text-terracotta text-sm">
                        📞 {activeCountry.emergency.police}
                      </a>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-red-500/20">
                      <span className="text-ink-faint">Rettung / Notarzt:</span>
                      <a href={`tel:${activeCountry.emergency.medical}`} className="font-mono font-bold text-ink hover:text-terracotta text-sm">
                        🚑 {activeCountry.emergency.medical}
                      </a>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-red-500/20">
                      <span className="text-ink-faint">Feuerwehr:</span>
                      <a href={`tel:${activeCountry.emergency.fire}`} className="font-mono font-bold text-ink hover:text-terracotta text-sm">
                        🚒 {activeCountry.emergency.fire}
                      </a>
                    </div>
                    {activeCountry.emergency.mountainOrSea && (
                      <div className="flex justify-between items-center py-1 border-b border-red-500/20">
                        <span className="text-ink-faint">Bergrettung / Seenot:</span>
                        <span className="font-mono font-bold text-terracotta">
                          {activeCountry.emergency.mountainOrSea}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trinkwasser Details */}
                <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 space-y-3">
                  <h3 className="font-display font-bold text-base text-sky-500 flex items-center gap-2">
                    <span>💧</span> Trinkwasser &amp; Hygiene
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <p className="font-bold text-ink">
                      Status: {activeCountry.tapWater.rating}
                    </p>
                    <p className="text-ink-faint">
                      {activeCountry.tapWater.note}
                    </p>
                    <div className="p-2.5 rounded-lg bg-white/60 border border-sky-500/20 text-[0.72rem]">
                      💡 <strong>Hermes-Tipp:</strong> {activeCountry.tapWater.drinkable ? 'Wasserflaschen an Brunnen auffüllen spart Plastik und Geld.' : 'Zähneputzen nur mit gefiltertem Wasser, Eiswürfel meiden.'}
                    </div>
                  </div>
                </div>

                {/* Zahlungsmittel */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                  <h3 className="font-display font-bold text-base text-amber-500 flex items-center gap-2">
                    <span>💳</span> Zahlungsmittel &amp; Währung ({activeCountry.currency})
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <p className="font-bold text-ink">
                      {activeCountry.payment.headline}
                    </p>
                    <p className="text-ink-faint">
                      {activeCountry.payment.tip}
                    </p>
                  </div>
                </div>

                {/* Straßen & Maut */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3">
                  <h3 className="font-display font-bold text-base text-purple-400 flex items-center gap-2">
                    <span>🛣️</span> Verkehrsregeln &amp; Maut
                  </h3>
                  <div className="space-y-2 text-xs leading-relaxed">
                    <p className="font-bold text-ink">
                      {activeCountry.roadAndTransit.tollRequired ? activeCountry.roadAndTransit.tollType : 'Mautfreie Autobahnen'}
                    </p>
                    <p className="text-ink-faint">
                      {activeCountry.roadAndTransit.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: STADT-LEGENDEN & GEHEIMNISSE (GUIDE-MODUS)
           ═══════════════════════════════════════════════════════════════════ */}
        {mainTab === 'legends' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-black text-ink">
                  📜 Geheime Stadtlegenden &amp; Mythen ({activeCountry.name})
                </h2>
                <p className="font-body text-xs text-ink-faint mt-0.5">
                  Das, was dir die Touristenführer vor Ort hinter vorgehaltener Hand erzählen — inklusive Audio-Hörproben.
                </p>
              </div>

              <button
                onClick={() => setShowVipModal(true)}
                className="btn btn-secondary text-xs font-bold"
              >
                🎧 Alle Audio-Guides freischalten
              </button>
            </div>

            {countryLegends.length === 0 ? (
              <div className="card p-12 text-center border border-dashed border-sun">
                <span className="text-4xl block mb-2">📜</span>
                <p className="font-display text-lg font-bold text-ink">Legenden für {activeCountry.name} in Recherche</p>
                <p className="font-body text-xs text-ink-faint mt-1">
                  Unser lokales Recherche-Team sammelt gerade alte Stadtarchive. Wechsle zu Portugal, Österreich oder Deutschland!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {countryLegends.map(leg => {
                  const isPlaying = playingAudioId === leg.id
                  return (
                    <div key={leg.id} className="card p-6 border-2 border-sun/60 bg-paper hover:border-terracotta/60 transition shadow-sm">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sun/10 text-sun border border-sun/30 font-bold">
                            {leg.tag}
                          </span>
                          <span className="font-mono text-[0.68rem] text-ink-faint">
                            Zeitalter: {leg.era}
                          </span>
                        </div>

                        {leg.isVipAudio && (
                          <span className="font-mono text-[0.65rem] px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-terracotta text-white font-bold tracking-wider shadow-sm">
                            ⭐ VIP AUDIO-GUIDE ({leg.audioDuration})
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-xl font-bold text-ink mb-1">
                        {leg.title}
                      </h3>
                      <p className="font-script text-sun text-base mb-3">
                        {leg.subtitle} · 📍 {leg.city}
                      </p>

                      <p className="font-body text-xs text-ink-faint leading-relaxed mb-4 italic bg-paper-deep/50 p-3 rounded-lg border-l-4 border-terracotta">
                        "{leg.teaser}"
                      </p>

                      <div className="font-body text-xs text-ink leading-relaxed space-y-2 mb-4">
                        <p>{leg.story}</p>
                      </div>

                      {/* Audio Player Teaser */}
                      {leg.isVipAudio && (
                        <div className="bg-ink/5 p-4 rounded-xl border border-sun/40 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handlePlayAudio(leg.id)}
                              className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-sm shadow hover:scale-105 transition"
                            >
                              {isPlaying ? '⏸️' : '▶️'}
                            </button>
                            <div>
                              <p className="font-display font-bold text-xs text-ink">
                                {isPlaying ? 'Hörprobe läuft...' : `Hörprobe: ${leg.title}`}
                              </p>
                              <p className="font-mono text-[0.62rem] text-ink-faint">
                                Sprecher: Hermes Local Voice · {leg.audioDuration}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setShowVipModal(true)}
                            className="btn btn-primary text-xs py-1.5 px-3 font-bold bg-terracotta"
                          >
                            Vollversion anhören
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: eSIM & CONNECTIVITY
           ═══════════════════════════════════════════════════════════════════ */}
        {mainTab === 'esim' && (
          <div className="space-y-6 animate-fade-in">
            <div className="parchment rounded-2xl p-6 sm:p-8 text-ink shadow-xl border-2 border-terracotta">
              <div className="max-w-3xl">
                <span className="font-mono text-xs text-terracotta font-bold uppercase tracking-wider">
                  Partner-Angebot · 0% Roaming-Kosten · Sofortige Aktivierung
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black mt-1 mb-2">
                  Reise-eSIM für {activeCountry.name} &amp; 190+ Länder
                </h3>
                <p className="font-body text-xs sm:text-sm leading-relaxed mb-4 text-ink-faint">
                  Bleibe in Bergen, Klippenbuchten und Schluchten immer vernetzt für Notfall-GPS und Secret-Spot-Navigation. 
                  Kein physischer SIM-Karten-Tausch nötig — QR-Code scannen und sofort surfen.
                </p>

                <div className="bg-ink-ghost/10 p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap mb-5 border border-terracotta">
                  <div>
                    <p className="font-mono text-xs text-terracotta font-bold">10% Exklusiv-Gutscheincode:</p>
                    <p className="font-display font-black text-2xl text-ink tracking-wider">SCRATCH10</p>
                  </div>
                  <button onClick={handleCopyEsim} className="btn btn-primary text-xs py-2 px-5 font-bold shadow">
                    {copiedCode ? '✓ Rabattcode kopiert!' : 'Code kopieren & einlösen'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-white/70 p-3 rounded-xl border border-terracotta shadow-sm">
                    <p className="font-bold text-terracotta text-sm">{activeCountry.flag} {activeCountry.name}</p>
                    <p className="mt-1">Netz: {activeCountry.connectivity.bestLocalCarrier}</p>
                    <p className="text-ink font-bold mt-1">ab {activeCountry.connectivity.esimPriceFrom}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-xl border border-terracotta shadow-sm">
                    <p className="font-bold text-terracotta text-sm">🇪🇺 Europa Regional</p>
                    <p className="mt-1">39 Länder inkl. CH &amp; UK</p>
                    <p className="text-ink font-bold mt-1">ab € 4,90 / 5 GB</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-xl border border-terracotta shadow-sm">
                    <p className="font-bold text-terracotta text-sm">🌐 Global Pass</p>
                    <p className="mt-1">140+ Länder weltweit</p>
                    <p className="text-ink font-bold mt-1">ab € 8,90 / 10 GB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── VIP EXPLORER CLUB & GIVE & TAKE MODAL ─── */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-lg w-full p-6 border-2 border-sun shadow-2xl relative bg-paper text-ink max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowVipModal(false)
                setSelectedThreatForUnlock(null)
              }}
              className="absolute top-4 right-4 text-ink-faint hover:text-ink font-mono text-base"
            >
              ✕
            </button>

            <span className="font-mono text-xs text-terracotta font-bold uppercase tracking-wider block mb-1">
              🛡️ VIP Radar Shield &amp; Give-and-Take Freischaltung
            </span>
            <h3 className="font-display text-2xl font-black text-ink mb-1">
              {selectedThreatForUnlock ? selectedThreatForUnlock.title : 'VIP Explorer Pass & Live Shield'}
            </h3>
            <p className="font-body text-xs text-ink-faint leading-relaxed mb-4">
              {selectedThreatForUnlock?.proShieldReason
                ? `Schutzbereich: ${selectedThreatForUnlock.proShieldReason}.`
                : 'Schalte unzensierte Kriminalitätszonen, K.O.-Tropfen Lokale, Audio-Stadtlegenden und Offline-Karten frei.'}
            </p>

            {/* Zwei Wege zur Freischaltung */}
            <div className="space-y-4 my-4">
              {/* WEG 1: Give & Take (Kostenlos) */}
              <div className="p-4 rounded-xl border-2 border-leaf bg-leaf-wash">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤝</span>
                  <p className="font-display font-bold text-sm text-leaf">
                    Weg 1: 100% Kostenlos via Give &amp; Take
                  </p>
                </div>
                <p className="font-body text-xs text-ink-faint leading-relaxed mb-3">
                  Teile einen Secret Spot oder melde eine Gefahrenstelle. Für jeden Beitrag erhältst du sofort einen <strong>Community VIP Pro Pass</strong>!
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setShowVipModal(false)
                      setShowReport(true)
                    }}
                    className="btn btn-secondary text-xs py-1.5 px-3 font-bold flex-1 text-center bg-white"
                  >
                    🚨 Vorfall melden (+7 Tage Pro)
                  </button>
                  <a
                    href="/explore"
                    className="btn btn-secondary text-xs py-1.5 px-3 font-bold flex-1 text-center bg-white"
                  >
                    📍 Spot einreichen (+14 Tage Pro)
                  </a>
                </div>
              </div>

              {/* WEG 2: Pro Abo (Sofort ohne Beiträge) */}
              <div className="p-4 rounded-xl border border-sun bg-paper-deep text-center">
                <p className="font-mono text-[0.68rem] text-ink-faint uppercase font-bold">Weg 2: Direkt freischalten</p>
                <p className="font-display text-2xl font-black text-ink my-1">
                  2,99 € <span className="text-xs font-normal text-ink-faint">/ Monat</span>
                </p>
                <p className="font-body text-[0.72rem] text-ink-faint mb-3">
                  Keine Lust selbst Inhalte einzureichen? Sichere dir vollen Zugriff mit dem fairen Monats-Abo (jederzeit kündbar).
                </p>
                <a
                  href="/pricing"
                  className="btn btn-primary text-xs font-bold py-2 px-6 w-full text-center block shadow-md"
                >
                  💳 Jetzt VIP Pass abonnieren (2,99 €)
                </a>
              </div>
            </div>

            <div className="border-t border-line pt-3 flex justify-end">
              <button
                onClick={() => {
                  setShowVipModal(false)
                  setSelectedThreatForUnlock(null)
                }}
                className="btn btn-ghost text-xs"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
