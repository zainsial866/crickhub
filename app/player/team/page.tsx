'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MessageSquare,
  BarChart3,
  Users,
  LayoutDashboard,
  Settings,
  Swords,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { TeamRole, PlayingRole, TeamPermission } from '@/types';
import { TeamHeaderSelector } from '@/components/team/TeamHeaderSelector';
import { TeamOverviewTab } from '@/components/team/TeamOverviewTab';
import { TeamSquadTab } from '@/components/team/TeamSquadTab';
import { TeamSettingsTab } from '@/components/team/TeamSettingsTab';
import { CreateTeamModal } from '@/components/team/CreateTeamModal';
import { JoinTeamModal } from '@/components/team/JoinTeamModal';
import { InvitePlayersModal } from '@/components/team/InvitePlayersModal';
import { JoinRequestsModal } from '@/components/team/JoinRequestsModal';
import { cn } from '@/lib/utils';

type ActiveTab = 'overview' | 'squad' | 'settings';

export default function TeamPage() {
  const {
    team,
    myTeams,
    memberships,
    selectedTeamId,
    setSelectedTeam,
    createTeam,
    updateTeamSettings,
    addMember,
    removeMember,
    updateMemberPlayingRole,
    updateMemberPermissions,
    setViceCaptain,
    transferCaptaincy,
    leaveTeam,
    deleteTeam,
    regenerateInviteCode,
    submitJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    dismissAlert,
    publicTeams,
    joinRequests,
    derivedStats,
    playerDirectory,
    sendInvitation,
    cricketMatches,
    matches,
  } = useTeams();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  // Derive current user membership and role in active team
  const currentMembership = useMemo(() => {
    return memberships.find(
      (m) => m.teamId === team.id && (m.userId === 'user-player-1' || m.userId === team.captainId)
    );
  }, [memberships, team.id, team.captainId]);

  const currentUserRole: TeamRole = useMemo(() => {
    if (currentMembership?.teamRole) return currentMembership.teamRole;
    if (team.captainId === 'user-player-1' || team.captainName === 'Zain Sial') return 'captain';
    const memberInTeam = team.members.find(
      (m) => m.userId === 'user-player-1' || m.email === 'zain@crickethub.pk'
    );
    return memberInTeam?.role || 'player';
  }, [currentMembership, team]);

  const userPermissions: TeamPermission[] = useMemo(() => {
    if (currentUserRole === 'captain') {
      return [
        'invite_players',
        'create_matches',
        'manage_squad',
        'manage_stats',
        'approve_players',
        'remove_players',
        'manage_settings',
        'manage_permissions',
        'transfer_captaincy',
        'delete_team',
      ];
    }
    return currentMembership?.permissions || [];
  }, [currentMembership, currentUserRole]);

  const canApprove =
    currentUserRole === 'captain' ||
    currentUserRole === 'vice_captain' ||
    userPermissions.includes('approve_players');

  // Filter requests belonging to this team
  const teamJoinRequests = useMemo(() => {
    return joinRequests.filter((r) => r.teamId === team.id);
  }, [joinRequests, team.id]);

  const pendingRequests = useMemo(() => {
    return teamJoinRequests.filter((r) => r.status === 'pending');
  }, [teamJoinRequests]);

  const completedMatches = useMemo(() => {
    return cricketMatches.filter((m) => m.status === 'completed' && m.teamId === team.id);
  }, [cricketMatches, team.id]);

  const nextMatch = useMemo(() => {
    return (
      cricketMatches.find((m) => m.status === 'scheduled' && m.teamId === team.id) ||
      matches.find((m) => m.team1Id === team.id) ||
      matches[0]
    );
  }, [cricketMatches, matches, team.id]);

  const currentMemberEmails = useMemo(() => {
    return team.members.map((m) => m.email.toLowerCase());
  }, [team.members]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. TOP HEADER & TEAM SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-5">
        <TeamHeaderSelector
          selectedTeam={team}
          myTeams={myTeams}
          memberships={memberships}
          currentUserId="user-player-1"
          onSelectTeam={setSelectedTeam}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
        />

        {/* Quick Pending Requests Alert Trigger */}
        {pendingRequests.length > 0 && canApprove && (
          <button
            type="button"
            onClick={() => setIsRequestsModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{pendingRequests.length} Join Request{pendingRequests.length > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* 2. TEAM TABS BAR */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" aria-label="Team Tabs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 shrink-0',
            activeTab === 'overview'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)]'
          )}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('squad')}
          className={cn(
            'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 shrink-0',
            activeTab === 'squad'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)]'
          )}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Squad ({team.members.length})</span>
        </button>

        {/* Links to Piece 2+ routes */}
        <Link
          href={`/player/team/${team.id}/matches`}
          className="px-4 py-2 rounded-2xl text-xs font-bold tracking-tight text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5 shrink-0"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Matches</span>
        </Link>

        <Link
          href={`/player/team/${team.id}/stats`}
          className="px-4 py-2 rounded-2xl text-xs font-bold tracking-tight text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5 shrink-0"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Stats</span>
        </Link>

        <Link
          href={`/player/team/${team.id}/chat`}
          className="px-4 py-2 rounded-2xl text-xs font-bold tracking-tight text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5 shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </Link>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={cn(
            'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0',
            activeTab === 'settings'
              ? 'bg-[var(--primary)] text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)]'
          )}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </nav>

      {/* 3. ACTIVE TAB VIEW */}
      {activeTab === 'overview' && (
        <TeamOverviewTab
          team={team}
          derivedStats={derivedStats}
          pendingRequests={pendingRequests}
          nextMatch={nextMatch}
          completedMatches={completedMatches}
          canApprove={canApprove}
          onOpenJoinRequests={() => setIsRequestsModalOpen(true)}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onDismissAlert={dismissAlert}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'squad' && (
        <TeamSquadTab
          members={team.members}
          currentUserId="user-player-1"
          currentUserRole={currentUserRole}
          userPermissions={userPermissions}
          onUpdatePlayingRole={updateMemberPlayingRole}
          onUpdatePermissions={updateMemberPermissions}
          onSetViceCaptain={setViceCaptain}
          onRemoveMember={removeMember}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />
      )}

      {activeTab === 'settings' && (
        <TeamSettingsTab
          team={team}
          currentUserRole={currentUserRole}
          currentUserId="user-player-1"
          onUpdateSettings={updateTeamSettings}
          onTransferCaptaincy={transferCaptaincy}
          onSetViceCaptain={setViceCaptain}
          onRegenerateCode={regenerateInviteCode}
          onLeaveTeam={leaveTeam}
          onDeleteTeam={deleteTeam}
          onOpenJoinRequests={() => setIsRequestsModalOpen(true)}
        />
      )}

      {/* 4. MODALS */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={createTeam}
      />

      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        publicTeams={publicTeams}
        myTeams={myTeams}
        onSubmitJoinRequest={submitJoinRequest}
      />

      <InvitePlayersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        teamName={team.name}
        inviteCode={team.inviteCode}
        playerDirectory={playerDirectory}
        currentMemberEmails={currentMemberEmails}
        onAddMember={addMember}
        onSendInvitation={sendInvitation}
      />

      <JoinRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        teamName={team.name}
        joinRequests={teamJoinRequests}
        canApprove={canApprove}
        onApprove={approveJoinRequest}
        onReject={rejectJoinRequest}
      />
    </div>
  );
}
