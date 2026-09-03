'use client';

import React, { useState } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { TeamCard } from '@/components/cards/TeamCard';
import { InviteMemberModal } from '@/components/forms/InviteMemberModal';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Users, UserPlus, Shield, Trash2, Award, Swords, Calendar } from 'lucide-react';

export default function TeamPage() {
  const { team, addMember, removeMember } = useTeams();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner Team Card */}
      <TeamCard team={team} onInviteClick={() => setIsInviteOpen(true)} />

      {/* Responsive Content Grid: Mobile stacked, Desktop 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Members Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-light" />
                <span>Active Squad Roster</span>
                <span className="text-xs font-normal text-text-muted">({team.members.length} players)</span>
              </h3>
              <p className="text-xs text-text-secondary">Manage captaincy and squad positions</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsInviteOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Player
            </Button>
          </div>

          {/* Members Table / Card List */}
          <div className="space-y-2.5">
            {team.members.map((member) => (
              <Card
                key={member.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-text-primary">{member.name}</h4>
                      {member.role === 'captain' && (
                        <Badge variant="orange" size="sm">
                          Captain
                        </Badge>
                      )}
                      {member.role === 'vice_captain' && (
                        <Badge variant="teal" size="sm">
                          VC
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-text-primary">{member.matchesPlayed}</span>
                    <span className="text-[10px] text-text-muted block">Caps</span>
                  </div>

                  {member.role !== 'captain' && (
                    <button
                      onClick={() => removeMember(member.id)}
                      title="Remove from squad"
                      className="p-2 text-text-muted hover:text-red-400 hover:bg-card-border rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Team Activity & Match Lineup */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-orange" />
            <span>Team Trophy & Stats</span>
          </h3>

          <Card className="p-5 space-y-4 bg-surface/50 border-card-border">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <p className="text-2xl font-black text-primary-light">{team.points}</p>
                <p className="text-[10px] text-text-muted uppercase font-bold mt-0.5">Points</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <p className="text-2xl font-black text-emerald-400">73.6%</p>
                <p className="text-[10px] text-text-muted uppercase font-bold mt-0.5">Win Rate</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-card-border text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Total Matches Played</span>
                <span className="font-bold text-text-primary">{team.wins + team.losses + team.draws}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Matches Won</span>
                <span className="font-bold text-emerald-400">{team.wins}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Matches Lost</span>
                <span className="font-bold text-red-400">{team.losses}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Twin City Leaderboard Rank</span>
                <span className="font-bold text-amber-400">#1 (Champions)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-secondary space-y-1">
              <p className="font-bold text-text-primary flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-primary-light" />
                <span>Next Scheduled Fixture</span>
              </p>
              <p className="text-[11px] text-text-muted">
                vs Rawalpindi Smashers • Saturday 9:00 PM @ F-6 Box Arena
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        inviteCode={team.inviteCode}
        onAddMember={addMember}
      />
    </div>
  );
}
