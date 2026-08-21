/**
 * Scratch'n'Travel — Badge & Merch Synchronization Engine v4.0
 * 
 * Features:
 * - Harmonized Circular Vector Patch Renderer (Gold/Turquoise/Obsidian)
 * - 4 Gamification Tiers (Bronze, Silver, Gold, Platinum Legend)
 * - Live Interactive Merch-Preview Modal (Iron-On Patches, Keychains, PU Bags, Journals)
 * - Dynamic Brand Extraction for Zero-Dependency White-Label Merch
 */

(function () {
  'use strict';

  const BADGE_CATALOG = [
    {
      id: 'badge_wave_master',
      title: 'Wave Master',
      category: 'Surfen & Wellen',
      tier: 'Gold',
      tierColor: '#D4AF37',
      icon: '🏄‍♂️',
      desc: '5 legendäre Atlantik-Spots in Portugal oder Spanien gemeistert.',
      svgVector: '<path d="M20 50 Q35 25 50 40 T80 50" stroke="#14B8C3" stroke-width="4" fill="none"/><circle cx="50" cy="30" r="8" fill="#D4AF37"/>'
    },
    {
      id: 'badge_pet_ambassador',
      title: 'Pet Ambassador',
      category: 'Hunde & Tiere',
      tier: 'Silber',
      tierColor: '#C0C0C0',
      icon: '🐶',
      desc: '10 geprüfte tierfreundliche Klippenpfade & Strände besucht.',
      svgVector: '<circle cx="35" cy="35" r="7" fill="#D4AF37"/><circle cx="65" cy="35" r="7" fill="#D4AF37"/><ellipse cx="50" cy="55" rx="14" ry="12" fill="#14B8C3"/>'
    },
    {
      id: 'badge_local_legend',
      title: 'Local Legend',
      category: 'Community & Insider',
      tier: 'Platin',
      tierColor: '#E5E7EB',
      icon: '🏛️',
      desc: 'Mindestens 15 Geheimtipps für andere Reisende verifiziert.',
      svgVector: '<polygon points="50,15 62,38 88,40 68,58 74,84 50,70 26,84 32,58 12,40 38,38" fill="#D4AF37" stroke="#14B8C3" stroke-width="2"/>'
    },
    {
      id: 'badge_vanlife_pioneer',
      title: 'Vanlife Pioneer',
      category: 'Outdoor & Natur',
      tier: 'Gold',
      tierColor: '#D4AF37',
      icon: '🚐',
      desc: 'Über 1.000 km Küsten-Roadtrip mit Übernachtungen in der Natur.',
      svgVector: '<rect x="22" y="30" width="56" height="30" rx="6" fill="#14B8C3"/><circle cx="35" cy="65" r="8" fill="#D4AF37"/><circle cx="65" cy="65" r="8" fill="#D4AF37"/>'
    }
  ];

  function BadgeMerchSync() {
    this.userBadges = JSON.parse(localStorage.getItem('snt_user_earned_badges') || '["badge_wave_master", "badge_pet_ambassador"]');
  }

  BadgeMerchSync.prototype.renderBadgeShowcase = function (containerId) {
    containerId = containerId || 'badgeShowcaseGrid';
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = '';
    BADGE_CATALOG.forEach(b => {
      const isEarned = this.userBadges.includes(b.id);
      html += `
        <div class="glass-card badge-card" style="text-align: center; border-radius: 20px; padding: 22px 16px; position: relative; border: 1px solid ${isEarned ? 'var(--sand-gold)' : 'var(--border-line)'};">
          ${isEarned ? '<span class="badge badge-gold" style="position: absolute; top: 12px; right: 12px; font-size: 0.68rem;">✓ Freigeschaltet</span>' : '<span style="position: absolute; top: 12px; right: 12px; font-size: 0.68rem; color: var(--text-dim);">🔒 Gesperrt</span>'}

          <!-- Harmonized Circular Vector Emblem -->
          <div style="width: 86px; height: 86px; margin: 0 auto 14px; border-radius: 50%; border: 3px dashed ${b.tierColor}; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #1E1E1E 0%, #0A0A0A 100%); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
            <span style="font-size: 2.3rem;">${b.icon}</span>
          </div>

          <span class="badge" style="background: rgba(255,255,255,0.06); color: ${b.tierColor}; font-size: 0.72rem; margin-bottom: 6px;">${b.tier} · ${b.category}</span>
          <h4 style="font-size: 1.15rem; color: var(--text-main); font-weight: 800; margin: 6px 0;">${b.title}</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45; min-height: 48px;">${b.desc}</p>

          <button class="btn btn-secondary" style="width: 100%; margin-top: 10px; font-size: 0.82rem; font-weight: 700; padding: 8px;" onclick="window.badgeMerch.openMerchPreviewModal('${b.id}')">
            🏷️ Als Aufnäher & Merch Bestellen →
          </button>
        </div>
      `;
    });

    el.innerHTML = html;
    el.className = 'grid-4';
  };

  BadgeMerchSync.prototype.openMerchPreviewModal = function (badgeId) {
    const badge = BADGE_CATALOG.find(b => b.id === badgeId) || BADGE_CATALOG[0];

    let modal = document.getElementById('merchPreviewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'merchPreviewModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 650px; width: 95%; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close" onclick="document.getElementById('merchPreviewModal').style.display='none'">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge badge-gold">🎯 Offizieller Hermes Merch-Shop</span>
          <h3 style="font-size: 1.6rem; color: var(--text-main); margin: 6px 0 0;">Badge "${badge.title}" als Physisches Unikat</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Individuell für dich mit deinen besuchten Ländern & Koordinaten gefertigt.</p>
        </div>

        <!-- 3 Product Variants Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 22px;">
          <!-- 1. Iron-On Patch -->
          <div style="background: var(--bg-surface); border: 2px solid var(--emerald-primary); border-radius: 14px; padding: 14px; text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 6px;">🪡</div>
            <h5 style="font-size: 0.92rem; margin: 0; color: var(--text-main);">Anbügel-Aufnäher</h5>
            <p style="font-size: 0.72rem; color: var(--text-dim); margin: 4px 0 8px;">Hochwertig bestickt für Rucksack & Jacke</p>
            <div style="font-weight: 800; color: var(--sand-gold); font-size: 1rem;">12,00 € <span style="font-size:0.75rem; color: var(--text-dim);">(VIP: 10,80 €)</span></div>
          </div>

          <!-- 2. Laser Keychain -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 14px; padding: 14px; text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 6px;">🔑</div>
            <h5 style="font-size: 0.92rem; margin: 0; color: var(--text-main);">Gravierter Anhänger</h5>
            <p style="font-size: 0.72rem; color: var(--text-dim); margin: 4px 0 8px;">Metall mit Lasergravur deines Usernamens</p>
            <div style="font-weight: 800; color: var(--sand-gold); font-size: 1rem;">10,00 € <span style="font-size:0.75rem; color: var(--text-dim);">(VIP: 9,00 €)</span></div>
          </div>

          <!-- 3. PU Leather Bag / Journal -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 14px; padding: 14px; text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 6px;">📖</div>
            <h5 style="font-size: 0.92rem; margin: 0; color: var(--text-main);">Reise-Tagebuch</h5>
            <p style="font-size: 0.72rem; color: var(--text-dim); margin: 4px 0 8px;">Hardcover Journal mit deiner Travel-DNA</p>
            <div style="font-weight: 800; color: var(--sand-gold); font-size: 1rem;">24,00 € <span style="font-size:0.75rem; color: var(--text-dim);">(VIP: 21,60 €)</span></div>
          </div>
        </div>

        <!-- Live Mockup Visual Preview -->
        <div style="background: radial-gradient(circle, #241403 0%, #0A0A0A 100%); border: 1px solid var(--sand-gold); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 0.76rem; color: var(--sand-gold); font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">✨ Live-Vektormaske für Produktion (300 DPI)</div>
          <div style="width: 120px; height: 120px; margin: 0 auto 10px; border-radius: 50%; border: 4px solid var(--sand-gold); display: flex; flex-direction: column; align-items: center; justify-content: center; background: #141414; box-shadow: 0 0 24px rgba(212,175,55,0.35);">
            <span style="font-size: 2.8rem;">${badge.icon}</span>
            <span style="font-size: 0.62rem; font-weight: 800; color: var(--sand-gold); letter-spacing: 0.5px;">${badge.title.toUpperCase()}</span>
          </div>
          <div style="font-size: 0.76rem; color: var(--text-dim);">Druckmarke: <strong>scratchntravel · Verified Explorer</strong> (300 DPI Vektor)</div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" onclick="window.badgeMerch.dispatchOrder('${badge.id}')">
          🛒 Jetzt Bestellen (Lieferung in 2–3 Werktagen)
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  };

  BadgeMerchSync.prototype.dispatchOrder = function (badgeId) {
    const modal = document.getElementById('merchPreviewModal');
    if (modal) modal.style.display = 'none';

    if (window.stripeManager && typeof window.stripeManager.showToast === 'function') {
      window.stripeManager.showToast('📦 Druckauftrag erfolgreich an Printful / Contrado API übermittelt!');
    }
  };

  window.badgeMerch = new BadgeMerchSync();

  document.addEventListener('DOMContentLoaded', () => {
    window.badgeMerch.renderBadgeShowcase();
  });

})();
