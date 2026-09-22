export default function AdminCampaignsLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="h-8 w-40 bg-stone-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-stone-100 rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-red-100 rounded-lg"></div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card h-48 p-5 flex flex-col justify-between border-stone-200">
            <div>
              <div className="h-6 w-3/4 bg-stone-200 rounded-md mb-3"></div>
              <div className="h-4 w-full bg-stone-100 rounded-md mb-2"></div>
              <div className="h-4 w-5/6 bg-stone-100 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
              <div className="h-4 w-24 bg-stone-100 rounded-md"></div>
              <div className="h-6 w-20 bg-stone-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
