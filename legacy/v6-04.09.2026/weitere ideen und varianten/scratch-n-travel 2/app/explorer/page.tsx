// app/explorer/page.tsx
// Beweis für den Architektur-Test aus Kapitel 0/17: Diese Seite enthält
// keinerlei Regionsnamen — alles kommt aus getRegions().
import { getRegions } from "@/lib/regions";
import { ExplorerClient } from "./ExplorerClient";

export default async function ExplorerPage() {
  const { regions, preset, presetLabel } = await getRegions();

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "var(--font-hud)", fontSize: "var(--fs-micro)", color: "var(--accent-teal)" }}>
        AKTIVES PRESET: {preset} — {presetLabel}
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", marginTop: 8 }}>
        City Explorer
      </h1>
      <ExplorerClient regions={regions} />
    </main>
  );
}
