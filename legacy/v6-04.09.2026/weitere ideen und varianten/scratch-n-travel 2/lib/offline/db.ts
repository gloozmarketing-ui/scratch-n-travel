// lib/offline/db.ts
// Minimaler IndexedDB-Wrapper ohne externe Abhängigkeit — reicht für den
// einen Anwendungsfall (Story-Pins offline verfügbar halten, Kap. 726).
// Kein localStorage, weil Story-Pin-Listen potenziell zu groß/strukturiert
// dafür sind; IndexedDB ist die in der Spec vorgesehene Wahl.

const DB_NAME = "snt-offline";
const DB_VERSION = 1;
const STORE = "story_pins";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheStoryPins(regionCode: string, pins: unknown[]) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  store.put({ id: regionCode, pins, cachedAt: Date.now() });
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCachedStoryPins(regionCode: string): Promise<unknown[] | null> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  return new Promise((resolve, reject) => {
    const req = store.get(regionCode);
    req.onsuccess = () => resolve(req.result?.pins ?? null);
    req.onerror = () => reject(req.error);
  });
}
