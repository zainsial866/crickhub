'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ChevronDown,
  Flame,
  Shield,
  Target,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { cn } from '@/lib/utils';
import { TeamMember } from '@/types';

type TeamScope = 'all' | string;
type FormatScope = 'all' | 'T10' | 'T20' | 'Other';
type TimeScope = 'all' | 'season' | '30d' | '90d';
type LeaderboardTab = 'batting' | 'bowling' | 'fielding';
type StatView = 'overview' | 'batting' | 'bowling' | 'fielding' | 'records' | 'achievements' | 'history';

type PlayerSummary = {
  member: TeamMember;
  teamName: string;
  matches: number;
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
  catches: number;
  runOuts: number;
  battingAverage: number;
  strikeRate: number;
  bowlingAverage: number;
  economy: number;
  highestScore: number;
  fours: number;
  sixes: number;
  fifties: number;
  hundreds: number;
  bestFigures: string;
};

const formatOptions: Array<{ value: FormatScope; label: string }> = [
  { value: 'all', label: 'All Formats' },
  { value: 'T10', label: 'T10' },
  { value: 'T20', label: 'T20' },
  { value: 'Other', label: 'Other' },
];

const timeOptions: Array<{ value: TimeScope; label: string }> = [
  { value: 'all', label: 'All Time' },
  { value: 'season', label: 'This Season' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
];

function normalizeFormat(value?: string): FormatScope {
  const format = (value || '').toLowerCase();
  if (format.includes('t10')) return 'T10';
  if (format.includes('t20')) return 'T20';
  return 'Other';
}

function matchesWithinRange(dateStr: string, range: TimeScope) {
  if (range === 'all') return true;
  const sourceDate = new Date(dateStr);
  if (Number.isNaN(sourceDate.getTime())) return true;
  const now = new Date();
  const diffInDays = (now.getTime() - sourceDate.getTime()) / (1000 * 60 * 60 * 24);

  if (range === 'season') return sourceDate.getFullYear() >= 2026;
  if (range === '30d') return diffInDays <= 30;
  if (range === '90d') return diffInDays <= 90;
  return true;
}

function summarizeMember(
  member: TeamMember,
  teamName: string,
  matches: ReturnType<typeof useTeams>['cricketMatches']
): PlayerSummary {
  let matchCount = 0;
  let runs = 0;
  let balls = 0;
  let wickets = 0;
  let overs = 0;
  let catches = 0;
  let runOuts = 0;
  let fours = 0;
  let sixes = 0;
  let highestScore = 0;
  let bestWickets = 0;
  let bestRuns = 999;

  for (const match of matches) {
    const stat = match.playerStats.find(
      (item) =>
        item.playerId === member.id ||
        item.playerId === member.userId ||
        item.playerName.toLowerCase() === member.name.toLowerCase()
    );

    if (!stat) continue;
    matchCount += 1;

    runs += stat.runs || 0;
    balls += stat.balls || 0;
    wickets += stat.wickets || 0;
    overs += stat.overs || 0;
    catches += stat.catches || 0;
    runOuts += stat.runOuts || 0;
    fours += stat.fours || 0;
    sixes += stat.sixes || 0;
    highestScore = Math.max(highestScore, stat.runs || 0);

    if ((stat.wickets || 0) > bestWickets || ((stat.wickets || 0) === bestWickets && (stat.bowlingRuns || 0) < bestRuns)) {
      bestWickets = stat.wickets || 0;
      bestRuns = stat.bowlingRuns || 0;
    }
  }

  const battingAverage = matchCount > 0 ? runs / matchCount : 0;
  const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;
  const bowlingAverage = wickets > 0 ? matches.reduce((sum, match) => {
    const stat = match.playerStats.find(
      (item) =>
        item.playerId === member.id ||
        item.playerId === member.userId ||
        item.playerName.toLowerCase() === member.name.toLowerCase()
    );
    return sum + (stat?.bowlingRuns || 0);
  }, 0) / wickets : 0;
  const economy = overs > 0 ? matches.reduce((sum, match) => {
    const stat = match.playerStats.find(
      (item) =>
        item.playerId === member.id ||
        item.playerId === member.userId ||
        item.playerName.toLowerCase() === member.name.toLowerCase()
    );
    return sum + (stat?.bowlingRuns || 0);
  }, 0) / overs : 0;
  const fifties = matches.filter((match) => {
    const stat = match.playerStats.find(
      (item) =>
        item.playerId === member.id ||
        item.playerId === member.userId ||
        item.playerName.toLowerCase() === member.name.toLowerCase()
    );
    return (stat?.runs || 0) >= 50 && (stat?.runs || 0) < 100;
  }).length;
  const hundreds = matches.filter((match) => {
    const stat = match.playerStats.find(
      (item) =>
        item.playerId === member.id ||
        item.playerId === member.userId ||
        item.playerName.toLowerCase() === member.name.toLowerCase()
    );
    return (stat?.runs || 0) >= 100;
  }).length;

  return {
    member,
    teamName,
    matches: matchCount,
    runs,
    balls,
    wickets,
    overs,
    catches,
    runOuts,
    battingAverage: Number(battingAverage.toFixed(1)),
    strikeRate: Number(strikeRate.toFixed(1)),
    bowlingAverage: Number(bowlingAverage.toFixed(1)),
    economy: Number(economy.toFixed(2)),
    highestScore,
    fours,
    sixes,
    fifties,
    hundreds,
    bestFigures: bestWickets > 0 ? `${bestWickets}/${bestRuns}` : '0/0',
  };
}

export default function TeamStatsPage() {
  const { team, myTeams, cricketMatches } = useTeams();

  const [selectedTeamScope, setSelectedTeamScope] = useState<TeamScope>('all');
  const [selectedFormat, setSelectedFormat] = useState<FormatScope>('all');
  const [selectedTime, setSelectedTime] = useState<TimeScope>('all');
  const [activeView, setActiveView] = useState<StatView>('overview');
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('batting');
  const [comparePlayerId, setComparePlayerId] = useState<string>('');

  const teamOptions = useMemo(
    () => [{ id: 'all', name: 'All Teams' }, ...myTeams.map((teamItem) => ({ id: teamItem.id, name: teamItem.name }))],
    [myTeams]
  );

  const availableTeams = useMemo(() => {
    const ids = selectedTeamScope === 'all' ? myTeams.map((item) => item.id) : [selectedTeamScope];
    return myTeams.filter((item) => ids.includes(item.id));
  }, [myTeams, selectedTeamScope]);

  const visibleMatches = useMemo(() => {
    const ids = selectedTeamScope === 'all' ? myTeams.map((item) => item.id) : [selectedTeamScope];
    return cricketMatches.filter((match) => {
      if (!ids.includes(match.teamId)) return false;
      if (match.status !== 'completed') return false;
      if (selectedFormat !== 'all' && normalizeFormat(match.format) !== selectedFormat) return false;
      if (!matchesWithinRange(match.date, selectedTime)) return false;
      return true;
    });
  }, [cricketMatches, myTeams, selectedFormat, selectedTeamScope, selectedTime]);

  const selectedMembers = useMemo(
    () => availableTeams.flatMap((teamItem) => teamItem.members),
    [availableTeams]
  );

  const currentMember = useMemo(() => {
    return (
      selectedMembers.find((member) => member.userId === 'user-player-1' || member.email === 'zain@crickethub.pk') ||
      team.members.find((member) => member.userId === 'user-player-1' || member.email === 'zain@crickethub.pk') ||
      selectedMembers[0] || {
        id: 'user-player-1',
        name: 'You',
        email: 'zain@crickethub.pk',
        role: 'captain',
        playingRole: 'all_rounder',
        matchesPlayed: 0,
      }
    );
  }, [selectedMembers, team.members]);

  const playerSummaries = useMemo<PlayerSummary[]>(() => {
    return availableTeams.flatMap((teamItem) =>
      teamItem.members.map((member) =>
        summarizeMember(member, teamItem.name, visibleMatches.filter((match) => match.teamId === teamItem.id))
      )
    );
  }, [availableTeams, visibleMatches]);

  const meSummary = useMemo(() => {
    return (
      playerSummaries.find((entry) => entry.member.id === currentMember.id) ||
      summarizeMember(currentMember, team.name, visibleMatches)
    );
  }, [currentMember, playerSummaries, team.name, visibleMatches]);

  const teamBreakdown = useMemo(() => {
    return availableTeams.map((teamItem) => {
      const rows = visibleMatches.filter((match) => match.teamId === teamItem.id);
      const playerEntry = summarizeMember(currentMember, teamItem.name, rows);
      return {
        teamName: teamItem.name,
        matches: playerEntry.matches,
        runs: playerEntry.runs,
        wickets: playerEntry.wickets,
        strikeRate: playerEntry.strikeRate,
      };
    });
  }, [availableTeams, currentMember, visibleMatches]);

  const allTeamsTotal = useMemo(() => {
    return teamBreakdown.reduce(
      (acc, row) => ({
        matches: acc.matches + row.matches,
        runs: acc.runs + row.runs,
        wickets: acc.wickets + row.wickets,
        strikeRate: acc.strikeRate + row.strikeRate,
      }),
      { matches: 0, runs: 0, wickets: 0, strikeRate: 0 }
    );
  }, [teamBreakdown]);

  const performanceTrend = useMemo(() => {
    return visibleMatches.slice(-6).map((match) => {
      const stat = match.playerStats.find(
        (item) =>
          item.playerId === currentMember.id ||
          item.playerId === currentMember.userId ||
          item.playerName.toLowerCase() === currentMember.name.toLowerCase()
      );
      return {
        label: match.opponentName.slice(0, 3).toUpperCase(),
        value: stat?.runs || 0,
      };
    });
  }, [currentMember, visibleMatches]);

  const maxTrendValue = Math.max(...performanceTrend.map((item) => item.value), 1);

  const leaderboard = useMemo(() => {
    const batting = [...playerSummaries].sort((a, b) => b.runs - a.runs).slice(0, 5);
    const bowling = [...playerSummaries].sort((a, b) => b.wickets - a.wickets).slice(0, 5);
    const fielding = [...playerSummaries].sort((a, b) => b.catches + b.runOuts - (a.catches + a.runOuts)).slice(0, 5);
    return { batting, bowling, fielding };
  }, [playerSummaries]);

  const comparisonOptions = useMemo(
    () => selectedMembers.filter((member) => member.id !== currentMember.id),
    [currentMember.id, selectedMembers]
  );

  const comparisonMember = useMemo(() => {
    const selected = comparisonOptions.find((member) => member.id === comparePlayerId) || comparisonOptions[0];
    if (!selected) return null;
    return playerSummaries.find((entry) => entry.member.id === selected.id) || null;
  }, [comparePlayerId, comparisonOptions, playerSummaries]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      <div className="flex flex-col gap-4 border-b border-[var(--card-border)] pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Performance Center</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">Stats</h1>
          </div>

          <Link
            href="/player/team"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to team
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            <select
              value={selectedTeamScope}
              onChange={(event) => setSelectedTeamScope(event.target.value)}
              className="bg-transparent text-sm font-semibold text-[var(--text)] focus:outline-none"
            >
              {teamOptions.map((option) => (
                <option key={option.id} value={option.id} className="bg-[var(--surface)] text-[var(--text)]">
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
            <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
            <select
              value={selectedFormat}
              onChange={(event) => setSelectedFormat(event.target.value as FormatScope)}
              className="bg-transparent text-sm font-semibold text-[var(--text)] focus:outline-none"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[var(--surface)] text-[var(--text)]">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
            <Activity className="w-4 h-4 text-[var(--primary)]" />
            <select
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value as TimeScope)}
              className="bg-transparent text-sm font-semibold text-[var(--text)] focus:outline-none"
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[var(--surface)] text-[var(--text)]">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-[var(--card-border)] pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'batting', label: 'Batting' },
          { id: 'bowling', label: 'Bowling' },
          { id: 'fielding', label: 'Fielding' },
          { id: 'records', label: 'Records' },
          { id: 'achievements', label: 'Achievements' },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveView(tab.id as StatView)}
            className={cn(
              'rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition',
              activeView === tab.id
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/60 px-4 py-3">
        <p className="text-xs leading-5 text-[var(--text-secondary)]">
          Explore your team&apos;s performance from every angle: use Overview for the big picture, Batting and Bowling for detailed player numbers, Fielding for dismissals, Records for team milestones, Achievements for progress, and History to review completed matches.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          { label: 'Matches', value: meSummary.matches },
          { label: 'Runs', value: meSummary.runs },
          { label: 'Avg', value: meSummary.battingAverage.toFixed(1) },
          { label: 'SR', value: meSummary.strikeRate.toFixed(1) },
          { label: 'Wickets', value: meSummary.wickets },
          { label: 'Economy', value: meSummary.economy.toFixed(2) },
          { label: 'Catches', value: meSummary.catches },
        ].map((item) => (
          <Card key={item.label} className="p-4 text-center border-[var(--card-border)] bg-[var(--surface)]">
            <p className="text-xl font-black text-[var(--text)]">{item.value}</p>
            <span className="mt-1 block text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">{item.label}</span>
          </Card>
        ))}
      </div>

      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <Card className="p-5 border-[var(--card-border)] bg-gradient-to-br from-[var(--surface)] to-[var(--card)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">Performance trend</p>
                  <h2 className="text-lg font-black text-[var(--text)]">Runs</h2>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-1">
                  {['Runs', 'SR', 'Wickets', 'Economy'].map((key) => (
                    <span key={key} className="px-2 py-1 rounded-lg text-[10px] font-bold text-[var(--text-secondary)]">
                      {key}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex h-36 items-end gap-2">
                {performanceTrend.length > 0 ? (
                  performanceTrend.map((point, index) => (
                    <div key={`${point.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-28 w-full items-end justify-center">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-[var(--primary)] to-[var(--teal)]"
                          style={{ height: `${(point.value / maxTrendValue) * 100}%`, minHeight: point.value > 0 ? '16px' : '4px' }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text-muted)]">{point.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex h-28 items-center justify-center text-xs text-[var(--text-muted)]">No completed matches in this scope.</div>
                )}
              </div>
            </Card>

            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">Recent form</p>
                  <h2 className="text-lg font-black text-[var(--text)]">Form</h2>
                </div>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>

              <div className="mt-5 flex gap-2">
                {performanceTrend.length > 0 ? (
                  performanceTrend.map((point, index) => {
                    const status = point.value >= 50 ? 'W' : point.value >= 20 ? 'D' : 'L';
                    return (
                      <div key={`form-${index}`} className="flex flex-1 flex-col items-center gap-2">
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black',
                            status === 'W'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : status === 'D'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-red-500/15 text-red-400'
                          )}
                        >
                          {status}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{point.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">No recent form available.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-lg font-black text-[var(--text)]">Batting</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Runs</span><strong>{meSummary.runs}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Avg</span><strong>{meSummary.battingAverage.toFixed(1)}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">SR</span><strong>{meSummary.strikeRate.toFixed(1)}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">HS</span><strong>{meSummary.highestScore}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">50s</span><strong>{meSummary.fifties}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">100s</span><strong>{meSummary.hundreds}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">4s</span><strong>{meSummary.fours}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">6s</span><strong>{meSummary.sixes}</strong></div>
              </div>
            </Card>

            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-lg font-black text-[var(--text)]">Bowling</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Wickets</span><strong>{meSummary.wickets}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Overs</span><strong>{meSummary.overs.toFixed(1)}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Economy</span><strong>{meSummary.economy.toFixed(2)}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Avg</span><strong>{meSummary.bowlingAverage.toFixed(1)}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Best</span><strong>{meSummary.bestFigures}</strong></div>
              </div>
            </Card>

            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-lg font-black text-[var(--text)]">Fielding</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Catches</span><strong>{meSummary.catches}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Run Outs</span><strong>{meSummary.runOuts}</strong></div>
                <div className="flex items-center justify-between"><span className="text-[var(--text-muted)]">Stumpings</span><strong>0</strong></div>
              </div>
            </Card>
          </div>

          <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">My team breakdown</p>
                <h2 className="text-lg font-black text-[var(--text)]">Team contribution</h2>
              </div>
              <Badge variant="primary" size="sm">{availableTeams.length} teams</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--card-border)] text-[var(--text-muted)]">
                    <th className="py-2 pr-4 font-bold">Team</th>
                    <th className="py-2 pr-4 font-bold">Matches</th>
                    <th className="py-2 pr-4 font-bold">Runs</th>
                    <th className="py-2 pr-4 font-bold">Wickets</th>
                    <th className="py-2 pr-4 font-bold">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {teamBreakdown.map((row) => (
                    <tr key={row.teamName} className="border-b border-[var(--card-border)] last:border-0">
                      <td className="py-3 pr-4 font-bold text-[var(--text)]">{row.teamName}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{row.matches}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{row.runs}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{row.wickets}</td>
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">{row.strikeRate.toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--card)]/50">
                    <td className="py-3 pr-4 font-black text-[var(--text)]">All Teams</td>
                    <td className="py-3 pr-4 font-black text-[var(--text)]">{allTeamsTotal.matches}</td>
                    <td className="py-3 pr-4 font-black text-[var(--text)]">{allTeamsTotal.runs}</td>
                    <td className="py-3 pr-4 font-black text-[var(--text)]">{allTeamsTotal.wickets}</td>
                    <td className="py-3 pr-4 font-black text-[var(--text)]">{(allTeamsTotal.runs / Math.max(allTeamsTotal.matches, 1)).toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">Team leaderboard</p>
                  <h2 className="text-lg font-black text-[var(--text)]">Rankings</h2>
                </div>
                <div className="flex rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
                  {(['batting', 'bowling', 'fielding'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setLeaderboardTab(tab)}
                      className={cn(
                        'rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider',
                        leaderboardTab === tab ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {(leaderboard[leaderboardTab] || []).map((entry, index) => (
                  <div key={`${leaderboardTab}-${entry.member.id}`} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[10px] font-black text-[var(--primary)]">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[var(--text)]">{entry.member.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{entry.teamName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[var(--text)]">
                        {leaderboardTab === 'batting' ? entry.runs : leaderboardTab === 'bowling' ? entry.wickets : entry.catches + entry.runOuts}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">{leaderboardTab === 'batting' ? 'runs' : leaderboardTab === 'bowling' ? 'wickets' : 'fielding'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-[var(--card-border)] bg-[var(--surface)]">
              <div className="mb-4">
                <p className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">Compare players</p>
                <h2 className="text-lg font-black text-[var(--text)]">Player comparison</h2>
              </div>

              <select
                value={comparePlayerId || comparisonOptions[0]?.id || ''}
                onChange={(event) => setComparePlayerId(event.target.value)}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none"
              >
                {comparisonOptions.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              {comparisonMember ? (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-[var(--card)] px-3 py-2">
                    <span className="text-[var(--text-muted)]">You</span>
                    <strong>{meSummary.runs}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[var(--card)] px-3 py-2">
                    <span className="text-[var(--text-muted)]">{comparisonMember.member.name}</span>
                    <strong>{comparisonMember.runs}</strong>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      ['Matches', meSummary.matches, comparisonMember.matches],
                      ['Runs', meSummary.runs, comparisonMember.runs],
                      ['Average', meSummary.battingAverage.toFixed(1), comparisonMember.battingAverage.toFixed(1)],
                      ['SR', meSummary.strikeRate.toFixed(1), comparisonMember.strikeRate.toFixed(1)],
                    ].map(([label, left, right]) => (
                      <div key={String(label)}>
                        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          <span>{label}</span>
                          <span>{left} / {right}</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-2 rounded-full bg-[var(--primary)]/30" style={{ width: `${Math.min(Number(left) / Math.max(Number(right), 1) * 100, 100)}%` }} />
                          <div className="h-2 rounded-full bg-[var(--teal)]/30" style={{ width: `${Math.min(Number(right) / Math.max(Number(left), 1) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-[var(--text-muted)]">No teammate available to compare.</p>
              )}
            </Card>
          </div>
        </>
      )}

      {activeView === 'batting' && (
        <Card className="p-0 overflow-hidden border-[var(--card-border)]">
          <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">Team Batting Leaderboard</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Ranked by total runs scored across completed fixtures.</p>
            </div>
            <span className="text-xs text-[var(--text-muted)]">{leaderboard.batting.length} Players</span>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--card-border)]"><tr><th className="py-3 px-6">Player</th><th className="py-3 px-3 text-right">Innings</th><th className="py-3 px-3 text-right">Runs</th><th className="py-3 px-3 text-right">Balls</th><th className="py-3 px-3 text-right">Average</th><th className="py-3 px-3 text-right">SR</th><th className="py-3 px-3 text-right">HS</th><th className="py-3 px-3 text-right">4s</th><th className="py-3 px-3 text-right">6s</th><th className="py-3 px-3 text-right">50s</th></tr></thead><tbody className="divide-y divide-[var(--card-border)] font-medium text-[var(--text)]">{leaderboard.batting.map((b) => (<tr key={b.member.id} className="hover:bg-[var(--card)]/40 transition-colors"><td className="py-3 px-6 font-bold">{b.member.name}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.matches}</td><td className="py-3 px-3 text-right font-black text-sm text-[var(--primary)]">{b.runs}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.balls}</td><td className="py-3 px-3 text-right font-semibold">{b.battingAverage.toFixed(1)}</td><td className="py-3 px-3 text-right">{b.strikeRate.toFixed(1)}</td><td className="py-3 px-3 text-right font-bold">{b.highestScore}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.fours}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.sixes}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.fifties}</td></tr>))}</tbody></table></div>
        </Card>
      )}

      {activeView === 'bowling' && (
        <Card className="p-0 overflow-hidden border-[var(--card-border)]">
          <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">Team Bowling Leaderboard</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Ranked by wickets taken and economy rate.</p>
            </div>
            <span className="text-xs text-[var(--text-muted)]">{leaderboard.bowling.length} Bowlers</span>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--card-border)]"><tr><th className="py-3 px-6">Bowler</th><th className="py-3 px-3 text-right">Overs</th><th className="py-3 px-3 text-right">Runs</th><th className="py-3 px-3 text-right">Wickets</th><th className="py-3 px-3 text-right">Economy</th><th className="py-3 px-3 text-right">Average</th><th className="py-3 px-3 text-right">Best</th></tr></thead><tbody className="divide-y divide-[var(--card-border)] font-medium text-[var(--text)]">{leaderboard.bowling.map((b) => (<tr key={b.member.id} className="hover:bg-[var(--card)]/40 transition-colors"><td className="py-3 px-6 font-bold">{b.member.name}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.overs.toFixed(1)}</td><td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.runs}</td><td className="py-3 px-3 text-right font-black text-sm text-teal-400">{b.wickets}</td><td className="py-3 px-3 text-right font-semibold">{b.economy.toFixed(2)}</td><td className="py-3 px-3 text-right">{b.bowlingAverage.toFixed(1)}</td><td className="py-3 px-3 text-right font-bold text-amber-400">{b.bestFigures}</td></tr>))}</tbody></table></div>
        </Card>
      )}

      {activeView === 'fielding' && (
        <Card className="p-0 overflow-hidden border-[var(--card-border)]">
          <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
            <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">Team Fielding Leaderboard</h3>
            <span className="text-xs text-[var(--text-muted)]">Catches, run-outs & stumpings</span>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--card-border)]"><tr><th className="py-3 px-6">Player</th><th className="py-3 px-4 text-right">Catches</th><th className="py-3 px-4 text-right">Run Outs</th><th className="py-3 px-6 text-right font-black">Total Dismissals</th></tr></thead><tbody className="divide-y divide-[var(--card-border)] font-medium text-[var(--text)]">{leaderboard.fielding.map((f) => (<tr key={f.member.id} className="hover:bg-[var(--card)]/40 transition-colors"><td className="py-3 px-6 font-bold">{f.member.name}</td><td className="py-3 px-4 text-right">{f.catches}</td><td className="py-3 px-4 text-right">{f.runOuts}</td><td className="py-3 px-6 text-right font-black text-sm text-[var(--primary)]">{f.catches + f.runOuts}</td></tr>))}</tbody></table></div>
        </Card>
      )}

      {activeView === 'records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4 border-[var(--card-border)]">
            <h3 className="text-base font-black text-[var(--text)] tracking-tight flex items-center gap-2"><Target className="w-4 h-4 text-[var(--primary)]" />Team Batting Records</h3>
            <div className="divide-y divide-[var(--card-border)] text-xs">
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Highest Individual Score</span><span className="font-bold text-[var(--text)]">{meSummary.highestScore} runs</span></div>
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Most Career Runs</span><span className="font-bold text-[var(--text)]">{leaderboard.batting[0]?.runs ?? 0} runs</span></div>
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Most Fours</span><span className="font-bold text-[var(--text)]">{leaderboard.batting[0]?.fours ?? 0}</span></div>
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Most Sixes</span><span className="font-bold text-[var(--text)]">{leaderboard.batting[0]?.sixes ?? 0}</span></div>
            </div>
          </Card>
          <Card className="p-6 space-y-4 border-[var(--card-border)]">
            <h3 className="text-base font-black text-[var(--text)] tracking-tight flex items-center gap-2"><Shield className="w-4 h-4 text-teal-400" />Team Bowling Records</h3>
            <div className="divide-y divide-[var(--card-border)] text-xs">
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Most Career Wickets</span><span className="font-bold text-[var(--text)]">{leaderboard.bowling[0]?.wickets ?? 0} wkts</span></div>
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Best Economy Rate</span><span className="font-bold text-[var(--text)]">{leaderboard.bowling[0]?.economy.toFixed(2) ?? '0.00'}</span></div>
              <div className="py-3 flex items-center justify-between"><span className="text-[var(--text-muted)]">Best Bowling</span><span className="font-bold text-teal-400">{leaderboard.bowling[0]?.bestFigures ?? '0/0'}</span></div>
            </div>
          </Card>
        </div>
      )}

      {activeView === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'runs', title: 'Centurion', description: 'Score 100+ in a match', icon: '🏏', unlocked: meSummary.hundreds > 0, progress: `${meSummary.hundreds} x 100` },
            { id: 'wickets', title: 'Wicket Hunter', description: 'Take 3+ wickets in a match', icon: '🎯', unlocked: meSummary.wickets >= 3, progress: `${meSummary.wickets} wickets` },
            { id: 'fielding', title: 'Sharp In The Field', description: 'Complete 3 dismissals', icon: '🧤', unlocked: meSummary.catches + meSummary.runOuts >= 3, progress: `${meSummary.catches + meSummary.runOuts} dismissals` },
          ].map((item) => (
            <Card key={item.id} className={cn('p-5 space-y-3 border transition-all', item.unlocked ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[var(--surface)] to-[var(--card)]' : 'border-[var(--card-border)] bg-[var(--surface)] opacity-60')}>
              <div className="flex items-center justify-between"><span className="text-3xl">{item.icon}</span><Badge variant={item.unlocked ? 'orange' : 'outline'} size="sm">{item.unlocked ? 'Unlocked' : 'In Progress'}</Badge></div>
              <div><h4 className="font-black text-sm text-[var(--text)]">{item.title}</h4><p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.description}</p></div>
              <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-[11px]"><span className="text-[var(--text-muted)]">Progress</span><span className="font-bold text-[var(--text)]">{item.progress}</span></div>
            </Card>
          ))}
        </div>
      )}

      {activeView === 'history' && (
        <Card className="p-0 overflow-hidden border-[var(--card-border)]">
          <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">Match History</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Recent completed fixtures in view.</p>
            </div>
            <span className="text-xs text-[var(--text-muted)]">{visibleMatches.length} Matches</span>
          </div>
          <div className="divide-y divide-[var(--card-border)]">
            {visibleMatches.length > 0 ? visibleMatches.map((match) => {
              const stat = match.playerStats.find((item) => item.playerId === currentMember.id || item.playerId === currentMember.userId || item.playerName.toLowerCase() === currentMember.name.toLowerCase());
              return (
                <div key={match.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--card)]/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-2"><span className={cn('text-xs font-black uppercase px-2 py-0.5 rounded border', match.result === 'win' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : match.result === 'loss' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')}>{match.result?.toUpperCase()}</span><span className="font-bold text-sm text-[var(--text)]">vs {match.opponentName}</span></div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{match.date} • {stat?.runs ?? 0} runs • {stat?.wickets ?? 0} wickets • {stat?.catches ?? 0} catches</p>
                  </div>
                  <Link href={`/player/matches/${match.id}`} className="text-xs font-bold text-[var(--primary)] hover:underline">View scorecard</Link>
                </div>
              );
            }) : <div className="p-8 text-center text-xs text-[var(--text-muted)]">No completed matches found matching the selected filters.</div>}
          </div>
        </Card>
      )}
    </div>
  );
}
