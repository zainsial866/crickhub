'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  MapPin,
  Shield,
  ShieldCheck,
  Swords,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Team, TeamJoinRequest, CricketMatch, MatchChallenge } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

interface TeamOverviewTabProps {
  team: Team;
  derivedStats: {
    matches: number;
    wins: number;
    losses: number;
    draws: number;
    points: number;
  };
  pendingRequests: TeamJoinRequest[];
  nextMatch?: MatchChallenge | CricketMatch;
  completedMatches: CricketMatch[];
  canApprove: boolean;
  onOpenJoinRequests: () => void;
  onOpenInviteModal: () => void;
  onDismissAlert?: (alertId: string) => void;
  onNavigateToTab?: (tab: 'squad' | 'settings') => void;
}

export function TeamOverviewTab({
  team,
  derivedStats,
  pendingRequests,
  nextMatch,
  completedMatches,
  canApprove,
  onOpenJoinRequests,
  onOpenInviteModal,
  onDismissAlert,
  onNavigateToTab,
}: TeamOverviewTabProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalMatches = derivedStats.matches || (team.wins + team.losses + team.draws);
  const totalWins = derivedStats.wins || team.wins;
  const totalLosses = derivedStats.losses || team.losses;
  const totalDraws = derivedStats.draws || team.draws;
  const totalPoints = derivedStats.points || team.points;
  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : '0.0';

  const recentForm = team.recentForm && team.recentForm.length ? team.recentForm : ['W', 'W', 'L', 'W', 'W'];
  const alerts = team.alerts || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 🔴 MATCH TODAY / IMPORTANT NOW HERO CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-red-950/40 via-[var(--surface)] to-[var(--card)] border border-red-500/30 p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Match Today
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Tonight • 9:00 PM
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
                {team.name} <span className="text-[var(--text-muted)] font-normal text-lg">vs</span> Rawalpindi Smashers
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                F-6 Box Arena • 8 Overs Super Box Challenge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/player/team/${team.id}/matches`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm tracking-tight shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>View Match</span>
            </Link>
          </div>
        </div>

        {/* Mini stats row under Match Today */}
        <div className="mt-6 pt-5 border-t border-red-500/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-[var(--text)]">{totalWins} W</span>
            <span className="text-sm font-bold text-[var(--text-muted)]">{totalLosses} L</span>
            <span className="text-xs font-bold text-amber-400 ml-auto">{totalPoints} PTS</span>
          </div>
          <div>
            <span className="text-sm font-black text-emerald-400">{winRate}%</span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] ml-1.5">Win Rate</span>
          </div>
          <div className="sm:col-span-2 flex items-center sm:justify-end gap-2">
            <span className="text-[11px] uppercase font-bold text-[var(--text-muted)] mr-1">
              Recent Form
            </span>
            <div className="flex items-center gap-1.5">
              {recentForm.map((result, idx) => (
                <span
                  key={`${result}-${idx}`}
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border',
                    result === 'W'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : result === 'L'
                      ? 'bg-red-500/15 text-red-400 border-red-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  )}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS & WARNINGS STACK */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              Alerts & Notices ({alerts.length})
            </span>
            {pendingRequests.length > 0 && canApprove && (
              <button
                type="button"
                onClick={onOpenJoinRequests}
                className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                Review {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all',
                  alert.severity === 'red'
                    ? 'bg-red-500/10 border-red-500/25 text-red-300'
                    : alert.severity === 'yellow'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-base mt-0.5 shrink-0">
                    {alert.severity === 'red' ? '🔴' : alert.severity === 'yellow' ? '🟡' : '🟢'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--text)] tracking-tight">
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {alert.description}
                    </p>
                    {alert.ctaLabel && (
                      <button
                        type="button"
                        onClick={() => {
                          if (alert.ctaAction === 'review_requests') onOpenJoinRequests();
                        }}
                        className="text-[11px] font-bold text-[var(--primary)] hover:underline mt-1.5 inline-flex items-center gap-1"
                      >
                        {alert.ctaLabel} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {onDismissAlert && (
                  <button
                    type="button"
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg shrink-0"
                    title="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM IDENTITY & PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Identity Card */}
        <Card className="lg:col-span-2 p-6 sm:p-7 space-y-6 bg-gradient-to-br from-[var(--surface)] to-[var(--card)] border-[var(--card-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--teal)] flex items-center justify-center text-3xl shadow-lg border border-white/10 shrink-0">
                🏏
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
                    {team.name}
                  </h3>
                  <Badge variant="primary" size="sm">
                    {team.city}
                  </Badge>
                  <Badge variant={team.isPublic !== false ? 'teal' : 'outline'} size="sm">
                    {team.isPublic !== false ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md line-clamp-2">
                  {team.description || 'Competitive indoor box cricket squad competing in twin city fixtures.'}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenInviteModal}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Invite Players
            </Button>
          </div>

          {/* Leadership & Members Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--card-border)]">
            <div className="p-3.5 rounded-2xl bg-[var(--surface)]/80 border border-[var(--card-border)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  Captain
                </span>
                <span className="font-bold text-xs text-[var(--text)] truncate block">
                  {team.captainName}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface)]/80 border border-[var(--card-border)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  Vice Captain
                </span>
                <span className="font-bold text-xs text-[var(--text)] truncate block">
                  {team.viceCaptainName || 'None assigned'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface)]/80 border border-[var(--card-border)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  Squad Size
                </span>
                <span className="font-bold text-xs text-[var(--text)]">
                  {team.members.length} Active Players
                </span>
              </div>
            </div>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2">
            {[
              ['Matches', totalMatches],
              ['Wins', totalWins],
              ['Losses', totalLosses],
              ['Draws', totalDraws],
              ['Points', totalPoints],
              ['Win Rate', `${winRate}%`],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="p-3 rounded-2xl bg-[var(--surface)]/60 border border-[var(--card-border)] shadow-sm"
              >
                <p className="text-lg font-black text-[var(--primary)] tracking-tight">{value}</p>
                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Invite Code & Quick Tools Card */}
        <Card className="p-6 space-y-5 bg-gradient-to-br from-[var(--surface)] to-[var(--card)] border-[var(--card-border)] flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">
                Team Invite Code
              </span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  readOnly
                  value={team.inviteCode}
                  className="flex-1 bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-base font-mono font-black text-[var(--primary)] tracking-wider"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCopyCode}
                  leftIcon={copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedCode ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">
                Having this code allows players to view this team and submit a Join Request. Captain or Vice Captain approval is always required before joining the roster.
              </p>
            </div>

            {pendingRequests.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Pending Join Requests
                  </span>
                  <Badge variant="orange" size="sm">
                    {pendingRequests.length}
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {pendingRequests[0].playerName} wants to join as {pendingRequests[0].playingRole || 'player'}.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-1 text-xs"
                  onClick={onOpenJoinRequests}
                >
                  Review Requests
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Need to update settings?</span>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('settings')}
                className="font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                Team Settings <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY TIMELINE */}
      <Card className="p-6 space-y-4 border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">Team Activity</h3>
            <p className="text-xs text-[var(--text-secondary)]">Recent events and milestone history</p>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {(team.activity || []).length} log events
          </span>
        </div>

        <div className="space-y-2 divide-y divide-[var(--card-border)]">
          {(team.activity || []).map((act) => (
            <div key={act.id} className="pt-3 first:pt-0 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center text-sm shrink-0">
                {act.type === 'booking' ? '📅' : act.type === 'match' ? '🏆' : act.type === 'member' ? '👤' : '⚙️'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text)] truncate">
                  {act.message}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {new Date(act.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {(!team.activity || team.activity.length === 0) && (
            <p className="text-xs text-[var(--text-muted)] py-4 text-center">No recent team activity.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

