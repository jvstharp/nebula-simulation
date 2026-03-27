import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages, userName } = await req.json() as {
      messages: Array<{ role: 'assistant' | 'user'; content: string }>;
      userName: string;
    };

    const systemPrompt = `You are Alex, an intelligent onboarding coordinator at Nexus Technologies — a 300-person B2B SaaS company that just closed a $20M Series C. You're meeting a new Product Manager on their first day.

Your job is to have a natural, probing conversation to understand their mindset and PM instincts before they step into a difficult situation: a contested roadmap with a hard board deadline in 3 days.

CONVERSATION GOALS — you must cover all 4 before marking complete:
1. PM background and experience level (what kind of PM challenges they've handled)
2. Approach to stakeholder conflict (how they navigate competing priorities)
3. Comfort with ambiguity and constraint discovery (do they probe, or take things at face value?)
4. Brief them on the situation — make it feel real and urgent: contested roadmap, Engineering vs Sales vs Product, Monday board deadline, new role. Do NOT reveal specifics (clawback, WorkOS, Meridian). Just set the urgency.

RULES:
- Ask exactly ONE focused question at a time. Never ask two questions in the same message.
- If an answer is vague or generic (e.g. "I would communicate with everyone" / "I'd align the team"), push back ONCE before moving on: ask them to be specific about what that looks like in the first hour.
- If an answer is strong and shows real PM judgment, acknowledge it briefly (1 sentence) and advance to the next goal.
- After all 4 goals are complete, end with a message that says goodbye and sets them off. That message must be brief (2-3 sentences) and end with the exact phrase: "Good luck."
- Keep all your messages to 2-4 sentences. Sound human, direct, professional — not robotic or overly warm.
- Address the user as ${userName}.
- Do NOT ask about technical skills, coding, or product analytics. Focus on judgment, relationships, and decision-making.

Return ONLY valid JSON on a single line (no markdown, no extra text):
{"reply":"your message here","complete":false}

Set "complete":true ONLY in your final goodbye message when all 4 goals are done.`;

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
      });
    } catch {
      const complete = raw.toLowerCase().includes('good luck') || messages.length >= 12;
      return NextResponse.json({ reply: raw, complete });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
