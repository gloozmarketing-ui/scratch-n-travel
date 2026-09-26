/**
 * Gemeinsames Layout für alle Rechtstexte.
 * Sorgt für ein einheitliches, ruhiges Erscheinungsbild.
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function LegalLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div style={pageStyle}>
      <header style={{ marginBottom: '1.75rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--ink-ghost)', margin: 0 }}>
          Rechtliches
        </p>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--ink)', margin: '0.35rem 0 0.2rem' }}>{title}</h1>
        {subtitle && (
          <p style={{ margin: 0, color: 'var(--ink-ghost)', fontSize: '0.78rem' }}>{subtitle}</p>
        )}
      </header>

      {/* Schnellnavigation */}
      <nav style={navStyle}>
        <Link to="/impressum" style={navLinkStyle}>Impressum</Link>
        <Link to="/datenschutz" style={navLinkStyle}>Datenschutz</Link>
        <Link to="/terms" style={navLinkStyle}>Nutzungsbedingungen</Link>
        <Link to="/safety" style={navLinkStyle}>Sicherheit</Link>
      </nav>

      <div style={contentStyle}>{children}</div>

      <footer style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}>
        <p style={{ margin: 0, color: 'var(--ink-ghost)', fontSize: '0.72rem', lineHeight: 1.7 }}>
          Zuletzt aktualisiert: {'<Datum>'}. Diese Seite ist ein Geruest und ersetzt keine
          Rechtsberatung. Vor dem Livegang pruefen lassen.
        </p>
      </footer>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ color: 'var(--sun)', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{title}</h2>
      <div style={{ color: 'var(--ink-faint)', fontSize: '0.82rem', lineHeight: 1.7 }}>{children}</div>
    </section>
  )
}

const pageStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '1.5rem 1rem 4rem',
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  padding: '0.6rem 0',
  borderBottom: '1px solid var(--line)',
  marginBottom: '1.5rem',
}

const navLinkStyle: React.CSSProperties = {
  color: 'var(--ink-faint)',
  fontSize: '0.75rem',
  textDecoration: 'none',
}

const contentStyle: React.CSSProperties = {
  color: 'var(--ink-faint)',
  fontSize: '0.82rem',
  lineHeight: 1.7,
}

export const linkStyle: React.CSSProperties = {
  color: 'var(--sun)',
}

export const hintStyle: React.CSSProperties = {
  color: 'var(--ink-ghost)',
  fontSize: '0.76rem',
  fontStyle: 'italic',
  marginTop: '0.5rem',
}

export const warningStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta-wash)',
  borderRadius: 10,
  padding: '0.7rem 0.9rem',
  marginBottom: '1.25rem',
  color: 'var(--ink-faint)',
  fontSize: '0.78rem',
  lineHeight: 1.6,
}
