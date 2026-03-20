"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { CHARACTERS, SKILL_LABELS } from "@/lib/data";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { WindowChrome } from "@/components/layout/window-chrome";

const DECISION_NODES = [
  { id: 1, time: '08:14', title: 'Responded to Elena\'s roadmap email', impact: 'high', score: 82, feedback: 'Strong opening. You acknowledged the urgency and committed to a timeline. Elena\'s confidence in you increased.', dimension: 'Communication' },
  { id: 2, time: '14:32', title: 'Pushed back on Marcus\'s capacity claims', impact: 'medium', score: 55, feedback: 'Mixed outcome. Challenging Marcus directly without first understanding his constraints damaged trust. Consider: gather data before pushback.', dimension: 'Stakeholder Mgmt' },
  { id: 3, time: '22:05', title: 'Addressed Tom\'s off-roadmap promises', impact: 'high', score: 71, feedback: 'Good instinct to address it privately with Tom first. However, you missed the opportunity to bring a proposed solution — arrived with only the problem.', dimension: 'Conflict Resolution' },
  { id: 4, time: '31:48', title: 'Chaos event: Engineer resignation', impact: 'critical', score: 68, feedback: 'Responded calmly under pressure. You stabilised team sentiment. Score penalised slightly for delayed response to Marcus\'s follow-up.', dimension: 'Execution Speed' },
  { id: 5, time: '40:11', title: 'Draft OKR plan submitted to Sarah', impact: 'medium', score: 88, feedback: 'Excellent. Data-backed, realistic, and showed awareness of Engineering constraints. Sarah\'s trust increased significantly.', dimension: 'Strategic Thinking' },
];

// Inline progress bar replacing <Progress />
function InlineProgress({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 400ms' }} />
    </div>
  );
}

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
          <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.35)', marginTop: 2, marginBottom: 0 }}>This takes up to 90 seconds. You can review your Game Tape while you wait.</p>
        </div>
      </div>
    );
  }

  if (portfolio.status === 'failed') {
    return (
      <div style={{ margin: '0 24px 24px', borderRadius: 14, border: '1px solid rgba(212,72,72,0.2)', background: 'rgba(212,72,72,0.05)', padding: '20px' }}>
        <p style={{ fontSize: 14, color: '#d44848', margin: 0 }}>
          Case study generation failed.{' '}
          <button onClick={() => {}} style={{ background: 'none', border: 'none', color: '#d44848', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 14 }}>Retry</button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 24px 24px', borderRadius: 14, border: '1px solid rgba(20,123,88,0.2)', background: 'rgba(20,123,88,0.03)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(20,123,88,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>📄</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f3', margin: 0 }}>Your Portfolio Case Study is ready</p>
            <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.40)', marginTop: 2, marginBottom: 0 }}>Professional-grade · Employer-ready · Session {portfolio.sessionNumber} of 3</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setViewInline(!viewInline)}
            style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(240,240,243,0.7)', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {viewInline ? 'Collapse' : 'View'}
          </button>
          <button
            onClick={() => alert('PDF download — in production this fetches a presigned S3 URL for the generated PDF. Session ID: ' + portfolio.verificationId)}
            style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(240,240,243,0.7)', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Download PDF ↓
          </button>
        </div>
      </div>

      {/* Inline view */}
      {viewInline && (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header block */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f3', margin: 0 }}>{portfolio.userName}</h2>
              <p style={{ fontSize: 12, color: 'rgba(240,240,243,0.45)', marginTop: 2, marginBottom: 0 }}>Product Manager · {portfolio.scenarioName}</p>
              <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.30)', marginTop: 2, marginBottom: 0 }}>
                {portfolio.sessionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}Session {portfolio.sessionNumber} of 3
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(240,240,243,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nexus Technologies</div>
              <div style={{ fontSize: 11, color: 'rgba(52,211,153,0.6)', marginTop: 2 }}>CareerSim Verified</div>
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: 0 }} />

          {/* Scenario Summary */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 8, marginTop: 0 }}>Scenario Summary</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.6, margin: 0 }}>{portfolio.scenarioSummary}</p>
          </div>

          {/* The Challenge */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 8, marginTop: 0 }}>The Challenge</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.6, margin: 0 }}>{portfolio.challenge}</p>
          </div>

          {/* Key Decisions */}
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

          {/* Skills Demonstrated */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 12, marginTop: 0 }}>Skills Demonstrated</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {portfolio.skillsAboveBaseline.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ width: 144, fontSize: 12, color: 'rgba(240,240,243,0.55)', flexShrink: 0 }}>{s.dimension}</span>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: '#147b58', width: `${s.score}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,243,0.40)', width: 32, textAlign: 'right' }}>{s.score}</span>
                  <span style={{ fontSize: 12, color: '#02ba67', width: 40, textAlign: 'right' }}>+{s.baselineDelta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Narrative */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(240,240,243,0.35)', marginBottom: 12, marginTop: 0 }}>Performance Narrative</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.70)', lineHeight: 1.6, margin: 0 }}>{portfolio.performanceNarrative}</p>
          </div>

          {/* Verification footer */}
          <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 11, color: 'rgba(240,240,243,0.20)', lineHeight: 1.6, margin: 0 }}>
              This case study was generated by CareerSim based on a verified simulation session completed on{' '}
              {portfolio.sessionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
              Session ID: {portfolio.verificationId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReplayScreen() {
  const { setScreen, session, characters } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<typeof DECISION_NODES[0] | null>(DECISION_NODES[0]);
  const [activeTab, setActiveTab] = useState<'gametape' | 'skills' | 'whatif'>('gametape');

  const skillScores = {
    prioritisation: 72,
    stakeholderMgmt: 61,
    communication: 84,
    conflictResolution: 68,
    strategicThinking: 79,
    executionSpeed: 65,
  };
  const composite = Math.round(Object.values(skillScores).reduce((a, b) => a + b, 0) / 6);
  const rri = 67;

  const radarData = Object.entries(skillScores).map(([key, value]) => ({
    subject: SKILL_LABELS[key],
    score: value,
    benchmark: 80,
  }));

  const tabs = [
    { id: 'gametape' as const, label: '📽 Game Tape' },
    { id: 'skills'   as const, label: '📊 Skill Scores' },
    { id: 'whatif'   as const, label: '🔀 What If' },
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
                onMouseEnter={e => (e.currentTarget.style.background = '#0f6147')}
                onMouseLeave={e => (e.currentTarget.style.background = '#147b58')}
              >
                Start Session 2 →
              </button>
            </div>
          </div>

          {/* Portfolio Case Study (above tabs) */}
          <div style={{ overflowY: 'auto', maxHeight: '40vh', flexShrink: 0 }}>
            <PortfolioCaseStudyPanel />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', flexShrink: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px', fontSize: 12.5,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? '#f0f0f3' : 'rgba(240,240,243,0.35)',
                  background: 'none',
                  borderTop: 'none', borderLeft: 'none', borderRight: 'none',
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
            {activeTab === 'gametape' && (
              <>
                {/* Timeline sidebar */}
                <div style={{ width: 288, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto' }}>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <h3 style={{ fontSize: 10.5, fontWeight: 500, color: 'rgba(240,240,243,0.30)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, marginTop: 0, padding: '0 4px' }}>Decision Timeline</h3>
                    {DECISION_NODES.map(node => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        style={{
                          width: '100%', textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer',
                          background: selectedNode?.id === node.id ? '#1f1f24' : '#18181c',
                          border: `1px solid ${selectedNode?.id === node.id ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'}`,
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { if (selectedNode?.id !== node.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if (selectedNode?.id !== node.id) (e.currentTarget as HTMLElement).style.background = '#18181c'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(240,240,243,0.25)' }}>{node.time}</span>
                          <span style={{
                            fontSize: 10.5, padding: '2px 6px', borderRadius: 99,
                            background: node.impact === 'critical' ? '#d44848' : node.impact === 'high' ? '#deaf49' : 'rgba(255,255,255,0.07)',
                            color: node.impact === 'critical' ? '#000000' : node.impact === 'high' ? '#000000' : 'rgba(240,240,243,0.45)',
                          }}>{node.impact}</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.65)', lineHeight: 1.4, margin: 0 }}>{node.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 2, width: `${node.score}%`, background: node.score >= 75 ? '#22c55e' : node.score >= 55 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'rgba(240,240,243,0.30)' }}>{node.score}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail panel */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                  {selectedNode ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'rgba(240,240,243,0.30)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6 }}>{selectedNode.time}</span>
                        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f3', margin: 0 }}>{selectedNode.title}</h2>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                        {/* Score card */}
                        <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.30)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Score</div>
                          <div style={{ fontSize: 24, fontWeight: 800, color: '#f0f0f3', lineHeight: 1 }}>{selectedNode.score}</div>
                          <InlineProgress value={selectedNode.score} color={selectedNode.score >= 75 ? '#22c55e' : '#f59e0b'} />
                        </div>
                        {/* Dimension card */}
                        <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.30)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Dimension</div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f3' }}>{selectedNode.dimension}</div>
                        </div>
                        {/* Impact card */}
                        <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(240,240,243,0.30)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Impact</div>
                          <div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize', color: selectedNode.impact === 'critical' ? '#d44848' : selectedNode.impact === 'high' ? '#deaf49' : 'rgba(240,240,243,0.70)' }}>{selectedNode.impact}</div>
                        </div>
                      </div>
                      <div style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px' }}>
                        <h3 style={{ fontSize: 10.5, fontWeight: 500, color: 'rgba(240,240,243,0.40)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, marginTop: 0 }}>AI Feedback</h3>
                        <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.70)', lineHeight: 1.6, margin: 0 }}>{selectedNode.feedback}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.25)', textAlign: 'center', marginTop: 48 }}>Select a decision node to review</p>
                  )}
                </div>
              </>
            )}

            {activeTab === 'skills' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Radar */}
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

                {/* Score breakdown */}
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

                  {/* RRI box */}
                  <div style={{ marginTop: 8, padding: 12, background: 'rgba(20,123,88,0.08)', border: '1px solid rgba(20,123,88,0.2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11.5, color: 'rgba(52,211,153,0.7)', marginBottom: 4 }}>Role Readiness Index</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#02ba67', lineHeight: 1 }}>{rri}%</div>
                    <p style={{ fontSize: 11.5, color: 'rgba(240,240,243,0.40)', marginTop: 4, marginBottom: 6 }}>vs Senior PM benchmark (100%)</p>
                    <InlineProgress value={rri} color="#147b58" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatif' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 500, color: '#f0f0f3', marginBottom: 8, marginTop: 0 }}>Explore Alternative Decisions</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.40)', marginBottom: 24, marginTop: 0 }}>Select any fork point to simulate what would have happened with a different choice.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {DECISION_NODES.slice(0, 3).map(node => (
                    <div key={node.id} style={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'rgba(240,240,243,0.25)', marginRight: 8 }}>{node.time}</span>
                          <span style={{ fontSize: 13.5, color: 'rgba(240,240,243,0.75)' }}>{node.title}</span>
                        </div>
                        <button
                          onClick={() => alert('What-If simulation: In a full build, this re-runs the session from this decision point with an alternative choice, showing a 3-turn outcome chain.')}
                          style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(240,240,243,0.7)', cursor: 'pointer', flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </WindowChrome>
      </div>
    </div>
  );
}
