'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NotificationDrawer from './NotificationDrawer';
type Profile = any;

interface PortalLayoutProps {
  title: string;
  portal: 'donor' | 'admin';
  profile?: Profile | null;
  children: React.ReactNode;
}

export default function PortalLayout({ title, portal, profile, children }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell" data-portal-shell={portal}>
      <Sidebar portal={portal} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="portal-main">
        <Topbar title={title} onOpenNotifications={() => setDrawerOpen(true)} />
        <div className="portal-content motion-fade" data-portal-content>
          {/* @include('partials.flash') placeholder */}
          <div className="portal-panel is-active">
            {children}
          </div>
        </div>
      </main>
      <NotificationDrawer isOpen={drawerOpen} setIsOpen={setDrawerOpen} />
    </div>
  );
}
