/**
 * Scratch'n'Travel — Nationale Schätze & Monumente v5.0
 * 
 * Rein säkulare Architektur-Meisterwerke, Naturwunder, Kultur-Embleme & Rituale:
 * - Keine religiösen Kontexte, sondern ikonische Baukunst, Geologie & Musik/Kulinarik
 * - Luxus Gold-Foil Scratch Canvas (Scroll-Driven & Touch/Maus)
 * - Integriertes 5-Sterne Bewertungssystem & Community-Foto-Upload-Vorbereitung
 */

(function () {
  'use strict';

  const TREASURES = [
    {
      id: 'treas_iberia',
      flag: '🇵🇹',
      country: 'Portugal & Spanien',
      name: 'Palácio da Pena & Fado-Gitarre',
      kicker: 'Romantische Schloss-Architektur & Azulejos',
      tone: 'sunset',
      bgGrad: 'linear-gradient(135deg, #2D1405 0%, #0F0702 100%)',
      accentColor: '#F97316',
      badge: '🏰 Schloss Sintra & Fado',
      rituals: ['Bacalhau-Ritual', 'Saudade-Fado in Alfama', 'Klippenspringen Guincho'],
      quote: 'Wo maurisch inspirierte Schlosstürme den Atlantik-Nebel treffen.',
      svgArt: `
        <g stroke="#F97316" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Pena Castle Towers & Round Bastions -->
          <path d="M40 180 L40 100 Q40 50 80 40 Q120 50 120 100 L120 180 Z" fill="rgba(249,115,22,0.15)"/>
          <path d="M80 40 L80 18 M75 18 L85 18"/>
          <path d="M60 110 A20 20 0 0 1 100 110 L100 180 L60 180 Z" fill="rgba(249,115,22,0.3)"/>
          <!-- Turret Tower -->
          <path d="M130 180 L130 70 L170 70 L170 180 Z"/>
          <path d="M125 70 L150 45 L175 70 Z" fill="rgba(249,115,22,0.2)"/>
          <circle cx="150" cy="95" r="8"/>
          <!-- Battlements -->
          <path d="M30 180 L220 180 M175 110 L195 110 L195 180"/>
          <!-- Fado Guitar Acoustic Silhouette -->
          <ellipse cx="70" cy="145" rx="14" ry="18" stroke="#F59E0B" fill="rgba(245,158,11,0.25)"/>
          <path d="M70 127 L70 95" stroke="#F59E0B"/>
          <circle cx="70" cy="92" r="4" stroke="#F59E0B"/>
        </g>
      `
    },
    {
      id: 'treas_italy',
      flag: '🇮🇹',
      country: 'Italien',
      name: 'Colosseo & Forum Romanum',
      kicker: 'Antike Bogen-Architektur & Vespa-Vibes',
      tone: 'spice',
      bgGrad: 'linear-gradient(135deg, #2D0808 0%, #100202 100%)',
      accentColor: '#EF4444',
      badge: '🏛️ Monumentale Antike',
      rituals: ['Aperitivo am Tiber', 'Cacio e Pepe in Trastevere', 'Passeggiata am Abend'],
      quote: 'Ewige Doppel-Arkaden und der lebendige Geist römischer Nächte.',
      svgArt: `
        <g stroke="#EF4444" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Colosseum Ruined Profile -->
          <path d="M30 180 C30 90 80 60 130 60 C180 60 230 90 230 180 Z" fill="rgba(239,68,68,0.12)"/>
          <path d="M30 140 L30 110 L60 95 L90 80 L130 70 L170 85 L200 110 L230 150 L230 180 L30 180"/>
          <!-- Upper Arches -->
          <path d="M50 115 A12 12 0 0 1 74 115 L74 135 L50 135 Z"/>
          <path d="M85 105 A12 12 0 0 1 109 105 L109 130 L85 130 Z"/>
          <path d="M120 100 A12 12 0 0 1 144 100 L144 128 L120 128 Z"/>
          <path d="M155 105 A12 12 0 0 1 179 105 L179 132 L155 132 Z"/>
          <!-- Lower Arches -->
          <path d="M45 150 A14 14 0 0 1 73 150 L73 180 L45 180 Z" fill="rgba(239,68,68,0.25)"/>
          <path d="M82 145 A14 14 0 0 1 110 145 L110 180 L82 180 Z" fill="rgba(239,68,68,0.25)"/>
          <path d="M119 142 A14 14 0 0 1 147 142 L147 180 L119 180 Z" fill="rgba(239,68,68,0.25)"/>
          <path d="M156 145 A14 14 0 0 1 184 145 L184 180 L156 180 Z" fill="rgba(239,68,68,0.25)"/>
        </g>
      `
    },
    {
      id: 'treas_france',
      flag: '🇫🇷',
      country: 'Frankreich',
      name: 'Eiffelturm & Seine-Boulevards',
      kicker: 'Ikonische Eisenbaukunst & Café-Kultur',
      tone: 'ocean',
      bgGrad: 'linear-gradient(135deg, #05182D 0%, #010812 100%)',
      accentColor: '#38BDF8',
      badge: '🗼 Baukunst & Seine',
      rituals: ['Boulangerie-Croissant um 8 Uhr', 'Bouquinistes am Fluss', 'Wein am Canal Saint-Martin'],
      quote: 'Filigrane Eisenstreben über den Lichtern der Metropole.',
      svgArt: `
        <g stroke="#38BDF8" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Eiffel Tower Structure -->
          <path d="M130 20 L125 70 L105 130 L75 180 M130 20 L135 70 L155 130 L185 180" stroke="#38BDF8" stroke-width="2"/>
          <!-- Platforms -->
          <rect x="100" y="130" width="60" height="8" fill="rgba(56,189,248,0.3)"/>
          <rect x="114" y="70" width="32" height="6" fill="rgba(56,189,248,0.3)"/>
          <!-- Base Arch -->
          <path d="M90 180 Q130 145 170 180" stroke="#38BDF8" stroke-width="2.5"/>
          <!-- Spire Beacon -->
          <line x1="130" y1="20" x2="130" y2="8"/>
          <circle cx="130" cy="8" r="3" fill="#38BDF8"/>
          <!-- Cross Lattice Details -->
          <line x1="110" y1="95" x2="150" y2="105"/>
          <line x1="150" y1="95" x2="110" y2="105"/>
          <line x1="88" y1="155" x2="172" y2="155"/>
        </g>
      `
    },
    {
      id: 'treas_japan',
      flag: '🇯🇵',
      country: 'Japan',
      name: 'Mount Fuji & Pagoden-Dächer',
      kicker: 'Vulkan-Naturwunder & Holzbauten',
      tone: 'berry',
      bgGrad: 'linear-gradient(135deg, #2D051E 0%, #0F010A 100%)',
      accentColor: '#F43F5E',
      badge: '🗻 Naturwunder & Onsen',
      rituals: ['Thermalquellen im Morgennebel', 'Matcha-Tee & Wagashi', 'Kirschblüten-Picknick'],
      quote: 'Perfekte Schneekappe über uralten Holzdächern im Tal.',
      svgArt: `
        <g stroke="#F43F5E" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Mount Fuji Volcano Silhouette -->
          <path d="M20 180 Q80 130 120 60 Q130 45 140 60 Q180 130 240 180 Z" fill="rgba(244,63,94,0.14)"/>
          <!-- Snow Cap -->
          <path d="M105 85 Q130 70 155 85" stroke="#FFF" opacity="0.8" stroke-width="2"/>
          <path d="M115 100 L120 85 M130 105 L130 80 M145 100 L140 85" stroke="#FFF" opacity="0.6"/>
          <!-- Pagoda Roofs -->
          <path d="M70 120 Q130 105 190 120 L180 130 Q130 118 80 130 Z" fill="rgba(244,63,94,0.3)"/>
          <path d="M85 145 Q130 132 175 145 L165 155 Q130 144 95 155 Z" fill="rgba(244,63,94,0.3)"/>
          <path d="M98 168 Q130 156 162 168 L152 180 L108 180 Z" fill="rgba(244,63,94,0.3)"/>
          <!-- Cherry Blossom Petals -->
          <circle cx="45" cy="80" r="3" fill="#FB7185"/>
          <circle cx="58" cy="95" r="2.5" fill="#FB7185"/>
          <circle cx="205" cy="75" r="3" fill="#FB7185"/>
          <circle cx="218" cy="90" r="2" fill="#FB7185"/>
        </g>
      `
    },
    {
      id: 'treas_australia',
      flag: '🇦🇺',
      country: 'Australien',
      name: 'Sydney Opera & Harbour Bridge',
      kicker: 'Segeldach-Baukunst & Ozean-Vibes',
      tone: 'sunset',
      bgGrad: 'linear-gradient(135deg, #2D1405 0%, #100601 100%)',
      accentColor: '#FB923C',
      badge: '⛵ Segeldächer & Pazifik',
      rituals: ['Frühmorgens Surf am Bondi Beach', 'Flat White Coffee im Café', 'Segeltour im Naturhafen'],
      quote: 'Geschwungene Muschelschalen im glitzernden Pazifikwasser.',
      svgArt: `
        <g stroke="#FB923C" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Opera House Shells -->
          <!-- Big Shell 1 -->
          <path d="M30 170 L30 120 Q30 50 85 50 Q75 110 75 170 Z" fill="rgba(251,146,60,0.2)"/>
          <!-- Big Shell 2 -->
          <path d="M85 170 L85 100 Q85 40 145 40 Q130 105 130 170 Z" fill="rgba(251,146,60,0.25)"/>
          <!-- Shell 3 -->
          <path d="M135 170 L135 110 Q135 65 185 65 Q175 118 175 170 Z" fill="rgba(251,146,60,0.2)"/>
          <!-- Small Shell 4 -->
          <path d="M180 170 L180 130 Q180 95 220 95 L220 170 Z" fill="rgba(251,146,60,0.15)"/>
          <!-- Promenade Base & Water Waves -->
          <line x1="20" y1="170" x2="235" y2="170" stroke-width="2"/>
          <path d="M25 180 Q55 174 85 180 Q115 186 145 180 Q175 174 205 180" stroke="#FDBA74"/>
        </g>
      `
    },
    {
      id: 'treas_greece',
      flag: '🇬🇷',
      country: 'Griechenland',
      name: 'Parthenon & Akropolis-Säulen',
      kicker: 'Klassische Marmor-Säulen & Ägäis-Wind',
      tone: 'ocean',
      bgGrad: 'linear-gradient(135deg, #041B2D 0%, #010A12 100%)',
      accentColor: '#38BDF8',
      badge: '🏛️ Marmor & Insel-Vibes',
      rituals: ['Meltemi-Segeln in den Kykladen', 'Sonnenuntergang an Klippen', 'Tavernen-Mezze & Oliven'],
      quote: 'Strahlender weißer Marmor über dem tiefblauen Mittelmeer.',
      svgArt: `
        <g stroke="#38BDF8" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Giebel / Pediment -->
          <path d="M30 85 L130 35 L230 85 Z" fill="rgba(56,189,248,0.18)"/>
          <!-- Architrav -->
          <path d="M25 85 L235 85 L235 98 L25 98 Z"/>
          <!-- Säulen -->
          <line x1="45" y1="98" x2="45" y2="180"/>
          <line x1="75" y1="98" x2="75" y2="180"/>
          <line x1="105" y1="98" x2="105" y2="180"/>
          <line x1="130" y1="98" x2="130" y2="180"/>
          <line x1="155" y1="98" x2="155" y2="180"/>
          <line x1="185" y1="98" x2="185" y2="180"/>
          <line x1="215" y1="98" x2="215" y2="180"/>
          <!-- Stufenbasis -->
          <path d="M20 180 L240 180 M15 186 L245 186"/>
        </g>
      `
    },
    {
      id: 'treas_brazil',
      flag: '🇧🇷',
      country: 'Brasilien',
      name: 'Zuckerhut & Copacabana',
      kicker: 'Tropische Granitkegel & Küsten-Rhythmus',
      tone: 'jungle',
      bgGrad: 'linear-gradient(135deg, #022410 0%, #000E06 100%)',
      accentColor: '#10B981',
      badge: '🌴 Tropen & Atlantik',
      rituals: ['Frischer Kokossaft am Strand', 'Samba-Runde in Lapa', 'Sonnenuntergang am Arpoador-Felsen'],
      quote: 'Dschungelbedeckte Felsriesen ragen aus dem Atlantik.',
      svgArt: `
        <g stroke="#10B981" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Pao de Acucar / Sugarloaf Peak -->
          <path d="M30 180 Q80 70 125 50 Q160 70 180 180 Z" fill="rgba(16,185,129,0.2)"/>
          <!-- Smaller Peak Morro da Urca -->
          <path d="M165 180 Q195 110 235 125 L240 180 Z" fill="rgba(16,185,129,0.15)"/>
          <!-- Cable Car Wire & Gondola -->
          <path d="M125 50 L235 125" stroke="#34D399" stroke-dasharray="4,4"/>
          <rect x="175" y="80" width="12" height="10" rx="2" fill="#10B981"/>
          <!-- Copacabana Wave Pavement Pattern -->
          <path d="M20 170 Q45 162 70 170 Q95 178 120 170 Q145 162 170 170 Q195 178 220 170" stroke="#34D399" stroke-width="2"/>
        </g>
      `
    },
    {
      id: 'treas_iceland',
      flag: '🇮🇸',
      country: 'Island',
      name: 'Basaltsäulen & Aurora Borealis',
      kicker: 'Geothermische Naturwunder & Nordlichter',
      tone: 'ice',
      bgGrad: 'linear-gradient(135deg, #011E28 0%, #000B10 100%)',
      accentColor: '#06B6D4',
      badge: '🌌 Polarlichter & Geysire',
      rituals: ['Baden in Natur-Thermalquellen', 'Polarlichter-Nachtwache', 'Gletscherzungen-Wanderung'],
      quote: 'Tanzende grüne Lichtbänder über dampfenden Basaltfeldern.',
      svgArt: `
        <g stroke="#06B6D4" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Aurora Borealis Waves -->
          <path d="M10 40 Q70 15 130 40 Q190 65 240 30" stroke="#22D3EE" stroke-width="2.5" opacity="0.7"/>
          <path d="M20 60 Q80 35 140 60 Q200 85 240 50" stroke="#A7F3D0" stroke-width="2" opacity="0.5"/>
          <!-- Hexagonal Basalt Column Formations (Reynisfjara style) -->
          <path d="M110 180 L110 55 L140 55 L140 180 Z" fill="rgba(6,182,212,0.2)"/>
          <path d="M95 180 L95 80 L110 80"/>
          <path d="M80 180 L80 110 L95 110"/>
          <path d="M65 180 L65 140 L80 140"/>
          <path d="M140 80 L155 80 L155 180"/>
          <path d="M155 110 L170 110 L170 180"/>
          <path d="M170 140 L185 140 L185 180"/>
        </g>
      `
    },
    {
      id: 'treas_spain',
      flag: '🇪🇸',
      country: 'Spanien',
      name: 'Casa Batlló & Gaudi-Kurven',
      kicker: 'Organische Jugendstil-Fassaden & Flamenco',
      tone: 'sand',
      bgGrad: 'linear-gradient(135deg, #241403 0%, #0E0701 100%)',
      accentColor: '#F59E0B',
      badge: '🎨 Organische Baukunst',
      rituals: ['Tapas-Hopping in Barcelona', 'Flamenco in andalusischen Höhlen', 'Siesta & Abend-Cava'],
      quote: 'Fließende organische Sandstein-Bögen ohne eine einzige gerade Linie.',
      svgArt: `
        <g stroke="#F59E0B" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- Gaudi Organics Facade -->
          <path d="M40 180 L40 60 Q80 40 130 50 Q180 40 220 60 L220 180 Z" fill="rgba(245,158,11,0.15)"/>
          <!-- Dragon Spine Roofline -->
          <path d="M50 60 Q70 30 100 45 Q120 20 150 40 Q180 25 210 55" stroke="#F59E0B" stroke-width="2.5"/>
          <!-- Bone-like Organic Balconies -->
          <path d="M60 90 Q80 75 100 90 Q100 110 60 110 Z" fill="rgba(245,158,11,0.3)"/>
          <path d="M150 90 Q170 75 190 90 Q190 110 150 110 Z" fill="rgba(245,158,11,0.3)"/>
          <path d="M105 130 Q125 115 145 130 Q145 150 105 150 Z" fill="rgba(245,158,11,0.3)"/>
          <!-- Ground Floor Columns -->
          <path d="M50 180 Q55 150 65 180 M110 180 Q115 150 125 180 M175 180 Q180 150 190 180"/>
        </g>
      `
    }
  ];

  function TreasuresEngine() {
    this.unlocked = JSON.parse(localStorage.getItem('snt_treasures_unlocked') || '{}');
    this.cards = {};
  }

  TreasuresEngine.prototype.renderGallery = function (containerId) {
    containerId = containerId || 'nationalTreasuresGrid';
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = '';
    for (let i = 0; i < TREASURES.length; i++) {
      const t = TREASURES[i];
      const isDone = !!this.unlocked[t.id];

      const ratingWidget = window.ratingSystem
        ? window.ratingSystem.renderHtml(t.id, true)
        : '<span style="color:#F59E0B;font-size:0.8rem;">★ 4.9 (48)</span>';

      html += [
        '<div class="treas-card" id="card_' + t.id + '">',
        '  <!-- Top Header Bar -->',
        '  <div class="treas-header">',
        '    <div style="display: flex; align-items: center; gap: 8px;">',
        '      <span style="font-size: 1.3rem;">' + t.flag + '</span>',
        '      <div>',
        '        <span class="treas-country">' + t.country + '</span>',
        '        <h3 class="treas-title">' + t.name + '</h3>',
        '      </div>',
        '    </div>',
        '    <span class="badge badge-gold" style="font-size: 0.68rem; padding: 3px 8px;">' + t.badge + '</span>',
        '  </div>',

        '  <!-- Visual Artwork Container with Scratch Canvas -->',
        '  <div class="treas-art-box" style="background: ' + t.bgGrad + ';">',
        '    <svg class="treas-svg" viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">',
        t.svgArt,
        '    </svg>',
        '    <div class="treas-kicker-watermark">' + t.kicker.toUpperCase() + '</div>',

        '    <!-- Gold Foil Scratch Canvas Overlay -->',
        '    <canvas id="cnv_' + t.id + '" class="treas-foil-cnv" style="' + (isDone ? 'display:none;' : '') + '"></canvas>',
        '  </div>',

        '  <!-- Cultural Quote & Rituals -->',
        '  <div class="treas-body">',
        '    <p class="treas-quote">“' + t.quote + '”</p>',
        '    <div class="treas-rituals">',
        t.rituals.map(r => '<span class="treas-ritual-pill">✨ ' + r + '</span>').join(''),
        '    </div>',
        '  </div>',

        '  <!-- Footer with 5-Star Rating & Action Buttons -->',
        '  <div class="treas-footer">',
        '    <div>' + ratingWidget + '</div>',
        '    <div style="display: flex; align-items: center; gap: 6px;">',
        '      <span id="lbl_' + t.id + '" class="treas-status-lbl" style="color: ' + (isDone ? 'var(--emerald-primary)' : 'var(--sand-gold)') + ';">',
        (isDone ? '✓ Enthüllt' : '🪙 Rubbeln'),
        '      </span>',
        '      <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.74rem;" onclick="window.treasuresEngine.reveal(\'' + t.id + '\')">',
        (isDone ? 'Enthüllt 🔓' : 'Aufdecken 🔓'),
        '      </button>',
        '      <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.74rem;" title="Eigenes Community-Foto hochladen & bewerten lassen" onclick="alert(\'📸 Community Foto-Upload:\\nDu kannst eigene verifizierte Reisefotos hochladen, wenn du vor Ort eingecheckt hast. Verdiene +2 Rubbelkarten!\')">',
        '📷',
        '      </button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
    }

    el.innerHTML = html;
    el.className = 'grid-3 treas-gallery-grid';

    // Init Canvases
    requestAnimationFrame(() => {
      for (let i = 0; i < TREASURES.length; i++) {
        if (!this.unlocked[TREASURES[i].id]) {
          this._initCanvas(TREASURES[i].id, i);
        }
      }
      this._listenScroll();
      this._onFrame();
    });
  };

  TreasuresEngine.prototype._initCanvas = function (id, seed) {
    const cnv = document.getElementById('cnv_' + id);
    if (!cnv) return;
    const ctx = cnv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cnv.offsetWidth || 340;
    const h = cnv.offsetHeight || 200;
    cnv.width = w * dpr;
    cnv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Luxury Gold Foil Gradient
    const gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#C8A84B');
    gr.addColorStop(0.2, '#F5E17A');
    gr.addColorStop(0.45, '#E8C84A');
    gr.addColorStop(0.65, '#FFFACD');
    gr.addColorStop(0.85, '#B8940A');
    gr.addColorStop(1, '#D4AF37');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    // Brushed metal grain
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 280; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#3E2F00';
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 6, 1.2);
    }
    ctx.globalAlpha = 1;

    // Shiny Emblem & Hint
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪙  FREIRUBBELN  🪙', w / 2, h / 2);

    // Serpentine Strokes for Scroll Reveal
    const strokes = [];
    const rows = 10;
    for (let r = 0; r < rows; r++) {
      const y = 14 + r * (h - 28) / (rows - 1);
      const ltr = (r + seed) % 2 === 0;
      const steps = 16;
      for (let s = 0; s <= steps; s++) {
        const t = ltr ? s / steps : 1 - s / steps;
        const wob = Math.sin((t * 5 + r) * 1.5) * 6;
        strokes.push({ x: 10 + t * (w - 20), y: y + wob });
      }
    }

    this.cards[id] = { cnv, ctx, strokes, done: 0, w, h };

    // Pointer Interactive Scratch
    let active = false;
    const erase = (ex, ey) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(ex, ey, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const getPos = (e) => {
      const rect = cnv.getBoundingClientRect();
      const sx = cnv.offsetWidth > 0 ? w / cnv.offsetWidth : 1;
      const sy = cnv.offsetHeight > 0 ? h / cnv.offsetHeight : 1;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: (cx - rect.left) * sx, y: (cy - rect.top) * sy };
    };

    cnv.addEventListener('mousedown', (e) => { active = true; const p = getPos(e); erase(p.x, p.y); });
    cnv.addEventListener('mousemove', (e) => { if (active) { const p = getPos(e); erase(p.x, p.y); } });
    cnv.addEventListener('mouseup', () => { active = false; this._checkScratchDone(id); });
    cnv.addEventListener('mouseleave', () => { active = false; });
    cnv.addEventListener('touchstart', (e) => { e.preventDefault(); active = true; const p = getPos(e); erase(p.x, p.y); }, { passive: false });
    cnv.addEventListener('touchmove', (e) => { e.preventDefault(); if (active) { const p = getPos(e); erase(p.x, p.y); } }, { passive: false });
    cnv.addEventListener('touchend', () => { active = false; this._checkScratchDone(id); });
  };

  TreasuresEngine.prototype._checkScratchDone = function (id) {
    const data = this.cards[id];
    if (!data) return;
    const imgData = data.ctx.getImageData(0, 0, data.cnv.width, data.cnv.height).data;
    let transparent = 0;
    for (let i = 3; i < imgData.length; i += 4) {
      if (imgData[i] < 64) transparent++;
    }
    const ratio = transparent / (imgData.length / 4);
    if (ratio > 0.42) {
      this.reveal(id);
    }
  };

  TreasuresEngine.prototype._listenScroll = function () {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this._onFrame();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler, { passive: true });
  };

  TreasuresEngine.prototype._onFrame = function () {
    const winH = window.innerHeight;
    for (let i = 0; i < TREASURES.length; i++) {
      const t = TREASURES[i];
      if (this.unlocked[t.id]) continue;
      const card = document.getElementById('card_' + t.id);
      const data = this.cards[t.id];
      if (!card || !data) continue;

      const rect = card.getBoundingClientRect();
      const visible = (winH - rect.top) / (winH * 0.65 + rect.height * 0.35);
      const pct = Math.min(Math.max(visible, 0), 1);
      if (pct < 0.08) continue;

      const target = Math.floor(pct * data.strokes.length);
      if (target <= data.done) continue;

      data.ctx.globalCompositeOperation = 'destination-out';
      for (let s = data.done; s < target; s++) {
        const pt = data.strokes[s];
        data.ctx.beginPath();
        data.ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
        data.ctx.fill();
      }
      data.ctx.globalCompositeOperation = 'source-over';
      data.done = target;

      if (data.done / data.strokes.length > 0.85) {
        this.reveal(t.id);
      }
    }
  };

  TreasuresEngine.prototype.reveal = function (id) {
    const cnv = document.getElementById('cnv_' + id);
    if (cnv) {
      cnv.style.transition = 'opacity 0.4s ease';
      cnv.style.opacity = '0';
      setTimeout(() => { cnv.style.display = 'none'; }, 400);
    }
    const lbl = document.getElementById('lbl_' + id);
    if (lbl) {
      lbl.textContent = '✓ Enthüllt!';
      lbl.style.color = 'var(--emerald-primary)';
    }
    this.unlocked[id] = true;
    localStorage.setItem('snt_treasures_unlocked', JSON.stringify(this.unlocked));

    // Award scratch wallet card
    if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
      window.scratchWallet.award('unlock_spot');
    }
  };

  window.treasuresEngine = new TreasuresEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.treasuresEngine.renderGallery();
  });

})();
