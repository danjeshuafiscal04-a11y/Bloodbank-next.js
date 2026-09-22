export default function AdminNotificationsLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="h-8 w-48 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-stone-100 rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-stone-200 rounded-lg"></div>
      </header>

      <section className="card p-0 mt-6 divide-y divide-stone-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-stone-200 rounded-full shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-stone-200 rounded-md"></div>
                <div className="h-4 w-64 bg-stone-100 rounded-md"></div>
                <div className="h-3 w-24 bg-stone-100 rounded-md mt-2"></div>
              </div>
            </div>
            <div className="h-8 w-24 bg-stone-200 rounded-md sm:shrink-0"></div>
          </div>
        ))}
      </section>
    </div>
  )
}
