/**
 * Lightweight Zero-Dependency Internationalization (i18n) Engine
 * 
 * Unterstützt DACH (DE/AT/CH), EN, ES, FR, PT und RU (Free Nations)
 * mit synchronem Wechsel im Header/Footer und lokaler Persistenz.
 */

export type SupportedLanguage = 'de' | 'en' | 'es' | 'fr' | 'pt' | 'ru'

export interface LanguageMeta {
  code: SupportedLanguage
  label: string
  flag: string
}

export const supportedLanguages: LanguageMeta[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🕊️' }
]

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    nav_radar: 'Safety Radar & Connectivity',
    nav_explore: 'Secret Spots',
    nav_routes: 'Local Routen',
    nav_tours: 'Geführte Touren',
    nav_passport: 'Reisepass',
    nav_chat: 'Orts-Chat',
    nav_vip: 'VIP Club & Host',
    threat_all: 'Alle Gefahren & Hinweise',
    threat_crime: '🔴 Kriminalität & Scams',
    threat_nature: '🟠 Natur & Extremwetter',
    threat_wildlife: '🟡 Wildtiere & Fauna',
    threat_connectivity: '🔵 Connectivity & Notruf',
    legends_title: 'Geheime Stadtlegenden & Mythen',
    legends_subtitle: 'Was dir die Touristen-Guides vor Ort erzählen',
    vip_badge: 'VIP AUDIO GUIDE',
    emergency_title: 'Notrufnummern & Soforthilfe',
    tap_water: 'Trinkwasser-Sicherheit',
    payment_method: 'Zahlungsmittel & Bargeld',
    toll_rules: 'Maut & Vignetten',
    esim_discount: '10% eSIM Rabatt mit Code SCRATCH10',
    curated_spots: 'Kuratierte Geheimtipps'
  },
  en: {
    nav_radar: 'Safety Radar & Connectivity',
    nav_explore: 'Secret Spots',
    nav_routes: 'Local Routes',
    nav_tours: 'Guided Tours',
    nav_passport: 'Passport',
    nav_chat: 'Local Chat',
    nav_vip: 'VIP Club & Host',
    threat_all: 'All Threats & Advisories',
    threat_crime: '🔴 Crime & Scams',
    threat_nature: '🟠 Nature & Weather',
    threat_wildlife: '🟡 Wildlife & Fauna',
    threat_connectivity: '🔵 Connectivity & Emergency',
    legends_title: 'Secret City Legends & Myths',
    legends_subtitle: 'What local tour guides whisper in your ear',
    vip_badge: 'VIP AUDIO GUIDE',
    emergency_title: 'Emergency Numbers & First Aid',
    tap_water: 'Tap Water Safety',
    payment_method: 'Payment & Cash Rules',
    toll_rules: 'Tolls & Highway Vignettes',
    esim_discount: '10% eSIM discount with code SCRATCH10',
    curated_spots: 'Curated Hidden Gems'
  },
  es: {
    nav_radar: 'Radar de Seguridad & eSIM',
    nav_explore: 'Lugares Secretos',
    nav_routes: 'Rutas Locales',
    nav_tours: 'Tours Guiados',
    nav_passport: 'Pasaporte',
    nav_chat: 'Chat de Lugar',
    nav_vip: 'Club VIP & Anfitrión',
    threat_all: 'Todas las Alertas',
    threat_crime: '🔴 Delincuencia & Estafas',
    threat_nature: '🟠 Naturaleza & Clima',
    threat_wildlife: '🟡 Fauna & Animales',
    threat_connectivity: '🔵 Conectividad & Emergencias',
    legends_title: 'Leyendas Secretas & Historia',
    legends_subtitle: 'Lo que los guías locales cuentan a los viajeros',
    vip_badge: 'AUDIOGUÍA VIP',
    emergency_title: 'Números de Emergencia',
    tap_water: 'Agua Potable',
    payment_method: 'Pagos & Efectivo',
    toll_rules: 'Peajes & Viñetas',
    esim_discount: '10% dto. en eSIM con el código SCRATCH10',
    curated_spots: 'Joyas Ocultas Curadas'
  },
  fr: {
    nav_radar: 'Radar de Sécurité & Connectivité',
    nav_explore: 'Lieux Secrets',
    nav_routes: 'Itinéraires Locaux',
    nav_tours: 'Visites Guidées',
    nav_passport: 'Passeport',
    nav_chat: 'Chat Local',
    nav_vip: 'Club VIP & Hôte',
    threat_all: 'Toutes les Alertes',
    threat_crime: '🔴 Criminalité & Arnaques',
    threat_nature: '🟠 Nature & Météo',
    threat_wildlife: '🟡 Faune & Animaux Sauvages',
    threat_connectivity: '🔵 Connectivité & Urgence',
    legends_title: 'Légendes Urbaines & Mystères',
    legends_subtitle: 'Ce que racontent les guides touristiques locaux',
    vip_badge: 'GUIDE AUDIO VIP',
    emergency_title: 'Numéros d’Urgence',
    tap_water: 'Eau du Robinet',
    payment_method: 'Moyens de Paiement & Espèces',
    toll_rules: 'Péages & Vignettes',
    esim_discount: '10% de réduction eSIM avec le code SCRATCH10',
    curated_spots: 'Pépites Cachées'
  },
  pt: {
    nav_radar: 'Radar de Segurança & Conectividade',
    nav_explore: 'Lugares Secretos',
    nav_routes: 'Rotas Locais',
    nav_tours: 'Passeios Guiados',
    nav_passport: 'Passaporte',
    nav_chat: 'Chat do Local',
    nav_vip: 'Clube VIP & Anfitrião',
    threat_all: 'Todos os Alertas',
    threat_crime: '🔴 Crime & Burlas',
    threat_nature: '🟠 Natureza & Clima Extremo',
    threat_wildlife: '🟡 Vida Selvagem & Fauna',
    threat_connectivity: '🔵 Conectividade & Emergência',
    legends_title: 'Lendas Secretas & Mitos das Cidades',
    legends_subtitle: 'O que os guias turísticos contam em segredo',
    vip_badge: 'ÁUDIO-GUIA VIP',
    emergency_title: 'Contactos de Emergência',
    tap_water: 'Água da Torneira',
    payment_method: 'Pagamentos & Numerário',
    toll_rules: 'Portagens & Vinhetas',
    esim_discount: '10% de desconto em eSIM com o código SCRATCH10',
    curated_spots: 'Recantos Secretos'
  },
  ru: {
    nav_radar: 'Радар безопасности и связь',
    nav_explore: 'Секретные места',
    nav_routes: 'Местные маршруты',
    nav_tours: 'Экскурсии',
    nav_passport: 'Паспорт путешественника',
    nav_chat: 'Локальный чат',
    nav_vip: 'VIP клуб и партнеры',
    threat_all: 'Все угрозы и предупреждения',
    threat_crime: '🔴 Преступность и мошенники',
    threat_nature: '🟠 Природные опасности и погода',
    threat_wildlife: '🟡 Дикие животные и фауна',
    threat_connectivity: '🔵 Связь и экстренные службы',
    legends_title: 'Городские легенды и тайны',
    legends_subtitle: 'То, о чем шепчут местные гиды',
    vip_badge: 'VIP АУДИОГИД',
    emergency_title: 'Экстренные службы',
    tap_water: 'Качество питьевой воды',
    payment_method: 'Оплата картами и наличные',
    toll_rules: 'Платные дороги и виньетки',
    esim_discount: 'Скидка 10% на eSIM по промокоду SCRATCH10',
    curated_spots: 'Отобранные тайные уголки'
  }
}

const STORAGE_KEY = 'snt_user_lang'

export function getActiveLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'de'
  const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null
  if (saved && ['de', 'en', 'es', 'fr', 'pt', 'ru'].includes(saved)) {
    return saved
  }
  const browserLang = navigator.language.slice(0, 2)
  if (['de', 'en', 'es', 'fr', 'pt', 'ru'].includes(browserLang)) {
    return browserLang as SupportedLanguage
  }
  return 'de'
}

export function setActiveLanguage(lang: SupportedLanguage): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang)
    window.dispatchEvent(new CustomEvent('snt_lang_changed', { detail: lang }))
  }
}

export function t(key: string, lang: SupportedLanguage = getActiveLanguage()): string {
  const dict = translations[lang] || translations.de
  return dict[key] || translations.de[key] || key
}
