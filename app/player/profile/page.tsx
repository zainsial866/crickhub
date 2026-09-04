'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useBookings } from '@/hooks/useBookings';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, LogOut, Save, Settings, Sparkles, Sun, Moon, Trophy, Users } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { upcomingBookings } = useBookings();
  const { myTeams, cricketMatches } = useTeams();
  const router = useRouter();
  const [name, setName] = useState(user?.name || 'Zain Sial');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [email] = useState(user?.email || 'zain@crickethub.pk');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const completedMatches = cricketMatches.filter((match) => match.status === 'completed');
  const playerStats = completedMatches.flatMap((match) => match.playerStats).filter((stat) => stat.playerId === user?.id || stat.playerName.toLowerCase() === name.toLowerCase());
  const runs = playerStats.reduce((total, stat) => total + stat.runs, 0);
  const wickets = playerStats.reduce((total, stat) => total + stat.wickets, 0);
  const catches = playerStats.reduce((total, stat) => total + stat.catches, 0);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return <div className="mx-auto w-full max-w-7xl space-y-6 pb-16"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">PLAYER PROFILE</p><h1 className="mt-1 text-3xl font-black tracking-tight text-text-primary">Your CricketHub</h1><p className="mt-2 text-sm text-text-secondary">Keep your cricket life organized, from bookings to career progress.</p></div><Link href="/player/crickethub" className="inline-flex items-center gap-1 text-xs font-bold text-primary-light hover:underline">Explore CricketHub <ArrowRight className="h-3.5 w-3.5" /></Link></div><Card className="border-card-border bg-gradient-to-br from-card via-surface to-card p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal text-xl font-black text-white">{name.slice(0, 2).toUpperCase()}</div><div><h2 className="text-2xl font-black text-text-primary">{name}</h2><p className="text-sm capitalize text-text-secondary">{user?.role?.replace('_', ' ') || 'player'} · CricketHub member</p><p className="mt-1 text-xs text-text-muted">{email}</p></div></div><Badge variant="teal" size="md">Active player</Badge></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{[['Matches', playerStats.length], ['Runs', runs], ['Wickets', wickets], ['Catches', catches], ['Teams', myTeams.length]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-bg p-3"><p className="text-xl font-black text-primary-light">{value}</p><p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p></div>)}</div></Card><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ProfileAction href="/player/discover" icon={<CalendarDays />} title="Find a ground" detail="Discover available arenas" /><ProfileAction href="/player/bookings" icon={<Clock3 />} title="My bookings" detail={`${upcomingBookings.length} upcoming booking${upcomingBookings.length === 1 ? '' : 's'}`} /><ProfileAction href="/player/team" icon={<Users />} title="My teams" detail={`${myTeams.length} team${myTeams.length === 1 ? '' : 's'} to manage`} /><ProfileAction href="/player/crickethub" icon={<Trophy />} title="Career hub" detail="View matches and rankings" /></section><div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><Card className="border-card-border p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">NEXT UP</p><h2 className="mt-1 text-lg font-black text-text-primary">Upcoming bookings</h2></div><Link href="/player/bookings" className="text-xs font-bold text-primary-light hover:underline">View all</Link></div><div className="mt-4 space-y-3">{upcomingBookings.slice(0, 3).map((booking) => <Link key={booking.id} href="/player/bookings" className="flex items-center justify-between rounded-xl bg-card px-4 py-3 hover:border-primary"><div><p className="text-sm font-bold text-text-primary">{booking.groundName}</p><p className="text-xs text-text-secondary">{booking.date} · {booking.slotTime}</p></div><ArrowRight className="h-4 w-4 text-primary-light" /></Link>)}{upcomingBookings.length === 0 && <p className="rounded-xl bg-card p-4 text-sm text-text-muted">No upcoming bookings. Discover a ground to book your next session.</p>}</div></Card><Card className="border-card-border p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">YOUR TEAMS</p><h2 className="mt-1 text-lg font-black text-text-primary">Team shortcuts</h2></div><Link href="/player/team" className="text-xs font-bold text-primary-light hover:underline">Manage</Link></div><div className="mt-4 space-y-3">{myTeams.slice(0, 3).map((team) => <Link key={team.id} href="/player/team" className="flex items-center justify-between rounded-xl bg-card px-4 py-3 hover:border-primary"><div><p className="text-sm font-bold text-text-primary">{team.name}</p><p className="text-xs text-text-secondary">{team.city} · {team.members.length} players</p></div><span className="text-xs font-black text-primary-light">{team.points} pts</span></Link>)}{myTeams.length === 0 && <p className="text-sm text-text-muted">Create or join a team to see it here.</p>}</div></Card></div><Card className="border-card-border p-5 sm:p-6"><div className="mb-4 flex items-center gap-2"><Settings className="h-4 w-4 text-primary-light" /><div><h2 className="text-lg font-black text-text-primary">Profile settings</h2><p className="text-xs text-text-secondary">Update your details, notifications, and appearance.</p></div></div><form onSubmit={handleSave} className="grid gap-5 lg:grid-cols-[1fr_1fr_0.8fr]"><div className="space-y-4"><label className="block text-xs font-semibold text-text-secondary">Full Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-primary" /></label><label className="block text-xs font-semibold text-text-secondary">Contact Number<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3.5 py-2 text-sm text-text-primary outline-none focus:border-primary" /></label><label className="block text-xs font-semibold text-text-secondary">Email Address<input disabled value={email} className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-card-border bg-surface/50 px-3.5 py-2 text-sm text-text-muted" /></label></div><div className="space-y-4"><p className="text-xs font-bold text-text-primary">Notification alerts</p><Toggle label="Slot booking reminders" checked={pushEnabled} onChange={setPushEnabled} /><Toggle label="Team challenge notifications" checked={smsEnabled} onChange={setSmsEnabled} /><div className="flex items-center justify-between border-t border-card-border pt-4"><span className="text-xs text-text-secondary">Changes apply to this demo profile.</span>{savedSuccess && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400"><CheckCircle2 className="h-4 w-4" />Saved</span>}</div><Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-4 w-4" />}>Save changes</Button></div><div className="space-y-3"><p className="text-xs font-bold text-text-primary">Appearance</p><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setTheme('dark')} className={`rounded-xl border p-3 text-left ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-card-border bg-card'}`}><Moon className="h-4 w-4 text-primary-light" /><span className="mt-2 block text-xs font-bold text-text-primary">Dark</span></button><button type="button" onClick={() => setTheme('light')} className={`rounded-xl border p-3 text-left ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-card-border bg-card'}`}><Sun className="h-4 w-4 text-amber-400" /><span className="mt-2 block text-xs font-bold text-text-primary">Light</span></button></div><Button type="button" variant="outline" className="w-full text-red-400 border-red-500/30" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>Sign out</Button></div></form></Card></div>;
}

function ProfileAction({ href, icon, title, detail }: { href: string; icon: React.ReactNode; title: string; detail: string }) {
  return <Link href={href} className="rounded-2xl border border-card-border bg-card p-4 transition hover:border-primary"><span className="text-primary-light">{icon}</span><h2 className="mt-3 text-sm font-black text-text-primary">{title}</h2><p className="mt-1 text-xs text-text-secondary">{detail}</p><ArrowRight className="mt-3 h-4 w-4 text-primary-light" /></Link>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center justify-between gap-3 text-xs font-semibold text-text-primary"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-primary" /></label>;
}
