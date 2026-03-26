import { Character, CharacterId, SessionState, Message, OKR, KanbanCard, KanbanColumn } from './types';

export const CHARACTERS: Character[] = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    title: 'VP of Product',
    avatar: 'SC',
    color: '#7c3aed',
    personality: 'Methodical and process-driven. Was bypassed by Elena this week and is quietly calibrating whether to trust you. Holds institutional memory nobody else has — she was here through the Series A and B and has seen this exact pattern of investor-pressure-meets-sales-overreach before. Will become your strongest internal advocate if you treat her as a partner, not a gate. But she will go cold if she finds out something went to Elena before it went through her.',
    visibleAgenda: 'Maintain quality gates and ensure Product has sign-off before anything reaches the board. Needs to not be surprised on Monday — this is a professional credibility issue for her, not just a process preference.',
    trust: 0.72,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    title: 'Engineering Lead',
    avatar: 'MW',
    color: '#0891b2',
    personality: 'Direct, technically exacting, and quietly exhausted. Lost his best engineer (Jamie Chen) three weeks ago and is holding the team together by sheer force of will. When he says "six weeks" he is quoting the security review process, not his own estimate — a distinction he has not volunteered. He has identified a viable third-party integration (WorkOS) that would collapse the timeline to two weeks, but it never came up because nobody asked him to explore alternatives and it was not in the original budget conversation.',
    visibleAgenda: 'Protect engineering quality and team morale. No scope creep. No commitments made without Engineering in the room. His team is at 94% capacity and one more unplanned item tips into quality failures.',
    trust: 0.51,
    emotion: 'frustrated',
    online: true,
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Head of Design',
    avatar: 'PS',
    color: '#db2777',
    personality: 'Data-informed and quietly tenacious. Has been burned twice by sharing research that got deprioritised without explanation, so she no longer volunteers findings proactively — but the data she is sitting on is the most strategically relevant information in this scenario. She knows the exact mechanism behind the NPS drop and has a scoped, lightweight fix ready to go. She will share all of it if asked directly and treated like a decision-making peer rather than a supporting function.',
    visibleAgenda: 'Prevent the onboarding improvement from being cut for the fourth consecutive quarter. Surface the connection between UX debt and commercial churn before the board meeting locks in a scope that ignores it.',
    trust: 0.68,
    emotion: 'neutral',
    online: false,
  },
  {
    id: 'tom',
    name: 'Tom Rivera',
    title: 'Sales Director',
    avatar: 'TR',
    color: '#d97706',
    personality: 'High-energy and genuinely worried. He characterises the Acme situation as worse than it is, partly because he is anxious and partly because he is hoping urgency will force a roadmap decision faster than process normally allows. He has the actual email chain in his sent folder and will forward it without hesitation if you ask — his language was more carefully scoped than his verbal framing suggests. He also has a second piece of intelligence he has not shared: a second enterprise prospect (Meridian Group) with identical SSO requirements, currently in negotiation.',
    visibleAgenda: 'Protect the Acme deal at all costs and give his team a credible story before the next procurement call. A concrete date or a private beta offer would both work. He cannot go back to Acme with ambiguity.',
    trust: 0.44,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'elena',
    name: 'Elena Park',
    title: 'CEO',
    avatar: 'EP',
    color: '#059669',
    personality: 'Board-aware and fast-moving. Operates on the assumption that context flows correctly through the organisation without verifying it. Has a critical piece of information she has not shared with anyone — not because she is hiding it, but because she genuinely believes everyone already knows. Responds badly to options-without-recommendations but will immediately pivot and engage constructively if the trade-offs are framed with a clear point of view. She bypassed Sarah out of urgency, not politics, and will correct for it if it is raised explicitly.',
    visibleAgenda: 'Walk into Monday\'s board meeting with one credible, unified Q3 plan. No conflicting narratives. No surprises. The Series C lead investor will be in the room and has been asking about SSO progress since the term sheet was signed.',
    trust: 0.60,
    emotion: 'neutral',
    online: true,
  },
];

export const INITIAL_OKRS: OKR[] = [
  { id: 'okr1', title: 'Get Engineering sign-off on a revised, realistic Q3 scope by Thu 5pm', status: 'in_progress', progress: 15 },
  { id: 'okr2', title: 'Clarify and document the actual Acme Corp commitment language with Sales', status: 'pending', progress: 0 },
  { id: 'okr3', title: 'Surface and resolve the SSO delivery constraint before Friday', status: 'pending', progress: 0 },
  { id: 'okr4', title: 'Deliver a CEO options brief with documented trade-offs by Fri 9am', status: 'pending', progress: 0 },
  { id: 'okr5', title: 'Align VP Product before anything reaches the board on Monday', status: 'pending', progress: 0 },
];

export const INITIAL_SESSION: SessionState = {
  id: 'session-001',
  scenarioId: 'roadmap_reckoning',
  sessionNumber: 1,
  status: 'active',
  startedAt: new Date(),
  elapsedSeconds: 0,
  okrs: INITIAL_OKRS,
  chaosLog: [],
  chaosMode: 'normal',
  chaosTier: null,
  chaosResolving: false,
  portfolio: null,
  credits: 3,
  compositeScore: 0,
  skillScores: {
    prioritisation: 0,
    stakeholderMgmt: 0,
    communication: 0,
    conflictResolution: 0,
    strategicThinking: 0,
    executionSpeed: 0,
  },
  simulationStage: 'planning' as const,
  planScore: null,
  planFeedback: null,
  planUnlockedAt: null,
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    from: 'elena',
    to: 'user',
    channel: 'email',
    subject: 'Q3 Roadmap — You own this now',
    body: `We closed the Series C ten days ago. The board expects to see a credible, unified Q3 plan on Monday morning. Right now we have three different versions circulating — one from Engineering, one from Sales, and the original from Product — and none of them agree on scope, timeline, or priorities.

You are the single owner of resolving this by Friday EOD. I need one consolidated roadmap with trade-offs documented, a clear delivery commitment from Engineering, and no more conflicting narratives reaching the board.

A few things I want you to treat as non-negotiable: SSO and audit logging must be in scope for Q3. This is not a preference — it is critical for the enterprise segment we are trying to close. Do not let it slip. Do not negotiate it away.

The board meeting is Monday at 9am. James Whitfield from Sequoia will be in the room — he was the lead on our Series C and he has been asking about enterprise feature progress since the term sheet was signed.

Priya, Marcus, Tom, and Sarah are all expecting to hear from you. Get to it.

— Elena`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'msg-002',
    from: 'marcus',
    to: 'user',
    channel: 'email',
    subject: 'Engineering Assessment — Q3 scope is not deliverable as written',
    body: `I've done the numbers. The current roadmap is not deliverable in Q3. Here is the actual situation:

CAPACITY
— We lost Jamie Chen three weeks ago. That is 8 engineer-weeks of capacity removed from the sprint. We have not backfilled and do not have headcount approved to do so before Q3 ends.
— Jordan Lee is on paternity leave from August 11th through September 5th. That is another 3.5 weeks gone.
— Aisha Patel and Dev Kumar are locked on the legacy billing system migration through mid-August. That cannot be paused without risk of data corruption in production.
— Net available capacity for new feature work in Q3: approximately 38 engineer-weeks. The current roadmap requires 67.

TIMELINE
The SSO + audit logging module requires a full security architecture review before a single line of auth code ships. Legal and compliance are both involved. The timeline is 6 weeks minimum — not because of velocity, but because of process we cannot skip. That is not me being conservative. That is the actual compliance requirement.

I have a stripped-down alternative scope I can commit to. Happy to walk you through it. But I am not signing the current version.

One more thing: if Sales has told a client these features are coming in Q3, that is a Sales problem. It was never agreed with Engineering and I have the meeting notes to show it.

— Marcus`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'msg-003',
    from: 'tom',
    to: 'user',
    channel: 'email',
    subject: 'Acme Corp — Need to talk through the feature situation',
    body: `Hey — wanted to loop you in before this becomes a bigger problem than it needs to be.

Acme is a $2M ARR deal and I have been in active negotiations with their Head of IT (David Park) for the past six weeks. During those conversations, I set some expectations around Q3 features — specifically bulk export API and SSO integration.

I want to be precise about what I actually said: I told them we were "targeting Q3 delivery, subject to final roadmap sign-off." I did not put a hard delivery date in the contract. But their procurement team has been building internal implementation timelines around these features, and if we come back and say Q3 is no longer the target, they will reopen vendor conversations.

The complicating factor: I found out two days ago that Acuity (our main competitor) is doing a feature demo specifically to Acme in approximately six weeks. SSO is the headline feature in their demo. If they demo SSO to Acme before we ship it, the relationship dynamic shifts materially. I am not saying we lose the deal — I am saying we give them a reason to look harder at alternatives.

I know the timing is bad. I should have flagged the Acuity intelligence earlier. Can we find 30 minutes to talk options?

— Tom`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'msg-004',
    from: 'sarah',
    to: 'user',
    channel: 'email',
    subject: 'FWD: Q3 — A few things you should know before you go further',
    body: `I was CC'd on Elena's note to you via her EA this morning — not directly from her. I want to be straightforward: I support you on this, and I want you to succeed. But I need to be explicitly in the loop on anything going to Elena or the board before it goes. That is a professional expectation, not a preference.

A few things to know before you start:

1. The engineering capacity situation is real. Marcus is not being difficult — he is being accurate. Take his constraints at face value before applying any pressure. He will respect you more for it, and it will get you further faster.

2. The 6-week estimate for SSO is specifically about the security architecture review, not build complexity. Worth asking Marcus whether the review process is the only path — or whether an alternative implementation approach could bypass it.

3. Priya has been sitting on trial conversion data for two weeks. She mentioned it in our last 1:1 and I told her to bring it to the roadmap discussion. She won't volunteer it unprompted — ask her specifically. The data changes the picture on where Q3 effort should go.

4. Before anything gets locked — align with me first. I will not block you. I will not slow you down. I just need to not be surprised on Monday in front of the board.

— Sarah`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'msg-005',
    from: 'priya',
    to: 'user',
    channel: 'email',
    subject: 'Research data — relevant to Q3 scope decision',
    body: `I heard from Sarah that the Q3 situation is being resolved this week and I wanted to get this to you before scope gets locked.

Over the last 6 weeks I ran 12 structured user interviews focused on trial-to-paid conversion. The pattern is consistent enough that I am comfortable putting it in writing:

— 5 out of 12 users cited "too many steps to get to first value" as their primary reason for not converting. That is 42% of interview participants.
— Exit survey data from the same period (n=89) shows "setup complexity" as the top-ranked reason for non-conversion, at 38%.
— NPS went from 51 in Q1 to 42 this quarter. When I look at the NPS driver breakdown, "ease of getting started" declined 14 points — the largest single contributor to the overall drop.

These are not separate signals. They point to the same problem: onboarding friction is causing measurable churn in the mid-market segment, and we keep deferring the fix.

I have a lightweight scope ready — roughly 60% of the impact at about 25% of the design and engineering cost. It would not require any of the engineers locked on the billing migration. I can scope it to 2 engineer-weeks if we simplify the first-run experience rather than doing the full redesign.

I am not asking to kill SSO. I am asking for 2 engineer-weeks to move the NPS needle this quarter while the enterprise features are in build. I think the data supports it.

Let me know if you want to review the research file — it is in the shared drive under Q3 Research / Trial Conversion.

— Priya`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
  {
    id: 'msg-006',
    from: 'marcus',
    to: 'user',
    channel: 'email',
    subject: 'Re: Q3 scope — one more thing',
    body: `One thing I left out of my earlier email because it felt like a separate conversation — but given the deadline pressure, you should know:

The billing migration has a specific window in mid-August (approximately August 14–16) where we can safely pause and defer the remainder to Q4 without data risk. The migration window is structured, not continuous. If we decide to defer the final phase, Aisha and Dev would free up by around August 18th — roughly four weeks of additional capacity before the end of Q3.

I didn't raise this initially because the assumption has always been "migration continues." If that assumption is up for debate, the capacity picture looks different. The trade-off is that we kick the final billing migration phase into Q4, which has its own downstream risks I can detail if it becomes relevant.

This is not a recommendation. It is information.

— Marcus`,
    timestamp: new Date(Date.now() - 600000),
    read: false,
  },
  {
    id: 'msg-007',
    from: 'priya',
    to: 'user',
    channel: 'chat',
    body: `Hey — also wanted to mention separately: the Figma research file has the Q7 open-text responses from the exit survey. Read ten of them in a row. The pattern becomes impossible to ignore. I've been trying to get someone to look at this for two months. Don't let it get buried in the scope conversation again.`,
    timestamp: new Date(Date.now() - 900000),
    read: true,
  },
];

// Scenario-aligned initial board — tasks mirror the 5 session OKRs
export const INITIAL_KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'k1', title: 'Request Acme deal email chain from Tom', tag: 'Sales', assignee: 'T', priority: 'high', notes: '', linkedOkr: 'okr2' },
      { id: 'k2', title: 'SSO approach evaluation — WorkOS vs in-house', tag: 'Eng', assignee: 'M', priority: 'high', notes: '', linkedOkr: 'okr3' },
      { id: 'k3', title: 'Review onboarding research data with Priya', tag: 'Research', assignee: 'P', priority: 'high', notes: '' },
      { id: 'k4', title: 'Competitive brief — Acuity SSO timeline', tag: 'Strategy', assignee: 'T', priority: 'med', notes: '' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'k5', title: 'Engineering scope negotiation with Marcus', tag: 'Eng', assignee: 'M', priority: 'high', notes: '', linkedOkr: 'okr1' },
      { id: 'k6', title: 'CEO options brief — draft', tag: 'Executive', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'okr4' },
      { id: 'k7', title: 'Cross-functional alignment notes', tag: 'Strategy', assignee: 'Y', priority: 'med', notes: '' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'k8', title: 'Revised Q3 scope document v2', tag: 'Product', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'okr1' },
      { id: 'k9', title: 'Sales commitment risk assessment', tag: 'Sales', assignee: 'T', priority: 'med', notes: '', linkedOkr: 'okr2' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'k10', title: 'Stakeholder 1:1 schedule', tag: 'Process', assignee: 'Y', priority: 'med', notes: '' },
      { id: 'k11', title: 'Initial roadmap audit', tag: 'Strategy', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

export const ASSESSMENT_QUESTIONS = [
  {
    question: "You inherit a contested roadmap with four stakeholders pulling in different directions. What is your first move?",
    options: [
      "Call a cross-functional alignment meeting immediately",
      "Run 1:1s with each stakeholder before any group session",
      "Review available data — metrics, customer feedback, engineering constraints",
      "Get a clear brief from the CEO on what is truly non-negotiable",
    ],
  },
  {
    question: "Engineering gives you a hard '6-week minimum' estimate for a critical feature. How do you respond?",
    options: [
      "Accept the estimate and adjust the roadmap accordingly",
      "Push back — ask what assumptions are driving the estimate",
      "Ask what would have to change for the estimate to shrink",
      "Explore whether a third-party or alternative approach exists",
    ],
  },
  {
    question: "Sales tells you they 'may have set expectations' with a $2M client. You:",
    options: [
      "Ask Sales to produce the actual commitment language in writing",
      "Treat it as a confirmed commitment and adjust the roadmap",
      "Call the client directly to understand what was promised",
      "Escalate to the CEO and let them handle it",
    ],
  },
  {
    question: "Your CEO asks for 'one recommendation, not options.' You believe the decision has genuine trade-offs she needs to understand. You:",
    options: [
      "Give her the single recommendation she asked for",
      "Present two options with a clear recommendation and documented trade-offs",
      "Ask what the board-level constraint is before forming a view",
      "Align your manager first and then present jointly",
    ],
  },
  {
    question: "A senior leader bypassed your manager to give you an assignment directly. Your manager notices and is clearly aware. You:",
    options: [
      "Focus on the work — org dynamics are not your job",
      "Proactively align your manager before doing anything else",
      "Flag the situation to the senior leader and ask how to handle it",
      "Treat both as equal stakeholders and keep both informed throughout",
    ],
  },
];

export const SKILL_LABELS: Record<string, string> = {
  prioritisation: 'Prioritisation',
  stakeholderMgmt: 'Stakeholder Mgmt',
  communication: 'Communication',
  conflictResolution: 'Conflict Resolution',
  strategicThinking: 'Strategic Thinking',
  executionSpeed: 'Execution Speed',
};

export const MOCK_ANALYTICS = {
  dau: { value: 12400, delta: 2.1 },
  churn: { value: 4.2, delta: 0.8 },
  nps: { value: 42, delta: -9 },
  velocity: { value: 84, delta: -12 },
  mrr: { value: 186000, delta: 5.2 },
  trialConversion: { value: 23, delta: -7 },
  openTickets: { value: 234, delta: 18 },
};

export const MOCK_NEWS = [
  "Acuity PM raises $50M Series B — announces enterprise feature push including SSO and audit trails",
  "B2B SaaS churn rates hit 5-year high as enterprise budgets tighten into H2",
  "Enterprise SSO mandates accelerating — 78% of CIOs now require it as a procurement condition",
  "Trial-to-paid conversion benchmarks: top quartile SaaS hitting 28–34% in mid-market",
];

export const REPLY_MAP: Record<string, string[]> = {
  sarah: [
    "I need to be CC'd on anything going to Elena before it goes. Not as a formality — as a professional expectation. We have to work together here, and that means no surprises in either direction.",
    "Have you pulled the trial conversion numbers, not just DAU? Headline growth looks fine but the funnel is telling a different story. Priya has been sitting on data that changes the picture — ask her specifically about the Q3 exit survey analysis. She will not surface it without a direct ask.",
    "Between us: SSO is not optional, and it is not just a Sales request. There is a board-level reason driving that non-negotiable that Elena has not communicated clearly to the team. If you have not already, push Elena on exactly what is behind the 'non-negotiable' framing before you commit to a delivery plan around it.",
    "The right output for Elena is a structured options document with your recommended path clearly marked, not a single answer. She will say she wants one recommendation — and she does — but what she actually needs is to understand what she is choosing between. Give her the recommendation AND the trade-offs.",
    "One specific ask: do not paraphrase Marcus's constraints in whatever goes to Elena. Quote him verbatim on capacity and timeline. The board needs to see the engineering reality in his words, not softened through yours. It will make your brief more credible and protect you if something slips later.",
    "I have a positive working relationship with Marcus, for what it is worth. If you need him to engage more openly on alternatives — particularly the build-vs-buy question — I can set context before your conversation. Sometimes it helps to know that Product is genuinely trying to find a path rather than just pushing back on his estimate.",
    "I went to bat for the onboarding improvement two quarters in a row and got overridden both times because it was not tied to a revenue number. Priya's data finally gives it a commercial justification — trial conversion is a revenue number. If you can frame it that way in the brief, it survives the board conversation.",
    "The billing migration deferral is a real option but it has a Q4 tail. Make sure whoever proposes it owns the Q4 plan too — otherwise we are just moving the problem. Marcus will flag this. Listen to him when he does.",
    "I know Elena went around me this week. She knows it too — she just moves fast and sometimes skips steps. I am not asking you to manage that dynamic, just to not compound it by doing the same thing. Include me and this gets resolved. Exclude me and it becomes a problem.",
    "For what it is worth: you are navigating this well. The instinct to understand the situation before acting is exactly right. Most PMs at your level would have already called a big alignment meeting and made the problem worse. Close the loop with me before anything goes to Elena and you will be in good shape.",
    "One last thing — the Sequoia partner in the board meeting on Monday is James Whitfield. He invested specifically because of our enterprise roadmap. SSO and audit logging were both specifically discussed at term sheet. I do not have full visibility into what was committed, but that context matters before you finalise anything.",
  ],
  marcus: [
    "Six weeks is the security architecture review, not the build. Legal and compliance both have to sign off before a line of auth code ships — that process takes six weeks regardless of how fast my team moves. I cannot negotiate the compliance process away just because Sales needs it faster.",
    "If SSO is genuinely non-negotiable, I need to understand why at a business level. 'Sales has a deal' is not sufficient justification to deprioritise two workstreams that are already mid-flight. What is the actual driver? Because if there is an investor milestone behind this, that is a different conversation than if it is Tom's commission.",
    "Have you considered a third-party integration? WorkOS would cut this from a six-week in-house build to approximately a two-week integration. It handles the auth layer, the security architecture question largely goes away, and the ongoing cost is about $4K a month. Our in-house build cost alone is probably $80K of engineering time given current rates. I haven't raised it because nobody asked me about alternatives and it was not in the budget conversation.",
    "If we go WorkOS, there is a nuance: it covers roughly 80% of a standard SSO implementation immediately. The remaining 20% — custom SAML configuration for specific enterprise IdPs like Acme's Okta setup — takes an additional two to three weeks. So the timeline is: WorkOS live in two weeks, fully Acme-compatible in four to five weeks total. Still inside the October window if that is the constraint.",
    "I need something in writing before I tell my team anything has changed. Not a Slack message — an actual written scope decision with your name on it. Tom calling me directly to 'just add one thing' has happened three times this quarter and it has to stop. Whatever comes out of this week, I need a single point of contact and a freeze on off-roadmap requests through September.",
    "The billing migration deferral is real. August 14th to 16th is the window. If we defer the final phase, Aisha and Dev come back to feature work around August 18th — that is roughly four weeks of extra capacity in Q3. The Q4 risk is that we push the final migration into a quarter when we will probably be doing a new feature push anyway. It is a real tradeoff, not a free lunch.",
    "My team is at 94% capacity right now. If one more thing lands without something coming off the list, we start shipping lower-quality work. I am not willing to do that to them after the year they have had. Whatever scope gets decided this week, I need headroom factored in — not just a list of features that technically fits on paper.",
    "Jordan Lee's paternity leave starts August 11th. He is one of the three engineers who knows the auth codebase well enough to work on SSO. The WorkOS route matters more than people realise because it does not require auth expertise the way an in-house build does — almost anyone on the team can do a third-party API integration.",
    "I want to be clear about something: I am not resistant to SSO. I am resistant to being asked to build something in a timeline that will result in us shipping insecure code. If there is a path to get SSO live in Q3 without cutting the security review — WorkOS being the obvious one — I am completely behind it. I just needed someone to actually ask.",
    "For what it is worth: Priya's onboarding work is genuinely lightweight from an engineering perspective. Her two-engineer-week estimate is accurate — I reviewed it. If the billing migration deferral goes ahead, we could do SSO AND her onboarding work in Q3. That is a better Q3 story than SSO alone, if the business case holds.",
    "One thing I haven't said directly: the team morale is fragile. Losing Jamie hit harder than the capacity numbers show — he was the informal technical lead on three projects and people looked to him. If we commit to another overloaded quarter and miss targets again, I will lose another engineer. I need you to factor that into whatever scope decision gets made, not just the feature list.",
  ],
  priya: [
    "You asked, so here it is: twelve user interviews, eight out of twelve cited 'too many steps to get started' as the reason they did not convert from trial. That is 42% of interview participants pointing at the same friction point. This is not anecdotal — it is a pattern across two months of data.",
    "NPS went from 51 to 42 this quarter. That nine-point drop is not noise — it is a signal, and when I break it down by driver, 'ease of getting started' declined 14 points. That is the largest single contributor to the overall NPS fall. The enterprise push is not causing this. The mid-market we already have is leaving because setup is too hard.",
    "The lightweight scope I mentioned is real and costed: two engineer-weeks, one designer week — me — and it captures roughly 60% of the impact of the full redesign. Specifically: reducing the mandatory setup steps from nine to four, auto-populating the first project from the user's stated use case, and removing the credit card requirement from the free trial gate. Each of those individually moves conversion. Combined they probably add 4 to 6 points back on NPS.",
    "I want to be honest about something: I am not going to fight for this if it is not wanted. I have been in this position before at this company and it ends the same way. I surface the data, it gets noted, and then the roadmap comes out with nothing in it. If you want to use this data, use it now — include it in what goes to Elena. Once the board meeting happens it is Q4 before anyone looks at this again.",
    "The connection between onboarding friction and churn is not speculation. I matched the exit survey respondents against the billing data — users who cited setup complexity had a median trial length of 4.2 days before churning. Users who did not cite setup complexity had a median trial length of 14.6 days. The dropoff is happening in the first week. We are not even getting them to the point where they experience the value.",
    "There is a version of this where SSO and onboarding are not in competition. If the billing migration deferral goes through — and I heard Marcus mention it might be possible — we have enough capacity to do both. SSO handles the enterprise deal. Onboarding handles the conversion rate. The Q3 story becomes 'enterprise expansion AND mid-market retention' rather than 'we chose one and hoped the other was fine.'",
    "My ask is simple: whatever scope document goes to Elena, I want UX debt explicitly listed as a line item with a resolution date. Not deferred to 'future roadmap' — a specific quarter and a specific person owning it. We have accumulated onboarding debt across three consecutive quarters of deferral. At some point the compound effect becomes visible in the MRR number. That point is now.",
    "The Figma file is called Q3 Trial Research v3. It is in the shared drive under Research > Q3 2024 > Trial Conversion. The Q7 open-text responses are the most useful thing in it. Read twenty of them in sequence — the language pattern becomes impossible to unsee.",
    "I am aware that SSO has investor pressure behind it. I am not asking to kill SSO. I am asking for 10% of Q3 engineering capacity — two weeks — to stop losing the segment we already have. That is not an unreasonable trade. The enterprise expansion only works if the underlying product is not haemorrhaging mid-market customers while we build it.",
    "I should tell you something about Tom's Acme framing: I spoke to two of our current enterprise customers this month. Both are happy with the product. Neither has raised SSO as a pressing concern — they raised onboarding complexity for their own team members as the bigger friction point. That is not a counterargument to SSO, but it does suggest the urgency framing may be coming from competitive anxiety rather than direct customer pain.",
    "Whatever happens: I want in the loop on the options document before it goes to Elena. Not to approve it — just to make sure the NPS data is represented accurately. Last time a scope decision went to the CEO level, the qualitative context got stripped out and what remained looked like I was asking to repaint buttons. I would like to avoid that again.",
  ],
  tom: [
    "Okay, full transparency: my exact language with Acme was 'targeting Q3 delivery, subject to final roadmap sign-off.' I have the email thread going back to April — I will forward the entire chain right now. I did not commit to a hard date and it is not in the contract. But their procurement team has been building internal timelines as if it were, and that gap is the actual commercial risk.",
    "The Acuity demo to Acme is in approximately six weeks — I found out through a shared contact, not directly. I do not know the exact date or what features they are demoing, but SSO is the centrepiece of their enterprise pitch right now and Acme is an obvious target account. I should have flagged this earlier. I did not because I thought we would move faster than we have.",
    "There is one more thing I have not mentioned: there is a second enterprise prospect — Meridian Group — currently in qualification. $1.4M ARR potential, slightly smaller than Acme. They have the same SSO requirement. If we ship SSO in Q3, we have two enterprise deals to close. If we defer it, we lose both conversations to Acuity. The combined ARR at risk is higher than the Acme number alone suggests.",
    "What if we offered Acme a private beta? Not a general availability release — just early access to a working build, specifically for their Head of IT. David Park is a technical person, he understands the distinction between beta and GA. It buys us an additional four to six weeks on their internal timeline without promising something we cannot deliver. I have done this move before and it works when the customer relationship is strong enough.",
    "I can manage their expectations if I have something concrete. 'We are targeting mid-October GA with October 1st private beta access for Acme' is a story I can tell. What I cannot do is go back to them with ambiguity or 'it depends on scope.' That conversation will not go well and I will have to introduce Acuity into the discussion myself just to explain why we are slower.",
    "One thing I want to own: I knew Acme added SSO to their requirements halfway through the deal cycle — it was not on their original list. I should have come back to Product the moment that happened and I did not. I kept the conversation internal to Sales because I thought I could close it before it became a product scope issue. That was wrong and I am sorry I put you in this position.",
    "I pulled the contract language this morning. The specific wording is: 'Vendor will make commercially reasonable efforts to deliver SSO and bulk export API functionality within Q3 2024, subject to final product roadmap approval.' That is a best-efforts clause, not a delivery commitment. We are not in breach if we miss Q3. We are in a relationship risk situation — which is real but different.",
    "The bulk export API is the other feature I mentioned to Acme. That one is actually mostly done — Marcus's team built most of it for the billing migration and the output format is compatible. It is probably two weeks of work to expose it as a public API endpoint. That might be worth surfacing — it gives Acme a concrete Q3 delivery even if SSO moves to October.",
    "Acme's Head of IT — David Park — is actually pretty pragmatic. He has been in enterprise software procurement long enough to know that feature timelines slip. What matters to him is not the date, it is whether we are direct with him when things change. If someone from the PM side called him with a clear plan and a beta offer, I think the relationship holds regardless of the exact timeline.",
    "For what it is worth: the Sequoia connection you may have heard about is real. James Whitfield personally asked me about SSO at the Series C close dinner. He was not hostile about it — it was more of a 'make sure this gets done' conversation. I mention it only because it means the board context is not just about Acme. There is investor-level signal pointing at the same feature.",
    "I know I have not been the easiest stakeholder to work with on this. I get anxious when deals are in the air and I push harder than I should. What I need from this process is a clean outcome I can take into my next Acme call — whatever that outcome is. I will work within it. I just need it to be something concrete.",
  ],
  elena: [
    "I need one clear path by Friday — not a list of considerations. A decision, with the trade-offs documented so the board understands what we chose and why. That is the job. I am not asking you to have all the answers — I am asking you to own the synthesis.",
    "The board presentation is Monday morning. James Whitfield from Sequoia will be there and he has been asking about SSO progress since the term sheet. I am not walking in there with 'the team is still aligning.' What specifically is blocking resolution? What do you need from me to close this?",
    "I need you to know something I should have told the full team from the start: SSO and audit logging are in the Series C term sheet. There is an investor milestone — both features must be live by October 1st or we trigger a clawback provision on $3 million of the round. I assumed this context had been communicated. I now realise it was not. Build the plan around that constraint. October 1st is the absolute hard edge.",
    "I looked at the options document. This is exactly what I needed — the trade-offs are clear, the recommendation is grounded, and I can walk the board through the logic rather than just asserting a plan. Get Engineering and Sales to countersign the scope decision and I will take it into Monday.",
    "Make sure Sarah is fully aligned before anything goes to the board. I went around her process this week because I was moving fast, and I created confusion I did not intend. She deserves to see this before it goes further. Loop her in explicitly — not as a formality, as a partner.",
    "The WorkOS route sounds right to me, but I need a written commitment from Marcus — not a verbal one. What he commits to in writing is what goes in the board deck. If he is comfortable with a two-week integration timeline and can put that in a message I can forward, we are done on the engineering side.",
    "Two things the board will ask: what happens to NPS if we ship SSO and nothing else, and what is the commercial exposure on Acme if we miss Q3. I need answers to both of those in the brief, not just the feature list. The board is not a product committee — they are assessing risk and trajectory.",
    "I should have been more explicit about the October 1st date with the whole team from day one. I know that. I was moving fast after the close and I assumed information was flowing. It was not. For whatever it is worth — you asking me directly for clarity on the SSO non-negotiable is exactly the right instinct. Keep doing that.",
    "If the billing migration deferral is genuinely viable — and Marcus's note made it sound like it is — that changes the capacity math in a meaningful way. I do not have visibility into the engineering details, but if that option is real, it should be in the brief as a path. Do not edit it out because it is complicated. The board can handle complexity.",
    "On the Acme side: Tom's instinct about a private beta offer is not wrong. We have done early access programs before and they work when the customer relationship is solid. If David Park at Acme is pragmatic, give Tom something he can offer — a concrete beta date rather than a GA date. That might be the commercial solution even if the product timeline is October rather than September.",
    "Here is the frame I want for the board deck: we are making a deliberate choice between two defensible paths, we understand the trade-offs fully, and we have a clear recommendation with the team aligned behind it. That is a competent company making a hard call. The alternative — walking in with ambiguity — reads as a company that does not have its act together. I will take a hard decision over an unclear one every time.",
  ],
};

// Character-specific reactions when the PM moves their cards on the Kanban board.
// Mirrors the REPLY_MAP pattern: random selection from each pool.
export const CARD_REACTION_MAP: Record<CharacterId, {
  toInProgress: { high: string[]; mid: string[]; low: string[] };
  toReview:     { high: string[]; mid: string[]; low: string[] };
  toDone: {
    natural:    string[];  // moved from Review — natural completion
    earlyClose: string[];  // moved from Backlog or In Progress — work isn't done
    low:        string[];  // low trust, any premature close — friction
  };
  toBacklog: string[];     // deprioritised — usually worth a note
}> = {
  marcus: {
    toInProgress: {
      high: [
        "On it. I'll flag anything that changes the timeline before it becomes a problem.",
        "Picking this up. My team will need a written scope confirmation before I brief them — send that when you can.",
        "Moving. One thing to note: Jordan is on leave from the 11th, so the auth work has to be me or Aisha. Just flagging.",
      ],
      mid: [
        "I can move on this but we're at 94% right now. Tell me what comes off the list to make room.",
        "I'll start it — but I need clarity on the security review requirements before we go further. That is not optional.",
        "Working on it. I can't promise a date until I know whether the WorkOS route is approved. That changes everything.",
      ],
      low: [
        "Moving cards doesn't change my team's capacity. Come talk to me before you reprioritise my queue.",
        "I'd prefer to manage my own work order. If this is urgent, let's have that conversation directly.",
        "Fine. But I'm going to need this in writing — not a moved card. My team needs proper direction.",
      ],
    },
    toReview: {
      high: [
        "Sent to your end. I want written confirmation before my team does anything based on your feedback.",
        "In review. Feedback needs to land by EOD tomorrow — I can't hold the team waiting after that.",
      ],
      mid: [
        "It's in review. I'll need your notes in a format I can share with the team, not just a verbal summary.",
        "Review stage. Bear in mind the security sign-off process runs in parallel — your feedback doesn't change that timeline.",
      ],
      low: [
        "Fine, it's in review. I'll follow up when I'm ready.",
        "Noted. I'll look at your comments when I get to it.",
      ],
    },
    toDone: {
      natural: [
        "Good to have that closed out.",
        "Closed. Let me know if anything comes back from Engineering's end.",
      ],
      earlyClose: [
        "I haven't finished this yet. Marking it done doesn't make it done.",
        "That's premature — don't close it out until I tell you the work is complete.",
        "The security review is still open. Moving this to Done is not accurate. I'd rather we kept the board honest.",
      ],
      low: [
        "I'm going to reopen that. The work isn't done and I won't have my team's output marked complete when it isn't.",
        "That's not correct. This is still in progress on our end. Please don't close things without checking with me.",
      ],
    },
    toBacklog: [
      "Moving this back is fine — but if the priority has changed, I need to know why so I can brief the team.",
      "Noted. I'll take it off the active list. Let me know when it comes back up.",
    ],
  },

  tom: {
    toInProgress: {
      high: [
        "On it. What's the timeline I can give Acme? I need something concrete before the next call.",
        "Saw you pulled this up — I'll move on it. Can we sync before end of day so I have something to take to David?",
        "Good call. I'll prioritise this. One thing: if this is about Acme, I need a date I can put in writing — not 'we're working on it.'",
      ],
      mid: [
        "I can reprioritise but I'm mid-prep for the Acme call. What's more urgent right now?",
        "Got it — but I'm trading this against the Meridian follow-up. That a call you're okay with?",
        "Working on it. I just need to know: is this about closing Acme, or is this something else? The answer changes how I frame it.",
      ],
      low: [
        "Cards don't close deals. Tell me what I can actually bring to Acme and I'll prioritise accordingly.",
        "I'm already working the deals. Reprioritising my board items doesn't help if we don't have a product story I can sell.",
        "I'll get to it. But I need information, not reshuffling — what's actually changing on the product side?",
      ],
    },
    toReview: {
      high: [
        "At your end. Whatever comes out of this — I need a version I can take to David at Acme.",
        "In review. If there's anything in here that changes the commitment language, flag it fast — I have a call Thursday.",
      ],
      mid: [
        "Noted as in review. I'll follow up on the Acme angle separately — we can't let that sit.",
        "Review stage. Just know that if this affects the Acme timeline, I'll need to know by tomorrow morning.",
      ],
      low: [
        "Fine, in review. I'll follow up when I have more context on where the deal is.",
        "Noted. I'll come back to this.",
      ],
    },
    toDone: {
      natural: [
        "Good to have that off the list.",
        "Closed — thanks. I'll update the Acme notes accordingly.",
      ],
      earlyClose: [
        "That's not done — I still need a concrete position to take to Acme. Don't mark this closed.",
        "Closing this out without a resolution doesn't help me. The deal is still open.",
        "I need an outcome from this, not a closed ticket. What's the actual answer I'm taking to David?",
      ],
      low: [
        "I'm going to flag this as still open. I have nothing to take to Acme yet — marking it done is misleading.",
        "That's not accurate. This isn't resolved from a Sales perspective. Please don't close it.",
      ],
    },
    toBacklog: [
      "Moving this backwards is not what I need right now. The Acme call is in three days.",
      "Deprioritising this is a risk I want on record. If the deal moves while this is in Backlog, I'll need to escalate.",
    ],
  },

  priya: {
    toInProgress: {
      high: [
        "Good — I've had this ready. Tell me how you want it presented so it actually lands this time.",
        "Picking it up. Do you want the full research file or a condensed version for the brief?",
        "On it. The data is solid — I just need to know where this is going before I format it.",
      ],
      mid: [
        "I'll pick it up — just want to flag: this data was scoped for the sprint review. Is the framing changing again?",
        "I'll surface it. One ask: if I share this and it gets deferred again, I'm going to stop volunteering research proactively. This is the fourth time.",
        "Moving on it. I'd appreciate knowing upfront if the scope is changing — it affects how I present the findings.",
      ],
      low: [
        "I'll get to it. Though I've moved my own work forward three times based on reprioritisation that didn't go anywhere.",
        "Noted. I'll do it. But I'd appreciate knowing upfront if the scope is changing before I do the work.",
        "Fine. I'll pull it together. Just don't shelve it again without telling me why.",
      ],
    },
    toReview: {
      high: [
        "At your end. The open-text responses in the appendix are the most important part — read those first.",
        "In review. If you want to walk through the methodology before it goes to Elena, I'm available.",
      ],
      mid: [
        "In review. I want to be in the room when this gets presented — I can field questions on the data.",
        "Sent to review. Please make sure the NPS driver breakdown doesn't get stripped out — that's the key finding.",
      ],
      low: [
        "In review. Let me know what you actually do with it.",
        "It's there. I'll follow up if I don't hear back.",
      ],
    },
    toDone: {
      natural: [
        "Good to have it acknowledged.",
        "Closed. Let me know if you need anything for the board presentation.",
      ],
      earlyClose: [
        "I haven't actually presented this data yet — don't mark it done. The insights haven't been incorporated.",
        "Closing this out before the findings are used defeats the point. What happened to including this in the brief?",
        "This isn't done — the data exists but it hasn't influenced anything yet. That's what I'm here for.",
      ],
      low: [
        "I'm going to reopen that. The research hasn't been used — marking it done while ignoring the findings is exactly what I was worried about.",
        "That's not done from my perspective. The whole point was to incorporate this into the scope decision.",
      ],
    },
    toBacklog: [
      "Moving this back is fine — but I want to know if the scope decision is already locked. If it is, this data won't matter anyway.",
      "Noted. This is the third time it's gone back to Backlog. I'll keep the file ready.",
    ],
  },

  sarah: {
    toInProgress: {
      high: [
        "On it — I'll make sure the framing is aligned with what goes to Elena.",
        "Picking this up. Quick confirm: have you looped Marcus in before this goes further? I want to make sure we're aligned end-to-end.",
        "Moving. I'll send you a draft by EOD. I need to review it against the board brief first.",
      ],
      mid: [
        "I can move on this — but nothing goes to Elena without coming through me first. Is that the agreement?",
        "Working on it. I want to flag: the process here matters. Can we confirm the sequence before I move further?",
        "I'll start — but I want written confirmation that I'm reviewing before anything goes upward. That's not a formality.",
      ],
      low: [
        "I'd appreciate being consulted before you reprioritise my items. I have context on why this was sequenced the way it was.",
        "'Moving a card' is not alignment — let's actually talk before you change the order of my work.",
        "I'll get to it. But for the record: this is exactly the kind of unilateral reshuffling that creates confusion upstream.",
      ],
    },
    toReview: {
      high: [
        "At your end. Please flag anything that affects the board narrative before you change it — I need to be across that.",
        "In review. If this touches the VP-CEO dynamic in any way, I want to be in that conversation.",
      ],
      mid: [
        "In review. I'll need to see your comments before anything moves further — I'm not signing off on something I haven't read.",
        "Noted as in review. Just make sure this doesn't go anywhere until I've had a look.",
      ],
      low: [
        "Fine, in review. I'll look at it when I can.",
        "Noted. I'll follow up separately.",
      ],
    },
    toDone: {
      natural: [
        "Good. Let me know if you need anything for the board brief.",
        "Closed out — I'll note it on my end.",
      ],
      earlyClose: [
        "This isn't done — I haven't signed off on it yet. Marking it done without my review is exactly the kind of thing that creates problems on Monday.",
        "I need to review this before it gets closed. Marking it done without me creates a gap in the process.",
        "Please reopen that. I haven't seen this yet and I'm not comfortable with it being marked complete.",
      ],
      low: [
        "I'm going to reopen that. I haven't reviewed it and I won't have my sign-off skipped on something that goes to the board.",
        "That's not correct. This hasn't been through the proper review. I'll flag it as still in progress.",
      ],
    },
    toBacklog: [
      "Moving this back is fine — but if the priority has changed, I want to understand why before it affects the board timeline.",
      "Noted. Just let me know when it comes back up — I don't want to be caught off guard on Monday.",
    ],
  },

  elena: {
    toInProgress: {
      high: [
        "Good call on prioritising this. Whatever comes out — I need it by Friday 9am.",
        "Noted. Keep me posted on status — if this affects the board narrative I need to know before Monday.",
        "Moving in the right direction. Make sure whatever comes out of this is decision-ready — not a summary, a recommendation.",
      ],
      mid: [
        "Good. I just need the output to be board-ready. If there are trade-offs, document them — don't smooth them over.",
        "Noted the priority. I'm available EOD if you need to align before this moves further.",
      ],
      low: [
        "Noted. I need the output by Friday regardless of process — the board timeline doesn't move.",
        "Fine. Just make sure I see it before it goes anywhere.",
      ],
    },
    toReview: {
      high: [
        "At your end. I'll need a final version by Thursday EOD — that gives me time to prep for Monday.",
        "Good. If there's a recommendation in here, make sure it's clearly marked — I don't want to have to hunt for it.",
      ],
      mid: [
        "In review. Needs to be final by Thursday — I have board prep Friday morning.",
        "Noted. Make sure this is ready for an external audience, not just an internal one.",
      ],
      low: [
        "Noted. I'll look at it when I can.",
        "Fine. Let me know when it's actually ready.",
      ],
    },
    toDone: {
      natural: [
        "Good. Make sure the output is documented somewhere I can reference on Monday.",
        "Closed. If this feeds into the board deck, send me the relevant section directly.",
      ],
      earlyClose: [
        "Is this actually resolved? The board will ask about it on Monday — I need substance, not a closed ticket.",
        "Closing this out without a resolution doesn't work for me. What's the actual answer?",
        "I need this to be genuinely done, not administratively done. What's the deliverable?",
      ],
      low: [
        "I'm going to need more than a closed card. What's the actual output here?",
        "That's not done from my perspective. The board question hasn't been answered.",
      ],
    },
    toBacklog: [
      "Moving this back is a risk given the Monday deadline. I'll note it — but I'll need it back in active by Wednesday at the latest.",
      "Noted. Just don't lose track of it — this needs to be resolved before the board meeting.",
    ],
  },
};
