// app/api/stripe/connect/route.ts
// Wird vom letzten Schritt des Host-Onboarding-Steppers (8.15) aufgerufen —
// legt ein Express-Connect-Konto an und gibt den Onboarding-Link zurück,
// zu dem der Host weitergeleitet wird.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Bitte zuerst anmelden." }, { status: 401 });
  }

  const { businessType, regionCode } = await req.json();
  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const account = await stripe.accounts.create({
    type: "express",
    email: user.email ?? undefined,
    metadata: { userId: user.id, businessType, regionCode },
  });

  await supabase.from("host_profiles").upsert({
    user_id: user.id,
    stripe_account_id: account.id,
    business_type: businessType,
    region_code: regionCode,
    status: "onboarding",
  });

  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/host/onboarding?refresh=1`,
    return_url: `${origin}/host/onboarding?connected=1`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: link.url });
}
