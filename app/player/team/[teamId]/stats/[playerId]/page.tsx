'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { useTeams } from '@/hooks/useTeams';

export default function PlayerPerformancePage() {
  const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>();
  const { team, cricketMatches } = useTeams();
  const player = team.members.find((member) => member.id === playerId);
  const stats = cricketMatches.filter((match) => match.status === 'completed').flatMap((match) => match.playerStats).filter((stat) => stat.playerId === playerId);

  if (!player) {
    return <Card className="p-8 text-center text-sm text-text-muted">Player not found.</Card>;
  }

  const total = (field: keyof typeof stats[number]) => stats.reduce((sum, stat) => sum + Number(stat[field] || 0), 0);
  const playingRole = player.playingRole || 'all_rounder';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-primary-light font-bold uppercase">{player.role} · {playingRole.replace('_', ' ')}</p>
          <h1 className="text-2xl font-black text-text-primary mt-1">{player.name}</h1>
          <p className="text-xs text-text-secondary">Recent performances across completed matches.</p>
        </div>

        <Link
          href={`/player/team/${teamId}/stats`}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to stats
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['Matches', stats.length], ['Runs', total('runs')], ['Wickets', total('wickets')], ['Catches', total('catches')]].map(([label, value]) => (
          <Card key={label as string} className="p-5 text-center">
            <p className="text-2xl font-black text-primary-light">{value}</p>
            <span className="text-[10px] uppercase font-bold text-text-muted">{label}</span>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-bold text-text-primary mb-3">Recent Performances</h2>
        {cricketMatches.filter((match) => match.status === 'completed' && match.playerStats.some((stat) => stat.playerId === playerId)).map((match) => {
          const stat = match.playerStats.find((item) => item.playerId === playerId)!;
          return (
            <div key={match.id} className="flex items-center justify-between border-b border-card-border last:border-0 py-3 text-xs">
              <span className="font-bold text-text-primary">vs {match.opponentName}</span>
              <span className="text-text-secondary">{stat.runs} runs · {stat.wickets} wickets · {stat.catches} catches</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}