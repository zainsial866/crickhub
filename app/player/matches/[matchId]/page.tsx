'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  MessageSquare,
  Pencil,
  Radio,
  Send,
  Shield,
  Swords,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { cn } from '@/lib/utils';

type SubTab = 'summary' | 'scorecard' | 'squad' | 'stats' | 'chat';

export default function MatchDetailsPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();
  const {
    team,
    cricketMatches,
    memberships,
    approveCricketMatch,
    rejectCricketMatch,
    startLiveMatch,
    sendChatMessage,
  } = useTeams();

  const [activeTab, setActiveTab] = useState<SubTab>('summary');
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState<
    Array<{ id: string; sender: string; text: string; time: string }>
  >([
    { id: '1', sender: 'Zain Sial', text: 'Great bowling in the death overs, team!', time: '10:15 PM' },
    { id: '2', sender: 'Mueed Ahmad', text: 'Terrific captain’s knock at the top Zain 👏', time: '10:18 PM' },
  ]);

  const match = cricketMatches.find((item) => item.id === matchId);
  if (!match) return notFound();

  // Role check
  const currentMembership = memberships.find(
    (m) => m.teamId === match.teamId && (m.userId === 'user-player-1' || m.userId === team.captainId)
  );
  const isCaptain = currentMembership?.teamRole === 'captain' || team.captainId === 'user-player-1';
  const isVC = currentMembership?.teamRole === 'vice_captain';
  const canManage = isCaptain || isVC || currentMembership?.permissions.includes('create_matches');

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isPending = match.status === 'pending_approval';
  const isLocked = match.isOfficialLocked === true;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'Zain Sial',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl animate-in fade-in duration-200 pb-16">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/player/team/${match.teamId}/matches`}
          className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Team Matches
        </Link>
        <span className="text-[11px] text-[var(--text-muted)] font-mono">
          ID: {match.id}
        </span>
      </div>

      {/* HERO BANNER CARD */}
      <Card
        className={cn(
          'p-6 sm:p-8 border shadow-xl relative overflow-hidden',
          isLive
            ? 'bg-gradient-to-br from-red-950/30 via-[var(--surface)] to-[var(--card)] border-red-500/30'
            : isCompleted
            ? 'bg-gradient-to-br from-[var(--surface)] to-[var(--card)] border-[var(--card-border)]'
            : 'bg-[var(--surface)] border-[var(--card-border)]'
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Match
                </span>
              ) : isPending ? (
                <Badge variant="orange" size="sm">Pending Approval</Badge>
              ) : isCompleted ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Match Completed
                </span>
              ) : (
                <Badge variant="teal" size="sm">Scheduled</Badge>
              )}

              {isLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
                  <Lock className="w-3.5 h-3.5" /> Official / Locked
                </span>
              )}

              <Badge variant="primary" size="sm">
                {match.format || `${match.overs} overs`}
              </Badge>
              <span className="text-xs text-[var(--text-muted)] capitalize">
                {match.matchType} {match.competitionName ? `• ${match.competitionName}` : ''}
              </span>
            </div>

            {/* Teams Matchup Header */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
                {match.teamName} <span className="text-[var(--text-muted)] text-xl sm:text-2xl font-normal">vs</span> {match.opponentName}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {match.groundName} • <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" /> {match.date} at {match.time}
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isPending && canManage && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => approveCricketMatch(match.id)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Approve Fixture
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectCricketMatch(match.id)}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Decline
                </Button>
              </>
            )}

            {!isCompleted && !isLive && canManage && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startLiveMatch(match.id)}
                leftIcon={<Radio className="w-4 h-4 text-red-400" />}
              >
                Start Live Match
              </Button>
            )}

            {!isLocked && canManage && (
              <Link href={`/player/matches/${match.id}/stats`}>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Pencil className="w-4 h-4" />}
                >
                  {isCompleted ? 'Edit Scorecard' : 'Record Scorecard'}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Live / Completed Score Summary Board */}
        {match.teamScore !== undefined && (
          <div className="mt-6 pt-6 border-t border-[var(--card-border)] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[var(--text-muted)] block">
                  {match.teamName}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[var(--primary)] tracking-tight">
                  {match.teamScore}/{match.teamWickets ?? 0}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-semibold">
                ({match.teamOvers ?? match.overs} ov)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[var(--text-muted)] block">
                  {match.opponentName}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
                  {match.opponentScore ?? '—'}/{match.opponentWickets ?? '—'}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-semibold">
                ({match.opponentOvers ?? match.overs} ov)
              </span>
            </div>

            {match.result && (
              <div className="md:col-span-2 text-center py-1">
                <span className={cn(
                  'text-sm sm:text-base font-black tracking-tight',
                  match.result === 'win' ? 'text-emerald-400' : match.result === 'loss' ? 'text-red-400' : 'text-amber-400'
                )}>
                  🏆 {match.result === 'win' ? `${match.teamName} won by ${match.margin}` : match.result === 'loss' ? `${match.opponentName} won by ${match.margin}` : 'Fixture drawn'}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* SUB-TABS NAVIGATION: Summary | Scorecard | Squad | Statistics | Match Chat */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--card-border)]">
        {[
          { id: 'summary', label: 'Summary', icon: Trophy },
          { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
          { id: 'squad', label: `Squad (${match.squad.length})`, icon: Users },
          { id: 'stats', label: 'Statistics', icon: Swords },
          { id: 'chat', label: 'Match Chat', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SubTab)}
              className={cn(
                'px-4 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 shrink-0',
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text)]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TAB 1: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {match.summaryAwards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {match.summaryAwards.playerOfTheMatch && (
                <Card className="p-5 border-amber-500/30 bg-amber-500/5 space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Player of the Match
                  </span>
                  <p className="text-sm font-bold text-[var(--text)]">{match.summaryAwards.playerOfTheMatch}</p>
                </Card>
              )}

              {match.summaryAwards.topScorer && (
                <Card className="p-5 border-[var(--card-border)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                    Top Scorer
                  </span>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {match.summaryAwards.topScorer.name} ({match.summaryAwards.topScorer.runs} off {match.summaryAwards.topScorer.balls}b)
                  </p>
                </Card>
              )}

              {match.summaryAwards.bestBowler && (
                <Card className="p-5 border-[var(--card-border)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                    Best Bowler
                  </span>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {match.summaryAwards.bestBowler.name} ({match.summaryAwards.bestBowler.figures})
                  </p>
                </Card>
              )}

              {match.summaryAwards.highestPartnership && (
                <Card className="p-5 border-[var(--card-border)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                    Best Partnership
                  </span>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {match.summaryAwards.highestPartnership.runs} runs ({match.summaryAwards.highestPartnership.pair})
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Quick Scorecard Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 border-[var(--card-border)]">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
                Batting Performance
              </h3>
              <div className="divide-y divide-[var(--card-border)] text-xs">
                {(match.batting || []).map((b) => (
                  <div key={b.playerId} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text)]">{b.playerName}</span>
                      <span className="text-[11px] text-[var(--text-muted)] block">{b.dismissal}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-[var(--text)]">{b.runs}</span>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {b.balls}b • {b.fours}x4 {b.sixes}x6 • SR {b.strikeRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-[var(--card-border)]">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                Bowling Figures
              </h3>
              <div className="divide-y divide-[var(--card-border)] text-xs">
                {(match.bowling || []).map((bw) => (
                  <div key={bw.playerId} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text)]">{bw.playerName}</span>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Econ: {bw.economy} • Dots: {bw.dotBalls}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-teal-400">{bw.wickets}/{bw.runsConceded}</span>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {bw.overs} overs ({bw.maidens} M)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: FULL SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          {/* Batting Scorecard Table */}
          <Card className="p-0 overflow-hidden border-[var(--card-border)]">
            <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
                Batting Innings • {match.teamName}
              </h3>
              <span className="text-xs font-black text-[var(--primary)]">
                {match.teamScore}/{match.teamWickets ?? 0} ({match.teamOvers ?? match.overs} ov)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--card-border)]">
                  <tr>
                    <th className="py-3 px-6">Batter</th>
                    <th className="py-3 px-3">Dismissal</th>
                    <th className="py-3 px-3 text-right">R</th>
                    <th className="py-3 px-3 text-right">B</th>
                    <th className="py-3 px-3 text-right">4s</th>
                    <th className="py-3 px-3 text-right">6s</th>
                    <th className="py-3 px-6 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] font-medium text-[var(--text)]">
                  {(match.batting || []).map((b) => (
                    <tr key={b.playerId} className="hover:bg-[var(--card)]/40 transition-colors">
                      <td className="py-3 px-6 font-bold">{b.playerName}</td>
                      <td className="py-3 px-3 text-[var(--text-secondary)] text-[11px]">{b.dismissal}</td>
                      <td className="py-3 px-3 text-right font-black text-sm">{b.runs}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.balls}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.fours}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{b.sixes}</td>
                      <td className="py-3 px-6 text-right font-semibold text-[var(--primary)]">{b.strikeRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Extras Summary */}
            {match.extras && (
              <div className="px-6 py-3 border-t border-[var(--card-border)] bg-[var(--surface)]/40 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Extras: <strong>{match.extras.total}</strong> (w {match.extras.wides}, nb {match.extras.noBalls}, b {match.extras.byes}, lb {match.extras.legByes})</span>
                <span>Total Overs: <strong>{match.teamOvers ?? match.overs}</strong></span>
              </div>
            )}
          </Card>

          {/* Fall of Wickets Timeline */}
          {match.fallOfWickets && match.fallOfWickets.length > 0 && (
            <Card className="p-6 space-y-3 border-[var(--card-border)]">
              <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">
                Fall of Wickets
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {match.fallOfWickets.map((fow) => (
                  <div key={fow.wicketNumber} className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--card-border)] text-xs">
                    <span className="font-black text-[var(--primary)]">{fow.wicketNumber}-{fow.score}</span>{' '}
                    <span className="text-[var(--text-secondary)] font-medium">({fow.playerName}, {fow.overs} ov)</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Bowling Figures Table */}
          <Card className="p-0 overflow-hidden border-[var(--card-border)]">
            <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80">
              <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
                Bowling Figures
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)] border-b border-[var(--card-border)]">
                  <tr>
                    <th className="py-3 px-6">Bowler</th>
                    <th className="py-3 px-3 text-right">O</th>
                    <th className="py-3 px-3 text-right">M</th>
                    <th className="py-3 px-3 text-right">R</th>
                    <th className="py-3 px-3 text-right">W</th>
                    <th className="py-3 px-3 text-right">Econ</th>
                    <th className="py-3 px-3 text-right">Dots</th>
                    <th className="py-3 px-6 text-right">Wides/NB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)] font-medium text-[var(--text)]">
                  {(match.bowling || []).map((bw) => (
                    <tr key={bw.playerId} className="hover:bg-[var(--card)]/40 transition-colors">
                      <td className="py-3 px-6 font-bold">{bw.playerName}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{bw.overs}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{bw.maidens}</td>
                      <td className="py-3 px-3 text-right font-semibold">{bw.runsConceded}</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-400 text-sm">{bw.wickets}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{bw.economy}</td>
                      <td className="py-3 px-3 text-right text-[var(--text-muted)]">{bw.dotBalls}</td>
                      <td className="py-3 px-6 text-right text-[var(--text-muted)]">{bw.wides}/{bw.noBalls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Partnerships */}
          {match.partnerships && match.partnerships.length > 0 && (
            <Card className="p-6 space-y-3 border-[var(--card-border)]">
              <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">
                Batting Partnerships
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {match.partnerships.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[var(--text)] block">{p.player1Name} & {p.player2Name}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{p.balls} balls • Run rate {p.runRate}</span>
                    </div>
                    <span className="text-sm font-black text-[var(--primary)]">{p.runs} runs</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: SQUAD */}
      {activeTab === 'squad' && (
        <Card className="p-6 space-y-6 border-[var(--card-border)]">
          <div>
            <h3 className="text-base font-black text-[var(--text)] tracking-tight">
              Match Day Squad ({match.squad.length} Players)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Confirmed team roster and starting lineup for this fixture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team.members
              .filter((m) => match.squad.includes(m.id) || (m.userId !== undefined && match.squad.includes(m.userId)))
              .map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center font-bold text-xs text-[var(--text)] shrink-0">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[var(--text)] truncate">{member.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] capitalize">
                      {member.role.replace('_', ' ')} • {member.playingRole?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* TAB 4: STATISTICS & COMPARISONS */}
      {activeTab === 'stats' && (
        <Card className="p-6 space-y-6 border-[var(--card-border)]">
          <h3 className="text-base font-black text-[var(--text)] tracking-tight">
            Match Head-to-Head Analysis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Runs from Boundaries</span>
              <span className="text-2xl font-black text-[var(--primary)] mt-1 block">
                {(match.batting || []).reduce((acc, b) => acc + b.fours * 4 + b.sixes * 6, 0)}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {(match.batting || []).reduce((acc, b) => acc + b.fours, 0)} Fours • {(match.batting || []).reduce((acc, b) => acc + b.sixes, 0)} Sixes
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Innings Run Rate</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {match.teamScore && match.overs ? (match.teamScore / match.overs).toFixed(2) : '—'}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">runs per over</span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Dot Balls Bowled</span>
              <span className="text-2xl font-black text-teal-400 mt-1 block">
                {(match.bowling || []).reduce((acc, bw) => acc + bw.dotBalls, 0)}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">pressure deliveries</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: MATCH CHAT */}
      {activeTab === 'chat' && (
        <Card className="p-6 space-y-4 border-[var(--card-border)]">
          <div>
            <h3 className="text-base font-black text-[var(--text)] tracking-tight">
              Fixture Chat Room
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Team discussion regarding tactics, ground timings, and post-match debrief.
            </p>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {localMessages.map((msg) => (
              <div key={msg.id} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--primary)]">{msg.sender}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{msg.time}</span>
                </div>
                <p className="text-xs text-[var(--text)] mt-1 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-[var(--card-border)]">
            <input
              type="text"
              placeholder="Send message to match squad..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            />
            <Button type="submit" size="sm" variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Send
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}