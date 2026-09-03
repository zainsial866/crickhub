'use client';

import React from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { formatPKR } from '@/lib/utils';
import {
  Users,
  Building2,
  CalendarCheck2,
  CircleDollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { stats, grounds, disputes, approveGround, rejectGround } = useAdmin();

  const pendingGrounds = grounds.filter((g) => g.status === 'pending');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Platform Analytics & Governance</h2>
          <p className="text-xs text-text-secondary">Islamabad & Rawalpindi indoor arena operations oversight</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-card-border text-xs font-bold text-orange">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Founder Mode</span>
        </div>
      </div>

      {/* 4-Stat KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Total Users</span>
            <Users className="w-4 h-4 text-primary-light" />
          </div>
          <p className="text-2xl font-black text-text-primary">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this month
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Indoor Grounds</span>
            <Building2 className="w-4 h-4 text-teal-light" />
          </div>
          <p className="text-2xl font-black text-text-primary">
            {stats.activeGrounds} <span className="text-sm font-normal text-text-muted">active</span>
          </p>
          <p className="text-[11px] text-text-muted">Across ISB & Pindi sectors</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Bookings Logged</span>
            <CalendarCheck2 className="w-4 h-4 text-orange" />
          </div>
          <p className="text-2xl font-black text-text-primary">{stats.totalBookings.toLocaleString()}</p>
          <p className="text-[11px] text-orange font-semibold">{stats.bookingsThisWeek} this week</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Gross Booking Vol.</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-text-primary">{formatPKR(stats.totalRevenuePkr)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{formatPKR(stats.revenueThisMonthPkr)} in Sep</p>
        </Card>
      </div>

      {/* Two Columns: Pending Ground Approvals & Disputes Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Grounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal" />
              <span>Ground Approvals Queue</span>
              <span className="text-xs font-normal text-text-muted">({grounds.length} total)</span>
            </h3>
            <Link href="/admin/grounds" className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {grounds.map((g) => (
              <Card key={g.id} className="p-4 flex items-center justify-between gap-4 border-card-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-text-primary">{g.name}</h4>
                    <Badge variant={g.status === 'approved' ? 'success' : 'orange'} size="sm">
                      {g.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">{g.location}, {g.city}</p>
                  <p className="text-[11px] text-primary-light font-bold">{formatPKR(g.hourlyRate)} /hr</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {g.status === 'pending' ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => approveGround(g.id)}
                        className="text-xs py-1 px-2.5"
                        leftIcon={<Check className="w-3 h-3" />}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectGround(g.id)}
                        className="text-xs py-1 px-2.5 text-red-400 border-red-500/30"
                        leftIcon={<X className="w-3 h-3" />}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-text-muted font-medium">Verified</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Dispute Resolution Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange" />
              <span>Customer Disputes</span>
              <span className="text-xs font-normal text-text-muted">({disputes.length} active)</span>
            </h3>
            <Link href="/admin/disputes" className="text-xs font-semibold text-orange hover:underline flex items-center gap-1">
              View Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {disputes.map((d) => (
              <Card key={d.id} className="p-4 space-y-2 border-card-border hover:border-orange/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-orange">{d.ticketNumber}</span>
                  <Badge variant={d.status === 'open' ? 'danger' : 'teal'} size="sm">
                    {d.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{d.subject}</h4>
                  <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{d.description}</p>
                </div>
                <div className="pt-2 border-t border-card-border flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Raised by: <strong>{d.raisedByName}</strong> ({d.groundName})</span>
                  <Link href="/admin/disputes" className="text-primary-light font-semibold hover:underline">
                    Inspect Ticket →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
