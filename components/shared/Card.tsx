'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
}

export function Card({
  className,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'bg-card border border-card-border rounded-2xl p-4 sm:p-5 transition-all duration-200';

  const variants = {
    default: '',
    elevated: 'shadow-lg shadow-black/10',
    interactive: 'hover:border-primary/50 hover:shadow-md cursor-pointer hover:-translate-y-0.5',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
