/**
 * Scratch'n'Travel — B2B Host & Local Business Portal Engine v2.0
 * 
 * Supports 20+ Business & Rental Categories:
 * - 🏡 Living: Apartments, Boutique Hotels, Glamping, Camper Stellplätze
 * - 🍲 Gastro: Trad. Tascas, Cafés, Weinbars, Vegan/Bio
 * - 🏄‍♂️ Water: Surfschulen, Diving/Tauchkurse, Yacht-Charter, Kajak/SUP, Kitesurf
 * - 🛵 Rentals: Scooter/Vespa, Mietwagen, ATV/Quad Safari, E-Bikes
 * - 🪂 Action & Extreme: Fallschirmspringen/Paragliding, Klettern/Canyoning, Reiten, Angeln
 * - 🧘 Wellness & Culture: Yoga, Hamam/Spa, Private Fototouren & Local Guides
 * 
 * 0% Commission Direct Booking Leads, 130 Hobby-DNA Auto-Matching & Verified VIP Partner Gold Badge
 */

(function () {
  'use strict';

  const BIZ_CATEGORIES = {
    // 🏡 Living & Accommodations
    apartment:   { label: '🏡 Ferienwohnung & Apartment', group: 'stay',    badge: '🏡 Apartment mit Meerblick' },
    hotel:       { label: '🏨 Boutique Hotel & B&B',      group: 'stay',    badge: '🏨 Boutique Hotel' },
    glamping:    { label: '🏕️ Glamping & Eco-Lodges',     group: 'stay',    badge: '🏕️ Eco-Glamping' },
    camper:      { label: '🚐 Campervan & Van-Stellplatz',group: 'stay',    badge: '🚐 Van-Stellplatz & Camp' },

    // 🍲 Gastronomy & Drinks
    restaurant:  { label: '🍲 Restaurant & Kiez-Tasca',   group: 'food',    badge: '🍲 Trad. Tasca & Fisch' },
    cafe:        { label: '☕ Café & Bakery',             group: 'food',    badge: '☕ Specialty Coffee & Bakery' },
    wine:        { label: '🍷 Wein-Bar & Bodega',         group: 'food',    badge: '🍷 Wein-Bar & Tapas' },

    // 🏄‍♂️ Watersports & Marine
    surf:        { label: '🏄‍♂️ Surfschule & Wave-Camps',   group: 'water',   badge: '🏄‍♂️ Surfschule & Coaching' },
    diving:      { label: '🤿 Tauchschule & Diving-Kurse', group: 'water',   badge: '🤿 Tauchschule & PADI Kurse' },
    yacht:       { label: '⛵ Yacht-Charter & Segeltrips', group: 'yacht',   badge: '⛵ Private Yacht-Charter' },
    kayak:       { label: '🛶 Kajak & SUP-Verleih',       group: 'water',   badge: '🛶 Kajak & Höhlen-Touren' },
    kitesurf:    { label: '🪁 Kitesurf & Wingfoil',       group: 'water',   badge: '🪁 Kitesurf & Wingfoil' },

    // 🛵 Mobility & Rentals
    scooter:     { label: '🛵 Scooter- & Vespa-Verleih',  group: 'rental',  badge: '🛵 Vespa & Scooter-Rental' },
    car_rental:  { label: '🚗 Mietwagen & Buggy-Rent',    group: 'rental',  badge: '🚗 Mietwagen & Cabrio' },
    atv_quad:    { label: '🏍️ ATV & Quad Safari',        group: 'rental',  badge: '🏍️ Offroad ATV & Quad Safari' },
    bike:        { label: '🚲 E-Bike & Mountainbike',     group: 'rental',  badge: '🚲 E-Bike & Trail-Rental' },

    // 🪂 Action & Outdoor Extreme
    skydiving:   { label: '🪂 Fallschirmspringen & Tandem',group: 'extreme',badge: '🪂 Skydiving & Tandemsprung' },
    paragliding: { label: '🪂 Paragliding & Gleitschirm', group: 'extreme', badge: '🪂 Klippen-Paragliding' },
    climbing:    { label: '🧗 Klettern & Canyoning',      group: 'extreme', badge: '🧗 Kletter-Guide & Canyoning' },
    horse:       { label: '🐎 Strand-Reiten & Touren',    group: 'extreme', badge: '🐎 Strand-Reiten im Sonnenuntergang' },
    fishing:     { label: '🎣 Hochsee-Angeln & Bootstour',group: 'water',   badge: '🎣 Big Game Hochsee-Angeln' },

    // 🧘 Wellness, Spa & Culture
    yoga:        { label: '🧘 Yoga-Retreat & Wellness',   group: 'wellness',badge: '🧘 Yoga & Sound Bath' },
    hamam:       { label: '💆 Hamam & Spa-Rituale',       group: 'wellness',badge: '💆 Trad. Hamam & Massage' },
    photo_tour:  { label: '📸 Fototouren & Private Guide',group: 'culture', badge: '📸 Insider-Fototour' }
  };

  const DEFAULT_HOST_PARTNERS = [
    // 1. Apartment
    {
      id: 'host_casa_alfama',
      name: 'Casa do Miradouro Apartment',
      category: 'apartment',
      city: 'Lissabon / Alfama',
      rating: 4.95,
      reviewsCount: 38,
      dnaTags: ['h1', 'h10', 'h25', 'h74'],
      perk: '🎁 10% Rabatt & Flasche Vinho Verde für Scratch'n'Travel VIP-Gäste',
      desc: 'Romantisches Altstadt-Studio mit privater Dachterrasse über den Dächern von Alfama. Perfekt für Paare & Digital Nomads.',
      contact: 'WhatsApp: +351 912 345 678 | direct@casa-alfama.pt',
      isVipPartner: true
    },
    // 2. Surf School
    {
      id: 'host_guincho_surf',
      name: 'Guincho Wave Hunters Surf School',
      category: 'surf',
      city: 'Lissabon / Cascais',
      rating: 5.0,
      reviewsCount: 64,
      dnaTags: ['h1', 'h2', 'h3', 'h20'],
      perk: '🎁 Kostenloser Neoprenanzug & Board-Upgrade zum Kurs',
      desc: 'Individuelles Coaching in Kleingruppen (max. 4 Personen). Lokale Surf-Guides mit 15 Jahren Atlantik-Erfahrung bei Guincho & Ericeira.',
      contact: 'Tel: +351 933 888 999 | www.guinchowavehunters.com',
      isVipPartner: true
    },
    // 3. Scooter & Vespa Rental
    {
      id: 'host_vespa_lisboa',
      name: 'Alfama Vintage Vespa & Scooter Rental',
      category: 'scooter',
      city: 'Lissabon / Chiado',
      rating: 4.9,
      reviewsCount: 47,
      dnaTags: ['h1', 'h74', 'h109'],
      perk: '🎁 1 Gratis-Tag bei 4 Tagen Miete + 2 Retro-Helme inklusive',
      desc: '125cc Vintage Vespas & Elektro-Scooter. Perfekt um die 7 Hügel Lissabons, Belem und die Küstenstraße nach Sintra staufrei zu erkunden.',
      contact: 'WhatsApp: +351 925 111 222 | info@lisbonvespas.pt',
      isVipPartner: true
    },
    // 4. Yacht & Sailing Charter
    {
      id: 'host_atlantic_yacht',
      name: 'Blue Pearl Sailing & Yacht Charter',
      category: 'yacht',
      city: 'Lissabon / Cascais Marina',
      rating: 5.0,
      reviewsCount: 31,
      dnaTags: ['h1', 'h20', 'h30'],
      perk: '🎁 Sunset-Champagner & Tapas-Platte gratis bei Privatcharter',
      desc: 'Exklusive 45-Fuß Segelyacht für Delfin-Beobachtung, Klippensegeln nach Cabo da Roca oder private Sunset-Cruises auf dem Tejo.',
      contact: 'Tel: +351 919 444 555 | www.bluepearlsailing.pt',
      isVipPartner: true
    },
    // 5. Skydiving / Paragliding
    {
      id: 'host_sintra_paraglide',
      name: 'Atlantic Coast Skydiving & Paragliding',
      category: 'skydiving',
      city: 'Lissabon / Sintra Küste',
      rating: 4.98,
      reviewsCount: 56,
      dnaTags: ['h1', 'h2', 'h112'],
      perk: '🎁 4K-GoPro-Videoaufnahme deines Fluges kostenlos',
      desc: 'Tandem-Fallschirmsprung & Paragliding über den steilen Basaltklippen der Praia Grande & Praia das Maçãs. Adrenalin pur mit zertifizierten Instruktoren.',
      contact: 'WhatsApp: +351 966 777 888 | fly@atlantis-sky.pt',
      isVipPartner: true
    },
    // 6. Diving School
    {
      id: 'host_sesimbra_dive',
      name: 'Arrábida Marine Reserve Diving Center',
      category: 'diving',
      city: 'Lissabon / Sesimbra',
      rating: 4.92,
      reviewsCount: 42,
      dnaTags: ['h1', 'h20', 'h25'],
      perk: '🎁 15% Rabatt auf den PADI Open Water & Schnuppertauch-Kurs',
      desc: 'Kristallklares Wasser im geschützten Naturpark Arrábida. Schiffswracks, Unterwasserhöhlen, Seepferdchen & Oktopusse.',
      contact: 'Tel: +351 928 333 444 | dive@arrabida-ocean.pt',
      isVipPartner: true
    },
    // 7. ATV / Quad Safari
    {
      id: 'host_algarve_quad',
      name: 'Wild Trails ATV & Quad Safari',
      category: 'atv_quad',
      city: 'Algarve / Albufeira',
      rating: 4.88,
      reviewsCount: 73,
      dnaTags: ['h1', 'h2', 'h112'],
      perk: '🎁 Staubmasken & lokale Orangenlikör-Verkostung gratis',
      desc: 'Geführte Offroad-Touren durch Korkeichenwälder, ausgetrocknete Flussbetten und einsame Bergdörfer des Monchique-Gebirges.',
      contact: 'WhatsApp: +351 915 222 333 | quad@wildtrails-algarve.com',
      isVipPartner: true
    },
    // 8. Traditional Tasca
    {
      id: 'host_tasca_mariana',
      name: 'Tasca Dona Mariana (Trad. Fischküche)',
      category: 'restaurant',
      city: 'Lissabon / Bica',
      rating: 4.9,
      reviewsCount: 52,
      dnaTags: ['h10', 'h30', 'h109'],
      perk: '🎁 Kostenloser Pastel de Nata & Bica zum Menü',
      desc: 'Täglich fangfrischer Fisch vom Markt in Setúbal. Familiäre Atmosphäre, 100% Touristenfallen-frei.',
      contact: 'Rua da Bica de Duarte Belo 18 | Keine Reservierung nötig',
      isVipPartner: true
    }
  ];

  class HostPortalEngine {
    constructor() {
      this.partners = JSON.parse(localStorage.getItem('snt_host_partners')) || DEFAULT_HOST_PARTNERS;
      this.activeFilter = 'all';
    }

    getPartners(city, filterGroup) {
      let list = this.partners;
      if (city) {
        list = list.filter(p => p.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes('lissabon'));
      }
      if (filterGroup && filterGroup !== 'all') {
        list = list.filter(p => {
          const catInfo = BIZ_CATEGORIES[p.category];
          return catInfo && catInfo.group === filterGroup;
        });
      }
      return list;
    }

    setFilter(groupKey) {
      this.activeFilter = groupKey;
      this.renderHostShowroom();
    }

    renderHostShowroom(containerId = 'hostPartnersGrid') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const activeCity = window.cityBrain ? window.cityBrain.currentCity : 'Lissabon';
      const cityPartners = this.getPartners(activeCity, this.activeFilter);

      // Render filter tabs bar above grid if not already present
      let filterBar = document.getElementById('hostCategoryFilterBar');
      if (!filterBar) {
        const parent = container.parentElement;
        if (parent) {
          filterBar = document.createElement('div');
          filterBar.id = 'hostCategoryFilterBar';
          filterBar.className = 'filter-bar';
          filterBar.style.cssText = 'margin-bottom: 24px; justify-content: flex-start; overflow-x: auto; padding-bottom: 8px; flex-wrap: wrap; gap: 8px;';
          filterBar.innerHTML = `
            <button class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" onclick="window.hostPortal.setFilter('all')">🌟 Alle Partner</button>
            <button class="filter-btn ${this.activeFilter === 'stay' ? 'active' : ''}" onclick="window.hostPortal.setFilter('stay')">🏡 Unterkünfte & Hotels</button>
            <button class="filter-btn ${this.activeFilter === 'food' ? 'active' : ''}" onclick="window.hostPortal.setFilter('food')">🍲 Gastro & Cafés</button>
            <button class="filter-btn ${this.activeFilter === 'water' ? 'active' : ''}" onclick="window.hostPortal.setFilter('water')">🏄‍♂️ Wassersport & Tauchen</button>
            <button class="filter-btn ${this.activeFilter === 'rental' ? 'active' : ''}" onclick="window.hostPortal.setFilter('rental')">🛵 Scooter, Auto & Quad</button>
            <button class="filter-btn ${this.activeFilter === 'extreme' ? 'active' : ''}" onclick="window.hostPortal.setFilter('extreme')">🪂 Fallschirm, Klettern & Action</button>
            <button class="filter-btn ${this.activeFilter === 'yacht' ? 'active' : ''}" onclick="window.hostPortal.setFilter('yacht')">⛵ Yacht & Segeln</button>
          `;
          parent.insertBefore(filterBar, container);
        }
      } else {
        filterBar.querySelectorAll('.filter-btn').forEach(btn => {
          const isMatch = (this.activeFilter === 'all' && btn.textContent.includes('Alle')) ||
                          (this.activeFilter === 'stay' && btn.textContent.includes('Unterkünfte')) ||
                          (this.activeFilter === 'food' && btn.textContent.includes('Gastro')) ||
                          (this.activeFilter === 'water' && btn.textContent.includes('Wassersport')) ||
                          (this.activeFilter === 'rental' && btn.textContent.includes('Scooter')) ||
                          (this.activeFilter === 'extreme' && btn.textContent.includes('Fallschirm')) ||
                          (this.activeFilter === 'yacht' && btn.textContent.includes('Yacht'));
          btn.classList.toggle('active', isMatch);
        });
      }

      if (cityPartners.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-line);">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🌟</div>
            <h4 style="color: var(--text-main); margin-bottom: 6px; font-size: 1.2rem;">Noch kein Partner in dieser Kategorie in ${activeCity} gelistet</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 20px;">
              Bietest du Scooter-Verleih, Fallschirmsprünge, Apartments, Tauchkurse oder Yachtfahrten an? Werde der exklusive Partner vor Ort!
            </p>
            <button class="btn btn-primary" onclick="window.hostPortal.openRegisterModal()">
              🌟 Jetzt als Partner Eintragen (0% Provision) →
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = cityPartners.map(p => {
        const catInfo = BIZ_CATEGORIES[p.category] || { badge: '🌟 VIP Partner' };
        return `
          <div class="glass-card host-card" style="display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(245,158,11,0.35); box-shadow: 0 12px 36px rgba(0,0,0,0.4); border-radius: 20px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
                <span class="badge badge-gold" style="font-size: 0.72rem; padding: 4px 10px;">⭐ Verifizierter VIP-Partner</span>
                <span class="badge badge-cyan" style="font-size: 0.7rem;">${catInfo.badge}</span>
              </div>

              <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 4px; line-height: 1.3;">${p.name}</h3>
              <div style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 12px;">📍 ${p.city}</div>

              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 14px;">
                ${p.desc}
              </p>

              <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 12px; font-size: 0.84rem; color: var(--sand-gold); font-weight: 700; margin-bottom: 16px;">
                ${p.perk}
              </div>
            </div>

            <div>
              <div style="margin-bottom: 12px; font-size: 0.82rem; color: var(--text-main); background: var(--bg-surface); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-line);">
                📞 <strong>Direktkontakt:</strong> ${p.contact}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-line); padding-top: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="font-size: 0.9rem; font-weight: 800; color: #F59E0B;">
                  ★ ${p.rating} (${p.reviewsCount} Reviews)
                </div>
                <button class="btn btn-primary" style="font-size: 0.82rem; padding: 6px 16px;" onclick="alert('📞 Direkt-Buchung ohne 15-20% OTA-Gebühr:\nKontaktiere \'${p.name}\' direkt über:\n${p.contact}')">
                  Direkt Buchen (0% Gebühr) 🚀
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    openRegisterModal() {
      let modal = document.getElementById('hostRegisterModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hostRegisterModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      const activeCity = window.cityBrain ? window.cityBrain.currentCity : 'Lissabon';

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 720px; width: 95%; max-height: 90vh; overflow-y: auto;">
          <button class="modal-close" onclick="document.getElementById('hostRegisterModal').style.display='none'">×</button>
          
          <div style="text-align: center; margin-bottom: 22px;">
            <span class="badge badge-gold" style="font-size: 0.78rem;">🌟 B2B Partner & Host Portal</span>
            <h3 style="margin-top: 10px; font-size: 1.6rem; color: var(--text-main);">Werde verifizierter Scratch'n'Travel VIP-Partner</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 560px; margin: 6px auto 0; line-height: 1.5;">
              Gewinne zahlungskräftige Reisende über den <strong>130 Hobby-DNA Matcher</strong> (Surfen, Wandern, Kulinarik, Familien & Haustiere). <strong>100% Direkteinnahmen ohne 15–20% Airbnb / Booking.com Provisionen!</strong>
            </p>
          </div>

          <!-- Registration Form -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Name deines Betriebs, Verleihs oder Apartments *</label>
              <input type="text" id="hostBizName" placeholder="z.B. Alfama Vintage Vespa / Atlantic Skydiving / Casa do Miradouro" style="width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.95rem;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div>
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Kategorie (20+ Bereiche) *</label>
                <select id="hostBizCategory" style="width: 100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.9rem;">
                  <optgroup label="🏡 Unterkünfte & Living">
                    <option value="apartment">🏡 Ferienwohnung & Apartment</option>
                    <option value="hotel">🏨 Boutique Hotel & B&B</option>
                    <option value="glamping">🏕️ Glamping & Eco-Lodges</option>
                    <option value="camper">🚐 Campervan & Stellplatz</option>
                  </optgroup>
                  <optgroup label="🛵 Mobilität & Verleih (Rentals)">
                    <option value="scooter">🛵 Scooter- & Vespa-Verleih</option>
                    <option value="car_rental">🚗 Mietwagen & Buggy</option>
                    <option value="atv_quad">🏍️ ATV & Quad Safari</option>
                    <option value="bike">🚲 E-Bike & Mountainbike</option>
                  </optgroup>
                  <optgroup label="🏄‍♂️ Wassersport & Maritime Touren">
                    <option value="surf">🏄‍♂️ Surfschule & Wave-Camps</option>
                    <option value="diving">🤿 Tauchschule & Diving-Kurse</option>
                    <option value="yacht">⛵ Yacht-Charter & Segeltrips</option>
                    <option value="kayak">🛶 Kajak & SUP-Verleih</option>
                    <option value="kitesurf">🪁 Kitesurf & Wingfoil</option>
                    <option value="fishing">🎣 Hochsee-Angeln</option>
                  </optgroup>
                  <optgroup label="🪂 Action & Outdoor Extreme">
                    <option value="skydiving">🪂 Fallschirmspringen & Tandem</option>
                    <option value="paragliding">🪂 Paragliding & Gleitschirm</option>
                    <option value="climbing">🧗 Klettern & Canyoning</option>
                    <option value="horse">🐎 Strand-Reiten</option>
                  </optgroup>
                  <optgroup label="🍲 Gastronomie & Genuss">
                    <option value="restaurant">🍲 Restaurant & Kiez-Tasca</option>
                    <option value="cafe">☕ Café & Bakery</option>
                    <option value="wine">🍷 Wein-Bar & Bodega</option>
                  </optgroup>
                  <optgroup label="🧘 Wellness & Kultur">
                    <option value="yoga">🧘 Yoga-Retreat & Wellness</option>
                    <option value="hamam">💆 Hamam & Spa-Rituale</option>
                    <option value="photo_tour">📸 Fototouren & Private Guides</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Stadt / Region *</label>
                <input type="text" id="hostBizCity" value="${activeCity}" style="width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.95rem;">
              </div>
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Besonderer Vorteil für Scratch'n'Travel VIP-Gäste *</label>
              <input type="text" id="hostBizPerk" placeholder="z.B. 10% Rabatt bei Direktbuchung / Gratis GoPro-Video / Kostenloser Helm" style="width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.95rem;">
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Kurzbeschreibung & Besonderheiten *</label>
              <textarea id="hostBizDesc" rows="3" placeholder="Beschreibe dein Angebot, Boote/Fahrzeuge, Ausrüstung, Erreichbarkeit, Guides..." style="width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-family: inherit; font-size: 0.92rem;"></textarea>
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Direkt-Kontakt (WhatsApp, Tel, Website oder Buchungs-URL) *</label>
              <input type="text" id="hostBizContact" placeholder="z.B. WhatsApp: +351 912 345 678 | direct@meinbetrieb.pt" style="width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.95rem;">
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--emerald-primary); padding: 14px; border-radius: 12px; font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
              💰 <strong>0% Provisions-Garantie:</strong> Du zahlst im Business Host Abo (29 €/Mo / 0 € Beta) eine transparente Pauschale und behältst 100% deiner Umsätze.
            </div>

            <button class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; margin-top: 6px;" onclick="window.hostPortal.submitRegistration()">
              🌟 Betrieb Verifizieren & VIP-Eintrag Veröffentlichen →
            </button>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
    }

    submitRegistration() {
      const name = document.getElementById('hostBizName')?.value.trim();
      const cat = document.getElementById('hostBizCategory')?.value || 'apartment';
      const city = document.getElementById('hostBizCity')?.value.trim() || 'Lissabon';
      const perk = document.getElementById('hostBizPerk')?.value.trim();
      const desc = document.getElementById('hostBizDesc')?.value.trim();
      const contact = document.getElementById('hostBizContact')?.value.trim();

      if (!name || !perk || !desc || !contact) {
        alert('Bitte fülle alle Pflichtfelder aus.');
        return;
      }

      const catInfo = BIZ_CATEGORIES[cat] || { badge: '🌟 VIP Partner' };

      const newPartner = {
        id: 'host_' + Date.now(),
        name,
        category: cat,
        city,
        rating: 5.0,
        reviewsCount: 1,
        dnaTags: ['h1', 'h2', 'h10'],
        perk: '🎁 ' + perk,
        desc,
        contact,
        isVipPartner: true
      };

      this.partners.unshift(newPartner);
      localStorage.setItem('snt_host_partners', JSON.stringify(this.partners));

      // Close modal
      const modal = document.getElementById('hostRegisterModal');
      if (modal) modal.style.display = 'none';

      // Re-render
      this.renderHostShowroom();

      // Show Toast & Award Scratch Wallet Card
      if (window.stripeManager && typeof window.stripeManager.showToast === 'function') {
        window.stripeManager.showToast('🎉 ' + name + ' erfolgreich als verifizierter VIP-Partner gelistet!');
      }

      if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
        window.scratchWallet.award('vip_beta'); // +3 cards
      }
    }
  }

  window.hostPortal = new HostPortalEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.hostPortal.renderHostShowroom();
    document.addEventListener('snt:city_changed', () => {
      window.hostPortal.renderHostShowroom();
    });
  });

})();
