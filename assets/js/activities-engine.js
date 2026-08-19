/**
 * Scratch'n'Travel — Activities & Extreme Sports Hub v2.1
 * Rich photography, multi-category filters & local verified spots
 */

const ACTIVITIES_DATA = [
  // 1. Extreme & Adrenaline
  {
    id: 'act_nazare_surf',
    category: 'extreme',
    badge: '⚡ Big Wave Adrenalin',
    title: 'Nazaré Giant Wave Surf & Cliff Watch',
    location: 'Praia do Norte, Nazaré (1h von Lissabon)',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    intensity: 'EXTREM (Bis 30m Wellen im Winter)',
    duration: 'Tagesausflug',
    description: 'Erlebe die mächtigsten Monsterwellen des Planeten am berühmten Leuchtturm-Felsen. Im Sommer ideal für Surfcamps & Klippenwanderungen.',
    localTip: 'Der beste Blick ohne Gedränge ist 200m oberhalb des Farol da Nazaré am Pinienhang.',
    priceEstimate: 'Kostenlos zum Zuschauen • Surfkurs ab 45 €'
  },
  {
    id: 'act_berlengas_diving',
    category: 'extreme',
    badge: '🤿 Biosphären-Tauchen',
    title: 'Berlengas Archipel: Schiffswracks & Höhlentauchen',
    location: 'Peniche Hafen (Schnellboot-Überfahrt)',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    intensity: 'MITTEL BIS HOCH',
    duration: '5–6 Stunden',
    description: 'UNESCO-Biosphärenreservat mit glasklarem Atlantikwasser, versunkenen Dampfschiffen und spektakulären Unterwasser-Höhlensystemen.',
    localTip: 'Fähre unbedingt 3 Tage im Voraus buchen, da max. 550 Besucher pro Tag auf die Insel dürfen.',
    priceEstimate: 'Bootstransfer ca. 25 € • 2 Tauchgänge ab 85 €'
  },

  // 2. Family & Kids
  {
    id: 'act_arrabida_kayak',
    category: 'family',
    badge: '👶 Familien-Paradies',
    title: 'Portinho da Arrábida: Kristallklares Flachwasser & Kajak',
    location: 'Naturpark Serra da Arrábida (40 Min. von Lissabon)',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    intensity: 'SANFT & SICHER',
    duration: 'Halbtags',
    description: 'Windgeschützte Traumbucht mit türkisfarbenem Wasser ohne gefährliche Strömungen. Perfekt für Kleinkinder, Schwimmanfänger und Familien-Kajaks.',
    localTip: 'Zwischen 10:00 und 17:00 Uhr ist die Zufahrt für private Autos gesperrt. Nutze den kostenlosen Shuttlebus ab Parkplatz Secil.',
    priceEstimate: 'Kostenlos • Doppel-Kajak 15 €/h'
  },
  {
    id: 'act_estrela_park',
    category: 'family',
    badge: '👶 Stufenfrei mit Buggy',
    title: 'Jardim da Estrela: Schattige Oase & Riesenspielplatz',
    location: 'Estrela, Lissabon (Endstation Tram 28)',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    intensity: 'ENTSPANNT',
    duration: '2–3 Stunden',
    description: '150 Jahre alter botanischer Park mit uralten Mammutbäumen, Ententeich, tollem Kletterspielplatz und kinderfreundlichem Kioskcafé.',
    localTip: 'Direkt gegenüber liegt die Basilika da Estrela — der Aufstieg auf die Kuppel belohnt mit Rundumblick über die Stadt.',
    priceEstimate: 'Eintritt frei'
  },

  // 3. Pets & Dogs
  {
    id: 'act_ursa_dog_beach',
    category: 'pets',
    badge: '🐶 Hundestrand & Klippen',
    title: 'Praia da Ursa: Naturbelassene Hundefreiheit',
    location: 'Sintra Küste (Nähe Cabo da Roca)',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    intensity: 'SPORTLICHER ABSTIEG',
    duration: 'Halbtags',
    description: 'Einer der schönsten Strände Europas. Da kein offizieller Badebetrieb herrscht, dürfen Hunde hier das ganze Jahr frei laufen und im Sand toben.',
    localTip: 'Festes Schuhwerk für den 15-minütigen Klippenpfad anziehen und ausreichend Trinkwasser für den Vierbeiner mitnehmen.',
    priceEstimate: 'Kostenlos'
  },
  {
    id: 'act_monsanto_forest',
    category: 'pets',
    badge: '🐶 Schattiger Pinienwald',
    title: 'Parque de Monsanto: Grüner Auslauf & Panoramablick',
    location: 'Monsanto Waldpark, Lissabon',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    intensity: 'LEICHT',
    duration: '1–2 Stunden',
    description: 'Die grüne Lunge Lissabons. Weitläufige schattige Wege, Hundespielwiesen und das verlassene Panorâmico de Monsanto mit 360-Grad-Blick.',
    localTip: 'Perfekt für die heißen Mittagsstunden, da die dichten Pinienkronen die Temperatur um 5°C senken.',
    priceEstimate: 'Kostenlos'
  },

  // 4. Culture & Culinary
  {
    id: 'act_alfama_cooking',
    category: 'culture',
    badge: '🍲 Kulinarischer Geheimtipp',
    title: 'Pastéis de Nata & Caldo Verde Meisterklasse bei Maria',
    location: 'Gassen von Alfama',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    intensity: 'GEMÜTLICH',
    duration: '2.5 Stunden',
    description: 'Backe in einer traditionellen Kiez-Bäckerei echte, knusprige Pastéis de Nata nach einem 100 Jahre alten Familienrezept.',
    localTip: 'Der Teig wird mit echtem Zimt aus Sri Lanka und Bio-Zitronenabrieb parfümiert — schmeckt noch warm am besten!',
    priceEstimate: '35 € inkl. Verkostung & Wein'
  },

  // 5. Romance & Sunset
  {
    id: 'act_senhora_sunset',
    category: 'romance',
    badge: '🌅 Romantik & Sonnenuntergang',
    title: 'Miradouro da Senhora do Monte: Akustik & Goldene Stunde',
    location: 'Graça, Lissabon',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    intensity: 'MAGISCH',
    duration: '1.5 Stunden',
    description: 'Der höchste Aussichtspunkt Lissabons. Bringe eine Decke und ein Glas Wein mit, um den Sonnenuntergang über dem Tejo zu erleben.',
    localTip: 'Lokale Fado-Musiker spielen hier oft spontane Akustik-Sessions.',
    priceEstimate: 'Kostenlos'
  }
];

class ActivitiesEngineV2 {
  constructor() {
    this.activities = ACTIVITIES_DATA;
    this.currentFilter = 'all';
  }

  setFilter(filterKey) {
    this.currentFilter = filterKey;
    document.querySelectorAll('.act-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-act-filter') === filterKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderActivities();
  }

  renderActivities(containerId = 'activitiesGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = this.activities;
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(a => a.category === this.currentFilter);
    }

    container.innerHTML = filtered.map(a => `
      <div class="glass-card activity-card">
        <div class="activity-img-wrap">
          <img src="${a.image}" alt="${a.title}" class="activity-img" loading="lazy">
          <span class="activity-badge-overlay">${a.badge}</span>
        </div>
        <div class="activity-content">
          <h3 class="activity-title">${a.title}</h3>
          <p class="activity-location">📍 ${a.location}</p>
          <p class="activity-desc">${a.description}</p>
          
          <div class="activity-tip-box">
            <strong>💡 Local-Tipp:</strong> ${a.localTip}
          </div>

          <div class="activity-footer">
            <span class="activity-intensity">⚡ ${a.intensity}</span>
            <span class="activity-price">${a.priceEstimate}</span>
          </div>

          <button class="btn btn-secondary" style="width: 100%; margin-top: 12px; font-size: 0.82rem;" onclick="window.scratchPassport.scratchVisitedSpot('${a.title}', '${a.location}', '🏄‍♂️')">
            Als Besucht Markieren & Freirubbeln 🔏
          </button>
        </div>
      </div>
    `).join('');
  }
}

window.activitiesEngine = new ActivitiesEngineV2();

document.addEventListener('DOMContentLoaded', () => {
  window.activitiesEngine.renderActivities();
  document.querySelectorAll('.act-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.activitiesEngine.setFilter(btn.getAttribute('data-act-filter'));
    });
  });
});