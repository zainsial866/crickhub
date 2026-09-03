'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { UserRole } from '@/types';
import { ROLE_HOME_ROUTES } from '@/lib/constants';
import { Mail, Lock, User, Building2, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('zain@crickethub.pk');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('player');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, selectedRole);
    setLoading(false);
    router.push(ROLE_HOME_ROUTES[selectedRole]);
  };

  const handleQuickLogin = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    const roleEmail =
      role === 'ground_owner'
        ? 'owner@rawalhub.pk'
        : role === 'admin'
        ? 'admin@crickethub.pk'
        : 'zain@crickethub.pk';
    setEmail(roleEmail);
    await login(roleEmail, role);
    setLoading(false);
    router.push(ROLE_HOME_ROUTES[role]);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/25">
            🏏
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Welcome Back</h2>
        <p className="text-xs text-text-secondary">Sign in to book indoor slots or manage your ground</p>
      </div>

      {/* Quick Demo Switcher */}
      <div className="bg-surface border border-card-border p-3 rounded-2xl space-y-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
          Quick Demo One-Click Sign In:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('player')}
            className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'player'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card border-card-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Player
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('ground_owner')}
            className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'ground_owner'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card border-card-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Building2 className="w-4 h-4 mx-auto mb-1 text-teal" />
            Owner
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card border-card-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1 text-orange" />
            Admin
          </button>
        </div>
      </div>

      {/* Login Card Form */}
      <Card className="p-6 sm:p-7 space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-surface border border-card-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-secondary">Password</label>
              <a href="#" className="text-xs text-primary-light hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-card-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <span className="bg-card px-3 text-[11px] uppercase font-bold text-text-muted z-10">Or continue with</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickLogin('player')}
            className="text-xs"
          >
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickLogin('player')}
            className="text-xs"
          >
            Phone OTP
          </Button>
        </div>

        <p className="text-center text-xs text-text-secondary pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary-light font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </Card>
    </div>
  );
}
