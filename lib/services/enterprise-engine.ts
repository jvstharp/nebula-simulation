/**
 * Enterprise Engine — Phase 5
 *
 * Manages enterprise-tier features: private Nebula worlds,
 * cohort tracking, and manager dashboards.
 */

import type {
  SimDomain,
  SkillScores,
  ManagerDashboardData,
  CohortMemberProgress,
  OrganizationRecord,
  CohortRecord,
} from '../types';

// ── Cohort Analytics ────────────────────────────────────────────────────────

export interface CohortAnalytics {
  cohortId: string;
  totalMembers: number;
  activeMembers: number;
  completionRate: number;
  avgScore: number;
  skillDistribution: {
    skill: string;
    avg: number;
    p25: number;
    p75: number;
    min: number;
    max: number;
  }[];
  domainCompletion: Partial<Record<SimDomain, { completed: number; total: number; avgScore: number }>>;
  weeklyActivity: { week: string; sessionsCompleted: number; avgScore: number }[];
}

/**
 * Compute analytics for a cohort from member progress data.
 */
export function computeCohortAnalytics(
  cohortId: string,
  members: CohortMemberProgress[],
  totalScenarios: number,
): CohortAnalytics {
  const activeMembers = members.filter(m => m.lastActiveAt && Date.now() - m.lastActiveAt.getTime() < 7 * 24 * 60 * 60 * 1000).length;

  const completedMembers = members.filter(m => m.completedScenarios >= totalScenarios);
  const completionRate = members.length > 0 ? completedMembers.length / members.length : 0;

  const scores = members.filter(m => m.avgScore > 0).map(m => m.avgScore);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  // Skill distribution
  const skillKeys: (keyof SkillScores)[] = [
    'prioritisation', 'stakeholderMgmt', 'communication',
    'conflictResolution', 'strategicThinking', 'executionSpeed',
  ];

  const skillDistribution = skillKeys.map(skill => {
    const values = members
      .filter(m => m.skillBreakdown[skill] > 0)
      .map(m => m.skillBreakdown[skill])
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return { skill, avg: 0, p25: 0, p75: 0, min: 0, max: 0 };
    }

    return {
      skill,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      p25: values[Math.floor(values.length * 0.25)] ?? 0,
      p75: values[Math.floor(values.length * 0.75)] ?? 0,
      min: values[0],
      max: values[values.length - 1],
    };
  });

  return {
    cohortId,
    totalMembers: members.length,
    activeMembers,
    completionRate: Math.round(completionRate * 100),
    avgScore: Math.round(avgScore),
    skillDistribution,
    domainCompletion: {},
    weeklyActivity: [],
  };
}

// ── Manager Dashboard ───────────────────────────────────────────────────────

export interface ManagerInsight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

/**
 * Generate actionable insights for managers from dashboard data.
 */
export function generateManagerInsights(data: ManagerDashboardData): ManagerInsight[] {
  const insights: ManagerInsight[] = [];

  // Active engagement
  if (data.totalMembers > 0) {
    const engagementRate = data.activeThisWeek / data.totalMembers;
    if (engagementRate < 0.3) {
      insights.push({
        type: 'warning',
        title: 'Low engagement',
        description: `Only ${Math.round(engagementRate * 100)}% of members were active this week. Consider sending a reminder or adjusting scenario difficulty.`,
      });
    } else if (engagementRate > 0.7) {
      insights.push({
        type: 'success',
        title: 'High engagement',
        description: `${Math.round(engagementRate * 100)}% of members were active this week — strong participation.`,
      });
    }
  }

  // Score trends
  if (data.avgOrgScore > 0) {
    if (data.avgOrgScore >= 75) {
      insights.push({
        type: 'success',
        title: 'Strong performance',
        description: `Average org score is ${data.avgOrgScore}. Your team is performing above industry benchmarks.`,
      });
    } else if (data.avgOrgScore < 50) {
      insights.push({
        type: 'warning',
        title: 'Performance opportunity',
        description: `Average org score is ${data.avgOrgScore}. Consider offering guided-difficulty scenarios to build confidence.`,
      });
    }
  }

  // Domain balance
  const domains = Object.entries(data.domainBreakdown);
  if (domains.length > 0) {
    const underexplored = domains.filter(([, d]) => d.completed === 0);
    if (underexplored.length > 0) {
      insights.push({
        type: 'info',
        title: 'Unexplored domains',
        description: `No sessions completed in: ${underexplored.map(([d]) => d).join(', ')}. Diversifying builds well-rounded skills.`,
      });
    }
  }

  // Top performers
  if (data.topPerformers.length > 0 && data.topPerformers[0].score >= 85) {
    insights.push({
      type: 'success',
      title: 'Star performers',
      description: `${data.topPerformers[0].name} leads with a score of ${data.topPerformers[0].score}. Consider them for mentoring roles.`,
    });
  }

  return insights;
}

// ── Feature Access Control ──────────────────────────────────────────────────

export const PLAN_FEATURES: Record<string, Record<string, boolean>> = {
  free: {
    basicSimulation: true,
    portfolioGeneration: true,
    singleDomain: true,
    crossCompany: false,
    cohortManagement: false,
    managerDashboard: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
    dynamicScenarios: false,
  },
  pro: {
    basicSimulation: true,
    portfolioGeneration: true,
    singleDomain: false,
    allDomains: true,
    crossCompany: true,
    cohortManagement: false,
    managerDashboard: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: true,
    dynamicScenarios: true,
  },
  enterprise: {
    basicSimulation: true,
    portfolioGeneration: true,
    allDomains: true,
    crossCompany: true,
    cohortManagement: true,
    managerDashboard: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
    dynamicScenarios: true,
    privateWorld: true,
    ssoAuth: true,
  },
};

export function hasFeature(plan: string, feature: string): boolean {
  return PLAN_FEATURES[plan]?.[feature] ?? false;
}
