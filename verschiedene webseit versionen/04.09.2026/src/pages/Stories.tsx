import { useState, useMemo } from 'react'
import { storyPins } from '../data/data'

const cats = ['All', 'Nature', 'Food', 'View', 'History', 'Culture', 'Highland Secret', 'Fjord Drama']
const sortOpts = ['Rating', 'Entfernung (Nächste zuerst)', 'Reviews', 'XP']

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseCoords(coordStr: string): { lat: number; lng: number } {
  try {
    const latMatch = coordStr.match(/(\d+)°(\d+)'(\d+)?"?([NS])/);
    const lngMatch = coordStr.match(/(\d+)°(\d+)'(\d+)?"?([EW])/);

    let lat = 38.7223;
    let lng = -9.1393;

    if (latMatch) {
      const deg = parseFloat(latMatch[1]);
      const min = parseFloat(latMatch[2]);
      const sec = parseFloat(latMatch[3] || '0');
      lat = deg + min / 60 + sec / 3600;
      if (latMatch[4] === 'S') lat = -lat;
    }

    if (lngMatch) {
      const deg = parseFloat(lngMatch[1]);
      const min = parseFloat(lngMatch[2]);
      const sec = parseFloat(lngMatch[3] || '0');
      lng = deg + min / 60 + sec / 3600;
      if (lngMatch[4] === 'W') lng = -lng;
    }

    return { lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) };
  } catch {
    return { lat: 38.7223, lng: -9.1393 };
  }
}

function downloadGPX(title: string, location: string, coordStr: string) {
  const { lat, lng } = parseCoords(coordStr);
  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Scratch n Travel" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${title}</name>
    <desc>Verified Secret Spot: ${location}</desc>
  </metadata>
  <wpt lat="${lat}" lon="${lng}">
    <name>${title}</name>
    <desc>${location} - Scratch'n'Travel GPS Spot</desc>
    <sym>Waypoint</sym>
  </wpt>
</gpx>`;

  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_secret.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Stories() {
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('Entfernung (Nächste zuerst)')
  const [search, setSearch] = useState('')
  const [unlocked, setUnlocked] = useState<number[]>([1, 2, 4, 6, 14, 15, 37, 38, 39])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', location: '', story: '', category: 'Nature' })
  const [submitted, setSubmitted] = useState(false)

  // GPS Proximity State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [proximityRadius, setProximityRadius] = useState<'all' | '50' | '150' | '500' | 'country'>('all');
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Likes stored in localStorage
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('scratch_liked_pins');
      return saved ? JSON.parse(saved) : [1, 4, 37];
    } catch {
      return [1, 4, 37];
    }
  });

  // User 5-star ratings stored locally
  const [userRatings, setUserRatings] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('scratch_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const checkInLiveLocation = (targetRadius?: '50' | '150' | '500') => {
    if (!('geolocation' in navigator)) {
      alert('GPS-Standortabfrage wird von diesem Browser nicht unterstützt.');
      return;
    }
    setIsLocating(true);
    setGeoStatus('Standort wird über GPS ermittelt...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserCoords({ lat: userLat, lng: userLng });
        if (targetRadius) setProximityRadius(targetRadius);

        // Calculate distance to nearest pin
        let nearestDist = 999999;
        let nearestPin = storyPins[0];
        let unlockedAny = false;

        storyPins.forEach(p => {
          const c = parseCoords(p.gps);
          const d = getDistanceKm(userLat, userLng, c.lat, c.lng);
          if (d < nearestDist) {
            nearestDist = d;
            nearestPin = p;
          }
          if (d <= 2.0 && !unlocked.includes(p.id)) {
            unlockedAny = true;
            setUnlocked(prev => [...prev, p.id]);
          }
        });

        if (unlockedAny) {
          setGeoStatus(`🎉 Volltreffer! Du befindest dich direkt an einem Secret Spot (${nearestPin.location})! Spot automatisch freigerubbelt & +500 XP verbucht.`);
        } else {
          setGeoStatus(`📍 GPS aktiv: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}. Nächstgelegenes Geheimnis: "${nearestPin.location}" (${nearestDist.toFixed(1)} km entfernt).`);
        }
      },
      err => {
        setIsLocating(false);
        setGeoStatus('GPS-Zugriff wurde verweigert. Bitte erlaube den Standort im Browser, um Spots in deiner direkten Nähe zu sehen.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleLike = (id: number) => {
    const next = likedIds.includes(id) ? likedIds.filter(x => x !== id) : [...likedIds, id];
    setLikedIds(next);
    localStorage.setItem('scratch_liked_pins', JSON.stringify(next));
  };

  const handleRate = (pinId: number, ratingVal: number) => {
    const next = { ...userRatings, [pinId]: ratingVal };
    setUserRatings(next);
    localStorage.setItem('scratch_user_ratings', JSON.stringify(next));
  };

  // Compute pins with distance, proximity filtering and search
  const processedPins = useMemo(() => {
    let list = storyPins.map(p => {
      const c = parseCoords(p.gps);
      const dist = userCoords ? getDistanceKm(userCoords.lat, userCoords.lng, c.lat, c.lng) : null;
      return { ...p, distanceKm: dist, coords: c };
    });

    // Category Filter
    if (filter !== 'All') {
      list = list.filter(p => p.category === filter || p.tag.includes(filter));
    }

    // Proximity Filter
    if (proximityRadius === '50' && userCoords) {
      list = list.filter(p => p.distanceKm !== null && p.distanceKm <= 50);
    } else if (proximityRadius === '150' && userCoords) {
      list = list.filter(p => p.distanceKm !== null && p.distanceKm <= 150);
    } else if (proximityRadius === '500' && userCoords) {
      list = list.filter(p => p.distanceKm !== null && p.distanceKm <= 500);
    }

    // Text Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.location.toLowerCase().includes(q) ||
        p.story.toLowerCase().includes(q) ||
        p.local.toLowerCase().includes(q) ||
        (p.country && p.country.toLowerCase().includes(q)) ||
        (p.localFood && p.localFood.dish.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'Entfernung (Nächste zuerst)') {
      list.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else if (sort === 'Rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'Reviews') {
      list.sort((a, b) => b.reviews - a.reviews);
    } else if (sort === 'XP') {
      list.sort((a, b) => b.xp - a.xp);
    }

    return list;
  }, [filter, proximityRadius, userCoords, search, sort]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded border border-[#C9A84C]/25">
                Authentic Local Oral History · Verified GPS Narratives
              </span>
              <span className="text-xs text-emerald-400 font-mono">
                {storyPins.length} globale Geheimtipps
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-[#F4E4C1] font-bold">
              Golden Story Pins &amp; Berichte
            </h1>
            <p className="font-script text-[rgba(201,168,76,0.7)] text-lg">
              Geschichten, die nur Einheimische kennen — mit echten GPS-Koordinaten &amp; traditioneller Regionalküche.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            >
              <span>✍️</span> Eigenen Secret Spot teilen
            </button>
          </div>
        </div>

        {/* Live GPS Proximity Radar Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#112236] to-[#15273F] border border-[rgba(201,168,76,0.3)] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">📡</span>
              <h3 className="font-display text-sm md:text-base font-bold text-[#F4E4C1]">
                Standortbasierter Secret-Spot Radar (GPS-Nähe)
              </h3>
            </div>
            <p className="text-xs text-[#8A9AAA] max-w-xl leading-relaxed">
              Aktiviere dein GPS, um nur Spots und traditionelle Gastronomie in deinem Umkreis anzuzeigen. Befindest du dich innerhalb von 2 km, wird der Spot vor Ort kostenlos freigerubbelt!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => checkInLiveLocation()}
              disabled={isLocating}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-[#0C1825] hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLocating ? '⏳' : '📍'}</span>
              <span>{isLocating ? 'Standort wird ermittelt...' : 'GPS-Standort ermitteln'}</span>
            </button>
          </div>
        </div>

        {geoStatus && (
          <div className="p-3.5 rounded-xl bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-xs text-[#F4E4C1] flex items-center justify-between gap-2 fade-up">
            <p className="leading-relaxed font-mono">{geoStatus}</p>
            {userCoords && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase shrink-0">
                ● Live GPS aktiv
              </span>
            )}
          </div>
        )}

        {/* Submit form */}
        {showForm && (
          <div className="card p-6 border border-[rgba(201,168,76,0.3)] fade-up">
            <h2 className="font-display text-[#C9A84C] font-bold mb-4 text-xl">Eigenen Secret Spot einreichen</h2>
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-3">🎉</p>
                <p className="font-display text-[#F4E4C1] text-lg font-bold mb-2">Geheimnis erfolgreich eingereicht!</p>
                <p className="font-body text-[#8A9AAA] text-sm">Unser Redaktionsteam verifiziert den Tipp binnen 48h. Bei Freigabe erhältst du 30 Tage kostenlosen Pro-VIP-Zugang.</p>
                <button onClick={() => { setShowForm(false); setSubmitted(false) }} className="btn btn-secondary mt-4">Schließen</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.8)] uppercase tracking-widest block mb-1">Name des Ortes</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="field" placeholder="z. B. Versteckte Felsquelle an der Küste" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.8)] uppercase tracking-widest block mb-1">Stadt / Region / Land</label>
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="field" placeholder="z. B. Sintra, Portugal" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.8)] uppercase tracking-widest block mb-1">Deine Insider-Geschichte &amp; Wegbeschreibung (mind. 50 Wörter)</label>
                  <textarea value={form.story} onChange={e => setForm(p => ({ ...p, story: e.target.value }))} className="field h-28 resize-none" placeholder="Beschreibe den Ort genau: Wie gelangt man dorthin? Welche Steinmarkierung gibt es? Beste Tageszeit und was macht ihn magisch?…" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.8)] uppercase tracking-widest block mb-1">Kategorie</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="field">
                    {['Nature','Food','View','History','Culture'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => setSubmitted(true)} className="btn btn-primary w-full">Tipp einreichen → +600 XP belohnt</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Proximity Radius Selector Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1C2B] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#C9A84C]">
            <span>📍</span> <span>GPS-Umkreisfilter:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setProximityRadius('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${proximityRadius === 'all' ? 'bg-[#C9A84C] text-[#0C1825] font-bold shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              🌍 Weltweit ({storyPins.length})
            </button>
            <button
              onClick={() => {
                if (!userCoords) checkInLiveLocation('50');
                else setProximityRadius('50');
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${proximityRadius === '50' ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              📍 &lt; 50 km Nähe
            </button>
            <button
              onClick={() => {
                if (!userCoords) checkInLiveLocation('150');
                else setProximityRadius('150');
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${proximityRadius === '150' ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              📍 &lt; 150 km Region
            </button>
            <button
              onClick={() => {
                if (!userCoords) checkInLiveLocation('500');
                else setProximityRadius('500');
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${proximityRadius === '500' ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              📍 &lt; 500 km Großraum
            </button>
          </div>
        </div>

        {/* Category & Search Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`btn text-xs py-1.5 px-3.5 ${filter === c ? 'btn-primary' : 'btn-ghost'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field !w-full md:!w-56 text-sm py-1.5"
              placeholder="Suche nach Ort, Land, Essen..."
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="field !w-auto text-sm py-1.5 text-xs font-mono"
            >
              {sortOpts.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Zero Results in Radius Handler */}
        {processedPins.length === 0 && (
          <div className="card p-8 text-center space-y-4 border border-[rgba(201,168,76,0.3)]">
            <span className="text-4xl">🧭</span>
            <h3 className="font-display text-lg text-[#F4E4C1] font-bold">
              Keine Secret Spots im ausgewählten Radius ({proximityRadius} km) gefunden
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Dein aktueller GPS-Standort liegt außerhalb der {proximityRadius}-km-Zone.
              Erweitere den Umkreis oder stöbere weltweit in unseren 50 handverlesenen Orten!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setProximityRadius('500')}
                className="btn btn-secondary text-xs"
              >
                Radius auf 500 km erweitern
              </button>
              <button
                onClick={() => setProximityRadius('all')}
                className="btn btn-primary text-xs"
              >
                Alle Spots anzeigen
              </button>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {processedPins.map(pin => {
            const isUnlocked = unlocked.includes(pin.id);
            const isLiked = likedIds.includes(pin.id);
            const coords = pin.coords;
            const userStar = userRatings[pin.id] || 0;
            const effectiveRating = userStar > 0
              ? Number(((pin.rating * pin.reviews + userStar) / (pin.reviews + 1)).toFixed(1))
              : pin.rating;

            return (
              <div
                key={pin.id}
                className="card overflow-hidden group flex flex-col justify-between border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,76,0.3)] transition-all bg-[#112236]/90"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={pin.image}
                      alt={pin.location}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#112236] via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span className="font-mono text-[0.65rem] bg-[rgba(12,24,37,0.9)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2.5 py-1 rounded-full font-semibold">
                        {pin.tag}
                      </span>
                      {pin.country && (
                        <span className="font-mono text-[0.65rem] bg-[rgba(12,24,37,0.9)] border border-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                          {pin.country}
                        </span>
                      )}
                      {pin.distanceKm !== null && (
                        <span className="font-mono text-[0.65rem] bg-emerald-950/90 border border-emerald-400 text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                          <span>📍</span> {pin.distanceKm < 1 ? '< 1 km' : `${pin.distanceKm.toFixed(1)} km`}
                        </span>
                      )}
                    </div>

                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(pin.id)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-base backdrop-blur-md shadow-md transition-all cursor-pointer ${isLiked ? 'bg-rose-500/90 text-white' : 'bg-black/60 text-white/70 hover:text-white'}`}
                      title={isLiked ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                    >
                      {isLiked ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Local profile & rating */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-sm flex-shrink-0 shadow-sm">
                        {pin.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[#F4E4C1] font-semibold text-base leading-tight truncate">
                          {pin.local}
                        </p>
                        <p className="font-mono text-xs text-[#8A9AAA] mt-0.5 truncate">
                          {pin.location}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-0.5" title="Klicke zum Bewerten">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              onClick={() => handleRate(pin.id, s)}
                              className={`text-sm cursor-pointer transition-transform hover:scale-125 ${s <= (userStar || Math.round(pin.rating)) ? 'text-amber-400' : 'text-gray-600'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-[0.65rem] text-[#8A9AAA] mt-0.5">
                          {effectiveRating} ({pin.reviews + (userStar > 0 ? 1 : 0)} Reviews)
                        </p>
                      </div>
                    </div>

                    {/* Oral Story Narrative */}
                    <p className="font-body text-[#C4D0DC] text-sm leading-relaxed">
                      {pin.story}
                    </p>

                    {/* Vetted Safety Warning Notice */}
                    {pin.safetyWarning && (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                        <span>⚠️</span>
                        <p className="leading-snug">{pin.safetyWarning}</p>
                      </div>
                    )}

                    {/* Authentic Local Food & Vetted Restaurants */}
                    {pin.localFood && (
                      <div className="pt-3 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                            <span>🍽️</span> Lokale Spezialität:
                          </span>
                          <span className="text-xs font-bold text-[#F4E4C1]">
                            {pin.localFood.dish}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
                          {pin.localFood.desc}
                        </p>

                        {/* Vetted Local Restaurants */}
                        {pin.restaurants && pin.restaurants.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C]">
                              Authentische Kiez-Lokale (Keine Touristenfallen):
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {pin.restaurants.map((r, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-2.5 rounded-xl bg-[#08121E]/90 border border-[rgba(201,168,76,0.2)] text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <strong className="text-[#F4E4C1] text-xs truncate max-w-[140px]">
                                      {r.name}
                                    </strong>
                                    <span className="text-[9px] text-[#C9A84C] font-mono shrink-0">
                                      {r.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-emerald-300 font-medium">
                                    ✨ {r.specialty}
                                  </p>
                                  <p className="text-[10px] text-[#8A9AAA] leading-tight">
                                    {r.tip}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Unlocked GPS & Multi-Nav Links */}
                <div className="p-5 pt-0">
                  {isUnlocked ? (
                    <div className="space-y-2.5">
                      <div className="bg-[#0C1825] rounded-lg px-3.5 py-2.5 flex items-center gap-3 border border-[rgba(58,107,74,0.35)]">
                        <span className="text-emerald-400 text-base">📍</span>
                        <span className="coord text-emerald-400 text-xs font-mono font-bold tracking-wide">
                          {pin.gps}
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(pin.gps)}
                          className="ml-auto font-mono text-[0.65rem] text-[#C9A84C] border border-[rgba(201,168,76,0.3)] px-2 py-1 rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                        >
                          Kopieren
                        </button>
                      </div>

                      {/* Multi Navigation Links */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1.5 px-2 bg-[#17263c] hover:bg-[#1f3350] border border-white/10 rounded text-[11px] text-[#F4E4C1] font-semibold transition-colors"
                        >
                          🗺️ Google
                        </a>
                        <a
                          href={`https://maps.apple.com/?q=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1.5 px-2 bg-[#17263c] hover:bg-[#1f3350] border border-white/10 rounded text-[11px] text-[#F4E4C1] font-semibold transition-colors"
                        >
                          🍎 Apple
                        </a>
                        <a
                          href={`https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1.5 px-2 bg-[#17263c] hover:bg-[#1f3350] border border-white/10 rounded text-[11px] text-[#F4E4C1] font-semibold transition-colors"
                        >
                          🚗 Waze
                        </a>
                        <button
                          onClick={() => downloadGPX(pin.local, pin.location, pin.gps)}
                          className="text-center py-1.5 px-2 bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.35)] rounded text-[11px] text-[#E8C460] font-bold transition-colors cursor-pointer"
                        >
                          💾 GPX
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setUnlocked(prev => [...prev, pin.id])}
                      className="btn btn-secondary w-full text-xs font-bold py-2.5"
                    >
                      🔒 Rubbeln, um GPS-Koordinaten &amp; Navi freizuschalten (+{pin.xp} XP)
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
