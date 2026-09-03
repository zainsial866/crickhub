'use client';

import React, { useState } from 'react';
import { Team } from '@/types';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Users, Trophy, Shield, Copy, Check, UserPlus } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  onInviteClick?: () => void;
}

export function TeamCard({ team, onInviteClick }: TeamCardProps) {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    navigator.clipboard.writeText(team.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-surface p-5 sm:p-6 border-card-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Team Crest & Details */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20 shrink-0">
            🏏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-text-primary">{team.name}</h3>
              <Badge variant="primary" size="sm">{team.city}</Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-orange" />
              <span>Captain: <strong>{team.captainName}</strong></span>
              <span className="text-text-muted">•</span>
              <Users className="w-3.5 h-3.5 text-teal" />
              <span>{team.members.length} Players</span>
            </p>
          </div>
        </div>

        {/* Right: Record & Invite */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-card-border">
          {/* Win / Loss Grid */}
          <div className="flex items-center gap-2 bg-card border border-card-border px-3 py-2 rounded-xl text-center">
            <div>
              <p className="text-xs font-black text-emerald-400">{team.wins}W</p>
              <p className="text-[10px] text-text-muted font-medium">Won</p>
            </div>
            <span className="text-card-border">|</span>
            <div>
              <p className="text-xs font-black text-red-400">{team.losses}L</p>
              <p className="text-[10px] text-text-muted font-medium">Lost</p>
            </div>
            <span className="text-card-border">|</span>
            <div>
              <p className="text-xs font-black text-amber-400">{team.points} pts</p>
              <p className="text-[10px] text-text-muted font-medium">Score</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={copyInvite}
              className="text-xs"
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : team.inviteCode}
            </Button>

            {onInviteClick && (
              <Button
                size="sm"
                variant="primary"
                onClick={onInviteClick}
                className="text-xs"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Invite
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
