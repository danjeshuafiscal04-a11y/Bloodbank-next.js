import { createClient } from '@/lib/supabase/server'
import ReportsDashboard from '@/components/admin/ReportsDashboard'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  
  // Fetch all donors once. Filtering will happen on the client.
  const { data: donors } = await supabase.from('donors').select('*').order('created_at', { ascending: false })

  return <ReportsDashboard initialDonors={donors || []} />
}
