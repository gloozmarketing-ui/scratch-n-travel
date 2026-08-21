/**
 * Scratch'n'Travel — Travel Budget & Tourist Fair-Price Radar v5.0
 * Protects travelers from tourist rip-offs with authentic local price baselines
 */

(function () {
  'use strict';

  const FAIR_PRICES = {
    'Lissabon': {
      coffee: { fair: '0,80 € – 1,00 €', alert: '> 2,50 €', desc: 'Bica (Espresso) am Tresen in traditioneller Tasca' },
      lunch: { fair: '8,50 € – 11,00 €', alert: '> 18,00 €', desc: 'Prato do Dia inkl. Hauptgericht, Brot, Wein & Kaffee' },
      beer: { fair: '1,50 € – 2,20 €', alert: '> 4,50 €', desc: 'Imperial (0.2L kaltes Fassbier)' },
      taxi: { fair: '15,00 € – 20,00 €', alert: '> 35,00 €', desc: 'Flughafen ins Stadtzentrum (oder Bolt/Uber 9–14 €)' }
    },
    'Algarve': {
      coffee: { fair: '0,90 € – 1,20 €', alert: '> 2,80 €', desc: 'Espresso in Strandnähe' },
      lunch: { fair: '9,50 € – 13,00 €', alert: '> 22,00 €', desc: 'Gegrillte Sardinen oder Tagesfisch mit Kartoffeln' },
      beer: { fair: '1,80 € – 2,50 €', alert: '> 5,00 €', desc: 'Fassbier am Kiosk' },
      taxi: { fair: '18,00 € – 25,00 €', alert: '> 45,00 €', desc: 'Faro Airport nach Quarteira / Olhão' }
    },
    'Barcelona': {
      coffee: { fair: '1,40 € – 1,80 €', alert: '> 3,50 €', desc: 'Café con Leche in Barri Gòtic' },
      lunch: { fair: '12,00 € – 15,00 €', alert: '> 26,00 €', desc: 'Menú del Día (3 Gänge inkl. Getränk)' },
      beer: { fair: '2,20 € – 3,00 €', alert: '> 6,00 €', desc: 'Caña Fassbier' },
      taxi: { fair: '25,00 € – 32,00 €', alert: '> 50,00 €', desc: 'Flughafen El Prat ins Zentrum' }
    }
  };

  function TravelBudgetEngine() {
    this.currentCity = 'Lissabon';
  }

  TravelBudgetEngine.prototype.renderBudgetWidget = function (containerId) {
    containerId = containerId || 'travelBudgetWidget';
    const el = document.getElementById(containerId);
    if (!el) return;

    const data = FAIR_PRICES[this.currentCity] || FAIR_PRICES['Lissabon'];

    el.innerHTML = `
      <div class="glass-card" style="border-radius: 20px; padding: 24px; border: 1px solid var(--emerald-primary);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span class="badge badge-emerald">🛡️ Fair-Price & Anti-Abzocke Radar</span>
            <h3 style="font-size: 1.35rem; color: var(--text-main); margin: 6px 0 0;">Preiskompass ${this.currentCity}</h3>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-dim);">Geprüfte Kiez-Preise</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div style="background: var(--bg-surface); padding: 12px; border-radius: 12px; border: 1px solid var(--border-line);">
            <div style="font-size: 0.8rem; color: var(--text-dim);">☕ Espresso (Bica):</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--emerald-primary);">${data.coffee.fair}</div>
            <div style="font-size: 0.72rem; color: #EF4444;">⚠️ Abzocke wenn ${data.coffee.alert}</div>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: 12px; border: 1px solid var(--border-line);">
            <div style="font-size: 0.8rem; color: var(--text-dim);">🍲 Mittagstisch (Prato do Dia):</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--emerald-primary);">${data.lunch.fair}</div>
            <div style="font-size: 0.72rem; color: #EF4444;">⚠️ Abzocke wenn ${data.lunch.alert}</div>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: 12px; border: 1px solid var(--border-line);">
            <div style="font-size: 0.8rem; color: var(--text-dim);">🍺 Fassbier (0.2L):</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--emerald-primary);">${data.beer.fair}</div>
            <div style="font-size: 0.72rem; color: #EF4444;">⚠️ Abzocke wenn ${data.beer.alert}</div>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: 12px; border: 1px solid var(--border-line);">
            <div style="font-size: 0.8rem; color: var(--text-dim);">🚖 Flughafen Taxi:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--emerald-primary);">${data.taxi.fair}</div>
            <div style="font-size: 0.72rem; color: #EF4444;">⚠️ Abzocke wenn ${data.taxi.alert}</div>
          </div>
        </div>
      </div>
    `;
  };

  window.travelBudget = new TravelBudgetEngine();

  window.addEventListener('snt:city_changed', (e) => {
    if (e.detail?.city && window.travelBudget) {
      window.travelBudget.currentCity = e.detail.city;
      window.travelBudget.renderBudgetWidget();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.travelBudget.renderBudgetWidget();
  });

})();
