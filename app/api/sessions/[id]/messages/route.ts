import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db-server';

// POST /api/sessions/[id]/messages — persist a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { from, to, channel, body } = await req.json();
    if (!from || !to || !channel || !body) {
      return NextResponse.json({ error: 'from, to, channel, and body are required' }, { status: 400 });
    }

    const session = await db.simSession.findFirst({ where: { id, userId: user.id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const message = await db.simMessage.create({
      data: { sessionId: id, from, to, channel, body },
    });

    return NextResponse.json({ message });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
