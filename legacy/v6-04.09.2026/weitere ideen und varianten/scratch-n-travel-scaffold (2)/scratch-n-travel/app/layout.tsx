// app/layout.tsx
import "../styles/tokens.css";
import "../styles/globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scratch'n'Travel — Die Social Layer für Reisen, 130 Hobbys & Rubbel-Pass",
  description:
    "Verreise nicht nur als Tourist. Werde Teil des Ortes. WanderBond Hobby-DNA Matching, Familien- & Hundereisen, Extremsport, Unwetter-Radar und den Rubbel-Reisepass.",
  themeColor: "#10B981",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ToastProvider>{children}</ToastProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

