import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

// POST /api/sessions — create a new simulation session
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId = 'roadmap-reckoning', stateJson } = await req.json().catch(() => ({}));

    // Abandon any previously active sessions for this user
    await db.simSession.updateMany({
      where: { userId: user.id, status: 'active' },
      data: { status: 'abandoned' },
    });

    const session = await db.simSession.create({
      data: {
        userId: user.id,
        scenarioId,
        status: 'active',
        stage: 'planning',
        stateJson: stateJson ?? undefined,
      },
    });

    // Log session_started event
    await db.sessionEvent.create({
      data: {
        sessionId: session.id,
        type: 'session_started',
        payload: { scenarioId },
      },
    });

    return NextResponse.json({ session });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/sessions — list sessions for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await db.simSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { result: true, portfolio: { select: { id: true, status: true, verificationId: true } } },
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
