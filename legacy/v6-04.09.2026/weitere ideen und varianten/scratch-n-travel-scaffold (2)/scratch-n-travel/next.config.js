/** @type {import('next').NextConfig} */
// Kapitel 14 — Vercel-Free-Tier-Constraints: keine schweren Server-Libraries,
// Serverless Functions < 10s, PDF-Export läuft clientseitig (jsPDF), nicht hier.
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Regionsfotos/POD-Mockups kommen aus Supabase Storage + externen POD-Diensten
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    // Edge Runtime für den KI-Concierge-Stream (Kap. 8.14 / 25)
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
