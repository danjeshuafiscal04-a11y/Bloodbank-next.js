export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div>
          <div className="h-8 w-48 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
        </div>
      </header>

      <section className="card table-card mt-6">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50">
          <div className="h-10 w-full sm:w-64 bg-stone-200 rounded-full"></div>
          <div className="h-10 w-24 bg-stone-200 rounded-lg"></div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-stone-200 rounded-md"></div>
                <div className="h-3 w-48 bg-stone-100 rounded-md"></div>
              </div>
              <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
              <div className="h-5 w-24 bg-stone-200 rounded-md hidden sm:block"></div>
              <div className="h-6 w-20 bg-stone-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
