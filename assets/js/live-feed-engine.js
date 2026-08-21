/**
 * Scratch'n'Travel — Live Community Activity Feed v4.0
 * Renders real-time social proof ticker across the landing page
 */

(function () {
  'use strict';

  const LIVE_EVENTS = [
    { text: '🟢 <strong>Marco (München)</strong> hat "Praia da Ursa" freigerubbelt', time: 'vor 2 Min.' },
    { text: '🟢 <strong>Sarah (Lissabon)</strong> sucht Surf-Partner für Sonnenuntergang', time: 'vor 5 Min.' },
    { text: '🟢 <strong>23 neue Hobby-Matches</strong> in Portugal verfügbar', time: 'vor 11 Min.' },
    { text: '🟢 <strong>Felix (Vanlife)</strong> hat Stellplatz-Geheimtipp Sagres geteilt', time: 'vor 17 Min.' },
    { text: '🟢 <strong>Elena (Kyiv)</strong> ist der Gruppe "Algarve Klippenwandern" beigetreten', time: 'vor 24 Min.' }
  ];

  function LiveFeedEngine() {
    this.currentIndex = 0;
  }

  LiveFeedEngine.prototype.render = function (containerId) {
    containerId = containerId || 'liveActivityFeed';
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 9999px; padding: 6px 18px; display: inline-flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--text-main); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <span style="display: inline-block; width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981; animation: pulse 2s infinite;"></span>
        <span id="liveFeedTextContainer">${LIVE_EVENTS[0].text}</span>
        <span id="liveFeedTimeContainer" style="color: var(--text-dim); font-size: 0.74rem;">${LIVE_EVENTS[0].time}</span>
      </div>
    `;

    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % LIVE_EVENTS.length;
      const textEl = document.getElementById('liveFeedTextContainer');
      const timeEl = document.getElementById('liveFeedTimeContainer');
      if (textEl && timeEl) {
        textEl.style.opacity = '0';
        setTimeout(() => {
          textEl.innerHTML = LIVE_EVENTS[this.currentIndex].text;
          timeEl.textContent = LIVE_EVENTS[this.currentIndex].time;
          textEl.style.opacity = '1';
        }, 300);
      }
    }, 4500);
  };

  window.liveFeed = new LiveFeedEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.liveFeed.render();
  });

})();
