import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type TriggerType =
  | 'message_reply'
  | 'card_moved_to_inprogress'
  | 'card_moved_to_review'
  | 'card_moved_to_done'
  | 'card_advanced_autonomous';

interface RequestBody {
  characterId: string;
  triggerType: TriggerType;
  triggerBody: string;
  recentMessages: Array<{ from: string; body: string; channel: string }>;
  characterState: {
    name: string;
    title: string;
    personality: string;
    visibleAgenda: string;
    trust: number;
    emotion: string;
    online: boolean;
  };
  simulationState: {
    stage: string;
    elapsedSeconds: number;
    okrs: Array<{ title: string; progress: number; status: string }>;
    myKanbanCards: Array<{ title: string; tag: string; column: string; blocked: boolean }>;
    chaosActive: boolean;
  };
}

function buildSystemPrompt(body: RequestBody): string {
  const { characterState: char, simulationState: sim } = body;

  const trustPct = Math.round(char.trust * 100);
  const trustTier =
    trustPct >= 65 ? 'High' : trustPct >= 45 ? 'Medium' : 'Low';

  const myCards =
    sim.myKanbanCards.length > 0
      ? sim.myKanbanCards
          .map(
            c =>
              `- "${c.title}" [${c.tag}] → ${c.column}${c.blocked ? ' (BLOCKED)' : ''}`
          )
          .join('\n')
      : 'None assigned';

  const okrs =
    sim.okrs.length > 0
      ? sim.okrs
          .map(o => `- ${o.title}: ${o.progress}% (${o.status})`)
          .join('\n')
      : 'No active OKRs';

  const recentConvo =
    body.recentMessages.length > 0
      ? body.recentMessages
          .map(m => `[${m.channel.toUpperCase()}] ${m.from}: ${m.body}`)
          .join('\n')
      : 'No recent messages.';

  const chaosLine = sim.chaosActive
    ? 'CHAOS ACTIVE: Engineering is in a capacity crisis — factor this into any engineering-related response.'
    : '';

  return `You are roleplaying as ${char.name}, ${char.title} at Nexus Technologies — a 300-person B2B SaaS company 10 days after closing a $12M Series C.

SCENARIO CONTEXT:
The incoming PM (the user) has inherited a three-way roadmap conflict between Engineering, Sales, and Product with a hard Monday board deadline. The Series C lead investor James Whitfield (Sequoia) will be in the Monday board meeting. There is a $3M investor clawback clause tied to an October 1st SSO + audit logging milestone — almost nobody on the team knows about it. Key hidden constraints: Marcus has identified WorkOS (a third-party SSO integration) that would collapse a 6-week build to 2 weeks, but nobody asked; Tom's Acme commitment is "best efforts" language not a hard contract; Priya has conversion research nobody has acted on; Elena is the only one who knows about the clawback.

YOUR PROFILE:
- Personality: ${char.personality}
- Your current agenda: ${char.visibleAgenda}
- Trust in the PM: ${trustPct}% (${trustTier})
- Emotional state: ${char.emotion}

CURRENT STATE:
- Simulation stage: ${sim.stage}
- Your Kanban cards:
${myCards}
- Active OKRs:
${okrs}
${chaosLine ? '\n' + chaosLine : ''}

RECENT CONVERSATION WITH PM:
${recentConvo}

RESPONSE RULES:
- Stay fully in character. Never break the fourth wall or acknowledge you are an AI.
- 1–3 sentences maximum. Direct and unfiltered. No pleasantries, no "certainly", no "of course".
- Respond to the specific trigger — don't give a generic response.
- Be geared toward a realistic outcome: advance the scenario, surface tension, or clarify constraints. Don't just acknowledge — react.
- Trust tier affects tone:
  - High (≥65%): collaborative, direct, constructive
  - Medium (45–64%): cautious, conditional, flag your constraints
  - Low (<45%): guarded, friction, push back if your character would
- Reference real details when relevant: card names, deal names (Acme, Meridian), numbers (94% capacity, $3M clawback, October 1st), people (David Park, James Whitfield).
- Chaos active: if engineering capacity is in crisis, factor that into your response.

TRUST DELTA — after writing your reply, assign a delta (-0.15 to +0.15) reflecting how the PM's message affected your trust in them:
+0.10 to +0.15: The PM asked exactly the right question or showed sharp, specific judgment
+0.05 to +0.09: Relevant, thoughtful, professional message
+0.00 to +0.04: Vague, generic, or safe — doesn't move things forward
-0.05 to -0.01: Misses the point, asks the wrong question, shows poor prioritisation
-0.15 to -0.06: Inappropriate tone, political misread, or shows fundamental misunderstanding

OUTPUT FORMAT — return ONLY a single line of valid JSON (no markdown):
{"reply":"your 1-3 sentence in-character response","delta":0.05}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: null, error: 'No API key configured' }, { status: 500 });
    }

    const body: RequestBody = await req.json();

    const systemPrompt = buildSystemPrompt(body);
    const userMessage = `TRIGGER (${body.triggerType}): ${body.triggerBody}

Respond as ${body.characterState.name} to this specific trigger. Stay in character.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : null;

    // Parse JSON response; fall back to treating raw text as reply with null delta (signals parse failure)
    let reply: string | null = null;
    let trustDelta: number | null = null;
    if (raw) {
      try {
        const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        const parsed = JSON.parse(cleaned);
        reply = parsed.reply ?? null;
        trustDelta = typeof parsed.delta === 'number'
          ? Math.max(-0.15, Math.min(0.15, parsed.delta))
          : null;
      } catch {
        reply = raw;
        trustDelta = null;
      }
    }

    return NextResponse.json({ reply, trustDelta });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ reply: null, error }, { status: 500 });
  }
}
