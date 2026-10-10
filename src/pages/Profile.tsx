import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { tierGradient } from '../data/allBadges'

export default function Profile() {
  const { user, badges, stamps, reservations, triggerHaptic, logout, loginAsDemo, isProUser, proDaysRemaining, grantCommunityProDays } = useTravel()
  const [activeTab, setActiveTab] = useState<'stats' | 'tauschkonto' | 'badges' | 'reservations' | 'settings'>('stats')
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState(user.name)
  const [bioInput, setBioInput] = useState(user.bio)
  const [handleInput, setHandleInput] = useState(user.handle)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [boostNotice, setBoostNotice] = useState<string | null>(null)
  /** Steuert, für welche Reservierung die Details aufgeklappt sind. */
  const [openResId, setOpenResId] = useState<string | null>(null)

  const unlockedBadges = badges.filter(b => b.unlocked)
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  const handleQuickBoost = (days: number, reason: string) => {
    grantCommunityProDays(days, reason)
    setBoostNotice(`🎉 +${days} Tage VIP Pro gutgeschrieben: ${reason}!`)
    setTimeout(() => setBoostNotice(null), 4000)
  }

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
            <h1 className="font-display text-3xl text-ink font-bold">Mein Profil &amp; Abenteuer-Chronik</h1>
            <p className="font-script text-sun text-lg mt-0.5">deine persönliche weltenbummler-legende</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {user.handle === '@gast' ? (
              <>
                <Link to="/login" className="btn btn-primary text-xs py-2 px-4 font-bold shadow-md">
                  🔑 Jetzt Anmelden
                </Link>
                <button
                  onClick={() => loginAsDemo()}
                  className="btn btn-secondary text-xs py-2 px-3"
                  title="Demo-Profil aktivieren"
                >
                  Demo-Profil laden
                </button>
              </>
            ) : (
              <>
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
                  📥 Exportieren
                </button>
                <button
                  onClick={() => logout()}
                  className="btn btn-ghost text-xs py-2 px-3 text-terracotta border border-terracotta/40 font-bold hover:bg-terracotta hover:text-white transition"
                  title="Abmelden"
                >
                  🚪 Abmelden
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* HERO PROFILE CARD */}
        <div className="card p-6 border-sun shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-ink text-3xl pulse-gold border-2 border-line">
                {user.initials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center text-xs text-white font-bold">
                {user.level}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="font-display text-ink text-2xl font-bold">{user.name}</h2>
                <span className="font-mono text-xs text-sun bg-sun-wash px-2.5 py-0.5 rounded-full border border-sun">
                  {user.handle}
                </span>
                <span className="font-mono text-[0.62rem] text-leaf bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  ✓ Verifizierter Explorer
                </span>
                {isProUser && (
                  <span className="font-mono text-[0.62rem] text-sun bg-paper-deep border border-sun px-2 py-0.5 rounded-full font-bold">
                    🛡️ {user.isVip ? 'VIP Member' : `Pro aktiv (${proDaysRemaining}d)`}
                  </span>
                )}
              </div>
              <p className="font-mono text-sun text-sm mb-2">{user.rank}</p>
              <p className="font-body text-ink-faint text-sm mb-3 max-w-xl leading-relaxed">{user.bio}</p>

              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[0.65rem] text-ink-faint">Progress to Rang {user.level + 1}</span>
                <span className="font-mono text-[0.65rem] text-sun font-bold">
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
                <button
                  onClick={() => {
                    triggerHaptic(10)
                    setActiveTab('tauschkonto')
                  }}
                  className={`btn text-xs py-2 font-bold ${
                    activeTab === 'tauschkonto' ? 'btn-primary' : 'btn-secondary border-sun'
                  }`}
                >
                  🪙 Tauschkonto ({user.communityContributionsCount || 0} Karma)
                </button>
                <Link to="/wanderbond" className="btn btn-secondary text-xs py-2">
                  🧬 WanderBond DNA
                </Link>
                <Link to="/badges" className="btn btn-ghost text-xs py-2">
                  🏷️ Badges ({unlockedBadges.length})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 border-b border-sun pb-2 flex-wrap">
          {[
            { id: 'stats', label: '📊 Reise-Statistiken' },
            { id: 'tauschkonto', label: `🪙 Give & Take Tauschkonto (${user.communityContributionsCount || 0})` },
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
                  <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                  <p className="font-mono text-[0.62rem] text-ink-faint uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* WanderBond Active Hobbies */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-ink text-base font-bold">Deine WanderBond™ Leidenschaften</h3>
                <Link to="/wanderbond" className="font-mono text-xs text-sun hover:underline">
                  Bearbeiten →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.hobbies.map(h => (
                  <span
                    key={h}
                    className="bg-paper-deep border border-sun text-ink px-3 py-1 rounded-full text-xs font-mono font-semibold"
                  >
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GIVE & TAKE TAUSCHKONTO (SNT-511) */}
        {activeTab === 'tauschkonto' && (
          <div className="space-y-6">
            {/* Boost Notice Banner */}
            {boostNotice && (
              <div className="card p-4 bg-emerald-950/80 border-leaf flex items-center justify-between text-leaf text-xs font-mono animate-pulse">
                <span>{boostNotice}</span>
                <span className="font-bold">✓ Tauschkonto aktualisiert</span>
              </div>
            )}

            {/* Saldo & Status Card */}
            <div className="card p-6 border-sun bg-paper-deep">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-sun/30">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-sun font-bold">
                      🪙 Tausch-Saldo &amp; Community Karma
                    </span>
                    <span className="bg-emerald-950 text-leaf border border-leaf text-[0.62rem] font-mono px-2 py-0.5 rounded-full font-bold">
                      Fair &amp; Transparent
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-ink">
                    +{user.communityContributionsCount || 0} Beiträge im Tauschkonto
                  </h3>
                  <p className="font-body text-ink-faint text-xs md:text-sm mt-1 max-w-xl">
                    Gibst du der Community Geheimtipps, Notfall-Updates oder Meetups, bleibt dein VIP Pro Status
                    vollständig kostenlos.
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-left md:text-right">
                    <span className="font-mono text-[0.65rem] text-ink-faint block uppercase">Aktueller Schutzstatus</span>
                    <span
                      className={`font-mono text-sm font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                        isProUser
                          ? 'bg-emerald-950 text-leaf border-emerald-500/50'
                          : 'bg-paper text-sun border-sun/40'
                      }`}
                    >
                      {isProUser
                        ? user.isVip
                          ? '👑 VIP Explorer (Lifetime)'
                          : `🛡️ VIP Pro aktiv (${proDaysRemaining} Tage)`
                        : '🌱 Basis Explorer'}
                    </span>
                  </div>
                  <p className="font-mono text-[0.65rem] text-ink-faint">
                    {proDaysRemaining > 0
                      ? `Noch ${proDaysRemaining} Tage kostenlos freigeschaltet`
                      : 'Verdiene Pro-Tage durch Beiträge oder buche ein Abo'}
                  </p>
                </div>
              </div>

              {/* Erklärung Ehrenkodex */}
              <div className="mt-4 p-3.5 rounded-xl bg-paper border border-sun/20 flex items-start gap-3">
                <span className="text-xl">🤝</span>
                <div className="text-xs space-y-1">
                  <p className="font-display font-bold text-ink">Die Scratch&apos;n&apos;Travel Give &amp; Take Garantie</p>
                  <p className="text-ink-faint leading-relaxed">
                    Wir verlangen kein Geld von aktiven Weltenbummlern. Jede verifizierte Meldung (Gefahren im Radar,
                    neue Secret Spots oder verifizierte Host-Reviews) schenkt dir echte Tage unseres VIP Pro Schutzschilds.
                    Reisende ohne Zeit zum Beitragen können alternativ ab 7,50 €/Mo (oder 0,99 € Tagespass) unterstützen.
                  </p>
                </div>
              </div>
            </div>

            {/* BILANZ: GEGEBEN VS. GENOMMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LINKS: GEGEBEN */}
              <div className="card p-5 border-leaf bg-emerald-950/20">
                <div className="flex items-center justify-between pb-3 border-b border-leaf/30 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📤</span>
                    <h4 className="font-display text-base font-bold text-leaf">Gegeben (Community-Beiträge)</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-leaf">
                    +{user.communityContributionsCount || 0} Aktionen
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="text-ink">Secret Spots eingereicht</span>
                    </div>
                    <span className="font-bold text-leaf">
                      {Math.max(1, Math.round((user.communityContributionsCount || 1) * 0.6))} Spots (+14d je Spot)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span className="text-ink">Radar-Gefahren gemeldet</span>
                    </div>
                    <span className="font-bold text-leaf">
                      {Math.max(1, Math.round((user.communityContributionsCount || 1) * 0.4))} Meldungen (+7d je Meldung)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
                      <span className="text-ink">WanderBond Skills angeboten</span>
                    </div>
                    <span className="font-bold text-leaf">{user.hobbies.length} Interessen gelistet</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🤝</span>
                      <span className="text-ink">Local Host Feedback geteilt</span>
                    </div>
                    <span className="font-bold text-leaf">{reservations.length || 1} verifizierte Besuche</span>
                  </div>

                  <div className="pt-2 text-right">
                    <span className="text-[0.68rem] text-ink-faint">
                      Erwirtschafteter VIP Pro Gegenwert:{' '}
                      <strong className="text-leaf font-bold">
                        +{((user.communityContributionsCount || 1) * 14)} Pro-Tage (~{(
                          (user.communityContributionsCount || 1) * 3.5
                        ).toFixed(2)} €)
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* RECHTS: GENOMMEN */}
              <div className="card p-5 border-sun bg-paper-deep/60">
                <div className="flex items-center justify-between pb-3 border-b border-sun/30 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📥</span>
                    <h4 className="font-display text-base font-bold text-sun">Genommen (Inanspruchnahme)</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-sun">
                    {user.secretsCount + stamps.length} Nutzen
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🔑</span>
                      <span className="text-ink">Freigerubbelte Secret Spots</span>
                    </div>
                    <span className="font-bold text-sun">{user.secretsCount} Secrets (0 € Gebühr)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <span className="text-ink">Radar Notfall-Schutzschilde</span>
                    </div>
                    <span className="font-bold text-sun">35+ Länder weltweit</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🛂</span>
                      <span className="text-ink">Reisepass-Stempel &amp; Chronik</span>
                    </div>
                    <span className="font-bold text-sun">{stamps.length} digitale Stempel</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper/60 border border-sun/20">
                    <div className="flex items-center gap-2">
                      <span>🍽️</span>
                      <span className="text-ink">Gebührenfreie Reservierungen</span>
                    </div>
                    <span className="font-bold text-sun">{reservations.length} Buchungen (0% Provision)</span>
                  </div>

                  <div className="pt-2 text-right">
                    <span className="text-[0.68rem] text-ink-faint">
                      Community-Ersparnis vs. herkömmliche Plattformen:{' '}
                      <strong className="text-sun font-bold">~48,00 € Gebühren gespart</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANSAKTIONS-LEDGER */}
            <div className="card p-5 border-sun">
              <h4 className="font-display text-base font-bold text-ink mb-1">
                📜 Chronik deiner Tausch-Transaktionen
              </h4>
              <p className="font-body text-xs text-ink-faint mb-4">
                Transparente Aufzeichnung aller Gutschriften und Freischaltungen im Give &amp; Take System.
              </p>

              <div className="space-y-2">
                {[
                  {
                    icon: '📍',
                    type: 'GEGEBEN',
                    title: 'Neuen Secret Spot eingereicht: Miradouro Hidden Arch',
                    date: 'Vor 2 Tagen',
                    impact: '+14 Tage VIP Pro freigeschaltet',
                    badgeColor: 'text-leaf bg-emerald-950 border-leaf',
                  },
                  {
                    icon: '⚠️',
                    type: 'GEGEBEN',
                    title: 'Radar-Warnung gemeldet: Gefälschte Metro-Kontrolleure',
                    date: 'Vor 5 Tagen',
                    impact: '+7 Tage VIP Pro freigeschaltet',
                    badgeColor: 'text-leaf bg-emerald-950 border-leaf',
                  },
                  {
                    icon: '🔑',
                    type: 'GENOMMEN',
                    title: 'Secret Spot freigerubbelt: Alfama Hidden Bacalhau',
                    date: 'Vor 12 Tagen',
                    impact: '0,00 € (über Community-Guthaben verrechnet)',
                    badgeColor: 'text-sun bg-sun-wash border-sun',
                  },
                  {
                    icon: '🤝',
                    type: 'GEGEBEN',
                    title: 'WanderBond Skill-Swap angeboten: Fotografie & Surfen',
                    date: 'Vor 3 Wochen',
                    impact: 'Profil verifiziert & Community-Status aktiv',
                    badgeColor: 'text-leaf bg-emerald-950 border-leaf',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-paper border border-sun/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[0.55rem] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                          >
                            {item.type}
                          </span>
                          <span className="font-display text-xs font-bold text-ink">{item.title}</span>
                        </div>
                        <p className="font-mono text-[0.65rem] text-ink-faint mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-ink flex-shrink-0 sm:text-right">
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AKTIONEN: TAUSCHKONTO AUFLADEN */}
            <div className="card p-5 border-sun bg-paper-deep">
              <h4 className="font-display text-base font-bold text-ink mb-1">
                🚀 Sofort mehr freie VIP Pro Tage verdienen
              </h4>
              <p className="font-body text-xs text-ink-faint mb-4">
                Wähle eine Aktion, um dein Tauschkonto weiter aufzuladen und deinen VIP-Schutzschild zu verlängern:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  to="/explore"
                  className="card p-3.5 border-sun hover:border-leaf transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-2xl block mb-2">📍</span>
                    <p className="font-display font-bold text-ink text-xs group-hover:text-leaf transition">
                      Secret Spot vorschlagen
                    </p>
                    <p className="text-[0.68rem] text-ink-faint mt-1">
                      Teile ein verstecktes Café oder Aussichtspunkt.
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] text-leaf font-bold mt-3 block">
                    +14 Tage Pro verdienen →
                  </span>
                </Link>

                <Link
                  to="/radar"
                  className="card p-3.5 border-sun hover:border-leaf transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-2xl block mb-2">⚠️</span>
                    <p className="font-display font-bold text-ink text-xs group-hover:text-leaf transition">
                      Gefahr im Radar melden
                    </p>
                    <p className="text-[0.68rem] text-ink-faint mt-1">
                      Melde Touristenfallen, Taschendiebe oder Warnungen.
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] text-leaf font-bold mt-3 block">
                    +7 Tage Pro verdienen →
                  </span>
                </Link>

                <Link
                  to="/wanderbond"
                  className="card p-3.5 border-sun hover:border-leaf transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-2xl block mb-2">🔄</span>
                    <p className="font-display font-bold text-ink text-xs group-hover:text-leaf transition">
                      Skill-Swap inserieren
                    </p>
                    <p className="text-[0.68rem] text-ink-faint mt-1">
                      Biete dein Wissen an oder lerne Neues auf Reisen.
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] text-leaf font-bold mt-3 block">
                    Skill-Börse öffnen →
                  </span>
                </Link>

                <Link
                  to="/pricing"
                  className="card p-3.5 border-sun hover:border-sun transition flex flex-col justify-between group bg-sun-wash"
                >
                  <div>
                    <span className="text-2xl block mb-2">💳</span>
                    <p className="font-display font-bold text-ink text-xs group-hover:text-sun transition">
                      Keine Zeit zum Beitragen?
                    </p>
                    <p className="text-[0.68rem] text-ink-faint mt-1">
                      Pässe ab 0,99 € Tagespass oder 7,50 €/Mo buchen.
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] text-sun font-bold mt-3 block">
                    Pläne &amp; VIP Abos →
                  </span>
                </Link>
              </div>

              {/* Demo Schnell-Boost Test-Button */}
              <div className="mt-4 pt-4 border-t border-sun/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-ink-faint font-mono text-[0.68rem]">
                  🧪 Entwickler- &amp; Test-Modus: Sofortiges Gutschreiben im Browser testen
                </span>
                <button
                  onClick={() => handleQuickBoost(7, 'Test Gefahrenmeldung verifiziert')}
                  className="btn btn-secondary text-xs py-1.5 px-3 font-mono font-bold"
                >
                  ⚡ Test: +7 Tage gutschreiben
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNLOCKED BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {unlockedBadges.map(b => (
                <div key={b.id} className="card p-3 flex flex-col justify-between border-sun">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{b.emoji}</span>
                    <span
                      className="font-mono text-[0.55rem] font-bold text-ink rounded px-1.5 py-0.5 uppercase"
                      style={{ background: tierGradient[b.tier] }}
                    >
                      {b.tier}
                    </span>
                  </div>
                  <p className="font-display text-ink text-xs font-bold mb-1 leading-tight line-clamp-1">{b.name}</p>
                  <p className="font-body text-ink-faint text-[0.7rem] line-clamp-2 mb-2 flex-1">{b.desc}</p>
                  <span className="font-mono text-leaf text-[0.58rem] font-bold">✓ Freigeschaltet</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="space-y-3">
            {reservations.length === 0 ? (
              <div className="card p-8 text-center text-ink-faint">
                <span className="text-3xl block mb-2">📅</span>
                <p className="font-display text-ink text-base font-bold mb-1">Keine aktiven Host-Reservierungen</p>
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
                      <span className="font-display text-ink font-bold text-sm">{r.hostBusiness}</span>
                      <span className="font-mono text-[0.6rem] bg-emerald-950 text-leaf border border-leaf px-2 py-0.5 rounded-full font-bold">
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-sun">
                      📍 {r.city} · 📅 {r.date} um {r.time} · 👥 {r.guests} Gäste
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      setOpenResId(prev => (prev === r.id ? null : r.id))
                    }}
                    aria-expanded={openResId === r.id}
                    className="btn btn-ghost text-xs py-1.5 px-3"
                  >
                    {openResId === r.id ? 'Schließen' : 'Details'}
                  </button>
                  {openResId === r.id && (
                    <div className="w-full mt-2 pt-3 border-t border-sun/40 font-mono text-[0.68rem] text-ink-faint space-y-1">
                      <p>👤 {r.guestName} · 📧 {r.email}</p>
                      <p>🏷️ {r.category} · 🕓 angelegt am {r.createdAt}</p>
                      {r.notes && <p>📝 {r.notes}</p>}
                    </div>
                  )}
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
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              <h3 className="font-display text-ink text-xl font-bold mb-4">Profil bearbeiten</h3>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-sun uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="field w-full"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-sun uppercase tracking-wider block mb-1">Handle</label>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={e => setHandleInput(e.target.value)}
                    className="field w-full"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-sun uppercase tracking-wider block mb-1">Bio</label>
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
