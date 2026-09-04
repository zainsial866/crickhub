'use client';

import { Activity, BarChart3, CalendarDays, TrendingUp } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { CricketMatch } from '@/types';

interface TeamInsightsProps {
  matches: CricketMatch[];
  wins: number;
  losses: number;
  draws: number;
  runs: number;
  wickets: number;
}

export function TeamInsights({ matches, wins, losses, draws, runs, wickets }: TeamInsightsProps) {
  const completedMatches = matches.filter((match) => match.status === 'completed');
  const maxScore = Math.max(...completedMatches.map((match) => match.teamScore || 0), 1);
  const averageScore = completedMatches.length ? Math.round(completedMatches.reduce((sum, match) => sum + (match.teamScore || 0), 0) / completedMatches.length) : 0;
  const formTotal = wins + losses + draws;

  return (
    <section className="space-y-4" aria-labelledby="team-insights-title">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="team-insights-title" className="text-lg font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-light" /> Team Insights
          </h2>
          <p className="text-xs text-text-secondary">A quick read of performance from completed matches</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Live demo data</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-bold text-text-muted">Average score</span><TrendingUp className="w-4 h-4 text-primary-light" /></div><p className="text-2xl font-black text-text-primary mt-2">{averageScore}</p><p className="text-[10px] text-text-secondary">Runs per match</p></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-bold text-text-muted">Team runs</span><Activity className="w-4 h-4 text-orange" /></div><p className="text-2xl font-black text-orange mt-2">{runs}</p><p className="text-[10px] text-text-secondary">Across scorecards</p></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-bold text-text-muted">Wickets</span><BarChart3 className="w-4 h-4 text-teal-light" /></div><p className="text-2xl font-black text-teal-light mt-2">{wickets}</p><p className="text-[10px] text-text-secondary">Taken by squad</p></Card>
        <Card className="p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-bold text-text-muted">Matches logged</span><CalendarDays className="w-4 h-4 text-primary-light" /></div><p className="text-2xl font-black text-primary-light mt-2">{formTotal}</p><p className="text-[10px] text-text-secondary">W {wins} · L {losses} · D {draws}</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-sm text-text-primary">Score trend</h3><span className="text-[10px] text-text-muted">Last {completedMatches.length} matches</span></div>
          <div className="h-40 flex items-end gap-4 border-b border-l border-card-border px-4 pb-0">
            {completedMatches.slice().reverse().map((match) => {
              const score = match.teamScore || 0;
              return <div key={match.id} className="flex-1 h-full flex flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-primary-light">{score}</span><div className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-primary-dark to-primary transition-all" style={{ height: `${Math.max(12, (score / maxScore) * 100)}%` }} /><span className="text-[9px] text-text-muted truncate max-w-16">{match.opponentName}</span></div>;
            })}
          </div>
        </Card>
        <Card className="p-5"><h3 className="font-bold text-sm text-text-primary mb-4">Recent form</h3><div className="flex items-center gap-2 mb-5">{completedMatches.slice().reverse().map((match) => <span key={match.id} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${match.result === 'win' ? 'bg-emerald-500/15 text-emerald-400' : match.result === 'loss' ? 'bg-red-500/15 text-red-400' : 'bg-orange/15 text-orange'}`}>{match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}</span>)}</div><div className="space-y-3 text-xs"><div className="flex justify-between"><span className="text-text-secondary">Win percentage</span><strong className="text-text-primary">{formTotal ? Math.round((wins / formTotal) * 100) : 0}%</strong></div><div className="h-2 rounded-full bg-surface overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${formTotal ? (wins / formTotal) * 100 : 0}%` }} /></div><div className="flex justify-between text-text-muted"><span>Wins {wins}</span><span>Losses {losses}</span><span>Draws {draws}</span></div></div></Card>
      </div>
    </section>
  );
}
