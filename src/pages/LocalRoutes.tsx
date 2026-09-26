import React, { useMemo, useState } from 'react'
import { LocalRoute, routeProgress, isRouteComplete, routeBadgeName, formatRouteDuration, routeDurationMinutes } from '../data/routes'
import { localRoutes } from '../data/routeSeeds'
import { useTravel } from '../context/TravelContext'
import DemoDataBadge from '../components/DemoDataBadge'
import { tierLabel, nextTier } from '../data/trust'
import { isPhotoVisible, isPhotoExpired, PHOTO_DELAY_MINUTES, PERSON_PHOTO_TTL_HOURS } from '../lib/photoSafety'
import { photoCooldownMinutes } from '../data/routes'

/**
 * Die Schatzkarte ist ein SVG, kein Leaflet-Overlay.
 *
 * Grund: Die Stationen liegen in einem kleinen Cluster, den man auf einer
 * echten Weltkarte ohnehin zoomen muesste. Ein handgezeichnetes SVG bekommt
 * den gewuenschten Charakter, costet keine Abhaengigkeit und bleibt bei jedem
 * Theme lesbar. Wenn echte Routen spaeter staedtebergreifend werden, ist das
 * der Punkt, an dem auf Leaflet gewechselt werden muss.
 */
function TreasureMap({ route }: { route: LocalRoute }) {
  const done = new Set(route.completedStopIds)
  const W = 720
  const H = 300

  // Stationen entlang eines leicht geschwungenen Pfades verteilen, statt in
  // gerader Reihe: das ist der Unterschied zwischen "Lohntliste" und "Karte".
  const points = route.stops.map((stop, i) => {
    const t = route.stops.length === 1 ? 0.5 : i / (route.stops.length - 1)
    const x = 70 + t * (W - 140)
    const wobble = i % 2 === 0 ? -30 : 30
    const y = H / 2 + wobble * (1 - Math.abs(t - 0.5) * 1.1)
    return { stop, x, y }
  })

  const path = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `Q ${p.x - 30} ${p.y + (i % 2 ? -18 : 18)} ${p.x} ${p.y}`))
    .join(' ')

  // Der abgerissene Rand zeigt Fortschritt — aber er darf die Stationen nicht
  // verdecken. Ueber 50 % faellt er deshalb aus, statt die Karte zu zerlegen.
  const progress = routeProgress(route)
  const torn = progress > 0 && progress <= 0.5

  return (
    <div
      className={`map-scroll p-5 ${torn ? 'map-torn' : ''}`}
      style={torn ? ({ ['--torn-w' as string]: `${Math.round(progress * 100)}%` } as React.CSSProperties) : undefined}
    >
      <div className="flex items-start justify-between gap-4 mb-4 relative">
        <div className="min-w-0">
          <p className="map-coords mb-0.5">
            {route.city.toUpperCase()} · {route.countryCode} · {route.stops.length} Stationen
          </p>
          <p className="map-label text-lg leading-tight">{formatRouteDuration(routeDurationMinutes(route))} zu Fuß</p>
        </div>
        <div className="route-seal" title={`${route.authorName} — ${tierLabel(route.authorTrustLevel)}`}>
          {route.authorInitials}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto relative" role="img" aria-label={`Karte der Route ${route.name}`}>
        <path d={path} className="map-path" data-complete={isRouteComplete(route)} vectorEffect="non-scaling-stroke" />
        {points.map(({ stop, x, y }) => {
          const state = done.has(stop.id) ? 'done' : stop.id === route.nextStopId ? 'next' : 'open'
          return (
            <g key={stop.id} transform={`translate(${x} ${y})`}>
              {state === 'next' && <circle r="21" className="map-halo" />}
              <circle r="13" className="map-node" data-state={state} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontFamily="var(--font-mono, monospace)"
                fontWeight="700"
                fill={state === 'done' ? 'var(--paper)' : state === 'next' ? 'var(--map-route)' : 'var(--ink-faint)'}
                pointerEvents="none"
              >
                {stop.order}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function RouteCard({ route, onOpen }: { route: LocalRoute; onOpen: (r: LocalRoute) => void }) {
  const { triggerHaptic } = useTravel()
  const p = routeProgress(route)
  const done = isRouteComplete(route)

  return (
    <article className="card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="route-seal" title={tierLabel(route.authorTrustLevel)}>{route.authorInitials}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-ink leading-tight">{route.name}</h3>
          <p className="text-xs text-ink-faint">{route.authorName} · {route.city} · {tierLabel(route.authorTrustLevel)}</p>
        </div>
        <button
          onClick={() => { triggerHaptic(12); onOpen(route) }}
          className="btn btn-ghost text-xs px-2 py-1 shrink-0"
          aria-label={`Route ${route.name} öffnen`}
        >
          Ansehen →
        </button>
      </div>

      <p className="text-sm text-ink-soft line-clamp-2">{route.blurb}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {route.tags.map(t => (
          <span key={t} className="font-mono text-[0.58rem] border border-sun text-sun px-1.5 py-0.5 rounded">{t}</span>
        ))}
      </div>

      <div className="trust-meter" title={`${Math.round(p * 100)}% abgehakt`}>
        <div style={{ width: `${Math.max(p, 0.02) * 100}%` }} />
      </div>

      <div className="flex items-center justify-between text-[0.65rem] text-ink-faint font-mono">
        <span>{route.completedStopIds.length}/{route.stops.length} Stationen</span>
        <span>👍 {route.upvotes}</span>
        <span>{formatRouteDuration(routeDurationMinutes(route))}</span>
      </div>

      {done && (
        <div className="text-[0.65rem] font-mono text-lagoon bg-lagoon-wash border border-lagoon rounded px-2 py-1">
          Abgeschlossen · Badge: {routeBadgeName(route)}
        </div>
      )}
    </article>
  )
}

function RouteDetail({ route, onBack }: { route: LocalRoute; onBack: () => void }) {
  const { triggerHaptic } = useTravel()
  const [tab, setTab] = useState<'map' | 'stationen' | 'fotos'>('map')
  const [votes, setVotes] = useState(route.upvotes)
  const [voted, setVoted] = useState(route.hasUpvoted)
  const [followed, setFollowed] = useState(route.following)

  const sorted = useMemo(() => [...route.stops].sort((a, b) => a.order - b.order), [route.stops])

  // Drei getrennte Gruppen, weil sie unterschiedlich erklaert werden muessen:
  // sichtbar, in der Schutzfrist, und nach Ablauf entfernt.
  const visiblePhotos = useMemo(() => route.photos.filter(p => isPhotoVisible(p)), [route.photos])
  const coolingPhotos = useMemo(
    () => route.photos.filter(p => p.status !== 'flagged' && p.status !== 'removed' && !isPhotoVisible(p)),
    [route.photos],
  )
  const expiredPhotos = useMemo(
    () => route.photos.filter(p => p.status !== 'flagged' && !isPhotoExpired(p) && isPhotoExpired(p)),
    [route.photos],
  )

  function handleVote() {
    triggerHaptic(15)
    setVoted(v => {
      setVotes(n => (v ? n - 1 : n + 1))
      return !v
    })
  }

  return (
    <div className="p-6 pb-24 md:pb-8 space-y-5 max-w-4xl">
      <button onClick={onBack} className="btn btn-ghost text-xs px-2 py-1">← Alle Routen</button>

      <div className="flex items-start gap-3">
        <div className="route-seal" style={{ width: 56, height: 56, fontSize: '1.3rem' }}>{route.authorInitials}</div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl text-ink leading-tight">{route.name}</h1>
          <p className="text-sm text-ink-soft">{route.blurb}</p>
          <p className="text-xs text-ink-faint mt-1">
            Von <span className="text-sun font-semibold">{route.authorName}</span> ({tierLabel(route.authorTrustLevel)})
            {route.authorIsLocal ? ' · Loc' : ''} · {route.city}, {route.country}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={handleVote} className={`btn text-xs py-1.5 px-3 ${voted ? 'btn-primary font-bold' : 'btn-ghost'}`}>
          👍 Hilfreich ({votes})
        </button>
        <button
          onClick={() => { triggerHaptic(15); setFollowed(f => !f) }}
          className={`btn text-xs py-1.5 px-3 ${followed ? 'btn-primary font-bold' : 'btn-ghost'}`}
        >
          {followed ? 'Gefolgt ✓' : 'Folgen'}
        </button>
        <span className="font-mono text-[0.62rem] text-ink-faint self-center">
          {route.completions} Reisende haben sie beendet
        </span>
      </div>

      <div className="flex gap-1.5 border-b border-paper-deep">
        {([['map', '🗺️ Karte'], ['stationen', '📍 Stationen'], ['fotos', `📷 Fotos (${visiblePhotos.length})`]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => { triggerHaptic(10); setTab(k) }}
            className={`px-3 py-1.5 text-xs font-mono ${tab === k ? 'border-b-2 border-sun text-sun font-bold' : 'text-ink-faint'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'map' && <TreasureMap route={route} />}

      {tab === 'stationen' && (
        <ol className="space-y-3">
          {sorted.map(stop => {
            const isDone = route.completedStopIds.includes(stop.id)
            return (
              <li key={stop.id} className="card p-4 flex gap-3">
                <div className="map-stop shrink-0" data-state={isDone ? 'done' : stop.id === route.nextStopId ? 'next' : 'open'}>
                  {isDone ? '✓' : stop.order}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink text-sm">{stop.title}</p>
                  <p className="text-sm text-ink-soft mt-0.5">{stop.note}</p>
                  <p className="map-coords mt-1.5">
                    {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)} · {stop.dwellMinutes} Min
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {tab === 'fotos' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs text-ink-faint bg-paper-deep border border-paper-deep rounded p-3">
              <span className="text-sun font-semibold">Warum warten?</span> Fotos erscheinen{' '}
              {PHOTO_DELAY_MINUTES / 60} Stunden nach dem Hochladen. Das schützt <em>dich</em> als Reisenden: Wer weiß,
              dass gerade ein Foto an dieser Station hochgeladen wurde, könnte sonst ableiten, wo du jetzt bist.
            </p>
            <p className="text-xs text-ink-faint bg-paper-deep border border-paper-deep rounded p-3">
              <span className="text-sun font-semibold">Personen im Bild?</span> Solche Fotos verschwinden nach{' '}
              {PERSON_PHOTO_TTL_HOURS} Stunden automatisch. Standortdaten werden aus jedem Bild entfernt — sie enthalten
              sonst deine exakte Position.
            </p>
          </div>

          {visiblePhotos.length > 0 ? (
            <div className="photo-grid">
              {visiblePhotos.map(photo => (
                <img key={photo.id} src={photo.urls[0]} alt={photo.caption || 'Reisefoto'} loading="lazy" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Noch keine sichtbaren Fotos an diesen Stationen.</p>
          )}

          {coolingPhotos.length > 0 && (
            <div>
              <p className="font-mono text-[0.62rem] text-ink-faint mb-2">NOCH GESCHÜTZT — {coolingPhotos.length}</p>
              <div className="photo-grid">
                {coolingPhotos.map(photo => (
                  <div key={photo.id} className="photo-pending">
                    <span>
                      🔒
                      <br />
                      {(() => {
                        const m = photoCooldownMinutes(photo)
                        return m === null ? 'gleich' : m >= 60 ? `${Math.round(m / 60)} Std` : `${m} Min`
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expiredPhotos.length > 0 && (
            <div>
              <p className="font-mono text-[0.62rem] text-ink-faint mb-1">
                ENTFALLEN NACH {PERSON_PHOTO_TTL_HOURS} STD — {expiredPhotos.length}
              </p>
              <p className="text-[0.62rem] text-ink-faint">
                Diese Fotos zeigten Personen und wurden automatisch entfernt. Das ist Absicht, kein Fehler.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LocalRoutesPage() {
  const { triggerHaptic } = useTravel()
  const [routes] = useState<LocalRoute[]>(localRoutes)
  const [open, setOpen] = useState<LocalRoute | null>(null)
  const [city, setCity] = useState('Alle')
  const [localOnly, setLocalOnly] = useState(false)

  const cities = useMemo(() => ['Alle', ...new Set(localRoutes.map(r => r.city))], [])
  const filtered = useMemo(
    () => routes.filter(r => (city === 'Alle' || r.city === city) && (!localOnly || r.authorIsLocal)),
    [routes, city, localOnly],
  )

  if (open) return <RouteDetail route={open} onBack={() => { triggerHaptic(10); setOpen(null) }} />

  const prog = nextTier(6)

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Local Routes · Von Einheimischen zusammengestellt</p>
            <h1 className="font-display text-3xl text-ink font-bold">Routen der Locals</h1>
            <p className="font-script text-sun text-lg">folge einem Menschen, nicht einer algorithmischen Liste</p>
          </div>
          <DemoDataBadge />
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8 max-w-6xl">
        <div className="card p-4 flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <p className="text-xs text-ink-faint">
              Deine Vertrauensstufe: <span className="text-sun font-semibold">{prog.current.name}</span>
              {prog.next ? ` — noch ${prog.remaining} bestätigte Orte bis ${prog.next.name}` : ' — höchste Stufe'}
            </p>
            <div className="trust-meter mt-2">
              <div style={{ width: `${prog.progress * 100}%` }} />
            </div>
          </div>
          <button
            onClick={() => { triggerHaptic(15); alert('Der Routen-Editor folgt im nächsten Schritt.') }}
            className="btn btn-primary text-xs py-2 px-3 font-bold"
          >
            + Eigene Route ({prog.current.routeLimit} frei)
          </button>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex gap-1.5 flex-wrap">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => { triggerHaptic(8); setCity(c) }}
                className={`btn text-[0.62rem] py-1 px-2.5 ${city === c ? 'btn-primary font-bold' : 'btn-ghost'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => { triggerHaptic(10); setLocalOnly(v => !v) }}
            className={`btn text-xs py-1.5 px-3 ${localOnly ? 'btn-primary font-bold' : 'btn-ghost'}`}
          >
            🏠 Nur Locals
          </button>
          <span className="ml-auto font-mono text-[0.65rem] text-ink-faint">{filtered.length} Routen</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(r => (
            <RouteCard key={r.id} route={r} onOpen={route => { triggerHaptic(15); setOpen(route) }} />
          ))}
        </div>
      </div>
    </div>
  )
}


