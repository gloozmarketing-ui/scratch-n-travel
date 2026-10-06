// app/api/tools/story-pins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const regionCode = req.nextUrl.searchParams.get("regionCode");
  const query = req.nextUrl.searchParams.get("query") ?? "";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // anon key reicht: RLS erlaubt public select nur auf approved
  );

  let q = supabase.from("story_pins").select("*").eq("region_code", regionCode).eq("moderation_status", "approved");
  if (query) q = q.ilike("title", `%${query}%`);

  const { data, error } = await q.limit(5);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ results: data });
}
