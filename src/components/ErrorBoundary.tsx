import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

/**
 * Error-Grenze fuer Fehler beim Laden von Chunks.
 *
 * Warum das noetig ist: seit dem Route-Splitting (SNT-409) laedt die App ihre
 * Seiten als einzelne Chunks. Besitzt jemand noch eine alte `index.html` im
 * Browser-Cache, verweist sie auf Chunk-Dateien, die es beim naechsten Deploy
 * nicht mehr gibt. Ohne diese Grenze bleibt dann eine komplett weisse Seite
 * stehen — der Nutzer sieht einen Fehler, den er nicht selbst beheben kann.
 *
 * Deshalb wird ein Chunk-Fehler behandelt wie ein veralteter Cache: Seite neu
 * laden. Einmal, gegen eine Endlosschleife gesichert.
 */
interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  isChunkError: boolean
}

const RELOAD_FLAG = 'snt:chunk-reload'

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, isChunkError: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, isChunkError: isChunkLoadError(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unbehandelter Fehler in der Oberflaeche:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null, isChunkError: false })
  }

  render() {
    const { error, isChunkError } = this.state
    if (!error) return this.props.children

    // Ein Chunk-Fehler heisst fast immer: gecachter, veralteter Stand.
    // Einmal neu laden — danach ist entweder alles gut oder der Fehler
    // ist ein anderer und wird unten normal angezeigt.
    if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
      try {
        sessionStorage.setItem(RELOAD_FLAG, '1')
      } catch {
        // Private Mode o.ae. — dann eben ohne Merker neu laden.
      }
      queueMicrotask(() => window.location.reload())
      return null
    }

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          padding: '2rem 1.2rem',
          textAlign: 'center',
          background: 'var(--paper)',
          color: 'var(--ink)',
        }}
      >
        <h1 className="font-display" style={{ margin: 0, fontSize: '1.4rem' }}>
          Hier ist etwas kaputtgegangen
        </h1>
        <p style={{ margin: 0, maxWidth: '32rem', color: 'var(--ink-faint)', fontSize: '0.9rem' }}>
          Die Seite konnte nicht geladen werden. Ein Neuladen behebt es in den meisten Fällen.
        </p>
        {isChunkError && (
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--ink-faint)' }}>
            Grund: Eine Datei dieser Seite ist nicht mehr verfügbar (veralteter Stand im Browser).
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              try {
                sessionStorage.removeItem(RELOAD_FLAG)
              } catch {
                /* egal */
              }
              this.handleReset()
            }}
          >
            Erneut versuchen
          </button>
          <a className="btn" href="/">
            Zur Startseite
          </a>
        </div>
        {import.meta.env.DEV && (
          <pre
            style={{
              maxWidth: '44rem',
              overflowX: 'auto',
              fontSize: '0.72rem',
              textAlign: 'left',
              color: 'var(--ink-faint)',
              background: 'var(--paper-deep)',
              padding: '0.7rem',
              borderRadius: '8px',
            }}
          >
            {error.message}
          </pre>
        )}
      </div>
    )
  }
}

/** Erkennt die typischen Fehlerbilder eines fehlgeschlagenen Chunk-Imports. */
function isChunkLoadError(error: Error): boolean {
  const message = `${error?.name ?? ''} ${error?.message ?? ''}`.toLowerCase()
  return (
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('importing a module script failed') ||
    message.includes('loading chunk') ||
    message.includes('failed to fetch')
  )
}