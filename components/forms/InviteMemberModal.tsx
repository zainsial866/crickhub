'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Copy, Check, Mail, User } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  onAddMember: (name: string, email: string) => Promise<void>;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  inviteCode,
  onAddMember,
}: InviteMemberModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    await onAddMember(name, email);
    setLoading(false);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Teammates"
      description="Add players to your roster by invite code or direct email."
    >
      <div className="space-y-5">
        {/* Share Invite Code */}
        <div className="p-4 rounded-xl bg-surface border border-card-border space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Share Team Invite Code
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteCode}
              className="flex-1 bg-card border border-card-border rounded-lg px-3 py-2 text-sm font-mono font-bold text-primary-light"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-[10px] text-text-secondary">
            Players can enter this code in their Team tab to join your team automatically.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="bg-card px-3 text-[11px] uppercase font-bold text-text-muted z-10">Or add directly</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
        </div>

        {/* Direct Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Player Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Asad Rauf"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="player@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-card-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
