/**
 * Scratch'n'Travel — Background Scratch Side Rails Engine v1.0
 *
 * Two fixed vertical rails (left + right) sit BEHIND all page content.
 * Each tile has a gold foil painted only within the SVG shape contour.
 * Scratching (scroll-driven or manual) reveals the coloured artwork beneath.
 * Alternates: country map silhouette <-> architectural line drawing.
 */

(function() {
  'use strict';

  // ── Tone palette (matches treasures-engine) ──────────────────────────────
  var TONES = {
    sunset:  { dark: '#1C0A00', accent: '#F97316', gold: '#E8A040' },
    ocean:   { dark: '#00101C', accent: '#3B82F6', gold: '#60C8E8' },
    jungle:  { dark: '#001C08', accent: '#10B981', gold: '#40D890' },
    spice:   { dark: '#1C0000', accent: '#EF4444', gold: '#F08060' },
    berry:   { dark: '#1C0012', accent: '#EC4899', gold: '#F060A0' },
    sand:    { dark: '#1C1400', accent: '#D97706', gold: '#E8C040' },
    ice:     { dark: '#00121C', accent: '#06B6D4', gold: '#40D0E8' },
    citrus:  { dark: '#0C1C00', accent: '#84CC16', gold: '#A0E040' },
  };

  // ── Left rail tiles: even regions ───────────────────────────────────────
  var LEFT_TILES = [
    { type: 'region', id: 'iberia',      tone: 'sunset',  label: 'Iberia'    },
    { type: 'landmark', name: 'Pena Palace',  tone: 'sunset',
      path: 'M15 90 L15 55 Q15 18 45 12 Q75 18 75 55 L75 90 M25 90 L25 62 Q25 38 45 32 Q65 38 65 62 L65 90 M35 70 L35 52 A10 10 0 0 1 55 52 L55 70Z' },
    { type: 'region', id: 'greece',      tone: 'ocean',   label: 'Hellas'    },
    { type: 'landmark', name: 'Parthenon', tone: 'ocean',
      path: 'M5 52 L45 22 L85 52 M8 52 L8 88 M25 52 L25 88 M45 52 L45 88 M65 52 L65 88 M82 52 L82 88 M3 88 L87 88 M3 52 L87 52' },
    { type: 'region', id: 'japan',       tone: 'berry',   label: 'Nihon'     },
    { type: 'landmark', name: 'Fuji Torii', tone: 'berry',
      path: 'M10 75 L80 75 M15 84 L75 84 M25 75 L25 95 M65 75 L65 95 M20 50 Q45 15 70 50 M38 50 L38 75 M52 50 L52 75' },
    { type: 'region', id: 'brazil',      tone: 'jungle',  label: 'Brasil'    },
    { type: 'landmark', name: 'Sugarloaf', tone: 'jungle',
      path: 'M10 90 Q30 20 45 15 Q60 20 80 90 M20 90 Q35 50 45 38 Q55 50 70 90' },
    { type: 'region', id: 'iceland',     tone: 'ice',     label: 'Island'    },
    { type: 'landmark', name: 'Aurora Wave', tone: 'ice',
      path: 'M5 30 Q25 10 45 30 Q65 50 85 30 M5 50 Q25 30 45 50 Q65 70 85 50 M5 70 Q25 50 45 70 Q65 90 85 70' },
  ];

  // ── Right rail tiles: odd regions ───────────────────────────────────────
  var RIGHT_TILES = [
    { type: 'region', id: 'italy',       tone: 'spice',   label: 'Italia'    },
    { type: 'landmark', name: 'Colosseo', tone: 'spice',
      path: 'M10 90 Q10 30 45 22 Q80 30 80 90 M10 90 L80 90 M18 90 L18 40 M45 90 L45 28 M72 90 L72 40 M18 65 L72 65 M18 48 L72 48' },
    { type: 'region', id: 'morocco',     tone: 'sand',    label: 'Maghreb'   },
    { type: 'landmark', name: 'Koutoubia', tone: 'sand',
      path: 'M30 90 L30 20 L60 20 L60 90 M35 20 L45 8 L55 20 M40 65 Q45 60 50 65 Q45 70 40 65 M38 45 L52 45 M38 35 L52 35' },
    { type: 'region', id: 'australia',   tone: 'sunset',  label: 'Australia' },
    { type: 'landmark', name: 'Opera House', tone: 'sunset',
      path: 'M10 85 L10 50 Q10 20 35 20 Q30 48 30 85 M40 85 L40 42 Q40 16 60 16 Q56 44 56 85 M56 85 L80 85 L80 65 Q80 50 65 50 L56 57' },
    { type: 'region', id: 'india',       tone: 'spice',   label: 'Bharat'    },
    { type: 'landmark', name: 'Taj Mahal', tone: 'sand',
      path: 'M10 90 L10 55 C10 15 30 8 45 6 C60 8 80 15 80 55 L80 90 M25 90 L25 62 C25 40 33 32 45 30 C57 32 65 40 65 62 L65 90 M45 6 L45 0' },
    { type: 'region', id: 'scandinavia', tone: 'ice',     label: 'Norden'    },
    { type: 'landmark', name: 'Viking Ship', tone: 'ice',
      path: 'M5 75 Q45 30 85 75 M5 75 L85 75 M45 75 L45 25 M30 60 L45 25 L60 60 M20 75 L20 90 M70 75 L70 90' },
  ];

  // ── Tile size & rail config ──────────────────────────────────────────────
  var TILE_W   = 130;  // px — width of each tile canvas
  var TILE_H   = 130;  // px — height of each tile canvas
  var RAIL_GAP = 14;   // px — gap between tiles

  // ── Build a single tile's canvas with shape-clipped gold foil ───────────
  function buildTile(tileData, seed) {
    var container = document.createElement('div');
    container.className = 'sr-tile';
    container.setAttribute('data-tile-id', (tileData.id || tileData.name || '').replace(/s/g, '_'));

    // Determine path string (region uses REGION_PATHS, landmark uses inline path)
    var pathStr = '';
    var tone    = TONES[tileData.tone] || TONES.sunset;

    if (tileData.type === 'region') {
      pathStr = (window.REGION_PATHS && window.REGION_PATHS[tileData.id]) || '';
    } else {
      pathStr = tileData.path || '';
    }

    // ── Create art canvas (bottom layer) ──
    var artCnv = document.createElement('canvas');
    artCnv.width  = TILE_W;
    artCnv.height = TILE_H;
    artCnv.className = 'sr-art-canvas';
    var artCtx = artCnv.getContext('2d');

    // Dark background
    artCtx.fillStyle = tone.dark;
    artCtx.fillRect(0, 0, TILE_W, TILE_H);

    // Draw artwork SVG path onto the canvas
    if (pathStr) {
      var p2d = new Path2D(pathStr);

      if (tileData.type === 'region') {
        // Scale region path (original 240×224 viewBox) to fit TILE_W × TILE_H
        artCtx.save();
        artCtx.scale(TILE_W / 240, TILE_H / 224);
        artCtx.fillStyle = tone.accent;
        artCtx.globalAlpha = 0.18;
        artCtx.fill(p2d);
        artCtx.strokeStyle = tone.accent;
        artCtx.lineWidth   = 1.8;
        artCtx.globalAlpha = 0.7;
        artCtx.stroke(p2d);
        artCtx.restore();
      } else {
        // Landmark: inline 90×96 paths, scale to tile
        artCtx.save();
        artCtx.scale(TILE_W / 90, TILE_H / 96);
        artCtx.strokeStyle = tone.accent;
        artCtx.lineWidth   = 2.2;
        artCtx.lineJoin    = 'round';
        artCtx.lineCap     = 'round';
        artCtx.globalAlpha = 0.85;
        artCtx.stroke(p2d);
        artCtx.restore();
      }
    }

    // Subtle glow
    var glow = artCtx.createRadialGradient(TILE_W/2, TILE_H/2, 10, TILE_W/2, TILE_H/2, TILE_W * 0.65);
    glow.addColorStop(0, tone.accent.replace(')', ', 0.12)').replace('rgb', 'rgba'));
    glow.addColorStop(1, 'transparent');
    artCtx.fillStyle = glow;
    artCtx.fillRect(0, 0, TILE_W, TILE_H);

    // ── Create foil canvas (top layer) — gold ONLY within shape ──
    var foilCnv = document.createElement('canvas');
    foilCnv.width  = TILE_W;
    foilCnv.height = TILE_H;
    foilCnv.className = 'sr-foil-canvas';
    var foilCtx = foilCnv.getContext('2d');

    // Build gold gradient
    var gr = foilCtx.createLinearGradient(0, 0, TILE_W, TILE_H);
    gr.addColorStop(0,    '#C8A84B');
    gr.addColorStop(0.22, '#F5E17A');
    gr.addColorStop(0.45, '#E8C84A');
    gr.addColorStop(0.62, '#FFFACD');
    gr.addColorStop(0.8,  '#B8940A');
    gr.addColorStop(1,    '#D4AF37');

    // CLIP to path shape, then fill gold — gold only over the artwork
    if (pathStr) {
      var fp2d = new Path2D(pathStr);
      foilCtx.save();

      if (tileData.type === 'region') {
        foilCtx.scale(TILE_W / 240, TILE_H / 224);
        // Expand stroke so gold covers the outline too
        foilCtx.lineWidth = 18;
        foilCtx.lineJoin  = 'round';
        foilCtx.strokeStyle = '#C8A84B';
        foilCtx.stroke(fp2d);
        foilCtx.restore();
        // Now fill clipped
        foilCtx.save();
        foilCtx.scale(TILE_W / 240, TILE_H / 224);
        foilCtx.clip(fp2d);
        foilCtx.restore();
      } else {
        foilCtx.scale(TILE_W / 90, TILE_H / 96);
        // For line drawings: stroke a fat line in gold
        foilCtx.lineWidth = 22;
        foilCtx.lineJoin  = 'round';
        foilCtx.lineCap   = 'round';
        foilCtx.strokeStyle = '#C8A84B';
        foilCtx.stroke(fp2d);
        foilCtx.restore();
      }

      // Restore scale and fill gold
      foilCtx.save();
      foilCtx.fillStyle = gr;
      foilCtx.globalCompositeOperation = 'source-in';
      foilCtx.fillRect(0, 0, TILE_W, TILE_H);
      foilCtx.restore();
    } else {
      // Fallback: thin diagonal gold stripe
      foilCtx.fillStyle = gr;
      foilCtx.fillRect(0, 0, TILE_W, TILE_H);
    }

    // Grain texture on foil
    foilCtx.globalAlpha = 0.06;
    for (var i = 0; i < 180; i++) {
      foilCtx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#4a3a00';
      foilCtx.fillRect(Math.random() * TILE_W, Math.random() * TILE_H, Math.random() * 5, 1);
    }
    foilCtx.globalAlpha = 1;

    container.appendChild(artCnv);
    container.appendChild(foilCnv);

    // Store for scroll engine
    var strokes = buildSerpentineForTile(pathStr, tileData.type, seed);
    container._foilCtx  = foilCtx;
    container._foilCnv  = foilCnv;
    container._strokes  = strokes;
    container._done     = 0;
    container._revealed = false;

    // Manual pointer scratch
    var active = false;
    function erase(ex, ey) {
      foilCtx.globalCompositeOperation = 'destination-out';
      foilCtx.beginPath();
      foilCtx.arc(ex, ey, 18, 0, Math.PI * 2);
      foilCtx.fill();
      foilCtx.globalCompositeOperation = 'source-over';
    }
    function getPos(e) {
      var r  = foilCnv.getBoundingClientRect();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - r.left, y: cy - r.top };
    }
    foilCnv.addEventListener('mousedown',  function(e){ active=true; var p=getPos(e); erase(p.x,p.y); });
    foilCnv.addEventListener('mousemove',  function(e){ if(active){var p=getPos(e); erase(p.x,p.y);} });
    foilCnv.addEventListener('mouseup',    function(){ active=false; });
    foilCnv.addEventListener('mouseleave', function(){ active=false; });
    foilCnv.addEventListener('touchstart', function(e){ e.preventDefault(); active=true; var p=getPos(e); erase(p.x,p.y); }, {passive:false});
    foilCnv.addEventListener('touchmove',  function(e){ e.preventDefault(); if(active){var p=getPos(e); erase(p.x,p.y);} }, {passive:false});
    foilCnv.addEventListener('touchend',   function(){ active=false; });

    return container;
  }

  // ── Serpentine path within the tile canvas ───────────────────────────────
  function buildSerpentineForTile(pathStr, type, seed) {
    var pts  = [];
    var rows = 8;
    var w    = TILE_W;
    var h    = TILE_H;
    for (var r = 0; r < rows; r++) {
      var y   = 10 + r * (h - 20) / (rows - 1);
      var ltr = (r + seed) % 2 === 0;
      var steps = 10;
      for (var s = 0; s <= steps; s++) {
        var t   = ltr ? s / steps : 1 - s / steps;
        var wob = Math.sin((t * 5 + r) * 1.5) * 6;
        pts.push({ x: 8 + t * (w - 16), y: y + wob });
      }
    }
    return pts;
  }

  // ── Rail class ───────────────────────────────────────────────────────────
  function ScratchRail(side, tilesData) {
    this.side      = side;
    this.tilesData = tilesData;
    this.tiles     = [];   // DOM tile elements
    this.rail      = null; // rail wrapper DOM element
  }

  ScratchRail.prototype.mount = function() {
    var el = document.createElement('div');
    el.className   = 'scratch-side-rail scratch-rail-bg ' + this.side;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = [
      'position:fixed',
      'top:0',
      this.side === 'left' ? 'left:0' : 'right:0',
      'width:148px',
      'height:100vh',
      'z-index:0',
      'display:none',             // hidden on small screens
      'flex-direction:column',
      'justify-content:flex-start',
      'align-items:' + (this.side === 'left' ? 'flex-start' : 'flex-end'),
      'gap:' + RAIL_GAP + 'px',
      'padding:20px 8px',
      'overflow:visible',
      'pointer-events:none',
    ].join(';');

    // Show only on xl screens (>=1360px)
    if (window.innerWidth >= 1360) el.style.display = 'flex';
    window.addEventListener('resize', function() {
      el.style.display = window.innerWidth >= 1360 ? 'flex' : 'none';
    });

    var self = this;
    this.tilesData.forEach(function(td, i) {
      // Alternate slight horizontal offset + rotation (mirrors ScratchRail.tsx)
      var offsetX = (i % 2 === 0 ? 1 : -1) * 10;
      var rotateDeg = (i % 3) * 3 - 3;

      var tile = buildTile(td, i);
      tile.style.cssText += [
        ';transform:translateX(' + (self.side === 'left' ? offsetX : -offsetX) + 'px) rotate(' + rotateDeg + 'deg)',
        'opacity:0.22',
        'pointer-events:auto',
        'transition:opacity 0.6s ease',
        'flex-shrink:0',
      ].join(';');

      el.appendChild(tile);
      self.tiles.push(tile);
    });

    document.body.appendChild(el);
    this.rail = el;
  };

  // Update opacity & scratch progress based on scroll progress (0..1)
  ScratchRail.prototype.update = function(globalProgress) {
    var n    = this.tiles.length;
    var step = 1 / n;

    for (var i = 0; i < n; i++) {
      var tile  = this.tiles[i];
      // Each tile gets its own local progress window — staggered
      var local = (globalProgress - i * step * 0.8) / (step * 1.5);
      var pct   = Math.min(Math.max(local, 0), 1);

      // Opacity fade in
      tile.style.opacity = (0.18 + pct * 0.72).toFixed(2);

      // Scroll-driven foil scratch
      if (tile._revealed) continue;
      var target = Math.floor(pct * tile._strokes.length);
      if (target <= tile._done) continue;

      tile._foilCtx.globalCompositeOperation = 'destination-out';
      for (var s = tile._done; s < target; s++) {
        var pt = tile._strokes[s];
        tile._foilCtx.beginPath();
        tile._foilCtx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        tile._foilCtx.fill();
      }
      tile._foilCtx.globalCompositeOperation = 'source-over';
      tile._done = target;

      if (tile._done / tile._strokes.length > 0.88) {
        tile._revealed = true;
      }
    }
  };

  // ── Main initialisation ──────────────────────────────────────────────────
  function init() {
    // Remove old basic badge rails if any
    document.querySelectorAll('.scratch-side-rail:not(.scratch-rail-bg)').forEach(function(el) {
      el.remove();
    });

    var leftRail  = new ScratchRail('left',  LEFT_TILES);
    var rightRail = new ScratchRail('right', RIGHT_TILES);
    leftRail.mount();
    rightRail.mount();

    // ── Scroll listener ──
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var winH    = window.innerHeight;
          var docH    = document.documentElement.scrollHeight - winH;
          var scrollY = window.scrollY || window.pageYOffset;
          var progress = docH > 0 ? Math.min(Math.max(scrollY / docH, 0), 1) : 0;

          // Global top progress bar
          var bar = document.getElementById('scratchScrollProgressBar');
          if (bar) bar.style.width = (progress * 100).toFixed(1) + '%';

          leftRail.update(progress);
          rightRail.update(progress);

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll(); // initial paint
  }

  // Boot after DOM + paths loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure REGION_PATHS is ready
    setTimeout(init, 80);
  });

})();
