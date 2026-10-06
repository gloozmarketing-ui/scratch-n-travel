// app/api/ai-concierge/route.ts
// 8.14: Function-Calling gegen interne APIs (Wetter, Hobby-Matching,
// Story-Pin-DB), damit Antworten grounded sind statt frei erfunden.
// Edge-Runtime + Streaming, weil Serverless-Functions im Free Tier auf
// 10s begrenzt sind (Kap. 14.2) — Streaming vermeidet Timeouts bei
// längeren Antworten und verbessert die gefühlte Latenz.
import { NextRequest } from "next/server";

export const runtime = "edge";

// Getrennter System-Prompt von jedem Moderations-Kontext (Kap. 24) —
// Prompt-Injection-Trennung ist explizite Anforderung der Spec.
const SYSTEM_PROMPT = `Du bist der Scratch'n'Travel KI-Concierge. Antworte kurz, konkret und
grounded: nutze wo möglich die bereitgestellten Tools (get_weather, search_story_pins,
get_hobby_matches) statt Fakten zu erfinden. Wenn ein Tool keine Daten liefert, sag das
ehrlich statt zu spekulieren. Erwähne bei Affiliate-Empfehlungen (z. B. eSIM) immer den
Kennzeichnungshinweis.`;

const TOOLS = [
  {
    name: "get_weather",
    description: "Aktuelle Wetter- und Wassertemperaturdaten für eine Region abrufen.",
    input_schema: {
      type: "object",
      properties: { regionCode: { type: "string" } },
      required: ["regionCode"],
    },
  },
  {
    name: "search_story_pins",
    description: "Verifizierte Story-Pins (Geheimtipps) in einer Region durchsuchen.",
    input_schema: {
      type: "object",
      properties: {
        regionCode: { type: "string" },
        query: { type: "string" },
      },
      required: ["regionCode"],
    },
  },
  {
    name: "get_hobby_matches",
    description: "Locals/Reisende mit überschneidenden Hobby-DNA-Tags in einer Region finden.",
    input_schema: {
      type: "object",
      properties: {
        regionCode: { type: "string" },
        hobbies: { type: "array", items: { type: "string" } },
      },
      required: ["regionCode", "hobbies"],
    },
  },
];

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY fehlt in der Umgebung." }),
      { status: 500 }
    );
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      stream: true,
      messages,
    }),
  });

  // Stream 1:1 an den Client durchreichen — Tool-Calls werden clientseitig
  // erkannt und gegen /api/tools/* aufgelöst (siehe ConciergeChat.tsx).
  return new Response(upstream.body, {
    headers: { "content-type": "text/event-stream" },
  });
}
