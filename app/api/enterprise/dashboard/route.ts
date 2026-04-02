/**
 * GET /api/enterprise/dashboard?orgId=...
 *
 * Manager dashboard — cohort tracking, performance analytics, insights.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateManagerInsights } from '@/lib/services/enterprise-engine';
import type { ManagerDashboardData, SimDomain, SkillScores } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
    }

    // Get organization
    let org: any;
    try {
      org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
          members: true,
          cohorts: { include: { members: true } },
        },
      });
    } catch {
      return NextResponse.json({ error: 'Enterprise tables not yet available' }, { status: 503 });
    }

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const memberUserIds = org.members.map((m: any) => m.userId);

    // Get all session results for org members
    let sessionResults: any[] = [];
    try {
      sessionResults = await prisma.sessionResult.findMany({
        where: {
          session: { userId: { in: memberUserIds } },
        },
        include: {
          session: {
            select: { userId: true, scenarioId: true, domain: true, companySlug: true, updatedAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Session results may not exist
    }

    // Compute dashboard data
    const activeThisWeek = new Set(
      sessionResults
        .filter(r => Date.now() - new Date(r.session.updatedAt).getTime() < 7 * 24 * 60 * 60 * 1000)
        .map(r => r.session.userId)
    ).size;

    const avgOrgScore = sessionResults.length > 0
      ? Math.round(sessionResults.reduce((s, r) => s + r.compositeScore, 0) / sessionResults.length)
      : 0;

    // Top performers
    const userScores: Record<string, { total: number; count: number; name: string }> = {};
    for (const r of sessionResults) {
      const uid = r.session.userId;
      if (!userScores[uid]) userScores[uid] = { total: 0, count: 0, name: uid };
      userScores[uid].total += r.compositeScore;
      userScores[uid].count++;
    }
    const topPerformers = Object.entries(userScores)
      .map(([userId, s]) => ({ userId, name: s.name, score: Math.round(s.total / s.count) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Domain breakdown
    const domainBreakdown: Record<string, { completed: number; avgScore: number }> = {};
    for (const r of sessionResults) {
      const domain = r.session.domain ?? 'pm';
      if (!domainBreakdown[domain]) domainBreakdown[domain] = { completed: 0, avgScore: 0 };
      domainBreakdown[domain].completed++;
    }
    for (const [domain, data] of Object.entries(domainBreakdown)) {
      const domainResults = sessionResults.filter(r => (r.session.domain ?? 'pm') === domain);
      data.avgScore = Math.round(domainResults.reduce((s, r) => s + r.compositeScore, 0) / domainResults.length);
    }

    // Recent activity
    const recentActivity = sessionResults.slice(0, 10).map(r => ({
      userId: r.session.userId,
      name: r.session.userId,
      company: r.session.companySlug ?? r.session.scenarioId,
      score: Math.round(r.compositeScore),
      completedAt: r.createdAt,
    }));

    const dashboardData: ManagerDashboardData = {
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        maxSeats: org.maxSeats,
        features: (org.features as Record<string, boolean>) ?? {},
        branding: (org.branding as any) ?? {},
      },
      cohorts: org.cohorts.map((c: any) => ({
        id: c.id,
        orgId: c.orgId,
        name: c.name,
        description: c.description,
        scenarioIds: (c.scenarioIds as string[]) ?? [],
        domains: (c.domains as SimDomain[]) ?? [],
        startsAt: c.startsAt,
        endsAt: c.endsAt,
      })),
      totalMembers: org.members.length,
      activeThisWeek,
      avgOrgScore,
      topPerformers,
      domainBreakdown: domainBreakdown as any,
      recentActivity,
    };

    const insights = generateManagerInsights(dashboardData);

    return NextResponse.json({ dashboard: dashboardData, insights });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
