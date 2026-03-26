import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db-server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await db.user.findUnique({
      where: { id: user.id },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          include: {
            result: true,
            portfolio: {
              select: {
                id: true,
                status: true,
                verificationId: true,
                scenarioName: true,
                skillScores: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Aggregate skill scores across completed sessions
    const completedSessions = profile.sessions.filter(s => s.status === 'completed' && s.result);
    const avgScores = completedSessions.length > 0
      ? {
          stakeholderMgmt: avg(completedSessions.map(s => s.result!.stakeholderMgmt)),
          communication: avg(completedSessions.map(s => s.result!.communication)),
          strategicThinking: avg(completedSessions.map(s => s.result!.strategicThinking)),
          conflictResolution: avg(completedSessions.map(s => s.result!.conflictResolution)),
          prioritisation: avg(completedSessions.map(s => s.result!.prioritisation)),
          executionSpeed: avg(completedSessions.map(s => s.result!.executionSpeed)),
        }
      : null;

    // Derive earned badges from session history
    const badges = deriveBadges(completedSessions);

    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        createdAt: profile.createdAt,
      },
      sessions: profile.sessions.map(s => ({
        id: s.id,
        scenarioId: s.scenarioId,
        status: s.status,
        elapsedSeconds: s.elapsedSeconds,
        createdAt: s.createdAt,
        compositeScore: s.result?.compositeScore ?? null,
        portfolio: s.portfolio,
      })),
      avgScores,
      badges,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function deriveBadges(sessions: { result: { stakeholderMgmt: number; compositeScore: number; strategicThinking: number; communication: number; constraintsFound: number } | null }[]) {
  const highestStakeholder = Math.max(0, ...sessions.map(s => s.result?.stakeholderMgmt ?? 0));
  const highestComposite = Math.max(0, ...sessions.map(s => s.result?.compositeScore ?? 0));
  const highestStrategic = Math.max(0, ...sessions.map(s => s.result?.strategicThinking ?? 0));
  const highestComm = Math.max(0, ...sessions.map(s => s.result?.communication ?? 0));
  const allConstraints = sessions.some(s => (s.result?.constraintsFound ?? 0) >= 6);

  return [
    { id: 'strategic_thinker',    label: 'Strategic Thinker',  icon: '🧠', color: '#bb76d6', earned: highestStrategic >= 80,     desc: 'Strategic Thinking score ≥ 80' },
    { id: 'stakeholder_master',   label: 'Stakeholder Master', icon: '🤝', color: '#02ba67', earned: highestStakeholder >= 80,    desc: 'Stakeholder Management score ≥ 80' },
    { id: 'clear_communicator',   label: 'Clear Communicator', icon: '💬', color: '#49a5de', earned: highestComm >= 75,           desc: 'Communication score ≥ 75' },
    { id: 'constraint_hunter',    label: 'Constraint Hunter',  icon: '🔍', color: '#deaf49', earned: allConstraints,               desc: 'Surfaced all 6 hidden constraints in a session' },
    { id: 'high_performer',       label: 'High Performer',     icon: '⭐', color: '#d44848', earned: highestComposite >= 85,       desc: 'Composite score ≥ 85' },
    { id: 'team_builder',         label: 'Team Builder',       icon: '👥', color: '#db966b', earned: sessions.length >= 3,        desc: 'Completed 3 or more sessions' },
    { id: 'data_driven',          label: 'Data Driven',        icon: '📊', color: '#49a5de', earned: false,                        desc: 'Reference metrics in 80% of decisions' },
    { id: 'consensus_builder',    label: 'Consensus Builder',  icon: '🎯', color: '#bb76d6', earned: highestStakeholder >= 90,    desc: 'Stakeholder Management score ≥ 90' },
  ];
}
