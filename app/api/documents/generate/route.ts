import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db-server';
import { CHARACTERS } from '@/lib/data';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Build lookup maps from canonical CHARACTERS data so names/titles stay in sync
const CHAR_NAMES: Record<string, string> = Object.fromEntries(
  CHARACTERS.map(c => [c.id, c.name])
);
const CHAR_ROLES: Record<string, string> = Object.fromEntries(
  CHARACTERS.map(c => [c.id, c.title])
);
const VALID_CHAR_IDS = new Set(CHARACTERS.map(c => c.id));

function inferDocType(characterId: string, triggerMessage: string): { name: string; docType: 'pdf' | 'docx' | 'xlsx' } {
  const msg = triggerMessage.toLowerCase();

  if (characterId === 'marcus') {
    if (msg.includes('capacity') || msg.includes('team') || msg.includes('bandwidth')) return { name: 'Engineering Capacity Breakdown', docType: 'xlsx' };
    if (msg.includes('spec') || msg.includes('technical') || msg.includes('sso') || msg.includes('workos')) return { name: 'SSO Technical Specification', docType: 'docx' };
    return { name: 'Engineering Status Update', docType: 'docx' };
  }
  if (characterId === 'priya') {
    if (msg.includes('research') || msg.includes('data') || msg.includes('nps') || msg.includes('conversion')) return { name: 'UX Research Synthesis', docType: 'pdf' };
    if (msg.includes('design') || msg.includes('brief') || msg.includes('mockup')) return { name: 'Design Brief', docType: 'docx' };
    return { name: 'User Research Summary', docType: 'pdf' };
  }
  if (characterId === 'tom') {
    if (msg.includes('acme') || msg.includes('email') || msg.includes('commitment') || msg.includes('contract')) return { name: 'Acme Deal Context', docType: 'docx' };
    if (msg.includes('meridian') || msg.includes('pipeline') || msg.includes('enterprise')) return { name: 'Enterprise Pipeline Summary', docType: 'xlsx' };
    return { name: 'Sales Brief', docType: 'docx' };
  }
  if (characterId === 'sarah') {
    if (msg.includes('stakeholder') || msg.includes('map') || msg.includes('alignment')) return { name: 'Stakeholder Alignment Map', docType: 'docx' };
    if (msg.includes('process') || msg.includes('sign-off') || msg.includes('approval')) return { name: 'Product Process Guide', docType: 'docx' };
    return { name: 'Roadmap Status Summary', docType: 'docx' };
  }
  if (characterId === 'elena') {
    if (msg.includes('board') || msg.includes('investor') || msg.includes('briefing')) return { name: 'Board Briefing Notes', docType: 'pdf' };
    return { name: 'Q3 Strategic Priorities', docType: 'docx' };
  }
  return { name: 'Shared Document', docType: 'docx' };
}

async function generateDocContent(
  characterId: string,
  docName: string,
  docType: string,
): Promise<unknown> {
  const charName = CHAR_NAMES[characterId]!;
  const charRole = CHAR_ROLES[characterId]!;

  const prompt = `You are ${charName}, ${charRole} at Nexus Technologies — a 300-person B2B SaaS company that just closed a $20M Series C. You're writing "${docName}" to share with the new PM.

SCENARIO CONTEXT:
- Contested Q3 roadmap: Engineering (6-week SSO build), Sales (Acme deal requiring SSO), Product (NPS/onboarding fix)
- Monday board deadline — Series C lead investor James Whitfield will be in the room
- Hidden constraints: Marcus knows WorkOS (third-party SSO) reduces 6-week build to 2 weeks but hasn't volunteered it. Elena knows about a $3M investor clawback tied to October 1st SSO milestone. Tom's Acme commitment is "best efforts" language, not a hard contract. There's a second enterprise deal (Meridian) with identical SSO requirements. Priya has conversion research showing trial-to-paid is down 8pts, driven by onboarding friction.
- Engineering is at 94% capacity. A key engineer resigned last week.

Write this as ${charName} writing a real, useful internal document. Include specific numbers, names, and details that reflect the scenario above. Write the kind of document that would actually exist at this company.

DOCUMENT FORMAT — return ONLY valid JSON:
{
  "sections": [
    {
      "heading": "Section Title",
      "content": "Paragraph text — 3-6 sentences of real, scenario-specific content. Use actual names and numbers.",
      "table": null
    }
  ]
}

For xlsx documents, use "table" as an array of row objects like [{"Column A": "value", "Column B": "value"}] and shorter "content".
Include 3-5 sections. Make the content genuinely useful and specific to the scenario — not generic filler.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { sections: [{ heading: docName, content: raw, table: null }] };
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, characterId, triggerMessage } = await req.json() as {
      sessionId: string;
      characterId: string;
      triggerMessage: string;
    };

    // Validate characterId against known characters
    if (!VALID_CHAR_IDS.has(characterId as any)) {
      return NextResponse.json({ error: 'Invalid character' }, { status: 400 });
    }

    // Verify session belongs to user
    const session = await db.simSession.findFirst({ where: { id: sessionId, userId: user.id } });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const { name, docType } = inferDocType(characterId, triggerMessage);

    // Check if a similar doc was already generated recently (avoid duplicates)
    const existing = await (db as any).simDocument.findFirst({
      where: { sessionId, characterId, name },
    });
    if (existing) return NextResponse.json({ document: existing });

    // Create placeholder record immediately
    const doc = await (db as any).simDocument.create({
      data: { sessionId, characterId, name, docType, status: 'generating' },
    });

    // Generate content async (fire and forget)
    generateDocContent(characterId, name, docType).then(async (content) => {
      await (db as any).simDocument.update({
        where: { id: doc.id },
        data: { status: 'ready', content: content as any },
      });
    }).catch(async (err) => {
      console.error('Doc generation failed:', err);
      try {
        await (db as any).simDocument.update({ where: { id: doc.id }, data: { status: 'failed' } });
      } catch (updateErr) {
        console.error('Failed to mark document as failed:', updateErr);
      }
    });

    return NextResponse.json({ document: doc });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
