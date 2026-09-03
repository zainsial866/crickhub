'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { formatPKR } from '@/lib/utils';
import { Building2, Check, X, Star, MapPin, Eye } from 'lucide-react';
import { Ground } from '@/types';

export default function AdminGroundsPage() {
  const { grounds, approveGround, rejectGround } = useAdmin();
  const [inspectingGround, setInspectingGround] = useState<Ground | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  const filtered = grounds.filter((g) =>
    filterStatus === 'all' ? true : g.status === filterStatus
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Ground Approval & Moderation</h2>
          <p className="text-xs text-text-secondary">Verify and publish indoor box cricket arenas across Islamabad & Rawalpindi</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-card border border-card-border text-text-secondary'
            }`}
          >
            All ({grounds.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-primary text-white'
                : 'bg-card border border-card-border text-text-secondary'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-primary text-white'
                : 'bg-card border border-card-border text-text-secondary'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Grounds Directory Table */}
      <Card className="p-0 overflow-hidden border-card-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-card-border bg-surface/40 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4">Ground & Location</th>
                <th className="py-3.5 px-4">City / Pitch</th>
                <th className="py-3.5 px-4">Slot Pricing</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filtered.map((ground) => (
                <tr key={ground.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-sm text-text-primary">{ground.name}</p>
                    <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-text-muted" /> {ground.location}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-text-primary">{ground.city}</p>
                    <p className="text-[10px] text-text-muted capitalize">{ground.pitchType.replace('_', ' ')}</p>
                  </td>

                  <td className="py-3.5 px-4 font-black text-primary-light">
                    {formatPKR(ground.hourlyRate)} /hr
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{ground.rating}</span>
                      <span className="text-text-muted font-normal">({ground.reviewCount})</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={ground.status === 'approved' ? 'success' : 'orange'} size="sm">
                      {ground.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setInspectingGround(ground)}
                        className="text-xs py-1 px-2"
                        leftIcon={<Eye className="w-3 h-3" />}
                      >
                        Inspect
                      </Button>

                      {ground.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => approveGround(ground.id)}
                            className="text-xs py-1 px-2.5"
                            leftIcon={<Check className="w-3 h-3" />}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectGround(ground.id)}
                            className="text-xs py-1 px-2.5 text-red-400 border-red-500/30"
                            leftIcon={<X className="w-3 h-3" />}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Ground Modal */}
      {inspectingGround && (
        <Modal
          isOpen={!!inspectingGround}
          onClose={() => setInspectingGround(null)}
          title={inspectingGround.name}
          description={inspectingGround.location}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl overflow-hidden h-44 w-full">
              <img
                src={inspectingGround.imageUrl}
                alt={inspectingGround.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-text-secondary leading-relaxed">{inspectingGround.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {inspectingGround.amenities.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded bg-surface border border-card-border text-[11px] text-text-secondary">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-card-border flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setInspectingGround(null)}>
                Close
              </Button>
              {inspectingGround.status === 'pending' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    approveGround(inspectingGround.id);
                    setInspectingGround(null);
                  }}
                >
                  Verify & Approve Ground
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
