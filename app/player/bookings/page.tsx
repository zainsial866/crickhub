'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import { useTeams } from '@/hooks/useTeams';
import { BookingCard } from '@/components/cards/BookingCard';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Booking } from '@/types';
import { formatPKR, formatDisplayDate } from '@/lib/utils';
import { CalendarCheck2, Ticket, AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const { bookings, upcomingBookings, pastBookings, cancelBooking } = useBookings();
  const { createCricketMatch } = useTeams();
  const router = useRouter();

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleConfirmCancel = async () => {
    if (cancellingBookingId) {
      await cancelBooking(cancellingBookingId);
      setCancellingBookingId(null);
    }
  };

  const handleStartMatch = (booking: Booking) => {
    const match = createCricketMatch({
      bookingId: booking.id,
      teamId: booking.teamId,
      teamName: booking.teamName || 'My Team',
      groundId: booking.groundId,
      groundName: booking.groundName,
      date: booking.date,
      time: booking.slotTime,
      overs: 10,
      format: 'T10',
      matchType: 'friendly',
      opponentName: 'Add opponent team',
      status: 'live',
    });
    router.push(`/player/matches/${match.id}/live`);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">My Bookings</h2>
          <p className="text-xs text-text-secondary">View and manage your indoor cricket slot reservations</p>
        </div>

        <Link href="/player/discover">
          <Button size="sm" variant="primary">
            + Book New Slot
          </Button>
        </Link>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-card-border pb-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-card text-text-secondary hover:text-text-primary border border-card-border'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-card text-text-secondary hover:text-text-primary border border-card-border'
          }`}
        >
          Past Sessions ({pastBookings.length})
        </button>
      </div>

      {/* Bookings Grid */}
      {displayedBookings.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface mx-auto flex items-center justify-center text-text-muted">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary">No {activeTab} bookings found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'You have no indoor slots booked for the upcoming week. Browse available arenas in Islamabad & Rawalpindi.'
              : 'You have not completed any indoor sessions yet.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link href="/player/discover" className="inline-block pt-2">
              <Button size="sm" variant="primary">
                Browse Grounds
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={(id) => setCancellingBookingId(id)}
              onViewDetails={(booking) => setSelectedBooking(booking)}
              onStartMatch={handleStartMatch}
            />
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking #${selectedBooking.referenceCode}`}
          description={selectedBooking.groundName}
        >
          <div className="space-y-4">
            <div className="bg-surface p-4 rounded-xl space-y-3 text-xs border border-card-border">
              <div className="flex justify-between pb-2 border-b border-card-border">
                <span className="text-text-muted">Status</span>
                <span className="font-bold uppercase text-primary-light">{selectedBooking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Ground Location</span>
                <span className="font-medium text-text-primary">{selectedBooking.groundLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Date</span>
                <span className="font-medium text-text-primary">{formatDisplayDate(selectedBooking.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Time Slot</span>
                <span className="font-medium text-text-primary">{selectedBooking.slotTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Mode</span>
                <span className="font-medium capitalize text-text-primary">
                  {selectedBooking.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-card-border text-sm">
                <span className="font-bold">Total Fee</span>
                <span className="font-extrabold text-primary-light">{formatPKR(selectedBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="p-3 bg-surface/50 rounded-xl border border-card-border text-[11px] text-text-muted">
              <strong>Ground Policy:</strong> Cancellation with full refund is permitted up to 2 hours prior to slot start time.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBookingId && (
        <Modal
          isOpen={!!cancellingBookingId}
          onClose={() => setCancellingBookingId(null)}
          title="Cancel Reservation?"
          description="Are you sure you want to cancel this booking?"
        >
          <div className="space-y-4 text-xs text-text-secondary">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Cancelling this slot will release it immediately back into the public availability pool for other players.
              </p>
            </div>

            <p>
              Per facility policy, if you paid via EasyPaisa or JazzCash, refund processing takes 2–4 hours to reflect back in your mobile wallet.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-card-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCancellingBookingId(null)}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
