export default function DonorBloodRequestLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-64 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-96 bg-stone-100 rounded-md"></div>
      </header>

      <section className="card max-w-2xl mt-6 p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-stone-200 rounded-md"></div>
          <div className="h-10 w-full bg-stone-100 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-48 bg-stone-200 rounded-md"></div>
          <div className="h-10 w-full bg-stone-100 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 w-24 bg-stone-200 rounded-md"></div>
          <div className="h-24 w-full bg-stone-100 rounded-lg"></div>
        </div>
        <div className="h-12 w-32 bg-stone-200 rounded-lg mt-4"></div>
      </section>
    </div>
  )
}
