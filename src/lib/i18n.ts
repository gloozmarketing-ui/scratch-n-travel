import { useState, useEffect, useCallback } from 'react'

/**
 * Lightweight Zero-Dependency Internationalization (i18n) Engine
 * 
 * Unterstützt DACH (DE/AT/CH), EN, ES, FR, PT, UK (Українська) und RU
 * mit synchronem Wechsel im Header/Footer und lokaler Persistenz.
 */

export type SupportedLanguage = 'de' | 'en' | 'es' | 'fr' | 'pt' | 'uk' | 'ru'

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
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'ru', label: 'Русский', flag: '🕊️' }
]

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    nav_home: 'Start',
    nav_radar: 'Gefahrenlage & Radar',
    nav_explore: 'Geheimtipps',
    nav_routes: 'Local-Routen',
    nav_tours: 'Touren',
    nav_stories: 'Erzählungen',
    nav_people: 'Gleichgesinnte',
    nav_meetups: 'Meetups',
    nav_chat: 'Nachrichten',
    nav_passport: 'Reisepass',
    nav_scratch: 'Postkarten',
    nav_wanderbond: 'Was dich treibt',
    nav_badges: 'Erfolge',
    nav_checklists: 'Packliste',
    nav_safety: 'Sicher unterwegs',
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
    emergency_eu: 'Euronotruf 112 (EU-weit: Polizei, Notarzt & Feuerwehr)',
    tap_water: 'Trinkwasser-Sicherheit',
    payment_method: 'Zahlungsmittel & Bargeld',
    toll_rules: 'Maut & Vignetten',
    esim_discount: '10% eSIM Rabatt mit Code SCRATCH10',
    curated_spots: 'Kuratierte Geheimtipps',
    logout: 'Abmelden',
    login: 'Anmelden'
  },
  en: {
    nav_home: 'Home',
    nav_radar: 'Safety Radar & Intel',
    nav_explore: 'Secret Spots',
    nav_routes: 'Local Routes',
    nav_tours: 'Guided Tours',
    nav_stories: 'Stories',
    nav_people: 'Fellow Travelers',
    nav_meetups: 'Meetups',
    nav_chat: 'Messages',
    nav_passport: 'Passport',
    nav_scratch: 'Postcards',
    nav_wanderbond: 'Your Travel DNA',
    nav_badges: 'Achievements',
    nav_checklists: 'Packing List',
    nav_safety: 'Safe Travels',
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
    emergency_eu: 'Euro Emergency 112 (EU-wide: Police, Ambulance, Fire)',
    tap_water: 'Tap Water Safety',
    payment_method: 'Payment & Cash Rules',
    toll_rules: 'Tolls & Highway Vignettes',
    esim_discount: '10% eSIM discount with code SCRATCH10',
    curated_spots: 'Curated Hidden Gems',
    logout: 'Log out',
    login: 'Log in'
  },
  es: {
    nav_home: 'Inicio',
    nav_radar: 'Radar de Seguridad',
    nav_explore: 'Lugares Secretos',
    nav_routes: 'Rutas Locales',
    nav_tours: 'Tours Guiados',
    nav_stories: 'Relatos',
    nav_people: 'Compañeros',
    nav_meetups: 'Encuentros',
    nav_chat: 'Mensajes',
    nav_passport: 'Pasaporte',
    nav_scratch: 'Postales',
    nav_wanderbond: 'Tu Perfil Viajero',
    nav_badges: 'Insignias',
    nav_checklists: 'Equipaje',
    nav_safety: 'Seguridad',
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
    emergency_eu: 'Emergencia Europea 112 (Policía, Médicos, Bomberos)',
    tap_water: 'Agua Potable',
    payment_method: 'Pagos & Efectivo',
    toll_rules: 'Peajes & Viñetas',
    esim_discount: '10% dto. en eSIM con el código SCRATCH10',
    curated_spots: 'Joyas Ocultas Curadas',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión'
  },
  fr: {
    nav_home: 'Accueil',
    nav_radar: 'Radar de Sécurité',
    nav_explore: 'Lieux Secrets',
    nav_routes: 'Itinéraires Locaux',
    nav_tours: 'Visites Guidées',
    nav_stories: 'Récits',
    nav_people: 'Voyageurs',
    nav_meetups: 'Rencontres',
    nav_chat: 'Messages',
    nav_passport: 'Passeport',
    nav_scratch: 'Cartes Postales',
    nav_wanderbond: 'Votre Profil',
    nav_badges: 'Succès',
    nav_checklists: 'Bagages',
    nav_safety: 'Sécurité',
    nav_vip: 'Club VIP & Hôte',
    threat_all: 'Toutes les Alertes',
    threat_crime: '🔴 Criminalité & Arnaques',
    threat_nature: '🟠 Nature & Météo',
    threat_wildlife: '🟡 Faune Sauvage',
    threat_connectivity: '🔵 Connectivité & Urgence',
    legends_title: 'Légendes Urbaines & Mystères',
    legends_subtitle: 'Ce que racontent les guides touristiques locaux',
    vip_badge: 'GUIDE AUDIO VIP',
    emergency_title: 'Numéros d’Urgence',
    emergency_eu: 'Urgence Européenne 112 (Police, SAMU, Pompiers)',
    tap_water: 'Eau du Robinet',
    payment_method: 'Moyens de Paiement & Espèces',
    toll_rules: 'Péages & Vignettes',
    esim_discount: '10% de réduction eSIM avec le code SCRATCH10',
    curated_spots: 'Pépites Cachées',
    logout: 'Déconnexion',
    login: 'Connexion'
  },
  pt: {
    nav_home: 'Início',
    nav_radar: 'Radar de Segurança',
    nav_explore: 'Lugares Secretos',
    nav_routes: 'Rotas Locais',
    nav_tours: 'Passeios Guiados',
    nav_stories: 'Histórias',
    nav_people: 'Companheiros',
    nav_meetups: 'Encontros',
    nav_chat: 'Mensagens',
    nav_passport: 'Passaporte',
    nav_scratch: 'Postais',
    nav_wanderbond: 'O teu Perfil',
    nav_badges: 'Distintivos',
    nav_checklists: 'Bagagem',
    nav_safety: 'Segurança',
    nav_vip: 'Clube VIP & Anfitrião',
    threat_all: 'Todos os Alertas',
    threat_crime: '🔴 Crime & Burlas',
    threat_nature: '🟠 Natureza & Clima Extremo',
    threat_wildlife: '🟡 Vida Selvagem & Fauna',
    threat_connectivity: '🔵 Conectividade & Emergência',
    legends_title: 'Lendas Secretas das Cidades',
    legends_subtitle: 'O que os guias turísticos contam em segredo',
    vip_badge: 'ÁUDIO-GUIA VIP',
    emergency_title: 'Contactos de Emergência',
    emergency_eu: 'Número Europeu 112 (Polícia, Ambulância, Bombeiros)',
    tap_water: 'Água da Torneira',
    payment_method: 'Pagamentos & Numerário',
    toll_rules: 'Portagens & Vinhetas',
    esim_discount: '10% de desconto em eSIM com o código SCRATCH10',
    curated_spots: 'Recantos Secretos',
    logout: 'Terminar sessão',
    login: 'Iniciar sessão'
  },
  uk: {
    nav_home: 'Головна',
    nav_radar: 'Радар безпеки та зв’язок',
    nav_explore: 'Секретні місця',
    nav_routes: 'Локальні маршрути',
    nav_tours: 'Тури з гідом',
    nav_stories: 'Історії',
    nav_people: 'Однодумці',
    nav_meetups: 'Зустрічі',
    nav_chat: 'Повідомлення',
    nav_passport: 'Паспорт мандрівника',
    nav_scratch: 'Листівки',
    nav_wanderbond: 'Ваш профіль мандрів',
    nav_badges: 'Досягнення',
    nav_checklists: 'Список речей',
    nav_safety: 'Безпека в дорозі',
    nav_vip: 'VIP Клуб & Партнери',
    threat_all: 'Всі загрози та застереження',
    threat_crime: '🔴 Злочинність і шахрайство',
    threat_nature: '🟠 Природні явища та погода',
    threat_wildlife: '🟡 Дика природа та фауна',
    threat_connectivity: '🔵 Зв’язок та екстрені служби',
    legends_title: 'Таємні міські легенди та міфи',
    legends_subtitle: 'Про що шепочуть місцеві екскурсоводи',
    vip_badge: 'VIP АУДІОГІД',
    emergency_title: 'Екстрені номери та допомога',
    emergency_eu: 'Єдиний європейський номер 112 (Поліція, Швидка, Пожежні)',
    tap_water: 'Якість питної води',
    payment_method: 'Оплата картками та готівка',
    toll_rules: 'Платні дороги та віньєтки',
    esim_discount: 'Знижка 10% на eSIM за кодом SCRATCH10',
    curated_spots: 'Відібрані секретні куточки',
    logout: 'Вийти з акаунта',
    login: 'Увійти'
  },
  ru: {
    nav_home: 'Главная',
    nav_radar: 'Радар безопасности и связь',
    nav_explore: 'Секретные места',
    nav_routes: 'Местные маршруты',
    nav_tours: 'Экскурсии',
    nav_stories: 'Истории',
    nav_people: 'Попутчики',
    nav_meetups: 'Встречи',
    nav_chat: 'Сообщения',
    nav_passport: 'Паспорт путешественника',
    nav_scratch: 'Открытки',
    nav_wanderbond: 'Ваш профиль',
    nav_badges: 'Достижения',
    nav_checklists: 'Список вещей',
    nav_safety: 'Безопасность',
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
    emergency_eu: 'Единый номер 112 (Полиция, Скорая, Пожарные)',
    tap_water: 'Качество питьевой воды',
    payment_method: 'Оплата картами и наличные',
    toll_rules: 'Платные дороги и виньетки',
    esim_discount: 'Скидка 10% на eSIM по промокоду SCRATCH10',
    curated_spots: 'Отобранные тайные уголки',
    logout: 'Выйти',
    login: 'Войти'
  }
}

const STORAGE_KEY = 'snt_user_lang'

export function getActiveLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'de'
  const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null
  if (saved && ['de', 'en', 'es', 'fr', 'pt', 'uk', 'ru'].includes(saved)) {
    return saved
  }
  const browserLang = navigator.language.slice(0, 2)
  if (['de', 'en', 'es', 'fr', 'pt', 'uk', 'ru'].includes(browserLang)) {
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

/**
 * Reaktivität-Hook für alle React-Komponenten.
 * Sorgt dafür, dass Änderungen synchron alle geöffneten Ansichten aktualisieren.
 */
export function useI18n() {
  const [lang, setLangState] = useState<SupportedLanguage>(getActiveLanguage)

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLanguage>
      if (customEvent.detail) {
        setLangState(customEvent.detail)
      }
    }
    window.addEventListener('snt_lang_changed', handleLangChange)
    return () => window.removeEventListener('snt_lang_changed', handleLangChange)
  }, [])

  const changeLanguage = useCallback((newLang: SupportedLanguage) => {
    setActiveLanguage(newLang)
    setLangState(newLang)
  }, [])

  const translate = useCallback((key: string) => {
    return t(key, lang)
  }, [lang])

  return {
    lang,
    setLanguage: changeLanguage,
    t: translate,
  }
}
