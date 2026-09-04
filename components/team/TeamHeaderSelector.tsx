'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Users, ShieldCheck, Crown } from 'lucide-react';
import { Team, TeamMembership } from '@/types';
import { cn } from '@/lib/utils';

interface TeamHeaderSelectorProps {
  selectedTeam: Team;
  myTeams: Team[];
  memberships: TeamMembership[];
  currentUserId?: string;
  onSelectTeam: (teamId: string) => void;
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
}

export function TeamHeaderSelector({
  selectedTeam,
  myTeams,
  memberships,
  currentUserId = 'user-player-1',
  onSelectTeam,
  onOpenCreateModal,
  onOpenJoinModal,
}: TeamHeaderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Helper to determine the user's role in a specific team
  const getUserRoleInTeam = (team: Team) => {
    // Check membership first
    const membership = memberships.find((m) => m.teamId === team.id && (m.userId === currentUserId || m.userId === 'user-player-1'));
    if (membership) {
      if (membership.teamRole === 'captain') return 'Captain';
      if (membership.teamRole === 'vice_captain') return 'Vice Captain';
      return 'Player';
    }
    // Fallback to member list inside team
    const member = team.members.find(
      (m) => m.userId === currentUserId || m.email === 'zain@crickethub.pk' || (team.captainId === currentUserId && m.role === 'captain')
    );
    if (member) {
      if (member.role === 'captain') return 'Captain';
      if (member.role === 'vice_captain') return 'Vice Captain';
      return 'Player';
    }
    if (team.captainName === 'Zain Sial' || team.captainId === currentUserId) return 'Captain';
    return 'Player';
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
          Team
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex items-center gap-2.5 rounded-2xl py-1 text-left focus:outline-none transition-all duration-150"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
            {selectedTeam.name}
          </span>
          <span className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text)] group-hover:border-[var(--primary)] transition-all shadow-sm">
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isOpen && 'rotate-180 text-[var(--primary)]'
              )}
            />
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-3 w-80 sm:w-96 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--card)]/50 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              My Teams ({myTeams.length})
            </span>
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              Tap to switch team
            </span>
          </div>

          {/* Teams List */}
          <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
            {myTeams.map((team) => {
              const isSelected = team.id === selectedTeam.id;
              const role = getUserRoleInTeam(team);

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => {
                    onSelectTeam(team.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl text-left transition-all',
                    isSelected
                      ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 shadow-sm'
                      : 'hover:bg-[var(--card)] border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border transition-all',
                        isSelected
                          ? 'bg-[var(--primary)] text-white border-[var(--primary-dark)] shadow-sm'
                          : 'bg-[var(--card)] text-[var(--text-secondary)] border-[var(--card-border)]'
                      )}
                    >
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text)] truncate">
                          {team.name}
                        </span>
                        {isSelected && (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--primary)] text-white shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            'text-xs font-semibold flex items-center gap-1',
                            role === 'Captain'
                              ? 'text-amber-400'
                              : role === 'Vice Captain'
                              ? 'text-teal-400'
                              : 'text-[var(--text-secondary)]'
                          )}
                        >
                          {role === 'Captain' && <Crown className="w-3 h-3" />}
                          {role === 'Vice Captain' && <ShieldCheck className="w-3 h-3" />}
                          {role}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">•</span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {team.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-black text-[var(--text)]">
                      {team.points} pts
                    </span>
                    <span className="block text-[10px] text-[var(--text-muted)]">
                      {team.members.length} players
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="p-3 border-t border-[var(--card-border)] bg-[var(--card)]/40 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenCreateModal();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--card)] hover:bg-[var(--primary)] text-[var(--text)] hover:text-white border border-[var(--card-border)] hover:border-[var(--primary)] transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--primary)] group-hover:text-white" />
              <span>Create Team</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenJoinModal();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--card)] hover:bg-[var(--surface)] text-[var(--text)] border border-[var(--card-border)] hover:border-[var(--card-border)] transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-[var(--teal)]" />
              <span>Join Team</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

