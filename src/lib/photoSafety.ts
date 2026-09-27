/**
 * Sicherheitsregeln fuer Reisefotos.
 *
 * ── Wovor schuetzt die Verzoegerung wirklich? ──────────────────────────────
 * Der Schutz gilt dem *Quest-Folger*, nicht dem Fotografierenden.
 *
 * Ein Folger ist jemand, der einer fremden Route folgt und unterwegs
 * Stationen abhakt. Sein Standort ist sein groesstes Risiko: Wer weiss,
 * dass jemand gerade Station 4 von 7 erreicht, weiss auch ungefaehr, wo
 * dieser Mensch ist — und an einem abgelegenen Strand koennte das
 * folgenloes sein. Ein Foto, das sofort sichtbar wird, verraet genau das:
 * "Hier ist jemand, gerade jetzt, bei dieser Station."
 *
 * Deshalb ist die Frist kein Dekor und kein Anstandspolitk-Feature, sondern
 * ein Schutzfenster gegen Ortung. Sie muss kurz genug sein, um nutzbar zu
 * bleiben, und lang genug, damit ein Vor-Ort-Beobachter aus dem
 * Veroeffentlichungsmuster keine Rueckschluesse auf Anwesenheit ziehen kann.
 * Sechs Stunden sind dafuer die kuerzere, aber noch wirksame Grenze.
 *
 * ── Was die Verzoegerung ausdruecklich NICHT leistet ───────────────────────
 * Sie anonymisiert nicht. Sie verhindert nicht, dass jemand an der
 * Station auf ein wartendes Gesicht trifft. Sie schuetzt nicht vor der
 * Person, die das Foto sieht, sondern vor dem *Muster*, das die
 * Veroeffentlichung erzeugt. Wer echten Personenschutz braucht, braucht
 * eine sichtbare Haartuch-Regel ("Fotos mit Personen fallen nach 24 Std
 * automatisch weg") — die ist als naechster Schritt vorgemerkt.
 *
 * ── Warum zusaetzlich EXIF entfernen? ──────────────────────────────────────
 * EXIF traegt GPS, Geraet und Zeitstempel. Ohne diesen Schritt bleibt das
 * Foto auch nach der Frist exakt rückverfolgbar auf eine Person und einen
 * Ort — die Verzoegerung waere dann nur Alibi.
 */

export const PHOTO_DELAY_MINUTES = 360

/**
 * Ab dieser Dauer faellt ein Foto mit erkennbaren Personen automatisch weg.
 * Bewusst *nicht* nur ein Rate-Hinweis, sondern eine harte Regel: langlebige
 * Gesichter sind der Grund, warum Strandfotos gefährlich sind. Wer ein
 * Personenfoto teilen will, muss es beim Upload bestaetigen — dann ist die
 * Verantwortung dokumentiert.
 */
export const PERSON_PHOTO_TTL_HOURS = 24

/**
 * EXIF entgegen den ueblichen Mustern entfernen.
 *
 * Bewusst kein Canvas-Recode: Der kostet Originalqualitaet und ist auf einem
 * grossen 48-Megapixel-Handyfoto im mobilen Browser der wahrscheinlichste
 * Abbruchgrund. Stattdessen wird der Dateityp manipuliert — das funktioniert
 * nur bei JPEG, und JPEG ist das, was Kameras liefern. PNG wird unver-
 * aendert zurueckgegeben, mit gesetztem Hinweis fuer den Aufrufer.
 */
export type ExifResult =
  | { blob: Blob; stripped: true }
  | { blob: null; stripped: false; reason: string }

export async function stripExif(file: File): Promise<ExifResult> {
  if (file.type !== 'image/jpeg') {
    return {
      blob: null,
      stripped: false,
      reason: file.type.startsWith('image/')
        ? 'Nur JPEG wird unterstuetzt. PNG und WebP tragen ebenfalls Standortdaten '
          + 'und werden deshalb abgelehnt statt unkontrolliert hochgeladen. '
          + 'Exportiere das Foto einmal als JPEG.'
        : 'Bitte waehle ein Bild aus.',
    }
  }
  try {
    const buffer = await file.arrayBuffer()
    const view = new DataView(buffer)
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
      return { blob: null, stripped: false, reason: 'Die Datei ist kein gueltiges JPEG.' }
    }

    // JPEG ist eine Kette von Markern (0xFF + Typ + Laenge). Wir ueberspringen
    // alles bis APP1 (0xFFE1), denn dort sitzt die EXIF. Andere Segmente
    // (JFIF, Kommentare,_quant) bleiben unangetastet.
    let offset = 2
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) break
      const marker = view.getUint8(offset + 1)
      const size = view.getUint16(offset + 2)
      if (marker === 0xe1) {
        // Segment entfernen: alles von offset bis offset + 2 + size streichen.
        const removed = 2 + size
        const kept = new Uint8Array(view.byteLength - removed)
        kept.set(new Uint8Array(buffer, 0, offset), 0)
        kept.set(
          new Uint8Array(buffer, offset + removed, view.byteLength - offset - removed),
          offset,
        )
        return { blob: new Blob([kept], { type: 'image/jpeg' }), stripped: true }
      }
      // Standalone-Marker ohne Laengenfeld.
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
        offset += 2
        continue
      }
      offset += 2 + size
    }
    return {
      blob: null,
      stripped: false,
      reason: 'In diesem JPEG wurden keine Standortdaten gefunden. Aus '
        + 'Sicherheitsgruenden werden nur Fotos mit entfernten Metadaten veroeffentlicht.',
    }
  } catch {
    return {
      blob: null,
      stripped: false,
      reason: 'Die Datei konnte nicht gelesen werden. Bitte versuche es erneut.',
    }
  }
}

export interface PreparedPhoto {
  blob: Blob
  fileName: string
  visibleAt: string
  exifStripped: boolean
  /** Fuer das UI: was der Autor wissen sollte. */
  notice: string
}

/** Fehlschlag mit begruendetem Grund — kein stilles Durchreichen. */
export interface RejectedPhoto {
  ok: false
  reason: string
}

export type PrepareResult = (PreparedPhoto & { ok: true }) | RejectedPhoto

/**
 * Bereitet einen Upload vor.
 *
 * Rueckgabe ist bewusst ein Ergebnis-Objekt statt eines Ergebnisses mit
 * `stripped: false`: wenn die Metadaten nicht entfernt werden konnten, darf der
 * Aufrufer den Upload gar nicht erst anbieten. Ein stilles `stripped: false`
 * fuehrte dazu, dass das Bild in der DB landete und die RLS es zurueckhielt —
 * fuer den Nutzer ein Schatzkasten ohne Bild und ohne erklaerbaren Grund.
 */
export async function preparePhotoForUpload(file: File): Promise<PrepareResult> {
  const result = await stripExif(file)

  if (!result.stripped || !result.blob) {
    return { ok: false, reason: result.reason }
  }

  const visibleAt = new Date(Date.now() + PHOTO_DELAY_MINUTES * 60_000).toISOString()
  const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const hours = PHOTO_DELAY_MINUTES / 60

  return {
    ok: true,
    blob: result.blob,
    fileName: `${base}_${Date.now()}.jpg`,
    visibleAt,
    exifStripped: true,
    notice: `Standortdaten aus dem Foto entfernt. Sichtbar in ${hours} Std.`,
  }
}

/**
 * Clientseitige Sichtbarkeitspruefung.
 *
 * Absichtlich clientseitig *und* in der RLS-Policy: hier, damit die UI nichts
 * anzeigt, was noch nicht da ist; dort, damit die Verzoegerung nicht
 * umgangen werden kann, indem jemand die API direkt anspricht.
 *
 * Deckt die drei Faelle ab, in denen ein Foto nicht ausgeliefert wird:
 *   - Schutzfrist (`visibleAt`) noch nicht abgelaufen
 *   - von der Moderation zurueckgezogen
 *   - Personenfoto nach Ablaufdatum entfernt
 */
export function isPhotoVisible(photo: RoutePhotoLike, now = Date.now()): boolean {
  // SICHERHEITSKERN: Fuer die oeffentliche Anzeige muss der Status *exakt*
  // 'visible' sein. Die frueherere Logik liess ein Foto zu, das noch im Status
  // 'in_delay' stand, sobald `visibleAt` abgelaufen war (`status !== 'flagged'
  // && status !== 'removed'`). Damit waere die 6-Stunden-Frist nur noch eine
  // Zeitangabe und keine Sperre — der Cron-Job, der ueberhaupt erst auf
  // 'visible' schaltet, haette keinen Sicherheitswert mehr.
  if (photo.status !== 'visible') return false

  // Zusaetzlich die Frist pruefen: falls der Cron-Job laenger als eine Stunde
  // nicht gelaufen ist, bleibt ein bereits freigeschaltetes Foto hier sichtbar —
  // das ist genau die gewollte Ausnahme, sonst waeren Fotos stundenlang unsichtbar.
  const at = new Date(photo.visibleAt).getTime()
  if (!Number.isFinite(at) || at > now) return false

  // Abgelaufene Personenfotos sind entfernt, auch wenn die Frist schon vorbei ist.
  if (photo.expiresAt) {
    const exp = new Date(photo.expiresAt).getTime()
    if (Number.isFinite(exp) && exp <= now) return false
  }
  return true
}

/** Nur die Felder, die fuer die Sichtbarkeit noetig sind. */
export interface RoutePhotoLike {
  visibleAt: string
  expiresAt?: string | null
  status?: string
}

/**
 * Verbleibende Schutzfrist in Minuten. Null, sobald das Foto sichtbar ist.
 *
 * Bewusst neben `isPhotoVisible` und nicht in data/routes.ts: es ist eine
 * Anzeigeregel, dieselbe Kategorie wie die beiden anderen. Hier stand vorher
 * eine zweite, aeltere Fassung — wer nach `photoCooldownMinutes` gesucht hat,
 * musste raten, welche gilt.
 */
export function photoCooldownMinutes(
  photo: RoutePhotoLike,
  now = Date.now(),
): number | null {
  const at = new Date(photo.visibleAt).getTime()
  if (!Number.isFinite(at)) return null
  const left = Math.ceil((at - now) / 60000)
  return left > 0 ? left : null
}

/** Kurzer Hinweistext fuer abgelaufene Personenfotos. */
export function isPhotoExpired(photo: RoutePhotoLike, now = Date.now()): boolean {
  if (!photo.expiresAt) return false
  const exp = new Date(photo.expiresAt).getTime()
  return Number.isFinite(exp) && exp <= now
}

/** Bound fuer das Storage-Upload: 12 MB nach dem EXIF-Strip. */
export const PHOTO_MAX_BYTES = 12 * 1024 * 1024

/**
 * Nur JPEG. Bewusst *nicht* `image/png,image/webp`: `stripExif()` kann
 * ausschliesslich JPEG bereinigen. Wer im Dateidialog PNG/WebP angeboten
 * bekommt, waehlt sie aus und sieht dann erst beim Upload eine Absage — das
 * ist schlechter, als die Auswahl von Anfang an auf JPEG zu begrenzen.
 *
 * Wird `stripExif()` einmal erweitert, muss dieses `accept` mitwachsen.
 */
export const PHOTO_ACCEPT = 'image/jpeg'
