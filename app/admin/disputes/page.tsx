'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { DisputeTicket } from '@/types';
import { AlertCircle, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function AdminDisputesPage() {
  const { disputes, resolveDispute } = useAdmin();
  const [activeTicket, setActiveTicket] = useState<DisputeTicket | null>(null);

  const handleResolve = (ticketId: string) => {
    resolveDispute(ticketId);
    setActiveTicket(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Dispute Resolution Console</h2>
        <p className="text-xs text-text-secondary">Investigate player booking complaints, floodlight outages, and refund issues</p>
      </div>

      <div className="space-y-4">
        {disputes.map((ticket) => (
          <Card key={ticket.id} className="p-5 space-y-3 border-card-border hover:border-orange/40 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange bg-orange/10 px-2 py-0.5 rounded">
                  {ticket.ticketNumber}
                </span>
                <Badge variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'danger' : 'teal'} size="sm">
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>Ground: <strong>{ticket.groundName}</strong></span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-text-primary">{ticket.subject}</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="pt-3 border-t border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-text-muted">
                Raised by: <strong>{ticket.raisedByName}</strong> ({ticket.raisedByRole})
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setActiveTicket(ticket)}
                  className="text-xs py-1"
                >
                  Review Case
                </Button>

                {ticket.status !== 'resolved' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleResolve(ticket.id)}
                    className="text-xs py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title={`Ticket ${activeTicket.ticketNumber}`}
          description={activeTicket.subject}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-surface p-4 rounded-xl border border-card-border space-y-2">
              <p className="text-text-muted">Facility: <strong>{activeTicket.groundName}</strong></p>
              <p className="text-text-muted">Complainant: <strong>{activeTicket.raisedByName}</strong></p>
              <p className="text-text-secondary leading-relaxed pt-2 border-t border-card-border">
                {activeTicket.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange/10 border border-orange/20 text-orange space-y-1">
              <p className="font-bold">Admin Resolution Action</p>
              <p className="text-[11px]">
                Upon marking resolved, an automated credit voucher or SMS confirmation will be dispatched to the complainant.
              </p>
            </div>

            <div className="pt-3 border-t border-card-border flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveTicket(null)}>
                Close
              </Button>
              {activeTicket.status !== 'resolved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResolve(activeTicket.id)}
                >
                  Confirm Resolution
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
