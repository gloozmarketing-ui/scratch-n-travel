/**
 * Scratch-map regions.
 *
 * Every `path` is drawn inside a 240 x 240 coordinate box so the same string can
 * be used both as an SVG path and as a CSS `clip-path: path(...)` on a 240px tile.
 * Shapes come from real Natural Earth borders (see world-paths.ts).
 */

import { regionShapes } from "./world-paths";

export type ScratchRegion = {
  id: string;
  /** Region / country name shown after the scratch. */
  name: string;
  /** Short kicker, e.g. continent or vibe family. */
  kicker: string;
  /** Design-system color token name (see src/styles.css). */
  tone:
    | "sunset"
    | "ocean"
    | "jungle"
    | "spice"
    | "berry"
    | "sand"
    | "ice"
    | "citrus";
  /** Words that appear underneath the scratch surface. */
  words: string[];
  path: string;
};

const regionSeeds: Omit<ScratchRegion, "path">[] = [
  {
    id: "iberia",
    name: "Iberia",
    kicker: "Portugal · Spain",
    tone: "sunset",
    words: ["Pastel de Nata", "Fado", "Point break", "Sobremesa"],
  },
  {
    id: "italy",
    name: "Italia",
    kicker: "Mediterraneo",
    tone: "spice",
    words: ["Cacio e Pepe", "Opera", "Passeggiata", "Romantic"],
  },
  {
    id: "greece",
    name: "Hellas",
    kicker: "Aegean",
    tone: "ocean",
    words: ["Souvlaki", "Rebetiko", "Island hop", "Meltemi"],
  },
  {
    id: "morocco",
    name: "Maghreb",
    kicker: "Morocco",
    tone: "sand",
    words: ["Tajine", "Gnawa", "Taghazout lines", "Souk vibe"],
  },
  {
    id: "brazil",
    name: "Brasil",
    kicker: "South America",
    tone: "jungle",
    words: ["Feijoada", "Samba", "Beach break", "Saudade"],
  },
  {
    id: "japan",
    name: "Nihon",
    kicker: "East Asia",
    tone: "berry",
    words: ["Ramen", "City pop", "Onsen ritual", "Experience"],
  },
  {
    id: "indonesia",
    name: "Nusantara",
    kicker: "Bali · Java",
    tone: "jungle",
    words: ["Nasi Goreng", "Gamelan", "Reef pass", "Slow flow"],
  },
  {
    id: "iceland",
    name: "Ísland",
    kicker: "North Atlantic",
    tone: "ice",
    words: ["Plokkfiskur", "Ambient", "Cold water", "Aurora vibe"],
  },
  {
    id: "scandinavia",
    name: "Norden",
    kicker: "Norway · Sweden",
    tone: "ice",
    words: ["Kanelbulle", "Nordic jazz", "Fjord dip", "Friluftsliv"],
  },
  {
    id: "india",
    name: "Bharat",
    kicker: "South Asia",
    tone: "spice",
    words: ["Thali", "Carnatic", "Monsoon swell", "Sacred vibe"],
  },
  {
    id: "mexico",
    name: "México",
    kicker: "North America",
    tone: "citrus",
    words: ["Mole", "Cumbia", "Pointbreak", "Sobremesa"],
  },
  {
    id: "australia",
    name: "Australia",
    kicker: "Oceania",
    tone: "sunset",
    words: ["Barra & bush lime", "Pub rock", "Reef break", "Roadtrip vibe"],
  },
  {
    id: "turkiye",
    name: "Anatolia",
    kicker: "Türkiye",
    tone: "spice",
    words: ["Mezze", "Saz", "Hammam ritual", "Crossroads vibe"],
  },
  {
    id: "peru",
    name: "Perú",
    kicker: "Andes · Pacific",
    tone: "citrus",
    words: ["Ceviche", "Chicha", "Longest left", "Altitude vibe"],
  },
  {
    id: "vietnam",
    name: "Việt Nam",
    kicker: "Southeast Asia",
    tone: "jungle",
    words: ["Phở", "Bolero", "Typhoon swell", "Street vibe"],
  },
  {
    id: "westafrica",
    name: "West Africa",
    kicker: "Senegal · Ghana",
    tone: "sunset",
    words: ["Jollof", "Afrobeats", "Dakar sandbar", "Teranga"],
  },
];

export const scratchRegions: ScratchRegion[] = regionSeeds
  .map((r) => ({ ...r, path: regionShapes[r.id] ?? "" }))
  .filter((r) => r.path.length > 0);

/** Northern Eurasia — 2030 Free Nations map (post-federation regions). */
export const freeNations = [
  { id: "muscovy", name: "Muscovy", tone: "berry" },
  { id: "idel-ural", name: "Idel-Ural", tone: "spice" },
  { id: "caucasus", name: "Free Caucasus", tone: "sunset" },
  { id: "siberia", name: "Siberian Republic", tone: "ice" },
  { id: "ural", name: "Ural Republic", tone: "sand" },
  { id: "sakha", name: "Sakha", tone: "ocean" },
  { id: "baikal", name: "Baikalia", tone: "jungle" },
  { id: "farEast", name: "Pacific Far East", tone: "citrus" },
  { id: "karelia", name: "Karelia", tone: "ocean" },
] as const;
