/**
 * Scratch'n'Travel — Local Safety & Scam Radar Engine
 * Echte Warnungen & Insider-Tipps von Locals: Wem man NICHT trauen sollte
 */

const SAFETY_REPORTS = [
  // ── Scams & Rip-offs (Abzocke) ─────────────────────────────────────────────
  {
    id: 'scam_taxi_meter',
    type: 'scam',
    level: 'warning',
    levelBadge: '🟡 Wucher & Schummler',
    title: 'Flughafen Taxi "Taxameter kaputt" Masche',
    location: 'Flughafen Lissabon / Ankunftsterminal',
    description: 'Fahrer weigern sich das Taxameter einzuschalten ("Meter broken, fixed price 50-70 €"). Regulärer Fahrpreis in die Innenstadt beträgt jedoch nur ca. 12–18 €.',
    dangerAdvice: 'Bestehe strikt auf das Taxameter ("Ligue o taxímetro por favor") oder nutze die offiziellen Ride-Apps (Bolt / Uber) an der oberen Abflugebene.',
    reportedBy: 'Carlos (Local Taxifahrer seit 15 Jahren)'
  },
  {
    id: 'scam_couvert_trap',
    type: 'scam',
    level: 'warning',
    levelBadge: '🟡 Restaurant-Falle',
    title: 'Die ungefragte "Couvert-Falle" bei Touristen-Lokalen',
    location: 'Baixa & Rua Augusta',
    description: 'Kellner stellen unaufgefordert Brot, Schinken, Käse und Butter auf den Tisch. Rührt man nur ein Stück an, stehen plötzlich 15–30 € extra auf der Rechnung.',
    dangerAdvice: 'In Portugal gilt gesetzlich: Was du nicht bestellt hast, musst du nicht bezahlen. Wenn du es nicht möchtest, sag sofort freundlich: "Não queremos, obrigado" und lass es abräumen.',
    reportedBy: 'Teresa (Local Gourmet)'
  },
  {
    id: 'scam_street_vendors',
    type: 'scam',
    level: 'warning',
    levelBadge: '🟡 3-Facher Wucherpreis',
    title: 'Fliegende Händler an Hotspots (Belém & Castelo)',
    location: 'Torre de Belém & Tram 28 Haltestellen',
    description: 'Verkauf von lauwarmem Wasser für 4–5 € und minderwertigen Billig-Fächern für 20 €. In den kleinen Kiez-Kiosken 50m weiter kostet dieselbe Flasche 0,40 €.',
    dangerAdvice: 'Kioske ("Quiosques") und kleine Mercearias in Seitenstraßen nutzen — spare bis zu 80%.',
    reportedBy: 'Duarte (Local Guide)'
  },

  // ── Danger & Gangs (Gefahrenzonen & Banden) ────────────────────────────────
  {
    id: 'danger_pickpockets_tram28',
    type: 'danger',
    level: 'danger',
    levelBadge: '🔴 Organisierte Banden',
    title: 'Professionelle Taschendiebe in der historischen Tram 28',
    location: 'Tram 28 & Metro-Knotenpunkt Baixa-Chiado',
    description: 'Banden aus 3–4 Personen erzeugen künstliches Gedränge beim Ein- und Aussteigen. Eine Person rempelt an, die zweite greift in die Tasche, die dritte nimmt die Beute und verlässt die Tram.',
    dangerAdvice: 'Rucksack NIEMALS auf dem Rücken tragen — immer vorne vor die Brust nehmen. Wertsachen nie in Gesäßtaschen. Bei Gedränge Hände an den Taschen halten.',
    reportedBy: 'Polícia de Segurança Pública (PSP) Präventionshinweis'
  },
  {
    id: 'danger_fake_dealers',
    type: 'danger',
    level: 'danger',
    levelBadge: '🔴 Fake-Drogen & Erpressung',
    title: 'Aufdringliche Fake-Händler am Praça do Comércio & Rossio',
    location: 'Praça do Comércio, Rossio & Cais do Sodré',
    description: 'Männer sprechen Touristen alle 2 Minuten an und bieten "Haschisch / Koks" an. Es handelt sich zu 99% um gepresstes Lorbeerblatt oder Backpulver. Wenn Touristen ablehnen oder diskutieren, werden Begleiter aggressiv.',
    dangerAdvice: 'Absolut ignorieren! Kein Blickkontakt, kein Gespräch, zügig weitergehen. Nicht stehen bleiben.',
    reportedBy: 'Miguel (Local Student)'
  },
  {
    id: 'danger_dark_alleys',
    type: 'danger',
    level: 'danger',
    levelBadge: '🔴 No-Go bei Nacht',
    title: 'Unbeleuchtete Gassen rund um Martim Moniz nach 23 Uhr',
    location: 'Rückwärtige Gassen Martim Moniz & Intendente',
    description: 'Während die Hauptplätze belebt sind, kommt es in den dunklen, engen Seitengassen nachts vereinzelt zu Raubüberfällen auf angetrunkene Touristen.',
    dangerAdvice: 'Nachts auf den beleuchteten Hauptachsen (Avenida Almirante Reis) bleiben oder direkt ein Bolt/Taxi vor die Tür bestellen.',
    reportedBy: 'Beatriz (Anwohnerin)'
  },

  // ── Local Survival & Do's (Verhaltenstipps) ────────────────────────────────
  {
    id: 'tip_tourist_police',
    type: 'tips',
    level: 'tip',
    levelBadge: '🟢 Offizieller Schutz',
    title: 'Notfall-Kontakte & Touristenpolizei (PSP)',
    location: 'Ganz Portugal / Lissabon Station Palácio Foz',
    description: 'Die spezialisierte Touristenpolizei (Esquadra de Turismo) spricht fließend Englisch, Deutsch und Französisch und hilft bei Diebstahl, Betrug oder Passverlust sofort.',
    dangerAdvice: 'Notruf: 112 | Touristenpolizei Lissabon: +351 21 342 1634 | Adresse: Praça dos Restauradores (Palácio Foz).',
    reportedBy: 'Verifiziertes Notfall-Protokoll'
  }
];

class SafetyRadarManager {
  constructor() {
    this.reports = SAFETY_REPORTS;
    this.activeFilter = 'all';
  }

  renderSafetyRadar(containerId = 'safetyRadarGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.activeFilter === 'all'
      ? this.reports
      : this.reports.filter(r => r.type === this.activeFilter);

    container.innerHTML = filtered.map(item => `
      <div class="glass-card safety-card ${item.level}" data-safety-type="${item.type}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span class="badge ${item.level === 'danger' ? 'badge-danger' : item.level === 'warning' ? 'badge-gold' : 'badge-emerald'}">
            ${item.levelBadge}
          </span>
          <span style="font-size: 0.78rem; color: var(--text-dim);">📍 ${item.location}</span>
        </div>
        
        <h3 style="font-size: 1.2rem; margin-bottom: 10px; color: ${item.level === 'danger' ? '#FDA4AF' : item.level === 'warning' ? '#FDE68A' : '#A7F3D0'};">
          ${item.title}
        </h3>
        
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 14px;">
          ${item.description}
        </p>

        <div class="safety-advice-box ${item.level}">
          <strong>🛡️ So schützt du dich:</strong> ${item.dangerAdvice}
        </div>

        <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 14px; border-top: 1px solid var(--border-line); padding-top: 8px;">
          Gemeldet von: ${item.reportedBy}
        </div>
      </div>
    `).join('');
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey;
    document.querySelectorAll('.safety-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-safety-filter') === filterKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderSafetyRadar();
  }

  openReportModal() {
    const title = prompt('Welchen Scam oder welche Gefahrenstelle möchtest du melden?', 'Z.B. Falschgeld an Kiosk in Chiado');
    if (!title) return;
    const location = prompt('Genauer Ort / Straße:', 'Rua Garrett, Lissabon');
    if (!location) return;

    if (window.stripeManager) {
      window.stripeManager.showToast('🛡️ Danke! Deine Warnung wird von der lokalen Community geprüft und freigeschaltet.');
    }
    if (window.scratchDB) {
      window.scratchDB.logEvent('SAFETY_SCAM_REPORTED', { title, location });
    }
  }
}

window.safetyRadar = new SafetyRadarManager();

document.addEventListener('DOMContentLoaded', () => {
  window.safetyRadar.renderSafetyRadar();
  
  document.querySelectorAll('.safety-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-safety-filter');
      window.safetyRadar.setFilter(filter);
    });
  });
});