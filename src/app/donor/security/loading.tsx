export default function DonorSecurityLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-56 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
      </header>

      <div className="card max-w-4xl p-6 mt-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-stone-200 rounded-md shrink-0"></div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-stone-200 rounded-md"></div>
                <div className="h-4 w-64 bg-stone-100 rounded-md hidden sm:block"></div>
              </div>
            </div>
            <div className="h-10 w-32 bg-stone-200 rounded-lg shrink-0"></div>
          </div>
        ))}

        <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 mt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-6 bg-stone-200 rounded-md"></div>
            <div className="h-6 w-48 bg-stone-200 rounded-md"></div>
          </div>
          <div className="h-4 w-full max-w-md bg-stone-100 rounded-md mb-6"></div>
          
          <div className="bg-white rounded-lg p-4 border border-stone-200 mb-4 h-20"></div>
          <div className="bg-white rounded-lg p-5 border border-stone-200 h-32"></div>
        </div>
      </div>
    </div>
  )
}
