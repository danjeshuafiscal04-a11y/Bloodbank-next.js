'use client';

import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  title: string;
  onOpenNotifications?: () => void;
}

export default function Topbar({ title, onOpenNotifications }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="topbar-title" data-topbar-title>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="search-pill hidden md:block">
          <Search />
          <input type="text" placeholder="Search records..." aria-label="Search records" />
        </div>
        <button 
          className="top-icon-btn notification-bell" 
          type="button" 
          aria-label="Open notifications"
          onClick={onOpenNotifications}
        >
          <Bell />
          {/* <span className="notification-badge">0</span> */}
        </button>
        <Link href="/settings" className="top-icon-btn" aria-label="Open settings">
          <Settings />
        </Link>
        <Link href="/profile" className="top-icon-btn" aria-label="Open profile">
          <User />
        </Link>
      </div>
    </header>
  );
}
