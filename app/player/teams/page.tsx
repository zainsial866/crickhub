'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Search, Users, Trophy } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';

export default function DiscoverTeamsPage() {
  const { publicTeams } = useTeams();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [size, setSize] = useState('all');
  const [ranking, setRanking] = useState('all');
  const filteredTeams = useMemo(() => publicTeams.filter((team) => {
    const matchesQuery = !query.trim() || `${team.name} ${team.inviteCode} ${team.city}`.toLowerCase().includes(query.toLowerCase());
    const matchesCity = city === 'all' || team.city === city;
    const matchesSize = size === 'all' || (size === 'small' ? team.members.length <= 5 : team.members.length > 5);
    const teamRank = publicTeams.slice().sort((a, b) => b.points - a.points).findIndex((entry) => entry.id === team.id) + 1;
    const matchesRanking = ranking === 'all' || (ranking === 'top' && teamRank <= 3);
    return matchesQuery && matchesCity && matchesSize && matchesRanking;
  }), [city, publicTeams, query, ranking, size]);
  const rankedTeams = publicTeams.slice().sort((a, b) => b.points - a.points);

  return <div className="space-y-6 sm:space-y-8"><div><h1 className="text-2xl font-black text-text-primary">Find Teams</h1><p className="text-xs text-text-secondary">Discover cricket teams, follow their progress, or request to join.</p></div><div className="flex flex-col lg:flex-row gap-3"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search teams, players, or team code..." className="w-full bg-card border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary" /></div><select value={city} onChange={(event) => setCity(event.target.value)} className="bg-card border border-card-border rounded-xl px-3 py-2.5 text-sm text-text-secondary"><option value="all">All cities</option><option>Islamabad</option><option>Rawalpindi</option></select><select value={ranking} onChange={(event) => setRanking(event.target.value)} className="bg-card border border-card-border rounded-xl px-3 py-2.5 text-sm text-text-secondary"><option value="all">Any ranking</option><option value="top">Top 3</option></select><select value={size} onChange={(event) => setSize(event.target.value)} className="bg-card border border-card-border rounded-xl px-3 py-2.5 text-sm text-text-secondary"><option value="all">Any team size</option><option value="small">1-5 players</option><option value="large">6+ players</option></select></div><div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-orange" /><h2 className="text-lg font-bold text-text-primary">Popular Teams</h2></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{filteredTeams.map((team) => { const rank = rankedTeams.findIndex((entry) => entry.id === team.id) + 1; return <Card key={team.id} className="p-5 space-y-4 hover:border-primary/50 transition-colors"><div className="flex items-start gap-3"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white text-xl">🏏</div><div className="min-w-0"><h3 className="font-bold text-text-primary truncate">{team.name}</h3><p className="text-xs text-text-secondary flex items-center gap-1"><MapPin className="w-3 h-3" />{team.city}</p></div></div><div className="flex items-center gap-2 flex-wrap"><Badge variant="primary" size="sm">#{rank}</Badge><span className="text-xs text-text-secondary">{team.points} pts</span><span className="text-xs text-text-secondary flex items-center gap-1"><Users className="w-3 h-3" />{team.members.length} Players</span></div><Link href={`/teams/${team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="block text-center rounded-xl bg-primary text-white px-3 py-2 text-xs font-bold hover:bg-primary-dark">View Team</Link></Card>; })}</div>{!filteredTeams.length && <Card className="p-8 text-center text-sm text-text-muted">No teams match those filters.</Card>}</div>;
}
