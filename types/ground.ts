export type PitchType = 'indoor_net' | 'turf_box' | 'matting';

export interface GroundSlot {
  id: string;
  groundId: string;
  startTime: string; // e.g., '18:00'
  endTime: string;   // e.g., '19:00'
  price: number;     // in PKR
  isAvailable: boolean;
  date?: string;     // 'YYYY-MM-DD'
  bookingType?: 'online' | 'manual';
  teamName?: string;
  managerPhone?: string;
  lockedUntil?: string;
}

export interface GroundAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface GroundReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Ground {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  address: string;
  city: 'Islamabad' | 'Rawalpindi';
  pitchType: PitchType;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  slotsCountAvailableToday: number;
  operatingHours: string;
  status: 'approved' | 'pending' | 'rejected';
}
