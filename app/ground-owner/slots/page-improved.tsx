'use client';

import React, { useState } from 'react';
import { useOwner } from '@/hooks/useOwner';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { formatPKR } from '@/lib/utils';
import {
  Clock,
  ShieldAlert,
  Users,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
} from 'lucide-react';
import { addDays, format } from 'date-fns';

export default function OwnerSlotsPage() {
  const {
    ground,
    slots,
    toggleSlotAvailability,
    bulkSetSlotAvailability,
    reserveSlotsManually,
  } = useOwner();
  const team = useTeams();
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [teamChoice, setTeamChoice] = useState('registered');
  const [customTeamName, setCustomTeamName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = addDays(new Date(), offset);
    return {
      offset,
      name: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : format(d, 'EEE'),
      date: format(d, 'dd MMM'),
    };
  });

  const targetDate = addDays(new Date(), selectedDayOffset);
  const targetDateString = format(targetDate, 'yyyy-MM-dd');
  const currentDaySlots = slots.filter(
    (slot) => slot.date === targetDateString
  );
  const openSlotIds = slots
    .filter((slot) => slot.isAvailable)
    .map((slot) => slot.id);
  const selectedSlots = slots.filter((slot) =>
    selectedSlotIds.includes(slot.id)
  );
  const selectedTeamName =
    teamChoice === 'registered' ? team.team.name : customTeamName.trim();

  const toggleSelected = (slotId: string) => {
    setSelectedSlotIds((current) =>
      current.includes(slotId)
        ? current.filter((id) => id !== slotId)
        : [...current, slotId]
    );
  };

  const selectAll = () => {
    setSelectedSlotIds((current) =>
      current.length === currentDaySlots.length
        ? []
        : currentDaySlots.map((slot) => slot.id)
    );
  };

  const clearSelection = () => setSelectedSlotIds([]);

  const handleManualReservation = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSlotIds.length || !selectedTeamName || !managerPhone.trim())
      return;
    reserveSlotsManually(selectedSlotIds, selectedTeamName, managerPhone.trim());
    setIsManualModalOpen(false);
    setSelectedSlotIds([]);
    setCustomTeamName('');
    setManagerPhone('');
  };

  const bookedSlotsCount = currentDaySlots.filter(
    (s) => !s.isAvailable && s.bookingType === 'manual'
  ).length;
  const blockedSlotsCount = currentDaySlots.filter(
    (s) => !s.isAvailable && s.bookingType !== 'manual'
  ).length;
  const openSlotsCount = currentDaySlots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              Slot Schedule & Availability
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Manage hourly bookings, set blackout hours for maintenance, and
              adjust peak pricing
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
              Reserve Selected
            </Button>
          </div>
        </div>

        {/* Ground Info Card */}
        <Card className="border-card-border bg-gradient-to-br from-surface to-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-text-primary text-sm">{ground?.name}</h3>
            <p className="text-xs text-text-muted mt-1">
              {ground?.location}, {ground?.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary-light">
              {formatPKR(ground?.hourlyRate || 0)}
              <span className="text-xs font-normal text-text-muted">/hr</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Conflict & Concurrency Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-card-border">
        <ShieldAlert className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary space-y-0.5">
          <p className="font-bold text-text-primary">
            Zero Double-Booking Guarantee
          </p>
          <p>
            Toggling a slot off immediately removes it from player discovery
            across Islamabad & Rawalpindi in real time.
          </p>
        </div>
      </div>

      {/* 7-Day Calendar Tab Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-card-border scrollbar-hide">
          {days.map((day) => (
            <button
              key={day.offset}
              onClick={() => {
                setSelectedDayOffset(day.offset);
                clearSelection();
              }}
              className={`px-4 py-2.5 rounded-2xl text-center border transition-all shrink-0 cursor-pointer ${
                selectedDayOffset === day.offset
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-card border-card-border text-text-secondary hover:text-text-primary hover:border-primary/40'
              }`}
            >
              <p className="text-[11px] font-bold uppercase">{day.name}</p>
              <p className="text-xs opacity-90">{day.date}</p>
            </button>
          ))}
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <p className="text-xs font-bold text-emerald-400">OPEN</p>
            <p className="text-xl font-black text-emerald-400 mt-1">
              {openSlotsCount}
            </p>
          </div>
          <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-3">
            <p className="text-xs font-bold text-teal-light">BOOKED</p>
            <p className="text-xl font-black text-teal-light mt-1">
              {bookedSlotsCount}
            </p>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-xs font-bold text-red-400">BLOCKED</p>
            <p className="text-xl font-black text-red-400 mt-1">
              {blockedSlotsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Slots Management Section */}
      <div className="space-y-4">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Hourly Slots for {days[selectedDayOffset].name} (
              {days[selectedDayOffset].date})
            </h3>
            <p className="text-xs text-text-muted mt-1">
              {currentDaySlots.length} total slots
            </p>
          </div>
          <div className="hidden sm:flex gap-1 bg-card border border-card-border rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Batch Action Bar */}
        {currentDaySlots.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-card-border bg-surface p-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={selectAll}
              leftIcon={
                selectedSlotIds.length === currentDaySlots.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )
              }
            >
              {selectedSlotIds.length === currentDaySlots.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
            <div className="w-full h-px bg-card-border sm:w-auto sm:h-4" />
            <Button
              size="sm"
              variant="outline"
              disabled={!selectedSlotIds.length}
              onClick={() => bulkSetSlotAvailability(selectedSlotIds, false)}
            >
              Block Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!selectedSlotIds.length}
              onClick={() => bulkSetSlotAvailability(selectedSlotIds, true)}
            >
              Open Selected
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!selectedSlotIds.length}
              onClick={() => setIsManualModalOpen(true)}
            >
              Assign Selected
            </Button>
            {selectedSlotIds.length > 0 && (
              <span className="ml-auto text-xs font-semibold text-text-secondary px-2 py-1 bg-card rounded-lg">
                {selectedSlotIds.length} selected
              </span>
            )}
          </div>
        )}

        {/* Slots Display */}
        {currentDaySlots.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }
          >
            {currentDaySlots.map((slot) => {
              const isAvailable = slot.isAvailable;
              const isSelected = selectedSlotIds.includes(slot.id);

              if (viewMode === 'list') {
                return (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                        : isAvailable
                        ? 'border-card-border hover:border-primary/40'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(slot.id)}
                        className="w-4 h-4 accent-primary cursor-pointer rounded"
                      />
                      <div>
                        <p className="font-mono text-xs font-bold text-text-primary">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatPKR(slot.price)}/session
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          isAvailable
                            ? 'success'
                            : slot.bookingType === 'manual'
                            ? 'teal'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {isAvailable
                          ? 'Open'
                          : slot.bookingType === 'manual'
                          ? 'Booked'
                          : 'Blocked'}
                      </Badge>
                      <Button
                        size="sm"
                        variant={isAvailable ? 'outline' : 'primary'}
                        onClick={() => toggleSlotAvailability(slot.id)}
                        leftIcon={
                          isAvailable ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )
                        }
                      >
                        {isAvailable ? 'Block' : 'Open'}
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <Card
                  key={slot.id}
                  className={`p-4 flex flex-col justify-between space-y-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : isAvailable
                      ? 'border-card-border hover:border-primary/50'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                  onClick={() => toggleSelected(slot.id)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelected(slot.id);
                        }}
                        className="w-4 h-4 accent-primary cursor-pointer"
                        aria-label={`Select ${slot.startTime} slot`}
                      />
                    </div>

                    <p className="text-lg font-black text-primary-light">
                      {formatPKR(slot.price)}
                      <span className="text-xs font-normal text-text-muted">
                        {' '}
                        /session
                      </span>
                    </p>
                    {slot.bookingType === 'manual' && slot.teamName && (
                      <span className="mt-2 inline-flex rounded-full bg-teal/10 border border-teal/20 px-2 py-1 text-[10px] font-bold text-teal-light">
                        {slot.teamName}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-card-border space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          isAvailable
                            ? 'success'
                            : slot.bookingType === 'manual'
                            ? 'teal'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {isAvailable
                          ? 'Open'
                          : slot.bookingType === 'manual'
                          ? 'Booked'
                          : 'Blocked'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={isAvailable ? 'outline' : 'primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSlotAvailability(slot.id);
                      }}
                      className="w-full text-xs"
                      leftIcon={
                        isAvailable ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )
                      }
                    >
                      {isAvailable ? 'Block Slot' : 'Make Open'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-card-border p-8 text-center">
            <p className="text-sm text-text-secondary">
              No slots available for this day
            </p>
          </Card>
        )}
      </div>

      {/* Manual Reservation Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Manual Team Reservation"
        description={`Assign ${selectedSlots.length} selected slot${selectedSlots.length === 1 ? '' : 's'} to one team.`}
      >
        <form onSubmit={handleManualReservation} className="space-y-4">
          <div>
            <label
              htmlFor="team-choice"
              className="text-xs font-semibold text-text-secondary block mb-1.5"
            >
              Team roster
            </label>
            <select
              id="team-choice"
              value={teamChoice}
              onChange={(event) => setTeamChoice(event.target.value)}
              className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="registered">
                {team.team.name} ({team.team.members.length} players)
              </option>
              <option value="custom">Custom team name</option>
            </select>
          </div>

          {teamChoice === 'custom' && (
            <div>
              <label
                htmlFor="custom-team-name"
                className="text-xs font-semibold text-text-secondary block mb-1.5"
              >
                Custom team name
              </label>
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
            <label
              htmlFor="manager-phone"
              className="text-xs font-semibold text-text-secondary block mb-1.5"
            >
              Manager phone number
            </label>
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
            Selected slots will be marked{' '}
            <strong className="text-teal-light">Booked (Manual)</strong> and
            tagged with the team name.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-card-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsManualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedTeamName || !managerPhone.trim()}
            >
              Assign Reservation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
