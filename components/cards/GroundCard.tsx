'use client';

import React from 'react';
import Image from 'next/image';
import { Ground } from '@/types';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { formatPKR } from '@/lib/utils';
import { Star, MapPin, Clock, Zap } from 'lucide-react';

interface GroundCardProps {
  ground: Ground;
  onBookClick?: (ground: Ground) => void;
}

export function GroundCard({ ground, onBookClick }: GroundCardProps) {
  const pitchLabel = {
    indoor_net: 'Indoor Nets',
    turf_box: 'Turf Box',
    matting: 'Matting Wicket',
  }[ground.pitchType];

  const handleCardClick = () => {
    if (onBookClick) onBookClick(ground);
  };

  return (
    <Card
      variant="interactive"
      onClick={handleCardClick}
      className="p-0 overflow-hidden flex flex-col justify-between group h-full cursor-pointer"
    >
      <div>
        {/* Ground Photo & Badges */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-surface">
          <Image
            src={ground.imageUrl}
            alt={ground.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <Badge variant="primary" size="sm">
              {pitchLabel}
            </Badge>
            <Badge variant="outline" size="sm" className="bg-black/50 backdrop-blur-md text-white border-white/20">
              {ground.city}
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 text-xs font-bold bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ground.rating}</span>
              <span className="text-white/60 font-normal">({ground.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-teal-light" />
              <span>{ground.distanceKm} km away</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {ground.name}
            </h3>
            <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-text-muted shrink-0" />
              <span className="line-clamp-1">{ground.location}</span>
            </p>
          </div>

          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {ground.description}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span>{ground.operatingHours}</span>
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-4 pt-2 border-t border-card-border flex items-center justify-between gap-3 bg-surface/40">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted block">Slot Rate</span>
          <span className="text-base font-extrabold text-primary-light">
            {formatPKR(ground.hourlyRate)}
            <span className="text-xs font-normal text-text-muted"> /hr</span>
          </span>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            if (onBookClick) onBookClick(ground);
          }}
          leftIcon={<Zap className="w-3.5 h-3.5 fill-current" />}
        >
          Book Slot
        </Button>
      </div>
    </Card>
  );
}
