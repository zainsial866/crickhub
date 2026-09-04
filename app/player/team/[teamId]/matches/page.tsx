'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Radio,
  ShieldAlert,
  Swords,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { CricketMatch, MatchType } from '@/types';
import { cn } from '@/lib/utils';

type MatchSection = 'upcoming' | 'live' | 'completed';

export default function TeamMatchesPage() {
  const {
    team,
    cricketMatches,
    memberships,
    approveCricketMatch,
    rejectCricketMatch,
  } = useTeams();

  const [section, setSection] = useState<MatchSection>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | MatchType>('all');

  // Determine current user's role in this team
  const currentMembership = memberships.find(
    (m) => m.teamId === team.id && (m.userId === 'user-player-1' || m.userId === team.captainId)
  );
  const isCaptain = currentMembership?.teamRole === 'captain' || team.captainId === 'user-player-1';
  const isVC = currentMembership?.teamRole === 'vice_captain';
  const canApprove = isCaptain || isVC || currentMembership?.permissions.includes('create_matches');

  // Filter matches for this team
  const teamMatches = useMemo(() => {
    return cricketMatches.filter((m) => m.teamId === team.id);
  }, [cricketMatches, team.id]);

  const pendingMatches = useMemo(() => {
    return teamMatches.filter((m) => m.status === 'pending_approval');
  }, [teamMatches]);

  const liveMatches = useMemo(() => {
    return teamMatches.filter((m) => m.status === 'live');
  }, [teamMatches]);

  const upcomingMatches = useMemo(() => {
    return teamMatches.filter(
      (m) => m.status === 'scheduled' || m.status === 'confirmed' || m.status === 'pending_approval'
    );
  }, [teamMatches]);

  const completedMatches = useMemo(() => {
    return teamMatches.filter((m) => m.status === 'completed');
  }, [teamMatches]);

  const currentSectionMatches = useMemo(() => {
    let list: CricketMatch[] = [];
    if (section === 'upcoming') list = upcomingMatches;
    else if (section === 'live') list = liveMatches;
    else list = completedMatches;

    if (typeFilter !== 'all') {
      list = list.filter((m) => m.matchType === typeFilter);
    }
    return list;
  }, [section, upcomingMatches, liveMatches, completedMatches, typeFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Fixtures & Scorecards
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight mt-0.5">
            {team.name} Matches
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Browse upcoming fixtures, follow live matches, and explore official locked scorecards.
          </p>
        </div>

        <Link href={`/player/team/${team.id}/matches/new`}>
          <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Match
          </Button>
        </Link>
      </div>

      {/* PENDING APPROVAL NOTICE BANNER (For Captain/VC) */}
      {pendingMatches.length > 0 && canApprove && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {pendingMatches.length} Match Request{pendingMatches.length > 1 ? 's' : ''} Awaiting Approval
            </span>
            <Badge variant="orange" size="sm">Action Required</Badge>
          </div>

          <div className="space-y-2.5 divide-y divide-amber-500/15">
            {pendingMatches.map((m) => (
              <div key={m.id} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">
                    vs {m.opponentName} • <span className="font-normal text-[var(--text-secondary)]">{m.date} at {m.time}</span>
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {m.groundName} • {m.format || `${m.overs} overs`} ({m.matchType})
                    {m.createdBy && ` • Requested by ${m.createdBy}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => approveCricketMatch(m.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectCricketMatch(m.id)}
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION TABS: UPCOMING | LIVE | COMPLETED */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSection('upcoming')}
            className={cn(
              'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2',
              section === 'upcoming'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text)]'
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming</span>
            <span className="text-[10px] opacity-75">({upcomingMatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('live')}
            className={cn(
              'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2',
              section === 'live'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text)]'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>Live</span>
            <span className="text-[10px] opacity-75">({liveMatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('completed')}
            className={cn(
              'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2',
              section === 'completed'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text)]'
            )}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Completed</span>
            <span className="text-[10px] opacity-75">({completedMatches.length})</span>
          </button>
        </div>

        {/* Match Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(['all', 'friendly', 'league', 'tournament', 'practice'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1 rounded-xl text-[11px] font-semibold capitalize whitespace-nowrap transition-all',
                typeFilter === t
                  ? 'bg-[var(--surface)] text-[var(--primary)] border border-[var(--primary)]/30 font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MATCH CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentSectionMatches.map((match) => {
          const isCompleted = match.status === 'completed';
          const isLive = match.status === 'live';
          const isPending = match.status === 'pending_approval';

          return (
            <Card
              key={match.id}
              className={cn(
                'p-6 space-y-5 border transition-all flex flex-col justify-between hover:border-[var(--primary)]/40',
                isLive
                  ? 'border-red-500/40 bg-gradient-to-br from-red-950/20 via-[var(--surface)] to-[var(--card)]'
                  : 'border-[var(--card-border)] bg-[var(--surface)]'
              )}
            >
              <div className="space-y-4">
                {/* Header: Status and Type */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        Live Now
                      </span>
                    ) : isPending ? (
                      <Badge variant="orange" size="sm">Pending Approval</Badge>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Completed
                      </span>
                    ) : (
                      <Badge variant="teal" size="sm">Scheduled</Badge>
                    )}

                    {match.isOfficialLocked && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                        🔒 Official
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-[var(--text-muted)] capitalize">
                    {match.format || `${match.overs} overs`} • {match.matchType}
                  </span>
                </div>

                {/* Matchup Header */}
                <div className="text-center py-2 space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-base font-black text-[var(--text)]">
                      {match.teamName}
                    </span>
                    <Swords className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    <span className="text-base font-black text-[var(--text)]">
                      {match.opponentName}
                    </span>
                  </div>

                  {/* Scoreboard line (if completed or live) */}
                  {match.teamScore !== undefined ? (
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <div className="px-3 py-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                        <span className="text-xs text-[var(--text-muted)] block text-[10px] uppercase font-bold">
                          {match.teamName.slice(0, 3)}
                        </span>
                        <span className="text-lg font-black text-[var(--primary)]">
                          {match.teamScore}/{match.teamWickets ?? 0}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-bold">vs</span>
                      <div className="px-3 py-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                        <span className="text-xs text-[var(--text-muted)] block text-[10px] uppercase font-bold">
                          {match.opponentName.slice(0, 3)}
                        </span>
                        <span className="text-lg font-black text-[var(--text)]">
                          {match.opponentScore ?? '—'}/{match.opponentWickets ?? '—'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">
                      {match.competitionName || 'Challenge Fixture'}
                    </p>
                  )}

                  {/* Result banner */}
                  {match.result && (
                    <p className={cn(
                      'text-xs font-bold pt-1',
                      match.result === 'win' ? 'text-emerald-400' : match.result === 'loss' ? 'text-red-400' : 'text-amber-400'
                    )}>
                      {match.result === 'win'
                        ? `${match.teamName} won by ${match.margin}`
                        : match.result === 'loss'
                        ? `${match.opponentName} won by ${match.margin}`
                        : 'Match drawn (level score)'}
                    </p>
                  )}
                </div>

                {/* Match Meta: Date, Time, Ground */}
                <div className="pt-3 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {match.date} • {match.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {match.groundName}
                  </span>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {match.squad.length} Players in Squad
                </span>

                <Link
                  href={`/player/matches/${match.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  <span>{isCompleted ? 'View Full Scorecard' : 'View Match Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {currentSectionMatches.length === 0 && (
        <Card className="p-12 text-center space-y-3 bg-[var(--surface)] border-[var(--card-border)]">
          <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text)]">No {section} matches found</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            {section === 'upcoming'
              ? 'There are currently no scheduled fixtures. Use Create Match to arrange your next challenge.'
              : section === 'live'
              ? 'No live games currently active.'
              : 'Completed matches and official scorecards will appear here once finalized.'}
          </p>
          {section === 'upcoming' && (
            <Link href={`/player/team/${team.id}/matches/new`}>
              <Button size="sm" variant="primary" className="mt-2">
                Schedule Match
              </Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}