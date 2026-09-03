'use client';

import { useAppStore } from '@/lib/store';

export function useOwner() {
  const grounds = useAppStore((state) => state.grounds);
  const slots = useAppStore((state) => state.slots);
  const bookings = useAppStore((state) => state.bookings);
  const toggleSlotAvailability = useAppStore((state) => state.toggleSlotAvailability);
  const updateSlotPrice = useAppStore((state) => state.updateSlotPrice);

  const ownerGround = grounds[0]; // Primary facility for owner demo
  const ownerBookings = bookings.filter((b) => b.groundId === ownerGround.id);
  const ownerSlots = slots.filter((s) => s.groundId === ownerGround.id);

  return {
    ground: ownerGround,
    slots: ownerSlots,
    allSlots: slots,
    bookings: ownerBookings,
    allBookings: bookings,
    toggleSlotAvailability,
    updateSlotPrice,
  };
}
