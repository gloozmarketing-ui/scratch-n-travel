// app/hazard-radar/HazardRadarClient.tsx
"use client";

import { useEffect, useState } from "react";
import type { RegionConfig } from "@/lib/regions";
import { Toggle } from "@/components/ui/Toggle";
import styles from "./hazard.module.css";

interface HazardAlert {
  regionCode: string;
  headline: string;
  detail: string;
  severity: "info" | "warning" | "danger";
}

const CACHE_KEY = "snt_hazard_cache_v1";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minuten, wie in 8.9 gefordert

async function fetchHazards(): Promise<HazardAlert[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { ts, data } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL_MS) return data;
  }
  const res = await fetch("/api/cron/hazard-sync");
  const data: HazardAlert[] = res.ok ? await res.json() : [];
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  return data;
}

export function HazardRadarClient({ regions }: { regions: RegionConfig[] }) {
  const [radarOn, setRadarOn] = useState(true);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [activeCode, setActiveCode] = useState(regions[0]?.code);

  useEffect(() => {
    fetchHazards().then(setAlerts);
  }, []);

  const activeAlerts = alerts.filter((a) => a.regionCode === activeCode);
  const topAlert = activeAlerts.find((a) => a.severity === "danger") ?? activeAlerts[0];

  if (regions.length === 0) {
    return (
      <p style={{ marginTop: 32, color: "rgba(255,255,255,.5)" }}>
        Keine Region in der aktiven Config hat den Hazard-Layer aktiviert.
      </p>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      {radarOn && topAlert && (
        <div className={`${styles.alertBanner} ${styles[topAlert.severity]}`} role="alert">
          ⚠ AKTIVE WARNUNG: {topAlert.headline}
          <a href="#detail" className={styles.detailLink}>
            Details &amp; Verhaltenshinweise →
          </a>
        </div>
      )}

      <div className={styles.controlRow}>
        <select value={activeCode} onChange={(e) => setActiveCode(e.target.value)} className={styles.regionSelect}>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.flag} {r.name}
            </option>
          ))}
        </select>
        <Toggle checked={radarOn} onChange={setRadarOn} label="Hazard-Radar" variant="hazard" />
      </div>

      <div className={styles.radarStage}>
        {radarOn && <div className={styles.sweep} aria-hidden="true" />}
        {radarOn &&
          activeAlerts.map((a, i) => (
            <div
              key={i}
              className={`${styles.pulseDot} ${styles[a.severity]}`}
              style={{ left: `${20 + i * 22}%`, top: `${30 + i * 15}%` }}
              title={a.headline}
            />
          ))}
        {!radarOn && <p className={styles.offLabel}>Radar deaktiviert</p>}
      </div>

      <div id="detail" className={styles.detailList}>
        {activeAlerts.length === 0 && (
          <p style={{ color: "rgba(255,255,255,.5)" }}>Keine aktiven Warnungen für diese Region.</p>
        )}
        {activeAlerts.map((a, i) => (
          <div key={i} className={`${styles.detailCard} ${styles[a.severity]}`}>
            <strong>{a.headline}</strong>
            <p>{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
