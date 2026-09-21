import { Bell } from 'lucide-react'

export default function AdminNotificationsPage() {
  return (
    <div className="max-w-3xl">
      <header className="page-header stagger-1 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="page-title">System Notifications</h2>
          <p className="page-subtitle">Alerts, blood request updates, and system events.</p>
        </div>
        <button className="text-sm font-bold text-red-700 hover:underline transition-transform hover:scale-105">Mark all as read</button>
      </header>

      <section className="card bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm divide-y divide-stone-100 stagger-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`p-4 flex gap-4 transition-colors hover:bg-red-50/50`}>
            <div className="mt-1 flex-shrink-0 grid h-10 w-10 place-items-center rounded-full bg-red-100 text-red-700 transition-transform hover:scale-110">
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
