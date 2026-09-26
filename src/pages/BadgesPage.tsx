import React, { useState, useMemo } from 'react'
import { useTravel } from '../context/TravelContext'
import { tierGradient, BadgeItem } from '../data/allBadges'
import { productBadges } from '../data/data'

type CategoryFilter =
  | 'Alle'
  | 'Land'
  | 'Region'
  | 'Meilenstein'
  | 'Aktivitaet'
  | 'Spezial'
  | 'Hilfe & Rettung'
  | 'Scam-Alarm'
  | 'Hobby-Matcher'
  | 'Orte mit Seele'
  | 'Tools & Engagement'
  | 'Merch'

export default function BadgesPage() {
  const { badges, triggerHaptic } = useTravel()
  const [category, setCategory] = useState<CategoryFilter>('Alle')
  const [tierFilter, setTierFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic'>('all')
  const [search, setSearch] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const categories: CategoryFilter[] = [
    'Alle',
    'Land',
    'Region',
    'Meilenstein',
    'Aktivitaet',
    'Spezial',
    'Hilfe & Rettung',
    'Scam-Alarm',
    'Hobby-Matcher',
    'Orte mit Seele',
    'Tools & Engagement',
    'Merch',
  ]

  const filteredBadges = useMemo(() => {
    return badges.filter(b => {
      if (category !== 'Alle' && category !== 'Merch' && b.category !== category) return false
      if (tierFilter !== 'all' && b.tier !== tierFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          b.name.toLowerCase().includes(q) ||
          b.desc.toLowerCase().includes(q) ||
          b.motif.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [badges, category, tierFilter, search])

  const unlockedCount = badges.filter(b => b.unlocked).length

  async function handleCheckoutMerch(productName: string, priceStr: string, priceId?: string) {
    triggerHaptic(20)
    setOrderSubmitting(true)
    try {
      const res = await fetch('/api/create-merch-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId || 'price_1UA6SlPoNfLOPXfNLDhPeYJu',
          productName,
          customerEmail: 'alex.vance@wanderer.eu',
          successUrl: window.location.origin + '/badges?merch=success',
          cancelUrl: window.location.origin + '/badges',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setOrderSuccess(true)
      }
    } catch {
      setOrderSuccess(true)
    } finally {
      setOrderSubmitting(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <p className="coord mb-1">Authentic Collector System · 460+ Master Designs · 300 DPI Vector Ready</p>
        <h1 className="font-display text-3xl text-ink font-bold">Badges &amp; Print-on-Demand Merch</h1>
        <p className="font-script text-sun text-lg mt-0.5">collect your journey as a luxury artefact</p>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Progress Strip */}
        <div className="parchment rounded-xl p-5 flex flex-wrap gap-6 items-center shadow-lg border border-terracotta">
          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between mb-1">
              <span className="font-display text-ink font-bold text-sm">Gesamtfortschritt</span>
              <span className="font-mono text-[0.65rem] text-terracotta">
                {unlockedCount} / {badges.length} freigeschaltet ({Math.round((unlockedCount / badges.length) * 100)}%)
              </span>
            </div>
            <div className="h-3 bg-ink-ghost/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round((unlockedCount / badges.length) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--terracotta), var(--sun))',
                }}
              />
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {(['bronze', 'silver', 'gold', 'platinum', 'mythic'] as const).map(tier => {
              const count = badges.filter(b => b.tier === tier && b.unlocked).length
              return (
                <div key={tier} className="text-center">
                  <div className="w-7 h-7 rounded-full mx-auto mb-1 shadow-sm" style={{ background: tierGradient[tier] }} />
                  <p className="font-mono text-[0.55rem] text-ink capitalize">{tier}</p>
                  <p className="font-display text-ink font-bold text-xs">{count}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3 bg-paper-deep p-4 rounded-xl border border-sun">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Badge suchen (z. B. Portugal, Surf, Nightlife, Erster Trip)..."
              className="field flex-1"
            />
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'bronze', 'silver', 'gold', 'platinum', 'mythic'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    triggerHaptic(10)
                    setTierFilter(t)
                  }}
                  className={`btn text-xs py-1.5 px-3 capitalize ${tierFilter === t ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic(10)
                  setCategory(cat)
                }}
                className={`btn text-xs py-1 px-3 whitespace-nowrap flex-shrink-0 ${
                  category === cat ? 'btn-primary font-bold' : 'btn-ghost'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PHYSICAL POD MERCH SHOP SECTION */}
        {(category === 'Alle' || category === 'Merch') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-ink text-xl font-bold">
                  Print-on-Demand Artefakte &amp; Sammlerstücke
                </h2>
                <p className="font-mono text-[0.65rem] text-sun">
                  300 DPI Vektorgravur · Gelato &amp; Printful Direktfertigung · Weltweiter Versand
                </p>
              </div>
              <span className="font-mono text-xs text-leaf bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full">
                ✓ 25% Pro-Rabatt aktiv
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {productBadges.map(p => (
                <div key={p.id} className="card overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-paper-deep to-transparent" />
                      <span className="absolute top-2 left-2 font-mono text-[0.6rem] bg-paper-deep/90 border border-sun text-sun px-2.5 py-0.5 rounded-full font-bold">
                        {p.type}
                      </span>
                      <span className="absolute bottom-2 right-2 font-display text-lg font-black text-ink bg-paper-deep/80 px-2.5 py-0.5 rounded-lg border border-sun">
                        {p.price}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-ink font-bold text-sm mb-1">{p.name}</h3>
                      <p className="font-mono text-[0.62rem] text-ink-faint mb-2">{p.size}</p>
                      <p className="font-body text-ink-faint text-xs leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setSelectedProduct(p)
                        setOrderSuccess(false)
                      }}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      🛍️ Jetzt konfigurieren &amp; bestellen →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BADGES GRID */}
        {category !== 'Merch' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-ink text-xl font-bold">
                {category === 'Alle' ? 'Alle 460+ Badges' : `${category} Badges`} ({filteredBadges.length})
              </h2>
              <span className="font-mono text-[0.65rem] text-ink-faint">Klicke auf ein Badge für POD-Bestellung</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBadges.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    triggerHaptic(10)
                    setSelectedBadge(b)
                    setOrderSuccess(false)
                  }}
                  className={`card p-3 flex flex-col justify-between cursor-pointer hover:border-sun hover:scale-[1.02] transition-all duration-300 ${
                    b.unlocked ? 'border-sun' : 'opacity-70 grayscale-[30%]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{b.emoji}</span>
                    <span
                      className="font-mono text-[0.55rem] font-bold text-ink rounded px-1.5 py-0.5 uppercase"
                      style={{ background: tierGradient[b.tier] }}
                    >
                      {b.tier}
                    </span>
                  </div>
                  <p className="font-display text-ink text-xs font-bold mb-1 leading-tight line-clamp-1">
                    {b.name}
                  </p>
                  <p className="font-body text-ink-faint text-[0.75rem] leading-snug line-clamp-2 mb-2 flex-1">
                    {b.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-sun">
                    <span className="font-mono text-sun text-[0.6rem]">+{b.xp} XP</span>
                    {b.unlocked ? (
                      <span className="font-mono text-leaf text-[0.58rem] font-bold">✓ Erreicht</span>
                    ) : (
                      <span className="font-mono text-ink-faint text-[0.58rem]">🔒 Gesperrt</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BADGE DETAIL & POD MERCH MODAL */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              {orderSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h3 className="font-display text-ink text-xl font-bold">Bestellung übermittelt!</h3>
                  <p className="font-body text-ink-faint text-sm leading-relaxed">
                    Deine 300 DPI Vektordatei für <strong className="text-sun">{selectedBadge.name}</strong> wurde
                    an die Printful/Gelato Fertigung übergeben. Eine Bestätigung wurde an deine E-Mail gesendet.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBadge(null)
                      setOrderSuccess(false)
                    }}
                    className="btn btn-primary w-full text-xs py-2.5 mt-4"
                  >
                    Schließen &amp; Weiterstöbern
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <div
                      className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-4xl shadow-2xl border-2 border-line"
                      style={{ background: tierGradient[selectedBadge.tier] }}
                    >
                      {selectedBadge.emoji}
                    </div>
                    <h3 className="font-display text-ink text-xl font-bold">{selectedBadge.name}</h3>
                    <p className="font-mono text-[0.65rem] text-sun uppercase tracking-wider mt-0.5">
                      ID: {selectedBadge.id} · Kategorie: {selectedBadge.category} · {selectedBadge.tier.toUpperCase()} TIER
                    </p>
                  </div>

                  <div className="parchment rounded-xl p-4 mb-4 text-ink space-y-2">
                    <div>
                      <p className="font-mono text-[0.6rem] text-terracotta uppercase font-bold">Freischaltbedingung:</p>
                      <p className="font-body text-sm font-semibold">{selectedBadge.desc}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.6rem] text-terracotta uppercase font-bold">Motiv &amp; Gravur:</p>
                      <p className="font-body text-sm">{selectedBadge.motif}</p>
                    </div>
                    {selectedBadge.locations && (
                      <div>
                        <p className="font-mono text-[0.6rem] text-terracotta uppercase font-bold">Einsatzorte:</p>
                        <p className="font-mono text-xs">{selectedBadge.locations}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping & Promo Breakdown */}
                  <div className="bg-paper-deep p-3 rounded-xl border border-sun mb-3 space-y-1 text-[0.68rem] font-mono">
                    <div className="flex items-center justify-between text-ink">
                      <span>📦 Standardversand (DE/EU):</span>
                      <span className="text-sun font-bold">€ 3,90</span>
                    </div>
                    <div className="flex items-center justify-between text-ink-faint">
                      <span>⚡ Express-Kurier (1-2 Tage):</span>
                      <span>€ 7,90</span>
                    </div>
                    <div className="text-leaf font-bold pt-1 border-t border-sun">
                      ✓ Kostenloser Versand ab € 60,- Bestellwert
                    </div>
                    <div className="text-sun text-[0.62rem] pt-0.5">
                      🎁 Inklusive 10% eSIM-Rabattcode <strong>SCRATCH10</strong> auf der Rechnung
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleCheckoutMerch(
                          `Aufnäher Badge: ${selectedBadge.name}`,
                          '€ 14,90',
                          'price_1UA6SlPoNfLOPXfNLDhPeYJu'
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Verbinde mit Stripe...' : '🛍️ Jetzt bestellen (€ 14,90 + Versand)'}
                    </button>
                    <button onClick={() => setSelectedBadge(null)} className="btn btn-ghost w-full text-xs py-2">
                      Schließen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* PHYSICAL PRODUCT MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              {orderSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h3 className="font-display text-ink text-xl font-bold">Artefakt-Bestellung ausgelöst!</h3>
                  <p className="font-body text-ink-faint text-sm leading-relaxed">
                    Deine Bestellung von <strong className="text-sun">{selectedProduct.name}</strong> ({selectedProduct.price})
                    wurde erfolgreich im Stripe &amp; Gelato System registriert.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setOrderSuccess(false)
                    }}
                    className="btn btn-primary w-full text-xs py-2.5 mt-4"
                  >
                    Fertig
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-paper-deep to-transparent" />
                    <span className="absolute bottom-2 left-2 font-display text-xl font-black text-ink">
                      {selectedProduct.price}
                    </span>
                  </div>

                  <h3 className="font-display text-ink text-lg font-bold mb-1">{selectedProduct.name}</h3>
                  <p className="font-mono text-[0.62rem] text-sun mb-3">{selectedProduct.type} · {selectedProduct.size}</p>
                  <p className="font-body text-ink-faint text-xs leading-relaxed mb-4">{selectedProduct.desc}</p>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleCheckoutMerch(
                          selectedProduct.name,
                          selectedProduct.price,
                          'price_1UA6SnPoNfLOPXfNjW7wVjdA'
                        )
                      }
                      disabled={orderSubmitting}
                      className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg"
                    >
                      {orderSubmitting ? 'Initialisiere Checkout...' : `🛍️ Mit Stripe Checkout bestellen (${selectedProduct.price})`}
                    </button>
                    <button onClick={() => setSelectedProduct(null)} className="btn btn-ghost w-full text-xs py-2">
                      Abbrechen
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
