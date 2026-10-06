// app/api/safety-reports/route.ts
// Automatisierte Vorprüfung bei Submit (Kap. "1. Automatisierte Vorprüfung"):
// Regex-Blocklist-Heuristik, Ergebnis-Status pending|flagged|auto_approved.
// KI-Klassifikation würde denselben Anthropic-Zugang wie der Concierge nutzen,
// aber mit VÖLLIG GETRENNTEM System-Prompt (Prompt-Injection-Trennung).
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const BLOCKLIST = [/scheiß/i, /idiot/i]; // Platzhalter — echte Liste separat pflegen

export async function POST(req: NextRequest) {
  const { category, location, description } = await req.json();

  if (!category || !location || !description) {
    return NextResponse.json({ error: "category, location und description sind erforderlich" }, { status: 400 });
  }

  const flagged = BLOCKLIST.some((re) => re.test(description));
  const status = flagged ? "flagged" : "pending";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("safety_reports").insert({
    category,
    location,
    description,
    moderation_status: status,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, status });
}
