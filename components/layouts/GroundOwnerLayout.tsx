'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navigation } from '@/components/shared/Navigation';

export function GroundOwnerLayout({ children }: { children: React.ReactNode }) {
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
        <main className="ml-0 flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 transition-[margin] duration-200 md:ml-[var(--sidebar-offset)]" style={{ '--sidebar-offset': `${isSidebarOpen ? sidebarWidth + 32 : 96}px` } as React.CSSProperties}>
          {children}
        </main>
      </div>
      <Navigation />
    </div>
  );
}
