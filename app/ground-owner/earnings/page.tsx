'use client';

import React, { useState } from 'react';
import { useOwner } from '@/hooks/useOwner';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { formatPKR, formatDisplayDate } from '@/lib/utils';
import {
  CircleDollarSign,
  ArrowDownToLine,
  TrendingUp,
  CreditCard,
  Banknote,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function OwnerEarningsPage() {
  const { bookings } = useOwner();
  const [downloaded, setDownloaded] = useState(false);

  const totalGross = 384000;
  const cashTotal = 245000;
  const onlineWalletTotal = 139000;

  const handleExportCSV = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Revenue & Payouts</h2>
          <p className="text-xs text-text-secondary">Track gross match volume, cash on ground, and digital settlements</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={downloaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ArrowDownToLine className="w-4 h-4" />}
        >
          {downloaded ? 'Report Exported' : 'Export Statement (CSV)'}
        </Button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2 bg-gradient-to-br from-card to-surface">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">This Month Gross</span>
            <CircleDollarSign className="w-4 h-4 text-primary-light" />
          </div>
          <p className="text-2xl font-black text-text-primary">{formatPKR(totalGross)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +22.4% vs last month
          </p>
        </Card>

        <Card className="p-5 space-y-2 bg-gradient-to-br from-card to-surface">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Cash on Ground</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-text-primary">{formatPKR(cashTotal)}</p>
          <p className="text-[11px] text-text-muted">Collected directly at facility</p>
        </Card>

        <Card className="p-5 space-y-2 bg-gradient-to-br from-card to-surface">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-text-muted uppercase">Digital Wallet (EasyPaisa)</span>
            <CreditCard className="w-4 h-4 text-teal-light" />
          </div>
          <p className="text-2xl font-black text-teal-light">{formatPKR(onlineWalletTotal)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">Settled directly to your bank</p>
        </Card>
      </div>

      {/* Transaction Breakdown Table */}
      <Card className="p-0 overflow-hidden border-card-border">
        <div className="px-5 py-4 border-b border-card-border bg-surface/50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-text-primary">Recent Booking Transactions</h3>
          <span className="text-xs text-text-muted">Last 30 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-card-border bg-surface/30 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Gross Fee</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {bookings.map((item) => (
                <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-primary-light">
                    {item.referenceCode}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-text-primary">{item.userName}</p>
                    <p className="text-[10px] text-text-muted">{item.userPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    <p className="font-medium text-text-primary">{item.slotTime}</p>
                    <p className="text-[10px] text-text-muted">{formatDisplayDate(item.date)}</p>
                  </td>
                  <td className="py-3 px-4 capitalize text-text-secondary">
                    {item.paymentMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-sm text-text-primary">
                    {formatPKR(item.totalPrice)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={item.status === 'confirmed' ? 'success' : 'orange'} size="sm">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
