import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { TravelProvider } from './context/TravelContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TravelProvider>
          <RouterProvider router={router} />
        </TravelProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)