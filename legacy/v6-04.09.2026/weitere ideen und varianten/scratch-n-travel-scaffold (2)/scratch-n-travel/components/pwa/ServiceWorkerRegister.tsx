// components/pwa/ServiceWorkerRegister.tsx
"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registrierung optional -- App funktioniert auch ohne SW,
        // nur ohne Offline-Cache und ohne Web-Push.
      });
    }
  }, []);
  return null;
}
