'use client';

import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  User,
  Shield,
  Trash2,
  Settings2,
  Check,
  X,
  UserPlus,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TeamMember, TeamRole, PlayingRole, TeamPermission } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { cn } from '@/lib/utils';

interface TeamSquadTabProps {
  members: TeamMember[];
  currentUserId?: string;
  currentUserRole?: TeamRole;
  userPermissions?: TeamPermission[];
  onUpdatePlayingRole: (memberId: string, role: PlayingRole) => void;
  onUpdatePermissions: (memberId: string, permissions: TeamPermission[]) => void;
  onSetViceCaptain: (memberId: string | null) => void;
  onRemoveMember: (memberId: string) => void;
  onOpenInviteModal: () => void;
}

const PLAYING_ROLE_CONFIG: Record<
  PlayingRole,
  { label: string; icon: string; color: string }
> = {
  batter: { label: 'Batter', icon: '🏏', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  bowler: { label: 'Bowler', icon: '🎯', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  all_rounder: { label: 'All-Rounder', icon: '⚡', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  wicketkeeper: { label: 'Wicketkeeper', icon: '🧤', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
};

const ALL_PERMISSION_DEFINITIONS: {
  id: TeamPermission;
  label: string;
  description: string;
  captainOnly?: boolean;
}[] = [
  { id: 'invite_players', label: 'Invite players', description: 'Search user directory and send invitations' },
  { id: 'create_matches', label: 'Create matches', description: 'Schedule new friendly or league match fixtures' },
  { id: 'manage_squad', label: 'Manage match squad', description: 'Select playing lineup for scheduled games' },
  { id: 'manage_stats', label: 'Enter match stats', description: 'Input scores, runs, and bowling wickets' },
  { id: 'approve_players', label: 'Approve players', description: 'Approve or reject incoming join requests' },
  { id: 'remove_players', label: 'Remove players', description: 'Remove regular players from the roster' },
  { id: 'manage_settings', label: 'Manage settings', description: 'Modify team description, profile, and visibility' },
  { id: 'manage_permissions', label: 'Manage permissions', description: 'Assign custom permissions to squad members' },
  { id: 'transfer_captaincy', label: 'Transfer captaincy', description: 'Designate a new team Captain', captainOnly: true },
  { id: 'delete_team', label: 'Delete team', description: 'Permanently remove the team and roster', captainOnly: true },
];

export function TeamSquadTab({
  members,
  currentUserId = 'user-player-1',
  currentUserRole = 'captain',
  userPermissions = [],
  onUpdatePlayingRole,
  onUpdatePermissions,
  onSetViceCaptain,
  onRemoveMember,
  onOpenInviteModal,
}: TeamSquadTabProps) {
  const [filterRole, setFilterRole] = useState<'all' | PlayingRole>('all');
  const [editingPermissionsMember, setEditingPermissionsMember] = useState<TeamMember | null>(null);
  const [tempPermissions, setTempPermissions] = useState<TeamPermission[]>([]);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const isCaptain = currentUserRole === 'captain';
  const isViceCaptain = currentUserRole === 'vice_captain';
  const canManageSquad = isCaptain || isViceCaptain || userPermissions.includes('manage_squad');
  const canInvite = isCaptain || isViceCaptain || userPermissions.includes('invite_players');
  const canEditPermissions = isCaptain || userPermissions.includes('manage_permissions');
  const canRemove = isCaptain || isViceCaptain || userPermissions.includes('remove_players');

  const filteredMembers = members.filter((m) => {
    if (filterRole === 'all') return true;
    return m.playingRole === filterRole;
  });

  const handleOpenPermissionsModal = (member: TeamMember) => {
    setEditingPermissionsMember(member);
    setTempPermissions(member.permissions || []);
  };

  const handleSavePermissions = () => {
    if (editingPermissionsMember) {
      onUpdatePermissions(editingPermissionsMember.id, tempPermissions);
      setEditingPermissionsMember(null);
    }
  };

  const toggleTempPermission = (permId: TeamPermission) => {
    setTempPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">
            Squad Roster ({members.length})
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            <strong>Team Roles</strong> control management authority; <strong>Playing Roles</strong> define cricket positions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canInvite && (
            <Button
              size="sm"
              variant="primary"
              onClick={onOpenInviteModal}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Players
            </Button>
          )}
        </div>
      </div>

      {/* Playing Role Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterRole('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
            filterRole === 'all'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--card-border)]'
          )}
        >
          All Players ({members.length})
        </button>
        {(['batter', 'bowler', 'all_rounder', 'wicketkeeper'] as PlayingRole[]).map((roleKey) => {
          const count = members.filter((m) => m.playingRole === roleKey).length;
          const config = PLAYING_ROLE_CONFIG[roleKey];
          return (
            <button
              key={roleKey}
              type="button"
              onClick={() => setFilterRole(roleKey)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all',
                filterRole === roleKey
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)] border border-[var(--card-border)]'
              )}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Squad Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isCurrentUser = member.userId === currentUserId || member.email === 'zain@crickethub.pk';
          const isMemberCaptain = member.role === 'captain';
          const isMemberVC = member.role === 'vice_captain';
          const playingConfig = PLAYING_ROLE_CONFIG[member.playingRole || 'all_rounder'];

          return (
            <Card
              key={member.id}
              className={cn(
                'p-5 space-y-4 border transition-all flex flex-col justify-between',
                isMemberCaptain
                  ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-[var(--surface)] to-[var(--card)]'
                  : isMemberVC
                  ? 'border-teal-500/30 bg-gradient-to-br from-teal-500/5 via-[var(--surface)] to-[var(--card)]'
                  : 'border-[var(--card-border)] bg-[var(--surface)]'
              )}
            >
              <div className="space-y-3">
                {/* Member Identity & Team Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border shadow-sm',
                        isMemberCaptain
                          ? 'bg-amber-500 text-black border-amber-400'
                          : isMemberVC
                          ? 'bg-teal-500 text-white border-teal-400'
                          : 'bg-[var(--card)] text-[var(--text)] border-[var(--card-border)]'
                      )}
                    >
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[var(--text)] truncate">
                          {member.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-[var(--card)] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--card-border)]">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Team Role Badge */}
                  <div className="shrink-0">
                    {isMemberCaptain ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Crown className="w-3 h-3" /> Captain
                      </span>
                    ) : isMemberVC ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 text-teal-400 border border-teal-500/30">
                        <ShieldCheck className="w-3 h-3" /> Vice Captain
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--card)] text-[var(--text-secondary)] border border-[var(--card-border)]">
                        Player
                      </span>
                    )}
                  </div>
                </div>

                {/* Playing Role & Stats Bar */}
                <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                      Playing Role
                    </span>
                    {canManageSquad ? (
                      <select
                        value={member.playingRole || 'all_rounder'}
                        onChange={(e) => onUpdatePlayingRole(member.id, e.target.value as PlayingRole)}
                        className="mt-1 bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                      >
                        <option value="batter">🏏 Batter</option>
                        <option value="bowler">🎯 Bowler</option>
                        <option value="all_rounder">⚡ All-Rounder</option>
                        <option value="wicketkeeper">🧤 Wicketkeeper</option>
                      </select>
                    ) : (
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border mt-1', playingConfig.color)}>
                        <span>{playingConfig.icon}</span>
                        <span>{playingConfig.label}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                      Matches
                    </span>
                    <span className="text-sm font-black text-[var(--text)] block mt-0.5">
                      {member.matchesPlayed || 0}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Custom Permissions Display (for Players) */}
                {!isMemberCaptain && (
                  <div className="pt-2 border-t border-[var(--card-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Permissions
                      </span>
                      {canEditPermissions && !isMemberCaptain && (
                        <button
                          type="button"
                          onClick={() => handleOpenPermissionsModal(member)}
                          className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {isMemberVC ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                          Vice Captain Authority (Squad, Invites, Fixtures)
                        </span>
                      ) : member.permissions && member.permissions.length > 0 ? (
                        member.permissions.map((p) => {
                          const def = ALL_PERMISSION_DEFINITIONS.find((d) => d.id === p);
                          return (
                            <span
                              key={p}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-semibold"
                            >
                              ✓ {def?.label || p}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Standard player access
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between gap-2">
                {/* Vice Captain Toggle (Captain only) */}
                {isCaptain && !isMemberCaptain && (
                  <button
                    type="button"
                    onClick={() => onSetViceCaptain(isMemberVC ? null : member.id)}
                    className={cn(
                      'text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1',
                      isMemberVC
                        ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-teal-400 border-[var(--card-border)]'
                    )}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isMemberVC ? 'Demote VC' : 'Make VC'}</span>
                  </button>
                )}

                {/* Remove Player */}
                {canRemove && !isMemberCaptain && !isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => setMemberToRemove(member)}
                    className="ml-auto text-xs font-semibold text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-1"
                    title={`Remove ${member.name} from squad`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* CUSTOM PERMISSIONS MODAL */}
      {editingPermissionsMember && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPermissionsMember(null)}
          title={`Permissions: ${editingPermissionsMember.name}`}
          description={`Customize granular management authority for this team member (${editingPermissionsMember.role}).`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">{editingPermissionsMember.name}</span>
                <span className="text-[11px] text-[var(--text-muted)]">{editingPermissionsMember.email}</span>
              </div>
              <Badge variant="primary" size="sm">
                Role: {editingPermissionsMember.role.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {ALL_PERMISSION_DEFINITIONS.map((def) => {
                const isChecked = tempPermissions.includes(def.id);
                const isLocked = def.captainOnly;

                return (
                  <label
                    key={def.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer',
                      isChecked
                        ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30'
                        : 'bg-[var(--card)] border-[var(--card-border)] hover:bg-[var(--surface)]',
                      isLocked && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <input
                      type="checkbox"
                      disabled={isLocked}
                      checked={isChecked}
                      onChange={() => !isLocked && toggleTempPermission(def.id)}
                      className="mt-1 accent-[var(--primary)] w-4 h-4 rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text)]">{def.label}</span>
                        {def.captainOnly && (
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                            Captain Only
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {def.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingPermissionsMember(null)}
              >
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM REMOVE MEMBER MODAL */}
      {memberToRemove && (
        <Modal
          isOpen={true}
          onClose={() => setMemberToRemove(null)}
          title="Remove Player from Squad"
          description={`Are you sure you want to remove ${memberToRemove.name} from the team?`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300">
              <p className="font-bold">This will remove {memberToRemove.name} from the roster.</p>
              <p className="text-[11px] mt-1 text-[var(--text-secondary)]">
                They will lose all squad permissions and match eligibility. To rejoin later, they will need to send a new Join Request.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setMemberToRemove(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onRemoveMember(memberToRemove.id);
                  setMemberToRemove(null);
                }}
              >
                Confirm Removal
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

