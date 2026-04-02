/**
 * Phase 5 Company Catalog — 6 new companies across all 4 domains
 *
 * These are the STABLE LAYER entries from the blueprint.
 * Each has hardcoded characters, OKRs, Kanban, and prologue.
 * The Intelligence Engine can generate dynamic scenarios on top of these.
 *
 * Companies added:
 *   1. Orbit Layer          — Technology / PM
 *   2. Brightforge Systems  — Technology / Data & Analysis
 *   3. Beacon Mercer Group  — Consulting
 *   4. Silverline Capital   — Financial Services / Data & Analysis
 *   5. Verve Market Co.     — Consumer Goods / Marketing
 *   6. NovaCare Labs        — Healthcare / PM
 */

import type { Character, Message, OKR, KanbanColumn, CompanyCatalogEntry, SimCompany } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// 1. ORBIT LAYER — Cloud infrastructure, PM domain
// ═══════════════════════════════════════════════════════════════════════════

const ORBIT_COMPANY: SimCompany = {
  id: 'orbit-layer',
  name: 'Orbit Layer',
  industry: 'Cloud Infrastructure',
  size: '180 people, Series B',
  tagline: 'Developer-first cloud platform for startups scaling to enterprise.',
  challenge: 'Your flagship compute product is losing market share to a new entrant. Engineering wants to rebuild the core API, Sales is promising features you haven\'t scoped, and the CTO just left. You have 3 weeks before the annual developer conference keynote.',
  why: 'High-velocity PM challenge with technical depth and public-facing deadline pressure.',
  videoKeyword: 'cloud computing servers',
};

const ORBIT_CHARACTERS: Character[] = [
  {
    id: 'alex',
    name: 'Alex Reyes',
    title: 'VP Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    color: '#6366f1',
    personality: 'Technically brilliant but stretched thin after the CTO departure. Has been de facto CTO for three weeks and is burning out. Has a strong opinion that the API rewrite is technically necessary but has not shared the migration risk analysis with anyone. Will share it if asked directly about risks, not features. Responds well to structured thinking and poorly to hand-waving.',
    visibleAgenda: 'Get executive approval for the API v3 rewrite before the conference. Needs headcount commitment for two senior engineers by end of quarter.',
    trust: 0.55,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'nina',
    name: 'Nina Okafor',
    title: 'Head of Sales',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    color: '#f59e0b',
    personality: 'High-energy closer with a pipeline worth $8M. Has promised three enterprise prospects a "next-gen compute API" without checking feasibility. Knows she over-promised but believes the deals justify the pressure. Has intelligence about a competitor acquisition that nobody else knows — will share if trust is above 0.60 and the conversation touches competitive landscape.',
    visibleAgenda: 'Lock in at least two of the three enterprise deals before conference. Needs a product demo she can show at the conference booth.',
    trust: 0.48,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'ravi',
    name: 'Ravi Krishnan',
    title: 'Principal Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    color: '#14b8a6',
    personality: 'The most technically respected person in the company. Quiet, precise, and deeply skeptical of management promises. Wrote 40% of the current compute engine. Has identified a way to deliver 80% of the API v3 benefits through a compatibility layer that takes 2 weeks instead of 3 months — but will only share this if he trusts the PM enough to believe it won\'t be misrepresented to Sales as "done."',
    visibleAgenda: 'Protect code quality. Prevent another half-baked launch like the storage product last year.',
    trust: 0.42,
    emotion: 'disengaged',
    online: false,
  },
  {
    id: 'diana_o',
    name: 'Diana Ortiz',
    title: 'Head of Developer Relations',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    color: '#ec4899',
    personality: 'The voice of the developer community inside the company. Has direct feedback from 200+ developers about what they actually want — and it is not what Sales is promising. Has been compiling a "developer wish list" report that contradicts the Sales narrative. Will share proactively if included in planning conversations. Frustrated at being treated as "marketing" rather than a strategic function.',
    visibleAgenda: 'Ensure the conference keynote demo reflects actual developer needs, not Sales pipeline fantasies.',
    trust: 0.65,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'james_l',
    name: 'James Liu',
    title: 'CEO',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    color: '#059669',
    personality: 'Board-pressured founder trying to hold the company together after losing his CTO co-founder. Publicly projects confidence but privately is worried about the next fundraise. Has a board meeting two days after the conference and needs the keynote to go well. Knows the competitor acquisition rumor but has not connected it to Nina\'s pipeline intelligence. Will share board context if the PM demonstrates strategic thinking.',
    visibleAgenda: 'Deliver a conference keynote that signals momentum. No public missteps. Needs a unified product narrative by next Friday.',
    trust: 0.58,
    emotion: 'neutral',
    online: true,
  },
];

const ORBIT_INITIAL_MESSAGES: Message[] = [
  {
    id: 'orbit-msg-001',
    from: 'james_l',
    to: 'user',
    channel: 'email',
    subject: 'Conference keynote — you own product narrative',
    body: `We are three weeks out from DevSummit, our annual developer conference. Last year we had 2,400 attendees. This year we are projecting 3,800 — partly because the CTO departure made news and people want to see if we are still standing.

I need you to own the product narrative for the keynote. That means: what are we announcing, what is the roadmap signal we are sending, and how does it all hold together as a story.

Here is the reality: our compute product is losing share. Usage growth went from 34% QoQ to 11% this quarter. Three enterprise prospects are in late-stage pipeline but they need to see something concrete at the conference. Alex wants a full API rewrite. Nina wants a demo she can show in the booth. Ravi has not said much but when Ravi is quiet it usually means he disagrees with everyone.

Diana has developer community data that is probably relevant. Talk to her.

The keynote rehearsal is in 12 days. The final narrative lock is in 8 days. Move fast but do not cut corners — the board is watching this one closely.

— James`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'orbit-msg-002',
    from: 'alex',
    to: 'user',
    channel: 'email',
    subject: 'Engineering reality check — API v3',
    body: `I know James wants a conference story. Here is the engineering story:

The current compute API (v2) has fundamental architectural limitations. It was designed for single-region deployments. Multi-region support was bolted on and it shows — latency spikes, inconsistent state management, and a growing list of edge cases that eat engineering time.

API v3 is not a nice-to-have. It is a rewrite of the request routing layer, the state synchronization protocol, and the billing integration. Full timeline: 12 weeks minimum. We cannot ship a partial v3 — it is all or nothing because of the state sync dependency.

What I need from you: a clear scope decision before the conference. Are we announcing v3 as a roadmap item (coming Q1 next year), or are we trying to demo something at DevSummit? Those are two very different engineering plans and I need to brief my team this week.

I lost my best infrastructure engineer to Cloudflare last month. Capacity is at 91%. Do not assume we can absorb scope additions.

— Alex`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'orbit-msg-003',
    from: 'nina',
    to: 'user',
    channel: 'email',
    subject: 'Pipeline update — need product commitment',
    body: `Three enterprise deals in late stage:

1. Meridian Logistics — $2.4M ARR, needs multi-region compute with <50ms latency guarantee. Their CTO saw our v2 limitations in a POC last month.
2. DataStream Analytics — $1.8M ARR, needs the new API for their real-time pipeline. They are evaluating us against Render and Railway.
3. Cascade Health — $1.1M ARR, smaller but strategic — first healthcare customer. Need SOC 2 compliance story.

Combined pipeline: $5.3M. Current ARR: $12M. These deals move the needle.

I told all three they would "see something significant at DevSummit." I did not promise v3 specifically but I strongly implied next-generation capabilities. If we show up with incremental improvements, I lose credibility and probably lose DataStream to Railway.

Can we get 30 minutes today? I need to know what I can promise.

— Nina`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'orbit-msg-004',
    from: 'diana_o',
    to: 'user',
    channel: 'email',
    subject: 'Developer feedback — not what you might expect',
    body: `I compiled feedback from our last three developer surveys, community Discord, and 47 support tickets tagged "feature request" this quarter.

The top three requests from actual developers are:
1. Better observability / debugging tools (mentioned 68 times)
2. Simplified deployment configuration (mentioned 54 times)
3. Faster cold start times (mentioned 41 times)

Multi-region compute — what Sales is pushing — ranks #7 with 12 mentions. It matters to enterprise, but our developer base (which drives adoption and word-of-mouth) cares about developer experience, not infrastructure architecture.

I have a full report with quotes and sentiment analysis. Happy to walk you through it. But the headline is: if we use the conference keynote to announce enterprise infrastructure features, we will lose the developer audience that made this company successful. The conference is called DEVSummit, not EnterpriseSummit.

There is a version of this where we announce developer experience improvements AND signal enterprise readiness. But it requires thinking about the narrative differently than "what closes deals this quarter."

— Diana`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'orbit-msg-005',
    from: 'ravi',
    to: 'user',
    channel: 'chat',
    body: `Quick note: I reviewed Alex's v3 proposal. The architecture is sound but the timeline is optimistic. He is quoting 12 weeks assuming full team allocation. Realistically it is 16-18 weeks given current commitments. I have not told him this yet because I wanted to see if anyone asks the right questions first.`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const ORBIT_INITIAL_OKRS: OKR[] = [
  { id: 'orbit-okr1', title: 'Lock conference keynote narrative with all stakeholders aligned by day 8', status: 'in_progress', progress: 10 },
  { id: 'orbit-okr2', title: 'Resolve API v3 scope: full rewrite vs. compatibility layer vs. phased approach', status: 'pending', progress: 0 },
  { id: 'orbit-okr3', title: 'Give Sales a credible conference demo plan they can share with pipeline prospects', status: 'pending', progress: 0 },
  { id: 'orbit-okr4', title: 'Incorporate developer community feedback into product roadmap narrative', status: 'pending', progress: 0 },
  { id: 'orbit-okr5', title: 'Align CEO on board-ready product story before keynote rehearsal', status: 'pending', progress: 0 },
];

const ORBIT_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'ok1', title: 'Review Diana\'s developer feedback report', tag: 'DevRel', assignee: 'D', priority: 'high', notes: '', linkedOkr: 'orbit-okr4' },
      { id: 'ok2', title: 'Get Ravi\'s honest v3 timeline assessment', tag: 'Eng', assignee: 'R', priority: 'high', notes: '', linkedOkr: 'orbit-okr2' },
      { id: 'ok3', title: 'Map Nina\'s pipeline promises to actual capabilities', tag: 'Sales', assignee: 'N', priority: 'high', notes: '', linkedOkr: 'orbit-okr3' },
      { id: 'ok4', title: 'Competitive landscape brief — Railway, Render threats', tag: 'Strategy', assignee: 'N', priority: 'med', notes: '' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'ok5', title: 'Engineering scope evaluation — v3 options', tag: 'Eng', assignee: 'A', priority: 'high', notes: '', linkedOkr: 'orbit-okr2' },
      { id: 'ok6', title: 'Draft keynote narrative outline', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'orbit-okr1' },
      { id: 'ok7', title: 'Stakeholder alignment notes', tag: 'Process', assignee: 'Y', priority: 'med', notes: '' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'ok8', title: 'Existing v2 capability audit', tag: 'Eng', assignee: 'Y', priority: 'med', notes: '', linkedOkr: 'orbit-okr2' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'ok9', title: 'Conference logistics confirmed', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const ORBIT_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'james_l', delay: 0, text: "Team — DevSummit is in three weeks. We need a product story. I'm bringing in a new PM to own this." },
  { from: 'alex', delay: 2800, text: "A new PM? Right now? We're mid-architecture decision and I still don't have headcount approval." },
  { from: 'nina', delay: 5500, text: "We need someone who can bridge engineering and the pipeline. I have $5M in deals waiting on a product commitment." },
  { from: 'ravi', delay: 7800, text: "I'd settle for someone who asks the right questions before making promises." },
  { from: 'diana_o', delay: 10200, text: "Has anyone actually looked at what developers are asking for? Because it's not what's in the pipeline deck." },
  { from: 'alex', delay: 12800, text: "Diana, not now. We need to resolve the v3 architecture question first." },
  { from: 'diana_o', delay: 15500, text: "That's exactly the problem. Architecture first, developers second. Every time." },
  { from: 'james_l', delay: 18200, text: "Let's give the new PM space to work. I'll brief them and get out of the way." },
  { from: 'ravi', delay: 20800, text: "..." },
];

const ORBIT_CASCADE_EVENTS = [
  {
    id: 'ravi_ignored_4min',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('ravi_ignored_4min') && s.elapsedSeconds > 60 && (s.elapsedSeconds - (s.lastContactedAt['ravi'] ?? 0)) > 240,
    characterId: 'ravi',
    channel: 'chat' as const,
    message: "I noticed you've been talking to Alex and Nina but not me. For what it's worth, I have a perspective on the v3 timeline that might save you a week of misalignment. Up to you.",
  },
  {
    id: 'nina_pressure',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('nina_pressure') && s.elapsedSeconds > 420,
    characterId: 'nina',
    channel: 'email' as const,
    subject: 'DataStream update — they want an answer by Thursday',
    message: "DataStream's CTO just emailed me. They have a Railway demo scheduled for next Tuesday. If we don't give them something concrete about our conference announcements by Thursday, they're going with Railway for their initial deployment. That's $1.8M walking.",
  },
  {
    id: 'james_follow_up',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('james_follow_up') && s.elapsedSeconds > 600 && !(s.lastContactedAt['james_l']),
    characterId: 'james_l',
    channel: 'email' as const,
    subject: 'Keynote narrative — where are we?',
    message: "Haven't heard an update on the keynote story. Board meeting is two days after the conference — I need the narrative locked so I can build the board deck around it. What's your read on the path forward?",
  },
];

const ORBIT_SECRETS: Record<string, { threshold: number; secretId: string; message: string }[]> = {
  ravi: [
    { threshold: 0.62, secretId: 'ravi_compat_layer', message: "Look — I didn't want to say this in front of Alex because he's emotionally invested in the full rewrite. But there's a compatibility layer approach. We wrap the v2 API in a v3-compatible interface. Developers get the new API surface, we get time to do the real rewrite in Q1. Two weeks of work, maybe three. It's not elegant but it's honest and it ships." },
    { threshold: 0.78, secretId: 'ravi_timeline_truth', message: "Alex's 12-week estimate for v3 is wrong. It's 16-18 weeks with current capacity. I've done the math. He knows this but he's afraid that if he quotes the real number, James will cancel the project entirely. I'm telling you because someone needs to plan around reality, not optimism." },
  ],
  nina: [
    { threshold: 0.60, secretId: 'nina_competitor_intel', message: "Something I haven't shared with the team yet: I heard through a contact that Railway is in acquisition talks with a major cloud provider. If that goes through, they'll have enterprise credibility we can't match with a startup brand. The window to lock in these deals is the next 60 days, not next quarter." },
  ],
  james_l: [
    { threshold: 0.72, secretId: 'james_fundraise', message: "Between us — we have about 14 months of runway. The board wants to see us at $20M ARR before we raise Series C. We're at $12M. These enterprise deals aren't just revenue — they're the difference between raising on our terms and raising from a position of weakness. The conference is make-or-break for the fundraise narrative." },
  ],
  alex: [
    { threshold: 0.70, secretId: 'alex_burnout', message: "I need to be honest with you. I've been doing two jobs since the CTO left and I'm burning out. If we commit to the full v3 rewrite on top of everything else, I'll probably lose another engineer — and it might be me. The compat layer idea Ravi has... I know about it. I just didn't want to admit that the 'right' technical answer might be the pragmatic one." },
  ],
  diana_o: [
    { threshold: 0.68, secretId: 'diana_churn_data', message: "I didn't include this in my report because it's more speculative, but I've been tracking developer churn on our platform. We lost 340 active developers this quarter — that's a 12% churn rate. The ones leaving are citing 'developer experience' as the reason, not features. If we announce enterprise features at DevSummit without addressing DX, we'll accelerate the churn." },
  ],
};

const ORBIT_CONSTRAINT_PATTERNS: Record<string, Array<{ keywords: string[]; constraint: string }>> = {
  ravi: [{ keywords: ['compatibility layer', 'compat layer', 'wrapper', 'two weeks', '2 weeks'], constraint: 'compat_layer' }],
  nina: [{ keywords: ['railway', 'acquisition', 'being acquired', '60 days'], constraint: 'competitor_acquisition' }],
  james_l: [{ keywords: ['runway', '14 months', 'series c', 'fundraise'], constraint: 'fundraise_pressure' }],
  alex: [{ keywords: ['burning out', 'burnout', 'two jobs', 'might be me'], constraint: 'leadership_risk' }],
  diana_o: [{ keywords: ['developer churn', '340 developers', '12% churn', 'accelerate'], constraint: 'developer_churn' }],
};

const ORBIT_CONSTRAINT_LABELS: Record<string, string> = {
  compat_layer: 'Compatibility layer shortcut identified',
  competitor_acquisition: 'Railway acquisition intelligence surfaced',
  fundraise_pressure: 'Series C fundraise pressure revealed',
  leadership_risk: 'VP Engineering burnout risk uncovered',
  developer_churn: 'Developer platform churn data unlocked',
};

const ORBIT_REPLY_MAP: Record<string, string[]> = {
  alex: [
    "The v3 architecture is not optional — it's the foundation for everything else. But I need you to understand what 'everything else' costs in engineering weeks.",
    "If we go compat layer, I need it in writing that this is a bridge, not the destination. My team won't accept a hack as the long-term plan.",
    "Capacity is at 91%. Every new commitment means something else slips. Tell me what to deprioritise.",
  ],
  nina: [
    "I need something concrete for the conference booth. Not a roadmap slide — a working demo. DataStream's CTO will be there in person.",
    "$5.3M in pipeline. That's not a Sales problem — that's a company problem. Help me protect these deals.",
    "Railway is moving fast. If we don't announce something meaningful at DevSummit, we lose the enterprise narrative entirely.",
  ],
  ravi: [
    "I'll engage when there's a technical conversation worth having. Right now everyone is arguing about strategy without understanding the architecture.",
    "Ask Alex about the v3 timeline. Then ask me. You'll get two different numbers.",
    "The compat layer works. It's not pretty, but it ships. That's a trade-off worth discussing if anyone is willing to be honest.",
  ],
  diana_o: [
    "Developers don't care about your pipeline. They care about whether the platform makes their life easier or harder.",
    "The community feedback is clear. I can show you the data or you can ignore it — but the conference audience won't.",
    "There's a narrative that serves both enterprise and developer audiences. It just requires thinking beyond this quarter.",
  ],
  james_l: [
    "I need the keynote to signal momentum. The board reads conference coverage. A weak keynote becomes a weak board meeting.",
    "Give me one clear story I can tell — to the audience, to the board, to investors. Not three stories. One.",
    "The CTO departure was a hit. This conference is our chance to show it didn't break us. Don't waste it.",
  ],
};

const ORBIT_CARD_REACTIONS: Record<string, {
  toInProgress: { high: string[]; mid: string[]; low: string[] };
  toReview: { high: string[]; mid: string[]; low: string[] };
  toDone: { natural: string[]; earlyClose: string[]; low: string[] };
  toBacklog: string[];
}> = {
  alex: {
    toInProgress: {
      high: ["On it. I'll have a technical assessment by end of day.", "Moving — but I need the scope locked before I brief the team."],
      mid: ["I can pick this up but we're stretched. What comes off the list?", "Working on it. Don't promise anything to Nina until I've assessed feasibility."],
      low: ["I'll get to it when I can. My team is at capacity.", "Fine. But moving cards doesn't change the engineering reality."],
    },
    toReview: {
      high: ["Ready for your review. The technical constraints are documented — read them before deciding.", "In review. I need feedback by tomorrow or we lose a day."],
      mid: ["In review. Make sure you understand the trade-offs before signing off.", "Review stage. The timeline assumptions are in the notes."],
      low: ["It's in review.", "Noted."],
    },
    toDone: {
      natural: ["Good — that's closed out.", "Done. One less thing on the board."],
      earlyClose: ["That's not finished. Don't mark it done until engineering signs off.", "Premature. The technical review hasn't happened yet."],
      low: ["I'm reopening that. The work isn't complete.", "Not accurate. Please check with me before closing engineering items."],
    },
    toBacklog: ["Fine — deprioritised. But if this comes back urgent later, remember it was a choice.", "Noted. Tell me when it matters again."],
  },
  nina: {
    toInProgress: {
      high: ["Good — I'll prep the client-facing version. What's the timeline I can share?", "On it. Can we sync before EOD so I have something for the prospect calls?"],
      mid: ["I can reprioritise but I'm mid-prep for the DataStream meeting.", "Working on it. Just need a date I can put in an email."],
      low: ["Cards don't close deals. Give me something concrete.", "I'll get to it when I have product clarity."],
    },
    toReview: {
      high: ["At your end. Whatever comes out — I need a version for the sales deck.", "In review. Flag anything that changes the competitive story."],
      mid: ["In review. The pipeline clock is ticking.", "Noted. Don't let this sit too long — DataStream is evaluating alternatives."],
      low: ["Fine, in review.", "I'll follow up."],
    },
    toDone: {
      natural: ["Great — I'll update the pipeline notes.", "Closed. That helps."],
      earlyClose: ["That's not done from a Sales perspective. I still need outcomes I can communicate.", "Don't close this — the prospect hasn't been updated yet."],
      low: ["I'm flagging this as still open. No resolution for the pipeline yet.", "Not done until I have something to tell the customer."],
    },
    toBacklog: ["If this affects the pipeline, I need to know why it's being deprioritised.", "Noted. The revenue impact is on record."],
  },
  ravi: {
    toInProgress: {
      high: ["I'll look at it. Expect an honest assessment, not a comfortable one.", "On it. I'll flag anything that doesn't add up technically."],
      mid: ["I can pick this up. Don't expect me to rubber-stamp Alex's timeline though.", "Working on it. I'll share findings when I have something worth sharing."],
      low: ["I'll get to it in my own time.", "Fine."],
    },
    toReview: {
      high: ["In review. The technical details matter — read the full assessment.", "Ready for review. I've included the compat layer analysis."],
      mid: ["In review. Ask me if anything is unclear.", "Review stage. The numbers are in the notes."],
      low: ["In review.", "Noted."],
    },
    toDone: {
      natural: ["Closed.", "Done. The analysis stands."],
      earlyClose: ["The analysis isn't complete. Don't close it.", "That's premature. I haven't finished the technical review."],
      low: ["Reopening. The work isn't done and I won't have incomplete analysis marked as finished.", "Not done."],
    },
    toBacklog: ["Fine. Let me know when technical rigour matters again.", "Deprioritised. Noted."],
  },
  diana_o: {
    toInProgress: {
      high: ["On it. I'll pull the community data into a format that works for the keynote narrative.", "Picking this up. Want the full report or the executive summary?"],
      mid: ["I'll work on it. Just hoping it doesn't get shelved like the last community report.", "Moving. I'd like to present this directly — the context matters."],
      low: ["I'll do it. But I'd like to know upfront if anyone will actually read it.", "Fine. Working on it."],
    },
    toReview: {
      high: ["In review. The developer quotes are the most important part — don't skip them.", "Ready for review. Happy to walk you through the methodology."],
      mid: ["In review. Please don't strip the qualitative context.", "Review stage. The sentiment data is in the appendix."],
      low: ["In review.", "It's there."],
    },
    toDone: {
      natural: ["Good to have that closed.", "Done. Hope it influences the keynote."],
      earlyClose: ["The community analysis isn't finished. Don't mark it done.", "That's premature — I haven't included the churn correlation data yet."],
      low: ["Reopening. The work isn't complete.", "Not done. Please don't close my work without checking."],
    },
    toBacklog: ["Deprioritising community feedback. Again. Noted.", "Fine. I'll be here when someone wants to listen."],
  },
  james_l: {
    toInProgress: {
      high: ["Good. Keep me posted on the narrative direction.", "Moving — I trust your judgment. Escalate if you hit a blocker."],
      mid: ["I'll look at it. The board context shapes everything here.", "On it. Make sure this feeds into the keynote timeline."],
      low: ["I'll review when I can.", "Noted."],
    },
    toReview: {
      high: ["In review. I'll give you feedback quickly — the clock is ticking.", "Looking at it. This needs to work for the conference AND the board."],
      mid: ["In review. Connect it to the fundraise narrative.", "Review stage. I'll respond by end of day."],
      low: ["I'll look at it when I can.", "Noted."],
    },
    toDone: {
      natural: ["Good. One less thing between us and the conference.", "Done. Make sure it's reflected in the keynote prep."],
      earlyClose: ["Is this actually resolved? I need to be confident before it goes to the board.", "Don't mark it done if there are open questions."],
      low: ["I want to verify this is truly closed before I reference it in board prep.", "Not confident this is done."],
    },
    toBacklog: ["If it's not critical for the conference, fine. But nothing gets forgotten — it goes on the Q1 list.", "Deprioritised. Understood."],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. BRIGHTFORGE SYSTEMS — Technology / Data & Analysis domain
// ═══════════════════════════════════════════════════════════════════════════

const BRIGHTFORGE_COMPANY: SimCompany = {
  id: 'brightforge-systems',
  name: 'Brightforge Systems',
  industry: 'Enterprise Analytics',
  size: '240 people, Series C',
  tagline: 'Real-time analytics platform for operational decision-making.',
  challenge: 'The data pipeline is breaking under scale — 3x data volume increase from a major client. The analytics team is split between fixing reliability and building the new predictive module that Sales has already sold. Your CEO wants a "data strategy" for the board in 5 days.',
  why: 'Data-centric challenge requiring analytical rigour and stakeholder translation.',
  videoKeyword: 'data analytics dashboard',
};

const BRIGHTFORGE_CHARACTERS: Character[] = [
  {
    id: 'maya',
    name: 'Maya Torres',
    title: 'VP Data Engineering',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    color: '#8b5cf6',
    personality: 'Methodical data engineer who has been warning about pipeline scalability for two quarters. Her warnings were deprioritised in favour of new features. Has a migration plan ready but needs 6 weeks and 3 dedicated engineers. Knows that the "predictive module" Sales sold requires clean data that the current pipeline cannot guarantee — will share this if asked about data quality implications.',
    visibleAgenda: 'Get pipeline reliability fixed before adding more features. Needs headcount and a scope freeze.',
    trust: 0.58,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'derek',
    name: 'Derek Huang',
    title: 'Head of Analytics',
    avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
    color: '#06b6d4',
    personality: 'The bridge between data engineering and business stakeholders. Excellent at translating technical concepts but has been caught between Maya\'s reliability concerns and Sales promises. Has discovered that 23% of the data feeding client dashboards has quality issues — latency-induced duplicates that nobody outside his team knows about. Will share if trust is above 0.65.',
    visibleAgenda: 'Protect dashboard accuracy for existing clients while somehow supporting the predictive module timeline.',
    trust: 0.62,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'sarah_k',
    name: 'Sarah Kim',
    title: 'Sales Director',
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    color: '#f97316',
    personality: 'Ambitious closer who sold the predictive analytics module to two enterprise clients with a Q3 delivery date. She genuinely believes the product can deliver — she just does not understand the data engineering complexity. Has a relationship with the CTO of the largest client (Vanguard Logistics) and can arrange a direct conversation that would reveal the client\'s actual priorities differ from what Sales assumed.',
    visibleAgenda: 'Protect the two predictive module deals ($3.2M combined). Needs a delivery timeline she can share.',
    trust: 0.50,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'chen',
    name: 'Chen Wei',
    title: 'Chief Data Officer',
    avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    color: '#059669',
    personality: 'Senior leader who joined 8 months ago from a FAANG company. Has strong opinions about data governance that clash with the startup speed culture. Knows about a potential data privacy issue in the pipeline that could become a regulatory problem if not addressed — the pipeline logs contain PII that should have been redacted. Will share only if directly asked about compliance.',
    visibleAgenda: 'Build a defensible data strategy that satisfies the board and positions the company for enterprise scale.',
    trust: 0.55,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'lena',
    name: 'Lena Borisova',
    title: 'ML Engineer Lead',
    avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
    color: '#ec4899',
    personality: 'Brilliant ML engineer who built the prototype predictive module. Knows it works on clean data but will fail on the current pipeline output. Has been quietly building a data quality layer that could solve both the pipeline and ML problems — a "data mesh" approach that Maya doesn\'t know about. Will share if she feels her technical judgment is respected.',
    visibleAgenda: 'Ship the predictive module properly. Refuses to launch something that will give wrong predictions to enterprise clients.',
    trust: 0.45,
    emotion: 'disengaged',
    online: false,
  },
];

const BRIGHTFORGE_INITIAL_MESSAGES: Message[] = [
  {
    id: 'bf-msg-001',
    from: 'chen',
    to: 'user',
    channel: 'email',
    subject: 'Data strategy — board presentation in 5 days',
    body: `Welcome aboard. I wish the timing were better.

The board meeting is Friday. They want a "data strategy" presentation that covers three things: pipeline reliability, the predictive analytics roadmap, and our data governance posture. Right now, none of those three are in a state I would be comfortable presenting.

The pipeline has been struggling since Vanguard Logistics tripled their data volume three weeks ago. Maya's team is firefighting daily. Derek's analytics dashboards are downstream of the pipeline — if the pipeline is unreliable, the dashboards are unreliable. And Sales has already sold a predictive analytics module that depends on data quality we cannot currently guarantee.

I need you to own the synthesis. Talk to Maya about engineering reality, Derek about the analytics impact, Sarah about the commercial commitments, and Lena about the ML readiness. Then give me a strategy I can present to the board that is honest about where we are and credible about where we are going.

One thing I am not willing to do: present a strategy that papers over known problems. The board will see through it and it will damage our credibility at exactly the wrong time.

— Chen`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'bf-msg-002',
    from: 'maya',
    to: 'user',
    channel: 'email',
    subject: 'Pipeline status — it\'s worse than the dashboards show',
    body: `I need to be direct: the pipeline is not scaling. When Vanguard tripled their volume, our ingestion layer started dropping events. We are currently losing approximately 2.3% of incoming data points during peak hours. That number has been growing weekly.

The root cause is architectural — our batch processing was designed for 500M events/day. We are now at 1.4B and climbing. Patching is not going to fix this. We need a streaming architecture migration.

Timeline for proper fix: 6 weeks with 3 dedicated engineers. I currently have 1.5 dedicated (the other half of Amir's time is on the predictive module support that Sales requested).

What I need from you: a scope decision. Are we fixing the foundation or are we building new features on a crumbling one? Because right now we are trying to do both and failing at both.

— Maya`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'bf-msg-003',
    from: 'sarah_k',
    to: 'user',
    channel: 'email',
    subject: 'Predictive module — client timeline pressure',
    body: `Two enterprise deals depend on the predictive analytics module:

1. Vanguard Logistics — $2.1M ARR expansion (existing client, adding predictive to their analytics suite). Their COO, Maria Chen, has built her Q4 operational planning around our predictive output. She expects a working module by September 15th.

2. Atlas Manufacturing — $1.1M ARR (new client). Signed specifically because of the predictive demo we showed them. Contract includes a delivery milestone tied to $400K of the first-year payment.

Combined exposure: $3.2M ARR, with $400K in contractual milestone risk.

I understand there are engineering challenges. I am not asking anyone to cut corners. I am asking for a realistic timeline I can communicate so I can manage these relationships rather than damage them.

— Sarah`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'bf-msg-004',
    from: 'derek',
    to: 'user',
    channel: 'chat',
    body: `Quick heads up before you dig into the pipeline situation: the data quality issue is worse than Maya's email suggests. I've been tracking dashboard accuracy for the past two weeks. 23% of Vanguard's real-time metrics have duplicate or delayed data points. Their ops team hasn't noticed yet because the duplicates average out over 24-hour views. But if they switch to hourly views — which they're planning to do with the predictive module — the errors will be visible. I haven't told Sales yet because I wanted to quantify the scope first.`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'bf-msg-005',
    from: 'lena',
    to: 'user',
    channel: 'email',
    subject: 'ML module readiness — honest assessment',
    body: `The predictive module prototype works. I have shown it with clean data and the accuracy is 87% on operational predictions — that is genuinely impressive for this problem space.

The issue: it was trained and validated on clean historical data. The current pipeline output is not clean. If we feed it live pipeline data with the quality issues Maya is describing, prediction accuracy drops to approximately 54%. That is worse than a coin flip for some prediction categories.

I am not willing to ship a module that gives enterprise clients bad predictions. The reputational damage would be worse than a delayed launch.

However, I have been working on something that might bridge the gap. It is early-stage but I am happy to discuss if you have time.

— Lena`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const BRIGHTFORGE_INITIAL_OKRS: OKR[] = [
  { id: 'bf-okr1', title: 'Deliver a credible data strategy for the board presentation by Friday', status: 'in_progress', progress: 5 },
  { id: 'bf-okr2', title: 'Resolve pipeline reliability vs. predictive module scope conflict', status: 'pending', progress: 0 },
  { id: 'bf-okr3', title: 'Quantify and communicate the data quality risk to all stakeholders', status: 'pending', progress: 0 },
  { id: 'bf-okr4', title: 'Give Sales a realistic predictive module timeline with client communication plan', status: 'pending', progress: 0 },
];

const BRIGHTFORGE_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'bk1', title: 'Review Lena\'s data quality bridging approach', tag: 'ML', assignee: 'L', priority: 'high', notes: '', linkedOkr: 'bf-okr2' },
      { id: 'bk2', title: 'Map Sarah\'s client commitments to actual capability', tag: 'Sales', assignee: 'S', priority: 'high', notes: '', linkedOkr: 'bf-okr4' },
      { id: 'bk3', title: 'Get Derek\'s full data quality audit report', tag: 'Analytics', assignee: 'D', priority: 'high', notes: '', linkedOkr: 'bf-okr3' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'bk4', title: 'Pipeline migration scope assessment with Maya', tag: 'Eng', assignee: 'M', priority: 'high', notes: '', linkedOkr: 'bf-okr2' },
      { id: 'bk5', title: 'Draft board data strategy outline', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'bf-okr1' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'bk6', title: 'Current pipeline performance baseline doc', tag: 'Eng', assignee: 'Y', priority: 'med', notes: '', linkedOkr: 'bf-okr3' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'bk7', title: 'Stakeholder meeting schedule set', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const BRIGHTFORGE_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'chen', delay: 0, text: "Team — board presentation is Friday. I'm bringing in someone to help synthesise our data strategy." },
  { from: 'maya', delay: 2800, text: "We need someone who understands that reliability comes before features. The pipeline is not stable." },
  { from: 'sarah_k', delay: 5500, text: "And we need someone who understands that $3.2M in pipeline comes with commitments we've already made." },
  { from: 'derek', delay: 7800, text: "Has anyone looked at the actual dashboard accuracy numbers recently? Because I have." },
  { from: 'lena', delay: 10200, text: "The ML module works. On clean data. Whether we have clean data is apparently a matter of debate." },
  { from: 'maya', delay: 12800, text: "It's not a debate, Lena. The pipeline is losing 2.3% of events. That's a fact." },
  { from: 'sarah_k', delay: 15500, text: "Can we focus on solutions? Atlas Manufacturing signed a contract. We have obligations." },
  { from: 'chen', delay: 18200, text: "Let's give the new analyst space to assess. I need this synthesised, not argued." },
];

// ═══════════════════════════════════════════════════════════════════════════
// 3. BEACON MERCER GROUP — Consulting domain
// ═══════════════════════════════════════════════════════════════════════════

const BEACON_COMPANY: SimCompany = {
  id: 'beacon-mercer',
  name: 'Beacon Mercer Group',
  industry: 'Management Consulting',
  size: '85 people, boutique',
  tagline: 'Strategy consulting for mid-market growth companies.',
  challenge: 'A critical client engagement is off-track. The client CEO is losing confidence, your team is misaligned on the recommendation, and a competitor firm is circling. You have 4 days to turn the engagement around before the steering committee meeting.',
  why: 'Client management under pressure — the core consulting skill.',
  videoKeyword: 'business consulting meeting',
};

const BEACON_CHARACTERS: Character[] = [
  {
    id: 'victoria',
    name: 'Victoria Ashford',
    title: 'Managing Partner',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    color: '#7c3aed',
    personality: 'Razor-sharp strategist who built the firm from 12 people. Expects structured thinking and will test you with deliberately vague questions. Has a relationship with the client CEO that she is protecting — she knows the CEO is considering bringing in McKinsey for a "second opinion" but has not told the team because she does not want to create panic. Will share if she trusts your judgment.',
    visibleAgenda: 'Save the client relationship. This is a $1.2M engagement and the firm\'s largest account. A loss here damages the firm\'s market position.',
    trust: 0.52,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'omar',
    name: 'Omar Patel',
    title: 'Engagement Manager',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    color: '#0891b2',
    personality: 'Experienced project manager who is genuinely trying to hold the engagement together. The team under him is split — two analysts have a fundamentally different hypothesis about the client\'s problem. He has been unable to resolve it because both hypotheses have supporting data. He has a key insight he has not shared: the client\'s CFO privately told him that budget cuts are coming regardless of the engagement recommendation. This changes everything.',
    visibleAgenda: 'Deliver a unified team recommendation for the steering committee. Needs the analyst disagreement resolved.',
    trust: 0.64,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'jessica',
    name: 'Jessica Reeves',
    title: 'Senior Analyst',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    color: '#db2777',
    personality: 'Data-driven analyst who believes the client should consolidate operations — her analysis shows 30% cost savings through facility rationalization. She is technically correct but her recommendation would result in 200 layoffs, which the client CEO is emotionally unwilling to do. Has not considered the political dimension. Very confident in her work and becomes defensive when challenged.',
    visibleAgenda: 'Present the operations consolidation recommendation. Believes the data speaks for itself.',
    trust: 0.58,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'kai',
    name: 'Kai Nakamura',
    title: 'Senior Analyst',
    avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
    color: '#d97706',
    personality: 'Strategic thinker who believes the client should invest in growth — market expansion into adjacent segments. His analysis shows a 40% revenue upside over 3 years. He is directionally right but his numbers depend on assumptions the client may not be able to fund, especially given the CFO\'s private budget cut signal. Has client industry expertise that Jessica lacks. Respects data but believes strategy requires judgment beyond spreadsheets.',
    visibleAgenda: 'Present the growth strategy recommendation. Believes consolidation is a death spiral for the client.',
    trust: 0.60,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'margaret',
    name: 'Margaret Thornton',
    title: 'Client CEO (NPC)',
    avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
    color: '#059669',
    personality: 'Tired but determined CEO of the client company (Hawthorne Industries). She hired Beacon Mercer for strategic clarity but is losing faith. She has heard "conflicting signals" from the team and is worried they do not understand her business. She values directness over polish. Has one non-negotiable she has not stated clearly: she will not approve any plan that leads to mass layoffs in her hometown plant.',
    visibleAgenda: 'Get one clear, actionable recommendation before the steering committee. If Beacon Mercer cannot deliver, she will bring in a second firm.',
    trust: 0.40,
    emotion: 'frustrated',
    online: false,
  },
];

const BEACON_INITIAL_MESSAGES: Message[] = [
  {
    id: 'bm-msg-001',
    from: 'victoria',
    to: 'user',
    channel: 'email',
    subject: 'Hawthorne engagement — situation brief',
    body: `I am pulling you onto the Hawthorne Industries engagement effective immediately. Here is why:

The engagement started 6 weeks ago. Scope: strategic review of Hawthorne's operations and growth options. $1.2M fee, our largest active engagement. The steering committee meets in 4 days and we do not have a unified recommendation.

The problem: Jessica and Kai have produced two fundamentally different recommendations. Jessica says consolidate operations for cost savings. Kai says invest in market expansion for growth. Both have data. Both are partially right. Neither has produced something I can put in front of Margaret Thornton (Hawthorne's CEO) without one of them undermining the other in Q&A.

Margaret is losing patience. She told me on Friday that she expected "one clear direction, not a strategy debate." She is the kind of CEO who values decisiveness over perfect analysis. If we show up to the steering committee with internal disagreement visible, we will lose the account.

Your job: synthesise the two analyses, resolve the conflict, and produce one recommendation the full team can stand behind. You have 4 days.

One more thing: do not underestimate Margaret. She is smart, she is direct, and she can smell internal misalignment from across the room. Whatever we present needs to be genuinely unified, not papering over disagreement.

— Victoria`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'bm-msg-002',
    from: 'omar',
    to: 'user',
    channel: 'email',
    subject: 'Team dynamics — what you need to know',
    body: `Glad you are here. I have been trying to broker peace between Jessica and Kai for two weeks and I am running out of time.

The core issue: Jessica has strong quantitative evidence for operations consolidation. She modelled facility costs, logistics, and overhead — the numbers are rigorous. 30% cost savings is not hypothetical. But her recommendation means closing two facilities and reducing headcount by approximately 200 people.

Kai has a growth model showing 40% revenue upside over three years through expansion into the industrial automation segment. His market analysis is solid — Hawthorne has transferable capabilities and the segment is growing 18% annually. But the investment required is $15M over two years and the payback period is 30 months.

Both analyses are good work. The problem is framing: Jessica is solving "how do we survive" and Kai is solving "how do we grow." Margaret probably needs both, but nobody has figured out how to combine them.

I have a one-on-one with Margaret tomorrow. Let me know if there is anything specific you want me to explore.

— Omar`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'bm-msg-003',
    from: 'jessica',
    to: 'user',
    channel: 'email',
    subject: 'Consolidation analysis — the data is clear',
    body: `I understand you are joining to help resolve the recommendation. I want to make sure you have the full picture from my side.

The consolidation analysis covers three areas:
1. Facility rationalization: closing the Denver and Raleigh plants saves $18M annually. The Portland and Chicago facilities can absorb 94% of current production volume.
2. Supply chain optimization: consolidating to two supplier tiers (from four) reduces procurement costs by $4.2M annually.
3. Overhead restructuring: shared services model eliminates $3.6M in duplicate management layers.

Total annual savings: $25.8M. Implementation cost: $8M over 12 months. Payback: 4 months after implementation.

I know the headcount reduction is uncomfortable. But the alternative — Kai's growth plan — requires $15M of investment that Hawthorne cannot fund without either raising capital (their last round was 2019) or generating the savings first. You cannot invest in growth while hemorrhaging cash. The sequencing matters.

I am happy to walk you through the model. The data speaks for itself.

— Jessica`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'bm-msg-004',
    from: 'kai',
    to: 'user',
    channel: 'email',
    subject: 'Growth strategy — why consolidation is a trap',
    body: `Jessica's numbers are correct. Her conclusion is wrong. Here is why:

Consolidation solves the cost problem but creates three new problems:
1. Market signal: closing two plants signals decline to customers, suppliers, and employees. Hawthorne's largest customer (Meridian Industrial) has a supplier health clause — a major restructuring could trigger a procurement review.
2. Capability loss: the Denver plant houses the R&D prototyping team. Closing it eliminates the capability that makes the industrial automation expansion possible.
3. Talent flight: the best engineers are in Raleigh. Announcing a plant closure means they start looking. Hawthorne cannot afford to lose engineering talent in a tight labour market.

My growth strategy:
- Enter the industrial automation market using Hawthorne's existing precision manufacturing capabilities
- Partner with two automation OEMs (I have identified candidates) for distribution
- Investment: $15M over 24 months. Revenue projection: $42M by year 3. Net NPV at 10% discount: $18M.

The funding question is real. But there are options: strategic partnership investment, equipment financing against the new product line, or a targeted private placement. These are solvable problems. Killing the company's growth engine to save $25M is not strategy — it is surrender.

— Kai`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'bm-msg-005',
    from: 'omar',
    to: 'user',
    channel: 'chat',
    body: `One thing I haven't shared with Jessica or Kai yet: Margaret's CFO pulled me aside at the last site visit. He said budget cuts are coming regardless of our recommendation — the board has already decided to reduce opex by 15% next year. That changes the math on both analyses. Kai's growth plan may not have the funding runway he's assuming. I'm not sure how to factor this in without undermining both analysts.`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const BEACON_INITIAL_OKRS: OKR[] = [
  { id: 'bm-okr1', title: 'Produce unified recommendation for Hawthorne steering committee by day 4', status: 'in_progress', progress: 10 },
  { id: 'bm-okr2', title: 'Resolve analyst disagreement with a synthesis that incorporates both perspectives', status: 'pending', progress: 0 },
  { id: 'bm-okr3', title: 'Restore Margaret\'s confidence in Beacon Mercer\'s engagement quality', status: 'pending', progress: 0 },
  { id: 'bm-okr4', title: 'Incorporate CFO budget constraint into recommendation without alienating analysts', status: 'pending', progress: 0 },
];

const BEACON_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'bmk1', title: 'Review Jessica\'s consolidation model', tag: 'Analysis', assignee: 'J', priority: 'high', notes: '', linkedOkr: 'bm-okr2' },
      { id: 'bmk2', title: 'Review Kai\'s growth strategy model', tag: 'Analysis', assignee: 'K', priority: 'high', notes: '', linkedOkr: 'bm-okr2' },
      { id: 'bmk3', title: 'Explore hybrid recommendation approach', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'bm-okr1' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'bmk4', title: 'Stakeholder alignment with Omar', tag: 'Client', assignee: 'O', priority: 'high', notes: '', linkedOkr: 'bm-okr3' },
      { id: 'bmk5', title: 'Draft steering committee deck outline', tag: 'Deliverable', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'bm-okr1' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'bmk6', title: 'Engagement status report for Victoria', tag: 'Internal', assignee: 'Y', priority: 'med', notes: '' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'bmk7', title: 'Client data room access confirmed', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const BEACON_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'victoria', delay: 0, text: "The Hawthorne steering committee is in four days. I'm adding someone to help synthesise the recommendation." },
  { from: 'omar', delay: 2800, text: "Thank God. Jessica and Kai are both brilliant but they've stopped listening to each other." },
  { from: 'jessica', delay: 5500, text: "The data supports consolidation. I don't understand why this is still a debate." },
  { from: 'kai', delay: 7800, text: "Because strategy is more than a spreadsheet, Jessica." },
  { from: 'victoria', delay: 10200, text: "This is exactly what Margaret sees when she looks at us. Two analysts arguing instead of advising." },
  { from: 'omar', delay: 12800, text: "There might be a path that incorporates both perspectives. Someone just needs to find it." },
  { from: 'margaret', delay: 15500, text: "I need one direction. Not two. If your firm can't agree, I'll find one that can." },
  { from: 'victoria', delay: 18200, text: "We'll have a unified recommendation. Give us four days." },
];

// ═══════════════════════════════════════════════════════════════════════════
// 4. SILVERLINE CAPITAL — Financial Services / Data & Analysis
// ═══════════════════════════════════════════════════════════════════════════

const SILVERLINE_COMPANY: SimCompany = {
  id: 'silverline-capital',
  name: 'Silverline Capital',
  industry: 'Financial Services',
  size: '450 people, established',
  tagline: 'Quantitative investment strategies for institutional clients.',
  challenge: 'A data anomaly in the risk model is causing inconsistent portfolio valuations. The quant team and the risk team disagree on whether it is a model error or a data feed issue. Meanwhile, a major client\'s quarterly review is in 3 days and the Head of Risk has flagged a potential regulatory exposure.',
  why: 'High-stakes data analysis with regulatory and client pressure.',
  videoKeyword: 'financial trading office',
};

const SILVERLINE_CHARACTERS: Character[] = [
  {
    id: 'richard',
    name: 'Richard Blackwell',
    title: 'Head of Risk',
    avatar: 'https://randomuser.me/api/portraits/men/58.jpg',
    color: '#dc2626',
    personality: 'Cautious, meticulous risk officer with 20 years in financial services. He has identified a discrepancy in the Value-at-Risk (VaR) calculations that affects three client portfolios. He believes it is a model calibration error introduced during last month\'s update. His hidden concern: if this turns out to be a systematic issue, the firm may need to file a regulatory disclosure, which could trigger a client review cascade. Will share the regulatory angle only if directly asked about compliance implications.',
    visibleAgenda: 'Resolve the VaR discrepancy before the client quarterly review. Protect the firm from regulatory exposure.',
    trust: 0.55,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'amara',
    name: 'Amara Osei',
    title: 'Lead Quant',
    avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
    color: '#7c3aed',
    personality: 'Brilliant quantitative analyst who developed the current risk model. She believes the discrepancy is NOT a model error but a data feed quality issue from their market data vendor (Bloomberg alternative). She has backtesting evidence showing the model performed correctly on clean data. She is defensive about the model because her professional reputation is tied to it. Has discovered that the vendor changed their data normalization methodology 6 weeks ago without notification — but needs to verify before sharing.',
    visibleAgenda: 'Clear the model of blame. Identify the true root cause in the data feed.',
    trust: 0.60,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'philip',
    name: 'Philip Reeves',
    title: 'Head of Client Relations',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    color: '#f59e0b',
    personality: 'Smooth operator who manages the firm\'s largest institutional clients. The quarterly review client is Meridian Pension Fund ($800M AUM with Silverline). Philip has maintained the relationship for 7 years. He knows that Meridian\'s CIO is already evaluating competing firms — not because of performance, but because of governance pressure from their board. A data quality issue disclosure could accelerate the review.',
    visibleAgenda: 'Ensure the quarterly review goes smoothly. Needs talking points and risk analysis clarity before the meeting.',
    trust: 0.50,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'grace',
    name: 'Grace Holloway',
    title: 'Chief Compliance Officer',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    color: '#059669',
    personality: 'Experienced compliance officer who sees everything through a regulatory lens. She has been tracking the VaR issue independently and has already drafted a preliminary regulatory notification — she has not filed it, but it is ready. She believes in proactive disclosure and will push for transparency even if it risks the client relationship. She has quiet authority — when she speaks, the CEO listens.',
    visibleAgenda: 'Ensure the firm\'s regulatory obligations are met. Protect the firm\'s license and reputation.',
    trust: 0.65,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'tom_s',
    name: 'Thomas Sullivan',
    title: 'CEO',
    avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
    color: '#0891b2',
    personality: 'Veteran financial services CEO who has been through two regulatory crises in his career. He values people who bring solutions, not problems. His hidden concern: the firm is in talks for a strategic acquisition by a larger asset manager. A regulatory disclosure or client loss could derail the deal — but he cannot share this because it is pre-announcement. Will reveal it only if trust is very high and the PM demonstrates strategic awareness beyond the immediate crisis.',
    visibleAgenda: 'Resolve the VaR issue cleanly. Maintain client confidence. No regulatory surprises.',
    trust: 0.48,
    emotion: 'neutral',
    online: true,
  },
];

const SILVERLINE_INITIAL_MESSAGES: Message[] = [
  {
    id: 'sl-msg-001',
    from: 'tom_s',
    to: 'user',
    channel: 'email',
    subject: 'VaR discrepancy — need this resolved this week',
    body: `I am assigning you to lead the resolution of the Value-at-Risk discrepancy that Risk flagged last week. This is urgent for three reasons:

1. Meridian Pension Fund's quarterly review is Wednesday. They are our largest client ($800M AUM). Philip needs clean risk numbers for the presentation.
2. Richard believes there may be regulatory implications. Grace is already involved. I need a clear determination of whether this requires a disclosure before the Meridian meeting.
3. Amara and Richard disagree on root cause. The quant team says data feed. Risk says model. I need an independent analytical assessment that cuts through the defensiveness.

Your deliverable: a root cause analysis by end of Tuesday, with a recommendation on (a) whether the Meridian numbers are affected, (b) whether regulatory notification is required, and (c) what the fix is and how long it takes.

This is a priority above everything else. Clear your calendar.

— Thomas`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'sl-msg-002',
    from: 'richard',
    to: 'user',
    channel: 'email',
    subject: 'Risk assessment — VaR discrepancy details',
    body: `The discrepancy was identified during routine VaR backtesting. Specifically:

- Three client portfolios show VaR estimates that are 12-18% lower than what our backtesting predicts they should be
- The affected portfolios all have significant exposure to emerging market fixed income
- The discrepancy appeared approximately 6 weeks ago — around the time the quant team pushed a model recalibration

My assessment: the model recalibration introduced a systematic underestimation of volatility in EM fixed income. If I am right, clients have been operating with understated risk for 6 weeks.

Regulatory implication: if VaR has been systematically understated, we may be required to notify the SEC under Rule 206(4)-7 (compliance policies and procedures). This is not optional — it is a regulatory obligation if the error is material.

I want to be clear: I am not accusing the quant team of an error. I am flagging a discrepancy that needs explanation. But the clock is ticking — the Meridian meeting is in 3 days.

— Richard`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'sl-msg-003',
    from: 'amara',
    to: 'user',
    channel: 'email',
    subject: 'RE: VaR discrepancy — it\'s not the model',
    body: `I have reviewed Richard's backtesting results. The discrepancy is real, but the model is not the cause. Here is my evidence:

1. I re-ran the model with pre-recalibration parameters on current data. The discrepancy persists. If the recalibration caused it, reverting should fix it. It does not.
2. I isolated the EM fixed income factor and traced it to the market data feed. The implied volatility surface we are receiving for EM instruments changed character approximately 6 weeks ago — the tail distribution is thinner than historical patterns would suggest.
3. My hypothesis: our market data vendor changed their methodology for calculating implied volatility in less liquid EM markets. This would systematically understate tail risk.

I am in the process of comparing our vendor data against a secondary source (Refinitiv) to confirm. I expect results by tomorrow.

The model works correctly on correct data. The data may be incorrect.

— Amara`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'sl-msg-004',
    from: 'philip',
    to: 'user',
    channel: 'chat',
    body: `Quick context on the Meridian meeting: their CIO, David Armstrong, is under governance pressure from his own board. He's been a loyal client for 7 years but I'm hearing from my contact there that the pension board is pushing for a multi-manager review. Any hint of data quality issues from our side gives them a reason to accelerate that review. I need to know before Wednesday whether the VaR numbers in the quarterly report are defensible.`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'sl-msg-005',
    from: 'grace',
    to: 'user',
    channel: 'email',
    subject: 'Compliance perspective on VaR issue',
    body: `I want to ensure you have the compliance perspective early.

If the VaR understatement is confirmed as systematic (affecting multiple portfolios over multiple weeks), we have an obligation to:
1. Notify affected clients with corrected risk metrics
2. File a Form ADV amendment if the issue reflects a material change in our compliance procedures
3. Consider whether a voluntary SEC notification is appropriate

I have drafted a preliminary notification letter — it is not filed and may not need to be filed. But I want it ready rather than scrambling if the determination comes back as a model or data error.

My recommendation: err on the side of transparency. Firms that self-report fare significantly better with regulators than firms that delay.

Please loop me in on the root cause determination as soon as you have it.

— Grace`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const SILVERLINE_INITIAL_OKRS: OKR[] = [
  { id: 'sl-okr1', title: 'Deliver root cause analysis of VaR discrepancy by end of Tuesday', status: 'in_progress', progress: 10 },
  { id: 'sl-okr2', title: 'Determine whether Meridian quarterly numbers require restating', status: 'pending', progress: 0 },
  { id: 'sl-okr3', title: 'Provide compliance recommendation on regulatory notification', status: 'pending', progress: 0 },
  { id: 'sl-okr4', title: 'Prepare Philip with defensible talking points for the Meridian meeting', status: 'pending', progress: 0 },
];

const SILVERLINE_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'slk1', title: 'Compare vendor data against Refinitiv secondary source', tag: 'Quant', assignee: 'A', priority: 'high', notes: '', linkedOkr: 'sl-okr1' },
      { id: 'slk2', title: 'Review Grace\'s preliminary regulatory notification', tag: 'Compliance', assignee: 'G', priority: 'high', notes: '', linkedOkr: 'sl-okr3' },
      { id: 'slk3', title: 'Prepare Meridian talking points with Philip', tag: 'Client', assignee: 'P', priority: 'high', notes: '', linkedOkr: 'sl-okr4' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'slk4', title: 'Independent VaR backtesting analysis', tag: 'Risk', assignee: 'R', priority: 'high', notes: '', linkedOkr: 'sl-okr1' },
      { id: 'slk5', title: 'Root cause determination — model vs. data feed', tag: 'Analysis', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'sl-okr1' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'slk6', title: 'Affected portfolio identification', tag: 'Risk', assignee: 'Y', priority: 'med', notes: '', linkedOkr: 'sl-okr2' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'slk7', title: 'Initial discrepancy documentation', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const SILVERLINE_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'tom_s', delay: 0, text: "Team — the VaR issue needs resolution this week. I'm assigning a dedicated analyst to lead the investigation." },
  { from: 'richard', delay: 2800, text: "Good. The discrepancy has been open for a week. Every day we delay increases the regulatory exposure." },
  { from: 'amara', delay: 5500, text: "The model is not the problem. I need everyone to stop assuming it is until I've completed the data comparison." },
  { from: 'richard', delay: 7800, text: "Then what is the problem, Amara? Because three portfolios are showing understated risk." },
  { from: 'grace', delay: 10200, text: "Root cause matters less than timeline right now. Meridian's review is Wednesday." },
  { from: 'philip', delay: 12800, text: "If we don't have clean numbers for Wednesday, we have a client problem on top of a data problem." },
  { from: 'tom_s', delay: 15500, text: "Let's give the analyst space to work. Results by end of Tuesday. No exceptions." },
  { from: 'amara', delay: 18200, text: "..." },
];

// ═══════════════════════════════════════════════════════════════════════════
// 5. VERVE MARKET CO. — Consumer Goods / Marketing domain
// ═══════════════════════════════════════════════════════════════════════════

const VERVE_COMPANY: SimCompany = {
  id: 'verve-market',
  name: 'Verve Market Co.',
  industry: 'Direct-to-Consumer',
  size: '95 people, Series A',
  tagline: 'Premium sustainable home goods for the conscious consumer.',
  challenge: 'Your Q4 holiday campaign is 3 weeks from launch. The creative agency just delivered work that doesn\'t match the brand. Performance marketing wants to shift budget to paid social. The founder disagrees with both. Meanwhile, a TikTok creator with 2M followers wants to collaborate — but their audience skews younger than your target.',
  why: 'Brand vs. performance tension with real creative and channel decisions.',
  videoKeyword: 'lifestyle product photography',
};

const VERVE_CHARACTERS: Character[] = [
  {
    id: 'sophia',
    name: 'Sophia Laurent',
    title: 'Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: '#059669',
    personality: 'Visionary founder who built the brand on authenticity and sustainability. She has strong aesthetic opinions and has vetoed agency creative twice before. She is right that the brand voice matters — their 40% repeat purchase rate is driven by brand loyalty, not price. But she struggles to articulate her creative vision in a way the team can execute on. Has a potential Whole Foods partnership that she hasn\'t told the team about — it requires a brand presentation in 5 weeks.',
    visibleAgenda: 'Protect the brand. The holiday campaign must feel like Verve, not like every other DTC brand. Quality over quantity.',
    trust: 0.58,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'marco',
    name: 'Marco Diaz',
    title: 'Head of Performance Marketing',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
    color: '#f59e0b',
    personality: 'Data-driven marketer who sees the numbers clearly: CAC has increased 45% this year while ROAS on brand campaigns has declined. He believes the company needs to shift to performance-first marketing or risk burning through the runway. He has data showing that their Instagram audience engagement has dropped 30% — but their email list (which nobody talks about) converts at 8x the rate of paid social. Will share the email insight if asked about channels beyond paid.',
    visibleAgenda: 'Shift 40% of Q4 budget from brand to performance. Prove ROI on every dollar spent.',
    trust: 0.52,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'anya',
    name: 'Anya Petrov',
    title: 'Brand Director',
    avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
    color: '#8b5cf6',
    personality: 'Former agency creative who joined Verve because she believed in the brand. She thinks the agency\'s latest work is salvageable with the right direction — she has already started reworking it. She has a concept deck she has not shown anyone because she is afraid Sophia will nitpick it to death before it is finished. If the PM creates a safe space for her to share work-in-progress, she will reveal a concept that bridges Sophia\'s vision with Marco\'s performance needs.',
    visibleAgenda: 'Deliver campaign creative that is both brand-right and performance-optimized. Needs creative sign-off from Sophia.',
    trust: 0.64,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'zoe',
    name: 'Zoe Nakamura',
    title: 'Social Media Manager',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    color: '#ec4899',
    personality: 'Gen-Z native who manages all social channels. She brought the TikTok creator opportunity to the table. She knows the creator (Luna Chen, 2.1M followers) personally — they were college roommates. Luna\'s audience is 18-24, while Verve\'s core is 28-42. But Zoe has data showing that their fastest-growing customer segment is 24-30, which overlaps with Luna\'s older audience. She also knows Luna would do the collaboration at cost if approached personally rather than through an agency.',
    visibleAgenda: 'Get approval for the TikTok collaboration. Believes social-first is the future of the brand.',
    trust: 0.70,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'david_m',
    name: 'David Marsh',
    title: 'CFO',
    avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    color: '#0891b2',
    personality: 'Pragmatic finance leader who joined from a larger CPG company. He sees the Q4 campaign as make-or-break for the next fundraise. Has access to unit economics that tell a story nobody is discussing: their subscription product (launched 4 months ago) has a 65% retention rate and 3x the LTV of one-time purchases. If Q4 campaign drives subscription sign-ups rather than one-time holiday gifts, the fundraise narrative changes entirely. Will share this if the conversation turns to business model strategy.',
    visibleAgenda: 'Ensure Q4 spend generates measurable ROI. Runway is 11 months — every dollar matters.',
    trust: 0.45,
    emotion: 'neutral',
    online: false,
  },
];

const VERVE_INITIAL_MESSAGES: Message[] = [
  {
    id: 'vm-msg-001',
    from: 'sophia',
    to: 'user',
    channel: 'email',
    subject: 'Q4 campaign — we need to fix this',
    body: `The agency just delivered the Q4 holiday campaign creative and it is wrong. It looks like every other DTC brand — flat, generic, could be selling anything. Our customers come to us because we are NOT like everyone else. The repeat purchase rate is 40% because people feel connected to this brand. The creative needs to reflect that.

I am bringing you in to run the campaign strategy because I need someone who can hold both the brand and the business perspective. Here is what I need:

1. Fix the creative. Work with Anya to find a direction that feels like Verve — warm, intentional, honest. Not stock-photo-with-sans-serif.
2. Resolve the budget allocation. Marco wants to shift to performance. I understand the numbers but I am not going to burn down the brand to make a Q4 ROAS target.
3. The TikTok thing. Zoe thinks this creator collaboration is the answer. I am not opposed but I need to understand who we are reaching and whether it dilutes the brand.

Campaign launch is in 3 weeks. Creative needs to be locked in 10 days. Budget allocation by end of this week.

I care about this company more than anyone. Make sure whatever we do reflects that.

— Sophia`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'vm-msg-002',
    from: 'marco',
    to: 'user',
    channel: 'email',
    subject: 'Q4 budget reality — the numbers',
    body: `I know Sophia is focused on brand. I respect that. But here are the numbers:

- Q4 budget: $280K (total marketing spend including agency fees)
- Current ROAS on brand campaigns: 2.1x (down from 3.4x last year)
- CAC has increased 45% year-over-year
- Instagram engagement down 30% in 6 months
- Paid social (Meta + TikTok) CPA: $38 per acquisition
- Our email list (42K subscribers) converts at 4.2% — 8x our paid social rate

My proposal: reallocate 40% of the Q4 budget from brand awareness to performance channels. Use the remaining 60% for creative that is designed to convert, not just to "tell the story." That means: clear CTAs, product-focused imagery, retargeting sequences, and email activation.

I am not saying brand doesn't matter. I am saying that at our stage, with 11 months of runway, we need every campaign dollar to demonstrate ROI or we don't get to have a brand next year.

Happy to walk through the channel analysis in detail.

— Marco`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'vm-msg-003',
    from: 'anya',
    to: 'user',
    channel: 'email',
    subject: 'Creative direction — I have ideas',
    body: `The agency work is not great. I agree with Sophia on that. But it is fixable — the photography direction is wrong but the copy framework has potential.

I have been working on an alternative creative concept in the background. It is not finished — I wanted to get it further along before sharing because Sophia tends to react to work-in-progress as if it is final, and I did not want to kill it before it had a chance to breathe.

The concept bridges what Sophia wants (warmth, authenticity, connection) with what Marco needs (clear CTA, product focus, conversion optimization). It is built around real customer stories — we have incredible testimonials that we never use in advertising.

If you can create a structured review process where I can share this without it getting picked apart prematurely, I think it could solve the creative impasse. I just need protection to present it as a direction, not a finished deliverable.

— Anya`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'vm-msg-004',
    from: 'zoe',
    to: 'user',
    channel: 'chat',
    body: `Hey! About the TikTok creator collab — Luna Chen (2.1M followers) is actually a friend from college. She genuinely loves our products and already posts about them organically. Her audience is younger than our core (18-24 vs our 28-42) BUT here's the thing: our fastest-growing segment is 24-30. I pulled the numbers last week. If we partner with Luna, we're not diluting — we're acquiring the next wave. Also: if I approach her personally vs. through an agency, she'd do it for product + $5K instead of the $25K her agent would quote. Just saying.`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'vm-msg-005',
    from: 'david_m',
    to: 'user',
    channel: 'email',
    subject: 'Q4 financial context',
    body: `Quick context that should inform the campaign strategy:

Runway: 11 months at current burn. We need to demonstrate Q4 performance for the Series B conversation in Q1.

One metric nobody is talking about: subscription revenue. We launched the subscription box 4 months ago. Retention rate: 65%. LTV of a subscriber is approximately 3x a one-time purchaser. Currently 2,800 active subscribers generating $18K MRR.

If Q4 campaign strategy drives subscription sign-ups rather than one-time holiday gift purchases, the unit economics story for Series B becomes significantly stronger. "Growing subscription revenue with 65% retention" is a fundamentally different fundraise narrative than "seasonal DTC brand with 40% repeat purchase."

Something to consider when you are deciding between brand awareness (broad reach) and performance (targeted conversion). The answer might depend on what we are converting people to.

— David`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const VERVE_INITIAL_OKRS: OKR[] = [
  { id: 'vm-okr1', title: 'Lock Q4 campaign creative direction within 10 days', status: 'in_progress', progress: 5 },
  { id: 'vm-okr2', title: 'Finalize Q4 budget allocation across brand, performance, and creator channels', status: 'pending', progress: 0 },
  { id: 'vm-okr3', title: 'Decide on TikTok creator collaboration with clear audience strategy', status: 'pending', progress: 0 },
  { id: 'vm-okr4', title: 'Align all stakeholders on campaign KPIs and success metrics', status: 'pending', progress: 0 },
];

const VERVE_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'vmk1', title: 'Review Anya\'s alternative creative concept', tag: 'Creative', assignee: 'A', priority: 'high', notes: '', linkedOkr: 'vm-okr1' },
      { id: 'vmk2', title: 'Evaluate TikTok creator audience overlap data', tag: 'Social', assignee: 'Z', priority: 'high', notes: '', linkedOkr: 'vm-okr3' },
      { id: 'vmk3', title: 'Channel performance analysis — paid vs. organic vs. email', tag: 'Performance', assignee: 'M', priority: 'high', notes: '', linkedOkr: 'vm-okr2' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'vmk4', title: 'Q4 budget allocation model', tag: 'Finance', assignee: 'M', priority: 'high', notes: '', linkedOkr: 'vm-okr2' },
      { id: 'vmk5', title: 'Campaign strategy brief draft', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'vm-okr1' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'vmk6', title: 'Agency creative feedback document', tag: 'Creative', assignee: 'Y', priority: 'med', notes: '', linkedOkr: 'vm-okr1' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'vmk7', title: 'Q3 campaign retrospective compiled', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const VERVE_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'sophia', delay: 0, text: "The agency creative is wrong. We're bringing someone in to fix the campaign strategy before Q4 launch." },
  { from: 'marco', delay: 2800, text: "Maybe it's time to have an honest conversation about whether brand-first is working at our stage." },
  { from: 'sophia', delay: 5500, text: "Brand IS the product, Marco. Our customers buy because they believe in what we stand for." },
  { from: 'anya', delay: 7800, text: "There might be a way to do both. I've been working on something." },
  { from: 'zoe', delay: 10200, text: "Has anyone looked at where our growth is actually coming from? The 24-30 segment is exploding." },
  { from: 'david_m', delay: 12800, text: "Whatever we decide, the numbers need to work for the Series B conversation." },
  { from: 'marco', delay: 15500, text: "Exactly. Let's make decisions based on data, not feelings." },
  { from: 'sophia', delay: 18200, text: "Feelings built this company, Marco. But I hear you. Let's find the overlap." },
];

// ═══════════════════════════════════════════════════════════════════════════
// 6. NOVACARE LABS — Healthcare / PM domain
// ═══════════════════════════════════════════════════════════════════════════

const NOVACARE_COMPANY: SimCompany = {
  id: 'novacare-labs',
  name: 'NovaCare Labs',
  industry: 'Digital Health',
  size: '320 people, Series C',
  tagline: 'AI-powered clinical decision support for hospital systems.',
  challenge: 'Your FDA-regulated diagnostic tool needs a critical algorithm update, but the clinical team disagrees with the engineering approach. A hospital system pilot is at risk, and a competitor just published a paper showing superior accuracy. The VP Clinical wants to slow down. The CEO wants to accelerate.',
  why: 'PM challenge in regulated environment with patient safety stakes.',
  videoKeyword: 'hospital technology medical',
};

const NOVACARE_CHARACTERS: Character[] = [
  {
    id: 'dr_chen',
    name: 'Dr. Lisa Chen',
    title: 'VP Clinical Affairs',
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    color: '#dc2626',
    personality: 'Board-certified physician who left clinical practice to shape health tech. She is the moral compass of the company — patient safety is non-negotiable. She believes the algorithm update needs additional clinical validation before deployment, which adds 8 weeks. She is right about the risk, but the competitive pressure is real. Has access to unpublished clinical outcomes data from the current deployment that shows the algorithm is underperforming in a specific patient subgroup — she will share if trust is high and the conversation is explicitly about patient outcomes.',
    visibleAgenda: 'Ensure the algorithm update meets clinical standards before any deployment. No shortcuts on patient safety.',
    trust: 0.60,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'amir',
    name: 'Amir Rashidi',
    title: 'VP Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    color: '#6366f1',
    personality: 'Brilliant ML engineer who built the core diagnostic algorithm. He is confident the v2 algorithm is ready — his internal validation shows 94% accuracy vs. 89% for v1. But his validation was done on a curated dataset, not real-world clinical data. He knows this but believes real-world deployment data will confirm the improvement. Has identified a potential approach to do a phased rollout that would satisfy both speed and safety — will share if the PM demonstrates understanding of both technical and clinical perspectives.',
    visibleAgenda: 'Ship the v2 algorithm. The competitive paper makes delay dangerous for the company\'s market position.',
    trust: 0.55,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'rachel',
    name: 'Rachel Okonkwo',
    title: 'Head of Regulatory',
    avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
    color: '#059669',
    personality: 'Former FDA reviewer who knows the regulatory landscape intimately. She has a critical insight: the competitor\'s published paper actually has a methodology weakness that would not survive FDA scrutiny — their validation dataset overrepresents one demographic group. She has not shared this because she is waiting for someone to ask about the competitive threat from a regulatory perspective rather than just a market perspective.',
    visibleAgenda: 'Ensure the v2 update does not trigger a new 510(k) submission. A De Novo classification change would add 6 months.',
    trust: 0.68,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'kevin',
    name: 'Kevin Park',
    title: 'Head of Hospital Partnerships',
    avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
    color: '#f59e0b',
    personality: 'The relationship bridge to hospital systems. Currently managing the Memorial Health pilot — their largest deployment (12 hospitals, 3,400 clinicians). The pilot renewal decision is in 6 weeks. Kevin knows that Memorial\'s Chief Medical Officer has been briefed by the competitor and is asking pointed questions about NovaCare\'s algorithm accuracy. He also knows Memorial would accept a phased v2 rollout if it came with transparent clinical validation data.',
    visibleAgenda: 'Protect the Memorial Health pilot renewal. Needs a product update story he can present at the next steering committee.',
    trust: 0.52,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'priya_n',
    name: 'Priya Nair',
    title: 'CEO',
    avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
    color: '#0891b2',
    personality: 'Former McKinsey partner who raised $45M Series C. She is commercially focused and worried about the competitive paper eroding investor confidence. She has a board call next week and needs a clear product narrative. Her hidden pressure: two board members have privately asked whether NovaCare should pivot from diagnostic to monitoring (a less regulated space). She is fighting to keep the diagnostic vision alive but needs commercial momentum to do it.',
    visibleAgenda: 'Accelerate the v2 launch. The competitive paper changes the urgency calculus. Board confidence is at stake.',
    trust: 0.50,
    emotion: 'neutral',
    online: true,
  },
];

const NOVACARE_INITIAL_MESSAGES: Message[] = [
  {
    id: 'nc-msg-001',
    from: 'priya_n',
    to: 'user',
    channel: 'email',
    subject: 'Algorithm v2 — you own this decision',
    body: `We have a problem. Last week, our competitor MedLogic published a paper in JAMA Digital Medicine showing 93% diagnostic accuracy for their clinical decision support tool. Our current deployed algorithm (v1) runs at 89%.

Amir's team has v2 ready — internal validation shows 94%. If we deploy it, we beat MedLogic's published number. If we wait, the narrative becomes "NovaCare is behind."

The complication: Dr. Chen wants additional clinical validation before deployment. She is asking for 8 weeks. Amir says it is ready now. Rachel says we need to confirm the update does not trigger a new regulatory submission. Kevin says Memorial Health's pilot renewal depends on showing progress.

I need you to make a recommendation this week. Not next week — this week. The board call is Thursday and I need a position I can present.

The stakes: $45M raised, 320 people depending on this company, and a product that genuinely improves patient outcomes. Do not lose sight of any of that.

— Priya`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'nc-msg-002',
    from: 'dr_chen',
    to: 'user',
    channel: 'email',
    subject: 'Clinical perspective on v2 deployment',
    body: `I need you to understand something before you make a recommendation: this is not a software update. This is a tool that influences clinical decisions about real patients.

Amir's v2 validation was done on a curated dataset of 10,000 cases. Our real-world deployment sees 50,000+ cases per month across diverse patient populations. The gap between curated and real-world performance is well-documented in the literature — it can be anywhere from 2-8 percentage points.

If v2 performs 5 points lower in real-world than in validation, we go from 94% to 89% — the same as v1. We will have deployed an update, taken the regulatory risk, and gained nothing.

What I am asking for is not unreasonable: an 8-week prospective clinical validation on a subset of Memorial Health cases, running v2 in shadow mode alongside v1. No patient risk, real-world data, defensible methodology.

There is one more thing I want to discuss with you privately. It involves current v1 performance data that the team should see before making the v2 decision.

— Dr. Chen`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'nc-msg-003',
    from: 'amir',
    to: 'user',
    channel: 'email',
    subject: 'V2 is ready — here is the evidence',
    body: `I respect Dr. Chen's clinical perspective. But the engineering reality is clear:

1. v2 accuracy: 94.2% on our validation set (10,000 cases, stratified by age, sex, and diagnostic category)
2. False negative rate: reduced from 4.1% (v1) to 2.3% (v2). This is a meaningful clinical improvement.
3. Latency: v2 runs 40% faster, which matters for real-time clinical decision support in emergency departments.

The 8-week validation Dr. Chen is requesting would be ideal in a perfect world. But we do not live in a perfect world. MedLogic published their paper. Memorial Health's CMO has seen it. Every week we wait, the competitive narrative hardens against us.

There is a middle path I have been thinking about: a phased deployment. Deploy v2 in shadow mode at 3 Memorial hospitals for 2 weeks. Compare v2 predictions against v1 predictions and actual outcomes in real-time. If accuracy holds, expand to all 12. If it drops, we roll back instantly — the infrastructure supports hot-swapping.

This gives us real-world validation AND speed. It is not as rigorous as Dr. Chen's full 8-week study, but it is not reckless either.

— Amir`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'nc-msg-004',
    from: 'kevin',
    to: 'user',
    channel: 'chat',
    body: `Heads up: I just got off the phone with Memorial Health's Chief Medical Officer. He mentioned the MedLogic paper — specifically asked "how does NovaCare's accuracy compare?" I gave him our v1 numbers (89%) and said v2 is in validation. He didn't react badly but he asked for a product update at the next steering committee in 3 weeks. If I show up with "we're still validating" after MedLogic published a 93% number, it's going to be a hard conversation.`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'nc-msg-005',
    from: 'rachel',
    to: 'user',
    channel: 'email',
    subject: 'Regulatory considerations for v2',
    body: `Two things on the regulatory front:

1. The v2 algorithm update: if we characterize it as a performance improvement to the same intended use, it falls under our existing 510(k) clearance and does not require a new submission. If the improvement changes clinical significance thresholds, the FDA may view it as a new intended use, which triggers De Novo classification and adds 6+ months. The distinction is subtle — I need to review the v2 specifications before giving a definitive answer.

2. The MedLogic paper: I read it carefully. Their validation methodology has a significant limitation — 78% of their validation dataset comes from one demographic group (adults 45-65, predominantly male). Their accuracy claims are likely inflated for the broader patient population. This is a known issue in ML-based diagnostic tools. I have not shared this analysis widely because I wanted to review it with someone who would use it appropriately — not as a competitive talking point, but as context for our own validation approach.

I can prepare a regulatory brief on both topics if that would be helpful.

— Rachel`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const NOVACARE_INITIAL_OKRS: OKR[] = [
  { id: 'nc-okr1', title: 'Deliver v2 deployment recommendation by end of this week', status: 'in_progress', progress: 10 },
  { id: 'nc-okr2', title: 'Resolve clinical validation vs. speed-to-market conflict', status: 'pending', progress: 0 },
  { id: 'nc-okr3', title: 'Prepare Memorial Health pilot update for steering committee', status: 'pending', progress: 0 },
  { id: 'nc-okr4', title: 'Give CEO a defensible position for the board call on Thursday', status: 'pending', progress: 0 },
];

const NOVACARE_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'nck1', title: 'Review Dr. Chen\'s v1 clinical outcomes data', tag: 'Clinical', assignee: 'D', priority: 'high', notes: '', linkedOkr: 'nc-okr2' },
      { id: 'nck2', title: 'Get Rachel\'s regulatory classification assessment', tag: 'Regulatory', assignee: 'R', priority: 'high', notes: '', linkedOkr: 'nc-okr1' },
      { id: 'nck3', title: 'Prepare Memorial Health update talking points', tag: 'Partnerships', assignee: 'K', priority: 'high', notes: '', linkedOkr: 'nc-okr3' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'nck4', title: 'V2 validation methodology review', tag: 'Eng', assignee: 'A', priority: 'high', notes: '', linkedOkr: 'nc-okr2' },
      { id: 'nck5', title: 'Draft v2 deployment recommendation', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'nc-okr1' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'nck6', title: 'Competitive analysis — MedLogic paper review', tag: 'Strategy', assignee: 'Y', priority: 'med', notes: '', linkedOkr: 'nc-okr1' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'nck7', title: 'V2 internal validation report compiled', tag: 'Eng', assignee: 'A', priority: 'low', notes: '' },
    ],
  },
];

const NOVACARE_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'priya_n', delay: 0, text: "Team — the MedLogic paper changes the timeline. I'm bringing in a PM to own the v2 deployment decision." },
  { from: 'dr_chen', delay: 2800, text: "I hope they understand that patient safety is not a variable to optimise." },
  { from: 'amir', delay: 5500, text: "And I hope they understand that losing to MedLogic has patient consequences too — our tool saves lives." },
  { from: 'rachel', delay: 7800, text: "The regulatory classification question needs to be answered first. Everything else is secondary." },
  { from: 'kevin', delay: 10200, text: "Memorial Health's CMO has seen the MedLogic paper. We have 3 weeks before the steering committee." },
  { from: 'dr_chen', delay: 12800, text: "Three weeks is not enough time for proper clinical validation. That's my professional opinion." },
  { from: 'amir', delay: 15500, text: "It's enough time for a phased shadow deployment. I've designed the infrastructure for exactly this." },
  { from: 'priya_n', delay: 18200, text: "Let's give the PM the space to evaluate all perspectives. Board call is Thursday." },
  { from: 'dr_chen', delay: 20800, text: "..." },
];

// ═══════════════════════════════════════════════════════════════════════════
// Minimal reply maps, secrets, constraints for new companies
// (Keeping these shorter since the Intelligence Engine can generate dynamic ones)
// ═══════════════════════════════════════════════════════════════════════════

function buildMinimalCatalogEntry(
  company: SimCompany,
  characters: Character[],
  messages: Message[],
  okrs: OKR[],
  kanban: KanbanColumn[],
  prologue: { from: string; delay: number; text: string }[],
  cascadeEvents: CompanyCatalogEntry['cascadeEvents'],
  secrets: Record<string, { threshold: number; secretId: string; message: string }[]>,
  constraintPatterns: Record<string, Array<{ keywords: string[]; constraint: string }>>,
  constraintLabels: Record<string, string>,
): CompanyCatalogEntry {
  // Build reply map from character personalities (fallback pool)
  const replyMap: Record<string, string[]> = {};
  for (const char of characters) {
    replyMap[char.id] = [
      `Let me think about that. ${char.visibleAgenda.split('.')[0]}.`,
      "I hear you. Let me come back with something concrete.",
      "That's a fair point. But I need to understand the full picture first.",
    ];
  }

  // Build card reaction map
  const cardReactionMap: Record<string, CompanyCatalogEntry['cardReactionMap'][string]> = {};
  for (const char of characters) {
    cardReactionMap[char.id] = {
      toInProgress: {
        high: ["On it. I'll have something for you shortly.", "Good call. Moving on this now."],
        mid: ["I can pick this up. What's the priority relative to my other work?", "Working on it."],
        low: ["I'll get to it when I can.", "Noted."],
      },
      toReview: {
        high: ["Ready for your review.", "At your end. Let me know."],
        mid: ["In review.", "Take a look when you can."],
        low: ["In review.", "Noted."],
      },
      toDone: {
        natural: ["Good to close that out.", "Done."],
        earlyClose: ["That's not finished yet.", "I haven't completed this — please don't close it."],
        low: ["I'm reopening that.", "Not done."],
      },
      toBacklog: ["Understood. Let me know when priorities change.", "Noted."],
    };
  }

  return {
    company,
    characters,
    initialMessages: messages,
    initialOKRs: okrs,
    initialKanban: kanban,
    prologueMessages: prologue,
    cascadeEvents,
    characterSecrets: secrets,
    cardReactionMap,
    replyMap,
    constraintPatterns,
    constraintLabels,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Build and export all Phase 5 catalog entries
// ═══════════════════════════════════════════════════════════════════════════

export const PHASE5_COMPANY_CATALOG: Record<string, CompanyCatalogEntry> = {
  'orbit-layer': {
    company: ORBIT_COMPANY,
    characters: ORBIT_CHARACTERS,
    initialMessages: ORBIT_INITIAL_MESSAGES,
    initialOKRs: ORBIT_INITIAL_OKRS,
    initialKanban: ORBIT_INITIAL_KANBAN,
    prologueMessages: ORBIT_PROLOGUE,
    cascadeEvents: ORBIT_CASCADE_EVENTS,
    characterSecrets: ORBIT_SECRETS,
    cardReactionMap: ORBIT_CARD_REACTIONS,
    replyMap: ORBIT_REPLY_MAP,
    constraintPatterns: ORBIT_CONSTRAINT_PATTERNS,
    constraintLabels: ORBIT_CONSTRAINT_LABELS,
  },
  'brightforge-systems': buildMinimalCatalogEntry(
    BRIGHTFORGE_COMPANY,
    BRIGHTFORGE_CHARACTERS,
    BRIGHTFORGE_INITIAL_MESSAGES,
    BRIGHTFORGE_INITIAL_OKRS,
    BRIGHTFORGE_INITIAL_KANBAN,
    BRIGHTFORGE_PROLOGUE,
    [
      {
        id: 'maya_ignored',
        trigger: (s) => !s.firedCascades.includes('maya_ignored') && s.elapsedSeconds > 60 && (s.elapsedSeconds - (s.lastContactedAt['maya'] ?? 0)) > 240,
        characterId: 'maya',
        channel: 'chat' as const,
        message: "The pipeline dropped another batch of events this morning. 2.3% is becoming 2.8%. Are we going to address this or keep building on top of a foundation that's cracking?",
      },
      {
        id: 'sarah_k_pressure',
        trigger: (s) => !s.firedCascades.includes('sarah_k_pressure') && s.elapsedSeconds > 420,
        characterId: 'sarah_k',
        channel: 'email' as const,
        subject: 'Vanguard wants a demo date',
        message: "Maria Chen at Vanguard just emailed asking when they can see the predictive module in their environment. She mentioned Atlas Manufacturing is also asking. I need a timeline I can share — even a preliminary one.",
      },
    ],
    {
      maya: [{ threshold: 0.68, secretId: 'maya_migration_plan', message: "I've had a migration plan ready for 6 weeks. Streaming architecture, phased cutover, zero downtime. The plan works. Nobody asked for it because the assumption was 'keep patching.' If you want the plan, say the word." }],
      derek: [{ threshold: 0.65, secretId: 'derek_data_quality', message: "The 23% dashboard inaccuracy number I mentioned? It's actually worse in Vanguard's real-time views. If they switch to hourly granularity — which the predictive module requires — the error rate will be visible to their ops team. We have maybe 2 weeks before someone notices." }],
      lena: [{ threshold: 0.60, secretId: 'lena_data_mesh', message: "I've been building a data quality layer on my own time. It's a lightweight data mesh — validates incoming data, flags anomalies, and provides clean streams for the ML pipeline. It's not production-ready but it could be in 3 weeks with one more engineer. It solves the pipeline AND the ML quality problem simultaneously." }],
      chen: [{ threshold: 0.75, secretId: 'chen_pii_issue', message: "There's something I need to tell you about the pipeline logs. They contain unredacted PII — email addresses and IP addresses from client data streams. This is a GDPR and SOC 2 issue. If a client audits our data handling, we have a compliance problem. This needs to be part of the pipeline migration scope." }],
    },
    {
      maya: [{ keywords: ['migration plan', 'streaming', 'phased cutover'], constraint: 'migration_ready' }],
      derek: [{ keywords: ['23%', 'dashboard accuracy', 'duplicate', 'hourly'], constraint: 'data_quality_crisis' }],
      lena: [{ keywords: ['data mesh', 'quality layer', 'validates', 'clean streams'], constraint: 'data_mesh_solution' }],
      chen: [{ keywords: ['pii', 'gdpr', 'unredacted', 'compliance'], constraint: 'pii_exposure' }],
    },
    {
      migration_ready: 'Pipeline migration plan discovered',
      data_quality_crisis: 'Dashboard accuracy crisis quantified',
      data_mesh_solution: 'Data mesh bridging approach surfaced',
      pii_exposure: 'PII compliance risk uncovered',
    },
  ),
  'beacon-mercer': buildMinimalCatalogEntry(
    BEACON_COMPANY,
    BEACON_CHARACTERS,
    BEACON_INITIAL_MESSAGES,
    BEACON_INITIAL_OKRS,
    BEACON_INITIAL_KANBAN,
    BEACON_PROLOGUE,
    [
      {
        id: 'margaret_impatient',
        trigger: (s) => !s.firedCascades.includes('margaret_impatient') && s.elapsedSeconds > 360,
        characterId: 'margaret',
        channel: 'email' as const,
        subject: 'Steering committee — I need clarity',
        message: "I've heard from two of your analysts with two different recommendations. I hired one firm. I expect one answer. The steering committee is in 3 days. If Beacon Mercer can't align internally, tell me now so I can plan accordingly.",
      },
      {
        id: 'victoria_check_in',
        trigger: (s) => !s.firedCascades.includes('victoria_check_in') && s.elapsedSeconds > 480 && !(s.lastContactedAt['victoria']),
        characterId: 'victoria',
        channel: 'chat' as const,
        message: "Haven't heard from you. Where are we on the synthesis? Margaret called me this morning — she's losing patience. I need to know your read on the path forward.",
      },
    ],
    {
      victoria: [{ threshold: 0.65, secretId: 'victoria_mckinsey', message: "I need to tell you something: Margaret is considering bringing in McKinsey for a second opinion. She hasn't told anyone on the team but she mentioned it to me on Friday. If we show up to the steering committee with a split recommendation, she will pull the trigger. This engagement — and our reputation — depends on unity." }],
      omar: [{ threshold: 0.60, secretId: 'omar_cfo_intel', message: "The CFO told me something privately at the last site visit: the board has already decided on 15% opex cuts next year regardless of our recommendation. Kai's growth plan assumes funding that may not exist. Jessica's consolidation aligns with the cuts but she doesn't know about them. This changes everything about how we frame the recommendation." }],
      jessica: [{ threshold: 0.70, secretId: 'jessica_layoff_data', message: "I ran a sensitivity analysis I haven't shared. If we do the full consolidation, the 200 headcount reduction hits the Raleigh plant hardest — that's Margaret's hometown. She founded the company there. There is zero chance she approves a plan that closes the Raleigh facility. My recommendation needs to be restructured to protect Raleigh or it's dead on arrival." }],
      margaret: [{ threshold: 0.55, secretId: 'margaret_nonneg', message: "I'll be direct with you: I will not approve any plan that results in mass layoffs at the Raleigh plant. My family has worked in that community for three generations. If your recommendation includes closing Raleigh, save your breath. Find another way." }],
    },
    {
      victoria: [{ keywords: ['mckinsey', 'second opinion', 'second firm', 'another firm'], constraint: 'mckinsey_threat' }],
      omar: [{ keywords: ['budget cuts', '15%', 'opex cuts', 'board decided'], constraint: 'budget_cuts' }],
      jessica: [{ keywords: ['raleigh', 'hometown', 'sensitivity', 'founded'], constraint: 'raleigh_sensitivity' }],
      margaret: [{ keywords: ['raleigh', 'family', 'three generations', 'mass layoffs'], constraint: 'raleigh_nonneg' }],
    },
    {
      mckinsey_threat: 'McKinsey second opinion threat revealed',
      budget_cuts: 'Pre-decided budget cuts intelligence surfaced',
      raleigh_sensitivity: 'Raleigh plant political sensitivity uncovered',
      raleigh_nonneg: 'CEO non-negotiable on Raleigh revealed',
    },
  ),
  'silverline-capital': buildMinimalCatalogEntry(
    SILVERLINE_COMPANY,
    SILVERLINE_CHARACTERS,
    SILVERLINE_INITIAL_MESSAGES,
    SILVERLINE_INITIAL_OKRS,
    SILVERLINE_INITIAL_KANBAN,
    SILVERLINE_PROLOGUE,
    [
      {
        id: 'amara_data_ready',
        trigger: (s) => !s.firedCascades.includes('amara_data_ready') && s.elapsedSeconds > 300,
        characterId: 'amara',
        channel: 'chat' as const,
        message: "The Refinitiv comparison is ready. The data confirms my hypothesis — the vendor changed their vol surface methodology. I have side-by-side charts. When can we review?",
      },
      {
        id: 'philip_meridian_urgent',
        trigger: (s) => !s.firedCascades.includes('philip_meridian_urgent') && s.elapsedSeconds > 480,
        characterId: 'philip',
        channel: 'email' as const,
        subject: 'Meridian prep — running out of time',
        message: "David Armstrong's office just confirmed the quarterly review agenda. Risk metrics are the second item. I need to know by end of today: are the numbers defensible or do we need to restate? I cannot walk into that meeting without a clear answer.",
      },
    ],
    {
      amara: [{ threshold: 0.65, secretId: 'amara_vendor_change', message: "I confirmed it. The vendor changed their implied volatility calculation methodology for less liquid EM instruments six weeks ago. No notification, no documentation update. The new methodology systematically understates tail risk by approximately 15% in thin markets. Our model is correct — it's being fed incorrect inputs." }],
      richard: [{ threshold: 0.70, secretId: 'richard_regulatory', message: "I want to be transparent: if this is a vendor data issue rather than a model error, the regulatory calculus changes. We still need to notify clients about the VaR understatement, but the SEC notification may be unnecessary — the error was in our input data, not our methodology. Grace should weigh in, but this distinction matters enormously for the firm." }],
      tom_s: [{ threshold: 0.80, secretId: 'tom_acquisition', message: "What I'm about to tell you is strictly confidential. The firm is in advanced discussions for a strategic acquisition by Pinnacle Asset Management. The deal is contingent on a clean regulatory record and stable client relationships. A regulatory disclosure or Meridian departure could delay or kill the deal. I'm not asking you to hide anything — I'm asking you to be precise and proportionate in how we handle this." }],
      grace: [{ threshold: 0.60, secretId: 'grace_proactive', message: "I've already drafted the client notification letter and the SEC voluntary disclosure. Both are ready to send pending final determination. My strong recommendation: proactive transparency. Firms that self-report systematically receive lighter regulatory scrutiny. The worst outcome is a client or regulator discovering this before we disclose it ourselves." }],
    },
    {
      amara: [{ keywords: ['vendor changed', 'methodology', 'vol surface', 'no notification'], constraint: 'vendor_root_cause' }],
      richard: [{ keywords: ['vendor data issue', 'model error', 'regulatory calculus', 'input data'], constraint: 'regulatory_distinction' }],
      tom_s: [{ keywords: ['acquisition', 'pinnacle', 'deal contingent', 'confidential'], constraint: 'acquisition_deal' }],
      grace: [{ keywords: ['self-report', 'proactive transparency', 'voluntary disclosure'], constraint: 'proactive_disclosure' }],
    },
    {
      vendor_root_cause: 'Vendor methodology change confirmed',
      regulatory_distinction: 'Model vs. data regulatory distinction clarified',
      acquisition_deal: 'Confidential acquisition deal revealed',
      proactive_disclosure: 'Proactive disclosure strategy surfaced',
    },
  ),
  'verve-market': buildMinimalCatalogEntry(
    VERVE_COMPANY,
    VERVE_CHARACTERS,
    VERVE_INITIAL_MESSAGES,
    VERVE_INITIAL_OKRS,
    VERVE_INITIAL_KANBAN,
    VERVE_PROLOGUE,
    [
      {
        id: 'anya_concept_ready',
        trigger: (s) => !s.firedCascades.includes('anya_concept_ready') && s.elapsedSeconds > 240,
        characterId: 'anya',
        channel: 'chat' as const,
        message: "I finished the alternative creative concept. It's rough but the direction is strong. Can we set up a review — just you first, before Sophia sees it? I want to make sure it lands right.",
      },
      {
        id: 'sophia_follow_up',
        trigger: (s) => !s.firedCascades.includes('sophia_follow_up') && s.elapsedSeconds > 480 && !(s.lastContactedAt['sophia']),
        characterId: 'sophia',
        channel: 'email' as const,
        subject: 'Campaign direction — need an update',
        message: "I haven't heard your recommendation on the creative direction. The agency is waiting for feedback and we're burning days. What's the plan? I need to see something concrete by tomorrow.",
      },
    ],
    {
      sophia: [{ threshold: 0.70, secretId: 'sophia_wholefods', message: "I haven't told the team yet, but Whole Foods reached out about carrying our products. They want to see a brand presentation in 5 weeks. If the Q4 campaign dilutes the brand identity, it could hurt the Whole Foods pitch. But if we nail the campaign AND the pitch, it could transform the business." }],
      marco: [{ threshold: 0.60, secretId: 'marco_email_data', message: "Here's something nobody is paying attention to: our email list. 42K subscribers, 4.2% conversion rate — that's 8x our paid social rate. If we allocate even 15% of the Q4 budget to email activation with targeted offers, the ROI would dwarf anything we do on Meta or TikTok. The email list is our most undervalued asset." }],
      anya: [{ threshold: 0.55, secretId: 'anya_concept', message: "Okay, here's the concept: 'Home, Honestly.' Real customers, real homes, real stories about why they chose sustainable. Not polished — intentionally imperfect. Shot on phone, not studio. It bridges Sophia's authenticity with Marco's conversion focus because each story ends with a specific product and a clear CTA. I have three mock-ups ready." }],
      david_m: [{ threshold: 0.65, secretId: 'david_subscription', message: "The subscription data tells a clear story: subscribers have 65% retention and 3x LTV. If we make the Q4 campaign about 'Give the gift of a subscription' instead of 'Buy a holiday gift,' the economics change entirely. The fundraise narrative goes from 'seasonal DTC brand' to 'recurring revenue business with 65% retention.' That's a completely different valuation multiple." }],
    },
    {
      sophia: [{ keywords: ['whole foods', 'retail partnership', 'brand presentation'], constraint: 'wholesale_opportunity' }],
      marco: [{ keywords: ['email list', '42k', '4.2%', '8x', 'email activation'], constraint: 'email_goldmine' }],
      anya: [{ keywords: ['home honestly', 'real customers', 'intentionally imperfect', 'phone not studio'], constraint: 'creative_bridge' }],
      david_m: [{ keywords: ['subscription', '65% retention', '3x ltv', 'recurring revenue'], constraint: 'subscription_pivot' }],
    },
    {
      wholesale_opportunity: 'Whole Foods partnership opportunity revealed',
      email_goldmine: 'Email list ROI advantage discovered',
      creative_bridge: 'Bridge creative concept unlocked',
      subscription_pivot: 'Subscription-first strategy surfaced',
    },
  ),
  'novacare-labs': buildMinimalCatalogEntry(
    NOVACARE_COMPANY,
    NOVACARE_CHARACTERS,
    NOVACARE_INITIAL_MESSAGES,
    NOVACARE_INITIAL_OKRS,
    NOVACARE_INITIAL_KANBAN,
    NOVACARE_PROLOGUE,
    [
      {
        id: 'kevin_memorial_urgent',
        trigger: (s) => !s.firedCascades.includes('kevin_memorial_urgent') && s.elapsedSeconds > 360,
        characterId: 'kevin',
        channel: 'email' as const,
        subject: 'Memorial Health steering committee — they want answers',
        message: "Memorial's CMO just scheduled a call for next week specifically to discuss our algorithm roadmap. He mentioned MedLogic by name. I need talking points that acknowledge the competitive landscape without undermining confidence in our current deployment.",
      },
      {
        id: 'priya_n_board_pressure',
        trigger: (s) => !s.firedCascades.includes('priya_n_board_pressure') && s.elapsedSeconds > 500 && !(s.lastContactedAt['priya_n']),
        characterId: 'priya_n',
        channel: 'chat' as const,
        message: "Board call is in 2 days. I need your recommendation on v2. Not a framework for thinking about it — a recommendation. Deploy, delay, or phase. Pick one and defend it.",
      },
    ],
    {
      dr_chen: [{ threshold: 0.70, secretId: 'chen_subgroup', message: "There's something you need to see before making the v2 decision. I've been tracking v1 performance across patient subgroups. In patients over 70, accuracy drops to 82% — well below our published 89% average. This subgroup represents 28% of Memorial Health's patient population. If v2 doesn't specifically address this, we're deploying an update that doesn't fix the biggest clinical gap." }],
      amir: [{ threshold: 0.65, secretId: 'amir_phased', message: "I've designed the phased deployment infrastructure specifically for this situation. Shadow mode at 3 hospitals for 2 weeks. We compare v2 predictions against v1 and actual outcomes in real-time. If accuracy holds above 92% across all subgroups, we expand. If it drops, instant rollback. It gives us speed AND safety. Dr. Chen's 8-week validation and my 'ship now' approach both have the same goal — this is the bridge." }],
      rachel: [{ threshold: 0.62, secretId: 'rachel_medlogic', message: "I've done a thorough analysis of the MedLogic paper. Their validation dataset has a significant demographic bias — 78% of cases are adults 45-65, predominantly male. Their 93% accuracy number would likely drop to 86-88% on a diverse patient population. This is not conjecture — I can demonstrate it using publicly available demographic performance benchmarks. If we highlight this in our competitive positioning, we change the narrative from 'they're ahead' to 'their claims don't generalize.'" }],
      priya_n: [{ threshold: 0.75, secretId: 'priya_pivot_pressure', message: "Between us: two board members have been pushing for us to pivot from diagnostics to monitoring. Monitoring is less regulated, faster to market, but fundamentally changes the company's mission. I'm fighting to keep the diagnostic vision alive, but I need commercial momentum to win the argument. The v2 launch — done right — is my strongest evidence that diagnostics can scale." }],
    },
    {
      dr_chen: [{ keywords: ['over 70', 'subgroup', '82%', 'patient subgroup', 'clinical gap'], constraint: 'subgroup_gap' }],
      amir: [{ keywords: ['shadow mode', 'phased deployment', 'instant rollback', '3 hospitals'], constraint: 'phased_approach' }],
      rachel: [{ keywords: ['demographic bias', '78%', 'doesn\'t generalize', 'benchmark'], constraint: 'competitor_weakness' }],
      priya_n: [{ keywords: ['pivot', 'monitoring', 'board members', 'diagnostic vision'], constraint: 'pivot_pressure' }],
    },
    {
      subgroup_gap: 'Patient subgroup performance gap uncovered',
      phased_approach: 'Phased shadow deployment bridge identified',
      competitor_weakness: 'MedLogic methodology weakness revealed',
      pivot_pressure: 'Board pivot pressure to monitoring disclosed',
    },
  ),
};

// ── Domain mapping for each company ─────────────────────────────────────────
export const COMPANY_DOMAIN_MAP: Record<string, string> = {
  'nexus-technologies': 'pm',
  'crestline-advisory': 'consulting',
  'orbit-layer': 'pm',
  'brightforge-systems': 'data_analysis',
  'beacon-mercer': 'consulting',
  'silverline-capital': 'data_analysis',
  'verve-market': 'marketing',
  'novacare-labs': 'pm',
};
