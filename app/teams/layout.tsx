'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PublicTeamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg px-4 py-6 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/player/crickethub"
          className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-text-secondary transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CricketHub
        </Link>
        {children}
      </div>
    </div>
  );
}
