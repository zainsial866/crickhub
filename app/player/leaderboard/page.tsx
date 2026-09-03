'use client';

import React from 'react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Trophy, Medal, Sparkles, TrendingUp } from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard } = useTeams();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Twin City Leaderboard</span>
          </h2>
          <p className="text-xs text-text-secondary">Official indoor arena team standings across Islamabad & Rawalpindi</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-card-border text-xs font-bold text-teal-light">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Season 2026 • Week 12</span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((team, idx) => {
          const colors = [
            { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/40', text: 'text-amber-400', badge: '1st Place' },
            { bg: 'from-slate-400/20 to-slate-500/5', border: 'border-slate-400/40', text: 'text-slate-300', badge: '2nd Place' },
            { bg: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-700/40', text: 'text-amber-600', badge: '3rd Place' },
          ][idx];

          return (
            <Card
              key={team.teamId}
              className={`p-5 relative overflow-hidden bg-gradient-to-b ${colors.bg} ${colors.border} border text-center space-y-2`}
            >
              <div className="flex justify-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl bg-card border ${colors.border} ${colors.text} shadow-md`}>
                  #{team.rank}
                </div>
              </div>
              <h4 className="font-extrabold text-base text-text-primary">{team.teamName}</h4>
              <p className="text-xs text-text-muted">{team.won} Wins • {team.lost} Losses</p>
              <div className="pt-2 border-t border-card-border/60 flex items-center justify-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted block">Points</span>
                  <span className="text-base font-black text-primary-light">{team.points}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted block">NRR</span>
                  <span className="text-xs font-mono font-bold text-teal-light">{team.netRunRate}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Standings Table */}
      <Card className="p-0 overflow-hidden border-card-border">
        <div className="px-5 py-4 border-b border-card-border bg-surface/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-text-primary">Complete Championship Table</h3>
          <span className="text-xs text-text-muted">Updated in real-time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-card-border bg-surface/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-12">#</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Played</th>
                <th className="py-3 px-4 text-center">Won</th>
                <th className="py-3 px-4 text-center">Lost</th>
                <th className="py-3 px-4 text-center">NRR</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.teamId}
                  className={`hover:bg-surface/50 transition-colors ${
                    entry.rank === 1 ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold text-text-muted">
                    {entry.rank}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary">{entry.teamName}</span>
                    {entry.rank === 1 && (
                      <span className="ml-2 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        Leader
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center text-text-secondary">{entry.matchesPlayed}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{entry.won}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-red-400">{entry.lost}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-text-muted">{entry.netRunRate || '0.00'}</td>
                  <td className="py-3.5 px-4 text-right font-black text-sm text-primary-light">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
