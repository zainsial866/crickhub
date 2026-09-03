'use client';

import React from 'react';
import { Booking } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { formatPKR, formatDisplayDate } from '@/lib/utils';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, Ban } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onViewDetails?: (booking: Booking) => void;
}

export function BookingCard({ booking, onCancel, onViewDetails }: BookingCardProps) {
  const statusVariant = {
    confirmed: 'success',
    pending: 'orange',
    completed: 'teal',
    cancelled: 'danger',
  }[booking.status] as 'success' | 'orange' | 'teal' | 'danger';

  const isCancellable = booking.status === 'confirmed' || booking.status === 'pending';

  return (
    <Card className="relative overflow-hidden border border-card-border p-0 hover:border-primary/40 transition-all duration-200">
      {/* Top Bar with Reference & Status */}
      <div className="bg-surface px-4 py-3 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-primary-light" />
          <span className="font-mono text-xs font-bold text-text-primary tracking-wider">
            {booking.referenceCode}
          </span>
        </div>
        <Badge variant={statusVariant} size="sm">
          {booking.status}
        </Badge>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h4 className="font-bold text-base text-text-primary">{booking.groundName}</h4>
          <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-text-muted" />
            <span>{booking.groundLocation}</span>
          </p>
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 gap-3 py-2 bg-surface/50 rounded-xl px-3 border border-card-border/50 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-light shrink-0" />
            <div>
              <p className="text-[10px] text-text-muted uppercase font-semibold">Date</p>
              <p className="font-medium text-text-primary">{formatDisplayDate(booking.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-light shrink-0" />
            <div>
              <p className="text-[10px] text-text-muted uppercase font-semibold">Slot Time</p>
              <p className="font-medium text-text-primary">{booking.slotTime}</p>
            </div>
          </div>
        </div>

        {booking.teamName && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
            <Users className="w-3.5 h-3.5 text-primary-light" />
            <span>Booked for: <strong>{booking.teamName}</strong></span>
          </div>
        )}
      </div>

      {/* Dashed Separator */}
      <div className="relative flex items-center px-4">
        <div className="w-full border-t border-dashed border-card-border" />
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between gap-3 bg-surface/30">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted block">Total Fee</span>
          <span className="font-extrabold text-sm text-text-primary">{formatPKR(booking.totalPrice)}</span>
        </div>

        <div className="flex items-center gap-2">
          {isCancellable && onCancel && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(booking.id)}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10 text-xs py-1.5"
              leftIcon={<Ban className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
          )}

          {onViewDetails && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewDetails(booking)}
              className="text-xs py-1.5"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
