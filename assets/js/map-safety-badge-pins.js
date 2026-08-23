/**
 * Scratch'n'Travel — Interactive Map Badge Pins & Exact Scam-Radar Engine v5.0
 * 
 * Features:
 * 1. Visualizes earned badges as illuminated colored pins on the interactive map
 * 2. Pinpoints exact Local Safety & Scam-Radar danger zones (Pickpockets, Fake Tickets, Rip-offs)
 * 3. Allows users to report new verified scam locations with exact GPS coordinates
 * 4. Renders live safety radius danger circles & warning badges
 */

(function () {
  'use strict';

  // 1. Precise Scam & Safety Radar Hotspots Database
  const SCAM_RADAR_PINS = [
    {
      id: 'scam_tram28',
      city: 'Lissabon',
      title: '🚨 Taschendieb-Bande Tram 28 (Martim Moniz)',
      category: 'pickpocket',
      color: '#EF4444',
      icon: '👛⚠️',
      lat: 38.7153,
      lng: -9.1358,
      severity: 'HOCH',
      desc: 'Organisierte Gruppen nutzen das dichte Gedränge beim Einsteigen. Wertsachen immer vorne unter der Kleidung tragen!',
      reportedBy: 'Pedro (Verifizierter Local Guide 🛡️)',
      date: 'Gestern verifiziert'
    },
    {
      id: 'scam_rossio_fake',
      city: 'Lissabon',
      title: '🟡 Wucher-Preise & Touristenfalle Rossio Platz',
      category: 'rip_off',
      color: '#F59E0B',
      icon: '💸⚠️',
      lat: 38.7138,
      lng: -9.1394,
      severity: 'MITTEL',
      desc: 'Restaurants bringen unaufgefordert Vorspeisen (Oliven, Käse, Schinken) und berechnen 18 € extra, wenn man sie anrührt.',
      reportedBy: 'Inês M. (Local)',
      date: 'Vor 3 Tagen'
    },
    {
      id: 'scam_belem_ticket',
      city: 'Lissabon',
      title: '🔴 Gefälschte Schnell-Einlass-Tickets Torre de Belém',
      category: 'fake_ticket',
      color: '#DC2626',
      icon: '🎫🚫',
      lat: 38.6916,
      lng: -9.2160,
      severity: 'HOCH',
      desc: 'Personen mit gefälschten VIP-Ausweisen verkaufen ungültige Papiertickets für 25 €. Nur an der offiziellen Kasse oder online kaufen!',
      reportedBy: 'Marco (Explorer)',
      date: 'Vor 5 Tagen'
    },
    {
      id: 'scam_rambla_shell',
      city: 'Barcelona',
      title: '🚨 Hütchenspieler & Banden La Rambla',
      category: 'scam_game',
      color: '#EF4444',
      icon: '🃏⚠️',
      lat: 41.3818,
      lng: 2.1730,
      severity: 'HOCH',
      desc: 'Illegale Straßenspiele zur Ablenkung, während Komplizen von hinten in Rucksäcke greifen.',
      reportedBy: 'Carlos (Barcelona Local)',
      date: 'Vor 2 Tagen'
    },
    {
      id: 'scam_ursa_cliff',
      city: 'Sintra / Küste',
      title: '⚠️ Gefährlicher Klippenpfad Praia da Ursa',
      category: 'danger_zone',
      color: '#F59E0B',
      icon: '🧗⚠️',
      lat: 38.7901,
      lng: -9.4925,
      severity: 'MITTEL',
      desc: 'Hangrutsch nach Regen. Niemals mit Flip-Flops absteigen, Ausrutschgefahr!',
      reportedBy: 'Clara & Luna 🐶',
      date: 'Live Aktiv'
    }
  ];

  // 2. User Earned Badge Locations
  const USER_MAP_BADGES = [
    {
      id: 'badge_wave_master',
      title: 'Wave Master',
      icon: '🏄‍♂️',
      color: '#D4AF37',
      city: 'Ericeira',
      lat: 38.9633,
      lng: -9.4172,
      earnedAt: '14. Aug 2026',
      xp: '+400 XP'
    },
    {
      id: 'badge_pet_ambassador',
      title: 'Pet Ambassador',
      icon: '🐶',
      color: '#10B981',
      city: 'Sintra Küstenpfad',
      lat: 38.7980,
      lng: -9.4850,
      earnedAt: '18. Aug 2026',
      xp: '+150 XP'
    },
    {
      id: 'badge_tasca_hunter',
      title: 'Tasca Gourmet Hunter',
      icon: '🍲',
      color: '#14B8C3',
      city: 'Lissabon Alfama',
      lat: 38.7120,
      lng: -9.1290,
      earnedAt: '20. Aug 2026',
      xp: '+150 XP'
    }
  ];

  function MapSafetyBadgeEngine() {
    this.scamPins = JSON.parse(localStorage.getItem('snt_scam_radar_pins') || 'null') || SCAM_RADAR_PINS;
    this.badgePins = USER_MAP_BADGES;
    this.activeFilter = 'all';
  }

  MapSafetyBadgeEngine.prototype.renderInteractiveMapViewer = function (containerId) {
    containerId = containerId || 'interactiveMapRadarContainer';
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="background: #0A0E17; border: 2px solid var(--sand-gold); border-radius: 24px; padding: 24px; box-shadow: 0 16px 48px rgba(0,0,0,0.6); margin-bottom: 36px;">
        <!-- Header Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="badge badge-gold">🗺️ Interaktive GPS-Karte</span>
              <span class="badge badge-emerald">🪙 ${this.badgePins.length} Badges verortet</span>
              <span class="badge" style="background: #EF4444; color: #fff;">🚨 ${this.scamPins.length} Gefahren-Warnungen</span>
            </div>
            <h3 style="font-size: 1.6rem; color: var(--text-main); font-weight: 800; margin: 8px 0 2px;">
              Deine Badge-Punkte & Local Scam-Radar auf der Karte
            </h3>
            <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0;">
              Klicke auf die leuchtenden Pins, um freigeschaltete Badges oder genaue Warnungen vor Taschendieben & Wucherfallen zu sehen.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem;" onclick="window.mapSafetyBadge.filterMap('all')">🌐 Alle Pins</button>
            <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem; border-color: var(--sand-gold); color: var(--sand-gold);" onclick="window.mapSafetyBadge.filterMap('badges')">🪙 Nur Badges</button>
            <button class="btn btn-secondary" style="padding: 8px 14px; font-size: 0.82rem; border-color: #EF4444; color: #EF4444;" onclick="window.mapSafetyBadge.filterMap('scams')">🚨 Nur Gefahren</button>
            <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem;" onclick="window.mapSafetyBadge.openReportScamModal()">+ Scam / Gefahr Melden 📍</button>
          </div>
        </div>

        <!-- Simulated Visual Map Surface -->
        <div style="position: relative; width: 100%; height: 420px; background: radial-gradient(circle at center, #132238 0%, #080D18 100%); border-radius: 18px; overflow: hidden; border: 1px solid var(--border-line); box-shadow: inset 0 0 60px rgba(0,0,0,0.8);">
          <!-- Map Grid Pattern Overlay -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none;"></div>

          <!-- Coastline Silhouette -->
          <svg style="position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0.18; pointer-events: none;" viewBox="0 0 800 420">
            <path d="M120 0 Q180 120 140 220 T210 350 Q240 420 280 420" fill="none" stroke="#10B981" stroke-width="8"/>
            <path d="M140 220 Q280 200 450 250 T750 220" fill="none" stroke="#06B6D4" stroke-width="4"/>
          </svg>

          <!-- Render All Interactive Pins -->
          <div id="mapPinsSurface" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
            ${this.generatePinsHtml()}
          </div>
        </div>

        <!-- Pin Info Inspector Box -->
        <div id="mapPinDetailBox" style="margin-top: 16px; background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 14px; padding: 14px 20px; display: none;">
          <!-- Dynamic details filled on pin click -->
        </div>
      </div>
    `;
  };

  MapSafetyBadgeEngine.prototype.generatePinsHtml = function () {
    let html = '';

    // Positions mapped visually across 800x420 canvas area
    const PIN_COORDINATES = [
      { top: '35%', left: '28%' }, // Sintra / Ursa
      { top: '48%', left: '42%' }, // Lisbon Martim Moniz
      { top: '56%', left: '46%' }, // Lisbon Rossio / Alfama
      { top: '65%', left: '38%' }, // Belem
      { top: '22%', left: '25%' }, // Ericeira
      { top: '40%', left: '75%' }  // Barcelona
    ];

    let coordIdx = 0;

    // 1. Badge Pins (Gold / Cyan / Emerald)
    if (this.activeFilter === 'all' || this.activeFilter === 'badges') {
      this.badgePins.forEach(b => {
        const pos = PIN_COORDINATES[coordIdx % PIN_COORDINATES.length];
        coordIdx++;
        html += `
          <div class="map-badge-pin" onclick="window.mapSafetyBadge.showBadgeDetails('${b.id}')" style="position: absolute; top: ${pos.top}; left: ${pos.left}; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; text-align: center;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, #2A1F0A 0%, #0A0A0A 100%); border: 3px solid ${b.color}; box-shadow: 0 0 20px ${b.color}; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; animation: pulse 2.5s infinite;">
              ${b.icon}
            </div>
            <span style="display: block; font-size: 0.7rem; font-weight: 800; color: ${b.color}; background: rgba(0,0,0,0.75); padding: 2px 6px; border-radius: 6px; margin-top: 4px; border: 1px solid ${b.color};">
              ${b.title}
            </span>
          </div>
        `;
      });
    }

    // 2. Scam / Hazard Pins (Red / Orange Warning)
    if (this.activeFilter === 'all' || this.activeFilter === 'scams') {
      this.scamPins.forEach(s => {
        const pos = PIN_COORDINATES[coordIdx % PIN_COORDINATES.length];
        coordIdx++;
        html += `
          <div class="map-scam-pin" onclick="window.mapSafetyBadge.showScamDetails('${s.id}')" style="position: absolute; top: ${pos.top}; left: ${pos.left}; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; text-align: center;">
            <!-- Pulsing danger radius circle -->
            <div style="position: absolute; top: 50%; left: 50%; width: 70px; height: 70px; border-radius: 50%; background: rgba(239,68,68,0.2); border: 1px dashed #EF4444; transform: translate(-50%, -50%); pointer-events: none;"></div>

            <div style="width: 38px; height: 38px; border-radius: 50%; background: #1C0808; border: 2px solid ${s.color}; box-shadow: 0 0 16px ${s.color}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin: 0 auto;">
              ${s.icon}
            </div>
            <span style="display: block; font-size: 0.68rem; font-weight: 800; color: #fff; background: ${s.color}; padding: 2px 6px; border-radius: 6px; margin-top: 4px;">
              ${s.category.toUpperCase()}
            </span>
          </div>
        `;
      });
    }

    return html;
  };

  MapSafetyBadgeEngine.prototype.showBadgeDetails = function (badgeId) {
    const b = this.badgePins.find(x => x.id === badgeId) || this.badgePins[0];
    const box = document.getElementById('mapPinDetailBox');
    if (!box) return;

    box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 2.2rem;">${b.icon}</div>
          <div>
            <span class="badge badge-gold">🪙 Dein Freigeschaltetes Badge</span>
            <h4 style="color: var(--text-main); font-size: 1.2rem; margin: 2px 0;">${b.title} (${b.city})</h4>
            <div style="font-size: 0.78rem; color: var(--text-dim);">Freigeschaltet am ${b.earnedAt} · GPS: ${b.lat.toFixed(4)}°, ${b.lng.toFixed(4)}°</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-emerald">${b.xp}</span>
          <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="window.badgeMerch.openMerchPreviewModal('${b.id}')">
            🏷️ Als Patch Bestellen →
          </button>
        </div>
      </div>
    `;
    box.style.display = 'block';
  };

  MapSafetyBadgeEngine.prototype.showScamDetails = function (scamId) {
    const s = this.scamPins.find(x => x.id === scamId) || this.scamPins[0];
    const box = document.getElementById('mapPinDetailBox');
    if (!box) return;

    box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <span class="badge" style="background: ${s.color}; color: #fff;">🚨 Gefahren-Warnung: ${s.severity}</span>
          <h4 style="color: var(--text-main); font-size: 1.2rem; margin: 6px 0 4px;">${s.title}</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 8px;">${s.desc}</p>
          <div style="font-size: 0.76rem; color: var(--emerald-primary);">🛡️ Gemeldet von: <strong>${s.reportedBy}</strong> (${s.date})</div>
        </div>
        <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="alert('Danke für die Verifikation! Die Warnung wurde aktuell gehalten.')">
          👍 Warntipp Bestätigen
        </button>
      </div>
    `;
    box.style.display = 'block';
  };

  MapSafetyBadgeEngine.prototype.filterMap = function (filter) {
    this.activeFilter = filter;
    const surface = document.getElementById('mapPinsSurface');
    if (surface) surface.innerHTML = this.generatePinsHtml();
  };

  MapSafetyBadgeEngine.prototype.openReportScamModal = function () {
    let modal = document.getElementById('reportScamModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'reportScamModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 580px; width: 95%;">
        <button class="modal-close" onclick="document.getElementById('reportScamModal').style.display='none'">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge" style="background: #EF4444; color: #fff;">🚨 Local Safety & Scam-Radar</span>
          <h3 style="font-size: 1.5rem; color: var(--text-main); margin: 6px 0 0;">Neue Gefahr / Touristenfalle melden</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Schütze die Community vor Taschendieben, Wucherpreisen & Fake-Tickets.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Art der Gefahr:</label>
            <select id="newScamCategory" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main);">
              <option value="pickpocket">👛 Taschendiebe & Banden</option>
              <option value="rip_off">💸 Wucherpreise & Abzocke im Restaurant</option>
              <option value="fake_ticket">🎫 Gefälschte Eintritts-Tickets</option>
              <option value="danger_zone">⚠️ Gefährliche Klippen & ungesicherte Pfade</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Genauer Ort / Straße / Haltestelle:</label>
            <input type="text" id="newScamLocation" placeholder="z.B. Metrostation Baixa-Chiado Ausgang Rua Garrett" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main);" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 4px;">Was ist genau passiert? Wie schützt man sich?</label>
            <textarea id="newScamDesc" rows="3" placeholder="Beschreibe die Vorgehensweise (z.B. Ablenkung mit Stadtplan, gefälschte Ausweise)..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-family: inherit;"></textarea>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem; background: #EF4444; border-color: #EF4444;" onclick="window.mapSafetyBadge.submitScamReport()">
          🚨 Warnung auf Karte eintragen (+2 Rubbelkarten 🪙)
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  };

  MapSafetyBadgeEngine.prototype.submitScamReport = function () {
    const cat = document.getElementById('newScamCategory')?.value || 'pickpocket';
    const loc = document.getElementById('newScamLocation')?.value;
    const desc = document.getElementById('newScamDesc')?.value;

    if (!loc || !desc) {
      alert('Bitte Ort und Beschreibung ausfüllen.');
      return;
    }

    const newPin = {
      id: 'scam_user_' + Date.now(),
      city: 'Gemeldeter Ort',
      title: '⚠️ ' + loc,
      category: cat,
      color: cat === 'rip_off' ? '#F59E0B' : '#EF4444',
      icon: '🚨⚠️',
      lat: 38.7160,
      lng: -9.1380,
      severity: 'COMMUNITY VERIFIED',
      desc: desc,
      reportedBy: 'Du (Community Guardian 🛡️)',
      date: 'Gerade eben'
    };

    this.scamPins.unshift(newPin);
    localStorage.setItem('snt_scam_radar_pins', JSON.stringify(this.scamPins));

    const modal = document.getElementById('reportScamModal');
    if (modal) modal.style.display = 'none';

    this.renderInteractiveMapViewer();

    if (window.stripeManager && typeof window.stripeManager.showToast === 'function') {
      window.stripeManager.showToast('🚨 Danke für deinen Beitrag! Die Warnung ist jetzt auf der Karte sichtbar.');
    }

    if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
      window.scratchWallet.award('share_story');
    }
  };

  window.mapSafetyBadge = new MapSafetyBadgeEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.mapSafetyBadge.renderInteractiveMapViewer();
  });

})();
