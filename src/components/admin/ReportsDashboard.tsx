'use client'

import { useState } from 'react'
import { FileText, Download, Activity } from 'lucide-react'
import GenerateReportButton from '@/components/admin/GenerateReportButton'
import Link from 'next/link'

export default function ReportsDashboard({ initialDonors }: { initialDonors: any[] }) {
  const [selectedType, setSelectedType] = useState('All')

  const filteredDonors = selectedType === 'All'
    ? initialDonors
    : initialDonors.filter((d: any) => d.blood_type === selectedType)

  const total = filteredDonors.length
  const eligible = filteredDonors.filter((d: any) => d.eligibility_status?.toLowerCase() === 'eligible').length
  const deferred = filteredDonors.filter((d: any) => d.eligibility_status?.toLowerCase().includes('defer')).length
  const ineligible = total - eligible - deferred

  const eligibleRatio = total > 0 ? Math.round((eligible / total) * 100) : 0
  const deferredRatio = total > 0 ? Math.round((deferred / total) * 100) : 0
  const ineligibleRatio = total > 0 ? Math.round((ineligible / total) * 100) : 0

  // Dummy trend
  const trend = [12, 19, 15, 25, 22, 18, 30]
  const maxTrend = Math.max(...trend)

  const fullDistribution = [
    { type: 'O+', share: 20, color: '#b70100' },
    { type: 'O-', share: 10, color: '#9a452a' },
    { type: 'A+', share: 20, color: '#775043' },
    { type: 'A-', share: 10, color: '#ba1a1a' },
    { type: 'B+', share: 10, color: '#ff9473' },
    { type: 'B-', share: 10, color: '#ffb59f' },
    { type: 'AB+', share: 10, color: '#623e32' },
    { type: 'AB-', share: 10, color: '#e60000' }
  ]

  let reportDistribution = fullDistribution
  let donutStyle = {}
  let tooltipText = "All blood types: 100%"

  if (selectedType === 'All') {
    let gradientStops = [];
    let cumulative = 0;
    for (const segment of fullDistribution) {
      const next = cumulative + segment.share;
      gradientStops.push(`${segment.color} ${cumulative}% ${next}%`);
      cumulative = next;
    }
    donutStyle = {
      background: `conic-gradient(${gradientStops.join(', ')})`
    }
  } else {
    const selectedShare = fullDistribution.find(d => d.type === selectedType)?.share || 0;
    reportDistribution = [
      { type: selectedType, share: selectedShare, color: '#b70100' },
      { type: 'Other Blood Types', share: 100 - selectedShare, color: '#e5e7eb' }
    ]
    donutStyle = {
      background: `conic-gradient(#b70100 0 ${selectedShare}%, #e5e7eb ${selectedShare}% 100%)`
    }
    tooltipText = `${selectedType}: ${selectedShare}% | Other: ${100 - selectedShare}%`
  }

  // Recent donors fetch
  const recentDonors = filteredDonors.slice(0, 5)

  const handleDonutPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle += 90;
    if (angle < 0) angle += 360;
    
    const percent = (angle / 360) * 100;
    
    let cumulative = 0;
    let hoveredSlice = null;
    for (const segment of reportDistribution) {
      cumulative += segment.share;
      if (percent <= cumulative) {
        hoveredSlice = segment;
        break;
      }
    }
    
    if (hoveredSlice) {
      e.currentTarget.setAttribute('data-tooltip', `${hoveredSlice.type}: ${hoveredSlice.share}%`);
    }
  };

  const handleDonutPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setAttribute('data-tooltip', tooltipText);
  };

  return (
    <div data-report-dashboard>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 stagger-1">
        <header>
          <h1 className="page-title">Analytics and Reports</h1>
          <p className="page-subtitle">Descriptive statistics for donor operations.</p>
        </header>
        <div className="flex flex-wrap items-center gap-3">
          <div className="report-filter-group" role="tablist" aria-label="Blood type report filter">
            {['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => {
              const isActive = selectedType === type
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`report-filter ${isActive ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                >
                  {type}
                </button>
              )
            })}
          </div>
          <GenerateReportButton type="admin" data={{ total, eligible }} />
        </div>
      </div>
      
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <article className="card p-6 stagger-2">
          <p className="eyebrow">Total Registered</p>
          <p className="mt-5 text-3xl font-extrabold">{total.toLocaleString()}</p>
          <p className="mt-5 text-stone-600">{selectedType === 'All' ? 'all blood types' : `${selectedType} donors`}</p>
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
          <p className="mt-5 text-white">{selectedType === 'All' ? 'All screenings' : `${selectedType} screenings`}</p>
        </article>
      </section>
      
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="card chart-card stagger-3">
          <h2 className="section-title">Type Distribution</h2>
          <div className="mt-12 grid place-items-center">
            <div 
              className="donut" 
              data-tooltip={tooltipText} 
              style={donutStyle}
              onPointerMove={handleDonutPointerMove}
              onPointerOver={handleDonutPointerMove}
              onPointerLeave={handleDonutPointerLeave}
            ></div>
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

      <section className="mt-6 card table-card stagger-6">
        <div className="flex justify-between items-center p-6 border-b border-stone-100">
          <h2 className="section-title mb-0">Recent Donor Records</h2>
          <Link href="/admin/donor-records" className="text-sm font-semibold text-red-700 hover:underline">View Details</Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Blood Type</th>
                <th>Contact Info</th>
                <th>Last Donation</th>
                <th>Status</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDonors?.map((row: any) => {
                const initials = (row.full_name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                return (
                  <tr key={row.donor_code} className="transition-colors hover:bg-red-50/50">
                    <td className="font-bold text-stone-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        {row.full_name}
                        <div className="text-xs font-normal text-stone-500">ID: {row.donor_code}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge border border-red-200 text-red-700 bg-red-50 rounded-full font-bold px-3 py-1 text-xs">
                        {row.blood_type || 'Unknown'}
                      </span>
                    </td>
                    <td className="text-stone-600 text-sm">
                      {row.email || 'N/A'}<br/>
                      {row.contact || 'N/A'}
                    </td>
                    <td className="text-stone-600 text-sm">
                      {row.last_donation_at ? new Date(row.last_donation_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                    </td>
                    <td>
                      <span className="badge border border-red-200 text-red-700 bg-red-50 rounded-full font-bold px-3 py-1 text-xs">
                        {row.eligibility_status || 'Eligible'}
                      </span>
                    </td>
                    <td className="font-bold text-stone-900 text-center">
                      {row.total_units || 0}
                    </td>
                    <td>
                      <Link href={`/admin/donor-records/${row.donor_code}`} className="text-sm font-semibold text-red-700 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {(!recentDonors || recentDonors.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-stone-500">
                    No recent donor records found.
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
