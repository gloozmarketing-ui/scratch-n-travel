/**
 * National treasures rendered as line art inside a 240 x 240 box, so they can be
 * used behind the same scratch-foil mechanic as the map fragments.
 *
 * Every shape is built from primitives (domes, arches, ribs, rays) so the art
 * stays crisp at any size instead of relying on bitmaps.
 */

export type TreasureStroke = { d: string; fill?: boolean; width?: number };

export type Treasure = {
  id: string;
  country: string;
  /** Name of the treasure itself. */
  name: string;
  kicker: string;
  tone: "sunset" | "ocean" | "jungle" | "spice" | "berry" | "sand" | "ice" | "citrus";
  strokes: TreasureStroke[];
};

const onionDome = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w} ${base} C${cx - w} ${base - h * 0.45} ${cx - w * 1.15} ${base - h * 0.78} ${cx} ${
    base - h
  } C${cx + w * 1.15} ${base - h * 0.78} ${cx + w} ${base - h * 0.45} ${cx + w} ${base} Z`;

const cross = (cx: number, top: number, h: number, w: number) =>
  `M${cx} ${top} L${cx} ${top + h} M${cx - w} ${top + h * 0.32} L${cx + w} ${top + h * 0.32}`;

const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y} L${x} ${y - h} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y - h} L${x + w} ${y} Z`;

const archRow = (x0: number, y: number, count: number, w: number, gap: number, h: number) =>
  Array.from({ length: count }, (_, i) => arch(x0 + i * (w + gap), y, w, h)).join(" ");

const rays = (cx: number, cy: number, r0: number, r1: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return `M${(cx + Math.cos(a) * r0).toFixed(1)} ${(cy + Math.sin(a) * r0).toFixed(1)} L${(
      cx +
      Math.cos(a) * r1
    ).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}`;
  }).join(" ");

/** Symmetric maple leaf, mirrored from a half outline (y up, then flipped). */
const mapleLeaf = (cx: number, cy: number, s: number) => {
  const half: Array<[number, number]> = [
    [0, 92],
    [14, 56],
    [38, 64],
    [28, 38],
    [60, 48],
    [48, 24],
    [84, 14],
    [74, 2],
    [88, -14],
    [50, -16],
    [56, -34],
    [30, -24],
    [26, -32],
    [10, -40],
    [10, -92],
  ];
  const right = half.map(([x, y]) => [cx + (x * s) / 100, cy - (y * s) / 100] as const);
  const left = [...half]
    .reverse()
    .map(([x, y]) => [cx - (x * s) / 100, cy - (y * s) / 100] as const);
  const pts = [...right, ...left];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
};


export const treasures: Treasure[] = [
  {
    id: "ua-sofia",
    country: "Україна",
    name: "Sofien-Kuppeln",
    kicker: "Kyjiw · 11. Jh.",
    tone: "ocean",
    strokes: [
      { d: "M46 168 L194 168", width: 2.4 },
      { d: "M58 168 L58 132 L182 132 L182 168", width: 2 },
      { d: onionDome(120, 132, 27, 46), fill: true },
      { d: onionDome(76, 138, 18, 32), fill: true },
      { d: onionDome(164, 138, 18, 32), fill: true },
      { d: cross(120, 64, 22, 7), width: 2 },
      { d: cross(76, 90, 16, 5), width: 1.6 },
      { d: cross(164, 90, 16, 5), width: 1.6 },
      { d: "M70 168 L70 148 M92 168 L92 148 M148 168 L148 148 M170 168 L170 148", width: 1.4 },
      { d: "M112 168 L112 146 A8 8 0 0 1 128 146 L128 168", width: 1.6 },
    ],
  },
  {
    id: "it-colosseo",
    country: "Italia",
    name: "Colosseo",
    kicker: "Roma · 80 n. Chr.",
    tone: "spice",
    strokes: [
      { d: "M40 170 L200 170", width: 2.4 },
      { d: "M48 170 L48 74 A72 22 0 0 1 192 74 L192 170", width: 2 },
      { d: archRow(58, 158, 5, 22, 4, 20), width: 1.4 },
      { d: archRow(58, 128, 5, 22, 4, 20), width: 1.4 },
      { d: archRow(58, 98, 5, 22, 4, 18), width: 1.4 },
      { d: "M48 134 L192 134 M48 104 L192 104 M48 76 L192 76", width: 1.4 },
      { d: "M62 88 L62 76 M106 88 L106 76 M150 88 L150 76 M178 88 L178 76", width: 1.2 },
    ],
  },
  {
    id: "it-duomo",
    country: "Italia",
    name: "Cupola",
    kicker: "Firenze · Brunelleschi",
    tone: "sunset",
    strokes: [
      { d: "M52 170 L188 170", width: 2.4 },
      { d: "M64 170 L64 122 L176 122 L176 170", width: 2 },
      { d: "M64 122 C64 78 100 56 120 52 C140 56 176 78 176 122 Z", fill: true },
      { d: "M120 52 L120 122 M96 56 L86 122 M144 56 L154 122", width: 1.4 },
      { d: "M108 52 L108 38 L132 38 L132 52 Z", width: 1.6 },
      { d: "M120 24 L120 38 M114 30 L126 30", width: 1.6 },
      {
        d: "M78 170 L78 146 A8 8 0 0 1 94 146 L94 170 M146 170 L146 146 A8 8 0 0 1 162 146 L162 170",
        width: 1.5,
      },
    ],
  },
  {
    id: "jp-torii",
    country: "日本",
    name: "Torii & Fuji",
    kicker: "Miyajima · Honshū",
    tone: "berry",
    strokes: [
      { d: "M120 44 m-26 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0", width: 1.4 },
      { d: "M46 168 L120 86 L194 168 Z", width: 1.2 },
      { d: "M104 108 L112 118 L120 110 L128 120 L136 108", width: 1.2 },
      { d: "M34 170 L206 170", width: 2.4 },
      { d: "M54 60 C90 50 150 50 186 60 L182 70 C148 62 92 62 58 70 Z", fill: true },
      { d: "M64 84 L176 84 L174 94 L66 94 Z", fill: true },
      { d: "M80 70 L74 170 M160 70 L166 170", width: 3.4 },
    ],
  },
  {
    id: "il-menora",
    country: "ישראל",
    name: "Menora",
    kicker: "Jerusalem · Emblem",
    tone: "ice",
    strokes: [
      { d: "M120 62 L120 150", width: 3 },
      { d: "M120 106 C120 84 100 76 94 76 C88 76 86 82 86 88 L86 62", width: 2.2 },
      { d: "M120 106 C120 84 140 76 146 76 C152 76 154 82 154 88 L154 62", width: 2.2 },
      { d: "M120 116 C120 92 92 82 76 86 C66 89 64 96 64 102 L64 62", width: 2.2 },
      { d: "M120 116 C120 92 148 82 164 86 C174 89 176 96 176 102 L176 62", width: 2.2 },
      { d: "M120 126 C120 100 80 88 58 94 C46 98 44 106 44 114 L44 62", width: 2.2 },
      { d: "M120 126 C120 100 160 88 182 94 C194 98 196 106 196 114 L196 62", width: 2.2 },
      { d: "M98 150 L142 150 L152 168 L88 168 Z", fill: true },
      { d: "M108 168 L132 168 L132 158 L108 158 Z", width: 1.4 },
      {
        d: "M44 58 a4 4 0 1 0 0.1 0 M64 58 a4 4 0 1 0 0.1 0 M86 58 a4 4 0 1 0 0.1 0 M120 58 a4 4 0 1 0 0.1 0 M154 58 a4 4 0 1 0 0.1 0 M176 58 a4 4 0 1 0 0.1 0 M196 58 a4 4 0 1 0 0.1 0",
        fill: true,
      },
    ],
  },
  {
    id: "fr-tour",
    country: "France",
    name: "Tour Eiffel",
    kicker: "Paris · 1889",
    tone: "sand",
    strokes: [
      { d: "M42 170 L198 170", width: 2.4 },
      { d: "M54 170 C88 134 108 94 116 36 M186 170 C152 134 132 94 124 36", width: 2.2 },
      { d: "M116 36 L124 36 M120 20 L120 36", width: 1.8 },
      { d: "M68 142 L172 142 M80 116 L160 116 M94 86 L146 86 M106 58 L134 58", width: 1.5 },
      { d: "M68 142 C88 132 152 132 172 142", width: 1.5 },
      { d: "M80 116 L160 116 L146 86 L94 86 Z", width: 1.2 },
      { d: "M94 86 L146 86 L134 58 L106 58 Z", width: 1.2 },
      { d: "M84 170 L156 170", width: 1.4 },
    ],
  },
  {
    id: "ar-mate",
    country: "Argentina",
    name: "Mate & Sol",
    kicker: "Rioplatense · Sol de Mayo",
    tone: "citrus",
    strokes: [
      { d: rays(120, 66, 32, 48, 24), width: 1.4 },
      { d: "M120 66 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0", width: 1.8 },
      { d: "M120 66 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0", fill: true },
      { d: "M96 130 C96 120 144 120 144 130 C144 158 134 170 120 170 C106 170 96 158 96 130 Z", fill: true },
      { d: "M96 130 C104 136 136 136 144 130", width: 1.6 },
      { d: "M132 126 L164 100", width: 3 },
      { d: "M162 96 L170 104", width: 3 },
    ],
  },
  {
    id: "ca-maple",
    country: "Canada",
    name: "Maple Leaf",
    kicker: "Acer · Emblem",
    tone: "jungle",
    strokes: [
      { d: mapleLeaf(120, 100, 76), fill: true },
      { d: "M120 168 L120 108 M120 128 L100 112 M120 128 L140 112", width: 1.6 },
    ],
  },
];

