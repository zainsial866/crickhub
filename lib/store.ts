'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Ground,
  GroundSlot,
  Booking,
  Team,
  LeaderboardEntry,
  MatchChallenge,
  PlatformStats,
  DisputeTicket,
  PaymentMethod,
} from '@/types';
import {
  MOCK_GROUNDS,
  MOCK_SLOTS,
  MOCK_BOOKINGS,
  MOCK_TEAM,
  MOCK_LEADERBOARD,
  MOCK_MATCHES,
  MOCK_PLATFORM_STATS,
  MOCK_DISPUTES,
} from './mockData';

interface AppStore {
  // Grounds
  grounds: Ground[];
  selectedCity: string;
  selectedPitchType: string;
  searchQuery: string;
  setSelectedCity: (city: string) => void;
  setSelectedPitchType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  approveGround: (id: string) => void;
  rejectGround: (id: string) => void;

  // Slots
  slots: GroundSlot[];
  toggleSlotAvailability: (slotId: string) => void;
  updateSlotPrice: (slotId: string, price: number) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (
    groundId: string,
    groundName: string,
    groundLocation: string,
    slotTime: string,
    date: string,
    totalPrice: number,
    paymentMethod: PaymentMethod,
    teamName?: string
  ) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;

  // Team
  team: Team;
  leaderboard: LeaderboardEntry[];
  matches: MatchChallenge[];
  addMember: (name: string, email: string) => void;
  removeMember: (memberId: string) => void;

  // Admin & Disputes
  stats: PlatformStats;
  disputes: DisputeTicket[];
  resolveDispute: (id: string) => void;

  // Challenge modal state
  selectedMatchChallenge: MatchChallenge | null;
  setSelectedMatchChallenge: (match: MatchChallenge | null) => void;
  acceptChallenge: (matchId: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Grounds
      grounds: MOCK_GROUNDS,
      selectedCity: 'all',
      selectedPitchType: 'all',
      searchQuery: '',
      setSelectedCity: (selectedCity) => set({ selectedCity }),
      setSelectedPitchType: (selectedPitchType) => set({ selectedPitchType }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      approveGround: (id) =>
        set((state) => ({
          grounds: state.grounds.map((g) =>
            g.id === id ? { ...g, status: 'approved' as const } : g
          ),
        })),
      rejectGround: (id) =>
        set((state) => ({
          grounds: state.grounds.map((g) =>
            g.id === id ? { ...g, status: 'rejected' as const } : g
          ),
        })),

      // Slots
      slots: MOCK_SLOTS,
      toggleSlotAvailability: (slotId) =>
        set((state) => ({
          slots: state.slots.map((s) =>
            s.id === slotId ? { ...s, isAvailable: !s.isAvailable } : s
          ),
        })),
      updateSlotPrice: (slotId, price) =>
        set((state) => ({
          slots: state.slots.map((s) =>
            s.id === slotId ? { ...s, price } : s
          ),
        })),

      // Bookings
      bookings: MOCK_BOOKINGS,
      createBooking: async (
        groundId,
        groundName,
        groundLocation,
        slotTime,
        date,
        totalPrice,
        paymentMethod,
        teamName
      ) => {
        // Simulate small network delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        const newBooking: Booking = {
          id: `book-${Date.now()}`,
          referenceCode: `CRICK-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: 'user-player-1',
          userName: 'Zain Sial',
          userPhone: '0300-1234567',
          groundId,
          groundName,
          groundLocation,
          slotTime,
          date,
          totalPrice,
          status: 'confirmed',
          paymentMethod,
          paymentStatus: paymentMethod === 'cash_on_ground' ? 'unpaid' : 'paid',
          teamName: teamName || 'Islamabad Strikers',
          createdAt: new Date().toISOString(),
        };

        // Mark the slot as booked
        const [startTime] = slotTime.split(' - ');
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          slots: state.slots.map((s) =>
            s.groundId === groundId && s.startTime.startsWith(startTime.slice(0, 2))
              ? { ...s, isAvailable: false }
              : s
          ),
        }));

        return newBooking;
      },
      cancelBooking: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' as const } : b
          ),
        }));
      },

      // Team
      team: MOCK_TEAM,
      leaderboard: MOCK_LEADERBOARD,
      matches: MOCK_MATCHES,
      addMember: (name, email) =>
        set((state) => ({
          team: {
            ...state.team,
            members: [
              ...state.team.members,
              {
                id: `mem-${Date.now()}`,
                name,
                email,
                role: 'player',
                matchesPlayed: 0,
              },
            ],
          },
        })),
      removeMember: (memberId) =>
        set((state) => ({
          team: {
            ...state.team,
            members: state.team.members.filter((m) => m.id !== memberId),
          },
        })),

      // Admin & Disputes
      stats: MOCK_PLATFORM_STATS,
      disputes: MOCK_DISPUTES,
      resolveDispute: (id) =>
        set((state) => ({
          disputes: state.disputes.map((d) =>
            d.id === id ? { ...d, status: 'resolved' as const } : d
          ),
        })),

      // Match Challenge
      selectedMatchChallenge: null,
      setSelectedMatchChallenge: (match) =>
        set({ selectedMatchChallenge: match }),
      acceptChallenge: (matchId) =>
        set((state) => ({
          matches: state.matches.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  team2Name: state.team.name,
                  spotsLeft: Math.max(0, m.spotsLeft - 1),
                }
              : m
          ),
          selectedMatchChallenge: null,
        })),
    }),
    {
      name: 'crickethub_app_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        slots: state.slots,
        grounds: state.grounds,
        team: state.team,
        disputes: state.disputes,
        matches: state.matches,
      }),
    }
  )
);
