"use client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { AppWindow } from "@/components/layout/app-window";
import { RelationshipWeb } from "@/components/simulation/relationship-web";

/* ── Design tokens (new system) ─────────────────────────────────────────────── */
const T = {
  surface:    '#212121',
  surface2:   '#2e2c2e',
  text:       '#efefef',
  muted:      '#afa39f',
  border:     'rgba(255,255,255,0.04)',
  primary:    '#147b58',
  yellow:     '#deaf49',
  success:    '#28c840',
  shadow1:    '0 1px 2px rgba(0,0,0,0.6)',
} as const;

/** New card style — replaces legacy cardStyle */
const card = {
  background:   T.surface,
  border:       `1px solid ${T.border}`,
  borderRadius: 12,
  boxShadow:    T.shadow1,
} as const;

/** Section header with optional right action */
function SectionHdr({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: T.muted,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.07em',
    }}>
      <span>{title}</span>
      {action && onAction && (
        <button onClick={onAction} style={{
          fontSize: 11, color: T.primary, background: 'none', border: 'none',
          cursor: 'pointer', fontWeight: 600, textTransform: 'none', letterSpacing: 0,
          fontFamily: 'inherit',
        }}>
          {action}
        </button>
      )}
    </div>
  );
}

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface ProfileData {
  profile: {
    id: string; name: string; email: string; createdAt: string;
    avatar?: string; role?: string; experienceLevel?: string; industry?: string; bio?: string;
  };
  sessions: { id: string; scenarioId: string; status: string; elapsedSeconds: number; createdAt: string; compositeScore: number | null; portfolio: { id: string; status: string; verificationId: string; scenarioName: string } | null }[];
  avgScores: { stakeholderMgmt: number; communication: number; strategicThinking: number; conflictResolution: number; prioritisation: number; executionSpeed: number } | null;
  badges: { id: string; label: string; icon: string; color: string; earned: boolean; desc: string }[];
}

const EXP_LEVELS = [
  { value: 'junior', label: 'Junior · 0–2 years' },
  { value: 'mid',    label: 'Mid · 3–5 years' },
  { value: 'senior', label: 'Senior · 6+ years' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
  padding: '7px 10px', fontSize: 13, color: '#f0f0f3',
  outline: 'none', fontFamily: 'inherit',
};

const SKILL_COLOR: Record<string, string> = {
  communication:    '#49a5de',
  strategicThinking:'#bb76d6',
  stakeholderMgmt:  '#02ba67',
  executionSpeed:   '#deaf49',
  conflictResolution:'#db966b',
  prioritisation:   '#d44848',
};

const EXPERIENCE = [
  {
    role: 'Senior Product Manager',
    company: 'Nexus Technologies',
    period: 'Jan 2025 – Present',
    duration: '3 mos',
    location: 'San Francisco, CA · On-site',
    description: 'Leading Q3 platform refresh for a 300-person B2B SaaS company post-Series C. Managing cross-functional roadmap across Engineering, Design, and Sales against competing stakeholder priorities.',
    logo: '🏢',
    current: true,
  },
  {
    role: 'Product Manager',
    company: 'Clearpath Analytics',
    period: 'Mar 2022 – Dec 2024',
    duration: '2 yrs 9 mos',
    location: 'San Francisco, CA · Hybrid',
    description: 'Owned the core data pipeline product. Launched 4 major feature sets, grew ARR contribution by 38%, and reduced churn by restructuring the onboarding experience with design.',
    logo: '📊',
    current: false,
  },
  {
    role: 'Associate Product Manager',
    company: 'Vantage Labs',
    period: 'Jul 2019 – Feb 2022',
    duration: '2 yrs 7 mos',
    location: 'New York, NY · Remote',
    description: 'Joined APM programme. Built first mobile app for logistics tracking used by 15k monthly active users. Managed sprint cycles, user research, and stakeholder communication.',
    logo: '🔬',
    current: false,
  },
];

const EDUCATION = [
  {
    institution: 'University of California, Berkeley',
    degree: 'BSc Business Administration · Product & Technology',
    period: '2015 – 2019',
    logo: '🎓',
  },
  {
    institution: 'General Assembly',
    degree: 'Certificate · Product Management Immersive',
    period: '2019',
    logo: '📚',
  },
];

const NEBULA_STATS = [
  { label: 'Immersion Score',      value: '87',   suffix: '/ 100', color: T.primary,  icon: '⚡', desc: 'Overall platform performance' },
  { label: 'Avg Session Score',    value: '87.5', suffix: 'pts',   color: '#49a5de',  icon: '📈', desc: 'Across 2 completed sessions' },
  { label: 'Chaos Response',       value: 'A−',   suffix: '',      color: '#deaf49',  icon: '🔥', desc: 'How fast you handle crises' },
  { label: 'Stakeholder Trust',    value: '0.81', suffix: 'avg',   color: '#02ba67',  icon: '🤝', desc: 'Average colleague trust score' },
];

const NAV_ITEMS = ['Overview', 'Trust Network', 'Badges', 'Certificates', 'Records'];

/* ── Profile Screen ─────────────────────────────────────────────────────────── */
export function ProfileScreen() {
  const { user, setUser, setUserProfile, userProfile, setScreen } = useAppStore();
  const [activeNav, setActiveNav] = useState('Overview');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', role: '', experienceLevel: '', industry: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfileData(data); })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const displayName = user?.name ?? profileData?.profile?.name ?? 'PM';
  const displayRole = userProfile?.role || profileData?.profile?.role || '';
  const displayExp  = userProfile?.experienceLevel || profileData?.profile?.experienceLevel || '';
  const displayIndustry = profileData?.profile?.industry || '';
  const displayBio  = profileData?.profile?.bio || '';

  const expLabel = (v: string) => EXP_LEVELS.find(e => e.value === v)?.label ?? v;

  const handleEditStart = () => {
    setDraft({
      name: displayName,
      role: displayRole,
      experienceLevel: displayExp,
      industry: displayIndustry,
      bio: displayBio,
    });
    setSaveError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Save failed');
      }
      // Update store
      if (user) setUser({ ...user, name: draft.name });
      setUserProfile({
        role: draft.role,
        experienceLevel: draft.experienceLevel as 'junior' | 'mid' | 'senior',
      });
      // Update local profileData so display refreshes without a re-fetch
      setProfileData(prev => prev ? {
        ...prev,
        profile: { ...prev.profile, name: draft.name, role: draft.role, experienceLevel: draft.experienceLevel, industry: draft.industry, bio: draft.bio },
      } : prev);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/user/avatar', { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Upload failed');
      }
      const { url } = await res.json();
      if (user) setUser({ ...user, avatar: url });
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Derive display data from real API or fall back to empty state
  const skillScores = profileData?.avgScores
    ? Object.entries(profileData.avgScores).map(([key, score]) => ({
        label: key === 'stakeholderMgmt' ? 'Stakeholder Mgmt'
             : key === 'strategicThinking' ? 'Strategic Thinking'
             : key === 'conflictResolution' ? 'Conflict Resolution'
             : key === 'executionSpeed' ? 'Execution Speed'
             : key.charAt(0).toUpperCase() + key.slice(1),
        score: score as number,
        color: SKILL_COLOR[key] ?? T.primary,
      }))
    : [];

  const badges = profileData?.badges ?? [];

  const sessions = (profileData?.sessions ?? []).map((s, i) => ({
    id: s.id,
    scenario: 'The Roadmap Reckoning',
    date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    score: s.compositeScore,
    duration: s.elapsedSeconds ? `${Math.round(s.elapsedSeconds / 60)} min` : '—',
    status: s.status,
    sessionNum: i + 1,
  }));

  const certificates = (profileData?.sessions ?? [])
    .filter(s => s.status === 'completed' && s.compositeScore != null && (s.compositeScore ?? 0) >= 70)
    .map((s, i) => ({
      id: s.id,
      title: 'Roadmap Mastery',
      session: `Session ${i + 1}`,
      date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: s.compositeScore ?? 0,
      color: i % 2 === 0 ? '#bb76d6' : '#02ba67',
      verificationId: s.portfolio?.verificationId ?? s.id,
    }));

  return (
    <AppWindow
      screenKey="profile"
      url={`profile.nebula.io / ${displayName.replace(' ', '-').toLowerCase()}`}
      urlAccent="rgba(20,123,88,0.55)"
      label="Profile"
      accentColor="#147b58"
      maxWidth={1100}
    >
      {/* Body */}
      <>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 36px', background: '#161616' }}>

          {/* ── Action strip ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 16 }}>
            {!editing && (
              <button
                onClick={handleEditStart}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(20,123,88,0.3)',
                  background: 'rgba(20,123,88,0.08)', color: '#34d399',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(20,123,88,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,123,88,0.08)'; }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" fill="none" />
                </svg>
                Edit Profile
              </button>
            )}
            <button
              onClick={() => setScreen('desktop')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(175,163,159,0.7)',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 120ms, background 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#efefef'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(175,163,159,0.7)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="7" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="1" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
                <rect x="7" y="7" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              Desktop
            </button>
            <button
              onClick={() => setScreen('login')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(212,72,72,0.06)', color: 'rgba(212,72,72,0.7)',
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 120ms, background 120ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,72,72,0.10)'; e.currentTarget.style.color = '#d44848'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,72,72,0.06)'; e.currentTarget.style.color = 'rgba(212,72,72,0.7)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                <path d="M8.5 6.5H1.5M5 4l-3 2.5L5 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 1.5h5a1 1 0 011 1v8a1 1 0 01-1 1H5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              Log out
            </button>
          </div>

          {/* ── Profile Header: Two-card hero ─────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14, marginBottom: 16 }}>

            {/* ── Left: Identity card ── */}
            <div style={{
              background: '#18181c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              padding: '32px 20px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', gap: 0,
            }}>
              {/* Avatar */}
              <div
                onClick={() => editing && fileInputRef.current?.click()}
                style={{
                  width: 120, height: 120, borderRadius: '50%',
                  background: 'linear-gradient(145deg, #c97b50, #7b3a1e)',
                  border: `3px solid ${editing ? 'rgba(20,123,88,0.6)' : 'rgba(20,123,88,0.35)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 28px rgba(20,123,88,0.20)',
                  marginBottom: 18, flexShrink: 0, overflow: 'hidden', position: 'relative',
                  cursor: editing ? 'pointer' : 'default',
                }}
              >
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="76" height="76" viewBox="0 0 46 46" fill="none">
                    <ellipse cx="23" cy="18" rx="9"  ry="10" fill="rgba(255,255,255,0.85)" />
                    <ellipse cx="23" cy="40" rx="15" ry="11" fill="rgba(255,255,255,0.85)" />
                    <ellipse cx="23" cy="12" rx="10" ry="7"  fill="#2a1a0e" />
                    <ellipse cx="12" cy="19" rx="2.8" ry="8" fill="#2a1a0e" />
                    <ellipse cx="34" cy="19" rx="2.8" ry="8" fill="#2a1a0e" />
                  </svg>
                )}
                {/* Upload overlay in edit mode */}
                {editing && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                    {avatarUploading ? (
                      <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 13V7M7 10l3-3 3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="2" y="4" width="16" height="12" rx="2" stroke="white" strokeWidth="1.2" fill="none" />
                          <circle cx="14" cy="7" r="1.2" fill="white" />
                        </svg>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Change</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              {avatarError && (
                <div style={{ fontSize: 10.5, color: '#ef4444', marginBottom: 6, textAlign: 'center', maxWidth: 160 }}>{avatarError}</div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                  e.target.value = '';
                }}
              />
              {/* Name */}
              {editing ? (
                <input
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 8 }}
                  placeholder="Display name"
                />
              ) : (
                <div style={{ fontSize: 20, fontWeight: 800, color: '#f0f0f3', marginBottom: 8, letterSpacing: '-0.02em' }}>
                  {displayName}
                </div>
              )}
              {/* Premium badge */}
              <span style={{
                fontSize: 11.5, fontWeight: 600, color: '#000000',
                background: '#02ba67',
                borderRadius: 99, padding: '4px 14px',
              }}>
                Premium User
              </span>
              {/* Credits */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Credits</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#deaf49' }}>{user?.credits ?? 2450}</span>
                  <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.45)' }}>NEB</span>
                </div>
              </div>
            </div>

            {/* ── Right: Bio & details card ── */}
            <div style={{
              background: '#18181c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
              padding: '22px 26px 20px',
            }}>
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f3', letterSpacing: '-0.01em' }}>
                  Bio &amp; other details
                </span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.success, flexShrink: 0 }} />
              </div>

              {/* Fields grid — 2 columns × 3 rows */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 16 }}>

                {/* Row 1 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Role</div>
                  {editing ? (
                    <input value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                      style={inputStyle} placeholder="e.g. Senior Product Manager" />
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 600, color: displayRole ? '#f0f0f3' : 'rgba(240,240,243,0.28)' }}>
                      {displayRole || 'Add your role'}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Experience Level</div>
                  {editing ? (
                    <select value={draft.experienceLevel} onChange={e => setDraft(d => ({ ...d, experienceLevel: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select level</option>
                      {EXP_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 600, color: displayExp ? '#f0f0f3' : 'rgba(240,240,243,0.28)' }}>
                      {displayExp ? expLabel(displayExp) : 'Add experience level'}
                    </div>
                  )}
                </div>

                {/* Row 2 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Company</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: userProfile?.chosenCompany?.name ? '#f0f0f3' : 'rgba(240,240,243,0.28)' }}>
                    {userProfile?.chosenCompany?.name || 'Set during onboarding'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My Industry</div>
                  {editing ? (
                    <input value={draft.industry} onChange={e => setDraft(d => ({ ...d, industry: e.target.value }))}
                      style={inputStyle} placeholder="e.g. B2B SaaS" />
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 600, color: displayIndustry ? '#f0f0f3' : 'rgba(240,240,243,0.28)' }}>
                      {displayIndustry || 'Add your industry'}
                    </div>
                  )}
                </div>

                {/* Row 3 */}
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>My City or Region</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(240,240,243,0.28)' }}>—</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, fontWeight: 600 }}>Availability</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600, color: '#000000',
                    background: '#02ba67',
                    borderRadius: 99, padding: '3px 10px',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#000000', flexShrink: 0, display: 'inline-block' }} />
                    Available for Simulation
                  </span>
                </div>

              </div>

              {/* Save / Cancel row (edit mode only) */}
              {editing && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {saveError && <span style={{ fontSize: 11.5, color: '#ef4444', flex: 1 }}>{saveError}</span>}
                  <button onClick={handleCancel} style={{
                    padding: '7px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent', color: T.muted, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{
                    padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(20,123,88,0.4)',
                    background: saving ? 'rgba(20,123,88,0.1)' : 'rgba(20,123,88,0.18)',
                    color: saving ? T.muted : '#34d399',
                    fontSize: 12.5, fontWeight: 600, cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {saving && <div style={{ width: 12, height: 12, border: '1.5px solid rgba(52,211,153,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

              {/* Badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, width: 52, flexShrink: 0 }}>Badges</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {badges.filter(b => b.earned).slice(0, 3).map(b => (
                    <span key={b.id} style={{
                      fontSize: 10.5, fontWeight: 600, color: '#000000',
                      background: b.color,
                      borderRadius: 99, padding: '3px 9px',
                    }}>
                      {b.icon} {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, width: 52, flexShrink: 0 }}>Tags</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['#ProductStrategy', '#Roadmapping', '#Agile', '#B2BSaaS', '#Stakeholders'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 10.5, fontWeight: 500, color: 'rgba(240,240,243,0.50)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 99, padding: '3px 9px',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ── End Profile Header ── */}

          {/* ── Tab bar ── */}
          <div className="tab-bar" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                className={`tab-item${activeNav === item ? ' active' : ''}`}
                onClick={() => setActiveNav(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeNav === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* ── About ── */}
              <div>
                <SectionHdr title="About" />
                {editing ? (
                  <textarea
                    value={draft.bio}
                    onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    placeholder="Write a short bio about yourself, your background, and what you're working on…"
                  />
                ) : (
                  <p style={{ fontSize: 14, color: displayBio ? T.muted : 'rgba(175,163,159,0.35)', lineHeight: 1.75, maxWidth: 640, margin: 0, fontStyle: displayBio ? 'normal' : 'italic' }}>
                    {displayBio || 'No bio yet — click Edit Profile to add one.'}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                  {['Product Strategy', 'Roadmapping', 'Stakeholder Management', 'Agile', 'B2B SaaS', 'Cross-functional Leadership'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: T.muted, background: T.surface,
                      border: `1px solid ${T.border}`, borderRadius: 99,
                      padding: '4px 10px', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* ── Nebula Immersion Performance ── */}
              <div>
                <SectionHdr title="Nebula Immersion Performance" />
                <div style={{
                  ...card,
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, rgba(20,123,88,0.08) 0%, rgba(33,33,33,1) 60%)',
                  border: `1px solid rgba(20,123,88,0.18)`,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>⚡</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Job Immersion Platform · Active Participant</div>
                      <div style={{ fontSize: 11, color: T.muted }}>Scenario: The Roadmap Reckoning · Session 3 in progress</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: T.primary, lineHeight: 1 }}>87</div>
                      <div style={{ fontSize: 10, color: T.muted }}>Immersion Score</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {NEBULA_STATS.map(s => (
                      <div key={s.label} style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
                      }}>
                        <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                          {s.value}<span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(175,163,159,0.5)', marginLeft: 3 }}>{s.suffix}</span>
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill score bars */}
                <div style={{ ...card, padding: '18px 22px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Skill Scores</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {skillScores.map(skill => (
                      <div key={skill.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 12.5, color: T.muted, width: 155, flexShrink: 0 }}>{skill.label}</span>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${skill.score}%`, height: '100%',
                            background: `linear-gradient(90deg, ${skill.color}70, ${skill.color})`,
                            borderRadius: 3,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: skill.color, width: 30, textAlign: 'right' }}>{skill.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Experience ── */}
              <div>
                <SectionHdr title="Experience" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {EXPERIENCE.map((exp, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 24, position: 'relative' }}>
                      {/* Timeline line */}
                      {i < EXPERIENCE.length - 1 && (
                        <div style={{
                          position: 'absolute', left: 19, top: 44, bottom: 0,
                          width: 1, background: T.border,
                        }} />
                      )}
                      {/* Logo */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: T.surface, border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: T.shadow1,
                      }}>
                        {exp.logo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 1 }}>
                              {exp.role}
                              {exp.current && (
                                <span style={{
                                  marginLeft: 8, fontSize: 9, fontWeight: 700,
                                  color: '#000000', background: '#02ba67',
                                  borderRadius: 4,
                                  padding: '1px 6px', verticalAlign: 'middle', textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>Current</span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: T.muted, marginBottom: 2 }}>{exp.company}</div>
                            <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)', marginBottom: 10 }}>
                              {exp.period} · {exp.duration} · {exp.location}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, margin: 0 }}>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Education ── */}
              <div>
                <SectionHdr title="Education" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {EDUCATION.map((edu, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: T.surface, border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, boxShadow: T.shadow1,
                      }}>
                        {edu.logo}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 1 }}>{edu.institution}</div>
                        <div style={{ fontSize: 13, color: T.muted, marginBottom: 1 }}>{edu.degree}</div>
                        <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.5)' }}>{edu.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Badges preview ── */}
              <div>
                <SectionHdr title="Badges" action="See all 5 badges →" onAction={() => setActiveNav('Badges')} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {badges.filter(b => b.earned).slice(0, 2).map(badge => (
                    <div key={badge.id} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: badge.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      }}>
                        {badge.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{badge.label}</div>
                        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: badge.color, color: '#000000', borderRadius: 4, padding: '1px 6px' }}>Earned</span>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.45 }}>{badge.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveNav('Badges')}
                  style={{
                    marginTop: 10, width: '100%', padding: '10px',
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 10, fontSize: 12, color: T.muted,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}
                >
                  View all 8 badges →
                </button>
              </div>

              {/* ── Certificates preview ── */}
              <div>
                <SectionHdr title="Certificates" action="See all →" onAction={() => setActiveNav('Certificates')} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {certificates.map(cert => (
                    <div key={cert.id} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: cert.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                      }}>
                        🎓
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{cert.title}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>
                          Nebula · {cert.session} · {cert.date}
                        </div>
                      </div>
                      <div style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, flexShrink: 0,
                        background: cert.color, color: '#000000', fontWeight: 700,
                      }}>
                        {cert.score}/100
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveNav('Certificates')}
                  style={{
                    marginTop: 10, width: '100%', padding: '10px',
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 10, fontSize: 12, color: T.muted,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}
                >
                  View all certificates →
                </button>
              </div>

              {/* ── Quick stats strip ── */}
              <div>
                <SectionHdr title="Activity" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Credits',       value: user?.credits ?? 2450, color: T.yellow,  suffix: 'NEB'   },
                    { label: 'Badges Earned', value: 5,                     color: '#bb76d6', suffix: '/ 8'   },
                    { label: 'Sessions',      value: 3,                     color: '#49a5de', suffix: 'total' },
                    { label: 'Certificates',  value: 2,                     color: '#02ba67', suffix: 'issued'},
                  ].map(stat => (
                    <div key={stat.label} style={{ ...card, padding: '14px 16px' }}>
                      <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        {stat.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                        <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.45)' }}>{stat.suffix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TRUST NETWORK */}
          {activeNav === 'Trust Network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <SectionHdr title="Trust Network" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Live relationship map — updates as you interact during simulation</p>
              </div>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
                <RelationshipWeb />
              </div>
            </div>
          )}

          {/* BADGES */}
          {activeNav === 'Badges' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Badges" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>5 of 8 badges earned across your sessions</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {badges.map(badge => (
                  <div key={badge.id} style={{
                    ...card, padding: '16px',
                    opacity: badge.earned ? 1 : 0.4,
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background:  badge.earned ? badge.color : T.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {badge.earned ? badge.icon : '🔒'}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: badge.earned ? T.text : T.muted }}>
                          {badge.label}
                        </div>
                        {badge.earned && (
                          <span style={{ fontSize: 10, fontWeight: 600, background: badge.color, color: '#000000', borderRadius: 4, padding: '1px 6px' }}>Earned</span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, margin: 0 }}>{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* certificates */}
          {activeNav === 'Certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Certificates" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Blockchain-verified certificates issued upon session completion</p>
              </div>
              {certificates.map(cert => (
                <div key={cert.id} style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: cert.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                  }}>
                    🎓
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{cert.title}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
                      {cert.session} · Issued {cert.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11,
                        background: cert.color, color: '#000000', fontWeight: 700,
                      }}>
                        Score: {cert.score}/100
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(175,163,159,0.4)', fontFamily: 'monospace' }}>
                        {cert.verificationId}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ ...card, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#000000', background: cert.color, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                      View
                    </button>
                    <button style={{ ...card, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, color: T.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RECORDS */}
          {activeNav === 'Records' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <SectionHdr title="Session Records" />
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Complete history of your simulation runs</p>
              </div>
              {sessions.map(session => (
                <div key={session.id} style={{ ...card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: session.status === 'active' ? '#02ba67' : '#49a5de',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    color: '#000000',
                  }}>
                    S{session.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{session.scenario}</div>
                    <div style={{ fontSize: 11.5, color: T.muted }}>
                      {session.date} · {session.duration}
                    </div>
                  </div>
                  {session.score !== null ? (
                    <div style={{ textAlign: 'right', minWidth: 44 }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: session.score >= 85 ? '#02ba67' : '#49a5de', lineHeight: 1 }}>
                        {session.score}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.45)', marginTop: 2 }}>/100</div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '4px 12px', borderRadius: 20,
                      background: '#02ba67',
                      fontSize: 11, color: '#000000', fontWeight: 700,
                    }}>
                      In Progress
                    </div>
                  )}
                  <button style={{ ...card, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, color: T.muted, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {session.status === 'completed' ? 'View Report' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </>
    </AppWindow>
  );
}
