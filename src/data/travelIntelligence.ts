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
  code: string          // DE, AT, CH, PT, ES, IT, FR, IS, US, GB, JP, TH, etc.
  name: string
  region: 'DACH' | 'Südeuropa' | 'Westeuropa' | 'Nordeuropa' | 'Osteuropa' | 'Nordamerika' | 'Lateinamerika' | 'Asien' | 'Afrika' | 'Ozeanien' | 'Naher Osten' | 'Global'
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
  },
  {
    code: 'US',
    name: 'USA (Vereinigte Staaten)',
    region: 'Nordamerika',
    flag: '🇺🇸',
    currency: 'USD ($)',
    emergency: {
      police: '911',
      medical: '911',
      fire: '911',
      touristPolice: '911 (Disponenten verbinden spanisch/deutsch)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Trinkbar (oft Chlor)',
      note: 'In den meisten Städten sicher genießbar. In alten Wohnungen oder Wüstenstädten Wasserfilter nutzen.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Kreditkarte zwingend erforderlich',
      tip: 'Für Mietwagen, Kautionen und Hotels ist eine echte Credit Card (keine reine Debit) fast immer Pflicht. Trinkgeld 18–22% üblich.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'E-ZPass / SunPass (elektronisch)',
      tip: 'Brücken in New York/San Francisco und Florida Turnpikes haben keine Barzahlung mehr. PlatePass mit Mietwagen buchen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 5,50 / 10 GB',
      bestLocalCarrier: 'T-Mobile US / Verizon',
      roamingWarning: '⚠️ Roaming außerhalb von EU-Tarifen extrem teuer! Vor Abflug US-eSIM installieren.'
    }
  },
  {
    code: 'GB',
    name: 'Großbritannien & UK',
    region: 'Westeuropa',
    flag: '🇬🇧',
    currency: 'GBP (£)',
    emergency: {
      universalEu: '112',
      police: '999 / 112',
      medical: '999 / 111 (Nicht-Notfall NHS)',
      fire: '999'
    },
    tapWater: {
      drinkable: true,
      rating: 'Ausgezeichnet',
      note: 'Trinkwasser im ganzen Land von bester Qualität. Schottisches Hochlandwasser gilt als besonders weich.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '100% Cashless in London & Großstädten',
      tip: 'U-Bahn (TfL Tube) und Busse akzeptieren kontaktlose Kreditkarten / Apple Pay direkt am Drehkreuz — keine Oyster-Karte mehr nötig.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'London Congestion Charge & ULEZ',
      tip: 'Linksverkehr! In London fallen City-Maut (Congestion Charge) und Umweltzone (ULEZ) an. Außerhalb Autobahnen mautfrei (außer M6 Toll).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,00 / 5 GB',
      bestLocalCarrier: 'EE / Vodafone UK',
      roamingWarning: 'Post-Brexit: Manche EU-Anbieter berechnen Roaming in UK — Tarif vorab prüfen.'
    }
  },
  {
    code: 'GR',
    name: 'Griechenland',
    region: 'Südeuropa',
    flag: '🇬🇷',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '100',
      medical: '166 (EKAB)',
      fire: '199',
      touristPolice: '171 (Touristenpolizei mehrsprachig)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Festland ja, Inseln meist Flaschenwasser',
      note: 'In Athen und Thessaloniki trinkbar. Auf Kykladen (Santorini, Mykonos) und Kreta nur abgefülltes Flaschenwasser trinken (Entsalzungsanlagen).'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Kartenzahlung gesetzlich vorgeschrieben',
      tip: 'Alle Tavernen und Taxis müssen Kartenzahlung akzeptieren. Kleingeld (1–2 €) für Trinkgeld bar auf dem Tisch lassen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Autobahn-Mauthäuschen (Bar / Karte)',
      tip: 'Autobahnen zwischen Athen, Patras und Thessaloniki haben regelmäßige Mautstellen. Fährverbindungen im Sommer früh buchen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 3,90 / 5 GB',
      bestLocalCarrier: 'Cosmote / Vodafone GR'
    }
  },
  {
    code: 'TR',
    name: 'Türkei',
    region: 'Südeuropa',
    flag: '🇹🇷',
    currency: 'TRY (Türkische Lira)',
    emergency: {
      universalEu: '112',
      police: '155 / 112',
      medical: '112',
      fire: '110',
      touristPolice: '+90 212 527 45 03 (Istanbul Touristenpolizei)'
    },
    tapWater: {
      drinkable: false,
      rating: 'Nicht zum Trinken empfohlen',
      note: 'Leitungswasser in Istanbul und Urlaubsregionen stark gechlort und altberohrt. Immer versiegeltes Flaschenwasser kaufen.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Karte weit verbreitet, Lira bar für Basare',
      tip: 'Visa & Mastercard werden in fast allen Geschäften akzeptiert. Auf Basaren, Märkten und in Dolmuş-Sammeltaxis immer Bar-Lira dabeihaben.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'HGS Transponder-Maut',
      tip: 'Maut auf Autobahnen und Brücken über den Bosporus erfolgt elektronisch per HGS-Chip an der Windschutzscheibe (Mietwagen prüfen).'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,50 / 5 GB',
      bestLocalCarrier: 'Turkcell / Vodafone TR',
      roamingWarning: '⚠️ Türkei ist kein EU-Land! Roaming ist ohne Auslandspaket extrem teuer.'
    }
  },
  {
    code: 'HR',
    name: 'Kroatien',
    region: 'Südeuropa',
    flag: '🇭🇷',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '192 / 112',
      medical: '194 / 112',
      fire: '193',
      mountainOrSea: '195 (Seenotrettung MRCC)'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Kroatisches Leitungswasser gehört zu den saubersten Europas und ist überall bedenkenlos trinkbar.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Euro seit 2023 gesetzliches Zahlungsmittel',
      tip: 'Kartenzahlung überall Standard. An Strandbars und Bauernmärkten ist etwas Bar-Euro vorteilhaft.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Mauthäuschen (Ticket ziehen & bei Ausfahrt zahlen)',
      tip: 'Autobahn A1 (Zagreb–Split–Dubrovnik) ist streckenabhängig mautpflichtig. Kreditkarte an den ENC-Mautspuren geht am schnellsten.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,80 / 5 GB',
      bestLocalCarrier: 'Hrvatski Telekom (HT) / A1 HR'
    }
  },
  {
    code: 'TH',
    name: 'Thailand',
    region: 'Asien',
    flag: '🇹🇭',
    currency: 'THB (Thailändische Baht)',
    emergency: {
      police: '191',
      medical: '1669',
      fire: '199',
      touristPolice: '1155 (Touristenpolizei, Englisch 24/7)'
    },
    tapWater: {
      drinkable: false,
      rating: 'Niemals aus dem Hahn trinken',
      note: 'Nur abgefülltes Flaschenwasser mit intaktem Siegel trinken. Eiswürfel mit Loch in der Mitte in Restaurants sind industriell und sicher.'
    },
    payment: {
      cardAcceptance: 'cash_preferred',
      headline: 'Bargeld ist König (Cash-Kultur)',
      tip: 'Geldautomaten (ATMs) verlangen pauschal 220 THB Gebühr pro Abhebung. Höchstbetrag (20.000–30.000 THB) auf einmal ziehen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Expressway Mauthäuschen (Barzahlung)',
      tip: 'Linksverkehr! In Bangkok Mautstraßen (Expressways) nutzen, um Staus zu umgehen. Taxis immer auf "Meter" (Taxameter) bestehen.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,50 / 15 GB (unbegrenzt Datenpakete)',
      bestLocalCarrier: 'AIS / TrueMove H',
      roamingWarning: 'Kein EU-Roaming. Lokale 5G eSIM am Flughafen oder vorab installieren.'
    }
  },
  {
    code: 'ID',
    name: 'Indonesien (inkl. Bali)',
    region: 'Asien',
    flag: '🇮🇩',
    currency: 'IDR (Indonesische Rupiah)',
    emergency: {
      universalEu: '112',
      police: '110 / 112',
      medical: '118',
      fire: '113',
      mountainOrSea: 'BASARNAS Rettung 115'
    },
    tapWater: {
      drinkable: false,
      rating: 'Gefahr von "Bali Belly"',
      note: 'Leitungswasser nicht zum Zähneputzen oder Trinken verwenden. Gallonen-Wasserfilter oder Flaschenwasser nutzen.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Bargeld & QRIS / Karte in Cafés',
      tip: 'In Hipster-Cafés geht Karte (oft 2–3% Aufschlag). Auf Märkten, für Roller-Miete und Warungs nur IDR-Bargeld.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Elektronische E-Toll Card (Mandiri / BCA)',
      tip: 'Linksverkehr! Roller nur mit internationalem Führerschein (Klasse A) und Helm fahren. Mautstraßen (z. B. Bali Mandara) nur mit E-Money Karte.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,80 / 10 GB',
      bestLocalCarrier: 'Telkomsel / XL Axiata'
    }
  },
  {
    code: 'VN',
    name: 'Vietnam',
    region: 'Asien',
    flag: '🇻🇳',
    currency: 'VND (Vietnamesische Dong)',
    emergency: {
      police: '113',
      medical: '115',
      fire: '114'
    },
    tapWater: {
      drinkable: false,
      rating: 'Nur abgekochtes oder Flaschenwasser',
      note: 'Leitungswasser meiden. Gekochter Tee (Trà Đá) und industrielles Eis sind meist unbedenklich.'
    },
    payment: {
      cardAcceptance: 'cash_preferred',
      headline: 'Bargeld dominant, Grab-App für Fahrten',
      tip: 'VND hat viele Nullen (100.000 VND ≈ 3,70 €) — Geldscheine bei der Übergabe genau prüfen (500.000 und 20.000 sehen ähnlich aus!).'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'ETC Mautkarte',
      tip: 'Verkehr extrem dicht mit Millionen Rollern. Als Fußgänger die Straße in stetem, berechenbarem Schritt überqueren — die Roller weichen aus.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,90 / 15 GB',
      bestLocalCarrier: 'Viettel / Vinaphone'
    }
  },
  {
    code: 'EG',
    name: 'Ägypten',
    region: 'Afrika',
    flag: '🇪🇬',
    currency: 'EGP (Ägyptische Pfund)',
    emergency: {
      police: '122',
      medical: '123',
      fire: '180',
      touristPolice: '126 (Touristenpolizei Kairo & Rotes Meer)'
    },
    tapWater: {
      drinkable: false,
      rating: 'Strikt abzuraten',
      note: 'Nilwasser ist gechlort aber mikrobiell für Reisende riskant. Immer Flaschenwasser trinken und Salate meiden.'
    },
    payment: {
      cardAcceptance: 'cash_preferred',
      headline: 'Bargeld für Bakschisch & Taxis',
      tip: 'Trinkgeld ("Bakschisch") ist allgegenwärtig. Immer kleine 10–20 EGP Scheine parat haben.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Bar-Mautstellen auf Wüstenstraßen',
      tip: 'Verkehr in Kairo ist chaotisch. Uber nutzen statt Straßen-Taxis, um Preisdiskussionen zu vermeiden.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 5,50 / 5 GB',
      bestLocalCarrier: 'Vodafone Egypt / WE'
    }
  },
  {
    code: 'MA',
    name: 'Marokko',
    region: 'Afrika',
    flag: '🇲🇦',
    currency: 'MAD (Marokkanische Dirham)',
    emergency: {
      universalEu: '112',
      police: '19 (Stadt) / 177 (Gendarmerie Überland)',
      medical: '15',
      fire: '15'
    },
    tapWater: {
      drinkable: false,
      rating: 'Flaschenwasser bevorzugen',
      note: 'In großen Hotels teils gefiltert, für empfindliche Mägen aber versiegeltes Quellwasser (Sidi Ali / Ain Saiss) empfohlen.'
    },
    payment: {
      cardAcceptance: 'cash_preferred',
      headline: 'Bargeld in Souks & Riads',
      tip: 'In den Medinas geht fast alles bar. Dirham ist eine geschlossene Währung — Reste vor Rückflug am Flughafen umtauschen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Mauthäuschen (Ticket ziehen & bar zahlen)',
      tip: 'Autobahnen (Autoroutes du Maroc) sind exzellent ausgebaut und mautpflichtig. Strikte Polizeikontrollen mit Laser-Geschwindigkeitsmessung.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,50 / 5 GB',
      bestLocalCarrier: 'Maroc Telecom / Orange MA'
    }
  },
  {
    code: 'ZA',
    name: 'Südafrika',
    region: 'Afrika',
    flag: '🇿🇦',
    currency: 'ZAR (Südafrikanische Rand)',
    emergency: {
      universalEu: '112',
      police: '10111 / 112',
      medical: '10177',
      fire: '10177',
      mountainOrSea: 'NSRI Seenotrettung +27 21 434 4011'
    },
    tapWater: {
      drinkable: true,
      rating: 'In Städten ausgezeichnet',
      note: 'In Kapstadt, Johannesburg und an der Garden Route ist das Leitungswasser von hoher Qualität. In ländlichen Regionen nachfragen.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Karte fast überall akzeptiert',
      tip: 'Trinkgeld für Parkplatzwächter ("Car Guards") 5–10 Rand in bar bereithalten.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Mauthäuschen (Kreditkarte/Bargeld)',
      tip: 'Linksverkehr! Nach Einbruch der Dunkelheit nicht zu Fuß gehen. Türen im Auto verriegeln und Wertsachen nicht offen im Fahrzeug lassen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 6,00 / 5 GB',
      bestLocalCarrier: 'Vodacom / MTN',
      roamingWarning: '⚠️ Stromabschaltungen ("Load Shedding") können lokale Mobilfunkmasten kurzzeitig lahmlegen.'
    }
  },
  {
    code: 'MX',
    name: 'Mexiko',
    region: 'Lateinamerika',
    flag: '🇲🇽',
    currency: 'MXN (Mexikanische Pesos)',
    emergency: {
      police: '911',
      medical: '911 / Rotes Kreuz 065',
      fire: '911',
      touristPolice: '078 (Ángeles Verdes Pannenhilfe & Touristeninfo)'
    },
    tapWater: {
      drinkable: false,
      rating: 'Niemals Leitungswasser trinken',
      note: 'Immer "Agua purificada" aus Krügen oder Flaschen verwenden. Zähneputzen ebenfalls mit Flaschenwasser.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Pesos für Street Food & Colectivos',
      tip: 'Restaurants und Supermärkte nehmen Karte. Für Tacos, Tienditas und Trinkgeld ("Propina") immer Pesos dabeihaben.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Cuota-Mautstraßen (Barzahlung)',
      tip: 'Immer gebührenpflichtige "Cuota"-Autobahnen wählen — diese sind sicherer und in besserem Zustand als mautfreie "Libre"-Straßen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 5,00 / 5 GB',
      bestLocalCarrier: 'Telcel / AT&T Mexico'
    }
  },
  {
    code: 'BR',
    name: 'Brasilien',
    region: 'Lateinamerika',
    flag: '🇧🇷',
    currency: 'BRL (Brasilianische Real)',
    emergency: {
      universalEu: '190 (Polizei) / 192 (SAMU Notarzt) / 193 (Feuerwehr)',
      police: '190',
      medical: '192',
      fire: '193',
      touristPolice: 'DEAT Touristenpolizei Rio: +55 21 2332-2924'
    },
    tapWater: {
      drinkable: false,
      rating: 'Gefiltertes oder Flaschenwasser',
      note: 'Leitungswasser nicht trinken. Filter ("Filtro de barro") in Pousadas oder Flaschenwasser nutzen.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Kontaktlose Karte & Pix überall',
      tip: 'Selbst Strandverkäufer in Copacabana haben Kartenterminals. Smartphone auf der Straße nicht offen in der Hand tragen.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Pedágio (Mautstelle bar/Karte)',
      tip: 'Uber ist in Großstädten die sicherste Fortbewegung. Nach Einbruch der Dunkelheit rote Ampeln vorsichtig überqueren.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 5,50 / 5 GB',
      bestLocalCarrier: 'Vivo / Claro'
    }
  },
  {
    code: 'AU',
    name: 'Australien',
    region: 'Ozeanien',
    flag: '🇦🇺',
    currency: 'AUD ($)',
    emergency: {
      universalEu: '112 (vom Mobiltelefon) / 000 (Standard Triple Zero)',
      police: '000 / 131 444 (Nicht-Notfall)',
      medical: '000',
      fire: '000'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Australisches Leitungswasser ist von höchster Güte und überall trinkbar.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Fast 100% bargeldlos ("Tap & Go")',
      tip: 'Kreditkarten und Apple Pay überall Standard. Bargeld ist praktisch nirgends erforderlich.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Elektronische Maut (Linkt e-Tag)',
      tip: 'Linksverkehr! In Sydney, Melbourne und Brisbane gibt es elektronische Maut ohne Mauthäuschen. Online innerhalb von 3 Tagen bezahlen.'
    },
    connectivity: {
      networkScore: 'rural_gaps',
      esimPriceFrom: '€ 5,00 / 10 GB',
      bestLocalCarrier: 'Telstra (beste Abdeckung im Outback) / Optus'
    }
  },
  {
    code: 'NZ',
    name: 'Neuseeland',
    region: 'Ozeanien',
    flag: '🇳🇿',
    currency: 'NZD ($)',
    emergency: {
      universalEu: '111',
      police: '111 / 105 (Nicht-Notfall)',
      medical: '111',
      fire: '111'
    },
    tapWater: {
      drinkable: true,
      rating: 'Ausgezeichnet',
      note: 'Leitungswasser ist überall rein und trinkbar.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'EFTPOS & kontaktlose Karten',
      tip: 'Kein Bargeld nötig. Trinkgeld wird in Neuseeland nicht erwartet.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Elektronische Maut (Northern Gateway u. a.)',
      tip: 'Linksverkehr! Kurvige Bergstraßen erfordern doppelte Reisezeit. Maut online bei Waka Kotahi NZTA bezahlen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 5,50 / 10 GB',
      bestLocalCarrier: 'Spark / One NZ'
    }
  },
  {
    code: 'NO',
    name: 'Norwegen',
    region: 'Nordeuropa',
    flag: '🇳🇴',
    currency: 'NOK (Norwegische Krone)',
    emergency: {
      universalEu: '112',
      police: '112',
      medical: '113',
      fire: '110'
    },
    tapWater: {
      drinkable: true,
      rating: 'Gletscher-Reinheit',
      note: 'Eines der reinsten Trinkwasser der Welt direkt aus alpinen Gebirgsquellen.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Nahezu 100% bargeldlos',
      tip: 'Bargeld wird oft gar nicht mehr angenommen. Bankkarte oder Kreditkarte zwingend nötig.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'AutoPASS (Kameras erfassen Kennzeichen)',
      tip: 'Automatische Maut an Brücken und Tunneln. Vorab bei Epass24 registrieren oder Mietwagen-Chip nutzen.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,50 / 5 GB',
      bestLocalCarrier: 'Telenor / Telia'
    }
  },
  {
    code: 'SE',
    name: 'Schweden',
    region: 'Nordeuropa',
    flag: '🇸🇪',
    currency: 'SEK (Schwedische Krone)',
    emergency: {
      universalEu: '112',
      police: '112 / 114 14 (Nicht-Notfall)',
      medical: '112 / 1177 (Gesundheitsberatung)',
      fire: '112'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Reinstes Trinkwasser aus Seen und Urgesteinsquellen.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '"Kontantfri" — Kein Bargeld erwünscht',
      tip: 'Viele Cafés und Museen sind rein bargeldlos ("No Cash Accepted"). Karte oder Smartphone zwingend.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Keine Autobahnmaut. Nur City-Maut ("Trängselskatt") in Stockholm und Göteborg (wird per Rechnung über Kennzeichen erhoben).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,00 / 5 GB',
      bestLocalCarrier: 'Telia / Tele2'
    }
  },
  {
    code: 'DK',
    name: 'Dänemark',
    region: 'Nordeuropa',
    flag: '🇩🇰',
    currency: 'DKK (Dänische Krone)',
    emergency: {
      universalEu: '112',
      police: '112 / 114',
      medical: '112 / 1813 (Kopenhagen Notdienst)',
      fire: '112'
    },
    tapWater: {
      drinkable: true,
      rating: 'Ausgezeichnet',
      note: 'Grundwasser von höchster Reinheit, streng kontrolliert.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '100% kontaktlos',
      tip: 'Kreditkarten und MobilePay dominieren. Bargeld ist nicht erforderlich.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Autobahnen mautfrei. Große Brücken Storebælt und Øresund (nach Schweden) sind gebührenpflichtig.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,90 / 5 GB',
      bestLocalCarrier: 'TDC / 3 Denmark'
    }
  },
  {
    code: 'NL',
    name: 'Niederlande',
    region: 'Westeuropa',
    flag: '🇳🇱',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '112 / 0900-8844',
      medical: '112',
      fire: '112'
    },
    tapWater: {
      drinkable: true,
      rating: 'Weltspitze',
      note: 'Chlorfreies, mehrfach gefiltertes Dünentrinkwasser von bester Qualität.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '"Pin Alleen" — Karte bevorzugt',
      tip: 'Supermärkte (Albert Heijn) und öffentliche Verkehrsmittel (OV-pay per Debitkarte) sind oft rein bargeldlos.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Keine Autobahnmaut (außer Westerscheldetunnel). Extrem hohe Parkgebühren in Amsterdam (P+R nutzen!).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,80 / 5 GB',
      bestLocalCarrier: 'KPN / Vodafone NL'
    }
  },
  {
    code: 'BE',
    name: 'Belgien',
    region: 'Westeuropa',
    flag: '🇧🇪',
    currency: 'EUR (€)',
    emergency: {
      universalEu: '112',
      police: '101 / 112',
      medical: '112',
      fire: '112'
    },
    tapWater: {
      drinkable: true,
      rating: 'Trinkbar (oft kalkhaltig)',
      note: 'In Brüssel und Flandern sicher genießbar, jedoch kalkreich.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Kartenzahlung Pflicht',
      tip: 'Seit 2022 müssen alle belgischen Händler mindestens eine digitale Zahlungsmethode anbieten.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Autobahnen für PKW mautfrei und nachts beleuchtet. Umweltzonen (LEZ) in Brüssel, Antwerpen und Gent.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 4,00 / 5 GB',
      bestLocalCarrier: 'Proximus / Orange BE'
    }
  },
  {
    code: 'PL',
    name: 'Polen',
    region: 'Osteuropa',
    flag: '🇵🇱',
    currency: 'PLN (Złoty)',
    emergency: {
      universalEu: '112',
      police: '997 / 112',
      medical: '999 / 112',
      fire: '998'
    },
    tapWater: {
      drinkable: true,
      rating: 'In Städten trinkbar',
      note: 'In Warschau, Krakau und Danzig ("Kranówka") bedenkenlos trinkbar.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Modernste bargeldlose Infrastruktur',
      tip: 'Kontaktlos und BLIK überall Standard. Bei Kartenzahlung Abrechnung in PLN wählen, um DCC-Gebühren zu vermeiden.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'e-TOLL & Mauthäuschen',
      tip: 'Teilstrecken der A1, A2 und A4 sind mautpflichtig. Auf staatlichen Strecken App e-TOLL PL Ticket nutzen.'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,50 / 5 GB',
      bestLocalCarrier: 'Orange Polska / Plus'
    }
  },
  {
    code: 'CZ',
    name: 'Tschechien',
    region: 'Osteuropa',
    flag: '🇨🇿',
    currency: 'CZK (Tschechische Kronen)',
    emergency: {
      universalEu: '112',
      police: '158 / 112',
      medical: '155',
      fire: '150'
    },
    tapWater: {
      drinkable: true,
      rating: 'Hervorragend',
      note: 'Sehr gute Trinkwasserqualität im ganzen Land.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: 'Karte überall, aber Kronen statt Euro zahlen',
      tip: 'VORSICHT vor dubiosen Wechselstuben in Prag! Keine Geldwechsel auf der Straße (häufige Betrugsmasche mit wertlosen belarussischen Rubeln).'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'Elektronische Autobahnvignette (edalnice.cz)',
      tip: 'Vignette nur auf der offiziellen Seite edalnice.cz kaufen (Vorsicht vor betrügerischen Drittanbieter-Websites!).'
    },
    connectivity: {
      networkScore: 'excellent',
      esimPriceFrom: '€ 3,80 / 5 GB',
      bestLocalCarrier: 'T-Mobile CZ / O2'
    }
  },
  {
    code: 'HU',
    name: 'Ungarn',
    region: 'Osteuropa',
    flag: '🇭🇺',
    currency: 'HUF (Ungarische Forint)',
    emergency: {
      universalEu: '112',
      police: '107 / 112',
      medical: '104',
      fire: '105'
    },
    tapWater: {
      drinkable: true,
      rating: 'Ausgezeichnet',
      note: 'Leitungswasser in Budapest und am Balaton ist von hoher Qualität.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Forint in bar für Ruinenbars & Markthallen',
      tip: 'Bei Kartenzahlung immer "Abrechnung in Forint" wählen. Euro-Preise in Restaurants haben oft schlechte Wechselkurse.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'E-Matrica (Elektronische Vignette)',
      tip: 'Autobahnen erfordern E-Vignette. Bereits vor Grenzübertritt oder innerhalb von 60 Minuten online buchen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,00 / 5 GB',
      bestLocalCarrier: 'Telekom HU / Yettel'
    }
  },
  {
    code: 'CA',
    name: 'Kanada',
    region: 'Nordamerika',
    flag: '🇨🇦',
    currency: 'CAD ($)',
    emergency: {
      police: '911',
      medical: '911',
      fire: '911'
    },
    tapWater: {
      drinkable: true,
      rating: 'Weltspitze',
      note: 'Reinstes Schmelzwasser aus den Rocky Mountains und Borealen Wäldern.'
    },
    payment: {
      cardAcceptance: 'ubiquitous',
      headline: '100% kontaktlos',
      tip: 'Kreditkarten überall Standard. Trinkgeld 15–20% in Gastronomie üblich.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Autobahnen bis auf Highway 407 (Toronto) mautfrei. Parks Canada Discovery Pass für Nationalparks nötig.'
    },
    connectivity: {
      networkScore: 'rural_gaps',
      esimPriceFrom: '€ 6,00 / 10 GB',
      bestLocalCarrier: 'Telus / Rogers'
    }
  },
  {
    code: 'IN',
    name: 'Indien',
    region: 'Asien',
    flag: '🇮🇳',
    currency: 'INR (Indische Rupien)',
    emergency: {
      universalEu: '112',
      police: '100 / 112',
      medical: '102 / 108',
      fire: '101'
    },
    tapWater: {
      drinkable: false,
      rating: 'Gefahr von schweren Mageninfektionen',
      note: 'Leitungswasser strikt meiden (auch für Eiswürfel und Zähneputzen). Nur versiegelte Flaschen bekannter Marken (Kinley, Aquafina) kaufen.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Bargeld & UPI dominant',
      tip: 'Kreditkarten in Malls und Hotels akzeptiert. Für Märkte, Street Food und Tuk-Tuks ("Auto-Rickshaws") immer Bargeld dabeihaben.'
    },
    roadAndTransit: {
      tollRequired: true,
      tollType: 'FASTag Transponder',
      tip: 'Linksverkehr! Extrem dichter Verkehr mit Kühen, Fußgängern und Rollern. Für Überlandfahrten Wagen mit Fahrer mieten.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,50 / 10 GB',
      bestLocalCarrier: 'Jio / Airtel'
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
  },

  // ─── 🇺🇸 USA (VEREINIGTE STAATEN) ───
  {
    id: 'thr-us-01',
    countryCode: 'US',
    area: 'San Francisco · Tenderloin & SOMA (Bipping)',
    category: 'crime',
    severity: 'high',
    title: 'Autofenster-Einschlagen ("Bipping") & Gepäckdiebstahl',
    desc: 'Organisierte Täterbanden schlagen in Sekunden Autoscheiben ein und entwenden Koffer und Rucksäcke aus dem Kofferraum — selbst bei parkenden Autos an Aussichtspunkten (Twin Peaks, Fisherman’s Wharf).',
    advice: 'Niemals Wertsachen, Taschen oder Ladekabel sichtbar im Fahrzeug lassen. Mietwagen mit leerem Kofferraum abstellen.',
    icon: '🚗',
    timeAgo: 'vor 1 Stunde aktualisiert',
    verifiedReports: 430,
    lat: 37.7844,
    lng: -122.4144,
    radiusMeters: 1800,
    isProOnly: false
  },
  {
    id: 'thr-us-vip',
    countryCode: 'US',
    area: 'New York · Times Square & Subway (nachts)',
    category: 'crime',
    severity: 'medium',
    title: '🔒 VIP Shield: Aggressive Maskottchen & CD-Aufdräng-Betrug',
    desc: 'Verkleidete Figuren fordern nach ungefragten Fotos aggressiv 20–50 $ Trinkgeld. Personen drücken Musik-CDs in die Hand und verlangen sofort Bargeld.',
    advice: 'Nichts annehmen, Figuren ignorieren und in der U-Bahn zu später Stunde den Schaffner-Wagen in der Zugmitte wählen.',
    icon: '🗽',
    timeAgo: 'vor 2 Stunden verifiziert',
    verifiedReports: 285,
    lat: 40.7580,
    lng: -73.9855,
    radiusMeters: 600,
    isProOnly: true,
    proShieldReason: 'Exakte Standorte von Touristenfallen & Abzocke-Zonen'
  },
  {
    id: 'thr-us-nature',
    countryCode: 'US',
    area: 'Florida & Golfküste · Strände um Miami & Tampa',
    category: 'nature',
    severity: 'high',
    title: 'Rote Flut (Red Tide) & tückische Rip-Currents',
    desc: 'Giftige Algenblüten ("Red Tide") reizen Atemwege und führen zu Hustenreiz. Unterströmungen am Atlantik ziehen Schwimmer binnen Sekunden aufs offene Meer.',
    advice: 'Strandbefaggung beachten (Rote Flagge = Badeverbot). Bei Strömung niemals gegen die Welle ankämpfen, sondern parallel zum Ufer schwimmen.',
    icon: '🌊',
    timeAgo: 'vor 4 Stunden',
    verifiedReports: 112,
    lat: 25.7826,
    lng: -80.1340,
    radiusMeters: 8000,
    isProOnly: false
  },

  // ─── 🇬🇧 GROSSBRITANNIEN (UK) ───
  {
    id: 'thr-gb-01',
    countryCode: 'GB',
    area: 'London · Soho, Oxford Street & Westminster',
    category: 'crime',
    severity: 'high',
    title: 'Moped- & E-Bike Handy-Raub im Vorbeifahren ("Phone Snatching")',
    desc: 'Maskierte Fahrer auf schnellen E-Bikes oder Mopeds reißen Fußgängern Smartphones blitzschnell aus der Hand, während diese auf Google Maps schauen.',
    advice: 'Smartphone nie nah an der Bordsteinkante halten. In Hauseingängen oder mit beiden Händen und Körperabschirmung navigieren.',
    icon: '📱',
    timeAgo: 'vor 1 Stunde aktualisiert',
    verifiedReports: 512,
    lat: 51.5138,
    lng: -0.1312,
    radiusMeters: 1200,
    isProOnly: false
  },
  {
    id: 'thr-gb-scotland',
    countryCode: 'GB',
    area: 'Schottland · Highlands & Isle of Skye',
    category: 'nature',
    severity: 'medium',
    title: 'Plötzlicher Kälteeinbruch & tückischer Hochlandnebel',
    desc: 'Binnen 30 Minuten kann strahlender Sonnenschein in orkanartige Regenschauer mit Sichtweiten unter 5 Metern umschlagen. Gefahr von Hypothermie.',
    advice: 'Wasserdichte Hardshell-Kleidung, Offline-Karten (kein Mobilfunk in Glens) und Notfall-Biwak mitführen.',
    icon: '🌧️',
    timeAgo: 'vor 6 Stunden',
    verifiedReports: 88,
    lat: 57.2736,
    lng: -6.2155,
    radiusMeters: 25000,
    isProOnly: false
  },

  // ─── 🇬🇷 GRIECHENLAND ───
  {
    id: 'thr-gr-01',
    countryCode: 'GR',
    area: 'Athen · Monastiraki, Plaka & Omonia',
    category: 'crime',
    severity: 'medium',
    title: 'Kneipen-Einladungs-Scam ("Bar Scam") & Metro-Diebstahl',
    desc: 'Freundliche Einheimische laden Touristen auf einen "traditionellen Drink" in eine versteckte Bar ein. Am Ende steht eine Rechnung über 500–1.000 € unter Androhung von Gewalt.',
    advice: 'Keine spontanen Clubeinladungen von Fremden auf der Straße annehmen. In der Metro Linie 1 & 3 Rucksack vorne tragen.',
    icon: '🍸',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 194,
    lat: 37.9763,
    lng: 23.7258,
    radiusMeters: 900,
    isProOnly: false
  },
  {
    id: 'thr-gr-fire',
    countryCode: 'GR',
    area: 'Kykladen & Attika · Waldbrand-Warnstufen',
    category: 'nature',
    severity: 'high',
    title: 'Meltemi-Winde & Waldbrandgefahr im Hochsommer',
    desc: 'Starke Sommerwinde ("Meltemi") fachen bei über 40°C extrem schnell unkontrollierbare Brände an. Küstenstraßen können kurzfristig gesperrt werden.',
    advice: 'Notfall-App 112 Griechenland aktivieren (sendet Evakuierungs-SMS). Keine Zigaretten oder Glasflaschen in die Natur werfen.',
    icon: '🔥',
    timeAgo: 'vor 5 Stunden',
    verifiedReports: 140,
    lat: 38.0498,
    lng: 23.8585,
    radiusMeters: 20000,
    isProOnly: false
  },

  // ─── 🇹🇷 TÜRKEI ───
  {
    id: 'thr-tr-01',
    countryCode: 'TR',
    area: 'Istanbul · Sultanahmet, Taksim & Galatabrücke',
    category: 'crime',
    severity: 'high',
    title: 'Schuhputzer-Trick & gefälschte Taxi-Zähler',
    desc: 'Ein Schuhputzer "verliert" seine Bürste vor dir. Wer sie aufhebt, wird mit einem scheinbar dankbaren Putzen bedacht und anschließend um 30–50 € erpresst.',
    advice: 'Bürsten liegen lassen und weitergehen. Bei Taxis auf offiziellem Taxameter (Taksimetre) bestehen oder BiTaksi-App nutzen.',
    icon: '👞',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 360,
    lat: 41.0054,
    lng: 28.9768,
    radiusMeters: 1400,
    isProOnly: false
  },
  {
    id: 'thr-tr-dogs',
    countryCode: 'TR',
    area: 'Türkei · Stadtrandgebiete & Ruinenstätten',
    category: 'wildlife',
    severity: 'medium',
    title: 'Rudelbildung von Straßenhunden',
    desc: 'Große Straßenhunde verteidigen nachts ihr Revier in Parks und archäologischen Stätten abseits der Hauptstraßen.',
    advice: 'Ruhe bewahren, nicht wegrennen, nicht in die Augen starren und bei Annäherung einen Stein aufheben (signalisiert Abwehr).',
    icon: '🐕',
    timeAgo: 'vor 1 Tag',
    verifiedReports: 65,
    lat: 36.8841,
    lng: 30.7056,
    radiusMeters: 5000,
    isProOnly: false
  },

  // ─── 🇭🇷 KROATIEN ───
  {
    id: 'thr-hr-01',
    countryCode: 'HR',
    area: 'Küste & Inseln · Istrien & Kvarner Bucht',
    category: 'nature',
    severity: 'high',
    title: 'Bura-Sturmwinde an Küstenstraßen & Brücken',
    desc: 'Fallwinde vom Velebit-Gebirge ("Bura") erreichen Orkanböen über 180 km/h. Küstenstraßen (Jadranska Magistrala) und Brücken (Krk-Brücke) werden für Wohnmobile gesperrt.',
    advice: 'HAK-Verkehrsbericht (App HAK) vor Fahrtantritt prüfen. Bei Sturmwarnung Autobahntunnel im Landesinneren meiden.',
    icon: '💨',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 92,
    lat: 45.0812,
    lng: 14.6387,
    radiusMeters: 30000,
    isProOnly: false
  },
  {
    id: 'thr-hr-sea',
    countryCode: 'HR',
    area: 'Adria-Küste · Felsstrände & Buchten',
    category: 'wildlife',
    severity: 'medium',
    title: 'Seeigel & Petermännchen in seichten Felsen',
    desc: 'Tausende schwarze Seeigel sitzen auf Felsen im klaren Wasser. Stiche brechen unter der Haut ab und entzünden sich stark.',
    advice: 'Immer feste Badeschuhe tragen! Bei Stichen mit Olivenöl einreiben und Stacheln mit einer sterilen Nadel entfernen.',
    icon: '🦔',
    timeAgo: 'vor 2 Tagen',
    verifiedReports: 145,
    lat: 43.5081,
    lng: 16.4402,
    radiusMeters: 10000,
    isProOnly: false
  },

  // ─── 🇹🇭 THAILAND ───
  {
    id: 'thr-th-01',
    countryCode: 'TH',
    area: 'Bangkok · Königspalast & Wat Pho',
    category: 'crime',
    severity: 'high',
    title: '"Der Palast ist heute geschlossen"-Scam',
    desc: 'Freundliche Männer in Hemden behaupten vor dem Palast, dieser sei wegen einer buddhistischen Zeremonie geschlossen, und leiten Touristen in ein Tuk-Tuk zu überteuerten Juweliergeschäften.',
    advice: 'Niemals auf Personen vor den Toren hören! Immer direkt zum offiziellen Ticketschalter gehen — der Palast ist fast täglich geöffnet.',
    icon: '🛺',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 620,
    lat: 13.7500,
    lng: 100.4914,
    radiusMeters: 800,
    isProOnly: false
  },
  {
    id: 'thr-th-jelly',
    countryCode: 'TH',
    area: 'Golf von Thailand · Koh Samui & Koh Phangan',
    category: 'wildlife',
    severity: 'high',
    title: 'Tödliche Würfelquallen (Box Jellyfish) in Regenzeiten',
    desc: 'Zwischen Juli und Oktober treiben hochgiftige Würfelquallen in Strandnähe. Ein Kontakt führt binnen 3 Minuten zu Atem- und Herzstillstand.',
    advice: 'Nur in abgezäunten Quallenschutznetzen schwimmen. An vielen Stränden stehen Essig-Stationen (Essig neutralisiert Nesselkapseln).',
    icon: '🪼',
    timeAgo: 'vor 5 Stunden',
    verifiedReports: 78,
    lat: 9.5120,
    lng: 100.0136,
    radiusMeters: 15000,
    isProOnly: false
  },

  // ─── 🇮🇩 INDONESIEN (BALI) ───
  {
    id: 'thr-id-01',
    countryCode: 'ID',
    area: 'Bali · Kuta & Canggu Nachtleben',
    category: 'crime',
    severity: 'high',
    title: 'Panschung mit giftigem Methanol (Arak-Cocktails)',
    desc: 'Billige Bars und Strandstände strecken traditionellen Palmwein (Arak) oder Cocktails mit billigem Industrie-Methanol. Führt zu Erblindung und Tod.',
    advice: 'Nur versiegelte Markenflaschen (Bier, importierte Spirituosen) trinken. Cocktails in dubiosen "Free Drink"-Bars meiden.',
    icon: '🍹',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 184,
    lat: -8.7185,
    lng: 115.1686,
    radiusMeters: 2500,
    isProOnly: false
  },
  {
    id: 'thr-id-monkeys',
    countryCode: 'ID',
    area: 'Bali · Ubud Monkey Forest & Uluwatu Tempel',
    category: 'wildlife',
    severity: 'medium',
    title: 'Aggressive Langschwanzmakaken & Tollwutgefahr',
    desc: 'Affen stehlen Brillen, Schmuck, Hüte und Handys aus Taschen und beißen zu, wenn man Gegenstände zurückfordert.',
    advice: 'Keine Nahrungsmittel in Taschen haben, Brillen vor dem Tempel abnehmen. Bei Biss sofort ins Krankenhaus für Tollwutimpfung.',
    icon: '🐒',
    timeAgo: 'vor 4 Stunden',
    verifiedReports: 290,
    lat: -8.5194,
    lng: 115.2606,
    radiusMeters: 600,
    isProOnly: false
  },

  // ─── 🇪🇬 ÄGYPTEN ───
  {
    id: 'thr-eg-01',
    countryCode: 'EG',
    area: 'Kairo · Pyramiden von Gizeh',
    category: 'crime',
    severity: 'high',
    title: 'Kamelritt-Erpressung & gefälschte Ticket-Kontrolleure',
    desc: 'Händler bieten Kamelritte für 5 € an — verlangen aber für den Abstieg 100 € oder halten Touristen in der Wüste fest. Männer in Zivil behaupten, Tickets seien ungültig.',
    advice: 'Nur offizielle Tickets am Haupteingang kaufen. Kamele ignorieren oder Festpreis vorab schriftlich vereinbaren.',
    icon: '🐪',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 510,
    lat: 29.9792,
    lng: 31.1342,
    radiusMeters: 1800,
    isProOnly: false
  },

  // ─── 🇲🇦 MAROKKO ───
  {
    id: 'thr-ma-01',
    countryCode: 'MA',
    area: 'Marrakesch · Jemaa el-Fna & Gerberviertel',
    category: 'crime',
    severity: 'high',
    title: 'Falsche Guides & Schlangen-Fotofallen',
    desc: 'Gaukler werfen ungefragt Schlangen um den Hals und fordern 50 € für ein Foto. Männer leiten Touristen in abgelegene Gerberviertel und verlangen Schutzgeld für den Rückweg.',
    advice: 'Mit fester Geste "La, Shukran" (Nein, danke) sagen und zügig weitergehen. Offline-Karte mit GPS nutzen, um sich nicht in der Medina zu verirren.',
    icon: '🐍',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 380,
    lat: 31.6258,
    lng: -7.9891,
    radiusMeters: 1200,
    isProOnly: false
  },

  // ─── 🇿🇦 SÜDAFRIKA ───
  {
    id: 'thr-za-01',
    countryCode: 'ZA',
    area: 'Kapstadt & Johannesburg · Innenstädte nachts',
    category: 'crime',
    severity: 'high',
    title: 'Bewaffnete Überfälle & Carjacking an Ampeln',
    desc: 'Nach Einbruch der Dunkelheit ist das Gehen zu Fuß in Stadtzentren lebensgefährlich. An Ampeln schlagen Kriminelle Scheiben ein, um Handtaschen vom Beifahrersitz zu stehlen.',
    advice: 'Nachts ausschließlich Uber Door-to-Door nutzen. Im Auto alle Türen verriegeln und Wertsachen im Fußraum verstecken.',
    icon: '🚗',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 490,
    lat: -33.9249,
    lng: 18.4241,
    radiusMeters: 4000,
    isProOnly: false
  },

  // ─── 🇲🇽 MEXIKO ───
  {
    id: 'thr-mx-01',
    countryCode: 'MX',
    area: 'Cancún, Tulum & Mexiko-Stadt',
    category: 'crime',
    severity: 'high',
    title: 'Manipulierte Geldautomaten (Skimming) & Express-Scams',
    desc: 'Freistehende Geldautomaten an Touristenmeilen kopieren Kartendaten und PINs. Falsche Polizisten erpressen "Sofort-Bußgelder" für angebliche Verstöße.',
    advice: 'Geld nur IN videoüberwachten Bankfilialen abheben. Strafzettel niemals bar auf der Straße zahlen — auf Vorladung zur Polizeiwache bestehen.',
    icon: '🏧',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 310,
    lat: 21.1391,
    lng: -86.7497,
    radiusMeters: 3000,
    isProOnly: false
  },

  // ─── 🇧🇷 BRASILIEN ───
  {
    id: 'thr-br-01',
    countryCode: 'BR',
    area: 'Rio de Janeiro · Copacabana, Ipanema & Lapa nachts',
    category: 'crime',
    severity: 'high',
    title: 'Blitzüberfälle ("Arrastão") & offener Handydiebstahl',
    desc: 'Jugendgruppen rennen über den Strand und entreißen Taschen und Handys. Nach Einbruch der Dunkelheit lauern bewaffnete Täter in Strandnähe.',
    advice: 'Niemals teuren Schmuck oder Smartphones offen am Strand tragen. Nur etwas Bargeld und eine Kopie des Ausweises mitführen.',
    icon: '🏖️',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 420,
    lat: -22.9711,
    lng: -43.1822,
    radiusMeters: 2500,
    isProOnly: false
  },

  // ─── 🇦🇺 AUSTRALIEN ───
  {
    id: 'thr-au-01',
    countryCode: 'AU',
    area: 'Queensland & Northern Territory · Strände & Flüsse',
    category: 'wildlife',
    severity: 'high',
    title: 'Tödliche Salzwasserkrokodile ("Salties") & Würfelquallen',
    desc: 'Krokodile lauern unsichtbar im trüben Wasser von Mündungen und Stränden in Nordaustralien. Extrem aggressive Jäger.',
    advice: 'Warnschilder "Crocodile Warning" strikt beachten! Niemals in Flüssen oder unbewachten Stränden nördlich von Rockhampton schwimmen.',
    icon: '🐊',
    timeAgo: 'vor 5 Stunden',
    verifiedReports: 65,
    lat: -16.9186,
    lng: 145.7781,
    radiusMeters: 15000,
    isProOnly: false
  },

  // ─── 🇳🇴 NORWEGEN ───
  {
    id: 'thr-no-01',
    countryCode: 'NO',
    area: 'Lofoten, Preikestolen & Trolltunga',
    category: 'nature',
    severity: 'high',
    title: 'Unberechenbare Sturmböen & ungesicherte Felsabstürze',
    desc: 'Mehrere hundert Meter tiefe Klippen haben keine Zäune. Nasse Felsen und plötzliche Windböen über 100 km/h führen regelmäßig zu Abstürzen.',
    advice: 'Feste Bergschuhe mit Vibram-Sohle tragen. Mindestens 3 Meter Abstand zur Abbruchkante halten, kein Leichtsinn für Selfies.',
    icon: '🏔️',
    timeAgo: 'vor 4 Stunden aktualisiert',
    verifiedReports: 74,
    lat: 58.9864,
    lng: 6.1887,
    radiusMeters: 10000,
    isProOnly: false
  },

  // ─── 🇳🇱 NIEDERLANDE ───
  {
    id: 'thr-nl-01',
    countryCode: 'NL',
    area: 'Amsterdam · De Wallen & Centraal Station',
    category: 'crime',
    severity: 'medium',
    title: 'Fake-Drogendealer & Taschendiebe an Grachten',
    desc: 'Straßenverkäufer bieten weiße Pulver an, die sich als Backpulver oder giftiges Waschmittel entpuppen. Gleichzeitig werden abgelenkte Touristen bestohlen.',
    advice: 'Niemals Substanzen auf der Straße kaufen. In Coffeeshops auf offizielle Genehmigungen achten und Handys an Grachtenkanten festhalten.',
    icon: '🚲',
    timeAgo: 'vor 2 Stunden aktualisiert',
    verifiedReports: 215,
    lat: 52.3725,
    lng: 4.8970,
    radiusMeters: 800,
    isProOnly: false
  },

  // ─── 🇨🇿 TSCHECHIEN ───
  {
    id: 'thr-cz-01',
    countryCode: 'CZ',
    area: 'Prag · Karlsbrücke & Wenzelsplatz',
    category: 'crime',
    severity: 'high',
    title: 'Geldwechsel-Betrug ("Fake Exchange") mit wertlosen Rubeln',
    desc: 'Betrüger sprechen Touristen vor Wechselstuben an und bieten einen "besseren Kurs" für Euro an. Ausgehändigt werden jedoch wertlose, alte belarussische Rubel.',
    advice: 'Niemals Geld auf der Straße wechseln! Nur in lizenzierten Banken oder am Automaten abheben.',
    icon: '💶',
    timeAgo: 'vor 1 Stunde aktualisiert',
    verifiedReports: 340,
    lat: 50.0865,
    lng: 14.4114,
    radiusMeters: 600,
    isProOnly: false
  },

  // ─── 🇮🇳 INDIEN ───
  {
    id: 'thr-in-01',
    countryCode: 'IN',
    area: 'Neu-Delhi · Paharganj & Hauptbahnhof New Delhi',
    category: 'crime',
    severity: 'high',
    title: '"Tourist Office Scam" & Magen-Darm-Warnung ("Delhi Belly")',
    desc: 'Taxifahrer behaupten, dein gebuchtes Hotel sei abgebrannt oder die Straße gesperrt, und fahren dich zu einem Fake "Government Tourist Office" für teure Buchungen.',
    advice: 'Auf direktem Weg zum gebuchten Hotel bestehen. Nur Flaschenwasser trinken, kein offenes Eis und kein ungewaschenes Streetfood.',
    icon: '🍛',
    timeAgo: 'vor 3 Stunden aktualisiert',
    verifiedReports: 580,
    lat: 28.6432,
    lng: 77.2144,
    radiusMeters: 1500,
    isProOnly: false
  }
]

/**
 * Universal Global Intelligence Resolver:
 * Liefert verlässliche, standardisierte Sicherheits- & Reiserelevante Informationen
 * für JEDES Land der Welt (auch wenn es nicht in den kuratierten Top-30 liegt).
 */
export function getCountryIntelligence(code: string): CountryIntelligence {
  const found = countriesIntelligence.find(c => c.code.toUpperCase() === code.toUpperCase())
  if (found) return found

  // Fallback für alle weiteren Länder der Erde
  return {
    code: code.toUpperCase(),
    name: `Land (${code.toUpperCase()})`,
    region: 'Global',
    flag: '🌐',
    currency: 'Lokale Landeswährung',
    emergency: {
      universalEu: '112 / 911 (Internationale Notruf-Standards)',
      police: '112 oder 911',
      medical: '112 oder 911',
      fire: '112 oder 911',
      touristPolice: 'Notrufzentrale der Landespolizei'
    },
    tapWater: {
      drinkable: false,
      rating: 'Flaschenwasser vorsichtshalber empfohlen',
      note: 'Vor Ort prüfen oder auf abgepacktes Flaschenwasser zurückgreifen.'
    },
    payment: {
      cardAcceptance: 'common',
      headline: 'Kreditkarte & Bargeld-Notgroschen',
      tip: 'Internationale Kreditkarte (Visa/Mastercard) und kleiner Bargeldbestand in lokaler Währung empfohlen.'
    },
    roadAndTransit: {
      tollRequired: false,
      tip: 'Lokale Verkehrsregeln und Versicherungsschutz vor Mietwagen-Nutzung sorgfältig prüfen.'
    },
    connectivity: {
      networkScore: 'good',
      esimPriceFrom: '€ 4,90 / 5 GB',
      bestLocalCarrier: 'Führender nationaler Netzanbieter'
    }
  }
}

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
