import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, userName } = await req.json() as {
      messages: Array<{ role: 'assistant' | 'user'; content: string }>;
      userName: string;
    };

    const name = userName?.trim() || 'there';

    const systemPrompt = `You are Alex, onboarding coordinator at a tech platform. You are meeting ${name} for the first time as they set up their simulation profile.

Your job: have a short, warm, natural conversation to understand their background so you can match them to the right company scenario. Two questions only — then present company options.

CONVERSATION STRUCTURE — follow this exactly:

STEP 1 (first message): Greet ${name} warmly. Explain in 1 sentence what you're doing (finding them the right company scenario to simulate). Ask ONE question: what kind of product work have they done, and in what industry/domain? Be conversational, not clinical.

STEP 2 (after they answer step 1): Ask ONE follow-up question about their experience level — junior (0–2 yrs), mid (3–5 yrs), or senior (6+). Keep it short.

STEP 3 (after they answer step 2): You now have enough. Say a short sentence like "Perfect — let me find some good matches for you." Then set "generateCompanies":true. Do NOT ask any more questions.

STEP 4 (only reached when user sends a message like "I'd like [company name]" confirming their pick): Give a warm 2-3 sentence closing. Name the company they chose. Tell them they'll see a quick overview of the company next, then meet their new colleagues. End with exactly: "Good luck." Set "complete":true.

RULES:
- Never ask more than one question per message.
- Never skip steps — go in order: greet+q1 → q2 → generateCompanies → closing.
- Keep messages short: 2-3 sentences max.
- Sound like a real person, not a form. Warm, dry, direct.
- Do not mention the simulation mechanics or scoring.

Return ONLY valid JSON on a single line (no markdown):
{"reply":"your message","complete":false,"generateCompanies":false}

Set "generateCompanies":true ONLY in step 3 (after collecting both answers).
Set "complete":true ONLY in step 4 (the final closing after company is confirmed).`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        reply: parsed.reply ?? raw,
        complete: parsed.complete === true,
        generateCompanies: parsed.generateCompanies === true,
      });
    } catch {
      const complete = raw.toLowerCase().includes('good luck');
      return NextResponse.json({ reply: raw, complete, generateCompanies: false });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
