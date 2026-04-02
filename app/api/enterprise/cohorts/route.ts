/**
 * GET /api/enterprise/cohorts?orgId=...
 * POST /api/enterprise/cohorts — Create a new cohort
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
    }

    let cohorts: any[] = [];
    try {
      cohorts = await prisma.cohort.findMany({
        where: { orgId },
        include: {
          members: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return NextResponse.json({ error: 'Enterprise tables not yet available' }, { status: 503 });
    }

    return NextResponse.json({
      cohorts: cohorts.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        scenarioIds: c.scenarioIds,
        domains: c.domains,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        memberCount: c.members.length,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, name, description, scenarioIds, domains, startsAt, endsAt, memberUserIds } = body;

    if (!orgId || !name) {
      return NextResponse.json({ error: 'orgId and name are required' }, { status: 400 });
    }

    let cohort: any;
    try {
      cohort = await prisma.cohort.create({
        data: {
          orgId,
          name,
          description: description ?? null,
          scenarioIds: scenarioIds ?? [],
          domains: domains ?? [],
          startsAt: startsAt ? new Date(startsAt) : null,
          endsAt: endsAt ? new Date(endsAt) : null,
        },
      });

      // Add members if provided
      if (memberUserIds?.length > 0) {
        await prisma.cohortMember.createMany({
          data: memberUserIds.map((userId: string) => ({
            cohortId: cohort.id,
            userId,
          })),
        });
      }
    } catch {
      return NextResponse.json({ error: 'Enterprise tables not yet available' }, { status: 503 });
    }

    return NextResponse.json({ cohort });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
