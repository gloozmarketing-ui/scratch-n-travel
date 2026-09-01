import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { storyPins, StoryPin } from '../data/data'
import { useTravel } from '../context/TravelContext'
import SubmitSpotModal from '../components/SubmitSpotModal'

const cats = ['All', 'Nature', 'Food', 'Surf', 'Culture']

export default function Stories() {
  const { revealedPins, scratchSecret, triggerHaptic } = useTravel()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [extraStories, setExtraStories] = useState<StoryPin[]>([])
  const [activeVoiceStory, setActiveVoiceStory] = useState<number | null>(null)

  const allStories = useMemo(() => [...extraStories, ...storyPins], [extraStories])

  const filtered = useMemo(() => {
    return allStories.filter(p => {
      if (filter !== 'All' && p.category !== filter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          p.location.toLowerCase().includes(q) ||
          p.story.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.local.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [allStories, filter, search])

  const playVoiceNarration = (id: number) => {
    triggerHaptic(15)
    if (activeVoiceStory === id) {
      setActiveVoiceStory(null)
    } else {
      setActiveVoiceStory(id)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Authentic Local Oral History · Verified GPS Narratives</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Golden Story Pins &amp; Berichte</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">geschichten, die nur einheimische kennen</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                triggerHaptic(15)
                setIsSubmitOpen(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold shadow-lg"
            >
              + Eigene Story einreichen (+150 XP)
            </button>
            <Link to="/explore" className="btn btn-secondary text-xs py-2 px-3">
              🗺️ Auf Karte ansehen
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* FILTER BAR */}
        <div className="bg-[#152539] p-4 rounded-xl border border-[rgba(201,168,76,0.2)] flex gap-3 flex-wrap items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Storys durchsuchen (z. B. Fatima, Bacalhau, Fado, Balos, Dolomiten)..."
            className="field flex-1 min-w-[200px]"
          />
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => {
                  triggerHaptic(10)
                  setFilter(c)
                }}
                className={`btn text-xs py-1.5 px-3 ${filter === c ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-[#C9A84C] ml-auto">
            {filtered.length} Berichte
          </span>
        </div>

        {/* STORIES GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(story => {
            const isUnlocked = revealedPins.includes(story.id)
            const isPlaying = activeVoiceStory === story.id
            return (
              <div key={story.id} className="card p-6 border-[rgba(201,168,76,0.25)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-sm shadow">
                        {story.avatar}
                      </div>
                      <div>
                        <p className="font-display text-[#F4E4C1] text-base font-bold">{story.local}</p>
                        <p className="font-mono text-xs text-[#8A9AAA]">
                          {story.countryFlag} {story.city} · {story.region}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#C9A84C] bg-[#0C1825] border border-[rgba(201,168,76,0.3)] px-2.5 py-1 rounded-full font-bold">
                      +{story.xp} XP
                    </span>
                  </div>

                  <h3 className="font-display text-[#F4E4C1] text-lg font-bold mb-2">{story.location}</h3>
                  <div className="parchment p-4 rounded-xl text-[#2C1810] font-body text-sm leading-relaxed mb-4">
                    "{story.story}"
                  </div>

                  {isPlaying && (
                    <div className="bg-[#0C1825] p-3 rounded-xl border border-emerald-500/40 mb-4 flex items-center gap-3">
                      <span className="animate-pulse text-emerald-400 text-lg">🔊</span>
                      <div className="flex-1">
                        <p className="font-mono text-xs text-emerald-400 font-bold">Audio-Narration aktiv</p>
                        <p className="text-[0.65rem] text-[#8A9AAA]">Gelesen mit authentischem Akzent von {story.local}...</p>
                      </div>
                      <button onClick={() => setActiveVoiceStory(null)} className="btn btn-ghost text-xs py-1 px-2">
                        Stopp
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-[#8A9AAA] mb-3">
                    <span>★ {story.rating} ({story.reviews} Bewertungen)</span>
                    <span>Stufe {story.difficulty}/5</span>
                    {story.dogFriendly && <span className="text-emerald-400">🐕 Hundefreundlich</span>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(201,168,76,0.15)] flex gap-2">
                  <button
                    onClick={() => playVoiceNarration(story.id)}
                    className={`btn text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 font-bold ${
                      isPlaying ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    <span>{isPlaying ? '⏸️' : '🎙️'}</span>
                    <span>{isPlaying ? 'Pause' : 'Audio-Guide hören'}</span>
                  </button>
                  {isUnlocked ? (
                    <div className="bg-[#0C1825] border border-emerald-500/40 text-emerald-400 px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{story.gps}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => scratchSecret(story.id, story.xp, story.location, story.gps, story.category)}
                      className="btn btn-primary text-xs py-2 px-3 font-bold"
                    >
                      🪙 GPS enthüllen
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <SubmitSpotModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          onSuccess={spot => {
            const newStory: StoryPin = {
              id: Date.now(),
              local: 'Du (Community)',
              avatar: 'YOU',
              location: `${spot.location} — ${spot.title}`,
              city: spot.location,
              country: 'Global',
              countryFlag: '🌍',
              region: 'Community',
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
            setExtraStories(prev => [newStory, ...prev])
          }}
        />
      </div>
    </div>
  )
}
