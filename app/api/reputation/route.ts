/**
 * GET /api/reputation?userId=...
 * POST /api/reputation — update reputation after session completion
 *
 * Persistent user reputation system — performance carries across companies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  computeReputationSnapshot,
  updateReputationRecord,
  generateReputationSignal,
  type ReputationUpdate,
} from '@/lib/services/reputation-engine';
import type { SimDomain, SkillScores } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const targetCompanyId = req.nextUrl.searchParams.get('targetCompanyId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let records: any[] = [];
    try {
      records = await prisma.userReputation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
    } catch {
      // Table may not exist yet
    }

    const snapshot = computeReputationSnapshot(
      records.map(r => ({
        companyId: r.companyId,
        domain: r.domain as SimDomain,
        sessionsCompleted: r.sessionsCompleted,
        avgComposite: r.avgComposite,
        avgTrust: r.avgTrust,
        bestScore: r.bestScore,
        totalConstraints: r.totalConstraints,
        skillSnapshot: (r.skillSnapshot as SkillScores) ?? {
          prioritisation: 0, stakeholderMgmt: 0, communication: 0,
          conflictResolution: 0, strategicThinking: 0, executionSpeed: 0,
        },
      }))
    );

    // If a target company is specified, generate a reputation signal
    let signal = null;
    if (targetCompanyId) {
      signal = generateReputationSignal(snapshot, targetCompanyId);
    }

    return NextResponse.json({ reputation: snapshot, signal });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ReputationUpdate;
    const { userId, companyId, domain, compositeScore, avgTrust, constraintsFound, skillScores } = body;

    if (!userId || !companyId || !domain) {
      return NextResponse.json({ error: 'userId, companyId, and domain are required' }, { status: 400 });
    }

    // Get existing reputation record
    let existing: any = null;
    try {
      existing = await prisma.userReputation.findUnique({
        where: { userId_companyId: { userId, companyId } },
      });
    } catch {
      // Table may not exist
    }

    const updated = updateReputationRecord(
      existing ? {
        sessionsCompleted: existing.sessionsCompleted,
        avgComposite: existing.avgComposite,
        avgTrust: existing.avgTrust,
        bestScore: existing.bestScore,
        totalConstraints: existing.totalConstraints,
        skillSnapshot: (existing.skillSnapshot as SkillScores) ?? skillScores,
      } : null,
      body,
    );

    // Upsert reputation record
    let record = null;
    try {
      record = await prisma.userReputation.upsert({
        where: { userId_companyId: { userId, companyId } },
        create: {
          userId,
          companyId,
          domain,
          ...updated,
          skillSnapshot: updated.skillSnapshot as any,
          lastPlayedAt: new Date(),
        },
        update: {
          ...updated,
          skillSnapshot: updated.skillSnapshot as any,
          lastPlayedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch {
      // Table may not exist — return computed values anyway
    }

    return NextResponse.json({ reputation: record ?? updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
