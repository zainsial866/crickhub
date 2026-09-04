export type TeamRole = 'captain' | 'vice_captain' | 'player';
export type PlayingRole = 'batter' | 'bowler' | 'all_rounder' | 'wicketkeeper';
export type InvitationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
export type InvitationDirection = 'incoming' | 'sent';
export type MatchStatus =
  | 'draft'
  | 'pending_approval'
  | 'scheduled'
  | 'confirmed'
  | 'live'
  | 'completed'
  | 'cancelled';
export type MatchType = 'friendly' | 'league' | 'tournament' | 'practice';
export type TeamPermission =
  | 'invite_players'
  | 'create_matches'
  | 'manage_matches'
  | 'manage_squad'
  | 'manage_stats'
  | 'approve_players'
  | 'remove_players'
  | 'manage_settings'
  | 'manage_permissions'
  | 'transfer_captaincy'
  | 'delete_team'
  | 'edit_matches'
  | 'cancel_matches'
  | 'edit_stats'
  | 'finalize_match'
  | 'chat'
  | 'announcements';

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export interface TeamAlert {
  id: string;
  type: 'match_today' | 'match_soon' | 'join_request' | 'unconfirmed_players' | 'match_approval' | 'match_completed' | 'new_player';
  severity: 'red' | 'yellow' | 'green';
  title: string;
  description: string;
  ctaLabel?: string;
  ctaAction?: string;
  timestamp: string;
}

export interface TeamChatMessage {
  id: string;
  teamId: string;
  matchId?: string;
  isAnnouncement?: boolean;
  senderName: string;
  message: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface TeamJoinRequest {
  id: string;
  teamId: string;
  teamName?: string;
  userId?: string;
  playerName: string;
  playerEmail: string;
  playingRole?: PlayingRole;
  status: JoinRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface TeamAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  role: TeamRole;
  playingRole: PlayingRole;
  permissions?: TeamPermission[];
  status?: 'active' | 'pending' | 'inactive';
  matchesPlayed: number;
  avatarUrl?: string;
  joinedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  captainName: string;
  viceCaptainId?: string;
  viceCaptainName?: string;
  inviteCode: string;
  badgeUrl?: string;
  logoEmoji?: string;
  followerCount?: number;
  city: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  members: TeamMember[];
  createdAt: string;
  description?: string;
  isPublic?: boolean;
  recentForm?: Array<'W' | 'L' | 'D'>;
  activity?: TeamActivity[];
  alerts?: TeamAlert[];
}

export interface TeamMembership {
  id: string;
  userId: string;
  teamId: string;
  teamRole: TeamRole;
  playingRole: PlayingRole;
  permissions: TeamPermission[];
  status: 'active' | 'pending' | 'inactive';
  joinedAt?: string;
}

export interface TeamActivity {
  id: string;
  message: string;
  createdAt: string;
  type: 'booking' | 'member' | 'match' | 'system';
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  playerName: string;
  playerEmail: string;
  direction: InvitationDirection;
  status: InvitationStatus;
  createdAt: string;
}

export interface PlayerDirectoryEntry {
  id: string;
  name: string;
  email: string;
  city: string;
  playingRole: PlayingRole;
  matchesPlayed: number;
  userId?: string;
  runs?: number;
  wickets?: number;
  catches?: number;
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

export interface PlayerMatchStats {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  overs: number;
  bowlingRuns: number;
  wickets: number;
  catches: number;
  runOuts: number;
  stumpings?: number;
  directHitRunOuts?: number;
}

export interface BattingScorecardEntry {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
  isNotOut: boolean;
  dotBalls?: number;
}

export interface BowlingScorecardEntry {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  dotBalls: number;
  wides: number;
  noBalls: number;
}

export interface FieldingScorecardEntry {
  playerId: string;
  playerName: string;
  catches: number;
  runOuts: number;
  directHitRunOuts?: number;
  stumpings: number;
  totalDismissals: number;
}

export interface MatchExtras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  total: number;
}

export interface BattingPartnership {
  id: string;
  player1Name: string;
  player2Name: string;
  runs: number;
  balls: number;
  runRate: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overs: string;
  playerName: string;
}

export interface MatchSummaryAwards {
  playerOfTheMatch?: string;
  topScorer?: { name: string; runs: number; balls: number };
  bestBowler?: { name: string; figures: string };
  bestFielder?: { name: string; dismissals: number };
  highestPartnership?: { pair: string; runs: number; balls: number };
}

export interface CricketMatch {
  id: string;
  teamId: string;
  teamName: string;
  opponentName: string;
  opponentTeamId?: string;
  groundName: string;
  groundId?: string;
  bookingId?: string;
  date: string;
  time: string;
  overs: number;
  format?: string;
  competitionName?: string;
  matchType: MatchType;
  status: MatchStatus;
  isOfficialLocked?: boolean;
  lockedAt?: string;
  lockedBy?: string;
  createdBy?: string;
  notes?: string;

  teamScore?: number;
  teamWickets?: number;
  teamOvers?: number;
  opponentScore?: number;
  opponentWickets?: number;
  opponentOvers?: number;
  result?: 'win' | 'loss' | 'draw';
  margin?: string;

  squad: string[];
  playingXI?: string[];
  bench?: string[];

  batting?: BattingScorecardEntry[];
  bowling?: BowlingScorecardEntry[];
  fielding?: FieldingScorecardEntry[];
  extras?: MatchExtras;
  partnerships?: BattingPartnership[];
  fallOfWickets?: FallOfWicket[];
  summaryAwards?: MatchSummaryAwards;

  playerStats: PlayerMatchStats[];
}
