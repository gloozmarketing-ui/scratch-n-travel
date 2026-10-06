// app/api/cron/hazard-sync/route.ts
// Kap. 14.2: Vercel Free Tier erlaubt Cron nur min. täglich -> hier als
// GET-Endpoint, den sowohl Vercel Cron (1x/Tag) als auch der Client
// (mit 15-Min-Cache, siehe HazardRadarClient) aufrufen kann.
import { NextResponse } from "next/server";

export const runtime = "edge";

// In Produktion: echte Wetter-/Katastrophen-API (WEATHER_API_KEY aus .env)
// gegen die Regionen aus regions.config.json abfragen und z.B. in Supabase
// zwischenspeichern. Hier als deterministischer Stub für das Scaffold.
export async function GET() {
  const mockAlerts = [
    {
      regionCode: "PT-LIS",
      headline: "SINTRA PARKSPERRUNG (HITZEWELLE)",
      detail: "Nationalpark Sintra-Cascais bei Temperaturen über 35°C zeitweise gesperrt. Waldbrandgefahr Stufe hoch.",
      severity: "danger" as const,
    },
    {
      regionCode: "PT-ALG",
      headline: "STARKE UNTERSTRÖMUNG PRAIA DA ROCHA",
      detail: "Rote Flagge an mehreren Algarve-Stränden heute Nachmittag, Rettungsschwimmer vor Ort informieren.",
      severity: "warning" as const,
    },
  ];

  return NextResponse.json(mockAlerts, {
    headers: { "Cache-Control": "public, max-age=900" }, // 15 Min Edge-Cache
  });
}
