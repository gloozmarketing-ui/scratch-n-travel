/**
 * Scratch'n'Travel — Family & Pet Travel Engine
 * Manages Dynamic Checklists, Airline Pet Cargo/Cabin Rule Lookup & Pet Passport Guidelines
 */

const AIRLINE_PET_RULES = {
  lufthansa: {
    name: 'Lufthansa',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 60,
    cargoFeeEur: 150,
    notes: 'Max. 8 kg incl. Bag in Cabin. Pet Passport + Microchip mandatory. Soft carrier required.'
  },
  eurowings: {
    name: 'Eurowings',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 120,
    notes: 'Dogs & cats up to 8 kg in cabin on short/medium haul. Soft-sided waterproof carrier.'
  },
  iberia: {
    name: 'Iberia / Vueling',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '45 x 35 x 25 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 140,
    notes: 'Must remain inside approved carrier under front seat during entire flight.'
  },
  airfrance: {
    name: 'Air France',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '46 x 28 x 24 cm',
    cabinFeeEur: 70,
    cargoFeeEur: 200,
    notes: 'Cabin allowed up to 8 kg. Hard container or rigid bag mandatory for cargo.'
  },
  ryanair: {
    name: 'Ryanair',
    cabinWeightMaxKg: 0,
    maxCarrierDimensionsCm: 'N/A',
    cabinFeeEur: 0,
    cargoFeeEur: 0,
    notes: '⚠️ Ryanair does NOT accept pets in cabin or hold (except certified Assistance/Guide Dogs).'
  }
};

const DEFAULT_FAMILY_CHECKLIST = [
  { id: 'f1', text: 'Kinderpässe / Ausweise aller Kinder', essential: true },
  { id: 'f2', text: 'Kinder-Reiseapotheke (Fiebersaft, Pflaster, Elektrolyte)', essential: true },
  { id: 'f3', text: 'Reisebuggy / Kinderwagen (Zulassung bis Flugzeugtür)', essential: false },
  { id: 'f4', text: 'Lieblingsspielzeug / Kuscheltier gegen Heimweh', essential: false },
  { id: 'f5', text: 'Snack-Box & auslaufsichere Trinkflaschen', essential: true },
  { id: 'f6', text: 'Sonnencreme (LSF 50+) & UV-Schutzkleidung', essential: true },
  { id: 'f7', text: 'Feuchttücher & Desinfektionsspray', essential: true }
];

const DEFAULT_PET_CHECKLIST = [
  { id: 'p1', text: 'EU-Heimtierausweis mit gültiger Tollwutimpfung (min. 21 Tage alt)', essential: true },
  { id: 'p2', text: 'ISO-Mikrochip (vor oder zeitgleich mit Tollwutimpfung)', essential: true },
  { id: 'p3', text: 'Flug-Transporttasche / Box (wasserdicht, belüftet)', essential: true },
  { id: 'p4', text: 'Faltbarer Wassernapf & Trockenfutter-Portionen', essential: true },
  { id: 'p5', text: 'Hundeleine, Geschirr & Maulkorb (Pflicht in manchen ÖPNV)', essential: true },
  { id: 'p6', text: 'Kotbeutel-Rolle & Notfall-Tierarzt-Nummer am Zielort', essential: true },
  { id: 'p7', text: 'Reiseapotheke für Hunde (Zeckenzange, Wundspray, Beruhigungstropfen)', essential: false }
];

class FamilyPetEngine {
  constructor() {
    this.familyItems = JSON.parse(localStorage.getItem('scratch_family_check')) || DEFAULT_FAMILY_CHECKLIST;
    this.petItems = JSON.parse(localStorage.getItem('scratch_pet_check')) || DEFAULT_PET_CHECKLIST;
  }

  getAirlineInfo(key) {
    return AIRLINE_PET_RULES[key] || AIRLINE_PET_RULES['lufthansa'];
  }

  evaluatePetTransport(petWeightKg, carrierWeightKg, airlineKey) {
    const airline = this.getAirlineInfo(airlineKey);
    const totalWeight = petWeightKg + carrierWeightKg;
    
    if (airline.cabinWeightMaxKg === 0) {
      return {
        allowed: false,
        cabin: false,
        reason: `${airline.name} nimmt generell keine Haustiere an Bord oder im Frachtraum mit (außer Assistenzhunde).`
      };
    }

    if (totalWeight <= airline.cabinWeightMaxKg) {
      return {
        allowed: true,
        cabin: true,
        fee: airline.cabinFeeEur,
        carrierMax: airline.maxCarrierDimensionsCm,
        message: `✅ Passt in die Kabine bei ${airline.name}! Gesamtgewicht: ${totalWeight} kg (Max. ${airline.cabinWeightMaxKg} kg). Gebühr: ca. ${airline.cabinFeeEur} €.`
      };
    } else {
      return {
        allowed: true,
        cabin: false,
        fee: airline.cargoFeeEur,
        message: `⚠️ Zu schwer für die Kabine (${totalWeight} kg > Max. ${airline.cabinWeightMaxKg} kg). Muss im beheizten Frachtraum (Cargo) fliegen. Gebühr: ca. ${airline.cargoFeeEur} €.`
      };
    }
  }

  renderChecklist(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
      <label class="checklist-item ${item.checked ? 'checked' : ''}" onclick="window.familyPetEngine.toggleItem('${type}', '${item.id}')">
        <input type="checkbox" ${item.checked ? 'checked' : ''}>
        <span>${item.essential ? '⭐ ' : ''}${item.text}</span>
      </label>
    `).join('');
  }

  toggleItem(type, id) {
    const list = type === 'family' ? this.familyItems : this.petItems;
    const item = list.find(i => i.id === id);
    if (item) {
      item.checked = !item.checked;
      localStorage.setItem(`scratch_${type}_check`, JSON.stringify(list));
      this.renderChecklist(type === 'family' ? 'family-checklist-box' : 'pet-checklist-box', list, type);
    }
  }
}

window.familyPetEngine = new FamilyPetEngine();
