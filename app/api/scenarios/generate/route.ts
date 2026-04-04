/**
 * POST /api/scenarios/generate
 *
 * Intelligence Engine endpoint — generates a complete simulation scenario
 * from company + role + difficulty inputs. No more hand-authored content required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateScenario, type ScenarioGenerationInput } from '@/lib/services/intelligence-engine';
import { COMPANY_CATALOG } from '@/lib/data';
import type { SimDomain, DifficultyLevel, CompanyStableData, CompanyDynamicSeed } from '@/lib/types';

// Allow up to 60s for Sonnet-class scenario generation
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 500 });
    }

    const body = await req.json();
    const {
      companyId,
      company: requestCompany,
      domain,
      difficulty = 'standard',
      roleTitle,
      userId,
      characters: requestCharacters,
    } = body as {
      companyId: string;
      company?: import('@/lib/types').SimCompany;
      domain: SimDomain;
      difficulty: DifficultyLevel;
      roleTitle: string;
      userId?: string;
      characters?: import('@/lib/types').Character[];
    };

    if (!companyId || !domain || !roleTitle) {
      return NextResponse.json({ error: 'companyId, domain, and roleTitle are required' }, { status: 400 });
    }

    // Try to get company from DB first, fall back to hardcoded catalog, then to the passed company object
    let companyRecord = null;
    try {
      companyRecord = await prisma.company.findUnique({ where: { id: companyId } });
    } catch {
      // Table may not exist yet — fall back to catalog
    }

    const catalogEntry = COMPANY_CATALOG[companyId];
    if (!companyRecord && !catalogEntry && !requestCompany) {
      return NextResponse.json({ error: `Company ${companyId} not found` }, { status: 404 });
    }

    const company = companyRecord
      ? {
          id: companyRecord.id,
          name: companyRecord.name,
          industry: companyRecord.industry,
          size: companyRecord.size,
          tagline: companyRecord.tagline,
          challenge: companyRecord.challenge,
          why: '',
          videoKeyword: companyRecord.videoKeyword,
        }
      : (catalogEntry?.company ?? requestCompany!);

    // Get user reputation if userId provided
    let userReputation = null;
    if (userId) {
      try {
        const reps = await prisma.userReputation.findMany({
          where: { userId },
        });
        if (reps.length > 0) {
          const totalSessions = reps.reduce((s, r) => s + r.sessionsCompleted, 0);
          const avgScore = reps.reduce((s, r) => s + r.avgComposite * r.sessionsCompleted, 0) / Math.max(totalSessions, 1);
          userReputation = {
            tier: reps[0].reputationTier,
            avgScore,
            sessionsCompleted: totalSessions,
          };
        }
      } catch {
        // Reputation table may not exist yet
      }
    }

    // Get cross-company context
    let crossCompanyContext: { companyId: string; companyName: string; industry: string }[] = [];
    try {
      const companies = await prisma.company.findMany({
        where: { active: true, id: { not: companyId } },
        select: { id: true, name: true, industry: true },
        take: 5,
      });
      crossCompanyContext = companies.map(c => ({
        companyId: c.id,
        companyName: c.name,
        industry: c.industry,
      }));
    } catch {
      // Fall back to catalog companies
      crossCompanyContext = Object.values(COMPANY_CATALOG)
        .filter(c => c.company.id !== companyId)
        .slice(0, 5)
        .map(c => ({ companyId: c.company.id, companyName: c.company.name, industry: c.company.industry }));
    }

    // Use characters from request, catalog, or let the engine generate them
    const characters = requestCharacters ?? catalogEntry?.characters ?? undefined;

    const input: ScenarioGenerationInput = {
      company,
      stableData: (companyRecord?.stableData as unknown as CompanyStableData) ?? null,
      dynamicSeed: (companyRecord?.dynamicSeed as unknown as CompanyDynamicSeed) ?? null,
      domain,
      difficulty,
      roleTitle,
      characters,
      userReputation,
      crossCompanyContext,
    };

    const scenarioData = await generateScenario(input);

    // Save generated scenario to DB
    let savedScenario = null;
    try {
      savedScenario = await prisma.generatedScenario.create({
        data: {
          companyId,
          domain,
          difficulty,
          roleTitle,
          scenarioData: scenarioData as any,
          generatedBy: 'claude-sonnet',
        },
      });
    } catch {
      // DB may not have the table yet — return the scenario anyway
    }

    return NextResponse.json({
      scenario: scenarioData,
      scenarioId: savedScenario?.id ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Scenario generation error:', message, err instanceof Error ? err.stack : err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
