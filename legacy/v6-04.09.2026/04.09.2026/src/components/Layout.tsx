import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { user } from '../data/data'

function CompassRose({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Compass rose">
      <polygon points="50,6 44,50 56,50"  fill="#C9A84C" />
      <polygon points="50,94 44,50 56,50" fill="#8A7040" />
      <polygon points="94,50 50,44 50,56" fill="#8A7040" />
      <polygon points="6,50 50,44 50,56"  fill="#8A7040" />
      <polygon points="50,6 72,28 50,50"  fill="rgba(201,168,76,0.18)" />
      <polygon points="50,6 28,28 50,50"  fill="rgba(201,168,76,0.1)" />
      <circle cx="50" cy="50" r="9" fill="#C9A84C" />
      <circle cx="50" cy="50" r="4" fill="#0C1825" />
      <text x="50" y="4"  textAnchor="middle" fill="#C9A84C" fontSize="9" fontFamily="Cinzel,serif" fontWeight="700">N</text>
      <text x="50" y="99" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">S</text>
      <text x="97" y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">E</text>
      <text x="3"  y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">W</text>
    </svg>
  )
}

const navGroups = [
  {
    label: 'Expedition',
    emoji: '🧭',
    items: [
      { path: '/',         icon: '🏠', label: 'Home Base' },
      { path: '/explore',  icon: '🗺️', label: 'Karte erkunden' },
      { path: '/scratch',  icon: '🪙', label: 'Geheimnisse kratzen' },
      { path: '/stories',  icon: '📍', label: 'Story Pins' },
      { path: '/tours',    icon: '👟', label: 'Community Tours' },
    ],
  },
  {
    label: 'Werkzeuge',
    emoji: '⚙️',
    items: [
      { path: '/badges',    icon: '🏷️', label: 'Badge Kollektion' },
      { path: '/radar',     icon: '🛡️', label: 'Hazard Radar' },
      { path: '/ai',        icon: '🤖', label: 'KI-Reiseführer' },
      { path: '/growth',    icon: '🚀', label: 'Hermes Growth & Ads' },
      { path: '/checklists',icon: '✅', label: 'Checklisten' },
    ],
  },
  {
    label: 'Konto',
    emoji: '👤',
    items: [
      { path: '/profile',  icon: '👤', label: 'Mein Profil' },
      { path: '/host',     icon: '🏢', label: 'Host Portal' },
      { path: '/pricing',  icon: '💎', label: 'Preise' },
      { path: '/login',    icon: '🔑', label: 'Anmelden' },
    ],
  },
]

const xpPct = Math.round((user.xp / user.xpNext) * 100)

// Simple day counter for immersion
const sessionDay = 7

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  return (
    <aside className="flex flex-col h-full bg-[#0B1620] border-r border-[rgba(201,168,76,0.12)]">
      {/* Logo / Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[rgba(201,168,76,0.1)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="spin-slow flex-shrink-0"><CompassRose size={36} /></div>
          <div>
            <p className="font-display text-[#C9A84C] text-[0.82rem] font-bold leading-tight tracking-wider">Scratch'n'Travel</p>
            <p className="font-script text-[rgba(201,168,76,0.4)] text-[0.68rem]">chart your course</p>
          </div>
        </div>
        {/* Mini journal strip */}
        <div className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.08)] rounded-lg px-3 py-2">
          <p className="font-mono text-[0.56rem] text-[rgba(201,168,76,0.35)] uppercase tracking-widest mb-0.5">— Expeditions-Log —</p>
          <p className="font-script text-[rgba(201,168,76,0.55)] text-[0.78rem] leading-snug">
            Tag {sessionDay} · Portugal
          </p>
          <p className="font-mono text-[0.56rem] text-[rgba(138,154,170,0.5)] mt-0.5">38°42'N · 9°08'W</p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="font-mono text-[0.58rem] text-[rgba(201,168,76,0.3)] uppercase tracking-[0.22em] px-2 mb-1.5">
              {group.emoji} {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="text-sm w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span className="text-[0.76rem]">{item.label}</span>
                    {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-[#C9A84C]" />}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider with map latitude lines */}
      <div className="mx-4 border-t border-[rgba(201,168,76,0.08)] relative">
        <span className="absolute left-1/2 -translate-x-1/2 -top-2 font-mono text-[0.48rem] text-[rgba(201,168,76,0.2)] whitespace-nowrap bg-[#0B1620] px-1">
          — explorer —
        </span>
      </div>

      {/* XP / User panel */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[#F4E4C1] text-[0.72rem] truncate font-bold">{user.name}</p>
            <p className="font-mono text-[0.56rem] text-[rgba(201,168,76,0.5)] truncate">{user.rank}</p>
          </div>
          <div className="flex-shrink-0 text-center">
            <p className="font-display text-[#C9A84C] text-xs font-bold">{user.badges}</p>
            <p className="font-mono text-[0.48rem] text-[rgba(138,154,170,0.5)] uppercase">Badges</p>
          </div>
        </div>
        <div className="xp-bar mb-1.5">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[0.58rem] text-[rgba(138,154,170,0.6)]">{user.xp.toLocaleString()} XP</span>
          <span className="font-mono text-[0.54rem] text-[rgba(201,168,76,0.35)]">{xpPct}% zum nächsten Rang</span>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-[230px] lg:w-[248px] flex-shrink-0 flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[240px] md:hidden transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgba(201,168,76,0.12)] bg-[#0B1620] flex-shrink-0">
          <button onClick={() => setDrawerOpen(true)} className="text-[#C9A84C] text-xl">☰</button>
          <div className="flex items-center gap-2">
            <CompassRose size={22} />
            <span className="font-display text-[#C9A84C] text-sm font-bold tracking-wider">Scratch'n'Travel</span>
          </div>
          <NavLink to="/profile" className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display text-[#0C1825] text-xs font-bold">
            {user.initials}
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0C1825] map-grid">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
