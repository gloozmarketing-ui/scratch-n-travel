import { useState } from 'react'
import { tours } from '../data/data'

const difficulties = ['All', 'Easy', 'Moderate', 'Hard']
const categories = ['All', 'Photography', 'History', 'Surf', 'Culture', 'Food', 'Adventure']

export default function Tours() {
  const [diffFilter, setDiffFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')
  const [liked, setLiked] = useState<number[]>([])
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  let filtered = tours
  if (diffFilter !== 'All') filtered = filtered.filter(t => t.difficulty === diffFilter)
  if (catFilter !== 'All') filtered = filtered.filter(t => t.category === catFilter)

  const toggleLike = (id: number) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Community Routes · GPS-verified</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Community Tours</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">routes built by real walkers</p>
          </div>
          <button onClick={() => setShowSubmit(!showSubmit)} className="btn btn-primary">+ Submit a Route</button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Submit form */}
        {showSubmit && (
          <div className="card p-6">
            <h2 className="font-display text-[#C9A84C] font-bold mb-4">Submit Your Route</h2>
            {submitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="font-display text-[#F4E4C1] text-lg font-bold">Route submitted for review!</p>
                <p className="font-body text-[#8A9AAA] mt-2">Our community will rate and verify your route within 72h.</p>
                <button onClick={() => { setShowSubmit(false); setSubmitted(false) }} className="btn btn-secondary mt-4">Close</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Route Name</label>
                  <input className="field" placeholder="e.g. Secret Viewpoints of Porto" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Start Point</label>
                  <input className="field" placeholder="e.g. Ribeira Square, Porto" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Approximate Distance</label>
                  <input className="field" placeholder="e.g. 7.5 km" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Difficulty</label>
                  <select className="field">
                    {['Easy','Moderate','Hard'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Description & Tips</label>
                  <textarea className="field h-24 resize-none" placeholder="Describe the route, best time to walk, hidden highlights, local tips…" />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={() => setSubmitted(true)} className="btn btn-primary flex-1">Submit Route</button>
                  <button onClick={() => setShowSubmit(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.5)] uppercase">Difficulty:</span>
            {difficulties.map(d => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`btn text-[0.65rem] py-1 px-3 ${diffFilter === d ? 'btn-primary' : 'btn-ghost'}`}>{d}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.5)] uppercase">Type:</span>
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`btn text-[0.65rem] py-1 px-3 ${catFilter === c ? 'btn-primary' : 'btn-ghost'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Tour cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(tour => (
            <div key={tour.id} className="card overflow-hidden group">
              <div className="relative h-48">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {tour.tags.slice(0,3).map(tag => (
                    <span key={tag} className="font-mono text-[0.6rem] bg-[rgba(12,24,37,0.8)] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.85)] px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`font-mono text-[0.62rem] px-2 py-0.5 rounded-full border ${
                    tour.difficulty === 'Easy' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                    tour.difficulty === 'Moderate' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                    'text-red-400 border-red-400/30 bg-red-400/10'
                  }`}>{tour.difficulty}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-[#F4E4C1] font-bold text-base leading-tight">{tour.title}</h3>
                  <span className="font-mono text-[#C9A84C] text-xs flex-shrink-0">★ {tour.rating}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-[0.6rem] flex-shrink-0">{tour.avatar}</div>
                  <p className="font-mono text-[0.62rem] text-[#8A9AAA]">by {tour.creator} · {tour.reviews} reviews</p>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[['📏',tour.distance],['⏱',tour.duration],['📍',`${tour.stops} stops`],['♥',`${tour.likes + (liked.includes(tour.id) ? 1 : 0)}`]].map(([ic,v]) => (
                    <div key={String(v)} className="bg-[#0C1825] rounded-lg py-2 text-center">
                      <p className="text-sm mb-0.5">{ic}</p>
                      <p className="font-mono text-[0.6rem] text-[#F4E4C1]">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[0.65rem] text-[#8A9AAA] mb-4">
                  Best time: <span className="text-[#C9A84C]">{tour.bestTime}</span>
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-primary flex-1 text-[0.68rem]">↓ Export GPX</button>
                  <button
                    onClick={() => toggleLike(tour.id)}
                    className={`btn text-[0.68rem] px-3 ${liked.includes(tour.id) ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {liked.includes(tour.id) ? '♥' : '♡'}
                  </button>
                  <button className="btn btn-ghost text-[0.68rem] px-3">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🗺️</p>
            <p className="font-display text-[#F4E4C1] text-lg">No routes match your filters</p>
            <p className="font-body text-[#8A9AAA] mt-1">Try removing a filter or submit your own route</p>
          </div>
        )}
      </div>
    </div>
  )
}
