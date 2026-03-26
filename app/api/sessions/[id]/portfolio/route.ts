import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/sessions/[id]/portfolio — generate AI portfolio from event log
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
      include: {
        events: { orderBy: { createdAt: 'asc' } },
        result: true,
        messages: { orderBy: { createdAt: 'asc' }, take: 40 },
      },
    });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const userProfile = await db.user.findUnique({ where: { id: user.id } });
    const userName = userProfile?.name ?? 'the PM';

    // Create a placeholder portfolio record immediately (status: generating)
    const existing = await db.portfolio.findUnique({ where: { sessionId: id } });
    if (existing?.status === 'ready') {
      return NextResponse.json({ portfolio: existing });
    }

    const placeholder = existing ?? await db.portfolio.create({
      data: {
        sessionId: id,
        status: 'generating',
        scenarioName: 'The Roadmap Reckoning',
        scenarioSummary: '',
        challenge: '',
        keyDecisions: [],
        skillScores: session.result ? JSON.parse(JSON.stringify(session.result)) : {},
      },
    });

    // Return placeholder immediately — generation happens async
    // Kick off background generation (fire and forget, updates DB when done)
    generatePortfolioAsync(id, session, userName, placeholder.id).catch(console.error);

    return NextResponse.json({ portfolio: placeholder });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/sessions/[id]/portfolio — poll for portfolio status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await db.simSession.findFirst({ where: { id, userId: user.id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const portfolio = await db.portfolio.findUnique({ where: { sessionId: id } });
    if (!portfolio) return NextResponse.json({ portfolio: null });

    return NextResponse.json({ portfolio });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function generatePortfolioAsync(
  sessionId: string,
  session: {
    events: { type: string; payload: unknown; createdAt: Date }[];
    result: {
      stakeholderMgmt: number;
      communication: number;
      strategicThinking: number;
      conflictResolution: number;
      prioritisation: number;
      executionSpeed: number;
      compositeScore: number;
      constraintsFound: number;
      trustFinal: unknown;
    } | null;
    messages: { from: string; to: string; channel: string; body: string; createdAt: Date }[];
  },
  userName: string,
  portfolioId: string
) {
  try {
    const scores = session.result;
    const events = session.events;

    // Build a concise event log summary for Claude
    const messageSentEvents = events.filter(e => e.type === 'message_sent');
    const cardMoveEvents = events.filter(e => e.type === 'card_moved');
    const constraintEvents = events.filter(e => e.type === 'hidden_constraint_unlocked');
    const completedEvent = events.find(e => e.type === 'session_completed');

    const charsContacted = [...new Set(messageSentEvents.map((e: any) => e.payload?.characterId).filter(Boolean))];
    const constraintsFound = constraintEvents.map((e: any) => e.payload?.constraint).filter(Boolean);
    const sessionMinutes = Math.round(((completedEvent as any)?.payload?.elapsedSeconds ?? 0) / 60);
    const planScore = (completedEvent as any)?.payload?.planScore ?? 0;

    // Sample of actual user messages to Claude characters (max 10)
    const userMessages = session.messages
      .filter(m => m.from === 'user')
      .slice(0, 10)
      .map(m => `→ [${m.channel.toUpperCase()} to ${m.to}] "${m.body}"`)
      .join('\n');

    const prompt = `You are writing a professional PM performance debrief for ${userName} who just completed "The Roadmap Reckoning" scenario at Nexus Technologies.

SCENARIO: A new PM inherited a three-way roadmap conflict between Engineering, Sales, and Product with a hard Monday board deadline. Six hidden constraints were embedded: (1) WorkOS build-vs-buy shortcut Marcus knew but didn't volunteer, (2) $3M investor clawback Elena was the only one who knew about, (3) Tom's Acme commitment being "best efforts" language not a hard contract, (4) a second enterprise deal (Meridian), (5) Priya's unconsumed NPS/conversion research, (6) Sarah's context about investor James Whitfield's SSO expectations.

WHAT ${userName.toUpperCase()} ACTUALLY DID:
- Session duration: ${sessionMinutes} minutes
- Characters contacted: ${charsContacted.join(', ') || 'none recorded'}
- Hidden constraints surfaced: ${constraintsFound.join(', ') || 'none recorded'} (${constraintsFound.length}/6)
- Plan score: ${planScore}/100
- Sample messages sent:
${userMessages || '(no messages recorded)'}

SKILL SCORES (already calculated — do NOT make up different numbers):
- Stakeholder Management: ${scores?.stakeholderMgmt ?? 0}/100
- Communication: ${scores?.communication ?? 0}/100
- Strategic Thinking: ${scores?.strategicThinking ?? 0}/100
- Conflict Resolution: ${scores?.conflictResolution ?? 0}/100
- Prioritisation: ${scores?.prioritisation ?? 0}/100
- Execution Speed: ${scores?.executionSpeed ?? 0}/100
- Composite: ${scores?.compositeScore ?? 0}/100

Write a JSON object with EXACTLY these keys:
{
  "scenarioSummary": "2-3 sentence summary of what the scenario involved (objective, neutral)",
  "challenge": "1-2 sentence description of what the PM was asked to do",
  "keyDecisions": [
    {"bullet": "One specific thing this PM did or did not do — based on the actual data above. Start with an action verb. Be specific to what happened, not generic."},
    {"bullet": "..."},
    {"bullet": "..."},
    {"bullet": "..."},
    {"bullet": "..."}
  ],
  "performanceNarrative": "4-6 paragraphs. Write in third person (refer to '${userName}'). Be analytical, not promotional. Reference what they actually did (from the data above). Identify the strongest and weakest patterns. Include a specific development area. Match the tone of a senior PM coach writing for a portfolio document — direct, evidence-based, no filler."
}

Return ONLY valid JSON. No markdown fences. No commentary outside the JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : null;
    if (!raw) throw new Error('Empty response from Claude');

    const parsed = JSON.parse(raw);

    await db.portfolio.update({
      where: { id: portfolioId },
      data: {
        status: 'ready',
        scenarioName: 'The Roadmap Reckoning',
        scenarioSummary: parsed.scenarioSummary ?? '',
        challenge: parsed.challenge ?? '',
        keyDecisions: parsed.keyDecisions ?? [],
        skillScores: scores ? JSON.parse(JSON.stringify(scores)) : {},
        performanceNarrative: parsed.performanceNarrative ?? '',
      },
    });
  } catch (err) {
    console.error('Portfolio generation failed:', err);
    await db.portfolio.update({
      where: { id: portfolioId },
      data: { status: 'failed' },
    });
  }
}
