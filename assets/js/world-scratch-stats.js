/**
 * Scratch'n'Travel — World Scratch Counter & Social Story Generator v5.0
 */

(function () {
  'use strict';

  function WorldScratchStats() {
    this.totalCountriesScratched = 4;
    this.totalSpotsUnlocked = 18;
    this.continentsUnlocked = 2;
    this.worldPercentage = 8.4;
  }

  WorldScratchStats.prototype.renderStatsBar = function (containerId) {
    containerId = containerId || 'worldScratchStatsBar';
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--sand-gold); border-radius: 18px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 8px 24px rgba(212,175,55,0.12);">
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
          <div style="font-size: 2rem;">🌍</div>
          <div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--sand-gold);">${this.worldPercentage}% der Welt freigerubbelt</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${this.totalCountriesScratched} Länder · ${this.continentsUnlocked} Kontinente · ${this.totalSpotsUnlocked} Secret Spots</div>
          </div>
        </div>

        <button class="btn btn-primary" style="padding: 8px 18px; font-size: 0.85rem; font-weight: 800;" onclick="window.worldStats.shareStoryCard()">
          📲 Als Story Teilen (Instagram & TikTok)
        </button>
      </div>
    `;
  };

  WorldScratchStats.prototype.shareStoryCard = function () {
    let modal = document.getElementById('storyCardModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'storyCardModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 420px; width: 95%; text-align: center; background: #0A0A0A; border: 2px solid var(--sand-gold); padding: 28px 20px;">
        <button class="modal-close" onclick="document.getElementById('storyCardModal').style.display='none'">×</button>
        
        <div style="background: radial-gradient(circle, #241403 0%, #0A0A0A 100%); border-radius: 20px; padding: 24px 16px; border: 1px solid var(--sand-gold); margin-bottom: 20px; box-shadow: 0 0 30px rgba(212,175,55,0.25);">
          <span style="font-size: 3rem;">🪙</span>
          <h3 style="font-size: 1.6rem; color: var(--sand-gold); font-weight: 800; margin: 8px 0 4px;">TRAVEL PASSPORT</h3>
          <div style="font-size: 0.82rem; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase;">Scratch'n'Travel · Verified Explorer</div>

          <div style="margin: 20px 0; border-top: 1px dashed var(--sand-gold); border-bottom: 1px dashed var(--sand-gold); padding: 14px 0;">
            <div style="font-size: 2.2rem; font-weight: 800; color: #FFFFFF;">${this.worldPercentage}% DER WELT</div>
            <div style="font-size: 0.85rem; color: var(--emerald-primary); font-weight: 700;">🔓 ${this.totalSpotsUnlocked} Geheime Spots Freigerubbelt</div>
          </div>

          <div style="font-size: 0.76rem; color: var(--text-dim);">Entdecke deine 130 Hobby-DNA auf: <strong>scratchntravel.com</strong></div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem;" onclick="alert('📸 Story-Card in die Zwischenablage kopiert! Bereit zum Einfügen in Instagram / TikTok Stories.')">
          📋 Story-Grafik Kopieren & Teilen
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  };

  window.worldStats = new WorldScratchStats();

  document.addEventListener('DOMContentLoaded', () => {
    window.worldStats.renderStatsBar();
  });

})();
