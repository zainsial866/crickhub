import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading CricketHub...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 gap-3 text-center">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">🏏</span>
      </div>
      <p className="text-sm font-medium text-text-secondary animate-pulse">{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 animate-pulse space-y-3">
      <div className="h-40 bg-surface rounded-xl" />
      <div className="h-4 bg-surface rounded w-3/4" />
      <div className="h-3 bg-surface rounded w-1/2" />
    </div>
  );
}
