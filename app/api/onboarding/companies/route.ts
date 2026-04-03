import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { role, experienceLevel, roleTitle, focusArea, domain, conversationSummary } = await req.json() as {
      role: string;
      experienceLevel: string;
      roleTitle: string;
      focusArea: string;
      domain: string;
      conversationSummary: string;
    };

    const effectiveRole = roleTitle || role || 'Product Manager';
    const effectiveLevel = experienceLevel || 'mid-level';
    const effectiveFocus = focusArea || 'general product management';

    const prompt = `Generate exactly 3 distinct PM case study scenarios for a career simulation platform. These should be tailored to this candidate:

- Job title: ${effectiveRole}
- Experience level: ${effectiveLevel}
- PM focus area: ${effectiveFocus}
- Background context: ${conversationSummary || 'general PM background'}

Requirements for the 3 case studies:
1. Each must be in a clearly different industry (e.g. FinTech, HealthTech, B2B SaaS, E-commerce, EdTech, CleanTech, DevTools, etc.)
2. Vary in company stage: one early-stage (Series A/B, 30-80 people), one growth-stage (Series B/C, 100-300 people), one scale-up (Series C+/public, 500+ people)
3. Each must have a realistic, specific PM challenge that aligns with the candidate's focus area (${effectiveFocus}). The challenge should feel like a real workplace situation — not a textbook exercise.
4. The "why" field must reference something specific from the candidate's background or focus area
5. The challenge should be completable in a 30-60 minute simulation session
6. videoKeyword should be 2-3 words suitable for a stock video search (e.g. "financial technology", "hospital staff", "logistics warehouse")

Return ONLY a valid JSON array, no markdown, no extra text:
[
  {
    "id": "kebab-case-slug",
    "name": "Company Name",
    "industry": "Industry Name",
    "size": "X people, Series Y",
    "tagline": "One-line company mission",
    "challenge": "2-3 sentences describing the specific PM challenge they will simulate",
    "why": "One sentence explaining why this matches the candidate's profile and focus",
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
