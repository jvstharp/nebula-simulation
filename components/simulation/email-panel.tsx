"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CHARACTERS } from "@/lib/data";
import type { Message, Character } from "@/lib/types";

function EmailRow({ msg, chars, onClick, selected }: { msg: Message; chars: Character[]; onClick: () => void; selected: boolean }) {
  const sender = msg.from === 'user' ? null : chars.find(c => c.id === msg.from);
  const timeStr = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-3 py-3 hover:bg-white/4 transition-colors border-b border-white/4 ${selected ? 'bg-white/6' : ''} ${!msg.read && msg.from !== 'user' ? 'relative' : ''}`}
    >
      {!msg.read && msg.from !== 'user' && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
      )}
      {sender ? (
        <Avatar name={sender.name} color={sender.color} size="sm" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">You</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className={`text-sm truncate ${!msg.read && msg.from !== 'user' ? 'text-white font-medium' : 'text-white/60'}`}>
            {sender ? sender.name : 'You'}
          </span>
          <span className="text-xs text-white/25 shrink-0 ml-2">{timeStr}</span>
        </div>
        <div className="text-xs text-white/40 truncate mt-0.5">{msg.subject || msg.body.slice(0, 60)}</div>
      </div>
    </button>
  );
}

export function EmailPanel() {
  const { messages, sendMessage, setActiveCharacter, characters } = useAppStore();
  const emailMsgs = messages.filter(m => m.channel === 'email');
  const [selectedId, setSelectedId] = useState<string | null>(emailMsgs[0]?.id ?? null);
  const [composing, setComposing] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [replySubject, setReplySubject] = useState('');

  const selected = emailMsgs.find(m => m.id === selectedId);
  const unreadCount = emailMsgs.filter(m => !m.read && m.from !== 'user').length;

  const handleReply = () => {
    if (!replyBody.trim() || !selected) return;
    const char = characters.find(c => c.id === selected.from || c.id === selected.to);
    if (char) setActiveCharacter(char);
    sendMessage(replyBody, 'email', `RE: ${selected.subject || 'No subject'}`);
    setReplyBody('');
    setComposing(false);
  };

  return (
    <div className="flex h-full">
      {/* Thread list */}
      <div className="w-56 border-r border-white/5 flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
          <span className="text-xs font-medium text-white/60">Inbox {unreadCount > 0 && <span className="ml-1 text-blue-400">{unreadCount}</span>}</span>
          <button onClick={() => setComposing(true)} className="text-xs text-white/30 hover:text-white/60 transition-colors">+ New</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emailMsgs.length === 0 ? (
            <p className="text-xs text-white/25 text-center py-8">No emails yet</p>
          ) : (
            emailMsgs.map(m => (
              <EmailRow key={m.id} msg={m} chars={characters} onClick={() => setSelectedId(m.id)} selected={selectedId === m.id} />
            ))
          )}
        </div>
      </div>

      {/* Email detail / compose */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {composing ? (
          <div className="flex flex-col h-full p-4 gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">New Message</h3>
              <button onClick={() => setComposing(false)} className="text-xs text-white/30 hover:text-white/60">✕ Cancel</button>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Input placeholder="Subject" value={replySubject} onChange={e => setReplySubject(e.target.value)} />
            <Textarea placeholder="Write your message..." value={replyBody} onChange={e => setReplyBody(e.target.value)} className="flex-1 min-h-32" />
            <Button onClick={handleReply} disabled={!replyBody.trim()}>Send</Button>
          </div>
        ) : selected ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">{selected.subject || '(No subject)'}</h3>
              <div className="flex items-center gap-2 mt-2">
                {selected.from !== 'user' && (() => {
                  const c = characters.find(ch => ch.id === selected.from);
                  return c ? <><Avatar name={c.name} color={c.color} size="sm" /><span className="text-xs text-white/50">{c.name} · {c.title}</span></> : null;
                })()}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
            </div>
            {selected.from !== 'user' && (
              <div className="p-4 border-t border-white/5">
                {!composing ? (
                  <Textarea
                    placeholder={`Reply to ${characters.find(c => c.id === selected.from)?.name || 'them'}...`}
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    className="mb-2 min-h-20"
                    onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleReply(); }}
                  />
                ) : null}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/20">⌘ + Enter to send</span>
                  <Button size="sm" onClick={handleReply} disabled={!replyBody.trim()}>Reply</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-white/20">Select an email to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
