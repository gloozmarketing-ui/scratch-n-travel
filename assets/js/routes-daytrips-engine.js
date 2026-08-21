/**
 * Scratch'n'Travel — Community Day-Trips & Walking Routes Engine v5.0
 * 
 * Features:
 * - Curated & User-Generated 1-Day Walking Trails with Stop-by-Stop Tips
 * - Interactive Route Creator Modal ("Wann am besten", "Warum genial", Foto-Upload)
 * - Pro VIP Features: 1-Click GPX / KML GPS Export & Printable PDF Export
 */

(function () {
  'use strict';

  const DEFAULT_ROUTES = [
    {
      id: 'route_alfama_miradouros',
      city: 'Lissabon',
      title: 'Geheime Miradouros & Azulejo-Höfe zu Fuß',
      author: 'Sofia B. (Verifizierter Local Guide 🛡️)',
      duration: '4.5 Std.',
      distance: '5.8 km',
      elevation: '140 Hm (Treppen & Kopfsteinpflaster)',
      bestTime: '🌅 Frühmorgens 08:30 Uhr oder Sunset 18:30 Uhr',
      highlights: ['Miradouro de Santa Luzia', 'Versteckte Fado-Gasse Alfama', 'Pastelaria mit Steinofen'],
      description: 'Entdecke die stillen Ecken von Alfama und Graça abseits der überfüllten Tram 28. Frühmorgens duftet es nach frischem Espresso und die Kachelfassaden glänzen in der Morgensonne.',
      stops: [
        { name: 'Start: Miradouro de Santa Luzia', tip: 'Wunderschöne Bougainvillea & Azulejo-Panoramen über den Tejo. Vor 09:00 Uhr fast menschenleer!' },
        { name: 'Stopp 2: Tasca do Jaime (Kiez-Gasse)', tip: 'Hier singen Einheimische am Wochenende spontanen Fado vadio zum Vinho Verde.' },
        { name: 'Ziel: Miradouro da Senhora do Monte', tip: 'Der höchste Aussichtspunkt der Stadt mit 360-Grad-Blick zum Sonnenuntergang.' }
      ],
      gpxData: '<?xml version="1.0"?><gpx version="1.1"><trk><name>Alfama Miradouros Trail</name><trkseg><trkpt lat="38.7118" lon="-9.1306"/><trkpt lat="38.7152" lon="-9.1325"/><trkpt lat="38.7194" lon="-9.1328"/></trkseg></trk></gpx>'
    },
    {
      id: 'route_sintra_mystic_forest',
      city: 'Sintra',
      title: 'Verwunschener Nebelwald & Maurischer Felsenpfad',
      author: 'Clara & Hund Luna (Local Ambassador 🐶)',
      duration: '5.5 Std.',
      distance: '8.4 km',
      elevation: '320 Hm',
      bestTime: '🌲 Vormittags bei Morgennebel (schattig & kühl)',
      highlights: ['Schattige Korkeichenpfade', 'Moosbedeckte Monolithen', 'Hundefreundliche Quellen'],
      description: 'Dieser schattige Trail führt durch das mystische Sintra-Gebirge abseits der Touristenströme. Perfekt für Wanderer, Fotografen und Reisende mit Hund.',
      stops: [
        { name: 'Start: Fonte dos Pisões', tip: 'Frisches Quellwasser auffüllen, idealer schattiger Einstieg in den Wald.' },
        { name: 'Stopp 2: Santuário da Peninha', tip: 'Dramatische Aussicht auf den gesamten Atlantik von Cabo da Roca bis Ericeira.' },
        { name: 'Ziel: Lagoa dos Mosqueiros', tip: 'Ruhiger Waldsee für eine ausgiebige Picknickpause im Grünen.' }
      ],
      gpxData: '<?xml version="1.0"?><gpx version="1.1"><trk><name>Sintra Mystic Forest Trail</name><trkseg><trkpt lat="38.7884" lon="-9.4215"/><trkpt lat="38.7701" lon="-9.4601"/><trkpt lat="38.7612" lon="-9.4721"/></trkseg></trk></gpx>'
    }
  ];

  function RoutesDaytripsEngine() {
    this.routes = JSON.parse(localStorage.getItem('snt_community_routes') || 'null') || DEFAULT_ROUTES;
  }

  RoutesDaytripsEngine.prototype.renderRoutes = function (containerId) {
    containerId = containerId || 'communityRoutesContainer';
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = '';
    this.routes.forEach(r => {
      html += `
        <div class="glass-card route-card" style="border-radius: 20px; padding: 24px; margin-bottom: 20px; border: 1px solid var(--border-line);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <div>
              <span class="badge badge-emerald">📍 ${r.city} · Tagestour zu Fuß</span>
              <h3 style="font-size: 1.4rem; color: var(--text-main); font-weight: 800; margin: 6px 0 2px;">${r.title}</h3>
              <p style="font-size: 0.8rem; color: var(--text-dim); margin: 0;">Erstellt von: <strong style="color: var(--sand-gold);">${r.author}</strong></p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-main);">⏱️ ${r.duration}</span>
              <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-main);">👟 ${r.distance}</span>
            </div>
          </div>

          <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
            ${r.description}
          </p>

          <div style="background: var(--bg-surface); border-radius: 12px; padding: 14px; margin-bottom: 16px; font-size: 0.85rem;">
            <div style="color: var(--sand-gold); font-weight: 700; margin-bottom: 6px;">${r.bestTime}</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${r.stops.map((s, idx) => `
                <div style="display: flex; gap: 8px;">
                  <span style="font-weight: 800; color: var(--emerald-primary);">${idx + 1}.</span>
                  <div>
                    <strong style="color: var(--text-main);">${s.name}:</strong>
                    <span style="color: var(--text-muted);"> ${s.tip}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Action Buttons (GPX & PDF Download) -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.84rem;" onclick="window.routesEngine.downloadGpx('${r.id}')">
                📥 GPX / Komoot Export 🗺️
              </button>
              <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.84rem;" onclick="window.routesEngine.downloadPdf('${r.id}')">
                📄 PDF Guide Drucken
              </button>
            </div>
            <button class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.84rem;" onclick="alert('❤️ Route zu deinen Favoriten hinzugefügt!')">
              ⭐ Speichern
            </button>
          </div>
        </div>
      `;
    });

    el.innerHTML = html;
  };

  RoutesDaytripsEngine.prototype.downloadGpx = function (routeId) {
    const isPro = localStorage.getItem('snt_tier') === 'pro' || localStorage.getItem('snt_beta_vip') === 'true';
    if (!isPro) {
      if (window.tierGuard) {
        window.tierGuard.openUpgradeModal('GPX & KML Navigations-Export ist ein exklusives Pro VIP Feature für Komoot, Garmin & Google Maps.');
      } else {
        alert('GPX Export ist im Pro VIP Plan enthalten.');
      }
      return;
    }

    const route = this.routes.find(r => r.id === routeId) || this.routes[0];
    const blob = new Blob([route.gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${route.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.gpx`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.stripeManager && typeof window.stripeManager.showToast === 'function') {
      window.stripeManager.showToast('📥 GPX-Datei heruntergeladen! Bereit für Komoot & Maps.me.');
    }
  };

  RoutesDaytripsEngine.prototype.downloadPdf = function (routeId) {
    const route = this.routes.find(r => r.id === routeId) || this.routes[0];
    window.print();
  };

  RoutesDaytripsEngine.prototype.openCreateRouteModal = function () {
    let modal = document.getElementById('createRouteModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'createRouteModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px; width: 95%; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" onclick="document.getElementById('createRouteModal').style.display='none'">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge badge-emerald">✨ Community Tagestour Vorschlagen</span>
          <h3 style="font-size: 1.5rem; color: var(--text-main); margin: 6px 0 0;">Deine 1-Tages-Lieblingsroute</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Teile deine Route zu Fuß mit Geheimtipps & verdiene +2 Rubbelkarten!</p>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Titel der Route:</label>
          <input type="text" id="newRouteTitle" placeholder="z.B. 1 Tag Klippenpfad & Sunset Tasca in Ericeira" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main);" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Dauer & Distanz:</label>
            <input type="text" id="newRouteStats" placeholder="z.B. 4 Std. · 6.5 km" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main);" />
          </div>
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Beste Tageszeit:</label>
            <input type="text" id="newRouteTime" placeholder="z.B. Vormittags ab 09:00 Uhr" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main);" />
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Wichtige Stopps & Tipps (Warum lohnt es sich?):</label>
          <textarea id="newRouteDesc" rows="4" placeholder="1. Start am Strand-Café für Bica & Toste\n2. Versteckter Felsenpfad nach Norden\n3. Mittagessen bei Tasca Dona Maria (fangfrischer Fisch)..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-family: inherit;"></textarea>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" onclick="window.routesEngine.submitNewRoute()">
          🚀 Route Veröffentlichen (+2 Rubbelkarten 🪙)
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  };

  RoutesDaytripsEngine.prototype.submitNewRoute = function () {
    const title = document.getElementById('newRouteTitle')?.value;
    const stats = document.getElementById('newRouteStats')?.value || '3.5 Std. · 5.0 km';
    const time = document.getElementById('newRouteTime')?.value || 'Tagsüber';
    const desc = document.getElementById('newRouteDesc')?.value;

    if (!title || !desc) {
      alert('Bitte Titel und Beschreibung ausfüllen.');
      return;
    }

    const newR = {
      id: 'route_custom_' + Date.now(),
      city: 'Lissabon / Umgebung',
      title: title,
      author: 'Du (Community Creator ✨)',
      duration: stats.split('·')[0]?.trim() || '3 Std.',
      distance: stats.split('·')[1]?.trim() || '5.0 km',
      elevation: '100 Hm',
      bestTime: '🌅 ' + time,
      highlights: ['Community Tipp', 'Authentisch'],
      description: desc,
      stops: [{ name: 'Stopp 1', tip: desc.substring(0, 80) + '...' }],
      gpxData: '<?xml version="1.0"?><gpx version="1.1"><trk><name>' + title + '</name></trk></gpx>'
    };

    this.routes.unshift(newR);
    localStorage.setItem('snt_community_routes', JSON.stringify(this.routes));

    const modal = document.getElementById('createRouteModal');
    if (modal) modal.style.display = 'none';

    this.renderRoutes();

    if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
      window.scratchWallet.award('share_story');
    }
  };

  window.routesEngine = new RoutesDaytripsEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.routesEngine.renderRoutes();
  });

})();
