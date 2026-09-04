'use client';

import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { TeamJoinRequest } from '@/types';
import { Check, X, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JoinRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  joinRequests: TeamJoinRequest[];
  canApprove: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function JoinRequestsModal({
  isOpen,
  onClose,
  teamName,
  joinRequests,
  canApprove,
  onApprove,
  onReject,
}: JoinRequestsModalProps) {
  const pending = joinRequests.filter((r) => r.status === 'pending');
  const past = joinRequests.filter((r) => r.status !== 'pending');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join Requests for ${teamName}`}
      description="Review and manage incoming membership applications from prospective players."
    >
      <div className="space-y-5">
        {/* Pending Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              Pending Review ({pending.length})
            </span>
            {!canApprove && (
              <span className="text-[10px] text-amber-400">
                Captain or Vice Captain authority required to approve
              </span>
            )}
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {pending.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--text)] truncate">
                      {req.playerName}
                    </span>
                    <Badge variant="orange" size="sm">
                      {req.playingRole || 'Player'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{req.playerEmail}</p>
                  <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Requested on{' '}
                    {new Date(req.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!canApprove}
                    onClick={() => onApprove(req.id)}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canApprove}
                    onClick={() => onReject(req.id)}
                    leftIcon={<X className="w-3.5 h-3.5" />}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {pending.length === 0 && (
              <div className="p-6 text-center text-xs text-[var(--text-muted)] rounded-2xl bg-[var(--surface)]/50 border border-[var(--card-border)]">
                No pending join requests for {teamName}.
              </div>
            )}
          </div>
        </div>

        {/* Past Decisions History */}
        {past.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-[var(--card-border)]">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Previous Decisions ({past.length})
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {past.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-[var(--card)]/60 border border-[var(--card-border)] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-[var(--text)] truncate block">
                      {req.playerName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {req.playerEmail}
                    </span>
                  </div>
                  <Badge
                    variant={req.status === 'approved' ? 'teal' : 'danger'}
                    size="sm"
                  >
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

