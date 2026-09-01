import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SubmitSpotModal from '../components/SubmitSpotModal'
import { tours, CommunityTour } from '../data/data'
import { useTravel } from '../context/TravelContext'

const diffLabel: Record<number, string> = {
  1: 'Sehr leicht', 2: 'Leicht', 3: 'Moderat', 4: 'Anspruchsvoll', 5: 'Alpin/Extrem',
}
const diffColor: Record<number, string> = {
  1: 'text-emerald-400 border-emerald-500/50',
  2: 'text-green-400 border-green-500/50',
  3: 'text-yellow-400 border-yellow-500/50',
  4: 'text-orange-400 border-orange-500/50',
  5: 'text-red-400 border-red-500/50',
}

type DiffFilter = number | 'all'

export default function Tours() {
  const { triggerHaptic } = useTravel()
  const [filterDog, setFilterDog] = useState(false)
  const [filterStroller, setFilterStroller] = useState(false)
  const [filterDiff, setFilterDiff] = useState<DiffFilter>('all')
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [extraTours, setExtraTours] = useState<CommunityTour[]>([])
  const allTours = useMemo(() => [...extraTours, ...tours], [extraTours])

  const filtered = useMemo(() => allTours.filter(t => {
    if (filterDog && !t.dogFriendly) return false
    if (filterStroller && !t.strollerFriendly) return false
    if (filterDiff !== 'all' && t.difficulty !== filterDiff) return false
    return true
  }), [allTours, filterDog, filterStroller, filterDiff])

  function handleDownload(t: CommunityTour) {
    triggerHaptic(20)
    const diff = diffLabel[t.difficulty] ?? 'Moderat'
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Scratch'nTravel" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${t.title}</name>
    <desc>${diff}${t.dogFriendly ? ' - Hundefreundlich' : ''}${t.strollerFriendly ? ' - Kinderwagen' : ''}</desc>
  </metadata>
  <trk><name>${t.title}</name><trkseg>
    <trkpt lat="38.7169" lon="-9.1395"><ele>0</ele></trkpt>
    <trkpt lat="38.7200" lon="-9.1400"><ele>10</ele></trkpt>
    <trkpt lat="38.7250" lon="-9.1450"><ele>25</ele></trkpt>
  </trkseg></trk>
</gpx>`
    const blob = new Blob([gpx], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t.title.replace(/\s+/g, '-')}.gpx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const diffOptions: DiffFilter[] = ['all', 1, 2, 3, 4, 5]

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">GPS + GPX · Dog &amp; Stroller Verified · Hike/Bike/Surf</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Tours &amp; GPX-Routen</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">von Locals verifiziert</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { triggerHaptic(15); setIsSubmitOpen(true) }}
              className="btn btn-primary text-xs py-2 px-3 font-bold"
            >+ Route einstellen (+200 XP)</button>
            <Link to="/wanderbond" className="btn btn-secondary text-xs py-2 px-3">🧬 DNA</Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* ── FILTERS ────────────────────────────────────────────────────── */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] flex gap-3 flex-wrap items-center">
          <button onClick={() => { triggerHaptic(10); setFilterDog(!filterDog) }}
            className={`btn text-xs py-2 px-3 ${filterDog ? 'btn-primary font-bold' : 'btn-ghost'}`}
          >🐕 Hundefreundlich</button>
          <button onClick={() => { triggerHaptic(10); setFilterStroller(!filterStroller) }}
            className={`btn text-xs py-2 px-3 ${filterStroller ? 'btn-primary font-bold' : 'btn-ghost'}`}
          >👶 Kinderwagen</button>
          <div className="border-l border-[rgba(201,168,76,0.15)] pl-3 flex gap-2 flex-wrap">
            <span className="font-mono text-[0.62rem] text-[#8A9AAA] self-center">Schwierigkeit:</span>
            {diffOptions.map(d => (
              <button key={String(d)} onClick={() => { triggerHaptic(8); setFilterDiff(d) }}
                className={`btn text-[0.62rem] py-1 px-2.5 ${filterDiff === d ? 'btn-primary' : 'btn-ghost'}`}>
                {d === 'all' ? 'Alle' : `${d} — ${diffLabel[d as number]}`}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[0.65rem] text-[#8A9AAA]">{filtered.length} Routen</span>
        </div>

        {/* ── TOUR CARDS ─────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} className="card overflow-hidden flex flex-col">
              <div className="relative h-44">
                <img src={t.image} alt={t.title}
                  className="w-full h-full object-cover opacity-80 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap max-w-[80%]">
                  {t.dogFriendly && (
                    <span className="font-mono text-[0.58rem] bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full font-bold">🐕 Hund</span>
                  )}
                  {t.strollerFriendly && (
                    <span className="font-mono text-[0.58rem] bg-blue-950/90 border border-blue-500/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">👶 Wagen</span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`font-mono text-[0.62rem] font-bold bg-[#0C1825]/90 border px-2 py-0.5 rounded-full ${diffColor[t.difficulty]}`}>
                    Stufe {t.difficulty}/5 · {diffLabel[t.difficulty]}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-display text-[#F4E4C1] font-bold text-sm">{t.title}</h3>
                    <p className="font-mono text-[0.6rem] text-[#8A9AAA]">von {t.creator}</p>
                  </div>
                  <span className="font-mono text-[0.6rem] text-[#C9A84C] text-right flex-shrink-0">★ {t.rating}</span>
                </div>
                <p className="font-mono text-[0.62rem] text-[#C9A84C] mb-2">
                  {t.distance} · {t.duration} · {t.elevation} · {t.stops} Stops
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {t.tags.map(tag => (
                    <span key={tag} className="font-mono text-[0.55rem] bg-[#0C1825] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                {(t.dogDetails || t.strollerDetails) && (
                  <div className="bg-[#0C1825] rounded-lg p-2.5 mb-3 text-[0.65rem] font-mono space-y-1">
                    {t.dogDetails && <p className="text-emerald-400/90">🐕 {t.dogDetails}</p>}
                    {t.strollerDetails && <p className="text-blue-400/90">👶 {t.strollerDetails}</p>}
                  </div>
                )}
                <div className="flex gap-1.5 mt-auto">
                  <button onClick={() => handleDownload(t)} className="btn btn-primary flex-1 text-xs py-2 font-bold">
                    📥 GPX
                  </button>
                  <button className="btn btn-ghost flex-1 text-xs py-2">
                    ❤️ {t.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubmitSpotModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={spot => {
          const t: CommunityTour = {
            id: Date.now(),
            title: spot.title,
            creator: 'Du (Community)',
            avatar: 'YOU',
            location: spot.location || 'Community Spot',
            country: 'Global',
            countryFlag: '🌍',
            distance: 'variabel',
            duration: 'variabel',
            elevation: 'variabel',
            difficulty: spot.difficulty,
            bestTime: 'Anytime',
            stops: 1,
            likes: 0,
            category: spot.category,
            tags: [spot.category],
            image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format',
            rating: 5.0,
            reviews: 1,
            dogFriendly: spot.dogFriendly,
            dogDetails: spot.dogNotes,
            strollerFriendly: spot.strollerFriendly,
            strollerDetails: spot.strollerNotes,
            familyKidsFriendly: spot.familyFriendly,
          }
          setExtraTours(prev => [t, ...prev])
        }}
      />
    </div>
  )
}
