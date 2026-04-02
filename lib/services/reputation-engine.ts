/**
 * Reputation Engine — Phase 5
 *
 * Manages persistent user reputation across companies and domains.
 * Performance at Company X carries as a signal into Company Y's onboarding.
 */

import type { SkillScores } from '../types';
import { computeReputationTier, type ReputationTier, type SimDomain } from '../types';

export interface ReputationUpdate {
  userId: string;
  companyId: string;
  domain: SimDomain;
  compositeScore: number;
  avgTrust: number;
  constraintsFound: number;
  skillScores: SkillScores;
}

export interface ReputationSnapshot {
  overallTier: ReputationTier;
  totalSessions: number;
  avgComposite: number;
  strongestDomain: SimDomain | null;
  weakestSkill: string | null;
  companiesPlayed: string[];
  domainBreakdown: Partial<Record<SimDomain, {
    sessions: number;
    avgScore: number;
    tier: ReputationTier;
  }>>;
}

/**
 * Compute a reputation snapshot from multiple company records.
 */
export function computeReputationSnapshot(
  records: Array<{
    companyId: string;
    domain: SimDomain;
    sessionsCompleted: number;
    avgComposite: number;
    avgTrust: number;
    bestScore: number;
    totalConstraints: number;
    skillSnapshot: SkillScores;
  }>
): ReputationSnapshot {
  if (records.length === 0) {
    return {
      overallTier: 'newcomer',
      totalSessions: 0,
      avgComposite: 0,
      strongestDomain: null,
      weakestSkill: null,
      companiesPlayed: [],
      domainBreakdown: {},
    };
  }

  const totalSessions = records.reduce((sum, r) => sum + r.sessionsCompleted, 0);
  const weightedComposite = records.reduce(
    (sum, r) => sum + r.avgComposite * r.sessionsCompleted, 0
  ) / Math.max(totalSessions, 1);

  // Domain breakdown
  const domainBreakdown: ReputationSnapshot['domainBreakdown'] = {};
  const domainGroups: Partial<Record<SimDomain, typeof records>> = {};

  for (const r of records) {
    if (!domainGroups[r.domain]) domainGroups[r.domain] = [];
    domainGroups[r.domain]!.push(r);
  }

  let strongestDomain: SimDomain | null = null;
  let strongestScore = -1;

  for (const [domain, group] of Object.entries(domainGroups) as [SimDomain, typeof records][]) {
    const sessions = group.reduce((s, r) => s + r.sessionsCompleted, 0);
    const avgScore = group.reduce((s, r) => s + r.avgComposite * r.sessionsCompleted, 0) / Math.max(sessions, 1);
    const tier = computeReputationTier(avgScore, sessions);
    domainBreakdown[domain] = { sessions, avgScore, tier };

    if (avgScore > strongestScore) {
      strongestScore = avgScore;
      strongestDomain = domain;
    }
  }

  // Find weakest skill across all records
  const skillTotals: Record<string, { sum: number; count: number }> = {};
  for (const r of records) {
    for (const [skill, score] of Object.entries(r.skillSnapshot)) {
      if (!skillTotals[skill]) skillTotals[skill] = { sum: 0, count: 0 };
      skillTotals[skill].sum += score * r.sessionsCompleted;
      skillTotals[skill].count += r.sessionsCompleted;
    }
  }

  let weakestSkill: string | null = null;
  let weakestScore = Infinity;
  for (const [skill, { sum, count }] of Object.entries(skillTotals)) {
    const avg = sum / Math.max(count, 1);
    if (avg < weakestScore) {
      weakestScore = avg;
      weakestSkill = skill;
    }
  }

  return {
    overallTier: computeReputationTier(weightedComposite, totalSessions),
    totalSessions,
    avgComposite: Math.round(weightedComposite),
    strongestDomain,
    weakestSkill,
    companiesPlayed: [...new Set(records.map(r => r.companyId))],
    domainBreakdown,
  };
}

/**
 * Compute updated reputation record after a session completes.
 */
export function updateReputationRecord(
  existing: {
    sessionsCompleted: number;
    avgComposite: number;
    avgTrust: number;
    bestScore: number;
    totalConstraints: number;
    skillSnapshot: SkillScores;
  } | null,
  update: ReputationUpdate,
): {
  sessionsCompleted: number;
  avgComposite: number;
  avgTrust: number;
  bestScore: number;
  totalConstraints: number;
  skillSnapshot: SkillScores;
  reputationTier: ReputationTier;
} {
  if (!existing) {
    return {
      sessionsCompleted: 1,
      avgComposite: update.compositeScore,
      avgTrust: update.avgTrust,
      bestScore: update.compositeScore,
      totalConstraints: update.constraintsFound,
      skillSnapshot: update.skillScores,
      reputationTier: computeReputationTier(update.compositeScore, 1),
    };
  }

  const newCount = existing.sessionsCompleted + 1;
  const newAvgComposite = (existing.avgComposite * existing.sessionsCompleted + update.compositeScore) / newCount;
  const newAvgTrust = (existing.avgTrust * existing.sessionsCompleted + update.avgTrust) / newCount;

  // Blend skill scores (exponential moving average, recent sessions weight more)
  const alpha = 0.4; // weight for new session
  const blendedSkills: SkillScores = {
    prioritisation: existing.skillSnapshot.prioritisation * (1 - alpha) + update.skillScores.prioritisation * alpha,
    stakeholderMgmt: existing.skillSnapshot.stakeholderMgmt * (1 - alpha) + update.skillScores.stakeholderMgmt * alpha,
    communication: existing.skillSnapshot.communication * (1 - alpha) + update.skillScores.communication * alpha,
    conflictResolution: existing.skillSnapshot.conflictResolution * (1 - alpha) + update.skillScores.conflictResolution * alpha,
    strategicThinking: existing.skillSnapshot.strategicThinking * (1 - alpha) + update.skillScores.strategicThinking * alpha,
    executionSpeed: existing.skillSnapshot.executionSpeed * (1 - alpha) + update.skillScores.executionSpeed * alpha,
  };

  return {
    sessionsCompleted: newCount,
    avgComposite: Math.round(newAvgComposite * 10) / 10,
    avgTrust: Math.round(newAvgTrust * 1000) / 1000,
    bestScore: Math.max(existing.bestScore, update.compositeScore),
    totalConstraints: existing.totalConstraints + update.constraintsFound,
    skillSnapshot: blendedSkills,
    reputationTier: computeReputationTier(newAvgComposite, newCount),
  };
}

/**
 * Generate a reputation-aware onboarding signal for a new company.
 * This informs the scenario's initial conditions.
 */
export function generateReputationSignal(
  snapshot: ReputationSnapshot,
  targetCompanyId: string,
): {
  trustBonus: number;
  difficultyAdjustment: 'easier' | 'standard' | 'harder';
  narrativeHook: string;
} {
  const played = snapshot.companiesPlayed.includes(targetCompanyId);

  if (snapshot.overallTier === 'expert') {
    return {
      trustBonus: 0.05,
      difficultyAdjustment: 'harder',
      narrativeHook: played
        ? 'Your track record here precedes you — expectations are high.'
        : 'Word of your work at other companies has reached us. People are watching.',
    };
  }

  if (snapshot.overallTier === 'trusted') {
    return {
      trustBonus: 0.03,
      difficultyAdjustment: 'standard',
      narrativeHook: played
        ? 'You have a solid foundation here. Time to build on it.'
        : 'Your reputation from previous engagements gives you a slight edge.',
    };
  }

  if (snapshot.overallTier === 'reliable') {
    return {
      trustBonus: 0.01,
      difficultyAdjustment: 'standard',
      narrativeHook: 'You are building your track record. Every interaction counts.',
    };
  }

  return {
    trustBonus: 0,
    difficultyAdjustment: 'easier',
    narrativeHook: 'Welcome to the corporate world. Everyone starts somewhere.',
  };
}
