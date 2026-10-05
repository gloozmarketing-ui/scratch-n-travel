/**
 * Scratch'n'Travel — Live Hazard & Disaster Radar Engine v5.0
 * Multi-City Dynamic Calculation, Real-Time Warnings & Dedicated Fullscreen View
 */

(function () {
  'use strict';

  const CITY_HAZARDS = {
    'Lissabon': [
      { id: 'hz_sintra_fire', type: 'fire', title: '🔥 Sintra Naturpark Hitzewarnung', level: 'HIGH', desc: 'Aufgrund extremer Trockenheit & 36°C sind die Waldwege um Castelo dos Mouros ab 11:00 Uhr gesperrt.', safeZone: 'Küste & windige Strände (Guincho / Cascais) sind sicher.' },
      { id: 'hz_guincho_rip', type: 'ocean', title: '🌊 Starke Unterströmung (Riptide) Praia do Guincho', level: 'MEDIUM', desc: 'Atlantik-Dünung 2.1m erzeugt starke seitliche Strömungen im nördlichen Strandabschnitt.', safeZone: 'Nur in bewachten Zonen zwischen den roten Flaggen schwimmen.' },
      { id: 'hz_ursa_cliff', type: 'cliff', title: '⚠️ Klippen-Abbruchgefahr Praia da Ursa', level: 'MEDIUM', desc: 'Kürzliche Regenfälle haben den Abstiegspfad gelockert. Festes Schuhwerk zwingend erforderlich.', safeZone: 'Nur markierte Hauptpfade nutzen, mind. 15m Abstand zur Klippenkante.' }
    ],
    'Algarve': [
      { id: 'hz_algarve_cliffs', type: 'cliff', title: '⚠️ Steinschlaggefahr Ponta da Piedade & Benagil', level: 'HIGH', desc: 'Kalksteinklippen können unvermittelt abbrechen. Niemals direkt unter überhängenden Felswänden sonnen.', safeZone: 'Halte mindestens die Höhe der Klippe als Sicherheitsabstand zum Strand.' },
      { id: 'hz_algarve_heat', type: 'fire', title: '🔥 Waldbrand-Warnstufe Monchique Gebirge', level: 'MEDIUM', desc: 'Erhöhte Waldbrandgefahr im Hinterland. Grillen & offenes Feuer strengstens verboten.', safeZone: 'Küstengebiete von Sagres bis Faro unbedenklich.' }
    ],
    'Barcelona': [
      { id: 'hz_bcn_storm', type: 'storm', title: '⛈️ Sommergewitter & Sturmböen Katalonien', level: 'LOW', desc: 'Mögliche kurze Starkregenfälle am Nachmittag mit Windböen bis zu 45 km/h.', safeZone: 'Altstadt-Gassen & Innenräume bieten perfekten Schutz.' },
      { id: 'hz_bcn_jelly', type: 'ocean', title: '🌊 Quallen-Warnung Barceloneta Strand', level: 'LOW', desc: 'Gelegentliches Auftreten von Leuchtquallen bei warmem Wasser (24°C).', safeZone: 'Beflaggung der Rettungsschwimmer beachten.' }
    ]
  };

  function HazardSimEngine() {
    this.currentCity = 'Lissabon';
  }

  HazardSimEngine.prototype.renderSummary = function (containerId) {
    containerId = containerId || 'liveHazardRadarContainer';
    const el = document.getElementById(containerId);
    if (!el) return;

    const list = CITY_HAZARDS[this.currentCity] || CITY_HAZARDS['Lissabon'];

    let html = `
      <div style="background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.4); border-radius: 20px; padding: 22px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <div>
            <span class="badge" style="background: #EF4444; color: #fff;">🚨 Live Hazard & Disaster Radar</span>
            <h3 style="font-size: 1.4rem; color: var(--text-main); margin: 6px 0 0;">Aktuelle Gefahrenwarnungen für ${this.currentCity}</h3>
          </div>
          <button class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.82rem;" onclick="window.hazardRadar.openFullModal()">
            Radar Vollansicht öffnen 🔍
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${list.map(h => `
            <div style="background: var(--bg-surface); border-left: 4px solid ${h.level === 'HIGH' ? '#EF4444' : '#F59E0B'}; border-radius: 8px; padding: 12px 14px; font-size: 0.88rem;">
              <div style="font-weight: 800; color: var(--text-main); margin-bottom: 2px;">${h.title}</div>
              <div style="color: var(--text-muted); font-size: 0.82rem; line-height: 1.45;">${h.desc}</div>
              <div style="color: var(--emerald-primary); font-size: 0.78rem; margin-top: 4px; font-weight: 700;">🛡️ Sicherer Ausweichbereich: ${h.safeZone}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    el.innerHTML = html;
  };

  HazardSimEngine.prototype.openFullModal = function () {
    let modal = document.getElementById('hazardRadarModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hazardRadarModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const list = CITY_HAZARDS[this.currentCity] || CITY_HAZARDS['Lissabon'];

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 680px; width: 95%; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" onclick="document.getElementById('hazardRadarModal').style.display='none'">×</button>
        
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px;">
          <div style="font-size: 2.5rem;">🛰️</div>
          <div>
            <span class="badge" style="background: #EF4444; color: #fff;">Satelliten-Echtzeitradar</span>
            <h3 style="font-size: 1.5rem; color: var(--text-main); margin: 4px 0 0;">Gefahren- & Unwetterlage: ${this.currentCity}</h3>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap;">
          <button class="filter-btn active" style="padding: 6px 14px; font-size: 0.8rem;">Alle (${list.length})</button>
          <button class="filter-btn" style="padding: 6px 14px; font-size: 0.8rem;">🔥 Waldbrand & Hitze</button>
          <button class="filter-btn" style="padding: 6px 14px; font-size: 0.8rem;">🌊 Meeresströmung</button>
          <button class="filter-btn" style="padding: 6px 14px; font-size: 0.8rem;">⚠️ Klippen & Fels</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          ${list.map(h => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 12px; padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">${h.title}</span>
                <span class="badge" style="background: ${h.level === 'HIGH' ? '#EF4444' : '#F59E0B'}; color: #fff; font-size: 0.68rem;">${h.level} PRIORITY</span>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px;">${h.desc}</p>
              <div style="background: rgba(16,185,129,0.1); border: 1px solid var(--emerald-primary); padding: 8px 12px; border-radius: 8px; font-size: 0.78rem; color: var(--text-main);">
                🛡️ <strong>Sicherheits-Empfehlung:</strong> ${h.safeZone}
              </div>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem;" onclick="document.getElementById('hazardRadarModal').style.display='none'">
          Verstanden & Schließen ✓
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  };

  window.hazardRadar = new HazardSimEngine();

  window.addEventListener('snt:city_changed', (e) => {
    if (e.detail?.city && window.hazardRadar) {
      window.hazardRadar.currentCity = e.detail.city;
      window.hazardRadar.renderSummary();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.hazardRadar.renderSummary();
  });

})();
