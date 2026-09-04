'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Save,
  Trophy,
  AlertTriangle,
  Users,
  ShieldAlert,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import {
  BattingScorecardEntry,
  BowlingScorecardEntry,
  FieldingScorecardEntry,
  MatchExtras,
  CricketMatch,
} from '@/types';
import { cn } from '@/lib/utils';

export default function RecordMatchStatsPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();
  const {
    team,
    cricketMatches,
    saveMatchScorecard,
    finalizeMatch,
    memberships,
  } = useTeams();

  const match = cricketMatches.find((m) => m.id === matchId);

  // Check if locked
  const isLocked = match?.isOfficialLocked === true;

  // Form State: Totals
  const [teamScore, setTeamScore] = useState<number>(match?.teamScore ?? 142);
  const [teamWickets, setTeamWickets] = useState<number>(match?.teamWickets ?? 6);
  const [teamOvers, setTeamOvers] = useState<number>(match?.teamOvers ?? match?.overs ?? 10);
  const [opponentScore, setOpponentScore] = useState<number>(match?.opponentScore ?? 128);
  const [opponentWickets, setOpponentWickets] = useState<number>(match?.opponentWickets ?? 9);
  const [opponentOvers, setOpponentOvers] = useState<number>(match?.opponentOvers ?? match?.overs ?? 10);
  const [customMargin, setCustomMargin] = useState<string>(match?.margin || '');

  // Form State: Extras
  const [extras, setExtras] = useState<MatchExtras>(
    match?.extras || { wides: 6, noBalls: 2, byes: 1, legByes: 1, total: 10 }
  );

  // Form State: Batters
  const squadMembers = useMemo(() => {
    if (!match) return [];
    return team.members.filter((m) => match.squad.includes(m.id) || (m.userId !== undefined && match.squad.includes(m.userId)));
  }, [match, team.members]);

  const [battingList, setBattingList] = useState<BattingScorecardEntry[]>(() => {
    if (match?.batting && match.batting.length > 0) return match.batting;
    return squadMembers.map((m) => ({
      playerId: m.id,
      playerName: m.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      dismissal: 'not out',
      isNotOut: true,
      dotBalls: 0,
    }));
  });

  // Form State: Bowlers
  const [bowlingList, setBowlingList] = useState<BowlingScorecardEntry[]>(() => {
    if (match?.bowling && match.bowling.length > 0) return match.bowling;
    return squadMembers.map((m) => ({
      playerId: m.id,
      playerName: m.name,
      overs: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      dotBalls: 0,
      wides: 0,
      noBalls: 0,
    }));
  });

  // Form State: Fielders
  const [fieldingList, setFieldingList] = useState<FieldingScorecardEntry[]>(() => {
    if (match?.fielding && match.fielding.length > 0) return match.fielding;
    return squadMembers.map((m) => ({
      playerId: m.id,
      playerName: m.name,
      catches: 0,
      runOuts: 0,
      stumpings: 0,
      totalDismissals: 0,
    }));
  });

  // Form State: Player of the Match
  const [potm, setPotm] = useState<string>(
    match?.summaryAwards?.playerOfTheMatch || 'Zain Sial'
  );

  // Modal State
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!match) {
    return (
      <Card className="p-8 text-center text-xs text-[var(--text-muted)]">
        Match fixture not found.
      </Card>
    );
  }

  // Handle Batting changes
  const updateBatting = (index: number, field: keyof BattingScorecardEntry, val: any) => {
    setBattingList((prev) => {
      const copy = [...prev];
      const current = { ...copy[index], [field]: val };
      if (field === 'runs' || field === 'balls') {
        const r = field === 'runs' ? Number(val) : current.runs;
        const b = field === 'balls' ? Number(val) : current.balls;
        current.strikeRate = b > 0 ? Number(((r / b) * 100).toFixed(1)) : 0;
      }
      if (field === 'isNotOut' && val === true) {
        current.dismissal = 'not out';
      }
      copy[index] = current;
      return copy;
    });
  };

  // Handle Bowling changes
  const updateBowling = (index: number, field: keyof BowlingScorecardEntry, val: any) => {
    setBowlingList((prev) => {
      const copy = [...prev];
      const current = { ...copy[index], [field]: val };
      if (field === 'overs' || field === 'runsConceded') {
        const o = field === 'overs' ? Number(val) : current.overs;
        const r = field === 'runsConceded' ? Number(val) : current.runsConceded;
        current.economy = o > 0 ? Number((r / o).toFixed(2)) : 0;
      }
      copy[index] = current;
      return copy;
    });
  };

  // Handle Fielding changes
  const updateFielding = (index: number, field: keyof FieldingScorecardEntry, val: any) => {
    setFieldingList((prev) => {
      const copy = [...prev];
      const current = { ...copy[index], [field]: Number(val) || 0 };
      current.totalDismissals = current.catches + current.runOuts + current.stumpings;
      copy[index] = current;
      return copy;
    });
  };

  const calculateResult = () => {
    if (teamScore > opponentScore) {
      const runsDiff = teamScore - opponentScore;
      return {
        result: 'win' as const,
        margin: customMargin.trim() || `${runsDiff} runs`,
      };
    } else if (teamScore < opponentScore) {
      const diff = opponentScore - teamScore;
      return {
        result: 'loss' as const,
        margin: customMargin.trim() || `${diff} runs`,
      };
    }
    return {
      result: 'draw' as const,
      margin: 'level score',
    };
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const { result, margin } = calculateResult();

    // Map backwards-compatible playerStats
    const playerStats = squadMembers.map((m) => {
      const bat = battingList.find((b) => b.playerId === m.id);
      const bowl = bowlingList.find((b) => b.playerId === m.id);
      const fld = fieldingList.find((f) => f.playerId === m.id);
      return {
        playerId: m.id,
        playerName: m.name,
        runs: bat?.runs || 0,
        balls: bat?.balls || 0,
        fours: bat?.fours || 0,
        sixes: bat?.sixes || 0,
        overs: bowl?.overs || 0,
        bowlingRuns: bowl?.runsConceded || 0,
        wickets: bowl?.wickets || 0,
        catches: fld?.catches || 0,
        runOuts: fld?.runOuts || 0,
      };
    });

    saveMatchScorecard(match.id, {
      teamScore,
      teamWickets,
      teamOvers,
      opponentScore,
      opponentWickets,
      opponentOvers,
      result,
      margin,
      extras,
      batting: battingList,
      bowling: bowlingList,
      fielding: fieldingList,
      summaryAwards: {
        playerOfTheMatch: potm,
      },
      playerStats,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleConfirmFinalize = () => {
    const { result, margin } = calculateResult();

    const playerStats = squadMembers.map((m) => {
      const bat = battingList.find((b) => b.playerId === m.id);
      const bowl = bowlingList.find((b) => b.playerId === m.id);
      const fld = fieldingList.find((f) => f.playerId === m.id);
      return {
        playerId: m.id,
        playerName: m.name,
        runs: bat?.runs || 0,
        balls: bat?.balls || 0,
        fours: bat?.fours || 0,
        sixes: bat?.sixes || 0,
        overs: bowl?.overs || 0,
        bowlingRuns: bowl?.runsConceded || 0,
        wickets: bowl?.wickets || 0,
        catches: fld?.catches || 0,
        runOuts: fld?.runOuts || 0,
      };
    });

    finalizeMatch(
      match.id,
      {
        teamScore,
        teamWickets,
        teamOvers,
        opponentScore,
        opponentWickets,
        opponentOvers,
        result,
        margin,
        extras,
        batting: battingList,
        bowling: bowlingList,
        fielding: fieldingList,
        summaryAwards: {
          playerOfTheMatch: potm,
        },
        playerStats,
      },
      'Zain Sial (Captain)'
    );

    setIsFinalizeModalOpen(false);
    router.push(`/player/matches/${match.id}`);
  };

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Back button & Header */}
      <div className="space-y-2">
        <Link
          href={`/player/matches/${match.id}`}
          className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Match
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
              Record Official Scorecard
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              {match.teamName} vs {match.opponentName} • {match.groundName}
            </p>
          </div>
          {isLocked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
              <Lock className="w-3.5 h-3.5" /> Permanently Locked (Official)
            </span>
          )}
        </div>
      </div>

      {/* LOCKED NOTICE */}
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold">This match has been officially finalized and locked.</p>
            <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
              To preserve team ranking and player statistical integrity, scores and player records can no longer be edited.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: MATCH TOTALS & RESULT */}
      <Card className="p-6 space-y-4 border-[var(--card-border)]">
        <h3 className="text-base font-black text-[var(--text)] tracking-tight">
          Match Totals & Result
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Team Score */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-3">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider block">
              {match.teamName}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Runs</label>
                <input
                  type="number"
                  disabled={isLocked}
                  value={teamScore}
                  onChange={(e) => setTeamScore(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Wickets</label>
                <input
                  type="number"
                  disabled={isLocked}
                  value={teamWickets}
                  onChange={(e) => setTeamWickets(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Overs</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={isLocked}
                  value={teamOvers}
                  onChange={(e) => setTeamOvers(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>

          {/* Opponent Score */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] space-y-3">
            <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              {match.opponentName}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Runs</label>
                <input
                  type="number"
                  disabled={isLocked}
                  value={opponentScore}
                  onChange={(e) => setOpponentScore(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Wickets</label>
                <input
                  type="number"
                  disabled={isLocked}
                  value={opponentWickets}
                  onChange={(e) => setOpponentWickets(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Overs</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={isLocked}
                  value={opponentOvers}
                  onChange={(e) => setOpponentOvers(Number(e.target.value))}
                  className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm font-black text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extras Row */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
            Extras Breakdown (Team Innings)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Wides (W)</span>
              <input
                type="number"
                disabled={isLocked}
                value={extras.wides}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setExtras((prev) => ({ ...prev, wides: w, total: w + prev.noBalls + prev.byes + prev.legByes }));
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text)]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">No-Balls (NB)</span>
              <input
                type="number"
                disabled={isLocked}
                value={extras.noBalls}
                onChange={(e) => {
                  const nb = Number(e.target.value);
                  setExtras((prev) => ({ ...prev, noBalls: nb, total: prev.wides + nb + prev.byes + prev.legByes }));
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text)]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Byes (B)</span>
              <input
                type="number"
                disabled={isLocked}
                value={extras.byes}
                onChange={(e) => {
                  const b = Number(e.target.value);
                  setExtras((prev) => ({ ...prev, byes: b, total: prev.wides + prev.noBalls + b + prev.legByes }));
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text)]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Leg Byes (LB)</span>
              <input
                type="number"
                disabled={isLocked}
                value={extras.legByes}
                onChange={(e) => {
                  const lb = Number(e.target.value);
                  setExtras((prev) => ({ ...prev, legByes: lb, total: prev.wides + prev.noBalls + prev.byes + lb }));
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text)]"
              />
            </div>
            <div>
              <span className="text-[10px] text-[var(--primary)] uppercase font-bold block mb-1">Total Extras</span>
              <input
                readOnly
                value={extras.total}
                className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--primary)]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: BATTING SCORECARD (PLAYER-BY-PLAYER) */}
      <Card className="p-0 overflow-hidden border-[var(--card-border)]">
        <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
          <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
            1. Batting Innings Performance
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            Runs, balls, boundaries & dismissal
          </span>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)]">
              <tr>
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-2 w-20">Runs</th>
                <th className="py-2.5 px-2 w-20">Balls</th>
                <th className="py-2.5 px-2 w-16">4s</th>
                <th className="py-2.5 px-2 w-16">6s</th>
                <th className="py-2.5 px-2 w-20">SR</th>
                <th className="py-2.5 px-3">Dismissal Description</th>
                <th className="py-2.5 px-2 text-center w-24">Not Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {battingList.map((entry, idx) => (
                <tr key={entry.playerId} className="hover:bg-[var(--card)]/30">
                  <td className="py-2.5 px-3 font-bold text-[var(--text)]">{entry.playerName}</td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.runs}
                      onChange={(e) => updateBatting(idx, 'runs', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs font-bold"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.balls}
                      onChange={(e) => updateBatting(idx, 'balls', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.fours}
                      onChange={(e) => updateBatting(idx, 'fours', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.sixes}
                      onChange={(e) => updateBatting(idx, 'sixes', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-[var(--primary)]">
                    {entry.strikeRate}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      disabled={isLocked}
                      placeholder="e.g. c Mueed b Hamza"
                      value={entry.dismissal}
                      onChange={(e) => updateBatting(idx, 'dismissal', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="checkbox"
                      disabled={isLocked}
                      checked={entry.isNotOut}
                      onChange={(e) => updateBatting(idx, 'isNotOut', e.target.checked)}
                      className="accent-[var(--primary)] w-4 h-4 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 3: BOWLING FIGURES */}
      <Card className="p-0 overflow-hidden border-[var(--card-border)]">
        <div className="px-6 py-4 border-b border-[var(--card-border)] bg-[var(--surface)]/80 flex items-center justify-between">
          <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-wider">
            2. Bowling Figures
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            Overs, maidens, runs conceded & wickets
          </span>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[var(--card)]/60 text-[10px] uppercase font-bold text-[var(--text-muted)]">
              <tr>
                <th className="py-2.5 px-3">Bowler</th>
                <th className="py-2.5 px-2 w-20">Overs</th>
                <th className="py-2.5 px-2 w-20">Maidens</th>
                <th className="py-2.5 px-2 w-20">Runs</th>
                <th className="py-2.5 px-2 w-20">Wickets</th>
                <th className="py-2.5 px-2 w-20">Econ</th>
                <th className="py-2.5 px-2 w-20">Dots</th>
                <th className="py-2.5 px-2 w-20">Wides</th>
                <th className="py-2.5 px-2 w-20">No-Balls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {bowlingList.map((entry, idx) => (
                <tr key={entry.playerId} className="hover:bg-[var(--card)]/30">
                  <td className="py-2.5 px-3 font-bold text-[var(--text)]">{entry.playerName}</td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      step="0.1"
                      disabled={isLocked}
                      value={entry.overs}
                      onChange={(e) => updateBowling(idx, 'overs', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.maidens}
                      onChange={(e) => updateBowling(idx, 'maidens', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.runsConceded}
                      onChange={(e) => updateBowling(idx, 'runsConceded', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.wickets}
                      onChange={(e) => updateBowling(idx, 'wickets', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs font-bold text-emerald-400"
                    />
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-[var(--primary)]">
                    {entry.economy}
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.dotBalls}
                      onChange={(e) => updateBowling(idx, 'dotBalls', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.wides}
                      onChange={(e) => updateBowling(idx, 'wides', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={entry.noBalls}
                      onChange={(e) => updateBowling(idx, 'noBalls', e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 4: FIELDING & AWARDS */}
      <Card className="p-6 space-y-4 border-[var(--card-border)]">
        <h3 className="text-base font-black text-[var(--text)] tracking-tight">
          3. Fielding & Match Awards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Player of the Match
            </label>
            <input
              type="text"
              disabled={isLocked}
              placeholder="e.g. Zain Sial (52 runs & 3/18)"
              value={potm}
              onChange={(e) => setPotm(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Custom Victory Margin Override (Optional)
            </label>
            <input
              type="text"
              disabled={isLocked}
              placeholder="e.g. 14 runs or 3 wickets"
              value={customMargin}
              onChange={(e) => setCustomMargin(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>
      </Card>

      {/* ACTION TOOLBAR */}
      {!isLocked && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--card-border)]">
          <div>
            {savedNotice && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Draft scorecard saved successfully.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={() => setIsFinalizeModalOpen(true)}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Finalize & Lock Match
            </Button>
          </div>
        </div>
      )}

      {/* FINALIZE CONFIRMATION MODAL */}
      {isFinalizeModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFinalizeModalOpen(false)}
          title="Finalize & Lock Official Match"
          description="Are you ready to submit the final official scorecard?"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
              <p className="font-black text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                Permanent Official Lock Policy
              </p>
              <p className="leading-relaxed text-[11px] text-[var(--text-secondary)]">
                Once finalized, this fixture status transitions to <strong>Completed</strong> and the scorecard is <strong>locked permanently</strong>. No edits can be made afterwards, and all player performances will permanently update team records and statistics.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--card-border)] text-xs space-y-1">
              <p className="font-bold text-[var(--text)]">Summary of Result:</p>
              <p className="text-[var(--primary)] font-black text-sm">
                {teamScore > opponentScore
                  ? `${team.name} WON (${teamScore}/${teamWickets} vs ${opponentScore}/${opponentWickets})`
                  : teamScore < opponentScore
                  ? `${match.opponentName} WON (${opponentScore}/${opponentWickets} vs ${teamScore}/${teamWickets})`
                  : 'DRAW (Level Score)'}
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[var(--card-border)]">
              <Button variant="secondary" onClick={() => setIsFinalizeModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmFinalize}>
                Confirm & Lock Official Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}