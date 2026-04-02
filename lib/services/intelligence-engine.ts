/**
 * Intelligence Engine — Phase 5
 *
 * Generates complete simulation scenarios from company + role + difficulty inputs.
 * No more hand-authored content required. Uses Claude Sonnet for high-quality
 * scenario generation and Claude Opus for complex multi-company narratives.
 *
 * The engine respects the hybrid model:
 *   - Stable layer (company identity, org chart, personas) comes from DB/catalog
 *   - Dynamic layer (case studies, market conditions, politics) is AI-generated
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  SimDomain,
  DifficultyLevel,
  Character,
  Message,
  OKR,
  KanbanColumn,
  GeneratedScenarioData,
  SerializedCascadeEvent,
  CrossCompanyReference,
  DomainContext,
  CompanyStableData,
  CompanyDynamicSeed,
  SimCompany,
} from '../types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Domain-specific prompt context ──────────────────────────────────────────

const DOMAIN_PROMPTS: Record<SimDomain, string> = {
  pm: `DOMAIN: Product Management
The user plays as a Product Manager navigating roadmap conflicts, stakeholder alignment,
engineering capacity constraints, and go-to-market pressure. Key dynamics include:
- Roadmap prioritisation under competing demands
- Engineering capacity negotiation
- Sales/customer commitment management
- CEO/board-level communication
- Data-driven decision making vs. gut instinct
- Cross-functional alignment

DELIVERABLES the PM must produce:
- Prioritised roadmap or scope document
- Stakeholder alignment on key decisions
- Risk assessment with trade-offs documented
- Executive brief with recommendation

METRICS that matter: feature velocity, NPS, trial conversion, engineering capacity utilisation, deal pipeline.`,

  consulting: `DOMAIN: Consulting
The user plays as a Consultant (Analyst to Partner level) working on a client engagement.
Key dynamics include:
- Client relationship management and expectation setting
- Hypothesis-driven problem solving
- Data analysis and insight synthesis
- Deliverable quality under time pressure
- Internal team dynamics and mentorship
- Partner/engagement manager alignment

DELIVERABLES the consultant must produce:
- Client-ready analysis or recommendation deck
- Workstream prioritisation
- Stakeholder interview synthesis
- Implementation roadmap

METRICS that matter: client satisfaction, analysis quality, utilisation rate, team effectiveness, project margin.`,

  marketing: `DOMAIN: Marketing
The user plays as a Marketing leader navigating brand strategy, campaign execution,
and cross-functional coordination. Key dynamics include:
- Brand positioning vs. performance marketing tension
- Budget allocation across channels
- Agency/vendor management
- Product-marketing alignment
- Campaign measurement and attribution
- Competitive response strategy

DELIVERABLES the marketer must produce:
- Campaign strategy or brief
- Channel allocation recommendation
- Competitive positioning document
- Performance dashboard interpretation

METRICS that matter: CAC, LTV, brand awareness, conversion rates, ROAS, share of voice.`,

  data_analysis: `DOMAIN: Data & Analysis
The user plays as a Data Analyst/Analytics Manager translating data into business decisions.
Key dynamics include:
- Stakeholder requests vs. analytical rigour
- Data quality and methodology debates
- Translating technical findings for business audiences
- Prioritising analytics requests
- Building dashboards vs. ad-hoc analysis
- Ethical data usage and privacy considerations

DELIVERABLES the analyst must produce:
- Data-driven recommendation with methodology
- Dashboard or reporting framework
- Analysis prioritisation plan
- Stakeholder-ready insight summary

METRICS that matter: data accuracy, insight adoption rate, query turnaround time, decision impact.`,
};

const DIFFICULTY_PROMPTS: Record<DifficultyLevel, string> = {
  guided: `DIFFICULTY: Guided
- Characters are more forthcoming with information
- Fewer hidden constraints (2-3 max)
- Cascade events fire later (longer grace periods)
- Trust deltas are more forgiving (+0.03 boost)
- Chaos events are rare (1 max, fires late)
- Clear hints embedded in initial messages`,

  standard: `DIFFICULTY: Standard
- Characters behave realistically — information must be earned
- 4-5 hidden constraints requiring specific questions to unlock
- Cascade events fire at realistic intervals
- Trust deltas follow standard rules
- 1-2 chaos events possible
- Subtle signals in initial messages but no hand-holding`,

  pressure: `DIFFICULTY: Pressure
- Characters are guarded and require significant trust-building
- 5-6 hidden constraints, some deeply buried
- Cascade events fire quickly (shorter timers)
- Trust deltas are harsher (-0.03 penalty)
- 2-4 chaos events, starting earlier
- Time pressure is constant — multiple competing deadlines
- Higher stakes with less margin for error`,
};

// ── Scenario Generation ─────────────────────────────────────────────────────

export interface ScenarioGenerationInput {
  company: SimCompany;
  stableData: CompanyStableData | null;
  dynamicSeed: CompanyDynamicSeed | null;
  domain: SimDomain;
  difficulty: DifficultyLevel;
  roleTitle: string;
  userReputation?: { tier: string; avgScore: number; sessionsCompleted: number } | null;
  crossCompanyContext?: { companyId: string; companyName: string; industry: string }[];
}

export async function generateScenario(input: ScenarioGenerationInput): Promise<GeneratedScenarioData> {
  const {
    company,
    stableData,
    dynamicSeed,
    domain,
    difficulty,
    roleTitle,
    userReputation,
    crossCompanyContext,
  } = input;

  const orgChartContext = stableData?.orgChart
    ? stableData.orgChart.map(e => `- ${e.name} (${e.title}): ${e.personality}. Goals: ${e.goals}. Frustrations: ${e.frustrations}`).join('\n')
    : 'Generate 5 realistic characters with distinct personalities, agendas, and interpersonal dynamics.';

  const dynamicSeedContext = dynamicSeed
    ? `DYNAMIC SEEDS (use these as inspiration, vary them):
- Scenario templates: ${dynamicSeed.scenarioTemplates.join(', ')}
- Market conditions: ${dynamicSeed.marketConditions.join(', ')}
- Internal politics: ${dynamicSeed.internalPoliticsHooks.join(', ')}
- Budget pressures: ${dynamicSeed.budgetPressures.join(', ')}`
    : '';

  const reputationContext = userReputation
    ? `USER REPUTATION: ${userReputation.tier} (avg score: ${userReputation.avgScore}, sessions: ${userReputation.sessionsCompleted}).
Adjust scenario complexity to match — a ${userReputation.tier} player should face appropriately calibrated challenges.`
    : '';

  const crossCompanyCtx = crossCompanyContext?.length
    ? `CROSS-COMPANY UNIVERSE (reference these companies naturally in character dialogue):
${crossCompanyContext.map(c => `- ${c.companyName} (${c.industry})`).join('\n')}
Include 1-2 cross-company references where characters mention alumni, competitors, or partners from these companies.`
    : '';

  const systemPrompt = `You are the Nebula Intelligence Engine. You generate complete, high-fidelity corporate simulation scenarios.

Your output must be a single valid JSON object (no markdown wrapping) that creates a fully playable scenario.
The scenario should feel like walking into a real company mid-crisis — not a textbook case study.

COMPANY: ${company.name}
Industry: ${company.industry}
Size: ${company.size}
Tagline: ${company.tagline}

${DOMAIN_PROMPTS[domain]}

${DIFFICULTY_PROMPTS[difficulty]}

ROLE: ${roleTitle}

${orgChartContext ? `ORG CHART:\n${orgChartContext}` : ''}

${dynamicSeedContext}

${reputationContext}

${crossCompanyCtx}

CULTURE & CONTEXT:
${stableData ? `Culture: ${stableData.culture}\nMarket position: ${stableData.marketPosition}\nMorale: ${stableData.morale}\nBusiness priorities: ${stableData.businessPriorities.join(', ')}\nHiring needs: ${stableData.hiringNeeds.join(', ')}` : 'Generate realistic culture, market position, and internal dynamics.'}`;

  const userPrompt = `Generate a complete simulation scenario for ${company.name}. The user is a ${roleTitle} in the ${domain} domain at ${difficulty} difficulty.

Return a JSON object with this EXACT structure:
{
  "company": { "id": "${company.id}", "name": "${company.name}", "industry": "${company.industry}", "size": "${company.size}", "tagline": "${company.tagline}", "challenge": "2-3 sentence challenge description", "why": "why this scenario matters", "videoKeyword": "${company.videoKeyword}" },
  "characters": [
    // EXACTLY 5 characters. Each must have:
    {
      "id": "lowercase-slug",
      "name": "Full Name",
      "title": "Job Title",
      "avatar": "https://randomuser.me/api/portraits/men/NN.jpg or women/NN.jpg",
      "color": "#hex",
      "personality": "2-3 sentences. Include hidden information they hold, conditions under which they share it, and what triggers trust gain/loss.",
      "visibleAgenda": "1-2 sentences. What they openly want from the user.",
      "trust": 0.XX, // starting trust 0.40-0.75
      "emotion": "neutral|frustrated|cooperative|disengaged|alarmed",
      "online": true|false
    }
  ],
  "initialMessages": [
    // 5-7 emails and chats that set the scene. MUST include:
    // - A briefing email from the most senior character
    // - At least one character flagging a constraint
    // - At least one message with hidden subtext
    {
      "id": "msg-001",
      "from": "character-id",
      "to": "user",
      "channel": "email|chat",
      "subject": "optional for emails",
      "body": "multi-paragraph realistic corporate communication",
      "timestamp": "use relative offsets like -5400000 from now",
      "read": false
    }
  ],
  "initialOKRs": [
    // 4-5 OKRs that define success. Mix of stakeholder, delivery, and strategic objectives.
    { "id": "okr1", "title": "Clear, measurable objective", "status": "in_progress|pending", "progress": 0-20 }
  ],
  "initialKanban": [
    // 4 columns: backlog, inprogress, review, done
    // 8-12 total cards across columns. Assignees: first letter of character name, 'Y' for user.
    { "id": "backlog", "label": "Backlog", "color": "#6b7280", "cards": [...] },
    { "id": "inprogress", "label": "In Progress", "color": "#49a5de", "cards": [...] },
    { "id": "review", "label": "Review", "color": "#deaf49", "cards": [...] },
    { "id": "done", "label": "Done", "color": "#02ba67", "cards": [...] }
  ],
  "prologueMessages": [
    // 8-10 "fly on the wall" messages characters exchange before the user arrives
    { "from": "character-id", "delay": 0, "text": "short dialogue line" }
    // delays in ms: 0, 2800, 5500, 7800, 10200, etc.
  ],
  "cascadeEvents": [
    // 3-5 events that fire when characters are ignored or time passes
    {
      "id": "unique-id",
      "triggerType": "time_elapsed|character_ignored|trust_threshold|card_state",
      "triggerConfig": { "minElapsedSeconds": 240, "characterId": "optional", "maxTrust": 0.4 },
      "characterId": "who-sends",
      "channel": "email|chat",
      "subject": "optional",
      "message": "realistic follow-up message"
    }
  ],
  "characterSecrets": {
    // Per-character secrets unlocked at trust thresholds
    "character-id": [
      { "threshold": 0.70, "secretId": "unique-id", "message": "revelation that changes the scenario" }
    ]
  },
  "constraintPatterns": {
    // Keywords in character replies that indicate a hidden constraint was revealed
    "character-id": [
      { "keywords": ["keyword1", "keyword2"], "constraint": "constraint-slug" }
    ]
  },
  "constraintLabels": {
    // Display labels for each constraint
    "constraint-slug": "Human-readable discovery label"
  },
  "crossCompanyReferences": [
    // 0-2 references to other companies in the Nebula universe
    {
      "sourceCompanyId": "${company.id}",
      "targetCompanyId": "other-company-id",
      "characterId": "who-mentions-it",
      "eventType": "alumni_reference|competitive_pressure|partnership|market_shift",
      "messageTemplate": "natural dialogue mentioning the other company",
      "triggerCondition": { "minElapsedSeconds": 300, "minTrust": 0.6 }
    }
  ],
  "domainSpecificContext": {
    "domain": "${domain}",
    "roleTitle": "${roleTitle}",
    "primaryMetrics": ["metric1", "metric2", "metric3"],
    "deliverables": ["deliverable1", "deliverable2"],
    "stakeholderDynamics": "2-3 sentences on the power dynamics",
    "industryContext": "2-3 sentences on the industry landscape"
  }
}

CRITICAL RULES:
1. Every character must have a HIDDEN piece of information they will only share under specific conditions.
2. The scenario must have at least ${difficulty === 'guided' ? '2' : difficulty === 'standard' ? '4' : '5'} hidden constraints.
3. Characters must have realistic interpersonal tensions — not everyone gets along.
4. The challenge must be genuinely ambiguous — there should be no obviously correct answer.
5. Initial messages should be long, detailed, and written in each character's distinct voice.
6. Kanban cards must be assigned using the FIRST LETTER of the character's first name in uppercase (e.g., 'S' for Sarah, 'M' for Marcus). Use 'Y' for the user/PM's own cards.
7. Timestamps for initialMessages should use negative offsets from current time (e.g., -5400000 for 90 min ago).
8. All trust values should be between 0.35 and 0.80.
9. Make the scenario feel REAL — use specific names, numbers, dates, and details.
10. The OKRs should be achievable within a 30-60 minute simulation session.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(cleaned) as GeneratedScenarioData;

  // Post-process: ensure timestamps are proper Date offsets
  parsed.initialMessages = parsed.initialMessages.map((msg, i) => ({
    ...msg,
    id: msg.id || `msg-${String(i + 1).padStart(3, '0')}`,
    timestamp: new Date(Date.now() + (typeof msg.timestamp === 'number' ? msg.timestamp : -(6000000 - i * 1200000))),
    read: false,
  }));

  // Ensure character IDs are consistent
  const charIds = parsed.characters.map(c => c.id);
  parsed.initialMessages.forEach(msg => {
    if (msg.from !== 'user' && !charIds.includes(msg.from)) {
      msg.from = charIds[0];
    }
  });

  return parsed;
}

// ── Scenario Variation (lightweight re-generation) ──────────────────────────

export async function generateScenarioVariation(
  baseScenario: GeneratedScenarioData,
  variationSeed: string,
): Promise<GeneratedScenarioData> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: `You are the Nebula Intelligence Engine. Given a base scenario, generate a VARIATION that keeps the same characters and company but changes the core challenge, hidden constraints, and market conditions. The variation should feel like a different week at the same company.

Variation seed: ${variationSeed}

Return a complete scenario JSON in the same format as the base scenario.`,
    messages: [{
      role: 'user',
      content: `BASE SCENARIO:\n${JSON.stringify(baseScenario, null, 2)}\n\nGenerate a variation. Return ONLY valid JSON, no markdown.`,
    }],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned);
}

// ── Dynamic Reply Enhancement ───────────────────────────────────────────────

export async function enhanceCharacterReply(
  characterId: string,
  baseReply: string,
  crossCompanyRefs: CrossCompanyReference[],
  elapsedSeconds: number,
  trust: number,
): Promise<string> {
  // Check if any cross-company reference should fire
  const applicable = crossCompanyRefs.filter(ref =>
    ref.characterId === characterId &&
    elapsedSeconds >= (ref.triggerCondition.minElapsedSeconds ?? 0) &&
    trust >= (ref.triggerCondition.minTrust ?? 0)
  );

  if (applicable.length === 0) return baseReply;

  // Pick one reference and weave it into the reply
  const ref = applicable[Math.floor(Math.random() * applicable.length)];

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Take this reply and naturally weave in a reference to another company. Keep the same tone and length.

Original reply: "${baseReply}"

Cross-company reference to include: "${ref.messageTemplate}"

Return ONLY the enhanced reply text, no JSON, no quotes.`,
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text.trim() : baseReply;
}

// ── Cascade Event Hydration ─────────────────────────────────────────────────
// Re-exported from cascade-hydrator.ts (client-safe, no Anthropic dependency)
export { hydrateCascadeEvents } from '../cascade-hydrator';
