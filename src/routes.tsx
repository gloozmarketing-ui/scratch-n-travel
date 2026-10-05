import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { RequireAuth } from './context/AuthContext'

// Geschuetzte Routen (SNT-209). Im Demo-Modus blockiert der Wächter nicht —
// er erklärt nur, warum eine Seite ohne Konto leer bleibt (siehe RequireAuth).
const withAuth = (element: React.ReactNode) => <RequireAuth>{element}</RequireAuth>

// Route-Level Code-Splitting (SNT-409).
// Startseite und Layout bleiben synchron — sie sind bei jedem Besuch im Bild.
// Alles andere wird erst bei Bedarf geladen: aus einem 432-KB-Haupt-Chunk
// werden mehrere kleine Chunks, die nur die besuchte Seite nachladen.
const Explore = lazy(() => import('./pages/Explore'))
const ScratchPage = lazy(() => import('./pages/ScratchPage'))
const Passport = lazy(() => import('./pages/Passport'))
const Stories = lazy(() => import('./pages/Stories'))
const Tours = lazy(() => import('./pages/Tours'))
const BadgesPage = lazy(() => import('./pages/BadgesPage'))
const Profile = lazy(() => import('./pages/Profile'))
const Checklists = lazy(() => import('./pages/Checklists'))
const Radar = lazy(() => import('./pages/Radar'))
const AIConcierge = lazy(() => import('./pages/AIConcierge'))
const Host = lazy(() => import('./pages/Host'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Login = lazy(() => import('./pages/Login'))
const WanderBond = lazy(() => import('./pages/WanderBond'))

// --- Community (neu) ---
const People = lazy(() => import('./pages/People'))
const Meetups = lazy(() => import('./pages/Meetups'))
const Chat = lazy(() => import('./pages/Chat'))
const Safety = lazy(() => import('./pages/Safety'))

// --- Rechtstexte (neu) ---
const Impressum = lazy(() => import('./pages/Impressum'))
const Datenschutz = lazy(() => import('./pages/Datenschutz'))
const Terms = lazy(() => import('./pages/Terms'))

const LocalRoutes = lazy(() => import('./pages/LocalRoutes'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Platzhalter waehrend des Chunk-Ladens — verhindert Layout-Sprünge. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '46vh',
        color: 'var(--ink-faint)',
        fontSize: '0.85rem',
      }}
    >
      Wird geladen …
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,           Component: Home },
      { path: 'explore',       Component: () => <Suspense fallback={<RouteFallback />}><Explore /></Suspense> },
      { path: 'scratch',       Component: () => <Suspense fallback={<RouteFallback />}><ScratchPage /></Suspense> },
      { path: 'passport',      Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<Passport />)}</Suspense> },
      { path: 'stories',       Component: () => <Suspense fallback={<RouteFallback />}><Stories /></Suspense> },
      { path: 'tours',         Component: () => <Suspense fallback={<RouteFallback />}><Tours /></Suspense> },
      { path: 'local-routes',  Component: () => <Suspense fallback={<RouteFallback />}><LocalRoutes /></Suspense> },
      { path: 'badges',        Component: () => <Suspense fallback={<RouteFallback />}><BadgesPage /></Suspense> },
      { path: 'profile',       Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<Profile />)}</Suspense> },
      { path: 'checklists',    Component: () => <Suspense fallback={<RouteFallback />}><Checklists /></Suspense> },
      { path: 'radar',         Component: () => <Suspense fallback={<RouteFallback />}><Radar /></Suspense> },
      { path: 'ai',            Component: () => <Suspense fallback={<RouteFallback />}><AIConcierge /></Suspense> },
      { path: 'host',          Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<Host />)}</Suspense> },
      { path: 'pricing',       Component: () => <Suspense fallback={<RouteFallback />}><Pricing /></Suspense> },
      { path: 'login',         Component: () => <Suspense fallback={<RouteFallback />}><Login /></Suspense> },
      { path: 'wanderbond',    Component: () => <Suspense fallback={<RouteFallback />}><WanderBond /></Suspense> },

      // Community — der Kern des Produkts
      { path: 'people',        Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<People />)}</Suspense> },
      { path: 'meetups',       Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<Meetups />)}</Suspense> },
      { path: 'chat',          Component: () => <Suspense fallback={<RouteFallback />}>{withAuth(<Chat />)}</Suspense> },
      { path: 'safety',        Component: () => <Suspense fallback={<RouteFallback />}><Safety /></Suspense> },

      // Rechtstexte (Impressumspflicht DE)
      { path: 'impressum',     Component: () => <Suspense fallback={<RouteFallback />}><Impressum /></Suspense> },
      { path: 'datenschutz',   Component: () => <Suspense fallback={<RouteFallback />}><Datenschutz /></Suspense> },
      { path: 'terms',         Component: () => <Suspense fallback={<RouteFallback />}><Terms /></Suspense> },

      { path: '*',             Component: () => <Suspense fallback={<RouteFallback />}><NotFound /></Suspense> },
    ],
  },
])