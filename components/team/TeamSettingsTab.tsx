'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  Crown,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  LogOut,
  Trash2,
  Lock,
  Globe2,
  Users,
} from 'lucide-react';
import { Team, TeamMember, TeamRole } from '@/types';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { cn } from '@/lib/utils';

interface TeamSettingsTabProps {
  team: Team;
  currentUserRole: TeamRole;
  currentUserId?: string;
  onUpdateSettings: (updates: Partial<Pick<Team, 'name' | 'city' | 'description' | 'isPublic' | 'badgeUrl'>>) => void;
  onTransferCaptaincy: (memberId: string) => void;
  onSetViceCaptain: (memberId: string | null) => void;
  onRegenerateCode: (teamId: string) => string;
  onLeaveTeam: (memberId: string, replacementCaptainId?: string) => { success: boolean; error?: string };
  onDeleteTeam: (teamId: string) => void;
  onOpenJoinRequests: () => void;
}

export function TeamSettingsTab({
  team,
  currentUserRole,
  currentUserId = 'user-player-1',
  onUpdateSettings,
  onTransferCaptaincy,
  onSetViceCaptain,
  onRegenerateCode,
  onLeaveTeam,
  onDeleteTeam,
  onOpenJoinRequests,
}: TeamSettingsTabProps) {
  const [name, setName] = useState(team.name);
  const [city, setCity] = useState(team.city);
  const [description, setDescription] = useState(team.description || '');
  const [isPublic, setIsPublic] = useState(team.isPublic !== false);
  const [saved, setSaved] = useState(false);

  // Invite code copy & regen state
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(team.inviteCode);

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedNewCaptainId, setSelectedNewCaptainId] = useState('');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReplacementId, setLeaveReplacementId] = useState('');
  const [leaveError, setLeaveError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  const isCaptain = currentUserRole === 'captain';
  const eligibleReplacementCaptains = team.members.filter((m) => m.id !== team.captainId && m.userId !== currentUserId);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name: name.trim() || team.name,
      city: city.trim() || team.city,
      description: description.trim(),
      isPublic,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = () => {
    const newCode = onRegenerateCode(team.id);
    setCurrentCode(newCode);
  };

  const handleConfirmTransfer = () => {
    if (!selectedNewCaptainId) return;
    onTransferCaptaincy(selectedNewCaptainId);
    setIsTransferModalOpen(false);
    setSelectedNewCaptainId('');
  };

  const handleConfirmLeave = () => {
    setLeaveError('');
    if (isCaptain && !leaveReplacementId) {
      setLeaveError('As Captain, you must choose a successor captain before leaving.');
      return;
    }
    const res = onLeaveTeam(team.captainId, leaveReplacementId || undefined);
    if (!res.success) {
      setLeaveError(res.error || 'Could not leave team.');
    } else {
      setIsLeaveModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmInput.trim() !== team.name.trim()) return;
    onDeleteTeam(team.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* SECTION 1: GENERAL IDENTITY */}
      <Card className="p-6 sm:p-7 border-[var(--card-border)]">
        <form onSubmit={handleSaveGeneral} className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[var(--text)] tracking-tight">
                General Settings
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Update your team name, home city, and public bio.
              </p>
            </div>
            {saved && (
              <span className="text-xs font-bold text-emerald-400 animate-in fade-in">
                ✓ Saved successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Team Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isCaptain}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                City / Region
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isCaptain}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] disabled:opacity-60"
              >
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isCaptain}
              placeholder="Describe your squad, skill level, or preferred match format..."
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] disabled:opacity-60"
            />
          </div>

          {/* Team Visibility */}
          <div className="pt-3 border-t border-[var(--card-border)]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => isCaptain && setIsPublic(e.target.checked)}
                disabled={!isCaptain}
                className="mt-1 accent-[var(--primary)] w-4 h-4 rounded"
              />
              <div>
                <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[var(--teal)]" />
                  Public Team Profile
                </span>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  When public, other players on CricketHub can discover your team, view records, and request to join.
                </p>
              </div>
            </label>
          </div>

          {isCaptain && (
            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* SECTION 2: MANAGEMENT & LEADERSHIP */}
      <Card className="p-6 sm:p-7 border-[var(--card-border)] space-y-5">
        <div>
          <h3 className="text-lg font-black text-[var(--text)] tracking-tight">
            Management & Leadership
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Designate team leadership and configure authority.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Captain
            </span>
            <p className="text-sm font-bold text-[var(--text)]">{team.captainName}</p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Full administrative authority over squad, settings, and finances.
            </p>
            {isCaptain && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsTransferModalOpen(true)}
                className="mt-2 text-xs"
              >
                Transfer Captaincy
              </Button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-teal-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Vice Captain
            </span>
            <p className="text-sm font-bold text-[var(--text)]">
              {team.viceCaptainName || 'No Vice Captain assigned'}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Can manage squads, schedule fixtures, and approve join requests.
            </p>
            {isCaptain && (
              <select
                value={team.viceCaptainId || ''}
                onChange={(e) => onSetViceCaptain(e.target.value || null)}
                className="mt-2 w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">-- Unassigned --</option>
                {team.members
                  .filter((m) => m.id !== team.captainId)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.playingRole})
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 3: MEMBERSHIP & INVITES */}
      <Card className="p-6 sm:p-7 border-[var(--card-border)] space-y-5">
        <div>
          <h3 className="text-lg font-black text-[var(--text)] tracking-tight">
            Membership & Invite Settings
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage your invite code and review pending join requests.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-3">
          <label className="text-[11px] uppercase font-bold text-[var(--text-muted)] block">
            Team Invite Code
          </label>
          <div className="flex items-center gap-2 max-w-md">
            <input
              readOnly
              value={currentCode}
              className="flex-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3.5 py-2 text-base font-mono font-black text-[var(--primary)] tracking-widest"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyCode}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            {isCaptain && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerateCode}
                title="Regenerate invite code"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Notice: Sharing this code does <strong>not</strong> grant immediate roster access. Players must submit a Join Request which you or your Vice Captain must approve.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-[var(--text)]">
            Incoming Join Requests
          </span>
          <Button size="sm" variant="outline" onClick={onOpenJoinRequests}>
            View Join Requests
          </Button>
        </div>
      </Card>

      {/* SECTION 4: DANGER ZONE */}
      <Card className="p-6 sm:p-7 border-red-500/30 bg-red-500/5 space-y-5">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-lg font-black tracking-tight">Danger Zone</h3>
        </div>

        <div className="space-y-4 divide-y divide-red-500/15">
          {/* Leave Team */}
          <div className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--text)]">Leave Team</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {isCaptain
                  ? 'As Captain, you must transfer captaincy to another member before leaving.'
                  : 'Revoke your membership and leave the squad.'}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setLeaveError('');
                setIsLeaveModalOpen(true);
              }}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Leave Team
            </Button>
          </div>

          {/* Delete Team (Captain only) */}
          {isCaptain && (
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-red-400">Delete Team</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Permanently delete this team, all squad memberships, and statistics. This cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Team
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* TRANSFER CAPTAINCY MODAL */}
      {isTransferModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsTransferModalOpen(false)}
          title="Transfer Captaincy"
          description={`Choose a member of ${team.name} to assume full ownership and leadership.`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300">
              <p className="font-bold">Important Leadership Notice</p>
              <p className="text-[11px] mt-1 text-[var(--text-secondary)]">
                Once transferred, you will become a regular player and will no longer have exclusive Captain controls unless re-assigned.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Select Successor Captain
              </label>
              <select
                value={selectedNewCaptainId}
                onChange={(e) => setSelectedNewCaptainId(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">-- Choose a teammate --</option>
                {eligibleReplacementCaptains.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email}) - {m.role} • {m.playingRole}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="secondary" onClick={() => setIsTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!selectedNewCaptainId}
                onClick={handleConfirmTransfer}
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* LEAVE TEAM MODAL (WITH CAPTAIN SAFEGUARD) */}
      {isLeaveModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsLeaveModalOpen(false)}
          title={`Leave ${team.name}`}
          description={
            isCaptain
              ? 'A captain cannot leave while remaining captain. You must select a new Captain first.'
              : 'Are you sure you want to leave this team?'
          }
        >
          <div className="space-y-4">
            {leaveError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-bold">
                {leaveError}
              </div>
            )}

            {isCaptain ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300">
                  <p className="font-bold">Captaincy Transfer Required</p>
                  <p className="text-[11px] mt-1 text-[var(--text-secondary)]">
                    Pick which squad member will take over as Captain before you leave:
                  </p>
                </div>

                <select
                  value={leaveReplacementId}
                  onChange={(e) => setLeaveReplacementId(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="">-- Select New Captain --</option>
                  {eligibleReplacementCaptains.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role}) • {m.playingRole}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You will be removed from {team.name}&apos;s squad and match roster. You can request to rejoin at any time with an invite code.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="secondary" onClick={() => setIsLeaveModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={isCaptain && !leaveReplacementId}
                onClick={handleConfirmLeave}
              >
                {isCaptain ? 'Transfer & Leave' : 'Confirm Leave'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE TEAM MODAL */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Permanently Delete Team"
          description={`Are you completely sure? This will delete ${team.name} for all members.`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300">
              <p className="font-bold">Irreversible Action</p>
              <p className="text-[11px] mt-1 text-[var(--text-secondary)]">
                All scheduled matches, memberships, statistics, and chat history for {team.name} will be permanently wiped.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Type <strong className="text-red-400">{team.name}</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={team.name}
                className="w-full bg-[var(--surface)] border border-red-500/30 rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={deleteConfirmInput.trim() !== team.name.trim()}
                onClick={handleConfirmDelete}
              >
                Delete Team Forever
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

