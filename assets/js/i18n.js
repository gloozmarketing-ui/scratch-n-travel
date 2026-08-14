/**
 * Scratch'n'Travel — Multilingual Translation Engine (i18n)
 * Supported Languages: DE (Deutsch), EN (English), ES (Español), FR (Français), IT (Italiano)
 */

const TRANSLATIONS = {
  de: {
    // Navigation
    nav_concept: "Das Konzept",
    nav_family_pets: "Familien & Tiere 🐶",
    nav_activities: "Aktivitäten & Extreme 🏄‍♂️",
    nav_safety: "Safety & Scam-Radar ⚠️",
    nav_geheimtipps: "Geheimtipps 🔐",
    nav_scratchbook: "Scratchbook 📖",
    nav_pricing: "Preise & Beta 💳",
    nav_start_app: "App Starten →",
    nav_back: "← Zur Übersicht",
    nav_explorer: "City Explorer",
    nav_hobbymatch: "Hobby Match 🎣",
    nav_flightcalc: "Flugrechner 🐕",
    nav_checklists: "Checklisten 📋",

    // Hero
    hero_badge: "🌍 Die Social Layer von Reisen",
    hero_title_1: "Verreise nicht als Tourist.",
    hero_title_2: "Werde Teil des Ortes.",
    hero_subtitle: "Entdecke versteckte Orte von Einheimischen, triff Gleichgesinnte für deine Hobbys, plane Extremsport & Familienausflüge und schütze dich vor Touristenfallen.",
    hero_cta_explore: "Entdecken & Ausprobieren ✨",
    hero_cta_family: "Familien- & Hunde-Hub 🐕",

    // Activities Section
    act_badge: "🏄‍♂️ Von Familienurlaub bis Adrenalin",
    act_title: "Aktivitäten nach deinem Geschmack",
    act_subtitle: "Egal ob kinderwagenfreundlicher Strand, Hundespielwiese oder 100-Meter-Klippensprung in Nazaré — filtere nach deinem Abenteuer-Level.",
    act_filter_all: "Alle Aktivitäten",
    act_filter_family: "👶 Familie & Kinder",
    act_filter_pets: "🐶 Haustiere & Hunde",
    act_filter_extreme: "⚡ Extreme & Adrenalin",
    act_filter_culture: "🍲 Kultur & Kulinarik",

    // Safety Radar
    safety_badge: "⚠️ Insider-Schutz von Einheimischen",
    safety_title: "Local Safety & Scam-Radar",
    safety_subtitle: "Wem du NICHT trauen solltest: Echte Warnungen vor Taschendiebbanken, Wucherpreisen, gefälschten Tickets und gefährlichen Ecken.",
    safety_filter_all: "Alle Warnungen",
    safety_filter_scam: "🟡 Abzocke & Wucher",
    safety_filter_danger: "🔴 Gefahrenzonen & Banden",
    safety_filter_tips: "🟢 Verhaltenstipps der Locals",
    safety_report_btn: "+ Scam / Gefahr Melden",

    // Pricing & Beta
    pricing_badge: "Fair, Transparent & Sicher",
    pricing_title: "Preismodelle & Vorab-Zugang",
    pricing_subtitle: "Keine versteckten Gebühren. Volle Kontrolle über Abrechnung und Pre-Launch Phasen.",
    pricing_status_label: "Aktueller Status:",
    pricing_beta_badge: "🌱 Pre-Launch Beta (Kostenloser Test)",
    pricing_live_badge: "💳 Stripe Live-Zahlung Aktiv",
    pricing_toggle_to_live: "⚡ 1-Klick: Stripe Live-Modus aktivieren (Preise einblenden)",
    pricing_toggle_to_beta: "⇄ Zu Pre-Launch Beta wechseln (Preise verbergen)",

    // Concierge & AI
    concierge_badge: "🤖 Hermes AI Travel Concierge",
    concierge_title: "Frage Hermes nach deiner perfekten Reise",
    concierge_desc: "Gib dein Reiseziel, Kinder-Alter, Haustier oder Extremsport-Wunsch ein. Hermes empfiehlt echte Insider-Tipps.",
    concierge_btn: "Hermes Fragen 🚀",
    concierge_placeholder: "Z.B. 3 Tage Lissabon: Klippenspringen, kinderfreundlicher Strand & Bacalhau ohne Touristenfallen...",

    // Footer
    footer_copy: "© 2026 Scratch'n'Travel — Human-First Social Travel Platform.",
    footer_links: "🔒 100% ohne Tracking-Cookies | Impressum | Datenschutz | Nutzungsbedingungen"
  },

  en: {
    nav_concept: "The Concept",
    nav_family_pets: "Family & Pets 🐶",
    nav_activities: "Activities & Extreme 🏄‍♂️",
    nav_safety: "Safety & Scam Radar ⚠️",
    nav_geheimtipps: "Secret Spots 🔐",
    nav_scratchbook: "Scratchbook 📖",
    nav_pricing: "Pricing & Beta 💳",
    nav_start_app: "Launch App →",
    nav_back: "← Back to Overview",
    nav_explorer: "City Explorer",
    nav_hobbymatch: "Hobby Match 🎣",
    nav_flightcalc: "Pet Flight Calc 🐕",
    nav_checklists: "Checklists 📋",

    hero_badge: "🌍 The Social Layer of Travel",
    hero_title_1: "Don't just travel as a tourist.",
    hero_title_2: "Become part of the place.",
    hero_subtitle: "Discover hidden spots from locals, match with peers for your hobbies, plan extreme sports or family trips, and avoid tourist traps and scams.",
    hero_cta_explore: "Explore & Try Now ✨",
    hero_cta_family: "Family & Pet Hub 🐕",

    act_badge: "🏄‍♂️ From Family Vacation to Adrenaline",
    act_title: "Activities Tailored to You",
    act_subtitle: "Whether stroller-friendly beaches, dog play parks, or cliff diving and big wave surfing in Nazaré — filter by your adventure style.",
    act_filter_all: "All Activities",
    act_filter_family: "👶 Family & Kids",
    act_filter_pets: "🐶 Pets & Dogs",
    act_filter_extreme: "⚡ Extreme & Adrenaline",
    act_filter_culture: "🍲 Culture & Culinary",

    safety_badge: "⚠️ Local Protection & Warnings",
    safety_title: "Local Safety & Scam Radar",
    safety_subtitle: "Who NOT to trust: Real local warnings against pickpocket gangs, rip-off prices, fake tickets, and dangerous neighborhoods.",
    safety_filter_all: "All Warnings",
    safety_filter_scam: "🟡 Rip-offs & Overpricing",
    safety_filter_danger: "🔴 Danger Zones & Gangs",
    safety_filter_tips: "🟢 Local Survival Tips",
    safety_report_btn: "+ Report Scam / Danger",

    pricing_badge: "Fair, Transparent & Safe",
    pricing_title: "Plans & Early Access",
    pricing_subtitle: "No hidden booking commissions. Full transparency and risk-free testing.",
    pricing_status_label: "Current Status:",
    pricing_beta_badge: "🌱 Pre-Launch Beta (Free Testing)",
    pricing_live_badge: "💳 Stripe Live Payment Active",
    pricing_toggle_to_live: "⚡ 1-Click: Activate Stripe Live Mode (Show Prices)",
    pricing_toggle_to_beta: "⇄ Switch to Pre-Launch Beta (Hide Prices)",

    concierge_badge: "🤖 Hermes AI Travel Concierge",
    concierge_title: "Ask Hermes for Your Ideal Trip",
    concierge_desc: "Enter your destination, kids' ages, pet breed or extreme sport passion. Hermes provides authentic local recommendations.",
    concierge_btn: "Ask Hermes 🚀",
    concierge_placeholder: "E.g. 3 days in Lisbon: Cliff diving, toddler-safe beach & authentic food without scams...",

    footer_copy: "© 2026 Scratch'n'Travel — Human-First Social Travel Platform.",
    footer_links: "🔒 100% Cookie-free | Imprint | Privacy | Terms of Service"
  },

  es: {
    nav_concept: "El Concepto",
    nav_family_pets: "Familias y Mascotas 🐶",
    nav_activities: "Actividades y Extremo 🏄‍♂️",
    nav_safety: "Seguridad y Estafas ⚠️",
    nav_geheimtipps: "Secretos 🔐",
    nav_scratchbook: "Scratchbook 📖",
    nav_pricing: "Precios y Beta 💳",
    nav_start_app: "Abrir App →",
    nav_back: "← Volver",
    nav_explorer: "Explorador",
    nav_hobbymatch: "Hobby Match 🎣",
    nav_flightcalc: "Vuelo Mascotas 🐕",
    nav_checklists: "Listas 📋",

    hero_badge: "🌍 La Capa Social del Viaje",
    hero_title_1: "No viajes como un simple turista.",
    hero_title_2: "Forma parte del lugar.",
    hero_subtitle: "Descubre rincones secretos de locales, conecta con personas para tus aficiones, deportes extremos y viajes familiares seguros.",
    hero_cta_explore: "Explorar Ahora ✨",
    hero_cta_family: "Familias y Perros 🐕",

    act_badge: "🏄‍♂️ Desde Viajes Familiares hasta Adrenalina",
    act_title: "Actividades a tu Medida",
    act_subtitle: "Playas tranquilas para carritos, calas para perros o surf de olas gigantes en Nazaré.",
    act_filter_all: "Todas las Actividades",
    act_filter_family: "👶 Familias y Niños",
    act_filter_pets: "🐶 Mascotas y Perros",
    act_filter_extreme: "⚡ Extremo y Adrenalina",
    act_filter_culture: "🍲 Cultura y Gastronomía",

    safety_badge: "⚠️ Protección Local",
    safety_title: "Radar Local de Seguridad y Estafas",
    safety_subtitle: "A quién NO debes confiar: Avisos sobre carteristas, precios abusivos, trampas turísticas y zonas de riesgo.",
    safety_filter_all: "Todos los Avisos",
    safety_filter_scam: "🟡 Estafas y Abusos",
    safety_filter_danger: "🔴 Zonas Peligrosas",
    safety_filter_tips: "🟢 Consejos de Locales",
    safety_report_btn: "+ Reportar Estafa / Peligro",

    pricing_badge: "Transparente y Seguro",
    pricing_title: "Precios y Acceso Beta",
    pricing_subtitle: "Sin comisiones ocultas. Prueba todas las funciones Pro gratis durante la fase beta.",
    pricing_status_label: "Estado Actual:",
    pricing_beta_badge: "🌱 Beta Pre-Lanzamiento (Gratis)",
    pricing_live_badge: "💳 Modo Stripe Pago Activo",
    pricing_toggle_to_live: "⚡ 1-Clic: Activar Stripe Modo Real",
    pricing_toggle_to_beta: "⇄ Cambiar a Beta (Precios Ocultos)",

    concierge_badge: "🤖 Hermes AI Concierge",
    concierge_title: "Pregunta a Hermes sobre tu Viaje",
    concierge_desc: "Escribe tu destino, edades de niños o deportes extremos deseados.",
    concierge_btn: "Preguntar a Hermes 🚀",
    concierge_placeholder: "Ej: 3 días en Lisboa: Surf, playa familiar y comida auténtica...",

    footer_copy: "© 2026 Scratch'n'Travel — Plataforma Social de Viajes.",
    footer_links: "🔒 Sin cookies de rastreo | Aviso Legal | Privacidad"
  },

  fr: {
    nav_concept: "Le Concept",
    nav_family_pets: "Famille & Animaux 🐶",
    nav_activities: "Activités & Extrême 🏄‍♂️",
    nav_safety: "Sécurité & Arnaques ⚠️",
    nav_geheimtipps: "Coins Secrets 🔐",
    nav_scratchbook: "Scratchbook 📖",
    nav_pricing: "Tarifs & Bêta 💳",
    nav_start_app: "Lancer l'App →",
    nav_back: "← Retour",
    nav_explorer: "Explorateur",
    nav_hobbymatch: "Hobby Match 🎣",
    nav_flightcalc: "Calcul Avion 🐕",
    nav_checklists: "Checklists 📋",

    hero_badge: "🌍 La Couche Sociale du Voyage",
    hero_title_1: "Ne voyagez plus en simple touriste.",
    hero_title_2: "Faites partie du lieu.",
    hero_subtitle: "Découvrez les adresses secrètes des locaux, rencontrez des passionnés et évitez les pièges à touristes.",
    hero_cta_explore: "Découvrir ✨",
    hero_cta_family: "Hub Famille & Chiens 🐕",

    act_badge: "🏄‍♂️ De la Balade Familiale à l'Adrénaline",
    act_title: "Des Activités pour Chacun",
    act_subtitle: "Plages accessibles en poussette, criques pour chiens ou surf extrême à Nazaré.",
    act_filter_all: "Toutes les Activités",
    act_filter_family: "👶 Famille & Enfants",
    act_filter_pets: "🐶 Animaux & Chiens",
    act_filter_extreme: "⚡ Extrême & Adrénaline",
    act_filter_culture: "🍲 Culture & Cuisine",

    safety_badge: "⚠️ Conseils & Vigilance des Locaux",
    safety_title: "Radar Sécurité & Arnaques",
    safety_subtitle: "À qui NE PAS faire confiance : Alertes sur les pickpockets, prix exorbitants et faux vendeurs.",
    safety_filter_all: "Toutes les Alertes",
    safety_filter_scam: "🟡 Arnaques & Surprix",
    safety_filter_danger: "🔴 Zones à Risque & Gangs",
    safety_filter_tips: "🟢 Bons Réflexes Locaux",
    safety_report_btn: "+ Signaler un Piège / Danger",

    pricing_badge: "Clair & Sans Surprise",
    pricing_title: "Tarifs & Accès Bêta",
    pricing_subtitle: "Aucune commission cachée. Accès VIP complet gratuit en phase de pré-lancement.",
    pricing_status_label: "Statut Actuel :",
    pricing_beta_badge: "🌱 Bêta Pré-Lancement (Gratuit)",
    pricing_live_badge: "💳 Paiement Stripe Actif",
    pricing_toggle_to_live: "⚡ 1-Clic : Activer Mode Stripe (Afficher Prix)",
    pricing_toggle_to_beta: "⇄ Passer en Mode Bêta (Masquer Prix)",

    concierge_badge: "🤖 Hermes AI Concierge",
    concierge_title: "Demandez à Hermes votre Voyage Idéal",
    concierge_desc: "Indiquez votre destination, présence d'enfants ou animaux pour des conseils avisés.",
    concierge_btn: "Interroger Hermes 🚀",
    concierge_placeholder: "Ex: 3 jours à Lisbonne : Plongée, plage calme et bonnes tables...",

    footer_copy: "© 2026 Scratch'n'Travel — Human-First Social Travel.",
    footer_links: "🔒 100% sans cookies traceurs | Mentions Légales | Confidentialité"
  },

  it: {
    nav_concept: "Il Concetto",
    nav_family_pets: "Famiglie e Animali 🐶",
    nav_activities: "Attività ed Estremo 🏄‍♂️",
    nav_safety: "Sicurezza e Truffe ⚠️",
    nav_geheimtipps: "Segreti 🔐",
    nav_scratchbook: "Scratchbook 📖",
    nav_pricing: "Prezzi e Beta 💳",
    nav_start_app: "Avvia App →",
    nav_back: "← Panoramica",
    nav_explorer: "City Explorer",
    nav_hobbymatch: "Hobby Match 🎣",
    nav_flightcalc: "Voli Animali 🐕",
    nav_checklists: "Checklist 📋",

    hero_badge: "🌍 Il Social Layer dei Viaggi",
    hero_title_1: "Non viaggiare da semplice turista.",
    hero_title_2: "Diventa parte del luogo.",
    hero_subtitle: "Scopri luoghi autentici consigliati da persone del posto, incontra compagni per i tuoi hobby ed evita le trappole per turisti.",
    hero_cta_explore: "Esplora Ora ✨",
    hero_cta_family: "Hub Famiglie e Cani 🐕",

    act_badge: "🏄‍♂️ Dalle Vacanze in Famiglia all'Adrenalina Pura",
    act_title: "Attività su Misura",
    act_subtitle: "Spiagge sicure per passeggini, lidi per cani o surf su onde giganti a Nazaré.",
    act_filter_all: "Tutte le Attività",
    act_filter_family: "👶 Famiglia e Bimbi",
    act_filter_pets: "🐶 Animali e Cani",
    act_filter_extreme: "⚡ Estremo e Adrenalina",
    act_filter_culture: "🍲 Cultura e Sapori",

    safety_badge: "⚠️ Radar Sicurezza dei Locali",
    safety_title: "Radar Sicurezza e Truffe",
    safety_subtitle: "Di chi NON fidarsi: Avvisi verificati su borseggiatori, prezzi gonfiati e zone sconsigliate di notte.",
    safety_filter_all: "Tutti gli Avvisi",
    safety_filter_scam: "🟡 Truffe e Prezzi Gonfiati",
    safety_filter_danger: "🔴 Zone a Rischio e Bande",
    safety_filter_tips: "🟢 Consigli Pratici dei Locali",
    safety_report_btn: "+ Segnala Truffa / Pericolo",

    pricing_badge: "Trasparente e Diretto",
    pricing_title: "Piani e Accesso Beta",
    pricing_subtitle: "Nessuna commissione occulta. Accesso VIP completo gratuito durante la fase beta.",
    pricing_status_label: "Stato Corrente:",
    pricing_beta_badge: "🌱 Pre-Launch Beta (Gratuito)",
    pricing_live_badge: "💳 Pagamento Stripe Attivo",
    pricing_toggle_to_live: "⚡ 1-Clic: Attiva Modalità Stripe (Mostra Prezzi)",
    pricing_toggle_to_beta: "⇄ Passa a Modalità Beta (Nascondi Prezzi)",

    concierge_badge: "🤖 Hermes AI Concierge",
    concierge_title: "Chiedi a Hermes per il Tuo Viaggio",
    concierge_desc: "Inserisci meta, età dei bambini o passione sportiva per ricevere consigli autentici.",
    concierge_btn: "Chiedi a Hermes 🚀",
    concierge_placeholder: "Es: 3 giorni a Lisbona: Tuffi da scogliera, spiaggia tranquilla e cibo tipico...",

    footer_copy: "© 2026 Scratch'n'Travel — Human-First Social Travel.",
    footer_links: "🔒 100% Senza Cookie Traccianti | Note Legali | Privacy"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('scratch_lang') || 'de';
  }

  getLang() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('scratch_lang', lang);
    this.applyTranslations();
    this.updateSelectorUI();
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['de'];
    return dict[key] || TRANSLATIONS['de'][key] || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // Update html lang attribute
    document.documentElement.lang = this.currentLang;

    // Refresh dynamic pricing if stripeManager is loaded
    if (window.stripeManager) {
      window.stripeManager.renderPricing();
    }
  }

  updateSelectorUI() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.i18n = new I18nManager();

document.addEventListener('DOMContentLoaded', () => {
  window.i18n.applyTranslations();
  window.i18n.updateSelectorUI();
});