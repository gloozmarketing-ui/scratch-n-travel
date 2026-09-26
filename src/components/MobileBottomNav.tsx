import { NavLink } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { ThemeToggle } from '../context/ThemeContext'

/**
 * Untere Leiste fuer Mobilgeraete.
 *
 * Fuenf Ziele, nicht mehr: Wer unterwegs ist, will schnell zu
 * Geheimtipps, Menschen, Treffen und Nachrichten. Der Rest wartet im Menue.
 */
export default function MobileBottomNav() {
  const { triggerHaptic } = useTravel()

  const items = [
    { path: '/', icon: '🏠', label: 'Start' },
    { path: '/explore', icon: '🗺️', label: 'Tipps' },
    { path: '/people', icon: '🤝', label: 'Menschen' },
    { path: '/meetups', icon: '☕', label: 'Treffen' },
    { path: '/chat', icon: '💬', label: 'Chat' },
  ]

  return (
    <nav
      className="md:hidden bottomnav"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'var(--card)',
        borderTop: '1px solid var(--line)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -1px 12px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'stretch' }}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => triggerHaptic(8)}
            className={({ isActive }) => isActive ? 'active' : ''}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '0.55rem 0.25rem 0.5rem',
              textDecoration: 'none',
              color: isActive ? 'var(--sun)' : 'var(--ink-faint)',
              position: 'relative',
              transition: 'color 0.2s ease',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                      width: 22, height: 2.5, borderRadius: '0 0 3px 3px',
                      background: 'var(--sun)',
                    }}
                  />
                )}
                <span aria-hidden="true" style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: isActive ? 700 : 600, letterSpacing: '0.01em' }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/** Kopfleiste fuer Desktop mit Theme-Umschalter. */
export function DesktopTopBar({ title }: { title: string }) {
  return (
    <div
      className="no-print"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.7rem 1.5rem',
        borderBottom: '1px solid var(--line-soft)',
        background: 'var(--paper)',
        position: 'sticky', top: 0, zIndex: 20,
        backdropFilter: 'blur(8px)',
      }}
    >
      <h1 className="font-display" style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 600 }}>
        {title}
      </h1>
      <ThemeToggle compact />
    </div>
  )
}