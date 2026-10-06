import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const fragen = [
  {
    frage: 'Ist LeadPulse DSGVO-konform?',
    antwort: 'Ja, vollständig. LeadPulse verarbeitet ausschließlich Firmendaten (B2B), hostet auf ISO-27001-zertifizierten Servern in Frankfurt am Main und kommt ohne Tracking-Cookies aus — es ist daher kein Einwilligungsbanner erforderlich. Eine Auftragsverarbeitungsvereinbarung (AVV) ist in allen Paketen enthalten.',
  },
  {
    frage: 'Wie funktioniert die Besucher-Identifikation technisch?',
    antwort: 'Unser Snippet gleicht die IP-Adressen Ihrer Besucher mit unserer proprietären Firmendatenbank ab — ähnlich wie Leadinfo, aber mit eigener KI-Anreicherung. So erkennen wir Unternehmensname, Branche, Mitarbeiterzahl und Standort. Personenbezogene Privatdaten werden nicht erfasst.',
  },
  {
    frage: 'Wie schnell sehe ich erste Ergebnisse?',
    antwort: 'Unmittelbar nach dem Einbinden des Snippets — in der Regel innerhalb von 5 Minuten. Bereits der nächste Firmenbesucher erscheint in Echtzeit in Ihrem Dashboard. Die KI-Scoring-Modelle kalibrieren sich innerhalb der ersten 7 Tage auf Ihren spezifischen Traffic.',
  },
  {
    frage: 'Mit welchen CRM-Systemen lässt sich LeadPulse verbinden?',
    antwort: 'Native Integrationen gibt es für HubSpot, Salesforce, Pipedrive, Zoho, Microsoft Dynamics und über 50 weitere Tools via Zapier, Make oder unsere REST-API. Der Sync läuft bidirektional und in Echtzeit.',
  },
  {
    frage: 'Was unterscheidet LeadPulse von Leadinfo oder ähnlichen Tools?',
    antwort: 'Drei Dinge: Erstens unser KI-Scoring, das Kaufbereitschaft statt nur Besuche misst. Zweitens vollständige Datenhoheit in Deutschland ohne Cookie-Pflicht. Drittens transparente, faire Preise ohne versteckte Volumenlimits oder Zwangs-Upgrades.',
  },
  {
    frage: 'Kann ich LeadPulse wirklich jederzeit kündigen?',
    antwort: 'Ja. Alle Pakete sind monatlich kündbar — ohne Mindestlaufzeit, ohne Kündigungsfristen über den laufenden Monat hinaus. Bei jährlicher Zahlung erstatten wir nicht genutzte Monate anteilig zurück.',
  },
]

export default function FAQ() {
  const [offen, setOffen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-brand-light mb-3 tracking-wide uppercase">FAQ</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Häufige Fragen — ehrlich beantwortet
          </h2>
        </div>

        <div className="space-y-3">
          {fragen.map((f, i) => {
            const aktiv = offen === i
            return (
              <motion.div
                key={f.frage}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className={`noise-card overflow-hidden transition-colors ${aktiv ? 'border-brand/40' : ''}`}
              >
                <button
                  onClick={() => setOffen(aktiv ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-white text-[15px]">{f.frage}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${aktiv ? 'rotate-180 text-brand-light' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {aktiv && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p className="px-6 pb-6 text-slate-400 leading-relaxed text-[15px]">{f.antwort}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
