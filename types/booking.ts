import { Ground } from './ground';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash_on_ground' | 'easypaisa' | 'jazzcash' | 'credit_card';

export interface Booking {
  id: string;
  referenceCode: string;
  userId: string;
  userName: string;
  userPhone: string;
  groundId: string;
  groundName: string;
  groundLocation: string;
  groundImageUrl?: string;
  slotTime: string;       // e.g. "08:00 PM - 09:00 PM"
  date: string;           // "2026-09-05"
  totalPrice: number;     // in PKR
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  teamId?: string;
  teamName?: string;
  createdAt: string;
}
