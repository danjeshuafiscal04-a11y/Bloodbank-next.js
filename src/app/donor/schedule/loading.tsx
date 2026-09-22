export default function DonorScheduleLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header mb-6">
        <div className="h-8 w-64 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-stone-100 rounded-md"></div>
      </header>

      <div className="card mb-6 p-4 hidden md:flex gap-2">
         {[1, 2, 3, 4, 5, 6].map((i) => (
           <div key={i} className="h-10 flex-1 bg-stone-100 rounded-lg"></div>
         ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="card p-6 min-h-[400px] flex flex-col gap-6">
           <div className="h-8 w-64 bg-stone-200 rounded-md"></div>
           
           <div className="space-y-3 flex-1 mt-4">
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 w-full bg-stone-100 rounded-xl"></div>
             ))}
           </div>
           
           <div className="h-10 w-48 bg-stone-200 rounded-lg mt-4"></div>
        </div>

        <aside className="space-y-4">
           <div className="card p-5">
             <div className="h-5 w-24 bg-stone-200 rounded-md mb-3"></div>
             <div className="h-4 w-full bg-stone-100 rounded-md mb-1"></div>
             <div className="h-4 w-4/5 bg-stone-100 rounded-md"></div>
           </div>
           
           <div className="rounded-xl bg-red-100 p-5 h-32 flex flex-col justify-center">
             <div className="h-3 w-32 bg-red-200 rounded-md mb-3"></div>
             <div className="h-8 w-40 bg-red-200 rounded-md"></div>
           </div>
        </aside>
      </div>
    </div>
  )
}
