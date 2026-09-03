'use client';

import { useAppStore } from '@/lib/store';

export function useAdmin() {
  const stats = useAppStore((state) => state.stats);
  const grounds = useAppStore((state) => state.grounds);
  const disputes = useAppStore((state) => state.disputes);
  const approveGround = useAppStore((state) => state.approveGround);
  const rejectGround = useAppStore((state) => state.rejectGround);
  const resolveDispute = useAppStore((state) => state.resolveDispute);

  return {
    stats,
    grounds,
    disputes,
    approveGround,
    rejectGround,
    resolveDispute,
  };
}
