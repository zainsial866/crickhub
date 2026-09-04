'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { MatchType } from '@/types';
import { cn } from '@/lib/utils';

export default function NewMatchPage() {
  const router = useRouter();
  const {
    team,
    createCricketMatch,
    memberships,
    publicTeams,
  } = useTeams();
  const grounds = useAppStore((state) => state.grounds);

  // Form State
  const [opponentName, setOpponentName] = useState('Rawalpindi Smashers');
  const [selectedOpponentTeamId, setSelectedOpponentTeamId] = useState('');
  const [date, setDate] = useState('2026-09-18');
  const [time, setTime] = useState('8:30 PM');
  const [groundName, setGroundName] = useState('F-6 Box Arena');
  const [selectedGroundId, setSelectedGroundId] = useState('ground-1');
  const [matchType, setMatchType] = useState<MatchType>('friendly');
  const [competitionName, setCompetitionName] = useState('');
  const [overs, setOvers] = useState(10);
  const [format, setFormat] = useState('10 overs');
  const [notes, setNotes] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string[]>(
    team.members.map((m) => m.id)
  );
  const [playingXI, setPlayingXI] = useState<string[]>(
    team.members.slice(0, 6).map((m) => m.id)
  );

  // Permissions calculation
  const currentMembership = memberships.find(
    (m) => m.teamId === team.id && (m.userId === 'user-player-1' || m.userId === team.captainId)
  );
  const isCaptain = currentMembership?.teamRole === 'captain' || team.captainId === 'user-player-1';
  const isVC = currentMembership?.teamRole === 'vice_captain';
  const hasDirectCreate = isCaptain || isVC || currentMembership?.permissions.includes('create_matches');

  const toggleSquadMember = (memberId: string) => {
    if (selectedSquad.includes(memberId)) {
      setSelectedSquad((prev) => prev.filter((id) => id !== memberId));
      setPlayingXI((prev) => prev.filter((id) => id !== memberId));
    } else {
      setSelectedSquad((prev) => [...prev, memberId]);
      if (playingXI.length < 6) {
        setPlayingXI((prev) => [...prev, memberId]);
      }
    }
  };

  const togglePlayingXI = (memberId: string) => {
    if (playingXI.includes(memberId)) {
      setPlayingXI((prev) => prev.filter((id) => id !== memberId));
    } else {
      setPlayingXI((prev) => [...prev, memberId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName.trim() || selectedSquad.length === 0) return;

    createCricketMatch(
      {
        opponentName: opponentName.trim(),
        opponentTeamId: selectedOpponentTeamId || undefined,
        groundName,
        groundId: selectedGroundId,
        date,
        time,
        overs,
        format,
        matchType,
        competitionName: competitionName.trim() || undefined,
        notes: notes.trim() || undefined,
        squad: selectedSquad,
        playingXI,
        bench: selectedSquad.filter((id) => !playingXI.includes(id)),
      },
      !hasDirectCreate // requires approval if player lacks direct creation rights
    );

    router.push(`/player/team/${team.id}/matches`);
  };

  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Back button & Title */}
      <div className="space-y-2">
        <Link
          href={`/player/team/${team.id}/matches`}
          className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matches
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
          Create Match Fixture
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Schedule a match for {team.name} and configure your starting squad.
        </p>
      </div>

      {/* Permission Notice Banner */}
      <div className={cn(
        'p-4 rounded-2xl border text-xs flex items-start gap-3',
        hasDirectCreate
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      )}>
        {hasDirectCreate ? (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        )}
        <div>
          {hasDirectCreate ? (
            <p>
              <strong>Direct Creation:</strong> As {isCaptain ? 'Captain' : isVC ? 'Vice Captain' : 'Authorized Player'}, your fixture will be scheduled immediately on the match calendar.
            </p>
          ) : (
            <p>
              <strong>Match Request:</strong> You do not hold direct match scheduling authority. Submitting this fixture will generate a <strong>Match Request</strong> awaiting Captain or Vice Captain approval.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: OPPONENT & FORMAT */}
        <Card className="p-6 space-y-4 border-[var(--card-border)]">
          <h3 className="text-base font-black text-[var(--text)] tracking-tight">
            Opponent & Competition
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Opponent Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rawalpindi Smashers"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Quick Select Known Team (Optional)
              </label>
              <select
                value={selectedOpponentTeamId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedOpponentTeamId(val);
                  const selected = publicTeams.find((t) => t.id === val);
                  if (selected) setOpponentName(selected.name);
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">-- Choose registered squad --</option>
                {publicTeams
                  .filter((t) => t.id !== team.id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Match Type
              </label>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value as MatchType)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="friendly">Friendly</option>
                <option value="league">League</option>
                <option value="tournament">Tournament</option>
                <option value="practice">Practice Match</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Format / Overs
              </label>
              <select
                value={overs}
                onChange={(e) => {
                  const o = Number(e.target.value);
                  setOvers(o);
                  setFormat(`${o} overs`);
                }}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value={5}>5 Overs Super Box</option>
                <option value={6}>6 Overs Sprint</option>
                <option value={8}>8 Overs Standard</option>
                <option value={10}>10 Overs Classic</option>
                <option value={15}>15 Overs Extended</option>
                <option value={20}>20 Overs T20</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Competition / Tournament Name
              </label>
              <input
                type="text"
                placeholder="e.g. Twin Cities Cup"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>
        </Card>

        {/* CARD 2: DATE, TIME & GROUND CONNECTION */}
        <Card className="p-6 space-y-4 border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[var(--text)] tracking-tight">
              Venue & Timing
            </h3>
            <span className="text-[11px] text-[var(--text-muted)]">
              Integrated with CricketHub Arenas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Start Time <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Select Venue / Ground
            </label>
            <select
              value={selectedGroundId}
              onChange={(e) => {
                const gid = e.target.value;
                setSelectedGroundId(gid);
                const g = grounds.find((item) => item.id === gid);
                if (g) setGroundName(g.name);
              }}
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              {grounds.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} — {g.location} ({g.hourlyRate} PKR/hr)
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* CARD 3: SQUAD & PLAYING XI SELECTION */}
        <Card className="p-6 space-y-4 border-[var(--card-border)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[var(--text)] tracking-tight">
                Match Squad Selection ({selectedSquad.length})
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Select eligible squad members and designate your starting lineup.
              </p>
            </div>
            <Badge variant="teal" size="sm">
              Playing Lineup: {playingXI.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {team.members.map((member) => {
              const isSelected = selectedSquad.includes(member.id);
              const isPlaying = playingXI.includes(member.id);

              return (
                <div
                  key={member.id}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3',
                    isSelected
                      ? 'bg-[var(--surface)] border-[var(--primary)]/40 shadow-sm'
                      : 'bg-[var(--card)]/40 border-[var(--card-border)] opacity-60'
                  )}
                >
                  <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSquadMember(member.id)}
                      className="accent-[var(--primary)] w-4 h-4 rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text)] truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] capitalize">
                        {member.role.replace('_', ' ')} • {member.playingRole?.replace('_', ' ')}
                      </p>
                    </div>
                  </label>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={() => togglePlayingXI(member.id)}
                      className={cn(
                        'text-[10px] font-bold px-2 py-1 rounded-lg border transition-all shrink-0',
                        isPlaying
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-[var(--card)] text-[var(--text-muted)] border-[var(--card-border)]'
                      )}
                    >
                      {isPlaying ? 'Playing XI' : 'Bench'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* CARD 4: NOTES */}
        <Card className="p-6 space-y-3 border-[var(--card-border)]">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            Match Instructions / Tactical Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Bring extra match balls, arrive 15 minutes before slot time for warm-up..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {hasDirectCreate ? 'Schedule Match' : 'Submit Match Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}