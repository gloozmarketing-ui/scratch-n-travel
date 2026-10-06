// app/explorer/ExplorerClient.tsx
"use client";

import { useState } from "react";
import type { RegionConfig } from "@/lib/regions";
import { ScratchCanvas } from "@/components/scratch/ScratchCanvas";
import { useToast } from "@/components/ui/Toast";

export function ExplorerClient({ regions }: { regions: RegionConfig[] }) {
  const [activeCode, setActiveCode] = useState(regions[0]?.code);
  const active = regions.find((r) => r.code === activeCode) ?? regions[0];
  const push = useToast();

  if (!active) {
    return <p>Keine Regionen in der aktiven Config gefunden.</p>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <select
        value={activeCode}
        onChange={(e) => setActiveCode(e.target.value)}
        aria-label="Aktive Region wählen"
        style={{
          fontFamily: "var(--font-hud)",
          padding: "10px 14px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(45,55,72,.15)",
        }}
      >
        {regions.map((r) => (
          <option key={r.code} value={r.code}>
            {r.flag} {r.name} ({r.hub})
          </option>
        ))}
      </select>

      <div
        style={{
          marginTop: 24,
          position: "relative",
          aspectRatio: "16/9",
          maxWidth: 480,
          background: "var(--hud-bg-base)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <ScratchCanvas
          key={active.code /* Canvas pro Region neu mounten */}
          region={active}
          onUnlocked={async (code) => {
            push(`Region ${code} freigeschaltet! 🔓`, "success");
            const res = await fetch("/api/regions/unlock", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ regionCode: code }),
            });
            if (res.status === 401) {
              push("Fortschritt lokal gespeichert — melde dich an, um ihn zu sichern.", "info");
            }
          }}
        />
      </div>
      <p style={{ marginTop: 12, fontSize: "var(--fs-small)", color: "var(--text-secondary)" }}>
        Theme: {active.theme} · Schwellenwert: {(active.scratchThreshold * 100).toFixed(0)}% ·{" "}
        Hazard-Layer: {active.hazardLayerEnabled ? "aktiv" : "inaktiv"}
      </p>
    </div>
  );
}
