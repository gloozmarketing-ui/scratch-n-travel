/**
 * Datenschutzerklärung — DSGVO / Art. 13.
 *
 * Struktur nach Art. 13 DSGVO. Enthält bewusst KEINE falschen Zusagen:
 * Frühere Versionen warben mit "DSGVO compliant" und "Encrypted locally",
 * obwohl weder eine Verschlüsselung existierte noch Tracking-Aussagen getroffen
 * wurden. Diese Seite beschreibt, was tatsächlich passiert.
 */
import LegalLayout, { Section, linkStyle, hintStyle, warningStyle } from '../components/LegalLayout'

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung" subtitle="Informationen nach Art. 13 DSGVO">
      <div style={warningStyle}>
        <strong style={{ color: 'var(--terracotta)' }}>Platzhalter.</strong> Firmenangaben und die
        Liste der Auftragsverarbeiter müssen vor dem Livegang geprüft und ergänzt werden.
      </div>

      <Section title="1. Verantwortlicher">
        <p style={{ margin: 0 }}>
          Verantwortlich für die Datenverarbeitung auf dieser Plattform ist:<br />
          <strong>{'<Firmenname>'}</strong><br />
          {'<Straße, PLZ, Ort>'}<br />
          E-Mail: <a href="mailto:datenschutz@example.com" style={linkStyle}>{'<datenschutz@example.com>'}</a>
        </p>
        <p style={hintStyle}>
          Für Fragen zum Datenschutz erreichen Sie uns unter der genannten Adresse. Wir antworten
          in der Regel innerhalb von 30 Tagen.
        </p>
      </Section>

      <Section title="2. Welche Daten wir verarbeiten">
        <p style={{ margin: '0 0 0.5rem' }}>Wir verarbeiten nur Daten, die für den Dienst nötig sind:</p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li><strong style={{ color: 'var(--ink)' }}>Kontaktdaten:</strong> E-Mail-Adresse (Pflicht für den Login), optional Name, Stadt, Sprachen, Profilbild.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Profilangaben:</strong> von Ihnen selbst eingetragene Interessen, Bio, Angaben zu Kindern oder Haustieren.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Community-Inhalte:</strong> von Ihnen eingereichte Secret Spots, Meetups, Nachrichten.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Sicherheitsrelevante Daten:</strong> Blockierungen, Meldungen, Safety-Check-ins (nur von Ihnen selbst einsehbar).</li>
        </ul>
        <p style={hintStyle}>
          <strong style={{ color: 'var(--sun)' }}>Wichtig:</strong> Wir speichern keine genauen
          GPS-Positionen von Personen. Bei Safety-Check-ins wird ausschließlich eine von Ihnen
          selbst gewählte Ortsbezeichnung gespeichert (z. B. „Alfama").
        </p>
      </Section>

      <Section title="3. Lokale Speicherung im Browser (Art. 13 TDDDG)">
        <p style={{ margin: '0 0 0.5rem' }}>
          Damit die App funktioniert, speichert sie einige Angaben direkt in Ihrem Browser
          (<code style={linkStyle}>localStorage</code>). Diese Daten verlassen Ihr Gerät
          <strong style={{ color: 'var(--ink)' }}> nicht</strong> und werden nicht an uns
          übertragen. Es sind keine Cookies.
        </p>
        <ul style={{ margin: '0 0 0.5rem', paddingLeft: '1.1rem' }}>
          <li><strong style={{ color: 'var(--ink)' }}>Darstellung</strong> — Ihre Theme-Wahl (hell/dunkel).</li>
          <li><strong style={{ color: 'var(--ink)' }}>Reisefortschritt</strong> — bereits besuchte Orte, gesammelte Stempel, abgehakte Aufgaben und Checklisten.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Demo-Daten</strong> — solange Sie nicht angemeldet sind, liegen Beispielwerte in Ihrem Browser, damit die App ohne Konto etwas zeigt.</li>
        </ul>
        <p style={hintStyle}>
          Sie können diese Daten jederzeit löschen: im Browser die Website-Daten für
          scratchntravel.com entfernen. Danach ist die App frisch wie beim ersten Besuch.
        </p>
      </Section>

      <Section title="4. Zweck und Rechtsgrundlage">
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li><strong style={{ color: 'var(--ink)' }}>Art. 6 Abs. 1 lit. b DSGVO</strong> — Vertragserfüllung: Login, Nachrichten, Meetup-Teilnahme, Profilverwaltung.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Art. 6 Abs. 1 lit. f DSGVO</strong> — Berechtigtes Interesse: Sicherheit der Community, Missbrauchsprävention, Spam-Erkennung.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Art. 6 Abs. 1 lit. a DSGVO</strong> — Einwilligung: optionale Zusatzfunktionen wie Safety-Check-in-Benachrichtigungen.</li>
        </ul>
      </Section>

      <Section title="5. Auftragsverarbeitung und Drittanbieter">
        <p style={{ margin: '0 0 0.5rem' }}>Wir nutzen folgende Dienstleister:</p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li><strong style={{ color: 'var(--ink)' }}>Supabase</strong> — Hosting der Datenbank und der Anmeldung. Server in der EU und den USA, Übermittlung auf Basis von Standardvertragsklauseln.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Vercel Inc.</strong> — Hosting der Website. Server u. a. in der EU und den USA.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Stripe</strong> — Zahlungsabwicklung für Abos. Übermittlung in die USA.</li>
          <li><strong style={{ color: 'var(--ink)' }}>GitHub (Microsoft)</strong> — Versionsverwaltung und automatisierte Deployments.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Leaflet / OpenStreetMap</strong> — Karten Darstellung. Bei Kartenaufrufen werden IP-Adressen an die OSM-Server übermittelt.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Google Fonts</strong> — Schriftarten. Bei Aufruf werden Daten an Google übermittelt. <em>Alternativ empfohlen: Fonts lokal einbinden.</em></li>
        </ul>
      </Section>

      <Section title="6. Ihre Rechte">
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen (Art. 21 DSGVO)</li>
          <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p style={hintStyle}>
          Sie können Ihr Profil und damit die meisten Daten jederzeit selbst löschen. Für die
          vollständige Löschung wenden Sie sich an die oben genannte Adresse.
        </p>
      </Section>

      <Section title="7. Speicherdauer">
        <p style={{ margin: 0 }}>
          Wir speichern Daten nur so lange, wie es für den Zweck erforderlich ist:
          Profildaten bis zur Löschung Ihres Kontos, Nachrichten bis zur Löschung des Kontos,
          Sicherheitsmeldungen bis zur abgeschlossenen Prüfung sowie längstens{'<Aufbewahrungsfrist>'}.
        </p>
      </Section>

      <Section title="8. Ihre Rechte bei Beschwerden">
        <p style={{ margin: 0 }}>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
          Zuständig für uns ist:{'<Aufsichtsbehörde>'}. Die Liste aller deutschen
          Aufsichtsbehörden finden Sie unter:{' '}
          <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            bfdi.bund.de
          </a>
        </p>
      </Section>

      <Section title="9. Sicherheit">
        <p style={{ margin: 0 }}>
          Wir verwenden Verschlüsselung bei der Übertragung (HTTPS/TLS) und greifen auf
          Row-Level-Security in der Datenbank zurück, sodass Nutzer ausschließlich auf ihre
          eigenen Daten zugreifen können. <strong style={{ color: 'var(--sun)' }}>Wir können
          keine Sicherheit garantieren</strong> — insbesondere keine Sicherheit bei Treffen im
          öffentlichen Raum. Bitte lesen Sie dazu unsere{' '}
          <a href="/safety" style={linkStyle}>Sicherheitsseite</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}