'use client';

import React, { useState } from 'react';
import { GroundSlot } from '@/types';
import { formatPKR, cn } from '@/lib/utils';
import { Clock, Check } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface SlotPickerProps {
  slots: GroundSlot[];
  selectedSlot: GroundSlot | null;
  onSelectSlot: (slot: GroundSlot) => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export function SlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedDate,
  onSelectDate,
}: SlotPickerProps) {
  // Generate next 4 selectable days
  const today = new Date();
  const dates = [0, 1, 2, 3].map((offset) => {
    const d = addDays(today, offset);
    return {
      iso: format(d, 'yyyy-MM-dd'),
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : format(d, 'EEE'),
      dateDisplay: format(d, 'dd MMM'),
    };
  });

  return (
    <div className="space-y-4">
      {/* Date Selector Pills */}
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
          Select Match Date
        </label>
        <div className="grid grid-cols-4 gap-2">
          {dates.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => onSelectDate(d.iso)}
                className={cn(
                  'p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-surface border-card-border text-text-secondary hover:text-text-primary hover:border-primary/40'
                )}
              >
                <p className="text-[11px] font-bold">{d.dayName}</p>
                <p className="text-xs opacity-90">{d.dateDisplay}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Available Time Slots
          </label>
          <span className="text-[11px] text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" /> 60 Min Sessions
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  'p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 relative',
                  !isAvailable
                    ? 'bg-surface/40 border-card-border/40 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-white border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20 cursor-pointer'
                    : 'bg-surface border-card-border hover:border-primary/50 text-text-primary cursor-pointer hover:-translate-y-0.5'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-white/90' : 'text-primary-light font-bold'}>
                    {formatPKR(slot.price)}
                  </span>
                  <span className="text-[9px] uppercase font-semibold opacity-80">
                    {isAvailable ? 'Available' : 'Booked'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
