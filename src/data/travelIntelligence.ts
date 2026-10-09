/**
 * Travel Intelligence & Safety Engine v2.0
 * 
 * Umfassende Reise- und Sicherheitsdatenbank für globale Destinationen mit
 * DACH-Separation, farbkodierten Gefahrenstufen, Stadtlegenden & Vorab-Content.
 */

export type ThreatCategory = 'crime' | 'nature' | 'wildlife' | 'connectivity'
export type ThreatSeverity = 'high' | 'medium' | 'advisory'

export interface EmergencyContacts {
  universalEu?: string // 112 (Euronotruf: Polizei, Notarzt & Feuerwehr EU-weit)
  police: string
  medical: string
  fire: string
  mountainOrSea?: string
  touristPolice?: string
}

export interface CountryIntelligence {
  code: string          // DE, AT, CH, PT, ES, IT, FR, IS, TH, JP
  name: string
  region: 'DACH' | 'Südeuropa' | 'Westeuropa' | 'Nordeuropa' | 'Asien'
  flag: string
  currency: string
  emergency: EmergencyContacts
  tapWater: {
    drinkable: boolean
    rating: string
    note: string
  }
  payment: {
    cardAcceptance: 'ubiquitous' | 'common' | 'cash_preferred' | 'cash_only_small'
    headline: string
    tip: string
  }
  roadAndTransit: {
    tollRequired: boolean
    tollType?: string // z. B. "Vignette erforderlich", "Elektronische Maut (EasyToll)"
    tip: string
  }
  connectivity: {
    networkScore: 'excellent' | 'good' | 'rural_gaps'
    esimPriceFrom: string
    bestLocalCarrier: string
    roamingWarning?: string
  }
}

export interface ThreatItem {
  id: string
  countryCode: string
  area: string
  category: ThreatCategory
  severity: ThreatSeverity
  title: string
  desc: string
  advice: string
  icon: string
  timeAgo: string
  verifiedReports: number
  lat: number
  lng: number
  radiusMeters: number
  isProOnly?: boolean
  proShieldReason?: string
}

export interface CityLegend {
  id: string
  countryCode: string
  city: string
  title: string
  subtitle: string
  tag: string
  era: string
  teaser: string
  story: string
  lat: number
  lng: number
  isVipAudio: boolean
  audioDuration?: string
  audioPreviewText?: string
}

export interface CuratedSpot {
  id: string
  countryCode: string
  city: string
  title: string
  category: 'sunset' | 'food' | 'wildswim' | 'lostplace'
  categoryLabel: string
  desc: string
  insiderTip: string
  lat: number
  lng: number
  rating: number
  reviewsCount: number
  isSecret: boolean
  isProOnly?: boolean
  secretAccessCode?: string
}

// ─── LÄNDER-DATENSATZ (INKL. DACH-SEPARIERUNG) ─────────────────────────────
export const countriesIntelligence: CountryIntelligence[] = [
  {
    code: 'DE',
    name: 'Deutschland',
    region: 'DACH',
    flag: '🇩🇪',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '110',
      medical: '112',
      fire: '112',
      touristPolice: '116 117 (Ärztl. Bereitschaftsdienst)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Ausgezeichnet',
      note: 'Strengste Trinkwasserverordnung weltweit. Überall bedenkenlos genießbar.'
    },
    payment: {
      cardAcceptance: 'cash_preferred',
      headline: 'Bargeld bei Bäckern & Kiosken oft Pflicht',
      tip: 'In Großstädten geht Karte fast überall, in Traditionslokalen, Bäckereien und Biergärten aber oft "Nur Barzahlung".'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Keine Autobahnmaut für PKW. Umweltplakette (Grün) für die meisten Innenstädte zwingend nötig.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,50 / 5 GB',
      bestLocalCarrier: 'Telekom / Vodafone'
    }
  },
  {
    code: 'AT',
    name: 'Österreich',
    region: 'DACH',
    flag: '🇦🇹',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '133',
      medical: '144',
      fire: '122',
      mountainOrSea: '140 (Bergrettung Notruf)'
    },
    tapWater: {
      drinkable: true,
      rating: '100% Hochquellwasser',
      note: 'Wien & Alpenregionen werden direkt aus alpinen Quellen gespeist. Höchste Quellwasserqualität.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Berghütten oft Cash-only',
      tip: 'Auf Schutzhütten im Gebirge immer 50–100 € Notgroschen in bar dabeihaben wegen fehlendem Mobilfunk für Terminals.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Vignette Pflicht (Digital oder Klebevignette)',
      tip: 'Bereits vor der Grenze Vignette lösen. Brenner-, Tauern- und Arlbergtunnel kosten zusätzliche Streckenmaut.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,50 / 5 GB',
      bestLocalCarrier: 'A1 / Magenta'
    }
  },
  {
    code: 'CH',
    name: 'Schweiz',
    region: 'DACH',
    flag: '🇨🇭',
    currency: 'CHF (Schweizer Franken)',
    emergency: {
      universalEu: '112',
      police: '117',
      medical: '144',
      fire: '118',
      mountainOrSea: '1414 (Rega Rettungsflugwacht)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Weltspitze',
      note: 'Fast alle städtischen Brunnen liefern reines Trinkwasser (außer ausdrücklich mit "Kein Trinkwasser" markiert).'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '100% bargeldlos möglich',
      tip: 'Karten & Twint überall Standard. Preise in CHF – bei Kreditkartenzahlung immer "Abrechnung in CHF" wählen für besten Kurs.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Autobahnvignette (40 CHF Jahresvignette)',
      tip: 'Es gibt keine Tagesvignetten; nur die 40 CHF Jahresvignette (digital oder Kleber). Strikte Tempolimits (120 km/h).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,90 / 5 GB',
      bestLocalCarrier: 'Swisscom / Sunrise',
      roamingWarning: '⚠️ ACHTUNG: Schweiz ist NICHT in der EU-Roaming-Verordnung! Unbedingt vorab eSIM buchen, um Horror-Rechnungen zu vermeiden.'
    }
  },
  {
    code: 'PT',
    name: 'Portugal',
    region: 'Südeuropa',
    flag: '🇵🇹',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '112',
      medical: '112',
      fire: '112',
      touristPolice: '+351 213 421 634 (Polícia Turismo Lissabon)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Trinkbar, teils chloriert',
      note: 'In Lissabon/Porto einwandfrei. An der Algarve im Hochsommer teils Chlorgeschmack – Filter oder Quellbrunnen bevorzugt.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Multibanco vs. Visa/Mastercard',
      tip: 'Kleine Tascas akzeptieren oft nur portugiesische Multibanco-Karten. Immer 20–30 € Bargeld mitführen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Elektronische Maut (EasyToll / SCUT)',
      tip: 'Autobahnen haben keine Mauthäuschen, sondern Kameras. Mietwagen mit Maut-Transponder (Via Verde) mieten.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 3,90 / 5 GB',
      bestLocalCarrier: 'MEO / Vodafone PT'
    }
  },
  {
    code: 'ES',
    name: 'Spanien',
    region: 'Südeuropa',
    flag: '🇪🇸',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '091 (Nacional) / 062 (Guardia Civil)',
      medical: '112',
      fire: '112'
    },
    tapWater: {
      drinkable: true,
      rating: 'Regional unterschiedlich',
      note: 'Madrid hat exzellentes Bergquellwasser. Küstenregionen (Barcelona, Valencia, Andalusien) nutzen Entsalzung – trinkbar aber oft geschmacklich gewöhnungsbedürftig.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Nahezu 100% kontaktlos',
      tip: 'Selbst für ein 1,50 € Caña-Bier wird kontaktlose Kartenzahlung akzeptiert.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Die meisten Autopistas sind mittlerweile mautfrei (außer Katalonien und wenige Teilstücke).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,00 / 5 GB',
      bestLocalCarrier: 'Movistar / Orange'
    }
  },
  {
    code: 'IT',
    name: 'Italien',
    region: 'Südeuropa',
    flag: '🇮🇹',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '112 / 113',
      medical: '118',
      fire: '115'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'In Rom spenden über 2.500 antike "Nasoni"-Brunnen eiskaltes Trinkwasser kostenlos.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'POS-Pflicht per Gesetz',
      tip: 'Jeder Händler muss Kartenzahlung akzeptieren. "Coperto" (Tischgedeck 2–4 €) auf der Rechnung ist legaler Standard.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Klassische Mauthäuschen (Telepass / Ticket)',
      tip: 'VORSICHT vor ZTL (Zona a Traffico Limitato): Historische Stadtkerne sind kamerabewacht – 120 € Bußgeld pro Einfahrt!'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,20 / 5 GB',
      bestLocalCarrier: 'TIM / Vodafone IT'
    }
  },
  {
    code: 'IS',
    name: 'Island',
    region: 'Nordeuropa',
    flag: '🇮🇸',
    currency: 'ISK (Isländische Krone)',
    emergency: {
      universalEu: '112',
      police: '112',
      medical: '112',
      fire: '112',
      mountainOrSea: 'SafeTravel App Iceland'
    },
    tapWater: {
      drinkable: true,
      rating: 'Reinstes Gletscherwasser',
      note: 'Kaltes Wasser riecht nie nach Schwefel und ist das reinste Wasser der Erde. Heißes Wasser riecht geothermisch nach Schwefel.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '100% bargeldlos',
      tip: 'Selbst Toiletten auf einsamen Klippen verlangen Kartenzahlung (PIN erforderlich!). Kein Bargeld nötig.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Nur der Vaðlaheiðargöng-Tunnel im Norden ist mautpflichtig (online zahlen!). F-Roads im Hochland nur mit 4x4 erlaubt.'
    },
    connectivity: {
      networkScore: 'rural_gaps',
      esimPriceFrom: '€ 5,50 / 5 GB',
      bestLocalCarrier: 'Síminn',
      roamingWarning: 'Im Hochland kein Netz. Offline-Karten und GPS zwingend erforderlich!'
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    region: 'Asien',
    flag: '🇯🇵',
    currency: 'JPY (Japanische Yen)',
    emergency: {
      police: '110',
      medical: '119',
      fire: '119',
      touristPolice: 'JNTO Notruf: 050-3816-2720 (Englisch 24/7)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Trinkwasser von höchster Reinheit überall kostenlos im Restaurant und Hotel.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Bargeld bei Ramen-Shops & Tempeln nötig',
      tip: 'Geldautomaten in allen 7-Eleven Filialen (Seven Bank) akzeptieren ausländische Kreditkarten gebührenarm.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'ETC Mautkarte',
      tip: 'Sehr teure Autobahnmaut. Shinkansen-Schnellzüge oder Regionalbahnen (Suica / Pasmo IC-Karte) bevorzugen.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 6,00 / 10 GB',
      bestLocalCarrier: 'NTT Docomo / SoftBank'
    }
  },
  {
    code: 'FR',
    name: 'Frankreich',
    region: 'Westeuropa',
    flag: '🇫🇷',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '17 (Police Secours)',
      medical: '15 (SAMU Notarzt)',
      fire: '18 (Sapeurs-Pompiers)',
      touristPolice: '+33 1 53 71 53 71 (Préfecture de Police Paris)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Trinkwasser ist in ganz Frankreich von hoher Qualität. In Restaurants ist eine "Carafe d\'eau" kostenlos Pflicht.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Nahezu 100% kontaktlos',
      tip: 'Carte Bancaire / Visa / Mastercard wird selbst beim Baguette-Kauf ab 1 € akzeptiert. Trinkgeld wird meist in bar hinterlassen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Péage (Autobahngebühr bar/Karte)',
      tip: 'Autobahnen (Autoroutes) sind mautpflichtig. Für Umweltzonen (Paris, Lyon) ist die Crit\'Air-Vignette an der Windschutzscheibe Pflicht.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,20 / 5 GB',
      bestLocalCarrier: 'Orange / Free Mobile'
    }
  }
]

// ─── GEFAHREN-RADAR (FARBKODIERT: KRIMINALITÄT, NATUR, WILDTIERE, CONNECTIVITY) ────────
export const threatRadarItems: ThreatItem[] = [
  // ─── 🇵🇹 PORTUGAL ───
  {
    id: 'thr-01',
    countryCode: 'PT',
    area: 'Lissabon · Baixa & Tram 28',
    category: 'crime',
    severity: 'high',
    title: 'Organisierte Taschendiebe & Fake-Tickets in Tram 28',
    desc: 'Auf der überfüllten Linie 28 und am Praça da Figueira operieren Teams zu dritt (Ablenken, Greifen, Weiterreichen). Zudem verkaufen Personen in Warnwesten ungültige Papiertickets.',
    advice: 'Rucksack vor die Brust nehmen. Tickets nur an Metro-Schaltern oder im Viva-Viagem-Automaten kaufen.',
    icon: '🚋',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 142,
    lat: 38.7118,
    lng: -9.1350,
    radiusMeters: 650,
    isProOnly: false
  },
  {
    id: 'thr-pt-vip',
    countryCode: 'PT',
    area: 'Lissabon · Cais do Sodré & Intendente (nachts)',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: K.O.-Tropfen & aggressive Straßenhändler',
    desc: 'In Nebenstraßen der Pink Street und Rua Nova do Carvalho häufen sich Berichte über K.O.-Tropfen in überfüllten Bars sowie aggressive Schein-Drogenhändler (Gewürzlorbeer).',
    advice: 'Getränke niemals unbeaufsichtigt lassen. Angebote auf der Straße ignorieren und auf beleuchteten Hauptachsen bleiben.',
    icon: '🍸',
    timeAgo: 'vor 1 Stunde verifiziert',
    verifiedReports: 88,
    lat: 38.7061,
    lng: -9.1448,
    radiusMeters: 350,
    isProOnly: true,
    proShieldReason: 'Exakte No-Go-Gassen & gemeldete K.O.-Tropfen Lokale'
  },
  {
    id: 'thr-pt-surf',
    countryCode: 'PT',
    area: 'Nazaré · Praia do Norte',
    category: 'nature',
    severity: 'high',
    title: 'Monsterwellen & tückische Unterströmungen',
    desc: 'Der Tiefseegraben von Nazaré erzeugt selbst bei scheinbar ruhigem Wetter gefährliche Brandungssogwellen. Schwimmen ist lebensgefährlich.',
    advice: 'Nur vom Leuchtturm (Farol da Nazaré) beobachten. Badeverbot an der Praia do Norte strikt einhalten.',
    icon: '🌊',
    timeAgo: 'vor 3 Stunden',
    verifiedReports: 195,
    lat: 39.6053,
    lng: -9.0854,
    radiusMeters: 1200,
    isProOnly: false
  },
  {
    id: 'thr-07',
    countryCode: 'PT',
    area: 'Zentralportugal · Serra da Estrela & Coimbra',
    category: 'nature',
    severity: 'medium',
    title: 'Waldbrand-Saison (Risco de Incêndio Rural)',
    desc: 'Trockene Eukalyptuswälder entzünden sich bei Wind extrem schnell. Zufahrtsstraßen zu einsamen Badegumpen können binnen Minuten abgeschnitten werden.',
    advice: 'App "Fogos.pt" installieren. Bei Rauchgeruch Schluchten sofort bergab verlassen.',
    icon: '🔥',
    timeAgo: 'vor 6 Stunden',
    verifiedReports: 53,
    lat: 40.3218,
    lng: -7.6162,
    radiusMeters: 15000,
    isProOnly: false
  },
  {
    id: 'thr-08',
    countryCode: 'PT',
    area: 'Algarve · Strände um Lagos & Sagres',
    category: 'wildlife',
    severity: 'medium',
    title: 'Portugiesische Galeere (Caravela Portuguesa)',
    desc: 'Blau schimmernde Quallen mit bis zu 20 Meter langen Tentakeln. Das Nesselgift führt zu extremen Schmerzen und Kreislaufschock, auch bei toten Tieren am Sand.',
    advice: 'Niemals blaue Blasen am Spülsaum berühren. Bei Kontakt: Meerwasser (kein Süßwasser!), Essig und Notarzt.',
    icon: '🪼',
    timeAgo: 'vor 1 Tag',
    verifiedReports: 38,
    lat: 37.0988,
    lng: -8.6732,
    radiusMeters: 4500,
    isProOnly: false
  },

  // ─── 🇪🇸 SPANIEN ───
  {
    id: 'thr-02',
    countryCode: 'ES',
    area: 'Barcelona · Las Ramblas & Gotico',
    category: 'crime',
    severity: 'high',
    title: 'Taschendiebstahl-Hotspot & "Nelken-Frauen" Trick',
    desc: 'Personen bieten scheinbar kostenlose Rosmarinzweige oder Nelken an, verwickeln in Gespräche und fordern aggressiv 20 €, während ein Komplize Taschen abtastet.',
    advice: 'Nichts annehmen, Hände in den eigenen Taschen lassen und zügig weitergehen.',
    icon: '🌹',
    timeAgo: 'vor 4 Stunden aktualisiert',
    verifiedReports: 218,
    lat: 41.3818,
    lng: 2.1734,
    radiusMeters: 750,
    isProOnly: false
  },
  {
    id: 'thr-es-vip',
    countryCode: 'ES',
    area: 'Barcelona · El Raval Nebenstraßen nachts',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: Falsche Zivilpolizisten & Raub-Gassen',
    desc: 'In dunklen Winkeln des Raval fordern Täter mit gefälschten Polizeimarken die Geldbörse zur "Drogenkontrolle". Bei Weigerung droht Einschüchterung.',
    advice: 'Echte Guardia Civil/Mossos verlangen auf der Straße niemals Bargeldeinsicht. Darauf bestehen, zur nächsten Polizeiwache zu gehen.',
    icon: '👮‍♂️',
    timeAgo: 'vor 3 Stunden verifiziert',
    verifiedReports: 94,
    lat: 41.3787,
    lng: 2.1691,
    radiusMeters: 400,
    isProOnly: true,
    proShieldReason: 'Gefälschte Zivilpolizisten-Hotspots & No-Go-Gassen'
  },
  {
    id: 'thr-es-madrid',
    countryCode: 'ES',
    area: 'Madrid · Puerta del Sol & Gran Vía',
    category: 'crime',
    severity: 'medium',
    title: 'Metro-Blockade & Gruppen-Ablenkung',
    desc: 'An Drehkreuzen und Rolltreppen stoppt plötzlich jemand abrupt vor dir, während von hinten der Rucksack geöffnet wird.',
    advice: 'Wertsachen in die vorderen Hosentaschen oder unter die Jacke stecken.',
    icon: '🚇',
    timeAgo: 'vor 1 Tag',
    verifiedReports: 67,
    lat: 40.4168,
    lng: -3.7038,
    radiusMeters: 500,
    isProOnly: false
  },

  // ─── 🇫🇷 FRANKREICH ───
  {
    id: 'thr-fr-01',
    countryCode: 'FR',
    area: 'Paris · Montmartre & Treppen vor Sacré-Cœur',
    category: 'crime',
    severity: 'high',
    title: 'Das "Freundschaftsarmband"-Kartell',
    desc: 'Männergruppen greifen Touristen an den Handgelenken, flechten blitzschnell Wollfäden um die Finger und fordern mit Nachdruck 20–50 €.',
    advice: 'Arme eng am Körper halten, Augenkontakt meiden, Treppen zügig passieren oder die Seilbahn (Funiculaire) nutzen.',
    icon: '🧵',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 176,
    lat: 48.8867,
    lng: 2.3431,
    radiusMeters: 350,
    isProOnly: false
  },
  {
    id: 'thr-fr-vip',
    countryCode: 'FR',
    area: 'Paris · Gare du Nord & Châtelet-Les Halles (nach 22 Uhr)',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: Smartphone-Reißer & Brennpunkt-Korridor',
    desc: 'Im unterirdischen Labyrinth von Châtelet und rund um den Gare du Nord lauern Gruppen auf unaufmerksame Touristen mit Smartphones in der Hand vor schließenden Zugtüren.',
    advice: 'Smartphone in der Metro vor Haltestellen in die Tasche stecken. Nur die Hauptausgänge nutzen.',
    icon: '📱',
    timeAgo: 'vor 4 Stunden verifiziert',
    verifiedReports: 112,
    lat: 48.8809,
    lng: 2.3553,
    radiusMeters: 550,
    isProOnly: true,
    proShieldReason: 'GPS-Mikroradius des Kriminalitäts-Brennpunkts mit sicheren Ausgängen'
  },
  {
    id: 'thr-fr-cassis',
    countryCode: 'FR',
    area: 'Côte d\'Azur · Calanques de Cassis',
    category: 'nature',
    severity: 'medium',
    title: 'Steinschlag & Mistral-Sturmböen auf Klippenpfaden',
    desc: 'Heftige Mistralwinde können Wanderer auf den exponierten Felskämmen aus dem Gleichgewicht bringen. Häufige Waldbrand-Sperrungen im Hochsommer.',
    advice: 'Website des Parc National des Calanques vor dem Aufbruch auf Zugangssperren prüfen.',
    icon: '💨',
    timeAgo: 'vor 5 Stunden',
    verifiedReports: 41,
    lat: 43.2130,
    lng: 5.5320,
    radiusMeters: 6000,
    isProOnly: false
  },

  // ─── 🇮🇹 ITALIEN ───
  {
    id: 'thr-03',
    countryCode: 'IT',
    area: 'Rom · Hauptbahnhof Termini & Kolosseum',
    category: 'crime',
    severity: 'medium',
    title: 'Gladiatoren-Fotos & Fake-Ticket-Verkäufer',
    desc: 'Verkleidete Darsteller drängen sich ungefragt auf Selfies und verlangen danach handgreiflich 30–50 € pro Foto.',
    advice: 'Klare Handbewegung ("No, grazie") und keine Fotos mit Straßenfiguren machen.',
    icon: '🛡️',
    timeAgo: 'vor 1 Tag',
    verifiedReports: 89,
    lat: 41.8902,
    lng: 12.4922,
    radiusMeters: 600,
    isProOnly: false
  },
  {
    id: 'thr-it-vip',
    countryCode: 'IT',
    area: 'Neapel · Spaccanapoli & Quartieri Spagnoli',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: Roller-Kettenreißer & Uhren-Scouts',
    desc: 'Zweier-Teams auf Motorrollern kundschaften gezielt Luxusuhren, Kameras und offene Handtaschen aus und entreißen sie im Vorbeifahren.',
    advice: 'Keine Uhren oder teuren Schmuck sichtbar tragen. Taschen stets zur Häuserwand hin tragen, niemals zur Straßenseite.',
    icon: '🛵',
    timeAgo: 'vor 2 Stunden verifiziert',
    verifiedReports: 135,
    lat: 40.8518,
    lng: 14.2506,
    radiusMeters: 450,
    isProOnly: true,
    proShieldReason: 'Systematische Luxusuhren-Scouts & Roller-Greifkorridore'
  },
  {
    id: 'thr-it-venice',
    countryCode: 'IT',
    area: 'Venedig · Markusplatz & Rialto',
    category: 'crime',
    severity: 'advisory',
    title: 'Gastro-Wucher & Tauben-Fütterungsverbot',
    desc: 'Sitzen an Cafés auf dem Markusplatz kostet oft 15 € Musikzuschlag pro Person. Taubenfüttern wird von der Polizei mit bis zu 500 € Bußgeld geahndet.',
    advice: 'Preiskarte vor dem Bestellen prüfen. Tauben nicht füttern (Überwachung durch Zivilstreifen).',
    icon: '🕊️',
    timeAgo: 'vor 3 Tagen',
    verifiedReports: 78,
    lat: 45.4340,
    lng: 12.3380,
    radiusMeters: 800,
    isProOnly: false
  },

  // ─── 🇩🇪 DEUTSCHLAND ───
  {
    id: 'thr-04',
    countryCode: 'DE',
    area: 'Frankfurt & Berlin · Hauptbahnhof Vorplätze',
    category: 'crime',
    severity: 'medium',
    title: 'Hütchenspieler & Koffer-Ablenkungstricks',
    desc: 'Spiele mit Schachteln oder gezieltes Verschütten von Kaffee auf Kleidung, um beim "Helfen" das Smartphone zu stehlen.',
    advice: 'Niemals bei Straßenwetten stehenbleiben. Bei Körperkontakt sofort Abstand fordern.',
    icon: '📦',
    timeAgo: 'vor 2 Tagen',
    verifiedReports: 64,
    lat: 50.1072,
    lng: 8.6638,
    radiusMeters: 400,
    isProOnly: false
  },
  {
    id: 'thr-de-vip',
    countryCode: 'DE',
    area: 'Frankfurt · Taunusstraße & Elbestraße (Bahnhofsviertel)',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: Aggressions-Brennpunkt der offenen Szene',
    desc: 'Zwischen Taunusstraße und Kaiserstraße kommt es nachts vermehrt zu aggressiver Bettelei, offenen Drogenkonsum und Handtaschenraub.',
    advice: 'Nachts die Taunusstraße meiden; stattdessen die breite Kaiserstraße oder Münchener Straße nutzen.',
    icon: '⚠️',
    timeAgo: 'vor 1 Stunde verifiziert',
    verifiedReports: 82,
    lat: 50.1085,
    lng: 8.6675,
    radiusMeters: 250,
    isProOnly: true,
    proShieldReason: 'Drogenszene-Gefahrenkarte & sichere Gehweg-Alternativen'
  },
  {
    id: 'thr-10',
    countryCode: 'DE',
    area: 'Bayern & Schwarzwald · Wald- und Wiesenränder',
    category: 'wildlife',
    severity: 'advisory',
    title: 'Hohe Zecken-Aktivität (FSME & Borreliose Risikogebiet)',
    desc: 'Im Unterholz und hohem Gras lauern Zecken. Süddeutschland ist offizielles Risikogebiet für Frühsommer-Meningoenzephalitis.',
    advice: 'Lange Hosen in die Socken stecken, Repellent verwenden, abends Körper absuchen.',
    icon: '🦟',
    timeAgo: 'vor 2 Tagen',
    verifiedReports: 45,
    lat: 48.1351,
    lng: 11.5820,
    radiusMeters: 25000,
    isProOnly: false
  },

  // ─── 🇦🇹 ÖSTERREICH ───
  {
    id: 'thr-06',
    countryCode: 'AT',
    area: 'Tirol & Vorarlberg · Alpine Höhenlagen (> 2.000m)',
    category: 'nature',
    severity: 'high',
    title: 'Lawinenwarnstufe 3 & plötzlicher Föhn-Wettersturz',
    desc: 'Starker Föhnwind führt zu Triebschneeansammlungen an Nordhängen. Nachmittags Gewitterbildung mit Temperatursturz um bis zu 15°C.',
    advice: 'Lawinenwarndienst Tirol vor jeder Tour checken. Notfallausrüstung (LVS, Sonde, Schaufel) und Biwaksack Pflicht.',
    icon: '❄️',
    timeAgo: 'vor 5 Stunden aktualisiert',
    verifiedReports: 47,
    lat: 47.2692,
    lng: 11.4041,
    radiusMeters: 12000,
    isProOnly: false
  },
  {
    id: 'thr-at-vip',
    countryCode: 'AT',
    area: 'Wien · Praterstern & Gumpendorfer Straße (nachts)',
    category: 'crime',
    severity: 'medium',
    title: '🔒 VIP Shield: Drogen- & Alkohol-Hotspots im U-Bahn-Bereich',
    desc: 'Zu vorgerückter Stunde kommt es an den Stationen Praterstern und Gumpendorfer Straße gehäuft zu Pöbeleien und Diebstählen.',
    advice: 'Im U-Bahn-Bereich die videoüberwachten Hauptausgänge nutzen und Gruppen meiden.',
    icon: '🚨',
    timeAgo: 'vor 3 Stunden verifiziert',
    verifiedReports: 41,
    lat: 48.2190,
    lng: 16.3920,
    radiusMeters: 350,
    isProOnly: true,
    proShieldReason: 'Nacht-Gefahrenzonen der Wiener U-Bahn mit Umgehungswegen'
  },
  {
    id: 'thr-09',
    countryCode: 'AT',
    area: 'Salzburger Land · Almweiden & Wanderpfade',
    category: 'wildlife',
    severity: 'medium',
    title: 'Mutterkuh-Angriffe auf Wanderer mit Hunden',
    desc: 'Kühe mit Jungkälbern verteidigen ihren Nachwuchs instinktiv gegen Hunde. Mehrere Zwischenfälle auf Weidegattern.',
    advice: 'Großen Bogen um Herden schlagen. Wenn eine Kuh angreift: Hund SOFORT von der Leine lassen (er ist schneller).',
    icon: '🐄',
    timeAgo: 'vor 3 Tagen',
    verifiedReports: 22,
    lat: 47.8095,
    lng: 13.0550,
    radiusMeters: 6000,
    isProOnly: false
  },

  // ─── 🇨🇭 SCHWEIZ ───
  {
    id: 'thr-12',
    countryCode: 'CH',
    area: 'Schweiz · Gesamtes Staatsgebiet',
    category: 'connectivity',
    severity: 'high',
    title: 'Achtung Kostenfalle: Schweiz ist KEINE EU-Roaming-Zone',
    desc: 'Wer mit einem deutschen oder EU-Handyvertrag die Grenze passiert, zahlt ohne Roaming-Pass bis zu 12 € pro Megabyte. 1x Google Maps kann 80 € kosten.',
    advice: 'Vor der Grenze Daten-Roaming ausschalten oder lokale eSIM mit Rabattcode SCRATCH10 buchen.',
    icon: '📶',
    timeAgo: 'Dauertipp · vor 1 Stunde geprüft',
    verifiedReports: 490,
    lat: 46.8182,
    lng: 8.2275,
    radiusMeters: 45000,
    isProOnly: false
  },
  {
    id: 'thr-ch-vip',
    countryCode: 'CH',
    area: 'Zermatt · Gornergrat & Theodulgletscher',
    category: 'nature',
    severity: 'high',
    title: '🔒 VIP Shield: Versteckte Gletscherspalten abseits der Markierung',
    desc: 'Im Gletschervorfeld brechen nach sommerlichen Hitzeperioden Schneebrücken über tiefen Gletscherspalten unvermittelt ein.',
    advice: 'Niemals ohne Seilschaft und Bergführer die markierten Wege auf dem Gletscher verlassen.',
    icon: '🏔️',
    timeAgo: 'vor 2 Stunden verifiziert',
    verifiedReports: 36,
    lat: 45.9763,
    lng: 7.7491,
    radiusMeters: 4000,
    isProOnly: true,
    proShieldReason: 'Aktuelle alpine Spaltenzonen & Not-Biwak-GPS'
  },

  // ─── 🇮🇸 ISLAND ───
  {
    id: 'thr-05',
    countryCode: 'IS',
    area: 'Island · Reynisfjara Black Beach',
    category: 'nature',
    severity: 'high',
    title: 'Tödliche "Sneaker Waves" (Mammutwellen)',
    desc: 'Unberechenbare Riesenwellen schlagen unvermittelt 20 Meter weiter an den Strand als die vorherigen und reißen Personen mit extremer Wucht in den eiskalten Atlantik. Mehrere tödliche Unfälle jährlich.',
    advice: 'Niemals dem Meer den Rücken zudrehen! Mindestens 30 Meter Abstand zur Brandungslinie halten.',
    icon: '🌊',
    timeAgo: 'Dauerwarnung · vor 1 Stunde geprüft',
    verifiedReports: 310,
    lat: 63.4044,
    lng: -19.0494,
    radiusMeters: 800,
    isProOnly: false
  },
  {
    id: 'thr-is-vip',
    countryCode: 'IS',
    area: 'Island · Hochland F-Roads Flussquerungen',
    category: 'nature',
    severity: 'high',
    title: '🔒 VIP Shield: Tödliche Gletscherfluss-Furten (Krossá & Fjallabak)',
    desc: 'Gletscherflüsse schwellen an warmen Nachmittagen extrem an. Ungeübte Autofahrer ertränken Mietwagen im tiefen Schlammbett.',
    advice: 'Nur morgens queren. Vorher zu Fuß waten (mit Schuhen!) und die Strömung testen.',
    icon: '🚙',
    timeAgo: 'vor 3 Stunden verifiziert',
    verifiedReports: 58,
    lat: 64.9263,
    lng: -18.2155,
    radiusMeters: 18000,
    isProOnly: true,
    proShieldReason: 'Echtzeit-Wasserpegel für Gletscherfluss-Furten & Rettungspunkte'
  },

  // ─── 🇯🇵 JAPAN ───
  {
    id: 'thr-11',
    countryCode: 'JP',
    area: 'Nara Park · Tempelbezirk',
    category: 'wildlife',
    severity: 'advisory',
    title: 'Aufdringliche Nara-Hirsche (Shika)',
    desc: 'Zutrauliche Hirsche verbeugen sich für Cracker, beißen aber in Taschen, Kleidung und fressen Geldscheine oder Reisepässe.',
    advice: 'Taschen geschlossen halten, keine Papiere offen herumtragen. Leere Hände flach vorzeigen.',
    icon: '🦌',
    timeAgo: 'vor 4 Tagen',
    verifiedReports: 77,
    lat: 34.6850,
    lng: 135.8430,
    radiusMeters: 1000,
    isProOnly: false
  },
  {
    id: 'thr-jp-vip',
    countryCode: 'JP',
    area: 'Tokio · Shinjuku Kabukicho',
    category: 'crime',
    severity: 'high',
    title: '🔒 VIP Shield: "Bottakuri" Abzock-Bars & Spiked Drinks',
    desc: 'Schlepper auf der Straße locken mit "All-you-can-drink für 2.000 Yen". Später wird eine erpresste Rechnung über mehrere tausend Euro vorgelegt.',
    advice: 'Niemals Straßenwerbern in Bars oder Clubs folgen. Nur Lokale mit sichtbaren Festpreisen betreten.',
    icon: '🍸',
    timeAgo: 'vor 2 Stunden verifiziert',
    verifiedReports: 129,
    lat: 35.6938,
    lng: 139.7034,
    radiusMeters: 350,
    isProOnly: true,
    proShieldReason: 'Schwarze Liste von Lockvogel-Bars mit 5.000 € Zwangsrechnungen'
  }
]

// ─── STADT-LEGENDEN & GEHEIMNISSE (DER GUIDE-MODUS) ────────────────────────
export const cityLegends: CityLegend[] = [
  {
    id: 'leg-01',
    countryCode: 'PT',
    city: 'Lissabon',
    title: 'Die ewigen Raben des Heiligen Vinzenz',
    subtitle: 'Warum zwei Vögel das offizielle Wappen der Stadt zieren',
    tag: 'Mittelalter & Mystik',
    era: 'Jahr 1173 n. Chr.',
    teaser: 'Als das Schiff mit den Gebeinen des Schutzpatrons São Vicente die Tejo-Mündung erreichte, wichen zwei schwarze Raben nicht von seiner Seite. Noch heute spürt man ihren Hauch über der Alfama.',
    story: 'König Afonso Henriques ließ den Leichnam des Märtyrers Vinzenz von Sagres nach Lissabon überführen. Der Legende nach bewachten zwei treue Raben den Sarg während der gesamten Schiffsreise gegen Piraten und Unwetter. Als das Schiff am Hafen anlegte, ließen sich die Raben im Turm der Kathedrale Sé nieder. Bis Mitte des 20. Jahrhunderts hielt der Klerus lebendige Raben im Domkreuzgang. Locals flüstern: Stirbt der letzte Rabe aus Alfamas Gassen, wird der Tejo über seine Ufer treten.',
    lat: 38.7099,
    lng: -9.1326,
    isVipAudio: true,
    audioDuration: '4:20 min',
    audioPreviewText: 'Höre den vollständigen Audio-Guide mit Soundkulisse aus Fado-Gitarre und Hafenklängen im VIP Explorer Pass.'
  },
  {
    id: 'leg-02',
    countryCode: 'AT',
    city: 'Wien',
    title: 'Der Basilisk in der Schönlaterngasse',
    subtitle: 'Das tödliche Ungeheuer aus dem Brunnen',
    tag: 'Wiener Sagen',
    era: 'Jahr 1212 n. Chr.',
    teaser: 'Ein Hahnenei, ausgebrütet von einer Kröte, verborgen im stockfinsteren Brunnenschacht. Wer hineinsah, erstarrte zu Stein – bis ein Bäckerlehrling eine Spiegelfalle baute.',
    story: 'Im Haus Schönlaterngasse 7 bemerkte eine Magd fauligen Gestank aus der Tiefe des Ziehbrunnens. Als der Geselle hinabstieg, fiel er ohnmächtig um: Im Schlamm lauerte der Basilisk, ein Ungeheuer mit Krötenleib, Hahnenkamm und Schlangenschwanz, dessen giftiger Blick sofort tötete. Ein schlauer Lehrling erinnerte sich an alte Alchemisten-Schriften. Er ließ sich mit einem großen Spiegel hinab: Als das Monster sein eigenes schreckliches Antlitz erblickte, barst es vor Wut und Grauen in tausend Stücke. Der Brunnen wurde zugemauert; ein Fresko erinnert bis heute an der Hauswand daran.',
    lat: 48.2096,
    lng: 16.3778,
    isVipAudio: true,
    audioDuration: '5:15 min',
    audioPreviewText: 'Der exklusive Audio-Rundgang führt dich nachts durch die verwinkelten Gassen des 1. Bezirks mit Geheimtipps zu Kellergewölben.'
  },
  {
    id: 'leg-03',
    countryCode: 'DE',
    city: 'München',
    title: 'Der schwarze Tritt des Teufels in der Frauenkirche',
    subtitle: 'Warum in der Kathedrale immer ein kühler Wind weht',
    tag: 'Bayerische Sagen',
    era: 'Jahr 1488 n. Chr.',
    teaser: 'Baumeister Jörg von Ganghofer wettete mit dem Teufel um seine Seele: Eine Kathedrale ohne ein einziges Fenster zu errichten. Wie er den Teufel austrickste, sieht man noch heute im Eingangsbereich.',
    story: 'Der Teufel höhnte über den Bau einer Kirche und versprach dem Architekten Hilfe – unter der Bedingung, dass kein Fenster sichtbar sein dürfe. Als der Bau vollendet war, führte Ganghofer den Teufel an eine exakte Stelle in der Vorhalle. Von dort verdeckten die massiven Säulenreihen alle Seitenfenster, und das hohe Chorfenster war von einem riesigen Altar verdeckt. Der Teufel sah nur Säulen und kein einziges Fenster. Vor Zorn stampfte er so gewaltig mit seinem Pferdefuß auf den Kirchenboden, dass sich ein schwarzer Fußabdruck in die Steinplatte brannte. Als er heraustrat und den Schwindel von außen sah, fuhr er als tobender Wind um die Türme – und dieser Wind weht bis zum heutigen Tag.',
    lat: 48.1386,
    lng: 11.5732,
    isVipAudio: false
  },
  {
    id: 'leg-04',
    countryCode: 'CH',
    city: 'Zürich',
    title: 'Die Geheimgänge der Wasserkirche & Grossmünster',
    subtitle: 'Die Märtyrer Felix und Regula und ihr kopfloser Marsch',
    tag: 'Zürcher Historie',
    era: 'Jahr 302 n. Chr.',
    teaser: 'Nach ihrer Hinrichtung auf einer kleinen Flussinsel nahmen die Geschwister Felix und Regula ihre eigenen Köpfe in die Arme und schritten 40 Ellen den Hügel hinauf.',
    story: 'Auf einer kleinen Insel in der Limmat (dem Fundament der heutigen Wasserkirche) wurden die römischen Christen Felix und Regula enthauptet. Der Legende nach nahmen die Enthaupteten ihre Köpfe unter den Arm, gingen betend 40 Schritte den Hügel hinauf und legten sich dort zur ewigen Ruhe. An genau dieser Stelle ließ Karl der Große das Grossmünster errichten, nachdem sein Pferd vor ihren Gräbern auf die Knie gesunken war. Noch heute existiert eine unterirdische Krypta mit mittelalterlichen Wandmalereien, die nur wenigen Besuchern bekannt ist.',
    lat: 47.3697,
    lng: 8.5436,
    isVipAudio: true,
    audioDuration: '3:50 min'
  },
  {
    id: 'leg-05',
    countryCode: 'IS',
    city: 'Reykjavik & Borgarfjörður',
    title: 'Das unsichtbare Volk der Elfen (Huldufólk)',
    subtitle: 'Warum Straßenplaner Felsen umfahren statt sie zu sprengen',
    tag: 'Isländische Mythologie',
    era: 'Gegenwart & Urzeit',
    teaser: 'Mehr als die Hälfte aller Isländer schließt die Existenz des Huldufólk nicht aus. Wenn Baumaschinen an Felsen rätselhafte Defekte erleiden, wird der Straßenverlauf geändert.',
    story: 'Das Huldufólk lebt parallel zu den Menschen in verzauberten Basaltfelsen. Sie sind friedlich, solange ihre Heimstätten nicht gestört werden. In den 1970er Jahren versuchte die Straßenbaubehörde Vegagerðin, bei Kópavogur einen markanten Hügel namens Álfhóll abzutragen. Drei Bulldozer fielen binnen 48 Stunden unerklärlich aus, Bohrer brachen entzwei und Arbeiter erkrankten. Die Bauleitung kapitulierte, die Straße wurde im Bogen um den Felsen herumgeführt. Heute hat Island offizielle Elfenbeauftragte, die vor Großprojekten das Einverständnis der Naturwesen prüfen.',
    lat: 64.1466,
    lng: -21.9426,
    isVipAudio: true,
    audioDuration: '6:10 min'
  }
]

// ─── 50+ KURATIERTE VORAB-SPOTS (KEIN KALTSTART MEHR) ─────────────────────
export const curatedSpotsSeed: CuratedSpot[] = [
  // 🇵🇹 PORTUGAL
  {
    id: 'spot-pt-01',
    countryCode: 'PT',
    city: 'Sintra',
    title: 'Praia da Ursa Klippenpfad',
    category: 'sunset',
    categoryLabel: '🌅 Wilder Sunset',
    desc: 'Der westlichste wilde Kieselstrand Europas mit zwei markanten Felsnadeln im Atlantik. Atemberaubendes Lichtspiel bei Sonnenuntergang.',
    insiderTip: 'Nur mit festem Schuhwerk begehbar (steiler Geröllpfad, 25 min Abstieg). Kein Kiosk, Trinkwasser mitnehmen!',
    lat: 38.7906,
    lng: -9.4922,
    rating: 4.9,
    reviewsCount: 312,
    isSecret: true
  },
  {
    id: 'spot-pt-02',
    countryCode: 'PT',
    city: 'Lissabon',
    title: 'Taberna do Salgadeiro (Alfama)',
    category: 'food',
    categoryLabel: '🥐 Secret Food',
    desc: 'Verstecktes Familienlokal hinter einer unscheinbaren Holztür. Keine Speisekarte – gegessen wird, was die Fischer morgens fingen.',
    insiderTip: 'Klopfe zweimal. Frage nach dem Arroz de Polvo (Oktopus-Reis) und dem hausgemachten Ginjinha-Likör.',
    lat: 38.7121,
    lng: -9.1302,
    rating: 4.8,
    reviewsCount: 88,
    isSecret: true
  },
  {
    id: 'spot-pt-03',
    countryCode: 'PT',
    city: 'Algarve',
    title: 'Praia do Vale dos Homens',
    category: 'wildswim',
    categoryLabel: '🏖️ Wild Swim',
    desc: 'Natürliche Gezeitenpools zwischen Schieferfelsen an der Costa Vicentina. Bei Ebbe entstehen warme Naturbecken ohne Brandung.',
    insiderTip: 'Unbedingt den Gezeitenkalender prüfen: Perfekt 1 Stunde vor bis 1 Stunde nach absolutem Niedrigwasser.',
    lat: 37.3824,
    lng: -8.8475,
    rating: 4.9,
    reviewsCount: 145,
    isSecret: true
  },

  // 🇩🇪 DEUTSCHLAND
  {
    id: 'spot-de-01',
    countryCode: 'DE',
    city: 'Sächsische Schweiz',
    title: 'Kuhstall Felsentor & Himmelsleiter',
    category: 'sunset',
    categoryLabel: '🌅 Panoramablick',
    desc: '11 Meter hohes Naturfelsentor tief im Elbsandsteingebirge mit einer schmalen Steintreppe durch eine Felsspalte zum Plateau.',
    insiderTip: 'Früh morgens um 6:30 Uhr kommen, wenn die Morgennebelschwaden durch das Elbtal ziehen.',
    lat: 50.9255,
    lng: 14.2562,
    rating: 4.8,
    reviewsCount: 220,
    isSecret: true
  },
  {
    id: 'spot-de-02',
    countryCode: 'DE',
    city: 'Berlin',
    title: 'Teufelsberg Spionagestation & Freiluft-Galerie',
    category: 'lostplace',
    categoryLabel: '🥾 Lost Place',
    desc: 'Ehemalige Abhörstation der US-Streitkräfte aus dem Kalten Krieg auf einem Trümmerberg mit gigantischen Radomen und Akustik-Echo.',
    insiderTip: 'Taschenlampe einstecken für den Wendeltreppenaufgang in die oberste Kuppel.',
    lat: 52.4975,
    lng: 13.2412,
    rating: 4.7,
    reviewsCount: 540,
    isSecret: false
  },
  {
    id: 'spot-de-03',
    countryCode: 'DE',
    city: 'München',
    title: 'Flaucher Naturkieselbucht',
    category: 'wildswim',
    categoryLabel: '🏖️ Wild Swim',
    desc: 'Verzweigtes Auenland der Isar mit Sandbänken und Kiesinseln mitten in der Stadt für ein erfrischendes Gebirgsbad.',
    insiderTip: 'Fahrrad mieten und weiter südlich hinter die Marienklause fahren – dort ist es herrlich einsam.',
    lat: 48.1098,
    lng: 11.5583,
    rating: 4.8,
    reviewsCount: 310,
    isSecret: false
  },

  // 🇦🇹 ÖSTERREICH
  {
    id: 'spot-at-01',
    countryCode: 'AT',
    city: 'Salzkammergut',
    title: 'Toplitzsee Klippengrotte',
    category: 'lostplace',
    categoryLabel: '🥾 Geheimer Bergsee',
    desc: 'Mystischer, über 100 Meter tiefer Fjordsee ohne Sauerstoff in der Tiefe. Schauplatz geheimer Marineversuche im Zweiten Weltkrieg.',
    insiderTip: 'Plätte (traditionelles Holzboot) zur Kammersee-Quelle mieten. Kein Handyempfang – purer Frieden.',
    lat: 47.6525,
    lng: 13.9288,
    rating: 4.9,
    reviewsCount: 160,
    isSecret: true
  },
  {
    id: 'spot-at-02',
    countryCode: 'AT',
    city: 'Wien',
    title: 'Hauerkapelle & Buschenschank am Nussberg',
    category: 'food',
    categoryLabel: '🥐 Wein & Schmankerl',
    desc: 'Mitten in den Wiener Weinbergen sitzt man auf Holzbänken mit Blick über die gesamte Donau-Metropole bei frischem Grünem Veltliner.',
    insiderTip: 'Nur an Wochenenden bei schönem Wetter geöffnet (Aussteck-Fahne beachten). Sonnenuntergang hier ist Pflicht.',
    lat: 48.2684,
    lng: 16.3533,
    rating: 4.9,
    reviewsCount: 420,
    isSecret: false
  },

  // 🇨🇭 SCHWEIZ
  {
    id: 'spot-ch-01',
    countryCode: 'CH',
    city: 'Tessin (Ticino)',
    title: 'Ponte dei Salti & Smaragdtöpfe im Verzascatal',
    category: 'wildswim',
    categoryLabel: '🏖️ Wild Swim & Felsenpool',
    desc: 'Kristallklares, smaragdgrünes Wasser strömt über jahrtausendealte, rundgeschliffene Granitfelsen. Eines der schönsten Naturschwimmbäder der Alpen.',
    insiderTip: 'Wassertemperatur ca. 14–17°C – herrlich im Hochsommer! Vorsicht bei Strömung nach Regenfällen.',
    lat: 46.2592,
    lng: 8.8358,
    rating: 4.9,
    reviewsCount: 512,
    isSecret: false
  },
  {
    id: 'spot-ch-02',
    countryCode: 'CH',
    city: 'Appenzell',
    title: 'Berggasthaus Aescher-Wildkirchli',
    category: 'sunset',
    categoryLabel: '🌅 Klippenarchitektur',
    desc: '170 Jahre altes Holzgasthaus, direkt in eine senkrechte 100-Meter-Kalksteinwand unterhalb der prähistorischen Wildkirchli-Höhlen gebaut.',
    insiderTip: 'Zu Fuß über den Pfad von der Ebenalp-Bahn absteigen (15 min). Legendärer Appenzeller Biberli-Kuchen!',
    lat: 47.2838,
    lng: 9.4144,
    rating: 4.9,
    reviewsCount: 890,
    isSecret: false
  },

  // 🇮🇸 ISLAND
  {
    id: 'spot-is-01',
    countryCode: 'IS',
    city: 'Südisland',
    title: 'Seljavallalaug Thermalfelsenbecken',
    category: 'wildswim',
    categoryLabel: '🏖️ Natürliche Thermalquelle',
    desc: 'Islands ältester erhaltener Pool (1923), geschützt in einem einsamen Tal unterhalb des Eyjafjallajökull-Vulkans. Gespeist von natürlichem Heißwasser.',
    insiderTip: '20 Minuten Wanderung durch das Flussbett ab dem Parkplatz. Keine Duschen oder Schließfächer – ursprüngliches Naturerlebnis.',
    lat: 63.5656,
    lng: -19.6075,
    rating: 4.8,
    reviewsCount: 670,
    isSecret: true
  },

  // 🇫🇷 FRANKREICH
  {
    id: 'spot-fr-01',
    countryCode: 'FR',
    city: 'Paris',
    title: 'Lavomatic Geheime Speakeasy Bar',
    category: 'food',
    categoryLabel: '🍸 Secret Speakeasy',
    desc: 'Tarnung als gewöhnlicher Waschsalon im 10. Arrondissement. Hinter einer echten Waschmaschinentür verbirgt sich eine bunte Cocktail-Lounge mit Schaukeln.',
    insiderTip: 'Waschsalon betreten, zur Waschmaschine Nr. 4 gehen und den verborgenen Entriegelungsknopf drücken.',
    lat: 48.8698,
    lng: 2.3629,
    rating: 4.9,
    reviewsCount: 380,
    isSecret: true,
    isProOnly: true,
    secretAccessCode: 'Waschmaschine Nr. 4 · Hebel links hinter der Trommel drücken'
  },
  {
    id: 'spot-fr-02',
    countryCode: 'FR',
    city: 'Marseille & Cassis',
    title: 'Calanque d\'En-Vau Fjordbucht',
    category: 'wildswim',
    categoryLabel: '🏖️ Türkiser Meeresfjord',
    desc: 'Atemberaubende Bucht mit türkisblauem Wasser, eingerahmt von senkrecht aufsteigenden weißen Kalksteinnadeln.',
    insiderTip: 'Nur zu Fuß (1h Wanderung) oder per Kajak erreichbar. Keine Bewirtung – 2 Liter Wasser pro Person einpacken!',
    lat: 43.2025,
    lng: 5.4981,
    rating: 4.9,
    reviewsCount: 810,
    isSecret: true,
    isProOnly: false
  },

  // 🇮🇹 ITALIEN
  {
    id: 'spot-it-01',
    countryCode: 'IT',
    city: 'Amalfiküste',
    title: 'Fiordo di Furore Naturhafen',
    category: 'wildswim',
    categoryLabel: '🏖️ Verborgener Fjord',
    desc: 'Schmale Schlucht, die tief ins Festland schneidet. Eine historische Bogenbrücke überspannt den Strand in 30 Metern Höhe.',
    insiderTip: 'Frühmorgens vor 9 Uhr anreisen, bevor die Touristenbusse auf der Küstenstraße halten. Der Abstieg erfolgt über Steintreppen.',
    lat: 40.6139,
    lng: 14.5492,
    rating: 4.8,
    reviewsCount: 520,
    isSecret: true,
    isProOnly: false
  },
  {
    id: 'spot-it-02',
    countryCode: 'IT',
    city: 'Rom',
    title: 'Katakomben-Enoteca im Trastevere-Keller',
    category: 'food',
    categoryLabel: '🍷 Antike Wein-Krypta',
    desc: 'Über 2.000 Jahre alte römische Ziegelgewölbe unter einem Wohnhaus, in denen naturbelassene Amphorenweine verkostet werden.',
    insiderTip: 'Nur mit Reservierung oder VIP-Pass zugänglich. Frage den Wirt nach dem unfiltrierten Sangiovese aus Orvieto.',
    lat: 41.8885,
    lng: 12.4705,
    rating: 4.9,
    reviewsCount: 195,
    isSecret: true,
    isProOnly: true,
    secretAccessCode: 'Im Innenhof 3x an der Messingglocke mit dem Fischsymbol läuten'
  },

  // 🇪🇸 SPANIEN
  {
    id: 'spot-es-01',
    countryCode: 'ES',
    city: 'Barcelona',
    title: 'Bunkers del Carmel (Turó de la Rovira)',
    category: 'sunset',
    categoryLabel: '🌅 360° Panoramablick',
    desc: 'Ehemalige Flak-Stellungen aus dem Spanischen Bürgerkrieg auf einem Berggipfel mit dem spektakulärsten Rundumblick über ganz Barcelona und das Mittelmeer.',
    insiderTip: 'Kühle Getränke und Picknick mitnehmen. Zur Dämmerung leuchtet die Sagrada Família direkt unter dir.',
    lat: 41.4194,
    lng: 2.1617,
    rating: 4.8,
    reviewsCount: 940,
    isSecret: false,
    isProOnly: false
  },
  {
    id: 'spot-es-02',
    countryCode: 'ES',
    city: 'Mallorca',
    title: 'Cala Varques Piratengrotte',
    category: 'lostplace',
    categoryLabel: '🥾 Geheime Meereshöhle',
    desc: 'Einsame Natursteinbucht mit unterirdischen Tropfsteinhöhlen und einer natürlichen Felsenbrücke über dem tosenden Meer.',
    insiderTip: 'Taschenlampe und Wasserschuhe erforderlich. In die Grotte gelangt man nur bei ruhiger See.',
    lat: 39.4975,
    lng: 3.2982,
    rating: 4.9,
    reviewsCount: 310,
    isSecret: true,
    isProOnly: true,
    secretAccessCode: 'Dem Steinmännchen-Pfad 400m nach Süden folgen, Einstieg durch Felsspalte'
  },

  // 🇯🇵 JAPAN
  {
    id: 'spot-jp-01',
    countryCode: 'JP',
    city: 'Kyoto',
    title: 'Fushimi Inari Geisterpfad (Nachtwanderung)',
    category: 'sunset',
    categoryLabel: '⛩️ Mystischer Pfad',
    desc: 'Während tagsüber tausende Touristen durch die roten Tore strömen, verwandelt sich der Berg Inari ab 21 Uhr in eine meditative Kulisse mit beleuchteten Steinfüchsen.',
    insiderTip: 'Nach Einbruch der Dunkelheit starten. Am Yotsutsuji-Aussichtspunkt hat man einen funkelnden Blick auf ganz Kyoto.',
    lat: 34.9671,
    lng: 135.7727,
    rating: 4.9,
    reviewsCount: 1250,
    isSecret: true,
    isProOnly: false
  },
  {
    id: 'spot-jp-02',
    countryCode: 'JP',
    city: 'Tokio',
    title: 'Bar Albatross G (Golden Gai Vintage)',
    category: 'food',
    categoryLabel: '🍸 Mikro-Bar (5 Sitze)',
    desc: 'Winzige Bar auf drei Mini-Etagen mit Samtvorhängen, Kristall-Kronleuchtern und Platz für exakt 5 Gäste.',
    insiderTip: 'Schmale Holzstiege in den 2. Stock hinaufsteigen. Legendäre Auswahl an japanischem Whisky und Ume-Pflaumenlikör.',
    lat: 35.6940,
    lng: 139.7045,
    rating: 4.8,
    reviewsCount: 215,
    isSecret: true,
    isProOnly: true,
    secretAccessCode: 'Tür vorsichtig nach links schieben, mit 1 Finger "One Person" signalisieren'
  }
]
