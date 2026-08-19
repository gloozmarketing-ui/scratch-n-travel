/**
 * Scratch'n'Travel — Stripe & Subscription Configuration
 * 
 * DESIGNED FOR PRE-LAUNCH & BUSINESS READINESS:
 * ─────────────────────────────────────────────────────────────────
 * 1. Default Mode: PRE-LAUNCH / BETA (STRIPE_ENABLED = false)
 *    - Commercial prices are hidden / converted to "0 € Early Bird VIP Access"
 *    - 100% legally safe for testing prior to business trade registration (Gewerbe).
 *    - Users can unlock VIP Pro features with 1 click to test the full platform.
 * 
 * 2. 1-Click Live Switch: (STRIPE_ENABLED = true or toggle via Admin Switcher)
 *    - Instantly reveals full commercial prices (7,99 € / 29 €)
 *    - Connects directly to Stripe Checkout / Stripe Payment Links.
 */

const STRIPE_CONFIG = {
  // Master Flag: Toggle to TRUE when your Gewerbeanmeldung is ready!
  // Can also be toggled live in browser via window.toggleStripeMode()
  enabled: localStorage.getItem('scratch_stripe_mode') === 'true' ? true : false,

  publishableKey: window.STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx',

  plans: {
    free: {
      id: 'free',
      name: 'Free Explorer',
      badge: 'Basis',
      betaPrice: '0 €',
      betaPeriod: 'dauerhaft kostenlos',
      betaDescription: 'Kostenlose Basisfunktionen für Entdecker',
      livePrice: '0 €',
      livePeriod: '/ dauerhaft',
      liveDescription: 'Kostenlose Basisfunktionen für Entdecker',
      ctaBeta: 'Kostenlos nutzen',
      ctaLive: 'Kostenlos nutzen',
      features: [
        '✓ Basis-Geheimtipps ansehen',
        '✓ Familien- & Hunde-Checklisten',
        '✓ Haustier-Flugrechner',
        '✓ Basis City Explorer'
      ],
      isPopular: false
    },
    pro: {
      id: 'pro_family',
      name: 'Family & Pet Pro',
      badge: 'Early Bird VIP',
      betaPrice: '0 €',
      betaPeriod: 'Kostenlos in der Beta-Phase',
      betaDescription: '🎁 Exklusiver Vorab-Zugang (Regulär 7,99 €/Monat nach offiziellem Launch)',
      livePrice: '7,99 €',
      livePeriod: '/ Monat',
      liveDescription: 'Voller Zugang zu allen Secret Spots, KI Concierge & Scratchbook',
      priceId: 'price_1P_pro_monthly',
      paymentLink: 'https://buy.stripe.com/test_pro_family_monthly',
      ctaBeta: 'VIP Beta-Zugang sichern (0 €) 🎉',
      ctaLive: 'Pro Freischalten (7,99 €) 💳',
      features: [
        '✓ Unbegrenzt 🔐 Secret Spots Koordinaten enthüllen',
        '✓ Unbegrenzte Smart Travel AI Concierge Empfehlungen',
        '✓ Hobby-Matching & Direktnachrichten mit Locals',
        '✓ Digital Travel Scratchbook PDF-Export',
        '✓ Offline-Checklisten & Tierarzt-Notfallkarten'
      ],
      isPopular: true
    },
    business: {
      id: 'host_business',
      name: 'Local Host / Business',
      badge: 'Pionier Host',
      betaPrice: '0 €',
      betaPeriod: 'Kostenlos für Pionier-Partner',
      betaDescription: '🌟 Kostenlos für die ersten 50 registrierten Hosts & lokalen Cafés',
      livePrice: '29 €',
      livePeriod: '/ Monat',
      liveDescription: 'Hervorgehobenes Profil für tier- & familienfreundliche Betriebe',
      priceId: 'price_1P_biz_monthly',
      paymentLink: 'https://buy.stripe.com/test_host_business_monthly',
      ctaBeta: 'Pionier-Host werden (0 €) 🚀',
      ctaLive: 'Business Registrieren (29 €) 💳',
      features: [
        '✓ Hervorgehobenes Profil für B&Bs, Ferienhäuser & Cafés',
        '✓ "Familie & Hund Willkommen" Verifizierungs-Badge',
        '✓ Direkte Gästekontakte 100% ohne Buchungsprovision',
        '✓ Lokale Event- & Workshop-Angebote einstellen'
      ],
      isPopular: false
    }
  }
};

class StripeManager {
  constructor() {
    this.config = STRIPE_CONFIG;
    this.currentTier = localStorage.getItem('scratch_user_tier') || 'free';
  }

  isStripeEnabled() {
    return this.config.enabled;
  }

  getUserTier() {
    return this.currentTier;
  }

  isProUser() {
    return this.currentTier === 'pro_family' || this.currentTier === 'host_business';
  }

  // 1-Click Toggle between Beta Mode (Free/Prices Hidden) and Stripe Live Mode
  toggleMode(forceState = null) {
    const newState = forceState !== null ? forceState : !this.config.enabled;
    this.config.enabled = newState;
    localStorage.setItem('scratch_stripe_mode', newState ? 'true' : 'false');
    this.renderPricing();
    this.showToast(
      newState 
        ? '💳 Stripe Live-Modus AKTIVIERT (Kommerzielle Preise 7,99 € & 29 € sichtbar)' 
        : '🟢 Beta / Pre-Launch Modus AKTIVIERT (Preise verborgen — Kostenloser 0 € VIP-Zugang)'
    );
  }

  // Handle Checkout / Subscription Initiation
  async startCheckout(planKey) {
    const plan = this.config.plans[planKey];
    if (!plan) return;

    if (!this.config.enabled) {
      // BETA / PRE-LAUNCH MODE: Free 1-Click VIP activation
      this.currentTier = plan.id;
      localStorage.setItem('scratch_user_tier', plan.id);
      
      if (window.scratchDB) {
        window.scratchDB.logEvent('BETA_VIP_ACTIVATED', { plan: plan.id });
      }

      this.showBetaUnlockModal(plan);
      this.updateUserTierUI();
      return;
    }

    // STRIPE LIVE MODE:
    if (planKey === 'free') {
      window.location.href = 'app.html';
      return;
    }

    // Direct Stripe Checkout Redirect or Payment Link
    if (plan.paymentLink && plan.paymentLink.startsWith('https://buy.stripe.com/')) {
      window.open(plan.paymentLink, '_blank');
      return;
    }

    // Fallback if Stripe API backend is active
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, planId: plan.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Stripe Checkout Session bereit für ${plan.name}. Trage deine Stripe Live Keys in Vercel/GitHub Secrets ein.`);
      }
    } catch (err) {
      // Demo fallback in live mode
      this.showStripeReadyModal(plan);
    }
  }

  // Render Dynamic Pricing Cards in DOM
  renderPricing() {
    const isLive = this.config.enabled;
    const plans = this.config.plans;

    // Update Mode Banner & Toggle Button in pricing section
    const modeBadge = document.getElementById('pricingModeBadge');
    const toggleBtn = document.getElementById('pricingToggleBtn');
    
    if (modeBadge) {
      modeBadge.innerHTML = isLive
        ? '<span class="badge badge-emerald">💳 Stripe Live-Zahlung Aktiv</span>'
        : '<span class="badge badge-cyan">🌱 Pre-Launch Beta (Kostenloser Test)</span>';
    }

    if (toggleBtn) {
      toggleBtn.innerHTML = isLive
        ? '⇄ Zu Pre-Launch Beta wechseln (Preise verbergen)'
        : '⚡ 1-Klick: Stripe Live-Modus aktivieren (Preise einblenden)';
      toggleBtn.className = isLive ? 'btn btn-secondary' : 'btn btn-primary';
    }

    // Update Individual Plan Cards
    Object.keys(plans).forEach(key => {
      const plan = plans[key];
      
      const priceEl = document.getElementById(`price-val-${key}`);
      const periodEl = document.getElementById(`price-period-${key}`);
      const descEl = document.getElementById(`price-desc-${key}`);
      const ctaBtn = document.getElementById(`price-btn-${key}`);
      const badgeEl = document.getElementById(`price-badge-${key}`);

      if (priceEl) priceEl.textContent = isLive ? plan.livePrice : plan.betaPrice;
      if (periodEl) periodEl.textContent = isLive ? plan.livePeriod : plan.betaPeriod;
      if (descEl) descEl.textContent = isLive ? plan.liveDescription : plan.betaDescription;
      if (ctaBtn) {
        ctaBtn.textContent = isLive ? plan.ctaLive : plan.ctaBeta;
        ctaBtn.onclick = () => window.stripeManager.startCheckout(key);
      }
      if (badgeEl) {
        badgeEl.textContent = isLive ? (plan.isPopular ? 'Empfohlen' : '') : plan.badge;
        badgeEl.style.display = (isLive && !plan.isPopular) ? 'none' : 'inline-block';
      }
    });

    this.updateUserTierUI();
  }

  updateUserTierUI() {
    const tierBadge = document.getElementById('userTierBadge');
    if (tierBadge) {
      if (this.currentTier === 'pro_family') {
        tierBadge.innerHTML = '<span class="badge badge-emerald">✨ Pro VIP Mitglied</span>';
      } else if (this.currentTier === 'host_business') {
        tierBadge.innerHTML = '<span class="badge badge-gold">🌟 Business Host</span>';
      } else {
        tierBadge.innerHTML = '<span class="badge badge-cyan">Explorer (Free)</span>';
      }
    }
  }

  showBetaUnlockModal(plan) {
    let modal = document.getElementById('betaUnlockModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'betaUnlockModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 500px;">
        <span style="font-size: 3rem;">🎉</span>
        <h3 style="margin-top: 12px; font-size: 1.5rem;">Willkommen im ${plan.name}!</h3>
        <p style="color: var(--emerald-primary); font-weight: 600; margin: 8px 0 16px;">
          Kostenloser Early Bird VIP-Zugang freigeschaltet!
        </p>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">
          Da wir uns in der Pre-Launch Testphase befinden, stehen dir ab sofort <strong>alle Pro-Funktionen</strong> (Secret Spots Koordinaten, unbegrenzter KI Concierge & Scratchbook PDF) kostenlos zur Verfügung.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <a href="app.html" class="btn btn-primary" style="width: 100%;">Jetzt in der App testen 🚀</a>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }

  showStripeReadyModal(plan) {
    alert(`💳 Stripe Checkout bereit für ${plan.name} (${plan.livePrice}). Sobald deine Stripe Live Keys hinterlegt sind, startet der direkte Zahlungsflow.`);
  }

  showToast(message) {
    let toast = document.getElementById('scratchToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'scratchToast';
      toast.className = 'scratch-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}

window.stripeManager = new StripeManager();
window.toggleStripeMode = (force) => window.stripeManager.toggleMode(force);

document.addEventListener('DOMContentLoaded', () => {
  window.stripeManager.renderPricing();
});