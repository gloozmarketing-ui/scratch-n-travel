import type { LocalRoute, RoutePhoto } from './routes'

/**
 * Seed-Routen.
 *
 * WICHTIG: Das sind Demonstrationsinhalte mit echten Koordinaten. Sie zeigen,
 * *wie* eine Route aufgebaut ist — nicht, was es in Lissabon zu sehen gibt.
 * Die Seite traegt deshalb ein DemoDataBadge.
 *
 * Die Foto-URL zeigt bewusst auf einen Platzhalter: es gibt noch keinen
 * Storage-Bucket, und eine Attrappe waere ehrlicher als ein toter Link.
 */

const photo = (
  id: string,
  routeId: string,
  stopId: string,
  authorHandle: string,
  caption: string,
  hoursAgo: number,
  hasPerson = false,
): RoutePhoto => ({
  id,
  routeId,
  stopId,
  authorHandle,
  caption,
  urls: ['https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=70'],
  createdAt: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
  visibleAt: new Date(Date.now() - (hoursAgo - 6) * 3600_000).toISOString(),
  facesBlurred: true,
  hasPerson,
  // Nur Personenfotos bekommen ein Ablaufdatum — genau so erzwingt es der
  // CHECK-Constraint in schema.sql.
  expiresAt: hasPerson
    ? new Date(Date.now() + 24 * 3600_000).toISOString()
    : null,
  status: hoursAgo >= 6 ? 'visible' : 'in_delay',
})

export const localRoutes: LocalRoute[] = [
  {
    id: 'r-lis-01',
    name: 'Lissabon ohne Touristentrampen',
    authorHandle: '@mariacurto',
    authorName: 'Maria Curto',
    authorInitials: 'MC',
    authorTrustLevel: 4,
    authorIsLocal: true,
    city: 'Lissabon',
    country: 'Portugal',
    countryCode: 'PT',
    blurb:
      'Seit zwölf Jahren hier. Fünf Orte, an denen ich mit Freunden hingehe — und an denen ich niemandem etwas erklären muss. Der Kaffee am Ende ist die Belohnung.',
    mood: 'gemütlich',
    tags: ['nur-zu-fuss', 'sundowner', 'keine-massen'],
    upvotes: 248,
    downvotes: 3,
    hasUpvoted: false,
    following: false,
    completions: 61,
    createdAt: '2026-06-14T10:00:00.000Z',
    completedStopIds: ['s-lis-1', 's-lis-2', 's-lis-3'],
    nextStopId: 's-lis-4',
    stops: [
      {
        id: 's-lis-1', routeId: 'r-lis-01', order: 1,
        title: 'Feira da Ladra, kurz nach acht',
        note: 'Wenn die Hunde noch schlafen. Der Trödelmarkt öffnet um zehn, vorher gehört das Viertel den Lieferfahrern und einer Katze, die hier wohnt.',
        lat: 38.7128, lng: -9.1355, dwellMinutes: 40,
      },
      {
        id: 's-lis-2', routeId: 'r-lis-01', order: 2,
        title: 'Pastéis in der Rua da Bica',
        note: 'Nicht an der Touristenstraße. Zwei Haltestellen rein, dann das dritte Lokal links. Frag nach dem „seco“ — und iss ihn im Stehen, das ist hier so Brauch.',
        lat: 38.7117, lng: -9.1435, dwellMinutes: 25,
      },
      {
        id: 's-lis-3', routeId: 'r-lis-01', order: 3,
        title: 'Miradouro de Santa Catarina',
        note: 'Die Aussicht ist schön, aber das ist nicht der Grund. Der Grund ist, dass man hier sitzen kann, ohne etwas zu kaufen. Abends kommen die Tänzer aus Bairro Alto.',
        lat: 38.7104, lng: -9.1472, dwellMinutes: 30,
      },
      {
        id: 's-lis-4', routeId: 'r-lis-01', order: 4,
        title: 'Der Wasserfall im Centro Cultural',
        note: 'Es ist ein Hinterhof, kein Wasserfall. Der Strom kommt aus einer Leitung, die für ein Fado-Festival installiert und nie wieder abgebaut wurde. Ich war nur einmal dort, im Winter.',
        lat: 38.7091, lng: -9.1459, dwellMinutes: 20,
      },
      {
        id: 's-lis-5', routeId: 'r-lis-01', order: 5,
        title: 'Kunsthändler in Alfama',
        note: 'Dritter Stock, ohne Aufzug, die Tür ist offen, weil sie offen ist. Frag nicht nach Preisen und sag, dass du von hier kommst. Zwei Termine am Tag, sonst nichts.',
        lat: 38.7134, lng: -9.1291, dwellMinutes: 35,
      },
    ],
    photos: [
      photo('ph-1', 'r-lis-01', 's-lis-2', '@tobiasf', 'Der Seco um neun.', 30),
      photo('ph-2', 'r-lis-01', 's-lis-3', '@mareik', 'Sitzen ist hier kostenlos.', 14),
      photo('ph-3', 'r-lis-01', 's-lis-4', '@anonymous_traveller', '', 2),
    ],
  },
  {
    id: 'r-por-01',
    name: 'Porto, bevor es Mittag wird',
    authorHandle: '@joaoribeiro',
    authorName: 'João Ribeiro',
    authorInitials: 'JR',
    authorTrustLevel: 3,
    authorIsLocal: true,
    city: 'Porto',
    country: 'Portugal',
    countryCode: 'PT',
    blurb:
      'Meine Stadt, mein Tempo. Drei Hügel, vier Blicke, und das Frühstück, das ich seit zwanzig Jahren jeden Samstag esse. Für den Rest des Tages brauchst du keinen Plan.',
    mood: 'schnell',
    tags: ['frühstück', 'aussicht', 'unter-20-euro'],
    upvotes: 187,
    downvotes: 1,
    hasUpvoted: true,
    following: true,
    completions: 44,
    createdAt: '2026-05-02T08:30:00.000Z',
    completedStopIds: [],
    nextStopId: 's-por-1',
    stops: [
      {
        id: 's-por-1', routeId: 'r-por-01', order: 1,
        title: 'Café Santiago, offene Tür',
        note: 'Steht seit vierzig Jahren an derselben Stelle. Die Kundschaft wechselt, das Rezept nicht. Zwingt dich niemand, dich zu setzen.',
        lat: 41.1420, lng: -8.6080, dwellMinutes: 30,
      },
      {
        id: 's-por-2', routeId: 'r-por-01', order: 2,
        title: 'Igreja dos Clérigos von hinten',
        note: 'Jeder kennt die Front. Von hinten, über die kleine Treppe links, stehst du allein. Bestes Licht um neun.',
        lat: 41.1456, lng: -8.6148, dwellMinutes: 20,
      },
      {
        id: 's-por-3', routeId: 'r-por-01', order: 3,
        title: 'Cais da Ribeira, Ostseite',
        note: 'Die berühmte Seite ist voller Jacken. Ostwärts wird es ruhiger und du kannst mit den Fischen sprechen, die dort früh anfangen.',
        lat: 41.1406, lng: -8.6084, dwellMinutes: 45,
      },
      {
        id: 's-por-4', routeId: 'r-por-01', order: 4,
        title: 'Miradouro da Vitória',
        note: 'Zugänglich, ohne Treppen, mit Aussicht über die Brücke. Die rare Alternative für alle, die mit Kinderwagen kommen.',
        lat: 41.1449, lng: -8.6090, dwellMinutes: 25,
      },
    ],
    photos: [photo('ph-4', 'r-por-01', 's-por-1', '@sandra_k', 'Immer voll, aber man kommt rein.', 9)],
  },
  {
    id: 'r-isl-01',
    name: 'Reykjavík für Januar-Leute',
    authorHandle: '@bjorn_h',
    authorName: 'Björn H.',
    authorInitials: 'BH',
    authorTrustLevel: 4,
    authorIsLocal: true,
    city: 'Reykjavík',
    country: 'Island',
    countryCode: 'IS',
    blurb:
      'Für alle, die dachten, Island wäre nur Wasserfälle. Ich zeige dir die Orte, an denen ich im Januar sitze, wenn alle anderen im Warmen sind.',
    mood: 'verwirrend',
    tags: ['wintertauglich', 'ohne-tour', 'heissquellen'],
    upvotes: 412,
    downvotes: 7,
    hasUpvoted: false,
    following: false,
    completions: 130,
    createdAt: '2026-07-21T16:00:00.000Z',
    completedStopIds: ['s-isl-1', 's-isl-2', 's-isl-3', 's-isl-4', 's-isl-5'],
    stops: [
      {
        id: 's-isl-1', routeId: 'r-isl-01', order: 1,
        title: 'Laugardalur, kurz vor sieben',
        note: 'Das einzige warme Freibad ohne nennenswerten Eintritt. Im Januar sind hier acht Leute, im Juli vierhundert.',
        lat: 64.1466, lng: -21.8786, dwellMinutes: 45,
      },
      {
        id: 's-isl-2', routeId: 'r-isl-01', order: 2,
        title: 'Öskjuhlíð, der alte Park',
        note: 'Zwischen den Hochhäusern und völlig tot. Man sieht, dass Island auch mal Wald hatte — nur eben kaum.',
        lat: 64.1417, lng: -21.8866, dwellMinutes: 30,
      },
      {
        id: 's-isl-3', routeId: 'r-isl-01', order: 3,
        title: 'Grillstand in Norðurmýri',
        note: 'Lamburger für drei Euro, direkt neben dem Schwimmbad. Ich weiß, dass es touristisch klingt. Es ist trotzdem der beste Hotdog Islands.',
        lat: 64.1380, lng: -21.8940, dwellMinutes: 25,
      },
      {
        id: 's-isl-4', routeId: 'r-isl-01', order: 4,
        title: 'Hólavallagarður, die hinterste Bank',
        note: 'Die Haltestelle heißt wie der Friedhof, ist aber ein Park. Letzte Bank vor dem Abbruch, perfekter Windschutz.',
        lat: 64.1400, lng: -21.9330, dwellMinutes: 20,
      },
      {
        id: 's-isl-5', routeId: 'r-isl-01', order: 5,
        title: 'Kolaportið, nur wenn die Läden zu sind',
        note: 'Nur samstags, nur wenn zu. Zwölf Läden, alle mit dem gleichen Eisen, alle mit Lampen aus zweiter Hand. Wie ein Museum, das man anfassen darf.',
        lat: 64.1475, lng: -21.9390, dwellMinutes: 40,
      },
    ],
    photos: [photo('ph-5', 'r-isl-01', 's-isl-1', '@fjord_runner', 'Acht Leute, ehrlich.', 50)],
  },
  {
    id: 'r-rom-01',
    name: 'Transsilvanien abseits der Postkarten',
    authorHandle: '@elenamunteanu',
    authorName: 'Elena Munteanu',
    authorInitials: 'EM',
    authorTrustLevel: 2,
    authorIsLocal: true,
    city: 'Sibiu',
    country: 'Rumänien',
    countryCode: 'RO',
    blurb:
      'Ich bin keine Reisebloggerin, ich arbeite hier. Was ich empfehle, kann ich dir auch zeigen — deshalb ist alles fußläufig und fast umsonst.',
    mood: 'romantisch',
    tags: ['fußläufig', 'gratis', 'mittagessen'],
    upvotes: 94,
    downvotes: 0,
    hasUpvoted: false,
    following: false,
    completions: 12,
    createdAt: '2026-08-09T12:00:00.000Z',
    completedStopIds: ['s-rom-1'],
    nextStopId: 's-rom-2',
    stops: [
      {
        id: 's-rom-1', routeId: 'r-rom-01', order: 1,
        title: 'Der Nebel über dem Großen Platz',
        note: 'Vor neun Uhr. Um zehn ist der Platz ein Café. Im Herbst steht der Nebel so, dass man die Kirche nur halb sieht. Das ist der Moment, den Leute fotografieren wollen und den sie nie bekommen.',
        lat: 45.7975, lng: 24.1500, dwellMinutes: 30,
      },
      {
        id: 's-rom-2', routeId: 'r-rom-01', order: 2,
        title: 'Cena la Ceaună',
        note: 'Mittag für sechs Lei. Komm um eins, dann ist die Karte auf Deutsch. Das ist der Trick, den mir niemand geglaubt hat.',
        lat: 45.7968, lng: 24.1517, dwellMinutes: 60,
      },
      {
        id: 's-rom-3', routeId: 'r-rom-01', order: 3,
        title: 'Aegir Bruch, wenn die Führung kostenlos ist',
        note: 'Winzerei seit 1211. Die Führung kostet nichts, um vierzehn Uhr gießt der Winzer etwas aus, das nicht auf der Karte steht. Sag, ich schicke dich.',
        lat: 45.8100, lng: 24.1800, dwellMinutes: 90,
      },
    ],
    photos: [],
  },
  {
    id: 'r-rtr-01',
    name: 'Mein Frühstücksmarkt in Chiang Mai',
    authorHandle: '@somchai_t',
    authorName: 'Somchai T.',
    authorInitials: 'ST',
    authorTrustLevel: 1,
    authorIsLocal: true,
    city: 'Chiang Mai',
    country: 'Thailand',
    countryCode: 'TH',
    blurb:
      'Eine Handvoll Orte. Ich bin erst seit zwei Jahren hier und lerne noch — aber ich lerne das Richtige, und das ist mehr wert als fünf Jahre Google.',
    mood: 'hungrig',
    tags: ['günstig', 'streetfood', 'anfänger'],
    upvotes: 76,
    downvotes: 2,
    hasUpvoted: false,
    following: false,
    completions: 7,
    createdAt: '2026-09-01T09:00:00.000Z',
    completedStopIds: [],
    nextStopId: 's-rtr-1',
    stops: [
      {
        id: 's-rtr-1', routeId: 'r-rtr-01', order: 1,
        title: 'Warorot, vor sieben',
        note: 'Um sieben ist es ein Markt, um zehn ist es ein Museum für Touristen. Khao soi: die eine Frau ganz hinten links, nicht die mit der Google-Rezension.',
        lat: 18.7870, lng: 98.9970, dwellMinutes: 45,
      },
      {
        id: 's-rtr-2', routeId: 'r-rtr-01', order: 2,
        title: 'Wat Phra Singh, westliches Tor',
        note: 'Die meisten gehen durch das östliche. Von Westen kommst du in den Hof, den niemand fotografiert, weil er keine Postkarte ist.',
        lat: 18.7886, lng: 98.9868, dwellMinutes: 30,
      },
      {
        id: 's-rtr-3', routeId: 'r-rtr-01', order: 3,
        title: 'Doi Suthep, obere Stufe',
        note: 'Nicht die 306 Stufen, die alle zählen. Nimm den Songthawe hinter dem Kloster, dann bist du in zehn Minuten oben und es ist ruhig.',
        lat: 18.8048, lng: 98.9217, dwellMinutes: 120,
      },
    ],
    photos: [photo('ph-6', 'r-rtr-01', 's-rtr-2', '@noa.w', '', 1)],
  },
]


