import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { ThemeToggle } from '../context/ThemeContext'
import MobileBottomNav from './MobileBottomNav'

/** Kompassrose als Markenzeichen — das Wegweiser-Motiv. */
function CompassRose({ size = 44, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Kompassrose"
      className={spin ? 'spin-slow' : undefined}
      style={{ flexShrink: 0 }}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <polygon points="50,10 44,50 56,50" fill="var(--sun)" />
      <polygon points="50,90 44,50 56,50" fill="var(--ink-ghost)" />
      <polygon points="90,50 50,44 50,56" fill="var(--ink-ghost)" />
      <polygon points="10,50 50,44 50,56" fill="var(--ink-ghost)" />
      <polygon points="50,10 70,30 50,50" fill="var(--sun)" opacity="0.28" />
      <polygon points="50,10 30,30 50,50" fill="var(--sun)" opacity="0.15" />
      <circle cx="50" cy="50" r="6" fill="var(--sun)" />
    </svg>
  )
}

/**
 * Navigation.
 *
 * Wichtig: Die Labels sind menschlich, nicht technisch.
 * Frueher standen dort Produktbegriffe wie "WanderBond(TM) DNA" oder
 * "460+ Badges" — das klingt nach Datenbank, nicht nach Reise.
 * Was ein Mensch auf einer Reise sucht, hat einen anderen Namen.
 */
const navGroups = [
  {
    label: 'Entdecken',
    items: [
      { path: '/', icon: '🏠', label: 'Start' },
      { path: '/explore', icon: '🗺️', label: 'Geheimtipps' },
      { path: '/stories', icon: '📍', label: 'Erzählungen' },
      { path: '/local-routes', icon: '🗺️', label: 'Local-Routen' },
      { path: '/tours', icon: '🥾', label: 'Touren' },
    ],
  },
  {
    label: 'Menschen',
    items: [
      { path: '/people', icon: '🤝', label: 'Gleichgesinnte' },
      { path: '/meetups', icon: '☕', label: 'Meetups' },
      { path: '/chat', icon: '💬', label: 'Nachrichten' },
    ],
  },
  {
    label: 'Deine Reise',
    items: [
      { path: '/passport', icon: '📖', label: 'Reisepass' },
      { path: '/scratch', icon: '🎟️', label: 'Postkarten' },
      { path: '/wanderbond', icon: '🧭', label: 'Was dich treibt' },
      { path: '/badges', icon: '🏅', label: 'Erfolge' },
      { path: '/checklists', icon: '🎒', label: 'Packliste' },
    ],
  },
  {
    label: 'Sicherheit',
    items: [
      { path: '/radar', icon: '🧭', label: 'Gefahrenlage' },
      { path: '/safety', icon: '🛡️', label: 'Sicher unterwegs' },
    ],
  },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  const { user } = useTravel()
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  return (
    <aside className="sidebar flex flex-col h-full sidebar-inner" style={{ background: 'var(--paper)', borderRight: '1px solid var(--line)' }}>
      {/* Wortmarke */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '1.1rem 1.1rem 1rem', borderBottom: '1px solid var(--line-soft)' }}>
        <CompassRose size={36} spin />
        <div style={{ minWidth: 0 }}>
          <p className="font-display" style={{ margin: 0, color: 'var(--ink)', fontSize: '0.98rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Scratch'n'Travel
          </p>
          <p className="font-hand" style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.95rem', lineHeight: 1 }}>
            gemeinsam unterwegs
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-nav" style={{ padding: '0.85rem 0.65rem' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '1.35rem' }}>
            <p className="label" style={{ margin: '0 0 0.4rem', paddingLeft: '0.75rem' }}>
              {group.label}
            </p>
            <div style={{ display: 'grid', gap: '1px' }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span aria-hidden="true" style={{ fontSize: '1.05rem', width: '1.4rem', textAlign: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Fortschritt */}
      <div style={{ padding: '0.9rem 1.1rem', borderTop: '1px solid var(--line-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--sun)', color: 'var(--paper-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
            }}
          >
            {user.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="font-display" style={{ margin: 0, color: 'var(--ink)', fontSize: '0.82rem' }}>{user.name}</p>
            <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.72rem' }}>{user.rank}</p>
          </div>
        </div>
        <div className="progress-track" style={{ marginBottom: '0.3rem' }}>
          <div className="progress-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="value-mono">{user.xp} XP</span>
          <span className="value-mono">{user.xpNext} XP</span>
        </div>
      </div>
    </aside>
  )
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useTravel()

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Seitenleiste (Desktop) */}
      <div className="sidebar-wrap" style={{ width: '236px', flexShrink: 0, height: '100%' }}>
        <Sidebar />
      </div>

      {/* Schublade (Mobil) */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'var(--scrim)', backdropFilter: 'blur(3px)' }}
        />
      )}
      <div
        className="drawer-mobile"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
          width: '250px',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Hauptbereich */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {/* Kopfleiste (Mobil) */}
        <header
          className="topbar-mobile"
          style={{
            /* display:flex kommt aus der Klasse .topbar-mobile, damit die
               Media-Query sie auf Desktop wieder ausblenden kann. */
            alignItems: 'center', justifyContent: 'space-between',
            padding: '0.6rem 0.9rem',
            borderBottom: '1px solid var(--line)',
            background: 'var(--paper)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Menue"
            style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', padding: '0.2rem', lineHeight: 1 }}
          >
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <CompassRose size={22} />
            <span className="font-display" style={{ color: 'var(--ink)', fontSize: '0.92rem', fontWeight: 700 }}>
              Scratch'n'Travel
            </span>
          </div>
          <NavLink
            to="/profile"
            aria-label="Profil"
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--sun)', color: 'var(--paper-deep)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700,
            }}
          >
            {user.initials}
          </NavLink>
        </header>

        {/* Inhalt */}
        <main
          className="page paper-grain"
          style={{ flex: 1, overflowY: 'auto', background: 'var(--paper)' }}
        >
          {/* Kopfzeile nur auf Desktop — dort ist Platz fuer den Theme-Schalter. */}
          <div className="topbar-desktop">
            <span className="font-hand" style={{ color: 'var(--ink-ghost)' }}>
              gute Reise
            </span>
            <ThemeToggle compact />
          </div>
          <div style={{ position: 'relative', zIndex: 1, paddingBottom: 76 }}>
            <Outlet />
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  )
}