import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { characterName, characterTitle, personality, visibleAgenda, trust, conversationHistory, userMessage } = await req.json();

    const guardedness = trust < 0.5
      ? 'You are guarded and protective. Share partial information. Redirect to your agenda when unsure.'
      : trust >= 0.75
      ? 'You trust this PM and are collaborative. Share context generously and signal genuine goodwill.'
      : 'You are cautiously open. Share information, but stay aware of your own priorities.';

    const systemPrompt = `You are ${characterName}, ${characterTitle} at Nexus Technologies, a B2B SaaS company that just closed a Series C.

PERSONALITY: ${personality}

YOUR AGENDA: ${visibleAgenda}

CURRENT TRUST IN THE PM (0–1 scale): ${trust.toFixed(2)} — ${guardedness}

RESPONSE RULES:
- Write 2–4 sentences max. Workplace-direct tone.
- Stay fully in character. No meta-commentary.
- No emojis. No bullet points unless it's a list of facts.
- Reference the PM's specific message — respond to what they actually said.
- Do not make up facts not supported by your character context.`;

    const messages: { role: 'user' | 'assistant'; content: string }[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const m of conversationHistory.slice(-6)) {
        messages.push({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.body,
        });
      }
    }
    messages.push({ role: 'user', content: userMessage });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 220,
      system: systemPrompt,
      messages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : "I'll get back to you on this.";
    return Response.json({ reply });
  } catch (err) {
    console.error('[/api/chat] Error:', err);
    return Response.json({ reply: null, error: 'AI unavailable' }, { status: 500 });
  }
}
