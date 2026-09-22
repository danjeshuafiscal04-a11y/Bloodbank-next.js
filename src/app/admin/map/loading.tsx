export default function AdminMapLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-40 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-stone-100 rounded-md"></div>
      </header>

      <div className="card h-[600px] w-full mt-6 rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center flex-col gap-4">
        <div className="h-16 w-16 bg-stone-200 rounded-full mb-2"></div>
        <div className="h-6 w-64 bg-stone-200 rounded-md"></div>
        <div className="h-4 w-96 bg-stone-200 rounded-md"></div>
      </div>
    </div>
  )
}
