import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import CampaignCarousel from '@/components/CampaignCarousel'

export default async function LandingPage() {
  const supabase = await createClient()
  
  // Fetch campaigns directly from Supabase
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error("Failed to fetch campaigns", error)
  }

  const campaignList = campaigns || []

  return (
    <div className="overflow-x-hidden">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
            <div className="mx-auto flex min-h-14 sm:min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-2 sm:py-0">
                <div className="text-base sm:text-xl font-extrabold tracking-tight truncate"><span className="text-red-700">bloodtype</span> RedCross Blood Bank</div>
                <div className="flex shrink-0 gap-2 sm:gap-3">
                    <Link className="btn-ghost text-xs sm:text-base px-2.5 py-1.5 sm:px-4 sm:py-2" href="/login?portal=admin">Staff Login</Link>
                    <Link className="btn-primary text-xs sm:text-base px-2.5 py-1.5 sm:px-4 sm:py-2" href="/login">Register Now</Link>
                </div>
            </div>
        </header>

        <section className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 px-4 sm:px-6 py-10 sm:py-16 md:grid-cols-2">
            <div>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-red-700">Blood bank management</p>
                <h1 className="max-w-xl text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
                    Every Drop Counts. <span className="text-red-700">Save a Life Today.</span>
                </h1>
                <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-stone-600">
                    A full donor, inventory, request, and admin command system for regional blood bank operations.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <Link className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-center" href="/login">Access Portal</Link>
                    <Link className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-center" href="/login">Submit Blood Request</Link>
                </div>
            </div>
            <div className="relative hidden sm:block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-100 via-white to-stone-100 shadow-2xl">
                    <div className="grid h-full place-items-center p-6 lg:p-10">
                        <div className="w-full rounded-2xl bg-white/85 p-6 lg:p-8 shadow-xl">
                            <div className="mb-6 lg:mb-8 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Inventory health</p>
                                    <p className="mt-1 text-3xl lg:text-4xl font-extrabold text-red-700">1,842</p>
                                </div>
                                <span className="text-4xl lg:text-5xl text-red-700">♢</span>
                            </div>
                            <div className="mt-4 lg:mt-6 flex h-36 lg:h-44 items-end justify-between gap-1 sm:gap-3 border-t border-red-100 px-0 sm:px-1 pt-4 lg:pt-6">
                                {[70,45,90,38,76,46,86].map((h, i) => (
                                    <div key={i} className="flex flex-1 flex-col items-center gap-1 sm:gap-2">
                                        <div className="flex h-28 lg:h-32 items-end gap-0.5 sm:gap-1">
                                            <span className="bar-hover w-2 sm:w-3 rounded-t bg-red-700" data-tip={`Inflow ${h * 6}`} style={{ height: `${Math.max(18, h)}px` }}></span>
                                            <span className="bar-hover w-2 sm:w-3 rounded-t bg-orange-800/80" data-tip={`Outflow ${h * 4}`} style={{ height: `${Math.max(18, h * 0.65)}px` }}></span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs text-stone-600">{['Mon','Tue','Wed','Thu','Fri','Sat','Today'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-6 -left-4 rounded-xl bg-red-600 p-4 lg:p-5 text-white shadow-xl">
                    <div className="text-xl lg:text-2xl">♡</div>
                    <p className="mt-1 lg:mt-2 text-xs lg:text-sm font-bold">Certified Care</p>
                </div>
            </div>
        </section>

        <section className="bg-stone-50 py-10 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[
                        ['Individual Donors', 'Schedule appointments, track eligibility, and view donation history.'],
                        ['Clinical Requests', 'Hospitals can request blood products with supporting documentation.'],
                        ['Admin Operations', 'Manage inventory, donor records, reports, alerts, maps, and audits.'],
                    ].map(([title, text]) => (
                        <div key={title} className="card p-5 sm:p-7">
                            <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
                            <p className="mt-2 sm:mt-3 text-sm leading-6 text-stone-600">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 sm:mt-12">
                    <CampaignCarousel campaigns={campaignList} />
                </div>
            </div>
        </section>
    </div>
  )
}
