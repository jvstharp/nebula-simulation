import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }

    // Fetch the public user profile
    const profile = await db.user.findUnique({ where: { id: data.user.id } });

    if (!profile) {
      // Auto-create profile if missing (e.g. pre-existing Supabase user)
      const name = data.user.user_metadata?.name ?? email.split('@')[0];
      await db.user.create({ data: { id: data.user.id, email, name } });
      return NextResponse.json({ user: { id: data.user.id, email, name } });
    }

    return NextResponse.json({ user: { id: profile.id, email: profile.email, name: profile.name } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
