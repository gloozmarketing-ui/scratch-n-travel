import { useState } from 'react'
import { storyPins, activities } from '../data/data'
import LeafletMap, { type MapPin } from '../components/LeafletMap'

const cats = ['All', 'Nature', 'Food', 'Surf', 'History', 'Night']
const actCats = ['All', 'Family', 'Extreme', 'Culture', 'Pets']

// Portugal GPS coordinates per pin ID
const PIN_GPS: Record<number, [number, number]> = {
  1: [38.7223, -9.1393],
  2: [38.6916, -9.2160],
  3: [38.9633, -9.4172],
  4: [38.7980, -9.4850],
  5: [41.1496, -8.6109],
  6: [37.0179, -7.9307],
  7: [39.7440, -8.8072],
}

export default function Explore() {
  const [storyFilter, setStoryFilter] = useState('All')
  const [actFilter, setActFilter] = useState('All')
  const [unlocked, setUnlocked] = useState<number[]>([3, 5])
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)

  const filteredPins = storyFilter === 'All' ? storyPins : storyPins.filter(p => p.category === storyFilter)
  const filteredActs = actFilter === 'All' ? activities : activities.filter(a => a.cat === actFilter)

  const mapPins: MapPin[] = storyPins.map(pin => {
    const coords = PIN_GPS[pin.id] || [38.75 + (pin.id * 0.3), -9.2 - (pin.id * 0.15)]
    return {
      id: pin.id,
      lat: coords[0],
      lng: coords[1],
      title: pin.local,
      icon: unlocked.includes(pin.id) ? '📍' : '🔒',
      color: unlocked.includes(pin.id) ? '#C9A84C' : 'rgba(201,168,76,0.4)',
      category: 'spot',
      description: unlocked.includes(pin.id) ? pin.gps : 'Scratch to unlock GPS',
    }
  })

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="coord mb-1">38°42 N · 9°08 W — Lisboa Region</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Explore</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">discover what the maps do not show</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#0C1825] border border-[rgba(201,168,76,0.2)] rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.7)]">6 secrets nearby</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10">

        {/* Real Leaflet Map - CartoCDN dark tiles, NO API KEY needed */}
        <div className="rounded-xl overflow-hidden border border-[rgba(201,168,76,0.18)]">
          <LeafletMap
            pins={mapPins}
            center={[38.75, -9.2]}
            zoom={7}
            height="340px"
            onPinClick={(pin) => setSelectedPin(pin)}
          />
        </div>

        {selectedPin && (
          <div className="card p-4 flex items-center justify-between gap-3 border border-[rgba(201,168,76,0.3)]">
            <div>
              <p className="font-display text-[#F4E4C1] font-bold text-sm">{selectedPin.title}</p>
              <p className="coord text-emerald-400/80 text-xs mt-0.5">{selectedPin.description}</p>
            </div>
            <button onClick={() => setSelectedPin(null)} className="btn btn-ghost text-xs py-1 px-3">close</button>
          </div>
        )}

        {/* Story Pins */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-display text-[#F4E4C1] text-lg font-bold">Golden Story Pins</h2>
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button key={c} onClick={() => setStoryFilter(c)}
                  className={`btn text-[0.65rem] py-1 px-3 ${storyFilter === c ? 'btn-primary' : 'btn-ghost'}`}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPins.map(pin => {
              const isUnlocked = unlocked.includes(pin.id)
              return (
                <div key={pin.id} className="card overflow-hidden group">
                  <div className="relative h-36">
                    <img src={pin.image} alt={pin.location} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                    <span className="absolute top-2 left-2 font-mono text-[0.6rem] bg-[rgba(12,24,37,0.8)] border border-[rgba(201,168,76,0.3)] text-[rgba(201,168,76,0.9)] px-2 py-0.5 rounded-full">{pin.tag}</span>
                    <span className="absolute top-2 right-2 font-mono text-[0.6rem] text-emerald-400/80">+{pin.xp} XP</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-[0.65rem] flex-shrink-0">{pin.avatar}</div>
                      <div>
                        <p className="font-display text-[#F4E4C1] text-sm font-semibold leading-tight">{pin.local}</p>
                        <p className="font-mono text-[0.6rem] text-[#8A9AAA]">{pin.location}</p>
                      </div>
                    </div>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed line-clamp-2 mb-3">{pin.story}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#C9A84C] text-sm">{'★'.repeat(Math.floor(pin.rating))}<span className="text-[#8A9AAA] text-xs ml-1">{pin.rating}</span></span>
                      <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{pin.reviews} reviews</span>
                    </div>
                    {isUnlocked ? (
                      <div className="bg-[#0C1825] rounded-lg px-3 py-2 flex items-center gap-2">
                        <span className="text-emerald-400 text-xs">📍</span>
                        <span className="coord text-emerald-400/80">{pin.gps}</span>
                      </div>
                    ) : (
                      <button onClick={() => setUnlocked(prev => [...prev, pin.id])}
                        className="btn btn-secondary w-full text-[0.68rem] py-2">
                        🔒 Scratch to Reveal GPS
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activities */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-display text-[#F4E4C1] text-lg font-bold">Activities Nearby</h2>
            <div className="flex gap-2 flex-wrap">
              {actCats.map(c => (
                <button key={c} onClick={() => setActFilter(c)}
                  className={`btn text-[0.65rem] py-1 px-3 ${actFilter === c ? 'btn-primary' : 'btn-ghost'}`}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredActs.map(a => (
              <div key={a.id} className="card p-4 flex items-center gap-4 hover:cursor-pointer">
                <span className="text-2xl flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[#F4E4C1] text-sm font-semibold leading-tight mb-0.5">{a.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[rgba(201,168,76,0.8)] text-[0.62rem]">★ {a.rating}</span>
                    <span className="font-mono text-[#8A9AAA] text-[0.62rem]">{a.participants}</span>
                  </div>
                </div>
                <span className="font-display text-[#C9A84C] font-bold text-sm flex-shrink-0">{a.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
