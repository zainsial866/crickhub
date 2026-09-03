'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { UserRole } from '@/types';
import { ROLE_HOME_ROUTES } from '@/lib/constants';
import { Mail, Lock, User, Building2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(name, email, role);
    setLoading(false);
    router.push(ROLE_HOME_ROUTES[role]);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/25">
            🏏
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Create Account</h2>
        <p className="text-xs text-text-secondary">Join CricketHub for indoor match bookings & team rankings</p>
      </div>

      <Card className="p-6 sm:p-7 space-y-5">
        {/* Role Selection Tabs */}
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">I am registering as a:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('player')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                role === 'player'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface border-card-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1" />
              Cricket Player / Captain
            </button>
            <button
              type="button"
              onClick={() => setRole('ground_owner')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                role === 'ground_owner'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface border-card-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-teal" />
              Ground Facility Owner
            </button>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zain Sial"
                className="w-full bg-surface border border-card-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Password</label>
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
            Sign Up & Get Started
          </Button>
        </form>

        <p className="text-center text-xs text-text-secondary pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-light font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
