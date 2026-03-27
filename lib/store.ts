import { create } from 'zustand';
import { Character, CharacterId, Message, SessionState, Screen, AppTab, BrowserTab, ChaosEvent, OKR, PortfolioCaseStudy, AccessibilityPrefs, SimulationStage, KanbanCard, KanbanColumn } from './types';
import { CHARACTERS, INITIAL_SESSION, INITIAL_MESSAGES, INITIAL_OKRS, REPLY_MAP, INITIAL_KANBAN_COLUMNS, CARD_REACTION_MAP } from './data';
import { getSoundscape } from './soundscape';
import { generateCharacterReply, TriggerType } from './ai';

// ── Constraint detection — client-side keyword scan on character replies ──────
const CONSTRAINT_PATTERNS: Record<string, Array<{ keywords: string[]; constraint: string }>> = {
  marcus: [{ keywords: ['workos', 'third-party', '2 weeks', 'two weeks', 'vendor'], constraint: 'workos' }],
  elena: [{ keywords: ['clawback', 'october 1', 'covenant', 'milestone clause'], constraint: 'clawback' }],
  tom: [
    { keywords: ['best efforts', 'best-efforts', 'not a hard'], constraint: 'best_efforts' },
    { keywords: ['meridian'], constraint: 'meridian' },
  ],
  priya: [{ keywords: ['conversion', 'trial-to-paid', 'exit survey', 'funnel drop'], constraint: 'priya_research' }],
  sarah: [{ keywords: ['whitfield', 'james whitfield', 'sequoia', 'series c lead'], constraint: 'sarah_context' }],
};

function detectConstraint(characterId: string, replyText: string): string | null {
  const patterns = CONSTRAINT_PATTERNS[characterId];
  if (!patterns) return null;
  const lower = replyText.toLowerCase();
  for (const { keywords, constraint } of patterns) {
    if (keywords.some(k => lower.includes(k))) return constraint;
  }
  return null;
}

const CONSTRAINT_LABELS: Record<string, string> = {
  workos: 'WorkOS shortcut identified',
  clawback: '$3M clawback clause revealed',
  best_efforts: 'Acme commitment clarified',
  meridian: 'Meridian deal surfaced',
  priya_research: 'Conversion research unlocked',
  sarah_context: 'Investor SSO context revealed',
};

// ── Document share detection ──────────────────────────────────────────────────
const DOC_SHARE_RE = /(?:shared|sent you|sending over|your drive|check your|dropped|put together|i've added|ping(?:ed)? you|forwarding)/i;
const DOC_TYPE_RE = /(?:doc(?:ument)?|brief|analysis|report|research|data|breakdown|deck|file|notes|spec|summary|map|email chain)/i;

function maybeGenerateDoc(characterId: string, body: string, sessionId: string) {
  if (!DOC_SHARE_RE.test(body) || !DOC_TYPE_RE.test(body)) return;
  fetch('/api/documents/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, characterId, triggerMessage: body }),
  }).catch(() => {});
}

// ── Backend helpers ──────────────────────────────────────────────────────────

async function apiPost(path: string, body: unknown): Promise<unknown> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function apiPatch(path: string, body: unknown): Promise<unknown> {
  try {
    const res = await fetch(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Debounced state sync — saves Zustand snapshot to DB at most every 10s
let _syncTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleStateSync(dbSessionId: string, getState: () => AppStore) {
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    const s = getState();
    apiPatch(`/api/sessions/${dbSessionId}`, {
      elapsedSeconds: s.session?.elapsedSeconds,
      stage: s.session?.simulationStage,
      stateJson: {
        characters: s.characters,
        kanbanColumns: s.kanbanColumns,
        okrs: s.session?.okrs,
        chaosMode: s.session?.chaosMode,
      },
    });
  }, 10000);
}

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
  user: { id: string; name: string; email: string; credits: number; avatar?: string } | null;
  setUser: (u: AppStore['user']) => void;

  // Backend session ID (mirrors DB record)
  dbSessionId: string | null;
  setDbSessionId: (id: string | null) => void;

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
  onUserMoveCard: (card: KanbanCard, fromColId: string, toColId: string) => void;

  // Onboarding
  onboardingStep: number;
  assessmentAnswers: number[];
  setOnboardingStep: (n: number) => void;
  setAssessmentAnswer: (i: number, v: number) => void;

  // Constraint discovery
  revealedConstraints: string[];
  constraintToasts: Array<{ id: string; constraint: string; label: string; characterName: string }>;
  dismissConstraintToast: (id: string) => void;
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
  setDbSessionId: (dbSessionId) => set({ dbSessionId }),

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
    getSoundscape().init().catch(() => {});

    // Create DB session record (fire and forget — sim runs offline if this fails)
    apiPost('/api/sessions', { scenarioId: 'roadmap-reckoning' }).then((data: any) => {
      if (data?.session?.id) {
        set({ dbSessionId: data.session.id });
      }
    });
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

    // Persist message + log event to DB (fire and forget)
    const { dbSessionId, session } = get();
    if (dbSessionId) {
      apiPost(`/api/sessions/${dbSessionId}/messages`, {
        from: 'user', to: activeCharacter.id, channel, body,
      });
      apiPost(`/api/sessions/${dbSessionId}/events`, {
        type: 'message_sent',
        payload: {
          characterId: activeCharacter.id,
          channel,
          elapsedSeconds: session?.elapsedSeconds ?? 0,
        },
      });
      scheduleStateSync(dbSessionId, get);
    }

    // Generate live reply via Claude; fall back to REPLY_MAP on failure
    const { kanbanColumns } = get();
    generateCharacterReply(
      activeCharacter.id,
      'message_reply',
      body,
      { character: activeCharacter, recentMessages: messages, session: session!, kanbanColumns }
    ).then(result => {
      const fallbackPool = REPLY_MAP[activeCharacter.id] || [];
      const text = result.reply ?? (fallbackPool[Math.floor(Math.random() * fallbackPool.length)] || "I'll get back to you on this.");
      // Use AI-derived trust delta; fall back to small random value if API failed to return one
      const trustDelta = result.trustDelta !== null ? result.trustDelta : (Math.random() - 0.35) * 0.08;
      get().receiveReply(activeCharacter.id, text, trustDelta);
    });
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
    const { messages, characters, session, dbSessionId } = get();
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

    // Persist incoming message + trust event to DB
    if (dbSessionId) {
      apiPost(`/api/sessions/${dbSessionId}/messages`, {
        from: characterId, to: 'user', channel: 'chat', body,
      });
      apiPost(`/api/sessions/${dbSessionId}/events`, {
        type: 'trust_changed',
        payload: { characterId, delta: trustDelta, newTrust, elapsedSeconds: session?.elapsedSeconds ?? 0 },
      });
      scheduleStateSync(dbSessionId, get);
    }

    // Auto-clear trust toast after 3.5s
    setTimeout(() => {
      set(s => s.trustToast?.characterId === characterId ? { trustToast: null } : {});
    }, 3500);

    // Constraint discovery detection
    const { revealedConstraints } = get();
    const detected = detectConstraint(characterId, body);
    if (detected && !revealedConstraints.includes(detected)) {
      const toastId = Math.random().toString(36).slice(2);
      const charDisplayName = get().characters.find(c => c.id === characterId)?.name ?? characterId;
      set(s => ({
        revealedConstraints: [...s.revealedConstraints, detected],
        constraintToasts: [...s.constraintToasts, {
          id: toastId,
          constraint: detected,
          label: CONSTRAINT_LABELS[detected] ?? detected,
          characterName: charDisplayName,
        }],
      }));
      // Log constraint unlock event to DB
      if (dbSessionId) {
        apiPost(`/api/sessions/${dbSessionId}/events`, {
          type: 'hidden_constraint_unlocked',
          payload: { constraint: detected, characterId, elapsedSeconds: get().session?.elapsedSeconds ?? 0 },
        });
      }
      // Auto-dismiss constraint toast after 6s
      setTimeout(() => {
        set(s => ({ constraintToasts: s.constraintToasts.filter(t => t.id !== toastId) }));
      }, 6000);
    }

    // Document share detection — trigger AI doc generation if character mentions sharing a file
    if (dbSessionId) {
      maybeGenerateDoc(characterId, body, dbSessionId);
    }

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
          let toColId: string = '';

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

          const cardSnapshot = cardToAdvance;
          const toColSnapshot = toColId;
          const advChar = get().characters.find(c => c.id === characterId)!;
          const fallbackMsg = toColSnapshot === 'inprogress'
            ? `Picking up "${cardSnapshot.title}" — I'll loop back when I have something.`
            : `"${cardSnapshot.title}" is ready for your review — let me know if you need changes.`;
          generateCharacterReply(
            characterId,
            'card_advanced_autonomous',
            `You are moving "${cardSnapshot.title}" to ${toColSnapshot === 'inprogress' ? 'In Progress' : 'Review'}.`,
            { character: advChar, recentMessages: get().messages, session: get().session!, kanbanColumns: get().kanbanColumns }
          ).then(result => {
            injectMessage(characterId as CharacterId, result.reply ?? fallbackMsg, 'chat');
          });
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
      // Log chaos event to DB
      const { dbSessionId: chaosDbId } = get();
      if (chaosDbId) {
        apiPost(`/api/sessions/${chaosDbId}/events`, {
          type: 'chaos_triggered',
          payload: { tier, type: 'engineer_resignation', elapsedSeconds: session.elapsedSeconds },
        });
      }
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
    const { session, user, dbSessionId, characters, kanbanColumns } = get();
    if (!session) return;

    // Immediately mark as completed with portfolio status 'generating'
    const portfolio: PortfolioCaseStudy = {
      sessionId: session.id,
      sessionNumber: session.sessionNumber,
      scenarioName: 'The Roadmap Reckoning',
      sessionDate: new Date(),
      userName: user?.name ?? 'PM',
      scenarioSummary: '',
      challenge: '',
      keyDecisions: [],
      skillsAboveBaseline: [],
      performanceNarrative: '',
      verificationId: dbSessionId ?? session.id,
      status: 'generating',
    };
    set({ session: { ...session, status: 'completed', simulationStage: 'reporting', portfolio } });

    if (!dbSessionId) return;

    // Final OKR progress average
    const finalOkrProgress = Math.round(
      session.okrs.reduce((sum, o) => sum + o.progress, 0) / Math.max(session.okrs.length, 1)
    );

    // 1. Complete session + run scoring
    apiPost(`/api/sessions/${dbSessionId}/complete`, {
      planScore: session.planScore ?? 0,
      finalOkrProgress,
      elapsedSeconds: session.elapsedSeconds,
      stateJson: { characters, kanbanColumns, okrs: session.okrs },
    }).then(() => {
      // 2. Kick off AI portfolio generation
      return apiPost(`/api/sessions/${dbSessionId}/portfolio`, {});
    }).then((data: any) => {
      const portfolioData = data?.portfolio;
      if (!portfolioData) return;

      // Update local state with DB portfolio id and start polling
      set(s => ({
        session: s.session ? {
          ...s.session,
          portfolio: s.session.portfolio ? {
            ...s.session.portfolio,
            verificationId: portfolioData.verificationId ?? s.session.portfolio.verificationId,
          } : null,
        } : null,
      }));

      // Poll for portfolio ready (every 5s, max 12 attempts = 60s)
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        if (attempts > 12) { clearInterval(poll); return; }
        const res = await fetch(`/api/sessions/${dbSessionId}/portfolio`).catch(() => null);
        if (!res?.ok) return;
        const { portfolio: polled } = await res.json().catch(() => ({}));
        if (polled?.status === 'ready') {
          clearInterval(poll);
          set(s => ({
            session: s.session ? {
              ...s.session,
              portfolio: s.session.portfolio ? {
                ...s.session.portfolio,
                status: 'ready',
                scenarioSummary: polled.scenarioSummary,
                challenge: polled.challenge,
                keyDecisions: polled.keyDecisions,
                performanceNarrative: polled.performanceNarrative,
                skillsAboveBaseline: Object.entries(polled.skillScores ?? {}).map(([k, v]) => ({
                  dimension: k, score: v as number, baselineDelta: 0,
                })),
              } : null,
            } : null,
          }));
        } else if (polled?.status === 'failed') {
          clearInterval(poll);
          set(s => ({
            session: s.session ? {
              ...s.session,
              portfolio: s.session.portfolio ? { ...s.session.portfolio, status: 'failed' } : null,
            } : null,
          }));
        }
      }, 5000);
    });
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

  onUserMoveCard: (card, fromColId, toColId) => {
    const { characters, injectMessage, session, dbSessionId } = get();

    // Log card move event
    if (dbSessionId) {
      apiPost(`/api/sessions/${dbSessionId}/events`, {
        type: 'card_moved',
        payload: {
          cardTitle: card.title,
          cardId: card.id,
          assignee: card.assignee,
          fromCol: fromColId,
          toCol: toColId,
          elapsedSeconds: session?.elapsedSeconds ?? 0,
        },
      });
      scheduleStateSync(dbSessionId, get);
    }
    if (!session || session.status !== 'active') return;

    // PM's own card moved to Done: relevant teammate acknowledges
    if (card.assignee === 'Y' && toColId === 'done') {
      const tagToChar: Record<string, CharacterId> = {
        Eng: 'marcus', Sales: 'tom', Research: 'priya', UX: 'priya',
        Executive: 'elena', Strategy: 'sarah', Product: 'sarah', Process: 'sarah',
      };
      const acknowledger: CharacterId = tagToChar[card.tag] ?? 'sarah';
      const ackChar = characters.find(c => c.id === acknowledger);
      const trust = ackChar?.trust ?? 0.5;
      const ack = trust >= 0.65
        ? `Good to see "${card.title}" wrapped up — that clears the path on my end.`
        : `"${card.title}" done — noted.`;
      setTimeout(() => {
        get().injectMessage(acknowledger, ack, 'chat');
      }, 2000 + Math.random() * 2000);
      return;
    }

    // Only react to teammate cards
    if (card.assignee === 'Y') return;
    const charInitialMap: Record<string, CharacterId> = { M: 'marcus', T: 'tom', P: 'priya', S: 'sarah', E: 'elena' };
    const characterId = charInitialMap[card.assignee];
    if (!characterId) return;
    const char = characters.find(c => c.id === characterId);
    if (!char) return;

    const trust = char.trust;
    const tier: 'high' | 'mid' | 'low' = trust >= 0.65 ? 'high' : trust >= 0.45 ? 'mid' : 'low';
    const reactions = CARD_REACTION_MAP[characterId];
    const pick = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];

    let pool: string[];
    if (toColId === 'done') {
      // Premature close: moved to Done without going through Review
      const isPremature = fromColId !== 'review';
      pool = isPremature
        ? (tier === 'low' ? reactions.toDone.low : reactions.toDone.earlyClose)
        : reactions.toDone.natural;
    } else if (toColId === 'inprogress') {
      pool = reactions.toInProgress[tier];
    } else if (toColId === 'review') {
      pool = reactions.toReview[tier];
    } else if (toColId === 'backlog') {
      pool = reactions.toBacklog;
    } else {
      return; // unknown column — no reaction
    }

    const isPremature = toColId === 'done' && fromColId !== 'review';
    const triggerType: TriggerType = toColId === 'done'
      ? 'card_moved_to_done'
      : toColId === 'inprogress'
        ? 'card_moved_to_inprogress'
        : toColId === 'review'
          ? 'card_moved_to_review'
          : 'card_moved_to_inprogress';
    const triggerBody = isPremature
      ? `The PM moved your card "${card.title}" directly from ${fromColId} to Done — the work is not complete.`
      : `The PM moved your card "${card.title}" from ${fromColId} to ${toColId}.`;

    generateCharacterReply(
      characterId,
      triggerType,
      triggerBody,
      { character: char, recentMessages: get().messages, session: session!, kanbanColumns: get().kanbanColumns }
    ).then(result => {
      const text = result.reply ?? pick(pool);
      setTimeout(() => {
        get().injectMessage(characterId, text, 'chat');
      }, 1500 + Math.random() * 1500);
    });
  },

  onboardingStep: 0,
  assessmentAnswers: [],
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  setAssessmentAnswer: (i, v) => {
    const answers = [...get().assessmentAnswers];
    answers[i] = v;
    set({ assessmentAnswers: answers });
  },

  revealedConstraints: [],
  constraintToasts: [],
  dismissConstraintToast: (id) => set(s => ({
    constraintToasts: s.constraintToasts.filter(t => t.id !== id),
  })),
}));

// Expose store globally for dev navigation
if (typeof window !== 'undefined') {
  (window as any).__appStore = useAppStore;
}

// REPLY_MAP is now defined in data.ts and imported at top of file
