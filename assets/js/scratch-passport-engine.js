/**
 * Scratch'n'Travel — Luxury Passport, Interactive Scratch Engine & Outsource Merch Showroom (POD)
 */

const DEFAULT_VISA_STAMPS = [
  { id: 'stamp_lisbon', title: 'LISBOA SECRET GEM', date: '14. AUG 2026', color: '#10B981', icon: '🏛️', status: 'VERIFIED LOCAL' },
  { id: 'stamp_nazare', title: 'NAZARÉ BIG WAVES', date: '15. AUG 2026', color: '#06B6D4', icon: '🌊', status: 'ADRENALINE SEAL' },
  { id: 'stamp_ursa', title: 'PRAIA DA URSA DOG SEAL', date: '16. AUG 2026', color: '#F59E0B', icon: '🐕', status: 'PET APPROVED' },
  { id: 'stamp_alfama', title: 'ALFAMA CHEF MASTER', date: '17. AUG 2026', color: '#D17B49', icon: '🍮', status: 'PASTEL DE NATA' }
];

class ScratchPassportEngine {
  constructor() {
    this.stamps = JSON.parse(localStorage.getItem('scratch_user_stamps')) || DEFAULT_VISA_STAMPS;
    this.scratchedPercent = 0;
  }

  initCanvas(canvasId = 'scratchCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = canvas.offsetHeight || 380;

    // Draw luxury metallic gold foil layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#D4AF37');
    grad.addColorStop(0.3, '#FFF8DC');
    grad.addColorStop(0.5, '#AA771C');
    grad.addColorStop(0.7, '#FFDF00');
    grad.addColorStop(1, '#8B6508');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ FREIRUBBELN: Ziehe mit der Maus oder Finger über die Goldfolie ✨', canvas.width / 2, canvas.height / 2);

    let isScratching = false;

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      this.calculateScratchPercentage(canvas, ctx);
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    canvas.addEventListener('mousedown', (e) => { isScratching = true; const p = getPos(e); scratch(p.x, p.y); });
    canvas.addEventListener('mousemove', (e) => { if (isScratching) { const p = getPos(e); scratch(p.x, p.y); } });
    canvas.addEventListener('mouseup', () => { isScratching = false; });
    canvas.addEventListener('mouseleave', () => { isScratching = false; });

    canvas.addEventListener('touchstart', (e) => { isScratching = true; const p = getPos(e); scratch(p.x, p.y); });
    canvas.addEventListener('touchmove', (e) => { if (isScratching) { const p = getPos(e); scratch(p.x, p.y); } });
    canvas.addEventListener('touchend', () => { isScratching = false; });

    this.renderStamps();
  }

  calculateScratchPercentage(canvas, ctx) {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparentCount++;
      }
      const totalSampled = pixels.length / 16;
      this.scratchedPercent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));

      const display = document.getElementById('scratchPercentDisplay');
      if (display) display.textContent = `${this.scratchedPercent}% Freigerubbelt`;
    } catch (e) {
      console.warn('Scratch percentage error:', e);
    }
  }

  revealAll() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const display = document.getElementById('scratchPercentDisplay');
    if (display) display.textContent = `100% Freigerubbelt (Alle Secrets Enthüllt!)`;
  }

  resetMap() {
    this.initCanvas('scratchCanvas');
  }

  renderStamps(containerId = 'passportStampsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.stamps.map(s => `
      <div class="passport-stamp" style="border-color: ${s.color};">
        <div style="font-size: 1.6rem;">${s.icon}</div>
        <div style="font-size: 0.75rem; font-weight: 800; color: ${s.color}; margin-top: 4px; text-transform: uppercase;">
          ${s.title}
        </div>
        <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 2px;">
          ${s.date} • ${s.status}
        </div>
      </div>
    `).join('');
  }

  // 📖 Merchandise & POD Showroom Modal with High-End Product Previews
  openPODOrderModal() {
    const modalHtml = `
      <div class="modal-overlay" id="podModal" style="display: flex;">
        <div class="modal-content" style="max-width: 840px;">
          <button class="modal-close" onclick="document.getElementById('podModal').remove()">×</button>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <span class="badge badge-gold">📖 Outsource Merch & POD Showroom</span>
            <h2 style="font-size: 1.6rem; color: var(--text-main); margin-top: 8px;">Dein Physisches Reise-Set zum Anfassen</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 620px; margin: 0 auto;">
              Keine langweiligen Kärtchen: Individuell gefertigte Echtleder-Reisepässe mit Goldprägung, hochwertige A2 Rubbel-Weltkarten und Sammler-Pins via Printful & Gelato POD.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <!-- Product 1: Luxury Leather Passport -->
            <div class="glass-card" style="padding: 16px; border-color: var(--sand-gold); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="height: 120px; border-radius: 8px; background: linear-gradient(135deg, #2E1C0C, #4A2E15); border: 1px solid var(--sand-gold); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <div style="text-align: center;">
                    <div style="font-size: 2rem;">⚜️</div>
                    <div style="font-size: 0.72rem; color: var(--sand-gold); font-weight: 800; letter-spacing: 0.1em;">OFFICIAL TRAVEL PASSPORT</div>
                  </div>
                </div>
                <h4 style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 4px;">📖 Echtleder Travel Journal</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
                  A5 Format, 32 nummerierte Seiten mit Goldrand, personalisierter Name, Travel-Karma Score & 4 gestanzte Visa-Stempel.
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-line); padding-top: 8px;">
                <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">29,90 €</span>
                <span class="badge badge-gold" style="font-size: 0.68rem;">Bestseller</span>
              </div>
            </div>

            <!-- Product 2: A2 World Scratch Map -->
            <div class="glass-card" style="padding: 16px; border-color: var(--emerald-primary); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="height: 120px; border-radius: 8px; background: linear-gradient(135deg, #0B131F, #1E293B); border: 1px solid var(--emerald-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <div style="text-align: center;">
                    <div style="font-size: 2rem;">🗺️</div>
                    <div style="font-size: 0.72rem; color: var(--emerald-primary); font-weight: 800; letter-spacing: 0.1em;">OBSIDIAN & GOLD SCRATCH MAP</div>
                  </div>
                </div>
                <h4 style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 4px;">🗺️ A2 Wand-Rubbelkarte</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
                  59,4 x 42,0 cm, 250g Kunstdruckpapier, abriebfeste Goldfolie über tiefschwarzem Obsidian-Relief mit Flaggen & Koordinaten.
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-line); padding-top: 8px;">
                <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">24,90 €</span>
                <span class="badge badge-emerald" style="font-size: 0.68rem;">Beliebt</span>
              </div>
            </div>

            <!-- Product 3: Ultimate Globetrotter Box -->
            <div class="glass-card" style="padding: 16px; border-color: var(--cyan-accent); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="height: 120px; border-radius: 8px; background: linear-gradient(135deg, #0C1E2E, #164E63); border: 1px solid var(--cyan-accent); display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <div style="text-align: center;">
                    <div style="font-size: 2rem;">🎁</div>
                    <div style="font-size: 0.72rem; color: var(--cyan-accent); font-weight: 800; letter-spacing: 0.1em;">VIP COLLECTOR GIFT BOX</div>
                  </div>
                </div>
                <h4 style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 4px;">🎁 Ultimate Globetrotter Box</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
                  Lederpass + A2 Rubbelkarte + 4 Metall-Badges (Wave Hunter, Pet Explorer) + Goldener Kratzstift in edler Magnetbox.
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-line); padding-top: 8px;">
                <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">59,90 €</span>
                <span class="badge badge-cyan" style="font-size: 0.68rem;">Komplett-Set</span>
              </div>
            </div>
          </div>

          <div class="pod-info-box">
            💡 <strong>100% Automatisierter POD-Workflow:</strong> Das System generiert hochauflösende 300-DPI Druckdateien mit Vektor-Prägemasken. Die Produktion und der weltweite Versand erfolgen ohne Vorab-Lagerbestand über Printful / Gelato.
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="document.getElementById('podModal').remove()">Schließen</button>
            <button class="btn btn-primary" onclick="alert('🛍️ Druckdatei wird im POD-System verarbeitet! Muster-Bestellung ausgelöst.'); document.getElementById('podModal').remove();">
              Muster Bestellen / Druckdatei Exportieren 🚀
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

window.scratchPassport = new ScratchPassportEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.scratchPassport.initCanvas('scratchCanvas');
});