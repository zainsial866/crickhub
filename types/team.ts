export type TeamRole = 'captain' | 'vice_captain' | 'player';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: TeamRole;
  matchesPlayed: number;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  captainName: string;
  inviteCode: string;
  badgeUrl?: string;
  city: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  members: TeamMember[];
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  won: number;
  lost: number;
  points: number;
  netRunRate?: string;
}

export interface MatchChallenge {
  id: string;
  team1Id: string;
  team1Name: string;
  team2Id?: string;
  team2Name?: string;
  groundName: string;
  matchDate: string;
  slotTime: string;
  overs: number;
  spotsLeft: number;
  entryFee: number;
}
