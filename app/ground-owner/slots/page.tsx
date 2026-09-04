'use client';

import React, { useState } from 'react';
import { useOwner } from '@/hooks/useOwner';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { formatPKR } from '@/lib/utils';
import { Clock, ShieldAlert, Users, CheckSquare, Square } from 'lucide-react';
import { addDays, format } from 'date-fns';

export default function OwnerSlotsPage() {
  const { ground, slots, toggleSlotAvailability, bulkSetSlotAvailability, reserveSlotsManually } = useOwner();
  const team = useTeams();
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [teamChoice, setTeamChoice] = useState('registered');
  const [customTeamName, setCustomTeamName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = addDays(new Date(), offset);
    return {
      offset,
      name: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : format(d, 'EEE'),
      date: format(d, 'dd MMM'),
    };
  });

  const openSlotIds = slots.filter((slot) => slot.isAvailable).map((slot) => slot.id);
  const selectedSlots = slots.filter((slot) => selectedSlotIds.includes(slot.id));
  const selectedTeamName = teamChoice === 'registered' ? team.team.name : customTeamName.trim();

  const toggleSelected = (slotId: string) => {
    setSelectedSlotIds((current) =>
      current.includes(slotId) ? current.filter((id) => id !== slotId) : [...current, slotId]
    );
  };

  const selectAll = () => {
    setSelectedSlotIds((current) => current.length === slots.length ? [] : slots.map((slot) => slot.id));
  };

  const clearSelection = () => setSelectedSlotIds([]);

  const handleManualReservation = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlotIds.length || !selectedTeamName || !managerPhone.trim()) return;
    reserveSlotsManually(selectedSlotIds, selectedTeamName, managerPhone.trim());
    setIsManualModalOpen(false);
    setSelectedSlotIds([]);
    setCustomTeamName('');
    setManagerPhone('');
  };

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
          <Button
            size="sm"
            variant={selectedSlotIds.length ? 'primary' : 'secondary'}
            onClick={() => setIsManualModalOpen(true)}
            disabled={!selectedSlotIds.length}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Manual Team Reservation
          </Button>
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
          <span className="text-xs text-text-muted">Select slots for batch actions</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-card-border bg-surface p-3">
          <Button size="sm" variant="secondary" onClick={selectAll} leftIcon={selectedSlotIds.length === slots.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}>
            {selectedSlotIds.length === slots.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button size="sm" variant="outline" disabled={!selectedSlotIds.length} onClick={() => bulkSetSlotAvailability(selectedSlotIds, false)}>
            Block Selected
          </Button>
          <Button size="sm" variant="outline" disabled={!selectedSlotIds.length} onClick={() => bulkSetSlotAvailability(selectedSlotIds, true)}>
            Open Selected
          </Button>
          <Button size="sm" variant="primary" disabled={!selectedSlotIds.length} onClick={() => setIsManualModalOpen(true)}>
            Assign Selected to Team
          </Button>
          {selectedSlotIds.length > 0 && (
            <span className="text-xs font-semibold text-text-secondary">{selectedSlotIds.length} selected</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const isAvailable = slot.isAvailable;

            return (
              <Card
                key={slot.id}
                className={`p-4 flex flex-col justify-between space-y-4 border transition-all ${
                  selectedSlotIds.includes(slot.id)
                    ? 'border-primary ring-2 ring-primary/30'
                    : isAvailable
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
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSlotIds.includes(slot.id)}
                        onChange={() => toggleSelected(slot.id)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                        aria-label={`Select ${slot.startTime} slot`}
                      />
                      <Badge variant={isAvailable ? 'success' : slot.bookingType === 'manual' ? 'teal' : 'danger'} size="sm">
                        {isAvailable ? 'Open' : slot.bookingType === 'manual' ? 'Booked (Manual)' : 'Blocked'}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-lg font-black text-primary-light">
                    {formatPKR(slot.price)}
                    <span className="text-xs font-normal text-text-muted"> /session</span>
                  </p>
                  {slot.bookingType === 'manual' && slot.teamName && (
                    <span className="mt-2 inline-flex rounded-full bg-teal/10 border border-teal/20 px-2 py-1 text-[10px] font-bold text-teal-light">
                      {slot.teamName}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-card-border flex items-center justify-between gap-2">
                  <span className="text-[11px] text-text-muted font-medium">
                    {isAvailable ? 'Bookable Online' : slot.bookingType === 'manual' ? `Manager: ${slot.managerPhone}` : 'Private / Maintenance'}
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

      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Manual Team Reservation"
        description={`Assign ${selectedSlots.length} selected slot${selectedSlots.length === 1 ? '' : 's'} to one team.`}
      >
        <form onSubmit={handleManualReservation} className="space-y-4">
          <div>
            <label htmlFor="team-choice" className="text-xs font-semibold text-text-secondary block mb-1.5">Team roster</label>
            <select
              id="team-choice"
              value={teamChoice}
              onChange={(event) => setTeamChoice(event.target.value)}
              className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="registered">{team.team.name} ({team.team.members.length} players)</option>
              <option value="custom">Custom team name</option>
            </select>
          </div>

          {teamChoice === 'custom' && (
            <div>
              <label htmlFor="custom-team-name" className="text-xs font-semibold text-text-secondary block mb-1.5">Custom team name</label>
              <input
                id="custom-team-name"
                required
                value={customTeamName}
                onChange={(event) => setCustomTeamName(event.target.value)}
                placeholder="e.g. Rawal Smashers"
                className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label htmlFor="manager-phone" className="text-xs font-semibold text-text-secondary block mb-1.5">Manager phone number</label>
            <input
              id="manager-phone"
              type="tel"
              required
              value={managerPhone}
              onChange={(event) => setManagerPhone(event.target.value)}
              placeholder="0300-1234567"
              className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div className="rounded-xl border border-teal/20 bg-teal/10 px-3 py-2 text-xs text-text-secondary">
            Selected slots will be marked <strong className="text-teal-light">Booked (Manual)</strong> and tagged with the team name.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-card-border">
            <Button type="button" variant="secondary" onClick={() => setIsManualModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!selectedTeamName || !managerPhone.trim()}>Assign Reservation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
