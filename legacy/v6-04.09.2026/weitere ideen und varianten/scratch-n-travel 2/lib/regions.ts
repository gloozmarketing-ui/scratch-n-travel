// lib/regions.ts
// EINZIGE Stelle im Code, die regions.config.json lädt und typisiert.
// Kein Screen, keine Komponente darf Regionsnamen/-codes hartkodieren —
// harte Regel 1 aus dem Masterprompt (Kapitel 36).

export interface RegionConfig {
  code: string;
  name: string;
  hub: string;
  flag: string;
  theme: string;
  geojsonPath: string;
  scratchThreshold: number;
  hazardLayerEnabled: boolean;
  unlockables: string[];
}

export interface RegionsFile {
  version: string;
  preset: string;
  presetLabel: string;
  regions: RegionConfig[];
}

const CONFIG_PATH = "/geo/regions.config.json";

/**
 * Lädt die aktive Regionen-Config. Server- und Client-Components können das
 * gleichermaßen aufrufen (relativer Pfad unter /public).
 * Um ein anderes Preset zu aktivieren: Datei unter demselben Pfad ersetzen —
 * kein Deploy-Code ändert sich (siehe regions.config.wine-regions.example.json).
 */
export async function getRegions(): Promise<RegionsFile> {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      : "";
  const res = await fetch(`${base}${CONFIG_PATH}`, {
    // Regionen ändern sich selten -> ISR statt bei jedem Request neu laden
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`regions.config.json konnte nicht geladen werden (${res.status})`);
  }
  return res.json();
}

export function findRegion(regions: RegionConfig[], code: string): RegionConfig | undefined {
  return regions.find((r) => r.code === code);
}
