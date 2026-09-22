'use client';

import { Bell, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleMarkAllRead = async () => {
    setLoading(true);
    
    // Optimistic UI update
    const updated = notifications.map(n => ({ ...n, read_at: new Date().toISOString() }));
    setNotifications(updated);

    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .is('read_at', null)
        .eq('target_role', 'admin');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <header className="page-header stagger-1 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="page-title">System Notifications</h2>
          <p className="page-subtitle">Alerts, blood request updates, and system events.</p>
        </div>
        <button 
          className="text-sm font-bold text-red-700 hover:underline transition-transform hover:scale-105 disabled:opacity-50"
          onClick={handleMarkAllRead}
          disabled={loading || !notifications.some(n => !n.read_at)}
        >
          {loading ? 'Marking...' : 'Mark all as read'}
        </button>
      </header>

      <section className="card bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 stagger-2">
        {notifications.length > 0 ? (
          notifications.map((note) => {
            const isUnread = !note.read_at;
            return (
              <div key={note.id} className={`p-4 flex gap-4 transition-colors ${isUnread ? 'bg-red-50/20 hover:bg-red-50/50' : 'opacity-70 hover:bg-stone-50'}`}>
                <div className={`mt-1 flex-shrink-0 grid h-10 w-10 place-items-center rounded-full transition-transform hover:scale-110 ${isUnread ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-500'}`}>
                  {isUnread ? <Bell size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-stone-900">{note.title || 'System Alert'}</h4>
                    {isUnread && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-widest">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mb-2">{note.body}</p>
                  <p className="text-xs font-bold text-stone-400">{note.time_label || 'Recently'}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-stone-500">
            No notifications available.
          </div>
        )}
      </section>
    </div>
  );
}
