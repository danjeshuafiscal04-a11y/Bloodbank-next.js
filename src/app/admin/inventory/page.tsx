import { createClient } from '@/lib/supabase/server'
import { Activity, AlertTriangle, Database, History, Search, SlidersHorizontal } from 'lucide-react'
import InventoryHeaderActions from '@/components/admin/InventoryHeaderActions'
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
    query = query.ilike('unit_code', `%${q}%`)
  }

  const { data: items } = await query
    
  const rows = items || []

  const summary: Record<string, number> = {}
  if (rows.length > 0) {
    rows.forEach(unit => {
      summary[unit.blood_type] = (summary[unit.blood_type] || 0) + (unit.units || 1)
    })
  } else {
    summary['O+'] = 8; summary['O-'] = 1; summary['A+'] = 6; summary['A-'] = 3;
    summary['B+'] = 5; summary['B-'] = 2; summary['AB+'] = 1; summary['AB-'] = 1;
  }

  const stockDefaults = [
    { type: 'O+', units: summary['O+'] || 0, goal: 400 },
    { type: 'O-', units: summary['O-'] || 0, goal: 100 },
    { type: 'A+', units: summary['A+'] || 0, goal: 350 },
    { type: 'A-', units: summary['A-'] || 0, goal: 150 },
    { type: 'B+', units: summary['B+'] || 0, goal: 200 },
    { type: 'B-', units: summary['B-'] || 0, goal: 100 },
    { type: 'AB+', units: summary['AB+'] || 0, goal: 200 },
    { type: 'AB-', units: summary['AB-'] || 0, goal: 50 },
  ].map(s => {
    const ratio = s.units / s.goal;
    let status = 'Stable';
    if (ratio < 0.1) status = 'Critical';
    else if (ratio < 0.25) status = 'Low';
    return { ...s, status };
  });

  const totalUnits = Object.values(summary).reduce((a, b) => a + b, 0);

  // Map rows to standard fallback if needed.
  const inventoryRows = rows.length > 0 ? rows.map(r => ({
    blood_type: r.blood_type,
    component_type: r.component_type || 'Whole Blood',
    unit_code: r.unit_code,
    collection_date: r.collection_date || 'Not provided',
    status: r.status
  })) : [
    { blood_type: 'AB+', component_type: 'Platelets', unit_code: '#26007-PL', collection_date: 'Jun 23, 2026', status: 'Quarantined' },
    { blood_type: 'AB-', component_type: 'Whole Blood', unit_code: '#26008-WB', collection_date: 'Jun 23, 2026', status: 'Available' },
    { blood_type: 'O+', component_type: 'Plasma', unit_code: '#26009-PL', collection_date: 'Jun 23, 2026', status: 'Available' },
    { blood_type: 'A+', component_type: 'Plasma', unit_code: '#26010-PL', collection_date: 'Jun 23, 2026', status: 'Available' },
    { blood_type: 'B-', component_type: 'Whole Blood', unit_code: '#26006-WB', collection_date: 'Jun 22, 2026', status: 'Available' },
    { blood_type: 'B+', component_type: 'Platelets', unit_code: '#26005-PL', collection_date: 'Jun 21, 2026', status: 'Available' },
    { blood_type: 'A-', component_type: 'Whole Blood', unit_code: '#26004-WB', collection_date: 'Jun 20, 2026', status: 'Available' },
    { blood_type: 'A+', component_type: 'Platelets', unit_code: '#26003-PL', collection_date: 'Jun 19, 2026', status: 'Expiring Soon' },
    { blood_type: 'O-', component_type: 'Whole Blood', unit_code: '#26002-WB', collection_date: 'Jun 18, 2026', status: 'Available' },
    { blood_type: 'O+', component_type: 'Whole Blood', unit_code: '#26001-WB', collection_date: 'Jun 17, 2026', status: 'Available' },
  ];

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <header>
          <h1 className="page-title">Blood Inventory</h1>
          <p className="page-subtitle">Live stock monitoring and management.</p>
        </header>
        <InventoryHeaderActions totalUnits={totalUnits} />
      </div>

      <section className="metric-grid">
        <article className="card metric-card is-red">
          <div className="metric-top">
            <p className="metric-label">Total Units</p>
            <Database size={18} />
          </div>
          <p className="metric-value">{totalUnits || 27}</p>
          <p className="metric-subtext">+48 since yesterday</p>
        </article>
        <article className="card metric-card">
          <div className="metric-top">
            <p className="metric-label">Critical Alerts</p>
            <AlertTriangle size={18} className="text-red-700" />
          </div>
          <p className="metric-value">3 Groups</p>
          <p className="metric-subtext">Below safety threshold</p>
        </article>
        <article className="card metric-card">
          <div className="metric-top">
            <p className="metric-label">Recent Collections</p>
            <History size={18} className="text-red-700" />
          </div>
          <p className="metric-value">124 Units</p>
          <p className="metric-subtext">In the last 24 hours</p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stockDefaults.map((stock) => (
          <article key={stock.type} className="card stock-card">
            <div className="mb-6 flex items-start justify-between">
              <h2 className="stock-type">{stock.type}</h2>
              <span className={`badge ${stock.status === 'Critical' ? 'is-active' : (stock.status === 'Low' ? 'status-warning' : '')}`}>
                {stock.status.toUpperCase()}
              </span>
            </div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <p>
                <span className="stock-units">{stock.units}</span> <span className="text-stone-600">units</span>
              </p>
              <span className="text-xs text-stone-500">Goal: {stock.goal}</span>
            </div>
            <div className="stock-progress">
              <span style={{ width: `${Math.min(100, Math.round((stock.units / stock.goal) * 100))}%` }}></span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_440px]">
        <article className="card p-5">
          <div className="mb-4 flex justify-between">
            <h2 className="section-title">Stock Movement (7 Days)</h2>
            <p className="font-bold text-red-700">• Inflow &nbsp; • Outflow</p>
          </div>
          <div className="bar-chart">
            {[
              ['Mon', 58, 42],
              ['Tue', 42, 58],
              ['Wed', 75, 36],
              ['Thu', 36, 68],
              ['Fri', 68, 44],
              ['Sat', 44, 56],
              ['Today', 92, 72]
            ].map(([day, inflow, outflow], i, arr) => (
              <div key={day as string} className="bar-group">
                <span className="bar is-soft" title={`${day} inflow: ${inflow} units`} style={{ height: `${inflow}%` }}></span>
                <span className={`bar ${i === arr.length - 1 ? 'is-muted' : 'is-soft'}`} title={`${day} outflow: ${outflow} units`} style={{ height: `${Math.max(28, outflow as number)}%` }}></span>
              </div>
            ))}
          </div>
          <div className="bar-labels">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
          </div>
        </article>

        <aside className="card p-5">
          <h2 className="section-title flex items-center gap-2">
            <Activity size={18} className="text-red-700" /> Storage Status
          </h2>
          <div className="mt-5 space-y-3">
            {[
              ['Alpha (Whole Blood)', '4.2°C', 'Stable', 'Target: 2-6°C'],
              ['Gamma (Platelets)', '24.5°C', 'High Alert', 'Target: 20-24°C'],
              ['Beta (Plasma)', '-30.0°C', 'Stable', 'Target: <-25°C']
            ].map(([name, temp, status, target]) => (
              <div key={name} className="rounded-lg bg-stone-50 p-4">
                <div className="flex justify-between font-bold">
                  <span>{name}</span>
                  <span className="text-red-700">{temp}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className={`badge ${status === 'High Alert' ? 'is-active' : ''}`}>
                    {status.toUpperCase()}
                  </span>
                  <span>{target}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-7 inventory-workspace" data-inventory-workspace>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title text-2xl">Blood Stock Detailed View</h2>
            <p className="text-sm text-stone-600">Manage and monitor individual blood component units.</p>
          </div>
          <div className="inventory-toolbar">
            <SearchPill 
              className="search-pill block"
              inputClassName="!w-[240px] bg-transparent outline-none text-sm text-stone-900"
              placeholder="Search inventory..."
            />
            <div className="inventory-filter-wrap">
              <button className="btn-primary" type="button" data-inventory-filter-toggle aria-expanded="false" aria-controls="inventory-filter-menu">
                <SlidersHorizontal size={16} className="inline-block mr-2" /> Filter
              </button>
            </div>
          </div>
        </div>

        <div className="card table-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Component</th>
                  <th>Unit ID</th>
                  <th>Collection Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody data-inventory-table-body>
                {inventoryRows.map((row, i) => (
                  <tr key={i}>
                    <td className="font-bold">{row.blood_type}</td>
                    <td>{row.component_type}</td>
                    <td>{row.unit_code}</td>
                    <td>{row.collection_date}</td>
                    <td>
                      <span className={`badge ${row.status?.toLowerCase() === 'available' ? '' : 'status-warning'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
