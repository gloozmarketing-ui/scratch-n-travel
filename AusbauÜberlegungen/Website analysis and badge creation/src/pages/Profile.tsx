import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { tierGradient } from '../data/allBadges'

export default function Profile() {
  const { user, badges, stamps, reservations, triggerHaptic } = useTravel()
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'reservations' | 'settings'>('stats')
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState(user.name)
  const [bioInput, setBioInput] = useState(user.bio)
  const [handleInput, setHandleInput] = useState(user.handle)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const unlockedBadges = badges.filter(b => b.unlocked)
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  const handleSaveProfile = () => {
    triggerHaptic(20)
    user.name = nameInput
    user.bio = bioInput
    user.handle = handleInput
    user.initials = nameInput.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setIsEditing(false)
    }, 1500)
  }

  const handleExportData = () => {
    triggerHaptic(15)
    const exportData = {
      profile: user,
      stamps,
      unlockedBadgesCount: unlockedBadges.length,
      reservations,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scratch-n-travel-${user.handle.replace('@', '')}-journal.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Explorer since {user.joinDate} · Tier Master</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Mein Profil &amp; Abenteuer-Chronik</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">deine persönliche weltenbummler-legende</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                triggerHaptic(10)
                setIsEditing(true)
              }}
              className="btn btn-secondary text-xs py-2 px-3 font-bold"
            >
              ✏️ Profil bearbeiten
            </button>
            <button onClick={handleExportData} className="btn btn-ghost text-xs py-2 px-3">
              📥 Daten exportieren
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* HERO PROFILE CARD */}
        <div className="card p-6 border-[rgba(201,168,76,0.25)] shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-[#0C1825] text-3xl pulse-gold border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#152539] flex items-center justify-center text-xs text-white font-bold">
                {user.level}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-display text-[#F4E4C1] text-2xl font-bold">{user.name}</h2>
                <span className="font-mono text-xs text-[#C9A84C] bg-[rgba(201,168,76,0.1)] px-2.5 py-0.5 rounded-full border border-[rgba(201,168,76,0.3)]">
                  {user.handle}
                </span>
                <span className="font-mono text-[0.62rem] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  ✓ Verifizierter Explorer
                </span>
              </div>
              <p className="font-mono text-[#C9A84C] text-sm mb-2">{user.rank}</p>
              <p className="font-body text-[#8A9AAA] text-sm mb-3 max-w-xl leading-relaxed">{user.bio}</p>

              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[0.65rem] text-[#8A9AAA]">Progress to Rang {user.level + 1}</span>
                <span className="font-mono text-[0.65rem] text-[#C9A84C] font-bold">
                  {user.xp} / {user.xpNext} XP ({xpPct}%)
                </span>
              </div>
              <div className="xp-bar mb-4">
                <div className="xp-fill" style={{ width: `${xpPct}%` }} />
              </div>

              <div className="flex gap-2.5 flex-wrap">
                <Link to="/passport" className="btn btn-primary text-xs py-2 font-bold shadow-md">
                  🛂 Digitalen Reisepass öffnen
                </Link>
                <Link to="/wanderbond" className="btn btn-secondary text-xs py-2">
                  🧬 WanderBond DNA anpassen
                </Link>
                <Link to="/badges" className="btn btn-ghost text-xs py-2">
                  🏷️ 460+ Badges ({unlockedBadges.length} frei)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 border-b border-[rgba(201,168,76,0.2)] pb-2 flex-wrap">
          {[
            { id: 'stats', label: '📊 Reise-Statistiken' },
            { id: 'badges', label: `🏷️ Freigeschaltete Badges (${unlockedBadges.length})` },
            { id: 'reservations', label: `📅 Host-Reservierungen (${reservations.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                triggerHaptic(10)
                setActiveTab(t.id as any)
              }}
              className={`btn text-xs py-1.5 px-3.5 ${
                activeTab === t.id ? 'btn-primary font-bold shadow-md' : 'btn-ghost'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Besuchte Länder', value: user.countriesCount, icon: '🌍' },
                { label: 'Freigerubbelte Secrets', value: user.secretsCount, icon: '🔑' },
                { label: 'Erreichte Badges', value: user.badgesCount, icon: '🏷️' },
                { label: 'Explorer Level', value: user.level, icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="card p-4 text-center">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <p className="font-display text-2xl font-bold text-[#F4E4C1]">{s.value}</p>
                  <p className="font-mono text-[0.62rem] text-[#8A9AAA] uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* WanderBond Active Hobbies */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-[#F4E4C1] text-base font-bold">Deine WanderBond™ Leidenschaften</h3>
                <Link to="/wanderbond" className="font-mono text-xs text-[#C9A84C] hover:underline">
                  Bearbeiten →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.hobbies.map(h => (
                  <span
                    key={h}
                    className="bg-[#0C1825] border border-[rgba(201,168,76,0.3)] text-[#F4E4C1] px-3 py-1 rounded-full text-xs font-mono font-semibold"
                  >
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNLOCKED BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {unlockedBadges.map(b => (
                <div key={b.id} className="card p-3 flex flex-col justify-between border-[rgba(201,168,76,0.3)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{b.emoji}</span>
                    <span
                      className="font-mono text-[0.55rem] font-bold text-[#0C1825] rounded px-1.5 py-0.5 uppercase"
                      style={{ background: tierGradient[b.tier] }}
                    >
                      {b.tier}
                    </span>
                  </div>
                  <p className="font-display text-[#F4E4C1] text-xs font-bold mb-1 leading-tight line-clamp-1">{b.name}</p>
                  <p className="font-body text-[#8A9AAA] text-[0.7rem] line-clamp-2 mb-2 flex-1">{b.desc}</p>
                  <span className="font-mono text-emerald-400 text-[0.58rem] font-bold">✓ Freigeschaltet</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-3">
            {reservations.length === 0 ? (
              <div className="card p-8 text-center text-[#8A9AAA]">
                <span className="text-3xl block mb-2">📅</span>
                <p className="font-display text-[#F4E4C1] text-base font-bold mb-1">Keine aktiven Host-Reservierungen</p>
                <p className="text-xs mb-4">Du kannst bei lokalen Partnern Tische, Weinproben &amp; Touren direkt ohne Gebühren anfragen.</p>
                <Link to="/explore" className="btn btn-primary text-xs py-2 px-4">
                  Jetzt Aktivitäten entdecken →
                </Link>
              </div>
            ) : (
              reservations.map(r => (
                <div key={r.id} className="card p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-[#F4E4C1] font-bold text-sm">{r.hostBusiness}</span>
                      <span className="font-mono text-[0.6rem] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#C9A84C]">
                      📍 {r.city} · 📅 {r.date} um {r.time} · 👥 {r.guests} Gäste
                    </p>
                  </div>
                  <button className="btn btn-ghost text-xs py-1.5 px-3">Details</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold"
              >
                ✕
              </button>

              <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-4">Profil bearbeiten</h3>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-[#C9A84C] uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="field w-full"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#C9A84C] uppercase tracking-wider block mb-1">Handle</label>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={e => setHandleInput(e.target.value)}
                    className="field w-full"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#C9A84C] uppercase tracking-wider block mb-1">Bio</label>
                  <textarea
                    value={bioInput}
                    onChange={e => setBioInput(e.target.value)}
                    className="field w-full h-24 resize-none text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button onClick={handleSaveProfile} className="btn btn-primary flex-1 text-xs py-2.5 font-bold shadow-lg">
                    {savedSuccess ? '✓ Gespeichert!' : 'Speichern'}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-ghost text-xs py-2.5">
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
