/**
 * Scratch'n'Travel — Luxury Black & Gold Scratch-Off Map & Digital Travel Passport
 * Inspired by Luxury Scratch-Off Maps & Official Travel Passports with Visa Stamps
 */

class ScratchPassportEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.scratchedPercent = 0;
    this.stamps = JSON.parse(localStorage.getItem('scratch_user_stamps')) || [
      { id: 'stamp_lisbon', title: 'LISBOA SECRET GEM', date: '14. AUG 2026', color: '#10B981', icon: '🏛️', status: 'VERIFIED' },
      { id: 'stamp_nazare', title: 'NAZARÉ BIG WAVE SURF', date: '12. AUG 2026', color: '#06B6D4', icon: '🌊', status: 'UNLOCKED' },
      { id: 'stamp_ursa', title: 'PRAIA DA URSA DOG SEAL', date: '10. AUG 2026', color: '#F59E0B', icon: '🐕', status: 'SEALED' },
      { id: 'stamp_pasteis', title: 'ALFAMA CHEF MASTER', date: '08. AUG 2026', color: '#EC4899', icon: '🍮', status: 'VERIFIED' }
    ];
  }

  // Initialize Interactive Scratch Canvas
  initCanvas(canvasId = 'scratchCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.setupGoldFoil();

    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => { this.isDrawing = true; this.scratch(e); });
    this.canvas.addEventListener('mousemove', (e) => { if (this.isDrawing) this.scratch(e); });
    window.addEventListener('mouseup', () => { this.isDrawing = false; this.calcScratchedPercentage(); });

    // Touch Events for Mobile / Tablet
    this.canvas.addEventListener('touchstart', (e) => { this.isDrawing = true; this.scratch(e.touches[0]); e.preventDefault(); }, { passive: false });
    this.canvas.addEventListener('touchmove', (e) => { if (this.isDrawing) this.scratch(e.touches[0]); e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend', () => { this.isDrawing = false; this.calcScratchedPercentage(); });
  }

  setupGoldFoil() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width = this.canvas.offsetWidth || 800;
    const h = this.canvas.height = this.canvas.offsetHeight || 420;

    // Rich Dark Obsidian & Gold Foil Gradient
    const grad = this.ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#D4AF37');   // Classic Rich Gold
    grad.addColorStop(0.3, '#F59E0B'); // Amber Gold
    grad.addColorStop(0.7, '#B45309'); // Deep Gold Foil
    grad.addColorStop(1, '#1E293B');   // Obsidian Shadow

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Add luxury metallic shimmer pattern & text
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.font = 'bold 20px Outfit, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('✨ GOLD-FOLIE FREIRUBBELN ✨', w / 2, h / 2 - 10);
    this.ctx.font = '14px Plus Jakarta Sans, sans-serif';
    this.ctx.fillText('Bewege die Maus oder den Finger, um geheime Orte zu enthüllen', w / 2, h / 2 + 18);
  }

  scratch(e) {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 28, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  calcScratchedPercentage() {
    if (!this.ctx || !this.canvas) return;
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let transparentPixels = 0;
    const totalPixels = imgData.data.length / 4;

    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparentPixels++;
    }

    this.scratchedPercent = Math.round((transparentPixels / totalPixels) * 100);
    const percentEl = document.getElementById('scratchPercentDisplay');
    if (percentEl) {
      percentEl.textContent = `${this.scratchedPercent}% Freigerubbelt`;
    }

    if (this.scratchedPercent >= 60 && !this.bonusUnlocked) {
      this.bonusUnlocked = true;
      if (window.stripeManager) {
        window.stripeManager.showToast('🎉 Wow! 60% freigerubbelt — Neuer Visa-Stempel freigeschaltet!');
      }
    }
  }

  revealAll() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.scratchedPercent = 100;
    const percentEl = document.getElementById('scratchPercentDisplay');
    if (percentEl) percentEl.textContent = '100% Enthüllt';
  }

  resetMap() {
    this.setupGoldFoil();
    this.scratchedPercent = 0;
    const percentEl = document.getElementById('scratchPercentDisplay');
    if (percentEl) percentEl.textContent = '0% Freigerubbelt';
  }

  // Render Visa Stamps in Digital Passport
  renderStamps(containerId = 'passportStampsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.stamps.map(s => `
      <div class="passport-stamp-card" style="border-color: ${s.color};">
        <div class="stamp-icon">${s.icon}</div>
        <div style="font-weight: 800; font-size: 0.82rem; color: ${s.color}; text-transform: uppercase; letter-spacing: 0.05em;">
          ${s.title}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">📅 ${s.date}</div>
        <div class="stamp-status-tag" style="background: ${s.color}22; color: ${s.color};">
          ✓ ${s.status}
        </div>
      </div>
    `).join('');
  }

  // Open Outsource Print-on-Demand Modal
  openPODOrderModal() {
    let modal = document.getElementById('podOrderModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'podOrderModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px; text-align: center; border: 1px solid var(--sand-gold);">
        <button class="modal-close" onclick="document.getElementById('podOrderModal').style.display='none'">×</button>
        <span class="badge badge-gold">📖 Outsource & Print-on-Demand (POD / Etsy)</span>
        <h3 style="margin-top: 12px; font-size: 1.4rem;">Gedrucktes Luxus-Passbuch & Gold-Rubbelkarte</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin: 8px 0 16px;">
          Verwandle deine digitalen Reisen in ein physisches <strong>Echtleder-Reisejournal mit Goldrändern</strong> & hochauflösender Rubbel-Weltkarte.
        </p>

        <div style="background: rgba(0,0,0,0.4); border: 1px dashed var(--sand-gold); padding: 18px; border-radius: var(--radius-md); text-align: left; font-size: 0.85rem; margin-bottom: 20px;">
          <p style="color: #FFF; margin-bottom: 6px;">✨ <strong>Vollautomatische Produktion über POD-Partner:</strong></p>
          <ul style="list-style: none; padding-left: 0; color: var(--text-muted);">
            <li>✓ Veganes Leder-Cover mit personalisierter Goldprägung</li>
            <li>✓ Automatisch eingedruckte Visa-Stempel & Reisetagebuch</li>
            <li>✓ Echte Goldfolien-Rubbelkarten für jedes bereiste Land</li>
            <li>✓ Weltweiter Direktversand (Dropshipping / Etsy / Printful)</li>
          </ul>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary" onclick="alert('🛍️ Print-on-Demand API angebunden. Der Export wird druckfertig mit 300 DPI für den Druckpartner generiert.'); document.getElementById('podOrderModal').style.display='none'">
            Druckfertige POD-Datei Exportieren 🖨️
          </button>
          <button class="btn btn-secondary" onclick="document.getElementById('podOrderModal').style.display='none'">
            Schließen
          </button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }
}

window.scratchPassport = new ScratchPassportEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.scratchPassport.initCanvas();
  window.scratchPassport.renderStamps();
});