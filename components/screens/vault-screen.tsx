"use client";
import { useState, useRef, useEffect } from "react";
import { AppWindow } from "@/components/layout/app-window";
import { SectionHeader, cardStyle, cardHoverIn, cardHoverOut } from "@/components/layout/discovery-ui";
import { useAppStore } from "@/lib/store";

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
  { id: '1',  name: 'Roadmap Q3 2026',          type: 'pdf',  size: '2.4 MB',  modified: 'Today, 9:41 AM',  owner: 'You',             shared: true,  color: '#f87171' },
  { id: '2',  name: 'Sprint 3 Board',            type: 'fig',  size: '8.1 MB',  modified: 'Today, 8:15 AM',  owner: 'Priya Sharma',    shared: true,  color: '#a78bfa' },
  { id: '3',  name: 'Eng Capacity Report',       type: 'xlsx', size: '340 KB',  modified: 'Yesterday',       owner: 'Marcus Lee',      shared: true,  color: '#34d399' },
  { id: '4',  name: 'Stakeholder Map',           type: 'docx', size: '180 KB',  modified: 'Yesterday',       owner: 'You',             shared: false, color: '#60a5fa' },
  { id: '5',  name: 'Product Spec v2.4',         type: 'pdf',  size: '5.2 MB',  modified: 'Mon, Mar 11',     owner: 'You',             shared: true,  color: '#f87171' },
  { id: '6',  name: 'Design Mockups v4',         type: 'fig',  size: '14.6 MB', modified: 'Mon, Mar 11',     owner: 'Priya Sharma',    shared: true,  color: '#a78bfa' },
  { id: '7',  name: 'Q3 Exec Briefing',          type: 'pptx', size: '3.8 MB',  modified: 'Sun, Mar 10',     owner: 'You',             shared: false, color: '#fb923c' },
  { id: '8',  name: 'Meeting Notes — Standup',   type: 'docx', size: '95 KB',   modified: 'Sun, Mar 10',     owner: 'Sarah Chen',      shared: true,  color: '#60a5fa' },
  { id: '9',  name: 'Team Charter',              type: 'pdf',  size: '420 KB',  modified: 'Fri, Mar 7',      owner: 'Elena Rodriguez', shared: true,  color: '#f87171' },
  { id: '10', name: 'User Research Synthesis',   type: 'pdf',  size: '1.1 MB',  modified: 'Thu, Mar 6',      owner: 'Priya Sharma',    shared: true,  color: '#f87171' },
  { id: '11', name: 'Engineering Runbook',       type: 'docx', size: '660 KB',  modified: 'Wed, Mar 5',      owner: 'Marcus Lee',      shared: false, color: '#60a5fa' },
  { id: '12', name: 'Competitive Analysis',      type: 'xlsx', size: '510 KB',  modified: 'Tue, Mar 4',      owner: 'You',             shared: false, color: '#34d399' },
];

const FOLDERS = [
  { name: 'My Drive',      icon: <FolderIcon color="#fbbf24" size={16} /> },
  { name: 'Shared with me', icon: <FolderIcon color="#60a5fa" size={16} /> },
  { name: 'Recent',        icon: null },
  { name: 'Starred',       icon: null },
  { name: 'Trash',         icon: null },
];

const TYPE_COLORS: Record<FileItem['type'], string> = {
  pdf: '#d44848', fig: '#bb76d6', xlsx: '#02ba67',
  docx: '#49a5de', pptx: '#db966b', folder: '#deaf49',
};

const OWNER_COLORS: Record<string, string> = {
  'You': '#60a5fa', 'Priya Sharma': '#fb923c',
  'Marcus Lee': '#f87171', 'Sarah Chen': '#34d399', 'Elena Rodriguez': '#a78bfa',
};

/* ══════════════════════════════════════════════════════════════════════════════
   DocViewer — floating pop-out document viewer / editor
══════════════════════════════════════════════════════════════════════════════ */

type ViewerMode = 'normal' | 'minimized' | 'expanded';
type DocBlock = { t: 'h2' | 'h3' | 'p'; text: string } | { t: 'ul'; items: string[] };

/* ── Mock document content ─────────────────────────────────────────────────── */

const DOCX_BLOCKS: Record<string, DocBlock[]> = {
  'Stakeholder Map': [
    { t: 'h2', text: 'Stakeholder Map — Alpha Launch' },
    { t: 'p',  text: 'Last updated: Mar 11, 2026  ·  Owner: You  ·  Status: In Review' },
    { t: 'h3', text: 'Primary Stakeholders' },
    { t: 'ul', items: [
      'Rachel Kim (CTO) — Executive sponsor, high influence, supportive',
      'Marcus Lee (Eng Lead) — High influence, neutral on timeline',
      'Priya Sharma (Design) — Medium influence, aligned on vision',
      'Tom Hart (Legal) — Medium influence, cautious on data handling',
    ]},
    { t: 'h3', text: 'Secondary Stakeholders' },
    { t: 'ul', items: [
      'Finance — budget approval for Q3 tooling spend',
      'Customer Success — early adopter feedback loop',
      'Security — sign-off on OAuth integration',
    ]},
    { t: 'h3', text: 'Key Action Items' },
    { t: 'ul', items: [
      'Weekly sync with Rachel — Fridays 2 pm',
      'Align Marcus on Q3 scope freeze by Apr 7',
      'Legal sign-off on data handling spec — deadline Apr 14',
      'CS pilot group confirmation by end of Q2',
    ]},
  ],
  'Meeting Notes — Standup': [
    { t: 'h2', text: 'Standup Notes — 21 Mar 2026' },
    { t: 'p',  text: 'Attendees: Sarah Chen, Marcus Lee, Priya Sharma, You  ·  Duration: 15 min' },
    { t: 'h3', text: 'Updates' },
    { t: 'ul', items: [
      'Marcus: Auth service refactor 80% done — on track for Thu deploy',
      'Priya: Onboarding mocks delivered to dev, awaiting review',
      'Sarah: Stakeholder review scheduled for Fri 2 pm',
      'You: Scope doc v2 shared with team; awaiting Legal sign-off',
    ]},
    { t: 'h3', text: 'Blockers' },
    { t: 'ul', items: [
      "API schema change needs Tom's sign-off before Marcus can proceed",
      'QA environment still down — Marcus to chase DevOps',
    ]},
    { t: 'h3', text: 'Action Items' },
    { t: 'ul', items: [
      '[ ] You — Chase Tom for API schema approval by EOD today',
      '[ ] Sarah — Send Friday agenda to exec team by Wed noon',
      '[ ] Marcus — Escalate QA env if not resolved by 3 pm',
    ]},
  ],
  'Engineering Runbook': [
    { t: 'h2', text: 'Engineering Runbook — Platform Services v2.1' },
    { t: 'p',  text: 'Maintained by: Marcus Lee  ·  Last updated: Mar 5, 2026  ·  Audience: On-call engineers' },
    { t: 'h3', text: 'Incident Severity Levels' },
    { t: 'ul', items: [
      'P0 — Full outage: page entire team immediately, open war room',
      'P1 — Degraded core functionality: page on-call, post status update',
      'P2 — Non-critical degradation: create ticket, address next business day',
      'P3 — Minor issue: log in backlog, weekly review',
    ]},
    { t: 'h3', text: 'Common Runbook Procedures' },
    { t: 'ul', items: [
      'Auth latency spike → restart auth-service pod, scale to 3 replicas',
      'DB pool exhaustion → increase pool size to 50, alert DBA on-call',
      'CDN miss rate >20% → invalidate cache, check origin health',
      'Webhook failures → check queue depth, restart worker if >1 000 pending',
    ]},
    { t: 'h3', text: 'Escalation Path' },
    { t: 'ul', items: [
      'Level 1 — On-call engineer (PagerDuty)',
      'Level 2 — Engineering Manager: Marcus Lee',
      'Level 3 — CTO: Rachel Kim',
    ]},
  ],
};

const XLSX_DATA: Record<string, { headers: string[]; rows: string[][] }> = {
  'Eng Capacity Report': {
    headers: ['Engineer', 'Team', 'Sprint Cap', 'Allocated', 'Available', 'Status'],
    rows: [
      ['Marcus Lee',    'Platform', '10', '9',  '1', 'Nearly Full'],
      ['Aiden Park',    'Platform', '10', '7',  '3', 'Available'],
      ['Yuki Tanaka',   'Frontend', '8',  '8',  '0', 'Full'],
      ['Emma Clarke',   'Frontend', '10', '5',  '5', 'Available'],
      ['Ravi Patel',    'Infra',    '10', '10', '0', 'Full'],
      ['Claudia Mora',  'QA',       '10', '6',  '4', 'Available'],
      ['James Obi',     'Data',     '8',  '7',  '1', 'Nearly Full'],
      ['Sophie Lam',    'iOS',      '10', '9',  '1', 'Nearly Full'],
      ['Luca Bianchi',  'Android',  '10', '4',  '6', 'Available'],
      ['Diane Fowler',  'Backend',  '10', '10', '0', 'Full'],
    ],
  },
  'Competitive Analysis': {
    headers: ['Company', 'Segment', 'Pricing', 'AI Features', 'Enterprise', 'Rating'],
    rows: [
      ['Rival One',    'SMB',        '$49/mo',  'Basic',    'No',      '3.8 ★'],
      ['Rival Two',    'Enterprise', '$200/mo', 'Advanced', 'Yes',     '4.2 ★'],
      ['Rival Three',  'Mid-market', '$99/mo',  'Moderate', 'Limited', '4.0 ★'],
      ['Nebula (Us)',  'All',        '$79/mo',  'Advanced', 'Yes',     '4.7 ★'],
      ['Newcomer A',   'SMB',        '$29/mo',  'None',     'No',      '3.2 ★'],
      ['Newcomer B',   'Enterprise', 'Custom',  'Advanced', 'Yes',     '4.4 ★'],
    ],
  },
};

const PPTX_SLIDES: Record<string, Array<{ title: string; bullets: string[] }>> = {
  'Q3 Exec Briefing': [
    { title: 'Q3 2026 — Executive Briefing', bullets: ['Prepared by: Product & Strategy', 'Date: March 21, 2026', 'Confidential — Internal Only'] },
    { title: 'Q3 Priorities', bullets: ['1. Launch Alpha to 50 design-partner customers', '2. Complete auth service migration', '3. Hire 2 senior engineers (Infra & iOS)', '4. Establish data platform foundation'] },
    { title: 'Progress Against OKRs', bullets: ['Activation rate: 64% → target 75% ↑ in progress', 'NPS score: 42 → target 50 ↑ improving', 'ARR: $2.1 M → target $2.8 M ↑ on track', 'Eng velocity: 82 pts/sprint → target 90 ↑ improving'] },
    { title: 'Risks & Mitigations', bullets: ['Risk: Legal delay → fast-track review with Tom', 'Risk: Eng capacity gap → contractor backfill for Q3', 'Risk: Competitor pricing → differentiate on AI features'] },
    { title: 'Ask & Next Steps', bullets: ['Approve Q3 headcount budget by Apr 7', 'Greenlight Alpha launch date of May 1', 'Sponsor exec comms plan for customers'] },
  ],
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function renderDocBlocks(blocks: DocBlock[]) {
  return blocks.map((block, i) => {
    if (block.t === 'h2') return (
      <div key={i} style={{ fontSize: 17, fontWeight: 700, color: '#f0f0f3', marginBottom: 6, marginTop: i > 0 ? 28 : 0 }}>
        {block.text}
      </div>
    );
    if (block.t === 'h3') return (
      <div key={i} style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginTop: 22, marginBottom: 8 }}>
        {block.text}
      </div>
    );
    if (block.t === 'p') return (
      <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: '0 0 10px' }}>
        {block.text}
      </p>
    );
    if (block.t === 'ul') return (
      <ul key={i} style={{ paddingLeft: 18, margin: '0 0 12px' }}>
        {block.items.map((item, ii) => (
          <li key={ii} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 2 }}>
            {item}
          </li>
        ))}
      </ul>
    );
    return null;
  });
}

/* ── Body components ────────────────────────────────────────────────────────── */

function PdfBody({ file, page }: { file: FileItem; page: number }) {
  const totalPages = 7;
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Thumbnails */}
      <div style={{
        width: 78, borderRight: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto', padding: '10px 6px', gap: 8,
        background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
      }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <div key={n} style={{
            width: 64, aspectRatio: '0.707', flexShrink: 0,
            background: n === page ? 'rgba(212,72,72,0.1)' : 'rgba(255,255,255,0.03)',
            border: n === page ? '1.5px solid #d44848' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 3, padding: '6px 5px',
            display: 'flex', flexDirection: 'column', gap: 2.5, cursor: 'pointer',
          }}>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.22)', borderRadius: 1 }} />
            {[72, 82, 55, 76, 62, 80, 68, 58].map((w, j) => (
              <div key={j} style={{ height: 2.5, background: 'rgba(255,255,255,0.08)', borderRadius: 1, width: `${w}%` }} />
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', textAlign: 'center' as const }}>{n}</span>
          </div>
        ))}
      </div>

      {/* Page canvas */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{
          width: '100%', maxWidth: 460,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 4, padding: '40px 44px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f3', marginBottom: 6 }}>{file.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {file.owner} · {file.modified} · {file.size}
          </div>
          {[
            { heading: 'Executive Summary', lines: [90, 82, 75, 88, 70, 85, 78] },
            { heading: page > 1 ? `Section ${page}` : 'Key Findings', lines: [82, 78, 92, 68, 85, 72, 80, 65, 88] },
            { heading: 'Recommendations', lines: [70, 85, 78, 90, 65] },
          ].map((sec, si) => (
            <div key={si} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#f87171', marginBottom: 10 }}>{sec.heading}</div>
              {sec.lines.map((w, li) => (
                <div key={li} style={{ height: 7, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 5.5, width: `${w}%` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocxBody({ file, isNew }: { file: FileItem | null; isNew: boolean }) {
  const blocks = file
    ? (DOCX_BLOCKS[file.name] ?? [
        { t: 'h2' as const, text: file.name },
        { t: 'p'  as const, text: `Owner: ${file.owner}  ·  Modified: ${file.modified}` },
        { t: 'p'  as const, text: 'Document content goes here. Start editing to add your text.' },
      ])
    : [];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{
        maxWidth: 520, margin: '0 auto',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 4, padding: '44px 52px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.32)', minHeight: 360,
      }}>
        {isNew ? (
          <>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>
              New Document · Untitled · Unsaved
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.8, minHeight: 280,
              }}
            >
              <br />
            </div>
          </>
        ) : (
          <div style={{ userSelect: 'text' }}>
            {renderDocBlocks(blocks)}
          </div>
        )}
      </div>
    </div>
  );
}

function XlsxBody({ file }: { file: FileItem }) {
  const [activeCell, setActiveCell] = useState('A1');
  const data = XLSX_DATA[file.name];
  const fallback = {
    headers: ['Name', 'Value', 'Category', 'Status', 'Owner', 'Date'],
    rows: Array.from({ length: 8 }, (_, i) => [
      `Item ${i + 1}`, `${(i + 1) * 142}`, 'Category A', 'Active', 'You', 'Mar 2026',
    ]),
  };
  const { headers, rows } = data ?? fallback;
  const cols = 'ABCDEFGHIJ'.slice(0, headers.length);

  const statusColor = (s: string) => {
    if (s === 'Full')        return '#d44848';
    if (s === 'Nearly Full') return '#deaf49';
    if (s === 'Available')   return '#02ba67';
    return 'rgba(255,255,255,0.5)';
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed' as const, minWidth: '100%' }}>
        <thead>
          {/* Column letter row */}
          <tr>
            <th style={{ width: 36, height: 26, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
            {Array.from(cols).map(c => (
              <th key={c} style={{
                height: 26, padding: '0 10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textAlign: 'center' as const,
              }}>{c}</th>
            ))}
          </tr>
          {/* Header data row */}
          <tr>
            <td style={{ background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} />
            {headers.map((h, hi) => (
              <td key={hi} style={{
                height: 30, padding: '4px 10px',
                background: 'rgba(45,212,191,0.07)', border: '1px solid rgba(255,255,255,0.07)',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
              }}>{h}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td style={{
                textAlign: 'center' as const, fontSize: 10, color: 'rgba(255,255,255,0.22)',
                background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.04)', height: 28, width: 36,
              }}>{ri + 1}</td>
              {row.map((cell, ci) => {
                const cellId = `${Array.from(cols)[ci]}${ri + 1}`;
                const isStatus = headers[ci] === 'Status';
                const isActive = activeCell === cellId;
                return (
                  <td key={ci}
                    onClick={() => setActiveCell(cellId)}
                    style={{
                      height: 28, padding: '4px 10px',
                      background: isActive ? 'rgba(45,212,191,0.1)' : 'transparent',
                      border: isActive ? '1.5px solid rgba(45,212,191,0.5)' : '1px solid rgba(255,255,255,0.05)',
                      fontSize: 12, cursor: 'cell',
                      color: isStatus ? statusColor(cell) : 'rgba(255,255,255,0.65)',
                      fontWeight: isStatus ? 600 : 400,
                    }}
                  >{cell}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PptxBody({ file, slide }: { file: FileItem; slide: number }) {
  const slides = PPTX_SLIDES[file.name] ?? [
    { title: file.name, bullets: [`Prepared by: ${file.owner}`, file.modified, `${file.size} · PPTX`] },
    { title: 'Agenda', bullets: ['Introduction & Context', 'Key Findings', 'Recommendations', 'Next Steps'] },
    { title: 'Key Points', bullets: ['Point 1 — Analysis of current state', 'Point 2 — Gap assessment', 'Point 3 — Proposed direction', 'Point 4 — Timeline and resources'] },
    { title: 'Next Steps', bullets: ['[ ] Review with stakeholders', '[ ] Approve budget allocation', '[ ] Assign owners & milestones'] },
  ];
  const current = slides[Math.min(slide - 1, slides.length - 1)];

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Slide panel */}
      <div style={{
        width: 110, borderRight: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto', padding: '10px 8px',
        background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {slides.map((s, i) => (
          <div key={i} style={{
            aspectRatio: '16/9', width: '100%', flexShrink: 0,
            background: slide - 1 === i ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.04)',
            border: slide - 1 === i ? '1.5px solid #fb923c' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '6px 7px', cursor: 'pointer',
          }}>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.28)', borderRadius: 1, marginBottom: 4, width: '80%' }} />
            {[65, 55, 60].map((w, j) => (
              <div key={j} style={{ height: 2.5, background: 'rgba(255,255,255,0.1)', borderRadius: 1, marginBottom: 2.5, width: `${w}%` }} />
            ))}
            <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{i + 1}</div>
          </div>
        ))}
      </div>

      {/* Slide canvas */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{
          width: '100%', maxWidth: 520, aspectRatio: '16/9',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '36px 44px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.55)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            {slide} / {slides.length}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f3', marginBottom: 20, lineHeight: 1.3 }}>
            {current.title}
          </div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {current.bullets.map((b, bi) => (
              <li key={bi} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 2 }}>{b}</li>
            ))}
          </ul>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
            background: 'linear-gradient(90deg, #fb923c, #f59e0b)',
            borderRadius: '0 0 6px 6px',
          }} />
        </div>
      </div>
    </div>
  );
}

function FigBody({ file }: { file: FileItem }) {
  const layers = ['📱 Mobile Frame', '🖥 Desktop Frame', '🔲 Nav Component', '🔲 Hero Section', '🔲 Card Grid', '✦ Typography', '✦ Color Styles'];
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Layers panel */}
      <div style={{ width: 155, borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', padding: '10px 0', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.28)', padding: '0 12px 8px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>Layers</div>
        {layers.map((l, i) => (
          <div key={i} style={{
            padding: '5px 12px', fontSize: 11.5, cursor: 'pointer',
            color: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.55)',
            background: i === 0 ? 'rgba(167,139,250,0.1)' : 'transparent',
          }}>{l}</div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'relative', display: 'flex', gap: 36, alignItems: 'flex-start' }}>
          {/* Mobile frame */}
          <div style={{
            width: 120, height: 218, border: '2px solid #a78bfa', borderRadius: 18,
            background: 'rgba(167,139,250,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ height: 30, background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>
              <div style={{ height: 7, background: 'rgba(255,255,255,0.2)', borderRadius: 2, flex: 1 }} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              {[80, 60, 90, 70].map((w, i) => (
                <div key={i} style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 2, margin: '0 0 7px', width: `${w}%` }} />
              ))}
              <div style={{ height: 60, background: 'rgba(167,139,250,0.14)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.2)', marginTop: 8 }} />
            </div>
          </div>
          {/* Desktop frame */}
          <div style={{
            width: 210, height: 148, border: '2px solid #a78bfa', borderRadius: 8,
            background: 'rgba(167,139,250,0.04)', overflow: 'hidden',
          }}>
            <div style={{ height: 24, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {[40, 30, 25].map((w, i) => (
                  <div key={i} style={{ height: 6, background: 'rgba(255,255,255,0.18)', borderRadius: 2, width: w }} />
                ))}
              </div>
              {[90, 75, 85, 70, 60].map((w, i) => (
                <div key={i} style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 5, width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ViewerToolbar ───────────────────────────────────────────────────────────── */
function ViewerToolbar({ type, page, totalPages, onPageChange, zoom, onZoom }: {
  type: string; page: number; totalPages: number;
  onPageChange: (p: number) => void; zoom: number; onZoom: (z: number) => void;
}) {
  const btn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 5, color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
    fontSize: 11, fontWeight: 600, padding: '3px 8px', fontFamily: 'inherit',
  };
  const bar: React.CSSProperties = {
    height: 36, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', padding: '0 12px', gap: 4,
    background: 'rgba(255,255,255,0.02)',
  };
  const sep = <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />;

  if (type === 'pdf') return (
    <div style={bar}>
      <button style={btn} onClick={() => onPageChange(Math.max(1, page - 1))}>‹</button>
      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', padding: '0 6px' }}>
        Page <b style={{ color: '#fff' }}>{page}</b> / {totalPages}
      </span>
      <button style={btn} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>›</button>
      {sep}
      <button style={btn} onClick={() => onZoom(Math.max(50, zoom - 10))}>−</button>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', padding: '0 4px', minWidth: 36, textAlign: 'center' as const }}>{zoom}%</span>
      <button style={btn} onClick={() => onZoom(Math.min(200, zoom + 10))}>+</button>
      <div style={{ flex: 1 }} />
      <button style={{ ...btn, color: '#2dd4bf', borderColor: 'rgba(45,212,191,0.3)', background: 'rgba(45,212,191,0.08)' }}>↓ Export</button>
    </div>
  );

  if (type === 'xlsx') return (
    <div style={bar}>
      <div style={{ ...btn, minWidth: 46, textAlign: 'center' as const, cursor: 'default', padding: '3px 8px' }}>
        A1
      </div>
      {sep}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', paddingRight: 4 }}>fx</span>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, height: 24, padding: '0 10px', display: 'flex', alignItems: 'center', flex: 1, maxWidth: 260 }}>
        <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Value</span>
      </div>
      <div style={{ flex: 1 }} />
      {['B', 'I', 'U'].map(f => <button key={f} style={{ ...btn, width: 26, padding: 0, textAlign: 'center' as const }}>{f}</button>)}
      {sep}
      {['$', '%'].map(f => <button key={f} style={{ ...btn, width: 26, padding: 0, textAlign: 'center' as const }}>{f}</button>)}
    </div>
  );

  if (type === 'pptx') return (
    <div style={bar}>
      <button style={btn} onClick={() => onPageChange(Math.max(1, page - 1))}>‹</button>
      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', padding: '0 6px' }}>
        Slide <b style={{ color: '#fff' }}>{page}</b> / {totalPages}
      </span>
      <button style={btn} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>›</button>
      <div style={{ flex: 1 }} />
      <button style={{ ...btn, color: '#fb923c', borderColor: 'rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.08)' }}>▷ Present</button>
    </div>
  );

  if (type === 'fig') return (
    <div style={bar}>
      <button style={btn} onClick={() => onZoom(Math.max(25, zoom - 25))}>−</button>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', padding: '0 4px', minWidth: 40, textAlign: 'center' as const }}>{zoom}%</span>
      <button style={btn} onClick={() => onZoom(Math.min(200, zoom + 25))}>+</button>
      <div style={{ flex: 1 }} />
      <button style={{ ...btn, color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)' }}>▷ Preview</button>
    </div>
  );

  // docx / new
  return (
    <div style={bar}>
      {[
        { l: 'B', extra: { fontWeight: 800 } },
        { l: 'I', extra: { fontStyle: 'italic' as const } },
        { l: 'U', extra: {} },
      ].map(({ l, extra }) => (
        <button key={l} style={{ ...btn, width: 26, padding: 0, textAlign: 'center' as const, ...extra }}>{l}</button>
      ))}
      {sep}
      {['H1', 'H2'].map(f => <button key={f} style={{ ...btn, padding: '3px 6px' }}>{f}</button>)}
      {sep}
      {['≡', '1.'].map(f => <button key={f} style={{ ...btn, width: 28, padding: 0, textAlign: 'center' as const }}>{f}</button>)}
      {sep}
      {['⇤', '⇔', '⇥'].map(f => <button key={f} style={{ ...btn, width: 28, padding: 0, textAlign: 'center' as const }}>{f}</button>)}
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.22)', paddingRight: 4 }}>Saved 2 min ago</span>
    </div>
  );
}


/* ── DocViewer ───────────────────────────────────────────────────────────────── */
function DocViewer({ file, isNew, onClose }: {
  file: FileItem | null;
  isNew: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<ViewerMode>('normal');
  const [pos, setPos] = useState({ x: 56, y: 32 });
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const posRef = useRef({ x: 56, y: 32 });
  posRef.current = pos;

  const fileType: FileItem['type'] = isNew ? 'docx' : (file?.type ?? 'docx');
  const fileName  = isNew ? 'Untitled Document' : (file?.name ?? 'Document');
  const typeColor = TYPE_COLORS[fileType];

  const totalPages =
    fileType === 'pdf'  ? 7 :
    fileType === 'pptx' ? (PPTX_SLIDES[file?.name ?? '']?.length ?? 4) : 1;

  const onTitlebarDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (mode === 'expanded') return;
    const { x: px, y: py } = posRef.current;
    const sx = e.clientX, sy = e.clientY;
    const move = (ev: MouseEvent) =>
      setPos({ x: Math.max(0, px + ev.clientX - sx), y: Math.max(0, py + ev.clientY - sy) });
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    e.preventDefault();
  };

  const outerStyle: React.CSSProperties =
    mode === 'expanded'  ? { position: 'absolute', inset: 0,    zIndex: 50, borderRadius: 0 } :
    mode === 'minimized' ? { position: 'absolute', left: pos.x, top: pos.y, width: 340, zIndex: 50 } :
                           { position: 'absolute', left: pos.x, top: pos.y, width: 720, height: 520, zIndex: 50 };

  const trafficBtn = (bg: string, onClick: () => void, title: string) => (
    <button onClick={onClick} title={title} style={{
      width: 12, height: 12, borderRadius: '50%', background: bg,
      border: 'none', cursor: 'pointer', flexShrink: 0,
    }} />
  );

  const canEdit = fileType !== 'pdf' && fileType !== 'fig';

  return (
    <div style={{
      ...outerStyle,
      background: 'rgba(11,11,17,0.97)',
      backdropFilter: 'blur(40px) saturate(160%)',
      WebkitBackdropFilter: 'blur(40px) saturate(160%)',
      border: '1px solid rgba(255,255,255,0.11)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)',
      borderRadius: mode === 'expanded' ? 0 : 12,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ── Titlebar ── */}
      <div
        onMouseDown={onTitlebarDown}
        style={{
          height: 44, flexShrink: 0,
          background: 'rgba(255,255,255,0.025)',
          borderBottom: mode !== 'minimized' ? '1px solid rgba(255,255,255,0.07)' : 'none',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          cursor: mode === 'expanded' ? 'default' : 'grab',
          userSelect: 'none',
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {trafficBtn('#ff5f57', onClose, 'Close')}
          {trafficBtn('#febc2e', () => setMode(m => m === 'minimized' ? 'normal' : 'minimized'), mode === 'minimized' ? 'Restore' : 'Minimise')}
          {trafficBtn('#28c840', () => setMode(m => m === 'expanded' ? 'normal' : 'expanded'), mode === 'expanded' ? 'Restore' : 'Expand')}
        </div>

        <FileIcon color={typeColor} size={18} />

        <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fileName}
        </span>

        <span style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
          background: typeColor, color: '#000', padding: '2px 6px',
          borderRadius: 4, letterSpacing: '0.06em', flexShrink: 0,
        }}>{fileType}</span>

        {mode !== 'minimized' && (
          <div style={{ display: 'flex', gap: 6, marginLeft: 6, flexShrink: 0 }}>
            {canEdit && (
              <button style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.28)',
                color: '#2dd4bf', cursor: 'pointer', fontFamily: 'inherit',
              }}>Save</button>
            )}
            <button style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'inherit',
            }}>Share ↗</button>
          </div>
        )}
      </div>

      {/* ── Toolbar + Content ── */}
      {mode !== 'minimized' && (
        <>
          <ViewerToolbar
            type={fileType} page={page} totalPages={totalPages}
            onPageChange={setPage} zoom={zoom} onZoom={setZoom}
          />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {fileType === 'pdf'  && <PdfBody  file={file!} page={page} />}
            {fileType === 'xlsx' && <XlsxBody file={file!} />}
            {fileType === 'pptx' && <PptxBody file={file!} slide={page} />}
            {fileType === 'fig'  && <FigBody  file={file!} />}
            {(fileType === 'docx' || isNew) && <DocxBody file={file} isNew={isNew} />}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Vault Screen ───────────────────────────────────────────────────────────── */
const CHAR_COLORS: Record<string, string> = {
  marcus: '#60a5fa', priya: '#a78bfa', tom: '#34d399', sarah: '#f59e0b', elena: '#f87171',
};
const CHAR_DISPLAY: Record<string, string> = {
  marcus: 'Marcus Lee', priya: 'Priya Sharma', tom: 'Tom Hart', sarah: 'Sarah Chen', elena: 'Elena Rodriguez',
};

interface AiDoc {
  id: string; name: string; docType: string; characterId: string; status: string;
  content?: { sections?: Array<{ heading: string; content: string; table?: Array<Record<string,string>> | null }> };
  createdAt: string;
}

function AiDocViewer({ doc, onClose }: { doc: AiDoc; onClose: () => void }) {
  const sections = doc.content?.sections ?? [];
  const charColor = CHAR_COLORS[doc.characterId] ?? '#6b7280';
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,14,0.97)', zIndex: 200, display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${charColor}22`, border: `1px solid ${charColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
          {doc.docType === 'pdf' ? '📄' : doc.docType === 'xlsx' ? '📊' : '📝'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.6)' }}>Shared by {CHAR_DISPLAY[doc.characterId] ?? doc.characterId}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: charColor, background: `${charColor}18`, border: `1px solid ${charColor}30`, padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase' as const }}>{doc.docType}</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {sections.length === 0 && <p style={{ color: 'rgba(175,163,159,0.5)', fontSize: 13 }}>Document is being generated...</p>}
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{s.heading}</h3>
            {s.table ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>{Object.keys(s.table[0] ?? {}).map(col => (
                      <th key={col} style={{ padding: '6px 10px', textAlign: 'left', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{col}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {s.table.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {Object.values(row).map((val, vi) => (
                          <td key={vi} style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: 'rgba(175,163,159,0.85)', lineHeight: 1.75, margin: 0 }}>{s.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function VaultScreen() {
  const { dbSessionId } = useAppStore();
  const [activeFolder, setActiveFolder] = useState('My Drive');
  const [view, setView]       = useState<'grid' | 'list'>('grid');
  const [search, setSearch]   = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiDocs, setAiDocs] = useState<AiDoc[]>([]);
  const [selectedAiDoc, setSelectedAiDoc] = useState<AiDoc | null>(null);

  // Viewer state
  const [viewerFile, setViewerFile] = useState<FileItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isNewFile,  setIsNewFile]  = useState(false);

  // Fetch AI-generated docs for current session
  useEffect(() => {
    if (!dbSessionId) return;
    const fetchDocs = () => {
      fetch(`/api/documents?sessionId=${dbSessionId}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.documents) setAiDocs(data.documents); })
        .catch(() => {});
    };
    fetchDocs();
    // Poll every 15s in case new docs were generated during session
    const interval = setInterval(fetchDocs, 15000);
    return () => clearInterval(interval);
  }, [dbSessionId]);

  const openFile = (file: FileItem) => {
    setViewerFile(file);
    setIsNewFile(false);
    setViewerOpen(true);
  };
  const openNewFile = () => {
    setViewerFile(null);
    setIsNewFile(true);
    setViewerOpen(true);
  };
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerFile(null);
    setIsNewFile(false);
  };

  const filtered = FILES.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppWindow
      screenKey="vault"
      url={`vault.company.io / ${activeFolder}`}
      urlAccent="rgba(45,212,191,0.5)"
      label="Vault"
      accentColor="#2dd4bf"
      maxWidth={1200}
    >
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left nav */}
        <div style={{
          width: 180, flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', padding: '16px 0',
        }}>
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={openNewFile}
              style={{
                width: '100%', padding: '8px 12px',
                background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.25)',
                borderRadius: 8, fontSize: 12.5, color: '#2dd4bf', cursor: 'pointer',
                fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New File
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FOLDERS.map(f => (
              <button
                key={f.name}
                onClick={() => setActiveFolder(f.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', fontSize: 12.5, fontFamily: 'inherit',
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

          <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Storage</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: '38%', height: '100%', background: 'linear-gradient(90deg, #2dd4bf, #60a5fa)', borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>3.8 GB of 10 GB used</div>
          </div>
        </div>

        {/* Main content — position: relative so DocViewer can float inside it */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {/* Toolbar */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.055)',
            display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          }}>
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
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12.5, color: '#fff', flex: 1 }}
              />
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 4 }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  width: 30, height: 30, borderRadius: 7, cursor: 'pointer',
                  background: view === v ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)',
                  border: view === v ? '1px solid rgba(45,212,191,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  color: view === v ? '#2dd4bf' : 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {v === 'grid' ? <GridIcon /> : <ListIcon />}
                </button>
              ))}
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <UploadIcon /> Upload
            </button>
          </div>

          {/* Files area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 32px' }}>

            {/* AI-generated docs from teammates */}
            {aiDocs.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Shared by teammates</div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{ fontSize: 10.5, color: '#22c55e', fontWeight: 600 }}>{aiDocs.length} new</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {aiDocs.map(doc => {
                    const col = CHAR_COLORS[doc.characterId] ?? '#6b7280';
                    return (
                      <div key={doc.id} onClick={() => setSelectedAiDoc(doc)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${col}18`, border: `1px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                          {doc.docType === 'pdf' ? '📄' : doc.docType === 'xlsx' ? '📊' : '📝'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.55)' }}>
                            {CHAR_DISPLAY[doc.characterId] ?? doc.characterId} · {doc.docType.toUpperCase()}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: col, background: `${col}18`, border: `1px solid ${col}30`, padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase' as const, flexShrink: 0 }}>{doc.docType}</div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <SectionHeader title={activeFolder} />

            {view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {filtered.map(file => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedId(file.id === selectedId ? null : file.id)}
                    onDoubleClick={() => openFile(file)}
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
                        color: '#000', background: TYPE_COLORS[file.type],
                        padding: '2px 6px', borderRadius: 5, letterSpacing: '0.05em',
                      }}>{file.type}</span>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 3,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{file.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{file.modified}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: OWNER_COLORS[file.owner] ?? '#6b7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, color: '#000',
                      }}>{file.owner.charAt(0)}</div>
                      {file.shared && (
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <circle cx="2"  cy="5.5" r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          <circle cx="9"  cy="2"   r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          <circle cx="9"  cy="9"   r="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          <path d="M3.5 5L7.5 2.5M3.5 6L7.5 8.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.9" />
                        </svg>
                      )}
                    </div>
                    {/* Open hint on selected */}
                    {selectedId === file.id && (
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const, marginTop: -4 }}>
                        Double-click to open
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
                    {['Name', 'Type', 'Size', 'Modified', 'Owner'].map(h => (
                      <th key={h} style={{
                        padding: '8px 10px', textAlign: 'left',
                        fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(file => (
                    <tr
                      key={file.id}
                      onClick={() => setSelectedId(file.id === selectedId ? null : file.id)}
                      onDoubleClick={() => openFile(file)}
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
                          color: '#000', background: TYPE_COLORS[file.type],
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
                          }}>{file.owner.charAt(0)}</div>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{file.owner}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* DocViewer overlay — floats inside content area */}
          {viewerOpen && (
            <DocViewer
              file={viewerFile}
              isNew={isNewFile}
              onClose={closeViewer}
            />
          )}

          {/* AI doc viewer */}
          {selectedAiDoc && (
            <AiDocViewer doc={selectedAiDoc} onClose={() => setSelectedAiDoc(null)} />
          )}
        </div>
      </div>
    </AppWindow>
  );
}
