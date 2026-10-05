/**
 * Scratch'n'Travel — WanderBond 130 Hobby-DNA Matching & Community Meetup Engine v3.0
 * 
 * Features:
 * - Dynamic Ranking: Profiles with highest compatibility score appear at the top!
 * - Interactive Meetup & Joint Activity Modal: Invite travelers/locals for shared hobbies
 * - High-Contrast UI & 130 Category Filters
 * - Real-Time DNA Overlap Calculation
 */

const LOCAL_PROFILES = [
  {
    id: 'user_pedro',
    name: 'Pedro M. (Local Surfer)',
    avatar: '🏄‍♂️',
    city: 'Lissabon / Costa da Caparica',
    bio: 'Surfe seit 12 Jahren Guincho & Caparica. Kenne die besten Kaltwasser-Wellen, geheime Einstiege und Tascas ohne Touristen.',
    dna: ['h1', 'h2', 'h10', 'h20', 'h74', 'h109'],
    badges: ['Verifizierter Local', 'Wave Master'],
    currentActivity: 'Heute Nachmittag 16:30 Uhr Sunset-Session bei Guincho (Dünung 1.4m).'
  },
  {
    id: 'user_clara',
    name: 'Clara & Hund Luna',
    avatar: '🐶',
    city: 'Sintra / Cascais',
    bio: 'Unterwegs mit Golden Retriever Luna. Wir testen schattige Wander-Trails in Sintra, SUP mit Hund und hundefreundliche Cafés.',
    dna: ['h43', 'h44', 'h46', 'h47', 'h58', 'h80', 'h118'],
    badges: ['Pet Ambassador', 'Local Mama'],
    currentActivity: 'Morgen früh 09:00 Uhr Klippenpfad Praia da Ursa mit Hundegruppe.'
  },
  {
    id: 'user_sofia',
    name: 'Sofia B. (Art & Food)',
    avatar: '🍷',
    city: 'Lissabon / Alfama',
    bio: 'Architektur-Fotografin & Hobby-Köchin. Ich zeige dir versteckte Azulejos, die besten Bio-Weingüter und Fado-Hinterhöfe.',
    dna: ['h73', 'h75', 'h79', 'h80', 'h95', 'h96', 'h112'],
    badges: ['Azulejo Artist', 'Wine Sommelier'],
    currentActivity: 'Heute 19:30 Uhr Akustik-Fado & Vinho Verde in kleiner Tasca.'
  },
  {
    id: 'user_markus',
    name: 'Markus & Familie',
    avatar: '👶',
    city: 'Lissabon / Estrela',
    bio: 'Reisen mit 2 Kleinkindern (2 & 5 J.). Experten für stufenfreie Kinderwagen-Wege, Flachwasser-Strände und ruhige Parks.',
    dna: ['h58', 'h59', 'h62', 'h68', 'h73', 'h86'],
    badges: ['Family Guide', 'Top Explorer'],
    currentActivity: 'Samstag 10:30 Uhr Spielplatz-Picknick im Jardim da Estrela.'
  },
  {
    id: 'user_felix',
    name: 'Felix K. (Outdoor & Vanlife)',
    avatar: '🚐',
    city: 'Algarve / Sagres',
    bio: 'Mit dem Van an Portugals Steilküsten unterwegs. Klettern, Klippenwanderungen und Sonnenuntergänge am Ende der Welt.',
    dna: ['h1', 'h20', 'h25', 'h112', 'h118', 'h125'],
    badges: ['Vanlife Pioneer', 'Climbing Pro'],
    currentActivity: 'Freitag 17:00 Uhr Bouldern an den Klippen von Sagres.'
  }
];

class HobbyDNAEngine {
  constructor() {
    this.selectedDNA = JSON.parse(localStorage.getItem('scratch_user_dna')) || ['h1', 'h43', 'h74'];
    this.searchQuery = '';
    this.activeCategory = 'all';
  }

  toggleHobby(hobbyId) {
    if (this.selectedDNA.includes(hobbyId)) {
      this.selectedDNA = this.selectedDNA.filter(id => id !== hobbyId);
    } else {
      if (this.selectedDNA.length >= 10) {
        alert('Du kannst maximal 10 Kern-Hobbys in deinem Profil auswählen.');
        return;
      }
      this.selectedDNA.push(hobbyId);
    }
    localStorage.setItem('scratch_user_dna', JSON.stringify(this.selectedDNA));
    this.renderHobbySelector();
    this.renderMatches();
  }

  setCategoryFilter(cat) {
    this.activeCategory = cat;
    this.renderHobbySelector();
  }

  setSearchQuery(q) {
    this.searchQuery = q.toLowerCase().trim();
    this.renderHobbySelector();
  }

  renderHobbySelector(containerId = 'hobbyPillContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const db = window.HOBBY_100_DATABASE || [];
    let filtered = db;

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(h => h.category === this.activeCategory);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(h => h.name.toLowerCase().includes(this.searchQuery) || h.category.toLowerCase().includes(this.searchQuery));
    }

    const categories = [
      { key: 'all', label: 'Alle 130 Hobbys' },
      { key: 'water', label: '🏄‍♂️ Wasser & Wellen' },
      { key: 'mountain', label: '⛰️ Berge & Outdoor' },
      { key: 'pets', label: '🐶 Tiere & Hunde' },
      { key: 'family', label: '👶 Familie & Kinder' },
      { key: 'culinary', label: '🍲 Food & Wein' },
      { key: 'creative', label: '📸 Kunst & Musik' },
      { key: 'wellness', label: '🧘 Wellness & Vanlife' }
    ];

    container.innerHTML = `
      <!-- Large Comfortable Search & Category Bar -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; width: 100%;">
          <input 
            type="text" 
            id="hobbySearchInput" 
            placeholder="🔍 Hobby suchen (z.B. Surfen, Hund, Klettern, Kaffee, Yoga, Vanlife, Salsa)..." 
            value="${this.searchQuery}"
            oninput="window.hobbyDNA.setSearchQuery(this.value)"
            style="width: 100%; max-width: 650px; padding: 14px 22px; border-radius: 9999px; border: 2px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 1.05rem; font-weight: 600; outline: none; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
          ${categories.map(c => `
            <button 
              type="button"
              class="filter-btn ${this.activeCategory === c.key ? 'active' : ''}" 
              style="padding: 7px 16px; font-size: 0.88rem; font-weight: 700;"
              onclick="window.hobbyDNA.setCategoryFilter('${c.key}')"
            >
              ${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Selected Active DNA Badges -->
      <div style="margin-bottom: 18px; padding: 14px 18px; background: var(--bg-surface); border: 1px dashed var(--sand-gold); border-radius: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 0.95rem; font-weight: 800; color: var(--sand-gold);">
            🧬 Deine aktive DNA (${this.selectedDNA.length}/10):
          </span>
          ${this.selectedDNA.map(id => {
            const h = db.find(item => item.id === id);
            return h ? `
              <span class="hobby-tag active-dna" style="padding: 7px 14px; font-size: 0.92rem; font-weight: 700; cursor: pointer;" onclick="window.hobbyDNA.toggleHobby('${h.id}')">
                ${h.icon} ${h.name} ✕
              </span>
            ` : '';
          }).join('')}
        </div>
        <span style="font-size: 0.8rem; color: var(--text-dim);">Klicke auf ein Hobby zum Entfernen</span>
      </div>

      <!-- Large Readable Hobby Pills Grid -->
      <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-height: 380px; overflow-y: auto; padding: 12px; border: 1px solid var(--border-line); border-radius: 16px; background: var(--bg-card);">
        ${filtered.map(h => {
          const isSelected = this.selectedDNA.includes(h.id);
          return `
            <button 
              type="button"
              class="hobby-tag ${isSelected ? 'active-dna' : ''}" 
              style="padding: 9px 18px; font-size: 0.95rem; font-weight: 700; border-radius: 9999px; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);"
              onclick="window.hobbyDNA.toggleHobby('${h.id}')"
            >
              <span style="font-size: 1.15rem; margin-right: 4px;">${h.icon}</span> ${h.name}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  calculateMatchScore(userDna) {
    if (!this.selectedDNA.length) return 75;
    const overlap = userDna.filter(id => this.selectedDNA.includes(id));
    const score = Math.round((overlap.length / Math.max(1, userDna.length)) * 100);
    return Math.max(45, Math.min(99, score + 35));
  }

  renderMatches(containerId = 'hobbyMatchGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const db = window.HOBBY_100_DATABASE || [];

    // Dynamically rank profiles with highest match percentage at the top!
    const scoredProfiles = LOCAL_PROFILES.map(p => ({
      ...p,
      calculatedScore: this.calculateMatchScore(p.dna),
      matchedHobbies: p.dna.filter(id => this.selectedDNA.includes(id)).map(id => {
        const item = db.find(h => h.id === id);
        return item ? item.icon + ' ' + item.name : id;
      })
    })).sort((a, b) => b.calculatedScore - a.calculatedScore);

    container.innerHTML = scoredProfiles.map((p, rankIndex) => {
      const ratingWidget = window.ratingSystem
        ? window.ratingSystem.renderHtml(p.id, true)
        : '<span style="color:#F59E0B;font-size:0.75rem;">★ 4.9 (34)</span>';

      return `
        <div class="glass-card hobby-card" style="display: flex; flex-direction: column; justify-content: space-between; position: relative; border-radius: 20px;">
          ${rankIndex === 0 ? '<span class="badge badge-emerald" style="position: absolute; top: 12px; right: 12px; font-size: 0.7rem;">🔥 Bester Match</span>' : ''}
          
          <div>
            <div style="margin-bottom: 8px;">
              ${ratingWidget}
            </div>

            <div class="hobby-user-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div class="hobby-avatar" style="font-size: 2.2rem; background: var(--bg-surface); padding: 10px; border-radius: 16px; border: 1px solid var(--border-line);">${p.avatar}</div>
              <div>
                <h4 style="font-size: 1.15rem; color: var(--text-main); font-weight: 800; margin: 0;">${p.name}</h4>
                <p style="font-size: 0.8rem; color: var(--text-dim); margin: 2px 0 0;">📍 ${p.city}</p>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 10px 14px; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--border-line);">
              <span style="font-size: 0.95rem; font-weight: 800; color: var(--emerald-primary);">
                🧬 ${p.calculatedScore}% Hobby-Match
              </span>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${p.badges.map(b => `<span class="badge badge-gold" style="font-size: 0.68rem; padding: 2px 6px;">${b}</span>`).join('')}
              </div>
            </div>

            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 14px;">
              "${p.bio}"
            </p>

            <!-- Shared Hobbies Overlap Tags -->
            ${p.matchedHobbies.length > 0 ? `
              <div style="margin-bottom: 12px; font-size: 0.78rem;">
                <span style="color: var(--sand-gold); font-weight: 700;">Gemeinsame Leidenschaften:</span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
                  ${p.matchedHobbies.map(h => `<span style="background: rgba(245,158,11,0.12); color: var(--sand-gold); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700;">${h}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- High Contrast Aktuell Box -->
            <div class="safety-advice-box" style="margin-bottom: 14px; border-left: 3px solid var(--emerald-primary); background: var(--bg-surface); padding: 10px 12px; border-radius: 8px; font-size: 0.82rem; color: var(--text-main);">
              📌 <strong>Aktuell vor Ort:</strong> ${p.currentActivity}
            </div>
          </div>

          <button class="btn btn-primary" style="width: 100%; font-size: 0.88rem; font-weight: 700; padding: 10px;" onclick="window.hobbyDNA.openMeetupModal('${p.id}', '${p.name}', '${p.avatar}', ${p.calculatedScore}, '${p.currentActivity}')">
            🤝 Gemeinsam ausüben / Treffen anfragen 💬
          </button>
        </div>
      `;
    }).join('');
  }

  openMeetupModal(userId, userName, userAvatar, score, activity) {
    let modal = document.getElementById('hobbyMeetupModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hobbyMeetupModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 580px; width: 95%;">
        <button class="modal-close" onclick="document.getElementById('hobbyMeetupModal').style.display='none'">×</button>
        
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <div style="font-size: 2.5rem; background: var(--bg-surface); padding: 10px; border-radius: 16px; border: 1px solid var(--border-line);">${userAvatar}</div>
          <div>
            <span class="badge badge-emerald">🧬 ${score}% Hobby-Kompatibilität</span>
            <h3 style="margin: 4px 0 0; font-size: 1.35rem; color: var(--text-main);">Treffen mit ${userName} anfragen</h3>
          </div>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-line); border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; font-size: 0.85rem; color: var(--text-muted);">
          📍 <strong>Aktuelle Aktivität:</strong> ${activity}
        </div>

        <!-- Joint Activity Choices -->
        <div style="margin-bottom: 14px;">
          <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Was möchtet ihr gemeinsam unternehmen?</label>
          <select id="meetupActivitySelect" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-size: 0.9rem;">
            <option value="Gemeinsame Surf-Session & Wellen checken">🏄 Gemeinsame Surf-Session & Wellen checken</option>
            <option value="Hundespaziergang & Klippenwanderung">🐶 Schattiger Hundespaziergang & Klippenpfad</option>
            <option value="Traditionelle Tasca & Fado-Abend">🍲 Traditionelle Tasca & Fado-Abend</option>
            <option value="Fototour & versteckte Aussichtspunkte">📸 Fototour & versteckte Aussichtspunkte</option>
            <option value="Klettern, Outdoor & Natur erkunden">🧗 Klettern, Outdoor & Natur erkunden</option>
            <option value="Café-Plausch & Reisetipps austauschen">☕ Café-Plausch & Reisetipps austauschen</option>
          </select>
        </div>

        <!-- Custom Message -->
        <div style="margin-bottom: 16px;">
          <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 6px;">Deine persönliche Nachricht / Terminvorschlag:</label>
          <textarea id="meetupMessageText" rows="3" placeholder="Hallo ${userName}, ich habe dein Profil auf Scratch'n'Travel gesehen und hätte großes Interesse, die Tage gemeinsam loszuziehen!" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-line); background: var(--bg-input); color: var(--text-main); font-family: inherit; font-size: 0.88rem;"></textarea>
        </div>

        <!-- Safety Advice -->
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--emerald-primary); padding: 10px 14px; border-radius: 10px; font-size: 0.78rem; color: var(--text-main); margin-bottom: 16px;">
          🛡️ <strong>Sicherheits-Etikette:</strong> Trefft euch stets an belebten, öffentlichen Orten (z.B. Café, Surfstrand-Kiosk). Keine Weitergabe sensibler privater Daten nötig.
        </div>

        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem;" onclick="window.hobbyDNA.sendMeetupInvite('${userName}')">
          🚀 Treffen-Anfrage Senden (+1 Rubbelkarte verdienen 🪙)
        </button>
      </div>
    `;

    modal.style.display = 'flex';
  }

  sendMeetupInvite(userName) {
    const act = document.getElementById('meetupActivitySelect')?.value || 'Gemeinsame Aktivität';
    const modal = document.getElementById('hobbyMeetupModal');
    if (modal) modal.style.display = 'none';

    // Show Confirmation Toast
    if (window.stripeManager && typeof window.stripeManager.showToast === 'function') {
      window.stripeManager.showToast('💬 Anfrage an ' + userName + ' für "' + act + '" erfolgreich übermittelt!');
    }

    // Award Scratch Wallet Card for Community Engagement
    if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
      window.scratchWallet.award('share_story'); // +1 card
    }
  }
}

function connectHobbyUser(userName, hobbyId) {
  if (window.hobbyDNA) {
    window.hobbyDNA.openMeetupModal(userName, userName, '🌟', 92, 'Gemeinsame Reiseaktivität');
  }
}

window.hobbyDNA = new HobbyDNAEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.hobbyDNA.renderHobbySelector();
  window.hobbyDNA.renderMatches();
});
