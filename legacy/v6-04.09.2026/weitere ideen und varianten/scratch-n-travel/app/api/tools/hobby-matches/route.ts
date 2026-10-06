// app/api/tools/hobby-matches/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Stub-Local-Pool — in Produktion: Supabase-Query gegen profiles.hobby_tags
// gefiltert nach region_code, gleiche Overlap-Logik wie im App-Dashboard.
const MOCK_LOCALS = [
  { name: "João", hobbies: ["Surfen", "Freitauchen", "Hundestrand", "Sternenbeobachtung"] },
  { name: "Inês", hobbies: ["Naturwein", "Streetfood", "Fado-Musik", "Töpfern"] },
  { name: "Marco", hobbies: ["Klettern", "Trekking", "Golden Hour Fotografie", "Radtouren"] },
];

export async function POST(req: NextRequest) {
  const { hobbies } = (await req.json()) as { regionCode: string; hobbies: string[] };
  const selected = new Set(hobbies);

  const matches = MOCK_LOCALS.map((l) => {
    const overlap = l.hobbies.filter((h) => selected.has(h)).length;
    return { name: l.name, matchPct: Math.round((overlap / Math.max(1, selected.size)) * 100) };
  }).sort((a, b) => b.matchPct - a.matchPct);

  return NextResponse.json({ matches });
}
