// app/api/regions/unlock/route.ts
// Wird von ScratchCanvas NUR beim 75%-Schwellenwert-Event aufgerufen (7.4),
// nicht bei jeder Mausbewegung -> minimale Serverless-Last (Kap. 14 Free Tier).
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge"; // Kap. 14: Edge statt Node-Function wo möglich

export async function POST(req: NextRequest) {
  const { regionCode } = await req.json();

  if (!regionCode) {
    return NextResponse.json({ error: "regionCode ist erforderlich" }, { status: 400 });
  }

  // Auth-Client aus der Session (Middleware hält sie frisch) statt einer
  // vom Client mitgeschickten userId — sonst könnte jeder für jeden
  // schreiben. RLS in scratch_progress erlaubt ohnehin nur auth.uid().
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { error } = await supabase.from("scratch_progress").upsert({
    user_id: user.id,
    region_code: regionCode,
    unlocked_at: new Date().toISOString(),
    progress: 1,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

