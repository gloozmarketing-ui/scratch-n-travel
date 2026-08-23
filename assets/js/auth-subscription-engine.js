/**
 * Scratch'n'Travel — Auth, Subscription & Notification Engine v6.0
 * 
 * Covers:
 * - Full Login / Register / Password Reset flow
 * - Subscription feature gating (Free, Explorer, Family Pro, VIP Platin)
 * - Pre-launch VIP bonus for Family & Pet Pro early adopters
 * - Notification system (group messages, private messages, safety warning likes)
 * - B2B auth & dashboard
 */

(function () {
  'use strict';

  // ─── SUPABASE CONFIG ───────────────────────────────────────────────────────
  const SB_URL  = window.SUPABASE_URL  || 'https://acgfcjcikjlrlfilqdyk.supabase.co';
  const SB_KEY  = window.SUPABASE_ANON_KEY || '';

  async function sbFetch(endpoint, method, body, token) {
    try {
      const headers = {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + (token || SB_KEY),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };
      const opts = { method: method || 'GET', headers };
      if (body) opts.body = JSON.stringify(body);
      const r = await fetch(SB_URL + endpoint, opts);
      if (!r.ok) return null;
      const txt = await r.text();
      return txt ? JSON.parse(txt) : null;
    } catch (e) { return null; }
  }

  // ─── SUBSCRIPTION PLAN DEFINITIONS ────────────────────────────────────────
  const PLANS = {
    free: {
      id: 'free', label: 'Free Starter 🌱',
      price: 0, priceLabel: 'Kostenlos',
      scratch_card_limit: 5,
      wallet_limit: 3,
      color: '#64748B',
      features: {
        unlimitedScratchCards: false, walletUnlimited: false, gpxExport: false,
        aiConcierge: false, groupMatching: false, secretSpots: false,
        hazardFullModal: false, b2bPortal: false, budgetRadar: false,
        worldScratchStats: false, communityRoutes: false, communityChat: false,
        realtimeTranslation: false, diplomacyBadges: false
      }
    },
    explorer_pro: {
      id: 'explorer_pro', label: 'Explorer Pro 🌍',
      price: 4.99, priceLabel: '4,99 € / Monat',
      scratch_card_limit: 20,
      wallet_limit: 10,
      color: '#10B981',
      features: {
        unlimitedScratchCards: false, walletUnlimited: false, gpxExport: false,
        aiConcierge: true, groupMatching: true, secretSpots: false,
        hazardFullModal: false, b2bPortal: false, budgetRadar: true,
        worldScratchStats: false, communityRoutes: true, communityChat: true,
        realtimeTranslation: false, diplomacyBadges: false
      }
    },
    family_pet_pro: {
      id: 'family_pet_pro', label: 'Family & Pet Pro 🐾',
      price: 9.99, priceLabel: '9,99 € / Monat',
      scratch_card_limit: null,   // unlimited
      wallet_limit: null,          // unlimited (fixed: was 3, now truly unlimited)
      color: '#F59E0B',
      features: {
        unlimitedScratchCards: true, walletUnlimited: true, gpxExport: true,
        aiConcierge: true, groupMatching: true, secretSpots: true,
        hazardFullModal: true, b2bPortal: false, budgetRadar: true,
        worldScratchStats: true, communityRoutes: true, communityChat: true,
        realtimeTranslation: true, diplomacyBadges: false,
        countryBonusBatches: true   // exclusive country batch drops
      },
      // Pre-launch bonus: 6 months VIP Platin free after full launch
      prelaunch_bonus: 'vip_platin',
      prelaunch_bonus_months: 6
    },
    vip_platin: {
      id: 'vip_platin', label: 'VIP Platin ♾️',
      price: 19.99, priceLabel: '19,99 € / Monat',
      scratch_card_limit: null,
      wallet_limit: null,
      color: '#D4AF37',
      features: {
        unlimitedScratchCards: true, walletUnlimited: true, gpxExport: true,
        aiConcierge: true, groupMatching: true, secretSpots: true,
        hazardFullModal: true, b2bPortal: true, budgetRadar: true,
        worldScratchStats: true, communityRoutes: true, communityChat: true,
        realtimeTranslation: true, diplomacyBadges: true,
        countryBonusBatches: true, gpsBlurToggle: true,
        prioritySupport: true, localGuideVerification: true
      }
    },
    b2b_starter: {
      id: 'b2b_starter', label: 'B2B Beta Partner 🎁',
      price: 0, priceLabel: 'Kostenlos (Begrenzt)',
      isBusiness: true,
      color: '#14B8C3',
      features: { listing: true, analytics: false, promotedPin: false, customBadge: false, adBudget: 0 }
    },
    b2b_premium: {
      id: 'b2b_premium', label: 'B2B Vorab-Partner 🌟',
      price: 29, priceLabel: '29 € / Monat',
      regularPrice: 49,
      isBusiness: true,
      color: '#D4AF37',
      features: { listing: true, analytics: true, promotedPin: true, customBadge: true, adBudget: 50 }
    }
  };

  // B2B Slot Scarcity per City (simulated, later from Supabase)
  const B2B_CITY_SLOTS = {
    'Lissabon':  { total: 5, used: 3 },
    'Barcelona': { total: 5, used: 4 },
    'Ericeira':  { total: 5, used: 1 },
    'Sintra':    { total: 5, used: 2 },
    'Porto':     { total: 5, used: 0 },
    'Cascais':   { total: 5, used: 2 },
    'Sagres':    { total: 5, used: 0 },
    'Sesimbra':  { total: 5, used: 1 }
  };

  // ─── AUTH ENGINE ──────────────────────────────────────────────────────────
  class AuthEngine {
    constructor() {
      this.currentUser = null;
      this.notifications = [];
      this._loadSession();
    }

    _loadSession() {
      try {
        const stored = localStorage.getItem('snt_current_user');
        if (stored) {
          this.currentUser = JSON.parse(stored);
          this._applyPrelaunchBonus();
        }
      } catch (e) {}
    }

    _applyPrelaunchBonus() {
      const u = this.currentUser;
      if (!u) return;
      // Check if pre-launch VIP bonus is active
      if (u.pre_launch_vip_expires_at) {
        const expires = new Date(u.pre_launch_vip_expires_at);
        if (expires > new Date()) {
          u._original_plan = u.plan;
          u.plan = 'vip_platin';
          u.planLabel = 'VIP Platin ♾️ 🎁 (Bonus bis ' + expires.toLocaleDateString('de-DE') + ')';
          u.features = PLANS.vip_platin.features;
          // Notification: days remaining
          const daysLeft = Math.ceil((expires - new Date()) / 86400000);
          if (daysLeft <= 30) {
            this._addNotification({
              type: 'system',
              icon: '⏳',
              title: 'Dein VIP-Bonus endet bald',
              body: 'Noch ' + daysLeft + ' Tage VIP Platin. Jetzt für 19,99€/Mo upgraden!',
              action: { label: 'Jetzt upgraden', fn: () => window.stripeManager.openCheckout('vip_platin') }
            });
          }
        }
      }
    }

    isLoggedIn() { return !!this.currentUser; }

    hasFeature(featureKey) {
      if (!this.currentUser) return false;
      const plan = PLANS[this.currentUser.plan] || PLANS.free;
      return !!(plan.features && plan.features[featureKey]);
    }

    requireFeature(featureKey, planRequired) {
      if (this.hasFeature(featureKey)) return true;
      this.showUpgradePrompt(featureKey, planRequired);
      return false;
    }

    async loginWithEmail(email, password) {
      // Try Supabase Auth first
      const result = await sbFetch('/auth/v1/token?grant_type=password', 'POST', { email, password });
      if (result && result.access_token) {
        // Load user profile from DB
        const profile = await sbFetch('/rest/v1/user_profiles?email=eq.' + encodeURIComponent(email) + '&select=*', 'GET', null, result.access_token);
        const user = profile && profile[0] ? profile[0] : { email, plan: 'free', name: email.split('@')[0] };
        user.access_token = result.access_token;
        this._setSession(user);
        return { success: true, user };
      }

      // Fallback: check test accounts in localStorage
      const testAccounts = JSON.parse(localStorage.getItem('snt_test_accounts') || '[]');
      const b2bAccounts  = JSON.parse(localStorage.getItem('snt_b2b_accounts') || '[]');
      const all = [...testAccounts, ...b2bAccounts];
      const match = all.find(a => a.email === email && a.password === password);
      if (match) {
        this._setSession(match);
        return { success: true, user: match };
      }

      return { success: false, error: 'E-Mail oder Passwort falsch.' };
    }

    async loginWithGoogle() {
      if (SB_KEY) {
        window.location.href = SB_URL + '/auth/v1/authorize?provider=google&redirect_to=' + window.location.origin + '/auth/callback';
      } else {
        // Dev fallback
        const devUser = { id: 'google_dev', email: 'google.dev@test.com', name: 'Google Dev User', plan: 'vip_platin', avatar: '🧭' };
        this._setSession(devUser);
        this.showToast('✅ Google Login Simulation (Dev-Modus)');
      }
    }

    async registerUser(data) {
      // data: { email, password, name, plan, city, hobbies }
      const result = await sbFetch('/auth/v1/signup', 'POST', { email: data.email, password: data.password });
      
      const newUser = {
        id: 'user_' + Date.now(),
        email: data.email,
        name: data.name,
        plan: data.plan || 'free',
        planLabel: PLANS[data.plan || 'free'].label,
        city: data.city || '',
        hobbies: data.hobbies || [],
        xp: 0, level: 1, badges_count: 0,
        scratch_cards: 5, scratch_percent: 0,
        features: PLANS[data.plan || 'free'].features,
        // Pre-launch bonus for Family & Pet Pro
        pre_launch_vip_expires_at: data.plan === 'family_pet_pro' 
          ? new Date(Date.now() + 180 * 86400000).toISOString() // 6 months from now
          : null,
        registered_at: new Date().toISOString()
      };

      this._setSession(newUser);
      
      // Add welcome notification
      this._addNotification({
        type: 'welcome', icon: '🎉',
        title: 'Willkommen bei Scratch\'n\'Travel!',
        body: 'Dein Konto wurde erstellt. Rubbel deine erste Karte frei!',
        timestamp: new Date()
      });

      if (data.plan === 'family_pet_pro') {
        this._addNotification({
          type: 'bonus', icon: '🎁',
          title: '6 Monate VIP Platin gratis für dich!',
          body: 'Als Dankeschön für deine frühe Unterstützung erhältst du 6 Monate VIP Platin. Du wirst benachrichtigt, bevor es endet.',
          timestamp: new Date()
        });
      }

      return { success: true, user: newUser };
    }

    async registerB2B(data) {
      const citySlots = B2B_CITY_SLOTS[data.city] || { total: 5, used: 5 };
      const freeSlots = citySlots.total - citySlots.used;
      const plan = freeSlots > 0 ? 'b2b_starter' : 'b2b_premium';
      const isFree = freeSlots > 0;

      const newBiz = {
        id: 'b2b_' + Date.now(),
        type: 'b2b',
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        ownerName: data.ownerName,
        category: data.category,
        categoryLabel: B2B_CATEGORIES.find(c => c.id === data.category)?.label || data.category,
        avatar: B2B_CATEGORIES.find(c => c.id === data.category)?.icon || '🏢',
        city: data.city,
        region: data.region || '',
        address: data.address || '',
        description: data.description || '',
        perks: data.perks || '',
        contact: { whatsapp: data.whatsapp, email: data.email, website: data.website },
        rating: 5.0, reviews_count: 0, verified: false,
        plan: plan,
        planLabel: PLANS[plan].label,
        is_beta_partner: isFree,
        registered_at: new Date().toISOString(),
        features: PLANS[plan].features
      };

      // Update slot counter
      if (B2B_CITY_SLOTS[data.city]) B2B_CITY_SLOTS[data.city].used++;

      const existing = JSON.parse(localStorage.getItem('snt_b2b_accounts') || '[]');
      existing.push(newBiz);
      localStorage.setItem('snt_b2b_accounts', JSON.stringify(existing));

      this._setSession(newBiz);

      this._addNotification({
        type: isFree ? 'welcome' : 'system',
        icon: isFree ? '🎁' : '🌟',
        title: isFree ? 'Beta Partner Platz gesichert!' : 'Vorab-Partner Registrierung erfolgreich!',
        body: isFree
          ? 'Du bist einer der ersten kostenlosen Beta-Partner in ' + data.city + '. Dein Listing ist jetzt aktiv!'
          : 'Dein B2B Listing ist aktiv für 29 €/Monat (regulär 49 €). Jetzt konfigurieren!',
        timestamp: new Date()
      });

      return { success: true, business: newBiz, isFree, freeSlots: Math.max(0, freeSlots - 1) };
    }

    logout() {
      this.currentUser = null;
      localStorage.removeItem('snt_current_user');
      localStorage.removeItem('snt_plan');
      this.showToast('👋 Erfolgreich abgemeldet.');
      setTimeout(() => window.location.reload(), 800);
    }

    _setSession(user) {
      this.currentUser = user;
      localStorage.setItem('snt_current_user', JSON.stringify(user));
      localStorage.setItem('snt_plan', user.plan || 'free');
      this._applyPrelaunchBonus();
      this._updateNavState();
    }

    _updateNavState() {
      const u = this.currentUser;
      if (!u) return;
      const btn = document.getElementById('navLoginBtn');
      const nameEl = document.getElementById('navUserName');
      const planEl = document.getElementById('navUserPlan');
      if (btn) btn.style.display = 'none';
      if (nameEl) nameEl.textContent = u.name || u.businessName || 'Mein Konto';
      if (planEl) planEl.textContent = u.planLabel || '';
      document.getElementById('navUserArea') && (document.getElementById('navUserArea').style.display = 'flex');
      this._renderNotificationBell();
    }

    // ─── NOTIFICATION SYSTEM ──────────────────────────────────────────────
    _addNotification(n) {
      n.id = 'notif_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      n.read = false;
      n.timestamp = n.timestamp || new Date();
      this.notifications.unshift(n);
      if (this.notifications.length > 50) this.notifications.pop();
      localStorage.setItem('snt_notifications', JSON.stringify(this.notifications));
      this._playNotificationSound();
      this._renderNotificationBell();
    }

    addGroupMessage(groupName, senderName, preview) {
      this._addNotification({
        type: 'group_message', icon: '💬',
        title: '💬 ' + groupName,
        body: senderName + ': ' + preview,
        timestamp: new Date()
      });
    }

    addPrivateMessage(senderName, preview) {
      this._addNotification({
        type: 'private_message', icon: '✉️',
        title: '✉️ Nachricht von ' + senderName,
        body: preview,
        timestamp: new Date()
      });
    }

    addSafetyLike(warningTitle, likerName) {
      this._addNotification({
        type: 'safety_like', icon: '👍',
        title: '👍 Deine Warnung hilft der Community!',
        body: likerName + ' und andere haben deine Warnung "' + warningTitle + '" bestätigt.',
        timestamp: new Date()
      });
    }

    _loadNotifications() {
      try {
        const stored = localStorage.getItem('snt_notifications');
        this.notifications = stored ? JSON.parse(stored) : [];
      } catch (e) { this.notifications = []; }
    }

    get unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    }

    markAllRead() {
      this.notifications.forEach(n => n.read = true);
      localStorage.setItem('snt_notifications', JSON.stringify(this.notifications));
      this._renderNotificationBell();
    }

    _playNotificationSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {}
    }

    _renderNotificationBell() {
      const bell = document.getElementById('notifBell');
      if (!bell) return;
      const count = this.unreadCount;
      bell.innerHTML = '🔔' + (count > 0 ? '<span class="notif-badge">' + (count > 9 ? '9+' : count) + '</span>' : '');
    }

    // ─── UI MODALS ────────────────────────────────────────────────────────
    showLoginModal() {
      this._renderModal('authModal', this._buildLoginHTML());
    }

    showRegisterModal(preselectedPlan) {
      this._renderModal('authModal', this._buildRegisterHTML(preselectedPlan));
    }

    showB2BRegisterModal() {
      this._renderModal('b2bRegisterModal', this._buildB2BRegisterHTML());
    }

    showDashboard() {
      if (!this.isLoggedIn()) { this.showLoginModal(); return; }
      this._renderModal('dashboardModal', this._buildDashboardHTML());
    }

    showNotificationsPanel() {
      this._loadNotifications();
      this._renderModal('notifModal', this._buildNotificationsHTML());
      this.markAllRead();
    }

    showUpgradePrompt(featureKey, planRequired) {
      const plan = PLANS[planRequired || 'vip_platin'];
      this._renderModal('upgradeModal', `
        <div class="modal-content" style="max-width:480px;width:95%;text-align:center;">
          <div style="font-size:3rem;margin-bottom:8px;">🔒</div>
          <h3 style="color:#F8FAFC;font-size:1.4rem;margin-bottom:8px;">Dieses Feature ist gesperrt</h3>
          <p style="color:#94A3B8;margin-bottom:20px;">Schalte <strong style="color:#D4AF37;">${plan.label}</strong> frei, um dieses Feature zu nutzen.</p>
          <button class="btn btn-primary" style="width:100%;padding:12px;" onclick="window.authEngine.showRegisterModal('${plan.id}');document.getElementById('upgradeModal').style.display='none'">
            Jetzt ${plan.label} freischalten – ${plan.priceLabel}
          </button>
          <button class="btn btn-secondary" style="width:100%;padding:10px;margin-top:8px;" onclick="document.getElementById('upgradeModal').style.display='none'">Später</button>
        </div>
      `);
    }

    _buildLoginHTML() {
      return `
        <div class="modal-content" style="max-width:460px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('authModal').style.display='none'">×</button>
          <div style="text-align:center;margin-bottom:20px;">
            <span style="font-size:2.2rem;">🪙</span>
            <h3 style="color:#F8FAFC;font-size:1.5rem;margin:6px 0 4px;">Anmelden</h3>
            <p style="color:#94A3B8;font-size:0.85rem;">Deine Reise wartet auf dich.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
            <input id="loginEmail" type="email" placeholder="E-Mail Adresse" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
            <input id="loginPassword" type="password" placeholder="Passwort" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
          </div>
          <div style="text-align:right;margin-bottom:16px;">
            <a href="#" onclick="window.authEngine._showPasswordReset()" style="font-size:0.8rem;color:var(--emerald-primary);">Passwort vergessen?</a>
          </div>
          <button class="btn btn-primary" style="width:100%;padding:13px;font-size:1rem;margin-bottom:10px;" onclick="window.authEngine._handleLogin()">
            🔓 Einloggen
          </button>
          <button class="btn btn-secondary" style="width:100%;padding:12px;font-size:0.9rem;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="window.authEngine.loginWithGoogle()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Mit Google anmelden
          </button>
          <div style="text-align:center;color:#64748B;font-size:0.85rem;">
            Noch kein Konto? <a href="#" onclick="window.authEngine.showRegisterModal()" style="color:var(--emerald-primary);font-weight:700;">Jetzt registrieren</a>
          </div>
        </div>
      `;
    }

    _buildRegisterHTML(preselectedPlan) {
      const planOptions = Object.values(PLANS).filter(p => !p.isBusiness).map(p => 
        `<option value="${p.id}" ${p.id === (preselectedPlan || 'free') ? 'selected' : ''}>${p.label} – ${p.priceLabel}</option>`
      ).join('');

      return `
        <div class="modal-content" style="max-width:500px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('authModal').style.display='none'">×</button>
          <div style="text-align:center;margin-bottom:20px;">
            <span style="font-size:2.2rem;">🌍</span>
            <h3 style="color:#F8FAFC;font-size:1.5rem;margin:6px 0 4px;">Konto erstellen</h3>
            <p style="color:#94A3B8;font-size:0.85rem;">Tritt der Scratch\'n\'Travel Community bei.</p>
          </div>
          
          <div id="registerPrelaunchBanner" style="background:linear-gradient(135deg,rgba(212,175,55,0.15),rgba(16,185,129,0.1));border:1px solid #D4AF37;border-radius:12px;padding:12px 16px;margin-bottom:16px;display:none;">
            <div style="font-size:0.82rem;color:#D4AF37;font-weight:800;">🎁 PRE-LAUNCH BONUS: Family & Pet Pro</div>
            <div style="font-size:0.78rem;color:#94A3B8;margin-top:2px;">Du erhältst <strong style="color:#F8FAFC;">6 Monate VIP Platin gratis</strong> als Dankeschön für deine frühe Unterstützung!</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
            <input id="regName" type="text" placeholder="Vorname & Nachname" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
            <input id="regEmail" type="email" placeholder="E-Mail Adresse" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
            <input id="regPassword" type="password" placeholder="Passwort (min. 8 Zeichen)" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
            <select id="regPlan" onchange="window.authEngine._onPlanChange(this.value)" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
              ${planOptions}
            </select>
            <input id="regCity" type="text" placeholder="Deine Heimatstadt (optional)" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-size:0.95rem;">
          </div>
          <button class="btn btn-primary" style="width:100%;padding:13px;font-size:1rem;" onclick="window.authEngine._handleRegister()">
            🚀 Konto erstellen & loslegen
          </button>
          <div style="text-align:center;color:#64748B;font-size:0.85rem;margin-top:12px;">
            Bereits registriert? <a href="#" onclick="window.authEngine.showLoginModal()" style="color:var(--emerald-primary);font-weight:700;">Einloggen</a>
          </div>
        </div>
      `;
    }

    _onPlanChange(planId) {
      const banner = document.getElementById('registerPrelaunchBanner');
      if (banner) banner.style.display = planId === 'family_pet_pro' ? 'block' : 'none';
    }

    _buildB2BRegisterHTML() {
      const catOptions = B2B_CATEGORIES.map(c =>
        `<option value="${c.id}">${c.icon} ${c.label}</option>`
      ).join('');

      const cityOptions = Object.keys(B2B_CITY_SLOTS).map(city => {
        const slots = B2B_CITY_SLOTS[city];
        const free = slots.total - slots.used;
        const label = free > 0 ? city + ' – 🟢 Noch ' + free + ' kostenlose Plätze' : city + ' – 🟡 Kostenpflichtig (29 €/Mo)';
        return `<option value="${city}">${label}</option>`;
      }).join('');

      return `
        <div class="modal-content" style="max-width:560px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('b2bRegisterModal').style.display='none'">×</button>
          <div style="text-align:center;margin-bottom:16px;">
            <span style="font-size:2rem;">🌟</span>
            <h3 style="color:#F8FAFC;font-size:1.4rem;margin:6px 0 4px;">Als Host / Betrieb Eintragen</h3>
            <p style="color:#94A3B8;font-size:0.82rem;">0% Provision · Direktbuchung · 130 Hobby-DNA Zielgruppe</p>
          </div>

          <div style="background:linear-gradient(135deg,rgba(212,175,55,0.12),rgba(20,184,195,0.08));border:1px solid #D4AF37;border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;gap:12px;align-items:center;">
            <span style="font-size:1.6rem;">🎁</span>
            <div>
              <div style="font-size:0.8rem;color:#D4AF37;font-weight:800;">EXKLUSIVER VORAB-ZUGANG</div>
              <div style="font-size:0.78rem;color:#94A3B8;">Erste 3–5 Betriebe pro Stadt: <strong style="color:#10B981;">KOSTENLOS</strong>. Danach: <strong style="color:#F8FAFC;">29 €/Monat</strong> <span style="text-decoration:line-through;color:#64748B;">regulär 49 €</span></div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
            <input id="b2bBusinessName" type="text" placeholder="Name des Betriebs *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <input id="b2bOwnerName" type="text" placeholder="Dein Name (Inhaber/Kontakt) *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <select id="b2bCategory" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">${catOptions}</select>
            <select id="b2bCity" onchange="window.authEngine._updateB2BSlotInfo(this.value)" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">${cityOptions}</select>
            <div id="b2bSlotInfo" style="font-size:0.78rem;color:#10B981;padding:6px 10px;background:rgba(16,185,129,0.08);border-radius:8px;border:1px solid rgba(16,185,129,0.2);"></div>
            <textarea id="b2bDescription" rows="2" placeholder="Kurzbeschreibung deines Betriebs *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);font-family:inherit;resize:none;"></textarea>
            <input id="b2bPerks" type="text" placeholder="Exklusiver Vorteil für SNT-Gäste (z.B. 10% Rabatt) *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <input id="b2bWhatsapp" type="text" placeholder="WhatsApp / Telefon" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <input id="b2bWebsite" type="text" placeholder="Website / Buchungs-URL (optional)" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <input id="b2bEmail" type="email" placeholder="E-Mail Adresse (Login) *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
            <input id="b2bPassword" type="password" placeholder="Passwort (min. 8 Zeichen) *" style="padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);">
          </div>
          <button class="btn btn-primary" style="width:100%;padding:13px;font-size:1rem;background:linear-gradient(135deg,#D4AF37,#F59E0B);color:#000;border:none;" onclick="window.authEngine._handleB2BRegister()">
            🌟 Platz Sichern & Listing Aktivieren →
          </button>
          <p style="text-align:center;color:#64748B;font-size:0.75rem;margin-top:10px;">Kein automatisches Abonnement · Du wirst zuerst kontaktiert</p>
        </div>
      `;
    }

    _updateB2BSlotInfo(city) {
      const slots = B2B_CITY_SLOTS[city] || { total: 5, used: 5 };
      const free = slots.total - slots.used;
      const el = document.getElementById('b2bSlotInfo');
      if (!el) return;
      if (free > 0) {
        el.innerHTML = '🟢 <strong>' + free + ' kostenlose Beta-Plätze</strong> in ' + city + ' verfügbar!';
        el.style.color = '#10B981';
      } else {
        el.innerHTML = '🟡 Alle kostenlosen Plätze in ' + city + ' vergeben. Nächster Schritt: <strong>29 €/Monat</strong> (statt 49 €).';
        el.style.color = '#F59E0B';
      }
    }

    _buildDashboardHTML() {
      const u = this.currentUser;
      const plan = PLANS[u.plan] || PLANS.free;
      const isBiz = u.type === 'b2b';

      if (isBiz) return this._buildB2BDashboardHTML(u);

      return `
        <div class="modal-content" style="max-width:680px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('dashboardModal').style.display='none'">×</button>
          
          <!-- User Header -->
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border-line);">
            <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${plan.color}22,${plan.color}44);border:2px solid ${plan.color};display:flex;align-items:center;justify-content:center;font-size:1.8rem;">${u.avatar || '🧭'}</div>
            <div>
              <div style="font-size:1.2rem;font-weight:800;color:var(--text-main);">${u.name || u.email}</div>
              <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
                <span class="badge" style="background:${plan.color}22;color:${plan.color};border:1px solid ${plan.color};">${u.planLabel || plan.label}</span>
                <span style="font-size:0.78rem;color:var(--text-dim);">Level ${u.level || 1} · ${u.xp || 0} XP</span>
              </div>
            </div>
            <button class="btn btn-secondary" style="margin-left:auto;padding:8px 14px;font-size:0.8rem;" onclick="window.authEngine.logout()">Abmelden</button>
          </div>

          <!-- Stats Row -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">
            ${this._statCard('🪙', u.scratch_cards || 0, 'Rubbelkarten')}
            ${this._statCard('🏆', u.badges_count || 0, 'Badges')}
            ${this._statCard('🌍', (u.scratch_percent || 0) + '%', 'Welt gerubbelt')}
            ${this._statCard('🌐', u.continents || 0, 'Kontinente')}
          </div>

          <!-- Notifications Preview -->
          <div style="background:var(--bg-surface);border-radius:14px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <div style="font-size:0.9rem;font-weight:700;color:var(--text-main);">🔔 Benachrichtigungen</div>
              <span class="badge badge-emerald">${this.unreadCount} ungelesen</span>
            </div>
            ${this.notifications.slice(0,3).map(n => `
              <div style="padding:10px;border-radius:10px;background:var(--bg-card);margin-bottom:8px;border-left:3px solid var(--emerald-primary);">
                <div style="font-size:0.8rem;font-weight:700;color:var(--text-main);">${n.icon} ${n.title}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${n.body}</div>
              </div>
            `).join('') || '<div style="color:var(--text-dim);font-size:0.82rem;">Keine Benachrichtigungen.</div>'}
            <button class="btn btn-secondary" style="width:100%;padding:8px;font-size:0.8rem;margin-top:8px;" onclick="window.authEngine.showNotificationsPanel()">Alle Benachrichtigungen →</button>
          </div>

          <!-- Quick Actions -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn btn-secondary" style="padding:10px;" onclick="document.getElementById('dashboardModal').style.display='none'">🗺️ Karte erkunden</button>
            <button class="btn btn-secondary" style="padding:10px;" onclick="document.getElementById('dashboardModal').style.display='none'">🏆 Meine Badges</button>
            <button class="btn btn-secondary" style="padding:10px;" onclick="document.getElementById('dashboardModal').style.display='none'">💬 Gruppen-Chat</button>
            <button class="btn btn-primary" style="padding:10px;" onclick="window.authEngine.showUpgradePrompt('', 'vip_platin')">⬆️ Plan upgraden</button>
          </div>
        </div>
      `;
    }

    _buildB2BDashboardHTML(u) {
      return `
        <div class="modal-content" style="max-width:640px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('dashboardModal').style.display='none'">×</button>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-line);">
            <div style="font-size:2.5rem;">${u.avatar || '🏢'}</div>
            <div>
              <div style="font-size:1.2rem;font-weight:800;color:var(--text-main);">${u.businessName}</div>
              <div style="font-size:0.82rem;color:var(--text-muted);">${u.categoryLabel} · ${u.city}</div>
              <span class="badge badge-gold" style="margin-top:4px;">${u.planLabel}</span>
              ${u.verified ? '<span class="badge badge-emerald" style="margin-left:6px;">✅ Verifiziert</span>' : '<span class="badge" style="background:#F59E0B22;color:#F59E0B;border:1px solid #F59E0B;margin-left:6px;">⏳ Verifizierung ausstehend</span>'}
            </div>
            <button class="btn btn-secondary" style="margin-left:auto;padding:8px 14px;font-size:0.8rem;" onclick="window.authEngine.logout()">Abmelden</button>
          </div>

          <!-- Business Stats -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
            ${this._statCard('👁️', u.views || 0, 'Profilaufrufe')}
            ${this._statCard('💬', u.inquiries || 0, 'Anfragen')}
            ${this._statCard('⭐', (u.rating || 5.0).toFixed(1), 'Bewertung')}
          </div>

          <!-- Listing Preview -->
          <div style="background:var(--bg-surface);border-radius:14px;padding:16px;margin-bottom:16px;">
            <div style="font-size:0.88rem;font-weight:700;color:var(--text-main);margin-bottom:10px;">📋 Dein Listing</div>
            <div style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;">${u.description || 'Noch keine Beschreibung.'}</div>
            <div style="margin-top:10px;padding:8px 12px;background:rgba(16,185,129,0.1);border-radius:8px;font-size:0.8rem;color:#10B981;">
              🎁 Exklusiver Gäste-Vorteil: ${u.perks || 'Noch nicht konfiguriert.'}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn btn-secondary" style="padding:10px;font-size:0.85rem;">✏️ Listing bearbeiten</button>
            <button class="btn btn-primary" style="padding:10px;font-size:0.85rem;">📸 Fotos hochladen</button>
          </div>
        </div>
      `;
    }

    _buildNotificationsHTML() {
      return `
        <div class="modal-content" style="max-width:520px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('notifModal').style.display='none'">×</button>
          <h3 style="color:var(--text-main);font-size:1.3rem;margin-bottom:16px;">🔔 Benachrichtigungen</h3>
          ${this.notifications.length === 0 
            ? '<div style="text-align:center;color:var(--text-dim);padding:32px;">Keine Benachrichtigungen vorhanden.</div>'
            : this.notifications.map(n => `
              <div style="padding:14px;border-radius:12px;background:var(--bg-surface);margin-bottom:10px;border-left:3px solid ${n.read ? 'var(--border-line)' : 'var(--emerald-primary)'};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                  <div style="font-size:0.85rem;font-weight:700;color:var(--text-main);">${n.icon} ${n.title}</div>
                  <span style="font-size:0.7rem;color:var(--text-dim);">${this._timeAgo(n.timestamp)}</span>
                </div>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;line-height:1.5;">${n.body}</div>
              </div>
            `).join('')}
        </div>
      `;
    }

    _statCard(icon, value, label) {
      return `<div style="background:var(--bg-surface);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:1.4rem;">${icon}</div>
        <div style="font-size:1.3rem;font-weight:800;color:var(--text-main);">${value}</div>
        <div style="font-size:0.72rem;color:var(--text-dim);">${label}</div>
      </div>`;
    }

    _timeAgo(ts) {
      const d = new Date(ts);
      const secs = Math.floor((Date.now() - d) / 1000);
      if (secs < 60) return 'Gerade eben';
      if (secs < 3600) return Math.floor(secs/60) + ' Min. her';
      if (secs < 86400) return Math.floor(secs/3600) + ' Std. her';
      return d.toLocaleDateString('de-DE');
    }

    async _handleLogin() {
      const email = document.getElementById('loginEmail')?.value?.trim();
      const password = document.getElementById('loginPassword')?.value;
      if (!email || !password) { this.showToast('⚠️ E-Mail und Passwort eingeben.'); return; }
      
      const btn = document.querySelector('#authModal .btn-primary');
      if (btn) { btn.disabled = true; btn.textContent = '⏳ Einloggen...'; }
      
      const result = await this.loginWithEmail(email, password);
      
      if (result.success) {
        document.getElementById('authModal').style.display = 'none';
        this._updateNavState();
        this.showToast('✅ Willkommen zurück, ' + (result.user.name || result.user.businessName || '') + '!');
        setTimeout(() => this.showDashboard(), 800);
      } else {
        this.showToast('❌ ' + result.error);
        if (btn) { btn.disabled = false; btn.textContent = '🔓 Einloggen'; }
      }
    }

    async _handleRegister() {
      const name = document.getElementById('regName')?.value?.trim();
      const email = document.getElementById('regEmail')?.value?.trim();
      const password = document.getElementById('regPassword')?.value;
      const plan = document.getElementById('regPlan')?.value;
      const city = document.getElementById('regCity')?.value?.trim();

      if (!name || !email || !password) { this.showToast('⚠️ Bitte alle Pflichtfelder ausfüllen.'); return; }
      if (password.length < 8) { this.showToast('⚠️ Passwort muss mind. 8 Zeichen haben.'); return; }

      const result = await this.registerUser({ name, email, password, plan, city });
      if (result.success) {
        document.getElementById('authModal').style.display = 'none';
        this._updateNavState();
        this.showToast('🎉 Willkommen, ' + name + '! Dein Konto wurde erstellt.');
        setTimeout(() => this.showDashboard(), 800);
      }
    }

    async _handleB2BRegister() {
      const data = {
        businessName: document.getElementById('b2bBusinessName')?.value?.trim(),
        ownerName: document.getElementById('b2bOwnerName')?.value?.trim(),
        category: document.getElementById('b2bCategory')?.value,
        city: document.getElementById('b2bCity')?.value,
        description: document.getElementById('b2bDescription')?.value?.trim(),
        perks: document.getElementById('b2bPerks')?.value?.trim(),
        whatsapp: document.getElementById('b2bWhatsapp')?.value?.trim(),
        website: document.getElementById('b2bWebsite')?.value?.trim(),
        email: document.getElementById('b2bEmail')?.value?.trim(),
        password: document.getElementById('b2bPassword')?.value
      };

      if (!data.businessName || !data.ownerName || !data.description || !data.perks || !data.email || !data.password) {
        this.showToast('⚠️ Bitte alle Pflichtfelder ausfüllen.'); return;
      }

      const result = await this.registerB2B(data);
      if (result.success) {
        document.getElementById('b2bRegisterModal').style.display = 'none';
        this.showToast(result.isFree
          ? '🎁 Beta-Platz gesichert! Dein Listing ist aktiv.'
          : '🌟 Vorab-Partner Platz gesichert für 29 €/Monat!'
        );
        setTimeout(() => this.showDashboard(), 800);
      }
    }

    _showPasswordReset() {
      this._renderModal('authModal', `
        <div class="modal-content" style="max-width:420px;width:95%;">
          <button class="modal-close" onclick="document.getElementById('authModal').style.display='none'">×</button>
          <div style="text-align:center;margin-bottom:16px;">
            <span style="font-size:2rem;">🔑</span>
            <h3 style="color:var(--text-main);font-size:1.3rem;margin:6px 0 4px;">Passwort zurücksetzen</h3>
            <p style="color:var(--text-muted);font-size:0.82rem;">Wir senden dir einen Reset-Link per E-Mail.</p>
          </div>
          <input id="resetEmail" type="email" placeholder="Deine E-Mail Adresse" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--border-line);background:var(--bg-input);color:var(--text-main);margin-bottom:12px;box-sizing:border-box;">
          <button class="btn btn-primary" style="width:100%;padding:12px;" onclick="window.authEngine._sendPasswordReset()">📧 Reset-Link senden</button>
          <button class="btn btn-secondary" style="width:100%;padding:10px;margin-top:8px;" onclick="window.authEngine.showLoginModal()">← Zurück</button>
        </div>
      `);
    }

    async _sendPasswordReset() {
      const email = document.getElementById('resetEmail')?.value?.trim();
      if (!email) { this.showToast('⚠️ E-Mail eingeben.'); return; }
      await sbFetch('/auth/v1/recover', 'POST', { email });
      document.getElementById('authModal').style.display = 'none';
      this.showToast('📧 Reset-Link gesendet! Prüfe dein Postfach.');
    }

    _renderModal(id, html) {
      let m = document.getElementById(id);
      if (!m) {
        m = document.createElement('div');
        m.id = id;
        m.className = 'modal-overlay';
        document.body.appendChild(m);
      }
      m.innerHTML = html;
      m.style.display = 'flex';
    }

    showToast(msg) {
      let t = document.getElementById('sntToast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'sntToast';
        t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E293B;color:#F8FAFC;padding:12px 20px;border-radius:12px;font-size:0.88rem;font-weight:600;z-index:9999;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 24px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      clearTimeout(t._timeout);
      t._timeout = setTimeout(() => t.style.opacity = '0', 3500);
    }
  }

  // ─── B2B CATEGORIES ───────────────────────────────────────────────────────
  const B2B_CATEGORIES = [
    { id: 'hotel',          icon: '🏨', label: 'Hotel / Boutique Hotel' },
    { id: 'apartment',      icon: '🏠', label: 'Ferienwohnung / Apartment / Villa' },
    { id: 'restaurant',     icon: '🍽️', label: 'Restaurant / Tasca / Café / Bar' },
    { id: 'surf_school',    icon: '🏄', label: 'Surfschule & Board Verleih' },
    { id: 'diving_club',    icon: '🤿', label: 'Tauchen & Schnorcheln' },
    { id: 'scooter_rent',   icon: '🛵', label: 'E-Scooter & Motorrad Verleih' },
    { id: 'car_rent',       icon: '🚗', label: 'Auto Vermietung / Car Sharing' },
    { id: 'atv_jeep',       icon: '🚙', label: 'ATV / Jeep / Geländefahrzeug Tours' },
    { id: 'yacht_boat',     icon: '⛵', label: 'Yacht / Boot / Katamaran Charter' },
    { id: 'kayak_sup',      icon: '🛶', label: 'Kajak & Stand-Up-Paddling' },
    { id: 'skydiving',      icon: '🪂', label: 'Fallschirmspringen / Paragliding' },
    { id: 'climbing',       icon: '🧗', label: 'Kletterpark & Felsklettern' },
    { id: 'horse_riding',   icon: '🐴', label: 'Reiterhof & Reitkurse' },
    { id: 'spa_wellness',   icon: '💆', label: 'Spa / Wellness / Yoga Center' },
    { id: 'tour_guide',     icon: '🧭', label: 'Tourguide & Stadtführungen' },
    { id: 'photo_tour',     icon: '📸', label: 'Foto-Tour & Filmproduktion' },
    { id: 'cooking_class',  icon: '👨‍🍳', label: 'Kochkurs / Wine & Food Tour' },
    { id: 'esim_shop',      icon: '📱', label: 'eSIM / SIM-Karten Verkauf' },
    { id: 'boutique',       icon: '🛍️', label: 'Boutique / Souvenir / Local Shop' },
    { id: 'co_working',     icon: '💻', label: 'Coworking Space' },
    { id: 'other',          icon: '🌍', label: 'Sonstiges / Andere Kategorie' }
  ];

  // ─── INIT ─────────────────────────────────────────────────────────────────
  window.authEngine = new AuthEngine();
  window.authEngine._loadNotifications();

  // Seed demo notifications for test accounts
  if (window.authEngine.isLoggedIn() && window.authEngine.notifications.length === 0) {
    window.authEngine.addGroupMessage('🏄 Surfing & Waves', 'Marco V.', 'Wer ist morgen früh in Guincho? Wind-Forecast sieht 🔥 aus!');
    window.authEngine.addPrivateMessage('Sofia L.', 'Hey! Hast du die neue Route in Alfama ausprobiert?');
    window.authEngine.addSafetyLike('Taschendiebe Tram 28', '42 Reisende');
  }

  // Listen for DOMContentLoaded to inject nav elements
  document.addEventListener('DOMContentLoaded', function () {
    window.authEngine._updateNavState();

    // Wire up B2B register button
    const b2bBtn = document.getElementById('b2bRegisterBtn') || document.querySelector('[data-action="b2b-register"]');
    if (b2bBtn) b2bBtn.addEventListener('click', () => window.authEngine.showB2BRegisterModal());

    // Notification bell
    const bell = document.getElementById('notifBell');
    if (bell) bell.addEventListener('click', () => window.authEngine.showNotificationsPanel());

    // Nav login button
    const navLoginBtn = document.getElementById('navLoginBtn');
    if (navLoginBtn) navLoginBtn.addEventListener('click', () => window.authEngine.showLoginModal());

    // Nav user area (mein konto)
    const navUserArea = document.getElementById('navUserArea');
    if (navUserArea) navUserArea.addEventListener('click', () => window.authEngine.showDashboard());
  });

})();
