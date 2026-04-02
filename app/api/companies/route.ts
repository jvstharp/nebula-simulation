/**
 * GET /api/companies — List all active companies with domain info
 * Hybrid: returns DB companies merged with hardcoded catalog.
 */

import { NextResponse } from 'next/server';
import { COMPANY_CATALOG, COMPANY_DOMAIN_MAP } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Build company list from hardcoded catalog
    const catalogCompanies = Object.entries(COMPANY_CATALOG).map(([id, entry]) => ({
      id,
      name: entry.company.name,
      industry: entry.company.industry,
      domain: COMPANY_DOMAIN_MAP[id] ?? 'pm',
      size: entry.company.size,
      tagline: entry.company.tagline,
      challenge: entry.company.challenge,
      videoKeyword: entry.company.videoKeyword,
      source: 'catalog' as const,
      characterCount: entry.characters.length,
    }));

    // Try to merge with DB companies
    let dbCompanies: any[] = [];
    try {
      dbCompanies = await prisma.company.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });
    } catch {
      // Table may not exist
    }

    // Merge: DB takes precedence for matching IDs
    const dbIds = new Set(dbCompanies.map(c => c.id));
    const merged = [
      ...dbCompanies.map(c => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        domain: c.domain,
        size: c.size,
        tagline: c.tagline,
        challenge: c.challenge,
        videoKeyword: c.videoKeyword,
        source: 'database' as const,
        characterCount: null,
      })),
      ...catalogCompanies.filter(c => !dbIds.has(c.id)),
    ];

    // Group by domain
    const byDomain: Record<string, typeof merged> = {};
    for (const company of merged) {
      const d = company.domain;
      if (!byDomain[d]) byDomain[d] = [];
      byDomain[d].push(company);
    }

    return NextResponse.json({
      companies: merged,
      byDomain,
      totalCompanies: merged.length,
      domains: Object.keys(byDomain),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
