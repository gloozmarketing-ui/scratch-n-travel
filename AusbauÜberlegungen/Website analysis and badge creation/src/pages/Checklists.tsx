import React, { useState, useEffect } from 'react'
import { useTravel } from '../context/TravelContext'

type CheckItem = { id: number; text: string; checked: boolean; categoryTag?: string }

const dogPacklistDefaults: string[] = [
  'EU-Heimtierausweis & Tollwut-Impfnachweis',
  'Faltbarer Silikon-Wassernapf & 1.5L Wasserflasche',
  'Kotbeutel (biologisch abbaubar) & Feuchttücher',
  'Zeckenzange & Wunddesinfektionsspray für Tiere',
  'Gut sitzendes Y-Geschirr & 2m-Führleine (plus Schleppleine)',
  'Autosicherheitsgurt oder Transportbox',
  'Kühlmatte für heiße Sommertage',
  'Notfall-Tierarzt-Liste der Zielregion',
  'Vertraute Kuscheldecke & Lieblingsspielzeug',
  'Trockenfutter & Leckerlis für die gesamte Reisedauer',
  'Maulkorb (in manchen Ländern für Öffis/Seilbahnen Pflicht)',
  'Hundepfoten-Balsam (für Fels & heißen Sand)',
]

const familyKidsDefaults: string[] = [
  'Sonnenschutzcreme LSF 50+ (mineralisch)',
  'Regenschutz & Sonnensegel für den Kinderwagen',
  'Kinderschwimmwesten für Strand & Bootstouren',
  'Ausreichend Snacks & auslaufsichere Trinkflaschen',
  'Erste-Hilfe-Set mit Kinderpflastern & Fieberthermometer',
  'Ergonomische Babytrage / Kraxe für unebenes Gelände',
  'Feuchttücher, Wickelunterlage & Wechselkleidung',
  'Reiseapotheke (Elektrolyte, Mückenspray, Wundsalbe)',
  'Kompakte Picknickdecke mit wasserfester Unterseite',
  'Lieblingsbuch oder Reisespiel für Fahrten',
  'Reisepässe & Krankenkassenkarten der Kinder',
]

const surfOceanDefaults: string[] = [
  'Neoprenanzug (3/2mm oder 4/3mm je nach Region)',
  'Surfboard-Wax (Cold/Warm/Tropical) & Wax-Kamm',
  'Leash & Ersatz-Leash-Cord',
  'Fin Key (Inbusschlüssel) & Ersatz-Finnen-Schrauben',
  'Mineralische Zink-Sonnencreme (Eco Reef Safe)',
  'Wasserdichter Dry Bag (20L) für Neopren & Wertsachen',
  'Surf-Poncho / Umkleidetuch aus Mikrofaser',
  'Ohrenstöpsel (Surfer’s Ear Schutz)',
  'Dachträger-Spanngurte mit Polstern',
  'Reparatur-Set (Solarez UV-Harz & Sandpapier)',
]

const vanlifeCampingDefaults: string[] = [
  'Auffahrkeile zum Nivellieren des Fahrzeugs',
  'Camping-Gaskocher & passende Ersatz-Kartuschen',
  'Trinkwasserkanister (15–20 L) mit Auslaufhahn',
  'Tragbare Powerstation / Solartasche',
  'Stirnlampe mit Rotlicht-Modus & Ersatz-Akkus',
  'Outdoor-Hängematte mit Baumgurten',
  'Faltbarer Campingstuhl & kleiner Alutisch',
  'Biologisch abbaubares Spülmittel & Schwamm',
  'Kompakte Schaufel & Multitool',
  'Warmer Schlafsack (Komfortbereich bis 5°C)',
]

const alpineHikingDefaults: string[] = [
  'Eingelaufene, knöchelhohe Bergstiefel (Kategorie B/C)',
  'Atmungsaktive Hardshell-Regenjacke & Fleece-Midlayer',
  'Erste-Hilfe-Set mit Blasenpflastern & Tape',
  'Alu-Notfall-Biwaksack (für 2 Personen)',
  'Verstellbare Trekkingstöcke',
  'Offline-Karten (GPX) auf Smartphone & Powerbank',
  'Notfallpfeife am Rucksackgurt & Taschenmesser',
  '2 Liter Wasser (Trinkblase oder Thermosflasche)',
  'Energiereiche Bergnahrung (Nüsse, Riegel, Trockenfrüchte)',
  'Sonnenbrille (Kategorie 3/4) & Kopfbedeckung',
]

function buildItems(list: string[]): CheckItem[] {
  return list.map((text, i) => ({ id: i + 1, text, checked: false }))
}

export default function Checklists() {
  const { triggerHaptic } = useTravel()
  const [tab, setTab] = useState<'dog' | 'family' | 'surf' | 'vanlife' | 'alpine' | 'custom'>('dog')
  const [dogList, setDogList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_dog')
    return saved ? JSON.parse(saved) : buildItems(dogPacklistDefaults)
  })
  const [familyList, setFamilyList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_family')
    return saved ? JSON.parse(saved) : buildItems(familyKidsDefaults)
  })
  const [surfList, setSurfList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_surf')
    return saved ? JSON.parse(saved) : buildItems(surfOceanDefaults)
  })
  const [vanlifeList, setVanlifeList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_vanlife')
    return saved ? JSON.parse(saved) : buildItems(vanlifeCampingDefaults)
  })
  const [alpineList, setAlpineList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_alpine')
    return saved ? JSON.parse(saved) : buildItems(alpineHikingDefaults)
  })
  const [customList, setCustomList] = useState<CheckItem[]>(() => {
    const saved = localStorage.getItem('snt_check_custom')
    return saved ? JSON.parse(saved) : []
  })
  const [newItem, setNewItem] = useState('')
  const [copied, setCopied] = useState(false)

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('snt_check_dog', JSON.stringify(dogList))
  }, [dogList])
  useEffect(() => {
    localStorage.setItem('snt_check_family', JSON.stringify(familyList))
  }, [familyList])
  useEffect(() => {
    localStorage.setItem('snt_check_surf', JSON.stringify(surfList))
  }, [surfList])
  useEffect(() => {
    localStorage.setItem('snt_check_vanlife', JSON.stringify(vanlifeList))
  }, [vanlifeList])
  useEffect(() => {
    localStorage.setItem('snt_check_alpine', JSON.stringify(alpineList))
  }, [alpineList])
  useEffect(() => {
    localStorage.setItem('snt_check_custom', JSON.stringify(customList))
  }, [customList])

  const listMap = {
    dog: dogList,
    family: familyList,
    surf: surfList,
    vanlife: vanlifeList,
    alpine: alpineList,
    custom: customList,
  }

  const setterMap = {
    dog: setDogList,
    family: setFamilyList,
    surf: setSurfList,
    vanlife: setVanlifeList,
    alpine: setAlpineList,
    custom: setCustomList,
  }

  const currentList = listMap[tab]
  const currentSetter = setterMap[tab]

  const toggleItem = (id: number) => {
    triggerHaptic(10)
    currentSetter(prev => prev.map(it => (it.id === id ? { ...it, checked: !it.checked } : it)))
  }

  const addItem = () => {
    if (!newItem.trim()) return
    triggerHaptic(15)
    currentSetter(prev => [...prev, { id: Date.now(), text: newItem.trim(), checked: false }])
    setNewItem('')
  }

  const removeItem = (id: number) => {
    triggerHaptic(8)
    currentSetter(prev => prev.filter(it => it.id !== id))
  }

  const uncheckAll = () => {
    triggerHaptic(12)
    currentSetter(prev => prev.map(it => ({ ...it, checked: false })))
  }

  const handleCopyList = () => {
    triggerHaptic(15)
    const header = `📋 Scratch'n'Travel Packliste: ${tab.toUpperCase()}\n`
    const body = currentList.map(it => `${it.checked ? ' [✓] ' : ' [ ] '} ${it.text}`).join('\n')
    navigator.clipboard.writeText(header + body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const doneCount = currentList.filter(it => it.checked).length
  const pct = currentList.length ? Math.round((doneCount / currentList.length) * 100) : 0

  const tabs = [
    { key: 'dog', label: 'Hund & Pet Travel', icon: '🐕' },
    { key: 'family', label: 'Familie & Kinderwagen', icon: '👶' },
    { key: 'surf', label: 'Surf & Ozean', icon: '🏄' },
    { key: 'vanlife', label: 'Vanlife & Camping', icon: '🚐' },
    { key: 'alpine', label: 'Alpin & Trekking', icon: '🥾' },
    { key: 'custom', label: 'Eigene Liste', icon: '✏️' },
  ] as const

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Smart Packing · Dog &amp; Family Ready · LocalStorage Synced</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Reise- &amp; Packlisten</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">alles an seinem platz für ein unbeschwertes abenteuer</p>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                triggerHaptic(10)
                setTab(t.key)
              }}
              className={`btn flex-col py-2.5 px-2 gap-1 h-auto text-[0.68rem] transition-all ${
                tab === t.key ? 'btn-primary font-bold shadow-lg scale-[1.02]' : 'btn-ghost bg-[#152539]/60'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Progress Card */}
        <div className="card p-5 border border-[rgba(201,168,76,0.25)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tabs.find(t => t.key === tab)?.icon}</span>
              <p className="font-display text-[#F4E4C1] font-bold">
                {tabs.find(t => t.key === tab)?.label}
              </p>
            </div>
            <span className="font-mono text-[#C9A84C] text-sm font-bold">
              {doneCount} / {currentList.length} erledigt ({pct}%)
            </span>
          </div>

          <div className="xp-bar mb-3">
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>

          {pct === 100 && currentList.length > 0 && (
            <p className="font-script text-emerald-400 text-lg text-center font-bold">
              🌟 Alles gepackt! Bereit für die Reise!
            </p>
          )}
        </div>

        {/* Checkable List */}
        <div className="card p-5 space-y-2 border border-[rgba(201,168,76,0.15)]">
          {currentList.length === 0 && (
            <p className="font-body text-[#8A9AAA] text-center py-8">
              Noch keine Gegenstände in dieser Liste. Füge unten neue Punkte hinzu!
            </p>
          )}

          {currentList.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 group py-2 border-b border-[rgba(201,168,76,0.06)] last:border-0"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.checked
                    ? 'gold-gradient border-transparent shadow'
                    : 'border-[rgba(201,168,76,0.4)] hover:border-[#C9A84C]'
                }`}
              >
                {item.checked && <span className="text-[#0C1825] text-xs font-black">✓</span>}
              </button>

              <span
                onClick={() => toggleItem(item.id)}
                className={`font-body text-sm flex-1 cursor-pointer select-none transition-colors ${
                  item.checked ? 'line-through text-[#8A9AAA]' : 'text-[#F4E4C1]'
                }`}
              >
                {item.text}
              </span>

              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-[#8A9AAA] hover:text-red-400 transition-all text-xs font-mono px-2"
                title="Eintrag entfernen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add item field */}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            className="field flex-1"
            placeholder="Neuen Gegenstand zur Packliste hinzufügen (z. B. Stirnlampe, Regenjacke)..."
          />
          <button onClick={addItem} className="btn btn-primary px-5 font-bold">
            + Hinzufügen
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={uncheckAll} className="btn btn-ghost text-xs py-2 px-3">
            ↺ Alle abwählen
          </button>
          <button onClick={handleCopyList} className="btn btn-secondary text-xs py-2 px-3 font-bold">
            {copied ? '✓ Liste in Zwischenablage kopiert!' : '📋 Packliste kopieren / teilen'}
          </button>
        </div>

        {/* Safety & Travel Best Practices Box */}
        <div className="parchment rounded-xl p-5 text-[#2C1810]">
          <p className="font-display font-bold text-base mb-3 flex items-center gap-2">
            <span>🛡️</span>
            <span>Scratch'n'Travel Sicherheits- &amp; Vorbereitungsregeln</span>
          </p>
          <div className="space-y-2 text-xs font-body">
            <div className="flex items-start gap-2">
              <span className="font-mono text-[#8B3A2A] font-bold">1.</span>
              <p><strong>Offline-Karten:</strong> Lade GPX-Tracks und Google/OSM-Karten immer vor Antritt der Route herunter.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-[#8B3A2A] font-bold">2.</span>
              <p><strong>Wasserquellen mit Vierbeinern:</strong> Führe immer mindestens 1 Liter Trinkwasser extra für deinen Hund mit.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-[#8B3A2A] font-bold">3.</span>
              <p><strong>Notfall-Kontakte:</strong> Hinterlege die Koordinaten deiner Route bei deiner Unterkunft oder deinen Notfallkontakten.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
