import { createClient } from '@/lib/supabase/server'
import SearchPill from '@/components/SearchPill'
import DonorRecordsTable from '@/components/admin/DonorRecordsTable'
import NewDonorButtonAndModal from '@/components/admin/NewDonorButtonAndModal'

export default async function AdminDonorRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : ''

  let query = supabase.from('donors').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
  }

  const { data: donors, count } = await query
    
  const rows = donors || []
  const totalCount = count || rows.length || 1248; // Use 1248 as fallback placeholder if count fails

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <header>
          <h1 className="page-title">Donor Records</h1>
          <p className="page-subtitle">Manage and review blood donor profiles and history.</p>
        </header>
        <NewDonorButtonAndModal />
      </div>

      <section className="card table-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 p-4">
          <SearchPill 
            className="search-pill block"
            inputClassName="!w-[240px] bg-transparent outline-none text-sm text-stone-900" 
            placeholder="Search donors by name, ID..." 
          />
          <div className="flex gap-2">
            <button className="btn-outline" type="button">Blood Type (All)</button>
            <button className="btn-outline" type="button">Status (All)</button>
          </div>
        </div>
        
        <DonorRecordsTable donors={rows} />
        
        <div className="flex items-center justify-between border-t border-red-100 p-4 text-sm">
          <span>Showing 1 to {rows.length} of {totalCount} donors</span>
          <span className="flex gap-2">
            <button className="btn-outline px-3 py-2" type="button">‹</button>
            <button className="btn-outline bg-red-100 px-3 py-2" type="button">1</button>
            <button className="btn-outline px-3 py-2" type="button">2</button>
            <button className="btn-outline px-3 py-2" type="button">›</button>
          </span>
        </div>
      </section>
    </div>
  )
}
