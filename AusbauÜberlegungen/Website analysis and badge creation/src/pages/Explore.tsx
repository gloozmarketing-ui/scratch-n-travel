import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import TravelMap from '../components/TravelMap'
import StoryGeneratorModal from '../components/StoryGeneratorModal'
import ReservationModal from '../components/ReservationModal'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { createGoogleCalendarUrl } from '../utils/calendarExport'
import { storyPins, cities, activities, StoryPin } from '../data/data'
import { useTravel } from '../context/TravelContext'

const cats = ['All', 'Nature', 'Food', 'Surf', 'Culture']
const diffLabels: Record<number, string> = {
  1: 'Sehr leicht',
  2: 'Leicht',
  3: 'Moderat',
  4: 'Anspruchsvoll',
  5: 'Alpin/Extrem',
}

const countriesList = [
  'Alle',
  '🇵🇹 Portugal',
  '🇪🇸 Spanien',
  '🇮🇹 Italien',
  '🇬🇷 Griechenland',
  '🇩🇪 Deutschland / DACH',
  '🇫🇷 Frankreich',
  '🇳🇴 Norwegen',
  '🇮🇸 Island',
  '🇯🇵 Japan',
  '🇮🇩 Indonesien',
]

// Real coordinates mapping helper for European & Global destinations
const geoCoords: Record<string, { lat: number; lng: number }> = {
  Sintra: { lat: 38.798, lng: -9.390 },
  Lissabon: { lat: 38.722, lng: -9.139 },
  Ericeira: { lat: 38.963, lng: -9.417 },
  'Lagos (Algarve)': { lat: 37.102, lng: -8.673 },
  'Pinhão / Douro-Tal': { lat: 41.190, lng: -7.545 },
  'Mallorca (Serra de Tramuntana)': { lat: 39.750, lng: 2.700 },
  'Ronda (Andalusien)': { lat: 36.746, lng: -5.161 },
  'San Sebastián / Baskenland': { lat: 43.318, lng: -1.981 },
  'Dolomiten (Südtirol / Belluno)': { lat: 46.578, lng: 12.138 },
  'Gröden & Kastelruth': { lat: 46.568, lng: 11.558 },
  'Val d\'Orcia (Toskana)': { lat: 43.078, lng: 11.678 },
  'Gramvousa / Chania (Kreta)': { lat: 35.580, lng: 23.590 },
  'Kalambaka / Meteora': { lat: 39.721, lng: 21.630 },
  'Königssee & Berchtesgaden': { lat: 47.550, lng: 12.980 },
  'Schonach & Triberg': { lat: 48.140, lng: 8.200 },
  'Zermatt / Wallis': { lat: 45.980, lng: 7.749 },
  'Antibes & Cannes': { lat: 43.580, lng: 7.125 },
  'La Palud-sur-Verdon': { lat: 43.780, lng: 6.340 },
  'Lofoten / Reine': { lat: 67.930, lng: 13.090 },
  'Vestvågøy (Lofoten)': { lat: 68.200, lng: 13.520 },
  'Hveragerði': { lat: 64.000, lng: -21.180 },
  Kyoto: { lat: 35.011, lng: 135.768 },
  Tokio: { lat: 35.689, lng: 139.691 },
  'Karangasem / Sidemen (Bali)': { lat: -8.487, lng: 115.444 },
}

type DiffFilter = number | 'all'

export default function Explore() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [selectedCountry, setSelectedCountry] = useState('Alle')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState('All')
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDiff, setFilterDiff] = useState<DiffFilter>('all')
  const [searchQ, setSearchQ] = useState('')
  const [extraSpots, setExtraSpots] = useState<StoryPin[]>([])
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [storyModal, setStoryModal] = useState({ isOpen: false, title: '', location: '', gps: '', xp: 100, image: '' })
  const [resModal, setResModal] = useState({ isOpen: false, hostName: '', city: '', category: '' })

  const allPins = useMemo(() => [...extraSpots, ...storyPins], [extraSpots])

  const filtered = useMemo(() => {
    return allPins.filter(p => {
      // Country filter
      if (selectedCountry !== 'Alle') {
        const cClean = selectedCountry.replace(/^[^\s]+\s+/, '')
        if (!p.country.toLowerCase().includes(cClean.toLowerCase()) && !p.countryFlag.includes(selectedCountry.slice(0, 2))) {
          return false
        }
      }
      // City filter
      if (selectedCity && !p.city.toLowerCase().includes(selectedCity.toLowerCase()) && !p.location.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false
      }
      // Category filter
      if (catFilter !== 'All' && p.category !== catFilter) return false
      // Dog filter
      if (filterDog && !p.dogFriendly) return false
      // Stroller filter
      if (filterStroller && !p.strollerFriendly) return false
      // Difficulty filter
      if (filterDiff !== 'all' && p.difficulty !== filterDiff) return false
      // Search
      if (searchQ.trim()) {
        const q = searchQ.toLowerCase()
        return (
          p.location.toLowerCase().includes(q) ||
          p.story.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [allPins, selectedCountry, selectedCity, catFilter, filterDog, filterStroller, filterDiff, searchQ])

  const mapPins = filtered.map((p, i) => {
    const coords = geoCoords[p.city] || { lat: 38.75 + i * 0.05, lng: -9.2 - i * 0.04 }
    return {
      id: p.id,
      title: p.location,
      location: `${p.countryFlag} ${p.city} · ${p.tag}`,
      lat: coords.lat,
      lng: coords.lng,
      category: p.category,
      rating: p.rating,
      xp: p.xp,
      isUnlocked: revealedPins.includes(p.id),
    }
  })

  const diffOptions: DiffFilter[] = ['all', 1, 2, 3, 4, 5]

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">20+ Global Destinations · Verified Dog &amp; Stroller Data · 1–5 Difficulty</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Explore Map &amp; Secret Spots</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">recherchierte Schätze von echten Locals weltweit</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                triggerHaptic(15)
                setIsSubmitOpen(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold shadow-lg"
            >
              + Spot einstellen (+150 XP)
            </button>
            <Link to="/wanderbond" className="btn btn-secondary text-xs py-2 px-3">
              🧬 DNA abgleichen
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        {/* Leaflet Dark Map */}
        <TravelMap pins={mapPins} height="380px" />

        {/* ── COUNTRY & CITY HUB BAR ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-[#F4E4C1]">Länder &amp; Destinationen</h3>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity(null)}
                className="font-mono text-[0.62rem] text-[#C9A84C] hover:underline"
              >
                ✕ Stadt-Filter ({selectedCity}) aufheben
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {countriesList.map(c => (
              <button
                key={c}
                onClick={() => {
                  triggerHaptic(10)
                  setSelectedCountry(c)
                  setSelectedCity(null)
                }}
                className={`btn text-xs py-1.5 px-3.5 whitespace-nowrap flex-shrink-0 ${
                  selectedCountry === c ? 'btn-primary font-bold shadow-md' : 'btn-ghost'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Quick City Hubs Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {cities.slice(0, 12).map(city => (
              <button
                key={city.name}
                onClick={() => {
                  triggerHaptic(8)
                  setSelectedCity(selectedCity === city.name ? null : city.name)
                }}
                className={`text-[0.68rem] font-mono px-2.5 py-1 rounded-full border transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                  selectedCity === city.name
                    ? 'bg-[#C9A84C] text-[#0C1825] border-[#C9A84C] font-bold shadow'
                    : 'bg-[#152539]/80 text-[#8A9AAA] border-[rgba(201,168,76,0.15)] hover:text-[#F4E4C1]'
                }`}
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
                <span className="text-[0.55rem] opacity-75">({city.total})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── COMPREHENSIVE FILTER ENGINE ─────────────────────────────────── */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Suche nach Ort, Bucht, Taverne, Klippe, Land (z. B. Sintra, Dolomiten, Balos, Reine)..."
              className="field flex-1"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterDog(!filterDog)
                }}
                className={`btn text-xs py-2 px-3 ${filterDog ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >
                🐕 Hundefreundlich
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterStroller(!filterStroller)
                }}
                className={`btn text-xs py-2 px-3 ${filterStroller ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >
                👶 Kinderwagen
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap pt-2 border-t border-[rgba(201,168,76,0.1)]">
            <span className="font-mono text-[0.62rem] text-[#8A9AAA] self-center">Schwierigkeit:</span>
            {diffOptions.map(d => (
              <button
                key={String(d)}
                onClick={() => {
                  triggerHaptic(10)
                  setFilterDiff(d)
                }}
                className={`btn text-[0.62rem] py-1 px-2.5 ${filterDiff === d ? 'btn-primary' : 'btn-ghost'}`}
              >
                {d === 'all' ? 'Alle' : `Stufe ${d} (${diffLabels[d as number]})`}
              </button>
            ))}
            <span className="ml-2 font-mono text-[0.62rem] text-[#8A9AAA] self-center">Kategorie:</span>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`btn text-[0.62rem] py-1 px-2.5 ${catFilter === c ? 'btn-primary' : 'btn-ghost'}`}
              >
                {c}
              </button>
            ))}
            <span className="ml-auto font-mono text-[0.65rem] text-[#C9A84C] self-center">
              {filtered.length} Secrets gefunden
            </span>
          </div>
        </div>

        {/* ── PINS GRID ─────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[#F4E4C1] text-xl font-bold">
              Verifizierte Secret Spots ({filtered.length})
            </h2>
            <span className="font-mono text-[0.65rem] text-[#8A9AAA]">
              {selectedCountry !== 'Alle' ? selectedCountry : 'Weltweit'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pin => {
              const unlocked = revealedPins.includes(pin.id)
              return (
                <div key={pin.id} className="card overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-44">
                      <img
                        src={pin.image}
                        alt={pin.location}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[75%]">
                        <span className="font-mono text-[0.58rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.4)] text-[#F4E4C1] px-2 py-0.5 rounded-full font-bold">
                          {pin.countryFlag} {pin.city}
                        </span>
                        {pin.dogFriendly && (
                          <span className="font-mono text-[0.58rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            🐕 Hund
                          </span>
                        )}
                        {pin.strollerFriendly && (
                          <span className="font-mono text-[0.58rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                            👶 Wagen
                          </span>
                        )}
                        <span className="font-mono text-[0.58rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full">
                          Stufe {pin.difficulty}/5
                        </span>
                      </div>
                      <span className="absolute top-2 right-2 font-mono text-[0.6rem] text-emerald-400 font-bold bg-[#0C1825]/85 px-2 py-0.5 rounded-full">
                        +{pin.xp} XP
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-[0.65rem] flex-shrink-0">
                          {pin.avatar}
                        </div>
                        <div>
                          <p className="font-display text-[#F4E4C1] text-sm font-semibold">{pin.local}</p>
                          <p className="font-mono text-[0.6rem] text-[#8A9AAA]">
                            {pin.location} · <span className="text-[#C9A84C]">{pin.tag}</span>
                          </p>
                        </div>
                      </div>

                      <p className="font-body text-[#8A9AAA] text-sm mb-3 line-clamp-3 leading-relaxed">
                        {pin.story}
                      </p>

                      {(pin.dogDetails || pin.strollerDetails) && (
                        <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.68rem] font-mono space-y-1">
                          {pin.dogDetails && <p className="text-emerald-400/90">🐕 {pin.dogDetails}</p>}
                          {pin.strollerDetails && <p className="text-blue-400/90">👶 {pin.strollerDetails}</p>}
                        </div>
                      )}

                      <div className="flex justify-between mb-3">
                        <span className="text-[#C9A84C] text-sm">
                          {'★'.repeat(Math.floor(pin.rating))}
                          <span className="text-[#8A9AAA] text-xs ml-1">{pin.rating}</span>
                        </span>
                        <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{pin.reviews} Reviews</span>
                      </div>

                      {unlocked ? (
                        <div className="space-y-2 mb-3">
                          <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center justify-between border border-emerald-500/30">
                            <span className="text-emerald-400 text-xs">📍</span>
                            <span className="coord text-emerald-400 font-bold">{pin.gps}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                `${pin.location}, ${pin.city}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary text-[0.62rem] py-1.5 px-2 text-center font-bold flex items-center justify-center gap-1 shadow"
                            >
                              <span>🗺️</span>
                              <span>Google Maps</span>
                            </a>
                            <a
                              href={`https://maps.apple.com/?daddr=${encodeURIComponent(
                                `${pin.location}, ${pin.city}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost text-[0.62rem] py-1.5 px-2 text-center font-bold flex items-center justify-center gap-1 border border-[rgba(201,168,76,0.3)]"
                            >
                              <span>🍎</span>
                              <span>Apple Maps</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => scratchSecret(pin.id, pin.xp, pin.location, pin.gps, pin.category)}
                          className="btn btn-secondary w-full text-xs py-2 mb-3 font-bold"
                        >
                          🪙 GPS freischalten
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 border-t border-[rgba(201,168,76,0.1)] flex gap-2">
                    <button
                      onClick={() => {
                        triggerHaptic(10)
                        window.open(
                          createGoogleCalendarUrl({
                            title: `${pin.location} (${pin.city})`,
                            description: pin.story,
                            location: `${pin.city}, ${pin.country}`,
                          }),
                          '_blank'
                        )
                      }}
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >
                      📅 Kalender
                    </button>
                    <button
                      onClick={() =>
                        setStoryModal({
                          isOpen: true,
                          title: pin.location,
                          location: `${pin.city} · ${pin.countryFlag}`,
                          gps: pin.gps,
                          xp: pin.xp,
                          image: pin.image,
                        })
                      }
                      className="btn btn-ghost flex-1 text-[0.62rem] py-1.5"
                    >
                      📲 9:16 Story
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── TOP ACTIVITIES ────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-[#F4E4C1] text-lg font-bold mb-4">
            Aktivitäten &amp; Reservierungen (0% Fee)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(a => (
              <div key={a.id} className="card p-4 flex flex-col justify-between">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[#F4E4C1] text-sm font-bold">{a.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="font-mono text-[#C9A84C] text-[0.65rem]">★ {a.rating}</span>
                      <span className="font-mono text-[#8A9AAA] text-[0.62rem]">{a.participants}</span>
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {a.dogFriendly && (
                        <span className="font-mono text-[0.55rem] bg-emerald-950 border border-emerald-500/40 text-emerald-400 px-1.5 rounded-full">
                          🐕
                        </span>
                      )}
                      {a.strollerFriendly && (
                        <span className="font-mono text-[0.55rem] bg-blue-950 border border-blue-500/40 text-blue-400 px-1.5 rounded-full">
                          👶
                        </span>
                      )}
                      <span className="font-mono text-[0.55rem] bg-[#0C1825] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] px-1.5 rounded-full">
                        Stufe {a.difficulty}/5
                      </span>
                    </div>
                  </div>
                  <span className="font-display text-[#C9A84C] font-bold text-sm flex-shrink-0">{a.price}</span>
                </div>
                <button
                  onClick={() => setResModal({ isOpen: true, hostName: a.name, city: 'Destination', category: a.cat })}
                  className="btn btn-secondary w-full text-xs py-2"
                >
                  Anfragen (0% Fee) →
                </button>
              </div>
            ))}
          </div>
        </div>

        <StoryGeneratorModal
          isOpen={storyModal.isOpen}
          onClose={() => setStoryModal(p => ({ ...p, isOpen: false }))}
          data={storyModal}
        />
        <ReservationModal
          isOpen={resModal.isOpen}
          onClose={() => setResModal(p => ({ ...p, isOpen: false }))}
          hostName={resModal.hostName}
          city={resModal.city}
          category={resModal.category}
        />
        <SubmitSpotModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          onSuccess={spot => {
            const newPin: StoryPin = {
              id: Date.now(),
              local: 'Du (Community)',
              avatar: 'YOU',
              location: `${spot.location} — ${spot.title}`,
              city: spot.location,
              country: 'Community',
              countryFlag: '🌍',
              region: 'Global',
              story: spot.insiderStory,
              rating: 5.0,
              reviews: 1,
              gps: 'GPS ausstehend',
              locked: false,
              tag: `${spot.category} Secret`,
              image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
              category: spot.category,
              xp: 150,
              difficulty: spot.difficulty,
              dogFriendly: spot.dogFriendly,
              dogDetails: spot.dogNotes,
              strollerFriendly: spot.strollerFriendly,
              strollerDetails: spot.strollerNotes,
              familyKidsFriendly: spot.familyFriendly,
            }
            setExtraSpots(prev => [newPin, ...prev])
          }}
        />
      </div>
    </div>
  )
}
