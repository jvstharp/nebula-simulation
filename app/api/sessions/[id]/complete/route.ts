import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { calculateScores, ScoredEvent } from '@/lib/scoring';

// POST /api/sessions/[id]/complete — finalise session, run scoring, kick off portfolio generation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await db.simSession.findFirst({
      where: { id, userId: user.id },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { planScore = 0, finalOkrProgress = 0, elapsedSeconds, stateJson } = await req.json().catch(() => ({}));

    // Append completion event
    await db.sessionEvent.create({
      data: {
        sessionId: id,
        type: 'session_completed',
        payload: { planScore, finalOkrProgress, elapsedSeconds: elapsedSeconds ?? session.elapsedSeconds },
      },
    });

    // Run scoring on the full event log
    const allEvents = [
      ...session.events,
      { type: 'session_completed', payload: { planScore, finalOkrProgress, elapsedSeconds }, createdAt: new Date() },
    ] as ScoredEvent[];

    const scores = calculateScores(allEvents);

    // Persist result
    const result = await db.sessionResult.upsert({
      where: { sessionId: id },
      create: {
        sessionId: id,
        prioritisation: scores.prioritisation,
        stakeholderMgmt: scores.stakeholderMgmt,
        communication: scores.communication,
        conflictResolution: scores.conflictResolution,
        strategicThinking: scores.strategicThinking,
        executionSpeed: scores.executionSpeed,
        compositeScore: scores.compositeScore,
        constraintsFound: scores.constraintsFound,
        trustFinal: scores.trustFinal,
      },
      update: {
        prioritisation: scores.prioritisation,
        stakeholderMgmt: scores.stakeholderMgmt,
        communication: scores.communication,
        conflictResolution: scores.conflictResolution,
        strategicThinking: scores.strategicThinking,
        executionSpeed: scores.executionSpeed,
        compositeScore: scores.compositeScore,
        constraintsFound: scores.constraintsFound,
        trustFinal: scores.trustFinal,
      },
    });

    // Mark session completed
    await db.simSession.update({
      where: { id },
      data: {
        status: 'completed',
        stage: 'reporting',
        ...(elapsedSeconds !== undefined && { elapsedSeconds }),
        ...(stateJson !== undefined && { stateJson }),
      },
    });

    return NextResponse.json({ result, scores });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
