import { create } from 'zustand';
import { Character, CharacterId, Message, SessionState, Screen, AppTab, BrowserTab, ChaosEvent, OKR, PortfolioCaseStudy, AccessibilityPrefs, SimulationStage, KanbanCard, KanbanColumn } from './types';
import { CHARACTERS, INITIAL_SESSION, INITIAL_MESSAGES, INITIAL_OKRS, REPLY_MAP, INITIAL_KANBAN_COLUMNS } from './data';
import { getSoundscape } from './soundscape';

export interface MinimizedWindow {
  screen: Screen;
  label: string;
  accentColor: string;
}

interface AppStore {
  // Navigation
  screen: Screen;
  activeApp: AppTab;
  activeBrowserTab: BrowserTab;
  minimizedWindows: MinimizedWindow[];
  setScreen: (s: Screen) => void;
  setActiveApp: (a: AppTab) => void;
  setActiveBrowserTab: (t: BrowserTab) => void;
  minimizeWindow: (w: MinimizedWindow) => void;
  restoreWindow: (screen: Screen) => void;

  // Auth
  user: { name: string; email: string; credits: number } | null;
  setUser: (u: AppStore['user']) => void;

  // Simulation
  session: SessionState | null;
  characters: Character[];
  messages: Message[];
  activeCharacter: Character | null;
  chatInput: string;
  chaosOverlay: ChaosEvent | null;

  // Control Panel popover
  controlPanelOpen: boolean;
  setControlPanelOpen: (open: boolean) => void;

  // Accessibility
  accessibilityPrefs: AccessibilityPrefs;
  setAccessibilityPrefs: (prefs: Partial<AccessibilityPrefs>) => void;

  startSession: () => void;
  sendMessage: (body: string, channel: 'email' | 'chat', subject?: string) => void;
  setActiveCharacter: (c: Character | null) => void;
  setChatInput: (v: string) => void;
  acknowledgeChaos: () => void;
  markRead: (messageId: string) => void;
  tickSession: () => void;
  trustToast: { characterId: string; name: string; delta: number; newTrust: number } | null;
  setTrustToast: (t: AppStore['trustToast']) => void;
  updateOKR: (id: string, progress: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  receiveReply: (characterId: string, body: string, trustDelta: number) => void;
  completeSession: () => void;
  advanceToExecution: (planScore: number, planFeedback: string) => void;
  advanceToReporting: () => void;

  // Kanban board (shared state so simulation can update it)
  kanbanColumns: KanbanColumn[];
  cardAdvanceCooldowns: Partial<Record<CharacterId, number>>;
  moveKanbanCard: (cardId: string, toColId: string) => void;
  injectMessage: (characterId: CharacterId, body: string, channel: 'chat' | 'email') => void;
  onUserMoveCard: (card: KanbanCard, toColId: string) => void;

  // Onboarding
  onboardingStep: number;
  assessmentAnswers: number[];
  setOnboardingStep: (n: number) => void;
  setAssessmentAnswer: (i: number, v: number) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  screen: 'login',
  activeApp: 'browser',
  activeBrowserTab: 'email',
  minimizedWindows: [],
  setScreen: (screen) => set({ screen }),
  setActiveApp: (activeApp) => set({ activeApp }),
  setActiveBrowserTab: (activeBrowserTab) => set({ activeBrowserTab }),
  minimizeWindow: (w) => set(s => ({
    minimizedWindows: s.minimizedWindows.some(m => m.screen === w.screen)
      ? s.minimizedWindows
      : [...s.minimizedWindows, w],
    screen: 'desktop',
  })),
  restoreWindow: (screen) => set(s => ({
    minimizedWindows: s.minimizedWindows.filter(m => m.screen !== screen),
    screen,
  })),

  user: null,
  setUser: (user) => set({ user }),

  session: null,
  characters: CHARACTERS,
  messages: [],
  activeCharacter: null,
  chatInput: '',
  chaosOverlay: null,

  controlPanelOpen: false,
  setControlPanelOpen: (open) => set({ controlPanelOpen: open }),

  accessibilityPrefs: { reduceVisualEffects: false, muteSounds: false },
  setAccessibilityPrefs: (prefs) => set(s => ({
    accessibilityPrefs: { ...s.accessibilityPrefs, ...prefs },
  })),

  startSession: () => {
    set({
      session: { ...INITIAL_SESSION, startedAt: new Date(), chaosTier: null, chaosResolving: false, portfolio: null },
      messages: INITIAL_MESSAGES,
      characters: CHARACTERS,
    });
    // Init soundscape on session start (will actually unlock on first user interaction)
    getSoundscape().init().catch(() => {});
  },

  sendMessage: (body, channel, subject) => {
    const { activeCharacter, messages } = get();
    if (!activeCharacter) return;
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      from: 'user',
      to: activeCharacter.id,
      channel,
      subject,
      body,
      timestamp: new Date(),
      read: true,
    };
    set({ messages: [...messages, msg] });

    // Simulate AI reply
    setTimeout(() => {
      const replies = REPLY_MAP[activeCharacter.id] || [];
      const reply = replies[Math.floor(Math.random() * replies.length)] || "I'll get back to you on this.";
      const trustDelta = (Math.random() - 0.3) * 0.1;
      get().receiveReply(activeCharacter.id, reply, trustDelta);
    }, 1500 + Math.random() * 2000);
  },

  setActiveCharacter: (activeCharacter) => set({ activeCharacter }),
  setChatInput: (chatInput) => set({ chatInput }),

  acknowledgeChaos: () => {
    const session = get().session;
    if (!session) return;
    // Begin 45s visual wind-down
    set({
      chaosOverlay: null,
      session: { ...session, chaosMode: 'normal', chaosResolving: true },
    });
    getSoundscape().beginWindDown();
    // Clear resolving state after 45s
    setTimeout(() => {
      set(s => ({
        session: s.session ? { ...s.session, chaosTier: null, chaosResolving: false } : null,
      }));
    }, 45000);
  },

  markRead: (messageId) => set(s => ({
    messages: s.messages.map(m => m.id === messageId ? { ...m, read: true } : m),
  })),

  tickSession: () => set(s => ({
    session: s.session && s.session.status === 'active'
      ? { ...s.session, elapsedSeconds: s.session.elapsedSeconds + 1 }
      : s.session,
  })),

  trustToast: null,
  setTrustToast: (trustToast) => set({ trustToast }),

  updateOKR: (id, progress) => {
    const session = get().session;
    if (!session) return;
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    const status = clamped >= 100 ? 'complete' : clamped > 0 ? 'in_progress' : 'pending';
    set({
      session: {
        ...session,
        okrs: session.okrs.map(o => o.id === id ? { ...o, progress: clamped, status } : o),
      },
    });
  },

  pauseSession: () => {
    const session = get().session;
    if (!session || session.status !== 'active') return;
    set({ session: { ...session, status: 'paused' } });
  },

  resumeSession: () => {
    const session = get().session;
    if (!session || session.status !== 'paused') return;
    set({ session: { ...session, status: 'active' } });
  },

  receiveReply: (characterId, body, trustDelta) => {
    const { messages, characters, session } = get();
    const char = characters.find(c => c.id === characterId);
    if (!char) return;
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      from: characterId as any,
      to: 'user',
      channel: 'chat',
      body,
      timestamp: new Date(),
      read: false,
    };
    const newTrust = Math.max(0.1, Math.min(0.95, char.trust + trustDelta));
    set({
      messages: [...messages, msg],
      characters: characters.map(c => c.id === characterId ? { ...c, trust: newTrust } : c),
      trustToast: { characterId, name: char.name, delta: trustDelta, newTrust },
    });

    // Auto-clear trust toast after 3.5s
    setTimeout(() => {
      set(s => s.trustToast?.characterId === characterId ? { trustToast: null } : {});
    }, 3500);

    // Play notification ping
    getSoundscape().playNotificationPing();

    // Teammate card progression: advance one of their assigned cards based on trust
    const assigneeInitialMap: Record<string, string> = { marcus: 'M', tom: 'T', priya: 'P', sarah: 'S', elena: 'E' };
    const assigneeInitial = assigneeInitialMap[characterId];
    if (assigneeInitial && newTrust >= 0.45) {
      const cooldowns = get().cardAdvanceCooldowns;
      const lastAdvance = cooldowns[characterId as CharacterId] ?? 0;
      const cooldownMs = 30000;
      if (Date.now() - lastAdvance >= cooldownMs) {
        setTimeout(() => {
          const { kanbanColumns, moveKanbanCard, injectMessage, session: currentSession } = get();
          if (!currentSession || currentSession.status !== 'active') return;
          const inProgressCard = kanbanColumns.find(c => c.id === 'inprogress')?.cards.find(c => c.assignee === assigneeInitial && !c.blocked);
          const backlogCard = kanbanColumns.find(c => c.id === 'backlog')?.cards.find(c => c.assignee === assigneeInitial && !c.blocked);
          const currentTrust = get().characters.find(c => c.id === characterId)?.trust ?? 0;

          let cardToAdvance: KanbanCard | undefined;
          let toColId: string;

          if (inProgressCard && currentTrust >= 0.65) {
            cardToAdvance = inProgressCard;
            toColId = 'review';
          } else if (backlogCard) {
            cardToAdvance = backlogCard;
            toColId = 'inprogress';
          }

          if (!cardToAdvance) return;

          moveKanbanCard(cardToAdvance.id, toColId);
          set(s => ({ cardAdvanceCooldowns: { ...s.cardAdvanceCooldowns, [characterId]: Date.now() } }));

          const updateMsg = toColId === 'inprogress'
            ? `Picking up "${cardToAdvance.title}" — I'll loop back when I have something.`
            : `"${cardToAdvance.title}" is ready for your review — let me know if you need changes.`;
          injectMessage(characterId as CharacterId, updateMsg, 'chat');
        }, 4000 + Math.random() * 6000);
      }
    }

    // Maybe fire chaos (Tier 3 — engineer resignation, once per session)
    if (session && !session.chaosLog.length && session.elapsedSeconds > 300 && Math.random() < 0.15) {
      const tier = 3 as const;
      const chaos: ChaosEvent = {
        id: Math.random().toString(36).slice(2),
        type: 'engineer_resignation',
        title: 'URGENT: Team Alert',
        description: 'A key engineer has submitted their resignation effective immediately. Engineering capacity is now at risk for the Q3 deadline.',
        severity: 'critical',
        tier,
        firedAt: new Date(),
        acknowledged: false,
      };
      // Block Marcus's active cards — capacity is now at risk
      const columnsWithBlock = get().kanbanColumns.map(col => {
        if (col.id !== 'inprogress' && col.id !== 'backlog') return col;
        return { ...col, cards: col.cards.map(c => c.assignee === 'M' ? { ...c, blocked: true } : c) };
      });
      set({
        chaosOverlay: chaos,
        session: { ...session, chaosMode: 'chaos', chaosTier: tier, chaosResolving: false, chaosLog: [...session.chaosLog, chaos] },
        // All characters shift to alarmed state at Tier 3
        characters: get().characters.map(c => ({ ...c, emotion: 'alarmed' as const })),
        kanbanColumns: columnsWithBlock,
      });
      getSoundscape().setChaosState(tier);
      // Marcus flags the capacity impact on the board
      setTimeout(() => {
        get().injectMessage('marcus', "Given the team situation, I need to flag that my work on the board is at risk. I'll reassess capacity once things stabilize.", 'chat');
      }, 2000);
    }
  },

  advanceToExecution: (planScore, planFeedback) => {
    const session = get().session;
    if (!session) return;
    set({ session: { ...session, simulationStage: 'execution', planScore, planFeedback, planUnlockedAt: new Date() } });
  },

  advanceToReporting: () => {
    const session = get().session;
    if (!session) return;
    set({ session: { ...session, simulationStage: 'reporting' } });
  },

  completeSession: () => {
    const { session, user } = get();
    if (!session) return;
    // Mark as completed; set portfolio to 'generating'
    const portfolio: PortfolioCaseStudy = {
      sessionId: session.id,
      sessionNumber: session.sessionNumber,
      scenarioName: 'The Roadmap Reckoning',
      sessionDate: new Date(),
      userName: user?.name ?? 'Maya Chen',
      scenarioSummary: 'Nexus Technologies — 300-person B2B SaaS, 10 days post-Series C. The incoming PM inherited a three-way roadmap conflict between Engineering, Sales, and Product, with a hard Monday board deadline and five stakeholders in active tension. Hidden constraints included a $3M investor clawback tied to an October 1st SSO milestone (unknown to the team), an engineering capacity crunch with a non-obvious deferral window, a sales commitment that was legally softer than presented, a build-vs-buy decision that Engineering had not volunteered, a second enterprise deal nobody had mentioned, and qualitative research connecting the NPS decline to onboarding friction — data that had been ready for two months but never surfaced. Resolving the scenario required uncovering six distinct hidden information layers across five stakeholders while managing an organisational tension between the CEO and VP Product.',
      challenge: 'Consolidate a contested Q3 roadmap under a hard Friday deadline — without starting information — by: (1) navigating a CEO-bypassed-VP dynamic without damaging either relationship, (2) discovering a $3M investor covenant that nobody had communicated, (3) unlocking a third-party engineering alternative that collapsed a 6-week constraint to 2 weeks, (4) verifying that a $2M sales commitment was legally best-efforts rather than binding, (5) surfacing user research that connected a 9-point NPS drop to a fixable onboarding problem, and (6) framing a structured options brief under pressure that gave the CEO what she needed for the board.',
      keyDecisions: [
        { bullet: 'Aligned with VP Product Sarah Chen before doing anything else — preserving the management relationship and extracting context about the Series C investor\'s SSO expectations that informed the entire subsequent approach.' },
        { bullet: 'Challenged Marcus on the "why" behind the 6-week estimate — not the duration itself — which surfaced the WorkOS alternative that reduced SSO delivery from 6 weeks to 2 and unlocked the entire Q3 path.' },
        { bullet: 'Asked Tom to produce the actual Acme email chain rather than accepting his verbal framing — confirming the commitment was "targeting Q3 subject to sign-off," not a hard contractual obligation, and materially changing the risk calculus.' },
        { bullet: 'Engaged Elena directly for the non-negotiable rationale on SSO — uncovering the undisclosed Series C covenant with a $3M clawback and October 1st hard edge that nobody on the team knew about.' },
        { bullet: 'Asked Priya directly for her research data — surfacing the finding that 42% of trial-to-paid drop-off tied to onboarding friction, enabling a Q3 scope that addressed both enterprise expansion and mid-market retention.' },
        { bullet: 'Delivered a structured options brief with two explicitly scoped paths, documented trade-offs, and a clear recommendation — giving the CEO the decision-ready input she needed for Monday rather than a status report.' },
      ],
      skillsAboveBaseline: [
        { dimension: 'Strategic Thinking', score: 84, baselineDelta: +17 },
        { dimension: 'Stakeholder Mgmt', score: 81, baselineDelta: +14 },
        { dimension: 'Communication', score: 78, baselineDelta: +11 },
        { dimension: 'Conflict Resolution', score: 74, baselineDelta: +9 },
        { dimension: 'Prioritisation', score: 77, baselineDelta: +12 },
      ],
      performanceNarrative: `${user?.name ?? 'Maya'} entered one of the most information-dense scenarios in the library — six distinct hidden constraints across five stakeholders, a hard deadline, and a CEO who had bypassed the direct manager — and navigated it with a level of investigative rigour that separates the top 15% of PMs at this experience level.\n\nThe defining pattern was not any single decision but a consistent behaviour: treating first-order information as a starting point rather than a conclusion. When Marcus said "six weeks," the instinct was not to accept the constraint and plan around it — it was to ask what was generating it. That question unlocked WorkOS, collapsed the timeline, and solved the investor covenant problem simultaneously. This is the move that almost no 2–3 year PM makes instinctively. They hear "six weeks" and start negotiating features. The right question is always why, not how.\n\nThe handling of the CEO/VP dynamic showed genuine political maturity. Being assigned directly by the CEO over a direct manager is a situation that most PMs either ignore (cheap now, expensive later) or over-escalate (slow and politically messy). Going to Sarah first — treating her as an intelligence source, not just a stakeholder to manage — paid off in two ways: it preserved the relationship, and it extracted context about James Whitfield's SSO focus that wouldn't have surfaced any other way.\n\nThe decision to push Elena for the actual rationale behind the SSO non-negotiable was the highest-leverage move in the scenario. Most PMs accept "non-negotiable" as a closed door. It is not — it is an invitation to understand the constraint more precisely. The $3M clawback clause was not hidden maliciously; Elena assumed everyone already knew. Asking the question directly was what surfaced it. That information then reframed every other conversation in the scenario.\n\nThe Priya engagement demonstrated an important instinct: going to the person most likely to have been ignored rather than the people making the most noise. Priya had the most strategically relevant data in the scenario — the NPS mechanism, the onboarding connection, the lightweight fix — and she had been sitting on it for eight weeks. The act of asking directly, and treating her findings as decision-relevant rather than supplementary, unlocked a Q3 scope that addressed both the enterprise deal and the conversion rate problem simultaneously.\n\nAreas for development: the sequencing of stakeholder outreach could have been more deliberate — reaching Priya before Marcus would have allowed her data to inform the scope negotiation rather than run parallel to it. The initial week was also slightly reactive; a more senior PM would have synthesised the incoming information faster and moved to structure earlier. Building a repeatable template for executive options briefs will compress that gap significantly.\n\nOverall: this performance reflects a PM with the investigative instincts, political awareness, and structured thinking to operate at the next level. The primary gap between this and senior PM performance is speed and proactivity, not judgment. The judgment is already there.`,
      verificationId: session.id,
      status: 'generating',
    };
    set({ session: { ...session, status: 'completed', simulationStage: 'reporting', portfolio } });

    // Simulate async generation (90s → ready)
    setTimeout(() => {
      set(s => ({
        session: s.session ? {
          ...s.session,
          portfolio: s.session.portfolio ? { ...s.session.portfolio, status: 'ready' } : null,
        } : null,
      }));
    }, 6000); // 6s in demo (vs 90s in production)
  },

  // Kanban
  kanbanColumns: INITIAL_KANBAN_COLUMNS,
  cardAdvanceCooldowns: {},

  moveKanbanCard: (cardId, toColId) => {
    const { kanbanColumns, session, updateOKR } = get();
    let movedCard: KanbanCard | null = null;
    const afterRemove = kanbanColumns.map(col => {
      const found = col.cards.find(c => c.id === cardId);
      if (found) { movedCard = found; return { ...col, cards: col.cards.filter(c => c.id !== cardId) }; }
      return col;
    });
    if (!movedCard) return;
    const card = movedCard as KanbanCard;
    if (toColId === 'done' && card.linkedOkr && session) {
      const okr = session.okrs.find(o => o.id === card.linkedOkr);
      if (okr && okr.progress < 85) updateOKR(card.linkedOkr, Math.min(okr.progress + 35, 85));
    }
    set({ kanbanColumns: afterRemove.map(col => col.id !== toColId ? col : { ...col, cards: [...col.cards, card] }) });
  },

  injectMessage: (characterId, body, channel) => {
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      from: characterId,
      to: 'user',
      channel,
      body,
      timestamp: new Date(),
      read: false,
    };
    set(s => ({ messages: [...s.messages, msg] }));
    getSoundscape().playNotificationPing();
  },

  onUserMoveCard: (card, toColId) => {
    const { characters, injectMessage, session } = get();
    if (!session || session.status !== 'active') return;
    // Only react to teammate cards (not user's own)
    if (card.assignee === 'Y') return;
    const charInitialMap: Record<string, CharacterId> = { M: 'marcus', T: 'tom', P: 'priya', S: 'sarah', E: 'elena' };
    const characterId = charInitialMap[card.assignee];
    if (!characterId) return;
    const char = characters.find(c => c.id === characterId);
    if (!char) return;
    const trust = char.trust;

    const colLabels: Record<string, string> = { inprogress: 'In Progress', review: 'Review', done: 'Done', backlog: 'Backlog' };
    const colLabel = colLabels[toColId] ?? toColId;

    let response: string;
    if (toColId === 'inprogress') {
      response = trust >= 0.65
        ? `Saw you flagged "${card.title}" as active — I'm on it.`
        : trust >= 0.45
        ? `Got it, I'll pick up "${card.title}". It may take me a bit.`
        : `I'd prefer to manage my own queue — I'll get to "${card.title}" when I can.`;
    } else if (toColId === 'review') {
      response = trust >= 0.45
        ? `"${card.title}" is at your end now — let me know if you have feedback.`
        : `Noted that you moved "${card.title}" to Review. I'll follow up separately.`;
    } else if (toColId === 'done') {
      response = trust >= 0.45
        ? `Good to close out "${card.title}".`
        : `"${card.title}" marked done — works for me.`;
    } else {
      response = `Noted the move on "${card.title}" to ${colLabel}.`;
    }

    setTimeout(() => {
      get().injectMessage(characterId, response, 'chat');
    }, 1500 + Math.random() * 1500);
  },

  onboardingStep: 0,
  assessmentAnswers: [],
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  setAssessmentAnswer: (i, v) => {
    const answers = [...get().assessmentAnswers];
    answers[i] = v;
    set({ assessmentAnswers: answers });
  },
}));

// Expose store globally for dev navigation
if (typeof window !== 'undefined') {
  (window as any).__appStore = useAppStore;
}

// REPLY_MAP is now defined in data.ts and imported at top of file
