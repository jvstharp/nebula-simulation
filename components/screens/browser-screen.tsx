"use client";
import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { AppWindow } from "@/components/layout/app-window";
import type { BrowserTab, SimulationStage, KanbanCard, KanbanColumn } from "@/lib/types";
import { SectionHeader, cardStyle, cardHoverIn, cardHoverOut } from "@/components/layout/discovery-ui";
import { AnalyticsPanel } from "@/components/simulation/analytics-panel";
import { OKRPanel } from "@/components/simulation/okr-panel";
import { MOCK_ANALYTICS, USER_AVATAR } from "@/lib/data";

/* ── Tab icon SVGs ──────────────────────────────────────────────────────────── */
function MailTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M1 4l5.5 4L12 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function ChatTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 2h10a1 1 0 011 1v6a1 1 0 01-1 1H4L1 12V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
    </svg>
  );
}
function BoardTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="1" width="3.5" height="11" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <rect x="4.75" y="1" width="3.5" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <rect x="8.5" y="1" width="3.5" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}
function CalTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M1 5.5h11" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="4.5" cy="8.5" r="0.8" fill="currentColor" />
      <circle cx="6.5" cy="8.5" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function VideoTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="3" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M9 5.5l3-1.5v5l-3-1.5v-2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function NebulaTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M4 8.5c0-2 1.1-3.5 2.5-3.5S9 6.5 9 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="6.5" cy="4" r="0.9" fill="currentColor" />
    </svg>
  );
}
function OverviewTabIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M6.5 3v3.5l2.2 1.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TAB_CONFIG: {
  id: BrowserTab;
  label: string;
  icon: React.ReactNode;
  url: string;
  accentColor: string;
}[] = [
  { id: 'overview', label: 'Mission',    icon: <OverviewTabIcon />, url: 'workspace.nebula.io/mission', accentColor: '#147b58' },
  { id: 'email',    label: 'Mail',       icon: <MailTabIcon />,    url: 'mail.company.io',            accentColor: '#147b58' },
  { id: 'chat',     label: 'Chat',       icon: <ChatTabIcon />,    url: 'chat.company.io',            accentColor: '#34d399' },
  { id: 'project',  label: 'Projects',   icon: <BoardTabIcon />,   url: 'project.company.io/sprint-3',accentColor: '#147b58' },
  { id: 'calendar', label: 'Calendar',   icon: <CalTabIcon />,     url: 'calendar.company.io',        accentColor: '#fb923c' },
  { id: 'meetings', label: 'Meetings',   icon: <VideoTabIcon />,   url: 'meet.company.io/weekly-standup', accentColor: '#147b58' },
  { id: 'assistant',label: 'Nebula AI',  icon: <NebulaTabIcon />,  url: 'nebula.ai/assistant',        accentColor: '#147b58' },
];

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function formatElapsed(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* ── EMAIL TAB ──────────────────────────────────────────────────────────────── */
const EMAILS = [
  { id: 1, from: 'Elena Rodriguez', subject: 'Board Update — Q3 Roadmap', preview: 'Need a unified position by Friday. The board is asking questions...', time: '9:41 AM', unread: true, avatar: '#7c3aed' },
  { id: 2, from: 'Marcus Lee', subject: 'Re: Engineering Capacity', preview: 'That timeline is impossible. We\'re already at 90% and you want to add...', time: '9:15 AM', unread: true, avatar: '#dc2626' },
  { id: 3, from: 'Sarah Chen', subject: 'Metrics Review Request', preview: 'The data needs to support any changes we propose. Let me review...', time: '8:52 AM', unread: false, avatar: '#0891b2' },
  { id: 4, from: 'Tom Walsh', subject: 'Acme Corp — Feature Request', preview: 'Acme Corp is watching closely. If we don\'t ship those three features...', time: 'Yesterday', unread: false, avatar: '#059669' },
  { id: 5, from: 'Priya Sharma', subject: 'UX Debt Concerns', preview: 'I\'m worried we\'re cutting corners on UX again. Users will notice...', time: 'Yesterday', unread: false, avatar: '#d97706' },
  { id: 6, from: 'Design System Bot', subject: 'Figma Comments (3 new)', preview: 'You have 3 unresolved comments on "Product Spec v2" — Dashboard Tiles...', time: 'Mon', unread: false, avatar: '#4338ca' },
];

function EmailTab() {
  const { messages, characters, setActiveCharacter, sendMessage, markRead } = useAppStore();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [activeFolder, setActiveFolder] = useState<'Inbox' | 'Sent' | 'Drafts' | 'Starred' | 'Archive'>('Inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTo, setForwardTo] = useState('');

  const charMap = React.useMemo(() => {
    const m: Record<string, typeof characters[0]> = {};
    characters.forEach(c => { m[c.id] = c; });
    return m;
  }, [characters]);

  const emailMsgs = React.useMemo(() =>
    messages.filter(m => m.channel === 'email'), [messages]);

  const threads = React.useMemo(() => {
    const map: Record<string, typeof messages> = {};
    emailMsgs.forEach(m => {
      const partner = m.from === 'user' ? String(m.to) : String(m.from);
      if (!map[partner]) map[partner] = [];
      map[partner].push(m);
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => +a.timestamp - +b.timestamp));
    return map;
  }, [emailMsgs]);

  const threadList = React.useMemo(() =>
    Object.entries(threads)
      .map(([id, msgs]) => ({
        id,
        latest: msgs[msgs.length - 1],
        unread: msgs.filter(m => m.from !== 'user' && !m.read).length,
      }))
      .sort((a, b) => +b.latest.timestamp - +a.latest.timestamp),
    [threads]
  );

  const filteredThreadList = React.useMemo(() => {
    let list = threadList;
    if (activeFolder === 'Inbox')   list = list.filter(t => !archivedIds.has(t.id) && t.latest.from !== 'user');
    else if (activeFolder === 'Sent')    list = threadList.filter(t => threads[t.id]?.some(m => m.from === 'user'));
    else if (activeFolder === 'Archive') list = threadList.filter(t => archivedIds.has(t.id));
    else if (activeFolder === 'Drafts' || activeFolder === 'Starred') list = [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => {
        const char = charMap[t.id];
        return (char?.name ?? '').toLowerCase().includes(q)
            || (t.latest.subject ?? '').toLowerCase().includes(q)
            || t.latest.body.toLowerCase().includes(q);
      });
    }
    return list;
  }, [threadList, activeFolder, archivedIds, searchQuery, threads, charMap]);

  const activeId = selectedPartnerId ?? filteredThreadList[0]?.id ?? null;
  const thread   = activeId ? (threads[activeId] ?? []) : [];
  const selectedChar = activeId ? charMap[activeId] : null;

  const handleSelect = (id: string) => {
    setSelectedPartnerId(id);
    setReplyOpen(false);
    threads[id]?.forEach(m => { if (m.from !== 'user' && !m.read) markRead(m.id); });
  };

  const handleSend = () => {
    if (!replyText.trim() || !selectedChar) return;
    setActiveCharacter(selectedChar);
    const subject = thread.find(m => m.subject)?.subject;
    sendMessage(replyText.trim(), 'email', subject ? `Re: ${subject}` : undefined);
    setReplyText('');
    setReplyOpen(false);
  };

  if (threadList.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 36, opacity: 0.35 }}>✉️</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#afa39f' }}>No messages yet</div>
        <div style={{ fontSize: 11.5, color: 'rgba(175,163,159,0.5)' }}>Start a session from the Dashboard to receive emails</div>
      </div>
    );
  }

  const totalUnread = threadList.reduce((s, t) => s + t.unread, 0);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Folder sidebar */}
      <div className="email-sidebar-panel" style={{
        width: 148, flexShrink: 0,
        background: '#212121',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        padding: '16px 0',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {(['Inbox', 'Sent', 'Drafts', 'Starred', 'Archive'] as const).map(folder => {
          const isActive = activeFolder === folder;
          const count = folder === 'Inbox' ? totalUnread : 0;
          return (
            <button key={folder} onClick={() => { setActiveFolder(folder); setSelectedPartnerId(null); setForwardOpen(false); }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 16px', fontSize: 12.5,
              color: isActive ? '#efefef' : '#afa39f',
              background: isActive ? 'rgba(20,123,88,0.08)' : 'transparent',
              borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
              cursor: 'pointer', textAlign: 'left',
              fontWeight: isActive ? 600 : 400,
              borderRight: isActive ? '2px solid #147b58' : '2px solid transparent',
            }}>
              <span>{folder}</span>
              {count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#147b58', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Thread list */}
      <div className={`email-list-panel${selectedPartnerId ? ' panel-hidden' : ''}`} style={{
        width: 270, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.04)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '6px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="rgba(175,163,159,0.5)" strokeWidth="1.1" />
              <path d="M7.5 7.5l2.5 2.5" stroke="rgba(175,163,159,0.5)" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search mail…"
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 11.5, color: '#afafaf', width: '100%', fontFamily: 'var(--font-sans)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(175,163,159,0.5)', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>
        {filteredThreadList.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '32px 16px' }}>
            <div style={{ fontSize: 28, opacity: 0.25 }}>
              {activeFolder === 'Drafts' ? '📝' : activeFolder === 'Starred' ? '⭐' : activeFolder === 'Archive' ? '📦' : '✉️'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#afa39f', textAlign: 'center' }}>
              {activeFolder === 'Drafts' ? 'No drafts saved' : activeFolder === 'Starred' ? 'No starred messages' : activeFolder === 'Archive' ? 'Archive is empty' : searchQuery ? 'No results' : 'No messages'}
            </div>
          </div>
        )}
        {filteredThreadList.map(({ id, latest, unread }) => {
          const char = charMap[id];
          const isSelected = id === activeId;
          const isUnread = unread > 0;
          return (
            <button key={id} onClick={() => handleSelect(id)} style={{
              display: 'block', textAlign: 'left', padding: '12px 14px',
              background: isSelected ? 'rgba(20,123,88,0.08)' : 'transparent',
              borderTop: 'none', borderRight: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer', width: '100%',
              borderLeft: isSelected ? '3px solid #147b58' : '3px solid transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: char?.color ?? '#6b7280' }}>
                  {char?.avatar
                    ? <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> // eslint-disable-line @next/next/no-img-element
                    : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 11, fontWeight: 700, color: '#efefef' }}>{id[0].toUpperCase()}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 12.5, fontWeight: isUnread ? 700 : 500,
                      color: isUnread ? '#efefef' : '#afa39f',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{char?.name ?? id}</span>
                    <span style={{ fontSize: 10.5, color: 'rgba(175,163,159,0.5)', flexShrink: 0, marginLeft: 6 }}>
                      {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: isUnread ? 600 : 400, color: isUnread ? '#efefef' : '#afa39f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                {isUnread && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#147b58', marginRight: 6, verticalAlign: 'middle' }} />}
                {latest.subject ?? '(no subject)'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {latest.body.replace(/\n/g, ' ').substring(0, 75)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reading pane */}
      <div className={`email-detail-panel${!selectedPartnerId ? ' panel-hidden' : ''}`} style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
        {/* Mobile back button */}
        <button
          onClick={() => setSelectedPartnerId(null)}
          className="mobile-back-btn"
          style={{
            display: 'none', /* shown via mobile.css */
            alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(175,163,159,0.7)', fontSize: 13, padding: '0 0 16px',
          }}
        >
          ← Back to inbox
        </button>
        {thread.length > 0 && selectedChar ? (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#efefef', marginBottom: 20 }}>
              {thread.find(m => m.subject)?.subject ?? '(no subject)'}
            </h2>

            {/* Thread messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {thread.map(msg => {
                const isMe = msg.from === 'user';
                const sender = isMe ? null : charMap[String(msg.from)];
                return (
                  <div key={msg.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: isMe ? '#147b58' : (sender?.color ?? '#6b7280') }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={isMe ? USER_AVATAR : (sender?.avatar ?? '')} alt={isMe ? 'You' : sender?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#efefef' }}>
                            {isMe ? 'You (Maya Chen)' : sender?.name}
                          </span>
                          {!isMe && <span style={{ fontSize: 11.5, color: 'rgba(175,163,159,0.5)', marginLeft: 8 }}>{sender?.title}</span>}
                        </div>
                        <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)', flexShrink: 0 }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: 13.5, color: isMe ? '#afa39f' : '#efefef', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                        {msg.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '24px 0 20px' }} />

            {/* Reply / Forward / action area */}
            {replyOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'rgba(175,163,159,0.5)', marginBottom: 2 }}>
                  Replying to {selectedChar.name} — {selectedChar.title}
                </div>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your reply…"
                  rows={5}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '12px 14px', fontSize: 13.5,
                    color: '#efefef', lineHeight: 1.65, resize: 'vertical',
                    outline: 'none', fontFamily: 'var(--font-sans)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(20,123,88,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setReplyOpen(false); setReplyText(''); }} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12.5,
                    background: '#212121', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#afa39f', cursor: 'pointer',
                  }}>Cancel</button>
                  <button onClick={handleSend} style={{
                    padding: '7px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                    background: 'rgba(20,123,88,0.18)', border: '1px solid rgba(20,123,88,0.35)',
                    color: '#34d399', cursor: 'pointer',
                  }}>Send Reply →</button>
                </div>
              </div>
            ) : forwardOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'rgba(175,163,159,0.5)', marginBottom: 2 }}>
                  Forwarding: {thread.find(m => m.subject)?.subject ?? '(no subject)'}
                </div>
                <input
                  value={forwardTo}
                  onChange={e => setForwardTo(e.target.value)}
                  placeholder="To: name@company.com"
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '8px 12px', fontSize: 12.5,
                    color: '#efefef', outline: 'none', fontFamily: 'var(--font-sans)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(20,123,88,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                />
                <div style={{ fontSize: 12, color: 'rgba(175,163,159,0.4)', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.6, maxHeight: 120, overflow: 'auto' }}>
                  <div style={{ marginBottom: 6, fontStyle: 'italic' }}>— Forwarded message —</div>
                  {thread.map(m => (
                    <div key={m.id} style={{ marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{m.from === 'user' ? 'You' : charMap[String(m.from)]?.name}: </span>
                      {m.body.replace(/\n/g, ' ').substring(0, 120)}{m.body.length > 120 ? '…' : ''}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => { setForwardOpen(false); setForwardTo(''); }} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12.5, background: '#212121', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => { setForwardOpen(false); setForwardTo(''); }} style={{ padding: '7px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: 'rgba(20,123,88,0.18)', border: '1px solid rgba(20,123,88,0.35)', color: '#34d399', cursor: 'pointer' }}>Forward →</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setReplyOpen(true)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, background: 'rgba(20,123,88,0.1)', border: '1px solid rgba(20,123,88,0.3)', color: '#34d399', cursor: 'pointer' }}>Reply</button>
                <button onClick={() => setForwardOpen(true)} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, background: '#212121', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f', cursor: 'pointer' }}>Forward</button>
                <button onClick={() => { if (activeId) { setArchivedIds(prev => new Set([...prev, activeId])); setSelectedPartnerId(null); } }} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, background: '#212121', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f', cursor: 'pointer' }}>Archive</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(175,163,159,0.5)', fontSize: 13 }}>
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CHAT TAB ───────────────────────────────────────────────────────────────── */
const CHANNELS = ['general', 'product', 'engineering', 'design', 'announcements'];
const CHAT_MESSAGES = [
  { id: 1, author: 'Sarah Chen', color: '#0891b2', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', time: '9:02 AM', text: 'Morning team 👋 Quick heads-up: the metrics dashboard is showing anomalies in the activation funnel. Will send a detailed writeup shortly.' },
  { id: 2, author: 'Marcus Lee', color: '#dc2626', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', time: '9:08 AM', text: 'Saw that too. Engineering is already investigating. Might be the new segment tag rollout.' },
  { id: 3, author: 'Priya Sharma', color: '#d97706', avatar: 'https://randomuser.me/api/portraits/women/56.jpg', time: '9:14 AM', text: 'Can we make sure UX is looped in before any rollback? Last time we lost 2 weeks of design work.' },
  { id: 4, author: 'You', color: '#147b58', avatar: USER_AVATAR, time: '9:22 AM', text: "Agreed. Let's do a quick 15-min sync at 10am — Sarah, Marcus, Priya. I'll send a calendar hold.", isMe: true },
  { id: 5, author: 'Sarah Chen', color: '#0891b2', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', time: '9:23 AM', text: '✅ Works for me' },
  { id: 6, author: 'Marcus Lee', color: '#dc2626', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', time: '9:24 AM', text: "10am works. I'll have the preliminary root-cause analysis ready." },
];

function ChatTab() {
  const { messages, characters, setActiveCharacter, sendMessage, markRead } = useAppStore();
  const [activeChannel, setActiveChannel] = useState('product');
  const [activeDMId, setActiveDMId] = useState<string | null>(null);
  const [dmInput, setDmInput] = useState('');

  const charMap = React.useMemo(() => {
    const m: Record<string, typeof characters[0]> = {};
    characters.forEach(c => { m[c.id] = c; });
    return m;
  }, [characters]);

  const dmMessages = React.useMemo(() =>
    activeDMId
      ? messages
          .filter(m => m.channel === 'chat' && (m.from === activeDMId || (m.from === 'user' && m.to === activeDMId)))
          .sort((a, b) => +a.timestamp - +b.timestamp)
      : [],
    [messages, activeDMId]
  );

  const dmUnread = (charId: string) =>
    messages.filter(m => m.channel === 'chat' && m.from === charId && m.to === 'user' && !m.read).length;

  const handleDMSelect = (charId: string) => {
    setActiveDMId(charId);
    const char = charMap[charId];
    if (char) setActiveCharacter(char);
    messages.filter(m => m.channel === 'chat' && m.from === charId && !m.read)
      .forEach(m => markRead(m.id));
  };

  const handleDMSend = () => {
    if (!dmInput.trim() || !activeDMId) return;
    sendMessage(dmInput.trim(), 'chat');
    setDmInput('');
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className={`chat-sidebar-panel${activeDMId ? ' panel-hidden' : ''}`} style={{
        width: 200, flexShrink: 0,
        background: '#212121',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 14px 8px', fontSize: 10, fontWeight: 700, color: '#afa39f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Channels
        </div>
        {CHANNELS.map(ch => (
          <button key={ch} onClick={() => { setActiveChannel(ch); setActiveDMId(null); }} style={{
            display: 'block', textAlign: 'left', padding: '6px 14px', fontSize: 13,
            color: !activeDMId && activeChannel === ch ? '#efefef' : '#afa39f',
            background: !activeDMId && activeChannel === ch ? 'rgba(52,211,153,0.1)' : 'transparent',
            border: 'none', cursor: 'pointer', fontWeight: !activeDMId && activeChannel === ch ? 600 : 400,
          }}>
            <span style={{ color: 'rgba(175,163,159,0.5)' }}>#</span> {ch}
          </button>
        ))}
        <div style={{ margin: '14px 14px 8px', height: 1, background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ padding: '0 14px 8px', fontSize: 10, fontWeight: 700, color: '#afa39f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Direct Messages
        </div>
        {characters.map(char => {
          const unread = dmUnread(char.id);
          const isActive = activeDMId === char.id;
          return (
            <button key={char.id} onClick={() => handleDMSelect(char.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
              padding: '6px 14px', fontSize: 12.5,
              color: isActive ? '#efefef' : '#afa39f',
              background: isActive ? 'rgba(52,211,153,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%',
                    border: '1.5px solid #0a0a0c',
                    background: char.online ? '#22c55e' : '#6b7280',
                  }} />
                </div>
                <span>{char.name.split(' ')[0]}</span>
              </div>
              {unread > 0 && (
                <span style={{
                  fontSize: 9, background: '#34d399', color: '#000',
                  width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
                }}>{unread}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main pane */}
      <div className={`chat-main-panel${activeDMId ? ' panel-visible' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {activeDMId ? (
        /* DM view */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setActiveDMId(null)} style={{
              background: '#212121', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#afa39f', cursor: 'pointer',
            }}>← Back</button>
            <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={charMap[activeDMId]?.avatar} alt={charMap[activeDMId]?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#efefef' }}>{charMap[activeDMId]?.name}</div>
              <div style={{ fontSize: 10.5, color: '#afa39f' }}>{charMap[activeDMId]?.title}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dmMessages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(175,163,159,0.5)', fontSize: 13, paddingTop: 60 }}>
                Send a message to start the conversation
              </div>
            ) : dmMessages.map(msg => {
              const isMe = msg.from === 'user';
              const char = charMap[activeDMId];
              return (
                <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={isMe ? USER_AVATAR : char?.avatar} alt={isMe ? 'You' : char?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#efefef' }}>
                        {isMe ? 'You' : char?.name}
                      </span>
                      <span style={{ fontSize: 10.5, color: 'rgba(175,163,159,0.5)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#afa39f', lineHeight: 1.6, margin: 0 }}>{msg.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '8px 14px',
            }}>
              <input
                value={dmInput}
                onChange={e => setDmInput(e.target.value)}
                placeholder={`Message ${charMap[activeDMId]?.name?.split(' ')[0]}…`}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#efefef' }}
                onKeyDown={e => { if (e.key === 'Enter' && dmInput.trim()) handleDMSend(); }}
              />
              <button onClick={handleDMSend} style={{
                background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)',
                borderRadius: 7, padding: '4px 10px', fontSize: 12, color: '#34d399', cursor: 'pointer',
              }}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        /* Channel view */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#efefef' }}># {activeChannel}</span>
            <span style={{ fontSize: 12, color: '#afa39f' }}>· Q3 product strategy & roadmap coordination</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CHAT_MESSAGES.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={msg.avatar} alt={msg.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#efefef' }}>{msg.author}</span>
                    <span style={{ fontSize: 10.5, color: 'rgba(175,163,159,0.5)' }}>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#afa39f', lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px' }}>
              <input placeholder={`Message #${activeChannel}`} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#efefef' }} />
              <button style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 7, padding: '4px 10px', fontSize: 12, color: '#34d399', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
      )}
      </div>{/* /chat-main-panel */}
    </div>
  );
}

/* ── PROJECT TAB ────────────────────────────────────────────────────────────── */
// KanbanCard and KanbanColumn types are defined in lib/types.ts

const PRIORITY_COLORS = { high: '#d44848', med: '#deaf49', low: '#6b7280' };
const PRIORITY_BG    = { high: '#d44848', med: '#deaf49', low: 'rgba(107,114,128,0.12)' };
const ASSIGNEE_COLORS: Record<string, string> = { Y: '#147b58', M: '#0891b2', S: '#6b7280', P: '#22d3ee', T: '#d97706', E: '#059669' };
const ASSIGNEE_LABELS: Record<string, string> = { Y: 'You', M: 'Marcus', S: 'Sarah', P: 'Priya', T: 'Tom', E: 'Elena' };
const TAG_COLORS: Record<string, string> = {
  Sales: '#deaf49', Eng: '#49a5de', Research: '#49a5de', Strategy: '#02ba67',
  Executive: '#02ba67', Product: '#02ba67', Process: '#6b7280', UX: '#02ba67', Docs: '#9ca3af',
};

/* ── PROJECT SUB-TAB ICONS ──────────────────────────────────────────────────── */
function BoardIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <rect x="4.5" y="1" width="3" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <rect x="8" y="1" width="3" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 9.5l3-3.5 2.5 2L9 4l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 11h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function OKRIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="6" cy="6" r="0.75" fill="currentColor" />
    </svg>
  );
}
function WriterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 9.5L8.5 3l1.5 1.5L3.5 11 1.5 11.5 2 9.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" fill="none" />
      <path d="M7.5 3.5l1 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
type ProjectSubTab = 'board' | 'analytics' | 'okrs' | 'writer';

const PROJECT_SUB_TABS: { id: ProjectSubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'board',     label: 'Board',     icon: <BoardIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { id: 'okrs',      label: 'OKRs',      icon: <OKRIcon /> },
  { id: 'writer',    label: 'Writer',    icon: <WriterIcon /> },
];

/* ── KANBAN BOARD ─────────────────────────────────────────────────────────── */
function KanbanBoard() {
  const { kanbanColumns: columns, moveKanbanCard, onUserMoveCard } = useAppStore();
  const dragInfo = React.useRef<{ cardId: string; fromColId: string } | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  // Card detail modal
  const [selectedCard, setSelectedCard] = useState<{ card: KanbanCard; colId: string } | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editPriority, setEditPriority] = useState<'high' | 'med' | 'low'>('med');
  const [editAssignee, setEditAssignee] = useState('Y');
  const [editNotes, setEditNotes] = useState('');

  // Add-card inline form
  const [addingToColId, setAddingToColId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');

  const openCard = (card: KanbanCard, colId: string) => {
    setSelectedCard({ card, colId });
    setEditTitle(card.title);
    setEditTag(card.tag);
    setEditPriority(card.priority);
    setEditAssignee(card.assignee);
    setEditNotes(card.notes);
  };

  const saveCard = () => {
    if (!selectedCard) return;
    useAppStore.setState(s => ({
      kanbanColumns: s.kanbanColumns.map(col => col.id !== selectedCard.colId ? col : {
        ...col,
        cards: col.cards.map(c => c.id !== selectedCard.card.id ? c : {
          ...c,
          title: editTitle.trim() || c.title,
          tag: editTag || c.tag,
          priority: editPriority,
          assignee: editAssignee,
          notes: editNotes,
        }),
      }),
    }));
    setSelectedCard(null);
  };

  const deleteCard = () => {
    if (!selectedCard) return;
    useAppStore.setState(s => ({
      kanbanColumns: s.kanbanColumns.map(col => col.id !== selectedCard.colId ? col : {
        ...col, cards: col.cards.filter(c => c.id !== selectedCard.card.id),
      }),
    }));
    setSelectedCard(null);
  };

  const moveCard = (cardId: string, fromColId: string, toColId: string) => {
    if (fromColId === toColId) return;
    const card = columns.find(c => c.id === fromColId)?.cards.find(c => c.id === cardId);
    if (!card) return;
    moveKanbanCard(cardId, toColId);
    onUserMoveCard(card, fromColId, toColId);
    if (selectedCard?.card.id === cardId) setSelectedCard(null);
  };

  const addCard = (colId: string) => {
    const title = newCardTitle.trim();
    if (!title) { setAddingToColId(null); return; }
    const newCard: KanbanCard = { id: `k-${Date.now()}`, title, tag: 'Product', assignee: 'Y', priority: 'med', notes: '' };
    useAppStore.setState(s => ({
      kanbanColumns: s.kanbanColumns.map(col => col.id !== colId ? col : { ...col, cards: [...col.cards, newCard] }),
    }));
    setNewCardTitle('');
    setAddingToColId(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, cardId: string, colId: string) => {
    dragInfo.current = { cardId, fromColId: colId };
    setDraggingCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => { setDraggingCardId(null); setDragOverColId(null); dragInfo.current = null; };
  const handleDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverColId(colId); };
  const handleDrop = (e: React.DragEvent, toColId: string) => {
    e.preventDefault();
    if (!dragInfo.current) return;
    moveCard(dragInfo.current.cardId, dragInfo.current.fromColId, toColId);
    setDragOverColId(null); setDraggingCardId(null); dragInfo.current = null;
  };

  const totalCards = columns.reduce((s, c) => s + c.cards.length, 0);
  const doneCount  = columns.find(c => c.id === 'done')?.cards.length ?? 0;
  const sprintPct  = totalCards > 0 ? Math.round((doneCount / totalCards) * 100) : 0;
  const pColor     = sprintPct >= 70 ? '#02ba67' : sprintPct >= 40 ? '#49a5de' : '#deaf49';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#efefef' }}>Roadmap Reckoning — Sprint 3</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: pColor, borderRadius: 20 }}>
          <div style={{ width: 52, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${sprintPct}%`, height: '100%', background: '#000000', borderRadius: 2, transition: 'width 400ms' }} />
          </div>
          <span style={{ fontSize: 11, color: '#000000', fontWeight: 700 }}>{sprintPct}%</span>
        </div>
        <span style={{ fontSize: 11, color: '#afa39f' }}>{doneCount} / {totalCards} done</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: 'rgba(175,163,159,0.5)', fontStyle: 'italic' }}>Drag to move · click to edit</span>
      </div>

      {/* Columns */}
      <div className="kanban-board" style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '14px 18px', display: 'flex', gap: 12 }}>
        {columns.map(col => {
          const isTarget = dragOverColId === col.id;
          return (
            <div
              key={col.id}
              className="kanban-column-mobile"
              onDragOver={e => handleDragOver(e, col.id)}
              onDragLeave={() => { if (dragOverColId === col.id) setDragOverColId(null); }}
              onDrop={e => handleDrop(e, col.id)}
              style={{
                width: 234, flexShrink: 0, display: 'flex', flexDirection: 'column',
                background: isTarget ? `${col.color}0b` : 'transparent',
                border: `1.5px ${isTarget ? 'dashed' : 'solid'} ${isTarget ? `${col.color}55` : 'transparent'}`,
                borderRadius: 10, padding: '6px 6px 8px', gap: 7,
                transition: 'background 100ms, border-color 100ms',
              }}
            >
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '2px 4px 6px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>
                  {col.label}
                </span>
                <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.04)', color: 'rgba(175,163,159,0.5)', padding: '1px 6px', borderRadius: 7, fontWeight: 700 }}>
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7, minHeight: 40 }}>
                {col.cards.map(card => {
                  const isDragging = draggingCardId === card.id;
                  const tagColor = TAG_COLORS[card.tag] ?? 'rgba(255,255,255,0.4)';
                  const isDone = col.id === 'done';
                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={e => handleDragStart(e, card.id, col.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => !isDragging && openCard(card, col.id)}
                      style={{
                        background: isDragging ? 'rgba(255,255,255,0.01)' : '#212121',
                        border: `1px solid ${isDragging ? 'rgba(255,255,255,0.04)' : card.blocked ? 'rgba(212,72,72,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 9, padding: '9px 11px',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        opacity: isDragging ? 0.35 : card.blocked ? 0.75 : 1,
                        transition: 'opacity 120ms, box-shadow 150ms',
                        userSelect: 'none',
                      }}
                      onMouseEnter={e => { if (!isDragging) (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 14px rgba(0,0,0,0.45)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                    >
                      {/* Blocked indicator */}
                      {card.blocked && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d44848' }} />
                          <span style={{ fontSize: 8.5, fontWeight: 700, color: '#d44848', letterSpacing: '0.06em' }}>BLOCKED</span>
                        </div>
                      )}
                      {/* OKR link indicator */}
                      {card.linkedOkr && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#147b58' }} />
                          <span style={{ fontSize: 8.5, fontWeight: 700, color: '#147b58', letterSpacing: '0.06em' }}>OKR LINKED</span>
                        </div>
                      )}
                      <p style={{
                        fontSize: 12.5, color: isDone ? 'rgba(175,163,159,0.5)' : '#efefef',
                        fontWeight: 500, lineHeight: 1.45, margin: '0 0 8px',
                        textDecoration: isDone ? 'line-through' : 'none',
                      }}>
                        {card.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 5, background: tagColor, color: '#000000', fontWeight: 600 }}>
                            {card.tag}
                          </span>
                          <span style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 5, fontWeight: 700, background: PRIORITY_BG[card.priority], color: '#000000' }}>
                            {card.priority.toUpperCase()}
                          </span>
                        </div>
                        <div
                          title={ASSIGNEE_LABELS[card.assignee]}
                          style={{ width: 22, height: 22, borderRadius: '50%', background: ASSIGNEE_COLORS[card.assignee] ?? '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, color: '#efefef', flexShrink: 0 }}
                        >
                          {card.assignee}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty drop hint */}
                {col.cards.length === 0 && (
                  <div style={{ border: '1px dashed rgba(255,255,255,0.04)', borderRadius: 8, padding: '18px 10px', textAlign: 'center', fontSize: 11, color: 'rgba(175,163,159,0.5)' }}>
                    Drop cards here
                  </div>
                )}
              </div>

              {/* Add card */}
              {addingToColId === col.id ? (
                <div>
                  <input
                    autoFocus
                    value={newCardTitle}
                    onChange={e => setNewCardTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addCard(col.id);
                      if (e.key === 'Escape') { setAddingToColId(null); setNewCardTitle(''); }
                    }}
                    placeholder="Card title… Enter to add"
                    style={{
                      width: '100%', padding: '7px 10px', borderRadius: 7, fontSize: 12,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      color: '#efefef', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                    <button onClick={() => addCard(col.id)} style={{ flex: 1, padding: '5px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${col.color}1a`, border: `1px solid ${col.color}44`, color: col.color, cursor: 'pointer' }}>Add</button>
                    <button onClick={() => { setAddingToColId(null); setNewCardTitle(''); }} style={{ padding: '5px 8px', borderRadius: 6, fontSize: 11, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingToColId(col.id)}
                  style={{ padding: '7px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: 7, color: 'rgba(175,163,159,0.5)', fontSize: 11.5, cursor: 'pointer', transition: 'border-color 150ms, color 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${col.color}55`; e.currentTarget.style.color = col.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(175,163,159,0.5)'; }}
                >
                  + Add card
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card detail / edit modal ── */}
      {selectedCard && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
          onClick={() => setSelectedCard(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 450, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto',
              background: '#212121',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
              boxShadow: '0 28px 64px rgba(0,0,0,0.85)',
            }}
          >
            <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${PRIORITY_COLORS[editPriority]}, transparent)` }} />
            <div style={{ padding: '20px 22px' }}>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Task</div>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '9px 12px', fontSize: 13.5, fontWeight: 600, color: '#efefef', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(20,123,88,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                />
              </div>

              {/* Priority */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Priority</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['high', 'med', 'low'] as const).map(p => (
                    <button key={p} onClick={() => setEditPriority(p)} style={{
                      flex: 1, padding: '6px 0', borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                      background: editPriority === p ? PRIORITY_BG[p] : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${editPriority === p ? PRIORITY_COLORS[p] : 'rgba(255,255,255,0.08)'}`,
                      color: editPriority === p ? PRIORITY_COLORS[p] : '#afa39f',
                    }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Assignee</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(ASSIGNEE_LABELS).map(([key, name]) => (
                    <button
                      key={key} onClick={() => setEditAssignee(key)} title={name}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, cursor: 'pointer',
                        background: editAssignee === key ? `${ASSIGNEE_COLORS[key]}22` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${editAssignee === key ? ASSIGNEE_COLORS[key] : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 150ms',
                      }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: ASSIGNEE_COLORS[key], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#efefef' }}>{key}</div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: editAssignee === key ? '#efefef' : '#afa39f' }}>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Tag</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {Object.keys(TAG_COLORS).map(t => (
                    <button key={t} onClick={() => setEditTag(t)} style={{
                      padding: '3px 9px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontWeight: 600,
                      background: editTag === t ? `${TAG_COLORS[t]}1a` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${editTag === t ? TAG_COLORS[t] : 'rgba(255,255,255,0.08)'}`,
                      color: editTag === t ? TAG_COLORS[t] : '#afa39f',
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Linked OKR */}
              {selectedCard.card.linkedOkr && (
                <div style={{ marginBottom: 14, background: 'rgba(20,123,88,0.06)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 8, padding: '9px 12px' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#147b58', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Linked OKR</div>
                  <p style={{ fontSize: 12, color: '#afa39f', lineHeight: 1.5, margin: 0 }}>
                    Moving this card to <strong style={{ color: '#22c55e' }}>Done</strong> will advance the associated session objective by 35 points.
                  </p>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Notes</div>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Add notes, links, or context…"
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '9px 12px', fontSize: 12.5, color: '#efefef', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(20,123,88,0.35)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                />
              </div>

              {/* Move to column */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#afa39f', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Move to</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {columns.filter(c => c.id !== selectedCard.colId).map(col => (
                    <button
                      key={col.id}
                      onClick={() => moveCard(selectedCard.card.id, selectedCard.colId, col.id)}
                      style={{ flex: 1, padding: '7px 4px', borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', background: `${col.color}14`, border: `1px solid ${col.color}35`, color: col.color }}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={deleteCard} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171' }}>
                  Delete
                </button>
                <div style={{ flex: 1 }} />
                <button onClick={() => setSelectedCard(null)} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: '#212121', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f' }}>
                  Cancel
                </button>
                <button onClick={saveCard} style={{ padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.35)', color: '#34d399' }}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── WRITER PANEL ────────────────────────────────────────────────────────── */
interface WriterDoc { id: string; title: string; body: string; savedAt: Date | null; tag: string; }
const WRITER_TEMPLATES: { label: string; title: string; body: string }[] = [
  { label: 'Options Brief', title: 'Q3 Roadmap — Options Brief for Board',
    body: `CONTEXT\nNexus closed a $20M Series C 10 days ago. Three teams have submitted conflicting Q3 roadmaps. A board meeting is Monday 9am. James Whitfield (Sequoia) will be in the room.\n\nOPTION A — SSO-First + Onboarding MVP\nScope: WorkOS SSO integration (2 weeks) + Priya's onboarding friction fix (2 weeks, run in parallel)\nCapacity: requires billing migration deferral Aug 14–16 to free Aisha + Dev\nRisk: deferring final billing migration phase to Q4\nOutcome: SSO live by mid-October. Trial conversion improvement in Q3. Both Acme and Meridian Group have a credible timeline.\n\nOPTION B — SSO Only\nScope: WorkOS SSO integration only\nCapacity: feasible within current team, no deferral needed\nRisk: onboarding friction continues; NPS likely declines further in Q4\nOutcome: Investor covenant met. Acme deal protected. Conversion rate problem unaddressed.\n\nRECOMMENDATION\n[Your recommendation here — with rationale]\n\nSTAKEHOLDER SIGN-OFF REQUIRED\n□ Marcus Webb (Engineering) □ Sarah Chen (VP Product) □ Tom Rivera (Sales)\n`,
  },
  { label: 'Stakeholder Memo', title: 'Q3 Scope Decision — Stakeholder Communication',
    body: `TO: Sarah Chen, Marcus Webb, Tom Rivera, Priya Sharma\nFROM: [Your name]\nRE: Q3 Roadmap Decision\nDATE: [Date]\n\nSUMMARY\nThis memo documents the Q3 scope decision following stakeholder alignment this week.\n\nDECISION\n[State the decision clearly — what ships, what is deferred, and why]\n\nCOMMITMENTS\n• Engineering (Marcus): [specific commitment with timeline]\n• Sales (Tom): [specific Acme/Meridian communication plan]\n• Design (Priya): [onboarding work commitment or deferral with date]\n\nNEXT STEPS\n1. [Action item] — Owner — Due date\n2. [Action item] — Owner — Due date\n3. [Action item] — Owner — Due date\n\nOPEN QUESTIONS\n• [Any remaining open questions that need resolution before board]\n`,
  },
  { label: 'PRD Skeleton', title: 'Product Requirements — [Feature Name]',
    body: `OVERVIEW\nFeature: [Name]\nPM Owner: [Your name]\nEng Lead: Marcus Webb\nDesign Lead: Priya Sharma\nTarget release: [Date]\n\nPROBLEM STATEMENT\n[What problem does this solve? For whom? With what evidence?]\n\nSUCCESS METRICS\n| Metric | Baseline | Target | Timeframe |\n|--------|----------|--------|-----------|\n| [Primary] | | | |\n| [Secondary] | | | |\n\nUSER STORIES\n• As a [user type], I want to [goal] so that [outcome]\n• As a [user type], I want to [goal] so that [outcome]\n\nACCEPTANCE CRITERIA\n□ [Criterion 1]\n□ [Criterion 2]\n□ [Criterion 3]\n\nOUT OF SCOPE\n• [What this explicitly does NOT include]\n\nDEPENDENCIES & RISKS\n• [Dependency or risk]\n`,
  },
  { label: 'Blank', title: '', body: '' },
];

function WriterPanel() {
  const { sendMessage, setActiveCharacter, characters } = useAppStore();
  const [docs, setDocs] = useState<WriterDoc[]>([{
    id: 'doc-1', title: '', body: '', savedAt: null, tag: 'Untitled',
  }]);
  const [activeDocId, setActiveDocId] = useState('doc-1');
  const [saved, setSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitChar, setSubmitChar] = useState<typeof characters[0] | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Default to Elena on first load
  const elenaDefault = React.useMemo(() => characters.find(c => c.id === 'elena') ?? characters[0] ?? null, [characters]);
  React.useEffect(() => { if (!submitChar && elenaDefault) setSubmitChar(elenaDefault); }, [elenaDefault]);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!submitOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSubmitOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [submitOpen]);

  const activeDoc = docs.find(d => d.id === activeDocId) ?? docs[0];
  const updateDoc = (patch: Partial<WriterDoc>) => {
    setSaved(false);
    setDocs(prev => prev.map(d => d.id === activeDocId ? { ...d, ...patch } : d));
  };
  const saveDoc = () => {
    setDocs(prev => prev.map(d => d.id === activeDocId ? { ...d, savedAt: new Date() } : d));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const newDoc = (template?: typeof WRITER_TEMPLATES[0]) => {
    const id = `doc-${Date.now()}`;
    setDocs(prev => [...prev, { id, title: template?.title ?? '', body: template?.body ?? '', savedAt: null, tag: template?.label ?? 'Untitled' }]);
    setActiveDocId(id);
    setShowTemplates(false);
  };
  const deleteDoc = (id: string) => {
    if (docs.length <= 1) return;
    const newDocs = docs.filter(d => d.id !== id);
    setDocs(newDocs);
    if (activeDocId === id) setActiveDocId(newDocs[0].id);
  };

  const wrapSelection = (before: string, after: string = before) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = activeDoc.body.substring(start, end);
    const newBody = activeDoc.body.substring(0, start) + before + selected + after + activeDoc.body.substring(end);
    updateDoc({ body: newBody });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };
  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const newBody = activeDoc.body.substring(0, start) + text + activeDoc.body.substring(start);
    updateDoc({ body: newBody });
    setTimeout(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length); }, 0);
  };

  const submitToRecipient = () => {
    if (!submitChar) return;
    const subject = activeDoc.title.trim() || 'Document from Writer';
    const body = activeDoc.body.trim() || '(empty document)';
    setActiveCharacter(submitChar);
    sendMessage(`${subject}\n\n${body}`, 'email', subject);
    saveDoc();
    setSubmitted(true);
    setSubmitOpen(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const wordCount = activeDoc.body.trim() ? activeDoc.body.trim().split(/\s+/).length : 0;
  const charCount = activeDoc.body.length;

  const FORMAT_BUTTONS = [
    { label: 'B', title: 'Bold', btnStyle: { fontWeight: 700 as const }, action: () => wrapSelection('**') },
    { label: 'I', title: 'Italic', btnStyle: { fontStyle: 'italic' as const }, action: () => wrapSelection('_') },
    { label: 'U', title: 'Underline', btnStyle: { textDecoration: 'underline' as const }, action: () => wrapSelection('<u>', '</u>') },
    { label: 'H1', title: 'Heading', btnStyle: { fontSize: 10 as const }, action: () => insertAtCursor('\n# ') },
    { label: '—', title: 'Divider', btnStyle: {}, action: () => insertAtCursor('\n---\n') },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Document sidebar */}
      <div style={{
        width: 180, flexShrink: 0, background: '#212121',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
          <button
            onClick={() => setShowTemplates(v => !v)}
            style={{
              width: '100%', padding: '7px 0', borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(20,123,88,0.10)', border: '1px solid rgba(20,123,88,0.28)', color: '#34d399',
            }}
          >
            + New Document
          </button>
          {showTemplates && (
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {WRITER_TEMPLATES.map(t => (
                <button key={t.label} onClick={() => newDoc(t)} style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', textAlign: 'left',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {docs.map(doc => {
            const isActive = doc.id === activeDocId;
            const label = doc.title.trim() || doc.tag || 'Untitled';
            return (
              <div key={doc.id} style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
                <button onClick={() => setActiveDocId(doc.id)} style={{
                  flex: 1, textAlign: 'left', padding: '8px 12px', cursor: 'pointer',
                  borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                  background: isActive ? 'rgba(20,123,88,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #147b58' : '2px solid transparent',
                }}>
                  <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#efefef' : '#afa39f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16 }}>
                    {label.length > 18 ? label.substring(0, 16) + '…' : label}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.5)', marginTop: 2 }}>
                    {doc.savedAt ? `Saved ${doc.savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Unsaved'}
                  </div>
                </button>
                {docs.length > 1 && (
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    title="Delete document"
                    style={{
                      position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                      width: 16, height: 16, borderRadius: 4, background: 'transparent', border: 'none',
                      color: 'rgba(175,163,159,0.3)', cursor: 'pointer', fontSize: 12, lineHeight: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(175,163,159,0.3)'; }}
                  >×</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <input
            value={activeDoc.title}
            onChange={e => updateDoc({ title: e.target.value })}
            placeholder="Document title…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#efefef', fontFamily: 'var(--font-sans)' }}
          />
          <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: '2px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {FORMAT_BUTTONS.map(({ label, title, btnStyle, action }) => (
              <button
                key={label}
                title={title}
                onClick={action}
                style={{
                  width: 26, height: 24, borderRadius: 5, background: 'transparent', border: 'none',
                  color: '#afa39f', cursor: 'pointer', fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', ...btnStyle,
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={activeDoc.body}
          onChange={e => updateDoc({ body: e.target.value })}
          placeholder={`Start writing your memo, PRD, or strategic brief…\n\nTip: Use the template picker (+ New Document) to start from an Options Brief, Stakeholder Memo, or PRD skeleton.`}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none',
            padding: '24px 32px', fontSize: 13.5, color: '#efefef',
            lineHeight: 1.8, fontFamily: 'var(--font-sans)',
          }}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveDoc(); } }}
        />

        {/* Footer */}
        <div style={{
          padding: '9px 20px', borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)' }}>{wordCount} words · {charCount} chars</span>
          {saved && <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>✓ Saved</span>}
          {submitted && <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>✓ Sent to {submitChar?.name.split(' ')[0]}</span>}
          <div style={{ flex: 1 }} />
          <button onClick={saveDoc} style={{
            padding: '5px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer',
            background: '#212121', border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f',
          }}>
            Save Draft <span style={{ fontSize: 10, opacity: 0.6 }}>⌘S</span>
          </button>

          {/* Split submit button with recipient dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Dropdown panel */}
            {submitOpen && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
                width: 224, background: '#1e1e22', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10, overflow: 'hidden', zIndex: 50,
                boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
              }}>
                <div style={{ padding: '8px 12px 6px', fontSize: 10, fontWeight: 700,
                  color: 'rgba(175,163,159,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Send to…</div>
                {characters.map(char => {
                  const isSelected = submitChar?.id === char.id;
                  return (
                    <button key={char.id}
                      onClick={() => { setSubmitChar(char); setSubmitOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '9px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: isSelected ? 'rgba(20,123,88,0.10)' : 'transparent',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: `1px solid ${char.color}55` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? '#efefef' : '#afa39f' }}>{char.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.4)' }}>{char.title}</div>
                      </div>
                      {isSelected && <span style={{ fontSize: 11, color: '#34d399', flexShrink: 0 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Split button row */}
            <div style={{ display: 'flex', gap: 0 }}>
              <button
                onClick={() => setSubmitOpen(v => !v)}
                disabled={submitted}
                style={{
                  padding: '5px 11px', borderRadius: '7px 0 0 7px', fontSize: 12, fontWeight: 600,
                  cursor: submitted ? 'default' : 'pointer',
                  background: submitted ? 'rgba(34,197,94,0.12)' : 'rgba(20,123,88,0.12)',
                  borderTop: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderBottom: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderLeft: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderRight: 'none',
                  color: submitted ? '#22c55e' : '#34d399',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {submitted ? '✓ Sent' : `Submit to ${submitChar?.name.split(' ')[0] ?? '…'}`}
                {!submitted && <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>}
              </button>
              <button
                onClick={submitToRecipient}
                disabled={submitted || !submitChar}
                style={{
                  padding: '5px 10px', borderRadius: '0 7px 7px 0', fontSize: 13, fontWeight: 700,
                  cursor: submitted || !submitChar ? 'default' : 'pointer',
                  background: submitted ? 'rgba(34,197,94,0.12)' : 'rgba(20,123,88,0.18)',
                  borderTop: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderBottom: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderRight: submitted ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(20,123,88,0.3)',
                  borderLeft: '1px solid rgba(20,123,88,0.2)',
                  color: submitted ? '#22c55e' : '#34d399',
                }}
              >→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── OKR WRAPPER (handles no-session state) ──────────────────────────────── */
function OKRWrapper() {
  const { session } = useAppStore();
  if (!session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
        <div style={{ fontSize: 32 }}>🎯</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#afafaf' }}>No active session</div>
        <div style={{ fontSize: 11.5, color: '#afa39f' }}>Start a training session to track your OKRs</div>
      </div>
    );
  }
  return <OKRPanel />;
}

/* ── PROJECT TAB (main container with sub-tabs) ─────────────────────────── */
function ProjectTab() {
  const [subTab, setSubTab] = useState<ProjectSubTab>('board');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Sub-tab bar */}
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: 0,
        background: 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '0 16px', flexShrink: 0,
      }}>
        {PROJECT_SUB_TABS.map(t => {
          const isActive = subTab === t.id;
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 14px', cursor: 'pointer', background: 'transparent',
              borderLeft: 'none', borderRight: 'none',
              borderBottom: isActive ? '2px solid #147b58' : '2px solid transparent',
              borderTop: '2px solid transparent',
              color: isActive ? '#efefef' : '#afa39f',
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'var(--font-sans)',
              transition: 'color 150ms',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#efefef'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#afa39f'; }}
            >
              <span style={{ color: isActive ? '#147b58' : 'inherit', display: 'flex' }}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {subTab === 'board'     && <KanbanBoard />}
        {subTab === 'analytics' && <AnalyticsPanel />}
        {subTab === 'okrs'      && <OKRWrapper />}
        {subTab === 'writer'    && <WriterPanel />}
      </div>
    </div>
  );
}

/* ── CALENDAR TAB ───────────────────────────────────────────────────────────── */
const CAL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CAL_EVENTS: Record<number, { time: string; title: string; color: string }[]> = {
  10: [{ time: '9:00', title: 'Board prep call', color: '#7c3aed' }],
  11: [{ time: '10:00', title: 'Engineering sync', color: '#dc2626' }, { time: '14:00', title: '1:1 with Elena', color: '#7c3aed' }],
  12: [{ time: '9:30', title: 'Product review', color: '#0891b2' }, { time: '11:00', title: 'Weekly standup', color: '#059669' }],
  13: [{ time: '13:00', title: 'Stakeholder alignment', color: '#d97706' }],
  14: [{ time: '10:00', title: 'Roadmap finalisation', color: '#147b58' }, { time: '15:00', title: 'Design critique', color: '#d97706' }],
  17: [{ time: '9:00', title: 'Sprint planning', color: '#0891b2' }],
  18: [{ time: '14:30', title: 'Exec briefing', color: '#7c3aed' }],
};

function CalendarTab() {
  const weeks = [
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ];
  const today = 14;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#efefef' }}>March 2026</h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {['‹', '›'].map(arrow => (
              <button key={arrow} style={{
                width: 26, height: 26, borderRadius: 7, background: '#212121',
                border: '1px solid rgba(255,255,255,0.08)', color: '#afa39f',
                cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{arrow}</button>
            ))}
          </div>
        </div>
        <button style={{
          padding: '6px 14px', background: '#212121',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
          fontSize: 12, color: '#afa39f', cursor: 'pointer', fontWeight: 600,
        }}>
          + New Event
        </button>
      </div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {CAL_DAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: '#afa39f', letterSpacing: '0.06em', textTransform: 'uppercase',
            paddingBottom: 6,
          }}>{d}</div>
        ))}
      </div>
      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {week.map(day => (
            <div key={day} style={{
              minHeight: 72, padding: '8px', ...cardStyle,
              background: day === today ? 'rgba(20,123,88,0.08)' : '#212121',
              border: `1px solid ${day === today ? 'rgba(20,123,88,0.3)' : 'rgba(255,255,255,0.04)'}`,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{
                fontSize: 12, fontWeight: day === today ? 700 : 400,
                color: day === today ? '#147b58' : '#afa39f',
              }}>{day}</span>
              {(CAL_EVENTS[day] ?? []).map((ev, i) => (
                <div key={i} style={{
                  fontSize: 9.5, padding: '2px 5px', borderRadius: 4,
                  background: `${ev.color}22`, color: ev.color,
                  border: `1px solid ${ev.color}44`, fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {ev.time} {ev.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── MEETINGS TAB ───────────────────────────────────────────────────────────── */
function MicIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.5" />
      <path d="M5 10a7 7 0 0014 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17v4M9 21h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function CamIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="14" height="12" rx="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M16 9.5l6-3v11l-6-3v-5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function ShareIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M3 17l5-4 4 3 4-5 5 6" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function HangUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 14.5c1.5-1.5 3.5-2.5 5.5-2.5s4 1 5.5 2.5l-2 2c-.5.5-1.3.5-1.8 0l-.7-.7c-.5-.5-1.2-.5-1.7 0l-.7.7c-.5.5-1.3.5-1.8 0l-2-2z"
        fill="white" />
    </svg>
  );
}

function PersonSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 110" style={{ width: '62%', height: 'auto', display: 'block' }} fill="none">
      {/* Head */}
      <circle cx="50" cy="36" r="24" fill={color} />
      {/* Shoulders / torso */}
      <ellipse cx="50" cy="108" rx="46" ry="38" fill={color} />
    </svg>
  );
}

function MeetingsTab() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  const PARTICIPANTS = [
    {
      name: 'Marshall Combs',
      bg: '#1a1109', lighter: '#2e200e', darker: '#0d0804',
      silhouette: '#5a3a16',
      speaking: true, isYou: false,
    },
    {
      name: 'Tristan Wright',
      bg: '#1c1c1e', lighter: '#2a2a2d', darker: '#101012',
      silhouette: '#b08060',
      speaking: false, isYou: false,
    },
    {
      name: 'Your Name',
      bg: '#191c1f', lighter: '#252a2e', darker: '#0d1013',
      silhouette: null,
      speaking: false, isYou: true,
    },
  ];

  const CONTROLS = [
    { icon: <MicIcon color={micOn ? '#fff' : '#ef4444'} />, label: micOn ? 'Mute' : 'Unmute', bg: micOn ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.2)', border: micOn ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.4)', action: () => setMicOn(v => !v) },
    { icon: <CamIcon color={camOn ? '#fff' : '#ef4444'} />, label: camOn ? 'Camera off' : 'Camera on', bg: camOn ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.2)', border: camOn ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.4)', action: () => setCamOn(v => !v) },
    { icon: <ShareIcon />, label: 'Share', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.15)', action: () => {} },
    { icon: null, label: transcriptOpen ? 'Hide CC' : 'Show CC', bg: transcriptOpen ? 'rgba(20,123,88,0.15)' : 'rgba(255,255,255,0.1)', border: transcriptOpen ? 'rgba(20,123,88,0.3)' : 'rgba(255,255,255,0.15)', action: () => setTranscriptOpen(v => !v) },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f0f11' }}>
      {/* Call header */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 8px #22c55e',
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#efefef' }}>Weekly Standup · In progress</span>
        <span style={{ fontSize: 11.5, color: '#afa39f', marginLeft: 'auto' }}>32:14</span>
      </div>

      {/* Video tiles + floating controls */}
      <div style={{
        flex: 1, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: '20px 24px',
        overflow: 'hidden',
      }}>
        {PARTICIPANTS.map(p => (
          <div key={p.name} style={{
            aspectRatio: '3 / 5',
            height: '80%',
            maxHeight: '80%',
            borderRadius: 18,
            background: `linear-gradient(170deg, ${p.lighter} 0%, ${p.bg} 50%, ${p.darker} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            border: p.speaking ? '2px solid rgba(175,163,159,0.5)' : '2px solid rgba(255,255,255,0.05)',
            boxShadow: p.speaking ? '0 0 32px rgba(175,163,159,0.15), 0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.5)',
            transition: 'border-color 300ms, box-shadow 300ms',
          }}>
            {/* Bottom gradient overlay for name legibility */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            {/* Silhouette or "You" placeholder */}
            {p.silhouette ? (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingBottom: '18%',
              }}>
                <PersonSilhouette color={p.silhouette} />
              </div>
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', fontWeight: 500, letterSpacing: '0.02em' }}>You</span>
              </div>
            )}

            {/* Name label */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 1 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{p.name}</span>
            </div>

            {/* Muted badge */}
            {p.isYou && !micOn && (
              <div style={{
                position: 'absolute', top: 10, right: 10, zIndex: 1,
                background: 'rgba(239,68,68,0.85)', borderRadius: 6, padding: '3px 7px',
                fontSize: 10, color: '#fff', fontWeight: 600,
              }}>
                Muted
              </div>
            )}
          </div>
        ))}

        {/* Floating controls — z-index: 10, frosted pill */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(12,12,14,0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 18, padding: '8px 14px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 28px rgba(0,0,0,0.6)',
        }}>
          {CONTROLS.map(ctrl => (
            <button key={ctrl.label} onClick={ctrl.action} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '7px 12px', borderRadius: 12,
              background: ctrl.bg, border: `1px solid ${ctrl.border}`,
              cursor: 'pointer', color: '#efefef', minWidth: 50,
            }}>
              {ctrl.icon}
              <span style={{ fontSize: 9.5, color: '#afa39f', fontWeight: 500, whiteSpace: 'nowrap' }}>{ctrl.label}</span>
            </button>
          ))}
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          <button style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '7px 16px', borderRadius: 12,
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            cursor: 'pointer', color: '#efefef',
          }}>
            <HangUpIcon />
            <span style={{ fontSize: 9.5, color: '#f87171', fontWeight: 600 }}>End</span>
          </button>
        </div>
      </div>

      {/* Transcript — below tiles */}
      {transcriptOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 22px 14px',
          maxHeight: 110, overflowY: 'auto',
          background: 'rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(175,163,159,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Live Transcript</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { speaker: 'Marshall', text: 'I think the key blocker is the engineering capacity issue.' },
              { speaker: 'Tristan', text: 'Agreed. We need a decision on scope before end of day.' },
              { speaker: 'You', text: 'Let me pull up the roadmap overview — give me one moment.' },
            ].map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5 }}>
                <span style={{ color: '#afa39f', fontWeight: 600, flexShrink: 0 }}>{line.speaker}:</span>
                <span style={{ color: 'rgba(175,163,159,0.5)' }}>{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── NEBULA AI TAB ──────────────────────────────────────────────────────────── */
const AI_MESSAGES = [
  { role: 'ai', text: "Hi Maya! I'm Nebula AI — your simulation assistant. I can help you draft stakeholder messages, think through decisions, analyse trade-offs, or summarise your current session state. What would you like to work on?" },
  { role: 'user', text: "I need help drafting a response to Elena's email about the Q3 roadmap alignment." },
  { role: 'ai', text: "I'll help you craft a clear, confident reply. Based on your session context, here's a draft:\n\n\"Hi Elena — understood. I'm convening a focused alignment session with Marcus and Sarah by EOD today. I'll present you with three clearly defined trade-off options by Thursday noon, with my recommendation and rationale attached. You'll have everything you need for the board.\"\n\nThis signals control, gives a concrete deadline, and sets expectations cleanly. Want me to adjust the tone or add specifics?" },
];

function NebulaAITab() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(AI_MESSAGES);

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* History sidebar */}
      <div style={{
        width: 200, flexShrink: 0,
        background: '#212121',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ padding: '0 14px 10px', fontSize: 10, fontWeight: 700, color: '#afa39f', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Conversations
        </div>
        {[
          { label: 'Stakeholder email draft', active: true },
          { label: 'Roadmap trade-offs', active: false },
          { label: 'Engineering capacity', active: false },
          { label: 'Sprint planning help', active: false },
        ].map(item => (
          <button key={item.label} style={{
            display: 'block', textAlign: 'left', padding: '8px 14px', fontSize: 12,
            color: item.active ? '#efefef' : '#afa39f',
            background: item.active ? 'rgba(20,123,88,0.08)' : 'transparent',
            borderTop: 'none', borderRight: 'none', borderBottom: 'none',
            cursor: 'pointer', fontWeight: item.active ? 600 : 400,
            borderLeft: item.active ? '2px solid #147b58' : '2px solid transparent',
            lineHeight: 1.4,
          }}>
            {item.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button style={{
            width: '100%', padding: '7px', background: 'rgba(20,123,88,0.08)',
            border: '1px solid rgba(20,123,88,0.2)', borderRadius: 8,
            fontSize: 12, color: '#34d399', cursor: 'pointer', fontWeight: 600,
          }}>
            + New Chat
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#147b58',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <NebulaTabIcon />
          </div>
          <div style={{ flex: 1 }}>
            <SectionHeader title="Nebula AI" />
          </div>
          <div style={{ fontSize: 10.5, color: '#afa39f' }}>Context-aware assistant</div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? 'rgba(20,123,88,0.12)'
                  : '#212121',
                border: msg.role === 'user'
                  ? '1px solid rgba(20,123,88,0.25)'
                  : '1px solid rgba(255,255,255,0.04)',
                fontSize: 13, color: '#efefef', lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 12,
              background: '#147b58',
              padding: 1,
            }}>
              <div style={{ height: '100%', borderRadius: 11, background: '#111113' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Nebula AI anything…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 13, color: '#efefef',
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && input.trim()) {
                    setMessages(m => [...m, { role: 'user', text: input.trim() }]);
                    setInput('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (input.trim()) {
                    setMessages(m => [...m, { role: 'user', text: input.trim() }]);
                    setInput('');
                  }
                }}
                style={{
                  background: '#147b58',
                  border: 'none', borderRadius: 8, width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MISSION CONTROL TAB ────────────────────────────────────────────────────── */
const EMOTION_COLORS: Record<string, string> = {
  neutral: 'rgba(255,255,255,0.35)',
  cooperative: '#22c55e',
  frustrated: '#ef4444',
  disengaged: '#6b7280',
  alarmed: '#f59e0b',
};

const TRUST_COLOR = (t: number) => t >= 0.7 ? '#22c55e' : t >= 0.5 ? '#f59e0b' : '#ef4444';

/* ── DELIVERABLE SYSTEM ───────────────────────────────────────────────────── */
interface DeliverableSection { id: string; heading: string; prompt: string; placeholder: string; example: string; }
interface DeliverableDef     { id: string; title: string; objective: string; sections: DeliverableSection[]; }
type DeliverableStatus = 'not_started' | 'in_progress' | 'needs_revision' | 'approved';
interface DeliverableState   { sections: Record<string, string>; status: DeliverableStatus; mode: 'guided' | 'advanced'; usedExample: boolean; feedback: string | null; score: number | null; attemptCount: number; }

const DELIVERABLE_DEFS: DeliverableDef[] = [
  {
    id: 'strategy_brief', title: 'Product Strategy Brief',
    objective: 'Define the product strategy that addresses the mission problem — with a recommendation the CEO can take to the board.',
    sections: [
      { id: 'problem', heading: 'Problem Statement',
        prompt: 'Describe the core business problem at Nexus Technologies. Who is affected — users, customers, or the business itself? What specific friction exists, and why does solving it matter in Q3 specifically? Cite concrete signals (data, stakeholder statements, metrics).',
        placeholder: 'Describe the core problem, who it affects, what the evidence says, and why it matters now…',
        example: 'New drivers in Tier-2 cities take 8.3 days on average to complete vehicle verification and their first trip — 2× longer than Tier-1 cities. The delay is caused by a manual document review queue that averages 6 business days with no real-time status. 34% of new drivers abandon during this phase, directly reducing supply in our fastest-growing markets and increasing blended CAC by $47 per completed activation.',
      },
      { id: 'segment', heading: 'Target User or Customer Segment',
        prompt: 'Define the primary user or customer segment most affected. Be specific about role, company context, behavior, and commercial relevance to Nexus. Avoid vague segment labels — describe people, not archetypes.',
        placeholder: 'Define who is most affected, in what context, and why this segment matters commercially…',
        example: 'Independent contractor drivers in Tier-2 US cities (population 100–500K), typically aged 28–45, working part-time. Strong motivation to start earning within one week — 62% cite this as their go/no-go threshold. Access the platform exclusively via mobile. Moderate digital literacy; cannot navigate multi-step async processes without status updates.',
      },
      { id: 'hypothesis', heading: 'Product Hypothesis',
        prompt: 'Write your hypothesis using this exact structure: "If we [specific product change or decision], then [specific user or business outcome] will change, resulting in [metric] improving from [baseline] to [target] within [timeframe]."',
        placeholder: 'If we [action], then [outcome] will change, resulting in [metric] improving from [baseline] to [target] within [timeframe]…',
        example: 'If we automate document verification using computer vision (replacing the manual review queue), then driver time-to-first-trip will decrease from 8.3 days to under 3 days, resulting in onboarding completion rate improving from 66% to 88%+ within Q3.',
      },
      { id: 'metrics', heading: 'Success Metrics',
        prompt: 'Define 2–3 measurable metrics with explicit baselines and targets. For each, specify: what it measures, current value, target value, and how it will be measured. At least one must be a leading indicator.',
        placeholder: 'Metric  |  Baseline  |  Target  |  Measured how?\n…',
        example: 'Trial-to-paid conversion (30-day cohort)  |  23%  |  28%+  |  Mixpanel cohort analysis, weekly\nNPS "ease of getting started" driver  |  28  |  38+  |  Q3 end cohort survey\nEngineering sign-off rate  |  0% committed  |  100% written sign-off  |  Scope document with PM + Eng signatures',
      },
      { id: 'solution', heading: 'Proposed Solution',
        prompt: 'Describe the specific product or roadmap decision that resolves the problem. What will change? What will ship? What is explicitly excluded? Make the trade-offs visible — do not hide what you are choosing not to do.',
        placeholder: 'Describe the proposed solution, what it includes, what it excludes, and what trade-offs you are making explicitly…',
        example: 'Phase 1 (Q3): CV-powered auto-verification for license and insurance. Deprecate manual review queue. WorkOS SSO integration (2-week build vs. 6-week in-house). Phase 2 (Q4): background check API, team invitation flow redesign. Explicitly excluded from Q3: full UX redesign, international market expansion.',
      },
      { id: 'risks', heading: 'Risks & Dependencies',
        prompt: 'List the key risks (capacity, commitments, investor expectations, org dynamics) and dependencies. For your top two risks, describe the specific mitigation approach and who owns it.',
        placeholder: 'List risks and dependencies. For your top 2 risks: mitigation + owner…',
        example: 'Risk: Eng capacity at 94% → Mitigation: billing migration deferral Aug 14–16 frees 4 eng-weeks (Marcus owns).\nRisk: Acme SSO commitment language → Mitigation: request actual email chain from Tom to verify it is best-efforts, not binding.\nDependency: VP Product sign-off required before any document goes to Elena.',
      },
    ],
  },
  {
    id: 'problem_def', title: 'Problem Definition',
    objective: 'Articulate the core problem with precision — including who experiences it, what evidence confirms it, and why Q3 is the right moment to act.',
    sections: [
      { id: 'core_problem', heading: 'Core Problem Statement',
        prompt: 'What is the primary problem? Be precise about who experiences it and in what context. A good problem statement is specific enough that two different people would agree on what "solved" looks like. Avoid solutions in the problem statement.',
        placeholder: 'State the problem precisely — who, what, and in what context…',
        example: 'First-time RideSwift drivers in Tier-2 cities experience an 8.3-day delay between app installation and first completed trip, caused by a manual document review process with no real-time status updates and a 6-business-day average review time.',
      },
      { id: 'evidence', heading: 'Evidence & Data',
        prompt: 'What data, research, or stakeholder signals confirm this is the right problem? Be specific — cite numbers, sources, and dates. Distinguish between quantitative data (metrics, surveys) and qualitative signal (interviews, stakeholder feedback).',
        placeholder: 'Cite specific data, research findings, or stakeholder signals that confirm this problem…',
        example: '— 34% new-driver abandonment rate during verification phase (internal funnel data, Q2 2024)\n— Exit survey: "verification process too slow" cited by 41% of churned new drivers (n=312)\n— NPS "ease of getting started" driver declined 14 points Q1→Q2 (Priya\'s research, filed June 2024 — not yet actioned)',
      },
      { id: 'why_now', heading: 'Why Now?',
        prompt: 'Why is Q3 the right moment to address this problem? What changes if it is deferred another quarter? Include competitive, financial, investor-level urgency where it exists.',
        placeholder: 'Explain the urgency — what is the specific cost of waiting one more quarter?',
        example: 'Acuity is demoing SSO to Acme Corp in ~6 weeks. A Series C milestone ties $3M in investor commitments to SSO + audit logging live by October 1st. Deferring the onboarding fix for a fourth consecutive quarter risks NPS continuing to decline into a range that affects renewal conversations with existing customers.',
      },
      { id: 'scope', heading: 'Scope Boundary',
        prompt: 'What is explicitly NOT in scope for this problem definition? Good scope boundaries prevent problem creep. Be direct about what you are choosing not to solve — and briefly note why.',
        placeholder: 'List what is explicitly out of scope for this problem definition, and why…',
        example: 'Out of scope: full mobile UX redesign, international market expansion, driver rating system. In scope: document verification flow and first-run onboarding experience only. Rationale: full redesign requires 12+ engineer-weeks and cannot be delivered alongside SSO in Q3.',
      },
    ],
  },
  {
    id: 'user_segment', title: 'Target User Segment',
    objective: 'Define and validate the primary segment affected by this problem with enough specificity to make feature decisions, not just describe a persona.',
    sections: [
      { id: 'profile', heading: 'Segment Profile',
        prompt: 'Describe the user type most affected. Include: who they are, what company size or context they operate in, what job-to-be-done drives their use of the product. Avoid generic persona labels — describe people.',
        placeholder: 'Describe the user profile with specificity about role, context, and job-to-be-done…',
        example: 'Mid-market SaaS buyers (50–250 seats), evaluated by IT directors and operations leads. Primary job-to-be-done: deploy a workflow tool to their team without involving engineering. High sensitivity to setup complexity and time-to-value — internal buy-in depends on showing value within the first meeting.',
      },
      { id: 'behavior', heading: 'Key Behaviors & Observed Pain Points',
        prompt: 'What specific behaviors do these users exhibit related to the problem? How do they currently work around it? What do they say in research or support tickets? Quote direct language where possible.',
        placeholder: 'Describe observed behaviors and quote direct pain points from research…',
        example: '62% of trial users skip the team workspace setup step entirely, going straight to solo use. Exit survey open-text: "took 30 minutes just to get to the point I could try it" (Q2, n=89). Median trial session for non-converters: 4.2 days. Converters: 14.6 days. Drop-off is happening before first value moment.',
      },
      { id: 'commercial', heading: 'Commercial Relevance',
        prompt: 'How does this segment connect to Nexus\'s revenue goals, churn reduction, or expansion? Quantify the ARR or retention impact of solving — or failing to solve — for this segment.',
        placeholder: 'Quantify the commercial relevance of this segment in ARR, retention, or conversion terms…',
        example: 'Mid-market represents 68% of net new ARR in Q2. Conversion rate gap (23% vs. 28%+ benchmark) represents ~$420K ARR delta at current acquisition volume. Solving onboarding friction in this segment would close this gap within 2 quarters at current trial volume.',
      },
      { id: 'size', heading: 'Segment Size & Prioritisation Rationale',
        prompt: 'How large is this segment? Why prioritise it over others right now? What changes if you get the segment definition wrong?',
        placeholder: 'Estimate segment size and explain why this is the right segment to prioritise…',
        example: '~2,400 trial starts per month in this profile. At 5pp conversion improvement, ~120 new paying customers per month at $350 ARPU = ~$504K ARR annually. Prioritising enterprise over this segment risks losing the mid-market foundation while chasing larger logos with longer sales cycles.',
      },
    ],
  },
  {
    id: 'hypothesis', title: 'Product Hypothesis',
    objective: 'Formulate a clear, testable hypothesis that links a specific product decision to a measurable business outcome — before committing engineering time.',
    sections: [
      { id: 'statement', heading: 'Hypothesis Statement',
        prompt: 'Write using this exact structure: "If we [specific product change], then [specific user behaviour] will change, resulting in [metric] improving from [baseline] to [target] within [timeframe]." The product change must be specific enough to build. The outcome must be measurable.',
        placeholder: 'If we [specific action], then [user behaviour] will change, resulting in [metric] improving from [baseline] to [target] within [timeframe]…',
        example: 'If we reduce mandatory first-run setup steps from 9 to 4 and auto-populate the first project from signup use-case, then new users will reach first value moment within their first session, resulting in trial-to-paid conversion improving from 23% to 28%+ within Q3 (measured at 30-day cohort level).',
      },
      { id: 'assumptions', heading: 'Key Assumptions',
        prompt: 'List the key assumptions this hypothesis depends on. Which ones are most likely to be wrong? Which single assumption, if false, would invalidate the entire hypothesis?',
        placeholder: 'List 3–5 key assumptions and note which is the highest-risk single point of failure…',
        example: 'Assumption 1: Setup complexity is primary barrier (not price or feature gaps) — HIGH confidence, exit survey n=89.\nAssumption 2: Auto-populated template useful to >60% of users — MEDIUM confidence, untested.\nAssumption 3: 2 eng-weeks sufficient (Priya\'s estimate) — HIGH confidence per Marcus review.\nKill-shot assumption: if users drop off for pricing reasons, not friction, this hypothesis is invalid.',
      },
      { id: 'validation', heading: 'Validation Method',
        prompt: 'How will you test whether this hypothesis is true before committing to full delivery? What is the minimum evidence needed to validate or invalidate it? Include: test design, sample size, duration, and decision criteria.',
        placeholder: 'Describe the test design, sample size, duration, and what results would validate vs. invalidate…',
        example: 'A/B test on 40% of new trial cohort starting week 3 of Q3. Primary: 30-day conversion rate. Secondary: NPS at day 7. Minimum detectable effect: 2pp. Expected sample: 960 users per arm over 3 weeks. Decision: if <1pp delta at week 4, pause and re-assess.',
      },
      { id: 'confidence', heading: 'Confidence Level & Rationale',
        prompt: 'How confident are you in this hypothesis — Low / Medium / High — and why? What would raise your confidence? What would lower it?',
        placeholder: 'State your confidence level and the specific reasoning behind it…',
        example: 'MEDIUM-HIGH. Evidence is strong across multiple independent sources (interviews, exit surveys, NPS driver data) — all pointing to same problem. Confidence would rise to HIGH if Priya\'s research is validated against Q3 exit cohort. Would lower to MEDIUM if A/B week-2 data shows <0.5pp conversion delta.',
      },
    ],
  },
  {
    id: 'metrics', title: 'Success Metrics',
    objective: 'Define the measurable criteria by which the Q3 roadmap decision will be evaluated — agreed upon before work begins, not fitted after the fact.',
    sections: [
      { id: 'primary', heading: 'Primary Success Metric',
        prompt: 'Define one primary metric that directly measures whether the strategy is working. Specify: what it measures, current baseline, target value, measurement cadence, and who is responsible for tracking it.',
        placeholder: 'Primary metric  |  Baseline  |  Target  |  Cadence  |  Owner',
        example: 'Trial-to-paid conversion rate (30-day cohort). Baseline: 23%. Target: 28%+. Measured weekly via Mixpanel cohort analysis. Owner: Priya (data instrumentation) + PM (weekly review and escalation).',
      },
      { id: 'supporting', heading: 'Supporting Metrics',
        prompt: 'Define 1–2 secondary metrics that confirm directional progress toward the primary goal. These should be earlier-leading than the primary metric — ideally observable within days, not weeks.',
        placeholder: 'Supporting metric 1  |  Baseline  |  Target\nSupporting metric 2  |  Baseline  |  Target',
        example: '1. Median time-to-first-value in trial (Mixpanel "first project created" event): 2.3 hrs → under 30 min\n2. NPS "ease of getting started" driver score: 28 → 38+ (Q3 end cohort survey, Priya owns)',
      },
      { id: 'guardrails', heading: 'Guardrail Metrics',
        prompt: 'Define 1–2 metrics that must not regress as a result of this strategy. Guardrails protect against optimising one thing at the expense of another. State the threshold — not just "must not decrease" but "must not decrease by more than X%".',
        placeholder: 'Guardrail metric 1  |  Current value  |  Non-regression threshold\nGuardrail metric 2  |  Current value  |  Non-regression threshold',
        example: '1. SSO delivery: must reach GA by October 1st (hard investor covenant, $3M at risk — no regression threshold, binary).\n2. Engineering sprint completion rate: must not drop below 85% of committed scope (Marcus\'s quality threshold — if breached, PM must immediately descope).',
      },
      { id: 'measurement', heading: 'Measurement & Review Plan',
        prompt: 'Who tracks each metric? When do you review? What triggers a strategy re-evaluation vs. an escalation vs. a full pivot? Define the thresholds before you start — not after results come in.',
        placeholder: 'Describe the review cadence, ownership, and decision thresholds for re-evaluation or escalation…',
        example: 'Weekly Monday 9am review (PM + Priya). Automated Mixpanel dashboard shared with Elena and Sarah. Re-evaluate if primary metric delta <1pp after week 4. Escalate to Elena if either guardrail metric breaches threshold. Trigger for full pivot: conversion actually decreases vs. control at week 4.',
      },
    ],
  },
  {
    id: 'feature_proposal', title: 'Feature Proposal',
    objective: 'Articulate the specific product change being proposed — including user value, engineering scope, and a phased delivery plan.',
    sections: [
      { id: 'description', heading: 'Feature Description',
        prompt: 'Describe the specific product change in plain language. Write it from the user\'s perspective first — what will they experience that they cannot today — then describe it from the engineering perspective. Avoid technical jargon in the user-facing description.',
        placeholder: 'What the user experiences after this ships. What engineering builds to make it happen…',
        example: 'User experience: when a new user creates their first workspace, the system automatically creates a sample project based on their stated use case (selected during signup), reducing setup from 9 mandatory steps to 4. Engineering: frontend changes to onboarding wizard, backend template generation API (extends existing template service), A/B test flag infrastructure.',
      },
      { id: 'user_value', heading: 'User Value Proposition',
        prompt: 'What specific value does this feature deliver to the target user? Why this approach rather than an alternative? Tie it directly to the problem statement and hypothesis.',
        placeholder: 'Describe the user value and why this specific approach (vs. alternatives) delivers it best…',
        example: 'Users reach first value moment (completing a task in their workspace) within 20 minutes of signup, vs. current average of 2.3 hours. Removes cognitive overhead of building from scratch — addresses the most-cited barrier in exit interviews. Lower friction than a template library because it requires zero additional selection decisions.',
      },
      { id: 'engineering', heading: 'Engineering Scope & Estimate',
        prompt: 'What is the engineering effort required? What are the technical dependencies or constraints? Has this estimate been reviewed and validated with Engineering? Call out any risks that could affect the estimate.',
        placeholder: 'Estimated effort, technical dependencies, validation status, and estimate risks…',
        example: 'Estimated 2 engineer-weeks (reviewed with Marcus — his comment: "Priya\'s estimate is accurate, this is not auth-adjacent, almost anyone on the team can do it"). Dependency: A/B test flag infrastructure requires 2 days of platform work first. Risk: Jordan Lee\'s paternity leave starts Aug 11 — work should begin no later than Aug 4 to avoid cross-team dependency.',
      },
      { id: 'phasing', heading: 'Delivery Phasing',
        prompt: 'Can this be delivered in phases? Define the MVP (minimum that delivers measurable value) vs. the full scope. What is the Q3 commitment and what is deferred? Make phasing decisions explicit — do not leave them vague.',
        placeholder: 'Phase 1 (MVP, Q3): what ships and delivers measurable value\nPhase 2 (full scope, Q4+): what is deferred and why…',
        example: 'Phase 1 (Q3, 2 weeks): setup steps 9→4, auto-populate from signup use-case → delivers ~60% of projected conversion lift.\nPhase 2 (Q4, 3 weeks): full template library + team invitation flow redesign → delivers remaining 40%.\nQ3 commitment: Phase 1 only. Phase 2 contingent on Q3 conversion data showing Phase 1 working.',
      },
    ],
  },
  {
    id: 'risks', title: 'Risks & Dependencies',
    objective: 'Identify and assess the key risks to Q3 delivery and stakeholder alignment — with mitigation plans that have owners and contingencies, not just intentions.',
    sections: [
      { id: 'delivery_risks', heading: 'Engineering & Delivery Risks',
        prompt: 'What engineering capacity, timeline, or technical risks could prevent delivery? For each, specify: what would cause the slip, how much it would affect the plan, and what the likelihood is.',
        placeholder: 'Risk  |  Likelihood  |  Impact  |  What causes it…',
        example: 'Capacity at 94% (confirmed): any unplanned request collapses Q3 scope. Billing migration deferral window (Aug 14–16) is the only buffer — if Marcus cannot take it, there is no contingency capacity.\nJordan Lee paternity leave (Aug 11): auth-adjacent work must complete by Aug 8 or wait until September.',
      },
      { id: 'stakeholder_risks', heading: 'Stakeholder & Alignment Risks',
        prompt: 'What stakeholder misalignment, communication gaps, or org dynamics could derail the plan — even if engineering executes perfectly? Include the CEO/VP dynamic explicitly.',
        placeholder: 'List stakeholder and alignment risks, including the org dynamics at play…',
        example: 'VP Product bypassed this week: if Sarah is not explicitly aligned before anything reaches Elena, this becomes a management relationship problem that slows everything down.\nSales pattern risk: Tom has added off-roadmap requests to Engineering 3 times this quarter — a written request freeze is needed with a named single PM contact.',
      },
      { id: 'external_risks', heading: 'External & Market Risks',
        prompt: 'What competitive, customer, or market risks could affect whether this strategy succeeds — even if executed perfectly internally? Be specific rather than generic.',
        placeholder: 'List external and market risks with specifics…',
        example: 'Acuity SSO demo to Acme in ~6 weeks: if Acme signs with Acuity before our GA, Meridian Group ($1.4M ARR, same SSO requirement) becomes primary enterprise target.\nSeries C investor covenant: $3M clawback if SSO + audit logging not live by October 1st — this is a hard non-negotiable edge, not a preference.',
      },
      { id: 'mitigations', heading: 'Top 3 Mitigations',
        prompt: 'For your three highest-priority risks: what is the specific mitigation action, who owns it, and what is the contingency if the primary mitigation fails?',
        placeholder: 'Risk 1 → Mitigation → Owner → Contingency\nRisk 2 → Mitigation → Owner → Contingency\nRisk 3 → Mitigation → Owner → Contingency',
        example: '1. Capacity → billing migration deferral (Marcus owns, Aug 14–16). Contingency: reduce Priya onboarding to 1.5 weeks if needed.\n2. SSO timeline → WorkOS integration vs. in-house build (PM owns decision, Marcus owns execution). Contingency: Acme private beta offer (Tom manages) if Oct 1 GA slips <2 weeks.\n3. VP alignment → Sarah 1:1 before any document goes to Elena (PM owns, Wed EOD). Contingency: none — this is non-deferrable.',
      },
    ],
  },
];

const DELIVERABLE_STATUS_CONFIG: Record<DeliverableStatus, { label: string; color: string; bg: string }> = {
  not_started:    { label: 'Not Started',    color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  in_progress:    { label: 'In Progress',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  needs_revision: { label: 'Needs Revision', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  approved:       { label: 'Approved',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
};

function getInitialDelivStates(): Record<string, DeliverableState> {
  const s: Record<string, DeliverableState> = {};
  DELIVERABLE_DEFS.forEach(d => {
    const sections: Record<string, string> = {};
    d.sections.forEach(sec => { sections[sec.id] = ''; });
    s[d.id] = { sections, status: 'not_started', mode: 'guided', usedExample: false, feedback: null, score: null, attemptCount: 0 };
  });
  return s;
}

const DELIVERABLE_SCORE_CONFIG: Record<string, { scoreKeywords: string[]; scenarioKeywords: string[] }> = {
  strategy_brief:   { scoreKeywords: ['strategy','roadmap','recommendation','trade-off','tradeoff','option','decision','OKR','outcome','direction','scope'], scenarioKeywords: ['nexus','SSO','Q3','elena','series C','enterprise','$3m','october','acme','investor'] },
  problem_def:      { scoreKeywords: ['problem','friction','evidence','data','constraint','gap','impact','signal','churn','conversion','NPS','quantif','metric'], scenarioKeywords: ['nexus','SSO','onboarding','engineering capacity','67','38','priya','marcus','Q3','october','acme','42%','trial'] },
  user_segment:     { scoreKeywords: ['segment','user','customer','persona','profile','behavior','behaviour','job-to-be-done','mid-market','enterprise','ICP','commercial'], scenarioKeywords: ['nexus','acme','onboarding','trial','conversion','mid-market','enterprise','SSO','SaaS'] },
  hypothesis:       { scoreKeywords: ['if','then','hypothesis','assumption','validate','test','baseline','target','confidence','outcome','predict'], scenarioKeywords: ['nexus','SSO','onboarding','conversion','NPS','Q3','trial','WorkOS','acme','october'] },
  metrics:          { scoreKeywords: ['metric','KPI','goal','target','baseline','measure','conversion','retention','leading indicator','guardrail','objective','owner'], scenarioKeywords: ['nexus','SSO','23%','42','NPS','Q3','october','trial-to-paid','engineering velocity','marcus','priya'] },
  feature_proposal: { scoreKeywords: ['feature','requirement','scope','engineering','sprint','week','phase','MVP','delivery','ship','build','integrate','estimate','capacity'], scenarioKeywords: ['nexus','SSO','WorkOS','audit','marcus','engineer-weeks','onboarding','Q3','october','acme','phase'] },
  risks:            { scoreKeywords: ['risk','dependency','constraint','mitigation','contingency','owner','escalate','blocker','assumption','capacity','timeline'], scenarioKeywords: ['nexus','SSO','$3m','october','marcus','sarah','elena','acme','engineering capacity','WorkOS','94%','billing migration','series C','clawback'] },
};

function scoreDeliverable(def: DeliverableDef, state: DeliverableState): { score: number; feedback: string | null } {
  const allText = Object.values(state.sections).join(' ');
  const words   = allText.trim().split(/\s+/).filter(Boolean).length;
  const config  = DELIVERABLE_SCORE_CONFIG[def.id] ?? { scoreKeywords: [], scenarioKeywords: [] };
  const lower   = allText.toLowerCase();

  const targetWords  = def.sections.length * 50;
  const completeness = Math.min(100, (words / Math.max(targetWords, 1)) * 100);

  const kwHits     = config.scoreKeywords.filter(k => lower.includes(k.toLowerCase())).length;
  const keywordScore = Math.min(100, (kwHits / Math.max(config.scoreKeywords.length, 1)) * 200);

  const scHits     = config.scenarioKeywords.filter(k => lower.includes(k.toLowerCase())).length;
  const rawScenario  = Math.min(100, (scHits / 3) * 100);
  const scenarioScore = rawScenario * (state.usedExample ? 0.55 : 1);

  let total = Math.round((completeness * 0.35) + (keywordScore * 0.35) + (scenarioScore * 0.30));

  const hypo = state.sections['statement'] ?? state.sections['hypothesis'] ?? '';
  if (hypo.length > 10 && !/\bif\b.{5,}\bthen\b/i.test(hypo))
    return { score: Math.min(total, 65), feedback: 'Your hypothesis is missing the If/Then structure. Rewrite as: "If we [action], then [behaviour] will change, resulting in [metric] improving from [baseline] to [target] within [timeframe]."' };
  const met = state.sections['primary'] ?? state.sections['metrics'] ?? '';
  if (met.length > 10 && !/\d+/.test(met))
    return { score: Math.min(total, 60), feedback: 'Your success metrics are missing quantified targets. Each metric needs a specific numeric goal — e.g., "conversion from 23% to 28%."' };

  let feedback: string | null = null;
  if (total < 80) {
    if (completeness < 50)
      feedback = `This deliverable needs more substance — currently ${words} words across ${def.sections.length} sections. Aim for at least ${targetWords} words with specific detail.`;
    else if (scenarioScore < 25)
      feedback = state.usedExample
        ? 'Your content mirrors the ride-sharing example too closely. Rewrite each section to reference actual Nexus constraints: SSO scope, Marcus\'s capacity numbers, the Acme commitment language, Priya\'s exit data.'
        : 'Ground this in the Nexus scenario. Reference specific constraints: the $3M investor covenant, Marcus\'s engineering estimate, the Acme commitment language, or Priya\'s 42% churn finding.';
    else if (keywordScore < 35)
      feedback = 'Good structure. Strengthen with more PM specificity — add measurable targets, name owners, and call out trade-offs explicitly.';
    else
      feedback = `Your score is ${total}/100. Add more scenario-specific evidence and quantification to reach the 80% threshold.`;
  }
  return { score: Math.min(total, 100), feedback };
}

function StageProgressHeader({ stage, planScore }: { stage: SimulationStage; planScore: number | null }) {
  const steps: { id: SimulationStage; label: string; sublabel: string }[] = [
    { id: 'planning',  label: 'Planning',  sublabel: 'Build your strategy' },
    { id: 'execution', label: 'Execution', sublabel: 'Solve the scenario'  },
    { id: 'reporting', label: 'Report',    sublabel: 'Review your results' },
  ];
  const stageOrder: Record<SimulationStage, number> = { planning: 0, execution: 1, reporting: 2 };
  const current = stageOrder[stage];
  return (
    <div style={{ ...cardStyle, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((step, i) => {
          const isDone   = stageOrder[step.id] < current;
          const isActive = step.id === stage;
          const isFuture = stageOrder[step.id] > current;
          const dotColor  = isActive ? '#147b58' : isDone ? '#22c55e' : 'rgba(255,255,255,0.12)';
          const textColor = isActive ? '#34d399'  : isDone ? '#86efac'  : '#4b5563';
          return (
            <React.Fragment key={step.id}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? 'rgba(20,123,88,0.2)' : isDone ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${dotColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? '0 0 14px rgba(20,123,88,0.35)' : 'none',
                  transition: 'box-shadow 300ms',
                }}>
                  {isDone
                    ? <span style={{ fontSize: 13, color: '#22c55e', lineHeight: 1 }}>✓</span>
                    : <span style={{ fontSize: 11, fontWeight: 700, color: textColor }}>{i + 1}</span>
                  }
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: textColor, whiteSpace: 'nowrap' }}>
                    {step.label}
                    {isDone && step.id === 'planning' && planScore !== null
                      ? <span style={{ color: '#22c55e', fontSize: 11 }}> · {planScore}/100</span>
                      : ''}
                  </div>
                  <div style={{ fontSize: 10, color: isFuture ? 'rgba(255,255,255,0.2)' : 'rgba(175,163,159,0.65)', marginTop: 2 }}>{step.sublabel}</div>
                </div>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 0, width: 44, height: 2, flexShrink: 0, marginTop: 14,
                  background: isDone ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)',
                  borderRadius: 1,
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {stage === 'planning' && (
        <div style={{
          marginTop: 13, fontSize: 11, color: 'rgba(175,163,159,0.55)',
          textAlign: 'center', lineHeight: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 11,
        }}>
          Complete all 7 deliverables · each must score ≥ 80 · submit plan · overall ≥ 80 to unlock Execution
        </div>
      )}
    </div>
  );
}

const CHAR_STYLE: Record<string, { initials: string; avatarBg: string; pillBg: string; pillColor: string; pillBorder: string }> = {
  elena:  { initials: 'EL', avatarBg: '#5b21b6', pillBg: 'rgba(124,58,237,0.15)', pillColor: '#a78bfa', pillBorder: 'rgba(124,58,237,0.3)'  },
  marcus: { initials: 'MA', avatarBg: '#3f3f46', pillBg: 'rgba(113,113,122,0.2)',  pillColor: '#a1a1aa', pillBorder: 'rgba(255,255,255,0.12)' },
  tom:    { initials: 'TO', avatarBg: '#9a3412', pillBg: 'rgba(234,88,12,0.15)',   pillColor: '#fb923c', pillBorder: 'rgba(234,88,12,0.3)'   },
  priya:  { initials: 'PR', avatarBg: '#9d174d', pillBg: 'rgba(219,39,119,0.15)', pillColor: '#f472b6', pillBorder: 'rgba(219,39,119,0.3)'  },
  sarah:  { initials: 'SA', avatarBg: '#0f766e', pillBg: 'rgba(20,184,166,0.12)', pillColor: '#2dd4bf', pillBorder: 'rgba(20,184,166,0.3)'  },
};

const MISSION_LAYERS = [
  { charId: 'elena',  question: 'Why is SSO truly non-negotiable — and what happens if it slips past October 1st?' },
  { charId: 'marcus', question: "Is Marcus's \"6 weeks\" a build constraint, or a process constraint with a third-party workaround?" },
  { charId: 'tom',    question: 'What did Tom actually commit to Acme in writing — and is there a second deal in the pipeline?' },
  { charId: 'priya',  question: "What does Priya's research actually show, and what does it cost to fix vs. the price of ignoring it?" },
  { charId: 'marcus', question: 'Is there a billing migration window that changes the capacity math — and what is the Q4 trade-off?' },
  { charId: 'sarah',  question: 'How do you align Sarah without making Elena feel managed — and why does the order matter?' },
];

const STAKEHOLDER_HINTS: Record<string, string> = {
  elena:  'Has a board constraint she assumes everyone already knows about.',
  marcus: 'His timeline hides a shortcut — and a second capacity constraint.',
  tom:    'His Acme commitment in writing is softer than his verbal framing.',
  priya:  'Sitting on research that changes the cost calculus entirely.',
  sarah:  'Knows how to align the CEO without triggering politics — if asked right.',
};

function MissionControlTab() {
  const { session, characters, messages, advanceToExecution } = useAppStore();
  const simulationStage = session?.simulationStage ?? 'planning';
  const [detailChar, setDetailChar] = useState<typeof characters[0] | null>(null);
  const [delivStates, setDelivStates] = useState<Record<string, DeliverableState>>(getInitialDelivStates);
  const [activeDelivId, setActiveDelivId] = useState<string | null>(null);
  const [vetFeedback, setVetFeedback] = useState<string | null>(null);
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [localPlanScore, setLocalPlanScore] = useState<number | null>(null);
  const [localPlanFeedback, setLocalPlanFeedback] = useState<string | null>(null);

  const openDeliverable = (id: string, opts?: { prefillExample?: boolean; forceMode?: 'guided' | 'advanced' }) => {
    setActiveDelivId(id);
    setVetFeedback(null);
    if (opts) {
      setDelivStates(prev => {
        const def = DELIVERABLE_DEFS.find(d => d.id === id);
        const state = prev[id];
        if (!def || !state) return prev;
        let next = { ...state };
        if (opts.forceMode) next = { ...next, mode: opts.forceMode };
        if (opts.prefillExample) {
          const exSec: Record<string, string> = {};
          def.sections.forEach(s => { exSec[s.id] = s.example; });
          next = { ...next, sections: exSec, usedExample: true, status: 'in_progress' };
        }
        return { ...prev, [id]: next };
      });
    }
  };

  const closeDeliverable = () => { setActiveDelivId(null); setVetFeedback(null); };

  const updateDelivSection = (delivId: string, secId: string, val: string) => {
    setDelivStates(prev => {
      const state = prev[delivId];
      const newSecs = { ...state.sections, [secId]: val };
      const hasContent = Object.values(newSecs).some(v => v.trim().length > 0);
      return { ...prev, [delivId]: { ...state, sections: newSecs, status: hasContent ? 'in_progress' : 'not_started' } };
    });
  };

  const toggleMode = (delivId: string) => {
    setDelivStates(prev => ({ ...prev, [delivId]: { ...prev[delivId], mode: prev[delivId].mode === 'guided' ? 'advanced' : 'guided' } }));
  };

  const clearExampleBase = (delivId: string) => {
    const def = DELIVERABLE_DEFS.find(d => d.id === delivId);
    if (!def) return;
    const emptySecs: Record<string, string> = {};
    def.sections.forEach(s => { emptySecs[s.id] = ''; });
    setDelivStates(prev => ({ ...prev, [delivId]: { ...prev[delivId], sections: emptySecs, usedExample: false, status: 'not_started' } }));
  };

  const submitForReview = (delivId: string) => {
    const def = DELIVERABLE_DEFS.find(d => d.id === delivId);
    const state = delivStates[delivId];
    if (!def || !state) return;
    const { score, feedback } = scoreDeliverable(def, state);
    const passed = score >= 80;
    setDelivStates(prev => ({
      ...prev,
      [delivId]: { ...prev[delivId], status: passed ? 'approved' : 'needs_revision', feedback, score, attemptCount: prev[delivId].attemptCount + 1 },
    }));
    setVetFeedback(feedback);
    if (passed) closeDeliverable();
  };

  const submitPlan = () => {
    setPlanSubmitting(true);
    setLocalPlanScore(null);
    setLocalPlanFeedback(null);
    setTimeout(() => {
      const scores = DELIVERABLE_DEFS.map(def => delivStates[def.id].score ?? 0);
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const passed = avg >= 80;
      const feedback = passed
        ? `Your plan scores ${avg}/100. Solid strategic thinking — your metrics are quantified, your risks name owners, and your hypothesis is grounded in Nexus data. Execution stage unlocked.`
        : `Your plan averages ${avg}/100. Review the deliverables flagged below. Focus on grounding each section in specific Nexus scenario data and ensuring all metrics have numeric targets.`;
      setLocalPlanScore(avg);
      setLocalPlanFeedback(feedback);
      setPlanSubmitting(false);
      if (passed) advanceToExecution(avg, feedback);
    }, 2000);
  };

  const activeDef   = activeDelivId ? DELIVERABLE_DEFS.find(d => d.id === activeDelivId) ?? null : null;
  const activeState = activeDelivId ? delivStates[activeDelivId] : null;
  const completedCount = Object.values(delivStates).filter(s => s.status === 'approved').length;

  const okrs = session?.okrs ?? [
    { id: 'okr1', title: 'Align Engineering on Q3 timeline by Friday', status: 'in_progress' as const, progress: 30 },
    { id: 'okr2', title: 'Draft revised roadmap v2 with trade-offs', status: 'pending' as const, progress: 0 },
    { id: 'okr3', title: 'CEO strategic brief ready for Monday', status: 'pending' as const, progress: 0 },
    { id: 'okr4', title: 'Resolve Sales Director off-roadmap conflict', status: 'pending' as const, progress: 0 },
  ];

  const OKR_STATUS: Record<string, { label: string; color: string }> = {
    pending:     { label: 'Pending',     color: '#6b7280' },
    in_progress: { label: 'In Progress', color: '#f59e0b' },
    complete:    { label: 'Complete',    color: '#22c55e' },
    missed:      { label: 'Missed',      color: '#ef4444' },
  };

  const metrics = [
    { label: 'MRR',            value: `$${(MOCK_ANALYTICS.mrr.value / 1000).toFixed(0)}K`, delta: `${MOCK_ANALYTICS.mrr.delta > 0 ? '+' : ''}${MOCK_ANALYTICS.mrr.delta}%`,     up: MOCK_ANALYTICS.mrr.delta >= 0,            color: '#34d399' },
    { label: 'NPS',            value: String(MOCK_ANALYTICS.nps.value),                      delta: `${MOCK_ANALYTICS.nps.delta}  vs last qtr`,                                    up: MOCK_ANALYTICS.nps.delta >= 0,            color: '#f87171' },
    { label: 'Trial → Paid',   value: `${MOCK_ANALYTICS.trialConversion.value}%`, delta: `${MOCK_ANALYTICS.trialConversion.delta}% vs last qtr`,  up: MOCK_ANALYTICS.trialConversion.delta >= 0, color: '#fbbf24' },
    { label: 'Eng Velocity',   value: `${MOCK_ANALYTICS.velocity.value}%`,                   delta: `${MOCK_ANALYTICS.velocity.delta}pts capacity`,                                up: MOCK_ANALYTICS.velocity.delta >= 0,       color: '#fb923c' },
  ];

  // Which character IDs the user has actively messaged
  const queriedChars = React.useMemo(() => {
    const s = new Set<string>();
    messages.forEach(m => { if (m.from === 'user') s.add(m.to); });
    return s;
  }, [messages]);

  const HIDDEN_INTEL = [
    { id: 'h1', charId: 'elena',  label: 'The $3M investor covenant tied to the October 1st SSO deadline',           source: 'Elena Park',   hint: 'Ask Elena directly why SSO is truly non-negotiable. "CEO says so" is not an answer.' },
    { id: 'h2', charId: 'marcus', label: 'WorkOS third-party SSO integration cuts delivery from 6 weeks to 2',        source: 'Marcus Webb',  hint: 'Push Marcus on the WHY behind the 6-week estimate. Ask about alternatives explicitly.' },
    { id: 'h3', charId: 'tom',    label: 'Actual Acme commitment language is "best efforts," not a binding deadline', source: 'Tom Rivera',   hint: 'Ask Tom to forward the actual email chain. Do not accept verbal framing.' },
    { id: 'h4', charId: 'priya',  label: "Priya's exit survey data — 42% of churn tied to onboarding friction",      source: 'Priya Sharma', hint: 'Ask Priya directly for her research. She will not volunteer it unprompted.' },
    { id: 'h5', charId: 'marcus', label: 'Billing migration deferral window (Aug 14–16) frees 4 eng-weeks',           source: 'Marcus Webb',  hint: 'Ask Marcus whether any capacity assumptions are flexible. He left this out initially.' },
    { id: 'h6', charId: 'tom',    label: 'Second enterprise prospect — Meridian Group, $1.4M ARR, same SSO requirement', source: 'Tom Rivera', hint: 'Ask Tom if there are other deals in the pipeline with the same requirements.' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Execution: Plan Approved Banner ── */}
      {simulationStage !== 'planning' && session?.planScore !== null && session?.planFeedback && (
        <div style={{ padding: '13px 16px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#22c55e' }}>✓</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>
              Plan Approved · {session.planScore}/100
              {session.planUnlockedAt ? <span style={{ fontWeight: 400, color: 'rgba(34,197,94,0.6)', marginLeft: 8 }}>Unlocked {new Date(session.planUnlockedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : ''}
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.55 }}>{session.planFeedback}</p>
          </div>
        </div>
      )}

      {/* ── Reporting: Session Complete Banner ── */}
      {simulationStage === 'reporting' && (
        <div style={{ padding: '18px 20px', borderRadius: 12, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.18)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Session Complete</div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Plan Score',    value: session?.planScore != null ? `${session.planScore}/100` : '—' },
              { label: 'OKRs Complete', value: `${okrs.filter(o => o.status === 'complete').length}/${okrs.length}` },
              { label: 'Avg Trust',     value: `${Math.round(characters.reduce((a, c) => a + c.trust, 0) / Math.max(characters.length, 1) * 100)}%` },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ SCENARIO BRIEF ══ */}
      <div style={{ ...cardStyle, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #147b58 30%, #34d399 60%, transparent)' }} />
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#147b58', textTransform: 'uppercase', marginBottom: 5 }}>Active Scenario</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.01em' }}>The Roadmap Reckoning</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: '#34d399', background: 'rgba(20,123,88,0.1)', border: '1px solid rgba(20,123,88,0.22)', borderRadius: 6, padding: '3px 9px' }}>
                Session {session?.sessionNumber ?? 1} of 3
              </div>
              <div style={{ fontSize: 10, color: session?.status === 'completed' ? '#22c55e' : '#6b7280' }}>
                {session?.status === 'completed' ? '✓ Completed' : session ? '● Active' : 'Not started'}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px', marginBottom: 14 }}>
            {[
              { label: 'Company',   value: 'Nexus Technologies' },
              { label: 'Stage',     value: '$20M Series C' },
              { label: 'Your Role', value: 'Product Manager' },
              { label: 'Size',      value: '300 employees · B2B SaaS' },
              { label: 'Deadline',  value: 'Fri 9am → Board Monday' },
              { label: 'At Stake',  value: '$3.4M ARR + $3M clause' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 9.5, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>
            Nexus closed a $20M Series C ten days ago. You have been handed ownership of a Q3 roadmap that three teams cannot agree on. Engineering's capacity is tighter than the plan acknowledges. Sales has set expectations with a $2M enterprise client — but the actual commitment language matters more than you've been told. Design has been sitting on research that changes the NPS story entirely. And somewhere in the Series C term sheet is a constraint the CEO hasn't communicated to anyone.
          </p>
        </div>
      </div>

      {/* ══ MISSION OBJECTIVE + HIDDEN LAYERS (2-column) ══ */}
      <div style={{ ...cardStyle, overflow: 'hidden', flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 384px' }}>

        {/* ── Left: Mission Objective ── */}
        <div style={{ padding: '18px 20px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 13, borderRadius: 2, background: '#147b58', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', color: '#147b58', textTransform: 'uppercase' }}>Mission Objective</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 5, fontSize: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280', cursor: 'default' }}>
              <span style={{ fontSize: 10 }}>☆</span> Board-level scrutiny
            </button>
          </div>
          {/* Due date pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14 }}>
            <span style={{ fontSize: 10 }}>⏱</span>
            <span style={{ fontSize: 10.5, color: '#9ca3af' }}>Due Friday 9am · Elena</span>
          </div>
          {/* Description */}
          <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.7, margin: '0 0 16px' }}>
            Deliver a board-ready Q3 decision brief. The scenario contains{' '}
            <span style={{ color: '#34d399', fontWeight: 600 }}>6 hidden information layers</span>
            {' '}— none of which surface without the right question to the right person.
          </p>
          {/* Bullet objectives */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Resolve the three-way roadmap conflict',
              "Uncover what you don't know yet",
              'Make a recommendation defensible under scrutiny',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: '#22c55e', lineHeight: 1 }}>✓</span>
                </div>
                <span style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Stakeholders ── */}
        <div style={{ padding: '16px 14px', background: 'rgba(0,0,0,0.12)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.11em', color: '#6b7280', textTransform: 'uppercase' }}>Stakeholders</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: '#4b5563' }}>·</span>
            <span style={{ fontSize: 8.5, fontWeight: 600, color: '#4b5563' }}>5</span>
          </div>
          {/* Stakeholder cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {(['elena', 'marcus', 'tom', 'priya', 'sarah'] as const)
              .map(id => characters.find(c => c.id === id))
              .filter((c): c is NonNullable<typeof c> => Boolean(c))
              .map(char => {
                const cs = CHAR_STYLE[char.id] ?? CHAR_STYLE.sarah;
                const trustPct = Math.round(char.trust * 100);
                return (
                  <div key={char.id}
                    onClick={() => setDetailChar(char)}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    style={{ padding: '9px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                      transition: 'background 120ms', marginBottom: 4 }}>
                    {/* Top row: avatar + name/title + trust% */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.name}</div>
                        <div style={{ fontSize: 10, color: '#6b7280' }}>{char.title}</div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: TRUST_COLOR(char.trust),
                        flexShrink: 0 }}>{trustPct}%</div>
                    </div>
                    {/* Trust bar */}
                    <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1,
                      overflow: 'hidden', margin: '7px 0 6px' }}>
                      <div style={{ width: `${trustPct}%`, height: '100%',
                        background: TRUST_COLOR(char.trust), borderRadius: 1 }} />
                    </div>
                    {/* Hint text */}
                    <p style={{ fontSize: 10.5, color: '#4b5563', lineHeight: 1.45, margin: 0,
                      fontStyle: 'italic' }}>{STAKEHOLDER_HINTS[char.id] ?? ''}</p>
                  </div>
                );
              })}
          </div>
        </div>

      </div>

      {/* ══ DELIVERABLES ══ */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase' }}>
            Your Deliverables
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 100, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((completedCount / DELIVERABLE_DEFS.length) * 100)}%`, height: '100%', background: '#22c55e', borderRadius: 2, transition: 'width 400ms' }} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: completedCount === DELIVERABLE_DEFS.length ? '#22c55e' : '#6b7280' }}>
              {completedCount}/{DELIVERABLE_DEFS.length}
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {DELIVERABLE_DEFS.map((def, idx) => {
            const ds = delivStates[def.id];
            const sc = DELIVERABLE_STATUS_CONFIG[ds.status];
            const isDone = ds.status === 'approved';
            return (
              <div key={def.id} style={{
                ...cardStyle, padding: '24px',
                border: `1px solid ${isDone ? 'rgba(34,197,94,0.25)' : ds.status === 'needs_revision' ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.07)'}`,
                background: isDone ? 'rgba(34,197,94,0.04)' : '#18181c',
                display: 'flex', flexDirection: 'column', gap: 0,
                height: '188px', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: isDone ? '#22c55e' : 'rgba(20,123,88,0.85)',
                    boxShadow: isDone ? '0 0 0 3px rgba(34,197,94,0.15)' : '0 0 0 3px rgba(20,123,88,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? '#6b7280' : '#e2e8f0', lineHeight: 1.3, marginBottom: 4, textDecoration: isDone ? 'line-through' : 'none' }}>
                      {def.title}
                    </div>
                    <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                      {def.objective.length > 95 ? def.objective.substring(0, 92) + '…' : def.objective}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, visibility: ds.score !== null ? 'visible' : 'hidden', flexShrink: 0, marginBottom: 12 }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${ds.score ?? 0}%`, height: '100%', background: (ds.score ?? 0) >= 80 ? '#22c55e' : '#f87171', borderRadius: 2, transition: 'width 400ms' }} />
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: (ds.score ?? 0) >= 80 ? '#22c55e' : '#f87171', flexShrink: 0 }}>{ds.score ?? ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: sc.color, background: sc.bg, border: `1px solid ${sc.color}30`, borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{sc.label}</span>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => openDeliverable(def.id, { prefillExample: true })}
                    style={{ padding: '5px 11px', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#9ca3af' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >Example</button>
                  <button
                    onClick={() => openDeliverable(def.id)}
                    style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: isDone ? 'rgba(255,255,255,0.05)' : '#147b58', border: isDone ? '1px solid rgba(255,255,255,0.1)' : 'none', color: isDone ? '#6b7280' : '#ffffff' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDone ? 'rgba(255,255,255,0.09)' : '#0f6147'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDone ? 'rgba(255,255,255,0.05)' : '#147b58'; }}
                  >
                    {isDone ? 'View' : ds.status === 'not_started' ? 'Start →' : ds.status === 'needs_revision' ? 'Revise →' : 'Continue →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan submission panel */}
        {simulationStage === 'planning' && (() => {
          const allApproved = completedCount === DELIVERABLE_DEFS.length;
          return (
            <div style={{ marginTop: 14 }}>
              {!planSubmitting && localPlanScore === null && (
                <div style={{ padding: '16px 18px', borderRadius: 10, background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Ready to submit your plan?</div>
                    <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
                      {allApproved
                        ? 'All deliverables approved. Submit for AI review.'
                        : 'All deliverables must be scored ≥ 80 before you can submit your final strategy brief.'}
                    </div>
                  </div>
                  <button
                    onClick={allApproved ? submitPlan : undefined}
                    disabled={!allApproved}
                    style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, cursor: allApproved ? 'pointer' : 'not-allowed', background: allApproved ? '#22c55e' : 'rgba(255,255,255,0.05)', border: allApproved ? 'none' : '1px solid rgba(255,255,255,0.1)', color: allApproved ? '#0d1a12' : '#4b5563', transition: 'background 150ms', letterSpacing: '0.01em' }}
                    onMouseEnter={e => { if (allApproved) (e.currentTarget as HTMLElement).style.background = '#16a34a'; }}
                    onMouseLeave={e => { if (allApproved) (e.currentTarget as HTMLElement).style.background = '#22c55e'; }}
                  >Submit Plan</button>
                </div>
              )}
              {planSubmitting && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px', background: 'rgba(20,123,88,0.05)', border: '1px solid rgba(20,123,88,0.18)', borderRadius: 10 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(20,123,88,0.3)', borderTopColor: '#147b58', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>AI is reviewing your plan…</span>
                </div>
              )}
              {!planSubmitting && localPlanScore !== null && localPlanFeedback && (() => {
                const passed = localPlanScore >= 80;
                return (
                  <div style={{ padding: '15px 17px', borderRadius: 10, background: passed ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${passed ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: passed ? '#22c55e' : '#f87171' }}>
                        {passed ? '✓ Plan Approved' : '✗ Revision Required'} · {localPlanScore}/100
                      </div>
                      {!passed && (
                        <button
                          onClick={() => { setLocalPlanScore(null); setLocalPlanFeedback(null); }}
                          style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
                        >Revise & Resubmit</button>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 10px', lineHeight: 1.55 }}>{localPlanFeedback}</p>
                    {!passed && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {DELIVERABLE_DEFS.map(def => {
                          const sc = delivStates[def.id].score ?? 0;
                          const color = sc >= 80 ? '#22c55e' : '#f87171';
                          return (
                            <div key={def.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 10.5, color: '#6b7280', flex: 2 }}>{def.title}</span>
                              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ width: `${sc}%`, height: '100%', background: color, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 10, color, fontWeight: 700, width: 40, textAlign: 'right', flexShrink: 0 }}>{sc}/100</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>

      {/* ══ METRICS (execution+ only) ══ */}
      {simulationStage !== 'planning' && (
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 10 }}>Company Metrics</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {metrics.map(m => (
              <div key={m.label} style={{ ...cardStyle, padding: '12px 14px', background: `${m.color}08`, border: `1px solid ${m.color}1a` }}>
                <div style={{ fontSize: 9.5, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 10.5, color: m.up ? '#34d399' : '#f87171', fontWeight: 600 }}>{m.delta}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TEAM PULSE (execution+ only) ══ */}
      {simulationStage !== 'planning' && (
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 10 }}>Team Pulse</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {characters.map(char => {
              const trustPct = Math.round(char.trust * 100);
              const tColor = TRUST_COLOR(char.trust);
              const eColor = EMOTION_COLORS[char.emotion] ?? 'rgba(255,255,255,0.35)';
              return (
                <div key={char.id}
                  style={{ ...cardStyle, padding: '12px 14px', display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => setDetailChar(char)}
                  onMouseEnter={e => cardHoverIn(e.currentTarget)}
                  onMouseLeave={e => cardHoverOut(e.currentTarget)}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: char.online ? '#22c55e' : '#6b7280', border: '1.5px solid #18181c' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.name}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: eColor, background: `${eColor}18`, border: `1px solid ${eColor}33`, borderRadius: 4, padding: '1px 6px', flexShrink: 0, textTransform: 'capitalize' }}>{char.emotion}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: '#6b7280', marginBottom: 8 }}>{char.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${trustPct}%`, height: '100%', background: tColor, borderRadius: 2, transition: 'width 600ms ease' }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: tColor, flexShrink: 0 }}>{trustPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ SESSION OKRs (execution+ only) ══ */}
      {simulationStage !== 'planning' && (
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 10 }}>Session OKRs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {okrs.map(okr => {
              const sc = OKR_STATUS[okr.status];
              return (
                <div key={okr.id} style={{ ...cardStyle, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af', flex: 1, lineHeight: 1.4 }}>{okr.title}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: sc.color, background: `${sc.color}15`, border: `1px solid ${sc.color}30`, borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${okr.progress}%`, height: '100%', background: sc.color, borderRadius: 2, transition: 'width 600ms ease' }} />
                    </div>
                    <span style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600, flexShrink: 0 }}>{okr.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ height: 8 }} />

      {/* ══ DELIVERABLE EDITOR MODAL ══ */}
      {activeDef && activeState && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backdropFilter: 'blur(8px)', overflowY: 'auto', padding: '24px 16px' }}
          onClick={closeDeliverable}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 720, background: '#13131a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${DELIVERABLE_STATUS_CONFIG[activeState.status].color}, transparent)` }} />
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Deliverable {DELIVERABLE_DEFS.indexOf(activeDef) + 1} of {DELIVERABLE_DEFS.length}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#374151', display: 'inline-block' }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: DELIVERABLE_STATUS_CONFIG[activeState.status].color, background: DELIVERABLE_STATUS_CONFIG[activeState.status].bg, border: `1px solid ${DELIVERABLE_STATUS_CONFIG[activeState.status].color}30`, borderRadius: 4, padding: '1px 6px' }}>
                    {DELIVERABLE_STATUS_CONFIG[activeState.status].label}
                  </span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 5, letterSpacing: '-0.01em' }}>{activeDef.title}</div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55, margin: 0 }}>{activeDef.objective}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginTop: 2 }}>
                <button
                  onClick={() => toggleMode(activeDef.id)}
                  style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: activeState.mode === 'advanced' ? 'rgba(20,123,88,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeState.mode === 'advanced' ? 'rgba(20,123,88,0.3)' : 'rgba(255,255,255,0.08)'}`, color: activeState.mode === 'advanced' ? '#34d399' : '#9ca3af' }}
                >{activeState.mode === 'guided' ? 'Advanced Mode' : '← Guided'}</button>
                <button onClick={closeDeliverable} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>
            {activeState.usedExample && (
              <div style={{ padding: '9px 22px', background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', flexShrink: 0 }}>⚠ Example Base Active</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.45 }}>Replace all content to reflect your mission at Nexus Technologies. AI vetting detects unmodified example text.</span>
                </div>
                <button onClick={() => clearExampleBase(activeDef.id)} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: 'pointer', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', flexShrink: 0 }}>Clear</button>
              </div>
            )}
            {activeState.status === 'needs_revision' && activeState.score !== null && (
              <div style={{ margin: '12px 22px 0', padding: '10px 13px', borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Score: {activeState.score}/100 — Revision Required</div>
                {activeState.feedback && <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{activeState.feedback}</p>}
              </div>
            )}
            {activeState.status === 'approved' && activeState.score !== null && (
              <div style={{ margin: '12px 22px 0', padding: '8px 13px', borderRadius: 8, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                ✓ Approved · {activeState.score}/100
              </div>
            )}
            {vetFeedback && activeState.status !== 'needs_revision' && (
              <div style={{ padding: '12px 22px', background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>AI Validation Feedback</div>
                <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>{vetFeedback}</p>
              </div>
            )}
            {activeState.mode === 'guided' && !vetFeedback && (
              <div style={{ padding: '8px 22px', background: 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 10.5, color: 'rgba(175,163,159,0.5)' }}>📝 Guided mode: writing prompts appear under each heading. Switch to Advanced Mode to remove them.</span>
              </div>
            )}
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22, maxHeight: '52vh', overflowY: 'auto' }}>
              {activeDef.sections.map(sec => {
                const wordCount = (activeState.sections[sec.id] ?? '').trim().split(/\s+/).filter(Boolean).length;
                return (
                  <div key={sec.id}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: activeState.mode === 'guided' ? 5 : 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{sec.heading}</span>
                      {wordCount > 0 && <span style={{ fontSize: 10, color: '#4b5563' }}>{wordCount}w</span>}
                    </div>
                    {activeState.mode === 'guided' && (
                      <p style={{ fontSize: 12, color: 'rgba(175,163,159,0.45)', lineHeight: 1.65, margin: '0 0 8px', borderLeft: '2px solid rgba(255,255,255,0.07)', paddingLeft: 10, fontStyle: 'italic' }}>{sec.prompt}</p>
                    )}
                    <textarea
                      value={activeState.sections[sec.id] ?? ''}
                      onChange={e => updateDelivSection(activeDef.id, sec.id, e.target.value)}
                      placeholder={sec.placeholder}
                      rows={activeState.mode === 'guided' ? 4 : 5}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#e2e8f0', lineHeight: 1.75, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', transition: 'border-color 150ms' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(20,123,88,0.35)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    />
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '13px 22px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#374151' }}>{Object.values(activeState.sections).join(' ').trim().split(/\s+/).filter(Boolean).length}w</span>
              <div style={{ flex: 1 }} />
              {!activeState.usedExample && (
                <button onClick={() => openDeliverable(activeDef.id, { prefillExample: true })} style={{ padding: '7px 13px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>Use Example</button>
              )}
              <button onClick={closeDeliverable} style={{ padding: '7px 13px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>Save Draft</button>
              <button onClick={() => submitForReview(activeDef.id)} style={{ padding: '7px 18px', borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', background: 'rgba(20,123,88,0.14)', border: '1px solid rgba(20,123,88,0.32)', color: '#34d399' }}>
                {activeState.attemptCount > 0 ? 'Resubmit →' : 'Submit for Review →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STAKEHOLDER DETAIL MODAL ══ */}
      {detailChar && (() => {
        const recentMsgs = messages
          .filter(m => (m.from === detailChar.id || m.to === detailChar.id))
          .sort((a, b) => +b.timestamp - +a.timestamp)
          .slice(0, 3);
        return (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
            onClick={() => setDetailChar(null)}
          >
            <div
              style={{ width: 420, maxWidth: '90vw', background: '#13131a', border: `1px solid ${detailChar.color}40`, borderRadius: 16, boxShadow: `0 0 60px ${detailChar.color}14, 0 28px 56px rgba(0,0,0,0.85)`, overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${detailChar.color}, transparent)` }} />
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 16 }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={detailChar.avatar} alt={detailChar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: detailChar.online ? '#22c55e' : '#6b7280', border: '2px solid #13131a' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{detailChar.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{detailChar.title}</div>
                  </div>
                  <button onClick={() => setDetailChar(null)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, width: 28, height: 28, cursor: 'pointer', color: '#9ca3af', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                </div>
                <div style={{ display: 'flex', gap: 9, marginBottom: 13 }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Trust</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round(detailChar.trust * 100)}%`, height: '100%', background: TRUST_COLOR(detailChar.trust), borderRadius: 3, transition: 'width 600ms' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: TRUST_COLOR(detailChar.trust), flexShrink: 0 }}>{Math.round(detailChar.trust * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Mood</div>
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize', color: EMOTION_COLORS[detailChar.emotion] ?? '#9ca3af' }}>{detailChar.emotion}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 13 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Personality</div>
                  <p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>{detailChar.personality}</p>
                </div>
                <div style={{ background: `${detailChar.color}0a`, border: `1px solid ${detailChar.color}22`, borderRadius: 9, padding: '11px 13px', marginBottom: 13 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: detailChar.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Visible Agenda</div>
                  <p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>{detailChar.visibleAgenda}</p>
                </div>
                {STAKEHOLDER_HINTS[detailChar.id] && (
                  <div style={{ marginBottom: recentMsgs.length > 0 ? 13 : 0, padding: '10px 13px',
                    borderRadius: 9, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase',
                      letterSpacing: '0.07em', marginBottom: 5 }}>What to Uncover</div>
                    <p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65, margin: 0,
                      fontStyle: 'italic' }}>{STAKEHOLDER_HINTS[detailChar.id]}</p>
                  </div>
                )}
                {recentMsgs.length > 0 && (
                  <div style={{ marginTop: 13 }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Recent Messages</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {recentMsgs.map(msg => (
                        <div key={msg.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '8px 11px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: msg.from === 'user' ? '#9ca3af' : detailChar.color }}>{msg.from === 'user' ? 'You' : detailChar.name}</span>
                            <span style={{ fontSize: 10, color: '#374151' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.45, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ── BROWSER SCREEN ─────────────────────────────────────────────────────────── */
export function BrowserScreen() {
  const { activeBrowserTab, setActiveBrowserTab, session, tickSession, messages, pauseSession, resumeSession } = useAppStore();
  const [localTab, setLocalTab] = useState<BrowserTab>(activeBrowserTab ?? 'overview');

  // Session timer
  useEffect(() => {
    if (!session || session.status !== 'active') return;
    const id = setInterval(() => tickSession(), 1000);
    return () => clearInterval(id);
  }, [session?.status]);

  // Live unread counts
  const emailUnread = React.useMemo(() =>
    messages.filter(m => m.channel === 'email' && m.from !== 'user' && !m.read).length,
    [messages]
  );
  const chatUnread = React.useMemo(() =>
    messages.filter(m => m.channel === 'chat' && m.from !== 'user' && !m.read).length,
    [messages]
  );

  const active = TAB_CONFIG.find(t => t.id === localTab) ?? TAB_CONFIG[0];

  const changeTab = (id: BrowserTab) => {
    setLocalTab(id);
    setActiveBrowserTab(id);
  };

  return (
    <AppWindow
      screenKey="browser"
      url={active.url}
      urlAccent="rgba(20,123,88,0.6)"
      label="Workspace"
      accentColor="#147b58"
      maxWidth={1280}
    >
        {/* Tab bar */}
        <div className="browser-tab-bar" style={{
          display: 'flex', alignItems: 'stretch',
          background: 'transparent',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: '0 14px', gap: 2, flexShrink: 0,
          overflowX: 'auto',
        }}>
          {TAB_CONFIG.map(tab => {
            const isActive = localTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 14px', cursor: 'pointer',
                  background: isActive ? 'var(--bg-window)' : 'transparent',
                  borderLeft: 'none', borderRight: 'none',
                  borderBottom: isActive ? `2px solid ${tab.accentColor}` : '2px solid transparent',
                  borderTop: '2px solid transparent',
                  color: isActive ? '#efefef' : '#afa39f',
                  fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'color 150ms, background 150ms',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#efefef'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#afa39f'; }}
              >
                <span style={{ color: isActive ? tab.accentColor : 'inherit', display: 'flex' }}>
                  {tab.icon}
                </span>
                {tab.label}
                {tab.id === 'email' && emailUnread > 0 && (
                  <span style={{
                    fontSize: 9, background: '#ef4444', color: '#fff',
                    width: 15, height: 15, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  }}>{emailUnread}</span>
                )}
                {tab.id === 'chat' && chatUnread > 0 && (
                  <span style={{
                    fontSize: 9, background: '#34d399', color: '#000',
                    width: 15, height: 15, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  }}>{chatUnread}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Session status bar */}
        {session && (() => {
          const _steps = [
            { id: 'planning'  as SimulationStage, label: 'Build your strategy' },
            { id: 'execution' as SimulationStage, label: 'Solve the scenario'  },
            { id: 'reporting' as SimulationStage, label: 'Review your results' },
          ];
          const _order: Record<SimulationStage, number> = { planning: 0, execution: 1, reporting: 2 };
          const _stage   = session.simulationStage ?? 'planning';
          const _cur     = _order[_stage];
          const isPaused = session.status === 'paused';
          const isChaos  = session.chaosMode === 'chaos';
          const dotColor = isPaused ? '#fbbf24' : isChaos ? '#ef4444' : '#22c55e';
          const lblColor = isPaused ? '#fde68a' : isChaos ? '#f87171' : '#4ade80';
          const statusLabel = isPaused ? 'Paused' : isChaos ? 'Chaos' : session.chaosResolving ? 'Resolving' : 'Active';
          const hintText = _stage === 'planning'
            ? 'Complete all 7 deliverables · each must score ≥ 80 · submit plan · overall ≥ 80 to unlock Execution'
            : _stage === 'execution'
            ? 'Complete OKRs · respond to stakeholders · manage chaos events to unlock Report'
            : 'Review results · download your final brief';
          return (
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '0 18px', height: 38, flexShrink: 0,
              background: isPaused ? 'rgba(251,191,36,0.04)' : isChaos ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.03)',
              borderBottom: `1px solid ${isPaused ? 'rgba(251,191,36,0.12)' : isChaos ? 'rgba(239,68,68,0.14)' : 'rgba(34,197,94,0.08)'}`,
            }}>
              {/* Left: status dot + label + timer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingRight: 16, borderRight: '1px solid rgba(255,255,255,0.06)', marginRight: 16, flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}90`, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: lblColor, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{statusLabel}</span>
                <span style={{ fontSize: 10.5, color: '#6b7280', fontFamily: 'monospace' }}>{formatElapsed(session.elapsedSeconds)}</span>
              </div>
              {/* Centre: inline stage steps */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {_steps.map((step, i) => {
                  const isDone   = _order[step.id] < _cur;
                  const isActive = step.id === _stage;
                  const isFuture = _order[step.id] > _cur;
                  return (
                    <React.Fragment key={step.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: isActive ? '#22c55e' : isDone ? '#22c55e' : 'rgba(255,255,255,0.12)', boxShadow: isActive ? '0 0 5px rgba(34,197,94,0.55)' : 'none' }} />
                        <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? '#e2e8f0' : isFuture ? '#3f3f46' : '#6b7280', whiteSpace: 'nowrap' }}>{step.label}</span>
                      </div>
                      {i < 2 && <div style={{ width: 36, height: 1, background: isDone ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)', margin: '0 10px', flexShrink: 0 }} />}
                    </React.Fragment>
                  );
                })}
              </div>
              <div style={{ flex: 1 }} />
              {/* Right: hint text */}
              <span style={{ fontSize: 10, color: 'rgba(175,163,159,0.42)', flexShrink: 0, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.06)', marginLeft: 16 }}>
                {hintText}
              </span>
              {/* Far right: session info + pause button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14, marginLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: '#4b5563' }}>Session {session.sessionNumber ?? 1} of 3</span>
                <span style={{ fontSize: 10, color: '#3f3f46' }}>·</span>
                <span style={{ fontSize: 10, color: '#4b5563' }}>{session.credits ?? 0} credits</span>
                {session.status !== 'completed' && (
                  <button
                    onClick={session.status === 'paused' ? resumeSession : pauseSession}
                    style={{ padding: '2px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: 'pointer', background: isPaused ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPaused ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, color: isPaused ? '#4ade80' : '#6b7280' }}
                  >
                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {localTab === 'overview'  && <MissionControlTab />}
          {localTab === 'email'     && <EmailTab />}
          {localTab === 'chat'      && <ChatTab />}
          {localTab === 'project'   && <ProjectTab />}
          {localTab === 'calendar'  && <CalendarTab />}
          {localTab === 'meetings'  && <MeetingsTab />}
          {localTab === 'assistant' && <NebulaAITab />}
        </div>
    </AppWindow>
  );
}
