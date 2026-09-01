import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function MobileBottomNav() {
  const { triggerHaptic } = useTravel()

  const items = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Map', icon: '🗺️' },
    { path: '/scratch', label: 'Scratch', icon: '🪙' },
    { path: '/passport', label: 'Passport', icon: '🛂' },
    { path: '/radar', label: 'Radar', icon: '🛡️' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C1825]/95 backdrop-blur-lg border-t border-[rgba(201,168,76,0.18)] px-2 py-1.5 flex justify-around items-center">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => triggerHaptic(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#C9A84C] font-bold scale-105'
                : 'text-[#8A9AAA] hover:text-[#F4E4C1]'
            }`
          }
        >
          <span className="text-xl leading-none mb-0.5">{item.icon}</span>
          <span className="font-display text-[0.62rem] tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
