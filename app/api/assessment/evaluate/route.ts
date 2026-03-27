import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// These are the open-text assessment questions tied to the Nexus scenario
export const ASSESSMENT_QUESTIONS_OPEN = [
  {
    id: 'q1',
    question: "You've just read three conflicting email chains from Engineering, Sales, and Design. Each team believes their Q3 priority should take the top slot. Walk me through your first 2 hours as the incoming PM.",
    evaluationFocus: 'Does the answer prioritise understanding constraints over immediately forming an opinion? Do they do 1:1s before group sessions? Do they seek data before deciding?',
  },
  {
    id: 'q2',
    question: "Marcus from Engineering tells you 'six weeks minimum' for a critical feature the CEO considers non-negotiable. What do you say to him — right now, in this conversation?",
    evaluationFocus: 'Do they push back on the estimate constructively? Do they explore assumptions (what is driving that number)? Do they ask about third-party alternatives? Do they avoid simply accepting or escalating?',
  },
  {
    id: 'q3',
    question: "Your CEO wants one recommendation for Monday's board meeting, not options. You see three viable paths, each with real trade-offs she needs to understand. How do you approach this?",
    evaluationFocus: 'Do they understand how to give one recommendation while making the trade-offs visible? Do they avoid presenting options dressed up as a recommendation? Do they show they know when to ask a clarifying question vs when to decide?',
  },
  {
    id: 'q4',
    question: "Priya from Design sends you a brief message: 'I have some data that might be relevant to the Q3 plan.' You have 4 hours before your EOD milestone. What do you do?",
    evaluationFocus: 'Do they immediately follow up and treat this as potentially important? Do they understand that understated messages from individual contributors often carry the most strategic weight? Do they make time despite the deadline?',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { questionId, question, answer, followUpQuestion } = await req.json() as {
      questionId: string;
      question: string;
      answer: string;
      followUpQuestion?: string; // if this is a follow-up response
    };

    const qMeta = ASSESSMENT_QUESTIONS_OPEN.find(q => q.id === questionId);
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
