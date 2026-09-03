'use client';

import React, { useState } from 'react';
import { useOwner } from '@/hooks/useOwner';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Building2, Save, CheckCircle2, MapPin, Clock, Zap } from 'lucide-react';

export default function OwnerSettingsPage() {
  const { ground } = useOwner();

  const [name, setName] = useState(ground.name);
  const [location, setLocation] = useState(ground.location);
  const [address, setAddress] = useState(ground.address);
  const [rate, setRate] = useState(ground.hourlyRate);
  const [operatingHours, setOperatingHours] = useState(ground.operatingHours);
  const [description, setDescription] = useState(ground.description);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Facility Settings</h2>
        <p className="text-xs text-text-secondary">Update your ground profile, hourly rates, and arena amenities</p>
      </div>

      <Card className="p-6 sm:p-7">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Arena / Ground Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Sector / Area</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Standard Hourly Rate (PKR)</label>
                <input
                  type="number"
                  required
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Full Physical Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Operating Hours</label>
              <input
                type="text"
                required
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1.5">Ground Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>

            {/* Active Amenities Preview */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-text-secondary block mb-2">Enabled Amenities</label>
              <div className="flex flex-wrap gap-2">
                {ground.amenities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface border border-card-border text-xs text-text-secondary font-medium"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-card-border flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ground profile updated!
              </span>
            ) : <span />}

            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Facility Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
