import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { role, experienceLevel, domain, conversationSummary } = await req.json() as {
      role: string;
      experienceLevel: string;
      domain: string;
      conversationSummary: string;
    };

    const prompt = `Generate exactly 3 distinct company scenarios for a product simulation matching this candidate profile:
- Role/background: ${role || 'Product Manager'}
- Experience level: ${experienceLevel || 'mid-level'}
- Domain/industry background: ${domain || 'technology'}
- Context from their answers: ${conversationSummary || 'general PM background'}

Requirements for the 3 companies:
1. Each must be in a clearly different industry (e.g. FinTech, HealthTech, B2B SaaS, E-commerce, EdTech, CleanTech, etc.)
2. Vary in scale: one early-stage (Series A/B), one growth-stage (Series B/C), one scale-up (Series C+)
3. Each must have a realistic, specific PM challenge the user will face — not generic
4. The "why" field must reference something specific from the candidate's background
5. videoKeyword should be 2-3 words suitable for a stock video search (e.g. "financial technology", "hospital staff", "logistics warehouse")

Return ONLY a valid JSON array, no markdown, no extra text:
[
  {
    "id": "kebab-case-slug",
    "name": "Company Name",
    "industry": "Industry Name",
    "size": "X people, Series Y",
    "tagline": "One-line company mission",
    "challenge": "2-3 sentences describing the specific PM challenge they will simulate",
    "why": "One sentence explaining why this matches the candidate's background",
    "videoKeyword": "search terms"
  },
  ...
]`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]';
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const companies = JSON.parse(cleaned);

    return NextResponse.json({ companies });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
