/**
 * Scratch'n'Travel — Interactive Checklists for Families & Pets with PDF/Print Export
 */

const FAMILY_CHECKLIST_DATA = [
  {
    category: '🛂 Dokumente & Reisevorbereitung',
    items: [
      { id: 'f_doc_1', text: 'Kinderreisepässe (Gültigkeit min. 6 Monate prüfen)' },
      { id: 'f_doc_2', text: 'Auslandskrankenversicherung & Notfallnummern' },
      { id: 'f_doc_3', text: 'Unterkunftsbuchung mit Babybett-Bestätigung' }
    ]
  },
  {
    category: '🩹 Kinder-Notfallapotheke',
    items: [
      { id: 'f_med_1', text: 'Fieber- & Schmerzsaft (Ibuprofen / Paracetamol)' },
      { id: 'f_med_2', text: 'Elektrolytlösung gegen Dehydration bei Hitze' },
      { id: 'f_med_3', text: 'Kinder-Sonnenschutz LSF 50+ & Insektenschutzspray' },
      { id: 'f_med_4', text: 'Wund- und Brandgel & wasserfeste Pflaster' }
    ]
  },
  {
    category: '🏖️ Strand, Ausflug & Beschäftigung',
    items: [
      { id: 'f_beach_1', text: 'UV-Schutzkleidung & Schwimmhilfen / Schwimmflügel' },
      { id: 'f_beach_2', text: 'Strandmuschel / UV-Sonnenschutzzelt' },
      { id: 'f_beach_3', text: 'Wiederverwendbare Snackboxen & Trinkflaschen' },
      { id: 'f_beach_4', text: 'Kinderwagen mit großen Rädern für Altstadt-Kopfsteinpflaster' }
    ]
  }
];

const PET_CHECKLIST_DATA = [
  {
    category: '🛂 Impfung & Einreise (EU-Heimtierpass)',
    items: [
      { id: 'p_doc_1', text: 'EU-Heimtierausweis mit gültiger Tollwutimpfung (> 21 Tage)' },
      { id: 'p_doc_2', text: 'Mikrochip-Nummer registriert (TASSO / Findefix)' },
      { id: 'p_doc_3', text: 'Hundehaftpflichtversicherung mit Auslandsdeckung' }
    ]
  },
  {
    category: '🛫 Flug & Fahrt-Ausrüstung',
    items: [
      { id: 'p_gear_1', text: 'IATA-konforme, wasserdichte Flug-Transporttasche (Max. 8 kg)' },
      { id: 'p_gear_2', text: 'Auto-Sicherheitsgurt & Schondecke für Rückbank' },
      { id: 'p_gear_3', text: 'Faltbarer Reisenapf & 1,5L Notfall-Wasserflasche' }
    ]
  },
  {
    category: '🌿 Strand, Zecken & Hitze-Schutz',
    items: [
      { id: 'p_care_1', text: 'Zeckenzange & Mittelmeer-Parasitenschutz (Scalibor / Seresto)' },
      { id: 'p_care_2', text: 'Kühlmatte für heiße Sommertage' },
      { id: 'p_care_3', text: 'Kotbeutel-Spender (Biologisch abbaubar)' },
      { id: 'p_care_4', text: 'Schleppleine & Hundeschwimmweste für Klippenstrände' }
    ]
  }
];

class FamilyPetEngine {
  constructor() {
    this.checkedItems = JSON.parse(localStorage.getItem('scratch_checked_checklist')) || {};
  }

  toggleItem(itemId) {
    this.checkedItems[itemId] = !this.checkedItems[itemId];
    localStorage.setItem('scratch_checked_checklist', JSON.stringify(this.checkedItems));
    this.renderAll();
  }

  renderCategory(dataList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let totalItems = 0;
    let completedItems = 0;

    const html = dataList.map(cat => {
      const itemsHtml = cat.items.map(item => {
        totalItems++;
        const checked = !!this.checkedItems[item.id];
        if (checked) completedItems++;

        return `
          <label style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: background 0.15s ease; user-select: none;" onmouseover="this.style.background='var(--bg-glass)'" onmouseout="this.style.background='transparent'">
            <input 
              type="checkbox" 
              ${checked ? 'checked' : ''} 
              onchange="window.familyPetEngine.toggleItem('${item.id}')"
              style="margin-top: 4px; width: 18px; height: 18px; accent-color: var(--emerald-primary); cursor: pointer;"
            />
            <span style="font-size: 0.92rem; line-height: 1.5; color: ${checked ? 'var(--text-dim)' : 'var(--text-main)'}; text-decoration: ${checked ? 'line-through' : 'none'}; font-weight: ${checked ? '500' : '600'};">
              ${item.text}
            </span>
          </label>
        `;
      }).join('');

      return `
        <div style="margin-bottom: 18px;">
          <div style="font-size: 0.92rem; font-weight: 800; color: var(--sand-gold); margin-bottom: 8px; border-bottom: 1px dashed var(--border-line); padding-bottom: 4px;">
            ${cat.category}
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    const percent = Math.round((completedItems / Math.max(1, totalItems)) * 100);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background: var(--bg-surface); padding: 10px 16px; border-radius: 10px;">
        <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
          Fortschritt: ${completedItems} / ${totalItems} erledigt (${percent}%)
        </span>
        <div style="width: 120px; height: 8px; background: rgba(0,0,0,0.2); border-radius: 999px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: var(--emerald-primary); transition: width 0.3s ease;"></div>
        </div>
      </div>
      ${html}
    `;
  }

  renderAll() {
    this.renderCategory(FAMILY_CHECKLIST_DATA, 'family-checklist-box');
    this.renderCategory(PET_CHECKLIST_DATA, 'pet-checklist-box');
  }

  printChecklist() {
    window.print();
  }
}

window.familyPetEngine = new FamilyPetEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.familyPetEngine.renderAll();
});