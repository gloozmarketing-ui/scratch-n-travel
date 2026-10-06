import { useEffect, useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const links = [
  { label: 'Produkt', href: '#produkt' },
  { label: 'Funktionen', href: '#funktionen' },
  { label: 'So funktioniert’s', href: '#ablauf' },
  { label: 'Preise', href: '#preise' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-xl border-b border-line' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-[72px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-mint grid place-items-center shadow-glow">
            <Zap size={18} className="text-white" fill="currentColor" />
          </span>
          <span className="font-display font-bold text-lg text-white tracking-tight">LeadPulse</span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#preise" className="text-sm text-slate-300 hover:text-white transition px-3 py-2">
            Anmelden
          </a>
          <a
            href="#cta"
            className="text-sm font-semibold bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl transition shadow-glow"
          >
            Kostenlos testen
          </a>
        </div>

        <button
          className="lg:hidden text-slate-300 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-ink/95 backdrop-blur-xl border-b border-line px-6 pb-6 pt-2 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="block text-center mt-3 font-semibold bg-brand text-white px-5 py-3 rounded-xl"
          >
            Kostenlos testen
          </a>
        </div>
      )}
    </header>
  )
}
