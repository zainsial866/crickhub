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
  TeamInvitation,
  PlayerDirectoryEntry,
  PlayingRole,
  TeamPermission,
  CricketMatch,
  PlayerMatchStats,
  TeamChatMessage,
  TeamJoinRequest,
  TeamMembership,
  TeamMember,
  TeamActivity,
  TeamAlert,
  InvitationDirection,
  InvitationStatus,
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
  MOCK_CRICKET_MATCHES,
  MOCK_MY_TEAMS,
  MOCK_MEMBERSHIPS,
  MOCK_JOIN_REQUESTS,
} from './mockData';

const MOCK_PLAYER_DIRECTORY: PlayerDirectoryEntry[] = [
  { id: 'directory-1', name: 'Ahsan Rauf', email: 'ahsan@crickethub.pk', city: 'Islamabad', playingRole: 'batter', matchesPlayed: 11 },
  { id: 'directory-2', name: 'Haris Mahmood', email: 'haris@crickethub.pk', city: 'Rawalpindi', playingRole: 'all_rounder', matchesPlayed: 16 },
  { id: 'directory-3', name: 'Saad Qureshi', email: 'saad@crickethub.pk', city: 'Islamabad', playingRole: 'wicketkeeper', matchesPlayed: 8 },
  { id: 'directory-4', name: 'Owais Khan', email: 'owais@crickethub.pk', city: 'Rawalpindi', playingRole: 'bowler', matchesPlayed: 13 },
];

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
  bulkSetSlotAvailability: (slotIds: string[], isAvailable: boolean) => void;
  reserveSlotsManually: (slotIds: string[], teamName: string, managerPhone: string) => void;
  lockSlots: (slotIds: string[], durationMinutes?: number) => void;
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
    teamName?: string,
    slotIds?: string[]
  ) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;

  // Team
  team: Team;
  myTeams: Team[];
  memberships: TeamMembership[];
  selectedTeamId: string;
  leaderboard: LeaderboardEntry[];
  matches: MatchChallenge[];
  cricketMatches: CricketMatch[];
  publicTeams: Team[];
  followedTeamIds: string[];
  joinRequests: TeamJoinRequest[];
  chatMessages: TeamChatMessage[];
  playerDirectory: PlayerDirectoryEntry[];
  invitations: TeamInvitation[];
  createTeam: (name: string, city: string, description: string, playingRole: PlayingRole, isPublic: boolean) => Team;
  setSelectedTeam: (teamId: string) => void;
  updateTeamSettings: (updates: Partial<Pick<Team, 'name' | 'city' | 'description' | 'isPublic' | 'badgeUrl'>>) => void;
  addMember: (name: string, email: string, playingRole?: PlayingRole) => void;
  removeMember: (memberId: string) => void;
  updateMemberPlayingRole: (memberId: string, playingRole: PlayingRole) => void;
  updateMemberPermissions: (memberId: string, permissions: TeamPermission[]) => void;
  setViceCaptain: (memberId: string | null) => void;
  transferCaptaincy: (memberId: string) => void;
  leaveTeam: (memberId: string, replacementCaptainId?: string) => { success: boolean; error?: string };
  deleteTeam: (teamId: string) => void;
  regenerateInviteCode: (teamId: string) => string;
  submitJoinRequest: (inviteCodeOrTeamId: string, playingRole: PlayingRole, applicantName?: string, applicantEmail?: string) => { success: boolean; message: string };
  approveJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  dismissAlert: (alertId: string) => void;
  createCricketMatch: (match: Partial<CricketMatch>, requiresApproval?: boolean) => CricketMatch;
  approveCricketMatch: (matchId: string) => void;
  rejectCricketMatch: (matchId: string) => void;
  startLiveMatch: (matchId: string) => void;
  saveMatchScorecard: (matchId: string, scorecardData: Partial<CricketMatch>) => void;
  finalizeMatch: (matchId: string, finalData: Partial<CricketMatch>, finalizedBy?: string) => void;
  updateMatchStats: (matchId: string, stats: PlayerMatchStats[], result: CricketMatch['result'], teamScore: number, teamWickets: number, opponentScore: number, opponentWickets: number, margin: string) => void;
  toggleFollowTeam: (teamId: string) => void;
  requestToJoin: (teamId: string) => void;
  sendChatMessage: (teamId: string, message: string) => void;
  sendInvitation: (name: string, email: string, direction?: InvitationDirection) => void;
  updateInvitation: (id: string, status: InvitationStatus) => void;
  cancelInvitation: (id: string) => void;

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
            s.id === slotId
              ? { ...s, isAvailable: !s.isAvailable, bookingType: undefined, teamName: undefined, managerPhone: undefined }
              : s
          ),
        })),
      bulkSetSlotAvailability: (slotIds, isAvailable) =>
        set((state) => ({
          slots: state.slots.map((slot) =>
            slotIds.includes(slot.id)
              ? {
                  ...slot,
                  isAvailable,
                  bookingType: isAvailable ? undefined : slot.bookingType,
                  teamName: isAvailable ? undefined : slot.teamName,
                  managerPhone: isAvailable ? undefined : slot.managerPhone,
                  lockedUntil: isAvailable ? undefined : slot.lockedUntil,
                }
              : slot
          ),
        })),
      reserveSlotsManually: (slotIds, teamName, managerPhone) =>
        set((state) => ({
          slots: state.slots.map((slot) =>
            slotIds.includes(slot.id)
              ? { ...slot, isAvailable: false, bookingType: 'manual' as const, teamName, managerPhone, lockedUntil: undefined }
              : slot
          ),
        })),
      lockSlots: (slotIds, durationMinutes = 10) => {
        const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
        set((state) => ({
          slots: state.slots.map((slot) =>
            slotIds.includes(slot.id) ? { ...slot, isAvailable: false, bookingType: 'online' as const, lockedUntil } : slot
          ),
        }));
      },
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
        teamName,
        slotIds = []
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
          slotIds,
          createdAt: new Date().toISOString(),
        };

        const lockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          slots: state.slots.map((s) =>
            slotIds.includes(s.id)
              ? { ...s, isAvailable: false, bookingType: 'online' as const, lockedUntil }
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
      team: MOCK_MY_TEAMS[0],
      myTeams: MOCK_MY_TEAMS,
      memberships: MOCK_MEMBERSHIPS,
      selectedTeamId: 'team-1',
      leaderboard: MOCK_LEADERBOARD,
      matches: MOCK_MATCHES,
      cricketMatches: MOCK_CRICKET_MATCHES,
      publicTeams: [
        MOCK_MY_TEAMS[0],
        { ...MOCK_MY_TEAMS[1], id: 'team-2', name: 'Capital Kings' },
        { ...MOCK_MY_TEAMS[2], id: 'team-3', name: 'Rawalpindi Warriors' },
        { ...MOCK_TEAM, id: 'team-4', name: 'Rawalpindi Smashers', city: 'Rawalpindi', captainId: 'owner-1', captainName: 'Hamid Ali', inviteCode: 'RWP-SMASH', wins: 13, losses: 5, points: 26, members: MOCK_TEAM.members.slice(0, 5) },
        { ...MOCK_TEAM, id: 'team-5', name: 'Margalla Hawks', city: 'Islamabad', captainId: 'user-mh-1', captainName: 'Sami Khan', inviteCode: 'MARG-HAWK', wins: 11, losses: 6, points: 22, members: MOCK_TEAM.members.slice(0, 4) },
      ],
      followedTeamIds: [],
      joinRequests: MOCK_JOIN_REQUESTS,
      chatMessages: [
        { id: 'chat-1', teamId: 'team-1', senderName: 'Mueed Ahmad', message: 'Anyone available Saturday?', createdAt: '2026-09-03T10:00:00Z' },
        { id: 'chat-2', teamId: 'team-1', senderName: 'Shahmeer Khan', message: "I'm free.", createdAt: '2026-09-03T10:02:00Z' },
        { id: 'chat-3', teamId: 'team-1', senderName: 'System', message: 'Zain booked F-6 Box Arena for Saturday at 9:00 PM.', createdAt: '2026-09-03T10:05:00Z', isSystem: true },
      ],
      playerDirectory: MOCK_PLAYER_DIRECTORY,
      invitations: [
        { id: 'invite-1', teamId: 'team-1', teamName: 'Islamabad Strikers', playerName: 'Ahsan Rauf', playerEmail: 'ahsan@crickethub.pk', direction: 'sent', status: 'pending', createdAt: '2026-09-02T10:00:00Z' },
        { id: 'invite-2', teamId: 'team-2', teamName: 'Capital Kings', playerName: 'Zain Sial', playerEmail: 'zain@crickethub.pk', direction: 'incoming', status: 'pending', createdAt: '2026-09-01T15:00:00Z' },
      ],
      createTeam: (name, city, description, playingRole, isPublic) => {
        const newTeamId = `team-${Date.now()}`;
        const cleanPrefix = name.trim().replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'CRK';
        const inviteCode = `${cleanPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        const captainMember: TeamMember = {
          id: `mem-${Date.now()}`,
          userId: 'user-player-1',
          name: 'Zain Sial',
          email: 'zain@crickethub.pk',
          role: 'captain',
          playingRole,
          permissions: ['invite_players', 'create_matches', 'manage_squad', 'manage_stats', 'approve_players', 'remove_players', 'manage_settings', 'manage_permissions', 'transfer_captaincy', 'delete_team'],
          matchesPlayed: 0,
          status: 'active',
          joinedAt: new Date().toISOString(),
        };
        const newTeam: Team = {
          id: newTeamId,
          name,
          captainId: 'user-player-1',
          captainName: 'Zain Sial',
          inviteCode,
          city,
          description,
          isPublic,
          wins: 0,
          losses: 0,
          draws: 0,
          points: 0,
          recentForm: [],
          members: [captainMember],
          createdAt: new Date().toISOString(),
          activity: [{ id: `act-${Date.now()}`, message: `${name} was created by Zain Sial`, createdAt: new Date().toISOString(), type: 'system' }],
          alerts: [{ id: `alert-${Date.now()}`, type: 'new_player', severity: 'green', title: 'Welcome to your new team!', description: `Share invite code ${inviteCode} with teammates to start receiving join requests.`, timestamp: new Date().toISOString() }],
        };
        const newMembership: TeamMembership = {
          id: `memship-${Date.now()}`,
          userId: 'user-player-1',
          teamId: newTeamId,
          teamRole: 'captain',
          playingRole,
          permissions: captainMember.permissions || [],
          status: 'active',
          joinedAt: new Date().toISOString(),
        };
        set((state) => ({
          myTeams: [newTeam, ...state.myTeams],
          memberships: [newMembership, ...state.memberships],
          selectedTeamId: newTeamId,
          team: newTeam,
        }));
        return newTeam;
      },
      setSelectedTeam: (teamId) =>
        set((state) => {
          const nextTeam = state.myTeams.find((candidate) => candidate.id === teamId);
          return nextTeam ? { selectedTeamId: teamId, team: nextTeam } : state;
        }),
      updateTeamSettings: (updates) =>
        set((state) => {
          const updatedTeam = { ...state.team, ...updates };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { team: updatedTeam, myTeams: updatedMyTeams };
        }),
      addMember: (name, email, playingRole = 'all_rounder') =>
        set((state) => {
          const newMember: TeamMember = {
            id: `mem-${Date.now()}`,
            userId: `user-${Date.now()}`,
            name,
            email,
            role: 'player',
            playingRole,
            permissions: [],
            matchesPlayed: 0,
            status: 'active',
            joinedAt: new Date().toISOString(),
          };
          const updatedMembers = [...state.team.members, newMember];
          const updatedActivity: TeamActivity[] = [
            { id: `act-${Date.now()}`, message: `${name} joined the squad`, createdAt: new Date().toISOString(), type: 'member' },
            ...(state.team.activity || []),
          ];
          const updatedTeam = { ...state.team, members: updatedMembers, activity: updatedActivity };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { team: updatedTeam, myTeams: updatedMyTeams };
        }),
      removeMember: (memberId) =>
        set((state) => {
          const target = state.team.members.find((m) => m.id === memberId);
          if (!target || target.role === 'captain') return state;
          const updatedMembers = state.team.members.filter((m) => m.id !== memberId);
          const isVC = state.team.viceCaptainId === memberId;
          const updatedActivity: TeamActivity[] = [
            { id: `act-${Date.now()}`, message: `${target.name} left the squad`, createdAt: new Date().toISOString(), type: 'member' },
            ...(state.team.activity || []),
          ];
          const updatedTeam: Team = {
            ...state.team,
            members: updatedMembers,
            viceCaptainId: isVC ? undefined : state.team.viceCaptainId,
            viceCaptainName: isVC ? undefined : state.team.viceCaptainName,
            activity: updatedActivity,
          };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { team: updatedTeam, myTeams: updatedMyTeams };
        }),
      updateMemberPlayingRole: (memberId, playingRole) =>
        set((state) => {
          const updatedMembers = state.team.members.map((m) => (m.id === memberId ? { ...m, playingRole } : m));
          const updatedTeam = { ...state.team, members: updatedMembers };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          const member = state.team.members.find((m) => m.id === memberId);
          const updatedMemberships = state.memberships.map((m) =>
            m.teamId === state.team.id && (m.userId === member?.userId || member?.email === 'zain@crickethub.pk')
              ? { ...m, playingRole }
              : m
          );
          return { team: updatedTeam, myTeams: updatedMyTeams, memberships: updatedMemberships };
        }),
      updateMemberPermissions: (memberId, permissions) =>
        set((state) => {
          const updatedMembers = state.team.members.map((m) => (m.id === memberId ? { ...m, permissions } : m));
          const updatedTeam = { ...state.team, members: updatedMembers };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          const member = state.team.members.find((m) => m.id === memberId);
          const updatedMemberships = state.memberships.map((m) =>
            m.teamId === state.team.id && (m.userId === member?.userId || member?.email === 'zain@crickethub.pk')
              ? { ...m, permissions }
              : m
          );
          return { team: updatedTeam, myTeams: updatedMyTeams, memberships: updatedMemberships };
        }),
      setViceCaptain: (memberId) =>
        set((state) => {
          const target = memberId ? state.team.members.find((m) => m.id === memberId) : null;
          const updatedMembers = state.team.members.map((m) => {
            if (m.id === memberId) {
              return { ...m, role: 'vice_captain' as const, permissions: (m.permissions || []).length ? m.permissions : ['invite_players', 'create_matches', 'manage_squad', 'manage_stats', 'approve_players', 'remove_players', 'manage_settings'] as TeamPermission[] };
            }
            if (m.role === 'vice_captain' && m.id !== memberId) return { ...m, role: 'player' as const };
            return m;
          });
          const updatedTeam: Team = { ...state.team, members: updatedMembers, viceCaptainId: target ? target.id : undefined, viceCaptainName: target ? target.name : undefined };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { team: updatedTeam, myTeams: updatedMyTeams };
        }),
      transferCaptaincy: (memberId) =>
        set((state) => {
          const nextCaptain = state.team.members.find((m) => m.id === memberId);
          if (!nextCaptain) return state;
          const fullPermissions: TeamPermission[] = ['invite_players', 'create_matches', 'manage_squad', 'manage_stats', 'approve_players', 'remove_players', 'manage_settings', 'manage_permissions', 'transfer_captaincy', 'delete_team'];
          const updatedMembers = state.team.members.map((m) => {
            if (m.id === memberId) return { ...m, role: 'captain' as const, permissions: fullPermissions };
            if (m.role === 'captain') return { ...m, role: 'player' as const, permissions: ['invite_players', 'create_matches', 'manage_squad', 'manage_stats'] as TeamPermission[] };
            return m;
          });
          const updatedTeam: Team = { ...state.team, captainId: memberId, captainName: nextCaptain.name, members: updatedMembers, activity: [{ id: `act-${Date.now()}`, message: `Captaincy transferred to ${nextCaptain.name}`, createdAt: new Date().toISOString(), type: 'member' }, ...(state.team.activity || [])] };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          const currentUserMember = state.team.members.find((m) => m.userId === 'user-player-1' || m.email === 'zain@crickethub.pk');
          const updatedMemberships = state.memberships.map((m) => {
            if (m.teamId === state.team.id) {
              const isNowCaptain = nextCaptain.userId === 'user-player-1' || nextCaptain.id === currentUserMember?.id;
              return { ...m, teamRole: isNowCaptain ? ('captain' as const) : ('player' as const), permissions: isNowCaptain ? fullPermissions : (['invite_players', 'create_matches', 'manage_squad', 'manage_stats'] as TeamPermission[]) };
            }
            return m;
          });
          return { team: updatedTeam, myTeams: updatedMyTeams, memberships: updatedMemberships };
        }),
      leaveTeam: (memberId, replacementCaptainId) => {
        let result: { success: boolean; error?: string } = { success: false, error: '' };
        set((state) => {
          const activeTeam = state.team;
          const isCaptain = activeTeam.captainId === memberId || activeTeam.captainName === 'Zain Sial';
          if (isCaptain && !replacementCaptainId) {
            result = { success: false, error: 'A captain cannot leave without transferring captaincy to another member.' };
            return state;
          }
          const remainingTeams = state.myTeams.filter((t) => t.id !== activeTeam.id);
          const remainingMemberships = state.memberships.filter((m) => m.teamId !== activeTeam.id);
          const nextTeam = remainingTeams[0] || state.myTeams[0];
          result = { success: true };
          return { myTeams: remainingTeams, memberships: remainingMemberships, selectedTeamId: nextTeam ? nextTeam.id : state.selectedTeamId, team: nextTeam || state.team };
        });
        return result;
      },
      deleteTeam: (teamId) =>
        set((state) => {
          const remainingTeams = state.myTeams.filter((t) => t.id !== teamId);
          const nextTeam = remainingTeams[0] || state.team;
          return { myTeams: remainingTeams, memberships: state.memberships.filter((m) => m.teamId !== teamId), joinRequests: state.joinRequests.filter((r) => r.teamId !== teamId), selectedTeamId: nextTeam ? nextTeam.id : '', team: nextTeam || state.team };
        }),
      regenerateInviteCode: (teamId) => {
        let newCode = '';
        set((state) => {
          const target = state.myTeams.find((item) => item.id === teamId) || state.team;
          const cleanPrefix = target.name.trim().replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'CRK';
          newCode = `${cleanPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
          const updatedTeam = { ...target, inviteCode: newCode };
          const updatedMyTeams = state.myTeams.map((item) => (item.id === teamId ? updatedTeam : item));
          return { team: state.team.id === teamId ? updatedTeam : state.team, myTeams: updatedMyTeams };
        });
        return newCode;
      },
      submitJoinRequest: (inviteCodeOrTeamId, playingRole, applicantName = 'Zain Sial', applicantEmail = 'zain@crickethub.pk') => {
        const code = inviteCodeOrTeamId.trim().toUpperCase();
        const allKnown = [...get().myTeams, ...get().publicTeams];
        const targetTeam = allKnown.find((t) => t.inviteCode.toUpperCase() === code || t.id === inviteCodeOrTeamId);
        if (!targetTeam) return { success: false, message: 'Team not found.' };
        if (targetTeam.members.some((m) => m.email.toLowerCase() === applicantEmail.toLowerCase())) return { success: false, message: 'Already a member.' };
        const newRequest: TeamJoinRequest = { id: `join-${Date.now()}`, teamId: targetTeam.id, teamName: targetTeam.name, userId: 'user-player-1', playerName: applicantName, playerEmail: applicantEmail, playingRole, status: 'pending', createdAt: new Date().toISOString() };
        set((state) => ({ joinRequests: [newRequest, ...state.joinRequests] }));
        return { success: true, message: `Request submitted to join ${targetTeam.name}!` };
      },
      approveJoinRequest: (requestId) =>
        set((state) => {
          const req = state.joinRequests.find((r) => r.id === requestId);
          if (!req) return state;
          const newMember: TeamMember = { id: `mem-${Date.now()}`, userId: req.userId || `user-${Date.now()}`, name: req.playerName, email: req.playerEmail, role: 'player', playingRole: req.playingRole || 'all_rounder', permissions: [], matchesPlayed: 0, status: 'active', joinedAt: new Date().toISOString() };
          const updatedRequests = state.joinRequests.map((r) => r.id === requestId ? { ...r, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'Captain' } : r);
          const updateTeamMembers = (team: Team): Team => team.id !== req.teamId ? team : { ...team, members: [...team.members, newMember], activity: [{ id: `act-${Date.now()}`, message: `${req.playerName} joined the squad`, createdAt: new Date().toISOString(), type: 'member' }, ...(team.activity || [])] };
          return { joinRequests: updatedRequests, myTeams: state.myTeams.map(updateTeamMembers), team: state.team.id === req.teamId ? updateTeamMembers(state.team) : state.team };
        }),
      rejectJoinRequest: (requestId) =>
        set((state) => ({ joinRequests: state.joinRequests.map((r) => r.id === requestId ? { ...r, status: 'rejected' as const, reviewedAt: new Date().toISOString() } : r) })),
      dismissAlert: (alertId) =>
        set((state) => {
          const updatedTeam = { ...state.team, alerts: (state.team.alerts || []).filter((a) => a.id !== alertId) };
          return { team: updatedTeam, myTeams: state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t)) };
        }),
      sendInvitation: (name, email, direction = 'sent') =>
        set((state) => ({ invitations: [{ id: `invite-${Date.now()}`, teamId: state.team.id, teamName: state.team.name, playerName: name, playerEmail: email, direction, status: 'pending', createdAt: new Date().toISOString() }, ...state.invitations] })),
      updateInvitation: (id, status) =>
        set((state) => ({ invitations: state.invitations.map((inv) => inv.id === id ? { ...inv, status } : inv) })),
      cancelInvitation: (id) =>
        set((state) => ({ invitations: state.invitations.filter((inv) => inv.id !== id) })),
      createCricketMatch: (match, requiresApproval = false) => {
        const id = `cricket-match-${Date.now()}`;
        const newStatus = requiresApproval ? ('pending_approval' as const) : (match.status || 'scheduled');
        const newMatch: CricketMatch = {
          id,
          teamId: match.teamId || get().team.id,
          teamName: match.teamName || get().team.name,
          opponentName: match.opponentName || 'Challenger',
          opponentTeamId: match.opponentTeamId,
          groundName: match.groundName || 'F-6 Box Arena',
          groundId: match.groundId,
          bookingId: match.bookingId,
          date: match.date || new Date().toISOString().split('T')[0],
          time: match.time || '9:00 PM',
          overs: match.overs || 10,
          format: match.format || `${match.overs || 10} overs`,
          matchType: match.matchType || 'friendly',
          competitionName: match.competitionName,
          status: newStatus,
          notes: match.notes,
          squad: match.squad || get().team.members.map((m) => m.id),
          playingXI: match.playingXI || match.squad || [],
          bench: match.bench || [],
          playerStats: match.playerStats || [],
          batting: match.batting || [],
          bowling: match.bowling || [],
          fielding: match.fielding || [],
          extras: match.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
          partnerships: match.partnerships || [],
          fallOfWickets: match.fallOfWickets || [],
        };

        const alertToAdd = requiresApproval
          ? {
              id: `alert-match-${id}`,
              type: 'match_approval' as const,
              severity: 'yellow' as const,
              title: `Match vs ${newMatch.opponentName} needs approval`,
              description: `Proposed by squad member for ${newMatch.date} at ${newMatch.groundName}.`,
              ctaLabel: 'Review Match',
              ctaAction: `view_match_${id}`,
              timestamp: new Date().toISOString(),
            }
          : null;

        set((state) => {
          const updatedMatches = [newMatch, ...state.cricketMatches];
          const updatedAlerts = alertToAdd ? [alertToAdd, ...(state.team.alerts || [])] : (state.team.alerts || []);
          const updatedTeam = { ...state.team, alerts: updatedAlerts };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { cricketMatches: updatedMatches, team: updatedTeam, myTeams: updatedMyTeams };
        });

        return newMatch;
      },
      approveCricketMatch: (matchId) =>
        set((state) => {
          const target = state.cricketMatches.find((m) => m.id === matchId);
          if (!target) return state;
          const updatedMatches = state.cricketMatches.map((m) =>
            m.id === matchId ? { ...m, status: 'scheduled' as const } : m
          );
          const updatedAlerts = (state.team.alerts || []).filter((a) => a.id !== `alert-match-${matchId}`);
          const updatedActivity: TeamActivity[] = [
            { id: `act-${Date.now()}`, message: `Fixture vs ${target.opponentName} approved and scheduled`, createdAt: new Date().toISOString(), type: 'match' },
            ...(state.team.activity || []),
          ];
          const updatedTeam = { ...state.team, alerts: updatedAlerts, activity: updatedActivity };
          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          return { cricketMatches: updatedMatches, team: updatedTeam, myTeams: updatedMyTeams };
        }),
      rejectCricketMatch: (matchId) =>
        set((state) => ({
          cricketMatches: state.cricketMatches.map((m) =>
            m.id === matchId ? { ...m, status: 'cancelled' as const } : m
          ),
          team: {
            ...state.team,
            alerts: (state.team.alerts || []).filter((a) => a.id !== `alert-match-${matchId}`),
          },
        })),
      startLiveMatch: (matchId) =>
        set((state) => ({
          cricketMatches: state.cricketMatches.map((m) =>
            m.id === matchId ? { ...m, status: 'live' as const } : m
          ),
        })),
      saveMatchScorecard: (matchId, scorecardData) =>
        set((state) => ({
          cricketMatches: state.cricketMatches.map((m) => {
            if (m.id !== matchId) return m;
            if (m.isOfficialLocked) return m;
            return {
              ...m,
              ...scorecardData,
              playerStats: scorecardData.playerStats || m.playerStats,
            };
          }),
        })),
      finalizeMatch: (matchId, finalData, finalizedBy = 'Captain') =>
        set((state) => {
          const existing = state.cricketMatches.find((m) => m.id === matchId);
          if (!existing || existing.isOfficialLocked) return state;

          const updatedMatch: CricketMatch = {
            ...existing,
            ...finalData,
            status: 'completed',
            isOfficialLocked: true,
            lockedAt: new Date().toISOString(),
            lockedBy: finalizedBy,
          };

          const isTeamWin = updatedMatch.result === 'win';
          const isDraw = updatedMatch.result === 'draw';
          const newFormResult = isTeamWin ? 'W' : isDraw ? 'D' : 'L';
          const currentForm = state.team.recentForm || [];
          const updatedForm = [newFormResult, ...currentForm].slice(0, 5) as Array<'W' | 'L' | 'D'>;

          const newWins = state.team.wins + (isTeamWin ? 1 : 0);
          const newLosses = state.team.losses + (!isTeamWin && !isDraw ? 1 : 0);
          const newDraws = state.team.draws + (isDraw ? 1 : 0);
          const newPoints = state.team.points + (isTeamWin ? 2 : isDraw ? 1 : 0);

          const updatedAlert: TeamAlert = {
            id: `alert-completed-${matchId}`,
            type: 'match_completed',
            severity: isTeamWin ? 'green' : 'yellow',
            title: `Match Finalized: vs ${updatedMatch.opponentName}`,
            description: `${isTeamWin ? 'Victory!' : isDraw ? 'Drawn fixture.' : 'Match finished.'} ${updatedMatch.teamScore}/${updatedMatch.teamWickets} vs ${updatedMatch.opponentScore}/${updatedMatch.opponentWickets}. Official record locked.`,
            ctaLabel: 'View Scorecard',
            ctaAction: `view_match_${matchId}`,
            timestamp: new Date().toISOString(),
          };

          const updatedActivity: TeamActivity[] = [
            {
              id: `act-${Date.now()}`,
              message: `Official scorecard finalized vs ${updatedMatch.opponentName} (${updatedMatch.result?.toUpperCase()})`,
              createdAt: new Date().toISOString(),
              type: 'match',
            },
            ...(state.team.activity || []),
          ];

          const updatedTeam: Team = {
            ...state.team,
            wins: newWins,
            losses: newLosses,
            draws: newDraws,
            points: newPoints,
            recentForm: updatedForm,
            activity: updatedActivity,
            alerts: [updatedAlert, ...(state.team.alerts || [])],
          };

          const updatedMyTeams = state.myTeams.map((t) => (t.id === state.team.id ? updatedTeam : t));
          const updatedMatches = state.cricketMatches.map((m) => (m.id === matchId ? updatedMatch : m));

          return {
            cricketMatches: updatedMatches,
            team: updatedTeam,
            myTeams: updatedMyTeams,
          };
        }),
      updateMatchStats: (matchId, stats, result, teamScore, teamWickets, opponentScore, opponentWickets, margin) =>
        set((state) => ({
          cricketMatches: state.cricketMatches.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  status: 'completed',
                  playerStats: stats,
                  result,
                  teamScore,
                  teamWickets,
                  opponentScore,
                  opponentWickets,
                  margin,
                }
              : m
          ),
        })),
      toggleFollowTeam: (teamId) =>
        set((state) => ({ followedTeamIds: state.followedTeamIds.includes(teamId) ? state.followedTeamIds.filter((id) => id !== teamId) : [...state.followedTeamIds, teamId] })),
      requestToJoin: (teamId) =>
        set((state) => state.joinRequests.some((r) => r.teamId === teamId && r.status === 'pending') ? state : ({ joinRequests: [{ id: `join-${Date.now()}`, teamId, playerName: 'Zain Sial', playerEmail: 'zain@crickethub.pk', status: 'pending', createdAt: new Date().toISOString() }, ...state.joinRequests] })),
      sendChatMessage: (teamId, message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, { id: `chat-${Date.now()}`, teamId, senderName: 'Zain Sial', message, createdAt: new Date().toISOString() }] })),

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
        cricketMatches: state.cricketMatches,
        myTeams: state.myTeams,
        memberships: state.memberships,
        selectedTeamId: state.selectedTeamId,
        followedTeamIds: state.followedTeamIds,
        joinRequests: state.joinRequests,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
