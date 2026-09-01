import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import MobileBottomNav from './MobileBottomNav'

function CompassRose({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Compass rose">
      <polygon points="50,6 44,50 56,50" fill="#C9A84C" />
      <polygon points="50,94 44,50 56,50" fill="#8A7040" />
      <polygon points="94,50 50,44 50,56" fill="#8A7040" />
      <polygon points="6,50 50,44 50,56" fill="#8A7040" />
      <polygon points="50,6 72,28 50,50" fill="rgba(201,168,76,0.18)" />
      <polygon points="50,6 28,28 50,50" fill="rgba(201,168,76,0.1)" />
      <circle cx="50" cy="50" r="9" fill="#C9A84C" />
      <circle cx="50" cy="50" r="4" fill="#0C1825" />
      <text x="50" y="4" textAnchor="middle" fill="#C9A84C" fontSize="9" fontFamily="Cinzel,serif" fontWeight="700">N</text>
      <text x="50" y="99" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">S</text>
      <text x="97" y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">E</text>
      <text x="3" y="54" textAnchor="middle" fill="#8A7040" fontSize="7" fontFamily="Cinzel,serif">W</text>
    </svg>
  )
}

const navGroups = [
  {
    label: 'Navigation',
    items: [
      { path: '/', icon: '🏠', label: 'Home' },
      { path: '/explore', icon: '🗺️', label: 'Explore Map' },
      { path: '/scratch', icon: '🪙', label: 'Scratch Cards' },
      { path: '/passport', icon: '🛂', label: 'Reisepass' },
      { path: '/wanderbond', icon: '🧬', label: 'WanderBond™ DNA' },
      { path: '/stories', icon: '📍', label: 'Story Pins' },
      { path: '/tours', icon: '👟', label: 'Tours & GPX' },
      { path: '/badges', icon: '🏷️', label: '460+ Badges' },
      { path: '/radar', icon: '🛡️', label: 'Safety Radar' },
      { path: '/ai', icon: '🤖', label: 'AI Concierge' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/profile', icon: '👤', label: 'Profile' },
      { path: '/checklists', icon: '✅', label: 'Checklists' },
    ],
  },
  {
    label: 'Business',
    items: [
      { path: '/host', icon: '🏢', label: 'Host Portal' },
      { path: '/pricing', icon: '💎', label: 'Pricing' },
      { path: '/login', icon: '🔑', label: 'Sign In' },
    ],
  },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  const { user } = useTravel()
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  return (
    <aside className="flex flex-col h-full bg-[#0C1825] border-r border-[rgba(201,168,76,0.12)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[rgba(201,168,76,0.1)]">
        <div className="spin-slow flex-shrink-0">
          <CompassRose size={38} />
        </div>
        <div>
          <p className="font-display text-[#C9A84C] text-[0.85rem] font-bold leading-tight tracking-wider">Scratch'n'Travel</p>
          <p className="font-script text-[#8A9AAA] text-[0.72rem]">chart your course</p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.4)] uppercase tracking-[0.2em] px-2 mb-2">
              · {group.label} ·
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <span className="ml-auto text-[#C9A84C] text-[10px]">◀</span>}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* XP bar */}
      <div className="px-4 py-4 border-t border-[rgba(201,168,76,0.1)]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="font-display text-[#F4E4C1] text-[0.72rem] truncate">{user.name}</p>
            <p className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.65)] truncate">{user.rank}</p>
          </div>
        </div>
        <div className="xp-bar mb-1">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[0.6rem] text-[rgba(138,154,170,0.7)]">{user.xp} XP</span>
          <span className="font-mono text-[0.6rem] text-[rgba(201,168,76,0.5)]">{user.xpNext} XP</span>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useTravel()

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-[220px] lg:w-[240px] flex-shrink-0 flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)} />
      )}
      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[240px] md:hidden transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[rgba(201,168,76,0.12)] bg-[#0C1825] flex-shrink-0">
          <button onClick={() => setDrawerOpen(true)} className="text-[#C9A84C] text-xl">
            ☰
          </button>
          <div className="flex items-center gap-2">
            <CompassRose size={24} />
            <span className="font-display text-[#C9A84C] text-sm font-bold tracking-wider">Scratch'n'Travel</span>
          </div>
          <NavLink
            to="/passport"
            className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display text-[#0C1825] text-xs font-bold"
          >
            {user.initials}
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0C1825] map-grid pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  )
}
