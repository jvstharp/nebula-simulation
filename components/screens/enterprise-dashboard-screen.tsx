'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  Building2, Users, TrendingUp, Target, BarChart3,
  ChevronRight, Award, BookOpen, AlertTriangle, Info, CheckCircle2,
} from 'lucide-react';
import type { ManagerDashboardData, SimDomain } from '@/lib/types';

const DOMAIN_COLORS: Record<string, string> = {
  pm: '#6366f1',
  consulting: '#f59e0b',
  marketing: '#ec4899',
  data_analysis: '#14b8a6',
};

const DOMAIN_LABELS: Record<string, string> = {
  pm: 'Product Management',
  consulting: 'Consulting',
  marketing: 'Marketing',
  data_analysis: 'Data & Analysis',
};

interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

export default function EnterpriseDashboardScreen() {
  const { setScreen } = useAppStore();
  const [dashboard, setDashboard] = useState<ManagerDashboardData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cohorts' | 'members'>('overview');

  useEffect(() => {
    // For now, show a demo dashboard. In production, fetch from /api/enterprise/dashboard
    setLoading(false);
    setDashboard({
      org: {
        id: 'demo',
        name: 'Acme Learning & Development',
        slug: 'acme-ld',
        plan: 'enterprise',
        maxSeats: 50,
        features: { managerDashboard: true, cohortManagement: true, allDomains: true },
        branding: {},
      },
      cohorts: [
        { id: '1', orgId: 'demo', name: 'Q2 PM Bootcamp', description: 'New PM hires onboarding', scenarioIds: ['nexus-technologies', 'orbit-layer'], domains: ['pm'] as SimDomain[], startsAt: new Date('2026-03-15'), endsAt: new Date('2026-04-30') },
        { id: '2', orgId: 'demo', name: 'Cross-functional Leaders', description: 'Senior ICs developing breadth', scenarioIds: ['beacon-mercer', 'verve-market', 'silverline-capital'], domains: ['consulting', 'marketing', 'data_analysis'] as SimDomain[], startsAt: new Date('2026-03-01'), endsAt: null },
      ],
      totalMembers: 24,
      activeThisWeek: 18,
      avgOrgScore: 72,
      topPerformers: [
        { userId: '1', name: 'Sarah Mitchell', score: 91 },
        { userId: '2', name: 'James Chen', score: 87 },
        { userId: '3', name: 'Priya Sharma', score: 84 },
        { userId: '4', name: 'Tom Rivera', score: 81 },
        { userId: '5', name: 'Elena Park', score: 78 },
      ],
      domainBreakdown: {
        pm: { completed: 42, avgScore: 74 },
        consulting: { completed: 18, avgScore: 69 },
        marketing: { completed: 8, avgScore: 71 },
        data_analysis: { completed: 5, avgScore: 68 },
      },
      recentActivity: [
        { userId: '1', name: 'Sarah Mitchell', company: 'Nexus Technologies', score: 88, completedAt: new Date(Date.now() - 3600000) },
        { userId: '2', name: 'James Chen', company: 'Orbit Layer', score: 82, completedAt: new Date(Date.now() - 7200000) },
        { userId: '3', name: 'Priya Sharma', company: 'Beacon Mercer', score: 79, completedAt: new Date(Date.now() - 14400000) },
      ],
    });
    setInsights([
      { type: 'success', title: 'High engagement', description: '75% of members were active this week — strong participation.' },
      { type: 'info', title: 'Unexplored domains', description: 'Data & Analysis has only 5 completions. Diversifying builds well-rounded skills.' },
      { type: 'success', title: 'Star performers', description: 'Sarah Mitchell leads with a score of 91. Consider her for mentoring roles.' },
    ]);
  }, []);

  const InsightIcon = ({ type }: { type: string }) => {
    if (type === 'success') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a0f]">
        <div className="text-white/50">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0a0f] text-white overflow-y-auto">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <div>
              <h1 className="text-lg font-semibold">{dashboard.org.name}</h1>
              <p className="text-xs text-white/40">Enterprise Dashboard — {dashboard.org.plan} plan</p>
            </div>
          </div>
          <button
            onClick={() => setScreen('desktop')}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Back to Nebula
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-4 mt-4">
          {(['overview', 'cohorts', 'members'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm pb-2 border-b-2 transition-colors capitalize ${
                activeTab === tab ? 'border-indigo-500 text-white' : 'border-transparent text-white/40 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Members', value: dashboard.totalMembers, icon: Users, color: '#6366f1' },
                { label: 'Active This Week', value: dashboard.activeThisWeek, icon: TrendingUp, color: '#22c55e' },
                { label: 'Avg Score', value: dashboard.avgOrgScore, icon: Target, color: '#f59e0b' },
                { label: 'Sessions Completed', value: Object.values(dashboard.domainBreakdown).reduce((s, d) => s + d.completed, 0), icon: BarChart3, color: '#ec4899' },
              ].map(kpi => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">{kpi.label}</span>
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Domain Breakdown */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="text-sm font-medium mb-4">Domain Performance</h3>
              <div className="space-y-3">
                {Object.entries(dashboard.domainBreakdown).map(([domain, data]) => (
                  <div key={domain} className="flex items-center gap-4">
                    <span className="text-xs text-white/60 w-32">{DOMAIN_LABELS[domain] ?? domain}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${data.avgScore}%`,
                          backgroundColor: DOMAIN_COLORS[domain] ?? '#6366f1',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/70 w-12 text-right">{data.avgScore}%</span>
                    <span className="text-xs text-white/40 w-16 text-right">{data.completed} done</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights + Top Performers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Insights */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-sm font-medium mb-3">Insights</h3>
                <div className="space-y-3">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <InsightIcon type={insight.type} />
                      <div>
                        <div className="text-xs font-medium">{insight.title}</div>
                        <div className="text-xs text-white/40 mt-0.5">{insight.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-sm font-medium mb-3">Top Performers</h3>
                <div className="space-y-2">
                  {dashboard.topPerformers.map((p, i) => (
                    <div key={p.userId} className="flex items-center gap-3">
                      <span className={`text-xs font-mono w-5 ${i < 3 ? 'text-yellow-400' : 'text-white/30'}`}>
                        #{i + 1}
                      </span>
                      <Award className={`w-3.5 h-3.5 ${i < 3 ? 'text-yellow-400' : 'text-white/20'}`} />
                      <span className="text-sm flex-1">{p.name}</span>
                      <span className="text-xs font-mono text-indigo-400">{p.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {dashboard.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-white/70 flex-1">{a.name}</span>
                    <span className="text-xs text-white/40">{a.company}</span>
                    <span className="text-xs font-mono text-indigo-400 w-8 text-right">{a.score}</span>
                    <span className="text-xs text-white/30">
                      {Math.round((Date.now() - new Date(a.completedAt).getTime()) / 3600000)}h ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'cohorts' && (
          <div className="space-y-4">
            {dashboard.cohorts.map(cohort => (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-indigo-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{cohort.name}</h3>
                    <p className="text-xs text-white/40 mt-1">{cohort.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex gap-1.5">
                    {cohort.domains.map(d => (
                      <span
                        key={d}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${DOMAIN_COLORS[d]}20`, color: DOMAIN_COLORS[d] }}
                      >
                        {DOMAIN_LABELS[d]}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-white/40">
                    {cohort.scenarioIds.length} scenarios
                  </span>
                  {cohort.startsAt && (
                    <span className="text-xs text-white/30">
                      Started {new Date(cohort.startsAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="text-sm text-white/40 text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2 text-white/20" />
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-white/20" />
              Member management — invite members, assign cohorts, and track individual progress.
              <br />
              <span className="text-xs">Connect your organization to see member data.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
