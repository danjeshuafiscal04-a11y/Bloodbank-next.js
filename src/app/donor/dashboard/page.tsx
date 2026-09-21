import { createClient } from '@/lib/supabase/server'
import { HeartHandshake, Calendar as CalendarIcon, CheckCircle2, Droplet, Activity, CalendarPlus } from 'lucide-react'
import Link from 'next/link'

export default async function DonorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('donors')
    .select('*')
    .eq('profile_id', user?.id)
    .single()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('profile_id', user?.id)
    .order('scheduled_at', { ascending: false })

  const appointmentRows = appointments || []
  
  const approvedStatuses = ['approved', 'completed']
  const pendingStatuses = ['confirmed', 'pending', 'booked', 'submitted']
  
  const approvedAppointments = appointmentRows.filter(a => 
    approvedStatuses.includes(a.status?.toLowerCase() || '') && 
    !(a.service_type || '').toLowerCase().includes('request')
  )
  
  const nextAppointment = appointmentRows.find(a => 
    pendingStatuses.includes(a.status?.toLowerCase() || '')
  )

  const profileEmail = user?.email?.toLowerCase() || ''
  const profileName = profile?.full_name?.trim() || ''
  const demoNames = ['juan', 'juan dela cruz', 'donor']
  const firstName = profileName !== '' && !demoNames.includes(profileName.toLowerCase())
    ? profileName.split(' ')[0]
    : (profileEmail !== '' ? profileEmail.split('@')[0] : 'Donor')

  const ownDonorUnits = profile?.eligibility_status?.toLowerCase() === 'eligible' 
    ? (profile?.total_units || 0) 
    : 0

  const approvedCount = Math.max(approvedAppointments.length, ownDonorUnits)
  const livesSaved = approvedCount * 3
  
  const latestApproved = approvedAppointments[0]
  const latestAnswers = latestApproved?.eligibility_answers as Record<string, any> || {}

  let nextEligibleAt: Date | null = null
  if (latestApproved) {
    const dateSource = latestApproved.scheduled_at || latestApproved.scheduled_date
    if (dateSource) {
      const date = new Date(dateSource)
      date.setDate(date.getDate() + 90)
      nextEligibleAt = date
    }
  }

  let daysRemaining: number | null = null
  if (nextEligibleAt) {
    const today = new Date()
    today.setHours(0,0,0,0)
    const eligibleDate = new Date(nextEligibleAt)
    eligibleDate.setHours(0,0,0,0)
    const diffTime = eligibleDate.getTime() - today.getTime()
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div>
      <header className="page-header stagger-1">
        <h2 className="page-title">Welcome back, {firstName}</h2>
        <p className="page-subtitle">Here is your donation overview and health metrics.</p>
      </header>

      <section className="metric-grid">
        <article className="card metric-card is-red stagger-2">
          <div className="metric-top">
            <p className="metric-label">Total Lives Saved</p>
            <HeartHandshake />
          </div>
          <p className="metric-value">{livesSaved}</p>
        </article>
        
        <article className="card metric-card stagger-3">
          <div className="metric-top">
            <p className="metric-label">Next Eligibility</p>
            <CalendarIcon className="red" />
          </div>
          <p className="metric-value">{nextEligibleAt ? formatShortDate(nextEligibleAt) : 'Not set'}</p>
          <p className="metric-subtext">{daysRemaining === null ? 'After an approved donation' : `${daysRemaining} days remaining`}</p>
        </article>
        
        <article className="card metric-card stagger-4">
          <div className="metric-top">
            <p className="metric-label">Total Donations</p>
            <CheckCircle2 className="red" />
          </div>
          <p className="metric-value">{approvedCount} Units</p>
          <p className="metric-subtext">{approvedCount > 0 ? 'Status: Eligible' : 'No approved donations yet'}</p>
        </article>
      </section>

      <div className="mt-6 split-grid">
        <div className="space-y-6">
          <section className="card p-6 stagger-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Upcoming Appointment</h2>
              <Link href="/donor/schedule" className="text-sm font-bold text-red-700 hover:text-red-800 transition-colors">Book New</Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-50 p-4 transition-transform hover:scale-[1.01]">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-lg bg-red-700 text-white shadow-sm">
                  <Droplet className="animate-pulse" />
                </span>
                <div>
                  <p className="font-bold">{nextAppointment?.service_type || 'No appointment booked'}</p>
                  <p className="text-sm text-stone-600">
                    {nextAppointment ? `${nextAppointment.scheduled_date || ''} - ${nextAppointment.scheduled_time || ''}` : 'Choose a donation slot when ready.'}
                  </p>
                </div>
              </div>
              {nextAppointment && (
                <span className="badge">{nextAppointment.status}</span>
              )}
            </div>
          </section>

          <section className="card p-6 stagger-5">
            <h2 className="section-title mb-4">Health Overview</h2>
            {latestApproved ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-stone-50 p-4 text-center text-sm font-bold shadow-sm transition-shadow hover:shadow-md">Hemoglobin {latestAnswers.hemoglobin || 'Not recorded'}{latestAnswers.hemoglobin ? ' g/dL' : ''}</div>
                <div className="rounded-lg bg-stone-50 p-4 text-center text-sm font-bold shadow-sm transition-shadow hover:shadow-md">Blood Pressure {latestAnswers.blood_pressure || 'Not recorded'}</div>
              </div>
            ) : (
              <div className="rounded-lg bg-stone-50 p-4 text-sm font-semibold text-stone-600 shadow-sm">
                Health metrics will appear after staff approve your donation screening.
              </div>
            )}
          </section>
        </div>

        <section className="card p-6 stagger-5">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-red-700">
            <Activity className="animate-pulse" />
            Recent Activity
          </h3>
          <div className="space-y-4 text-sm">
            {latestApproved && (
              <div className="flex gap-3 group">
                <CheckCircle2 className="mt-0.5 shrink-0 text-red-700 transition-transform group-hover:scale-110" />
                <div>
                  <p className="font-bold group-hover:text-red-700 transition-colors">Eligibility Approved</p>
                  <p className="text-stone-600">Your reviewed donation has been approved.</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 group">
              {nextAppointment ? <CheckCircle2 className="mt-0.5 shrink-0 text-red-700 transition-transform group-hover:scale-110" /> : <CalendarPlus className="mt-0.5 shrink-0 text-red-700 transition-transform group-hover:scale-110" />}
              <div>
                <p className="font-bold group-hover:text-red-700 transition-colors">{nextAppointment ? 'Appointment Booked' : 'Ready to Schedule'}</p>
                <p className="text-stone-600">{nextAppointment ? 'Your appointment is waiting for staff review.' : 'No upcoming appointment yet.'}</p>
              </div>
            </div>
          </div>
          <Link href="/donor/history" className="btn-secondary mt-10 w-full text-center block transition-all hover:-translate-y-1 hover:shadow-md">View Full History</Link>
        </section>
      </div>
    </div>
  )
}
