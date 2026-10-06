import { useState } from 'react'

type CheckItem = { id: number; text: string; checked: boolean }

const familyDefaults = [
  'Sunscreen SPF 50+','Child life jacket','Snacks & water bottles (2 L each)',
  'First aid kit with bandages','Local SIM card or eSIM data','Emergency contact list (laminated)',
  'Activity-appropriate footwear','Passport & ID copies (digital + paper)','Travel insurance docs',
  'Child-friendly insect repellent','Portable charger','Foldable pushchair / carrier',
]

const petsDefaults = [
  'Vaccination & health certificate records','Pet passport (EU travel)','Collapsible water bowl',
  'Waste bags & wet wipes','Pet-safe sunscreen','Familiar toy or comfort blanket',
  'Emergency vet contact + travel vet list','Tick & flea prevention treatment','Harness & ID tag',
  'Cooling mat for hot days','Travel crate or safety car harness','Food for full trip duration',
]

const adventureDefaults = [
  'Quality hiking boots (broken in)','Navigation app (offline maps downloaded)',
  'Emergency whistle & mirror','Headlamp + spare batteries','Water purification tablets',
  'Lightweight bivouac bag','Micro-fibre towel','Waterproof jacket + warm layer',
  'High-energy snacks (3000 kcal/day)','Satellite communicator or PLB',
  'Local emergency numbers saved','Altitude sickness medication (if relevant)',
]

function buildList(defaults: string[]): CheckItem[] {
  return defaults.map((text, i) => ({ id: i + 1, text, checked: false }))
}

export default function Checklists() {
  const [tab, setTab] = useState<'family'|'pets'|'adventure'|'custom'>('family')
  const [family, setFamily] = useState<CheckItem[]>(buildList(familyDefaults))
  const [pets, setPets] = useState<CheckItem[]>(buildList(petsDefaults))
  const [adventure, setAdventure] = useState<CheckItem[]>(buildList(adventureDefaults))
  const [custom, setCustom] = useState<CheckItem[]>([])
  const [newItem, setNewItem] = useState('')

  const listMap = { family, pets, adventure, custom }
  const setterMap = { family: setFamily, pets: setPets, adventure: setAdventure, custom: setCustom }

  const currentList = listMap[tab]
  const setter = setterMap[tab]

  const toggleItem = (id: number) => {
    setter(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it))
  }

  const addItem = () => {
    if (!newItem.trim()) return
    setter(prev => [...prev, { id: Date.now(), text: newItem.trim(), checked: false }])
    setNewItem('')
  }

  const removeItem = (id: number) => setter(prev => prev.filter(it => it.id !== id))
  const uncheckAll = () => setter(prev => prev.map(it => ({ ...it, checked: false })))

  const done = currentList.filter(it => it.checked).length
  const pct = currentList.length ? Math.round((done / currentList.length) * 100) : 0

  const tabs: { key: typeof tab; label: string; icon: string }[] = [
    { key: 'family', label: 'Family & Kids', icon: '👨‍👩‍👧' },
    { key: 'pets', label: 'Pets & Dogs', icon: '🐾' },
    { key: 'adventure', label: 'Adventure', icon: '⛰️' },
    { key: 'custom', label: 'Custom', icon: '✏️' },
  ]

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Pack Smart · Travel Light · Arrive Ready</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Travel Checklists</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">everything in its place</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`btn flex-col py-3 px-2 gap-1 h-auto text-[0.62rem] ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}>
              <span className="text-lg">{t.icon}</span>
              <span className="leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="font-display text-[#F4E4C1] font-bold">{tabs.find(t => t.key === tab)?.icon} {tabs.find(t => t.key === tab)?.label} Checklist</p>
            <span className="font-mono text-[#C9A84C] text-sm">{done}/{currentList.length}</span>
          </div>
          <div className="xp-bar mb-3">
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>
          {pct === 100 && currentList.length > 0 && (
            <p className="font-script text-emerald-400 text-lg text-center">Ready to explore! ✓</p>
          )}
        </div>

        {/* List */}
        <div className="card p-5 space-y-2">
          {currentList.length === 0 && (
            <p className="font-body text-[#8A9AAA] text-center py-8">Add items below to build your custom checklist.</p>
          )}
          {currentList.map(item => (
            <div key={item.id} className="flex items-center gap-3 group py-1">
              <button onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'gold-gradient border-transparent' : 'border-[rgba(201,168,76,0.3)] hover:border-[rgba(201,168,76,0.6)]'}`}>
                {item.checked && <span className="text-[#0C1825] text-[10px] font-black">✓</span>}
              </button>
              <span className={`font-body text-[1rem] flex-1 transition-colors ${item.checked ? 'line-through text-[#8A9AAA]' : 'text-[#F4E4C1]'}`}>
                {item.text}
              </span>
              <button onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-[#8A9AAA] hover:text-red-400 transition-all text-xs font-mono">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add item */}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            className="field flex-1"
            placeholder="Add item to checklist…"
          />
          <button onClick={addItem} className="btn btn-primary px-5">+ Add</button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={uncheckAll} className="btn btn-ghost text-[0.7rem]">↺ Uncheck All</button>
          <button className="btn btn-secondary text-[0.7rem]">↓ Download PDF</button>
          <button className="btn btn-ghost text-[0.7rem]">Share List</button>
        </div>

        {/* Safety reminder */}
        <div className="parchment rounded-xl p-5">
          <p className="font-display text-[#2C1810] font-bold mb-3">🛡️ Safety Golden Rules</p>
          <div className="space-y-2">
            {[
              'First meetups with locals: public places only',
              'Share your live location with a trusted contact',
              'Maintain independent transportation at all times',
              'Trust your instincts — you can exit any situation',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#8B3A2A] text-sm flex-shrink-0 font-bold">{i + 1}.</span>
                <p className="font-body text-[#2C1810] text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
