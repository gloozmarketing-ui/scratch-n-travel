// app/api/stripe/checkout/route.ts
// Erstellt eine Stripe-Checkout-Session für den Pro-VIP-Tarif (9€/Monat).
// Node-Runtime (nicht Edge), da das Stripe-SDK Node-APIs nutzt — bleibt
// trotzdem weit unter dem 10s-Limit des Free Tiers (Kap. 14.2).
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

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email ?? undefined,
    line_items: [{ price: process.env.STRIPE_PRICE_PRO_VIP!, quantity: 1 }],
    success_url: `${origin}/pricing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: session.url });
}
