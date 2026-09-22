import { createClient } from '@/lib/supabase/server'
import { Filter } from 'lucide-react'
import SearchPill from '@/components/SearchPill'
import GenerateReportButton from '@/components/admin/GenerateReportButton'

export default async function AdminDonorRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : ''

  let query = supabase.from('donors').select('*').order('created_at', { ascending: false })
  
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
  }

  const { data: donors } = await query
    
  const rows = donors || []

  return (
    <div>
      <header className="page-header stagger-1 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="page-title">Donor Records</h2>
          <p className="page-subtitle">Manage donor profiles, eligibility, and history.</p>
        </div>
        <GenerateReportButton type="donors" />
      </header>

      <section className="card table-card stagger-2">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50">
          <SearchPill placeholder="Search by name or email..." />
          <button className="btn-outline flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Blood Type</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-red-50/50">
                    <td className="font-bold text-stone-900">
                      {row.full_name}
                      <div className="text-xs font-normal text-stone-500">{row.email}</div>
                    </td>
                    <td>
                      <span className="font-extrabold text-red-700">{row.blood_type || 'Unknown'}</span>
                    </td>
                    <td className="text-stone-600">{row.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'}`}>
                        {row.status || 'active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-500">
                    No donor records found.
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
