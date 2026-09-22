import { createClient } from '@/lib/supabase/server'
import { Droplet, Plus, Filter } from 'lucide-react'
import SearchPill from '@/components/SearchPill'

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : ''

  let query = supabase.from('inventory_units').select('*').order('created_at', { ascending: false })
  
  if (q) {
    query = query.ilike('unit_id', `%${q}%`)
  }

  const { data: items } = await query
    
  const rows = items || []

  // Count by blood type
  const summary: Record<string, number> = {}
  rows.forEach(unit => {
    summary[unit.blood_type] = (summary[unit.blood_type] || 0) + 1
  })

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

  return (
    <div>
      <header className="page-header stagger-1 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="page-title">Blood Inventory</h2>
          <p className="page-subtitle">Real-time stock levels and unit tracking.</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2">
          <Plus size={16} />
          Log New Unit
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8 mb-8">
        {bloodTypes.map((type, i) => {
          const count = summary[type] || 0
          // Use stagger-2 through stagger-5 for the cards
          const stagger = `stagger-${Math.min(i + 2, 5)}`
          return (
            <div key={type} className={`card ${stagger} p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg ${count < 5 ? 'bg-red-50 border-red-200 text-red-900' : ''}`}>
              <p className="text-xl font-extrabold">{type}</p>
              <p className="text-sm mt-1">{count} units</p>
              {count < 5 && <div className="mt-2 h-1 w-full bg-red-500 rounded-full animate-pulse-subtle"></div>}
            </div>
          )
        })}
      </section>

      <section className="card table-card stagger-5">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50">
          <SearchPill placeholder="Search Unit ID..." />
          <button className="btn-outline flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit Code</th>
                <th>Blood Type</th>
                <th>Component</th>
                <th>Collection Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-red-50/50">
                    <td className="font-mono font-bold text-red-700">{row.unit_code}</td>
                    <td className="font-bold">{row.blood_type}</td>
                    <td className="text-stone-600">{row.component_type || 'Whole Blood'}</td>
                    <td className="whitespace-nowrap">{row.collection_date}</td>
                    <td className="whitespace-nowrap">{row.expiry_date}</td>
                    <td>
                      <span className={`badge ${row.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-stone-500">
                    No inventory units found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
