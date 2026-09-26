import React, { useState, useMemo } from 'react'
import { useTravel } from '../context/TravelContext'
import { hobbyCategories, hobbiesList, matchBuddies, tours, storyPins, MatchBuddy } from '../data/data'
import { Link } from 'react-router-dom'

export default function WanderBond() {
  const { user, triggerHaptic } = useTravel()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
    'Surfing',
    'Hiking',
    'Hundewandern',
    'Wine Tasting',
    'Drone Photography',
    'Kinderwagen-Routen',
  ])
  const [searchHobby, setSearchHobby] = useState('')
  const [activeBuddyModal, setActiveBuddyModal] = useState<MatchBuddy | null>(null)
  const [filterDogOnly, setFilterDogOnly] = useState(false)
  const [filterKidsOnly, setFilterKidsOnly] = useState(false)

  // Toggle hobby selection
  const toggleHobby = (hobby: string) => {
    triggerHaptic(10)
    setSelectedHobbies(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    )
  }

  // Presets
  const applyPreset = (presetName: string, hobbies: string[]) => {
    triggerHaptic(15)
    setSelectedHobbies(hobbies)
  }

  // Calculate dynamic match % for each buddy
  const matchedBuddies = useMemo(() => {
    return matchBuddies
      .map(buddy => {
        const common = buddy.commonHobbies.filter(h => selectedHobbies.includes(h))
        const rawScore = selectedHobbies.length > 0 ? (common.length / Math.max(1, buddy.commonHobbies.length)) * 100 : 70
        const finalScore = Math.min(99, Math.max(45, Math.round(rawScore + (buddy.hasDog === filterDogOnly && filterDogOnly ? 15 : 0))))
        return {
          ...buddy,
          calculatedMatch: finalScore,
          matchedCount: common.length,
          commonWithUser: common,
        }
      })
      .filter(b => (!filterDogOnly || b.hasDog) && (!filterKidsOnly || b.hasKids))
      .sort((a, b) => b.calculatedMatch - a.calculatedMatch)
  }, [selectedHobbies, filterDogOnly, filterKidsOnly])

  // Filtered hobbies for selection
  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      if (!searchHobby.trim()) return hobbyCategories
      return hobbyCategories.map(cat => ({
        ...cat,
        hobbies: cat.hobbies.filter(h => h.toLowerCase().includes(searchHobby.toLowerCase())),
      })).filter(cat => cat.hobbies.length > 0)
    }
    const cat = hobbyCategories.find(c => c.id === selectedCategory)
    if (!cat) return []
    const filtered = cat.hobbies.filter(h => h.toLowerCase().includes(searchHobby.toLowerCase()))
    return [{ ...cat, hobbies: filtered }]
  }, [selectedCategory, searchHobby])

  // Recommended matching spots & tours
  const matchingTours = useMemo(() => {
    return tours.filter(t => {
      if (filterDogOnly && !t.dogFriendly) return false
      if (filterKidsOnly && !t.strollerFriendly) return false
      return true
    })
  }, [filterDogOnly, filterKidsOnly])

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="coord mb-1">130+ Hobby DNA Algorithm · Local Community Matching · Family & Dog Friendly</p>
        <h1 className="font-display text-3xl text-ink font-bold">WanderBond™ Hobby-DNA Matcher</h1>
        <p className="font-script text-sun text-lg mt-0.5">find your travel tribe based on genuine shared passions</p>
      </div>

      <div className="p-6 space-y-10 pb-24 md:pb-8 max-w-7xl mx-auto">
        {/* DNA STATUS BANNER */}
        <div className="parchment rounded-2xl p-6 shadow-2xl border border-terracotta relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🧬</span>
                <h2 className="font-display text-ink text-2xl font-black">Deine aktive Reise-DNA</h2>
                <span className="font-mono text-xs bg-terracotta text-ink px-2.5 py-0.5 rounded-full font-bold">
                  {selectedHobbies.length} Hobbys gewählt
                </span>
              </div>
              <p className="font-body text-ink text-sm max-w-2xl leading-relaxed">
                Je präziser deine Hobbys, desto treffgenauer matched WanderBond dich mit gleichgesinnten Travel-Buddies,
                kinderwagen-tauglichen Touren, hundefreundlichen Secret Spots und verifizierten Local Hosts.
              </p>
            </div>

            {/* Presets buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset('Hund & Outdoor', ['Hundewandern', 'Hiking', 'Camping', 'Strandspaziergänge', 'Trail Running'])}
                className="btn btn-parchment text-xs font-bold py-1.5 px-3 border border-terracotta"
              >
                🐕 Hund & Outdoor
              </button>
              <button
                onClick={() => applyPreset('Familie & Kids', ['Kinderwagen-Routen', 'Familien-Camping', 'Strandspaziergänge', 'Waldspielplätze'])}
                className="btn btn-parchment text-xs font-bold py-1.5 px-3 border border-terracotta"
              >
                👶 Familie & Kinderwagen
              </button>
              <button
                onClick={() => applyPreset('Surf & Vanlife', ['Surfing', 'Stand-Up Paddle', 'Camping', 'Drone Photography', 'Cold Plunge & Eisbaden'])}
                className="btn btn-parchment text-xs font-bold py-1.5 px-3 border border-terracotta"
              >
                🏄 Surf & Vanlife
              </button>
            </div>
          </div>

          {/* Active Hobbies Pills */}
          <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-2">
            {selectedHobbies.map(h => (
              <span
                key={h}
                onClick={() => toggleHobby(h)}
                className="cursor-pointer inline-flex items-center gap-1.5 bg-ink-ghost/10 hover:bg-red-500/20 hover:text-red-900 transition-colors text-ink font-mono text-xs px-3 py-1 rounded-full font-semibold border border-line"
              >
                {h} <span className="text-xs font-bold opacity-70">✕</span>
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 1: 130+ HOBBY SELECTION MATRIX */}
        <div className="card p-6 border-sun shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-[0.62rem] text-sun uppercase tracking-widest block">
                130+ Interessen-Katalog
              </span>
              <h2 className="font-display text-ink text-xl font-bold">Wähle deine Leidenschaften</h2>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchHobby}
                onChange={e => setSearchHobby(e.target.value)}
                placeholder="🔍 Hobby suchen (z.B. Surfen, Hund, Yoga)…"
                className="field text-xs py-2"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <button
              onClick={() => {
                triggerHaptic(10)
                setSelectedCategory('all')
              }}
              className={`btn text-xs py-1.5 px-3.5 whitespace-nowrap flex-shrink-0 ${
                selectedCategory === 'all' ? 'btn-primary font-bold' : 'btn-ghost'
              }`}
            >
              🌟 Alle 8 Bereiche ({hobbiesList.length})
            </button>
            {hobbyCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic(10)
                  setSelectedCategory(cat.id)
                }}
                className={`btn text-xs py-1.5 px-3.5 whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat.id ? 'btn-primary font-bold' : 'btn-ghost'
                }`}
              >
                {cat.icon} {cat.name} ({cat.hobbies.length})
              </button>
            ))}
          </div>

          {/* Hobbies Grid by Category */}
          <div className="space-y-6">
            {filteredCategories.map(cat => (
              <div key={cat.id} className="bg-paper-deep rounded-xl p-4 border border-sun">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-display text-ink text-sm font-bold">{cat.name}</h3>
                  <span className="font-mono text-[0.62rem] text-ink-faint">({cat.hobbies.length} Hobbys)</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.hobbies.map(h => {
                    const isSelected = selectedHobbies.includes(h)
                    return (
                      <button
                        key={h}
                        onClick={() => toggleHobby(h)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-sun to-sun-bright text-paper-deep font-bold shadow-md scale-105'
                            : 'bg-paper-deep text-ink-faint hover:text-ink border-sun hover:border-sun'
                        }`}
                      >
                        {isSelected ? '✓' : '+'} {h}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: LIVE WANDERBOND MATCH BUDDIES */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="font-mono text-[0.62rem] text-leaf uppercase tracking-widest font-bold block">
                ● Live Community Matching
              </span>
              <h2 className="font-display text-ink text-2xl font-bold">Deine WanderBond™ Matches ({matchedBuddies.length})</h2>
              <p className="font-body text-ink-faint text-xs">Reisende & Guides mit höchster DNA-Übereinstimmung</p>
            </div>

            {/* Special Filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterDogOnly(!filterDogOnly)
                }}
                className={`btn text-xs py-1.5 px-3 ${
                  filterDogOnly ? 'btn-primary font-bold' : 'btn-ghost'
                }`}
              >
                🐕 Nur Hundebesitzer
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setFilterKidsOnly(!filterKidsOnly)
                }}
                className={`btn text-xs py-1.5 px-3 ${
                  filterKidsOnly ? 'btn-primary font-bold' : 'btn-ghost'
                }`}
              >
                👶 Nur Familien mit Kindern
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {matchedBuddies.map(buddy => (
              <div
                key={buddy.id}
                className="card p-5 border-sun hover:border-sun transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-white text-base shadow-md flex-shrink-0"
                        style={{ background: buddy.avatarBg }}
                      >
                        {buddy.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-ink text-base font-bold">{buddy.name}</h3>
                          {buddy.verifiedLocal && (
                            <span className="text-leaf text-xs" title="Verifiziertes Profil">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-ink-faint text-[0.65rem]">{buddy.location} · {buddy.favoriteTour}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-3 py-1">
                        <span className="font-mono text-leaf font-black text-base">{buddy.calculatedMatch}%</span>
                        <span className="font-mono text-leaf/80 text-[0.55rem] block uppercase font-bold">DNA Match</span>
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-ink text-xs leading-relaxed mb-4 bg-paper-deep p-3 rounded-lg border border-sun">
                    "{buddy.bio}"
                  </p>

                  <div className="mb-4">
                    <p className="font-mono text-[0.6rem] text-sun uppercase tracking-wider mb-1.5 font-bold">
                      Gemeinsame Leidenschaften:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {buddy.commonHobbies.map(h => {
                        const isShared = selectedHobbies.includes(h)
                        return (
                          <span
                            key={h}
                            className={`font-mono text-[0.62rem] px-2.5 py-0.5 rounded-full ${
                              isShared
                                ? 'bg-sun/25 text-ink border border-sun/60 font-bold'
                                : 'bg-paper-deep text-ink-faint border border-transparent'
                            }`}
                          >
                            {isShared ? '⭐ ' : ''}{h}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-sun">
                  <button
                    onClick={() => {
                      triggerHaptic(15)
                      alert(`Nachrichten-Anfrage an ${buddy.name} gesendet! Sie erhalten eine Benachrichtigung im Profil.`)
                    }}
                    className="btn btn-primary flex-1 text-xs py-2"
                  >
                    💬 Chat & Treffen anfragen
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      setActiveBuddyModal(buddy)
                    }}
                    className="btn btn-ghost text-xs py-2 px-3"
                  >
                    Profil ansehen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: TAILORED ROUTES & EXPERIENCES */}
        <div>
          <div className="section-divider mb-6">
            <span className="font-mono text-[0.68rem] tracking-widest">
              Auf deine DNA abgestimmte Touren & Secret Spots
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingTours.map(tour => (
              <div key={tour.id} className="card p-4 flex flex-col justify-between hover:border-sun transition-all">
                <div>
                  <div className="relative h-36 rounded-lg overflow-hidden mb-3">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {tour.dogFriendly && (
                        <span className="font-mono text-[0.58rem] bg-emerald-950/80 border border-emerald-500/50 text-leaf px-2 py-0.5 rounded-full font-bold">
                          🐕 Hund
                        </span>
                      )}
                      {tour.strollerFriendly && (
                        <span className="font-mono text-[0.58rem] bg-blue-950/80 border border-blue-500/50 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                          👶 Kinderwagen
                        </span>
                      )}
                    </div>
                    <span className="absolute top-2 right-2 font-mono text-[0.58rem] bg-paper-deep/90 text-sun px-2 py-0.5 rounded-full border border-sun/30">
                      Stufe {tour.difficulty}/5
                    </span>
                  </div>

                  <h4 className="font-display text-ink text-sm font-bold mb-1">{tour.title}</h4>
                  <p className="font-body text-ink-faint text-xs mb-3">
                    {tour.distance} · {tour.duration} · {tour.elevation}
                  </p>
                </div>

                <Link to="/tours" className="btn btn-secondary w-full text-xs py-1.5">
                  Tour Details ansehen →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* BUDDY DETAIL MODAL */}
        {activeBuddyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setActiveBuddyModal(null)}
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <div
                  className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl text-white font-display font-black shadow-xl"
                  style={{ background: activeBuddyModal.avatarBg }}
                >
                  {activeBuddyModal.avatar}
                </div>
                <h3 className="font-display text-ink text-xl font-bold">{activeBuddyModal.name}</h3>
                <p className="font-mono text-[0.65rem] text-sun uppercase tracking-wider mt-0.5">
                  {activeBuddyModal.location} · {activeBuddyModal.favoriteTour}
                </p>
              </div>

              <div className="parchment rounded-xl p-4 mb-4 text-ink space-y-2">
                <div>
                  <p className="font-mono text-[0.6rem] text-terracotta uppercase font-bold">Über mich / uns:</p>
                  <p className="font-body text-sm leading-relaxed">{activeBuddyModal.bio}</p>
                </div>
                <div className="pt-2 border-t border-line flex gap-4 text-xs font-mono">
                  <span>🐕 Hund dabei: {activeBuddyModal.hasDog ? 'Ja' : 'Nein'}</span>
                  <span>👶 Mit Kindern: {activeBuddyModal.hasKids ? 'Ja' : 'Nein'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(`Kontaktanfrage an ${activeBuddyModal.name} übermittelt!`)
                    setActiveBuddyModal(null)
                  }}
                  className="btn btn-primary w-full text-xs py-2.5"
                >
                  💬 Nachricht senden & Vernetzen
                </button>
                <button onClick={() => setActiveBuddyModal(null)} className="btn btn-ghost w-full text-xs py-2">
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
