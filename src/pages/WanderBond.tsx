import React, { useState, useMemo } from 'react'
import { useTravel } from '../context/TravelContext'
import { hobbyCategories, hobbiesList, matchBuddies, tours, storyPins, MatchBuddy } from '../data/data'
import { Link } from 'react-router-dom'

/**
 * SNT-513: Skill-Swap-Börse („Was kannst du beibringen — was willst du lernen?“)
 * Basiert auf dem Give & Take Modell (SNT-374 / SNT-375):
 * Wer Fähigkeiten teilt, erhält kostenfreie Gegenleistungen und echte Verbindungen.
 */
export interface SkillSwapListing {
  id: string
  authorName: string
  authorRole: 'local' | 'traveler'
  authorTier: 'anchor' | 'trusted' | 'member'
  city: string
  country: string
  teachesTitle: string
  teachesCategory: string
  teachesIcon: string
  teachesDesc: string
  seeksTitle: string
  seeksCategory: string
  seeksIcon: string
  seeksDesc: string
  status: 'active' | 'in_dialog'
  createdAt: string
}

const INITIAL_SKILL_SWAPS: SkillSwapListing[] = [
  {
    id: 'swap-1',
    authorName: 'Mara Silva',
    authorRole: 'local',
    authorTier: 'anchor',
    city: 'Lissabon',
    country: 'Portugal',
    teachesTitle: 'Surfen Grundlagen & Spot-Guiding',
    teachesCategory: 'Sport',
    teachesIcon: '🏄‍♂️',
    teachesDesc: 'Zeige dir Wellenlesen am Praia do Guincho/Carcavelos, Board-Handling und sicheren Take-Off.',
    seeksTitle: 'Spanisch Konversation',
    seeksCategory: 'Sprache',
    seeksIcon: '🇪🇸',
    seeksDesc: 'Suche jemanden für lockeren Alltags-Dialog auf Spanisch bei Kaffee oder nach der Session.',
    status: 'active',
    createdAt: 'Heute',
  },
  {
    id: 'swap-2',
    authorName: 'Julian Weber',
    authorRole: 'traveler',
    authorTier: 'trusted',
    city: 'Berlin',
    country: 'Deutschland',
    teachesTitle: 'Drohnen-Videografie & Color Grading',
    teachesCategory: 'Kreativ',
    teachesIcon: '🛸',
    teachesDesc: 'Erkläre ND-Filter, cineastische Flugkurven und Grading in DaVinci Resolve.',
    seeksTitle: 'Sauerteig-Brot backen',
    seeksCategory: 'Küche',
    seeksIcon: '🍞',
    seeksDesc: 'Möchte endlich lernen, wie man eine knusprige Kruste und offene Porung ohne Hefe hinbekommt.',
    status: 'active',
    createdAt: 'Heute',
  },
  {
    id: 'swap-3',
    authorName: 'Elena Rostova',
    authorRole: 'traveler',
    authorTier: 'member',
    city: 'Barcelona',
    country: 'Spanien',
    teachesTitle: 'Spanische Flamenco-Gitarre & Rhythmen',
    teachesCategory: 'Kreativ',
    teachesIcon: '🎸',
    teachesDesc: 'Grundlegende Rasgueado-Schlagmuster und Compás-Zählweisen für Einsteiger.',
    seeksTitle: 'Kletter-Partner Montserrat',
    seeksCategory: 'Outdoor',
    seeksIcon: '🧗',
    seeksDesc: 'Suche Sicherungspartner (Vorstieg 5b–6a) für Wochenend-Ausflüge nach Montserrat.',
    status: 'active',
    createdAt: 'Gestern',
  },
  {
    id: 'swap-4',
    authorName: 'Kenji Sato',
    authorRole: 'local',
    authorTier: 'anchor',
    city: 'Tokyo',
    country: 'Japan',
    teachesTitle: 'Geheime Izakaya-Touren & Sake-Kunde',
    teachesCategory: 'Küche',
    teachesIcon: '🍶',
    teachesDesc: 'Führe dich durch versteckte Bars in Shinjuku/Yanaka und erkläre Junmai vs. Daiginjo.',
    seeksTitle: 'Englisch Business & Travel',
    seeksCategory: 'Sprache',
    seeksIcon: '🇬🇧',
    seeksDesc: 'Brauche Sprechpraxis für internationale Reise-Projekte und Präsentationen.',
    status: 'active',
    createdAt: 'Gestern',
  },
  {
    id: 'swap-5',
    authorName: 'Camille Laurent',
    authorRole: 'local',
    authorTier: 'trusted',
    city: 'Paris',
    country: 'Frankreich',
    teachesTitle: 'Croissant-Backen & Barista-Technik',
    teachesCategory: 'Küche',
    teachesIcon: '🥐',
    teachesDesc: 'Laminierter Blätterteig bei mir zu Hause in Montmartre + perfekte Espresso-Extraktion.',
    seeksTitle: 'Urban Sketching & Aquarell',
    seeksCategory: 'Kreativ',
    seeksIcon: '🎨',
    seeksDesc: 'Möchte lernen, Straßencafés schnell mit Fineliner und Wasserfarben festzuhalten.',
    status: 'active',
    createdAt: 'Vor 2 Tagen',
  },
  {
    id: 'swap-6',
    authorName: 'Anna Lindner',
    authorRole: 'local',
    authorTier: 'trusted',
    city: 'Wien',
    country: 'Österreich',
    teachesTitle: 'Museums-Geheimnisse & Kaffeehauskultur',
    teachesCategory: 'Kreativ',
    teachesIcon: '🏛️',
    teachesDesc: 'Zeige dir stille Säle im KHM, alte Bibliotheken und wie man die echte Wiener Melange genießt.',
    seeksTitle: 'Rennrad-Touren Wienerwald',
    seeksCategory: 'Sport',
    seeksIcon: '🚴',
    seeksDesc: 'Suche Mitfahrer für Höhenmeter-Runden Richtung Tulln / Kahlenberg am Wochenende.',
    status: 'active',
    createdAt: 'Vor 3 Tagen',
  },
]

export default function WanderBond() {
  const { user, triggerHaptic } = useTravel()
  const [activeView, setActiveView] = useState<'dna' | 'skillswap'>('dna')
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

  // Skill-Swap state
  const [skillSwaps, setSkillSwaps] = useState<SkillSwapListing[]>(() => {
    try {
      const s = localStorage.getItem('snt_skill_swaps')
      return s ? JSON.parse(s) : INITIAL_SKILL_SWAPS
    } catch {
      return INITIAL_SKILL_SWAPS
    }
  })
  const [selectedSwapCategory, setSelectedSwapCategory] = useState<string>('all')
  const [selectedSwapCity, setSelectedSwapCity] = useState<string>('all')
  const [showCreateSwap, setShowCreateSwap] = useState(false)
  const [activeSwapInquiry, setActiveSwapInquiry] = useState<SkillSwapListing | null>(null)
  const [inquiryMsg, setInquiryMsg] = useState('')
  const [inquiryToast, setInquiryToast] = useState<string | null>(null)

  // New Swap Form state
  const [newTeachTitle, setNewTeachTitle] = useState('')
  const [newTeachCat, setNewTeachCat] = useState('Sport')
  const [newTeachDesc, setNewTeachDesc] = useState('')
  const [newSeekTitle, setNewSeekTitle] = useState('')
  const [newSeekCat, setNewSeekCat] = useState('Sprache')
  const [newSeekDesc, setNewSeekDesc] = useState('')
  const [newSwapCity, setNewSwapCity] = useState('Lissabon')

  const handleCreateSwap = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeachTitle.trim() || !newSeekTitle.trim()) return

    const getIcon = (cat: string) => {
      switch (cat) {
        case 'Sport': return '🏄‍♂️'
        case 'Sprache': return '🗣️'
        case 'Küche': return '🍳'
        case 'Kreativ': return '🎨'
        case 'Outdoor': return '🧗'
        default: return '💡'
      }
    }

    const newListing: SkillSwapListing = {
      id: `swap-user-${Date.now()}`,
      authorName: user?.email?.split('@')[0] || 'Du (Community)',
      authorRole: 'traveler',
      authorTier: 'member',
      city: newSwapCity,
      country: newSwapCity === 'Lissabon' ? 'Portugal' : newSwapCity === 'Barcelona' ? 'Spanien' : newSwapCity === 'Berlin' ? 'Deutschland' : newSwapCity === 'Paris' ? 'Frankreich' : newSwapCity === 'Wien' ? 'Österreich' : 'Japan',
      teachesTitle: newTeachTitle.trim(),
      teachesCategory: newTeachCat,
      teachesIcon: getIcon(newTeachCat),
      teachesDesc: newTeachDesc.trim() || 'Persönlicher Wissensaustausch auf Augenhöhe.',
      seeksTitle: newSeekTitle.trim(),
      seeksCategory: newSeekCat,
      seeksIcon: getIcon(newSeekCat),
      seeksDesc: newSeekDesc.trim() || 'Möchte diese Fähigkeit gerne von einem Local/Traveler lernen.',
      status: 'active',
      createdAt: 'Gerade eben',
    }

    triggerHaptic([30, 60])
    setSkillSwaps(prev => {
      const next = [newListing, ...prev]
      try {
        localStorage.setItem('snt_skill_swaps', JSON.stringify(next))
      } catch {}
      return next
    })

    setNewTeachTitle('')
    setNewTeachDesc('')
    setNewSeekTitle('')
    setNewSeekDesc('')
    setShowCreateSwap(false)
    setInquiryToast('Dein Skill-Swap wurde erfolgreich eingestellt! (+100 XP)')
    setTimeout(() => setInquiryToast(null), 4000)
  }

  const handleSendInquiry = () => {
    if (!activeSwapInquiry) return
    triggerHaptic([20, 50])
    setInquiryToast(`Tauschanfrage an ${activeSwapInquiry.authorName} wurde versendet!`)
    setActiveSwapInquiry(null)
    setInquiryMsg('')
    setTimeout(() => setInquiryToast(null), 4000)
  }

  const swapCities = useMemo(() => {
    const list = Array.from(new Set(skillSwaps.map(s => s.city)))
    return ['all', ...list]
  }, [skillSwaps])

  const filteredSwaps = useMemo(() => {
    return skillSwaps.filter(s => {
      const matchCat = selectedSwapCategory === 'all' || s.teachesCategory === selectedSwapCategory || s.seeksCategory === selectedSwapCategory
      const matchCity = selectedSwapCity === 'all' || s.city.toLowerCase() === selectedSwapCity.toLowerCase()
      return matchCat && matchCity
    })
  }, [skillSwaps, selectedSwapCategory, selectedSwapCity])

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
        <h1 className="font-display text-3xl text-ink font-bold">WanderBond™ Hobby-DNA & Skill-Swap</h1>
        <p className="font-script text-sun text-lg mt-0.5">find your travel tribe based on genuine shared passions & skills</p>
      </div>

      {/* ── SNT-513 VIEW SELECTOR ── */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex items-center gap-2 bg-paper-deep p-1.5 rounded-xl border border-line">
          <button
            onClick={() => {
              triggerHaptic(10)
              setActiveView('dna')
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'dna'
                ? 'bg-sun text-ink shadow-md border border-sun'
                : 'text-ink-faint hover:text-ink'
            }`}
          >
            <span>🧬 130+ Hobby-DNA Matcher</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic(10)
              setActiveView('skillswap')
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-display text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'skillswap'
                ? 'bg-sun text-ink shadow-md border border-sun'
                : 'text-ink-faint hover:text-ink'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>🔄 Skill-Swap Börse (Give & Take)</span>
            <span className="text-[10px] bg-ink/10 px-1.5 py-0.5 rounded-full font-mono font-bold">
              {filteredSwaps.length}
            </span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-10 pb-24 md:pb-8 max-w-7xl mx-auto">
        {activeView === 'dna' ? (
          <>
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
          </>
        ) : (
          /* ── SKILL-SWAP BÖRSE VIEW (SNT-513) ── */
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="parchment rounded-2xl p-6 shadow-xl border border-sun relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🔄</span>
                    <h2 className="font-display text-ink text-2xl font-black">
                      Give & Take Skill-Swap Börse
                    </h2>
                    <span className="font-mono text-xs bg-sun/20 text-ink px-2.5 py-0.5 rounded-full font-bold">
                      Reise-Tauschbörse
                    </span>
                  </div>
                  <p className="font-body text-ink text-sm max-w-2xl leading-relaxed">
                    Kein Geld, kein Kommerz — reiner gegenseitiger Mehrwert. Teile dein Können (z. B. Surfen, Fotografie, Kochen)
                    und lerne im Gegenzug Sprachen, lokale Guides oder neue Outdoor-Sportarten.
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic(15)
                    setShowCreateSwap(v => !v)
                  }}
                  className="btn btn-primary text-xs font-bold py-2.5 px-5 shadow-lg flex-shrink-0"
                >
                  {showCreateSwap ? '✕ Schließen' : '➕ Eigenen Skill-Swap einstellen'}
                </button>
              </div>
            </div>

            {/* Formular für neuen Skill-Swap */}
            {showCreateSwap && (
              <form onSubmit={handleCreateSwap} className="card p-6 border-sun shadow-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <span className="text-xl">✨</span>
                  <h3 className="font-display text-ink text-lg font-bold">
                    Neues Tausch-Angebot veröffentlichen
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Was bietest du an? */}
                  <div className="bg-paper-deep/60 p-4 rounded-xl border border-line space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎁</span>
                      <span className="font-display font-bold text-xs uppercase text-ink">Ich bringe dir bei (Geben)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Fähigkeit / Thema *</label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Surfen Grundlagen, Drohnen-Video, Kochen"
                        value={newTeachTitle}
                        onChange={e => setNewTeachTitle(e.target.value)}
                        className="field text-xs py-2 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Bereich</label>
                      <select
                        value={newTeachCat}
                        onChange={e => setNewTeachCat(e.target.value)}
                        className="field text-xs py-2 w-full"
                      >
                        <option value="Sport">🏄‍♂️ Sport & Action</option>
                        <option value="Sprache">🗣️ Sprache & Kultur</option>
                        <option value="Küche">🍳 Kochen & Food</option>
                        <option value="Kreativ">🎨 Kreativ & Musik</option>
                        <option value="Outdoor">🧗 Outdoor & Natur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Kurzbeschreibung</label>
                      <textarea
                        rows={2}
                        placeholder="Was genau zeigst du der anderen Person?"
                        value={newTeachDesc}
                        onChange={e => setNewTeachDesc(e.target.value)}
                        className="field text-xs py-2 w-full"
                      />
                    </div>
                  </div>

                  {/* Was suchst du? */}
                  <div className="bg-paper-deep/60 p-4 rounded-xl border border-line space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-display font-bold text-xs uppercase text-ink">Ich möchte lernen (Nehmen)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Gesuchte Fähigkeit *</label>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Spanisch Konversation, Kletter-Partner"
                        value={newSeekTitle}
                        onChange={e => setNewSeekTitle(e.target.value)}
                        className="field text-xs py-2 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Bereich</label>
                      <select
                        value={newSeekCat}
                        onChange={e => setNewSeekCat(e.target.value)}
                        className="field text-xs py-2 w-full"
                      >
                        <option value="Sprache">🗣️ Sprache & Kultur</option>
                        <option value="Sport">🏄‍♂️ Sport & Action</option>
                        <option value="Küche">🍳 Kochen & Food</option>
                        <option value="Kreativ">🎨 Kreativ & Musik</option>
                        <option value="Outdoor">🧗 Outdoor & Natur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Kurzbeschreibung</label>
                      <textarea
                        rows={2}
                        placeholder="Was erhoffst du dir im Gegenzug zu lernen?"
                        value={newSeekDesc}
                        onChange={e => setNewSeekDesc(e.target.value)}
                        className="field text-xs py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Deine Stadt / Standort</label>
                  <select
                    value={newSwapCity}
                    onChange={e => setNewSwapCity(e.target.value)}
                    className="field text-xs py-2 w-full sm:w-64"
                  >
                    <option value="Lissabon">Lissabon (Portugal)</option>
                    <option value="Barcelona">Barcelona (Spanien)</option>
                    <option value="Berlin">Berlin (Deutschland)</option>
                    <option value="Paris">Paris (Frankreich)</option>
                    <option value="Wien">Wien (Österreich)</option>
                    <option value="Tokyo">Tokyo (Japan)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSwap(false)}
                    className="btn btn-ghost text-xs py-2 px-4"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs py-2.5 px-6 font-bold"
                  >
                    ✓ Tauschangebot live schalten (+100 XP)
                  </button>
                </div>
              </form>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['all', 'Sport', 'Sprache', 'Küche', 'Kreativ', 'Outdoor'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      triggerHaptic(10)
                      setSelectedSwapCategory(cat)
                    }}
                    className={`btn text-xs py-1.5 px-3 whitespace-nowrap ${
                      selectedSwapCategory === cat ? 'btn-primary font-bold' : 'btn-ghost'
                    }`}
                  >
                    {cat === 'all' ? '🌟 Alle Bereiche' : cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {swapCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      triggerHaptic(10)
                      setSelectedSwapCity(city)
                    }}
                    className={`btn text-xs py-1 px-2.5 rounded-full ${
                      selectedSwapCity === city ? 'bg-ink text-paper font-bold' : 'btn-ghost text-[11px]'
                    }`}
                  >
                    {city === 'all' ? '🌍 Alle Städte' : `📍 ${city}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSwaps.map(item => (
                <div key={item.id} className="card p-5 border-line hover:border-sun transition-all shadow-md flex flex-col justify-between">
                  <div>
                    {/* Top info */}
                    <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-paper-deep border border-line flex items-center justify-center font-display font-bold text-xs text-ink">
                          {item.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs text-ink flex items-center gap-1.5">
                            {item.authorName}
                            <span className="text-[10px] bg-paper-deep text-ink-faint px-1.5 py-0.2 rounded font-mono">
                              {item.authorRole === 'local' ? 'Local' : 'Traveler'}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-ink-faint">
                            📍 {item.city}, {item.country} · {item.createdAt}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] bg-emerald-500/15 text-leaf font-bold px-2 py-0.5 rounded-full">
                        ✓ Verifiziert
                      </span>
                    </div>

                    {/* Swap Content: 2 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Biete */}
                      <div className="bg-paper-deep/40 rounded-xl p-3 border border-line">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink mb-1.5">
                          <span>{item.teachesIcon}</span>
                          <span className="font-mono text-[10px] uppercase text-sun tracking-wider">Ich biete</span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-ink mb-1">
                          {item.teachesTitle}
                        </h4>
                        <p className="font-body text-[11px] text-ink-faint leading-relaxed line-clamp-3">
                          {item.teachesDesc}
                        </p>
                      </div>

                      {/* Suche */}
                      <div className="bg-paper-deep/40 rounded-xl p-3 border border-line">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink mb-1.5">
                          <span>{item.seeksIcon}</span>
                          <span className="font-mono text-[10px] uppercase text-terracotta tracking-wider">Ich suche</span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-ink mb-1">
                          {item.seeksTitle}
                        </h4>
                        <p className="font-body text-[11px] text-ink-faint leading-relaxed line-clamp-3">
                          {item.seeksDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-line flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] text-ink-ghost">
                      0 € · Reiner Give & Take Tausch
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic(15)
                        setActiveSwapInquiry(item)
                        setInquiryMsg(`Hi ${item.authorName}! Ich habe dein Angebot „${item.teachesTitle}“ gesehen und hätte großes Interesse an einem Austausch in ${item.city}.`)
                      }}
                      className="btn btn-primary text-xs py-1.5 px-3.5 font-bold"
                    >
                      🔄 Tausch anfragen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRY TOAST */}
        {inquiryToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-paper px-4 py-3 rounded-xl shadow-2xl border border-sun text-xs font-bold flex items-center gap-2 animate-bounce">
            <span>🎉</span>
            <span>{inquiryToast}</span>
          </div>
        )}

        {/* SKILL-SWAP INQUIRY MODAL */}
        {activeSwapInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setActiveSwapInquiry(null)}
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔄</span>
                <div>
                  <h3 className="font-display text-ink text-xl font-bold">
                    Tausch anfragen
                  </h3>
                  <p className="font-mono text-[0.65rem] text-sun uppercase tracking-wider">
                    mit {activeSwapInquiry.authorName} in {activeSwapInquiry.city}
                  </p>
                </div>
              </div>

              <div className="bg-paper-deep/60 p-3.5 rounded-xl border border-line mb-4 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span>{activeSwapInquiry.teachesIcon}</span>
                  <span className="font-bold text-ink">{activeSwapInquiry.teachesTitle}</span>
                </div>
                <div className="text-[11px] text-ink-faint">
                  Im Gegenzug für: <strong>{activeSwapInquiry.seeksTitle}</strong>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <label className="block text-xs font-bold text-ink">
                  Deine persönliche Nachricht an {activeSwapInquiry.authorName}:
                </label>
                <textarea
                  rows={4}
                  value={inquiryMsg}
                  onChange={e => setInquiryMsg(e.target.value)}
                  className="field text-xs py-2 w-full"
                  placeholder="Schreibe kurz, wann und wo ihr euch treffen könnt…"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSendInquiry}
                  className="btn btn-primary w-full text-xs py-2.5 font-bold"
                >
                  ✉️ Nachricht senden & Tausch vorschlagen
                </button>
                <button
                  onClick={() => setActiveSwapInquiry(null)}
                  className="btn btn-ghost w-full text-xs py-2"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

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
