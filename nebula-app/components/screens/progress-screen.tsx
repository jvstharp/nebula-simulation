"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CHARACTERS, SKILL_LABELS } from "@/lib/data";
import { WindowChrome } from "@/components/layout/window-chrome";
import { Sidebar } from "@/components/layout/sidebar";

const BADGES = [
  { id: 1, name: 'Tactful Negotiator', icon: '🤝', description: 'Resolved stakeholder conflict without escalation', earned: true, color: '#7c3aed' },
  { id: 2, name: 'Crisis Composer', icon: '⚡', description: 'Maintained composure during a chaos event', earned: true, color: '#d97706' },
  { id: 3, name: 'Data-Driven Decider', icon: '📊', description: 'Made 3 consecutive evidence-backed decisions', earned: false, color: '#0891b2' },
];

const HISTORY = [
  { session: 1, date: 'Today', score: 72, scenario: 'The Roadmap Reckoning', status: 'completed' },
];

const MOCK_PORTFOLIO_HISTORY = [
  {
    id: 'session-001',
    sessionNumber: 1,
    scenarioName: 'The Roadmap Reckoning',
    sessionDate: new Date(),
    rri: 67,
  },
];

export function ProgressScreen() {
  const { setScreen, user, characters, session } = useAppStore();
  const [activeTab, setActiveTab] = useState<'progress' | 'portfolio'>('progress');

  const rri = 67;
  const skillScores = { prioritisation: 72, stakeholderMgmt: 61, communication: 84, conflictResolution: 68, strategicThinking: 79, executionSpeed: 65 };

  // Show Portfolio tab if user has at least one completed session
  const hasPortfolio = MOCK_PORTFOLIO_HISTORY.length > 0 || session?.portfolio?.status === 'ready';

  return (
    <div className="arc-bg min-h-screen flex flex-col p-3 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-violet-900/5 blur-3xl" />
      </div>

      <div className="relative z-10 h-screen">
        <WindowChrome className="h-full flex overflow-hidden" title="Nebula — Progress Dashboard">
          <Sidebar />

          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-semibold text-violet-400">
                  {user?.name?.[0]?.toUpperCase() || 'M'}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{user?.name || 'Maya'}</h2>
                  <p className="text-xs text-white/40">Product Manager · Intermediate Track</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-violet-400">{rri}%</div>
                  <div className="text-xs text-white/30">Role Readiness</div>
                </div>
                <Button onClick={() => setScreen('browser')}>Continue Training →</Button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-white/5 px-6">
              {([
                { id: 'progress', label: '📈 Progress' },
                ...(hasPortfolio ? [{ id: 'portfolio', label: '📄 Portfolio' }] : []),
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'progress' | 'portfolio')}
                  className={`px-4 py-3 text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'text-white border-white/50' : 'text-white/35 border-transparent hover:text-white/60'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Portfolio tab */}
            {activeTab === 'portfolio' && (
              <div className="p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Your Portfolio</h3>
                  <p className="text-xs text-white/30">Case studies from completed sessions — employer-ready, always downloadable</p>
                </div>

                {MOCK_PORTFOLIO_HISTORY.length === 0 ? (
                  <div className="bg-white/3 rounded-2xl border border-white/8 p-8 text-center">
                    <div className="text-3xl mb-3">📄</div>
                    <p className="text-sm text-white/50">Complete your first session to generate your first case study.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {MOCK_PORTFOLIO_HISTORY.map(p => (
                      <div key={p.id} className="bg-white/3 rounded-xl border border-white/8 p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
                          {p.rri}%
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white font-medium">{p.scenarioName}</div>
                          <div className="text-xs text-white/35 mt-0.5">
                            Session {p.sessionNumber} of 3 · {p.sessionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setScreen('replay')}>View</Button>
                        <Button size="sm" onClick={() => alert('PDF download — fetches presigned S3 URL for session: ' + p.id)}>Download PDF ↓</Button>
                      </div>
                    ))}

                    <div className="mt-4 p-3 bg-white/2 rounded-xl border border-white/6 text-center">
                      <p className="text-xs text-white/25">Complete all 3 sessions in the arc to unlock an <span className="text-violet-400">Arc Summary</span> case study covering your full journey.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && <div className="p-6 grid grid-cols-3 gap-6">
              {/* Skill scores */}
              <div className="col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-white">Skill Progress</h3>
                <div className="bg-white/3 rounded-xl border border-white/8 p-4 space-y-4">
                  {Object.entries(skillScores).map(([key, score]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/60">{SKILL_LABELS[key]}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-[10px]">Benchmark: 80</span>
                          <span className={`font-medium ${score >= 75 ? 'text-green-400' : score >= 55 ? 'text-amber-400' : 'text-red-400'}`}>{score}</span>
                        </div>
                      </div>
                      <div className="relative h-1.5">
                        {/* Benchmark marker */}
                        <div className="absolute top-0 h-full w-px bg-white/20 z-10" style={{ left: '80%' }} />
                        <Progress value={score} color={score >= 75 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444'} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Session history */}
                <h3 className="text-sm font-semibold text-white mt-2">Session History</h3>
                {HISTORY.map(h => (
                  <div key={h.session} className="bg-white/3 rounded-xl border border-white/8 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">{h.score}</div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{h.scenario} · Session {h.session}</div>
                      <div className="text-xs text-white/35 mt-0.5">{h.date} · Completed</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setScreen('replay')}>View Replay</Button>
                  </div>
                ))}

                {/* Reputation */}
                <h3 className="text-sm font-semibold text-white mt-2">Team Reputation</h3>
                <div className="bg-white/3 rounded-xl border border-white/8 p-4 space-y-3">
                  {characters.map(char => (
                    <div key={char.id} className="flex items-center gap-3">
                      <Avatar name={char.name} color={char.color} size="sm" />
                      <div className="flex-1">
                        <div className="text-xs text-white/65 mb-1">{char.name}</div>
                        <Progress value={char.trust * 100} color={char.trust >= 0.7 ? '#22c55e' : char.trust >= 0.45 ? '#f59e0b' : '#ef4444'} />
                      </div>
                      <span className="text-xs text-white/30 w-8 text-right">{Math.round(char.trust * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* RRI */}
                <div className="bg-violet-500/8 border border-violet-500/20 rounded-xl p-4">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">Role Readiness</h3>
                  <div className="text-4xl font-bold text-violet-400 mb-1">{rri}%</div>
                  <p className="text-xs text-white/35 mb-3">vs Senior PM benchmark</p>
                  <Progress value={rri} color="#7c3aed" />
                  <p className="text-xs text-white/30 mt-2">+{rri} points since baseline</p>
                </div>

                {/* Credits */}
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                  <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">Nebula Credits</h3>
                  <div className="text-3xl font-bold text-amber-400">⚡ {user?.credits || 10}</div>
                  <p className="text-xs text-white/30 mt-1">Used for AI hints during sessions</p>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Badges</h3>
                  <div className="space-y-2">
                    {BADGES.map(badge => (
                      <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.earned ? 'bg-white/4 border-white/10' : 'bg-white/1 border-white/5 opacity-40'}`}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${badge.color}20`, border: `1px solid ${badge.color}30` }}>
                          {badge.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{badge.name}</div>
                          <div className="text-[10px] text-white/30 truncate">{badge.description}</div>
                        </div>
                        {!badge.earned && <span className="text-[10px] text-white/20">Locked</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </WindowChrome>
      </div>
    </div>
  );
}
