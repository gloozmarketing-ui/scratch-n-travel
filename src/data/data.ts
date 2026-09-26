// ─── HOBBY CATEGORIES & EXTENDED TRAVEL DNA (130+ ACTIVITIES) ─────────────
export interface HobbyCategory {
  id: string
  name: string
  icon: string
  description: string
  hobbies: string[]
}

export const hobbyCategories: HobbyCategory[] = [
  {
    id: 'water_surf',
    name: 'Water & Surf',
    icon: '🏄',
    description: 'Wellenreiten, Meeresabenteuer & maritime Erlebnisse',
    hobbies: [
      'Surfing', 'Kitesurfing', 'Windsurfing', 'Stand-Up Paddling (SUP)', 'Bodyboarding',
      'Big Wave Watching', 'Scuba Diving', 'Freediving', 'Snorkeling', 'Sailing & Yachting',
      'Kayaking & Kanu', 'Coasteering', 'Cliff Jumping', 'Spearfishing', 'Deep Sea Fishing',
      'Open Water Swimming', 'Hydrofoil & Wingfoil', 'Cave Swimming', 'Tide Pool Exploring'
    ]
  },
  {
    id: 'mountain_hike',
    name: 'Mountain & Hike',
    icon: '🥾',
    description: 'Bergtouren, Weitwanderwege & Gipfelabenteuer',
    hobbies: [
      'Hiking', 'Trekking & Fernwandern', 'Trail Running', 'Hundewandern', 'Barfußwandern',
      'Gipfel-Besteigung', 'Klettersteig (Via Ferrata)', 'Hütten-Trekking', 'Nordic Walking',
      'Geocaching', 'Klamm- & Schluchtenwanderung', 'Vulkan-Besteigung', 'Wasserfall-Trekking',
      'Höhlen-Trekking (Speläologie)', 'Gletscher-Touren', 'Pilgerwege (Camino)'
    ]
  },
  {
    id: 'climbing_extreme',
    name: 'Climbing & Action',
    icon: '🧗',
    description: 'Vertikale Felsen, Klettergärten & Adrenalin-Erlebnisse',
    hobbies: [
      'Sportklettern', 'Bouldern', 'Deep Water Soloing (DWS)', 'Alpines Mehrseillängen-Klettern',
      'Canyoning', 'Paragliding & Gleitschirm', 'Skydiving', 'Downhill Mountainbiking (MTB)',
      'Gravel Biking', 'Bikepacking', 'Wildwasser-Rafting', 'Bungee Jumping', 'Ziplining',
      'Skateboarding & Longboard', 'Motorrad-Enduro', 'Quad & Buggy Offroad', 'Sandboarding'
    ]
  },
  {
    id: 'culinary_wine',
    name: 'Culinary & Wine',
    icon: '🍷',
    description: 'Authentische Geschmäcker, Weinkultur & Märkte',
    hobbies: [
      'Wine Tasting & Weingut-Hopping', 'Streetfood & Märkte', 'Craft Beer & Brauerei-Touren',
      'Seafood & Fischmarkt-Touren', 'Fado- & Tavernen-Abende', 'Kochkurse mit Locals',
      'Olivenöl-Verkostung', 'Kaffeekultur & Specialty Coffee', 'Trüffelsuche & Pilze sammeln',
      'Gourmet & Fine Dining', 'Bäckerei- & Sauerteig-Trails', 'Destillerie- & Gin-Tastings',
      'Picknick an Panoramaspots', 'Farm-to-Table Dinners', 'Food-Fotografie'
    ]
  },
  {
    id: 'creative_art',
    name: 'Creative & Art',
    icon: '📸',
    description: 'Fotografie, Handwerkskunst, Architektur & Kultur',
    hobbies: [
      'Landscape Photography', 'Drone Photography & Film', 'Golden Hour / Sunset Hunting',
      'Astrofotografie & Sternenbeobachtung', 'Street Photography', 'Azulejo- & Keramik-Workshops',
      'Streetart & Murals Jagd', 'Architektur-Touren', 'Skizzieren & Aquarell auf Reisen',
      'Reisetagebuch & Journaling', 'Vintage- & Flohmarkt-Hunting', 'Historische Burgen & Ruinen',
      'Klassische Musik & Open-Air Konzerte', 'Töpfern mit lokalen Meistern', 'Kalligrafie'
    ]
  },
  {
    id: 'vanlife_camping',
    name: 'Vanlife & Camping',
    icon: '🚐',
    description: 'Freiheit auf Rädern, Natur pur & Minimalismus',
    hobbies: [
      'Vanlife & Camper-Ausbau', 'Wildcamping & Bushcraft', 'Dachzelt-Reisen', '4x4 Overlanding',
      'Lagerfeuer-Küche', 'Outdoor Hängematten-Spots', 'Campingplatz-Geheimtipps', 'Solar- & Autark-Reisen',
      'Roadtrips entlang Küstenstraßen', 'Tiny House & Glamping', 'Sternschnuppen-Nächte'
    ]
  },
  {
    id: 'mindfulness_wellness',
    name: 'Mindfulness & Wellness',
    icon: '🧘',
    description: 'Entschleunigung, Yoga & natürliche Quellen',
    hobbies: [
      'Sunset Yoga & Strand-Yoga', 'Meditation an Kraftorten', 'Thermalquellen & Hot Springs',
      'Waldbaden (Shinrin-Yoku)', 'Eisbaden & Kälte-Exposition', 'Sound Baths & Klangschalen',
      'Ayurveda & Spa Retreats', 'Atemarbeit (Breathwork)', 'Digital Detox & Stille-Tage',
      'Kräuterheilkunde & Wildkräuter sammeln', 'Saunakultur an Seen/Meer'
    ]
  },
  {
    id: 'family_kids',
    name: 'Family & Stroller Friendly',
    icon: '👶',
    description: 'Barrierefreie Pfade, Spiel & Spaß für Groß und Klein',
    hobbies: [
      'Kinderwagen-Klippenpfade', 'Flache Sandstrände für Kleinkinder', 'Erlebnis-Bauernhöfe',
      'Natur-Lehrpfade mit Holzstegen', 'Familien-Radwege (stufenfrei)', 'Schatzsuche für Kinder',
      'Abenteuerspielplätze im Wald', 'Picknickwiesen mit Wickelstation', 'Aquarien & Tierreservate',
      'Leichte Familien-Klammen', 'Kinder-Surfschulen'
    ]
  },
  {
    id: 'pets_dog',
    name: 'Dog & Pet Travel',
    icon: '🐕',
    description: 'Reisen mit Vierbeinern ohne Kompromisse',
    hobbies: [
      'Off-Leash Hundestrände', 'Hundefreundliche Bergpfade (schattig)', 'Tränkestellen- & Bach-Trails',
      'Agility-Pfade in der Natur', 'Hundefreundliche Tavernen & Cafés', 'Tierarzt-Notfall-Netzwerk',
      'Hundefreundliches Camping', 'SUP mit Hund (Dog SUP)', 'Hunde-Fotografie an Klippen'
    ]
  },
  {
    id: 'culture_spirit',
    name: 'Culture & Heritage',
    icon: '🏛️',
    description: 'Tiefes Eintauchen in Traditionen und Geschichte',
    hobbies: [
      'Verlassene Dörfer & Lost Places', 'Antike Tempel & Ausgrabungen', 'Lokale Feste & Prozessionen',
      'Traditionelles Handwerk beobachten', 'Historische Bibliotheken', 'Museums-Nächte',
      'Mittelalter-Märkte', 'Weinlese & Olivenernte mithelfen', 'Sprachen lernen im Austausch'
    ]
  }
]

export const hobbiesList = hobbyCategories.flatMap(c => c.hobbies)

// ─── MATCH BUDDIES ─────────────────────────────────────────────────────────
export interface MatchBuddy {
  id: string
  name: string
  handle: string
  avatar: string
  avatarBg: string
  location: string
  country: string
  countryFlag: string
  hobbies: string[]
  commonHobbies: string[]
  matchScore: number
  bio: string
  hasDog: boolean
  hasKids: boolean
  currentLevel: number
  badgesCount: number
  verifiedLocal: boolean
  favoriteTour: string
}

export const matchBuddies: MatchBuddy[] = [
  {
    id: 'b1',
    name: 'Sofia Ribeiro',
    handle: '@sofia.surf',
    avatar: 'SR',
    avatarBg: 'from-amber-400 to-orange-500',
    location: 'Ericeira & Sintra',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    hobbies: ['Surfing', 'Drone Photography & Film', 'Sunset Yoga & Strand-Yoga', 'Hundewandern', 'Off-Leash Hundestrände'],
    commonHobbies: ['Surfing', 'Hundewandern', 'Drone Photography & Film'],
    matchScore: 94,
    bio: 'Locally raised in Ericeira. Surfer & Golden Retriever mom. Kenne jede unberührte Bucht zwischen Peniche und Cascais.',
    hasDog: true,
    hasKids: false,
    currentLevel: 9,
    badgesCount: 28,
    verifiedLocal: true,
    favoriteTour: 'Klippenabstieg Praia do Magoito'
  },
  {
    id: 'b2',
    name: 'Marco & Elena',
    handle: '@dolomiti.family',
    avatar: 'ME',
    avatarBg: 'from-emerald-400 to-teal-600',
    location: 'Val Gardena & Brixen',
    country: 'Italien',
    countryFlag: '🇮🇹',
    hobbies: ['Kinderwagen-Klippenpfade', 'Hütten-Trekking', 'Flache Sandstrände für Kleinkinder', 'Wine Tasting & Weingut-Hopping', 'Alpines Mehrseillängen-Klettern'],
    commonHobbies: ['Kinderwagen-Klippenpfade', 'Hütten-Trekking', 'Wine Tasting & Weingut-Hopping'],
    matchScore: 89,
    bio: 'Eltern von 2 Kleinkindern (1 & 3 J.). Wir testen jeden Bergweg auf Kinderwagentauglichkeit & Einkehrmöglichkeiten.',
    hasDog: false,
    hasKids: true,
    currentLevel: 8,
    badgesCount: 22,
    verifiedLocal: true,
    favoriteTour: 'Seiser Alm Panorama-Holzsteg Loop'
  },
  {
    id: 'b3',
    name: 'Lucas Keller',
    handle: '@lucas.vanlife',
    avatar: 'LK',
    avatarBg: 'from-sky-400 to-blue-600',
    location: 'Garmisch & Tirol',
    country: 'Deutschland / Österreich',
    countryFlag: '🇩🇪',
    hobbies: ['Vanlife & Camper-Ausbau', 'Bouldern', 'Wildcamping & Bushcraft', 'Hundewandern', 'Trail Running'],
    commonHobbies: ['Vanlife & Camper-Ausbau', 'Bouldern', 'Hundewandern'],
    matchScore: 92,
    bio: 'Ausgebauter 4x4 Sprinter, immer mit Border Collie "Nox" unterwegs. Suche Gleichgesinnte für Kletter-Sessions.',
    hasDog: true,
    hasKids: false,
    currentLevel: 11,
    badgesCount: 34,
    verifiedLocal: true,
    favoriteTour: 'Eibsee Hinterwald-Trail'
  },
  {
    id: 'b4',
    name: 'Nikos Katsaros',
    handle: '@nikos.crete',
    avatar: 'NK',
    avatarBg: 'from-blue-500 to-indigo-700',
    location: 'Chania & Lefka Ori',
    country: 'Griechenland',
    countryFlag: '🇬🇷',
    hobbies: ['Spearfishing', 'Tavernen-Abende', 'Trekking & Fernwandern', 'Olivenöl-Verkostung', 'Freediving'],
    commonHobbies: ['Trekking & Fernwandern', 'Tavernen-Abende', 'Freediving'],
    matchScore: 87,
    bio: 'Bergführer auf Kreta. Kenne die Schluchten ohne Touristenbusse und die Tavernen der Bergbauern.',
    hasDog: false,
    hasKids: false,
    currentLevel: 10,
    badgesCount: 31,
    verifiedLocal: true,
    favoriteTour: 'Aradena-Schlucht Geheimabstieg'
  },
  {
    id: 'b5',
    name: 'Clara Delacroix',
    handle: '@clara.provence',
    avatar: 'CD',
    avatarBg: 'from-purple-400 to-pink-600',
    location: 'Gordes & Luberon',
    country: 'Frankreich',
    countryFlag: '🇫🇷',
    hobbies: ['Wine Tasting & Weingut-Hopping', 'Landscape Photography', 'Specialty Coffee', 'Kinderwagen-Klippenpfade', 'Street Photography'],
    commonHobbies: ['Wine Tasting & Weingut-Hopping', 'Landscape Photography'],
    matchScore: 85,
    bio: 'Fotografin & Sommelière. Aufgewachsen zwischen Lavendelfeldern und Felsdörfern.',
    hasDog: true,
    hasKids: true,
    currentLevel: 7,
    badgesCount: 19,
    verifiedLocal: true,
    favoriteTour: 'Sentier des Ocres Roussillon'
  }
]

// ─── MASSIVE RESEARCHED SECRET SPOTS (30+ PINS ACROSS EUROPE & WORLD) ──────
export interface StoryPin {
  id: number
  local: string
  avatar: string
  location: string
  city: string
  country: string
  countryFlag: string
  region: string
  story: string
  rating: number
  reviews: number
  gps: string
  locked: boolean
  tag: string
  image: string
  category: string
  xp: number
  difficulty: 1 | 2 | 3 | 4 | 5
  dogFriendly: boolean
  dogDetails?: string
  strollerFriendly: boolean
  strollerDetails?: string
  familyKidsFriendly: boolean
  elevation?: string
  bestSeason?: string
  submittedBy?: string
}

export const storyPins: StoryPin[] = [
  // ── PORTUGAL ──────────────────────────────────────────────────────────────
  {
    id: 1,
    local: 'Fatima, 34',
    avatar: 'F',
    location: 'Praia da Ursa Klippenquelle',
    city: 'Sintra',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'Lissabon & Küste',
    story: '200 m hinter dem Aussichtspunkt entspringt eine geheime Klippenquelle. Der Pfad ist unmarkiert — achte auf drei gestapelte Steine links. Perfekt für Süßwasser nach dem Surfen.',
    rating: 4.9,
    reviews: 47,
    gps: '38°47\'29"N · 9°28\'32"W',
    locked: true,
    tag: 'Nature Secret',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 120,
    difficulty: 4,
    dogFriendly: true,
    dogDetails: 'Sportliche Hunde schaffen den Abstieg; Trittsicherheit erforderlich. Wasser mitnehmen.',
    strollerFriendly: false,
    strollerDetails: 'Steiler Geröllpfad — nicht kinderwagentauglich.',
    familyKidsFriendly: false,
    elevation: '140 m Abstieg',
    bestSeason: 'Frühling bis Herbst'
  },
  {
    id: 2,
    local: 'Miguel, 51',
    avatar: 'M',
    location: 'Alfama Hinterhof-Taverne',
    city: 'Lissabon',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'Lissabon & Küste',
    story: 'Das beste Bacalhau in ganz Lissabon hat kein Firmenschild. Klingle an der Rua das Pedras Negras und frage nach dem Tagesgericht ("o prato do dia"). Inhaberin Rosa kocht seit 1987.',
    rating: 4.8,
    reviews: 89,
    gps: '38°42\'44"N · 9°07\'59"W',
    locked: true,
    tag: 'Food Secret',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 90,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hunde im gemütlichen Innenhof herzlich willkommen.',
    strollerFriendly: true,
    strollerDetails: 'Ebenerdig erreichbar über die Seitenstraße.',
    familyKidsFriendly: true,
    elevation: '0 m',
    bestSeason: 'Ganzjährig'
  },
  {
    id: 3,
    local: 'Joao, 29',
    avatar: 'J',
    location: 'Praia de São Julião Reef Pass',
    city: 'Ericeira',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'Lissabon & Küste',
    story: 'Versteckter Riffdurchgang, der nur bei Ebbe freiliegt. Kristallklare Natur-Gezeitenbecken, in denen man windgeschützt baden kann, während draußen 3m-Wellen brechen.',
    rating: 4.95,
    reviews: 34,
    gps: '38°55\'48"N · 9°25\'12"W',
    locked: true,
    tag: 'Surf & Tide Secret',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop&auto=format',
    category: 'Surf',
    xp: 150,
    difficulty: 3,
    dogFriendly: true,
    dogDetails: 'Hunde dürfen am Strand frei laufen. Auf scharfe Riffmuscheln achten.',
    strollerFriendly: false,
    strollerDetails: 'Felsiger Sandzugang.',
    familyKidsFriendly: true,
    elevation: '20 m',
    bestSeason: 'Mai bis Oktober'
  },
  {
    id: 4,
    local: 'Teresa, 42',
    avatar: 'T',
    location: 'Ponta da Piedade Holzsteg-Labyrinth',
    city: 'Lagos (Algarve)',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'Algarve',
    story: 'Neuer, barrierefreier Holzsteg über den goldenen Sandsteinklippen. Führt zu einem geheimen Aussichtspunkt ohne Absperrung, an dem bei Sonnenuntergang Delfine an der Küste vorbeiziehen.',
    rating: 4.9,
    reviews: 62,
    gps: '37°04\'55"N · 8°40\'12"W',
    locked: true,
    tag: 'Coastal Secret',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 110,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Leinenpflicht auf dem Holzsteg. Trinknäpfe beim Leuchtturm-Kiosk.',
    strollerFriendly: true,
    strollerDetails: '100% stufenfrei auf 2.5 km Holzstegen mit sanfter Steigung.',
    familyKidsFriendly: true,
    elevation: '15 m',
    bestSeason: 'Ganzjährig'
  },
  {
    id: 5,
    local: 'Rui & Ines, 38',
    avatar: 'RI',
    location: 'Douro Quinta da Silveira Kellergewölbe',
    city: 'Pinhão / Douro-Tal',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    region: 'Nordportugal',
    story: 'Familiengeführtes Bio-Weingut mit Steinterrassen aus dem 18. Jahrhundert. Verkostung von Jahrgangs-Tawny direkt aus dem 100 Jahre alten Eichenfass mit Panoramablick auf den Fluss.',
    rating: 4.92,
    reviews: 51,
    gps: '41°11\'22"N · 7°32\'45"W',
    locked: true,
    tag: 'Wine Secret',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 130,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde im Garten und im Freiluft-Tastingbereich erlaubt.',
    strollerFriendly: true,
    strollerDetails: 'Zufahrt direkt bis zum Hof, gepflasterter Innenhof.',
    familyKidsFriendly: true,
    elevation: '80 m',
    bestSeason: 'März bis November'
  },

  // ── SPANIEN (SPAIN) ────────────────────────────────────────────────────────
  {
    id: 6,
    local: 'Pau, 31',
    avatar: 'P',
    location: 'Cala Tuent & Sa Calobra Hinterland',
    city: 'Mallorca (Serra de Tramuntana)',
    country: 'Spanien',
    countryFlag: '🇪🇸',
    region: 'Balearen',
    story: 'Während alle im überfüllten Torrent de Pareis stehen, biegst du 400 m vorher links ab. Ein Olivenbaum-Pfad führt zu einer einsamen Felsenbucht mit türkisfarbenem Bergquellwasser.',
    rating: 4.95,
    reviews: 73,
    gps: '39°50\'24"N · 2°46\'40"E',
    locked: true,
    tag: 'Nature Secret',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 140,
    difficulty: 3,
    dogFriendly: true,
    dogDetails: 'Hunde willkommen. Festes Schuhwerk wegen spitzer Kalksteine empfohlen.',
    strollerFriendly: false,
    strollerDetails: 'Felsiger Bergpfad.',
    familyKidsFriendly: true,
    elevation: '90 m',
    bestSeason: 'Mai bis Oktober'
  },
  {
    id: 7,
    local: 'Carmen, 45',
    avatar: 'C',
    location: 'Tajo de Ronda Klippengarten',
    city: 'Ronda (Andalusien)',
    country: 'Spanien',
    countryFlag: '🇪🇸',
    region: 'Andalusien',
    story: 'Unterhalb der Puente Nuevo führt ein versteckter Pfad durch alte maurische Wassermühlen zu einem wilden Feigengarten direkt an der 120m-Schlucht. Null Touristen, unvergleichlicher Ausblick.',
    rating: 4.88,
    reviews: 58,
    gps: '36°44\'21"N · 5°09\'58"W',
    locked: true,
    tag: 'Culture & Nature',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 110,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Sehr schön mit Hund, schattige Bäume und Wasserlauf am Tajo.',
    strollerFriendly: false,
    strollerDetails: 'Treppenstufen im Abstieg.',
    familyKidsFriendly: true,
    elevation: '70 m',
    bestSeason: 'Herbst & Frühling'
  },
  {
    id: 8,
    local: 'Iker, 28',
    avatar: 'I',
    location: 'Flysch-Klippen Pfad bei Zumaia',
    city: 'San Sebastián / Baskenland',
    country: 'Spanien',
    countryFlag: '🇪🇸',
    region: 'Baskenland',
    story: '60 Millionen Jahre alte Felsformationen ragen wie aufgeschlagene Buchseiten ins Meer. Bei Ebbe kann man 2 km weit über die Meeresplatten wandern.',
    rating: 4.96,
    reviews: 64,
    gps: '43°18\'11"N · 2°15\'33"W',
    locked: true,
    tag: 'Geology & Ocean',
    image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 160,
    difficulty: 3,
    dogFriendly: true,
    dogDetails: 'Hundefreundlicher Küstenpfad. Vorsicht bei feuchten Algenplatten.',
    strollerFriendly: true,
    strollerDetails: 'Oberer Klippenweg ist asphaltiert und perfekt für Kinderwagen.',
    familyKidsFriendly: true,
    elevation: '50 m',
    bestSeason: 'April bis Oktober'
  },

  // ── ITALIEN (ITALY) ────────────────────────────────────────────────────────
  {
    id: 9,
    local: 'Matteo, 36',
    avatar: 'M',
    location: 'Cadini di Misurina Panoramasporn',
    city: 'Dolomiten (Südtirol / Belluno)',
    country: 'Italien',
    countryFlag: '🇮🇹',
    region: 'Alpen & Dolomiten',
    story: 'Hinter dem Rifugio Auronzo biegt der Pfad nach Süden ab. Ein spektakulärer Felssporn eröffnet den Blick auf die zackigen Felskathedralen der Cadini-Gruppe. Beste Lichtstimmung 30 Min. vor Sonnenuntergang.',
    rating: 4.98,
    reviews: 95,
    gps: '46°36\'34"N · 12°17\'55"E',
    locked: true,
    tag: 'Alpine Masterpiece',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 180,
    difficulty: 4,
    dogFriendly: true,
    dogDetails: 'Trittsichere Hunde an der Leine. Schmale Passagen am Grat.',
    strollerFriendly: false,
    strollerDetails: 'Alpiner Geröll- und Fadengrat.',
    familyKidsFriendly: false,
    elevation: '180 m Aufstieg',
    bestSeason: 'Juni bis Oktober'
  },
  {
    id: 10,
    local: 'Giulia, 27',
    avatar: 'G',
    location: 'Seiser Alm Panoramaweg & Holzsteg',
    city: 'Gröden & Kastelruth',
    country: 'Italien',
    countryFlag: '🇮🇹',
    region: 'Südtirol',
    story: 'Europas größte Hochalm. Breiter, kinderwagentauglicher Weg entlang sanfter Blumenwiesen mit Blick auf Schlern und Langkofel. Frische Buttermilch und Heuschnaps auf der Sanon-Hütte.',
    rating: 4.91,
    reviews: 82,
    gps: '46°32\'45"N · 11°37\'18"E',
    locked: true,
    tag: 'Family & Alpine',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 100,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hunde an der Leine willkommen. Zahlreiche Bäche zum Trinken.',
    strollerFriendly: true,
    strollerDetails: '100% stufenfreier Schotter- und Asphaltweg, für jeden Buggy geeignet.',
    familyKidsFriendly: true,
    elevation: '60 m',
    bestSeason: 'Mai bis Oktober'
  },
  {
    id: 11,
    local: 'Lorenzo, 62',
    avatar: 'L',
    location: 'Pienza Bio-Pecorino Höhlenkeller',
    city: 'Val d\'Orcia (Toskana)',
    country: 'Italien',
    countryFlag: '🇮🇹',
    region: 'Toskana',
    story: 'In den Tuffsteingewölben unterhalb der Stadtmauer reift Pecorino in Walnussblättern und Olivenasche. Lorenzo öffnet seinen privaten Verkostungsraum nur nach Voranmeldung.',
    rating: 4.87,
    reviews: 49,
    gps: '43°04\'38"N · 11°40\'45"E',
    locked: true,
    tag: 'Culinary Soul',
    image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=600&h=400&fit=crop&auto=format',
    category: 'Food',
    xp: 95,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hunde im Garten und Käserei-Vorhof erlaubt.',
    strollerFriendly: true,
    strollerDetails: 'Ebenerdiger Zugang.',
    familyKidsFriendly: true,
    elevation: '0 m',
    bestSeason: 'Ganzjährig'
  },

  // ── GRIECHENLAND (GREECE) ──────────────────────────────────────────────────
  {
    id: 12,
    local: 'Eleni, 39',
    avatar: 'E',
    location: 'Balos Lagoon Klippenpfad am Morgen',
    city: 'Gramvousa / Chania (Kreta)',
    country: 'Griechenland',
    countryFlag: '🇬🇷',
    region: 'Griechische Inseln',
    story: 'Um 07:30 Uhr morgens vor Ankunft der Ausflugsboote erstrahlt die Lagune in purem Türkis und Rosa-Korallensand. Der alte Eselspfad belohnt mit völliger Einsamkeit.',
    rating: 4.97,
    reviews: 112,
    gps: '35°34\'55"N · 23°35\'20"E',
    locked: true,
    tag: 'Paradise Lagoon',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 150,
    difficulty: 3,
    dogFriendly: true,
    dogDetails: 'Hunde erlaubt. Wichtig: Viel Wasser mitnehmen, kein Schatten!',
    strollerFriendly: false,
    strollerDetails: 'Steile Steinstufen im Abstieg.',
    familyKidsFriendly: true,
    elevation: '160 m',
    bestSeason: 'Mai, Juni, September, Oktober'
  },
  {
    id: 13,
    local: 'Stavros, 48',
    avatar: 'S',
    location: 'Meteora Eremiten-Höhle Ypapanti',
    city: 'Kalambaka / Meteora',
    country: 'Griechenland',
    countryFlag: '🇬🇷',
    region: 'Thessalien',
    story: 'Abseits der Touristenbusse führt ein schattiger Eichenwald-Pfad zum in den Fels gebauten Kloster Ypapanti aus dem Jahr 1367. Völlige Stille mit Blick auf die gigantischen Sandsteintürme.',
    rating: 4.93,
    reviews: 41,
    gps: '39°43\'38"N · 21°37\'49"E',
    locked: true,
    tag: 'Spiritual Heritage',
    image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?w=600&h=400&fit=crop&auto=format',
    category: 'Culture',
    xp: 130,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde auf den Waldpfaden erlaubt (im Klosterinnenraum verboten).',
    strollerFriendly: false,
    strollerDetails: 'Waldwurzeln und Naturstufen.',
    familyKidsFriendly: true,
    elevation: '120 m',
    bestSeason: 'Frühling & Herbst'
  },

  // ── DEUTSCHLAND, ÖSTERREICH & SCHWEIZ (DACH) ───────────────────────────────
  {
    id: 14,
    local: 'Sebastian, 33',
    avatar: 'S',
    location: 'Malerwinkel & Obersee Bootshaus',
    city: 'Königssee & Berchtesgaden',
    country: 'Deutschland',
    countryFlag: '🇩🇪',
    region: 'Bayerische Alpen',
    story: 'Frühmorgens mit dem ersten Elektroboot nach Salet übersetzen. Nach 15 Min. Spaziergang spiegelt sich die Watzmann-Ostwand im glasklaren Obersee beim historischen Bootshaus.',
    rating: 4.94,
    reviews: 120,
    gps: '47°30\'42"N · 12°59\'15"E',
    locked: true,
    tag: 'Alpine Mirror',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 120,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde auf dem Boot und dem Uferweg herzlich willkommen (Leinenpflicht).',
    strollerFriendly: true,
    strollerDetails: 'Uferweg bis zum Obersee-Beginn gut mit geländegängigem Buggy befahrbar.',
    familyKidsFriendly: true,
    elevation: '30 m',
    bestSeason: 'Mai bis November'
  },
  {
    id: 15,
    local: 'Hannah, 29',
    avatar: 'H',
    location: 'Schwarzwald Triberger Wasserfälle Oberlauf',
    city: 'Schonach & Triberg',
    country: 'Deutschland',
    countryFlag: '🇩🇪',
    region: 'Schwarzwald',
    story: 'Während die Massen am Haupteingang anstehen, parkst du oben bei Schonach. Ein moosiger Holzsteg führt entlang tosender Kaskaden durch uralten Tannenwald.',
    rating: 4.86,
    reviews: 67,
    gps: '48°07\'45"N · 8°13\'30"E',
    locked: true,
    tag: 'Black Forest Magic',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 90,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Paradies für Hunde mit kühlen Bächen zum Abkühlen.',
    strollerFriendly: true,
    strollerDetails: 'Asphaltierter Kaskadenweg, stellenweise Steigung, aber stufenfrei.',
    familyKidsFriendly: true,
    elevation: '80 m',
    bestSeason: 'Ganzjährig'
  },
  {
    id: 16,
    local: 'Urs, 47',
    avatar: 'U',
    location: 'Riffelsee Spiegelung Matterhorn',
    city: 'Zermatt / Wallis',
    country: 'Schweiz',
    countryFlag: '🇨🇭',
    region: 'Schweizer Alpen',
    story: 'Steige bei der Station Rotenboden aus. Nach 8 Min. Fußweg erreichst du den Riffelsee, in dem sich die legendäre Matterhorn-Pyramide windstill spiegelt. Perfekt für Murmeltier-Beobachtungen.',
    rating: 4.99,
    reviews: 145,
    gps: '45°58\'58"N · 7°46\'40"E',
    locked: true,
    tag: 'Swiss Icon',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 190,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde fahren in der Gornergratbahn kostenlos mit und lieben die Wiesen.',
    strollerFriendly: true,
    strollerDetails: 'Breiter Schotterweg von der Bahnstation zum See.',
    familyKidsFriendly: true,
    elevation: '40 m',
    bestSeason: 'Juni bis Oktober'
  },

  // ── FRANKREICH (FRANCE) ───────────────────────────────────────────────────
  {
    id: 17,
    local: 'Camille, 35',
    avatar: 'C',
    location: 'Sentier du Littoral Cap d\'Antibes',
    city: 'Antibes & Cannes',
    country: 'Frankreich',
    countryFlag: '🇫🇷',
    region: 'Côte d\'Azur',
    story: '5 km langer Zöllnerpfad direkt an den weißen Kalksteinklippen zwischen Luxusvillen und türkisblauen Buchten. Immer wieder Einstiege zum Klippenspringen und Schnorcheln.',
    rating: 4.92,
    reviews: 78,
    gps: '43°33\'10"N · 7°07\'45"E',
    locked: true,
    tag: 'Riviera Coast',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 110,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde an der Leine erlaubt. Viele Badeeinstiege.',
    strollerFriendly: false,
    strollerDetails: 'Enge Treppenpassagen im Fels.',
    familyKidsFriendly: true,
    elevation: '25 m',
    bestSeason: 'März bis November'
  },
  {
    id: 18,
    local: 'Jean-Luc, 53',
    avatar: 'JL',
    location: 'Gorges du Verdon Styx-Felsentor',
    city: 'La Palud-sur-Verdon',
    country: 'Frankreich',
    countryFlag: '🇫🇷',
    region: 'Provence',
    story: 'Der tiefste Canyon Europas. Beim Abstieg über den Sentier Blanc-Martel erreichst du die smaragdgrüne Engstelle "Le Styx". Nur bei stabilem Wetter begehen.',
    rating: 4.96,
    reviews: 88,
    gps: '43°44\'30"N · 6°20\'15"E',
    locked: true,
    tag: 'Canyon Adventure',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 170,
    difficulty: 4,
    dogFriendly: false,
    dogDetails: 'Wegen steiler Metallleitern nicht für Hunde geeignet.',
    strollerFriendly: false,
    strollerDetails: 'Extrem alpines Gelände mit Tunneln.',
    familyKidsFriendly: false,
    elevation: '450 m',
    bestSeason: 'Juni bis September'
  },

  // ── SKANDINAVIEN & NORWEGEN ────────────────────────────────────────────────
  {
    id: 19,
    local: 'Astrid, 30',
    avatar: 'A',
    location: 'Reinebringen Steintreppen-Aussicht',
    city: 'Lofoten / Reine',
    country: 'Norwegen',
    countryFlag: '🇳🇴',
    region: 'Nordkap & Lofoten',
    story: '1.560 Sherpa-Steinstufen führen senkrecht über die Fjorde und Fischerdörfer von Reine. Bei Mitternachtssonne zwischen Juni und Juli glüht der Atlantik in Goldorange.',
    rating: 4.98,
    reviews: 135,
    gps: '67°55\'45"N · 13°05\'10"E',
    locked: true,
    tag: 'Fjord Panoramic',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 200,
    difficulty: 4,
    dogFriendly: true,
    dogDetails: 'Kräftige Hunde schaffen die Stufen gut. Leinenpflicht wegen Absturzgefahr.',
    strollerFriendly: false,
    strollerDetails: 'Reine Steintreppe.',
    familyKidsFriendly: false,
    elevation: '448 m Stufenaufstieg',
    bestSeason: 'Juni bis September'
  },
  {
    id: 20,
    local: 'Olav, 41',
    avatar: 'O',
    location: 'Uttakleiv & Haukland Sandstrand-Loop',
    city: 'Vestvågøy (Lofoten)',
    country: 'Norwegen',
    countryFlag: '🇳🇴',
    region: 'Lofoten',
    story: 'Weißer Karibik-Sandstrand umrahmt von arktischen Granitbergen. Ein alter Karrenweg verbindet Haukland und Uttakleiv entlang der tosenden Brandung.',
    rating: 4.92,
    reviews: 56,
    gps: '68°12\'30"N · 13°31\'15"E',
    locked: true,
    tag: 'Arctic Beach',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 120,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Eldorado für Hunde am kilometerlangen Sandstrand.',
    strollerFriendly: true,
    strollerDetails: 'Flacher Schotterweg um das Felsenkap herum, ideal für Kinderwagen.',
    familyKidsFriendly: true,
    elevation: '10 m',
    bestSeason: 'Ganzjährig (auch für Nordlichter)'
  },

  // ── ISLAND (ICELAND) ──────────────────────────────────────────────────────
  {
    id: 21,
    local: 'Siggi, 37',
    avatar: 'S',
    location: 'Reykjadalur Heißer Dampffluss',
    city: 'Hveragerði',
    country: 'Island',
    countryFlag: '🇮🇸',
    region: 'Südisland',
    story: 'Nach einer 45-Minuten-Wanderung durch geothermale Rauchfelder erreichst du einen naturbelassenen 39°C warmen Fluss mit Holzstegen mitten im saftig grünen Tal.',
    rating: 4.95,
    reviews: 98,
    gps: '64°01\'40"N · 21°12\'55"W',
    locked: true,
    tag: 'Hot Spring Secret',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 160,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Hunde dürfen mitwandern, aber nicht in die heißen Quellbereiche!',
    strollerFriendly: false,
    strollerDetails: 'Schotterpfad mit mäßiger Steigung.',
    familyKidsFriendly: true,
    elevation: '180 m',
    bestSeason: 'Mai bis Oktober'
  },

  // ── JAPAN ──────────────────────────────────────────────────────────────────
  {
    id: 22,
    local: 'Kenji, 44',
    avatar: 'K',
    location: 'Arashiyama Bambus-Hinterpfad Otagi',
    city: 'Kyoto',
    country: 'Japan',
    countryFlag: '🇯🇵',
    region: 'Kansai',
    story: '1 km hinter dem überfüllten Bambuswald liegt Otagi Nenbutsu-ji: 1.200 skurrile, moosbedeckte Steinfiguren von Eremiten mit lachenden Gesichtern mitten im stillen Bergwald.',
    rating: 4.97,
    reviews: 84,
    gps: '35°01\'45"N · 135°39\'20"E',
    locked: true,
    tag: 'Zen Heritage',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&auto=format',
    category: 'Culture',
    xp: 140,
    difficulty: 1,
    dogFriendly: false,
    dogDetails: 'Haustiere auf Tempelgelände nicht gestattet.',
    strollerFriendly: true,
    strollerDetails: 'Asphaltierte Straße bis zum Tempeleingang.',
    familyKidsFriendly: true,
    elevation: '40 m',
    bestSeason: 'Frühling (Kirschblüte) & Herbst (Laubfärbung)'
  },
  {
    id: 23,
    local: 'Yuki, 28',
    avatar: 'Y',
    location: 'Yanaka Retro-Gassen & Straßenkatzen',
    city: 'Tokio',
    country: 'Japan',
    countryFlag: '🇯🇵',
    region: 'Kanto',
    story: 'Das einzige Viertel Tokios, das den 2. Weltkrieg unbeschadet überstanden hat. Holztempel, handgemachte Sesam-Cracker und traditionelle Sentō-Bäder ohne Wolkenkratzer.',
    rating: 4.89,
    reviews: 63,
    gps: '35°43\'30"N · 139°46\'10"E',
    locked: true,
    tag: 'Old Tokyo Soul',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop&auto=format',
    category: 'Culture',
    xp: 100,
    difficulty: 1,
    dogFriendly: true,
    dogDetails: 'Hunde an der Leine in allen Straßen erlaubt.',
    strollerFriendly: true,
    strollerDetails: 'Flache, verkehrsberuhigte Gassen.',
    familyKidsFriendly: true,
    elevation: '0 m',
    bestSeason: 'Ganzjährig'
  },

  // ── INDONESIEN (BALI & LOMBOK) ─────────────────────────────────────────────
  {
    id: 24,
    local: 'Wayan, 35',
    avatar: 'W',
    location: 'Sidemen Reisterrassen & Vulkanblick',
    city: 'Karangasem / Sidemen (Bali)',
    country: 'Indonesien',
    countryFlag: '🇮🇩',
    region: 'Südostasien',
    story: 'Das echte Bali der 1980er Jahre. Unberührte Reisterrassen mit Blick auf den mächtigen Vulkan Mount Agung. Lokale Bio-Palmzucker-Herstellung und Warungs mit Flussblick.',
    rating: 4.96,
    reviews: 91,
    gps: '8°29\'15"S · 115°26\'40"E',
    locked: true,
    tag: 'Tropical Soul',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop&auto=format',
    category: 'Nature',
    xp: 130,
    difficulty: 2,
    dogFriendly: true,
    dogDetails: 'Sehr tierfreundlich, viele balinesische Dorfhunde.',
    strollerFriendly: false,
    strollerDetails: 'Schmale Lehmpfade zwischen Reisfeldern.',
    familyKidsFriendly: true,
    elevation: '50 m',
    bestSeason: 'Mai bis Oktober'
  }
]

// ─── MASSIVE CITIES & DESTINATIONS HUB (20+ HUBS) ──────────────────────────
export interface CityHub {
  name: string
  flag: string
  country: string
  region: string
  tier: string
  total: number
  taken: number
  description: string
  topActivity: string
}

export const cities: CityHub[] = [
  {
    name: 'Lisbon & Sintra',
    flag: '🇵🇹',
    country: 'Portugal',
    region: 'Lissabon & Küste',
    tier: 'Top Destination',
    total: 24,
    taken: 19,
    description: 'Historische Gassen, Fado-Tavernen, Paläste im Nebelwald & wilde Klippen.',
    topActivity: 'Bacalhau-Hinterhöfe & Klippenquellen'
  },
  {
    name: 'Porto & Douro-Tal',
    flag: '🇵🇹',
    country: 'Portugal',
    region: 'Nordportugal',
    tier: 'Top Destination',
    total: 18,
    taken: 14,
    description: 'Portweinkeller, Azulejo-Bahnhöfe & spektakuläre Flussschleifen.',
    topActivity: 'Weingut-Tastings & Holzsteg-Loops'
  },
  {
    name: 'Ericeira & Peniche',
    flag: '🇵🇹',
    country: 'Portugal',
    region: 'Surf Coast',
    tier: 'Surf & Nature',
    total: 16,
    taken: 12,
    description: 'World Surfing Reserve, Gezeitenbecken & Vanlife-Sonnenuntergänge.',
    topActivity: 'Reef Breaks & Meeresfrüchte'
  },
  {
    name: 'Algarve & Vicentina',
    flag: '🇵🇹',
    country: 'Portugal',
    region: 'Algarve',
    tier: 'Coastal Hub',
    total: 22,
    taken: 17,
    description: 'Goldene Sandsteinklippen, Höhlenstrände & Zöllnerpfade.',
    topActivity: 'Holzsteg-Klippenwege & Stand-Up Paddling'
  },
  {
    name: 'Mallorca (Tramuntana)',
    flag: '🇪🇸',
    country: 'Spanien',
    region: 'Balearen',
    tier: 'Island Hub',
    total: 20,
    taken: 15,
    description: 'Unberührte Felsenbuchten, Olivenhaine & spektakuläre Passstraßen.',
    topActivity: 'Einsame Calas & Klippenwandern'
  },
  {
    name: 'Andalusien (Ronda & Cádiz)',
    flag: '🇪🇸',
    country: 'Spanien',
    region: 'Südspanien',
    tier: 'Culture & Sun',
    total: 18,
    taken: 13,
    description: 'Weiße Dörfer, 120m-Schluchten, Flamenco & Atlantikstrände.',
    topActivity: 'Schluchtenpfade & Sherry-Tasting'
  },
  {
    name: 'San Sebastián & Baskenland',
    flag: '🇪🇸',
    country: 'Spanien',
    region: 'Nordspanien',
    tier: 'Gourmet & Ocean',
    total: 15,
    taken: 11,
    description: 'Pintxos-Bars der Spitzenklasse, Flysch-Klippen & rauer Ozean.',
    topActivity: 'Gourmet-Hopping & Geologie-Wanderung'
  },
  {
    name: 'Dolomiten & Südtirol',
    flag: '🇮🇹',
    country: 'Italien',
    region: 'Alpen',
    tier: 'Alpine Master',
    total: 26,
    taken: 21,
    description: 'Zackige Felskathedralen, kinderwagentaugliche Almen & Alpinklettersteige.',
    topActivity: 'Klettersteige & Hütten-Schlutzkrapfen'
  },
  {
    name: 'Toskana & Val d\'Orcia',
    flag: '🇮🇹',
    country: 'Italien',
    region: 'Mittelitalien',
    tier: 'Culture & Wine',
    total: 19,
    taken: 14,
    description: 'Zypressenalleen, Tuffsteinstädte, Bio-Pecorino & Chianti-Klassiker.',
    topActivity: 'Bio-Käsereien & Wein-Roadtrips'
  },
  {
    name: 'Chania & Lefka Ori (Kreta)',
    flag: '🇬🇷',
    country: 'Griechenland',
    region: 'Inseln',
    tier: 'Island & Myth',
    total: 20,
    taken: 16,
    description: 'Türkise Lagunen, tiefe Schluchten, Klosterruinen & Ziegenhirten-Käse.',
    topActivity: 'Schluchten-Trekking & Lagunen-Schwimmen'
  },
  {
    name: 'Meteora & Thessalien',
    flag: '🇬🇷',
    country: 'Griechenland',
    region: 'Festland',
    tier: 'Spiritual Wonder',
    total: 14,
    taken: 10,
    description: 'Schwebende Klöster auf Felsnadeln & schattige Eichenwälder.',
    topActivity: 'Eremiten-Pfade & Sonnenuntergangs-Felsen'
  },
  {
    name: 'Bayerische Alpen & Königssee',
    flag: '🇩🇪',
    country: 'Deutschland',
    region: 'Alpen',
    tier: 'Alpine Gem',
    total: 22,
    taken: 18,
    description: 'Smaragdgrüne Gebirgsseen, Watzmann-Ostwand & urige Almen.',
    topActivity: 'Königssee-Elektroboot & Alm-Brotzeiten'
  },
  {
    name: 'Schwarzwald & Schluchten',
    flag: '🇩🇪',
    country: 'Deutschland',
    region: 'Südwestdeutschland',
    tier: 'Forest & Water',
    total: 17,
    taken: 12,
    description: 'Verwunschene Wasserfälle, Kuckucksuhren-Kultur & Tannenwälder.',
    topActivity: 'Kaskaden-Pfade & Schwarzwälder Kirschtorte'
  },
  {
    name: 'Zermatt & Matterhorn',
    flag: '🇨🇭',
    country: 'Schweiz',
    region: 'Wallis',
    tier: 'Alpine Icon',
    total: 18,
    taken: 15,
    description: 'Spiegelnde Bergseen, 4.000er-Gipfelpanorama & Murmeltiertrails.',
    topActivity: 'Gornergrat-Bahn & Riffelsee-Spiegelung'
  },
  {
    name: 'Côte d\'Azur & Cap d\'Antibes',
    flag: '🇫🇷',
    country: 'Frankreich',
    region: 'Südfrankreich',
    tier: 'Riviera Luxury',
    total: 16,
    taken: 13,
    description: 'Zöllnerpfade an weißen Klippen, provenzalische Märkte & Strandbistros.',
    topActivity: 'Klippenpfade & Meeresfrüchte-Tasting'
  },
  {
    name: 'Gorges du Verdon & Provence',
    flag: '🇫🇷',
    country: 'Frankreich',
    region: 'Provence',
    tier: 'Canyon Epic',
    total: 19,
    taken: 14,
    description: 'Europas tiefste Schlucht, Lavendelfelder & Felsdörfer.',
    topActivity: 'Canyon-Abstiege & Kajak-Expeditionen'
  },
  {
    name: 'Lofoten Fjorde & Strände',
    flag: '🇳🇴',
    country: 'Norwegen',
    region: 'Arktis',
    tier: 'Arctic Dream',
    total: 21,
    taken: 17,
    description: 'Rote Rorbuer-Fischerhütten, Sherpa-Steintreppen & Mitternachtssonne.',
    topActivity: 'Mitternachtssonnen-Gipfeltouren & Arctic SUP'
  },
  {
    name: 'Südisland & Geothermal-Täler',
    flag: '🇮🇸',
    country: 'Island',
    region: 'Vulkaninsel',
    tier: 'Fire & Ice',
    total: 20,
    taken: 16,
    description: 'Heiße Flussquellen, schwarze Sandstrände, Wasserfälle & Mooslava.',
    topActivity: 'Warmfluss-Baden & Gletscherlagunen'
  },
  {
    name: 'Kyoto & Historische Tempel',
    flag: '🇯🇵',
    country: 'Japan',
    region: 'Kansai',
    tier: 'Zen & Culture',
    total: 25,
    taken: 20,
    description: 'Versteckte Bambuspfade, 1.200 Moosfiguren & Matcha-Teezeremonien.',
    topActivity: 'Geheime Zen-Gärten & Street-Food-Märkte'
  },
  {
    name: 'Sidemen & Bali Vulkanpfade',
    flag: '🇮🇩',
    country: 'Indonesien',
    region: 'Südostasien',
    tier: 'Tropical Peace',
    total: 22,
    taken: 18,
    description: 'Unberührte Reisterrassen, Fluss-Warungs & Mount-Agung-Panoramen.',
    topActivity: 'Reisfeld-Wanderungen & Palmzucker-Workshops'
  }
]

// ─── MASSIVE EXPANDED COMMUNITY TOURS (10+ GPX-READY ROUTES) ────────────────
export interface CommunityTour {
  id: number
  title: string
  creator: string
  avatar: string
  location: string
  country: string
  countryFlag: string
  distance: string
  duration: string
  difficulty: 1 | 2 | 3 | 4 | 5
  bestTime: string
  stops: number
  likes: number
  category: string
  tags: string[]
  image: string
  rating: number
  reviews: number
  dogFriendly: boolean
  dogDetails?: string
  strollerFriendly: boolean
  strollerDetails?: string
  familyKidsFriendly: boolean
  elevation: string
}

export const tours: CommunityTour[] = [
  {
    id: 1,
    title: 'Lisboa Hidden Viewpoints & Miradouros Loop',
    creator: 'Ana & Carlos',
    avatar: 'AC',
    location: 'Lissabon (Alfama & Graça)',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    distance: '8.4 km',
    duration: '3h 30m',
    difficulty: 2,
    bestTime: 'Sonnenuntergang (17:30–19:30)',
    stops: 7,
    likes: 245,
    category: 'City Walk',
    tags: ['Miradouros', 'Fado', 'Sunset', 'Streetart'],
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format',
    rating: 4.9,
    reviews: 62,
    dogFriendly: true,
    dogDetails: 'Sehr schön mit Hund, viele Brunnen & schattige Plätze.',
    strollerFriendly: false,
    strollerDetails: 'Alfama-Gassen haben historische Treppen.',
    familyKidsFriendly: true,
    elevation: '+180 m / -180 m'
  },
  {
    id: 2,
    title: 'Sintra Magic Forest & Klippenabstieg Praia da Ursa',
    creator: 'Rui Fernandes',
    avatar: 'RF',
    location: 'Sintra & Cabo da Roca',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    distance: '12.2 km',
    duration: '5h 15m',
    difficulty: 4,
    bestTime: '08:00 morgens (windstill)',
    stops: 5,
    likes: 389,
    category: 'Hike & Coast',
    tags: ['Wild Coast', 'Ursa Beach', 'Granitfelsen', 'Naturquelle'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
    rating: 4.98,
    reviews: 114,
    dogFriendly: true,
    dogDetails: 'Nur für fitte, trittsichere Hunde. Ausreichend Wasser einpacken!',
    strollerFriendly: false,
    strollerDetails: 'Alpiner Klippenpfad mit Seilabschnitten.',
    familyKidsFriendly: false,
    elevation: '+420 m / -420 m'
  },
  {
    id: 3,
    title: 'Ponta da Piedade Holzsteg-Trail & Klippen-Panoramen',
    creator: 'Lagos Explorers Club',
    avatar: 'LE',
    location: 'Lagos (Algarve)',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    distance: '6.5 km',
    duration: '2h 00m',
    difficulty: 1,
    bestTime: 'Ganzjährig · Morgenlicht',
    stops: 6,
    likes: 312,
    category: 'Coastal Walk',
    tags: ['Barrierefrei', 'Holzsteg', 'Sandstein', 'Delfin-Blick'],
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop&auto=format',
    rating: 4.92,
    reviews: 84,
    dogFriendly: true,
    dogDetails: 'Hunde an der Leine auf den Holzstegen herzlich willkommen.',
    strollerFriendly: true,
    strollerDetails: '100% stufenfrei auf befestigten Wegen & Holzstegen.',
    familyKidsFriendly: true,
    elevation: '+45 m / -45 m'
  },
  {
    id: 4,
    title: 'Dolomiten Seiser Alm & Schlern Panoramasteig',
    creator: 'Florian Pichler',
    avatar: 'FP',
    location: 'Kastelruth / Seiser Alm',
    country: 'Italien',
    countryFlag: '🇮🇹',
    distance: '10.5 km',
    duration: '3h 45m',
    difficulty: 1,
    bestTime: 'Juni bis Oktober',
    stops: 5,
    likes: 420,
    category: 'Alpine Easy',
    tags: ['Familie', 'Kinderwagen', 'Hütten', 'Käseverkostung'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&auto=format',
    rating: 4.97,
    reviews: 130,
    dogFriendly: true,
    dogDetails: 'Hundefreundlich, viele Bäche und grüne Almwiesen.',
    strollerFriendly: true,
    strollerDetails: 'Durchgehend geschotterte Almstraßen, perfekt für Sportkinderwagen.',
    familyKidsFriendly: true,
    elevation: '+120 m / -120 m'
  },
  {
    id: 5,
    title: 'Cadini di Misurina Grat-Trail zur Felsenkathedrale',
    creator: 'Marco Belluno',
    avatar: 'MB',
    location: 'Tre Cime / Cadini',
    country: 'Italien',
    countryFlag: '🇮🇹',
    distance: '7.8 km',
    duration: '3h 30m',
    difficulty: 4,
    bestTime: '06:30 Sonnenaufgang',
    stops: 4,
    likes: 510,
    category: 'Alpine High',
    tags: ['Gratwanderung', 'Dolomiten', 'Epische Fotos', 'Alpin'],
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop&auto=format',
    rating: 4.99,
    reviews: 168,
    dogFriendly: true,
    dogDetails: 'Trittsichere Hunde an kurzer Leine.',
    strollerFriendly: false,
    strollerDetails: 'Schmaler Geröllgrat, Schwindelfreiheit erforderlich.',
    familyKidsFriendly: false,
    elevation: '+350 m / -350 m'
  },
  {
    id: 6,
    title: 'Königssee Malerwinkel & Obersee Bootshaus-Trail',
    creator: 'Bayerische Alpen Guides',
    avatar: 'BAG',
    location: 'Berchtesgaden & Schönau',
    country: 'Deutschland',
    countryFlag: '🇩🇪',
    distance: '9.0 km',
    duration: '3h 00m',
    difficulty: 2,
    bestTime: 'Frühling bis Herbst',
    stops: 5,
    likes: 340,
    category: 'Lakes & Mountains',
    tags: ['Spiegelsee', 'Watzmann', 'Bootstour', 'Almhütte'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop&auto=format',
    rating: 4.93,
    reviews: 97,
    dogFriendly: true,
    dogDetails: 'Hunde fahren auf dem Boot mit und lieben den Uferpfad.',
    strollerFriendly: true,
    strollerDetails: 'Bis zum Obersee-Vorderufer stufenfrei befahrbar.',
    familyKidsFriendly: true,
    elevation: '+95 m / -95 m'
  },
  {
    id: 7,
    title: 'Lofoten Reinebringen Sherpa-Stufen & Fjordblick',
    creator: 'Astrid & Jens',
    avatar: 'AJ',
    location: 'Reine / Lofoten',
    country: 'Norwegen',
    countryFlag: '🇳🇴',
    distance: '4.2 km',
    duration: '2h 45m',
    difficulty: 4,
    bestTime: 'Mitternachtssonne (23:00–01:00)',
    stops: 3,
    likes: 620,
    category: 'Arctic Peak',
    tags: ['Fjord', 'Mitternachtssonne', '1560 Stufen', 'Nordmeer'],
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&h=400&fit=crop&auto=format',
    rating: 4.99,
    reviews: 210,
    dogFriendly: true,
    dogDetails: 'Sportliche Hunde schaffen die Stufen mühelos.',
    strollerFriendly: false,
    strollerDetails: 'Reine Steintreppe.',
    familyKidsFriendly: false,
    elevation: '+448 m / -448 m'
  }
]

// ─── ACTIVITIES ────────────────────────────────────────────────────────────
export const activities = [
  {
    id: 1,
    name: 'Sunset Surf Session Ericeira & Video Analyse',
    cat: 'Surf',
    price: '€ 45',
    rating: 4.9,
    participants: '2–6 Pers.',
    icon: '🏄',
    dogFriendly: true,
    strollerFriendly: true,
    difficulty: 2
  },
  {
    id: 2,
    name: 'Privater Quinta-Weinkeller & Portwein Tasting',
    cat: 'Food',
    price: '€ 35',
    rating: 4.8,
    participants: 'ab 2 Pers.',
    icon: '🍷',
    dogFriendly: true,
    strollerFriendly: true,
    difficulty: 1
  },
  {
    id: 3,
    name: 'Cabo da Roca Secret Klippenwanderung & Picknick',
    cat: 'Nature',
    price: '€ 40',
    rating: 4.95,
    participants: 'max. 8 Pers.',
    icon: '🥾',
    dogFriendly: true,
    strollerFriendly: false,
    difficulty: 3
  },
  {
    id: 4,
    name: 'Dolomiten Seiser Alm Almkäse & E-Bike Tour',
    cat: 'Alpine',
    price: '€ 65',
    rating: 4.96,
    participants: '2–8 Pers.',
    icon: '🚴',
    dogFriendly: true,
    strollerFriendly: true,
    difficulty: 1
  },
  {
    id: 5,
    name: 'Kreta Balos Lagune Boots- & Schnorchel-Expedition',
    cat: 'Water',
    price: '€ 55',
    rating: 4.92,
    participants: 'max. 10 Pers.',
    icon: '🤿',
    dogFriendly: false,
    strollerFriendly: false,
    difficulty: 2
  }
]

// ─── RADAR & SCAMS ─────────────────────────────────────────────────────────
export interface Hazard {
  id: number
  title: string
  desc: string
  level: 'high' | 'medium' | 'low'
  area: string
  time: string
  category: string
  icon: string
}

export interface Scam {
  id: number
  title: string
  location: string
  desc: string
  reports: number
  icon: string
}

export const hazards: Hazard[] = [
  {
    id: 1,
    title: 'Klippenabbruch-Warnung Praia do Magoito',
    desc: 'Nach starken Regenfällen ist der südliche Abstiegspfad instabil. Bitte nur den befestigten Holzsteg nutzen.',
    level: 'high',
    area: 'Sintra & Cascais',
    time: 'vor 2 Std.',
    category: 'Naturgefahr',
    icon: '⚠️',
  },
  {
    id: 2,
    title: 'Starke Unterströmung (Rip Currents) an Praia Grande',
    desc: 'Rote Flagge aktiv. Nur im abgegrenzten Rettungsschwimmer-Bereich ins Wasser gehen.',
    level: 'high',
    area: 'Sintra & Cascais',
    time: 'vor 4 Std.',
    category: 'Surf & Meer',
    icon: '🌊',
  },
  {
    id: 3,
    title: 'Bauarbeiten & Sperrung Holzsteg Ponta da Piedade',
    desc: 'Teilstrecke des Klippenwanderwegs wegen Sanierung bis Freitag gesperrt. Umleitung über den Leuchtturmpfad.',
    level: 'medium',
    area: 'Algarve',
    time: 'vor 1 Tag',
    category: 'Infrastruktur',
    icon: '🚧',
  },
  {
    id: 4,
    title: 'Quallenvorkommen (Portugiesische Galeere) bei Carvoeiro',
    desc: 'Einzelne Sichtungen am Strand. Hundebesitzer und Barfußläufer sollten vorsichtig sein.',
    level: 'low',
    area: 'Algarve',
    time: 'vor 2 Tagen',
    category: 'Fauna',
    icon: '🪼',
  },
]

export const scams: Scam[] = [
  {
    id: 1,
    title: 'Fake Tram 28 Tickets am Praça da Figueira',
    location: 'Lissabon Baixa',
    desc: 'Personen im gelben Warnwesten-Look verkaufen ungültige Papiertickets. Nur am Schalter oder im Viva-Viagem-Automaten kaufen.',
    reports: 89,
    icon: '🚋',
  },
  {
    id: 2,
    title: 'Überteuerte Gewürzkräuter-Verkäufer im Bairro Alto',
    location: 'Lissabon Bairro Alto',
    desc: 'Aufdringliche Verkäufer bieten scheinbare Kräuter/Gewürze zu Wucherpreisen an. Ignorieren und weitergehen.',
    reports: 44,
    icon: '🌿',
  },
  {
    id: 3,
    title: 'Inoffizielle Parkplatzeinweiser (Arrumadores) bei Belém',
    location: 'Belém Monumente',
    desc: 'Männer verlangen 5–10 € für kostenfreie Parkflächen. Kein offizieller Tarif – legal ist der Automat.',
    reports: 112,
    icon: '🚗',
  },
]

export const businessCategories = [
  'Surfschule & Verleih', 'Café & Bäckerei', 'Boutique Hotel & Guesthouse',
  'Weingut & Verkostung', 'Restaurant & Taverne', 'Outdoor Guide & Trekking',
  'Yogastudio & Wellness', 'Fahrrad- & E-Bike Verleih'
]

export const productBadges = [
  {
    id: 'p1',
    name: 'Portugal Azulejo Embroidered Patch (300 DPI)',
    desc: 'Hochwertig bestickter 8cm-Aufnäher aus reißfestem Garn mit goldener Kettelrand-Gravur.',
    price: '€ 14,90',
    size: 'Ø 8.0 cm',
    type: 'Stickerei-Aufnäher',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&auto=format'
  },
  {
    id: 'p2',
    name: 'Explorer Leather Passport Cover & Laser Stamps',
    desc: 'Echtes vegetabil gegerbtes Rindsleder mit Platz für deinen Reisepass und goldgeprägtem Scratch-Symbol.',
    price: '€ 39,00',
    size: '14 x 10 cm',
    type: 'Leder-Reisepasshülle',
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=400&fit=crop&auto=format'
  },
  {
    id: 'p3',
    name: 'Scratch Gold Foil World Map (Deluxe Edition)',
    desc: 'Exklusive 80x50cm Wandkarte mit tiefschwarzem Matt-Finish und feinster abkratzbarer Goldfolie.',
    price: '€ 49,00',
    size: '80 x 50 cm',
    type: 'Rubbel-Wandkarte',
    bestseller: false,
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop&auto=format'
  }
]

export const user = {
  name: 'Andrey Test',
  handle: '@andrey.test',
  initials: 'AT',
  rank: 'Grandmaster Explorer & Founder',
  level: 25,
  xp: 24850,
  xpNext: 25000,
  joinDate: 'Januar 2024',
  bio: 'Gründer & Master Explorer. Vollzugriff auf alle 460+ Badges, weltweite Secret Spots, GPX-Routen und B2B Host-Tools.',
  hobbies: ['Surfing', 'Hundewandern', 'Kinderwagen-Klippenpfade', 'Drone Photography & Film', 'Wine Tasting & Weingut-Hopping', 'Vanlife & Camper-Ausbau', 'Sportklettern', 'Thermalquellen & Hot Springs'],
  countriesCount: 48,
  secretsCount: 120,
  badgesCount: 184,
  storiesCount: 24,
}

export type Tour = CommunityTour
