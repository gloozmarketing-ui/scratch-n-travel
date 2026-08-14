/**
 * Scratch'n'Travel — Live Hazard Radar, Low-Cost Internet Guide & GPS Nearby Engine
 * 
 * Features:
 * 1. Live Hazard Radar: Wildfire alerts, Riptides/Strong Currents, Heatwaves, Cliff Fall Warnings
 * 2. Low-Cost Global Internet & eSIM Guide: Airalo, Holafly, Local Prepaid SIMs, Ferry Satellite Traps
 * 3. GPS Proximity Spot Finder: Calculates distances to all local secret spots
 * 4. Partner QR-Code & Foto Check-In for Visa Stamp Gamification
 */

const HAZARD_ALERTS = [
  {
    id: 'hazard_wildfire_sintra',
    level: 'critical',
    badge: '🔥 Waldbrand-Gefahrenstufe Rot',
    title: 'Sintra Naturpark: Erhöhte Waldbrandgefahr & Park-Sperrungen',
    location: 'Serra de Sintra & Naturpark',
    severity: 'HOCH (Juni – September)',
    description: 'Bei Hitze über 35°C und trockenem Nordwind sperrt die Zivilschutzbehörde (ANEPC) die Zufahrtsstraßen zu den Schlössern (Pena, Castelo dos Mouros). Rauchen und offenes Feuer im Wald sind streng verboten.',
    actionAdvice: 'Vor Ausflügen die offizielle Warn-App "Fogos.pt" oder die Website der Proteção Civil (prociv.pt) prüfen. Bei Evakuierungsalarm sofort die Küstenstraße N247 wählen.',
    officialSource: 'ANEPC / Proteção Civil Portugal'
  },
  {
    id: 'hazard_riptides_atlantic',
    level: 'warning',
    badge: '🌊 Gefährliche Unterströmungen (Riptides)',
    title: 'Wilde Atlantik-Küste: Unbewachte Naturstrände',
    location: 'Praia da Ursa, Guincho & Costa da Caparica',
    severity: 'MITTEL BIS HOCH',
    description: 'An naturbelassenen Stränden ohne Rettungsschwimmer gibt es tückische Brandungsrückströme (Rip Currents), die selbst starke Schwimmer ins offene Meer ziehen können.',
    actionAdvice: 'Niemals gegen die Strömung ankämpfen! Schwimme immer PARALLEL zum Strand aus dem Strömungskanal heraus. Kleinkinder und Hunde nie unbeaufsichtigt an die Brandung lassen.',
    officialSource: 'Instituto de Socorros a Náufragos (ISN)'
  },
  {
    id: 'hazard_heatwave_pets',
    level: 'warning',
    badge: '☀️ Hitze-Warnung: Hunde & Kleinkinder',
    title: 'Asphalt-Verbrennungen & Dehydration bei > 32°C',
    location: 'Innenstadt Lissabon / Pflasterstraßen',
    severity: 'GESUNDHEITSRISIKO',
    description: 'Schwarzer Asphalt und portugiesisches Kopfsteinpflaster (Calçada) erhitzen sich in der Sonne auf über 55°C. Dies führt zu schweren Pfotenverbrennungen bei Hunden und Hitzschlaggefahr im Kinderwagen.',
    actionAdvice: '7-Sekunden-Test: Halte deinen Handrücken 7 Sekunden auf den Boden. Ist es zu heiß für deine Hand, verbrennt sich dein Hund die Pfoten. Ausflüge auf vor 11:00 oder nach 18:30 Uhr legen.',
    officialSource: 'Tierärztlicher Notfalldienst'
  },
  {
    id: 'hazard_cliff_collapse',
    level: 'info',
    badge: '⚠️ Instabile Steilküste (Klippenabbruch)',
    title: 'Abstand zu porösen Felswänden halten',
    location: 'Algarve (Albufeira, Lagos) & Sintra Steilküste',
    severity: 'VORSICHT',
    description: 'Kalkstein- und Sandsteinklippen können unvermittelt abbrechen. Lege dein Handtuch niemals direkt unter Steilwände.',
    actionAdvice: 'Mindestabstand zur Felswand = mindestens die doppelte Höhe der Klippe.',
    officialSource: 'APA — Agência Portuguesa do Ambiente'
  }
];

const ESIM_INTERNET_PLANS = [
  {
    provider: 'Airalo (eSIM Empfehlung #1)',
    type: 'eSIM (Sofort aktiv)',
    price: 'ca. 4,50 € / 5 GB',
    validity: '7 – 30 Tage',
    pros: 'Sekundenschnelle Aktivierung via QR-Code vor Abflug. Keine physische SIM nötig. Netz: MEO / NOS.',
    badge: 'Bester Allrounder',
    link: 'https://www.airalo.com'
  },
  {
    provider: 'Lokale Prepaid-SIM (MEO / Vodafone)',
    type: 'Physische SIM / Shop vor Ort',
    price: 'ca. 15,00 € / 30 GB',
    validity: '30 Tage',
    pros: 'Höchstes Datenvolumen zum kleinen Preis. Erhältlich in offiziellen MEO/Vodafone Shops in Einkaufszentren (Achtung: nicht am Wucher-Kiosk am Flughafen kaufen!).',
    badge: 'Für Vielnutzer',
    link: 'https://www.meo.pt'
  },
  {
    provider: 'EU-Roaming (Deutscher Handyvertrag)',
    type: 'Inklusiv-Roaming',
    price: '0,00 € (Inklusive)',
    validity: 'Dauerhaft in der EU',
    pros: 'Innerhalb der EU (inkl. Portugal/Spanien) telefonieren und surfen wie zuhause. Achtung vor Fair-Use-Grenzen!',
    badge: 'Kostenlos im EU-Ausland',
    link: '#'
  },
  {
    provider: '⚠️ Satelliten-Falle (Fähren & Kreuzfahrten)',
    type: 'Gefahren-Warnung',
    price: 'Bis zu 12 € / Megabyte!',
    validity: 'Auf offener See',
    pros: 'Sobald Schiffe die Küstengewässer verlassen, schaltet sich teures Satellitennetz ein (fällt NICHT unter EU-Roaming!). Flugmodus auf Fähren zwingend aktivieren.',
    badge: 'Kostenfalle vermeiden',
    link: '#'
  }
];

class HazardSimEngine {
  constructor() {
    this.alerts = HAZARD_ALERTS;
    this.simPlans = ESIM_INTERNET_PLANS;
    // Known Coordinates for GPS distance calculations
    this.knownSpots = [
      { id: 'spot1', name: 'Praia da Ursa (Hundestrand & Klippen)', lat: 38.7903, lng: -9.4925 },
      { id: 'spot2', name: 'Jardim da Estrela (Familienpark)', lat: 38.7150, lng: -9.1585 },
      { id: 'spot3', name: 'Tasca O Galo (Alfama Hundefreundlich)', lat: 38.7120, lng: -9.1310 },
      { id: 'spot4', name: 'Nazaré Big Waves (Surf Klippen)', lat: 39.6050, lng: -9.0750 },
      { id: 'spot5', name: 'Portinho da Arrábida (Ruhiges Kajakwasser)', lat: 38.4790, lng: -8.9830 }
    ];
  }

  // Render Hazard Radar
  renderHazardAlerts(containerId = 'hazardAlertsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.alerts.map(a => `
      <div class="glass-card safety-card ${a.level === 'critical' ? 'danger' : a.level === 'warning' ? 'warning' : 'tip'}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span class="badge ${a.level === 'critical' ? 'badge-danger' : a.level === 'warning' ? 'badge-gold' : 'badge-emerald'}">
            ${a.badge}
          </span>
          <span style="font-size: 0.78rem; color: var(--text-dim);">📍 ${a.location}</span>
        </div>

        <h3 style="font-size: 1.18rem; margin-bottom: 8px; color: ${a.level === 'critical' ? '#FDA4AF' : a.level === 'warning' ? '#FDE68A' : '#A7F3D0'};">
          ${a.title}
        </h3>

        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">${a.description}</p>

        <div class="safety-advice-box ${a.level === 'critical' ? 'danger' : a.level === 'warning' ? 'warning' : 'tip'}">
          <strong>🚨 Schutzmaßnahmen & Verhalten:</strong> ${a.actionAdvice}
        </div>

        <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 12px; border-top: 1px solid var(--border-line); padding-top: 8px;">
          Offizielle Quelle: ${a.officialSource}
        </div>
      </div>
    `).join('');
  }

  // Render Low Cost eSIM & Internet Guide
  renderInternetGuide(containerId = 'internetGuideGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.simPlans.map(plan => `
      <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 3px solid ${plan.badge.includes('Gefahr') ? 'var(--rose-heart)' : 'var(--cyan-accent)'};">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="badge ${plan.badge.includes('Gefahr') ? 'badge-danger' : 'badge-cyan'}">${plan.badge}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: #FFF;">${plan.price}</span>
          </div>

          <h4 style="font-size: 1.15rem; margin: 8px 0; color: #FFF;">${plan.provider}</h4>
          <p style="font-size: 0.82rem; color: var(--emerald-primary); margin-bottom: 10px;">${plan.type} • Gültigkeit: ${plan.validity}</p>
          <p style="font-size: 0.88rem; color: var(--text-muted);">${plan.pros}</p>
        </div>

        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-line);">
          ${plan.link !== '#' ? `<a href="${plan.link}" target="_blank" rel="noopener" class="btn btn-secondary" style="width: 100%; padding: 6px 12px; font-size: 0.82rem;">Tarif Ansehen ↗</a>` : '<span style="font-size: 0.75rem; color: var(--rose-heart);">⚠️ Vor Abfahrt im Smartphone-Menü prüfen</span>'}
        </div>
      </div>
    `).join('');
  }

  // 📍 GPS Proximity Calculation (Haversine Formula)
  findNearbySpots() {
    const outputBtn = document.getElementById('gpsLocateBtn');
    if (!navigator.geolocation) {
      alert('GPS-Standortbestimmung wird von deinem Browser nicht unterstützt.');
      return;
    }

    if (outputBtn) outputBtn.textContent = '📡 GPS-Standort wird ermittelt...';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        this.calculateDistances(userLat, userLng);
        if (outputBtn) outputBtn.textContent = '📍 Standorte nach Nähe sortiert!';
        if (window.stripeManager) {
          window.stripeManager.showToast(`📍 GPS aktiv! Gefundene Spots in deiner Nähe berechnet.`);
        }
      },
      (err) => {
        // Fallback Simulation for Lisbon Downtown (Rossio: 38.7138, -9.1394)
        console.warn('GPS denied or unavailable, using Lisbon City Center reference:', err.message);
        this.calculateDistances(38.7138, -9.1394);
        if (outputBtn) outputBtn.textContent = '📍 Berechnet (Referenz: Lissabon Zentrum)';
        if (window.stripeManager) {
          window.stripeManager.showToast('📍 Referenz-Standort: Lissabon Zentrum geladen.');
        }
      },
      { timeout: 6000 }
    );
  }

  calculateDistances(lat1, lon1) {
    const spotsWithDistance = this.knownSpots.map(s => {
      const d = this.haversineDistance(lat1, lon1, s.lat, s.lng);
      return { ...s, distanceKm: d };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    const container = document.getElementById('nearbySpotsList');
    if (container) {
      container.innerHTML = spotsWithDistance.map(s => `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-line); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #FFF; font-size: 0.95rem;">${s.name}</strong>
          </div>
          <div>
            <span class="badge badge-emerald">
              ${s.distanceKm < 1 ? `${Math.round(s.distanceKm * 1000)} m` : `${s.distanceKm.toFixed(1)} km`}
            </span>
          </div>
        </div>
      `).join('');
    }
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 🔏 Partner QR-Code & Foto Check-In Simulation
  simulatePartnerCheckin() {
    const spotName = prompt('An welchem Spot bist du gerade zum Check-In?', 'Tasca O Galo (Alfama) oder Praia da Ursa');
    if (!spotName) return;

    const stampId = `stamp_${Date.now()}`;
    const newStamp = {
      id: stampId,
      title: `${spotName.toUpperCase()} SEAL`,
      date: new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
      color: '#F59E0B',
      icon: '⚜️',
      status: 'VERIFIED LOCAL CHECK-IN'
    };

    if (window.scratchPassport) {
      window.scratchPassport.stamps.push(newStamp);
      localStorage.setItem('scratch_user_stamps', JSON.stringify(window.scratchPassport.stamps));
      window.scratchPassport.renderStamps();
    }

    if (window.stripeManager) {
      window.stripeManager.showToast(`🔏 Check-In erfolgreich! Gold-Siegel für "${spotName}" in deinen Reisepass gestempelt.`);
    }
  }
}

window.hazardSimEngine = new HazardSimEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.hazardSimEngine.renderHazardAlerts();
  window.hazardSimEngine.renderInternetGuide();
});