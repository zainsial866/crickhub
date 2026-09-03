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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || 'player';

  const playerNav: NavItem[] = [
    { label: 'Discover Grounds', href: '/player/discover', icon: Compass, badge: 'Live' },
    { label: 'My Bookings', href: '/player/bookings', icon: CalendarCheck2 },
    { label: 'Team Hub', href: '/player/team', icon: Users },
    { label: 'Leaderboard', href: '/player/leaderboard', icon: Trophy },
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
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-surface border-r border-card-border shrink-0 min-h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="px-3 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {role === 'ground_owner'
                ? 'Facility Management'
                : role === 'admin'
                ? 'Platform Governance'
                : 'Player Arena'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group',
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
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
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
        <div className="p-3.5 bg-card border border-card-border rounded-2xl space-y-2 mt-6">
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
      </div>
    </aside>
  );
}
