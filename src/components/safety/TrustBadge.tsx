/**
 * Trust-Badge — zeigt die Vertrauensstufe einer Person an.
 *
 * Bewusst zurückhaltend gestaltet: Ein Abzeichen ist ein Hinweis, kein
 * Qualitätssiegel. Der Text neben dem Icon sagt, was es bedeutet.
 */
import { tierInfo } from '../../lib/trust'
import type { TrustTier } from '../../lib/trust'

interface Props {
  tier: TrustTier
  /** Kleine Variante für Listen und Karten. */
  compact?: boolean
  /** Optionale Zusatzinfo, z. B. „ist in Lissabon zu Hause". */
  suffix?: string
}

export default function TrustBadge({ tier, compact = false, suffix }: Props) {
  const info = tierInfo(tier)

  const title = `${info.label} — ${info.perks[0]}`

  return (
    <span
      className="inline-flex items-center gap-1.5 align-middle"
      title={title}
      style={{ color: info.color }}
    >
      <span aria-hidden="true" style={{ fontSize: compact ? '0.8rem' : '0.95rem' }}>
        {info.icon}
      </span>
      {!compact && (
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {info.label}
          {suffix ? ` · ${suffix}` : ''}
        </span>
      )}
    </span>
  )
}
