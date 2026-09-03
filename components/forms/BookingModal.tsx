'use client';

import React, { useState } from 'react';
import { Ground, GroundSlot, PaymentMethod, Booking } from '@/types';
import { Modal } from '@/components/shared/Modal';
import { SlotPicker } from '@/components/cards/SlotPicker';
import { Button } from '@/components/shared/Button';
import { formatPKR, formatDisplayDate } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, Ticket, CreditCard, Banknote, ShieldAlert } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';

interface BookingModalProps {
  ground: Ground | null;
  slots: GroundSlot[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (booking: Booking) => void;
}

export function BookingModal({
  ground,
  slots,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<GroundSlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_ground');
  const [bookForTeam, setBookForTeam] = useState<boolean>(true);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const { createBooking, loading } = useBookings();

  if (!ground) return null;

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    try {
      const booking = await createBooking(
        ground.id,
        ground.name,
        ground.location,
        `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
        selectedDate,
        selectedSlot.price,
        paymentMethod,
        bookForTeam ? 'Islamabad Strikers' : undefined
      );
      setConfirmedBooking(booking);
      if (onSuccess) onSuccess(booking);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    setSelectedSlot(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmedBooking ? '🎉 Booking Confirmed!' : `Book Slot — ${ground.name}`}
      description={confirmedBooking ? 'Your slot is secured. Show your reference at the ground.' : ground.location}
      maxWidth="lg"
    >
      {confirmedBooking ? (
        /* Confirmed Ticket View */
        <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="bg-surface border border-card-border rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-card-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted">Booking Reference</span>
                <p className="font-mono text-base font-extrabold text-primary-light">
                  {confirmedBooking.referenceCode}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
                {confirmedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] text-text-muted">Arena</p>
                <p className="font-bold text-text-primary">{confirmedBooking.groundName}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Slot Time</p>
                <p className="font-bold text-text-primary">{confirmedBooking.slotTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Date</p>
                <p className="font-bold text-text-primary">{formatDisplayDate(confirmedBooking.date)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Amount Due</p>
                <p className="font-bold text-primary-light">{formatPKR(confirmedBooking.totalPrice)}</p>
              </div>
            </div>

            {confirmedBooking.teamName && (
              <p className="text-[11px] text-text-secondary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20">
                Booked on behalf of team: <strong>{confirmedBooking.teamName}</strong>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={handleClose}>
              Done & View Bookings
            </Button>
          </div>
        </div>
      ) : (
        /* Slot Selection & Checkout Form */
        <div className="space-y-5">
          {/* Interactive Slot Grid */}
          <SlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_ground')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'cash_on_ground'
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-card-border bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Cash on Ground</p>
                  <p className="text-[10px] text-text-muted">Pay manager on arrival</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'easypaisa'
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-card-border bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <CreditCard className="w-5 h-5 text-teal-light shrink-0" />
                <div>
                  <p className="text-xs font-bold">EasyPaisa / JazzCash</p>
                  <p className="text-[10px] text-text-muted">Instant mobile wallet</p>
                </div>
              </button>
            </div>
          </div>

          {/* Team Tagging Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-card-border">
            <input
              type="checkbox"
              id="teamCheck"
              checked={bookForTeam}
              onChange={(e) => setBookForTeam(e.target.checked)}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="teamCheck" className="text-xs text-text-secondary cursor-pointer">
              Tag this booking to <strong>Islamabad Strikers</strong> roster & leaderboard
            </label>
          </div>

          {/* Conflict Protection Notice */}
          <div className="flex items-start gap-2 text-[11px] text-text-muted p-2.5 rounded-lg bg-surface/50 border border-card-border">
            <ShieldAlert className="w-4 h-4 text-orange shrink-0 mt-0.5" />
            <span>
              Real-time slot locking active: Slot will be held for 10 minutes upon confirmation.
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-card-border flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted block">Estimated Total</span>
              <span className="text-lg font-black text-primary-light">
                {selectedSlot ? formatPKR(selectedSlot.price) : 'Select a slot'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedSlot}
                isLoading={loading}
                onClick={handleConfirm}
              >
                Confirm & Lock Slot
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
