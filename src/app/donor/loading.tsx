export default function DonorLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div>
          <div className="h-8 w-48 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-stone-100 rounded-md"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-stone-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-stone-200 rounded-md"></div>
                <div className="h-4 w-full bg-stone-100 rounded-md"></div>
              </div>
            </div>
            <div className="h-8 w-full bg-stone-100 rounded-md mt-4"></div>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-6 space-y-4">
        <div className="h-6 w-40 bg-stone-200 rounded-md mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-stone-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
