"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { CHARACTERS, SKILL_LABELS, SESSION_BENCHMARKS, MOCK_LEADERBOARD } from "@/lib/data";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { WindowChrome } from "@/components/layout/window-chrome";
import type { DecisionNode, DebriefItem } from "@/lib/types";

// ─── Inline Progress ────────────────────────────────────────────────────────
function InlineProgress({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 400ms' }} />
    </div>
  );
}

// ─── Portfolio Panel ─────────────────────────────────────────────────────────
function PortfolioCaseStudyPanel() {
  const session = useAppStore(s => s.session);
  const portfolio = session?.portfolio;
  const [viewInline, setViewInline] = useState(false);

  if (!portfolio) return null;

  if (portfolio.status === 'generating') {
    return (
      <div style={{ margin: '0 24px 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#18181c', padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #147b58', borderTopColor: 'transparent', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f3', margin: 0 }}>Generating your Portfolio Case Study…</p>
          <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.35)', marginTop: 2, marginBottom: 0 }}>This takes up to 90 seconds. Review your results below while you wait.</p>
        </div>
      </div>
    );
  }

  if (portfolio.status === 'failed') {
    return (
      <div style={{ margin: '0 24px 24px', borderRadius: 14, border: '1px solid rgba(212,72,72,0.2)', background: 'rgba(212,72,72,0.05)', padding: '20px' }}>
        <p style={{ fontSize: 14, color: '#d44848', margin: 0 }}>Case study generation failed. <button onClick={() => {}} style={{ background: 'none', border: 'none', color: '#d44848', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 14 }}>Retry</button></p>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 24px 24px', borderRadius: 14, border: '1px solid rgba(20,123,88,0.2)', background: 'rgba(20,123,88,0.03)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(20,123,88,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>📄</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f3', margin: 0 }}>Your Portfolio Case Study is ready</p>
            <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.40)', marginTop: 2, marginBottom: 0 }}>Professional-grade · Employer-ready · Session {portfolio.sessionNumber} of 3</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setViewInline(!viewInline)} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(240,240,243,0.7)', cursor: 'pointer' }}>
            {viewInline ? 'Collapse' : 'View'}
          </button>
          <button onClick={() => alert('PDF download — Session ID: ' + portfolio.verificationId)} style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(240,240,243,0.7)', cursor: 'pointer' }}>
            Download PDF ↓
          </button>
        </div>
      </div>
      {viewInline && (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f3', margin: 0 }}>{portfolio.userName}</h2>
              <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.45)', marginTop: 2, marginBottom: 0 }}>Product Manager · {portfolio.scenarioName}</p>
              <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.30)', marginTop: 2, marginBottom: 0 }}>{portfolio.sessionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Session {portfolio.sessionNumber} of 3</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nexus Technologies</div>
              <div style={{ fontSize: 11, color: 'rgba(52,211,153,0.6)', marginTop: 2 }}>CareerSim Verified</div>
            </div>
          </div>
          <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: 0 }} />
          <div><h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 8, marginTop: 0 }}>Scenario Summary</h3><p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.6, margin: 0 }}>{portfolio.scenarioSummary}</p></div>
          <div><h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 8, marginTop: 0 }}>The Challenge</h3><p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.6, margin: 0 }}>{portfolio.challenge}</p></div>
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 12, marginTop: 0 }}>Key Decisions</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {portfolio.keyDecisions.map((d, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#147b58', flexShrink: 0 }} />
                  <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.6, margin: 0 }}>{d.bullet}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 12, marginTop: 0 }}>Skills Demonstrated</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {portfolio.skillsAboveBaseline.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ width: 144, fontSize: 12, color: 'rgba(240,240,243,0.55)', flexShrink: 0 }}>{s.dimension}</span>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 3, background: '#147b58', width: `${s.score}%` }} /></div>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,243,0.40)', width: 32, textAlign: 'right' }}>{s.score}</span>
                  <span style={{ fontSize: 12, color: '#02ba67', width: 40, textAlign: 'right' }}>+{s.baselineDelta}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 12, marginTop: 0 }}>Performance Narrative</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.70)', lineHeight: 1.6, margin: 0 }}>{portfolio.performanceNarrative}</p>
          </div>
          <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 11, color: 'rgba(240,240,243,0.20)', lineHeight: 1.6, margin: 0 }}>CareerSim verified session · {portfolio.sessionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · ID: {portfolio.verificationId}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nova Debrief Panel ───────────────────────────────────────────────────────
function DebriefPanel({ items }: { items: DebriefItem[] }) {
  const [selected, setSelected] = useState<DebriefItem | null>(items[0] ?? null);

  if (items.length === 0) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(240,240,243,0.3)', fontSize: 13 }}>
        <div style={{ fontSize: 24 }}>🤖</div>
        <p style={{ margin: 0 }}>Nova's coaching notes are being prepared...</p>
      </div>
    );
  }

  const sentimentColor = (s: string) => s === 'positive' ? '#22c55e' : s === 'negative' ? '#ef4444' : '#f59e0b';
  const sentimentIcon = (s: string) => s === 'positive' ? '↑' : s === 'negative' ? '↓' : '→';

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Timeline */}
      <div style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 6px', marginBottom: 8 }}>Nova's Coaching Notes</div>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item)}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              background: selected === item ? '#1f1f24' : '#18181c',
              border: `1px solid ${selected === item ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(240,240,243,0.25)' }}>
                {Math.floor(item.timestampSeconds / 60)}:{String(item.timestampSeconds % 60).padStart(2, '0')}
              </span>
              <span style={{ color: sentimentColor(item.sentiment), fontSize: 12, fontWeight: 700 }}>
                {sentimentIcon(item.sentiment)}
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.65)', margin: 0, lineHeight: 1.4 }}>{item.decision.slice(0, 60)}{item.decision.length > 60 ? '…' : ''}</p>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Nova header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(20,123,88,0.2)', border: '1.5px solid rgba(20,123,88,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f3' }}>Nova</div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.35)' }}>AI Career Coach</div>
              </div>
              <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 20, background: `${sentimentColor(selected.sentiment)}18`, border: `1px solid ${sentimentColor(selected.sentiment)}44`, fontSize: 11, color: sentimentColor(selected.sentiment), fontWeight: 600 }}>
                {selected.sentiment === 'positive' ? '+ Good decision' : selected.sentiment === 'negative' ? '− Growth area' : '~ Neutral'}
              </div>
            </div>

            <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>What You Did</div>
              <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.75)', margin: 0, lineHeight: 1.6 }}>{selected.decision}</p>
            </div>

            <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Consequence</div>
              <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.75)', margin: 0, lineHeight: 1.6 }}>{selected.impact}</p>
            </div>

            <div style={{ background: 'rgba(20,123,88,0.06)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 10, color: 'rgba(52,211,153,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Nova's Coaching Note</div>
              <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.80)', margin: 0, lineHeight: 1.65 }}>{selected.coachNote}</p>
            </div>

            <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Skill Dimension</div>
              <div style={{ fontSize: 13, color: '#f0f0f3', fontWeight: 500 }}>{SKILL_LABELS[selected.skill] ?? selected.skill}</div>
            </div>
          </div>
        ) : (
          <p style={{ color: 'rgba(240,240,243,0.25)', fontSize: 13, textAlign: 'center', marginTop: 48 }}>Select a moment to see Nova's coaching</p>
        )}
      </div>
    </div>
  );
}

// ─── What-If Panel ────────────────────────────────────────────────────────────
function WhatIfPanel({ decisions }: { decisions: DecisionNode[] }) {
  const { characters } = useAppStore();
  const [selected, setSelected] = useState<DecisionNode | null>(decisions[0] ?? null);
  const [altInput, setAltInput] = useState('');
  const [result, setResult] = useState<{ alternateReply: string; trustProjection: number; narrative: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function simulate() {
    if (!selected || !altInput.trim()) return;
    const char = characters.find(c => c.id === selected.characterId);
    if (!char) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionNode: selected, character: char, alternateApproach: altInput }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ alternateReply: 'Simulation unavailable.', trustProjection: selected.trustBefore, narrative: 'Could not reach AI service.' });
    }
    setLoading(false);
  }

  if (decisions.length === 0) {
    return (
      <div style={{ padding: 24, color: 'rgba(240,240,243,0.3)', fontSize: 13, textAlign: 'center' }}>
        <p>No decision history recorded yet. Complete a simulation to explore What-If scenarios.</p>
      </div>
    );
  }

  const char = selected ? characters.find(c => c.id === selected.characterId) : null;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Decision list */}
      <div style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 6px', marginBottom: 8 }}>Your Decisions</div>
        {decisions.map((d, i) => {
          const c = characters.find(ch => ch.id === d.characterId);
          return (
            <button
              key={d.id}
              onClick={() => { setSelected(d); setResult(null); setAltInput(''); }}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                background: selected?.id === d.id ? '#1f1f24' : '#18181c',
                border: `1px solid ${selected?.id === d.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(240,240,243,0.25)' }}>
                  {Math.floor(d.timestampSeconds / 60)}:{String(d.timestampSeconds % 60).padStart(2, '0')}
                </span>
                {c && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: `${c.color}22`, color: c.color }}>{c.name.split(' ')[0]}</span>}
              </div>
              <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.65)', margin: 0, lineHeight: 1.4 }}>
                "{d.userMessage.slice(0, 55)}{d.userMessage.length > 55 ? '…' : ''}"
              </p>
              <div style={{ fontSize: 10, color: d.trustAfter > d.trustBefore ? '#22c55e' : '#ef4444', marginTop: 4 }}>
                Trust: {Math.round(d.trustBefore * 100)}% → {Math.round(d.trustAfter * 100)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* What-If explorer */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {selected && (
          <>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>What You Said</div>
              <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, color: 'rgba(240,240,243,0.75)', lineHeight: 1.6 }}>
                "{selected.userMessage}"
              </div>
            </div>

            {char && (
              <div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{char.name} Responded</div>
                <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, color: 'rgba(240,240,243,0.60)', lineHeight: 1.6, borderLeft: `3px solid ${char.color}66` }}>
                  "{selected.characterReply}"
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>What if you had said instead?</div>
              <textarea
                value={altInput}
                onChange={e => setAltInput(e.target.value)}
                placeholder="Type an alternate message or approach..."
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff',
                  resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'system-ui, sans-serif',
                }}
              />
              <button
                onClick={simulate}
                disabled={!altInput.trim() || loading}
                style={{
                  marginTop: 8, padding: '9px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                  background: altInput.trim() && !loading ? '#147b58' : 'rgba(255,255,255,0.08)',
                  border: 'none', color: '#fff', cursor: altInput.trim() && !loading ? 'pointer' : 'default',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Simulating…' : 'Simulate Alternate Outcome →'}
              </button>
            </div>

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.4s ease forwards' }}>
                <div style={{ background: 'rgba(20,123,88,0.06)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: 'rgba(52,211,153,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    {char?.name ?? 'Character'}'s Alternate Response
                  </div>
                  <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.80)', margin: 0, lineHeight: 1.65 }}>"{result.alternateReply}"</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Projected Trust</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: result.trustProjection > selected.trustBefore ? '#22c55e' : '#ef4444' }}>
                      {Math.round(result.trustProjection * 100)}%
                      <span style={{ fontSize: 12, marginLeft: 6 }}>
                        ({result.trustProjection > selected.trustBefore ? '+' : ''}{Math.round((result.trustProjection - selected.trustBefore) * 100)}pp)
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: 2, background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>What Changed</div>
                    <p style={{ fontSize: 12.5, color: 'rgba(240,240,243,0.65)', margin: 0, lineHeight: 1.5 }}>{result.narrative}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Leaderboard Panel ────────────────────────────────────────────────────────
function LeaderboardPanel({ avgTrust, secretsUnlocked, okrCompletion }: { avgTrust: number; secretsUnlocked: number; okrCompletion: number }) {
  // Compute a percentile rank based on avgTrust
  const rank = MOCK_LEADERBOARD.findIndex(e => avgTrust >= e.avgTrust) + 1 || MOCK_LEADERBOARD.length + 1;
  const label = SESSION_BENCHMARKS.topPercentileLabel(avgTrust);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Personal summary */}
      <div style={{ background: 'rgba(20,123,88,0.06)', border: '1px solid rgba(20,123,88,0.18)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 10, color: 'rgba(52,211,153,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Your Session</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f3', lineHeight: 1 }}>{Math.round(avgTrust * 100)}%</div>
            <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', marginTop: 3 }}>Avg Trust</div>
            <div style={{ fontSize: 10, color: avgTrust >= SESSION_BENCHMARKS.avgTrust ? '#22c55e' : '#f87171', marginTop: 2 }}>
              {avgTrust >= SESSION_BENCHMARKS.avgTrust ? '↑' : '↓'} vs {Math.round(SESSION_BENCHMARKS.avgTrust * 100)}% avg
            </div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f3', lineHeight: 1 }}>{secretsUnlocked}/5</div>
            <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', marginTop: 3 }}>Intel Unlocked</div>
            <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', marginTop: 2 }}>avg {SESSION_BENCHMARKS.avgSecretsUnlocked.toFixed(1)}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f3', lineHeight: 1 }}>{Math.round(okrCompletion * 100)}%</div>
            <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.4)', marginTop: 3 }}>OKR Completion</div>
            <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', marginTop: 2 }}>avg {Math.round(SESSION_BENCHMARKS.avgOkrCompletion * 100)}%</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, display: 'inline-block', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
          {label} of all Nebula sessions
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Top Sessions This Week</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MOCK_LEADERBOARD.map((entry, i) => {
            const isUser = rank === i + 1;
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8,
                  background: isUser ? 'rgba(20,123,88,0.1)' : '#18181c',
                  border: `1px solid ${isUser ? 'rgba(20,123,88,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div style={{ width: 24, fontSize: 12, color: i < 3 ? '#f0f0f3' : 'rgba(240,240,243,0.35)', fontWeight: i < 3 ? 700 : 400, textAlign: 'center', flexShrink: 0 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(240,240,243,0.6)', flexShrink: 0 }}>
                  {entry.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#f0f0f3', fontWeight: isUser ? 600 : 400 }}>{isUser ? 'You' : entry.initials}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(240,240,243,0.35)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.role}</div>
                </div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{isUser ? Math.round(avgTrust * 100) : Math.round(entry.avgTrust * 100)}%</div>
                <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.3)', width: 32, textAlign: 'right' }}>{isUser ? secretsUnlocked : entry.secrets}/5</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Replay Screen ───────────────────────────────────────────────────────
export function ReplayScreen() {
  const { setScreen, session, characters } = useAppStore();
  const [activeTab, setActiveTab] = useState<'debrief' | 'skills' | 'whatif' | 'leaderboard'>('debrief');

  const avgTrust = characters.length ? characters.reduce((a, c) => a + c.trust, 0) / characters.length : 0.6;
  const okrCompletion = session?.okrs ? session.okrs.filter(o => o.status === 'complete').length / session.okrs.length : 0;
  const secretsUnlocked = session?.unlockedSecrets?.length ?? 0;
  const debrief = session?.debrief ?? [];
  const decisions = session?.decisionHistory ?? [];

  const skillScores = {
    prioritisation: 72, stakeholderMgmt: 61, communication: 84,
    conflictResolution: 68, strategicThinking: 79, executionSpeed: 65,
  };
  const composite = Math.round(Object.values(skillScores).reduce((a, b) => a + b, 0) / 6);
  const rri = 67;

  const radarData = Object.entries(skillScores).map(([key, value]) => ({
    subject: SKILL_LABELS[key], score: value, benchmark: 80,
  }));

  const tabs = [
    { id: 'debrief'     as const, label: '🤖 Nova Debrief' },
    { id: 'skills'      as const, label: '📊 Skill Scores' },
    { id: 'whatif'      as const, label: '🔀 What If' },
    { id: 'leaderboard' as const, label: '🏆 Leaderboard' },
  ];

  return (
    <div className="arc-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 12, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '33%', left: '25%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(20,123,88,0.04)', filter: 'blur(48px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, height: '100vh' }}>
        <WindowChrome className="h-full flex flex-col" title="Session Replay — The Roadmap Reckoning" onClose={() => setScreen('dashboard')}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f3', margin: 0 }}>Session Complete</h1>
              <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.40)', marginTop: 3, marginBottom: 0 }}>Session 1 of 3 · The Roadmap Reckoning</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f0f0f3', lineHeight: 1 }}>{composite}</div>
                <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.30)', marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Session Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#02ba67', lineHeight: 1 }}>{rri}%</div>
                <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.30)', marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Role Readiness</div>
              </div>
              <button
                onClick={() => setScreen('browser')}
                style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#147b58', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                Start Session 2 →
              </button>
            </div>
          </div>

          {/* Portfolio */}
          <div style={{ overflowY: 'auto', maxHeight: '35vh', flexShrink: 0 }}>
            <PortfolioCaseStudyPanel />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', flexShrink: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 14px', fontSize: 12.5,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? '#f0f0f3' : 'rgba(240,240,243,0.35)',
                  background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? '#147b58' : 'transparent'}`,
                  cursor: 'pointer', transition: 'color 120ms',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {activeTab === 'debrief' && <DebriefPanel items={debrief} />}

            {activeTab === 'skills' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 500, color: '#f0f0f3', marginBottom: 16, marginTop: 0 }}>Skill Radar</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                      <Radar name="You" dataKey="score" stroke="#147b58" fill="#147b58" fillOpacity={0.15} strokeWidth={2} />
                      <Radar name="Senior PM" dataKey="benchmark" stroke="rgba(255,255,255,0.2)" fill="none" strokeDasharray="4 4" strokeWidth={1} />
                      <Tooltip contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 500, color: '#f0f0f3', marginBottom: 4, marginTop: 0 }}>Score Breakdown</h3>
                  {Object.entries(skillScores).map(([key, score]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'rgba(240,240,243,0.60)' }}>{SKILL_LABELS[key]}</span>
                        <span style={{ color: '#f0f0f3' }}>{score}</span>
                      </div>
                      <InlineProgress value={score} color={score >= 75 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444'} />
                    </div>
                  ))}
                  <div style={{ marginTop: 8, padding: 12, background: 'rgba(20,123,88,0.08)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11.5, color: 'rgba(52,211,153,0.7)', marginBottom: 4 }}>Role Readiness Index</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#02ba67', lineHeight: 1 }}>{rri}%</div>
                    <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.40)', marginTop: 4, marginBottom: 6 }}>vs Senior PM benchmark (100%)</p>
                    <InlineProgress value={rri} color="#147b58" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatif' && <WhatIfPanel decisions={decisions} />}
            {activeTab === 'leaderboard' && <LeaderboardPanel avgTrust={avgTrust} secretsUnlocked={secretsUnlocked} okrCompletion={okrCompletion} />}
          </div>
        </WindowChrome>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
