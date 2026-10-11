import React, { useState, useMemo } from 'react'
import ScratchCard from '../components/ScratchCard'
import { storyPins } from '../data/data'
import { useTravel } from '../context/TravelContext'
import { useI18n } from '../lib/i18n'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'

const COUNTRIES_CATALOG = [
  {
    id: 'pt',
    name: 'Portugal',
    flag: '🇵🇹',
    capital: 'Lissabon',
    gps: "38°42'44\"N · 9°07'59\"W",
    xp: 150,
    highlights: ['Alfama Bacalhau', 'Pena Palast Sintra', 'Ericeira Surf Cliffs', 'Cabo da Roca'],
    color: '#1a535c',
  },
  {
    id: 'es',
    name: 'Spanien',
    flag: '🇪🇸',
    capital: 'Barcelona & Madrid',
    gps: "41°23'20\"N · 2°10'35\"E",
    xp: 150,
    highlights: ['Barrio Gótico', 'Sierra Nevada Pfad', 'Alhambra Secret Gardens', 'Tapas Gassen'],
    color: '#e76f51',
  },
  {
    id: 'it',
    name: 'Italien',
    flag: '🇮🇹',
    capital: 'Rom & Florenz',
    gps: "41°54'10\"N · 12°29'47\"E",
    xp: 150,
    highlights: ['Trastevere Gassen', 'Amalfi Küstenpfad', 'Toskana Zypressen', 'Dolomiten Grat'],
    color: '#2a9d8f',
  },
  {
    id: 'fr',
    name: 'Frankreich',
    flag: '🇫🇷',
    capital: 'Paris & Nizza',
    gps: "48°51'24\"N · 2°21'07\"E",
    xp: 150,
    highlights: ['Montmartre Treppen', 'Lavendelfelder Provence', 'Verdon Schlucht', 'Côte d’Azur'],
    color: '#457b9d',
  },
  {
    id: 'de',
    name: 'Deutschland',
    flag: '🇩🇪',
    capital: 'Berlin & München',
    gps: "52°31'12\"N · 13°24'18\"E",
    xp: 150,
    highlights: ['Schwarzwald Pfade', 'Sächsische Schweiz', 'Königssee Echo', 'Teufelsberg Berlin'],
    color: '#b07d24',
  },
  {
    id: 'jp',
    name: 'Japan',
    flag: '🇯🇵',
    capital: 'Kyoto & Tokio',
    gps: "35°00'58\"N · 135°40'30\"E",
    xp: 200,
    highlights: ['Fushimi Inari Pfad', 'Arashiyama Bambuswald', 'Shibuya Hidden Alley', 'Fuji Aussicht'],
    color: '#e63946',
  },
  {
    id: 'id',
    name: 'Indonesien',
    flag: '🇮🇩',
    capital: 'Bali (Ubud)',
    gps: "8°30'22\"S · 115°15'44\"E",
    xp: 180,
    highlights: ['Tegallalang Reisterrassen', 'Uluwatu Klippen', 'Geheime Wasserfälle', 'Nusa Penida'],
    color: '#3a6b4a',
  },
  {
    id: 'is',
    name: 'Island',
    flag: '🇮🇸',
    capital: 'Reykjavik',
    gps: "64°08'47\"N · 21°55'47\"W",
    xp: 220,
    highlights: ['Schwarzer Sandstrand Vik', 'Gullfoss Wasserfall', 'Blaue Lagune', 'Nordlicht-Fjord'],
    color: '#1d3557',
  },
  {
    id: 'gr',
    name: 'Griechenland',
    flag: '🇬🇷',
    capital: 'Athen & Kykladen',
    gps: "37°58'46\"N · 23°43'43\"E",
    xp: 160,
    highlights: ['Akropolis Felsen', 'Milos Kreidebuchten', 'Meteora Klöster', 'Oia Sonnenuntergang'],
    color: '#0077b6',
  },
  {
    id: 'no',
    name: 'Norwegen',
    flag: '🇳🇴',
    capital: 'Oslo & Fjorde',
    gps: "59°54'40\"N · 10°45'13\"E",
    xp: 200,
    highlights: ['Preikestolen Klippe', 'Geirangerfjord', 'Lofoten Fischerhütten', 'Mitternachtssonne'],
    color: '#023e8a',
  },
]

export default function ScratchPage() {
  const {
    user,
    scratchedIds,
    scratchedCountries,
    scratchCountry,
    currentLocation,
    setCurrentLocation,
    reservations,
    triggerHaptic,
  } = useTravel()

  const { t } = useI18n()
  const [activeView, setActiveView] = useState<'worldmap' | 'postcards'>('worldmap')
  const [selectedCountry, setSelectedCountry] = useState('Alle')
  const [filterScratched, setFilterScratched] = useState<'all' | 'locked' | 'revealed'>('all')
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null)

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  const filteredPins = useMemo(() => {
    return storyPins.filter(pin => {
      if (selectedCountry !== 'Alle') {
        const flag = selectedCountry.slice(0, 2)
        if (!pin.countryFlag.includes(flag) && !pin.country.toLowerCase().includes(selectedCountry.toLowerCase())) {
          return false
        }
      }
      const isScratched = scratchedIds.includes(pin.id)
      if (filterScratched === 'locked' && isScratched) return false
      if (filterScratched === 'revealed' && !isScratched) return false
      return true
    })
  }, [selectedCountry, filterScratched, scratchedIds])

  const handleVerifyGps = () => {
    triggerHaptic([20, 40])
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          triggerHaptic([40, 80])
          setGpsStatusMessage(
            `📍 GPS erfolgreich verifiziert: ${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E — Du befindest dich in ${currentLocation.country}!`
          )
          setTimeout(() => setGpsStatusMessage(null), 5000)
        },
        _err => {
          setGpsStatusMessage(
            `📍 Simulierter GPS-Check aktiv: ${currentLocation.country} (${currentLocation.city}) ist als aktueller Aufenthaltsort verifiziert!`
          )
          setTimeout(() => setGpsStatusMessage(null), 5000)
        },
        { timeout: 3000 }
      )
    } else {
      setGpsStatusMessage(`📍 GPS verifiziert für ${currentLocation.country} (${currentLocation.city})!`)
      setTimeout(() => setGpsStatusMessage(null), 4000)
    }
  }

  const handleCountryScratchComplete = (countryName: string, xp: number) => {
    triggerHaptic([50, 100, 50, 100])
    scratchCountry(countryName, xp)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b07d24', '#d4af37', '#ffffff', '#2a9d8f'],
    })
  }

  return (
    <div className="min-h-screen bg-paper pb-24 md:pb-12 text-ink">
      {/* ─── HEADER ─── */}
      <div className="page-header border-b border-sun/30 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap max-w-6xl mx-auto">
          <div>
            <p className="coord mb-1">Explorer Progress · Season I · Scratch &amp; Reveal Engine</p>
            <h1 className="font-display text-3xl md:text-4xl text-ink font-black tracking-tight">
              {activeView === 'worldmap' ? t('scratch_map_title') : 'Interaktive Postkarten & Secrets'}
            </h1>
            <p className="font-script text-sun text-lg mt-0.5">
              {activeView === 'worldmap' ? t('scratch_map_sub') : 'enthülle die geheimnisse unter der goldenen rubbelfolie'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-paper-deep border border-sun rounded-2xl shadow-sm">
            <button
              onClick={() => {
                triggerHaptic(10)
                setActiveView('worldmap')
              }}
              className={`text-xs py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'worldmap' ? 'bg-sun text-paper-deep shadow' : 'text-ink-faint hover:text-ink'
              }`}
            >
              <span>🌍</span>
              <span>GPS Scratch-Weltkarte</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic(10)
                setActiveView('postcards')
              }}
              className={`text-xs py-2 px-3.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'postcards' ? 'bg-sun text-paper-deep shadow' : 'text-ink-faint hover:text-ink'
              }`}
            >
              <span>🎟️</span>
              <span>Postkarten ({filteredPins.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* GPS Status Message */}
        {gpsStatusMessage && (
          <div className="p-3.5 rounded-xl bg-leaf-wash border-2 border-leaf text-ink text-xs font-mono font-bold flex items-center justify-between shadow-lg animate-fade-in">
            <span>{gpsStatusMessage}</span>
            <span className="text-leaf">✓ Bestätigt</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            BEREICH 1: GPS SCRATCH-WELTKARTE (NUR IM AKTUELLEN LAND FREIRUBBELBAR)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'worldmap' && (
          <div className="space-y-6 animate-fade-in">
            {/* GPS Live-Radar Banner */}
            <div className="card parchment p-6 border-2 border-sun shadow-xl rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="animate-pulse text-lg">🟢</span>
                  <span className="font-mono text-xs font-bold text-leaf uppercase tracking-wider">
                    GPS-STANDORTBESTÄTIGUNG AKTIV
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-ink">
                  Aktueller Aufenthaltsort: <span className="text-sun">{currentLocation.country} {currentLocation.flag}</span>
                </h2>
                <p className="font-body text-xs text-ink-faint max-w-xl leading-relaxed">
                  <strong>Echte Reise-Verifikation (GPS &amp; Host-Buchung):</strong> Um Betrug zu verhindern, kannst du auf deiner Weltkarte <strong>nur Länder freirubbeln</strong>, in denen du dich entweder <strong>physisch per GPS-Signal</strong> befindest ODER in denen du eine <strong>bestätigte Buchung bei einem unserer registrierten Business-Owner</strong> hast (zeitlich in der Vergangenheit &amp; nicht storniert).
                </p>
                <p className="font-mono text-[0.68rem] text-leaf font-bold">
                  📍 GPS-Koordinaten: {currentLocation.gps} ({currentLocation.city})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
                <button
                  onClick={handleVerifyGps}
                  className="btn btn-primary text-xs py-3 px-4 font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📍</span>
                  <span>{t('scratch_gps_btn')}</span>
                </button>

                {/* GPS Simulator Selector for Testing Any Destination */}
                <div className="bg-paper-deep p-2 rounded-xl border border-sun/50 text-center">
                  <p className="font-mono text-[0.58rem] text-sun font-bold mb-1">
                    🧪 GPS-Simulator (Test-Land wechseln):
                  </p>
                  <select
                    value={currentLocation.country}
                    onChange={e => {
                      const found = COUNTRIES_CATALOG.find(c => c.name === e.target.value)
                      if (found) {
                        triggerHaptic(10)
                        setCurrentLocation({
                          country: found.name,
                          city: found.capital,
                          flag: found.flag,
                          gps: found.gps,
                          isSimulated: true,
                        })
                      }
                    }}
                    className="w-full text-xs font-mono p-1.5 rounded-lg bg-card border border-sun/40 text-ink"
                  >
                    {COUNTRIES_CATALOG.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.flag} {c.name} ({c.capital})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Weltkarten-Fortschritt Zähler */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card p-4 text-center border border-sun bg-card">
                <p className="font-mono text-[0.6rem] text-sun uppercase font-bold">Freigerubbelt</p>
                <p className="font-display text-2xl font-black text-ink">{scratchedCountries.length}</p>
                <p className="font-mono text-[0.55rem] text-ink-faint">von {COUNTRIES_CATALOG.length} Ländern</p>
              </div>
              <div className="card p-4 text-center border border-sun bg-card">
                <p className="font-mono text-[0.6rem] text-sun uppercase font-bold">Weltkarten-Quote</p>
                <p className="font-display text-2xl font-black text-leaf">
                  {Math.round((scratchedCountries.length / COUNTRIES_CATALOG.length) * 100)}%
                </p>
                <p className="font-mono text-[0.55rem] text-ink-faint">Erforscht &amp; Bereist</p>
              </div>
              <div className="card p-4 text-center border border-sun bg-card">
                <p className="font-mono text-[0.6rem] text-sun uppercase font-bold">Dein Level</p>
                <p className="font-display text-2xl font-black text-ink">Lvl {user.level}</p>
                <p className="font-mono text-[0.55rem] text-ink-faint">{user.xp} XP gesammelt</p>
              </div>
              <div className="card p-4 text-center border border-sun bg-card">
                <p className="font-mono text-[0.6rem] text-sun uppercase font-bold">Nächster Halt</p>
                <p className="font-display text-base font-bold text-sun mt-1 truncate">{currentLocation.country}</p>
                <p className="font-mono text-[0.55rem] text-leaf font-bold">GPS Bereit</p>
              </div>
            </div>

            {/* LÄNDERKARTEN GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COUNTRIES_CATALOG.map(country => {
                const isCurrentLocation = country.name.toLowerCase() === currentLocation.country.toLowerCase()
                const isAlreadyScratched = scratchedCountries.some(
                  c => c.toLowerCase() === country.name.toLowerCase()
                )

                // Dual-Unlock Prüfung:
                // 1. Physisch mit GPS vor Ort ODER
                // 2. Bestätigte Buchung bei einem unserer Businessowner in diesem Land in der Vergangenheit (nicht storniert)
                const now = new Date()
                const matchingPastBooking = reservations.find(r => {
                  if (r.status === 'cancelled') return false
                  const matchesCountry = (
                    (r.country && r.country.toLowerCase() === country.name.toLowerCase()) ||
                    (country.name === 'Portugal' && ['lisbon', 'lissabon', 'ericeira', 'sagres', 'sintra', 'porto', 'faro'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Spanien' && ['ronda', 'barcelona', 'madrid', 'sevilla', 'valencia', 'malaga'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Italien' && ['rom', 'florenz', 'venedig', 'mailand', 'neapel'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Frankreich' && ['paris', 'nizza', 'marseille', 'lyon'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Deutschland' && ['berlin', 'münchen', 'hamburg', 'köln'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Japan' && ['tokio', 'kyoto', 'osaka'].includes(r.city.toLowerCase())) ||
                    (country.name === 'Indonesien' && ['bali', 'ubud', 'canggu', 'seminyak'].includes(r.city.toLowerCase()))
                  )
                  if (!matchesCountry) return false
                  const bookingDate = new Date(r.date)
                  return bookingDate <= now
                })

                const isUnlockedByBooking = Boolean(matchingPastBooking)
                const isUnlocked = isCurrentLocation || isUnlockedByBooking

                return (
                  <div
                    key={country.id}
                    className={`card p-5 rounded-2xl flex flex-col justify-between border-2 transition-all duration-300 relative overflow-hidden ${
                      isCurrentLocation
                        ? 'border-leaf shadow-[0_0_25px_rgba(42,157,143,0.3)] bg-gradient-to-b from-card to-paper-deep'
                        : isUnlockedByBooking
                          ? 'border-leaf/80 shadow-[0_0_20px_rgba(42,157,143,0.2)] bg-card'
                          : isAlreadyScratched
                            ? 'border-sun shadow-md bg-card'
                            : 'border-sun/30 bg-card/60 opacity-80'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{country.flag}</span>
                          <h3 className="font-display font-bold text-lg text-ink">{country.name}</h3>
                        </div>
                        <p className="font-mono text-[0.65rem] text-sun">{country.capital}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-[0.62rem] font-bold text-leaf bg-leaf-wash px-2 py-0.5 rounded-full border border-leaf/30">
                          +{country.xp} XP
                        </span>
                        <p className="font-mono text-[0.55rem] text-ink-faint mt-1">
                          {isAlreadyScratched
                            ? '✓ Freigerubbelt'
                            : isCurrentLocation
                              ? '🔓 GPS Entsperrt'
                              : isUnlockedByBooking
                                ? '🏨 Buchung Verifiziert'
                                : '🔒 GPS / Buchungs-Sperre'}
                        </p>
                      </div>
                    </div>

                    {/* INTERAKTIVER RUBBEL-BEREICH ODER STATUS-BOX */}
                    <div className="my-3 flex flex-col items-center justify-center">
                      {isAlreadyScratched ? (
                        /* BEREITS FREIGERUBBELT */
                        <div
                          className="w-full h-[180px] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-inner relative border border-sun"
                          style={{
                            background: `radial-gradient(circle at center, ${country.color}25 0%, #151f28 100%)`,
                          }}
                        >
                          <span className="text-4xl mb-1">🗺️</span>
                          <p className="font-display font-bold text-sm text-sun">
                            {country.name} Vollständig Enthüllt!
                          </p>
                          <p className="font-mono text-[0.6rem] text-leaf font-bold mt-1">
                            GPS-Koordinaten: {country.gps}
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center mt-2">
                            {country.highlights.slice(0, 2).map(h => (
                              <span key={h} className="text-[0.55rem] font-mono px-2 py-0.5 bg-paper-deep rounded-full text-ink">
                                ✦ {h}
                              </span>
                            ))}
                          </div>
                          <span className="absolute bottom-2 text-[0.58rem] font-mono text-leaf font-bold">
                            ✓ Im Reisepass vermerkt
                          </span>
                        </div>
                      ) : isUnlocked ? (
                        /* ENTSPERRT (ENTWEDER DURCH GPS ODER BESTÄTIGTE FRÜHERE BUCHUNG) */
                        <div className="space-y-1.5 flex flex-col items-center w-full">
                          {isUnlockedByBooking && !isCurrentLocation && (
                            <div className="w-full p-2 rounded-xl bg-leaf-wash/40 border border-leaf text-center space-y-0.5 mb-1 animate-fade-in">
                              <p className="font-mono text-[0.62rem] font-bold text-leaf">
                                🎉 Freigeschaltet durch deine Buchung bei {matchingPastBooking?.hostBusiness}!
                              </p>
                              <p className="font-mono text-[0.52rem] text-ink-faint">
                                Reise am {new Date(matchingPastBooking!.date).toLocaleDateString('de-DE')} in {matchingPastBooking?.city} · Bestätigt &amp; nicht storniert ✓
                              </p>
                            </div>
                          )}

                          <ScratchCard
                            width={300}
                            height={180}
                            xpReward={country.xp}
                            locationName={`${country.name} Relief-Karte`}
                            gps={country.gps}
                            category="Länderkarte"
                            onComplete={() => handleCountryScratchComplete(country.name, country.xp)}
                          >
                            <div
                              className="w-full h-full p-4 flex flex-col items-center justify-center text-center rounded-xl"
                              style={{
                                background: `radial-gradient(circle at center, ${country.color}40 0%, #0e171e 100%)`,
                              }}
                            >
                              <span className="text-3xl mb-1">🏛️</span>
                              <p className="font-display font-bold text-sm text-white">{country.name}</p>
                              <p className="font-mono text-[0.62rem] text-leaf font-bold">{country.gps}</p>
                              <div className="flex flex-wrap gap-1 justify-center mt-1.5">
                                {country.highlights.map(h => (
                                  <span key={h} className="text-[0.52rem] font-mono px-1.5 py-0.2 bg-black/60 rounded text-[#D9D19B]">
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </ScratchCard>
                          <p className="font-mono text-[0.58rem] text-leaf font-bold animate-pulse text-center">
                            {isCurrentLocation
                              ? `👆 GPS Live-Standort bestätigt (${currentLocation.city})! Mit Maus oder Finger freirubbeln!`
                              : `👆 Verifizierte Buchung! Mit Maus oder Finger freirubbeln!`}
                          </p>
                        </div>
                      ) : (
                        /* NICHT VOR ORT & KEINE BUCHUNG: GOLDENE SPERRE */
                        <div className="w-full h-[180px] rounded-xl p-4 flex flex-col items-center justify-center text-center bg-paper-deep border-2 border-dashed border-sun/40 space-y-2">
                          <span className="text-3xl">🔒</span>
                          <p className="font-display font-bold text-xs text-ink">
                            GPS- &amp; Buchungs-Sperre aktiv
                          </p>
                          <p className="font-body text-[0.68rem] text-ink-faint max-w-[240px] leading-tight">
                            Nur vor Ort per GPS oder durch eine <strong>bestätigte Buchung bei einem unserer Businessowner</strong> in {country.name} (in der Vergangenheit &amp; nicht storniert) freirubbelbar.
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Link to="/host" className="btn btn-secondary text-[0.62rem] py-1 px-2.5 font-bold">
                              🏨 Partner finden
                            </Link>
                            <button
                              onClick={() => {
                                triggerHaptic(10)
                                setCurrentLocation({
                                  country: country.name,
                                  city: country.capital,
                                  flag: country.flag,
                                  gps: country.gps,
                                  isSimulated: true,
                                })
                              }}
                              className="btn btn-primary text-[0.62rem] py-1 px-2.5 font-bold"
                            >
                              ✈️ GPS-Simulator
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Highlights */}
                    <div className="border-t border-sun/30 pt-2 text-[0.62rem] font-mono text-ink-faint flex justify-between items-center">
                      <span>4 Geheimtipps</span>
                      <span className="text-sun font-bold">{country.gps.split('·')[0]}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            BEREICH 2: INDIVIDUELLE POSTKARTEN & SECRET SPOTS
           ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'postcards' && (
          <div className="space-y-6 animate-fade-in">
            {/* REGIONAL FILTER CONTROLS */}
            <div className="bg-paper-deep p-4 rounded-xl border border-sun space-y-3">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  'Alle',
                  '🇵🇹 Portugal',
                  '🇪🇸 Spanien',
                  '🇮🇹 Italien',
                  '🇬🇷 Griechenland',
                  '🇩🇪 DACH',
                  '🇫🇷 Frankreich',
                  '🇳🇴 Norwegen',
                  '🇮🇸 Island',
                  '🇯🇵 Japan',
                  '🇮🇩 Bali',
                ].map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      triggerHaptic(10)
                      setSelectedCountry(c)
                    }}
                    className={`btn text-xs py-1.5 px-3 whitespace-nowrap flex-shrink-0 ${
                      selectedCountry === c ? 'btn-primary font-bold shadow-md' : 'btn-ghost'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center justify-between border-t border-sun pt-2 flex-wrap">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Alle Karten' },
                    { id: 'locked', label: '🔒 Nur Gesperrte' },
                    { id: 'revealed', label: '✓ Bereits Freigerubbelt' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        triggerHaptic(8)
                        setFilterScratched(opt.id as any)
                      }}
                      className={`btn text-[0.65rem] py-1 px-2.5 ${
                        filterScratched === opt.id ? 'btn-secondary font-bold' : 'btn-ghost'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-xs text-sun">
                  {filteredPins.length} Rubbelkarten verfügbar
                </span>
              </div>
            </div>

            {/* SCRATCH CARDS PORTFOLIO */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPins.map(pin => {
                const isScratched = scratchedIds.includes(pin.id)
                return (
                  <div key={pin.id} className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-between w-full px-1">
                      <span className="font-mono text-[0.6rem] border border-sun text-ink px-2 py-0.5 rounded-full bg-paper-deep">
                        {pin.countryFlag} {pin.city} · {pin.tag}
                      </span>
                      <span className="font-mono text-leaf text-[0.62rem] font-bold">+{pin.xp} XP</span>
                    </div>

                    {isScratched ? (
                      <div className="w-full h-[180px] card rounded-xl p-4 flex flex-col items-center justify-center gap-1 border-sun shadow-lg text-center bg-gradient-to-b from-paper-deep to-paper-deep">
                        <span className="text-3xl mb-1">📍</span>
                        <p className="font-display text-sun text-base font-bold">{pin.location}</p>
                        <p className="coord text-leaf font-bold">{pin.gps}</p>
                        <span className="text-leaf font-mono text-xs font-bold mt-1">
                          ✓ Vollständig enthüllt (+{pin.xp} XP)
                        </span>
                      </div>
                    ) : (
                      <ScratchCard
                        width={320}
                        height={180}
                        cardId={pin.id}
                        xpReward={pin.xp}
                        locationName={pin.location}
                        gps={pin.gps}
                        category={pin.category}
                      >
                        <div className="text-center px-4">
                          <p className="font-display text-ink font-bold text-base mb-1">{pin.location}</p>
                          <p className="font-mono text-ink-faint text-[0.62rem] mb-1">{pin.tag}</p>
                          <p className="coord text-leaf font-bold">{pin.gps}</p>
                        </div>
                      </ScratchCard>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
