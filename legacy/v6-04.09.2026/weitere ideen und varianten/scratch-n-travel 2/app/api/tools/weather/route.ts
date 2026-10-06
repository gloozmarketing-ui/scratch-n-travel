// app/api/tools/weather/route.ts
// Wird vom Concierge-Client aufgerufen, sobald Claude den get_weather-Tool-Call
// zurückgibt — hält Wetterlogik getrennt vom KI-Streaming-Endpoint.
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const regionCode = req.nextUrl.searchParams.get("regionCode");
  // Stub — in Produktion: WEATHER_API_KEY gegen echten Anbieter.
  return NextResponse.json({
    regionCode,
    airTempC: 27,
    waterTempC: 21,
    condition: "Sonnig, leichter Wind",
    source: "stub-weather-provider",
  });
}
