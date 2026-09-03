'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Search, Shield, User, Building2, Ban, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  status: 'active' | 'suspended';
  joinedDate: string;
}

const INITIAL_USERS: DemoUser[] = [
  { id: 'u-1', name: 'Zain Sial', email: 'zain@crickethub.pk', role: 'admin', city: 'Islamabad', status: 'active', joinedDate: 'Aug 2026' },
  { id: 'u-2', name: 'Mueed Ahmad', email: 'mueed@crickethub.pk', role: 'admin', city: 'Islamabad', status: 'active', joinedDate: 'Aug 2026' },
  { id: 'u-3', name: 'Shahmeer Khan', email: 'shahmeer@crickethub.pk', role: 'player', city: 'Islamabad', status: 'active', joinedDate: 'Aug 2026' },
  { id: 'u-4', name: 'Hamid Ali', email: 'hamid@rawalhub.pk', role: 'ground_owner', city: 'Rawalpindi', status: 'active', joinedDate: 'Aug 2026' },
  { id: 'u-5', name: 'Bilal Asif', email: 'bilal@gmail.com', role: 'player', city: 'Islamabad', status: 'active', joinedDate: 'Aug 2026' },
  { id: 'u-6', name: 'Kamran Akmal', email: 'kamran@f6arena.pk', role: 'ground_owner', city: 'Islamabad', status: 'active', joinedDate: 'Sep 2026' },
  { id: 'u-7', name: 'Usman Ghani', email: 'usman@gmail.com', role: 'player', city: 'Rawalpindi', status: 'suspended', joinedDate: 'Sep 2026' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DemoUser[]>(INITIAL_USERS);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchQuery =
      query === '' ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    return matchRole && matchQuery;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">User Account Directory</h2>
        <p className="text-xs text-text-secondary">Moderate players, facility owners, and platform administrators</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="w-full bg-card border border-card-border rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(['all', 'player', 'ground_owner', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                roleFilter === r
                  ? 'bg-primary text-white'
                  : 'bg-card border border-card-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden border-card-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-card-border bg-surface/40 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-text-primary">{user.name}</p>
                    <p className="text-[11px] text-text-muted">{user.email}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'orange'
                          : user.role === 'ground_owner'
                          ? 'teal'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-text-secondary">{user.city}</td>
                  <td className="py-3.5 px-4 text-text-muted">{user.joinedDate}</td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'} size="sm">
                      {user.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant={user.status === 'active' ? 'outline' : 'secondary'}
                      onClick={() => toggleStatus(user.id)}
                      className={`text-xs py-1 px-2.5 ${
                        user.status === 'active'
                          ? 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                          : 'text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Reinstate'}
                    </Button>
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
