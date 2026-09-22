export default function DonorScheduleLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-56 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="card p-6 h-[500px] flex flex-col gap-4">
           <div className="h-6 w-40 bg-stone-200 rounded-md mb-2"></div>
           <div className="flex-1 bg-stone-100 rounded-xl w-full"></div>
        </div>

        <div className="card p-6 h-[500px] flex flex-col gap-6">
           <div>
             <div className="h-6 w-40 bg-stone-200 rounded-md mb-4"></div>
             <div className="grid grid-cols-7 gap-2">
                {Array.from({length: 35}).map((_, i) => (
                  <div key={i} className="aspect-square bg-stone-100 rounded-md"></div>
                ))}
             </div>
           </div>
           
           <div>
             <div className="h-6 w-32 bg-stone-200 rounded-md mb-4"></div>
             <div className="grid grid-cols-3 gap-3">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="h-10 bg-stone-100 rounded-md"></div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
