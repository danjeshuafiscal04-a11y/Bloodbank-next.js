'use client';

import React, { useState } from 'react';
import { X, BellOff } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  notifications?: any[];
}

export default function NotificationDrawer({ isOpen, setIsOpen, notifications = [] }: NotificationDrawerProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'matching'>('all');
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifications = notifications.filter(note => {
    if (filter === 'unread') return !note.is_read;
    if (filter === 'matching') return note.filter_type === 'matching' || (note.tag || '').toLowerCase().includes('matching');
    return true;
  });

  return (
    <aside
      id="notification-drawer"
      className="notification-drawer"
      hidden={!isOpen}
      aria-hidden={!isOpen}
    >
      <button 
        className="notification-drawer-backdrop" 
        type="button" 
        onClick={() => setIsOpen(false)}
        aria-label="Close notifications"
      ></button>
      <section
        className="notification-drawer-panel"
        aria-label="Notifications"
      >
        <header className="notification-drawer-header">
          <div>
            <p className="eyebrow">Notification Center</p>
            <h2>Notifications</h2>
          </div>
          <button className="top-icon-btn" type="button" onClick={() => setIsOpen(false)} aria-label="Close notifications">
            <X />
          </button>
        </header>

        <div className="notification-tabs">
          <button 
            className={`badge ${filter === 'all' ? 'is-active' : ''}`} 
            type="button" 
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={`badge ${filter === 'unread' ? 'is-active' : ''}`} 
            type="button" 
            onClick={() => setFilter('unread')}
          >Unread (<span>{unreadCount}</span>)</button>
          <button 
            className={`badge ${filter === 'matching' ? 'is-active' : ''}`} 
            type="button" 
            onClick={() => setFilter('matching')}
          >Matching Alerts</button>
        </div>

        <div className="notification-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note, index) => {
              const noteTag = note.tag || note.type || 'Alert';
              const isRead = note.is_read || false;

              return (
                <article
                  key={note.id || index}
                  className="notification-item"
                  data-note-read={isRead ? 'true' : 'false'}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="badge">{noteTag}</span>
                    <span className="text-xs text-stone-500">{note.display_time || note.time_label || 'Unread'}</span>
                  </div>
                  <h3 className="font-bold">{note.title || 'Notification'}</h3>
                  <p className="mt-2 text-sm text-stone-600">{note.body || note.text}</p>
                </article>
              );
            })
          ) : (
            <div className="notification-empty">
              <BellOff className="mx-auto mb-4 h-8 w-8 text-stone-300" />
              <h3>{filter === 'all' ? 'No notifications yet' : 'No notifications found'}</h3>
              <p>{filter === 'all' ? 'New donor updates and matching alerts will appear here.' : 'This filter does not have any visible notifications.'}</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <button className="btn-outline mt-4 w-full" type="button">Mark All As Read</button>
        )}
      </section>
    </aside>
  );
}
