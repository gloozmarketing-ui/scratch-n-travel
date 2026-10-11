import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { storyPins } from '../data/data'
import { useI18n } from '../lib/i18n'

type PassportMode = 'flipbook' | 'list'
type PassportTab = 'stamps' | 'dna' | 'quests' | 'feed'

const SIMULATED_DESTINATIONS = [
  { country: 'Portugal', city: 'Lissabon', flag: '🇵🇹', gps: "38°42'44\"N · 9°07'59\"W" },
  { country: 'Spanien', city: 'Barcelona', flag: '🇪🇸', gps: "41°23'20\"N · 2°10'35\"E" },
  { country: 'Italien', city: 'Florenz', flag: '🇮🇹', gps: "43°46'17\"N · 11°15'15\"E" },
  { country: 'Frankreich', city: 'Nizza', flag: '🇫🇷', gps: "43°42'12\"N · 7°15'59\"E" },
  { country: 'Japan', city: 'Kyoto', flag: '🇯🇵', gps: "35°00'58\"N · 135°40'30\"E" },
  { country: 'Indonesien', city: 'Ubud, Bali', flag: '🇮🇩', gps: "8°30'22\"S · 115°15'44\"E" },
  { country: 'Island', city: 'Reykjavik', flag: '🇮🇸', gps: "64°08'47\"N · 21°55'47\"W" },
  { country: 'Deutschland', city: 'Schwarzwald', flag: '🇩🇪', gps: "48°18'00\"N · 8°12'00\"E" },
]

export default function Passport() {
  const {
    user,
    stamps,
    quests,
    feed,
    scratchedIds,
    currentLocation,
    setCurrentLocation,
    addGpsStamp,
    completeQuestStep,
    likeFeedItem,
    triggerHaptic
  } = useTravel()

  const { t } = useI18n()
  const [mode, setMode] = useState<PassportMode>('flipbook')
  const [spread, setSpread] = useState<number>(0) // 0: Cover & ID, 1: Stamps & GPS, 2: Postcards, 3: Secrets & Cities
  const [isFlipping, setIsFlipping] = useState<boolean>(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')
  const [tab, setTab] = useState<PassportTab>('stamps')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [stampedSuccess, setStampedSuccess] = useState<string | null>(null)

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))
  const shareUrl = `${window.location.origin}/profile?user=${encodeURIComponent(user.handle)}`

  // Get revealed postcards from storyPins matching scratchedIds
  const revealedPostcards = storyPins.filter(pin => scratchedIds.includes(pin.id))

  const handleCopyLink = () => {
    triggerHaptic(15)
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleFlip = (newSpread: number, dir: 'next' | 'prev') => {
    if (newSpread < 0 || newSpread > 3 || isFlipping) return
    triggerHaptic([20, 40])
    setFlipDirection(dir)
    setIsFlipping(true)
    setTimeout(() => {
      setSpread(newSpread)
      setIsFlipping(false)
    }, 350)
  }

  const handleLiveGpsStamp = () => {
    triggerHaptic([40, 80, 40])
    const newStamp = addGpsStamp(
      currentLocation.country,
      currentLocation.city,
      currentLocation.flag,
      currentLocation.gps,
      `Offizieller Grenzübertritt ${currentLocation.city}`,
      75
    )
    setStampedSuccess(`🎉 Neuer Einreisestempel für ${newStamp.city} (${newStamp.country}) eingeprägt! (+75 XP)`)
    setTimeout(() => setStampedSuccess(null), 4000)
  }

  return (
    <div className="min-h-screen bg-paper pb-24 md:pb-12 text-ink">
      {/* ─── HEADER ─── */}
      <div className="page-header border-b border-sun/30 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap max-w-6xl mx-auto">
          <div>
            <p className="coord mb-1">Official Digital Travel Document · Series SNT-2026-PT</p>
            <h1 className="font-display text-3xl md:text-4xl text-ink font-black tracking-tight">
              {t('passport_title')}
            </h1>
            <p className="font-script text-sun text-lg mt-0.5">
              {t('passport_subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-paper-deep border border-sun p-1 rounded-xl">
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setMode('flipbook')
                }}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all ${
                  mode === 'flipbook' ? 'bg-sun text-paper-deep shadow' : 'text-ink-faint hover:text-ink'
                }`}
              >
                📖 3D-Reisepass
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10)
                  setMode('list')
                }}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all ${
                  mode === 'list' ? 'bg-sun text-paper-deep shadow' : 'text-ink-faint hover:text-ink'
                }`}
              >
                📋 Listen-Modus
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic(10)
                setShowShareModal(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1.5 shadow-lg"
            >
              <span>📲</span>
              <span>Pass teilen / QR</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Success Alert */}
        {stampedSuccess && (
          <div className="p-3.5 rounded-xl bg-leaf-wash border-2 border-leaf text-ink text-xs font-mono font-bold flex items-center justify-between shadow-lg animate-fade-in">
            <span>{stampedSuccess}</span>
            <span className="text-leaf">✓ Gespeichert</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODUS 1: REALISTISCHER 3D-REISEPASS MIT UMBLÄTTER-ANIMATION
           ══════════════════════════════════════════════════════════════════════ */}
        {mode === 'flipbook' && (
          <div className="space-y-6 animate-fade-in">
            {/* Flip Controls & Breadcrumb Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-paper-deep p-3.5 rounded-2xl border border-sun">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-ink-faint">Seitenwahl:</span>
                {[
                  { idx: 0, label: '1–2 Deckblatt & ID' },
                  { idx: 1, label: '3–4 GPS Visa-Stempel' },
                  { idx: 2, label: '5–6 Postkarten' },
                  { idx: 3, label: '7–8 Secret Spots' },
                ].map(p => (
                  <button
                    key={p.idx}
                    onClick={() => handleFlip(p.idx, p.idx > spread ? 'next' : 'prev')}
                    className={`text-[0.7rem] font-mono px-3 py-1 rounded-lg border transition-all ${
                      spread === p.idx
                        ? 'bg-sun text-paper-deep font-bold border-sun shadow'
                        : 'bg-card text-ink-faint border-sun/30 hover:text-ink'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={spread === 0 || isFlipping}
                  onClick={() => handleFlip(spread - 1, 'prev')}
                  className="btn btn-secondary text-xs py-1.5 px-3 disabled:opacity-30 flex items-center gap-1"
                >
                  <span>←</span>
                  <span>{t('passport_flip_prev')}</span>
                </button>
                <button
                  disabled={spread === 3 || isFlipping}
                  onClick={() => handleFlip(spread + 1, 'next')}
                  className="btn btn-primary text-xs py-1.5 px-3 disabled:opacity-30 flex items-center gap-1 font-bold shadow"
                >
                  <span>{t('passport_flip_next')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 3D BOOK CONTAINER */}
            <div
              className={`relative mx-auto rounded-3xl p-3 sm:p-5 shadow-2xl transition-all duration-300 ${
                isFlipping ? 'scale-98 opacity-90' : 'scale-100 opacity-100'
              }`}
              style={{
                background: 'linear-gradient(135deg, #1b2631 0%, #0e171e 100%)',
                border: '4px solid #b07d24',
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6), inset 0 0 20px rgba(176,125,36,0.3)',
                perspective: '1400px',
              }}
            >
              {/* Buchrücken (Spine & Stitches) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 z-20 pointer-events-none hidden md:block">
                <div className="h-full w-full bg-gradient-to-r from-black/40 via-[#b07d24]/30 to-black/40 shadow-inner border-x border-[#b07d24]/20" />
              </div>

              {/* DOPPELSEITE / SPREAD INHALT */}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 min-h-[500px]">

                {/* ══════════════════════════════════════════════════════════════
                    SPREAD 0: DECKBLATT (LINKS) & IDENTITÄTS-SEITE (RECHTS)
                   ══════════════════════════════════════════════════════════════ */}
                {spread === 0 && (
                  <>
                    {/* Linke Seite: Edles Leder-Cover mit Goldprägung */}
                    <div
                      className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center text-white relative overflow-hidden border border-[#b07d24]/40"
                      style={{
                        background: 'radial-gradient(circle at center, #243342 0%, #151f28 100%)',
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
                      }}
                    >
                      <div className="space-y-2">
                        <p className="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-[#D9D19B]">
                          UNIONE EXPLORATORUM EUROPA
                        </p>
                        <p className="font-serif text-xs italic tracking-widest text-white/80">
                          PASSEPORT OFFICIEL DE VOYAGE
                        </p>
                      </div>

                      {/* Großes goldenes Wappen */}
                      <div className="my-6 relative">
                        <div className="w-32 h-32 rounded-full border-2 border-[#D9D19B] flex items-center justify-center p-3 shadow-2xl bg-gradient-to-br from-[#b07d24]/20 to-black/60">
                          <span className="text-5xl filter drop-shadow-[0_4px_8px_rgba(217,209,155,0.4)]">⚜️</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.55rem] text-[#D9D19B] bg-[#151f28] px-3 py-0.5 rounded-full border border-[#D9D19B]/40 whitespace-nowrap">
                          CHIP SECURE · NFC
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#D9D19B]">
                          SCRATCH 'N' TRAVEL
                        </h2>
                        <p className="font-mono text-[0.68rem] text-white/70 tracking-widest">
                          REISEPASS FÜR FREIE ENTDECKER
                        </p>
                        <p className="font-mono text-[0.58rem] text-[#D9D19B]/70 pt-2">
                          DOC NO: SNT-2026-PT-00892
                        </p>
                      </div>
                    </div>

                    {/* Rechte Seite: Amtliche Personaldokument-Seite */}
                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink relative">
                      <div>
                        {/* Kopfzeile */}
                        <div className="flex justify-between items-start border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <p className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-faint">
                              REPUBLIK DER ENTDECKER · PASSPORT
                            </p>
                            <h3 className="font-display font-black text-base text-ink">
                              PERSONALAUSWEIS &amp; STATUS
                            </h3>
                          </div>
                          <span className="text-xl">🛂</span>
                        </div>

                        {/* Foto & Stammdaten */}
                        <div className="flex gap-4 items-center mb-4">
                          <div className="w-20 h-24 rounded-xl gold-gradient flex flex-col items-center justify-center border-2 border-sun shadow-md text-ink font-black text-2xl relative overflow-hidden flex-shrink-0">
                            <span>{user.initials}</span>
                            <span className="absolute bottom-1 text-[0.5rem] font-mono opacity-80">VERIFIED</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <p className="font-mono text-[0.6rem] text-ink-faint">Name des Inhabers:</p>
                            <p className="font-display font-bold text-sm text-ink">{user.name}</p>
                            <p className="font-mono text-[0.62rem] text-sun">{user.handle}</p>
                            <p className="font-mono text-[0.58rem] text-ink-faint">Rang: <strong className="text-ink">{user.rank}</strong></p>
                          </div>
                        </div>

                        {/* Statistik Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                          <div className="p-2 rounded-lg bg-paper-deep border border-sun/40">
                            <p className="font-mono text-[0.55rem] text-ink-faint">LÄNDER</p>
                            <p className="font-display text-base font-bold text-ink">{user.countriesCount}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-paper-deep border border-sun/40">
                            <p className="font-mono text-[0.55rem] text-ink-faint">SECRETS</p>
                            <p className="font-display text-base font-bold text-ink">{user.secretsCount}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-paper-deep border border-sun/40">
                            <p className="font-mono text-[0.55rem] text-ink-faint">BADGES</p>
                            <p className="font-display text-base font-bold text-ink">{user.badgesCount}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-paper-deep border border-sun/40">
                            <p className="font-mono text-[0.55rem] text-ink-faint">LEVEL</p>
                            <p className="font-display text-base font-bold text-sun">Lvl {user.level}</p>
                          </div>
                        </div>

                        {/* XP Balken */}
                        <div className="p-2.5 rounded-xl bg-paper-deep border border-sun/40 mb-3">
                          <div className="flex justify-between font-mono text-[0.6rem] text-ink mb-1">
                            <span>Fortschritt zu Level {user.level + 1}</span>
                            <span>{user.xp} / {user.xpNext} XP ({xpPct}%)</span>
                          </div>
                          <div className="h-2 bg-ink-ghost/20 rounded-full overflow-hidden">
                            <div className="h-full bg-sun rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* MRZ - Machine Readable Zone wie im echten Reisepass */}
                      <div className="p-2 bg-paper-deep rounded-lg border border-sun/40 font-mono text-[0.52rem] text-ink-faint tracking-wider leading-relaxed select-all">
                        <p>P&lt;SNT{user.initials}&lt;&lt;{user.name.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                        <p>SNT2026PT00892&lt;&lt;&lt;9308144M2610115&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</p>
                      </div>
                    </div>
                  </>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    SPREAD 1: GPS VISUM-STEMPEL & LIVE-STEMPLER
                   ══════════════════════════════════════════════════════════════ */}
                {spread === 1 && (
                  <>
                    {/* Linke Seite: Vor-Ort GPS Stempel-Station */}
                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 3 · VISA AUTOMATION</span>
                            <h3 className="font-display font-black text-lg text-ink">GPS Grenzstempel-Station</h3>
                          </div>
                          <span className="text-2xl">📍</span>
                        </div>

                        <p className="font-body text-xs text-ink-faint leading-relaxed mb-4">
                          Reisestempel werden an deinen echten physischen Standort gekoppelt. Wenn du vor Ort bist, prägt das System den Stempel offiziell in deinen Reisepass ein.
                        </p>

                        {/* Aktuelle GPS Erkennung */}
                        <div className="p-3.5 rounded-xl bg-paper-deep border-2 border-leaf shadow-sm space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[0.62rem] text-leaf font-bold">🟢 GPS SIGNAL AKTIV &amp; BESTÄTIGT</span>
                            <span className="text-lg">{currentLocation.flag}</span>
                          </div>
                          <p className="font-display text-base font-bold text-ink">
                            {currentLocation.city}, {currentLocation.country}
                          </p>
                          <p className="font-mono text-[0.62rem] text-leaf font-bold">
                            {currentLocation.gps}
                          </p>
                        </div>

                        {/* Stempel-Button */}
                        <button
                          onClick={handleLiveGpsStamp}
                          className="btn btn-primary w-full py-3.5 text-xs font-bold shadow-lg flex items-center justify-center gap-2 mb-4"
                        >
                          <span>🔏</span>
                          <span>Offiziellen Einreisestempel einprägen (+75 XP)</span>
                        </button>

                        {/* GPS Test-Simulator */}
                        <div className="p-3 rounded-xl bg-paper-deep border border-sun/40 space-y-2">
                          <p className="font-mono text-[0.6rem] text-sun font-bold">
                            🧪 Test-Standort wechseln (GPS-Simulator):
                          </p>
                          <select
                            value={currentLocation.country}
                            onChange={e => {
                              const dest = SIMULATED_DESTINATIONS.find(d => d.country === e.target.value)
                              if (dest) {
                                triggerHaptic(10)
                                setCurrentLocation({ ...dest, isSimulated: true })
                              }
                            }}
                            className="w-full text-xs font-mono p-2 rounded-lg bg-card border border-sun/40 text-ink"
                          >
                            {SIMULATED_DESTINATIONS.map(d => (
                              <option key={d.country} value={d.country}>
                                {d.flag} {d.city} ({d.country})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="text-[0.6rem] font-mono text-ink-faint pt-3 border-t border-sun/30 text-center">
                        Amtlich beglaubigt durch das dezentrale Scratch'n'Travel Koordinaten-Protokoll
                      </div>
                    </div>

                    {/* Rechte Seite: Bunte Visum-Stempelsammlung */}
                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 4 · VISA STAMPS</span>
                            <h3 className="font-display font-black text-lg text-ink">Eingestempelte Visa ({stamps.length})</h3>
                          </div>
                          <span className="text-xl">🏛️</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                          {stamps.map(s => (
                            <div
                              key={s.id}
                              className="p-3 rounded-2xl border-2 border-dashed flex flex-col justify-between transition-all hover:scale-102 shadow-sm relative overflow-hidden"
                              style={{
                                borderColor: s.color || '#b07d24',
                                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <span className="text-2xl">{s.flag}</span>
                                <span className="font-mono text-[0.55rem] font-bold text-sun">+{s.xpEarned} XP</span>
                              </div>

                              <div className="my-1.5 text-center">
                                <p className="font-display font-bold text-xs text-ink">{s.city}</p>
                                <p className="font-mono text-[0.6rem] text-ink-faint">{s.country}</p>
                              </div>

                              <div className="border-t border-ink/10 pt-1 text-[0.55rem] font-mono text-ink-faint text-center">
                                <span>{s.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center font-mono text-[0.6rem] text-sun pt-2">
                        ✦ Jeder Stempel erhöht deinen Rang &amp; schaltet Boni frei
                      </div>
                    </div>
                  </>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    SPREAD 2: FREIGERUBBELTE POSTKARTEN
                   ══════════════════════════════════════════════════════════════ */}
                {spread === 2 && (
                  <>
                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 5 · POSTCARDS VOL. 1</span>
                            <h3 className="font-display font-black text-lg text-ink">Enthüllte Kunstkarten</h3>
                          </div>
                          <span className="text-2xl">🎟️</span>
                        </div>

                        <p className="font-body text-xs text-ink-faint mb-3">
                          Postkarten, die du erfolgreich mit der goldenen Rubbelfolie freigelegt hast. Jede Karte ist ein Dokument deiner Reise.
                        </p>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {revealedPostcards.slice(0, 3).map(card => (
                            <div key={card.id} className="p-3 bg-paper-deep rounded-xl border border-sun flex items-center gap-3">
                              <span className="text-3xl">{card.countryFlag}</span>
                              <div className="flex-1 min-h-0">
                                <p className="font-display font-bold text-xs text-ink truncate">{card.location}</p>
                                <p className="font-mono text-[0.6rem] text-leaf truncate">{card.gps}</p>
                                <p className="font-mono text-[0.55rem] text-ink-faint">{card.tag}</p>
                              </div>
                              <span className="font-mono text-[0.62rem] font-bold text-sun">+{card.xp} XP</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link to="/scratch" className="btn btn-secondary text-xs py-2 text-center mt-3 font-bold">
                        Weitere Postkarten freirubbeln →
                      </Link>
                    </div>

                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 6 · POSTCARDS VOL. 2</span>
                            <h3 className="font-display font-black text-lg text-ink">Briefmarken &amp; Signaturen</h3>
                          </div>
                          <span className="text-2xl">✉️</span>
                        </div>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {revealedPostcards.slice(3).map(card => (
                            <div key={card.id} className="p-3 bg-paper-deep rounded-xl border border-sun flex items-center gap-3">
                              <span className="text-3xl">{card.countryFlag}</span>
                              <div className="flex-1 min-h-0">
                                <p className="font-display font-bold text-xs text-ink truncate">{card.location}</p>
                                <p className="font-mono text-[0.6rem] text-leaf truncate">{card.gps}</p>
                              </div>
                              <span className="font-mono text-[0.62rem] font-bold text-sun">+{card.xp} XP</span>
                            </div>
                          ))}
                          {revealedPostcards.length <= 3 && (
                            <div className="p-6 border-2 border-dashed border-sun/40 rounded-xl text-center space-y-2">
                              <span className="text-2xl">📭</span>
                              <p className="font-display text-xs font-bold text-ink">Noch Plätze frei!</p>
                              <p className="font-body text-[0.7rem] text-ink-faint">
                                Rubble weitere geheime Orte in der Postkarten-Sektion frei, um diese Doppelseite zu füllen.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center font-mono text-[0.6rem] text-ink-faint pt-2">
                        {revealedPostcards.length} von {storyPins.length} Postkarten im Besitz
                      </div>
                    </div>
                  </>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    SPREAD 3: SECRET SPOTS & STÄDTE CHRONIK
                   ══════════════════════════════════════════════════════════════ */}
                {spread === 3 && (
                  <>
                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 7 · SECRET SPOTS</span>
                            <h3 className="font-display font-black text-lg text-ink">Entdeckte Geheimtipps</h3>
                          </div>
                          <span className="text-2xl">🗝️</span>
                        </div>

                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {stamps.map((st, i) => (
                            <div key={st.id} className="p-2.5 bg-paper-deep rounded-xl border border-sun/40 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-display font-bold text-ink">{st.secretName || st.city}</p>
                                <p className="font-mono text-[0.58rem] text-sun">{st.gps}</p>
                              </div>
                              <span className="font-mono text-[0.6rem] text-leaf font-bold">+{st.xpEarned} XP</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center font-mono text-[0.6rem] text-sun pt-2">
                        Gesamt: {user.secretsCount} Secrets im Logbuch verzeichnet
                      </div>
                    </div>

                    <div className="parchment rounded-2xl p-5 sm:p-7 flex flex-col justify-between border-2 border-sun shadow-inner text-ink">
                      <div>
                        <div className="flex justify-between items-center border-b border-sun/40 pb-3 mb-4">
                          <div>
                            <span className="font-mono text-[0.55rem] uppercase text-sun font-bold">SEITE 8 · CITIES &amp; REGIONS</span>
                            <h3 className="font-display font-black text-lg text-ink">Bereiste Städte-Chronik</h3>
                          </div>
                          <span className="text-2xl">🏙️</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center mb-4">
                          {['Lisbon', 'Sintra', 'Kyoto', 'Ubud', 'Ericeira', 'Barcelona', 'Florenz', 'Nizza'].map(city => {
                            const hasVisited = stamps.some(s => s.city.toLowerCase().includes(city.toLowerCase()))
                            return (
                              <div
                                key={city}
                                className={`p-2 rounded-xl border text-xs font-mono ${
                                  hasVisited
                                    ? 'bg-leaf-wash border-leaf text-ink font-bold'
                                    : 'bg-paper-deep border-sun/30 text-ink-faint opacity-50'
                                }`}
                              >
                                {hasVisited ? `✓ ${city}` : `🔒 ${city}`}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-paper-deep rounded-xl border border-sun text-center space-y-1">
                        <p className="font-mono text-[0.62rem] text-sun font-bold">🌍 Nächstes Etappenziel</p>
                        <p className="font-body text-xs text-ink">Reise nach {currentLocation.city} für den nächsten Visastempel!</p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODUS 2: KLASSISCHE TAB- & LISTEN-ANSICHT
           ══════════════════════════════════════════════════════════════════════ */}
        {mode === 'list' && (
          <div className="space-y-6 animate-fade-in">
            {/* Identity Card */}
            <div className="parchment rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-terracotta relative overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6 items-center border-b border-line pb-6 mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-ink text-3xl shadow-xl mb-3 border-2 border-line">
                    {user.initials}
                  </div>
                  <p className="font-display text-ink font-black text-lg">{user.name}</p>
                  <p className="font-mono text-[0.68rem] text-terracotta">{user.handle}</p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      ['🌍 Länder', user.countriesCount],
                      ['🔑 Secrets', user.secretsCount],
                      ['🏷️ Badges', user.badgesCount],
                      ['⭐ Level', user.level],
                    ].map(([label, val]) => (
                      <div key={String(label)} className="bg-ink-ghost/10 rounded-xl p-2.5 text-center border border-terracotta">
                        <p className="font-mono text-[0.6rem] text-terracotta">{label}</p>
                        <p className="font-display text-ink font-black text-xl">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 mb-6 border-b border-line pb-3 flex-wrap">
                {[
                  { id: 'stamps', label: `🏛️ Visum-Stempel (${stamps.length})` },
                  { id: 'dna', label: `🧬 WanderBond DNA (${user.hobbies.length})` },
                  { id: 'quests', label: `⚔️ City Quests (${quests.length})` },
                  { id: 'feed', label: `📡 Explorer Feed (${feed.length})` },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      triggerHaptic(10)
                      setTab(t.id as PassportTab)
                    }}
                    className={`btn text-xs py-1.5 px-3.5 ${
                      tab === t.id ? 'btn-primary font-bold shadow-md' : 'bg-transparent text-ink hover:bg-ink-ghost/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Stamps */}
              {tab === 'stamps' && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {stamps.map(s => (
                    <div
                      key={s.id}
                      className="rounded-2xl p-4 border-2 border-dashed border-terracotta bg-[rgba(255,255,255,0.4)] flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-2xl">{s.flag}</span>
                          <h4 className="font-display text-ink font-bold text-sm mt-1">{s.city}</h4>
                          <p className="font-mono text-[0.6rem] text-terracotta">{s.country}</p>
                        </div>
                        <span className="font-mono text-[0.6rem] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-bold">
                          +{s.xpEarned} XP
                        </span>
                      </div>
                      <div className="border-t border-line pt-2 mt-2 space-y-1">
                        <p className="font-display text-xs text-ink font-semibold">{s.secretName}</p>
                        <p className="font-mono text-[0.58rem] text-terracotta">{s.gps}</p>
                        <p className="font-mono text-[0.55rem] text-terracotta/70 text-right">Eingestempelt: {s.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: WanderBond DNA */}
              {tab === 'dna' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-ink text-lg font-bold">Deine aktive WanderBond™ DNA</h3>
                      <p className="font-body text-terracotta text-xs">
                        Kombination deiner Reise-Leidenschaften für personalisierte Empfehlungen.
                      </p>
                    </div>
                    <Link to="/wanderbond" className="btn btn-primary text-xs py-1.5 px-3">
                      🧬 DNA erweitern →
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.hobbies.map(h => (
                      <span key={h} className="bg-card text-ink px-3 py-1 rounded-full text-xs font-mono font-bold shadow">
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Quests */}
              {tab === 'quests' && (
                <div className="space-y-4">
                  {quests.map(q => (
                    <div key={q.id} className="bg-[rgba(255,255,255,0.4)] rounded-xl p-4 border border-terracotta space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display text-ink font-bold text-sm">{q.title}</h4>
                          <p className="font-mono text-[0.62rem] text-terracotta">
                            Stadt: {q.city} · Belohnung: {q.rewardBadgeName}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          +{q.xp} XP
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {q.steps.map(s => (
                          <label key={s.id} className="flex items-center gap-2 text-xs font-body text-ink cursor-pointer">
                            <input
                              type="checkbox"
                              checked={s.done}
                              onChange={() => {
                                triggerHaptic(10)
                                completeQuestStep(q.id, s.id)
                              }}
                              className="rounded text-terracotta"
                            />
                            <span className={s.done ? 'line-through opacity-60' : ''}>{s.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Explorer Feed */}
              {tab === 'feed' && (
                <div className="space-y-3">
                  {feed.map(item => (
                    <div key={item.id} className="bg-paper-deep p-3.5 rounded-xl border border-sun flex items-center justify-between">
                      <div>
                        <p className="font-display text-xs font-bold text-ink">{item.userName} {item.action}</p>
                        <p className="font-mono text-[0.62rem] text-sun">{item.target} · {item.location}</p>
                      </div>
                      <button
                        onClick={() => likeFeedItem(item.id)}
                        className="btn btn-secondary text-xs py-1 px-2.5"
                      >
                        ❤️ {item.likes}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card parchment max-w-sm w-full p-6 space-y-4 border-2 border-sun shadow-2xl rounded-2xl animate-fade-in text-center">
            <span className="text-4xl">🛂</span>
            <h3 className="font-display text-xl font-bold text-ink">Dein Digitaler Reisepass</h3>
            <p className="font-body text-xs text-ink-faint">
              Teile dein Entdecker-Profil und deine Visa-Stempel mit Freunden oder Locals:
            </p>
            <div className="p-3 bg-paper-deep rounded-xl border border-sun font-mono text-[0.68rem] text-sun break-all select-all">
              {shareUrl}
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopyLink} className="btn btn-primary flex-1 py-2 text-xs font-bold">
                {copied ? '✓ Kopiert!' : 'Link kopieren'}
              </button>
              <button onClick={() => setShowShareModal(false)} className="btn btn-secondary py-2 text-xs">
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
