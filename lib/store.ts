import { create } from 'zustand';
import { Character, Message, SessionState, Screen, AppTab, BrowserTab, ChaosEvent, OKR, PortfolioCaseStudy, AccessibilityPrefs, SimulationStage, SimPreferences, CharacterId, DifficultyLevel, DecisionNode, DebriefItem, DynamicAnalytics, KanbanColumn, KanbanCard } from './types';
import { CHARACTERS, INITIAL_SESSION, INITIAL_MESSAGES, INITIAL_OKRS, REPLY_MAP, CHARACTER_SECRETS, CASCADE_EVENTS, CHAOS_EVENT_POOL, DIFFICULTY_CONFIG, MOCK_ANALYTICS, INITIAL_KANBAN_COLUMNS } from './data';
import { getSoundscape } from './soundscape';
import { createDbSession, saveMessage, saveSessionEvent, completeDbSession } from './db';

export interface MinimizedWindow {
  screen: Screen;
  label: string;
  accentColor: string;
}

function computeDifficulty(simPrefs: SimPreferences | null): DifficultyLevel {
  const exp = (simPrefs?.experienceLevel ?? '').toLowerCase();
  if (
    exp.includes('0') || exp.includes('1 year') || exp.includes('student') ||
    exp.includes('junior') || exp.includes('intern') || exp.includes('entry')
  ) return 'guided';
  if (
    exp.includes('5') || exp.includes('6') || exp.includes('7') || exp.includes('8') ||
    exp.includes('9') || exp.includes('10') || exp.includes('senior') ||
    exp.includes('director') || exp.includes('vp') || exp.includes('head of')
  ) return 'pressure';
  return 'standard';
}

function computeMetricsDrift(characters: Character[], chaosCount: number): DynamicAnalytics {
  const priya = characters.find(c => c.id === 'priya');
  const marcus = characters.find(c => c.id === 'marcus');
  const pTrust = priya?.trust ?? 0.68;
  const mTrust = marcus?.trust ?? 0.51;

  return {
    nps: Math.round(42 + (pTrust - 0.68) * 45),
    trialConversion: Math.round(23 + (pTrust - 0.68) * 18),
    velocity: Math.round(84 + (mTrust - 0.51) * 35),
    churn: Math.max(1, parseFloat((4.2 + chaosCount * 0.5 - (mTrust - 0.51) * 1.5).toFixed(1))),
    dau: Math.round(12400 + (pTrust - 0.68) * 800),
  };
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
  user: { id: string; name: string; email: string; credits: number; avatar: string } | null;
  setUser: (u: AppStore['user']) => void;

  // DB session tracking
  dbSessionId: string | null;

  // Simulation
  session: SessionState | null;
  characters: Character[];
  messages: Message[];
  activeCharacter: Character | null;
  chatInput: string;
  chaosOverlay: ChaosEvent | null;

  // Voice mode
  voiceMode: boolean;
  setVoiceMode: (v: boolean) => void;

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
  receiveReply: (characterId: string, body: string, trustDelta: number, userMessage?: string) => void;
  completeSession: () => void;
  advanceToExecution: (planScore: number, planFeedback: string) => void;
  advanceToReporting: () => void;
  generateDebrief: () => void;

  // Kanban board (shared state so simulation can update it)
  kanbanColumns: KanbanColumn[];
  cardAdvanceCooldowns: Partial<Record<CharacterId, number>>;
  moveKanbanCard: (cardId: string, toColId: string) => void;
  injectMessage: (characterId: CharacterId, body: string, channel: 'chat' | 'email') => void;
  onUserMoveCard: (card: KanbanCard, fromColId: string, toColId: string) => void;

  // Onboarding
  onboardingStep: number;
  assessmentAnswers: number[];
  setOnboardingStep: (n: number) => void;
  setAssessmentAnswer: (i: number, v: number) => void;

  // Sim preferences (set during chat onboarding)
  simPreferences: SimPreferences | null;
  setSimPreferences: (prefs: SimPreferences) => void;
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

  dbSessionId: null,

  session: null,
  characters: CHARACTERS,
  messages: [],
  activeCharacter: null,
  chatInput: '',
  chaosOverlay: null,

  voiceMode: false,
  setVoiceMode: (voiceMode) => set({ voiceMode }),

  kanbanColumns: INITIAL_KANBAN_COLUMNS,
  cardAdvanceCooldowns: {},
  moveKanbanCard: (cardId, toColId) => set(s => {
    const cols = s.kanbanColumns.map(col => ({
      ...col,
      cards: col.cards.filter(c => c.id !== cardId),
    }));
    const sourceCard = s.kanbanColumns.flatMap(c => c.cards).find(c => c.id === cardId);
    if (!sourceCard) return {};
    return {
      kanbanColumns: cols.map(col =>
        col.id === toColId ? { ...col, cards: [...col.cards, sourceCard] } : col
      ),
    };
  }),
  injectMessage: (characterId, body, channel) => {
    const msg: Message = {
      id: `injected-${Date.now()}`,
      from: characterId,
      to: 'user',
      channel,
      body,
      timestamp: new Date(),
      read: false,
    };
    set(s => ({ messages: [...s.messages, msg] }));
  },
  onUserMoveCard: (card, fromColId, toColId) => {
    get().moveKanbanCard(card.id, toColId);
  },

  controlPanelOpen: false,
  setControlPanelOpen: (open) => set({ controlPanelOpen: open }),

  accessibilityPrefs: { reduceVisualEffects: false, muteSounds: false },
  setAccessibilityPrefs: (prefs) => set(s => ({
    accessibilityPrefs: { ...s.accessibilityPrefs, ...prefs },
  })),

  startSession: () => {
    const difficulty = computeDifficulty(get().simPreferences);
    set({
      session: {
        ...INITIAL_SESSION,
        startedAt: new Date(),
        chaosTier: null,
        chaosResolving: false,
        portfolio: null,
        difficulty,
        unlockedSecrets: [],
        firedCascades: [],
        firedChaosIds: [],
        lastContactedAt: {},
        decisionHistory: [],
        dynamicAnalytics: { nps: 42, trialConversion: 23, velocity: 84, churn: 4.2, dau: 12400 },
        debrief: null,
      },
      messages: INITIAL_MESSAGES,
      characters: CHARACTERS,
    });
    getSoundscape().init().catch(() => {});

    // Persist to DB (fire and forget)
    const { user } = get();
    const newSession = get().session;
    if (user?.id && newSession) {
      createDbSession(user.id, newSession)
        .then(id => { if (id) set({ dbSessionId: id }); })
        .catch(() => {});
    }
  },

  sendMessage: (body, channel, subject) => {
    const { activeCharacter, messages, session, characters } = get();
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

    // Track last contacted time
    const updatedSession = session ? {
      ...session,
      lastContactedAt: { ...session.lastContactedAt, [activeCharacter.id]: session.elapsedSeconds },
    } : session;

    set({ messages: [...messages, msg], session: updatedSession });

    // Persist user message to DB (fire and forget)
    const { user, dbSessionId } = get();
    if (user?.id && dbSessionId) {
      saveMessage(dbSessionId, user.id, msg).catch(() => {});
    }

    // Capture for delay reference
    const charSnapshot = { ...activeCharacter };
    const delay = 1500 + Math.random() * 1500;

    // Try AI-powered reply, fall back to REPLY_MAP
    const recentMsgs = [...messages, msg]
      .filter(m => (m.from === charSnapshot.id || m.to === charSnapshot.id) && m.channel === channel)
      .slice(-6);

    const trustDelta = (Math.random() - 0.3) * 0.1 +
      (session ? DIFFICULTY_CONFIG[session.difficulty].trustDeltaBoost : 0);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterName: charSnapshot.name,
        characterTitle: charSnapshot.title,
        personality: charSnapshot.personality,
        visibleAgenda: charSnapshot.visibleAgenda,
        trust: charSnapshot.trust,
        conversationHistory: recentMsgs,
        userMessage: body,
      }),
    })
      .then(r => r.json())
      .then(({ reply }) => {
        setTimeout(() => {
          get().receiveReply(charSnapshot.id, reply || getFallbackReply(charSnapshot.id), trustDelta, body);
        }, delay);
      })
      .catch(() => {
        setTimeout(() => {
          get().receiveReply(charSnapshot.id, getFallbackReply(charSnapshot.id), trustDelta, body);
        }, delay);
      });
  },

  setActiveCharacter: (activeCharacter) => set({ activeCharacter }),
  setChatInput: (chatInput) => set({ chatInput }),

  acknowledgeChaos: () => {
    const session = get().session;
    if (!session) return;
    set({
      chaosOverlay: null,
      session: { ...session, chaosMode: 'normal', chaosResolving: true },
    });
    getSoundscape().beginWindDown();
    setTimeout(() => {
      set(s => ({
        session: s.session ? { ...s.session, chaosTier: null, chaosResolving: false } : null,
      }));
    }, 45000);
  },

  markRead: (messageId) => set(s => ({
    messages: s.messages.map(m => m.id === messageId ? { ...m, read: true } : m),
  })),

  tickSession: () => {
    const { session, characters } = get();
    if (!session || session.status !== 'active') return;

    const newElapsed = session.elapsedSeconds + 1;

    // Check cascade triggers every 5 seconds
    if (newElapsed % 5 === 0) {
      const config = DIFFICULTY_CONFIG[session.difficulty];
      const sessionForCheck = { ...session, elapsedSeconds: newElapsed };

      for (const cascade of CASCADE_EVENTS) {
        // Apply difficulty multiplier to cascade thresholds
        const adjustedSession = {
          ...sessionForCheck,
          // Slow cascades for guided, speed up for pressure
          elapsedSeconds: Math.round(newElapsed / config.cascadeDelayMultiplier),
        };
        if (cascade.trigger(adjustedSession)) {
          const cascadeMsg: Message = {
            id: `cascade-${cascade.id}-${Date.now()}`,
            from: cascade.characterId,
            to: 'user',
            channel: cascade.channel,
            subject: cascade.subject,
            body: cascade.message,
            timestamp: new Date(),
            read: false,
          };
          set(s => ({
            messages: [...s.messages, cascadeMsg],
            session: s.session ? {
              ...s.session,
              elapsedSeconds: newElapsed,
              firedCascades: [...s.session.firedCascades, cascade.id],
            } : s.session,
          }));
          getSoundscape().playNotificationPing?.();
          return;
        }
      }
    }

    set(s => ({
      session: s.session ? { ...s.session, elapsedSeconds: newElapsed } : s.session,
    }));
  },

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

  receiveReply: (characterId, body, trustDelta, userMessage?) => {
    const { messages, characters, session, voiceMode } = get();
    const char = characters.find(c => c.id === characterId);
    if (!char) return;

    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      from: characterId as CharacterId,
      to: 'user',
      channel: 'chat',
      body,
      timestamp: new Date(),
      read: false,
    };

    const newTrust = Math.max(0.1, Math.min(0.95, char.trust + trustDelta));

    // Build decision node if we have the original user message
    const newDecisionNode: DecisionNode | null = userMessage ? {
      id: `d-${Date.now()}`,
      timestampSeconds: session?.elapsedSeconds ?? 0,
      characterId: characterId as CharacterId,
      userMessage,
      characterReply: body,
      trustBefore: char.trust,
      trustAfter: newTrust,
    } : null;

    // Check for newly unlocked secrets
    const secrets = CHARACTER_SECRETS[characterId as CharacterId] || [];
    const newlyUnlocked = secrets.filter(s =>
      session && !session.unlockedSecrets.includes(s.secretId) && newTrust >= s.threshold
    );

    // Compute metrics drift
    const updatedChars = characters.map(c => c.id === characterId ? { ...c, trust: newTrust } : c);
    const newAnalytics = session
      ? computeMetricsDrift(updatedChars, session.chaosLog.length)
      : null;

    set({
      messages: [...messages, msg],
      characters: updatedChars,
      trustToast: { characterId, name: char.name, delta: trustDelta, newTrust },
      session: session ? {
        ...session,
        decisionHistory: newDecisionNode ? [...session.decisionHistory, newDecisionNode] : session.decisionHistory,
        dynamicAnalytics: newAnalytics ?? session.dynamicAnalytics,
      } : session,
    });

    // Persist character reply to DB (fire and forget)
    const { user: u, dbSessionId: dbSid } = get();
    if (u?.id && dbSid) {
      saveMessage(dbSid, u.id, msg).catch(() => {});
    }

    // Auto-clear trust toast
    setTimeout(() => {
      set(s => s.trustToast?.characterId === characterId ? { trustToast: null } : {});
    }, 3500);

    // TTS for voice mode
    if (voiceMode && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(body);
      utterance.rate = 0.95;
      const pitchMap: Record<string, number> = { sarah: 1.1, marcus: 0.85, priya: 1.15, tom: 0.95, elena: 1.0 };
      utterance.pitch = pitchMap[characterId] ?? 1.0;
      window.speechSynthesis.speak(utterance);
    }

    getSoundscape().playNotificationPing?.();

    // Inject unlocked secrets after a short delay
    if (newlyUnlocked.length > 0 && session) {
      const secret = newlyUnlocked[0];
      setTimeout(() => {
        const secretMsg: Message = {
          id: `secret-${secret.secretId}-${Date.now()}`,
          from: characterId as CharacterId,
          to: 'user',
          channel: 'chat',
          body: secret.message,
          timestamp: new Date(),
          read: false,
        };
        set(s => ({
          messages: [...s.messages, secretMsg],
          session: s.session ? {
            ...s.session,
            unlockedSecrets: [...s.session.unlockedSecrets, secret.secretId],
          } : s.session,
        }));
        getSoundscape().playNotificationPing?.();
      }, 2200);
    }

    // Fire chaos events
    if (session) {
      const config = DIFFICULTY_CONFIG[session.difficulty];
      const totalFired = session.firedChaosIds.length + (session.chaosLog.length > 0 ? 0 : 0);

      if (
        totalFired < config.maxChaosEvents &&
        session.elapsedSeconds > config.chaosAfterSeconds &&
        Math.random() < config.chaosChance
      ) {
        // Pick an eligible chaos event
        const available = CHAOS_EVENT_POOL.filter(e =>
          !session.firedChaosIds.includes(e.id) &&
          session.elapsedSeconds >= e.minElapsed
        );

        if (available.length > 0) {
          // Prefer Tier 3 if pressure mode and not yet fired, else random Tier 1/2
          const candidates = session.difficulty === 'pressure'
            ? available
            : available.filter(e => e.tier < 3 || session.firedChaosIds.length === 0);

          const pick = candidates[Math.floor(Math.random() * candidates.length)] || available[0];

          const chaos: ChaosEvent = {
            id: Math.random().toString(36).slice(2),
            type: pick.type,
            title: pick.title,
            description: pick.description,
            severity: pick.severity,
            tier: pick.tier,
            firedAt: new Date(),
            acknowledged: false,
          };

          const allAlarmed = pick.tier === 3;

          set(s => ({
            chaosOverlay: chaos,
            session: s.session ? {
              ...s.session,
              chaosMode: 'chaos',
              chaosTier: pick.tier,
              chaosResolving: false,
              chaosLog: [...s.session.chaosLog, chaos],
              firedChaosIds: [...s.session.firedChaosIds, pick.id],
            } : s.session,
            characters: allAlarmed
              ? get().characters.map(c => ({ ...c, emotion: 'alarmed' as const }))
              : get().characters,
          }));

          getSoundscape().setChaosState?.(pick.tier);

          // Persist chaos event to DB (fire and forget)
          const { user: cu, dbSessionId: cSid } = get();
          if (cu?.id && cSid) {
            saveSessionEvent(cSid, cu.id, chaos).catch(() => {});
          }
        }
      }

      // Legacy engineer resignation (ensure backward compat)
      if (
        session.chaosLog.length === 0 &&
        session.firedChaosIds.length === 0 &&
        session.elapsedSeconds > config.chaosAfterSeconds &&
        Math.random() < config.chaosChance
      ) {
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
        set({
          chaosOverlay: chaos,
          session: {
            ...session,
            chaosMode: 'chaos',
            chaosTier: tier,
            chaosResolving: false,
            chaosLog: [...session.chaosLog, chaos],
            firedChaosIds: [...session.firedChaosIds, 'engineer_resignation'],
          },
          characters: get().characters.map(c => ({ ...c, emotion: 'alarmed' as const })),
        });
        getSoundscape().setChaosState?.(tier);
      }
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

  generateDebrief: async () => {
    const { session, characters, simPreferences } = get();
    if (!session) return;

    try {
      const response = await fetch('/api/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionHistory: session.decisionHistory,
          characters,
          session,
          simPreferences,
        }),
      });
      const { debrief } = await response.json();
      set(s => ({
        session: s.session ? { ...s.session, debrief } : s.session,
      }));
    } catch {
      // Debrief unavailable — not critical
    }
  },

  completeSession: () => {
    const { session, user, dbSessionId, characters, kanbanColumns } = get();
    if (!session) return;
    const portfolio: PortfolioCaseStudy = {
      sessionId: session.id,
      sessionNumber: session.sessionNumber,
      scenarioName: 'The Roadmap Reckoning',
      sessionDate: new Date(),
      userName: user?.name ?? 'Maya Chen',
      scenarioSummary: 'Nexus Technologies — 300-person B2B SaaS, 10 days post-Series C. The incoming PM inherited a three-way roadmap conflict between Engineering, Sales, and Product, with a hard Monday board deadline and five stakeholders in active tension. Hidden constraints included a $3M investor clawback tied to an October 1st SSO milestone (unknown to the team), an engineering capacity crunch with a non-obvious deferral window, a sales commitment that was legally softer than presented, a build-vs-buy decision that Engineering had not volunteered, a second enterprise deal nobody had mentioned, and qualitative research connecting the NPS decline to onboarding friction — data that had been ready for two months but never surfaced. Resolving the scenario required uncovering six distinct hidden information layers across five stakeholders while managing an organisational tension between the CEO and VP Product.',
      challenge: 'Consolidate a contested Q3 roadmap under a hard Friday deadline — without starting information — by navigating a CEO-bypassed-VP dynamic, discovering a $3M investor covenant, unlocking a third-party engineering alternative, verifying sales commitment language, surfacing critical user research, and delivering a structured options brief under board pressure.',
      keyDecisions: [
        { bullet: 'Aligned with VP Product Sarah Chen before acting — preserving the management relationship and extracting Series C investor context.' },
        { bullet: 'Challenged Marcus on the "why" behind the 6-week estimate — surfacing the WorkOS alternative that reduced SSO delivery from 6 weeks to 2.' },
        { bullet: 'Asked Tom to produce the actual Acme email chain — confirming the commitment was best-efforts, not contractual.' },
        { bullet: 'Engaged Elena directly for the non-negotiable rationale on SSO — uncovering the $3M clawback clause unknown to the team.' },
        { bullet: 'Asked Priya directly for her research data — surfacing the finding that 42% of trial drop-off tied to onboarding friction.' },
        { bullet: 'Delivered a structured options brief with two scoped paths, documented trade-offs, and a clear recommendation.' },
      ],
      skillsAboveBaseline: [
        { dimension: 'Strategic Thinking', score: 84, baselineDelta: +17 },
        { dimension: 'Stakeholder Mgmt', score: 81, baselineDelta: +14 },
        { dimension: 'Communication', score: 78, baselineDelta: +11 },
        { dimension: 'Conflict Resolution', score: 74, baselineDelta: +9 },
        { dimension: 'Prioritisation', score: 77, baselineDelta: +12 },
      ],
      performanceNarrative: `${user?.name ?? 'Maya'} navigated one of the most information-dense scenarios in the library with a level of investigative rigour that separates the top 15% of PMs at this experience level. The defining pattern was treating first-order information as a starting point rather than a conclusion — asking why the 6-week estimate existed rather than planning around it, pushing Elena for the actual rationale behind the SSO non-negotiable, and going to Priya rather than waiting for her to volunteer. Each of those moves unlocked information that materially changed the scope decision. This is not common instinct at 2–3 years of PM experience, and it will compound significantly with seniority.`,
      verificationId: session.id,
      status: 'generating',
    };

    set({ session: { ...session, status: 'completed', simulationStage: 'reporting', portfolio } });

    // Persist completed session to DB (fire and forget)
    const completedSession = get().session;
    if (user?.id && dbSessionId && completedSession) {
      completeDbSession(dbSessionId, user.id, completedSession, portfolio).catch(() => {});
    }

    // Generate AI debrief in background
    get().generateDebrief();

    // Mark portfolio ready after 6s
    setTimeout(() => {
      set(s => ({
        session: s.session ? {
          ...s.session,
          portfolio: s.session.portfolio ? {
            ...s.session.portfolio,
            verificationId: portfolio.verificationId ?? s.session.portfolio.verificationId,
          } : null,
        } : null,
      }));
    }, 6000);
  },

  onboardingStep: 0,
  assessmentAnswers: [],
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  setAssessmentAnswer: (i, v) => {
    const answers = [...get().assessmentAnswers];
    answers[i] = v;
    set({ assessmentAnswers: answers });
  },

  simPreferences: null,
  setSimPreferences: (simPreferences) => set({ simPreferences }),
}));

function getFallbackReply(characterId: string): string {
  const replies = REPLY_MAP[characterId] || [];
  return replies[Math.floor(Math.random() * replies.length)] || "I'll get back to you on this.";
}

// Expose store globally for dev navigation
if (typeof window !== 'undefined') {
  (window as any).__appStore = useAppStore;
}
