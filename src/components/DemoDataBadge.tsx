/**
 * Demo-Hinweis fuer erfundene Inhalte.
 *
 * Bewertungen, Review-Zahlen und "X Personen waren hier" sind aktuell
 * Platzhalter-Daten aus src/data/data.ts. Sie so anzuzeigen, als waeren
 * sie echt, waere irrefuehrend — besonders bei einem Produkt, dessen
 * ganzes Versprechen "wir sagen, woher es kommt" lautet.
 *
 * Sobald echte Daten aus dem Backend kommen, wird dieses Badge entfernt.
 */

const WRAP_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.1rem 0.4rem',
  borderRadius: '6px',
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta)',
  color: 'var(--terracotta)',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '0.58rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
}

export default function DemoDataBadge({ label = 'Beispieldaten' }: { label?: string }) {
  return (
    <span style={WRAP_STYLE} title="Diese Zahl ist ein Platzhalter. Echte Werte kommen aus dem Backend.">
      ⚠︎ {label}
    </span>
  )
}
