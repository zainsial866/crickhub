'use client';

import React from 'react';
import { useOwner } from '@/hooks/useOwner';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { formatPKR, formatDisplayDate } from '@/lib/utils';
import {
  CircleDollarSign,
  CalendarCheck2,
  Users,
  Clock,
  CheckCircle2,
  Phone,
  ArrowRight,
  PlusCircle,
  Building2,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function GroundOwnerDashboard() {
  const { ground, bookings, slots } = useOwner();

  const activeSlotsCount = slots.filter((s) => s.isAvailable).length;
  const bookedSlotsCount = slots.length - activeSlotsCount;
  const todayRevenue = bookedSlotsCount * ground.hourlyRate;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner with Ground Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-card via-surface to-card border border-card-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal/15 border border-teal/30 flex items-center justify-center text-teal-light text-2xl font-black shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-text-primary tracking-tight">{ground.name}</h2>
              <Badge variant="teal" size="sm">Active Facility</Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{ground.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ground-owner/slots">
            <Button variant="primary" size="sm" leftIcon={<Clock className="w-4 h-4" />}>
              Manage Slots
            </Button>
          </Link>
          <Link href="/ground-owner/settings">
            <Button variant="secondary" size="sm">
              Edit Details
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Stat KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Today&apos;s Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-text-primary">{formatPKR(todayRevenue)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% vs yesterday
          </p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Slots Booked</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary-light">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-text-primary">
            {bookedSlotsCount} <span className="text-sm font-normal text-text-muted">/ {slots.length}</span>
          </p>
          <p className="text-[11px] text-text-muted font-medium">{activeSlotsCount} slots still open today</p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Occupancy Rate</span>
            <div className="p-2 rounded-xl bg-teal/10 text-teal-light">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-text-primary">
            {Math.round((bookedSlotsCount / slots.length) * 100)}%
          </p>
          <p className="text-[11px] text-teal-light font-medium">Prime hours 8pm–11pm full</p>
        </Card>

        <Card className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Customer Rating</span>
            <div className="p-2 rounded-xl bg-orange/10 text-orange">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-text-primary">{ground.rating} ★</p>
          <p className="text-[11px] text-text-muted font-medium">Based on {ground.reviewCount} player reviews</p>
        </Card>
      </div>

      {/* Schedule & Bookings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incoming Bookings Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Today&apos;s Match Bookings</h3>
              <p className="text-xs text-text-secondary">Incoming teams and reservations scheduled for tonight</p>
            </div>
            <Link href="/ground-owner/slots" className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1">
              View Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-card-border hover:border-primary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                      {booking.referenceCode}
                    </span>
                    <h4 className="font-bold text-sm text-text-primary">{booking.userName}</h4>
                    {booking.teamName && (
                      <span className="text-xs text-text-muted">({booking.teamName})</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1 text-teal-light font-bold">
                      <Clock className="w-3.5 h-3.5" /> {booking.slotTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-text-muted">
                      <Phone className="w-3 h-3" /> {booking.userPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-card-border">
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted uppercase font-bold block">Fee</span>
                    <span className="font-black text-sm text-text-primary">{formatPKR(booking.totalPrice)}</span>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'orange'} size="sm">
                    {booking.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Operating Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-primary">Operational Shortcuts</h3>

          <Card className="p-5 space-y-4 bg-surface/50 border-card-border">
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-primary block">Facility Status</span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-card-border">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-text-primary">Accepting Online Bookings</span>
                </div>
                <Badge variant="success" size="sm">Live</Badge>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-card-border">
              <span className="text-xs font-bold text-text-primary block">Fast Actions</span>
              <div className="space-y-2">
                <Link href="/ground-owner/slots" className="block">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<Clock className="w-3.5 h-3.5 text-primary-light" />}>
                    Block Off Hour for Private League
                  </Button>
                </Link>
                <Link href="/ground-owner/earnings" className="block">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<CircleDollarSign className="w-3.5 h-3.5 text-teal" />}>
                    View Weekly Payment Payouts
                  </Button>
                </Link>
                <Link href="/ground-owner/settings" className="block">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-xs" leftIcon={<PlusCircle className="w-3.5 h-3.5 text-orange" />}>
                    Update Pitch Lighting / Amenities
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
