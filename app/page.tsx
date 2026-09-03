'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import {
  Compass,
  Building2,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  CalendarCheck2,
  Users,
  Trophy,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { UserRole } from '@/types';
import { ROLE_HOME_ROUTES } from '@/lib/constants';

export default function HomePage() {
  const { switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLaunchFace = (role: UserRole) => {
    switchRole(role);
    router.push(ROLE_HOME_ROUTES[role]);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-card-border flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/25">
            🏏
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-text-primary">CricketHub</h1>
            <p className="text-[11px] text-text-muted">Twin Cities Indoor Cricket Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-card-border bg-card text-text-secondary hover:text-text-primary transition-all"
            title={`Toggle Theme`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Create Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary-light">
            <Sparkles className="w-3.5 h-3.5 text-orange" />
            <span>Islamabad & Rawalpindi Indoor Booking System</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Book Indoor Cricket Grounds.{' '}
            <span className="bg-gradient-to-r from-primary-light via-teal to-orange bg-clip-text text-transparent">
              Zero Rainouts.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Discover verified indoor box arenas and turf nets, book real-time hourly slots with conflict locking, manage team rosters, and compete on the twin-city leaderboard.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => handleLaunchFace('player')}
              leftIcon={<Zap className="w-4 h-4 fill-current" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Player App
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleLaunchFace('ground_owner')}
              leftIcon={<Building2 className="w-4 h-4 text-teal" />}
            >
              Ground Owner Portal
            </Button>
          </div>
        </div>

        {/* 3 User Experience Faces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* 1. Player App Card */}
          <Card
            variant="interactive"
            className="p-6 space-y-4 relative group border-card-border hover:border-primary/60 flex flex-col justify-between"
            onClick={() => handleLaunchFace('player')}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center text-xl font-bold border border-primary/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="primary" size="sm">Customer Surface</Badge>
                <h3 className="text-lg font-bold text-text-primary mt-1 group-hover:text-primary transition-colors">
                  Player & Team App
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Search nearby indoor grounds in F-6, Chandni Chowk & Saddar. Lock slots with instant confirmation and track team standings.
              </p>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Discover Grounds & Live Slots
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Instant Ticket & Cash on Ground
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Team Roster & Leaderboard
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs font-bold text-primary-light">
              <span>Open Player App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* 2. Ground Owner Dashboard Card */}
          <Card
            variant="interactive"
            className="p-6 space-y-4 relative group border-card-border hover:border-teal/60 flex flex-col justify-between"
            onClick={() => handleLaunchFace('ground_owner')}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal/15 text-teal-light flex items-center justify-center text-xl font-bold border border-teal/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="teal" size="sm">Partner Portal</Badge>
                <h3 className="text-lg font-bold text-text-primary mt-1 group-hover:text-teal transition-colors">
                  Ground Owner Portal
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Dedicated interface for facility owners to manage hourly slots, toggle blackout hours, inspect incoming bookings, and track daily revenue.
              </p>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Interactive Weekly Slot Grid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Revenue & Booking History
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Facility Specs & Photos
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs font-bold text-teal-light">
              <span>Open Owner Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* 3. Admin Governance Card */}
          <Card
            variant="interactive"
            className="p-6 space-y-4 relative group border-card-border hover:border-orange/60 flex flex-col justify-between"
            onClick={() => handleLaunchFace('admin')}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange/15 text-orange-light flex items-center justify-center text-xl font-bold border border-orange/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="orange" size="sm">Internal Governance</Badge>
                <h3 className="text-lg font-bold text-text-primary mt-1 group-hover:text-orange transition-colors">
                  Admin Control Panel
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Desktop-first control console for platform founders to review new ground listings, moderate user accounts, and resolve dispute tickets.
              </p>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Ground Verification Queue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> User & Booking Oversight
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Twin-City Analytics & KPIs
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs font-bold text-orange-light">
              <span>Open Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border py-6 px-6 text-center text-xs text-text-muted max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 CricketHub. Built for Islamabad & Rawalpindi indoor cricket communities.</p>
        <p className="text-[11px]">Next.js 14 • TypeScript • Tailwind CSS • Dual Theme System</p>
      </footer>
    </div>
  );
}
