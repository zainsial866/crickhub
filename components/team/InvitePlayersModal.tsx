'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { PlayerDirectoryEntry, PlayingRole } from '@/types';
import { Search, Mail, Copy, Check, UserPlus, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvitePlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  inviteCode: string;
  playerDirectory: PlayerDirectoryEntry[];
  currentMemberEmails: string[];
  onAddMember: (name: string, email: string, playingRole?: PlayingRole) => void;
  onSendInvitation: (name: string, email: string) => void;
}

export function InvitePlayersModal({
  isOpen,
  onClose,
  teamName,
  inviteCode,
  playerDirectory,
  currentMemberEmails,
  onAddMember,
  onSendInvitation,
}: InvitePlayersModalProps) {
  const [tab, setTab] = useState<'search' | 'email' | 'code'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredDirectory = playerDirectory.filter((player) => {
    const isAlreadyMember = currentMemberEmails.includes(player.email.toLowerCase());
    if (isAlreadyMember) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      player.name.toLowerCase().includes(q) ||
      player.email.toLowerCase().includes(q) ||
      player.city.toLowerCase().includes(q) ||
      player.playingRole.toLowerCase().includes(q)
    );
  });

  const handleInviteUser = (player: PlayerDirectoryEntry) => {
    onAddMember(player.name, player.email, player.playingRole);
    setInvitedIds((prev) => [...prev, player.id]);
  };

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    onSendInvitation(nameInput.trim(), emailInput.trim());
    setEmailSent(true);
    setNameInput('');
    setEmailInput('');
    setTimeout(() => setEmailSent(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invite Players to ${teamName}`}
      description="Grow your squad via direct CricketHub player search, email invites, or by sharing your team code."
    >
      <div className="space-y-4">
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--card)] border border-[var(--card-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setTab('search')}
            className={cn(
              'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              tab === 'search'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Users</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('email')}
            className={cn(
              'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              tab === 'email'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Invite</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('code')}
            className={cn(
              'py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              tab === 'code'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Code</span>
          </button>
        </div>

        {/* TAB 1: SEARCH USERS */}
        {tab === 'search' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by player name, city, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredDirectory.map((player) => {
                const isInvited = invitedIds.includes(player.id);

                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--card-border)] hover:border-[var(--card-border)] transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center font-bold text-xs text-[var(--text)] shrink-0">
                        {player.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text)] truncate">{player.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                          {player.city} • <span className="capitalize">{player.playingRole.replace('_', ' ')}</span> • {player.matchesPlayed} matches
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isInvited ? 'secondary' : 'primary'}
                      disabled={isInvited}
                      onClick={() => handleInviteUser(player)}
                      leftIcon={isInvited ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                    >
                      {isInvited ? 'Invited' : 'Invite'}
                    </Button>
                  </div>
                );
              })}

              {filteredDirectory.length === 0 && (
                <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                  No players found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL INVITATION */}
        {tab === 'email' && (
          <form onSubmit={handleEmailInvite} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Player Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Rauf"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="player@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {emailSent && (
              <p className="text-xs font-bold text-emerald-400 animate-in fade-in">
                ✓ Invitation dispatched! The player will receive an invite to join.
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" leftIcon={<Mail className="w-4 h-4" />}>
                Send Invitation
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: SHARE TEAM CODE */}
        {tab === 'code' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)] block">
                Official Team Invite Code
              </span>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={inviteCode}
                  className="flex-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-lg font-mono font-black text-[var(--primary)] tracking-widest uppercase"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Important Policy:</strong> Having the team code does <strong>not</strong> automatically add anyone to the team. Teammates must enter this code in their <em>Team</em> tab to view the team and submit a <strong>Join Request</strong>, which requires Captain or Vice Captain approval.
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[var(--card-border)] flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

