import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { TravelProvider } from './context/TravelContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TravelProvider>
      <RouterProvider router={router} />
    </TravelProvider>
  </StrictMode>
)
