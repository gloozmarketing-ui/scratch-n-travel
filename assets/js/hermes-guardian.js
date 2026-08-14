/**
 * Scratch'n'Travel — Hermes Content Guardian & Security Shield
 * 
 * Functions:
 * 1. Community Experience Exchange (Give-to-Get: Free Beta in exchange for authentic travel stories)
 * 2. Strict Zero-Tolerance Moderation:
 *    - Anti-Terrorism / Extremism / Violence
 *    - Anti-Racism / Hate Speech / Discrimination / Body-Shaming / Harassment
 * 3. Anti-Prompt-Injection & Hacking Shield:
 *    - Blocks Jailbreaks ("ignore previous instructions", "DAN", "system prompt reveal")
 *    - XSS Sanitization (<script>, onerror, javascript:)
 *    - SQL Injection Sanitization (UNION, SELECT, DROP)
 * 4. Relaxed & Authentic Travel Vibe Preservation
 */

const GUARDIAN_CONFIG = {
  // Regex filters for absolute zero-tolerance threats
  terrorTerms: [
    /\b(terror|terroris\w*|bomb\w*|anschlag|sprengstoff|isis|al-?qaida|hamas|attentat|massaker|jihad|weapon|explosiv\w*)\b/i,
    /\b(kill\s+all|töte\s+alle|hinricht\w*|enthaupt\w*|hostage|geisel\w*)\b/i
  ],

  hateRacismTerms: [
    /\b(nigg\w*|kanak\w*|judenschwein|hakenkreuz|nazi|hitler|heil\s+hitler|ausländer\s+raus|white\s+supremac\w*)\b/i,
    /\b(hurensohn|arschloch|bastard|fotze|schlampe|faggot|tranny|slut|whore)\b/i,
    /\b(verrecke|bring\s+dich\s+um|kys|retard|spast\w*)\b/i
  ],

  // Anti-Prompt-Injection & Hacking Patterns
  injectionPatterns: [
    /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
    /you\s+are\s+now\s+(DAN|unrestricted|jailbroken|evil)/i,
    /system\s*prompt\s*(reveal|leak|show|print|output)/i,
    /override\s+(system|safety|security)\s+(rules|policy|instructions)/i,
    /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/is,
    /javascript\s*:/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /(union\s+select|select\s+\*\s+from|drop\s+table|insert\s+into\s+profiles)/i,
    /\{\{.*?\}\}/g // template injection
  ]
};

class HermesContentGuardian {
  constructor() {
    this.submissions = JSON.parse(localStorage.getItem('scratch_community_stories')) || [
      {
        id: 'story_1',
        author: 'Julian & Lisa (Berlin)',
        badge: 'Early Bird Explorer',
        city: 'Lissabon & Sintra',
        title: 'Geheimer Klippenweg mit unserem Golden Retriever Sammy',
        story: 'Wir haben den Beta-Zugang genutzt und wollten unseren besten Spot teilen: Am Strand Praia da Ursa gibt es links an den Felsen eine kleine Süßwasser-Quelle, perfekt damit der Hund trinken kann!',
        rating: 5,
        likes: 24,
        date: '14. August 2026'
      },
      {
        id: 'story_2',
        author: 'Marco (München)',
        badge: 'Local Spot Hunter',
        city: 'Porto',
        title: 'Keine Touristenfalle: Echte Francesinha bei O Afonso',
        story: 'Im Zentrum wird Francesinha oft für 18 € mit kaltem Käse serviert. Bei O Afonso zahlen Einheimische 9,50 € und die Sauce ist ein Traum. Unbedingt die scharfe Sauce probieren!',
        rating: 5,
        likes: 19,
        date: '12. August 2026'
      }
    ];
  }

  // Security & Content Inspection
  inspectContent(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return { isSafe: false, reason: 'Leerer oder ungültiger Text', confidence: 0.99 };
    }

    const text = rawText.trim();

    // 1. Check Anti-Prompt Injection & Hacking
    for (const pattern of GUARDIAN_CONFIG.injectionPatterns) {
      if (pattern.test(text)) {
        return {
          isSafe: false,
          flag: 'INJECTION_SECURITY_BREACH',
          reason: 'Sicherheitsverstoß: Manipulations- oder Prompt-Injection-Versuch abgewehrt.',
          confidence: 0.99
        };
      }
    }

    // 2. Check Terrorism & Extreme Violence
    for (const pattern of GUARDIAN_CONFIG.terrorTerms) {
      if (pattern.test(text)) {
        return {
          isSafe: false,
          flag: 'TERRORISM_VIOLENCE_BLOCKED',
          reason: 'Verstoß gegen Sicherheitsrichtlinien: Gewalt- oder Extremismus-Schlagwörter erkannt.',
          confidence: 0.98
        };
      }
    }

    // 3. Check Hate Speech, Racism & Harassment
    for (const pattern of GUARDIAN_CONFIG.hateRacismTerms) {
      if (pattern.test(text)) {
        return {
          isSafe: false,
          flag: 'HATE_RACISM_BLOCKED',
          reason: 'Inhalt blockiert: Diskriminierung, Beleidigung oder Hassrede sind auf Scratch\'n\'Travel streng untersagt.',
          confidence: 0.97
        };
      }
    }

    // 4. Sanitize text for safe display (remove HTML brackets)
    const sanitized = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return {
      isSafe: true,
      cleanedText: sanitized,
      confidence: 0.95,
      decision_reason: 'Hermes Guardian: Text geprüft — Travel-Vibe authentisch & sicher.'
    };
  }

  // Submit Community Experience (Give-to-Get Exchange)
  submitExperience(title, story, authorName, city = 'Lissabon') {
    const inspectionTitle = this.inspectContent(title);
    if (!inspectionTitle.isSafe) {
      alert(`⚠️ Beitrag abgewiesen:\n${inspectionTitle.reason}`);
      return false;
    }

    const inspectionStory = this.inspectContent(story);
    if (!inspectionStory.isSafe) {
      alert(`⚠️ Beitrag abgewiesen:\n${inspectionStory.reason}`);
      return false;
    }

    const newStory = {
      id: `story_${Date.now()}`,
      author: authorName || 'Reise-Pionier',
      badge: 'Community Contributor (VIP Freigeschaltet)',
      city,
      title: inspectionTitle.cleanedText,
      story: inspectionStory.cleanedText,
      rating: 5,
      likes: 1,
      date: new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    this.submissions.unshift(newStory);
    localStorage.setItem('scratch_community_stories', JSON.stringify(this.submissions));

    // Unlock Pro Tier in exchange for the contribution!
    if (window.stripeManager) {
      window.stripeManager.currentTier = 'pro_family';
      localStorage.setItem('scratch_user_tier', 'pro_family');
      window.stripeManager.updateUserTierUI();
      window.stripeManager.showToast('🎉 Danke für deinen Erfahrungsbericht! Dein VIP Pro-Zugang ist kostenlos aktiv.');
    }

    if (window.scratchDB) {
      window.scratchDB.logEvent('COMMUNITY_EXPERIENCE_SHARED', {
        city,
        titleLength: title.length,
        storyLength: story.length
      });
    }

    this.renderCommunityFeed();
    return true;
  }

  renderCommunityFeed(containerId = 'communityFeedGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.submissions.map(item => `
      <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 3px solid var(--cyan-accent);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <strong style="color: #FFF; font-size: 1.05rem;">${item.author}</strong>
              <div style="font-size: 0.78rem; color: var(--emerald-primary);">${item.badge}</div>
            </div>
            <span class="badge badge-cyan" style="font-size: 0.72rem;">📍 ${item.city}</span>
          </div>

          <h4 style="font-size: 1.15rem; margin: 8px 0; color: #F8FAFC;">${item.title}</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${item.story}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--border-line); font-size: 0.8rem; color: var(--text-dim);">
          <span>📅 ${item.date}</span>
          <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.75rem;" onclick="window.hermesGuardian.likeStory('${item.id}')">
            ❤️ ${item.likes} Hilfreich
          </button>
        </div>
      </div>
    `).join('');
  }

  likeStory(storyId) {
    const story = this.submissions.find(s => s.id === storyId);
    if (story) {
      story.likes++;
      localStorage.setItem('scratch_community_stories', JSON.stringify(this.submissions));
      this.renderCommunityFeed();
    }
  }

  openShareModal() {
    const modal = document.getElementById('shareExperienceModal');
    if (modal) modal.style.display = 'flex';
  }

  closeShareModal() {
    const modal = document.getElementById('shareExperienceModal');
    if (modal) modal.style.display = 'none';
  }
}

window.hermesGuardian = new HermesContentGuardian();

document.addEventListener('DOMContentLoaded', () => {
  window.hermesGuardian.renderCommunityFeed();
});