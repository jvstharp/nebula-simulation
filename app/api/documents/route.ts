import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

// GET /api/documents?sessionId=... — list AI-generated documents for a session
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ documents: [] });

    // Verify session belongs to user
    const session = await db.simSession.findFirst({ where: { id: sessionId, userId: user.id } });
    if (!session) return NextResponse.json({ documents: [] });

    const documents = await (db as any).simDocument.findMany({
      where: { sessionId, status: 'ready' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
