/**
 * Scratch'n'Travel — Test Account Seeder
 * Creates 4 full-access test profiles in localStorage for all subscription tiers.
 * Inject via DevTools console on http://localhost:3388 — or loaded via URL param ?seed=1
 */

(function seedTestAccounts() {
  const TEST_ACCOUNTS = [
    {
      id: 'test_vip_001',
      email: 'vip.tester@scratchntravel.test',
      password: 'ScratchVIP2026!',
      name: 'Marco VIP',
      avatar: '🧭',
      plan: 'vip_platin',
      planLabel: 'VIP Platin ♾️',
      xp: 12450, level: 42, badges_count: 87,
      scratch_cards: 9999, scratch_percent: 38, continents: 5,
      role: 'vip',
      verified_local: true,
      city: 'Lissabon',
      hobbies: ['Surfen', 'Klettern', 'Tauchen', 'Yoga', 'Street Food', 'Kitesurfen'],
      features: {
        unlimitedScratchCards: true, gpsBlurToggle: true, gpxExport: true,
        aiConcierge: true, groupMatching: true, secretSpots: true,
        hazardFullModal: true, b2bPortal: true, merchDiscount: 30,
        prioritySupport: true, localGuideVerification: true, budgetRadar: true,
        worldScratchStats: true, communityRoutes: true, communityChat: true,
        realtimeTranslation: true, diplomacyBadges: true
      }
    },
    {
      id: 'test_family_002',
      email: 'family.tester@scratchntravel.test',
      password: 'FamilyPro2026!',
      name: 'Lisa Family',
      avatar: '👨‍👩‍👧',
      plan: 'family_pet_pro',
      planLabel: 'Family & Pet Pro 🐾',
      xp: 4200, level: 18, badges_count: 34,
      scratch_cards: 9999, scratch_percent: 19, continents: 3,
      role: 'pro',
      verified_local: false,
      city: 'Barcelona',
      hobbies: ['Schwimmen', 'Wandern', 'Fotografie', 'Kochen', 'Strand', 'Haustier-freundlich'],
      features: {
        unlimitedScratchCards: true, gpsBlurToggle: false, gpxExport: true,
        aiConcierge: true, groupMatching: true, secretSpots: true,
        hazardFullModal: true, b2bPortal: false, merchDiscount: 15,
        prioritySupport: false, localGuideVerification: false, budgetRadar: true,
        worldScratchStats: true, communityRoutes: true, communityChat: true,
        realtimeTranslation: true, diplomacyBadges: false
      }
    },
    {
      id: 'test_explorer_003',
      email: 'explorer.tester@scratchntravel.test',
      password: 'Explorer2026!',
      name: 'Tom Explorer',
      avatar: '🏄‍♂️',
      plan: 'explorer_pro',
      planLabel: 'Explorer Pro 🌍',
      xp: 1880, level: 9, badges_count: 12,
      scratch_cards: 15, scratch_percent: 7, continents: 2,
      role: 'explorer',
      verified_local: false,
      city: 'Ericeira',
      hobbies: ['Surfen', 'Klippenspringen', 'Musik', 'Nightlife', 'Weinproben'],
      features: {
        unlimitedScratchCards: false, gpsBlurToggle: false, gpxExport: false,
        aiConcierge: true, groupMatching: true, secretSpots: false,
        hazardFullModal: false, b2bPortal: false, merchDiscount: 0,
        prioritySupport: false, localGuideVerification: false, budgetRadar: true,
        worldScratchStats: false, communityRoutes: true, communityChat: true,
        realtimeTranslation: false, diplomacyBadges: false
      }
    },
    {
      id: 'test_free_004',
      email: 'free.tester@scratchntravel.test',
      password: 'FreeUser2026!',
      name: 'Anna Free',
      avatar: '🌸',
      plan: 'free',
      planLabel: 'Free Starter 🌱',
      xp: 320, level: 2, badges_count: 3,
      scratch_cards: 5, scratch_percent: 2, continents: 1,
      role: 'free',
      verified_local: false,
      city: 'Porto',
      hobbies: ['Wandern', 'Fotografie'],
      features: {
        unlimitedScratchCards: false, gpsBlurToggle: false, gpxExport: false,
        aiConcierge: false, groupMatching: false, secretSpots: false,
        hazardFullModal: false, b2bPortal: false, merchDiscount: 0,
        prioritySupport: false, localGuideVerification: false, budgetRadar: false,
        worldScratchStats: false, communityRoutes: false, communityChat: false,
        realtimeTranslation: false, diplomacyBadges: false
      }
    }
  ];

  localStorage.setItem('snt_test_accounts', JSON.stringify(TEST_ACCOUNTS));

  // Activate VIP account by default
  const activeAccount = TEST_ACCOUNTS[0];
  localStorage.setItem('snt_current_user', JSON.stringify(activeAccount));
  localStorage.setItem('snt_plan', activeAccount.plan);
  localStorage.setItem('snt_user_xp', activeAccount.xp);
  localStorage.setItem('snt_user_level', activeAccount.level);

  // Global account switcher for testing
  window.switchTestAccount = function(index) {
    const acc = JSON.parse(localStorage.getItem('snt_test_accounts'))[index];
    if (!acc) return console.warn('Kein Account an Index', index);
    localStorage.setItem('snt_current_user', JSON.stringify(acc));
    localStorage.setItem('snt_plan', acc.plan);
    localStorage.setItem('snt_user_xp', acc.xp);
    localStorage.setItem('snt_user_level', acc.level);
    console.log('🔄 Gewechselt zu:', acc.name, '|', acc.planLabel);
    window.location.reload();
  };

  // Auto-seed via URL param: ?seed=1
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('seed')) {
      console.info('🧪 Test-Accounts via URL ?seed=1 aktiviert');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log("🧪 SCRATCH\'N\'TRAVEL — TEST ACCOUNTS SEEDED");
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  TEST_ACCOUNTS.forEach(function(acc, i) {
    console.log('[' + i + '] ' + acc.avatar + ' ' + acc.name + ' | ' + acc.planLabel);
    console.log('    📧 ' + acc.email + '  🔑 ' + acc.password);
    console.log('    ▶ switchTestAccount(' + i + ') zum Wechseln');
    console.log('');
  });
  console.log('✅ VIP Account ist aktiv. Wechseln: switchTestAccount(0–3)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})();
