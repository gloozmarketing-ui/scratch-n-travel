/**
 * Scratch'n'Travel — Universal 5-Star Rating & Review Engine v1.0
 * Enables interactive 5-star ratings for all Local Insiders, Story Pins, 
 * Community posts, AI advice and National Treasures.
 * 
 * Features:
 * - Interactive hover & click star voting (1 to 5 stars)
 * - Persistent storage in localStorage ('snt_ratings')
 * - Automatic average rating calculation & review count display
 * - Rewarding active raters with Scratch Wallet cards (+1 card on rating!)
 * - Toast feedback animations
 */

(function () {
  'use strict';

  // Seed default community ratings if empty
  const DEFAULT_RATINGS = {
    'spot_ursa':        { count: 48,  sum: 236, userVote: null }, // ~4.9 avg
    'spot_nazare':      { count: 112, sum: 548, userVote: null }, // ~4.9 avg
    'spot_alfama':      { count: 76,  sum: 365, userVote: null }, // ~4.8 avg
    'spot_guincho':     { count: 39,  sum: 187, userVote: null }, // ~4.8 avg
    'user_pedro':       { count: 34,  sum: 170, userVote: null }, // 5.0 avg
    'user_clara':       { count: 29,  sum: 142, userVote: null }, // 4.9 avg
    'user_ines':        { count: 53,  sum: 254, userVote: null }, // 4.8 avg
    'user_ricardo':     { count: 41,  sum: 197, userVote: null }, // 4.8 avg
    'treas_iberia':     { count: 64,  sum: 314, userVote: null }, // 4.9 avg
    'treas_italy':      { count: 88,  sum: 432, userVote: null }, // 4.9 avg
    'treas_greece':     { count: 52,  sum: 255, userVote: null }, // 4.9 avg
    'treas_japan':      { count: 96,  sum: 475, userVote: null }, // 4.95 avg
    'ai_concierge_res': { count: 120, sum: 588, userVote: null }, // 4.9 avg
  };

  function getRatings() {
    try {
      const stored = localStorage.getItem('snt_ratings');
      if (stored) return Object.assign({}, DEFAULT_RATINGS, JSON.parse(stored));
    } catch (e) {}
    return Object.assign({}, DEFAULT_RATINGS);
  }

  function saveRatings(ratings) {
    try {
      localStorage.setItem('snt_ratings', JSON.stringify(ratings));
    } catch (e) {}
  }

  /**
   * Submit a star vote (1-5) for any item
   */
  function rateItem(itemId, stars) {
    stars = Math.max(1, Math.min(5, parseInt(stars, 10) || 5));
    const ratings = getRatings();
    
    if (!ratings[itemId]) {
      ratings[itemId] = { count: 0, sum: 0, userVote: null };
    }

    const item = ratings[itemId];
    if (item.userVote) {
      // Update existing vote
      item.sum = item.sum - item.userVote + stars;
      item.userVote = stars;
    } else {
      // New vote
      item.count += 1;
      item.sum += stars;
      item.userVote = stars;

      // Gamification Reward: +1 Scratch Card in wallet!
      if (window.scratchWallet && typeof window.scratchWallet.award === 'function') {
        window.scratchWallet.award('share_story'); // awards +1 card
      }
    }

    saveRatings(ratings);
    updateAllRatingWidgets(itemId);

    // Show Toast
    showRatingToast(stars);
  }

  function showRatingToast(stars) {
    const toast = document.createElement('div');
    toast.className = 'rating-toast';
    toast.style.cssText = [
      'position: fixed', 'bottom: 30px', 'right: 30px', 'z-index: 10000',
      'background: #102A1C', 'color: #FFF', 'border: 1.5px solid #10B981',
      'border-radius: 14px', 'padding: 14px 22px', 'box-shadow: 0 10px 40px rgba(0,0,0,0.5)',
      'display: flex', 'align-items: center', 'gap: 12px', 'font-size: 0.92rem',
      'font-weight: 700', 'animation: slideInRight 0.3s ease'
    ].join(';');

    toast.innerHTML = [
      '<span style="font-size: 1.4rem;">' + '⭐'.repeat(stars) + '</span>',
      '<div>',
      '  <div style="color: #F8FAFC;">Danke für deine Bewertung!</div>',
      '  <div style="font-size: 0.78rem; color: #F59E0B; font-weight: 600;">+1 Rubbel-Karte im Wallet verdient 🪙</div>',
      '</div>'
    ].join('');

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /**
   * Render HTML string for a rating widget
   */
  function renderRatingWidgetHtml(itemId, compact) {
    const ratings = getRatings();
    const item = ratings[itemId] || { count: 12, sum: 59, userVote: null };
    const avg = item.count > 0 ? (item.sum / item.count).toFixed(1) : '5.0';
    const userVote = item.userVote || 0;

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      const active = i <= (userVote || Math.round(avg)) ? 'active' : '';
      const isUser = i <= userVote ? 'user-rated' : '';
      starsHtml += '<span class="star-btn ' + active + ' ' + isUser + '" data-star="' + i + '" data-item="' + itemId + '" onclick="window.ratingSystem.rate(\'' + itemId + '\', ' + i + ')">★</span>';
    }

    if (compact) {
      return [
        '<div class="rating-widget-compact" id="rating_' + itemId + '">',
        '  <span class="rating-stars">' + starsHtml + '</span>',
        '  <strong class="rating-score">' + avg + '</strong>',
        '  <span class="rating-count">(' + item.count + ')</span>',
        '</div>'
      ].join('');
    }

    return [
      '<div class="rating-widget" id="rating_' + itemId + '">',
      '  <div class="rating-stars-interactive">' + starsHtml + '</div>',
      '  <div class="rating-meta">',
      '    <strong class="rating-score">' + avg + ' ★</strong>',
      '    <span class="rating-count">(' + item.count + ' ' + (item.count === 1 ? 'Bewertung' : 'Bewertungen') + ')</span>',
      (userVote ? '    <span class="rating-user-badge">Deine: ' + userVote + '★</span>' : ''),
      '  </div>',
      '</div>'
    ].join('');
  }

  function updateAllRatingWidgets(targetItemId) {
    const widgets = document.querySelectorAll('[id^="rating_' + (targetItemId || '') + '"]');
    widgets.forEach(widget => {
      const id = widget.id.replace('rating_', '');
      const isCompact = widget.classList.contains('rating-widget-compact');
      const newHtml = renderRatingWidgetHtml(id, isCompact);
      const temp = document.createElement('div');
      temp.innerHTML = newHtml;
      if (temp.firstElementChild) {
        widget.innerHTML = temp.firstElementChild.innerHTML;
      }
    });
  }

  // Public API
  window.ratingSystem = {
    rate: rateItem,
    renderHtml: renderRatingWidgetHtml,
    updateWidgets: updateAllRatingWidgets,
    getRatings: getRatings
  };

  // Auto attach hover listeners for star interactive feedback
  document.addEventListener('mouseover', function (e) {
    if (e.target && e.target.classList.contains('star-btn')) {
      const parent = e.target.closest('.rating-stars-interactive, .rating-stars');
      if (!parent) return;
      const hoverVal = parseInt(e.target.getAttribute('data-star'), 10);
      parent.querySelectorAll('.star-btn').forEach(btn => {
        const val = parseInt(btn.getAttribute('data-star'), 10);
        btn.classList.toggle('hovered', val <= hoverVal);
      });
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target && e.target.classList.contains('star-btn')) {
      const parent = e.target.closest('.rating-stars-interactive, .rating-stars');
      if (!parent) return;
      parent.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('hovered'));
    }
  });

})();
