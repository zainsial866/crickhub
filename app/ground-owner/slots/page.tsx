'use client';

import React, { useState } from 'react';
import { useOwner } from '@/hooks/useOwner';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { formatPKR } from '@/lib/utils';
import { Clock, ShieldAlert, Check, Ban, Sparkles, Plus, Edit2 } from 'lucide-react';
import { addDays, format } from 'date-fns';

export default function OwnerSlotsPage() {
  const { ground, slots, toggleSlotAvailability, updateSlotPrice } = useOwner();
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = addDays(new Date(), offset);
    return {
      offset,
      name: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : format(d, 'EEE'),
      date: format(d, 'dd MMM'),
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Slot Schedule & Availability</h2>
          <p className="text-xs text-text-secondary">
            Manage hourly bookings, set blackout hours for maintenance, and adjust peak pricing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">
            Auto-Sync Live
          </Badge>
        </div>
      </div>

      {/* 7-Day Calendar Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-card-border">
        {days.map((day) => (
          <button
            key={day.offset}
            onClick={() => setSelectedDayOffset(day.offset)}
            className={`px-4 py-2.5 rounded-2xl text-center border transition-all shrink-0 cursor-pointer ${
              selectedDayOffset === day.offset
                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                : 'bg-card border-card-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <p className="text-[11px] font-bold uppercase">{day.name}</p>
            <p className="text-xs opacity-90">{day.date}</p>
          </button>
        ))}
      </div>

      {/* Conflict & Concurrency Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-card-border">
        <ShieldAlert className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary space-y-0.5">
          <p className="font-bold text-text-primary">Zero Double-Booking Guarantee</p>
          <p>
            Toggling a slot off immediately removes it from player discovery across Islamabad & Rawalpindi in real time.
          </p>
        </div>
      </div>

      {/* Slots Interactive Grid / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">
            Hourly Slots for {days[selectedDayOffset].name} ({days[selectedDayOffset].date})
          </h3>
          <span className="text-xs text-text-muted">
            Tap switch to toggle availability
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const isAvailable = slot.isAvailable;

            return (
              <Card
                key={slot.id}
                className={`p-4 flex flex-col justify-between space-y-4 border transition-all ${
                  isAvailable
                    ? 'border-card-border hover:border-primary/50'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-text-muted" />
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <Badge variant={isAvailable ? 'success' : 'danger'} size="sm">
                      {isAvailable ? 'Open' : 'Blocked'}
                    </Badge>
                  </div>

                  <p className="text-lg font-black text-primary-light">
                    {formatPKR(slot.price)}
                    <span className="text-xs font-normal text-text-muted"> /session</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-card-border flex items-center justify-between gap-2">
                  <span className="text-[11px] text-text-muted font-medium">
                    {isAvailable ? 'Bookable Online' : 'Private / Maintenance'}
                  </span>

                  <Button
                    size="sm"
                    variant={isAvailable ? 'outline' : 'primary'}
                    onClick={() => toggleSlotAvailability(slot.id)}
                    className="text-xs py-1"
                  >
                    {isAvailable ? 'Block Slot' : 'Make Open'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
