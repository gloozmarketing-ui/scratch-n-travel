/**
 * Scratch'n'Travel — Scratch Card Batch Unlock System v1.0
 *
 * Users earn scratch cards by doing things on the platform:
 *   share_story    -> +1 card
 *   unlock_spot    -> +1 card
 *   passport_stamp -> +1 card
 *   checklist_done -> +1 card
 *   invite_friend  -> +2 cards
 *   vip_beta       -> +3 cards (welcome gift)
 */
(function () {
  'use strict';

  var CARD_POOL = [
    { id:'c_iberia',      type:'region',   regionId:'iberia',      tone:'sunset', label:'Iberia',           kicker:'Portugal & Spanien'    },
    { id:'c_pena',        type:'landmark', tone:'sunset', label:'Palácio da Pena', kicker:'Sintra, Portugal',
      path:'M15 90 L15 50 Q15 14 50 8 Q85 14 85 50 L85 90 M25 90 L25 58 Q25 34 50 28 Q75 34 75 58 L75 90 M38 68 L38 48 A12 12 0 0 1 62 48 L62 68Z' },
    { id:'c_italy',       type:'region',   regionId:'italy',       tone:'spice',  label:'Italia',           kicker:'Mediterraneo'          },
    { id:'c_colosseo',    type:'landmark', tone:'spice',  label:'Colosseo',       kicker:'Roma, Italia',
      path:'M10 90 Q10 28 50 18 Q90 28 90 90 L10 90 M20 90 L20 38 M50 90 L50 22 M80 90 L80 38 M20 62 L80 62 M20 44 L80 44' },
    { id:'c_japan',       type:'region',   regionId:'japan',       tone:'berry',  label:'Nihon',            kicker:'Ostasien'              },
    { id:'c_fuji',        type:'landmark', tone:'berry',  label:'Fuji & Torii',   kicker:'Shizuoka, Japan',
      path:'M8 80 Q50 18 92 80 M18 80 Q50 38 82 80 M36 80 L36 55 M64 80 L64 55 M12 90 L88 90 M18 100 L82 100 M30 90 L30 108 M70 90 L70 108' },
    { id:'c_greece',      type:'region',   regionId:'greece',      tone:'ocean',  label:'Hellas',           kicker:'Ägäis'                       },
    { id:'c_parthenon',   type:'landmark', tone:'ocean',  label:'Parthenon',      kicker:'Athen, Griechenland',
      path:'M5 55 L50 18 L95 55 M8 55 L8 98 M28 55 L28 98 M50 55 L50 98 M72 55 L72 98 M92 55 L92 98 M3 98 L97 98 M3 55 L97 55' },
    { id:'c_brazil',      type:'region',   regionId:'brazil',      tone:'jungle', label:'Brasil',           kicker:'Südamerika'             },
    { id:'c_morocco',     type:'region',   regionId:'morocco',     tone:'sand',   label:'Maghreb',          kicker:'Marokko'               },
    { id:'c_koutoubia',   type:'landmark', tone:'sand',   label:'Koutoubia',      kicker:'Marrakesch, Marokko',
      path:'M32 100 L32 22 L68 22 L68 100 M36 22 L50 8 L64 22 M42 68 Q50 62 58 68 Q50 74 42 68 M40 48 L60 48 M40 36 L60 36' },
    { id:'c_australia',   type:'region',   regionId:'australia',   tone:'sunset', label:'Australia',        kicker:'Ozeanien'              },
    { id:'c_opera',       type:'landmark', tone:'sunset', label:'Opera House',    kicker:'Sydney, Australien',
      path:'M8 90 L8 52 Q8 18 36 18 Q32 50 32 90 M42 90 L42 44 Q42 14 62 14 Q58 46 58 90 M58 90 L88 90 L88 68 Q88 52 68 52 L58 60' },
    { id:'c_india',       type:'region',   regionId:'india',       tone:'spice',  label:'Bharat',           kicker:'Südasien'               },
    { id:'c_tajmahal',    type:'landmark', tone:'sand',   label:'Taj Mahal',      kicker:'Agra, Indien',
      path:'M8 100 L8 58 C8 12 28 6 50 4 C72 6 92 12 92 58 L92 100 M22 100 L22 65 C22 42 32 34 50 32 C68 34 78 42 78 65 L78 100 M50 4 L50 0' },
    { id:'c_iceland',     type:'region',   regionId:'iceland',     tone:'ice',    label:'Island',           kicker:'Nordatlantik'          },
    { id:'c_aurora',      type:'landmark', tone:'ice',    label:'Aurora Borealis', kicker:'Akureyri, Island',
      path:'M5 28 Q28 8 50 28 Q72 48 95 28 M5 50 Q28 30 50 50 Q72 70 95 50 M5 72 Q28 52 50 72 Q72 92 95 72' },
    { id:'c_mexico',      type:'region',   regionId:'mexico',      tone:'citrus', label:'México',          kicker:'Nordamerika'           },
    { id:'c_scandinavia', type:'region',   regionId:'scandinavia', tone:'ice',    label:'Norden',           kicker:'Norwegen & Schweden'   },
    { id:'c_vietnam',     type:'region',   regionId:'vietnam',     tone:'jungle', label:'Việt Nam',       kicker:'Südostasien'             },
  ];

  var TONE = {
    sunset:{ dark:'#1C0A00', accent:'#F97316' },
    ocean: { dark:'#00101C', accent:'#3B82F6' },
    jungle:{ dark:'#001C08', accent:'#10B981' },
    spice: { dark:'#1C0000', accent:'#EF4444' },
    berry: { dark:'#1C0012', accent:'#EC4899' },
    sand:  { dark:'#1C1400', accent:'#D97706' },
    ice:   { dark:'#00121C', accent:'#06B6D4' },
    citrus:{ dark:'#0C1C00', accent:'#84CC16' },
  };

  var AWARD = {
    share_story:    { cards:1, label:'Story geteilt',              icon:'✍️'  },
    unlock_spot:    { cards:1, label:'Secret Spot freigerubbelt',  icon:'🔑' },
    passport_stamp: { cards:1, label:'Pass-Stempel gesammelt',     icon:'🖏' },
    checklist_done: { cards:1, label:'Checkliste abgehakt',        icon:'✅'  },
    invite_friend:  { cards:2, label:'Freund eingeladen',          icon:'🎁' },
    vip_beta:       { cards:3, label:'VIP Beta-Zugang aktiviert',  icon:'⭐' },
  };

  /* ---- wallet helpers ---- */
  function getWallet(){ try{ return JSON.parse(localStorage.getItem('snt_wallet')||'null')||{earned:0,scratched:[]}; }catch(e){ return {earned:0,scratched:[]}; } }
  function saveWallet(w){ localStorage.setItem('snt_wallet', JSON.stringify(w)); }
  function avail(w){ return w.earned - w.scratched.length; }

  /* ---- award ---- */
  function award(action){
    var rule = AWARD[action]; if(!rule) return 0;
    var w = getWallet();
    w.earned += rule.cards;
    saveWallet(w);
    updateBadge();
    toast(rule);
    updateWalletModal();
    return rule.cards;
  }

  /* ---- toast ---- */
  function toast(rule){
    var t = document.createElement('div');
    t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;'
      +'background:#1B2A1E;color:#F8FAFC;border:1.5px solid #10B981;border-radius:14px;'
      +'padding:13px 22px;font-size:0.9rem;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,0.5);'
      +'display:flex;align-items:center;gap:10px;white-space:nowrap;';
    t.innerHTML = rule.icon+' <span>'+rule.label+'</span>'
      +'<span style="color:#F59E0B;margin-left:6px;">+'+rule.cards+' Rubbel-Karte'+(rule.cards>1?'n':'')+' 🪙</span>';
    document.body.appendChild(t);
    setTimeout(function(){ t.style.transition='opacity 0.4s'; t.style.opacity='0'; },3000);
    setTimeout(function(){ t.remove(); },3600);
  }

  /* ---- nav badge ---- */
  function updateBadge(){
    var w=getWallet(); var a=avail(w);
    document.querySelectorAll('.scratch-wallet-badge').forEach(function(b){
      b.textContent = '🪙 '+(a>0?a:'0');
      b.style.background = a>0?'#F59E0B':'var(--bg-surface)';
      b.style.color      = a>0?'#000':'var(--text-dim)';
      b.title = a+' Karten verfügbar';
    });
  }

  /* ---- build one scratch canvas card ---- */
  function buildCard(card, cardId){
    var pal=TONE[card.tone]||TONE.sunset;
    var W=190, H=190;
    var wrap=document.createElement('div');
    wrap.className='scb-card'; wrap.dataset.cardId=cardId;

    /* art canvas */
    var aC=document.createElement('canvas'); aC.width=W; aC.height=H; aC.className='scb-art';
    var aX=aC.getContext('2d');
    aX.fillStyle=pal.dark; aX.fillRect(0,0,W,H);
    var ps=(card.type==='region')
      ? (window.REGION_PATHS&&window.REGION_PATHS[card.regionId])||''
      : (card.path||'');
    if(ps){
      var p2=new Path2D(ps); aX.save();
      if(card.type==='region'){
        aX.scale(W/240,H/224);
        aX.fillStyle=pal.accent; aX.globalAlpha=0.18; aX.fill(p2);
        aX.strokeStyle=pal.accent; aX.lineWidth=1.5; aX.globalAlpha=0.75; aX.stroke(p2);
      } else {
        aX.scale(W/100,H/110);
        aX.strokeStyle=pal.accent; aX.lineWidth=2.8; aX.lineJoin='round'; aX.lineCap='round';
        aX.globalAlpha=0.85; aX.stroke(p2);
      }
      aX.restore();
    }

    /* foil canvas */
    var fC=document.createElement('canvas'); fC.width=W; fC.height=H; fC.className='scb-foil';
    var fX=fC.getContext('2d');
    var gr=fX.createLinearGradient(0,0,W,H);
    gr.addColorStop(0,'#C8A84B'); gr.addColorStop(0.2,'#F5E17A'); gr.addColorStop(0.45,'#E8C84A');
    gr.addColorStop(0.65,'#FFFACD'); gr.addColorStop(0.85,'#B8940A'); gr.addColorStop(1,'#D4AF37');
    fX.fillStyle=gr; fX.fillRect(0,0,W,H);
    /* light grain */
    fX.globalAlpha=0.07;
    for(var i=0;i<180;i++){ fX.fillStyle=Math.random()>.5?'#fff':'#4a3a00'; fX.fillRect(Math.random()*W,Math.random()*H,Math.random()*4,1); }
    fX.globalAlpha=1;
    /* hint */
    fX.fillStyle='rgba(0,0,0,0.36)'; fX.font='bold 13px system-ui'; fX.textAlign='center'; fX.textBaseline='middle';
    fX.fillText('🪙  FREIRUBBELN  🪙',W/2,H/2);

    /* scratch interaction */
    var active=false;
    function erase(ex,ey){ fX.globalCompositeOperation='destination-out'; fX.beginPath(); fX.arc(ex,ey,26,0,Math.PI*2); fX.fill(); fX.globalCompositeOperation='source-over'; }
    function pos(e){ var r=fC.getBoundingClientRect(); var cx=e.touches?e.touches[0].clientX:e.clientX; var cy=e.touches?e.touches[0].clientY:e.clientY; return{x:(cx-r.left)*W/fC.offsetWidth,y:(cy-r.top)*H/fC.offsetHeight}; }
    fC.addEventListener('mousedown',  function(e){active=true; var p=pos(e);erase(p.x,p.y);});
    fC.addEventListener('mousemove',  function(e){if(active){var p=pos(e);erase(p.x,p.y);}});
    fC.addEventListener('mouseup',    function(){active=false; checkDone(cardId,wrap,fC,fX);});
    fC.addEventListener('mouseleave', function(){active=false;});
    fC.addEventListener('touchstart', function(e){e.preventDefault();active=true;var p=pos(e);erase(p.x,p.y);},{passive:false});
    fC.addEventListener('touchmove',  function(e){e.preventDefault();if(active){var p=pos(e);erase(p.x,p.y);}},{passive:false});
    fC.addEventListener('touchend',   function(){active=false; checkDone(cardId,wrap,fC,fX);});

    wrap.appendChild(aC); wrap.appendChild(fC);

    var foot=document.createElement('div'); foot.className='scb-footer';
    foot.innerHTML='<span class="scb-kicker">'+card.kicker+'</span>'
      +'<strong class="scb-name" style="color:'+pal.accent+'">'+card.label+'</strong>';
    wrap.appendChild(foot);
    return wrap;
  }

  function checkDone(cardId, wrap, fC, fX){
    var d=fX.getImageData(0,0,fC.width,fC.height).data, t=0;
    for(var i=3;i<d.length;i+=4){ if(d[i]<64) t++; }
    if(t/(d.length/4)>0.45){
      var w=getWallet();
      if(w.scratched.indexOf(cardId)===-1){ w.scratched.push(cardId); saveWallet(w); updateBadge(); }
      fC.style.display='none';
      wrap.classList.add('scb-done');
    }
  }

  /* ---- modal ---- */
  function openWallet(){
    var m=document.getElementById('scratchWalletModal');
    if(m){ m.style.display='flex'; updateWalletModal(); return; }
    var overlay=document.createElement('div');
    overlay.id='scratchWalletModal'; overlay.className='modal-overlay'; overlay.style.display='flex';
    overlay.innerHTML='<div class="modal-content scb-modal">'
      +'<button class="modal-close" onclick="document.getElementById('scratchWalletModal').style.display='none'">&#215;</button>'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">'
        +'<span class="badge badge-gold">🪙 Scratch-Wallet</span>'
        +'<span id="scbSummary" class="badge badge-cyan"></span>'
      +'</div>'
      +'<h3 style="margin-top:8px;font-size:1.2rem;">Deine Rubbel-Karten</h3>'
      +'<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:14px;">Verdiene Karten durch Aktionen und rubbel echte Länder &amp; Wahrzeichen frei.</p>'
      +'<div class="scb-earn-guide">'
        +'<p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin-bottom:8px;">So verdienst du Karten:</p>'
        +'<div class="scb-earn-grid" id="scbEarnGrid"></div>'
      +'</div>'
      +'<div class="scb-cards-grid" id="scbCardsGrid"></div>'
      +'<div class="scb-demo-bar">'
        +'<span>Demo:</span>'
        +'<button class="btn btn-secondary" onclick="window.scratchWallet.award('share_story')">✍️ Story teilen</button>'
        +'<button class="btn btn-secondary" onclick="window.scratchWallet.award('unlock_spot')">🔑 Secret Spot</button>'
        +'<button class="btn btn-secondary" onclick="window.scratchWallet.award('passport_stamp')">🖏 Stempel</button>'
      +'</div>'
    +'</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',function(e){if(e.target===overlay) overlay.style.display='none';});
    updateWalletModal();
  }

  function updateWalletModal(){
    var w=getWallet(); var a=avail(w);
    var sum=document.getElementById('scbSummary');
    if(sum) sum.textContent=a+' verfügbar · '+w.earned+' verdient · '+w.scratched.length+' aufgerubbelt';

    var earnGrid=document.getElementById('scbEarnGrid');
    if(earnGrid && !earnGrid.hasChildNodes()){
      Object.keys(AWARD).forEach(function(k){
        var r=AWARD[k];
        var d=document.createElement('div'); d.className='scb-earn-item';
        d.innerHTML=r.icon+' <strong>'+r.label+'</strong> = '+r.cards+' Karte'+(r.cards>1?'n':'');
        earnGrid.appendChild(d);
      });
    }

    var grid=document.getElementById('scbCardsGrid'); if(!grid) return;
    grid.innerHTML='';

    if(w.earned===0){
      grid.innerHTML='<div class="scb-empty">'
        +'<div style="font-size:2.5rem;margin-bottom:10px;">🪙</div>'
        +'<p>Noch keine Karten verdient.</p>'
        +'<p style="font-size:0.8rem;margin-top:6px;color:var(--text-dim);">Teile eine Story, rubbel einen Secret Spot frei oder sammle einen Pass-Stempel!</p>'
      +'</div>';
      return;
    }

    var shown=0;
    for(var i=0;i<w.earned && i<CARD_POOL.length*4;i++){
      var card=CARD_POOL[i%CARD_POOL.length];
      var cid=card.id+'_'+Math.floor(i/CARD_POOL.length);
      var done=w.scratched.indexOf(cid)!==-1;

      if(done){
        var pal=TONE[card.tone]||TONE.sunset;
        var d=document.createElement('div'); d.className='scb-card scb-done';
        d.style.background=pal.dark;
        d.innerHTML='<div class="scb-done-inner" style="color:'+pal.accent+';">✓ '+card.label+'</div>'
          +'<div class="scb-footer"><span class="scb-kicker">'+card.kicker+'</span>'
          +'<strong class="scb-name" style="color:'+pal.accent+';">'+card.label+'</strong></div>';
        grid.appendChild(d); continue;
      }

      if(shown>=a){
        var lk=document.createElement('div'); lk.className='scb-card scb-locked';
        lk.innerHTML='<div class="scb-locked-inner"><span>🔒</span><p>Aktion ausführen</p></div>';
        grid.appendChild(lk); continue;
      }

      grid.appendChild(buildCard(card,cid));
      shown++;
    }
  }

  /* ---- public API ---- */
  window.scratchWallet={ award:award, open:openWallet, wallet:getWallet };

  /* ---- platform event hooks ---- */
  document.addEventListener('snt:story_shared',    function(){ award('share_story'); });
  document.addEventListener('snt:spot_unlocked',   function(){ award('unlock_spot'); });
  document.addEventListener('snt:stamp_collected', function(){ award('passport_stamp'); });
  document.addEventListener('snt:checklist_done',  function(){ award('checklist_done'); });
  document.addEventListener('snt:vip_activated',   function(){ award('vip_beta'); });

  document.addEventListener('DOMContentLoaded', function(){
    updateBadge();
    /* First-visit beta welcome gift */
    var w=getWallet();
    if(w.earned===0) setTimeout(function(){ award('vip_beta'); },1400);
  });

})();
