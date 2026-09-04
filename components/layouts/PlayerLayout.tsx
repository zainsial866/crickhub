'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navigation } from '@/components/shared/Navigation';

export function PlayerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(288);

  useEffect(() => {
    const handleResize = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX;
      if (clientX !== undefined) setSidebarWidth(Math.min(420, Math.max(220, clientX)));
    };
    const stopResize = () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('touchmove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('touchend', stopResize);
    };
    const startResize = () => {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('touchmove', handleResize, { passive: false });
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('touchend', stopResize);
    };
    window.addEventListener('sidebar-resize-start', startResize as EventListener);
    return () => {
      window.removeEventListener('sidebar-resize-start', startResize as EventListener);
      stopResize();
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <div className="flex-1 flex w-full pt-24">
        <Sidebar isOpen={isSidebarOpen} width={sidebarWidth} onToggle={() => setIsSidebarOpen((open) => !open)} onResizeStart={() => window.dispatchEvent(new Event('sidebar-resize-start'))} />
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 transition-[padding] duration-200 md:pl-[var(--sidebar-offset)]" style={{ '--sidebar-offset': `${isSidebarOpen ? sidebarWidth + 32 : 96}px` } as React.CSSProperties}>
          {pathname.startsWith('/teams/') && (
            <Link href="/player/crickethub" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-text-secondary transition-colors hover:text-primary-light">
              <ArrowLeft className="h-4 w-4" />
              Back to CricketHub
            </Link>
          )}
          {children}
        </main>
      </div>
      <Navigation />
    </div>
  );
}
