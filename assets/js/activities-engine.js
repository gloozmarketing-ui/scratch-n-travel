/**
 * Scratch'n'Travel — Activities Engine (Family, Pets, Extreme Adrenaline & Culture)
 * Features High Quality Photography, Filters & Adventure Level Metrics
 */

const ACTIVITIES_DATA = [
  // ── Extreme & Adrenaline ───────────────────────────────────────────────────
  {
    id: 'act_surf_nazare',
    category: 'extreme',
    title: 'Big Wave Surf & Klippenblick Nazaré',
    location: 'Nazaré & Peniche, Portugal',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80',
    intensity: 'Extreme (Adrenalin 10/10)',
    badge: '⚡ Profi & Zuschauer Hotspot',
    tags: ['Surf', 'Big Wave', 'Atlantik', 'Klippen'],
    description: 'Erlebe die berühmteste Riesenwelle der Welt am Leuchtturm Farol da Nazaré oder buche geführte Surf-Sessions an den Weltklasse-Breaks von Peniche.',
    localTip: 'Tiago (Surflehrer): "Die besten Wellen für Fortgeschrittene gibt es morgens bei ablaufendem Wasser bei Supertubos."'
  },
  {
    id: 'act_diving_berlengas',
    category: 'extreme',
    title: 'Scuba Diving im Berlengas UNESCO-Biosphärenreservat',
    location: 'Archipel Berlengas, Portugal',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    intensity: 'Fortgeschritten / Taucher',
    badge: '🤿 Wrack- & Höhlentauchen',
    tags: ['Scuba', 'Unterwasserhöhlen', 'Schiffswrack', 'Delfine'],
    description: 'Glasklares Wasser bis zu 20m Sichtweite. Erkunde Unterwasserhöhlen, historische Schiffswracks und Begegnungen mit Rochen und Mondfischen.',
    localTip: 'Manuel (Tauchguide): "Ein 7mm Neoprenanzug ist Pflicht — die Strömungen sind kräftig, aber die Sicht unschlagbar."'
  },
  {
    id: 'act_paragliding_sintra',
    category: 'extreme',
    title: 'Klippen-Paragliding & Skydiving Sintra-Küste',
    location: 'Praia das Maçãs / Sintra',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=900&q=80',
    intensity: 'High Adrenalin (Höhe 400m)',
    badge: '🪂 Tandem & Solo Flug',
    tags: ['Paragliding', 'Küstenwind', 'Klippen', 'Aussicht'],
    description: 'Segle im thermischen Küstenaufwind über die Steilküste des Cabo da Roca — dem westlichsten Punkt des europäischen Festlands.',
    localTip: 'Sofia (Pilotin): "Perfekte Startbedingungen von 15 bis 18 Uhr bei thermischem Nordwest-Wind."'
  },

  // ── Family & Kids ──────────────────────────────────────────────────────────
  {
    id: 'act_arrabida_kayak',
    category: 'family',
    title: 'Ruhiges Flachwasser-Kajak & Schnorcheln in Arrábida',
    location: 'Naturpark Serra da Arrábida',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    intensity: 'Leicht & Entspannt (Kinder ab 4)',
    badge: '👶 Familien-Traumstrand',
    tags: ['Flachwasser', 'Kajak', 'Feinsand', 'Keine Strömung'],
    description: 'Kristallklares, türkisfarbenes Wasser geschützt vor Wellen durch die Steilwand des Naturparks. Ideal für Kleinkinder, Schwimm-Anfänger und Picknicks.',
    localTip: 'Maria (Local Mama): "Früh vor 10 Uhr anreisen, da die Zufahrtsstraße im Sommer reglementiert wird."'
  },
  {
    id: 'act_estrela_park',
    category: 'family',
    title: 'Jardim da Estrela: Schattiger Schlosspark & Spielparadies',
    location: 'Estrela, Lissabon',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80',
    intensity: 'Sehr leicht (Stufenfrei)',
    badge: '🌿 Kinderwagen-Rampen',
    tags: ['Großer Spielplatz', 'Ententeich', 'Kiosk', 'Schattenbäume'],
    description: 'Uralte Mammutbäume spenden selbst bei 35°C kühlen Schatten. Eingezäunter Kleinkind-Spielbereich und kinderfreundliches Café mit Wickelraum.',
    localTip: 'Duarte: "Der Kiosk backt jeden Morgen frische Mini-Pastéis — perfekt für die Kinderpause."'
  },

  // ── Pets & Dogs ────────────────────────────────────────────────────────────
  {
    id: 'act_ursa_dog_beach',
    category: 'pets',
    title: 'Praia da Ursa: Wilder Hundestrand & Natur-Auslauf',
    location: 'Sintra Küste, Portugal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    intensity: 'Mittel (Natur-Fußweg)',
    badge: '🐶 100% Hundefreundlich',
    tags: ['Freilauf', 'Keine Leinenpflicht außerhalb Saison', 'Großer Sandstrand'],
    description: 'Weitläufige Bucht mit feinem Sand und Frischwasserquellen an den Felsen. Hier können Hunde nach Herzenslust toben und schwimmen.',
    localTip: 'João: "Genug Trinkwasser für den Hund mitnehmen, da es vor Ort keine Kioske gibt."'
  },
  {
    id: 'act_monsanto_trail',
    category: 'pets',
    title: 'Parque de Monsanto: Schattiger Wald-Agility Trail',
    location: 'Monsanto, Lissabon',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
    intensity: 'Leicht bis Mittel',
    badge: '🌲 Freilauf & Agility Zonen',
    tags: ['Pinienwald', 'Trinkbrunnen', 'Eingezäunter Hundepark'],
    description: 'Die grüne Lunge Lissabons. Großzügige, eingezäunte Hundewiesen mit Hindernissen, Trinkstationen und kilometerlangen weichen Waldwegen.',
    localTip: 'Inês: "Der Parkbereich Mata de São Domingos hat die meisten natürlichen Trinkwasserstellen."'
  },

  // ── Culture & Culinary ─────────────────────────────────────────────────────
  {
    id: 'act_pasteis_workshop',
    category: 'culture',
    title: 'Geheimer Pastéis de Nata Meisterkurs bei Maria in Alfama',
    location: 'Alfama Altstadt, Lissabon',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    intensity: 'Genuss & Gemütlichkeit',
    badge: '🍮 Original Familienrezept',
    tags: ['Kochen mit Locals', 'Zimt & Vanille', 'Kinder willkommen'],
    description: 'Lerne in einer traditionellen Altstadt-Küche das 100 Jahre alte Geheimnis des perfekten Blätterteigs und der cremigen Eigelb-Füllung.',
    localTip: 'Maria: "Keine fertigen Teige aus dem Supermarkt — wir rollen noch mit dem Holz-Nudelholz!"'
  }
];

class ActivitiesManager {
  constructor() {
    this.activities = ACTIVITIES_DATA;
    this.activeFilter = 'all';
  }

  renderActivities(containerId = 'activitiesGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.activeFilter === 'all'
      ? this.activities
      : this.activities.filter(a => a.category === this.activeFilter);

    container.innerHTML = filtered.map(item => `
      <div class="glass-card activity-card" data-category="${item.category}">
        <div class="activity-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="activity-img" loading="lazy">
          <span class="activity-badge-overlay">${item.badge}</span>
        </div>
        <div class="activity-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="badge ${item.category === 'extreme' ? 'badge-gold' : item.category === 'family' ? 'badge-cyan' : item.category === 'pets' ? 'badge-emerald' : 'badge-emerald'}">
              ${item.location}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-dim);">${item.intensity}</span>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 8px;">${item.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 14px;">${item.description}</p>
          
          <div style="margin-bottom: 14px;">
            ${item.tags.map(t => `<span class="hobby-tag">${t}</span>`).join('')}
          </div>

          <div style="background: rgba(0,0,0,0.3); border-left: 3px solid var(--emerald-primary); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.82rem; color: #FFF;">
            <strong>💡 Local Insider:</strong> ${item.localTip}
          </div>
        </div>
      </div>
    `).join('');
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey;
    document.querySelectorAll('.act-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-act-filter') === filterKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderActivities();
  }
}

window.activitiesManager = new ActivitiesManager();

document.addEventListener('DOMContentLoaded', () => {
  window.activitiesManager.renderActivities();
  
  document.querySelectorAll('.act-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-act-filter');
      window.activitiesManager.setFilter(filter);
    });
  });
});