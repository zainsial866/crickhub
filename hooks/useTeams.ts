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

  const addMember = async (name: string, email: string) => {
    addMemberStore(name, email);
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
  };
}
