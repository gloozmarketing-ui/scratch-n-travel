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
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'explore', Component: Explore },
      { path: 'scratch', Component: ScratchPage },
      { path: 'passport', Component: Passport },
      { path: 'stories', Component: Stories },
      { path: 'tours', Component: Tours },
      { path: 'badges', Component: BadgesPage },
      { path: 'profile', Component: Profile },
      { path: 'checklists', Component: Checklists },
      { path: 'radar', Component: Radar },
      { path: 'ai', Component: AIConcierge },
      { path: 'host', Component: Host },
      { path: 'pricing', Component: Pricing },
      { path: 'login', Component: Login },
      { path: 'wanderbond', Component: WanderBond },
      { path: '*', Component: NotFound },
    ],
  },
])
