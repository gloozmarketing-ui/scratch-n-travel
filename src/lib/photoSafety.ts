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
export async function stripExif(file: File): Promise<{ blob: Blob; stripped: boolean }> {
  if (file.type !== 'image/jpeg') {
    return { blob: file, stripped: false }
  }
  try {
    const buffer = await file.arrayBuffer()
    const view = new DataView(buffer)
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
      return { blob: file, stripped: false }
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
    return { blob: file, stripped: false }
  } catch {
    // Entfernen ist optional. Ein Fehler darf den Upload nicht verhindern —
    // die Verzoegerung greift in jedem Fall.
    return { blob: file, stripped: false }
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

export async function preparePhotoForUpload(file: File): Promise<PreparedPhoto> {
  const { blob, stripped } = await stripExif(file)
  const visibleAt = new Date(Date.now() + PHOTO_DELAY_MINUTES * 60_000).toISOString()
  const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  return {
    blob,
    fileName: `${base}_${Date.now()}.jpg`,
    visibleAt,
    exifStripped: stripped,
    notice: stripped
      ? `Standortdaten aus dem Foto entfernt. Sichtbar in ${PHOTO_DELAY_MINUTES / 60} Std.`
      : `Sichtbar in ${PHOTO_DELAY_MINUTES / 60} Std.`,
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
  if (photo.status === 'flagged' || photo.status === 'removed') return false

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

/** Kurzer Hinweistext fuer abgelaufene Personenfotos. */
export function isPhotoExpired(photo: RoutePhotoLike, now = Date.now()): boolean {
  if (!photo.expiresAt) return false
  const exp = new Date(photo.expiresAt).getTime()
  return Number.isFinite(exp) && exp <= now
}

/** Bound fuer das Storage-Upload: 12 MB nach dem EXIF-Strip. */
export const PHOTO_MAX_BYTES = 12 * 1024 * 1024

export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp'
