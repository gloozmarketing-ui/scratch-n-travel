/**
 * Scratch'n'Travel — Master Multilingual Translation Engine & Custom Dropdown
 * Translates the ENTIRE webpage dynamically (Headings, Cards, Alerts, Modals, Badges)
 */

const TRANSLATIONS = {
  de: {
    // Navigation
    nav_concept: 'Das Konzept',
    nav_hobbydna: 'Hobby-DNA (130) 🧬',
    nav_family_pets: 'Familien & Tiere 🐶',
    nav_activities: 'Aktivitäten & Extreme 🏄‍♂️',
    nav_storypins: 'Story-Pins 🗺️',
    nav_hazard: 'Naturgefahren ⚠️',
    nav_esim: 'Internet & eSIM 📱',
    nav_scratchbook: 'Reisepass & Rubbelkarte 📖',
    nav_pricing: 'Preise & Beta 💳',
    nav_start_app: 'App Starten →',
    nav_back: '← Zur Übersicht',
    nav_explorer: 'City Explorer',
    nav_hobbymatch: 'Hobby Match (130) 🧬',
    nav_flightcalc: 'Flugrechner 🐕',
    
    // Hero
    hero_badge: '🌍 Die Social Layer von Reisen',
    hero_title_1: 'Verreise nicht als Tourist.',
    hero_title_2: 'Werde Teil des Ortes.',
    hero_subtitle: 'Entdecke versteckte Orte von Einheimischen, finde Gleichgesinnte mit dem WanderBond Hobby-DNA Matching (130+ Hobbys), plane Extremsport & Familienausflüge und schütze dich vor Touristenfallen & Unwettern.',
    hero_cta_explore: 'Entdecken & Ausprobieren ✨',
    hero_cta_dna: '130 Hobby-DNA Matcher 🧬',
    hero_cta_share: 'Erfahrungen teilen (VIP 0 €) 🎁',

    // Hobby DNA
    hobby_badge: '🧬 WanderBond 130 Hobby-DNA Engine',
    hobby_title: 'Finde deine Reisepartner nach Hobbys',
    hobby_subtitle: 'Wähle aus 130 Reise- & Lifestyle-Hobbys und berechne deine Kompatibilität mit Locals und Gleichgesinnten vor Ort.',
    hobby_selector_hint: 'WanderBond 130 Hobby-DNA Matcher (Suchen & Auswählen):',

    // Story Pins
    story_badge: '📍 Golden Story Pins',
    story_title: 'Echte Geschichten & Magische Vibes',
    story_subtitle: 'Orte mit Seele: Klicke auf die Pins für geheime Klippenquellen, Monsterwellen und traditionelle Kiez-Bäckereien.',

    // Activities
    act_badge: '🏄‍♂️ Von Familienurlaub bis Adrenalin',
    act_title: 'Aktivitäten nach deinem Geschmack',
    act_subtitle: 'Egal ob kinderwagenfreundlicher Strand, Hundespielwiese oder 130-Meter-Klippensprung in Nazaré — filtere nach deinem Abenteuer-Level.',
    act_filter_all: 'Alle Aktivitäten',
    act_filter_family: '👶 Familie & Kinder',
    act_filter_pets: '🐶 Haustiere & Hunde',
    act_filter_extreme: '⚡ Extreme & Adrenalin',
    act_filter_culture: '🍲 Kultur & Kulinarik',

    // Hazards
    hazard_badge: '🚨 Live Hazard & Disaster Radar',
    hazard_title: 'Unwetter, Waldbrand & Meeres-Gefahren',
    hazard_subtitle: 'Echtzeit-Warnungen vor Naturgefahren: Sintra-Parksperrungen bei Hitzewellen, Meeres-Unterströmungen (Riptides) und Klippen-Abbrüche.',

    // eSIM & Internet
    esim_badge: '📱 Günstiges Internet im Ausland',
    esim_title: 'eSIM, Lokale SIM-Karten & Roaming-Tipps',
    esim_subtitle: 'Surfe ohne teure Roaming-Überraschungen: eSIMs ab 4,50 €, lokale Vielnutzer-SIMs und Vermeidung der teuren Fähren-Satellitenfalle.',
    esim_affiliate_notice: '*Enthält unabhängige Empfehlungen & Werbelinks (Affiliate) gem. § 5a Abs. 4 UWG / TMG',

    // Scratchbook & Merch
    scratch_badge: '✨ Luxury Black & Gold Edition',
    scratch_title: 'Interaktive Rubbel-Weltkarte & Reise-Pass',
    scratch_subtitle: 'Halte deine Entdeckungen fest wie in einem echten, gold-geprägten Reisepass mit Visa-Stempeln und rubbelbereiter Obsidian-Karte.',
    scratch_btn_reveal: 'Alle Secrets Aufdecken',
    scratch_btn_seal: 'Neu Versiegeln',
    scratch_btn_pod: '📖 Als Gedrucktes Luxus-Journal Bestellen (POD) →',

    // Community Feed
    community_badge: '🎁 Give-to-Get Community Loop',
    community_title: 'Erfahrungen teilen & 0 € VIP-Zugang sichern',
    community_subtitle: 'Teile deine echten Geheimtipps & Stories. Das Kontingent ist je nach Stadtgröße limitiert!',
    community_submit_btn: '+ Story / Tipp Einreichen ✨',

    // Safety Radar
    safety_badge: '⚠️ Insider-Schutz von Einheimischen',
    safety_title: 'Local Safety & Scam-Radar',
    safety_subtitle: 'Wem du NICHT trauen solltest: Echte Warnungen vor Taschendiebbanken, Wucherpreisen, gefälschten Tickets und gefährlichen Ecken.',
    safety_filter_all: 'Alle Warnungen',
    safety_filter_scam: '🟡 Abzocke & Wucher',
    safety_filter_danger: '🔴 Gefahrenzonen & Banden',
    safety_filter_tips: '🟢 Verhaltenstipps der Locals',
    safety_report_btn: '+ Scam / Gefahr Melden',

    // AI Concierge
    concierge_badge: '🤖 Smart Travel AI Concierge',
    concierge_title: 'Frage die KI nach deiner perfekten Reise',
    concierge_desc: 'Gib dein Reiseziel, Kinder-Alter, Haustier oder Extremsport-Wunsch ein. Die KI berechnet Live-Wassertemperaturen & geprüfte Insider-Routen.',
    concierge_placeholder: 'Z.B. 3 Tage Lissabon: Klippenspringen, kinderfreundlicher Strand & Bacalhau ohne Touristenfallen...',
    concierge_btn: 'KI Fragen 🚀',

    // Pricing
    pricing_badge: 'Fair, Transparent & Sicher',
    pricing_title: 'Preismodelle & Vorab-Zugang',
    pricing_subtitle: 'Keine versteckten Gebühren. Volle Kontrolle über Abrechnung und Pre-Launch Phasen.',
    pricing_status_label: 'Aktueller Status:',
    pricing_status_val: '🌱 Pre-Launch Beta (Kostenloser Test)',
    pricing_toggle_btn: '⚡ 1-Klick: Stripe Live-Modus aktivieren (Preise einblenden)',
    pricing_free_title: 'Free Explorer',
    pricing_free_price: '0 €',
    pricing_free_period: 'dauerhaft kostenlos',
    pricing_free_desc: 'Kostenlose Basisfunktionen für Entdecker',
    pricing_free_btn: 'Kostenlos nutzen',
    pricing_pro_title: 'Family & Pet Pro',
    pricing_pro_badge: 'Early Bird VIP',
    pricing_pro_price: '0 €',
    pricing_pro_period: 'Kostenlos in der Beta-Phase',
    pricing_pro_desc: '🎁 Exklusiver Vorab-Zugang (Regulär 7,99 €/Monat nach offiziellem Launch)',
    pricing_pro_btn: 'VIP Beta-Zugang sichern (0 €) 🎉',
    pricing_biz_title: 'Local Host / Business',
    pricing_biz_badge: 'Pionier Host',
    pricing_biz_price: '0 €',
    pricing_biz_period: 'Kostenlos für Pionier-Partner',
    pricing_biz_desc: '🌟 Kostenlos für die ersten 50 registrierten Hosts & lokalen Betriebe',
    pricing_biz_btn: 'Pionier-Host werden (0 €) 🚀',

    // Footer
    footer_copy: '© 2026 Scratch\'n\'Travel — Human-First Social Travel Platform.',
    footer_links: '🔒 130% ohne Tracking-Cookies | PWA & Offline-Fähig | Impressum | Datenschutz'
  },
  en: {
    nav_concept: 'The Concept',
    nav_hobbydna: 'Hobby-DNA (130) 🧬',
    nav_family_pets: 'Family & Pets 🐶',
    nav_activities: 'Activities & Extreme 🏄‍♂️',
    nav_storypins: 'Story Pins 🗺️',
    nav_hazard: 'Hazards & Alerts ⚠️',
    nav_esim: 'Internet & eSIM 📱',
    nav_scratchbook: 'Passport & Scratch Map 📖',
    nav_pricing: 'Pricing & Beta 💳',
    nav_start_app: 'Launch App →',
    nav_back: '← Back to Overview',
    nav_explorer: 'City Explorer',
    nav_hobbymatch: 'Hobby Match (130) 🧬',
    nav_flightcalc: 'Pet Flight Calc 🐕',
    hero_badge: '🌍 The Social Layer of Travel',
    hero_title_1: 'Don’t travel like a tourist.',
    hero_title_2: 'Become part of the place.',
    hero_subtitle: 'Discover secret spots from locals, match 130+ hobbies with travel buddies, plan extreme sports & family trips, and stay safe from scams & wildfires.',
    hero_cta_explore: 'Explore Now ✨',
    hero_cta_dna: '130 Hobby-DNA Matcher 🧬',
    hero_cta_share: 'Share Stories (VIP 0 €) 🎁',
    hobby_badge: '🧬 WanderBond 130 Hobby-DNA Engine',
    hobby_title: 'Find Travel Buddies by Passion',
    hobby_subtitle: 'Choose from 130 travel & lifestyle hobbies and calculate instant compatibility with locals and travelers.',
    hobby_selector_hint: 'WanderBond 130 Hobby-DNA Matcher (Search & Select):',
    story_badge: '📍 Golden Story Pins',
    story_title: 'Authentic Stories & Magic Vibes',
    story_subtitle: 'Places with soul: Click pins for hidden cliff springs, giant monster waves, and traditional bakeries.',
    act_badge: '🏄‍♂️ From Family Trips to Pure Adrenaline',
    act_title: 'Activities Tailored to Your Vibe',
    act_subtitle: 'From stroller-friendly beaches and dog parks to 30-meter wave surfing in Nazaré.',
    act_filter_all: 'All Activities',
    act_filter_family: '👶 Family & Kids',
    act_filter_pets: '🐶 Pets & Dogs',
    act_filter_extreme: '⚡ Extreme & Adrenaline',
    act_filter_culture: '🍲 Food & Culture',
    hazard_badge: '🚨 Live Hazard & Disaster Radar',
    hazard_title: 'Wildfire, Weather & Ocean Alerts',
    hazard_subtitle: 'Real-time hazard warnings: Sintra park closures during heatwaves, ocean rip currents, and cliff stability.',
    esim_badge: '📱 Low-Cost Global Internet',
    esim_title: 'eSIM, Local SIMs & Roaming Guide',
    esim_subtitle: 'Surf without roaming bill shocks: eSIMs from €4.50, heavy-data local SIMs, and avoiding maritime ferry satellite traps.',
    esim_affiliate_notice: '*Contains independent recommendations & partner affiliate links',
    scratch_badge: '✨ Luxury Black & Gold Edition',
    scratch_title: 'Interactive Scratch Map & Travel Passport',
    scratch_subtitle: 'Preserve your discoveries in a gold-embossed digital passport with official visa stamps and obsidian scratch map.',
    scratch_btn_reveal: 'Reveal All Secrets',
    scratch_btn_seal: 'Reseal Gold Layer',
    scratch_btn_pod: '📖 Order Printed Luxury Journal (POD) →',
    community_badge: '🎁 Give-to-Get Community Loop',
    community_title: 'Share Experiences & Unlock 0 € VIP Access',
    community_subtitle: 'Share authentic insider tips and unlock Pro status. VIP quotas are limited per city size!',
    community_submit_btn: '+ Submit Story / Tip ✨',
    safety_badge: '⚠️ Insider Protection from Locals',
    safety_title: 'Local Safety & Scam-Radar',
    safety_subtitle: 'Who NOT to trust: Verified warnings on pickpocket rings, taxi markups, fake tickets, and dangerous alleys.',
    safety_filter_all: 'All Alerts',
    safety_filter_scam: '🟡 Scams & Overpricing',
    safety_filter_danger: '🔴 Danger Zones & Gangs',
    safety_filter_tips: '🟢 Local Safety Tips',
    safety_report_btn: '+ Report Scam / Danger',
    concierge_badge: '🤖 Smart Travel AI Concierge',
    concierge_title: 'Ask AI for Your Tailored Itinerary',
    concierge_desc: 'Enter destination, kids ages, dog info or extreme sports. The AI provides live water temperatures & verified routes.',
    concierge_placeholder: 'E.g. 3 days in Lisbon: cliff diving, dog beach & authentic seafood without tourist traps...',
    concierge_btn: 'Ask AI 🚀',
    pricing_badge: 'Fair, Transparent & Secure',
    pricing_title: 'Pricing & Early Access',
    pricing_subtitle: 'No hidden fees. Full control over billing and pre-launch phases.',
    pricing_status_label: 'Current Status:',
    pricing_status_val: '🌱 Pre-Launch Beta (Free Testing)',
    pricing_toggle_btn: '⚡ 1-Click: Enable Live Stripe Mode',
    pricing_free_title: 'Free Explorer',
    pricing_free_price: '0 €',
    pricing_free_period: 'forever free',
    pricing_free_desc: 'Essential travel tools for explorers',
    pricing_free_btn: 'Use for Free',
    pricing_pro_title: 'Family & Pet Pro',
    pricing_pro_badge: 'Early Bird VIP',
    pricing_pro_price: '0 €',
    pricing_pro_period: 'Free during Beta',
    pricing_pro_desc: '🎁 Exclusive VIP Access (Regular €7.99/mo after launch)',
    pricing_pro_btn: 'Claim 0 € VIP Beta Access 🎉',
    pricing_biz_title: 'Local Host / Business',
    pricing_biz_badge: 'Pioneer Host',
    pricing_biz_price: '0 €',
    pricing_biz_period: 'Free for pioneer partners',
    pricing_biz_desc: '🌟 Free for the first 50 verified hosts & businesses',
    pricing_biz_btn: 'Become Pioneer Host (0 €) 🚀',
    footer_copy: '© 2026 Scratch\'n\'Travel — Human-First Social Travel Platform.',
    footer_links: '🔒 130% Tracking-Free | PWA & Offline Ready | Imprint | Privacy'
  },
  es: {
    nav_concept: 'El Concepto',
    nav_hobbydna: 'Hobby-DNA (130) 🧬',
    nav_family_pets: 'Familias y Mascotas 🐶',
    nav_activities: 'Actividades y Extremo 🏄‍♂️',
    nav_storypins: 'Pines de Historias 🗺️',
    nav_hazard: 'Peligros y Alertas ⚠️',
    nav_esim: 'Internet y eSIM 📱',
    nav_scratchbook: 'Pasaporte y Rasca 📖',
    nav_pricing: 'Precios y Beta 💳',
    nav_start_app: 'Iniciar App →',
    nav_back: '← Volver',
    nav_explorer: 'Explorador',
    nav_hobbymatch: 'Match Hobbies (130) 🧬',
    nav_flightcalc: 'Vuelo Mascotas 🐕',
    hero_badge: '🌍 La Capa Social de los Viajes',
    hero_title_1: 'No viajes como turista.',
    hero_title_2: 'Sé parte del lugar.',
    hero_subtitle: 'Descubre secretos de locales, encuentra compañeros con 130+ hobbies y viaja seguro sin estafas.',
    hero_cta_explore: 'Explorar Ahora ✨',
    hero_cta_dna: 'Matcher 130 Hobbies 🧬',
    hero_cta_share: 'Compartir Experiencia (VIP 0 €) 🎁',
    hobby_badge: '🧬 Motor WanderBond 130 Hobby-DNA',
    hobby_title: 'Encuentra Compañeros por Pasiones',
    hobby_subtitle: 'Elige entre 130 hobbies de viaje y calcula compatibilidad en tiempo real.',
    hobby_selector_hint: 'Matcher 130 Hobby-DNA (Buscar y Seleccionar):',
    story_badge: '📍 Pines de Historias Doradas',
    story_title: 'Historias Reales y Magia',
    story_subtitle: 'Lugares con alma: manantiales en acantilados, olas gigantes y panaderías tradicionales.',
    act_badge: '🏄‍♂️ De Playas Familiares a Adrenalina',
    act_title: 'Actividades a Tu Medida',
    act_subtitle: 'Playas caninas, parques para carritos o surf de olas de 30m en Nazaré.',
    act_filter_all: 'Todas',
    act_filter_family: '👶 Familias',
    act_filter_pets: '🐶 Mascotas',
    act_filter_extreme: '⚡ Extremo',
    act_filter_culture: '🍲 Gastronomía',
    hazard_badge: '🚨 Radar de Peligros y Desastres',
    hazard_title: 'Alertas de Incendios, Olas y Clima',
    hazard_subtitle: 'Avisos en tiempo real: cierres de parques en Sintra, corrientes traicioneras y desprendimientos.',
    esim_badge: '📱 Internet Económico en el Extranjero',
    esim_title: 'Guía de eSIM, SIM Local y Roaming',
    esim_subtitle: 'Navega sin sorpresas en la factura: eSIMs desde 4,50 € y evita trampas por satélite.',
    esim_affiliate_notice: '*Contiene enlaces de recomendación y afiliados',
    scratch_badge: '✨ Edición Lujo Negro y Oro',
    scratch_title: 'Mapa Rasca Interactivo y Pasaporte',
    scratch_subtitle: 'Guarda tus viajes en un pasaporte con sellos dorados y mapa de obsidiana para rascar.',
    scratch_btn_reveal: 'Revelar Secretos',
    scratch_btn_seal: 'Volver a Sellar',
    scratch_btn_pod: '📖 Pedir Diario Impreso de Lujo (POD) →',
    community_badge: '🎁 Give-to-Get Community Loop',
    community_title: 'Comparte Historias y Gana Acceso VIP 0 €',
    community_subtitle: 'Comparte recomendaciones auténticas. Cupos VIP limitados por tamaño de ciudad.',
    community_submit_btn: '+ Enviar Historia ✨',
    safety_badge: '⚠️ Protección Local Insider',
    safety_title: 'Local Safety & Radar de Estafas',
    safety_subtitle: 'En quién NO confiar: Advertencias verificadas sobre carteristas y trampas turísticas.',
    safety_filter_all: 'Todas las Alertas',
    safety_filter_scam: '🟡 Estafas y Sobreprecios',
    safety_filter_danger: '🔴 Zonas Peligrosas',
    safety_filter_tips: '🟢 Consejos de Locales',
    safety_report_btn: '+ Reportar Estafa',
    concierge_badge: '🤖 Smart Travel AI Concierge',
    concierge_title: 'Pide a la IA tu Itinerario Personalizado',
    concierge_desc: 'Introduce destino, niños o perro. La IA te dará temperatura del agua y rutas sin trampas.',
    concierge_placeholder: 'Ej. 3 días en Lisboa: salto de acantilados y playa para perros...',
    concierge_btn: 'Consultar IA 🚀',
    pricing_badge: 'Transparente y Seguro',
    pricing_title: 'Precios y Acceso Beta',
    pricing_subtitle: 'Sin costes ocultos.',
    pricing_status_label: 'Estado:',
    pricing_status_val: '🌱 Beta Pre-Lanzamiento (Gratis)',
    pricing_toggle_btn: '⚡ 1-Click: Activar Modo Stripe en Vivo',
    pricing_free_title: 'Free Explorer',
    pricing_free_price: '0 €',
    pricing_free_period: 'siempre gratis',
    pricing_free_desc: 'Herramientas básicas para viajeros',
    pricing_free_btn: 'Usar Gratis',
    pricing_pro_title: 'Family & Pet Pro',
    pricing_pro_badge: 'Early Bird VIP',
    pricing_pro_price: '0 €',
    pricing_pro_period: 'Gratis en Beta',
    pricing_pro_desc: '🎁 Acceso VIP anticipado',
    pricing_pro_btn: 'Obtener VIP 0 € 🎉',
    pricing_biz_title: 'Local Host / Business',
    pricing_biz_badge: 'Host Pionero',
    pricing_biz_price: '0 €',
    pricing_biz_period: 'Gratis para pioneros',
    pricing_biz_desc: '🌟 Gratis para los primeros 50 negocios',
    pricing_biz_btn: 'Ser Host Pionero (0 €) 🚀',
    footer_copy: '© 2026 Scratch\'n\'Travel — Plataforma de Viajes Humana.',
    footer_links: '🔒 Sin Rastreo | PWA Offline | Aviso Legal'
  },
  fr: {
    nav_concept: 'Le Concept',
    nav_hobbydna: 'Hobby-DNA (130) 🧬',
    nav_family_pets: 'Familles & Animaux 🐶',
    nav_activities: 'Activités & Extrême 🏄‍♂️',
    nav_storypins: 'Épingles Récits 🗺️',
    nav_hazard: 'Dangers & Alertes ⚠️',
    nav_esim: 'Internet & eSIM 📱',
    nav_scratchbook: 'Passeport & Carte à Gratter 📖',
    nav_pricing: 'Tarifs & Bêta 💳',
    nav_start_app: 'Lancer l’App →',
    nav_back: '← Retour',
    nav_explorer: 'Explorateur',
    nav_hobbymatch: 'Match Hobbies (130) 🧬',
    nav_flightcalc: 'Vol Animaux 🐕',
    hero_badge: '🌍 Le Réseau Social du Voyage',
    hero_title_1: 'Ne voyagez pas en touriste.',
    hero_title_2: 'Faites corps avec le lieu.',
    hero_subtitle: 'Découvrez des secrets locaux, trouvez des partenaires avec 130+ passions et évitez les arnaques.',
    hero_cta_explore: 'Explorer Maintenant ✨',
    hero_cta_dna: 'Matcher 130 Hobbies 🧬',
    hero_cta_share: 'Partager une Histoire (VIP 0 €) 🎁',
    hobby_badge: '🧬 Moteur WanderBond 130 Hobby-DNA',
    hobby_title: 'Trouvez vos Partenaires de Voyage',
    hobby_subtitle: 'Choisissez parmi 130 hobbies et calculez votre compatibilité en direct.',
    hobby_selector_hint: 'Matcher 130 Hobby-DNA (Rechercher & Choisir) :',
    story_badge: '📍 Épingles Récits Dorés',
    story_title: 'Histoires Vraies & Lieux Magiques',
    story_subtitle: 'Des lieux avec une âme : sources côtières cachées, vagues géantes et boulangeries d’antan.',
    act_badge: '🏄‍♂️ De la Plage Famille à l’Adrénaline',
    act_title: 'Activités Selon Vos Envies',
    act_subtitle: 'Plages pour chiens, parcs pour poussettes ou surf de 30m à Nazaré.',
    act_filter_all: 'Toutes',
    act_filter_family: '👶 Familles',
    act_filter_pets: '🐶 Animaux',
    act_filter_extreme: '⚡ Extrême',
    act_filter_culture: '🍲 Culture & Food',
    hazard_badge: '🚨 Radar Dangers & Catastrophes',
    hazard_title: 'Alertes Incendies, Vagues & Météo',
    hazard_subtitle: 'Avertissements en temps réel : parcs fermés à Sintra, courants d’arrachement et falaises friables.',
    esim_badge: '📱 Internet Pas Cher à l’Étranger',
    esim_title: 'Guide eSIM, SIM Locale & Roaming',
    esim_subtitle: 'Naviguez sans mauvaises surprises : eSIMs dès 4,50 € et évitez les pièges satellites en mer.',
    esim_affiliate_notice: '*Contient des recommandations indépendantes et liens partenaires',
    scratch_badge: '✨ Édition Luxe Noir & Or',
    scratch_title: 'Carte à Gratter & Passeport Virtuel',
    scratch_subtitle: 'Conservez vos découvertes dans un passeport orné de tampons visas et d’une carte en obsidienne.',
    scratch_btn_reveal: 'Révéler les Secrets',
    scratch_btn_seal: 'Re-sceller la Carte',
    scratch_btn_pod: '📖 Commander Carnet Imprimé Luxe (POD) →',
    community_badge: '🎁 Give-to-Get Community Loop',
    community_title: 'Partagez vos Récits & Obtenez le VIP 0 €',
    community_subtitle: 'Partagez vos bons plans authentiques. Quotas VIP limités par taille de ville !',
    community_submit_btn: '+ Publier un Bon Plan ✨',
    safety_badge: '⚠️ Protection Locale Vérifiée',
    safety_title: 'Local Safety & Radar Arnaques',
    safety_subtitle: 'Qui NE PAS croire : Mises en garde contre les pickpockets et les pièges à touristes.',
    safety_filter_all: 'Toutes les Alertes',
    safety_filter_scam: '🟡 Arnaques & Surprix',
    safety_filter_danger: '🔴 Zones Dangereuses',
    safety_filter_tips: '🟢 Conseils des Locaux',
    safety_report_btn: '+ Signaler une Arnaque',
    concierge_badge: '🤖 Smart Travel AI Concierge',
    concierge_title: 'Demandez à l’IA Votre Itinéraire Parfait',
    concierge_desc: 'Entrez destination, enfants ou chien. L’IA intègre la température de l’eau et des routes vérifiées.',
    concierge_placeholder: 'Ex. 3 jours à Lisbonne : saut de falaise et resto traditionnel...',
    concierge_btn: 'Demander à l’IA 🚀',
    pricing_badge: 'Transparent & Sécurisé',
    pricing_title: 'Tarifs & Accès Bêta',
    pricing_subtitle: 'Aucun frais caché.',
    pricing_status_label: 'Statut :',
    pricing_status_val: '🌱 Bêta Pré-Lancement (Gratuit)',
    pricing_toggle_btn: '⚡ 1-Clic : Activer Mode Stripe en Direct',
    pricing_free_title: 'Free Explorer',
    pricing_free_price: '0 €',
    pricing_free_period: 'gratuit à vie',
    pricing_free_desc: 'Outils essentiels pour explorateurs',
    pricing_free_btn: 'Utiliser Gratuitement',
    pricing_pro_title: 'Family & Pet Pro',
    pricing_pro_badge: 'Early Bird VIP',
    pricing_pro_price: '0 €',
    pricing_pro_period: 'Gratuit en Bêta',
    pricing_pro_desc: '🎁 Accès VIP anticipé exclusif',
    pricing_pro_btn: 'Réclamer Accès VIP (0 €) 🎉',
    pricing_biz_title: 'Local Host / Business',
    pricing_biz_badge: 'Hôte Pionnier',
    pricing_biz_price: '0 €',
    pricing_biz_period: 'Gratuit pour pionniers',
    pricing_biz_desc: '🌟 Gratuit pour les 50 premiers établissements',
    pricing_biz_btn: 'Devenir Hôte Pionnier (0 €) 🚀',
    footer_copy: '© 2026 Scratch\'n\'Travel — Plateforme de Voyage Humaine.',
    footer_links: '🔒 Sans Cookies | PWA Offline | Mentions Légales'
  },
  it: {
    nav_concept: 'Il Concetto',
    nav_hobbydna: 'Hobby-DNA (130) 🧬',
    nav_family_pets: 'Famiglie & Animali 🐶',
    nav_activities: 'Attività & Estremo 🏄‍♂️',
    nav_storypins: 'Pin Storie 🗺️',
    nav_hazard: 'Pericoli & Avvisi ⚠️',
    nav_esim: 'Internet & eSIM 📱',
    nav_scratchbook: 'Passaporto & Mappa Scratch 📖',
    nav_pricing: 'Prezzi & Beta 💳',
    nav_start_app: 'Avvia App →',
    nav_back: '← Torna',
    nav_explorer: 'Esploratore',
    nav_hobbymatch: 'Hobby Match (130) 🧬',
    nav_flightcalc: 'Volo Animali 🐕',
    hero_badge: '🌍 Il Social Layer dei Viaggi',
    hero_title_1: 'Non viaggiare da turista.',
    hero_title_2: 'Vivi il luogo da locale.',
    hero_subtitle: 'Scopri segreti locali, trova compagni con 130+ passioni ed evita le trappole per turisti.',
    hero_cta_explore: 'Esplora Ora ✨',
    hero_cta_dna: 'Matcher 130 Hobby 🧬',
    hero_cta_share: 'Condividi Storia (VIP 0 €) 🎁',
    hobby_badge: '🧬 Motore WanderBond 130 Hobby-DNA',
    hobby_title: 'Trova Compagni di Viaggio per Passione',
    hobby_subtitle: 'Scegli tra 130 hobby di viaggio e calcola la compatibilità in tempo reale.',
    hobby_selector_hint: 'Matcher 130 Hobby-DNA (Cerca & Seleziona):',
    story_badge: '📍 Pin Storie Dorate',
    story_title: 'Storie Autentiche & Luoghi Magici',
    story_subtitle: 'Luoghi con un’anima: sorgenti tra le scogliere, onde giganti e forni storici.',
    act_badge: '🏄‍♂️ Dalle Spiagge Famiglia all’Adrenalina',
    act_title: 'Attività su Misura per Te',
    act_subtitle: 'Spiagge per cani, parchi per passeggini o surf su onde di 30 metri a Nazaré.',
    act_filter_all: 'Tutte',
    act_filter_family: '👶 Famiglie',
    act_filter_pets: '🐶 Animali',
    act_filter_extreme: '⚡ Estremo',
    act_filter_culture: '🍲 Cibo & Cultura',
    hazard_badge: '🚨 Radar Pericoli & Disastri',
    hazard_title: 'Avvisi Incendi, Onde & Meteo',
    hazard_subtitle: 'Avvisi in tempo reale: parchi chiusi a Sintra per calore, correnti pericolose e scogliere.',
    esim_badge: '📱 Internet Conveniente all’Estero',
    esim_title: 'Guida eSIM, SIM Locali & Roaming',
    esim_subtitle: 'Naviga senza sorprese in bolletta: eSIM da 4,50 € ed evita le trappole satellitari sui traghetti.',
    esim_affiliate_notice: '*Contiene consigli indipendenti e link affiliati',
    scratch_badge: '✨ Edizione Lusso Nero & Oro',
    scratch_title: 'Mappa Scratch & Passaporto di Viaggio',
    scratch_subtitle: 'Conserva i tuoi viaggi in un passaporto con timbri dorati e mappa in ossidiana da grattare.',
    scratch_btn_reveal: 'Rivela Segreti',
    scratch_btn_seal: 'Risigilla Mappa',
    scratch_btn_pod: '📖 Ordina Diario Stampato di Lusso (POD) →',
    community_badge: '🎁 Give-to-Get Community Loop',
    community_title: 'Condividi Esperienze & Ottieni VIP 0 €',
    community_subtitle: 'Condividi consigli autentici. I posti VIP gratuiti sono limitati per città!',
    community_submit_btn: '+ Pubblica un Consiglio ✨',
    safety_badge: '⚠️ Protezione Locale Verificata',
    safety_title: 'Local Safety & Radar Truffe',
    safety_subtitle: 'Di chi NON fidarsi: Avvisi verificati su borseggiatori, prezzi gonfiati e vicoli rischiosi.',
    safety_filter_all: 'Tutti gli Avvisi',
    safety_filter_scam: '🟡 Truffe & Prezzi Alti',
    safety_filter_danger: '🔴 Zone di Pericolo',
    safety_filter_tips: '🟢 Consigli dei Locali',
    safety_report_btn: '+ Segnala Truffa',
    concierge_badge: '🤖 Smart Travel AI Concierge',
    concierge_title: 'Chiedi all’IA il Tuo Itinerario Ideale',
    concierge_desc: 'Inserisci destinazione, bambini o cane. L’IA calcola temperature del mare e percorsi verificati.',
    concierge_placeholder: 'Es. 3 giorni a Lisbona: tuffi da scogliera e trattoria tipica...',
    concierge_btn: 'Chiedi all’IA 🚀',
    pricing_badge: 'Trasparente & Sicuro',
    pricing_title: 'Prezzi & Accesso Beta',
    pricing_subtitle: 'Nessun costo nascosto.',
    pricing_status_label: 'Stato:',
    pricing_status_val: '🌱 Beta Pre-Lancio (Gratuito)',
    pricing_toggle_btn: '⚡ 1-Clic: Attiva Modalità Stripe dal Vivo',
    pricing_free_title: 'Free Explorer',
    pricing_free_price: '0 €',
    pricing_free_period: 'sempre gratis',
    pricing_free_desc: 'Strumenti base per esploratori',
    pricing_free_btn: 'Usa Gratis',
    pricing_pro_title: 'Family & Pet Pro',
    pricing_pro_badge: 'Early Bird VIP',
    pricing_pro_price: '0 €',
    pricing_pro_period: 'Gratis in Beta',
    pricing_pro_desc: '🎁 Accesso VIP anticipato esclusivo',
    pricing_pro_btn: 'Ottieni Accesso VIP (0 €) 🎉',
    pricing_biz_title: 'Local Host / Business',
    pricing_biz_badge: 'Host Pioniere',
    pricing_biz_price: '0 €',
    pricing_biz_period: 'Gratis per pionieri',
    pricing_biz_desc: '🌟 Gratis per i primi 50 locali registrati',
    pricing_biz_btn: 'Diventa Host Pioniere (0 €) 🚀',
    footer_copy: '© 2026 Scratch\'n\'Travel — Piattaforma Social di Viaggi.',
    footer_links: '🔒 Senza Tracking | PWA Offline | Note Legali'
  }
};

const LANG_DETAILS = {
  de: { label: 'Deutsch', flag: '🇩🇪' },
  en: { label: 'English', flag: '🇬🇧' },
  es: { label: 'Español', flag: '🇪🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
  it: { label: 'Italiano', flag: '🇮🇹' }
};

class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('scratch_lang') || 'de';
    this.isDropdownOpen = false;
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.renderCustomDropdown();
  }

  setLanguage(langKey) {
    if (!TRANSLATIONS[langKey]) return;
    this.currentLang = langKey;
    localStorage.setItem('scratch_lang', langKey);
    this.applyLanguage(langKey);
    this.renderCustomDropdown();
    this.closeDropdown();
  }

  applyLanguage(langKey) {
    const dict = TRANSLATIONS[langKey] || TRANSLATIONS.de;
    
    // 1. Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    const menu = document.getElementById('langDropdownMenu');
    if (menu) {
      menu.style.display = this.isDropdownOpen ? 'block' : 'none';
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    const menu = document.getElementById('langDropdownMenu');
    if (menu) menu.style.display = 'none';
  }

  renderCustomDropdown(containerId = 'langDropdownContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const curr = LANG_DETAILS[this.currentLang] || LANG_DETAILS.de;
    const keys = Object.keys(LANG_DETAILS);

    container.innerHTML = `
      <div class="custom-lang-dropdown">
        <button type="button" class="lang-dropdown-btn" onclick="window.i18n.toggleDropdown()">
          <span>${curr.flag}</span>
          <span>${curr.label}</span>
          <span style="font-size: 0.65rem; opacity: 0.7; margin-left: 2px;">▼</span>
        </button>

        <div id="langDropdownMenu" class="lang-dropdown-menu">
          ${keys.map(k => {
            const item = LANG_DETAILS[k];
            const active = k === this.currentLang;
            return `
              <div class="lang-option ${active ? 'active' : ''}" onclick="window.i18n.setLanguage('${k}')">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span>${item.flag}</span>
                  <span>${item.label}</span>
                </span>
                ${active ? '<span>✓</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#langDropdownContainer')) {
        this.closeDropdown();
      }
    });
  }
}

window.i18n = new I18nEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.i18n.init();
});
// === Auto-Added Languages: Russian, Ukrainian, Hebrew ===
// Add these into your TRANSLATIONS object:
// ru: { flag: "🇷🇺", label: "Русский", dir: "ltr", pricing_pro_period: "/ мес.", pricing_biz_period: "/ мес." },
// uk: { flag: "🇺🇦", label: "Українська", dir: "ltr", pricing_pro_period: "/ міс.", pricing_biz_period: "/ міс." },
// he: { flag: "🇮🇱", label: "עברית", dir: "rtl", pricing_pro_period: "/ חודש", pricing_biz_period: "/ חודש" },

// Expose for language switcher fallback:
if (typeof window !== "undefined") {
  window.SNT_EXTRA_LANGS = {
    ru: { flag: "🇷🇺", label: "Русский", dir: "ltr" },
    uk: { flag: "🇺🇦", label: "Українська", dir: "ltr" },
    he: { flag: "🇮🇱", label: "עברית", dir: "rtl" }
  };
}
