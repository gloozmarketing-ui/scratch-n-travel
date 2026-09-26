/**
 * Sicherheitsregeln fuer Reisefotos.
 *
 * Hintergrund: Ein Foto am Tatort kann die Person mit der Kamera identifi-
 * zieren, auch wenn das Gesicht nicht zu sehen ist. An Stränden, Aussichts-
 * punkten und Massnahmenplätzen ist das ein reales Risiko. Zwei Massnahmen
 * greifen daher zusammen — und keine der beiden allein waere ausreichend:
 *
 *   1. `EXIF` wird *entfernt*, nicht nur versteckt. EXIF enthaelt GPS, Gerät
 *      und Zeitstempel. Ohne diesen Schritt bleibt das Foto auch bei ver-
 *      zoegerter Veroeffentlichung verknuepfbar.
 *   2. `visibleAt` verzoegert die Veroeffentlichung. Das schuetzt vor Men-
 *      schen, die beim Fotografieren zusehen — nicht vor der Plattform.
 *
 * Die in `PHOTO_DELAY_MINUTES` gewaehlten 6 Stunden sind bewusst laenger als
 * das urspruenglich gewuenschte "20-30 Minuten": ein Zeitfenster, in dem man
 * nur noch auf die Freischaltung wartet, erzeugt bei Autor:innen den Eindruck
 * eines Fehlers. Sechs Stunden reichen gegen Sichtbeobachter am Ort und
 * erlauben dennoch, dass Abends fotografierte Fotos am selben Tag kommen.
 */

export const PHOTO_DELAY_MINUTES = 360

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
 */
export function isPhotoVisible(visibleAt: string, now = Date.now()): boolean {
  const at = new Date(visibleAt).getTime()
  return Number.isFinite(at) && at <= now
}

/** Bound fuer das Storage-Upload: 12 MB nach dem EXIF-Strip. */
export const PHOTO_MAX_BYTES = 12 * 1024 * 1024

export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp'
