// lib/supabase/server.ts
// Server-Client für Server Components / Route Handlers — liest/schreibt
// die Auth-Session über Next.js cookies(). Nutzt weiterhin nur den ANON
// key; RLS entscheidet serverseitig genauso wie clientseitig (Kap. 13).
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // In Server Components (nicht Route Handlers) darf cookies()
            // nicht schreiben — Fehler hier ist erwartbar und ignorierbar,
            // solange Middleware die Session ohnehin refresht.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // s.o.
          }
        },
      },
    }
  );
}
