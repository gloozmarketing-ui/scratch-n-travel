/**
 * Scratch'n'Travel --- Merch Shop Engine v1.0
 * Zeigt einen Merch-Shop-Modal mit allen verfuegbaren Produkten.
 * Verbindet mit /api/create-merch-checkout-session (Stripe Live).
 */

(function () {
  'use strict';

  const MERCH_CATALOG = [
    {
      id: 'badge_patch',
      priceId: 'price_1UA6SlPoNfLOPXfNLDhPeYJu',
      name: 'Travel Badge Patch',
      subtitle: 'Iron-On / Velcro - 75mm Circular',
      price: 14.99, emoji: '🏅', color: '#D4AF37',
      desc: 'Dein freigeschalteter Travel-Badge als gesticktes Iron-On Patch. Waschfest, Velcro + Buegelbar, 75mm Circular.',
      badge: 'Bestseller', badgeColor: '#D4AF37', sizes: null,
      deliveryDe: '4-6 Werktage (DE/AT/CH)'
    },
    {
      id: 'scratch_map_a2',
      priceId: 'price_1UA6SmPoNfLOPXfN606TubEM',
      name: 'Scratch-Off World Map',
      subtitle: 'A2 Poster - 42 x 59 cm',
      price: 34.99, emoji: '🗺️', color: '#14B8C3',
      desc: 'Obsidian & Gold Kratzkarte A2. 250g Kunstdruckpapier, UV-lackiert, gerollt versandt.',
      badge: 'Neuheit', badgeColor: '#14B8C3', sizes: null,
      deliveryDe: '5-7 Werktage'
    },
    {
      id: 'passport_booklet',
      priceId: 'price_1UA6SnPoNfLOPXfNjW7wVjdA',
      name: 'Luxury Travel Passport',
      subtitle: 'A5 Notizbuch - 120 Seiten',
      price: 24.99, emoji: '📔', color: '#8B6914',
      desc: 'Dein persoenliches Reisepass-Notizbuch A5. 120 Seiten, veganes Ledercover, individuelle Goldpraegung.',
      badge: 'Personalisiert', badgeColor: '#8B6914', sizes: null,
      deliveryDe: '6-9 Werktage'
    },
    {
      id: 'tshirt_local_legend',
      priceId: 'price_1UA6SoPoNfLOPXfN6KfnNkYU',
      name: 'Local Legend T-Shirt',
      subtitle: 'Unisex - 100% Bio-Baumwolle',
      price: 29.99, emoji: '👕', color: '#3B82F6',
      desc: 'Premium Unisex T-Shirt aus 100% Biobaumwolle (GOTS). Aufdruck: dein Badge + Scratch'n'Travel Logo.',
      badge: 'Nachhaltig', badgeColor: '#2E6B48',
      sizes: ['XS','S','M','L','XL','XXL'],
      deliveryDe: '4-6 Werktage'
    },
    {
      id: 'canvas_bag',
      priceId: 'price_1UA6SpPoNfLOPXfNbenQSVPl',
      name: 'Travel Canvas Bag',
      subtitle: '38 x 42 cm - Eco Canvas',
      price: 22.99, emoji: '🎒', color: '#059669',
      desc: 'Canvas-Shopper mit Weltkarte-Aufdruck deiner bereisten Laender. Oekologisch, robust.',
      badge: 'Eco', badgeColor: '#059669', sizes: null,
      deliveryDe: '4-6 Werktage'
    }
  ];

  let cart = [];
  let selectedSizes = {};

  window.openMerchShop = function () {
    cart = [];
    selectedSizes = {};
    renderModal();
  };

  function renderModal() {
    let modal = document.getElementById('merchShopModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'merchShopModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="modal-content" style="max-width:820px;width:95vw;max-height:92vh;overflow-y:auto;padding:0;border-radius:20px;background:var(--surface-2,#111);border:1px solid rgba(255,255,255,0.1);">
        <div style="padding:24px 28px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--surface-2,#111);z-index:10;">
          <div>
            <div style="font-size:1.5rem;font-weight:800;color:var(--text-main,#fff);">🛍️ Merch Shop</div>
            <div style="font-size:0.82rem;color:var(--text-muted,#999);margin-top:2px;">Scratch'n'Travel Official Store — Versand DE/AT/CH/EU</div>
          </div>
          <button onclick="document.getElementById('merchShopModal').style.display='none'" style="background:rgba(255,255,255,0.07);border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;color:#fff;font-size:1.2rem;">×</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;padding:20px;">
          ${MERCH_CATALOG.map(p => renderCard(p)).join('')}
        </div>
        <div id="merch-cart-bar" style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.3);display:none;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;position:sticky;bottom:0;">
          <div id="merch-cart-summary" style="font-size:0.88rem;color:#fff;"></div>
          <button onclick="startCheckout()" style="background:linear-gradient(135deg,#D4AF37,#B8960C);color:#000;border:none;border-radius:10px;padding:12px 28px;font-size:0.95rem;font-weight:800;cursor:pointer;">💳 Sicher zur Kasse →</button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';

    // Attach events
    MERCH_CATALOG.forEach(p => {
      if (p.sizes) {
        p.sizes.forEach(s => {
          const btn = document.getElementById('sz-' + p.id + '-' + s);
          if (btn) btn.addEventListener('click', () => selectSize(p, s));
        });
      }
      const addBtn = document.getElementById('add-' + p.id);
      if (addBtn) addBtn.addEventListener('click', () => addToCart(p));
    });
  }

  function renderCard(p) {
    return `
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="font-size:3rem;line-height:1;">${p.emoji}</div>
          <span style="background:${p.badgeColor}22;color:${p.badgeColor};border:1px solid ${p.badgeColor}55;border-radius:6px;padding:3px 8px;font-size:0.68rem;font-weight:700;">${p.badge}</span>
        </div>
        <div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--text-main,#fff);">${p.name}</div>
          <div style="font-size:0.78rem;color:${p.color};font-weight:600;margin-top:2px;">${p.subtitle}</div>
        </div>
        <p style="font-size:0.8rem;color:var(--text-muted,#999);line-height:1.5;margin:0;flex:1;">${p.desc}</p>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);">🚚 ${p.deliveryDe}</div>
        ${p.sizes ? `
          <div>
            <div style="font-size:0.72rem;color:#999;margin-bottom:6px;">Groesse waehlen:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${p.sizes.map(s => `<button id="sz-${p.id}-${s}" style="padding:4px 10px;border:1px solid rgba(255,255,255,0.2);border-radius:6px;background:transparent;color:#fff;font-size:0.78rem;cursor:pointer;">${s}</button>`).join('')}
            </div>
          </div>
        ` : ''}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:10px;border-top:1px solid rgba(255,255,255,0.07);">
          <div><span style="font-size:1.4rem;font-weight:800;color:#fff;">${p.price.toFixed(2)} €</span><span style="font-size:0.7rem;color:#666;margin-left:4px;">inkl. MwSt.</span></div>
          <button id="add-${p.id}" style="background:${p.color};color:#000;border:none;border-radius:8px;padding:10px 18px;font-size:0.85rem;font-weight:700;cursor:pointer;">🛒 Warenkorb</button>
        </div>
      </div>
    `;
  }

  function selectSize(p, size) {
    selectedSizes[p.id] = size;
    p.sizes.forEach(s => {
      const b = document.getElementById('sz-' + p.id + '-' + s);
      if (b) { b.style.background = s === size ? p.color : 'transparent'; b.style.color = s === size ? '#000' : '#fff'; }
    });
  }

  function addToCart(p) {
    if (p.sizes && !selectedSizes[p.id]) {
      const btn = document.getElementById('add-' + p.id);
      if (btn) { const o = btn.textContent; btn.textContent = '⚠️ Groesse waehlen!'; btn.style.background = '#ef4444'; btn.style.color = '#fff'; setTimeout(() => { btn.textContent = o; btn.style.background = p.color; btn.style.color = '#000'; }, 2000); }
      return;
    }
    const ex = cart.find(c => c.id === p.id && c.size === (selectedSizes[p.id] || null));
    if (ex) ex.quantity++; else cart.push({ id: p.id, priceId: p.priceId, name: p.name, price: p.price, quantity: 1, size: selectedSizes[p.id] || null });
    const btn = document.getElementById('add-' + p.id);
    if (btn) { const o = btn.textContent; btn.textContent = '✓ Hinzugefuegt!'; btn.style.background = '#22c55e'; btn.style.color = '#fff'; setTimeout(() => { btn.textContent = o; btn.style.background = p.color; btn.style.color = '#000'; }, 1500); }
    updateCartBar();
  }

  function updateCartBar() {
    const bar = document.getElementById('merch-cart-bar');
    const sum = document.getElementById('merch-cart-summary');
    if (!bar || !sum) return;
    if (cart.length === 0) { bar.style.display = 'none'; return; }
    const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
    const count = cart.reduce((s, c) => s + c.quantity, 0);
    sum.innerHTML = '<strong>' + count + ' Artikel</strong> &nbsp; ' + cart.map(c => c.name + (c.size ? ' (' + c.size + ')' : '') + ' x' + c.quantity).join(' · ') + ' &nbsp; <strong style="color:#D4AF37;">' + total.toFixed(2) + ' €</strong>';
    bar.style.display = 'flex';
  }

  async function startCheckout() {
    if (cart.length === 0) return;
    const items = cart.map(c => ({ priceId: c.priceId, quantity: c.quantity }));
    const user = JSON.parse(localStorage.getItem('scratch_user') || '{}');
    try {
      const res = await fetch('/api/create-merch-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, customerEmail: user.email || '', successUrl: window.location.origin + '/app.html?merch=success', cancelUrl: window.location.origin + '/app.html' }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Checkout-Fehler: ' + (data.error || 'Bitte erneut versuchen.'));
    } catch (e) { alert('Verbindungsfehler. Bitte versuche es erneut.'); }
  }

  // Auto-attach buttons with data attribute
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-merch-shop]').forEach(function (el) { el.addEventListener('click', window.openMerchShop); });
  });

})();
