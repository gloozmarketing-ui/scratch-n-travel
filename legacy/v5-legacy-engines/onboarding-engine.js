/**
 * Scratch'n'Travel — 4-Step Interactive Onboarding Flow v4.0
 * 
 * Steps:
 * 1. Persona Choice (Solo, Family, Nomad, Host)
 * 2. 5-Hobby Selection
 * 3. First Scratch Simulation
 * 4. Match Reveal & Welcome Bonus (+3 Scratch Cards)
 */

(function () {
  'use strict';

  function OnboardingEngine() {
    this.currentStep = 1;
    this.selectedPersona = 'solo';
    this.selectedHobbies = [];
  }

  OnboardingEngine.prototype.init = function () {
    const hasSeen = localStorage.getItem('snt_onboarding_completed');
    if (!hasSeen) {
      setTimeout(() => this.openModal(), 1200);
    }
  };

  OnboardingEngine.prototype.openModal = function () {
    let modal = document.getElementById('sntOnboardingModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sntOnboardingModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    this.currentStep = 1;
    this.renderStep();
    modal.style.display = 'flex';
  };

  OnboardingEngine.prototype.renderStep = function () {
    const modal = document.getElementById('sntOnboardingModal');
    if (!modal) return;

    let content = '';

    if (this.currentStep === 1) {
      content = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge badge-emerald">Schritt 1 von 4</span>
          <h3 style="font-size: 1.6rem; color: var(--text-main); margin: 6px 0 0;">Was für ein Reisender bist du?</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Wir personalisieren deine Scratch-Map & Treffen vor Ort.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <div class="onboard-persona-card ${this.selectedPersona === 'solo' ? 'active-dna' : ''}" onclick="window.onboardingEngine.selectPersona('solo')" style="padding: 16px; border: 2px solid var(--border-line); border-radius: 16px; cursor: pointer; text-align: center; background: var(--bg-surface);">
            <div style="font-size: 2rem;">🎒</div>
            <div style="font-weight: 800; font-size: 0.95rem; margin-top: 4px;">Solo Explorer</div>
            <div style="font-size: 0.74rem; color: var(--text-dim);">Spontane Trips & Gleichgesinnte</div>
          </div>
          <div class="onboard-persona-card ${this.selectedPersona === 'family' ? 'active-dna' : ''}" onclick="window.onboardingEngine.selectPersona('family')" style="padding: 16px; border: 2px solid var(--border-line); border-radius: 16px; cursor: pointer; text-align: center; background: var(--bg-surface);">
            <div style="font-size: 2rem;">👶</div>
            <div style="font-weight: 800; font-size: 0.95rem; margin-top: 4px;">Familie & Kinder</div>
            <div style="font-size: 0.74rem; color: var(--text-dim);">Flachwasser, Parks & Ruhe</div>
          </div>
          <div class="onboard-persona-card ${this.selectedPersona === 'nomad' ? 'active-dna' : ''}" onclick="window.onboardingEngine.selectPersona('nomad')" style="padding: 16px; border: 2px solid var(--border-line); border-radius: 16px; cursor: pointer; text-align: center; background: var(--bg-surface);">
            <div style="font-size: 2rem;">💻</div>
            <div style="font-weight: 800; font-size: 0.95rem; margin-top: 4px;">Digital Nomad</div>
            <div style="font-size: 0.74rem; color: var(--text-dim);">WLAN-Cafés, eSIM & Work</div>
          </div>
          <div class="onboard-persona-card ${this.selectedPersona === 'host' ? 'active-dna' : ''}" onclick="window.onboardingEngine.selectPersona('host')" style="padding: 16px; border: 2px solid var(--border-line); border-radius: 16px; cursor: pointer; text-align: center; background: var(--bg-surface);">
            <div style="font-size: 2rem;">🌟</div>
            <div style="font-weight: 800; font-size: 0.95rem; margin-top: 4px;">Local Host</div>
            <div style="font-size: 0.74rem; color: var(--text-dim);">0% Provision für Betriebe</div>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" onclick="window.onboardingEngine.nextStep(2)">
          Weiter: Hobbys Wählen →
        </button>
      `;
    } else if (this.currentStep === 2) {
      const topHobbies = [
        { id: 'h1', name: 'Surfen & Wellen', icon: '🏄‍♂️' },
        { id: 'h43', name: 'Reisen mit Hund', icon: '🐶' },
        { id: 'h58', name: 'Kinderwagen-Routen', icon: '👶' },
        { id: 'h74', name: 'Kiez-Tasca & Wein', icon: '🍲' },
        { id: 'h20', name: 'Klippenwandern', icon: '🧗' },
        { id: 'h80', name: 'Architektur & Fotos', icon: '📸' },
        { id: 'h112', name: 'Vanlife & Camping', icon: '🚐' },
        { id: 'h25', name: 'Tauchen & Schnorcheln', icon: '🤿' }
      ];

      content = `
        <div style="text-align: center; margin-bottom: 18px;">
          <span class="badge badge-emerald">Schritt 2 von 4</span>
          <h3 style="font-size: 1.6rem; color: var(--text-main); margin: 6px 0 0;">Wähle deine Kern-Leidenschaften</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Wähle bis zu 5 Hobbys für passgenaue Matches.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 22px;">
          ${topHobbies.map(h => {
            const isSel = this.selectedHobbies.includes(h.id);
            return `
              <button class="hobby-tag ${isSel ? 'active-dna' : ''}" onclick="window.onboardingEngine.toggleHobby('${h.id}')" style="padding: 10px 16px; font-size: 0.92rem; border-radius: 9999px; cursor: pointer;">
                ${h.icon} ${h.name}
              </button>
            `;
          }).join('')}
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" style="flex: 1; padding: 12px;" onclick="window.onboardingEngine.nextStep(1)">← Zurück</button>
          <button class="btn btn-primary" style="flex: 2; padding: 12px;" onclick="window.onboardingEngine.nextStep(3)">Weiter: Erstes Land Rubbeln →</button>
        </div>
      `;
    } else if (this.currentStep === 3) {
      content = `
        <div style="text-align: center; margin-bottom: 18px;">
          <span class="badge badge-gold">Schritt 3 von 4</span>
          <h3 style="font-size: 1.6rem; color: var(--text-main); margin: 6px 0 0;">Probiere die Gold-Rubbelkarte</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Kratze mit der Maus oder dem Finger über Portugal!</p>
        </div>

        <div style="position: relative; width: 100%; height: 160px; background: linear-gradient(135deg, #1E1005 0%, #080301 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden; border: 2px solid var(--sand-gold);">
          <div style="text-align: center;">
            <div style="font-size: 2.2rem;">🇵🇹</div>
            <div style="font-weight: 800; color: var(--emerald-primary); font-size: 1.1rem;">Portugal Freigeschaltet! 🔓</div>
            <div style="font-size: 0.78rem; color: var(--sand-gold);">+100 XP · Explorer Level 1 erreicht</div>
          </div>
          <canvas id="onboardScratchCnv" style="position: absolute; top:0; left:0; width:100%; height:100%; cursor: crosshair;"></canvas>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem;" onclick="window.onboardingEngine.nextStep(4)">
          Matches Anzeigen 🎉 →
        </button>
      `;
    } else if (this.currentStep === 4) {
      content = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge badge-emerald">Fertig! 🚀</span>
          <h3 style="font-size: 1.7rem; color: var(--text-main); margin: 6px 0 0;">Willkommen bei Scratch'n'Travel</h3>
          <p style="font-size: 0.9rem; color: var(--sand-gold); font-weight: 700;">🎁 Du hast +3 kostenlose Rubbelkarten in deinem Wallet erhalten!</p>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 14px; padding: 14px; margin-bottom: 22px;">
          <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main); margin-bottom: 8px;">🔥 Deine ersten 3 Top-Matches in Lissabon:</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6;">
            • 🏄‍♂️ <strong>Pedro M.</strong> (94% Match für Surfen & Kiez-Tasca)<br>
            • 🐶 <strong>Clara & Luna</strong> (91% Match für Hundewanderung Sintra)<br>
            • 🍷 <strong>Sofia B.</strong> (88% Match für Fado & Naturwein)
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1.05rem;" onclick="window.onboardingEngine.finish()">
          Jetzt Loslegen & Karte Erkunden 🚀
        </button>
      `;
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 520px; width: 95%;">
        <button class="modal-close" onclick="window.onboardingEngine.finish()">×</button>
        ${content}
      </div>
    `;

    if (this.currentStep === 3) {
      this.initMiniScratchCanvas();
    }
  };

  OnboardingEngine.prototype.initMiniScratchCanvas = function () {
    const cnv = document.getElementById('onboardScratchCnv');
    if (!cnv) return;
    const ctx = cnv.getContext('2d');
    const w = cnv.offsetWidth || 480;
    const h = cnv.offsetHeight || 160;
    cnv.width = w;
    cnv.height = h;

    const gr = ctx.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#C8A84B');
    gr.addColorStop(0.5, '#F5E17A');
    gr.addColorStop(1, '#D4AF37');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('✨ HIER MIT FINGER/MAUS RUBBELN ✨', w / 2, h / 2 + 5);

    let active = false;
    const erase = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    cnv.addEventListener('mousedown', () => { active = true; });
    cnv.addEventListener('mousemove', (e) => {
      if (active) {
        const r = cnv.getBoundingClientRect();
        erase(e.clientX - r.left, e.clientY - r.top);
      }
    });
    window.addEventListener('mouseup', () => { active = false; });
  };

  OnboardingEngine.prototype.selectPersona = function (p) {
    this.selectedPersona = p;
    this.renderStep();
  };

  OnboardingEngine.prototype.toggleHobby = function (hId) {
    if (this.selectedHobbies.includes(hId)) {
      this.selectedHobbies = this.selectedHobbies.filter(id => id !== hId);
    } else {
      if (this.selectedHobbies.length < 5) {
        this.selectedHobbies.push(hId);
      }
    }
    this.renderStep();
  };

  OnboardingEngine.prototype.nextStep = function (step) {
    this.currentStep = step;
    this.renderStep();
  };

  OnboardingEngine.prototype.finish = function () {
    const modal = document.getElementById('sntOnboardingModal');
    if (modal) modal.style.display = 'none';
    localStorage.setItem('snt_onboarding_completed', 'true');

    if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
      window.scratchWallet.award('onboarding_bonus');
    }
  };

  window.onboardingEngine = new OnboardingEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.onboardingEngine.init();
  });

})();
