/**
 * Scratch'n'Travel — Family & Pet Travel Engine v2.1
 * Comprehensive Airline Database (Allowed vs. Prohibited), Checklists & Transport Calculator
 */

const AIRLINE_PET_RULES = {
  lufthansa: {
    name: 'Lufthansa',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 60,
    cargoFeeEur: 150,
    allowed: true,
    cargoAllowed: true,
    notes: 'Max. 8 kg inkl. Tasche in der Kabine. Weiche, wasserdichte Tasche unter dem Vordersitz. EU-Heimtierausweis + Tollwutimpfung Pflicht.'
  },
  eurowings: {
    name: 'Eurowings',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 0,
    allowed: true,
    cargoAllowed: false,
    notes: 'Hunde & Katzen bis 8 kg in der Kabine auf Kurz-/Mittelstrecke. Achtung: Kein Transport im Frachtraum möglich!'
  },
  swiss: {
    name: 'Swiss International Air Lines',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 60,
    cargoFeeEur: 160,
    allowed: true,
    cargoAllowed: true,
    notes: 'Hunde & Katzen bis 8 kg in Kabine. Größere Tiere im klimatisierten Frachtraum (AVIH) mit IATA-zertifizierter Hartschalenbox.'
  },
  austrian: {
    name: 'Austrian Airlines',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 23 cm',
    cabinFeeEur: 60,
    cargoFeeEur: 150,
    allowed: true,
    cargoAllowed: true,
    notes: 'Gleiche Standards wie Lufthansa Group. Voranmeldung min. 72h vor Abflug dringend empfohlen (begrenzte Tierplätze pro Flug).'
  },
  airfrance: {
    name: 'Air France / KLM',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '46 x 28 x 24 cm',
    cabinFeeEur: 70,
    cargoFeeEur: 200,
    allowed: true,
    cargoAllowed: true,
    notes: 'Kabine bis 8 kg erlaubt (weiche Tasche). Im Frachtraum bis 75 kg (Tier + Box). Feste Box mit Metallschrauben Pflicht.'
  },
  tap: {
    name: 'TAP Air Portugal',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '45 x 30 x 23 cm',
    cabinFeeEur: 40,
    cargoFeeEur: 120,
    allowed: true,
    cargoAllowed: true,
    notes: 'Sehr tierfreundlich auf Flügen nach Lissabon, Faro & Porto. Voranmeldung erforderlich.'
  },
  iberia: {
    name: 'Iberia',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '45 x 35 x 25 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 140,
    allowed: true,
    cargoAllowed: true,
    notes: 'Muss die gesamte Flugdauer in der geschlossenen Transporttasche unter dem Vordersitz bleiben.'
  },
  vueling: {
    name: 'Vueling',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '45 x 35 x 25 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 0,
    allowed: true,
    cargoAllowed: false,
    notes: 'Nur Kabine bis 8 kg möglich! Kein Frachtraum-Transport für größere Hunde.'
  },
  condor: {
    name: 'Condor',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 20 cm',
    cabinFeeEur: 60,
    cargoFeeEur: 150,
    allowed: true,
    cargoAllowed: true,
    notes: 'Beliebt für Urlaubsflüge. Anmeldung bis spätestens 48 Stunden vor Abflug nötig.'
  },
  tuifly: {
    name: 'TUI fly',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '55 x 40 x 20 cm',
    cabinFeeEur: 50,
    cargoFeeEur: 130,
    allowed: true,
    cargoAllowed: true,
    notes: 'Kabine bis 8 kg, Frachtraum bis max. 30 kg Gesamtgewicht.'
  },
  turkish: {
    name: 'Turkish Airlines',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '40 x 30 x 23 cm',
    cabinFeeEur: 45,
    cargoFeeEur: 110,
    allowed: true,
    cargoAllowed: true,
    notes: 'Hunde & Katzen bis 8 kg in Kabine. Impfzertifikate müssen min. 30 Tage vor Abflug gültig sein.'
  },
  norwegian: {
    name: 'Norwegian',
    cabinWeightMaxKg: 8,
    maxCarrierDimensionsCm: '43 x 31 x 20 cm',
    cabinFeeEur: 55,
    cargoFeeEur: 90,
    allowed: true,
    cargoAllowed: true,
    notes: 'Haustiere in der Kabine nur auf Flügen innerhalb des Schengen-Raums gestattet.'
  },
  emirates: {
    name: 'Emirates',
    cabinWeightMaxKg: 0,
    maxCarrierDimensionsCm: 'N/A',
    cabinFeeEur: 0,
    cargoFeeEur: 350,
    allowed: false,
    cargoAllowed: true,
    notes: '⚠️ KEINE Haustiere in der Passagierkabine gestattet (außer Blindenhunde). Hunde reisen ausschließlich als Übergepäck im klimatisierten Frachtraum (ab 350 €).'
  },
  ryanair: {
    name: 'Ryanair',
    cabinWeightMaxKg: 0,
    maxCarrierDimensionsCm: 'N/A',
    cabinFeeEur: 0,
    cargoFeeEur: 0,
    allowed: false,
    cargoAllowed: false,
    notes: '❌ STRIKT VERBOTEN: Ryanair befördert grundsätzlich KEINE Tiere — weder in der Kabine noch im Frachtraum (einzige Ausnahme: zertifizierte Blinden-/Assistenzhunde auf bestimmten Routen).'
  },
  easyjet: {
    name: 'EasyJet',
    cabinWeightMaxKg: 0,
    maxCarrierDimensionsCm: 'N/A',
    cabinFeeEur: 0,
    cargoFeeEur: 0,
    allowed: false,
    cargoAllowed: false,
    notes: '❌ STRIKT VERBOTEN: EasyJet erlaubt keinerlei Haustiere an Bord oder im Frachtraum (nur Blinden- und Signalhunde mit Ausweis).'
  },
  wizzair: {
    name: 'Wizz Air',
    cabinWeightMaxKg: 0,
    maxCarrierDimensionsCm: 'N/A',
    cabinFeeEur: 0,
    cargoFeeEur: 0,
    allowed: false,
    cargoAllowed: false,
    notes: '❌ STRIKT VERBOTEN: Keine Mitnahme von Haustieren jeglicher Art gestattet (außer anerkannte Assistenzhunde).'
  }
};

const DEFAULT_FAMILY_CHECKLIST = [
  { id: 'f1', text: 'Kinderpässe / Ausweise aller Kinder (Gültigkeit prüfen)', essential: true },
  { id: 'f2', text: 'Kinder-Reiseapotheke (Fiebersaft, Pflaster, Elektrolyte, Mückenspray)', essential: true },
  { id: 'f3', text: 'Kompakter Reisebuggy (geprüft für Handgepäck / Flugzeugtür)', essential: false },
  { id: 'f4', text: 'Lieblingsspielzeug / Malbuch gegen Reiseunruhe', essential: false },
  { id: 'f5', text: 'Auslaufsichere Trinkflaschen & Snack-Boxen', essential: true },
  { id: 'f6', text: 'Sonnencreme (LSF 50+ Kids) & UV-Schutz-Shirts', essential: true },
  { id: 'f7', text: 'Notfall-Armband für Kinder mit Eltern-Handynummer (+49...)', essential: true }
];

const DEFAULT_PET_CHECKLIST = [
  { id: 'p1', text: 'EU-Heimtierausweis mit gültiger Tollwutimpfung (min. 21 Tage alt)', essential: true },
  { id: 'p2', text: 'ISO-Mikrochip (registriert bei Tasso / Findefix)', essential: true },
  { id: 'p3', text: 'Flug-zertifizierte Soft-Tasche (wasserdicht, belüftet, max. 55x40x23cm)', essential: true },
  { id: 'p4', text: 'Faltbarer Silikon-Wassernapf & Trockenfutter-Rationen', essential: true },
  { id: 'p5', text: 'Hundeleine, Geschirr & Maulkorb (Pflicht in manchen EU-ÖPNVs)', essential: true },
  { id: 'p6', text: 'Kotbeutel-Rolle & Telefonnummer des Notfall-Tierarztes am Zielort', essential: true },
  { id: 'p7', text: 'Reiseapotheke für Hunde (Zeckenzange, Wundspray, Pfotenschutzbalsam)', essential: false }
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
    
    // Strict Prohibitions (Ryanair, EasyJet, Wizz Air)
    if (!airline.allowed && !airline.cargoAllowed) {
      return {
        allowed: false,
        cabin: false,
        cargo: false,
        fee: 0,
        reason: `❌ Bei ${airline.name} sind Haustiere GRUNDSÄTZLICH VERBOTEN. Keine Mitnahme in der Kabine oder im Frachtraum möglich (außer Blindenhunde).`
      };
    }

    // Cargo Only Airlines (Emirates)
    if (!airline.allowed && airline.cargoAllowed) {
      return {
        allowed: true,
        cabin: false,
        cargo: true,
        fee: airline.cargoFeeEur,
        message: `⚠️ ${airline.name} erlaubt KEINE Haustiere in der Passagierkabine. Dein Tier muss im klimatisierten Frachtraum (Cargo) transportiert werden (ab ca. ${airline.cargoFeeEur} €).`
      };
    }

    // Cabin Allowed
    if (totalWeight <= airline.cabinWeightMaxKg) {
      return {
        allowed: true,
        cabin: true,
        cargo: airline.cargoAllowed,
        fee: airline.cabinFeeEur,
        carrierMax: airline.maxCarrierDimensionsCm,
        message: `✅ Passt in die Kabine bei ${airline.name}! Gesamtgewicht: ${totalWeight.toFixed(1)} kg (Max. ${airline.cabinWeightMaxKg} kg). Gebühr: ca. ${airline.cabinFeeEur} €. ${airline.notes}`
      };
    } else {
      // Overweight for cabin
      if (airline.cargoAllowed) {
        return {
          allowed: true,
          cabin: false,
          cargo: true,
          fee: airline.cargoFeeEur,
          message: `⚠️ Zu schwer für die Kabine (${totalWeight.toFixed(1)} kg > Max. ${airline.cabinWeightMaxKg} kg). Muss im beheizten Frachtraum (Cargo/AVIH) in IATA-Box fliegen. Gebühr: ca. ${airline.cargoFeeEur} €.`
        };
      } else {
        return {
          allowed: false,
          cabin: false,
          cargo: false,
          reason: `⚠️ Zu schwer für die Kabine (${totalWeight.toFixed(1)} kg > Max. ${airline.cabinWeightMaxKg} kg) und ${airline.name} bietet KEINEN Frachtraum-Transport an.`
        };
      }
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