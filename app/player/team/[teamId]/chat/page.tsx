'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';

export default function TeamChatPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { team, chatMessages, sendChatMessage } = useTeams();
  const [message, setMessage] = useState('');
  const messages = chatMessages.filter((item) => item.teamId === teamId);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    sendChatMessage(teamId, message.trim());
    setMessage('');
  };

  return <div className="max-w-3xl space-y-6"><div><h1 className="text-2xl font-black text-text-primary flex items-center gap-2"><MessageCircle className="w-6 h-6 text-teal-light" />{team.name} Chat</h1><p className="text-xs text-text-secondary">Private conversation for team members and match updates.</p></div><Card className="p-5"><div className="space-y-4 min-h-[360px]">{messages.map((item) => <div key={item.id} className={`flex ${item.isSystem ? 'justify-center' : 'gap-3'}`}>{item.isSystem ? <div className="rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-[11px] text-primary-light">{item.message}</div> : <><div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-bold">{item.senderName.slice(0, 2).toUpperCase()}</div><div><p className="text-xs font-bold text-text-primary">{item.senderName}</p><p className="text-sm text-text-secondary mt-0.5">{item.message}</p></div></>}</div>)}</div><form onSubmit={submit} className="flex gap-2 border-t border-card-border pt-4"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a message..." className="flex-1 bg-surface border border-card-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary" /><Button type="submit" variant="primary" leftIcon={<Send className="w-4 h-4" />}>Send</Button></form></Card></div>;
}
