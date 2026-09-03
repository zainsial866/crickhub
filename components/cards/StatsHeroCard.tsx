'use client';

import React from 'react';
import { Sparkles, Calendar, Trophy, Users } from 'lucide-react';

interface StatsHeroCardProps {
  availablePercentage?: number;
  upcomingCount?: number;
  teamRank?: number;
  matchesPlayed?: number;
}

export function StatsHeroCard({
  availablePercentage = 78,
  upcomingCount = 2,
  teamRank = 1,
  matchesPlayed = 19,
}: StatsHeroCardProps) {
  // Stroke calculation for circular SVG ring (radius 40 => circumference 2 * PI * 40 ~= 251.2)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (availablePercentage / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-5 sm:p-7 shadow-xl shadow-primary/25 border border-primary-light/20">
      {/* Background ambient decorative aura */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Availability Ring & Headline */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-white/20 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-white stroke-current transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold leading-none">{availablePercentage}%</span>
              <span className="text-[9px] uppercase tracking-wider text-white/80 mt-1 font-bold">Open</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-orange-light" />
              Twin Cities Prime Slots
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Indoor Arenas Open Today</h2>
            <p className="text-xs text-white/80 mt-0.5">
              High-demand evening slots booking quickly across F-6 & Murree Road.
            </p>
          </div>
        </div>

        {/* Right: Quick Stat Chips */}
        <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center px-2">
            <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg bg-white/15 mb-1.5">
              <Calendar className="w-4 h-4 text-orange-light" />
            </div>
            <p className="text-base font-extrabold">{upcomingCount}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-tight">Bookings</p>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg bg-white/15 mb-1.5">
              <Trophy className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-base font-extrabold">#{teamRank}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-tight">Rank</p>
          </div>

          <div className="text-center px-2">
            <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg bg-white/15 mb-1.5">
              <Users className="w-4 h-4 text-teal-light" />
            </div>
            <p className="text-base font-extrabold">{matchesPlayed}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-tight">Matches</p>
          </div>
        </div>
      </div>
    </div>
  );
}
