/**
 * Nutzungsbedingungen / AGB.
 *
 * Kernpunkt: der Offline-Disclaimer. Er ist im Master-Plan als
 * "Minimum Viable Safety" gefordert und muss hier verbindlich stehen.
 */
import LegalLayout, { Section, linkStyle, hintStyle, warningStyle } from '../components/LegalLayout'
import { MEETUP_CODE_OF_CONDUCT, OFFLINE_DISCLAIMER } from '../lib/trust'

export default function Terms() {
  return (
    <LegalLayout title="Nutzungsbedingungen" subtitle="AGB und Verhaltensregeln">
      <div style={warningStyle}>
        <strong style={{ color: 'var(--terracotta)' }}>Platzhalter.</strong> Firmenangaben, Fassungsdatum
        und etwaige Widerrufsfristen müssen vor dem Livegang geprüft werden.
      </div>

      <Section title="1. Was Scratch'n'Travel ist">
        <p style={{ margin: 0 }}>
          Scratch'n'Travel ist eine Plattform, die Nutzerinnen und Nutzern ermöglicht, sich
          kennenzulernen und gemeinsame Interessen zu pflegen. Die Plattform vermittelt
          Kontakte und organisiert keine Reisen, keine Unterkunft und keine
          finanziellen Transaktionen zwischen Nutzerinnen und Nutzern.
        </p>
      </Section>

      <Section title="2. Offline-Disclaimer (zentral)">
        <p
          style={{
            margin: 0,
            padding: '0.85rem 1rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 10,
            color: 'var(--ink)',
          }}
        >
          {OFFLINE_DISCLAIMER}
        </p>
        <p style={hintStyle}>
          Dieser Absatz ist bewusst hervorgehoben. Er ist der zentrale Haftungsausschluss der
          Plattform und sollte nicht gekürzt werden.
        </p>
      </Section>

      <Section title="3. Registrierung und Profil">
        <p style={{ margin: 0 }}>
          Zur Nutzung ist eine Registrierung mit gültiger E-Mail-Adresse erforderlich. Sie sind
          verpflichtet, wahrheitsgemäße Angaben zu machen. Fake-Profile, die Erstellung
          mehrerer Konten zur Umgehung von Sperren sowie die Übernahme fremder Identitäten sind
          untersagt und können zur Sperrung führen.
        </p>
      </Section>

      <Section title="4. Vertrauensstufen">
        <p style={{ margin: '0 0 0.5rem' }}>
          Die Plattform vergibt Vertrauensstufen anhand konkreter, überprüfbarer Handlungen:
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li><strong style={{ color: 'var(--ink)' }}>Neu dabei</strong> — Lesen und Stöbern</li>
          <li><strong style={{ color: 'var(--ink)' }}>Mitglied</strong> — volles Profil, Nachrichten, Spots einreichen</li>
          <li><strong style={{ color: 'var(--ink)' }}>Vertrauensvoll</strong> — Teilnahme an Meetups</li>
          <li><strong style={{ color: 'var(--ink)' }}>Anker</strong> — eigene Meetups ausrichten</li>
        </ul>
        <p style={hintStyle}>
          Ein Ausweis, ein Selfie oder eine Telefonnummer sind zu keinem Zeitpunkt verpflichtend.
          Telefon- und Ausweisverifizierung sind freiwillige Zusatzfunktionen für Nutzerinnen
          und Nutzer, die eigene Meetups ausrichten.
        </p>
      </Section>

      <Section title="5. Verhaltensregeln">
        <p style={{ margin: '0 0 0.5rem' }}>Für die gesamte Plattform gilt:</p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          {MEETUP_CODE_OF_CONDUCT.map((r) => (
            <li key={r} style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', lineHeight: 1.65 }}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="6. Meetups">
        <p style={{ margin: 0 }}>
          Meetups finden an öffentlichen Orten statt. Veranstalterinnen und Veranstalter sind
          verpflichtet, ausschließlich öffentliche Orte anzugeben. Die Plattform haftet nicht
          für Schäden, die im Rahmen oder im Zusammenhang mit Offline-Treffen entstehen. Die
          Teilnahme an Meetups erfolgt auf eigene Verantwortung.
        </p>
      </Section>

      <Section title="7. Blockieren und Melden">
        <p style={{ margin: 0 }}>
          Sie können andere Nutzerinnen und Nutzer jederzeit ohne Angabe von Gründen blockieren.
          Meldungen zu Belästigung, Betrug oder Fake-Profilen können über das Schildsymbol im
          Chat oder im Profil eingereicht werden. Wir prüfen Meldungen nach besten Kräften, eine
          Bearbeitung oder Rückmeldung erfolgt jedoch nicht garantiert. Der gemeldeten Person
          geben wir keine Auskunft über die Meldung.
        </p>
      </Section>

      <Section title="8. Inhalte Dritter">
        <p style={{ margin: 0 }}>
          Für selbst veröffentlichte Inhalte wie Secret Spots, Meetups, Kommentare und
          Profiltexte sind Sie verantwortlich. Sie stellen den Betreiber von Ansprüchen Dritter
          frei, die aus diesen Inhalten resultieren. Ihre Rechte an den Inhalten bleiben
          bestehen.
        </p>
      </Section>

      <Section title="9. Keine Zahlungsvermittlung">
        <p style={{ margin: 0 }}>
          Über die Plattform werden keine Zahlungen zwischen Nutzerinnen und Nutzern
          abgewickelt. Kosten für gemeinsame Aktivitäten, Eintritte oder Verpflegung werden
          ausschließlich privat und direkt zwischen den Beteiligten geregelt. Die Plattform
          ist hierfür nicht verantwortlich und haftet nicht.
        </p>
      </Section>

      <Section title="10. Haftung">
        <p style={{ margin: 0 }}>
          Der Betreiber haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei
          Verletzung von Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit haftet der
          Betreiber nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den
          vertragstypischen, vorhersehbaren Schaden. Im Übrigen ist die Haftung ausgeschlossen.
          Die Haftung für Datenverlude beschränkt sich auf den Aufwand, der bei ordnungsgemäßer
          und evidenzbasierter Datensicherung erforderlich gewesen wäre.
        </p>
      </Section>

      <Section title="11. Änderungen">
        <p style={{ margin: 0 }}>
          Wir behalten uns vor, diese Bedingungen anzupassen. Über wesentliche Änderungen
          informieren wir{'<30 Tage vorher>'} per E-Mail oder über einen Hinweis in der App.
          Mit der weiteren Nutzung akzeptierst du die aktualisierten Bedingungen.
        </p>
      </Section>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
        <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.78rem', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink)' }}>Noch Fragen zur Sicherheit?</strong>{' '}
          Hier findest du alle Tipps für ein gutes erstes Treffen:{' '}
          <a href="/safety" style={linkStyle}>Sicherheitsseite öffnen</a>.
        </p>
      </div>
    </LegalLayout>
  )
}