'use client';

import { useAppStore } from '@/lib/store';
import { Booking, PaymentMethod } from '@/types';

export function useBookings() {
  const bookings = useAppStore((state) => state.bookings);
  const createBookingStore = useAppStore((state) => state.createBooking);
  const cancelBookingStore = useAppStore((state) => state.cancelBooking);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const createBooking = async (
    groundId: string,
    groundName: string,
    groundLocation: string,
    slotTime: string,
    date: string,
    totalPrice: number,
    paymentMethod: PaymentMethod,
    teamName?: string
  ): Promise<Booking> => {
    return createBookingStore(
      groundId,
      groundName,
      groundLocation,
      slotTime,
      date,
      totalPrice,
      paymentMethod,
      teamName
    );
  };

  const cancelBooking = async (id: string): Promise<void> => {
    return cancelBookingStore(id);
  };

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    createBooking,
    cancelBooking,
  };
}
