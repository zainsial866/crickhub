import React from 'react';
import { PlayerLayout } from '@/components/layouts/PlayerLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlayerLayout>{children}</PlayerLayout>;
}
