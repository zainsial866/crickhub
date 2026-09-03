'use client';

import React, { useState } from 'react';
import { useGrounds } from '@/hooks/useGrounds';
import { useTeams } from '@/hooks/useTeams';
import { GroundCard } from '@/components/cards/GroundCard';
import { StatsHeroCard } from '@/components/cards/StatsHeroCard';
import { BookingModal } from '@/components/forms/BookingModal';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Ground } from '@/types';
import { PITCH_TYPES, CITIES } from '@/lib/constants';
import { Search, Filter, Sparkles, MapPin, Swords, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DiscoverPage() {
  const {
    grounds,
    selectedCity,
    setSelectedCity,
    selectedPitchType,
    setSelectedPitchType,
    searchQuery,
    setSearchQuery,
    getSlotsForGround,
  } = useGrounds();

  const { matches } = useTeams();

  const [bookingGround, setBookingGround] = useState<Ground | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = (ground: Ground) => {
    setBookingGround(ground);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Availability & Stat Card */}
      <StatsHeroCard
        availablePercentage={74}
        upcomingCount={2}
        teamRank={1}
        matchesPlayed={19}
      />

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by arena name, F-6, Chandni Chowk..."
              className="w-full bg-card border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCity === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-card-border text-text-secondary hover:text-text-primary'
              }`}
            >
              All Cities
            </button>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCity === city
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-card-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Pitch Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PITCH_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedPitchType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedPitchType === type.id
                  ? 'bg-primary/15 text-primary-light border border-primary/30'
                  : 'bg-surface border border-card-border text-text-muted hover:text-text-secondary'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Featured / Nearby Grounds Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span>Indoor Arenas</span>
              <span className="text-xs font-normal text-text-muted">({grounds.length} found)</span>
            </h3>
            <p className="text-xs text-text-secondary">Verified turf specs, floodlights & nets</p>
          </div>
          <Link href="/player/bookings" className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1">
            My Bookings <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {grounds.length === 0 ? (
          <Card className="text-center py-12 space-y-2">
            <p className="text-base font-bold text-text-primary">No cricket grounds found</p>
            <p className="text-xs text-text-muted">Try adjusting your search query or city filter.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedCity('all');
                setSelectedPitchType('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          /* Responsive Layout: Single column on small mobile, 2 cols on tablet, 3-4 cols on desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {grounds.map((ground) => (
              <GroundCard
                key={ground.id}
                ground={ground}
                onBookClick={handleOpenBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Matches Near You Challenge Feed */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Swords className="w-4 h-4 text-orange" />
              <span>Match Challenges Near You</span>
            </h3>
            <p className="text-xs text-text-secondary">Open fixtures looking for opponent teams</p>
          </div>
          <Link href="/player/team" className="text-xs font-semibold text-teal-light hover:underline flex items-center gap-1">
            Team Hub <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4 border-card-border hover:border-teal/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="teal" size="sm">
                    {match.overs} Overs Match
                  </Badge>
                  <h4 className="font-bold text-base text-text-primary mt-1.5">
                    {match.team1Name} {match.team2Name ? `vs ${match.team2Name}` : 'vs Open Challenger'}
                  </h4>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-text-muted" />
                    <span>{match.groundName}</span>
                    <span className="text-text-muted">•</span>
                    <span>{match.matchDate}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Entry Fee</span>
                  <span className="text-sm font-bold text-text-primary">Rs. {match.entryFee}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-card-border flex items-center justify-between">
                <span className="text-xs text-orange font-bold">
                  {match.spotsLeft > 0 ? `⚡ ${match.spotsLeft} Team Spot Open` : 'Match Full'}
                </span>
                <Button size="sm" variant="outline" className="text-xs py-1 text-teal-light border-teal/30 hover:bg-teal/10">
                  Challenge Team
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Slot Modal */}
      {bookingGround && (
        <BookingModal
          ground={bookingGround}
          slots={getSlotsForGround(bookingGround.id)}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setBookingGround(null);
          }}
        />
      )}
    </div>
  );
}
