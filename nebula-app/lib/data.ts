import { Character, SessionState, Message, OKR } from './types';

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
