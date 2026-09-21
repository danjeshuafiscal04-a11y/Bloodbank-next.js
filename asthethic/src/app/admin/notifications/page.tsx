import { Bell } from 'lucide-react'

export default function AdminNotificationsPage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">System Notifications</h2>
          <p className="text-stone-600">Alerts, blood request updates, and system events.</p>
        </div>
        <button className="text-sm font-bold text-red-700 hover:underline">Mark all as read</button>
      </header>

      <section className="card bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm divide-y divide-stone-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 flex gap-4 hover:bg-stone-50 transition-colors">
            <div className="mt-1 flex-shrink-0 grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700">
              <Bell size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-stone-900">Urgent Request Match</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-widest">
                  New
                </span>
              </div>
              <p className="text-sm text-stone-600 mb-2">Hospital A is urgently requesting 5 units of O- blood. Please review the request queue.</p>
              <p className="text-xs font-bold text-stone-400">Just now</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
