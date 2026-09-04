'use client';

import React, { useState } from 'react';
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
  X,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { stats, grounds, disputes, approveGround, rejectGround } =
    useAdmin();
  const [selectedTab, setSelectedTab] = useState<
    'approvals' | 'disputes'
  >('approvals');

  const pendingGrounds = grounds.filter((g) => g.status === 'pending');
  const approvedGrounds = grounds.filter((g) => g.status === 'approved');

  const StatCard = ({
    label,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: { value: string; isPositive: boolean };
  }) => (
    <Card className="border-card-border p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-text-muted uppercase">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${color}`}>{Icon}</div>
      </div>
      <div>
        <p className="text-3xl font-black text-text-primary">{value}</p>
        {trend && (
          <p
            className={`text-xs font-semibold mt-2 flex items-center gap-1 ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {trend.value}
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            Platform Analytics & Governance
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Islamabad & Rawalpindi indoor arena operations oversight
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-card-border text-xs font-bold text-orange">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Founder Mode</span>
        </div>
      </div>

      {/* KPI Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-5 h-5 text-primary-light" />}
          color="bg-primary-light/10"
          trend={{ value: '+18% this month', isPositive: true }}
        />

        <StatCard
          label="Indoor Grounds"
          value={stats.activeGrounds.toString()}
          icon={<Building2 className="w-5 h-5 text-teal-light" />}
          color="bg-teal-light/10"
          trend={{ value: `${approvedGrounds.length} verified`, isPositive: true }}
        />

        <StatCard
          label="Bookings Logged"
          value={stats.totalBookings.toLocaleString()}
          icon={<CalendarCheck2 className="w-5 h-5 text-orange" />}
          color="bg-orange/10"
          trend={{
            value: `${stats.bookingsThisWeek} this week`,
            isPositive: true,
          }}
        />

        <StatCard
          label="Gross Booking Vol."
          value={formatPKR(stats.totalRevenuePkr)}
          icon={<CircleDollarSign className="w-5 h-5 text-emerald-400" />}
          color="bg-emerald-400/10"
          trend={{
            value: `${formatPKR(stats.revenueThisMonthPkr)} in Sep`,
            isPositive: true,
          }}
        />
      </div>

      {/* Tabs for Approvals & Disputes */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-card-border">
          <button
            onClick={() => setSelectedTab('approvals')}
            className={`px-4 py-3 font-bold text-sm transition border-b-2 ${
              selectedTab === 'approvals'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Ground Approvals
            <Badge
              variant="orange"
              size="sm"
              className="ml-2 inline-block"
            >
              {pendingGrounds.length}
            </Badge>
          </button>
          <button
            onClick={() => setSelectedTab('disputes')}
            className={`px-4 py-3 font-bold text-sm transition border-b-2 ${
              selectedTab === 'disputes'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Customer Disputes
            <Badge
              variant="danger"
              size="sm"
              className="ml-2 inline-block"
            >
              {disputes.length}
            </Badge>
          </button>
        </div>

        {/* Content Area */}
        {selectedTab === 'approvals' ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  Ground Approvals Queue
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {pendingGrounds.length} pending,{' '}
                  {approvedGrounds.length} verified
                </p>
              </div>
              <Link
                href="/admin/grounds"
                className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Approvals List */}
            <div className="grid gap-3">
              {grounds.length > 0 ? (
                grounds.map((g) => (
                  <Card
                    key={g.id}
                    className="border-card-border p-4 hover:border-primary/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Ground Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-text-primary">
                            {g.name}
                          </h4>
                          <Badge
                            variant={
                              g.status === 'approved' ? 'success' : 'orange'
                            }
                            size="sm"
                          >
                            {g.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <MapPin className="w-3 h-3" />
                          {g.location}, {g.city}
                        </div>
                        <p className="text-sm font-bold text-primary-light">
                          {formatPKR(g.hourlyRate)} /hr
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                        {g.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => approveGround(g.id)}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                              className="text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectGround(g.id)}
                              className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                              leftIcon={<X className="w-3.5 h-3.5" />}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant="success" size="md">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="border-card-border p-8 text-center">
                  <p className="text-sm text-text-secondary">
                    No grounds to review
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  Customer Disputes
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {disputes.length} active dispute{disputes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Link
                href="/admin/disputes"
                className="text-xs font-semibold text-orange hover:underline flex items-center gap-1"
              >
                View Queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Disputes List */}
            <div className="grid gap-3">
              {disputes.length > 0 ? (
                disputes.map((d) => (
                  <Card
                    key={d.id}
                    className="border-card-border p-4 space-y-3 hover:border-orange/40 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-orange">
                            {d.ticketNumber}
                          </span>
                          <Badge
                            variant={
                              d.status === 'open' ? 'danger' : 'teal'
                            }
                            size="sm"
                          >
                            {d.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm text-text-primary">
                          {d.subject}
                        </h4>
                        <p className="text-xs text-text-muted line-clamp-2">
                          {d.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-card-border flex items-center justify-between text-[11px] text-text-secondary">
                      <span>
                        Raised by:{' '}
                        <strong className="text-text-primary">
                          {d.raisedByName}
                        </strong>{' '}
                        ({d.groundName})
                      </span>
                      <Link
                        href={`/admin/disputes/${d.id}`}
                        className="text-primary-light font-semibold hover:underline"
                      >
                        Inspect →
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="border-card-border p-8 text-center">
                  <p className="text-sm text-text-secondary">
                    No active disputes
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-card-border p-5 space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase">
            Ground Distribution
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Verified</span>
              <span className="font-bold text-text-primary">
                {approvedGrounds.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Pending</span>
              <span className="font-bold text-orange">
                {pendingGrounds.length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="border-card-border p-5 space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase">
            System Health
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Uptime</span>
              <span className="font-bold text-emerald-400">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Response Time</span>
              <span className="font-bold text-text-primary">120ms</span>
            </div>
          </div>
        </Card>

        <Card className="border-card-border p-5 space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase">
            Platform Metrics
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Avg Rating</span>
              <span className="font-bold text-primary-light">4.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                Player Retention
              </span>
              <span className="font-bold text-emerald-400">94%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
