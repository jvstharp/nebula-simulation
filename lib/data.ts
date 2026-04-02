import { Character, SessionState, Message, OKR, CharacterId, DifficultyLevel, KanbanColumn, CompanyCatalogEntry, SimCompany } from './types';

export const USER_AVATAR = 'https://randomuser.me/api/portraits/men/75.jpg';

export const CHARACTERS: Character[] = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    title: 'VP of Product',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
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
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
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
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
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
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
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
  difficulty: 'standard' as const,
  unlockedSecrets: [],
  firedCascades: [],
  firedChaosIds: [],
  lastContactedAt: {},
  decisionHistory: [],
  dynamicAnalytics: { nps: 42, trialConversion: 23, velocity: 84, churn: 4.2, dau: 12400 },
  debrief: null,
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

// ─── Character Secrets (unlocked by trust threshold) ────────────────────────
export const CHARACTER_SECRETS: Record<CharacterId, { threshold: number; secretId: string; message: string }[]> = {
  marcus: [
    { threshold: 0.68, secretId: 'marcus_workos', message: "Hey — just between us. WorkOS has a pre-built SSO connector. We could be live in two weeks, not six. I didn't raise it because nobody asked and I didn't want to look like I was shaping the decision. But if you're asking: yes, this is doable fast. The compliance review question largely disappears with a certified third-party provider." },
    { threshold: 0.80, secretId: 'marcus_billing', message: "One more thing — if you defer the billing migration final phase to Q4, I get roughly four extra engineer-weeks before end of Q3. The August 14–16 window is the last safe handoff point. That's basically a free sprint. I didn't raise it earlier because the migration was assumed to be non-negotiable. Is it?" },
  ],
  priya: [
    { threshold: 0.75, secretId: 'priya_interviews', message: "I have the full interview recordings if you want them — twelve sessions, each about 25 minutes. The Q7 open-text responses are the most useful. I've been trying to get someone senior to actually read them for two months. If you have 20 minutes, I can walk you through the top five quotes. The pattern becomes impossible to unsee." },
  ],
  tom: [
    { threshold: 0.62, secretId: 'tom_meridian', message: "There's actually a second deal I haven't mentioned — Meridian Group, $1.4M ARR potential. Slightly smaller than Acme. Same SSO requirement, same timeline pressure. I've been keeping it separate because I didn't want to pile on, but if we ship SSO in Q3 we close both simultaneously. That's $3.4M in new ARR, not $2M." },
    { threshold: 0.78, secretId: 'tom_acuity_date', message: "I found out the actual date on the Acuity demo — it's in five weeks, not six. I learned this morning from a contact at Acme's IT team. We have less runway than I said in my original email. I'm sorry I didn't have this earlier." },
  ],
  elena: [
    { threshold: 0.80, secretId: 'elena_clawback', message: "I should have told you this from the start. There's a $3M clawback clause in the Series C docs — SSO and audit logging must be live by October 1st or we give back $3M of the round to Sequoia. James Whitfield's team put it in at the last minute. I assumed it was communicated to the leadership team. I now realise it wasn't. Build the plan around October 1st as a hard wall." },
  ],
  sarah: [
    { threshold: 0.80, secretId: 'sarah_series_b', message: "We went through something almost identical at Series B. Elena made a unilateral call then too, and we shipped a half-baked feature that caused a 12-week support crisis the following quarter. I'm not asking you to manage that dynamic — I'm asking you to include me early enough that we don't repeat it. The pattern is real. I've seen it twice now." },
  ],
};

// ─── Cascade Events (fired when characters are ignored) ─────────────────────
export interface CascadeEvent {
  id: string;
  trigger: (session: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) => boolean;
  characterId: string;
  channel: 'email' | 'chat';
  subject?: string;
  message: string;
}

export const CASCADE_EVENTS: CascadeEvent[] = [
  {
    id: 'priya_ignored_4min',
    trigger: (s) =>
      !s.firedCascades.includes('priya_ignored_4min') &&
      s.elapsedSeconds > 60 &&
      (s.elapsedSeconds - (s.lastContactedAt['priya'] ?? 0)) > 240,
    characterId: 'priya',
    channel: 'email',
    subject: 'RE: Research data — still relevant?',
    message: "Just checking in — should I put the interview research on hold? I know everyone's focused on SSO but the NPS data is time-sensitive ahead of the board meeting. Happy to defer if that's the call, but wanted to flag before we lose the window.",
  },
  {
    id: 'marcus_check_in',
    trigger: (s) =>
      !s.firedCascades.includes('marcus_check_in') &&
      s.elapsedSeconds > 120 &&
      (s.elapsedSeconds - (s.lastContactedAt['marcus'] ?? 0)) > 300,
    characterId: 'marcus',
    channel: 'chat',
    message: "Hey — the team's starting to ask about Q3 scope. Do you have a draft plan I can share with them? They're getting anxious and I'd rather give them something concrete than let speculation run.",
  },
  {
    id: 'tom_acme_pressure',
    trigger: (s) =>
      !s.firedCascades.includes('tom_acme_pressure') &&
      s.elapsedSeconds > 420,
    characterId: 'tom',
    channel: 'email',
    subject: 'Acme — Need update ASAP',
    message: "Michael at Acme just pinged me asking for confirmation that SSO is in Q3. I need something concrete I can forward — even a one-liner from you that confirms we're on track. I cannot leave this unanswered past EOD.",
  },
  {
    id: 'elena_follow_up',
    trigger: (s) =>
      !s.firedCascades.includes('elena_follow_up') &&
      s.elapsedSeconds > 600 &&
      !(s.lastContactedAt['elena']),
    characterId: 'elena',
    channel: 'email',
    subject: 'RE: Q3 Roadmap — Status?',
    message: "Haven't heard from you yet. Board is Monday. I need a draft recommendation by Friday EOD — even a rough outline so I can pressure-test it before the meeting. What's your current read on the path forward?",
  },
];

// ─── Chaos Event Pool (Tier 1, 2, and additional Tier 3) ─────────────────────
export interface ChaosEventDef {
  id: string;
  tier: 1 | 2 | 3;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  type: string;
  minElapsed: number; // seconds before this can fire
}

export const CHAOS_EVENT_POOL: ChaosEventDef[] = [
  {
    id: 'standup_alert',
    tier: 1,
    severity: 'low',
    title: 'Standup Starts in 90 Seconds',
    description: 'The team standup is about to begin. Your video is connected. You can join or skip — skipping may signal to the team that you\'re heads-down on the roadmap.',
    type: 'calendar_interrupt',
    minElapsed: 120,
  },
  {
    id: 'design_sprint_blocked',
    tier: 2,
    severity: 'medium',
    title: 'Design Sprint Blocked',
    description: "Priya's design sprint has been blocked — Engineering hasn't confirmed capacity. NPS is now at risk for the quarter if this slips another week. She's waiting on a capacity confirmation from Marcus.",
    type: 'team_blocker',
    minElapsed: 200,
  },
  {
    id: 'acuity_demo_request',
    tier: 2,
    severity: 'high',
    title: 'Competitive Alert: Acuity',
    description: "Tom just forwarded you an email: Acuity has requested a demo with Acme's CTO next Thursday. If you don't respond with a roadmap commitment today, Acme will attend the Acuity demo with no counter-offer from Nexus.",
    type: 'competitive_threat',
    minElapsed: 360,
  },
  {
    id: 'board_member_dm',
    tier: 2,
    severity: 'high',
    title: 'Board Member Escalation',
    description: "James Whitfield (Sequoia) emailed Elena asking for a direct SSO status update. She forwarded it to you: 'Can you draft me three bullets on where this stands? I need to reply to James before end of day.'",
    type: 'exec_escalation',
    minElapsed: 480,
  },
  {
    id: 'roadmap_leak',
    tier: 3,
    severity: 'critical',
    title: 'URGENT: Roadmap Leak',
    description: "Tom accidentally CC'd Acme's procurement team on an internal roadmap thread. They've seen an unconfirmed feature list with Q3 dates. You have approximately 20 minutes before this surfaces in their next vendor review.",
    type: 'data_breach',
    minElapsed: 500,
  },
];

// ─── Difficulty Config ────────────────────────────────────────────────────────
export const DIFFICULTY_CONFIG: Record<DifficultyLevel, {
  chaosChance: number;
  chaosAfterSeconds: number;
  cascadeDelayMultiplier: number;
  trustDeltaBoost: number;
  maxChaosEvents: number;
}> = {
  guided: {
    chaosChance: 0.06,
    chaosAfterSeconds: 480,
    cascadeDelayMultiplier: 1.8,
    trustDeltaBoost: 0.03,
    maxChaosEvents: 1,
  },
  standard: {
    chaosChance: 0.15,
    chaosAfterSeconds: 300,
    cascadeDelayMultiplier: 1.0,
    trustDeltaBoost: 0,
    maxChaosEvents: 2,
  },
  pressure: {
    chaosChance: 0.25,
    chaosAfterSeconds: 180,
    cascadeDelayMultiplier: 0.6,
    trustDeltaBoost: -0.03,
    maxChaosEvents: 4,
  },
};

// ─── Fly on the Wall Prologue Messages ───────────────────────────────────────
export const PROLOGUE_MESSAGES: { from: string; delay: number; text: string }[] = [
  { from: 'elena',  delay: 0,     text: "Good morning everyone. I'm bringing in a new PM to own the Q3 roadmap. They start today." },
  { from: 'sarah',  delay: 2800,  text: "Do they know about the SSO situation? There's quite a bit of context they'll need before touching anything." },
  { from: 'elena',  delay: 5500,  text: "I'll brief them. The important thing is we move fast. Board is Monday." },
  { from: 'marcus', delay: 7800,  text: "Fast is relative. Engineering is already stretched thin. I want that on record before we make any new commitments." },
  { from: 'tom',    delay: 10200, text: "We have a $2M deal contingent on Q3 delivery. I just want everyone to understand what's at stake here." },
  { from: 'marcus', delay: 12800, text: "I know, Tom. I'm stating facts, not arguing." },
  { from: 'priya',  delay: 15500, text: "I have research that's directly relevant to this conversation. Nobody's asked for it yet." },
  { from: 'sarah',  delay: 18200, text: "Priya — flag it to the new PM when they're in. They should see it." },
  { from: 'elena',  delay: 20800, text: "Let's align once they're up to speed. I have a board prep call at 9." },
  { from: 'sarah',  delay: 23500, text: "..." },
];

// ─── Lateral Character Trust (for relationship web) ──────────────────────────
export const LATERAL_TRUST: { from: string; to: string; trust: number; label: string }[] = [
  { from: 'sarah',  to: 'marcus', trust: 0.72, label: 'collegial' },
  { from: 'tom',    to: 'elena',  trust: 0.81, label: 'aligned' },
  { from: 'sarah',  to: 'elena',  trust: 0.45, label: 'strained' },
  { from: 'marcus', to: 'tom',    trust: 0.38, label: 'frustrated' },
  { from: 'priya',  to: 'sarah',  trust: 0.74, label: 'allied' },
  { from: 'priya',  to: 'marcus', trust: 0.65, label: 'collaborative' },
  { from: 'tom',    to: 'marcus', trust: 0.42, label: 'tense' },
];

// ─── Session Benchmarks & Leaderboard ────────────────────────────────────────
export const SESSION_BENCHMARKS = {
  avgTrust: 0.63,
  avgOkrCompletion: 0.52,
  avgSecretsUnlocked: 1.2,
  topPercentileLabel: (trust: number) => {
    if (trust >= 0.82) return 'Top 5%';
    if (trust >= 0.75) return 'Top 15%';
    if (trust >= 0.68) return 'Top 30%';
    if (trust >= 0.60) return 'Top 50%';
    return 'Below average';
  },
};

export const MOCK_LEADERBOARD = [
  { rank: 1, initials: 'A.K.', role: 'Sr. PM · Google',        avgTrust: 0.88, secrets: 4, score: 91 },
  { rank: 2, initials: 'M.O.', role: 'PM · Stripe',            avgTrust: 0.84, secrets: 4, score: 87 },
  { rank: 3, initials: 'S.R.', role: 'Product Lead · Figma',   avgTrust: 0.82, secrets: 3, score: 85 },
  { rank: 4, initials: 'J.W.', role: 'PM II · Atlassian',      avgTrust: 0.79, secrets: 3, score: 82 },
  { rank: 5, initials: 'P.C.', role: 'Associate PM · Airbnb',  avgTrust: 0.77, secrets: 3, score: 80 },
  { rank: 6, initials: 'T.A.', role: 'PM · Notion',            avgTrust: 0.75, secrets: 2, score: 77 },
  { rank: 7, initials: 'L.B.', role: 'Sr. PM · HubSpot',       avgTrust: 0.73, secrets: 2, score: 74 },
  { rank: 8, initials: 'R.N.', role: 'PM · Linear',            avgTrust: 0.71, secrets: 2, score: 72 },
  { rank: 9, initials: 'C.H.', role: 'Associate PM · Vercel',  avgTrust: 0.68, secrets: 1, score: 69 },
  { rank: 10, initials: 'D.L.', role: 'PM · Intercom',         avgTrust: 0.65, secrets: 1, score: 65 },
];

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

// ═══════════════════════════════════════════════════════════════════════════════
// CRESTLINE ADVISORY — "The Client Rescue"
// ═══════════════════════════════════════════════════════════════════════════════

const CRESTLINE_COMPANY: SimCompany = {
  id: 'crestline-advisory',
  name: 'Crestline Advisory',
  industry: 'Strategy Consulting',
  size: '180 people, independent partnership',
  tagline: 'Advising boards on the decisions that matter.',
  challenge: "You've been parachuted in as the new Engagement Manager three months into a struggling transformation programme for Blackford Retail (£4.2M retainer). The original EM departed two weeks ago. The client's COO is losing confidence. Your final client board presentation is Friday. A competitor is pitching to replace the firm on Monday.",
  why: 'Your background in strategy and stakeholder management makes you the right person to rescue a complex, politically charged engagement.',
  videoKeyword: 'strategy consulting boardroom',
};

const CRESTLINE_CHARACTERS: Character[] = [
  {
    id: 'james',
    name: 'James Okafor',
    title: 'Managing Partner',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    color: '#6366f1',
    personality: 'Politically astute and decisive in public, deeply risk-averse underneath. Has built Crestline\'s reputation on discretion — he is more focused on how a failure lands than on preventing it. He will back you publicly if you move with confidence, but privately he hedges. Has not disclosed that another Crestline practice is advising Meridian Retail, Blackford\'s direct competitor. He considers it a separate practice matter. Legally, that view is debatable.',
    visibleAgenda: 'Protect the Crestline brand and the Blackford relationship at all costs. Get to Friday\'s presentation without a client blowup. Manage upward to the partnership if things go sideways.',
    trust: 0.58,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'lucy',
    name: 'Lucy Winters',
    title: 'Senior Consultant',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    color: '#ec4899',
    personality: 'Exceptional analyst with a perfectionist streak that tips into avoidance under pressure. She found a critical error in the market sizing model three days ago — the TAM figure is inflated by approximately 40% due to double-counting indirect market participants in the Euromonitor data, compounded by using pre-COVID 2019 ONS baseline figures. She has been quietly trying to remodel rather than surface it because she is afraid of how it will land with James. Felix noted it in the appendix. She will share everything if asked directly and treated as a decision-making partner rather than an executor.',
    visibleAgenda: 'Finalise and validate the analysis before Friday. She will not present something she knows is wrong. She needs someone to give her permission to raise the model issue directly.',
    trust: 0.70,
    emotion: 'neutral',
    online: true,
  },
  {
    id: 'raj',
    name: 'Raj Mehta',
    title: 'Client Partner',
    avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
    color: '#f59e0b',
    personality: 'Warm relationship manager who has kept Blackford positive through charm and optimistic framing for two years. Has been papering over the engagement\'s gaps rather than escalating. Critical omission: Diana called him directly yesterday and said she had already had a preliminary conversation with McKinsey and was "keeping her options open." He told her the new EM would be excellent. He has not told the team about the McKinsey call because he is hoping a strong week makes it irrelevant. He believes the relationship can be saved if the week goes well.',
    visibleAgenda: 'Keep Diana positive through Friday. He cannot afford for the McKinsey conversation to surface before Friday — he wants to make it irrelevant with a strong delivery.',
    trust: 0.65,
    emotion: 'cooperative',
    online: true,
  },
  {
    id: 'diana',
    name: 'Diana Strauss',
    title: 'COO, Blackford Retail',
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    color: '#ef4444',
    personality: 'Impatient, data-driven executive who has been burned by strategy consultants before. Has already told Raj she is in conversation with McKinsey. The fundamental misalignment: she does not want a 150-page strategy document — she wants Crestline to co-own and support implementation. That is exactly what McKinsey offered. Nobody from Crestline has asked her directly what she wants from the engagement. She will respond constructively if someone asks directly and presents a concrete implementation model. She has a specific concern: the TAM number in the current framework does not match her internal market research, but she has not raised it yet.',
    visibleAgenda: 'Get something she can take to the Blackford board on Friday that demonstrates real strategic progress. She wants a vendor who is accountable for outcomes, not just recommendations. A commitment on post-delivery support would change the conversation entirely.',
    trust: 0.45,
    emotion: 'frustrated',
    online: false,
  },
  {
    id: 'felix',
    name: 'Felix Chen',
    title: 'Analyst',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    color: '#10b981',
    personality: 'Eager, sharp, and slightly intimidated by the seniority around him. Has done excellent original research: found ONS and Euromonitor primary data that invalidates the TAM assumption in the current model. He noted it in the appendix as "a point for review" rather than flagging it directly because it felt above his pay grade to challenge the model. He is waiting for someone to engage him seriously. He will share the full dataset the moment anyone asks him directly. He joined Crestline eight months ago from a research role and is still finding his voice — he wants to contribute but does not know how to raise the issue without undermining Lucy.',
    visibleAgenda: 'Do excellent work and be taken seriously. He wants to flag the market data finding but needs explicit permission or a direct question to do it.',
    trust: 0.55,
    emotion: 'neutral',
    online: true,
  },
];

const CRESTLINE_INITIAL_OKRS: OKR[] = [
  { id: 'c_okr1', title: 'Align the team on a single final narrative before Thursday 5pm', status: 'in_progress', progress: 20 },
  { id: 'c_okr2', title: 'Validate the market sizing with current data before the client presentation', status: 'pending', progress: 0 },
  { id: 'c_okr3', title: 'Understand what Blackford actually wants from this engagement (deliverable vs. implementation)', status: 'pending', progress: 0 },
  { id: 'c_okr4', title: 'Stress-test the recommendation against McKinsey\'s likely counter-frame', status: 'pending', progress: 0 },
  { id: 'c_okr5', title: 'Secure James\'s active endorsement before the client board presentation', status: 'pending', progress: 0 },
];

const CRESTLINE_INITIAL_MESSAGES: Message[] = [
  {
    id: 'cm-001',
    from: 'james',
    to: 'user',
    channel: 'email',
    subject: 'Your briefing — take command immediately',
    body: `Welcome aboard. The situation is straightforward: we have a client board presentation on Friday, a team that has been under-managed for three weeks, and a competitor circling. Your job is to own this engagement from today and deliver something Blackford can take to their board.

The team is competent — Lucy's analysis is strong in places and Felix is diligent. Raj has the relationship. What this engagement has lacked is leadership from the EM seat. That is what you are here to provide.

A few expectations: I want a daily status from you. I want to be the first person to hear about any material problems — not the last. And I want to walk into Friday's presentation with confidence, not surprises.

The client's COO is Diana Strauss. She is direct and impatient. Manage her proactively. Do not let her come to us — we go to her.

Get up to speed with the team today. I am available if you need me.

— James`,
    timestamp: new Date(Date.now() - 5400000),
    read: false,
  },
  {
    id: 'cm-002',
    from: 'lucy',
    to: 'user',
    channel: 'email',
    subject: 'Engagement status — where the analysis stands',
    body: `Hi — I wanted to get you up to speed before we connect.

The core strategic framework is in good shape. We have mapped the three transformation pathways, built the financial model for each scenario, and done the stakeholder analysis. The executive summary is mostly drafted but needs a final pass before it goes to the client.

There is one area I am still working through: the market sizing workbook. There are some data source questions I am trying to resolve before Friday. Felix flagged something in the appendix that I am in the process of validating. I will come back to you on this once I have a clearer view — I do not want to raise it until I understand the impact fully.

Everything else is on track. I will send you the current deck and model by end of day. Let me know when you want to walk through it.

— Lucy`,
    timestamp: new Date(Date.now() - 4200000),
    read: false,
  },
  {
    id: 'cm-003',
    from: 'raj',
    to: 'user',
    channel: 'email',
    subject: 'Welcome — a few things on the client side',
    body: `Really glad you are here. The team will benefit from strong EM leadership and I think this week can go well.

On the client side: Diana Strauss is engaged and focused on Friday. She has been patient with us through the transition and I think she appreciates that we moved quickly to put someone senior in the seat. I would recommend reaching out to her today — even a brief note to introduce yourself and confirm the Friday timeline will help.

The relationship is in a good place. Diana and I have a strong working rapport from two years on this account. I will be on all client touchpoints with you this week, so we can align on messaging before anything goes to her.

Let's find 30 minutes today to sync. I can give you the full context on where things stand with Blackford.

— Raj`,
    timestamp: new Date(Date.now() - 3000000),
    read: false,
  },
  {
    id: 'cm-004',
    from: 'diana',
    to: 'user',
    channel: 'email',
    subject: 'Friday presentation — I need to be direct with you',
    body: `I understand you are the new Engagement Manager. I appreciate Crestline moving quickly on the transition.

I want to be honest about where I stand: three months into this engagement, I expected to have a recommendation I could defend to my board. What I have instead is a framework and a set of hypotheses. That is not what I contracted for.

The previous EM gave me confidence that we were building toward something concrete. The last three weeks have been unclear.

I need two things from Friday: a recommendation I can act on — not a set of options with caveats — and clarity on what happens after Friday. What does Crestline's role look like in the implementation phase? That is not something anyone has raised with me and it is something my board will ask.

I look forward to your introduction. Please come to me directly if there are any issues this week — I would rather hear about problems early than be surprised.

— Diana Strauss
COO, Blackford Retail`,
    timestamp: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: 'cm-005',
    from: 'felix',
    to: 'user',
    channel: 'email',
    subject: 'A few things I wanted to flag before we connect',
    body: `Hi — I am Felix Chen, Analyst on the Blackford engagement. I wanted to reach out before our team intro.

I have been doing the market research and data modelling alongside Lucy. There is one thing I flagged in the appendix of the market sizing workbook — a note on the data source for the TAM calculation. I used current ONS and Euromonitor primary data alongside what was in the model, and the numbers do not fully reconcile. I added it as a footnote because I was not sure how to raise it through the team, but I think it might be worth a conversation before Friday.

I do not want to overstep — Lucy is the lead on the analysis. But if it would be useful, I have the full dataset and can walk you through what I found.

I am also happy to help with anything else this week — research, modelling, prep. Just say the word.

— Felix`,
    timestamp: new Date(Date.now() - 1200000),
    read: false,
  },
];

const CRESTLINE_INITIAL_KANBAN: KanbanColumn[] = [
  {
    id: 'backlog', label: 'Backlog', color: '#6b7280',
    cards: [
      { id: 'ck1', title: 'Validate market sizing with ONS + Euromonitor primary data', tag: 'Research', assignee: 'F', priority: 'high', notes: '', linkedOkr: 'c_okr2' },
      { id: 'ck2', title: 'Clarify Blackford\'s implementation expectations', tag: 'Client', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'c_okr3' },
      { id: 'ck3', title: 'Competitive counter-brief — McKinsey likely frame', tag: 'Strategy', assignee: 'L', priority: 'med', notes: '', linkedOkr: 'c_okr4' },
      { id: 'ck4', title: 'Draft implementation support offer for Blackford', tag: 'Client', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'c_okr3' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: '#49a5de',
    cards: [
      { id: 'ck5', title: 'Final narrative alignment — team workshop', tag: 'Strategy', assignee: 'L', priority: 'high', notes: '', linkedOkr: 'c_okr1' },
      { id: 'ck6', title: 'Executive summary — final draft', tag: 'Strategy', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'c_okr1' },
      { id: 'ck7', title: 'James pre-brief — secure partnership backing', tag: 'Internal', assignee: 'Y', priority: 'high', notes: '', linkedOkr: 'c_okr5' },
    ],
  },
  {
    id: 'review', label: 'Review', color: '#deaf49',
    cards: [
      { id: 'ck8', title: 'Strategic options framework v3', tag: 'Strategy', assignee: 'L', priority: 'high', notes: '', linkedOkr: 'c_okr1' },
      { id: 'ck9', title: 'Market sizing workbook', tag: 'Research', assignee: 'F', priority: 'high', notes: '', linkedOkr: 'c_okr2' },
    ],
  },
  {
    id: 'done', label: 'Done', color: '#02ba67',
    cards: [
      { id: 'ck10', title: 'Client stakeholder interview schedule', tag: 'Client', assignee: 'R', priority: 'med', notes: '' },
      { id: 'ck11', title: 'Initial engagement scoping document', tag: 'Process', assignee: 'Y', priority: 'low', notes: '' },
    ],
  },
];

const CRESTLINE_PROLOGUE: { from: string; delay: number; text: string }[] = [
  { from: 'felix', delay: 0,     text: 'Hey — the ONS data I flagged in the appendix. Did anyone look at those figures? The 2019 baseline changes the TAM number quite materially.' },
  { from: 'lucy',  delay: 3200,  text: 'I saw it. I am working through the implications. Do not raise it in the team meeting today — I want to understand the full impact before we say anything.' },
  { from: 'raj',   delay: 6500,  text: 'Morning James. Diana check-in went okay yesterday. She is antsy but I told her the new EM arrives today and will hit the ground running.' },
  { from: 'james', delay: 9200,  text: 'Good. Brief them thoroughly. I need them fully across the engagement by end of business. We cannot afford another slow week.' },
  { from: 'felix', delay: 12800, text: 'Should I pull together a data summary? I have everything ready to go if someone wants to review it.' },
  { from: 'lucy',  delay: 15500, text: 'Hold off for now, Felix. Let the new EM find their feet first.' },
  { from: 'raj',   delay: 18200, text: 'Diana asked again about implementation support. I said we would address it in Friday\'s presentation.' },
  { from: 'james', delay: 21000, text: '...' },
];

const CRESTLINE_CASCADE_EVENTS = [
  {
    id: 'lucy_model_flag',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('lucy_model_flag') &&
      s.elapsedSeconds > 90 &&
      (s.elapsedSeconds - (s.lastContactedAt['lucy'] ?? 0)) > 240,
    characterId: 'lucy',
    channel: 'email' as const,
    subject: 'RE: Market sizing — I need 10 minutes before we finalise',
    message: 'Before we lock the deck I need 10 minutes with you on the market sizing. There is a data question I have been trying to resolve quietly that I think we need to address before Friday. I did not want to raise it in a group setting — can we find time this afternoon?',
  },
  {
    id: 'raj_diana_pressure',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('raj_diana_pressure') &&
      s.elapsedSeconds > 360 &&
      !(s.lastContactedAt['diana']),
    characterId: 'raj',
    channel: 'email' as const,
    subject: 'FWD: Diana — Following up',
    message: 'Just flagging — Diana just sent me a follow-up asking whether the new EM has been in touch. She is clearly tracking this. I would recommend a brief note from you to her today, even just to confirm you are across the engagement and confirm Friday. I will hold on my end but she is expecting to hear from you.',
  },
  {
    id: 'felix_appendix_escalation',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('felix_appendix_escalation') &&
      s.elapsedSeconds > 480 &&
      !(s.lastContactedAt['felix']),
    characterId: 'felix',
    channel: 'chat' as const,
    message: 'Hi — just checking if you had a chance to look at the appendix note on the market data. I think it might be more significant than I initially flagged. The TAM delta is somewhere in the 35–45% range depending on which baseline figures you use. I am happy to walk through it if it helps.',
  },
  {
    id: 'james_status_check',
    trigger: (s: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) =>
      !s.firedCascades.includes('james_status_check') &&
      s.elapsedSeconds > 600 &&
      !(s.lastContactedAt['james']),
    characterId: 'james',
    channel: 'chat' as const,
    message: 'Status check — where are we? I need to know if there are any issues before I brief the partnership tomorrow morning.',
  },
];

const CRESTLINE_SECRETS: Record<string, { threshold: number; secretId: string; message: string }[]> = {
  lucy: [
    { threshold: 0.76, secretId: 'lucy_tam_error', message: "I need to tell you something before you see the deck. The TAM figure is wrong. I found the error three days ago — Euromonitor's 2019 dataset double-counts indirect channel participants, and we carried that forward. When I rebase to current ONS primary data, the addressable market is roughly 38% smaller than the model shows. I have a corrected version ready. I did not surface it because I was afraid of what James would say and I thought I could quietly fix it before Friday. I cannot. You need to know." },
  ],
  raj: [
    { threshold: 0.72, secretId: 'raj_mckinsey', message: "There is something I should have told you on day one. Diana called me directly two days ago — not about the engagement, about options. She said she has had a 'preliminary conversation' with McKinsey and is 'keeping her options open.' She was not hostile about it — she was matter of fact. I told her the new EM would be excellent. I have been hoping a strong week makes it irrelevant. But if Friday does not land, she has a fallback ready. You needed to know this." },
  ],
  diana: [
    { threshold: 0.70, secretId: 'diana_implementation', message: "Since you are asking me directly — what I actually want is not a 150-page strategy document. I can hire people to write those. What I want is a firm that stays in the room during implementation and is accountable for what they recommend. McKinsey offered a six-month implementation support retainer alongside the strategy delivery. Nobody from Crestline has ever asked me what I want from this engagement after Friday. You are the first person to ask. That matters." },
  ],
  james: [
    { threshold: 0.82, secretId: 'james_conflict', message: "There is something I need you to know, and I need this to stay between us for now. Our restructuring practice is advising Meridian Retail — Blackford's direct competitor. It has been ring-fenced as a separate engagement and I judged it as a different practice matter. I now think that judgement may need to be revisited. I have not disclosed this to Blackford. I am taking advice on the right course. Do not raise it with Diana or Raj until I have spoken to general counsel. I am telling you because you need the full picture." },
  ],
  felix: [
    { threshold: 0.62, secretId: 'felix_data_full', message: "I have the full dataset if you want it. ONS RDSA retail series 2023, Euromonitor's 2023 GB retail market report (the licensed version, not the public summary), and the Blackford internal market share data from the due diligence files. When I rebase the model with 2023 figures and remove the double-counted indirect participants, the core market is £8.2bn, not the £13.7bn in the current model. I can have a corrected market sizing workbook ready in three hours. I just needed someone to ask." },
  ],
};

const CRESTLINE_CONSTRAINT_PATTERNS: Record<string, Array<{ keywords: string[]; constraint: string }>> = {
  lucy: [{ keywords: ['tam', 'double-count', '38%', 'euromonitor', '2019 baseline', 'model error'], constraint: 'lucy_model_error' }],
  raj: [{ keywords: ['mckinsey', 'keeping her options', 'preliminary conversation', 'alternative'], constraint: 'diana_mckinsey' }],
  diana: [{ keywords: ['implementation', 'after friday', 'accountable', 'in the room', 'retainer'], constraint: 'diana_wants_implementation' }],
  james: [{ keywords: ['conflict', 'meridian', 'ring-fenced', 'separate practice', 'general counsel'], constraint: 'crestline_conflict' }],
  felix: [{ keywords: ['8.2bn', '13.7bn', 'ons rdsa', 'primary data', '2023', 'rebase'], constraint: 'felix_corrected_data' }],
};

const CRESTLINE_CONSTRAINT_LABELS: Record<string, string> = {
  lucy_model_error: 'TAM model error identified',
  diana_mckinsey: 'McKinsey conversation surfaced',
  diana_wants_implementation: 'Client\'s real ask revealed',
  crestline_conflict: 'Conflict of interest disclosed',
  felix_corrected_data: 'Corrected market data unlocked',
};

const CRESTLINE_REPLY_MAP: Record<string, string[]> = {
  james: [
    "I need this resolved before Friday. Whatever it takes — own it.",
    "If there are problems, I need to hear them from you first, not from Diana.",
    "The team is capable. What they have lacked is leadership from the EM seat. That is your job now.",
    "Bring me a status today. Not a holding message — a status.",
    "I want to walk into Friday's presentation with confidence. That means no surprises between now and then.",
    "If you need resources from the partnership, ask. Do not let this fail because you were reluctant to escalate.",
    "Diana is patient but not infinitely so. She needs to see momentum from this week.",
    "One recommendation. Not a menu of options. That is what she contracted for and what she will expect Friday.",
    "I need this engagement to be a reference case, not a cautionary tale. Act accordingly.",
    "The relationship with Blackford has taken years to build. Do not let it unravel in a week.",
  ],
  lucy: [
    "The strategic framework is sound. My concern is making sure the supporting data holds up under client scrutiny.",
    "I have a draft of the executive summary ready. I want to walk you through it before it goes anywhere.",
    "The three scenario pathways are differentiated clearly — that is the strongest part of what we have built.",
    "I need more time on the market sizing. There are source questions I am still working through.",
    "I can have the corrected deck ready by tomorrow morning if we align on the narrative today.",
    "Felix's work has been solid. He flagged something in the appendix that I think we need to address before Friday.",
    "I want to be transparent: there is a data issue in the model that I have been trying to resolve quietly. I need to brief you properly on it.",
    "The recommendation is defensible if the market sizing holds. That is the variable I am least comfortable with right now.",
    "I do not want to present something I know has a flaw in it. I need clarity on whether we fix it or we caveat it.",
    "Whatever you decide on the market data, I can work with it — I just need a decision before I finalise the deck.",
  ],
  raj: [
    "The relationship with Diana is solid. She is impatient but she trusts the firm.",
    "I would recommend reaching out to Diana today — even a brief note to confirm Friday. She is expecting to hear from you.",
    "Let me know before anything goes to Diana. I want to make sure the tone is right for where the relationship is.",
    "The previous EM had a good rapport with her. We can rebuild that this week if we move proactively.",
    "Diana responds well to directness. Do not manage around the issues — address them head on.",
    "I can set up a call with Diana today if that would help. She is available this afternoon.",
    "The board presentation needs to feel like a conversation, not a lecture. Diana will engage if the narrative is compelling.",
    "Keep James informed but do not loop him into every client interaction — he can overwhelm the relationship if he gets too close.",
    "I have two years of context on this account. Use me. I know what Diana responds to and what she does not.",
    "The engagement can be saved. The relationship is strained but not broken. Friday is the moment to reset it.",
  ],
  diana: [
    "I need a recommendation I can defend to my board. Not a framework. Not options. A recommendation.",
    "What happens after Friday? That is the question nobody has answered and the one my board will ask immediately.",
    "Three months is a long time. I expected more concrete progress at this stage.",
    "I appreciate directness. If there are problems with the engagement, I would rather hear about them from you than discover them on Friday.",
    "The market sizing in your current draft does not match my internal research. That is something we need to resolve before Friday.",
    "I am not opposed to Crestline. I contracted with the firm because I believed in the approach. What I need to see is follow-through.",
    "My board is sophisticated. They will interrogate the numbers. The recommendation needs to be bulletproof.",
    "If Crestline is serious about being a long-term partner, show me what that looks like concretely. That is the conversation I want to have.",
    "I need momentum this week. Not status updates — evidence that the programme is moving.",
    "Come to me with problems. I can work with honest challenges. What I cannot work with is being managed.",
  ],
  felix: [
    "I have all the data ready if you want to walk through it. Just say when.",
    "The appendix note was a bit buried — I was not sure how to raise it more directly without overstepping.",
    "I can have a revised market sizing workbook ready in a few hours if we need it.",
    "The Euromonitor 2023 licensed report has the current baseline figures. The public summary is out of date.",
    "I pulled ONS RDSA retail data through Q3 2023. It tells a different story to the 2019 figures in the current model.",
    "I want to be useful this week. If you need research, modelling, or fact-checking — I am on it.",
    "Lucy is the lead on the analysis and I do not want to undermine her. But I think the market data issue needs to be addressed before Friday.",
    "The numbers I have are defensible. I can walk through the methodology with you or with the client if needed.",
    "If the TAM figure is wrong, I would rather we correct it now than be challenged on it in front of Blackford's board.",
    "I joined eight months ago and this is the most complex engagement I have worked on. I want to do it justice.",
  ],
};

const CRESTLINE_CARD_REACTIONS: Record<string, {
  toInProgress: { high: string[]; mid: string[]; low: string[] };
  toReview: { high: string[]; mid: string[]; low: string[] };
  toDone: { natural: string[]; earlyClose: string[]; low: string[] };
  toBacklog: string[];
}> = {
  james: {
    toInProgress: {
      high: ["Good. What is the timeline? I need to know before I brief the partnership.", "Moving in the right direction. Keep me posted on any blockers.", "This is what I need to see — momentum. Update me by end of day."],
      mid: ["Fine. I need status by end of today regardless.", "Noted. Do not let this slip — the Friday timeline is not negotiable.", "Get it moving. I need to see output, not process."],
      low: ["Cards do not close engagements. What is the actual plan?", "I need results, not board updates. Talk to me directly.", "Moving tickets is not leadership. Come to me with a status."],
    },
    toReview: {
      high: ["At your end. I want to see it before it goes to Diana.", "In review — let me know what comes back. I want to sign off before Friday."],
      mid: ["Noted as in review. Make sure it is board-ready before it goes anywhere near the client.", "Review stage — I will need the output before Thursday EOD."],
      low: ["I will look at it when I can.", "Fine. Make sure it is actually ready."],
    },
    toDone: {
      natural: ["Good. Document the output somewhere I can reference it.", "Closed. What is next?"],
      earlyClose: ["Is this actually done? I want substance, not a closed ticket.", "This had better be genuinely complete before it goes to Done."],
      low: ["I need more than a closed card. What is the deliverable?", "That is not done until I say it is done."],
    },
    toBacklog: ["Why is this going backwards? Explain.", "Moving something to Backlog this week needs a justification — come to me."],
  },
  lucy: {
    toInProgress: {
      high: ["Good — I will have something for you to review by tomorrow morning.", "Picking it up. Do you want the full workbook or a summary version for the presentation?", "On it. Tell me the format you need and I will work to that."],
      mid: ["I can move on this but I need clarity on the narrative direction first.", "I will start — but the market data question needs to be resolved before I finalise anything.", "Working on it. I want a conversation on the data issue before this goes anywhere near the client."],
      low: ["I have been working on this. Moving the card does not change the state of the analysis.", "I will get to it — but please speak to me directly rather than adjusting the board.", "Fine. But I want to talk about the model before this is marked as done."],
    },
    toReview: {
      high: ["At your end. Read the methodology notes — the context matters for how you interpret the numbers.", "In review. I want to be in the room when this is presented to Diana — I can field technical questions."],
      mid: ["In review. Please do not strip out the caveats — they are there for a reason.", "Sent to review. If the TAM question comes up, flag it to me before you respond."],
      low: ["In review. Let me know what you do with it.", "It is there. I will follow up."],
    },
    toDone: {
      natural: ["Good. Let me know if any of the analysis needs unpacking before Friday.", "Closed. I am available if questions come back from the client side."],
      earlyClose: ["I have not finished the validation on this. Do not mark it done — the numbers are not confirmed.", "That is premature. The market data issue makes this incomplete until I say otherwise.", "Please do not close this without speaking to me first. There is outstanding work."],
      low: ["I am going to reopen that. It is not done from an analytical standpoint.", "That is not correct. There are open questions in the model that have not been resolved."],
    },
    toBacklog: ["Moving this back is fine but tell me why — it affects how I sequence the work.", "Noted. I will hold off. But this needs to come back up before Thursday."],
  },
  raj: {
    toInProgress: {
      high: ["Great — I can loop Diana in on the progress when we speak next.", "On it from the client side. Let me know what you need me to communicate to Blackford.", "Good call. I will make sure Diana knows things are moving."],
      mid: ["I can work on this but I need to know the client implications before I move.", "Working on it. Just flag to me anything that might affect the Diana relationship.", "Fine — but tell me before anything goes directly to the client."],
      low: ["I would prefer to be consulted before the client-facing items get moved.", "The client relationship needs managing carefully. Talk to me before you touch anything that affects Diana.", "I will pick it up — but the client side needs to stay coordinated."],
    },
    toReview: {
      high: ["At your end. I can review with the client lens — let me know when you want my read.", "In review. Whatever comes out needs to be something I can present to Diana with confidence."],
      mid: ["In review. Make sure the tone is right for where the client relationship is — Diana is impatient right now.", "Noted as in review. I want to see it before it goes anywhere near the client."],
      low: ["I will look at it.", "Noted. Come back to me before this goes to Diana."],
    },
    toDone: {
      natural: ["Good to have that wrapped up.", "Closed — I will update Diana accordingly."],
      earlyClose: ["This has not been signed off on the client side. Marking it done is premature.", "I am not comfortable closing this out without a client touchpoint. The relationship is too fragile right now."],
      low: ["That is not done from a client perspective. Reopen it.", "I would like to discuss before this gets closed."],
    },
    toBacklog: ["Moving this back affects the client timeline — talk to me before it goes backwards.", "Noted. I will manage Diana's expectations on this, but I need to know what to tell her."],
  },
  diana: {
    toInProgress: {
      high: ["This is the kind of progress I need to see.", "Good. What is the timeline? I need something concrete for my board.", "Finally some movement. Keep me updated directly."],
      mid: ["Is this actually moving forward? I need output, not process.", "Fine — but I want a date I can give to my board.", "I will believe it when I see the deliverable."],
      low: ["Moving cards does not change my board presentation.", "I am not interested in process. I want outcomes.", "Come back to me when there is something to show."],
    },
    toReview: {
      high: ["At your end — I want to see it before Friday.", "In review. If there is a recommendation in here, make sure it is clearly marked."],
      mid: ["In review. My board will not accept ambiguity. Make sure it is concrete.", "Noted. I need to see something substantive before Friday."],
      low: ["I will look at it when it is actually ready.", "Fine. Do not waste my time with drafts."],
    },
    toDone: {
      natural: ["Good. Is there a concrete recommendation attached to this?", "Closed. What does this mean for Friday?"],
      earlyClose: ["Is this actually resolved? My board will not accept an unfinished analysis.", "Closing something out does not mean the underlying question is answered."],
      low: ["I am going to need more than a closed ticket.", "That is not done from my perspective."],
    },
    toBacklog: ["Why is this going backwards? That is not acceptable given the Friday deadline.", "Deprioritising things is a risk I want on record."],
  },
  felix: {
    toInProgress: {
      high: ["On it. I can have this done faster than you think — just let me know the format you need.", "Picking it up. I have the data ready, I just need to know what level of detail you want.", "Great — I will get started immediately. I can update you by end of today."],
      mid: ["I will work on it. Should I loop in Lucy before I finalise anything?", "On it — tell me if the scope changes, I want to make sure I am doing the right version.", "Working on it. Let me know if you need a quicker turnaround and I will prioritise."],
      low: ["I will do it. Just let me know exactly what you need.", "Fine — I will get it done.", "On it."],
    },
    toReview: {
      high: ["At your end. I have detailed notes on the methodology if you want to walk through it.", "In review. I can be available for questions if the client wants to dig into the data."],
      mid: ["Sent to review. Let me know if anything needs more detail.", "In review. Happy to revise if the format is not right."],
      low: ["It is there.", "In review."],
    },
    toDone: {
      natural: ["Good to have it wrapped up. Let me know if anything else comes up.", "Closed. Happy to help with anything else."],
      earlyClose: ["I have not finished the validation on this yet. The numbers need one more pass.", "I would rather we left this open until I can confirm the figures are correct."],
      low: ["I can recheck this if needed.", "Fine — just let me know if something comes back."],
    },
    toBacklog: ["Okay — should I hold off on the research or keep it ready?", "Noted. I will keep the data ready in case it comes back up."],
  },
};

// ─── Nexus Technologies entry (wraps existing exports) ────────────────────────
const NEXUS_COMPANY: SimCompany = {
  id: 'nexus-technologies',
  name: 'Nexus Technologies',
  industry: 'B2B SaaS',
  size: '300 people, Series C',
  tagline: 'The operating system for enterprise workflow.',
  challenge: 'You have inherited a three-way roadmap conflict between Engineering, Sales, and Product with a hard Monday board deadline. SSO and audit logging are non-negotiable for the enterprise segment — but nobody agrees on whether they are deliverable in Q3.',
  why: 'Your product and stakeholder management background is a direct fit for this complex, high-stakes B2B environment.',
  videoKeyword: 'modern tech office',
};

export const COMPANY_CATALOG: Record<string, CompanyCatalogEntry> = {
  'nexus-technologies': {
    company: NEXUS_COMPANY,
    characters: CHARACTERS,
    initialMessages: INITIAL_MESSAGES,
    initialOKRs: INITIAL_OKRS,
    initialKanban: INITIAL_KANBAN_COLUMNS,
    prologueMessages: PROLOGUE_MESSAGES,
    cascadeEvents: CASCADE_EVENTS,
    characterSecrets: CHARACTER_SECRETS as unknown as Record<string, { threshold: number; secretId: string; message: string }[]>,
    cardReactionMap: CARD_REACTION_MAP as unknown as Record<string, { toInProgress: { high: string[]; mid: string[]; low: string[] }; toReview: { high: string[]; mid: string[]; low: string[] }; toDone: { natural: string[]; earlyClose: string[]; low: string[] }; toBacklog: string[] }>,
    replyMap: REPLY_MAP,
    constraintPatterns: {
      marcus: [{ keywords: ['workos', 'third-party', '2 weeks', 'two weeks', 'vendor'], constraint: 'workos' }],
      elena: [{ keywords: ['clawback', 'october 1', 'covenant', 'milestone clause'], constraint: 'clawback' }],
      tom: [
        { keywords: ['best efforts', 'best-efforts', 'not a hard'], constraint: 'best_efforts' },
        { keywords: ['meridian'], constraint: 'meridian' },
      ],
      priya: [{ keywords: ['conversion', 'trial-to-paid', 'exit survey', 'funnel drop'], constraint: 'priya_research' }],
      sarah: [{ keywords: ['whitfield', 'james whitfield', 'sequoia', 'series c lead'], constraint: 'sarah_context' }],
    },
    constraintLabels: {
      workos: 'WorkOS shortcut identified',
      clawback: '$3M clawback clause revealed',
      best_efforts: 'Acme commitment clarified',
      meridian: 'Meridian deal surfaced',
      priya_research: 'Conversion research unlocked',
      sarah_context: 'Investor SSO context revealed',
    },
  },
  'crestline-advisory': {
    company: CRESTLINE_COMPANY,
    characters: CRESTLINE_CHARACTERS,
    initialMessages: CRESTLINE_INITIAL_MESSAGES,
    initialOKRs: CRESTLINE_INITIAL_OKRS,
    initialKanban: CRESTLINE_INITIAL_KANBAN,
    prologueMessages: CRESTLINE_PROLOGUE,
    cascadeEvents: CRESTLINE_CASCADE_EVENTS,
    characterSecrets: CRESTLINE_SECRETS,
    cardReactionMap: CRESTLINE_CARD_REACTIONS,
    replyMap: CRESTLINE_REPLY_MAP,
    constraintPatterns: CRESTLINE_CONSTRAINT_PATTERNS,
    constraintLabels: CRESTLINE_CONSTRAINT_LABELS,
  },
};
