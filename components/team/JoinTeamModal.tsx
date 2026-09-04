'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Team, PlayingRole } from '@/types';
import { Search, MapPin, Users, Crown, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicTeams: Team[];
  myTeams: Team[];
  onSubmitJoinRequest: (
    inviteCodeOrTeamId: string,
    playingRole: PlayingRole
  ) => { success: boolean; message: string };
}

export function JoinTeamModal({
  isOpen,
  onClose,
  publicTeams,
  myTeams,
  onSubmitJoinRequest,
}: JoinTeamModalProps) {
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [playingRole, setPlayingRole] = useState<PlayingRole>('all_rounder');
  const [searchedTeam, setSearchedTeam] = useState<Team | null>(null);
  const [searched, setSearched] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  const allTeams = [...myTeams, ...publicTeams];

  const handleLookup = () => {
    setResultMessage(null);
    const code = inviteCodeInput.trim().toUpperCase();
    if (!code) return;
    const match = allTeams.find(
      (t) => t.inviteCode.toUpperCase() === code || t.name.toLowerCase() === inviteCodeInput.trim().toLowerCase()
    );
    setSearchedTeam(match || null);
    setSearched(true);
  };

  const handleSubmitRequest = () => {
    if (!searchedTeam) return;
    const res = onSubmitJoinRequest(searchedTeam.inviteCode, playingRole);
    setResultMessage({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => {
        handleReset();
        onClose();
      }, 2500);
    }
  };

  const handleReset = () => {
    setInviteCodeInput('');
    setSearchedTeam(null);
    setSearched(false);
    setResultMessage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Join a Team"
      description="Enter a team invite code to view the team details and submit your join request."
    >
      <div className="space-y-4">
        {/* Step 1: Input Code */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Enter Team Invite Code (e.g. CAP-KING, RWP-WARR)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ISB-STRK"
              value={inviteCodeInput}
              onChange={(e) => {
                setInviteCodeInput(e.target.value.toUpperCase());
                setSearched(false);
                setSearchedTeam(null);
              }}
              className="flex-1 bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2 text-sm font-mono font-bold tracking-wider text-[var(--text)] uppercase focus:outline-none focus:border-[var(--primary)]"
            />
            <Button size="sm" variant="primary" onClick={handleLookup} disabled={!inviteCodeInput.trim()}>
              Lookup
            </Button>
          </div>
        </div>

        {/* Step 2: Team Preview */}
        {searched && !searchedTeam && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 text-center">
            No team found matching &ldquo;{inviteCodeInput}&rdquo;. Please verify the invite code with your Captain.
          </div>
        )}

        {searchedTeam && (
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--teal)] flex items-center justify-center text-xl text-white font-black shrink-0">
                  🏏
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)]">{searchedTeam.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {searchedTeam.city} • {searchedTeam.points} pts
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-muted)]">
                {searchedTeam.members.length} players
              </span>
            </div>

            <div className="pt-2 border-t border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
              <p className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Captain: <strong>{searchedTeam.captainName}</strong>
              </p>
              {searchedTeam.description && (
                <p className="mt-1 text-[11px] text-[var(--text-muted)] italic">
                  &ldquo;{searchedTeam.description}&rdquo;
                </p>
              )}
            </div>

            {/* Select Role */}
            <div className="pt-2 border-t border-[var(--card-border)]">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Your Preferred Playing Position:
              </label>
              <select
                value={playingRole}
                onChange={(e) => setPlayingRole(e.target.value as PlayingRole)}
                className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="all_rounder">⚡ All-Rounder</option>
                <option value="batter">🏏 Batter</option>
                <option value="bowler">🎯 Bowler</option>
                <option value="wicketkeeper">🧤 Wicketkeeper</option>
              </select>
            </div>

            {/* Approval Notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
              <strong>Notice:</strong> Submitting a request will place your membership into <strong>Pending</strong> status. The Captain ({searchedTeam.captainName}) or Vice Captain must review and approve before you are added to the squad roster.
            </div>
          </div>
        )}

        {/* Result notification */}
        {resultMessage && (
          <div
            className={cn(
              'p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2',
              resultMessage.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            )}
          >
            {resultMessage.success && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              handleReset();
              onClose();
            }}
          >
            Cancel
          </Button>
          {searchedTeam && !resultMessage?.success && (
            <Button type="button" variant="primary" onClick={handleSubmitRequest}>
              Request to Join
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

