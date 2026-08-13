/**
 * Scratch'n'Travel — Supabase REST & Direct API Bridge
 * Connects to Supabase Free Tier Backend
 */

const SUPABASE_CONFIG = {
  url: window.SUPABASE_URL || 'https://acgfcjcikjlrlfilqdyk.supabase.co',
  key: window.SUPABASE_ANON_KEY || ''
};

class ScratchSupabase {
  constructor() {
    this.url = SUPABASE_CONFIG.url;
    this.key = SUPABASE_CONFIG.key;
  }

  async request(endpoint, method = 'GET', body = null) {
    try {
      const headers = {
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      };
      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`${this.url}/rest/v1/${endpoint}`, options);
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn('Supabase request failed:', err.message);
      return null;
    }
  }

  async fetchSecretSpots(city = null, filterTag = null) {
    let endpoint = 'secret_spots?select=*&order=likes_count.desc';
    if (city) endpoint += `&city=eq.${encodeURIComponent(city)}`;
    return await this.request(endpoint);
  }

  async logEvent(eventType, payload = {}) {
    return await this.request('audit_logs', 'POST', {
      event_type: eventType,
      payload: { ...payload, timestamp: new Date().toISOString() }
    });
  }
}

window.scratchDB = new ScratchSupabase();
