// components/pricing/AdminStripeModeToggle.tsx
// NUR erreichbar über app/pricing/page.tsx, das server-seitig role==='admin'
// prüft, bevor diese Komponente überhaupt importiert/gerendert wird — kein
// clientseitiges "verstecken" (das wäre trivial umgehbar), sondern echtes
// Server-Side-Gating.
"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

export function AdminStripeModeToggle() {
  const [live, setLive] = useState(false);

  return (
    <div
      style={{
        marginTop: 16,
        background: "var(--hud-bg-base)",
        color: "#fff",
        borderRadius: "var(--radius-md)",
        padding: 16,
        fontFamily: "var(--font-hud)",
        fontSize: "var(--fs-small)",
      }}
    >
      <p style={{ color: "var(--hud-accent-cyan)", marginBottom: 8 }}>⚙️ ADMIN-ONLY DEBUG PANEL</p>
      <Toggle checked={live} onChange={setLive} label={live ? "Stripe Live-Modus aktiv" : "Stripe Test-Modus"} />
    </div>
  );
}
