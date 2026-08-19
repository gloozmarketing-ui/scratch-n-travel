/**
 * Scratch'n'Travel — Main Application Logic
 * Manages Spot Filtering, Secret Unlocking, Scratchbook Memory Export,
 * Hobby Matching, "I'm Here" Broadcasts & UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Scratch\'n\'Travel App Initialized 🌍');
  
  // Init Checklists
  if (window.familyPetEngine) {
    window.familyPetEngine.renderChecklist('family-checklist-box', window.familyPetEngine.familyItems, 'family');
    window.familyPetEngine.renderChecklist('pet-checklist-box', window.familyPetEngine.petItems, 'pet');
  }

  // Init Spot Filter Listeners
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const tag = e.target.getAttribute('data-filter');
      filterSpots(tag);
    });
  });

  // Sync Tier badge in app navbar
  if (window.stripeManager) {
    window.stripeManager.updateUserTierUI();
  }
});

function filterSpots(tag) {
  const cards = document.querySelectorAll('.spot-card');
  cards.forEach(card => {
    if (tag === 'all') {
      card.style.display = 'flex';
    } else {
      const cardTags = card.getAttribute('data-tags') || '';
      if (cardTags.includes(tag)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    }
  });
  if (window.scratchDB) {
    window.scratchDB.logEvent('FILTER_SPOTS_CLICK', { tag });
  }
}

// Secret Spot Etiquette Unlock
function openUnlockModal(spotId, title) {
  const modal = document.getElementById('unlockModal');
  const titleEl = document.getElementById('modalSpotTitle');
  if (modal && titleEl) {
    titleEl.textContent = title;
    modal.style.display = 'flex';
    modal.setAttribute('data-target-spot', spotId);
  }
}

function closeUnlockModal() {
  const modal = document.getElementById('unlockModal');
  if (modal) modal.style.display = 'none';
}

function confirmEtiquettePledge() {
  const modal = document.getElementById('unlockModal');
  const spotId = modal.getAttribute('data-target-spot');
  
  const blurOverlay = document.getElementById(`blur-${spotId}`);
  const revealContent = document.getElementById(`reveal-${spotId}`);
  
  if (blurOverlay && revealContent) {
    blurOverlay.style.display = 'none';
    revealContent.style.display = 'block';
  }
  
  alert('🔓 Ehrenkodex akzeptiert! Die genauen Koordinaten und der Geheimtipp sind jetzt freigeschaltet.');
  closeUnlockModal();

  if (window.scratchDB) {
    window.scratchDB.logEvent('SECRET_UNLOCKED', { spotId });
  }
}

// Airline Pet Calculator Handler
function calculatePetFlight() {
  const weight = parseFloat(document.getElementById('petWeightKg')?.value) || 0;
  const carrier = parseFloat(document.getElementById('carrierWeightKg')?.value) || 0;
  const airline = document.getElementById('airlineSelect')?.value || 'lufthansa';
  
  const result = window.familyPetEngine.evaluatePetTransport(weight, carrier, airline);
  const outputEl = document.getElementById('airlineResultOutput');
  
  if (outputEl) {
    outputEl.innerHTML = `
      <div class="glass-card" style="margin-top: 16px; border-color: ${result.allowed ? 'var(--emerald-primary)' : 'var(--rose-heart)'};">
        <h4 style="color: ${result.allowed ? 'var(--emerald-primary)' : 'var(--rose-heart)'};">${result.allowed ? 'Flugberechnung Ergebnis' : 'Nicht erlaubt'}</h4>
        <p style="margin-top: 8px; color: #FFF;">${result.message || result.reason}</p>
        ${result.carrierMax ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Max. Tasche: ${result.carrierMax}</p>` : ''}
      </div>
    `;
  }
}

// AI Concierge Ask Handler
async function handleConciergeSubmit() {
  const input = document.getElementById('aiPromptInput');
  const output = document.getElementById('aiConciergeResponse');
  
  if (!input || !input.value.trim()) return;
  const prompt = input.value.trim();
  
  if (output) {
    output.innerHTML = '<p style="color: var(--cyan-accent);">🤖 Die KI analysiert die besten Familien- & Haustierspots...</p>';
    const response = await window.hermesConcierge.askConcierge(prompt, 'Lissabon');
    output.innerHTML = `<div class="glass-card" style="margin-top: 16px; font-size: 0.95rem;">${markedParse(response)}</div>`;
  }
}

// Helper to convert Markdown line breaks to HTML
function markedParse(text) {
  return text
    .replace(/### (.*)/g, '<h4 style="color: var(--emerald-primary); margin: 12px 0 6px;">$1</h4>')
    .replace(/\* (.*)/g, '• $1<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Scratchbook Memory Printer / Exporter
function exportScratchbook() {
  if (window.stripeManager) {
    window.stripeManager.showToast('📖 Dein Reise-Scratchbook PDF wird vorbereitet...');
  }
  window.print();
}

// "I'm Here" Broadcast Handler (Module B)
function broadcastImHere() {
  const city = prompt('In welcher Stadt bist du gerade?', 'Lissabon');
  if (!city) return;
  const dates = prompt('Bis wann bist du vor Ort?', '22. August 2026');
  if (!dates) return;

  if (window.stripeManager) {
    window.stripeManager.showToast(`📡 "I'm Here" Broadcast aktualisiert für ${city} bis ${dates}!`);
  }
  if (window.scratchDB) {
    window.scratchDB.logEvent('IM_HERE_BROADCAST', { city, dates });
  }
}

// Hobby Match Connect Handler (Module B)
function connectHobbyUser(userName, topic) {
  const message = prompt(`Nachricht an ${userName} senden zum Thema "${topic}":`, `Hallo ${userName}, ich habe dein Profil auf Scratch'n'Travel gesehen und hätte großes Interesse am ${topic}! Passt es dir die Tage?`);
  if (message) {
    if (window.stripeManager) {
      window.stripeManager.showToast(`💬 Nachricht an ${userName} erfolgreich gesendet!`);
    }
    if (window.scratchDB) {
      window.scratchDB.logEvent('HOBBY_MESSAGE_SENT', { recipient: userName, topic, messageLength: message.length });
    }
  }
}

// Quick Prompt Helper for AI Concierge
function setQuickPrompt(promptText) {
  const input = document.getElementById('aiPromptInput');
  if (input) {
    input.value = promptText;
    input.focus();
    handleConciergeSubmit();
  }
}
