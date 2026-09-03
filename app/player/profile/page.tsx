'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import {
  User,
  Mail,
  Phone,
  Sun,
  Moon,
  Bell,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState(user?.name || 'Zain Sial');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [email] = useState(user?.email || 'zain@crickethub.pk');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Account & Preferences</h2>
        <p className="text-xs text-text-secondary">Manage your cricketer profile, theme styling, and notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-4">
          <Card className="p-6 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-teal flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/25 border-2 border-card-border">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center text-white text-xs">
                ✓
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-text-primary">{name}</h3>
              <p className="text-xs text-text-muted mt-0.5">{email}</p>
              <div className="mt-2 flex justify-center">
                <Badge variant="primary" size="sm">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="pt-3 border-t border-card-border grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-surface rounded-xl">
                <span className="font-black text-sm text-text-primary">19</span>
                <span className="text-[10px] text-text-muted block">Matches</span>
              </div>
              <div className="p-2 bg-surface rounded-xl">
                <span className="font-black text-sm text-primary-light">78</span>
                <span className="text-[10px] text-text-muted block">Slots Booked</span>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10 text-xs py-2.5"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out of CricketHub
          </Button>
        </div>

        {/* Right 2 Columns: Edit Form & Theme */}
        <div className="md:col-span-2 space-y-6">
          {/* Theme Selection Section */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div>
              <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange" />
                <span>CricketHub Visual Identity & Theme</span>
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Switch between the dual custom visual systems built for CricketHub
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Dark Theme Card */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-primary ring-2 ring-primary/40 bg-surface shadow-lg'
                    : 'border-card-border bg-card hover:border-card-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded-lg bg-[#0B1117] border border-[#263149] flex items-center justify-center text-[#7C3AED]">
                    <Moon className="w-3.5 h-3.5 fill-current" />
                  </div>
                  {theme === 'dark' && <span className="text-[10px] font-bold text-primary-light uppercase">Active</span>}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Cyber Slate & Violet</p>
                  <p className="text-[10px] text-text-muted">Dark midnight theme (#0B1117)</p>
                </div>
              </button>

              {/* Light Theme Card */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#0F6B3B] ring-2 ring-[#0F6B3B]/40 bg-surface shadow-lg'
                    : 'border-card-border bg-card hover:border-card-border/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded-lg bg-[#F3EAD7] border border-[#E3D9C2] flex items-center justify-center text-[#0F6B3B]">
                    <Sun className="w-3.5 h-3.5 text-[#0F6B3B]" />
                  </div>
                  {theme === 'light' && <span className="text-[10px] font-bold text-[#0F6B3B] uppercase">Active</span>}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Turf Green & Cream</p>
                  <p className="text-[10px] text-text-muted">Natural grass court theme (#F3EAD7)</p>
                </div>
              </button>
            </div>
          </Card>

          {/* Profile Details Form */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h4 className="font-bold text-sm text-text-primary">Personal Information</h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-surface/50 border border-card-border rounded-xl px-3.5 py-2 text-sm text-text-muted cursor-not-allowed"
                />
              </div>

              {/* Notification Toggles */}
              <div className="pt-3 border-t border-card-border space-y-3">
                <span className="text-xs font-bold text-text-primary block">Notification Alerts</span>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Slot Booking Reminders</p>
                    <p className="text-[11px] text-text-muted">SMS and push reminders 2 hours before your slot</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Team Challenge Notifications</p>
                    <p className="text-[11px] text-text-muted">Receive alerts when another captain challenges your team</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Profile changes saved!
                  </span>
                ) : <span />}

                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
