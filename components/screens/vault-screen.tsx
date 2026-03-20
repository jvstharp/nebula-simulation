"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AppWindow } from "@/components/layout/app-window";
import { SectionHeader, cardStyle, cardHoverIn, cardHoverOut } from "@/components/layout/discovery-ui";

/* ── Icons ──────────────────────────────────────────────────────────────────── */
function FolderIcon({ color = '#fbbf24', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M3 8a2 2 0 012-2h6l2 2h10a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
        fill={`${color}22`} stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

function FileIcon({ color = '#60a5fa', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M6 3h10.5L22 8.5V25a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
        fill={`${color}18`} stroke={color} strokeWidth="1.3" />
      <path d="M16.5 3v5.5H22" stroke={color} strokeWidth="1.3" fill="none" />
      <path d="M9 14h10M9 17.5h7" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <path d="M9.5 9.5l3 3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3.5h12M1 7h12M1 10.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────────────────────────── */
type FileItem = {
  id: string;
  name: string;
  type: 'pdf' | 'fig' | 'xlsx' | 'docx' | 'pptx' | 'folder';
  size: string;
  modified: string;
  owner: string;
  shared: boolean;
  color: string;
};

const FILES: FileItem[] = [
  { id: '1', name: 'Roadmap Q3 2026', type: 'pdf', size: '2.4 MB', modified: 'Today, 9:41 AM', owner: 'You', shared: true, color: '#f87171' },
  { id: '2', name: 'Sprint 3 Board', type: 'fig', size: '8.1 MB', modified: 'Today, 8:15 AM', owner: 'Priya Sharma', shared: true, color: '#a78bfa' },
  { id: '3', name: 'Eng Capacity Report', type: 'xlsx', size: '340 KB', modified: 'Yesterday', owner: 'Marcus Lee', shared: true, color: '#34d399' },
  { id: '4', name: 'Stakeholder Map', type: 'docx', size: '180 KB', modified: 'Yesterday', owner: 'You', shared: false, color: '#60a5fa' },
  { id: '5', name: 'Product Spec v2.4', type: 'pdf', size: '5.2 MB', modified: 'Mon, Mar 11', owner: 'You', shared: true, color: '#f87171' },
  { id: '6', name: 'Design Mockups v4', type: 'fig', size: '14.6 MB', modified: 'Mon, Mar 11', owner: 'Priya Sharma', shared: true, color: '#a78bfa' },
  { id: '7', name: 'Q3 Exec Briefing', type: 'pptx', size: '3.8 MB', modified: 'Sun, Mar 10', owner: 'You', shared: false, color: '#fb923c' },
  { id: '8', name: 'Meeting Notes — Standup', type: 'docx', size: '95 KB', modified: 'Sun, Mar 10', owner: 'Sarah Chen', shared: true, color: '#60a5fa' },
  { id: '9', name: 'Team Charter', type: 'pdf', size: '420 KB', modified: 'Fri, Mar 7', owner: 'Elena Rodriguez', shared: true, color: '#f87171' },
  { id: '10', name: 'User Research Synthesis', type: 'pdf', size: '1.1 MB', modified: 'Thu, Mar 6', owner: 'Priya Sharma', shared: true, color: '#f87171' },
  { id: '11', name: 'Engineering Runbook', type: 'docx', size: '660 KB', modified: 'Wed, Mar 5', owner: 'Marcus Lee', shared: false, color: '#60a5fa' },
  { id: '12', name: 'Competitive Analysis', type: 'xlsx', size: '510 KB', modified: 'Tue, Mar 4', owner: 'You', shared: false, color: '#34d399' },
];

const FOLDERS = [
  { name: 'My Drive', icon: <FolderIcon color="#fbbf24" size={16} /> },
  { name: 'Shared with me', icon: <FolderIcon color="#60a5fa" size={16} /> },
  { name: 'Recent', icon: null },
  { name: 'Starred', icon: null },
  { name: 'Trash', icon: null },
];

const TYPE_COLORS: Record<FileItem['type'], string> = {
  pdf: '#d44848', fig: '#bb76d6', xlsx: '#02ba67',
  docx: '#49a5de', pptx: '#db966b', folder: '#deaf49',
};

const OWNER_COLORS: Record<string, string> = {
  'You': '#60a5fa', 'Priya Sharma': '#fb923c',
  'Marcus Lee': '#f87171', 'Sarah Chen': '#34d399', 'Elena Rodriguez': '#a78bfa',
};

/* ── Vault Screen ───────────────────────────────────────────────────────────── */
export function VaultScreen() {
  const [activeFolder, setActiveFolder] = useState('My Drive');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = FILES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppWindow
      screenKey="vault"
      url={`vault.company.io / ${activeFolder}`}
      urlAccent="rgba(45,212,191,0.5)"
      label="Vault"
      accentColor="#2dd4bf"
      maxWidth={1200}
    >
        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left nav */}
          <div style={{
            width: 180, flexShrink: 0,
            background: 'rgba(255,255,255,0.02)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', padding: '16px 0',
          }}>
            {/* New file button */}
            <div style={{ padding: '0 14px 14px' }}>
              <button style={{
                width: '100%', padding: '8px 12px',
                background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.25)',
                borderRadius: 8, fontSize: 12.5, color: '#2dd4bf', cursor: 'pointer',
                fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New File
              </button>
            </div>

            {/* Folder nav */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {FOLDERS.map(f => (
                <button
                  key={f.name}
                  onClick={() => setActiveFolder(f.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 14px', fontSize: 12.5,
                    color: activeFolder === f.name ? '#fff' : 'rgba(255,255,255,0.45)',
                    background: activeFolder === f.name ? 'rgba(45,212,191,0.1)' : 'transparent',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    fontWeight: activeFolder === f.name ? 600 : 400,
                    borderLeft: activeFolder === f.name ? '2px solid #2dd4bf' : '2px solid transparent',
                  }}
                >
                  {f.icon ?? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 5.5a1 1 0 011-1h3l1 1h4a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                    </svg>
                  )}
                  {f.name}
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Storage indicator */}
            <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Storage</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: '38%', height: '100%', background: 'linear-gradient(90deg, #2dd4bf, #60a5fa)', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>3.8 GB of 10 GB used</div>
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.055)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '6px 12px', flex: 1, maxWidth: 320,
              }}>
                <SearchIcon />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search files…"
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 12.5, color: '#fff', flex: 1,
                  }}
                />
              </div>
              <div style={{ flex: 1 }} />
              {/* View toggle */}
              <div style={{ display: 'flex', gap: 4 }}>
                {(['grid', 'list'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      width: 30, height: 30, borderRadius: 7, cursor: 'pointer',
                      background: view === v ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)',
                      border: view === v ? '1px solid rgba(45,212,191,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      color: view === v ? '#2dd4bf' : 'rgba(255,255,255,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {v === 'grid' ? <GridIcon /> : <ListIcon />}
                  </button>
                ))}
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              }}>
                <UploadIcon /> Upload
              </button>
            </div>

            {/* Files */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 32px' }}>
              <SectionHeader title={activeFolder} />
              {view === 'grid' ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 12,
                }}>
                  {filtered.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedId(file.id === selectedId ? null : file.id)}
                      style={{
                        ...cardStyle,
                        padding: '14px 12px',
                        background: selectedId === file.id ? `${TYPE_COLORS[file.type]}18` : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${selectedId === file.id ? `${TYPE_COLORS[file.type]}44` : 'rgba(255,255,255,0.06)'}`,
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
                      }}
                      onMouseEnter={e => { if (selectedId !== file.id) cardHoverIn(e.currentTarget); }}
                      onMouseLeave={e => { if (selectedId !== file.id) cardHoverOut(e.currentTarget); }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <FileIcon color={TYPE_COLORS[file.type]} size={32} />
                        <span style={{
                          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                          color: '#000000',
                          background: TYPE_COLORS[file.type],
                          padding: '2px 6px', borderRadius: 5, letterSpacing: '0.05em',
                        }}>
                          {file.type}
                        </span>
                      </div>
                      <div>
                        <div style={{
                          fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
                          lineHeight: 1.4, marginBottom: 3,
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{file.modified}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: OWNER_COLORS[file.owner] ?? '#6b7280',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, fontWeight: 700, color: '#000',
                        }}>
                          {file.owner.charAt(0)}
                        </div>
                        {file.shared && (
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <circle cx="2" cy="5.5" r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="9" cy="2" r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="9" cy="9" r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <path d="M3.5 5L7.5 2.5M3.5 6L7.5 8.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.9" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List view */
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
                      {['Name', 'Type', 'Size', 'Modified', 'Owner'].map(h => (
                        <th key={h} style={{
                          padding: '8px 10px', textAlign: 'left',
                          fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(file => (
                      <tr
                        key={file.id}
                        onClick={() => setSelectedId(file.id === selectedId ? null : file.id)}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.055)',
                          background: selectedId === file.id ? `${TYPE_COLORS[file.type]}14` : 'transparent',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (selectedId !== file.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if (selectedId !== file.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <FileIcon color={TYPE_COLORS[file.type]} size={22} />
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{file.name}</span>
                        </td>
                        <td style={{ padding: '10px 10px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                            color: '#000000', background: TYPE_COLORS[file.type],
                            padding: '2px 6px', borderRadius: 5,
                          }}>{file.type}</span>
                        </td>
                        <td style={{ padding: '10px 10px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{file.size}</td>
                        <td style={{ padding: '10px 10px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{file.modified}</td>
                        <td style={{ padding: '10px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: OWNER_COLORS[file.owner] ?? '#6b7280',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 9, fontWeight: 700, color: '#000',
                            }}>
                              {file.owner.charAt(0)}
                            </div>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{file.owner}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
    </AppWindow>
  );
}
