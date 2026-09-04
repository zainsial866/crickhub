'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, CheckCircle2, Clock3, MapPin, Search, SlidersHorizontal, Zap } from 'lucide-react';
import { useGrounds } from '@/hooks/useGrounds';
import { useBookings } from '@/hooks/useBookings';
import { GroundCard } from '@/components/cards/GroundCard';
import { BookingModal } from '@/components/forms/BookingModal';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Ground } from '@/types';
import { PITCH_TYPES, CITIES } from '@/lib/constants';

export default function DiscoverPage() {
  const { grounds, allGrounds, selectedCity, setSelectedCity, selectedPitchType, setSelectedPitchType, searchQuery, setSearchQuery, getSlotsForGround } = useGrounds();
  const { upcomingBookings } = useBookings();
  const [bookingGround, setBookingGround] = useState<Ground | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const availableSlots = allGrounds.reduce((total, ground) => total + getSlotsForGround(ground.id).filter((slot) => slot.isAvailable).length, 0);

  const openBooking = (ground: Ground) => {
    setBookingGround(ground);
    setIsBookingOpen(true);
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedPitchType('all');
    setSearchQuery('');
  };

  return <div className="mx-auto w-full max-w-7xl space-y-6 pb-16"><section className="rounded-3xl border border-card-border bg-gradient-to-br from-card via-surface to-card p-6 sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-black tracking-[0.2em] text-primary-light">DISCOVER GROUNDS</p><h1 className="mt-2 text-3xl font-black tracking-tight text-text-primary sm:text-4xl">Book your next cricket session</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">Find verified indoor arenas, check live availability, and reserve a slot in a few taps.</p></div><Link href="/player/bookings" className="inline-flex items-center gap-2 self-start rounded-xl border border-card-border bg-card px-4 py-2.5 text-xs font-bold text-text-primary hover:border-primary hover:text-primary-light"><CalendarCheck2 className="h-4 w-4" />My bookings<ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-bg p-4"><p className="text-2xl font-black text-primary-light">{allGrounds.length}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">Verified arenas</p></div><div className="rounded-2xl bg-bg p-4"><p className="text-2xl font-black text-emerald-400">{availableSlots}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">Slots available</p></div><div className="hidden rounded-2xl bg-bg p-4 sm:block"><p className="text-2xl font-black text-text-primary">{upcomingBookings.length}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-text-muted">Your upcoming</p></div></div></section><section className="space-y-3"><div className="relative"><Search className="absolute left-4 top-3.5 h-5 w-5 text-text-muted" /><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search arena name, area, or city" className="w-full rounded-2xl border border-card-border bg-card py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none transition focus:border-primary" /></div><div className="flex flex-wrap items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-text-muted" /><span className="mr-1 text-[10px] font-black uppercase tracking-wider text-text-muted">City</span><FilterButton active={selectedCity === 'all'} onClick={() => setSelectedCity('all')}>All cities</FilterButton>{CITIES.map((city) => <FilterButton key={city} active={selectedCity === city} onClick={() => setSelectedCity(city)}>{city}</FilterButton>)}<span className="ml-2 mr-1 text-[10px] font-black uppercase tracking-wider text-text-muted">Arena</span>{PITCH_TYPES.filter((type) => type.id !== 'all').map((type) => <FilterButton key={type.id} active={selectedPitchType === type.id} onClick={() => setSelectedPitchType(type.id)}>{type.label}</FilterButton>)}{(searchQuery || selectedCity !== 'all' || selectedPitchType !== 'all') && <button type="button" onClick={resetFilters} className="ml-auto text-xs font-bold text-primary-light hover:underline">Clear filters</button>}</div></section><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black tracking-[0.18em] text-text-muted">AVAILABLE ARENAS</p><h2 className="mt-1 text-xl font-black text-text-primary">Choose where to play</h2></div><span className="text-xs text-text-secondary">{grounds.length} found</span></div>{grounds.length === 0 ? <Card className="p-12 text-center"><MapPin className="mx-auto h-8 w-8 text-text-muted" /><h2 className="mt-3 text-base font-bold text-text-primary">No arenas found</h2><p className="mt-1 text-xs text-text-muted">Try another city, arena type, or search term.</p><Button className="mt-4" variant="secondary" size="sm" onClick={resetFilters}>Reset filters</Button></Card> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{grounds.map((ground) => <GroundCard key={ground.id} ground={ground} onBookClick={openBooking} />)}</div>}{upcomingBookings.length > 0 && <Card className="border-primary/20 bg-primary/5 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><div><p className="text-sm font-bold text-text-primary">You have {upcomingBookings.length} upcoming booking{upcomingBookings.length === 1 ? '' : 's'}</p><p className="text-xs text-text-secondary">{upcomingBookings[0].groundName} · {upcomingBookings[0].date} · {upcomingBookings[0].slotTime}</p></div></div><Link href="/player/bookings" className="text-xs font-bold text-primary-light hover:underline">Manage bookings</Link></div></Card>}{bookingGround && <BookingModal ground={bookingGround} slots={getSlotsForGround(bookingGround.id)} isOpen={isBookingOpen} onClose={() => { setIsBookingOpen(false); setBookingGround(null); }} />}</div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${active ? 'border-primary bg-primary text-white' : 'border-card-border bg-card text-text-secondary hover:border-primary/50 hover:text-text-primary'}`}>{children}</button>;
}
