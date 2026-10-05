/**
 * Scratch'n'Travel — Full Test Account Seeder (User + B2B)
 * 4 User-Abos + 8 B2B Business-Typen komplett testbar
 * Aktivierung: URL ?seed=1  ODER switchTestAccount(idx) in der Browser-Konsole
 */

(function seedTestAccounts() {

  // ─── USER ABOS ─────────────────────────────────────────────────────────────

  const USER_ACCOUNTS = [
    {
      id: 'test_vip_001',
      email: 'vip.tester@scratchntravel.test',
      password: 'ScratchVIP2026!',
      name: 'Marco VIP',
      avatar: '🧭',
      plan: 'vip_platin', planLabel: 'VIP Platin ♾️',
      xp: 12450, level: 42, badges_count: 87,
      scratch_cards: 9999, scratch_percent: 38, continents: 5,
      role: 'vip', verified_local: true, city: 'Lissabon',
      hobbies: ['Surfen','Klettern','Tauchen','Yoga','Street Food','Kitesurfen'],
      features: {
        unlimitedScratchCards:true, gpsBlurToggle:true, gpxExport:true,
        aiConcierge:true, groupMatching:true, secretSpots:true,
        hazardFullModal:true, b2bPortal:true, merchDiscount:30,
        prioritySupport:true, localGuideVerification:true, budgetRadar:true,
        worldScratchStats:true, communityRoutes:true, communityChat:true,
        realtimeTranslation:true, diplomacyBadges:true
      }
    },
    {
      id: 'test_family_002',
      email: 'family.tester@scratchntravel.test',
      password: 'FamilyPro2026!',
      name: 'Lisa Family',
      avatar: '👨‍👩‍👧',
      plan: 'family_pet_pro', planLabel: 'Family & Pet Pro 🐾',
      xp: 4200, level: 18, badges_count: 34,
      scratch_cards: 9999, scratch_percent: 19, continents: 3,
      role: 'pro', verified_local: false, city: 'Barcelona',
      hobbies: ['Schwimmen','Wandern','Fotografie','Kochen','Strand'],
      features: {
        unlimitedScratchCards:true, gpsBlurToggle:false, gpxExport:true,
        aiConcierge:true, groupMatching:true, secretSpots:true,
        hazardFullModal:true, b2bPortal:false, merchDiscount:15,
        prioritySupport:false, localGuideVerification:false, budgetRadar:true,
        worldScratchStats:true, communityRoutes:true, communityChat:true,
        realtimeTranslation:true, diplomacyBadges:false
      }
    },
    {
      id: 'test_explorer_003',
      email: 'explorer.tester@scratchntravel.test',
      password: 'Explorer2026!',
      name: 'Tom Explorer',
      avatar: '🏄‍♂️',
      plan: 'explorer_pro', planLabel: 'Explorer Pro 🌍',
      xp: 1880, level: 9, badges_count: 12,
      scratch_cards: 15, scratch_percent: 7, continents: 2,
      role: 'explorer', verified_local: false, city: 'Ericeira',
      hobbies: ['Surfen','Klippenspringen','Musik','Nightlife'],
      features: {
        unlimitedScratchCards:false, gpsBlurToggle:false, gpxExport:false,
        aiConcierge:true, groupMatching:true, secretSpots:false,
        hazardFullModal:false, b2bPortal:false, merchDiscount:0,
        prioritySupport:false, localGuideVerification:false, budgetRadar:true,
        worldScratchStats:false, communityRoutes:true, communityChat:true,
        realtimeTranslation:false, diplomacyBadges:false
      }
    },
    {
      id: 'test_free_004',
      email: 'free.tester@scratchntravel.test',
      password: 'FreeUser2026!',
      name: 'Anna Free',
      avatar: '🌸',
      plan: 'free', planLabel: 'Free Starter 🌱',
      xp: 320, level: 2, badges_count: 3,
      scratch_cards: 5, scratch_percent: 2, continents: 1,
      role: 'free', verified_local: false, city: 'Porto',
      hobbies: ['Wandern','Fotografie'],
      features: {
        unlimitedScratchCards:false, gpsBlurToggle:false, gpxExport:false,
        aiConcierge:false, groupMatching:false, secretSpots:false,
        hazardFullModal:false, b2bPortal:false, merchDiscount:0,
        prioritySupport:false, localGuideVerification:false, budgetRadar:false,
        worldScratchStats:false, communityRoutes:false, communityChat:false,
        realtimeTranslation:false, diplomacyBadges:false
      }
    }
  ];

  // ─── B2B BUSINESS ACCOUNTS ─────────────────────────────────────────────────

  const B2B_ACCOUNTS = [
    {
      id: 'b2b_hotel_001',
      type: 'b2b',
      email: 'hotel.tester@scratchntravel.test',
      password: 'HotelB2B2026!',
      businessName: 'Casa do Miradouro Boutique Hotel',
      ownerName: 'Carlos Ferreira',
      avatar: '🏨',
      category: 'hotel',
      categoryLabel: '🏨 Hotel / Boutique Hotel',
      city: 'Sintra', region: 'Grande Lisboa',
      address: 'Rua do Paço 12, Sintra',
      description: 'Boutique Hotel mit direktem Blick auf den Palácio Nacional, historischer Charme, modernes Design.',
      perks: '15% Rabatt für Scratch'n'Travel VIP Gäste, kostenloses Late-Check-Out bis 14:00',
      contact: { whatsapp: '+351 912 345 678', email: 'hotel@miradouro.test', website: 'https://miradouro.test' },
      rating: 4.8, reviews_count: 127, verified: true,
      photos: ['hotel_1.jpg','hotel_2.jpg'],
      plan: 'b2b_premium', planLabel: 'B2B Premium Partner 🌟',
      features: { analytics: true, priorityListing: true, adBudget: 50, customBadge: true, promotedPin: true }
    },
    {
      id: 'b2b_apartment_002',
      type: 'b2b',
      email: 'apartment.tester@scratchntravel.test',
      password: 'ApartB2B2026!',
      businessName: 'Alfama Vintage Apartments',
      ownerName: 'Sofia Lopes',
      avatar: '🏠',
      category: 'apartment',
      categoryLabel: '🏠 Ferienwohnung / Apartment',
      city: 'Lissabon', region: 'Alfama',
      address: 'Beco das Flores 7, Alfama, Lissabon',
      description: 'Drei traditionelle Alfama-Apartments mit Fado-Terrasse, 5 min vom Castelo de São Jorge.',
      perks: 'Direktbuchung 10% günstiger als Airbnb, kostenloser Willkommens-Ginjinha',
      contact: { whatsapp: '+351 923 456 789', email: 'sofia@alfama-apt.test' },
      rating: 4.9, reviews_count: 89, verified: true,
      photos: ['apt_1.jpg','apt_2.jpg'],
      plan: 'b2b_starter', planLabel: 'B2B Starter 🏠',
      features: { analytics: true, priorityListing: false, adBudget: 0, customBadge: false, promotedPin: false }
    },
    {
      id: 'b2b_scooter_003',
      type: 'b2b',
      email: 'scooter.tester@scratchntravel.test',
      password: 'ScooterB2B2026!',
      businessName: 'LisScoot Electric Scooter Rental',
      ownerName: 'Miguel Santos',
      avatar: '🛵',
      category: 'scooter_rent',
      categoryLabel: '🛵 E-Scooter & Motorrad Verleih',
      city: 'Lissabon', region: 'Cais do Sodré',
      address: 'Rua Nova do Carvalho 33, Lissabon',
      description: 'E-Scooter und 125cc Motorräder mit GPS und Helm. Ideal für Küstenausflüge Cascais–Sintra.',
      perks: 'SNT-Mitglieder: 2 Stunden gratis bei Tagesmiete, Helm + Regenjacke inklusive',
      contact: { whatsapp: '+351 934 567 890', email: 'miguel@lisscoot.test', website: 'https://lisscoot.test' },
      pricing: { hour: '8 €', halfday: '22 €', fullday: '35 €' },
      rating: 4.7, reviews_count: 203, verified: true,
      photos: ['scooter_1.jpg'],
      plan: 'b2b_premium', planLabel: 'B2B Premium Partner 🌟',
      features: { analytics: true, priorityListing: true, adBudget: 30, customBadge: true, promotedPin: true }
    },
    {
      id: 'b2b_diving_004',
      type: 'b2b',
      email: 'diving.tester@scratchntravel.test',
      password: 'DivingB2B2026!',
      businessName: 'Oceano Profundo Diving Center',
      ownerName: 'Ana Rodrigues',
      avatar: '🤿',
      category: 'diving_club',
      categoryLabel: '🤿 Tauchen & Schnorcheln',
      city: 'Sesimbra', region: 'Costa Azul',
      address: 'Rua da Praia 4, Sesimbra',
      description: 'PADI 5-Sterne Diving Center. Anfänger bis Divemaster, Wracktauchen und Nacht-Tauchen im geschützten Naturreservat.',
      perks: 'SNT-Gäste: Erste Schnupperkurs kostenlos (30 min), 20% auf alle PADI Kurse',
      contact: { whatsapp: '+351 945 678 901', email: 'ana@oceano.test', website: 'https://oceano.test' },
      courses: ['Open Water', 'Advanced', 'Rescue Diver', 'Divemaster', 'Night Dive', 'Wreck Dive'],
      rating: 4.9, reviews_count: 66, verified: true,
      plan: 'b2b_premium', planLabel: 'B2B Premium Partner 🌟',
      features: { analytics: true, priorityListing: true, adBudget: 25, customBadge: true, promotedPin: true }
    },
    {
      id: 'b2b_restaurant_005',
      type: 'b2b',
      email: 'restaurant.tester@scratchntravel.test',
      password: 'TascaB2B2026!',
      businessName: 'Tasca Dona Mariana',
      ownerName: 'Mariana Costa',
      avatar: '🍽️',
      category: 'restaurant',
      categoryLabel: '🍽️ Restaurant / Tasca / Café',
      city: 'Lissabon', region: 'Mouraria',
      address: 'Rua da Mouraria 18, Lissabon',
      description: 'Authentische Petiscos & Bacalhau. Kein Tourist-Menü, nur echte Hausmannskost. Fado Dienstag–Donnerstag ab 21:00.',
      perks: 'Kostenloses Vinho Verde Glas bei SNT-Vorlage, reservierter Tisch für DNA-Match Gruppen',
      contact: { whatsapp: '+351 956 789 012', email: 'mariana@dona-mariana.test' },
      rating: 4.8, reviews_count: 312, verified: true,
      plan: 'b2b_starter', planLabel: 'B2B Starter 🏠',
      features: { analytics: true, priorityListing: false, adBudget: 0, customBadge: false, promotedPin: false }
    },
    {
      id: 'b2b_surf_school_006',
      type: 'b2b',
      email: 'surf.tester@scratchntravel.test',
      password: 'SurfSchoolB2B2026!',
      businessName: 'Guincho Surf Academy',
      ownerName: 'Rui Neves',
      avatar: '🏄',
      category: 'surf_school',
      categoryLabel: '🏄 Surfschule & Board Verleih',
      city: 'Cascais', region: 'Praia do Guincho',
      address: 'Estrada do Guincho Km 4, Cascais',
      description: 'Surf-Unterricht für alle Level. Guincho, Areia Branca und mobile Surf-Safari. Max 5 Personen pro Gruppe.',
      perks: 'SNT DNA-Match Gruppen (3+ Personen): 25% Gruppenrabatt, Wetsuit + Board inklusive',
      contact: { whatsapp: '+351 967 890 123', email: 'rui@guincho-surf.test', website: 'https://guincho-surf.test' },
      levels: ['Anfänger','Intermediate','Advanced','Kids (6–14 Jahre)'],
      pricing: { single: '45 €', group: '35 €/Person', week_camp: '220 €' },
      rating: 4.9, reviews_count: 178, verified: true,
      plan: 'b2b_premium', planLabel: 'B2B Premium Partner 🌟',
      features: { analytics: true, priorityListing: true, adBudget: 40, customBadge: true, promotedPin: true }
    },
    {
      id: 'b2b_yacht_007',
      type: 'b2b',
      email: 'yacht.tester@scratchntravel.test',
      password: 'YachtB2B2026!',
      businessName: 'Tagus Sailing & Yacht Charter',
      ownerName: 'Pedro Mendes',
      avatar: '⛵',
      category: 'yacht_boat',
      categoryLabel: '⛵ Yacht / Boot / Katamaran',
      city: 'Lissabon', region: 'Doca de Alcântara',
      address: 'Doca de Alcântara, Lissabon',
      description: 'Tages- und Wochencharterfahrten auf dem Tejo und zur Küste. Sunset Törns, Dolphin Watching, Weinverkostung an Bord.',
      perks: 'SNT VIP: 30% auf Sunset Tour (2h), kostenloser Kapitäns-Kommentar für Gruppen',
      contact: { whatsapp: '+351 978 901 234', email: 'pedro@tagus-sailing.test', website: 'https://tagus-sailing.test' },
      boats: ['Bavaria 37 (6 Personen)','Lagoon 42 Katamaran (10 Personen)','Motorjacht 38ft (8 Personen)'],
      pricing: { sunset_2h: '65 €/Person', day_tour: '120 €/Person', private_charter: '980 €/Tag' },
      rating: 4.8, reviews_count: 54, verified: false,
      plan: 'b2b_starter', planLabel: 'B2B Starter 🏠',
      features: { analytics: true, priorityListing: false, adBudget: 0, customBadge: false, promotedPin: false }
    },
    {
      id: 'b2b_atv_008',
      type: 'b2b',
      email: 'atv.tester@scratchntravel.test',
      password: 'AtvB2B2026!',
      businessName: 'Serra ATV & Jeep Adventure Tours',
      ownerName: 'João Monteiro',
      avatar: '🚙',
      category: 'atv_jeep',
      categoryLabel: '🚙 ATV / Jeep / Geländefahrzeug',
      city: 'Sintra', region: 'Serra de Sintra',
      address: 'Estrada de Pena, Sintra',
      description: 'Geführte ATV und Jeep-Touren durch den Naturpark Sintra-Cascais. Off-Road, Wasserfälle und geheime Aussichtspunkte.',
      perks: 'SNT-Gruppen (4+): Bonus-Stop am geheimen Aussichtspunkt + Picknick',
      contact: { whatsapp: '+351 989 012 345', email: 'joao@serra-atv.test' },
      vehicles: ['Quad 150cc (1–2 Pers.)','Quad 300cc Sport','4x4 Jeep Wrangler (5 Pers.)','Buggy (2 Pers.)'],
      pricing: { half_day: '55 €/Person', full_day: '90 €/Person', private_jeep: '320 €' },
      rating: 4.7, reviews_count: 91, verified: true,
      plan: 'b2b_premium', planLabel: 'B2B Premium Partner 🌟',
      features: { analytics: true, priorityListing: true, adBudget: 20, customBadge: true, promotedPin: false }
    }
  ];

  // ─── STORE IN LOCALSTORAGE ──────────────────────────────────────────────────

  const ALL_ACCOUNTS = { users: USER_ACCOUNTS, businesses: B2B_ACCOUNTS };
  localStorage.setItem('snt_test_accounts', JSON.stringify(USER_ACCOUNTS));
  localStorage.setItem('snt_b2b_accounts', JSON.stringify(B2B_ACCOUNTS));

  // Default: VIP User active
  const activeUser = USER_ACCOUNTS[0];
  localStorage.setItem('snt_current_user', JSON.stringify(activeUser));
  localStorage.setItem('snt_plan', activeUser.plan);

  // ─── GLOBAL SWITCHER ────────────────────────────────────────────────────────

  window.switchTestAccount = function(index) {
    const accounts = JSON.parse(localStorage.getItem('snt_test_accounts') || '[]');
    const acc = accounts[index];
    if (!acc) { console.warn('Kein User-Account an Index', index, '(0–3)'); return; }
    localStorage.setItem('snt_current_user', JSON.stringify(acc));
    localStorage.setItem('snt_plan', acc.plan);
    console.log('🔄 User gewechselt:', acc.name, '|', acc.planLabel);
    window.location.reload();
  };

  window.switchB2BAccount = function(index) {
    const businesses = JSON.parse(localStorage.getItem('snt_b2b_accounts') || '[]');
    const biz = businesses[index];
    if (!biz) { console.warn('Kein B2B-Account an Index', index, '(0–7)'); return; }
    localStorage.setItem('snt_current_user', JSON.stringify({ ...biz, role: 'b2b' }));
    localStorage.setItem('snt_plan', biz.plan);
    localStorage.setItem('snt_b2b_active', JSON.stringify(biz));
    console.log('🏢 B2B gewechselt:', biz.businessName, '|', biz.categoryLabel);
    window.location.reload();
  };

  // ─── CONSOLE OUTPUT ─────────────────────────────────────────────────────────

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log("  🧪 SCRATCH'N'TRAVEL — ALLE TEST-ACCOUNTS");
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  👤 NUTZER-ABOS (switchTestAccount(0–3)):');
  USER_ACCOUNTS.forEach(function(a, i) {
    console.log('  [' + i + '] ' + a.avatar + ' ' + a.name + '  |  ' + a.planLabel);
    console.log('      📧 ' + a.email + '   🔑 ' + a.password);
  });
  console.log('');
  console.log('  🏢 B2B BUSINESS-ACCOUNTS (switchB2BAccount(0–7)):');
  B2B_ACCOUNTS.forEach(function(b, i) {
    console.log('  [' + i + '] ' + b.avatar + ' ' + b.businessName + '  |  ' + b.categoryLabel);
    console.log('      📧 ' + b.email + '   🔑 ' + b.password);
    console.log('      📍 ' + b.city + ' · ' + b.perks);
  });
  console.log('');
  console.log('  ✅ VIP Marco ist aktiv. Im Tab switchen:');
  console.log('     switchTestAccount(0)  → VIP Platin');
  console.log('     switchB2BAccount(2)   → Scooter Rental Test');
  console.log('     switchB2BAccount(3)   → Diving Club Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})();
