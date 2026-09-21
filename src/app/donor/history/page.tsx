import { createClient } from '@/lib/supabase/server'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('profile_id', user?.id)
    .order('scheduled_at', { ascending: false })

  const rows = appointments || []

  return (
    <div>
      <header className="page-header">
        <h2 className="page-title">Donation History</h2>
        <p className="page-subtitle">Track your contribution journey and impact over time.</p>
      </header>

      <section className="card table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Facility ID</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.scheduled_at ? new Date(row.scheduled_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>Center #{row.donation_center_id || 1}</td>
                    <td>{row.service_type || 'Whole Blood'}</td>
                    <td>
                      <span className="badge">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No donation history yet.
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
