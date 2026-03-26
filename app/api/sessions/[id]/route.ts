import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

// GET /api/sessions/[id] — load a session for resume
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await db.simSession.findFirst({
      where: { id, userId: user.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        result: true,
        portfolio: true,
      },
    });

    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ session });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/sessions/[id] — save state snapshot
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { stateJson, elapsedSeconds, stage, status } = body;

    const session = await db.simSession.findFirst({ where: { id, userId: user.id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await db.simSession.update({
      where: { id },
      data: {
        ...(stateJson !== undefined && { stateJson }),
        ...(elapsedSeconds !== undefined && { elapsedSeconds }),
        ...(stage !== undefined && { stage }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ session: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
