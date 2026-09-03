'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Bookmark,
  User,
  Calendar,
  Users,
  Trophy,
  LayoutDashboard,
  Clock,
  CircleDollarSign,
  Settings,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || 'player';

  // Player Navigation matches the 5 icons in the user's reference mockup
  const playerNavItems = [
    { label: 'Home', href: '/player/discover', icon: Home },
    { label: 'Bookings', href: '/player/bookings', icon: Calendar },
    { label: 'Team', href: '/player/team', icon: LayoutGrid },
    { label: 'Ranks', href: '/player/leaderboard', icon: Bookmark },
    { label: 'Profile', href: '/player/profile', icon: User },
  ];

  const ownerNavItems = [
    { label: 'Overview', href: '/ground-owner/dashboard', icon: LayoutDashboard },
    { label: 'Slots', href: '/ground-owner/slots', icon: Clock },
    { label: 'Revenue', href: '/ground-owner/earnings', icon: CircleDollarSign },
    { label: 'Settings', href: '/ground-owner/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Analytics', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Grounds', href: '/admin/grounds', icon: Building2 },
    { label: 'Users', href: '/admin/users', icon: ShieldCheck },
    { label: 'Disputes', href: '/admin/disputes', icon: AlertCircle },
  ];

  const items =
    role === 'ground_owner'
      ? ownerNavItems
      : role === 'admin'
      ? adminNavItems
      : playerNavItems;

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex justify-center px-4 pointer-events-none">
      {/* Floating Pill Container - Matching the exact reference picture */}
      <nav className="pointer-events-auto bg-[#0A0D12] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] rounded-full px-2 py-1.5 flex items-center justify-between gap-1 max-w-[370px] w-full transition-all duration-300">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          if (isActive) {
            // Active Tab: Pill container with BOTH Icon and Text Label
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-[#242A36] text-white px-4 py-2.5 rounded-full flex items-center gap-2 font-semibold text-xs tracking-tight shadow-md border border-white/10 transition-all duration-300 shrink-0"
              >
                <Icon className="w-4 h-4 text-white fill-white/20 stroke-[2.2]" />
                <span className="font-medium text-white">{item.label}</span>
              </Link>
            );
          }

          // Inactive Tab: Icon ONLY
          return (
            <Link
              key={item.href}
              href={item.href}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/65 hover:text-white hover:bg-white/5 transition-all duration-200"
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 stroke-[1.8]" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
