'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Home,
  Calendar,
  History,
  User,
  Shield,
  FileText,
  Bell,
  Map,
  Users,
  Droplet,
  Megaphone,
  LogOut,
  Plus,
  ShieldPlus,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  portal: 'donor' | 'admin';
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ portal, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isDonor = portal === 'donor';

  const donorLinks = [
    { href: '/donor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/donor/schedule', label: 'Schedule', icon: Calendar },
    { href: '/donor/history', label: 'History', icon: History },
    { href: '/donor/profile', label: 'Personal Info', icon: User },
    { href: '/donor/security', label: 'Account Security', icon: Shield },
  ];

  const adminLinks = [
    { href: '/admin/reports', label: 'Reports', icon: FileText },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/map', label: 'Donation Map', icon: Map },
    { href: '/admin/donor-records', label: 'Donor Records', icon: Users },
    { href: '/admin/inventory', label: 'Blood Inventory', icon: Droplet },
    { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  ];

  const links = isDonor ? donorLinks : adminLinks;
  const actionHref = isDonor ? '/donor/schedule' : '/admin/inventory';
  const actionText = isDonor ? 'New Donation' : 'New Donation';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex">
        <div className="sidebar-brand">
          <div className="sidebar-title">{isDonor ? 'RedCross Blood Bank' : 'RedCross Admin'}</div>
          <div className="sidebar-subtitle">{isDonor ? 'Type O Negative Donor' : 'Blood Bank Management'}</div>
        </div>

        <Link className="btn-primary mb-4 w-full" href={actionHref}>
          <Plus className="icon" />
          <span>{actionText}</span>
        </Link>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
              >
                <Icon className="sidebar-icon" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <form className="mt-auto" onSubmit={handleLogout}>
          <button className="sidebar-logout w-full" type="submit">
            <LogOut className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </form>
      </aside>

      {/* Mobile Rail */}
      <div className="mobile-rail md:hidden" aria-label="Portal shortcuts">
        <button className="mobile-rail-brand" type="button" onClick={() => setIsOpen(true)}>
          {isDonor ? <Droplet className="sidebar-icon" /> : <ShieldPlus className="sidebar-icon" />}
        </button>

        <Link className="mobile-rail-action" href={actionHref} aria-label={actionText}>
          <Plus className="sidebar-icon" />
        </Link>

        <nav className="mobile-rail-nav" aria-label="Primary">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-rail-link ${isActive ? 'is-active' : ''}`}
                aria-label={link.label}
              >
                <Icon className="sidebar-icon" />
              </Link>
            );
          })}
        </nav>

        <button className="mobile-rail-menu" type="button" onClick={() => setIsOpen(true)}>
          <Menu className="sidebar-icon" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div 
        className="mobile-drawer-backdrop md:hidden" 
        hidden={!isOpen}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <aside className="mobile-drawer md:hidden" aria-hidden={!isOpen} hidden={!isOpen}>
        <div className="mobile-drawer-header">
          <div>
            <div className="mobile-drawer-title">{isDonor ? 'RedCross Blood Bank' : 'RedCross Admin'}</div>
            <div className="sidebar-subtitle p-0">{isDonor ? 'Type O Negative Donor' : 'Blood Bank Management'}</div>
          </div>
          <button className="top-icon-btn" type="button" onClick={() => setIsOpen(false)}>
            <X className="sidebar-icon" />
          </button>
        </div>

        <Link className="btn-primary mobile-drawer-action" href={actionHref}>
          <Plus className="icon" />
          <span>{actionText}</span>
        </Link>

        <nav className="mobile-drawer-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? 'is-active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="sidebar-icon" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <form className="mobile-drawer-logout" onSubmit={handleLogout}>
          <button className="sidebar-logout w-full" type="submit">
            <LogOut className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </form>
      </aside>
    </>
  );
}
