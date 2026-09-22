export default function AdminDonorRecordsLoading() {
  return (
    <div className="animate-pulse">
      <header className="page-header">
        <div className="h-8 w-48 bg-stone-200 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-stone-100 rounded-md"></div>
      </header>

      <section className="card table-card mt-6">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50">
          <div className="h-10 w-full sm:w-64 bg-stone-200 rounded-full"></div>
          <div className="h-10 w-24 bg-stone-200 rounded-lg"></div>
        </div>
        <div className="table-wrap">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="py-3 px-4"><div className="h-4 w-24 bg-stone-200 rounded"></div></th>
                <th className="py-3 px-4"><div className="h-4 w-20 bg-stone-200 rounded"></div></th>
                <th className="py-3 px-4"><div className="h-4 w-24 bg-stone-200 rounded"></div></th>
                <th className="py-3 px-4"><div className="h-4 w-16 bg-stone-200 rounded"></div></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-4 px-4">
                    <div className="h-5 w-32 bg-stone-200 rounded-md mb-2"></div>
                    <div className="h-3 w-48 bg-stone-100 rounded-md"></div>
                  </td>
                  <td className="py-4 px-4"><div className="h-6 w-12 bg-red-100 rounded-full"></div></td>
                  <td className="py-4 px-4"><div className="h-4 w-28 bg-stone-100 rounded-md"></div></td>
                  <td className="py-4 px-4"><div className="h-6 w-20 bg-green-100 rounded-full"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
