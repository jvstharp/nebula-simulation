import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { questionId, question, answer, followUpQuestion } = await req.json() as {
      questionId: string;
      question: string;
      answer: string;
      followUpQuestion?: string; // if this is a follow-up response
    };

    const qMeta = ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
    const focus = qMeta?.evaluationFocus ?? 'Strong PM judgment, clarity of thinking, and stakeholder awareness.';

    const systemPrompt = `You are an expert PM coach evaluating a candidate's response to a situational assessment question for a senior Product Manager role.

QUESTION ASKED:
"${followUpQuestion ?? question}"

EVALUATION FOCUS:
${focus}

SCORING GUIDE (1–5):
5 — Exceptional: Shows clear, nuanced PM judgment. Specific, not generic. Gets to the right insight quickly.
4 — Strong: Good thinking with one or two things missing. Relevant and directional.
3 — Adequate: Correct at a surface level but vague or incomplete. Needs more specificity.
2 — Weak: Missing the key insight. Generic answer that could apply to any situation. Does not show PM-specific thinking.
1 — Poor: Wrong direction, shows misunderstanding of PM fundamentals, or trivially short.

FOLLOW-UP RULE:
Only request a follow-up if the score is 1 or 2. The follow-up should target the exact gap — one specific question that, if answered well, would change your assessment. Do NOT ask follow-ups for scores 3+.

Return ONLY valid JSON on a single line:
{"score":4,"feedback":"2-3 sentence coaching feedback — direct, specific, evidence-based. Reference what they said.","needsFollowUp":false,"followUpQuestion":null,"passed":true}

Rules:
- "passed" is true if score >= 3
- "needsFollowUp" is true only if score <= 2
- feedback must reference the specific answer given, not be generic
- followUpQuestion is a single, targeted question string if needsFollowUp is true, otherwise null`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: `CANDIDATE ANSWER: "${answer}"` }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        score: parsed.score ?? 3,
        feedback: parsed.feedback ?? 'Good answer.',
        needsFollowUp: parsed.needsFollowUp === true,
        followUpQuestion: parsed.followUpQuestion ?? null,
        passed: parsed.passed !== false,
      });
    } catch {
      return NextResponse.json({ score: 3, feedback: 'Noted.', needsFollowUp: false, followUpQuestion: null, passed: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
