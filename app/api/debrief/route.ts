import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { decisionHistory, characters, session, simPreferences } = await req.json();

    const trustArcs = characters.map((c: { name: string; trust: number }) =>
      `${c.name}: ended at ${(c.trust * 100).toFixed(0)}% trust`
    ).join(', ');

    const secretsCount = session?.unlockedSecrets?.length ?? 0;
    const okrCompletion = session?.okrs
      ? session.okrs.filter((o: { status: string }) => o.status === 'complete').length + '/' + session.okrs.length
      : '?';

    const decisionsText = (decisionHistory || []).slice(0, 12).map((d: {
      timestampSeconds: number;
      userMessage: string;
      characterId: string;
      trustBefore: number;
      trustAfter: number;
    }) =>
      `[${Math.floor(d.timestampSeconds / 60)}m${d.timestampSeconds % 60}s] To ${d.characterId}: "${d.userMessage.slice(0, 100)}" → trust ${(d.trustBefore * 100).toFixed(0)}% → ${(d.trustAfter * 100).toFixed(0)}%`
    ).join('\n');

    const prompt = `You are Nova, an AI career coach analyzing a PM simulation session.

SCENARIO: The Roadmap Reckoning — Nexus Technologies, Q3 roadmap crisis, 5 stakeholders, board meeting Monday.
USER PROFILE: ${simPreferences?.experienceLevel ?? 'unknown'} experience, ${simPreferences?.domain ?? 'PM'} background.

SESSION DATA:
- Trust arcs: ${trustArcs}
- Secrets unlocked: ${secretsCount}/5
- OKRs complete: ${okrCompletion}
- Key decisions:
${decisionsText || '(no decision history available)'}

Generate a debrief of 5–7 coaching moments. Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "timestampSeconds": <number>,
    "decision": "<one sentence: what the PM did>",
    "impact": "<one sentence: measurable consequence>",
    "coachNote": "<one sentence: the learning principle>",
    "skill": "<one of: prioritisation|stakeholderMgmt|communication|conflictResolution|strategicThinking|executionSpeed>",
    "sentiment": "<positive|neutral|negative>"
  }
]

Focus on moments that reveal something about PM judgment — good and bad. Be specific to the actual decision data.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]';

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const debrief = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return Response.json({ debrief });
  } catch (err) {
    console.error('[/api/debrief] Error:', err);
    return Response.json({ debrief: [] }, { status: 500 });
  }
}
