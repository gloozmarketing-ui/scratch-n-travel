/**
 * Theme-Provider.
 *
 * Drei Modi statt zwei: `light`, `dark` und `system`.
 * `system` folgt der Betriebssystemeinstellung und reagiert live darauf,
 * wenn der Nutzer sie mitten in der Sitzung aendert.
 *
 * Wichtig fuer das Erlebnis: Es darf beim Laden nichts aufblitzen.
 * Deshalb setzt ein kleines Inline-Skript in `index.html` das Theme
 * VOR dem ersten Paint — dieser Provider uebernimmt danach nur noch.
 */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'snt-theme'

interface ThemeValue {
  /** Was der Nutzer gewaehlt hat. */
  mode: ThemeMode
  /** Was tatsaechlich gerade angezeigt wird. */
  theme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  /** Wechselt zwischen hell und dunkel. */
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

/** Ermittelt die Systemeinstellung. */
function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Liest den gespeicherten Modus. */
function storedMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  // Browser-UI (Adressleiste) anpassen
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#16120D' : '#FAF5EC')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(storedMode)
  const [theme, setTheme] = useState<ResolvedTheme>(() => {
    const m = storedMode()
    return m === 'system' ? systemTheme() : m
  })

  // Modus aendern: speichern + anwenden
  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    const resolved = next === 'system' ? systemTheme() : next
    setTheme(resolved)
    applyTheme(resolved)
  }, [])

  // Toggle: light <-> dark, system -> die jeweils andere Haelfte
  const toggle = useCallback(() => {
    const current = mode === 'system' ? systemTheme() : mode
    setMode(current === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  // Auf Systemaenderungen reagieren (nur relevant bei mode === 'system')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (storedMode() === 'system') {
        const resolved = mq.matches ? 'dark' : 'light'
        setTheme(resolved)
        applyTheme(resolved)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo<ThemeValue>(
    () => ({ mode, theme, setMode, toggle }),
    [mode, theme, setMode, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme muss innerhalb von <ThemeProvider> verwendet werden.')
  return ctx
}

/**
 * Theme-Schalter fuer die Kopfzeile.
 * Drei echte Optionen statt eines Umschalters — wer es ernst meint,
 * will auch "wie mein System" waehlen koennen.
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme()

  const options: { value: ThemeMode; icon: string; label: string }[] = [
    { value: 'light', icon: '☀️', label: 'Hell' },
    { value: 'dark', icon: '🌙', label: 'Dunkel' },
    { value: 'system', icon: '📱', label: 'Wie System' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Farbschema"
      style={{
        display: 'inline-flex',
        gap: '2px',
        padding: '3px',
        background: 'var(--paper-deep)',
        borderRadius: 999,
        border: '1px solid var(--line)',
      }}
    >
      {options.map((opt) => {
        const active = mode === opt.value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            title={opt.label}
            onClick={() => setMode(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: compact ? 0 : '0.35rem',
              padding: compact ? '0.3rem 0.45rem' : '0.32rem 0.7rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              lineHeight: 1,
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--sun)' : 'var(--ink-faint)',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              fontWeight: active ? 700 : 500,
            }}
          >
            <span aria-hidden="true">{opt.icon}</span>
            {!compact && <span>{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}