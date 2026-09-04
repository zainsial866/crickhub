'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  CalendarCheck2,
  Users,
  Trophy,
  UserCheck,
  LayoutDashboard,
  Clock,
  CircleDollarSign,
  Settings,
  ShieldCheck,
  Building2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  width?: number;
  onToggle?: () => void;
  onResizeStart?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar({ isOpen = true, width = 288, onToggle, onResizeStart }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || 'player';

  const playerNav: NavItem[] = [
    { label: 'Discover Grounds', href: '/player/discover', icon: Compass, badge: 'Live' },
    { label: 'My Bookings', href: '/player/bookings', icon: CalendarCheck2 },
    { label: 'Team Hub', href: '/player/team', icon: Users },
    { label: 'CricketHub', href: '/player/crickethub', icon: Trophy },
    { label: 'My Profile', href: '/player/profile', icon: UserCheck },
  ];

  const ownerNav: NavItem[] = [
    { label: 'Overview', href: '/ground-owner/dashboard', icon: LayoutDashboard },
    { label: 'Slot Schedule', href: '/ground-owner/slots', icon: Clock },
    { label: 'Revenue & Earnings', href: '/ground-owner/earnings', icon: CircleDollarSign },
    { label: 'Ground Settings', href: '/ground-owner/settings', icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { label: 'Analytics Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Ground Approvals', href: '/admin/grounds', icon: Building2, badge: '3' },
    { label: 'User Directory', href: '/admin/users', icon: ShieldCheck },
    { label: 'Dispute Resolution', href: '/admin/disputes', icon: AlertCircle, badge: '2' },
  ];

  const items = role === 'ground_owner' ? ownerNav : role === 'admin' ? adminNav : playerNav;

  return (
    <aside
      className={cn(
        'hidden md:flex fixed left-4 top-[104px] bottom-4 z-30 flex-col bg-surface border border-card-border rounded-2xl overflow-hidden transition-[width] duration-200 shadow-2xl shadow-black/20',
        isOpen ? '' : 'w-16'
      )}
      style={isOpen ? { width } : undefined}
    >
      <div className={cn('p-3 flex-1 flex flex-col', isOpen ? 'justify-between' : 'items-center')}>
        <div className={cn('space-y-6 w-full', !isOpen && 'flex flex-col items-center')}>
          <div className={cn('flex items-center gap-3 h-8', !isOpen && 'justify-center')}>
            <button
              type="button"
              onClick={onToggle}
              className="w-8 h-8 shrink-0 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary-dark transition-colors"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
            {isOpen && <span className="text-xs font-bold text-text-primary">CricketHub</span>}
          </div>

          {/* Section Header */}
          <div className={cn('px-3 pt-2', !isOpen && 'hidden')}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {role === 'ground_owner'
                ? 'Facility Management'
                : role === 'admin'
                ? 'Platform Governance'
                : 'Player Arena'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 w-full">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group',
                    !isOpen && 'justify-center px-0',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform group-hover:scale-110',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-primary-light'
                      )}
                    />
                    <span className={cn(!isOpen && 'hidden')}>{item.label}</span>
                  </div>
                  {item.badge && isOpen && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-primary/10 text-primary-light border border-primary/20'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Box in Sidebar: Promo / Quick Help */}
        <div className={cn('p-3.5 bg-card border border-card-border rounded-xl space-y-2 mt-6', !isOpen && 'hidden')}>
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
            <Sparkles className="w-4 h-4 text-orange" />
            <span>Islamabad / Rawalpindi</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Indoor cricket booking with verified turf specs, zero weather cancellations, and instant slot locks.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-primary-light font-medium">
            <span>Twin Cities Network</span>
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          </div>
        </div>
        <div className={cn('mt-auto space-y-2 pt-6', isOpen ? 'w-full' : 'flex flex-col items-center')}>
          <Link href={role === 'ground_owner' ? '/ground-owner/settings' : role === 'admin' ? '/admin/dashboard' : '/player/profile'} className={cn('rounded-lg text-text-secondary hover:bg-card hover:text-text-primary flex items-center justify-center', isOpen ? 'gap-3 px-3 py-2.5 justify-start text-sm' : 'w-9 h-9')} aria-label="Sidebar settings" title="Settings">
            <Settings className="w-4 h-4" />
            {isOpen && <span>Settings</span>}
          </Link>
          <Link href={role === 'admin' ? '/admin/users' : role === 'ground_owner' ? '/ground-owner/settings' : '/player/profile'} className={cn('rounded-lg text-text-secondary hover:bg-card hover:text-text-primary flex items-center justify-center', isOpen ? 'gap-3 px-3 py-2.5 justify-start text-sm' : 'w-9 h-9')} aria-label="Account profile" title="Profile">
            <UserCheck className="w-4 h-4" />
            {isOpen && <span>Profile</span>}
          </Link>
          <Link href={role === 'admin' ? '/admin/users' : role === 'ground_owner' ? '/ground-owner/settings' : '/player/profile'} className={cn('rounded-lg bg-primary text-white flex items-center', isOpen ? 'gap-3 px-2 py-2 justify-start text-xs font-semibold' : 'w-9 h-9 justify-center text-[10px] font-black')} aria-label="Open profile" title="Profile">
            <span className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-[10px] font-black">
            {user?.name?.slice(0, 2).toUpperCase() || 'ZS'}
            </span>
            {isOpen && <span className="truncate">{user?.name || 'Profile'}</span>}
          </Link>
        </div>
      </div>
      {onResizeStart && isOpen && (
        <button
          type="button"
          onMouseDown={onResizeStart}
          onTouchStart={onResizeStart}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/60 transition-colors"
          aria-label="Resize sidebar"
          title="Drag to resize sidebar"
        />
      )}
    </aside>
  );
}
