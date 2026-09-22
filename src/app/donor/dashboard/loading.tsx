export default function DonorDashboardLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header mb-6">
        <div className="h-8 w-64 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-stone-100 rounded-md"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2 bg-gradient-to-br from-red-50 to-white flex flex-col justify-between h-48 border-red-100">
          <div>
            <div className="h-6 w-48 bg-red-200 rounded-md mb-2"></div>
            <div className="h-4 w-72 bg-red-100 rounded-md"></div>
          </div>
          <div className="h-10 w-40 bg-red-200 rounded-lg"></div>
        </div>
        
        <div className="card p-6 flex items-center gap-4">
          <div className="h-16 w-16 bg-red-100 rounded-full shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-5 w-24 bg-stone-200 rounded-md"></div>
            <div className="h-8 w-16 bg-stone-200 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-40 bg-stone-200 rounded-md mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-stone-100 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 w-40 bg-stone-200 rounded-md"></div>
                <div className="h-4 w-24 bg-stone-100 rounded-md"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-stone-100 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
