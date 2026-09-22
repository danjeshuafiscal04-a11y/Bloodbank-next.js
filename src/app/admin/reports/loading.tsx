export default function AdminReportsLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="h-8 w-48 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-stone-200 rounded-lg"></div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5">
            <div className="h-4 w-24 bg-stone-100 rounded-md mb-3"></div>
            <div className="h-8 w-16 bg-stone-200 rounded-md mb-2"></div>
            <div className="h-3 w-32 bg-stone-100 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6 h-80 flex flex-col justify-between">
          <div className="h-6 w-48 bg-stone-200 rounded-md mb-4"></div>
          <div className="flex-1 bg-stone-50 rounded-lg flex items-end p-4 gap-2">
            {[20, 45, 80, 30, 60, 90, 50].map((h, i) => <div key={i} className="flex-1 bg-stone-200 rounded-t-sm" style={{height: `${h}%`}}></div>)}
          </div>
        </div>
        <div className="card p-6 h-80 flex flex-col justify-between">
          <div className="h-6 w-48 bg-stone-200 rounded-md mb-4"></div>
          <div className="flex-1 flex items-center justify-center">
             <div className="h-40 w-40 rounded-full border-8 border-stone-100"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
