'use client';

import { useAppStore } from '@/lib/store';

export function useTeams() {
  const team = useAppStore((state) => state.team);
  const leaderboard = useAppStore((state) => state.leaderboard);
  const matches = useAppStore((state) => state.matches);
  const addMemberStore = useAppStore((state) => state.addMember);
  const removeMemberStore = useAppStore((state) => state.removeMember);
  const selectedMatchChallenge = useAppStore((state) => state.selectedMatchChallenge);
  const setSelectedMatchChallenge = useAppStore((state) => state.setSelectedMatchChallenge);
  const acceptChallenge = useAppStore((state) => state.acceptChallenge);
  const playerDirectory = useAppStore((state) => state.playerDirectory);
  const invitations = useAppStore((state) => state.invitations);
  const updateMemberPlayingRole = useAppStore((state) => state.updateMemberPlayingRole);
  const sendInvitation = useAppStore((state) => state.sendInvitation);
  const updateInvitation = useAppStore((state) => state.updateInvitation);
  const cancelInvitation = useAppStore((state) => state.cancelInvitation);
  const updateTeamSettings = useAppStore((state) => state.updateTeamSettings);
  const transferCaptaincy = useAppStore((state) => state.transferCaptaincy);
  const cricketMatches = useAppStore((state) => state.cricketMatches);
  const createCricketMatch = useAppStore((state) => state.createCricketMatch);
  const updateMatchStats = useAppStore((state) => state.updateMatchStats);
  const publicTeams = useAppStore((state) => state.publicTeams);
  const followedTeamIds = useAppStore((state) => state.followedTeamIds);
  const joinRequests = useAppStore((state) => state.joinRequests);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const toggleFollowTeam = useAppStore((state) => state.toggleFollowTeam);
  const requestToJoin = useAppStore((state) => state.requestToJoin);
  const sendChatMessage = useAppStore((state) => state.sendChatMessage);
  const myTeams = useAppStore((state) => state.myTeams);
  const selectedTeamId = useAppStore((state) => state.selectedTeamId);
  const memberships = useAppStore((state) => state.memberships);
  const setSelectedTeam = useAppStore((state) => state.setSelectedTeam);
  const updateMemberPermissions = useAppStore((state) => state.updateMemberPermissions);
  const leaveTeam = useAppStore((state) => state.leaveTeam);
  const createTeam = useAppStore((state) => state.createTeam);
  const setViceCaptain = useAppStore((state) => state.setViceCaptain);
  const deleteTeam = useAppStore((state) => state.deleteTeam);
  const regenerateInviteCode = useAppStore((state) => state.regenerateInviteCode);
  const submitJoinRequest = useAppStore((state) => state.submitJoinRequest);
  const approveJoinRequest = useAppStore((state) => state.approveJoinRequest);
  const rejectJoinRequest = useAppStore((state) => state.rejectJoinRequest);
  const dismissAlert = useAppStore((state) => state.dismissAlert);

  const approveCricketMatch = useAppStore((state) => state.approveCricketMatch);
  const rejectCricketMatch = useAppStore((state) => state.rejectCricketMatch);
  const startLiveMatch = useAppStore((state) => state.startLiveMatch);
  const saveMatchScorecard = useAppStore((state) => state.saveMatchScorecard);
  const finalizeMatch = useAppStore((state) => state.finalizeMatch);

  const completedMatches = cricketMatches.filter((match) => match.status === 'completed' && match.teamId === team.id);
  const derivedStats = {
    matches: completedMatches.length,
    wins: completedMatches.filter((match) => match.result === 'win').length,
    losses: completedMatches.filter((match) => match.result === 'loss').length,
    draws: completedMatches.filter((match) => match.result === 'draw').length,
    points: completedMatches.reduce((total, match) => total + (match.result === 'win' ? 2 : match.result === 'draw' ? 1 : 0), 0),
    runs: completedMatches.reduce((total, match) => total + (match.teamScore || match.playerStats.reduce((sum, stat) => sum + stat.runs, 0)), 0),
    wickets: completedMatches.reduce((total, match) => total + (match.opponentWickets || match.playerStats.reduce((sum, stat) => sum + stat.wickets, 0)), 0),
    catches: completedMatches.reduce((total, match) => total + match.playerStats.reduce((sum, stat) => sum + stat.catches, 0), 0),
  };

  const addMember = async (name: string, email: string, playingRole?: Parameters<typeof updateMemberPlayingRole>[1]) => {
    addMemberStore(name, email, playingRole);
  };

  const removeMember = async (memberId: string) => {
    removeMemberStore(memberId);
  };

  return {
    team,
    leaderboard,
    matches,
    addMember,
    removeMember,
    selectedMatchChallenge,
    setSelectedMatchChallenge,
    acceptChallenge,
    playerDirectory,
    invitations,
    updateMemberPlayingRole,
    sendInvitation,
    updateInvitation,
    cancelInvitation,
    updateTeamSettings,
    transferCaptaincy,
    cricketMatches,
    createCricketMatch,
    approveCricketMatch,
    rejectCricketMatch,
    startLiveMatch,
    saveMatchScorecard,
    finalizeMatch,
    updateMatchStats,
    derivedStats,
    publicTeams,
    followedTeamIds,
    joinRequests,
    chatMessages,
    toggleFollowTeam,
    requestToJoin,
    sendChatMessage,
    myTeams,
    selectedTeamId,
    memberships,
    setSelectedTeam,
    updateMemberPermissions,
    leaveTeam,
    createTeam,
    setViceCaptain,
    deleteTeam,
    regenerateInviteCode,
    submitJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    dismissAlert,
  };
}
