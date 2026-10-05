/**
 * Scratch'n'Travel — Hermes Content Guardian & Security Shield v2.2
 * 
 * Protects against:
 * 1. Prompt Injection & Jailbreak patterns
 * 2. Terrorism, Extremism, Hate Speech & Harassment
 * 3. City-Size Dependent Give-to-Get VIP Allocation Caps
 */

const CITY_VIP_CAPS = {
  'Lissabon': 50,
  'Barcelona': 50,
  'Rom': 50,
  'Paris': 50,
  'Faro': 25,
  'Cascais': 25,
  'Sintra': 25,
  'Nazaré': 10,
  'Ericeira': 10
};

class HermesGuardian {
  constructor() {
    this.cityCaps = CITY_VIP_CAPS;
    this.cityVipCounts = JSON.parse(localStorage.getItem('scratch_city_vip_counts')) || {
      'Lissabon': 38,
      'Barcelona': 19,
      'Nazaré': 8
    };
  }

  getCityVipStatus(cityName = 'Lissabon') {
    const maxCap = this.cityCaps[cityName] || 25;
    const current = this.cityVipCounts[cityName] || 0;
    return {
      cityName,
      current,
      maxCap,
      remaining: Math.max(0, maxCap - current),
      isFull: current >= maxCap
    };
  }

  inspectText(text) {
    if (!text || typeof text !== 'string') return { safe: false, reason: 'Ungültiger Text' };

    // 1. Anti-Prompt-Injection & Jailbreak Shield
    const injectionPatterns = [
      /ignore\s+previous\s+instructions/i,
      /system\s+prompt/i,
      /DAN\s+mode/i,
      /you\s+are\s+now\s+in/i,
      /developer\s+mode/i,
      /reveal\s+secret/i,
      /<script[\s\S]*?>[\s\S]*?<\/script>/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i
    ];

    for (const pat of injectionPatterns) {
      if (pat.test(text)) {
        return { safe: false, reason: '🚨 Hacking / Prompt Injection Versuch erkannt und durch den Sicherheits-Shield blockiert.' };
      }
    }

    // 2. Anti-Terrorism, Extremism & Violence
    const terrorPatterns = [
      /terror/i, /anschlag/i, /bombe/i, /isisl/i, /djiha/i, /sprengstoff/i,
      /nazi/i, /hitler/i, /volksverhetzung/i, /töten/i, /waffengewalt/i
    ];

    for (const pat of terrorPatterns) {
      if (pat.test(text)) {
        return { safe: false, reason: '🛑 Nulltoleranz: Gewalttätige, extremistische oder verbotene Inhalte blockiert.' };
      }
    }

    // 3. Anti-Hate Speech, Slurs & Body Shaming
    const hatePatterns = [
      /hurensohn/i, /nigger/i, /kanake/i, /schwuchtel/i, /missgestaltet/i, /fettsack/i
    ];

    for (const pat of hatePatterns) {
      if (pat.test(text)) {
        return { safe: false, reason: '🛑 Beleidigungen, Hate Speech oder Shaming sind in der Community verboten.' };
      }
    }

    return { safe: true, sanitized: this.sanitizeHtml(text) };
  }

  sanitizeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  submitExperience(title, story, author = 'Anonym', city = 'Lissabon') {
    const status = this.getCityVipStatus(city);
    if (status.isFull) {
      alert(`⚠️ Das Kontingent an kostenlosen 0 € VIP-Plätzen für "${city}" (${status.maxCap}/${status.maxCap}) ist erschöpft!`);
      return false;
    }

    const titleCheck = this.inspectText(title);
    const storyCheck = this.inspectText(story);

    if (!titleCheck.safe) {
      alert(titleCheck.reason);
      return false;
    }
    if (!storyCheck.safe) {
      alert(storyCheck.reason);
      return false;
    }

    // Save story & increment city VIP count
    this.cityVipCounts[city] = (this.cityVipCounts[city] || 0) + 1;
    localStorage.setItem('scratch_city_vip_counts', JSON.stringify(this.cityVipCounts));
    localStorage.setItem('scratch_user_tier', 'pro_family');

    if (window.stripeManager) {
      window.stripeManager.showToast(`✨ Story freigeschaltet! VIP 0 € Status für ${city} aktiviert (${this.cityVipCounts[city]}/${status.maxCap} Vergeben).`);
    }

    return true;
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

window.hermesGuardian = new HermesGuardian();