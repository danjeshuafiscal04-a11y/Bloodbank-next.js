import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'

export default async function AdminCampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    
  const rows = campaigns || []

  return (
    <div>
      <header className="page-header stagger-1 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="page-title">Campaigns</h2>
          <p className="page-subtitle">Manage public blood drives and announcements.</p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md">
          <Plus size={16} />
          New Campaign
        </button>
      </header>

      <section className="campaign-grid stagger-2">
        {rows.length > 0 ? (
          rows.map((campaign, i) => (
            <article key={campaign.id} className={`campaign-card flex flex-col h-full stagger-${Math.min((i % 4) + 2, 5)} transition-all hover:-translate-y-1 hover:shadow-lg`}>
              <div className="campaign-card-media shrink-0">
                <img 
                  className="h-full w-full object-cover transition-transform hover:scale-105 duration-500" 
                  src={campaign.image_url || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=900&q=80'} 
                  alt={campaign.title} 
                />
                <span className="badge absolute left-3 top-3 bg-red-700 text-white border-0">
                  {campaign.status || 'Upcoming'}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold text-stone-900">{campaign.title}</h3>
                <p className="mt-2 text-sm text-stone-600 flex-1">{campaign.description}</p>
                <div className="mt-4 pt-4 border-t border-stone-100 text-xs font-bold text-stone-500 flex justify-between shrink-0">
                  <span>{campaign.date_range}</span>
                  <button className="text-red-700 hover:underline">Edit</button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full card p-12 text-center text-stone-500 stagger-2">
            No campaigns created yet.
          </div>
        )}
      </section>
    </div>
  )
}
