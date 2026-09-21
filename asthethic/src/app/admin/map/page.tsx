import { Map as MapIcon } from 'lucide-react'

export default function AdminMapPage() {
  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Donation Map</h2>
        <p className="text-stone-600">Geospatial overview of regional blood centers and mobile drives.</p>
      </header>

      <div className="card h-[600px] w-full rounded-xl border border-stone-200 bg-stone-100 overflow-hidden shadow-sm relative flex items-center justify-center flex-col gap-4 text-stone-500">
        <MapIcon size={48} className="text-stone-300" />
        <p className="font-bold text-stone-600">Interactive Map Component Placeholder</p>
        <p className="text-sm max-w-sm text-center">In production, this would render a Leaflet or Mapbox map displaying the active centers via geo-coordinates.</p>
      </div>
    </div>
  )
}
