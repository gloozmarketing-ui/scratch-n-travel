import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { ThemeToggle } from '../context/ThemeContext'
import MobileBottomNav from './MobileBottomNav'
import LanguageSelector from './LanguageSelector'
import { useI18n } from '../lib/i18n'
import { track } from '../lib/analytics'

/**
 * Sendet einen page_view bei jedem Routenwechsel (SNT-214).
 *
 * Bewusst kein useEffect je Seite — ein einziger Listener hier oben ist die
 * einzige Stelle, an der Routen beobachtet werden. Ohne konfigurierte
 * Analytics-Domain ist `track()` ein No-Op, der Listener kostet nichts.
 */
function AnalyticsListener() {
  const location = useLocation()
  useEffect(() => {
    track('page_view', { path: location.pathname })
  }, [location.pathname])
  return null
}

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

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  const { user, logout, loginAsDemo } = useTravel()
  const { t } = useI18n()
  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))

  const navGroups = [
    {
      label: 'Entdecken',
      items: [
        { path: '/', icon: '🏠', label: t('nav_home') },
        { path: '/explore', icon: '🗺️', label: t('nav_explore') },
        { path: '/stories', icon: '📍', label: t('nav_stories') },
        { path: '/local-routes', icon: '🗺️', label: t('nav_routes') },
        { path: '/tours', icon: '🥾', label: t('nav_tours') },
      ],
    },
    {
      label: 'Menschen',
      items: [
        { path: '/people', icon: '🤝', label: t('nav_people') },
        { path: '/meetups', icon: '☕', label: t('nav_meetups') },
        { path: '/chat', icon: '💬', label: t('nav_chat') },
      ],
    },
    {
      label: 'Deine Reise',
      items: [
        { path: '/passport', icon: '📖', label: t('nav_passport') },
        { path: '/scratch', icon: '🎟️', label: t('nav_scratch') },
        { path: '/wanderbond', icon: '🧭', label: t('nav_wanderbond') },
        { path: '/badges', icon: '🏅', label: t('nav_badges') },
        { path: '/checklists', icon: '🎒', label: t('nav_checklists') },
      ],
    },
    {
      label: 'Sicherheit',
      items: [
        { path: '/radar', icon: '🧭', label: t('nav_radar') },
        { path: '/safety', icon: '🛡️', label: t('nav_safety') },
      ],
    },
  ]

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

      {/* Fortschritt & Benutzer-Konto */}
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
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="font-display" style={{ margin: 0, color: 'var(--ink)', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </p>
            <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.72rem' }}>{user.rank}</p>
          </div>
        </div>
        <div className="progress-track" style={{ marginBottom: '0.3rem' }}>
          <div className="progress-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span className="value-mono">{user.xp} XP</span>
          <span className="value-mono">{user.xpNext} XP</span>
        </div>

        {/* Auth / Logout Steuerung */}
        <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.4rem', borderTop: '1px solid var(--line-soft)' }}>
          {user.handle === '@gast' ? (
            <div style={{ display: 'flex', width: '100%', gap: '0.35rem' }}>
              <NavLink
                to="/login"
                onClick={onClose}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.72rem', textAlign: 'center', textDecoration: 'none' }}
              >
                🔑 {t('login')}
              </NavLink>
              <button
                type="button"
                onClick={() => loginAsDemo()}
                style={{
                  background: 'var(--paper-deep)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  color: 'var(--ink)',
                  fontSize: '0.68rem',
                  padding: '0.35rem 0.5rem',
                  cursor: 'pointer',
                }}
                title="Demo-Profil Maria Santos aktivieren"
              >
                Demo
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', width: '100%', gap: '0.35rem' }}>
              <NavLink
                to="/profile"
                onClick={onClose}
                style={{
                  flex: 1,
                  fontSize: '0.72rem',
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  padding: '0.32rem 0.4rem',
                  borderRadius: '6px',
                  background: 'var(--paper-deep)',
                  border: '1px solid var(--line)',
                  textAlign: 'center',
                }}
              >
                👤 Profil
              </NavLink>
              <button
                type="button"
                onClick={() => logout()}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  color: 'var(--terracotta)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.32rem 0.5rem',
                  cursor: 'pointer',
                }}
                title="Vom Konto abmelden"
              >
                🚪 {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

/**
 * Rechtstexte-Fusszeile.
 *
 * Vorher gab es keinen Footer: Impressum, Datenschutz und AGB existieren als
 * Seiten, waren aber von keiner Navigation aus erreichbar. Das ist nach
 * § 5 DDG / § 18 MStV ein Mangel — Anbieterinformationen muessen von jeder
 * Seite aus erreichbar sein, nicht nur unter einer geratenen URL.
 */
function LegalFooter() {
  const items = [
    { to: '/impressum', label: 'Impressum' },
    { to: '/datenschutz', label: 'Datenschutz' },
    { to: '/terms', label: 'AGB' },
    { to: '/safety', label: 'Sicherheit' },
  ]
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line-soft)',
        padding: '1.4rem 1.1rem 1.6rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.9rem 1.4rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.72rem' }}>
        © {new Date().getFullYear()} Scratch'n'Travel
      </p>
      <nav aria-label="Rechtliches" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.1rem' }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={{
              color: 'var(--ink-faint)',
              fontSize: '0.74rem',
              textDecoration: 'none',
              borderBottom: '1px solid var(--line-soft)',
              paddingBottom: '1px',
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </footer>
  )
}

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useTravel()

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <AnalyticsListener />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LanguageSelector compact />
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
          </div>
        </header>

        {/* Inhalt */}
        <main
          className="page paper-grain"
          style={{ flex: 1, overflowY: 'auto', background: 'var(--paper)' }}
        >
          {/* Kopfzeile nur auf Desktop — dort ist Platz fuer Sprach- und Theme-Schalter. */}
          <div className="topbar-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="font-hand" style={{ color: 'var(--ink-ghost)', marginRight: 'auto' }}>
              gute Reise
            </span>
            <LanguageSelector compact />
            <ThemeToggle compact />
          </div>
          <div style={{ position: 'relative', zIndex: 1, paddingBottom: 76 }}>
            <Outlet />
            {/* Rechtstexte (§ 5 DDG / § 18 MStV: Anbieter muss sie erreichbar halten) */}
            <LegalFooter />
          </div>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  )
}