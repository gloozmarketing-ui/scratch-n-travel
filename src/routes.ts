import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ScratchPage from './pages/ScratchPage'
import Passport from './pages/Passport'
import Stories from './pages/Stories'
import Tours from './pages/Tours'
import BadgesPage from './pages/BadgesPage'
import Profile from './pages/Profile'
import Checklists from './pages/Checklists'
import Radar from './pages/Radar'
import AIConcierge from './pages/AIConcierge'
import Host from './pages/Host'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import WanderBond from './pages/WanderBond'
import LocalRoutes from './pages/LocalRoutes'
import NotFound from './pages/NotFound'

// --- Community (neu) ---
import People from './pages/People'
import Meetups from './pages/Meetups'
import Chat from './pages/Chat'
import Safety from './pages/Safety'

// --- Rechtstexte (neu) ---
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import Terms from './pages/Terms'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,           Component: Home },
      { path: 'explore',       Component: Explore },
      { path: 'scratch',       Component: ScratchPage },
      { path: 'passport',      Component: Passport },
      { path: 'stories',       Component: Stories },
      { path: 'tours',         Component: Tours },
      { path: 'local-routes',  Component: LocalRoutes },
      { path: 'badges',        Component: BadgesPage },
      { path: 'profile',       Component: Profile },
      { path: 'checklists',    Component: Checklists },
      { path: 'radar',         Component: Radar },
      { path: 'ai',            Component: AIConcierge },
      { path: 'host',          Component: Host },
      { path: 'pricing',       Component: Pricing },
      { path: 'login',         Component: Login },
      { path: 'wanderbond',    Component: WanderBond },

      // Community — der Kern des Produkts
      { path: 'people',        Component: People },
      { path: 'meetups',       Component: Meetups },
      { path: 'chat',          Component: Chat },
      { path: 'safety',        Component: Safety },

      // Rechtstexte (Impressumspflicht DE)
      { path: 'impressum',     Component: Impressum },
      { path: 'datenschutz',   Component: Datenschutz },
      { path: 'terms',         Component: Terms },

      { path: '*',             Component: NotFound },
    ],
  },
])