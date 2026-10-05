import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { TravelProvider } from './context/TravelContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Faengt Fehler ab, die beim Nachladen einer Seite (Chunk) entstehen.
        Ohne das bleibt bei veraltetem Browser-Cache eine weisse Seite. */}
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TravelProvider>
            <RouterProvider router={router} />
          </TravelProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)