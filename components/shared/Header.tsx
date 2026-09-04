'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Bell, Shield, User, Building2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { ROLE_HOME_ROUTES } from '@/lib/constants';

export function Header() {
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    router.push(ROLE_HOME_ROUTES[role]);
  };

  return (
    <header className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-40 bg-surface/90 backdrop-blur-md border border-card-border rounded-2xl shadow-xl shadow-black/15 px-3 py-3 sm:px-6">
      <div className="w-full flex items-center justify-between gap-3">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center text-white shadow-md shadow-primary/20 text-lg font-black group-hover:scale-105 transition-transform">
            🏏
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-text-primary flex items-center gap-1.5">
              CricketHub
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/20">
                {user?.role === 'ground_owner' ? 'Owner' : user?.role === 'admin' ? 'Admin' : 'Player'}
              </span>
            </span>
            <p className="text-[11px] text-text-muted hidden sm:block">Islamabad & Rawalpindi Arenas</p>
          </div>
          </Link>
        </div>

        {/* Center: Role Switcher Shortcut Bar */}
        <div className="hidden lg:flex items-center bg-card border border-card-border p-1 rounded-xl gap-1 text-xs">
          <button
            onClick={() => handleRoleChange('player')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              user?.role === 'player'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Player App
          </button>
          <button
            onClick={() => handleRoleChange('ground_owner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              user?.role === 'ground_owner'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Owner Portal
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              user?.role === 'admin'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </div>

        {/* Right: Actions (Theme toggle, Notifications, Profile) */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-card-border bg-card text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          <div className="relative">
            <button
              className="p-2.5 rounded-xl border border-card-border bg-card text-text-secondary hover:text-text-primary transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange" />
            </button>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-card-border">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user?.name?.slice(0, 2).toUpperCase() || 'ZS'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-text-primary leading-tight">{user?.name || 'Zain Sial'}</p>
              <p className="text-text-muted text-[10px] capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              title="Log out"
              className="p-1.5 text-text-muted hover:text-red-400 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
