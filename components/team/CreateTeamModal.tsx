'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { PlayingRole } from '@/types';
import { Globe2, Shield, Sparkles } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (
    name: string,
    city: string,
    description: string,
    playingRole: PlayingRole,
    isPublic: boolean
  ) => void;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
}: CreateTeamModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [description, setDescription] = useState('');
  const [playingRole, setPlayingRole] = useState<PlayingRole>('all_rounder');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    onCreateTeam(name.trim(), city, description.trim(), playingRole, isPublic);
    setLoading(false);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a New Cricket Team"
      description="Found a squad, become Captain, and invite your teammates to compete."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Team Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Margalla Titans"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Home City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Peshawar">Peshawar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Your Playing Role
            </label>
            <select
              value={playingRole}
              onChange={(e) => setPlayingRole(e.target.value as PlayingRole)}
              className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="all_rounder">⚡ All-Rounder</option>
              <option value="batter">🏏 Batter</option>
              <option value="bowler">🎯 Bowler</option>
              <option value="wicketkeeper">🧤 Wicketkeeper</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Description / Motto
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Competitive box cricket enthusiasts playing weekend tournaments..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-3.5 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--card-border)]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-1 accent-[var(--primary)] w-4 h-4 rounded"
            />
            <div>
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[var(--teal)]" />
                Make Team Public
              </span>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Public teams appear on leaderboard and discoverable team directories.
              </p>
            </div>
          </label>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-300">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          <span>You will automatically be assigned as <strong>Captain</strong> with full permissions.</span>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  );
}

