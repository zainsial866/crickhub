'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck2,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Zap,
  X,
} from 'lucide-react';
import { useGrounds } from '@/hooks/useGrounds';
import { useBookings } from '@/hooks/useBookings';
import { GroundCard } from '@/components/cards/GroundCard';
import { BookingModal } from '@/components/forms/BookingModal';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Ground } from '@/types';
import { PITCH_TYPES, CITIES } from '@/lib/constants';

export default function DiscoverPage() {
  const {
    grounds,
    allGrounds,
    selectedCity,
    setSelectedCity,
    selectedPitchType,
    setSelectedPitchType,
    searchQuery,
    setSearchQuery,
    getSlotsForGround,
  } = useGrounds();
  const { upcomingBookings } = useBookings();
  const [bookingGround, setBookingGround] = useState<Ground | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>(
    'distance'
  );

  const availableSlots = allGrounds.reduce(
    (total, ground) =>
      total +
      getSlotsForGround(ground.id).filter((slot) => slot.isAvailable).length,
    0
  );

  const openBooking = (ground: Ground) => {
    setBookingGround(ground);
    setIsBookingOpen(true);
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedPitchType('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCity !== 'all' ||
    selectedPitchType !== 'all' ||
    searchQuery.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-16">
      {/* Hero Section with Stats */}
      <section className="rounded-3xl border border-card-border bg-gradient-to-br from-card via-surface to-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-primary-light">
              DISCOVER GROUNDS
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-text-primary sm:text-5xl">
              Book your next cricket session
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
              Find verified indoor arenas, check live availability, and reserve
              a slot in a few taps.
            </p>
          </div>
          <Link
            href="/player/bookings"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-card-border bg-card px-5 py-3 text-xs font-bold text-text-primary transition hover:border-primary hover:text-primary-light hover:bg-primary/5"
          >
            <CalendarCheck2 className="h-4 w-4" />
            My bookings
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-bg p-5">
            <p className="text-3xl font-black text-primary-light">
              {allGrounds.length}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Verified arenas
            </p>
          </div>
          <div className="rounded-2xl bg-bg p-5">
            <p className="text-3xl font-black text-emerald-400">
              {availableSlots}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Slots available
            </p>
          </div>
          <div className="hidden rounded-2xl bg-bg p-5 sm:block">
            <p className="text-3xl font-black text-text-primary">
              {upcomingBookings.length}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Your upcoming
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search arena name, area, or city..."
            className="w-full rounded-2xl border border-card-border bg-card px-4 py-3.5 pl-11 text-sm text-text-primary placeholder-text-muted transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Filter & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Desktop Filter Buttons */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-text-muted">
              Filter:
            </span>
            <FilterButton
              active={selectedCity === 'all'}
              onClick={() => setSelectedCity('all')}
            >
              All Cities
            </FilterButton>
            {CITIES.map((city) => (
              <FilterButton
                key={city}
                active={selectedCity === city}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </FilterButton>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="sm:hidden w-full">
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Filters {hasActiveFilters && '(active)'}
            </Button>
          </div>

          {/* Sort & Reset Controls */}
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'distance' | 'price' | 'rating')
              }
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-card-border bg-card text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                leftIcon={<X className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="sm:hidden space-y-4 rounded-2xl border border-card-border bg-surface p-4 animate-in fade-in slide-in-from-top">
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-text-muted">
                City
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={selectedCity === 'all'}
                  onClick={() => {
                    setSelectedCity('all');
                    setShowFilters(false);
                  }}
                >
                  All Cities
                </FilterButton>
                {CITIES.map((city) => (
                  <FilterButton
                    key={city}
                    active={selectedCity === city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowFilters(false);
                    }}
                  >
                    {city}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-text-muted">
                Pitch Type
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={selectedPitchType === 'all'}
                  onClick={() => {
                    setSelectedPitchType('all');
                    setShowFilters(false);
                  }}
                >
                  All Types
                </FilterButton>
                {PITCH_TYPES.map((type) => (
                  <FilterButton
                    key={type.id}
                    active={selectedPitchType === type.id}
                    onClick={() => {
                      setSelectedPitchType(type.id);
                      setShowFilters(false);
                    }}
                  >
                    {type.label}
                  </FilterButton>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
                size="sm"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Type Filter for Desktop */}
        <div className="hidden sm:block">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-text-muted">
              Type:
            </span>
            <FilterButton
              active={selectedPitchType === 'all'}
              onClick={() => setSelectedPitchType('all')}
            >
              All Types
            </FilterButton>
            {PITCH_TYPES.map((type) => (
              <FilterButton
                key={type.id}
                active={selectedPitchType === type.id}
                onClick={() => setSelectedPitchType(type.id)}
              >
                {type.label}
              </FilterButton>
            ))}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                leftIcon={<X className="w-4 h-4" />}
                className="ml-auto text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-secondary">
          {grounds.length} ground{grounds.length !== 1 ? 's' : ''} found
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      {/* Grounds Grid */}
      {grounds.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grounds.map((ground) => (
            <GroundCard
              key={ground.id}
              ground={ground}
              onBookClick={openBooking}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-card-border p-12 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary-light" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                No grounds found
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
            <Button
              variant="primary"
              onClick={resetFilters}
              className="mt-4 inline-block"
            >
              Clear all filters
            </Button>
          </div>
        </Card>
      )}

      {/* Booking Modal */}
      {bookingGround && (
        <BookingModal
          ground={bookingGround}
          slots={getSlotsForGround(bookingGround.id)}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
        active
          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
          : 'border-card-border bg-card text-text-secondary hover:border-primary/50 hover:text-text-primary hover:bg-card/70'
      }`}
    >
      {children}
    </button>
  );
}
