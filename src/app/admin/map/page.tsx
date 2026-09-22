import { createClient } from '@/lib/supabase/server'
import MapWrapper from '@/components/admin/MapWrapper'

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
        <MapWrapper centers={mapCenters as any[]} />
      </div>
    </div>
  )
}
