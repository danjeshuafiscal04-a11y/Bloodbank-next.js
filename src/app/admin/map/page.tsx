import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
// Leaflet requires the window object to be present.
const MapClient = dynamic(() => import('@/components/admin/MapClient'), { 
  ssr: false,
  loading: () => (
    <div className="card h-[600px] w-full rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center text-stone-500">
      <p className="font-bold animate-pulse">Loading map data...</p>
    </div>
  )
})

export default async function AdminMapPage() {
  const supabase = await createClient()

  // Fetch donation centers from the database
  const { data: centers } = await supabase
    .from('donation_centers')
    .select('*')

  const mapCenters = centers || []

  return (
    <div>
      <header className="page-header stagger-1">
        <h2 className="page-title">Donation Map</h2>
        <p className="page-subtitle">Geospatial overview of regional blood centers and mobile drives.</p>
      </header>

      <div className="stagger-2 mt-4">
        <MapClient centers={mapCenters as any[]} />
      </div>
    </div>
  )
}
