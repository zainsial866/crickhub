'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Search, Swords, Trophy, Users } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { CricketMatch } from '@/types';

type HubTab = 'home' | 'matches' | 'rankings' | 'teams' | 'players';

function teamSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function CricketHubPage() {
  const { publicTeams, myTeams, cricketMatches, playerDirectory } = useTeams();
  const [hubTab, setHubTab] = useState<HubTab>('home');
  const [matchQuery, setMatchQuery] = useState('');
  const [rankingMetric, setRankingMetric] = useState('overall');
  const [rankingFormat, setRankingFormat] = useState('all');
  const [rankingTime, setRankingTime] = useState('all');
  const teams = useMemo(() => Array.from(new Map([...publicTeams, ...myTeams].map((team) => [team.id, team])).values()), [myTeams, publicTeams]);
  const players = useMemo(() => Array.from(new Map([...playerDirectory, ...teams.flatMap((team) => team.members.map((member) => ({ id: member.id, name: member.name, email: member.email, city: team.city, playingRole: member.playingRole, matchesPlayed: member.matchesPlayed, userId: member.userId })) )].map((player) => [player.id, player])).values()), [playerDirectory, teams]);
  const normalizedQuery = matchQuery.trim().toLowerCase();
  const matchingTeams = normalizedQuery ? teams.filter((team) => team.name.toLowerCase().includes(normalizedQuery)) : [];
  const matchingPlayers = normalizedQuery ? players.filter((player) => player.name.toLowerCase().includes(normalizedQuery)) : [];
  const recentMatches = cricketMatches.filter((match) => match.status === 'completed' && (!normalizedQuery || match.teamName.toLowerCase().includes(normalizedQuery) || match.opponentName.toLowerCase().includes(normalizedQuery))).slice(-10).reverse();
  const rankedTeams = [...teams].sort((a, b) => {
    if (rankingMetric === 'wins') return b.wins - a.wins;
    if (rankingMetric === 'winRate') return b.wins / Math.max(b.wins + b.losses, 1) - a.wins / Math.max(a.wins + a.losses, 1);
    return b.points - a.points;
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-16">
      <GlobalSearch query={matchQuery} onQueryChange={setMatchQuery} teams={matchingTeams} players={matchingPlayers} matches={recentMatches.filter((match) => match.teamName.toLowerCase().includes(normalizedQuery) || match.opponentName.toLowerCase().includes(normalizedQuery))} />
      {hubTab === 'home' && <><HomeView onSelect={setHubTab} /><DashboardView matches={recentMatches.slice(0, 4)} teams={rankedTeams.slice(0, 4)} players={players.slice(0, 6)} /></>}
      {hubTab !== 'home' && <HubHeader tab={hubTab} onHome={() => setHubTab('home')} onSelect={setHubTab} />}
      {hubTab === 'matches' && <MatchesView matches={recentMatches} />}
      {hubTab === 'rankings' && <RankingsView teams={rankedTeams} metric={rankingMetric} format={rankingFormat} time={rankingTime} onMetricChange={setRankingMetric} onFormatChange={setRankingFormat} onTimeChange={setRankingTime} />}
      {hubTab === 'teams' && <TeamsView teams={teams} />}
      {hubTab === 'players' && <PlayersView players={players} />}
    </div>
  );
}

function HomeView({ onSelect }: { onSelect: (tab: HubTab) => void }) {
  return <section className="rounded-3xl border border-card-border bg-gradient-to-br from-card via-surface to-card p-6 sm:p-10"><Badge variant="teal" size="sm">CRICKETHUB</Badge><h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-text-primary sm:text-5xl">Everything happening across CricketHub</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">Your central cricket community for matches, teams, players, scorecards, and rankings. Choose a section below to explore.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><HubLink label="Matches" detail="Recent fixtures and scorecards" icon={<CalendarDays />} onClick={() => onSelect('matches')} /><HubLink label="Rankings" detail="Team standings and points" icon={<Trophy />} onClick={() => onSelect('rankings')} /><HubLink label="Teams" detail="Public teams and squads" icon={<Users />} onClick={() => onSelect('teams')} /><HubLink label="Players" detail="Player directory and careers" icon={<Swords />} onClick={() => onSelect('players')} /></div></section>;
}

function GlobalSearch({ query, onQueryChange, teams, players, matches }: { query: string; onQueryChange: (value: string) => void; teams: ReturnType<typeof useTeams>['myTeams']; players: Array<{ id: string; name: string; playingRole: string; matchesPlayed: number }>; matches: CricketMatch[] }) {
  return <section className="rounded-2xl border border-card-border bg-card p-4 sm:p-5"><div className="relative"><Search className="absolute left-4 top-3.5 h-5 w-5 text-text-muted" /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search CricketHub: players, teams, or matches" className="w-full rounded-xl border border-card-border bg-bg py-3 pl-12 pr-4 text-sm text-text-primary outline-none transition focus:border-primary" /></div>{query.trim() && <div className="mt-4 grid gap-4 lg:grid-cols-3"><SearchGroup title="Teams" icon={<Users className="h-4 w-4" />}>{teams.map((team) => <Link key={team.id} href={`/teams/${teamSlug(team.name)}`} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2 text-sm font-bold text-text-primary hover:text-primary-light">{team.name}<ArrowRight className="h-4 w-4" /></Link>)}{teams.length === 0 && <p className="text-xs text-text-muted">No teams found.</p>}</SearchGroup><SearchGroup title="Players" icon={<Swords className="h-4 w-4" />}>{players.map((player) => <Link key={player.id} href={`/player/players/${player.id}`} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2 text-sm font-bold text-text-primary">{player.name}<ArrowRight className="h-4 w-4" /></Link>)}{players.length === 0 && <p className="text-xs text-text-muted">No players found.</p>}</SearchGroup><SearchGroup title="Matches" icon={<CalendarDays className="h-4 w-4" />}>{matches.map((match) => <Link key={match.id} href={`/player/matches/${match.id}`} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2 text-xs font-bold text-text-primary"><span>{match.teamName} vs {match.opponentName}</span><ArrowRight className="h-4 w-4" /></Link>)}{matches.length === 0 && <p className="text-xs text-text-muted">No matches found.</p>}</SearchGroup></div>}</section>;
}

function DashboardView({ matches, teams, players }: { matches: CricketMatch[]; teams: ReturnType<typeof useTeams>['myTeams']; players: Array<{ id: string; name: string; playingRole: string; matchesPlayed: number }> }) {
  return <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><section className="space-y-4"><div className="flex items-end justify-between"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">RECENT ACTIVITY</p><h2 className="mt-1 text-xl font-black text-text-primary">Recent matches</h2></div></div><div className="grid gap-4 md:grid-cols-2">{matches.map((match) => <MatchCard key={match.id} match={match} />)}</div></section><section className="space-y-4"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">QUICK RANKINGS</p><h2 className="mt-1 text-xl font-black text-text-primary">Teams leading the table</h2></div><Card className="overflow-hidden border-card-border p-0"><div className="divide-y divide-card-border">{teams.map((team, index) => <Link key={team.id} href={`/teams/${teamSlug(team.name)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface"><span className="w-5 text-center text-xs font-black text-text-muted">{index + 1}</span><span className="flex-1 text-xs font-bold text-text-primary">{team.name}</span><span className="text-xs font-black text-primary-light">{team.points} pts</span></Link>)}</div></Card><Card className="border-card-border p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-black text-text-primary">Players in CricketHub</h3><span className="text-xs text-text-muted">{players.length}</span></div><div className="mt-3 flex flex-wrap gap-2">{players.map((player) => <Link key={player.id} href={`/player/players/${player.id}`} className="rounded-lg bg-bg px-2 py-1 text-[10px] font-bold text-text-secondary hover:text-primary-light">{player.name}</Link>)}</div></Card></section></div>;
}

function HubHeader({ tab, onHome, onSelect }: { tab: HubTab; onHome: () => void; onSelect: (tab: HubTab) => void }) {
  return <><div className="flex flex-col gap-4 border-b border-card-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div><button type="button" onClick={onHome} className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-light"><ArrowRight className="h-4 w-4 rotate-180" />CricketHub home</button><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">CRICKETHUB</p><h1 className="mt-1 text-3xl font-black text-text-primary">{tab[0].toUpperCase() + tab.slice(1)}</h1></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><HubLink active={tab === 'matches'} onClick={() => onSelect('matches')} label="Matches" icon={<CalendarDays />} /><HubLink active={tab === 'rankings'} onClick={() => onSelect('rankings')} label="Rankings" icon={<Trophy />} /><HubLink active={tab === 'teams'} onClick={() => onSelect('teams')} label="Teams" icon={<Users />} /><HubLink active={tab === 'players'} onClick={() => onSelect('players')} label="Players" icon={<Swords />} /></div></>;
}

function MatchesView({ matches }: { matches: CricketMatch[] }) {
  return <section className="space-y-4"><div className="grid gap-4 md:grid-cols-2">{matches.map((match) => <MatchCard key={match.id} match={match} />)}{matches.length === 0 && <Card className="p-8 text-center text-sm text-text-muted">No matches match your search.</Card>}</div><Link href="/player/matches" className="inline-flex items-center gap-1 text-xs font-bold text-primary-light hover:underline">Open full match history <ArrowRight className="h-3.5 w-3.5" /></Link></section>;
}

function RankingsView({ teams, metric, format, time, onMetricChange, onFormatChange, onTimeChange }: { teams: ReturnType<typeof useTeams>['myTeams']; metric: string; format: string; time: string; onMetricChange: (value: string) => void; onFormatChange: (value: string) => void; onTimeChange: (value: string) => void }) {
  return <section className="space-y-4"><p className="text-sm text-text-secondary">Team rankings across CricketHub. Change the metric, format, or time period.</p><div className="flex flex-wrap gap-3"><select value={metric} onChange={(event) => onMetricChange(event.target.value)} className="rounded-xl border border-card-border bg-card px-3 py-2 text-sm text-text-primary"><option value="overall">Overall</option><option value="wins">Wins</option><option value="winRate">Win Rate</option><option value="points">Points</option><option value="runs">Runs</option><option value="wickets">Wickets</option></select><select value={format} onChange={(event) => onFormatChange(event.target.value)} className="rounded-xl border border-card-border bg-card px-3 py-2 text-sm text-text-primary"><option value="all">All Formats</option><option value="T10">T10</option><option value="T20">T20</option><option value="other">Other</option></select><select value={time} onChange={(event) => onTimeChange(event.target.value)} className="rounded-xl border border-card-border bg-card px-3 py-2 text-sm text-text-primary"><option value="all">All Time</option><option value="season">This Season</option><option value="last">Last Season</option></select></div><Card className="overflow-hidden border-card-border p-0"><div className="divide-y divide-card-border">{teams.map((team, index) => <Link key={team.id} href={`/teams/${teamSlug(team.name)}`} className="flex items-center gap-4 px-5 py-4 hover:bg-surface"><span className="w-6 text-center text-sm font-black text-text-muted">{index + 1}</span><span className="flex-1 text-sm font-bold text-text-primary">{team.name}</span><span className="text-xs text-text-secondary">{team.wins} wins</span><span className="text-sm font-black text-primary-light">{metric === 'winRate' ? `${((team.wins / Math.max(team.wins + team.losses, 1)) * 100).toFixed(1)}%` : metric === 'wins' ? team.wins : `${team.points} pts`}</span></Link>)}</div></Card></section>;
}

function TeamsView({ teams }: { teams: ReturnType<typeof useTeams>['myTeams'] }) {
  return <section className="grid gap-4 md:grid-cols-2">{teams.map((team) => <Link key={team.id} href={`/teams/${teamSlug(team.name)}`}><Card className="h-full border-card-border p-5 transition hover:border-primary"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="text-2xl">{team.logoEmoji || '🏏'}</span><h2 className="text-lg font-black text-text-primary">{team.name}</h2></div><p className="mt-1 text-xs text-text-secondary">{team.city} · {team.members.length} players</p></div><ArrowRight className="h-4 w-4 text-primary-light" /></div><div className="mt-4 grid grid-cols-3 gap-2 text-center">{[['Matches', team.wins + team.losses + team.draws], ['Wins', team.wins], ['Points', team.points]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-card p-2"><p className="font-black text-primary-light">{value}</p><p className="text-[10px] uppercase text-text-muted">{label}</p></div>)}</div><div className="mt-4 flex flex-wrap gap-1.5">{team.members.map((member) => <span key={`${team.id}-${member.id}`} className="rounded-lg bg-bg px-2 py-1 text-[10px] font-bold text-text-secondary">{member.name}</span>)}</div></Card></Link>)}</section>;
}

function PlayersView({ players }: { players: Array<{ id: string; name: string; playingRole: string; matchesPlayed: number }> }) {
  return <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{players.map((player) => <Link key={player.id} href={`/player/players/${player.id}`}><Card className="h-full border-card-border p-5 transition hover:border-primary"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-sm font-black text-primary-light">{player.name.slice(0, 2).toUpperCase()}</div><div><h2 className="text-sm font-black text-text-primary">{player.name}</h2><p className="text-[11px] capitalize text-text-secondary">{player.playingRole.replace('_', ' ')}</p></div></div><ArrowRight className="h-4 w-4 text-primary-light" /></div><div className="mt-4 flex items-center justify-between border-t border-card-border pt-3 text-xs"><span className="text-text-muted">Matches played</span><strong className="text-text-primary">{player.matchesPlayed}</strong></div></Card></Link>)}</section>;
}

function MatchCard({ match }: { match: CricketMatch }) {
  return <Card className="border-card-border p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-base font-black text-text-primary">{match.teamName}</p><p className="text-base font-black text-text-primary">{match.opponentName}</p></div><Badge variant={match.result === 'win' ? 'teal' : 'outline'} size="sm">{match.result === 'win' ? 'Won' : match.result === 'draw' ? 'Draw' : 'Finished'}</Badge></div><div className="mt-4 flex items-end justify-between border-t border-card-border pt-4"><div><p className="text-xl font-black text-primary-light">{match.teamScore ?? 0}/{match.teamWickets ?? 0}</p><p className="text-xs text-text-muted">{match.teamName}</p></div><div className="text-right"><p className="text-xl font-black text-text-primary">{match.opponentScore ?? 0}/{match.opponentWickets ?? 0}</p><p className="text-xs text-text-muted">{match.opponentName}</p></div></div><p className="mt-4 text-xs text-text-secondary">{match.margin || 'Match completed'} · {match.format || `T${match.overs}`} · {match.date}</p><Link href={`/player/matches/${match.id}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-light hover:underline">View scorecard <ArrowRight className="h-3.5 w-3.5" /></Link></Card>;
}

function HubLink({ label, detail, icon, active = false, onClick }: { label: string; detail?: string; icon: React.ReactNode; active?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${active ? 'border-primary bg-primary/10 text-primary-light' : 'border-card-border bg-card text-text-primary hover:border-primary hover:text-primary-light'}`}>{icon}<span><span className="block text-sm font-bold">{label}</span>{detail && <span className="mt-0.5 block text-[11px] text-text-secondary">{detail}</span>}</span></button>;
}

function SearchGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-card-border bg-card p-4"><h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-text-secondary">{icon}{title}</h2><div className="space-y-2">{children}</div></div>;
}
