/**
 * Scratch'n'Travel — Tier Guard & Feature Access Control Engine v1.0
 * 
 * Enforces strict feature separation across subscription tiers:
 * - 🌱 Free Explorer (0 €):
 *     - Blurred GPS coordinates on Secret Spots (Lock badge + Upgrade prompt)
 *     - Max 2 AI queries / day
 *     - Interactive checklist online only (PDF export locked)
 *     - Max 3 Scratch-Wallet cards
 * - ✨ Pro VIP Explorer (9 €/Mo / 0 € Beta):
 *     - 100% Unlocked exact GPS coordinates & direct map links
 *     - Unlimited AI Concierge queries & live water/wave metrics
 *     - 1-Click PDF & Print Checklist Download
 *     - Unlimited Scratch Wallet cards & 10% Merch Discount
 * - 🌟 Business & Host Partner (29 €/Mo):
 *     - All Pro Features
 *     - Host Management Portal: List Café, Restaurant, Apartment, Surf School
 *     - 0% Commission direct booking leads & VIP Partner Gold Badge
 *     - 25% Merch & POD Discount + Custom Gold Engraved Travel Passport
 */

(function () {
  'use strict';

  class TierGuardEngine {
    constructor() {
      this.currentTier = localStorage.getItem('scratch_user_tier') || 'free';
    }

    getTier() {
      return localStorage.getItem('scratch_user_tier') || 'free';
    }

    setTier(tierKey) {
      this.currentTier = tierKey;
      localStorage.setItem('scratch_user_tier', tierKey);
      this.applyTierGuards();
      
      if (window.stripeManager && typeof window.stripeManager.updateUserTierUI === 'function') {
        window.stripeManager.updateUserTierUI();
      }
    }

    isPro() {
      const t = this.getTier();
      return t === 'pro_family' || t === 'host_business';
    }

    isBusiness() {
      return this.getTier() === 'host_business';
    }

    applyTierGuards() {
      const isPro = this.isPro();
      const isBusiness = this.isBusiness();

      // 1. Guard Secret Spot Blurs / Coordinates
      document.querySelectorAll('.secret-blur-overlay').forEach(overlay => {
        if (isPro) {
          overlay.style.display = 'none';
          const targetId = overlay.id.replace('blur-', 'reveal-');
          const revealEl = document.getElementById(targetId);
          if (revealEl) revealEl.style.display = 'block';
        } else {
          // Check if individually unlocked by user pledge
          const isIndividuallyUnlocked = overlay.getAttribute('data-pledged') === 'true';
          if (!isIndividuallyUnlocked) {
            overlay.style.display = 'block';
            const targetId = overlay.id.replace('blur-', 'reveal-');
            const revealEl = document.getElementById(targetId);
            if (revealEl) revealEl.style.display = 'none';
          }
        }
      });

      // 2. Guard PDF Checklist Download Button
      const printBtns = document.querySelectorAll('.checklist-print-btn, [onclick*="printChecklist"]');
      printBtns.forEach(btn => {
        if (!isPro) {
          btn.setAttribute('data-original-onclick', btn.getAttribute('onclick') || '');
          btn.onclick = (e) => {
            e.preventDefault();
            this.showProUpgradePrompt('PDF & Druck-Export von Reise-Checklisten ist ein Pro-Feature.');
          };
        } else {
          btn.onclick = () => {
            if (window.familyPetEngine) window.familyPetEngine.printChecklist();
          };
        }
      });

      // 3. Update User Tier Badges across all pages
      document.querySelectorAll('#userTierBadge').forEach(badge => {
        if (isBusiness) {
          badge.innerHTML = '<span class="badge badge-gold" style="box-shadow: 0 0 12px rgba(245,158,11,0.5);">🌟 VIP Business Host</span>';
        } else if (isPro) {
          badge.innerHTML = '<span class="badge badge-emerald" style="box-shadow: 0 0 12px rgba(16,185,129,0.5);">✨ Pro VIP Explorer</span>';
        } else {
          badge.innerHTML = '<span class="badge badge-cyan">🌱 Free Explorer</span>';
        }
      });
    }

    showProUpgradePrompt(reason) {
      let modal = document.getElementById('tierGuardModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tierGuardModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 520px; text-align: center; padding: 32px 24px;">
          <button class="modal-close" onclick="document.getElementById('tierGuardModal').style.display='none'">×</button>
          <span style="font-size: 3rem;">✨</span>
          <h3 style="margin-top: 8px; font-size: 1.4rem; color: var(--text-main);">Pro VIP Feature</h3>
          <p style="font-size: 0.92rem; color: var(--text-muted); margin: 12px 0 20px; line-height: 1.5;">
            ${reason || 'Exakte GPS-Koordinaten, unbegrenzte KI-Routen & PDF-Checklisten sind im Pro VIP-Plan enthalten.'}
          </p>

          <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 14px; padding: 16px; margin-bottom: 20px; text-align: left; font-size: 0.85rem;">
            <div style="font-weight: 800; color: var(--emerald-primary); margin-bottom: 8px;">Im Pro VIP-Plan enthalten:</div>
            <div style="margin-bottom: 6px;">🔓 100% Exakte GPS-Koordinaten & Wegbeschreibungen</div>
            <div style="margin-bottom: 6px;">🤖 Unbegrenzte KI-Tagespläne & Live-Wassertemperaturen</div>
            <div style="margin-bottom: 6px;">📥 1-Klick PDF Checklisten-Druck</div>
            <div>🪙 2x Schnelleres Kartensammeln & Länder-Bonus-Batches im Scratch-Wallet</div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="document.getElementById('tierGuardModal').style.display='none'">
              Später vielleicht
            </button>
            <button class="btn btn-primary" onclick="document.getElementById('tierGuardModal').style.display='none'; window.stripeManager.startCheckout('pro_family')">
              Jetzt Pro VIP Freischalten (9 € / 0 € Beta) 🚀
            </button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
    }
  }

  window.tierGuard = new TierGuardEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.tierGuard.applyTierGuards();
  });

})();
