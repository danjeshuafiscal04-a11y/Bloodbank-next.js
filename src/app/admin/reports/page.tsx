import { createClient } from '@/lib/supabase/server'
import { FileText, Download, Activity } from 'lucide-react'
export default async function AdminReportsPage() {
  const supabase = await createClient()
  // Fetch some summary data for reports
  const { count: donorsCount } = await supabase.from('donors').select('*', { count: 'exact', head: true }) || { count: 0 }
  const { count: eligibleCount } = await supabase.from('donors').select('*', { count: 'exact', head: true }).eq('eligibility_status', 'eligible') || { count: 0 }
  const { count: deferredCount } = await supabase.from('donors').select('*', { count: 'exact', head: true }).ilike('eligibility_status', '%defer%') || { count: 0 }
  
  const total = donorsCount || 1
  const eligible = eligibleCount || 0
  const deferred = deferredCount || 0
  const ineligible = total - eligible - deferred
  
  const eligibleRatio = Math.round((eligible / total) * 100)
  const deferredRatio = Math.round((deferred / total) * 100)
  const ineligibleRatio = Math.round((ineligible / total) * 100)
  // Dummy trend
  const trend = [12, 19, 15, 25, 22, 18, 30]
  const maxTrend = Math.max(...trend)
  const reportDistribution = [
    { type: 'O+', share: 45, color: '#b70100' },
    { type: 'O-', share: 7, color: '#9a452a' },
    { type: 'A+', share: 27, color: '#775043' },
    { type: 'A-', share: 6, color: '#ba1a1a' },
    { type: 'B+', share: 9, color: '#ff9473' },
    { type: 'B-', share: 2, color: '#ffb59f' },
    { type: 'AB+', share: 3, color: '#623e32' },
    { type: 'AB-', share: 1, color: '#e60000' }
  ]
  return (
    <div data-report-dashboard>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 stagger-1">
        <header>
          <h1 className="page-title">Analytics and Reports</h1>
          <p className="page-subtitle">Descriptive statistics for donor operations.</p>
        </header>
        <div className="flex flex-wrap items-center gap-3">
          <div className="report-filter-group" role="tablist" aria-label="Blood type report filter">
            {['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type, idx) => (
              <button key={type} className={`report-filter ${idx === 0 ? 'is-active' : ''}`} type="button" data-report-filter={type}>{type}</button>
            ))}
          </div>
          <a className="btn-outline" href="#">
            <Download /> Generate Report
          </a>
        </div>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <article className="card p-6 stagger-2">
          <p className="eyebrow">Total Registered</p>
          <p className="mt-5 text-3xl font-extrabold">{total.toLocaleString()}</p>
          <p className="mt-5 text-stone-600">all blood types</p>
        </article>
        <article className="card p-6 stagger-3">
          <p className="eyebrow">Eligible Donors</p>
          <p className="mt-5 text-3xl font-extrabold">{eligible.toLocaleString()}</p>
          <p className="mt-5 text-stone-600">{eligibleRatio}% eligible</p>
        </article>
        <article className="card p-6 stagger-4">
          <p className="eyebrow">Temp Deferred</p>
          <p className="mt-5 text-3xl font-extrabold">{deferred.toLocaleString()}</p>
          <p className="mt-5 text-stone-600">{deferredRatio}% deferred</p>
        </article>
        <article className="card p-6 stagger-5">
          <p className="eyebrow">Ineligible</p>
          <p className="mt-5 text-3xl font-extrabold">{ineligible.toLocaleString()}</p>
          <p className="mt-5 text-stone-600">{ineligibleRatio}% ineligible</p>
        </article>
        <article className="card p-6 is-red metric-card stagger-5">
          <p className="metric-label">Screened Month</p>
          <p className="mt-5 text-3xl font-extrabold">{total.toLocaleString()}</p>
          <p className="mt-5 text-white">All screenings</p>
        </article>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="card chart-card stagger-3">
          <h2 className="section-title">Type Distribution</h2>
          <div className="mt-12 grid place-items-center">
            <div className="donut" data-tooltip="All blood types: 100%"></div>
          </div>
          <div className="legend mt-8">
            {reportDistribution.map(segment => (
              <span key={segment.type}>
                <span className="legend-dot" style={{ background: segment.color }}></span> {segment.type}: {segment.share}%
              </span>
            ))}
          </div>
        </article>
        
        <article className="card chart-card stagger-4">
          <h2 className="section-title">Eligibility Ratio</h2>
          <div className="mt-10 space-y-5">
            {[
              { label: 'Eligible', value: eligibleRatio, color: '#9a452a' },
              { label: 'Temp Deferred', value: deferredRatio, color: '#775043' },
              { label: 'Ineligible', value: ineligibleRatio, color: '#c40000' }
            ].map(item => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between font-bold">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="progress-line">
                  <span style={{ width: `${item.value}%`, background: item.color }}></span>
                </div>
              </div>
            ))}
          </div>
        </article>
        
        <article className="card chart-card stagger-5">
          <h2 className="section-title">Registration Trend</h2>
          <div className="bar-chart mt-8">
            {trend.map((value, idx) => (
              <div 
                key={idx} 
                className="bar transition-transform hover:scale-105" 
                data-tooltip={`${['Mon','Tue','Wed','Thu','Fri','Sat','Today'][idx]} registered: ${value}`} 
                style={{ height: `${Math.max(8, Math.round((value / maxTrend) * 100))}%` }}
              ></div>
            ))}
          </div>
          <div className="bar-labels">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
          </div>
        </article>
      </section>
    </div>
  )
}
