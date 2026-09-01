import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
      <p className="font-script text-[rgba(201,168,76,0.3)] text-8xl mb-4">404</p>
      <h1 className="font-display text-[#F4E4C1] text-3xl font-bold mb-2">Off the Map</h1>
      <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-6">this trail leads nowhere…</p>
      <p className="font-body text-[#8A9AAA] max-w-xs mb-8 leading-relaxed">
        The location you're looking for hasn't been charted yet. Return to base camp and continue your journey.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary">← Return to Base Camp</Link>
        <Link to="/explore" className="btn btn-secondary">Explore the Map</Link>
      </div>
    </div>
  )
}
