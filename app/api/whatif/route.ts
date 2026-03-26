import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { decisionNode, character, alternateApproach } = await req.json();

    const prompt = `You are analyzing a PM simulation scenario (Nexus Technologies Q3 roadmap crisis).

ORIGINAL DECISION:
- PM said to ${character.name} (${character.title}): "${decisionNode.userMessage}"
- ${character.name} responded: "${decisionNode.characterReply}"
- Trust impact: ${(decisionNode.trustBefore * 100).toFixed(0)}% → ${(decisionNode.trustAfter * 100).toFixed(0)}%

ALTERNATE APPROACH the PM wants to explore:
"${alternateApproach}"

CHARACTER CONTEXT:
${character.name}: ${character.personality}
Current trust with PM: ${(decisionNode.trustBefore * 100).toFixed(0)}%

Return ONLY valid JSON (no markdown):
{
  "alternateReply": "<how ${character.name} would have realistically responded to the alternate approach, 2-3 sentences, in their voice>",
  "trustProjection": <estimated trust after this alternate approach, 0.0–1.0>,
  "narrative": "<one sentence explaining what changed and why>"
}`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      alternateReply: "Interesting approach.",
      trustProjection: decisionNode.trustBefore,
      narrative: "Alternate outcome analysis unavailable.",
    };

    return Response.json(result);
  } catch (err) {
    console.error('[/api/whatif] Error:', err);
    return Response.json({
      alternateReply: "Unable to simulate alternate outcome.",
      trustProjection: 0.5,
      narrative: "Simulation unavailable.",
    }, { status: 500 });
  }
}
