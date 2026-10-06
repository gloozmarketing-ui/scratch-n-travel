// app/api/stripe/webhook/route.ts
// Einzige Quelle der Wahrheit für Tarif-Upgrades — niemals clientseitig
// "tier" setzen, immer über verifizierte Webhook-Events (Sicherheitsprinzip).
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook-Signatur ungültig: ${(err as Error).message}` }, { status: 400 });
  }

  const supabase = adminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await supabase.from("profiles").update({ tier: "pro" }).eq("id", userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await supabase.from("profiles").update({ tier: "free" }).eq("id", userId);
      }
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      if (account.details_submitted) {
        await supabase.from("host_profiles").update({ status: "active" }).eq("stripe_account_id", account.id);
      }
      break;
    }
    default:
      break; // andere Events bewusst ignoriert
  }

  return NextResponse.json({ received: true });
}
