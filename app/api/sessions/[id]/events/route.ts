import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

// POST /api/sessions/[id]/events — append a decision event
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, payload } = await req.json();
    if (!type) return NextResponse.json({ error: 'type is required' }, { status: 400 });

    // Verify session belongs to user
    const session = await db.simSession.findFirst({ where: { id, userId: user.id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const event = await db.sessionEvent.create({
      data: { sessionId: id, type, payload: payload ?? {} },
    });

    return NextResponse.json({ event });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
