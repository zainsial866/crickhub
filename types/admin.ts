import { Ground } from './ground';
import { User } from './user';

export interface PlatformStats {
  totalUsers: number;
  activePlayers: number;
  totalGrounds: number;
  activeGrounds: number;
  totalBookings: number;
  bookingsThisWeek: number;
  totalRevenuePkr: number;
  revenueThisMonthPkr: number;
}

export interface GroundApprovalRequest {
  id: string;
  ground: Ground;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface DisputeTicket {
  id: string;
  ticketNumber: string;
  bookingId: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByRole: 'player' | 'ground_owner';
  groundName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}
