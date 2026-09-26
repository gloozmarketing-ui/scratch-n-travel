/**
 * Impressum — Pflicht nach § 5 DDG (vormals § 5 TMG).
 *
 * WICHTIG: Alle Platzhalter in spitzen Klammern MÜSSEN vor dem Livegang
 * ausgefüllt werden. Eine unvollständige Impressumspflichtseite ist abmahnfähig.
 */
import { useAuth } from '../context/AuthContext'
import LegalLayout, { Section, linkStyle, hintStyle, warningStyle } from '../components/LegalLayout'

export default function Impressum() {
  const { isDemo } = useAuth()

  return (
    <LegalLayout title="Impressum" subtitle="Angaben gemäß § 5 DDG">
      {isDemo && (
        <div style={warningStyle}>
          <strong style={{ color: 'var(--terracotta)' }}>Platzhalter.</strong> Diese Seite muss vor dem
          Livegang mit echten Anbieterangaben gefüllt werden.
        </div>
      )}

      <Section title="Diensteanbieter">
        <p style={{ margin: 0 }}>
          <strong>{'<Firmenname>'}</strong><br />
          {'<Straße und Hausnummer>'}<br />
          {'<PLZ Ort>'}<br />
          {'<Deutschland>'}
        </p>
      </Section>

      <Section title="Vertreten durch">
        <p style={{ margin: 0 }}>{'<Name der vertretungsberechtigten Person>'}</p>
      </Section>

      <Section title="Kontakt">
        <p style={{ margin: 0 }}>
          Telefon: {'<Telefonnummer>'}<br />
          E-Mail: <a href="mailto:kontakt@example.com" style={linkStyle}>{'<kontakt@example.com>'}</a>
        </p>
      </Section>

      <Section title="Umsatzsteuer-Identifikationsnummer">
        <p style={{ margin: 0 }}>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          <strong>{'<USt-IdNr. oder Hinweis auf Kleinunternehmerregelung § 19 UStG>'}</strong>
        </p>
        <p style={hintStyle}>
          Falls die Kleinunternehmerregelung greift: nicht weglassen, sondern ausdrücklich
          angeben. Fehlt die Angabe, ist das ein abmahnfähiger Punkt.
        </p>
      </Section>

      <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p style={{ margin: 0 }}>
          {'<Name>'}<br />
          {'<Anschrift wie oben>'}
        </p>
      </Section>

      <Section title="EU-Streitschlichtung">
        <p style={{ margin: '0 0 0.5rem' }}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:
        </p>
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          ec.europa.eu/consumers/odr
        </a>
        <p style={hintStyle}>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </Section>

      <Section title="Haftung für Inhalte">
        <p style={{ margin: 0 }}>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
      </Section>

      <Section title="Wichtiger Hinweis für Nutzerinnen und Nutzer">
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>Scratch'n'Travel vermittelt Kontakte, keine Sicherheit.</strong>{' '}
          Treffen finden offline und auf eigene Verantwortung statt. Bitte beachten Sie auch
          unsere <a href="/safety" style={linkStyle}>Sicherheitsseite</a> und die{' '}
          <a href="/terms" style={linkStyle}>Nutzungsbedingungen</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}