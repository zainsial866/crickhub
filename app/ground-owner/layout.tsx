import React from 'react';
import { GroundOwnerLayout } from '@/components/layouts/GroundOwnerLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GroundOwnerLayout>{children}</GroundOwnerLayout>;
}
