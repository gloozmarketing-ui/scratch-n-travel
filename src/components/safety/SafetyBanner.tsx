/**
 * SafetyBanner — der Offline-Hinweis.
 *
 * Muss in jedem Kontext sichtbar sein, in dem sich zwei Menschen zum ersten
 * Mal treffen könnten. Nicht wegklickbar, weil der Hinweis der einzige
 * Zeitpunkt ist, an dem er gelesen wird.
 */
import { OFFLINE_DISCLAIMER } from '../../lib/trust'

interface Props {
  /** Kompakt für Sidebars, vollständig für Detailseiten. */
  variant?: 'full' | 'compact'
  className?: string
}

export default function SafetyBanner({ variant = 'full', className = '' }: Props) {
  const isCompact = variant === 'compact'

  return (
    <aside
      role="note"
      className={className}
      style={{
        background: 'var(--leaf-wash)',
        border: '1px solid var(--leaf-wash)',
        borderRadius: 12,
        padding: isCompact ? '0.6rem 0.85rem' : '0.9rem 1.1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
        <span aria-hidden="true" style={{ fontSize: isCompact ? '0.95rem' : '1.15rem', lineHeight: 1.3 }}>
          🛡️
        </span>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: isCompact ? '0.72rem' : '0.78rem',
              lineHeight: 1.5,
              color: 'var(--ink-faint)',
            }}
          >
            {isCompact ? OFFLINE_DISCLAIMER : (
              <>
                <strong style={{ color: 'var(--leaf)', display: 'block', marginBottom: '0.25rem' }}>
                  Sicherheit zuerst
                </strong>
                {OFFLINE_DISCLAIMER}
              </>
            )}
          </p>
        </div>
      </div>
    </aside>
  )
}
