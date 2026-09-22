'use client';

import { Download, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialNotifications[0]?.id || null);
  const [filter, setFilter] = useState('All');
  const supabase = createClient();

  const handleMarkAllRead = async () => {
    setLoading(true);
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
  
  const selectedNote = notifications.find(n => n.id === selectedId) || notifications[0];
  const unreadCount = notifications.filter(n => !n.read_at).length;
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.read_at;
    if (filter === 'Matching Alerts') return n.tag === 'Matching Alert';
    return true;
  });

  return (
    <div className="card overflow-hidden bg-white border border-red-200 rounded-2xl shadow-sm h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row stagger-1">
      {/* LEFT COLUMN: LIST */}
      <div className="w-full md:w-[380px] border-r border-stone-100 flex flex-col h-full bg-white shrink-0">
        <div className="p-6 border-b border-stone-100 flex-shrink-0">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-[22px] font-extrabold text-stone-900 leading-[1.1] tracking-tight">Notification<br/>Center</h2>
            <button 
              onClick={handleMarkAllRead} 
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors mt-1"
              disabled={loading || unreadCount === 0}
            >
              Mark All As Read
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter('All')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${filter === 'All' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>All</button>
            <button onClick={() => setFilter('Unread')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors border border-red-100 ${filter === 'Unread' ? 'bg-red-50 text-red-700' : 'bg-transparent text-red-700 hover:bg-red-50'}`}>Unread ({unreadCount})</button>
            <button onClick={() => setFilter('Matching Alerts')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors border border-red-100 ${filter === 'Matching Alerts' ? 'bg-red-50 text-red-700' : 'bg-transparent text-red-700 hover:bg-red-50'}`}>Matching Alerts</button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => {
              const isSelected = selectedId === note.id;
              const isUnread = !note.read_at;
              
              return (
                <button 
                  key={note.id}
                  onClick={() => setSelectedId(note.id)}
                  className={`w-full text-left p-6 border-b border-stone-50 transition-colors ${isSelected ? 'bg-stone-50/50' : 'bg-white hover:bg-stone-50/50'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${note.tag === 'Matching Alert' || note.tag === 'Registration' ? 'bg-red-50 text-red-700' : 'bg-stone-100 text-stone-700'}`}>
                      {note.tag || 'System Alert'}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap ml-2">
                      {isUnread ? `Unread - ${note.time_label}` : note.time_label}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 mb-2 text-[15px]">{note.title}</h4>
                  <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{note.body}</p>
                </button>
              )
            })
          ) : (
            <div className="p-10 text-center text-stone-400 text-sm">
              No notifications found in this view.
            </div>
          )}
        </div>
      </div>
      
      {/* RIGHT COLUMN: DETAILS */}
      <div className="flex-1 bg-white h-full overflow-y-auto custom-scrollbar">
        {selectedNote ? (
          <div className="p-8 lg:p-12 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedNote.tag === 'Matching Alert' || selectedNote.tag === 'Registration' ? 'bg-red-50 text-red-700' : 'bg-stone-100 text-stone-700'}`}>
                {selectedNote.tag || 'System Alert'}
              </span>
              <div className="flex gap-3">
                <button className="p-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors" title="Download Record">
                  <Download size={18} strokeWidth={2.5} />
                </button>
                <button className="p-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors" title="Report Issue">
                  <AlertTriangle size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight">{selectedNote.title}</h1>
            <p className="text-stone-500 text-sm mb-12">
              Received: {!selectedNote.read_at ? 'Unread - ' : ''}{selectedNote.time_label}
            </p>
            
            <div className="border border-red-100 rounded-2xl p-8 lg:p-10 bg-stone-50/20">
              <h3 className="font-extrabold text-stone-900 mb-5">{selectedNote.tag === 'Matching Alert' ? 'Donor Match Details' : 'Details'}</h3>
              <p className="text-stone-700 text-[15px] mb-10 leading-relaxed max-w-2xl">
                {selectedNote.body}
              </p>
              
              {selectedNote.details && (
                <div className="bg-stone-50 border border-stone-100 rounded-xl p-8 mb-10 flex flex-wrap gap-x-20 gap-y-6">
                  <div>
                    <p className="text-[10px] font-extrabold text-stone-500 tracking-widest mb-2 uppercase">Donor ID</p>
                    <p className="font-extrabold text-stone-900 text-lg">{selectedNote.details.donor_id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-stone-500 tracking-widest mb-2 uppercase">Eligibility Status</p>
                    <p className="font-extrabold text-stone-900 text-lg">{selectedNote.details.eligibility}</p>
                  </div>
                </div>
              )}
              
              {selectedNote.details && (
                <button className="px-6 py-2.5 border-2 border-red-100 text-red-700 font-bold rounded-lg hover:bg-red-50 transition-colors text-sm">
                  View Full Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-stone-400 text-sm">
            Select a notification to view details
          </div>
        )}
      </div>
    </div>
  );
}
