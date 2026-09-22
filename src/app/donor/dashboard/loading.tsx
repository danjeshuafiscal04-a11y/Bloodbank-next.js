export default function DonorDashboardLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header mb-6">
        <div className="h-8 w-56 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
      </header>

      <section className="metric-grid mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric Card 1 (Red) */}
        <article className="card metric-card p-5 border-red-200 bg-red-50">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-28 bg-red-200 rounded-md"></div>
            <div className="h-6 w-6 bg-red-200 rounded-md"></div>
          </div>
          <div className="h-8 w-16 bg-red-200 rounded-md"></div>
        </article>
        
        {/* Metric Card 2 */}
        <article className="card metric-card p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-28 bg-stone-100 rounded-md"></div>
            <div className="h-6 w-6 bg-stone-100 rounded-md"></div>
          </div>
          <div className="h-8 w-24 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-3 w-32 bg-stone-100 rounded-md"></div>
        </article>
        
        {/* Metric Card 3 */}
        <article className="card metric-card p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-28 bg-stone-100 rounded-md"></div>
            <div className="h-6 w-6 bg-stone-100 rounded-md"></div>
          </div>
          <div className="h-8 w-24 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-3 w-32 bg-stone-100 rounded-md"></div>
        </article>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Appointment */}
          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-48 bg-stone-200 rounded-md"></div>
              <div className="h-4 w-16 bg-stone-100 rounded-md"></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-50 p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-stone-200 rounded-lg shrink-0"></div>
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-stone-200 rounded-md"></div>
                  <div className="h-4 w-48 bg-stone-100 rounded-md"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-stone-200 rounded-full"></div>
            </div>
          </section>

          {/* Health Overview */}
          <section className="card p-6">
            <div className="h-6 w-40 bg-stone-200 rounded-md mb-4"></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-16 rounded-lg bg-stone-50 border border-stone-100"></div>
              <div className="h-16 rounded-lg bg-stone-50 border border-stone-100"></div>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section className="card p-6 lg:col-span-1">
          <div className="h-6 w-32 bg-stone-200 rounded-md mb-5"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-5 w-5 bg-stone-200 rounded-full shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-stone-200 rounded-md"></div>
                  <div className="h-3 w-48 bg-stone-100 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
