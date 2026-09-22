export default function DonorProfileLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-40 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-64 bg-stone-100 rounded-md"></div>
      </header>

      <div className="card max-w-4xl p-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="h-24 w-24 bg-stone-200 rounded-full shrink-0"></div>
          <div className="space-y-4 flex-1">
            <div>
              <div className="h-6 w-48 bg-stone-200 rounded-md mb-2"></div>
              <div className="h-4 w-32 bg-stone-100 rounded-md"></div>
            </div>
            <div className="h-8 w-24 bg-stone-100 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-stone-200 rounded-md"></div>
              <div className="h-10 w-full bg-stone-100 rounded-lg"></div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <div className="h-10 w-32 bg-stone-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
