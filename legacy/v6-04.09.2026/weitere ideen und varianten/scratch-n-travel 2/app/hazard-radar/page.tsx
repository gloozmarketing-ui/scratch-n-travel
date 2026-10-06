// app/hazard-radar/page.tsx
// Persona P2 (Familie), P3 (Adrenalin) — 8.9. Datenquelle: externe Wetter-/
// Katastrophen-API, Caching 15 Minuten client-seitig, Cron 1x/Tag serverseitig
// (Vercel-Free-Tier-Limit, Kap. 14.2).
import { getRegions } from "@/lib/regions";
import { HazardRadarClient } from "./HazardRadarClient";

export default async function HazardRadarPage() {
  const { regions } = await getRegions();
  const hazardRegions = regions.filter((r) => r.hazardLayerEnabled);

  return (
    <main style={{ background: "var(--hud-bg-base)", minHeight: "100vh", color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ fontFamily: "var(--font-hud)", fontSize: "var(--fs-micro)", color: "var(--hud-accent-cyan)" }}>
          📡 LIVE INSTRUMENT PANEL
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h1)", marginTop: 8 }}>
          Hazard-Radar
        </h1>
        <p style={{ color: "rgba(255,255,255,.6)", marginTop: 8, maxWidth: 560 }}>
          Nur Regionen mit aktiviertem Hazard-Layer in der aktiven Config werden hier angezeigt —
          gesteuert allein über <code>hazardLayerEnabled</code> pro Region, kein Sonderfall im Code.
        </p>
        <HazardRadarClient regions={hazardRegions} />
      </div>
    </main>
  );
}
