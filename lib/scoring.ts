/**
 * Skill score engine — derives PM skill scores from a session event log.
 *
 * Each skill is scored 0–100 based on heuristics derived from what happened:
 *   - Who the PM contacted and in what order
 *   - How trust evolved for each character
 *   - How cards were moved on the Kanban board
 *   - How quickly key milestones were reached
 *   - Whether hidden constraints were surfaced
 */

export interface EventPayload {
  // message_sent
  characterId?: string;
  channel?: string;
  elapsedSeconds?: number;
  // card_moved
  cardTitle?: string;
  fromCol?: string;
  toCol?: string;
  assignee?: string;
  // trust_changed
  newTrust?: number;
  delta?: number;
  // chaos_triggered
  tier?: number;
  // hidden_constraint_unlocked
  constraint?: string;
  // session_completed
  planScore?: number;
  finalOkrProgress?: number;
}

export interface ScoredEvent {
  type: string;
  payload: EventPayload;
  createdAt: Date;
}

export interface SkillScores {
  prioritisation: number;
  stakeholderMgmt: number;
  communication: number;
  conflictResolution: number;
  strategicThinking: number;
  executionSpeed: number;
}

export interface ScoringResult extends SkillScores {
  compositeScore: number;
  constraintsFound: number;
  trustFinal: Record<string, number>;
}

const CHARACTERS = ['sarah', 'marcus', 'priya', 'tom', 'elena'];
const HIDDEN_CONSTRAINTS = [
  'workos',        // Marcus's build-vs-buy shortcut
  'clawback',      // Elena's $3M covenant
  'best_efforts',  // Tom's soft contract language
  'meridian',      // Second enterprise deal
  'priya_research',// Priya's conversion research
  'sarah_context', // Sarah's context about James Whitfield
];

export function calculateScores(events: ScoredEvent[]): ScoringResult {
  const messages = events.filter(e => e.type === 'message_sent');
  const cardMoves = events.filter(e => e.type === 'card_moved');
  const trustChanges = events.filter(e => e.type === 'trust_changed');
  const constraintEvents = events.filter(e => e.type === 'hidden_constraint_unlocked');
  const completedEvent = events.find(e => e.type === 'session_completed');
  const startEvent = events.find(e => e.type === 'session_started');

  const sessionDurationSeconds = completedEvent?.payload.elapsedSeconds
    ?? (events[events.length - 1]?.payload.elapsedSeconds ?? 0);

  // ── Trust final state ──────────────────────────────────────────────────────
  const trustFinal: Record<string, number> = {};
  for (const char of CHARACTERS) {
    const charTrustEvents = trustChanges
      .filter(e => e.payload.characterId === char)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    if (charTrustEvents.length > 0) {
      trustFinal[char] = charTrustEvents[charTrustEvents.length - 1].payload.newTrust ?? 0.5;
    } else {
      trustFinal[char] = 0.5; // default starting trust
    }
  }

  // ── Hidden constraints found ───────────────────────────────────────────────
  const constraintsFound = new Set(
    constraintEvents.map(e => e.payload.constraint ?? '')
  ).size;

  // ── 1. Stakeholder Management (0–100) ─────────────────────────────────────
  // Weighted: avg final trust (40%), breadth (chars contacted ≥4 → 30%), trust recovery (30%)
  const avgTrust = Object.values(trustFinal).reduce((a, b) => a + b, 0) / CHARACTERS.length;
  const charsContacted = new Set(messages.map(e => e.payload.characterId).filter(Boolean)).size;
  const breadthScore = Math.min(charsContacted / 5, 1);

  // Trust recovery: times trust went from <0.45 to ≥0.6
  let recoveryCount = 0;
  const trustByChar: Record<string, number[]> = {};
  for (const e of trustChanges) {
    const c = e.payload.characterId ?? '';
    if (!trustByChar[c]) trustByChar[c] = [];
    trustByChar[c].push(e.payload.newTrust ?? 0.5);
  }
  for (const series of Object.values(trustByChar)) {
    for (let i = 1; i < series.length; i++) {
      if (series[i - 1] < 0.45 && series[i] >= 0.6) recoveryCount++;
    }
  }
  const recoveryScore = Math.min(recoveryCount / 3, 1);

  const stakeholderMgmt = Math.round(
    (avgTrust * 0.4 + breadthScore * 0.3 + recoveryScore * 0.3) * 100
  );

  // ── 2. Communication (0–100) ───────────────────────────────────────────────
  // Total messages sent (up to 20 → 50%), email usage (emails ≥ 5 → 30%), response to initial emails (20%)
  const totalMessages = messages.length;
  const emailMessages = messages.filter(e => e.payload.channel === 'email').length;
  const volumeScore = Math.min(totalMessages / 20, 1);
  const emailScore = Math.min(emailMessages / 5, 1);
  // Responded to initial setup emails quickly (first message within 2 min → bonus)
  const firstMsgTime = messages[0]?.payload.elapsedSeconds ?? 999;
  const responsiveness = firstMsgTime < 120 ? 1 : firstMsgTime < 300 ? 0.7 : 0.4;

  const communication = Math.round(
    (volumeScore * 0.5 + emailScore * 0.3 + responsiveness * 0.2) * 100
  );

  // ── 3. Strategic Thinking (0–100) ─────────────────────────────────────────
  // Hidden constraints found (40%), plan score if available (40%), OKR progress (20%)
  const constraintScore = constraintsFound / HIDDEN_CONSTRAINTS.length;
  const planScore = (completedEvent?.payload.planScore ?? 0) / 100;
  const okrProgress = (completedEvent?.payload.finalOkrProgress ?? 0) / 100;

  const strategicThinking = Math.round(
    (constraintScore * 0.4 + planScore * 0.4 + okrProgress * 0.2) * 100
  );

  // ── 4. Conflict Resolution (0–100) ────────────────────────────────────────
  // Recovery from low trust (50%), avoided consecutive low-trust moments (30%), chaos handled (20%)
  const totalLowTrustMoments = trustChanges.filter(e => (e.payload.newTrust ?? 1) < 0.4).length;
  const conflictAvoidance = Math.max(0, 1 - totalLowTrustMoments / 5);
  const chaosEvents = events.filter(e => e.type === 'chaos_triggered').length;
  const chaosHandled = chaosEvents > 0 ? Math.min(recoveryCount / chaosEvents, 1) : 1;

  const conflictResolution = Math.round(
    (recoveryScore * 0.5 + conflictAvoidance * 0.3 + chaosHandled * 0.2) * 100
  );

  // ── 5. Prioritisation (0–100) ─────────────────────────────────────────────
  // Correct card sequencing: inprogress → review → done (50%), SSO card done (30%), PM's cards done (20%)
  const correctMoves = cardMoves.filter(e => {
    const { fromCol, toCol } = e.payload;
    // valid progressions
    return (fromCol === 'backlog' && toCol === 'inprogress') ||
           (fromCol === 'inprogress' && toCol === 'review') ||
           (fromCol === 'review' && toCol === 'done');
  }).length;
  const totalMoves = cardMoves.length;
  const sequencingScore = totalMoves > 0 ? Math.min(correctMoves / Math.max(totalMoves, 1), 1) : 0.5;

  const ssoCardDone = cardMoves.some(
    e => e.payload.toCol === 'done' &&
         (e.payload.cardTitle ?? '').toLowerCase().includes('sso')
  );
  const pmCardsDone = cardMoves.filter(e => e.payload.assignee === 'Y' && e.payload.toCol === 'done').length;
  const pmCardsScore = Math.min(pmCardsDone / 3, 1);

  const prioritisation = Math.round(
    (sequencingScore * 0.5 + (ssoCardDone ? 1 : 0) * 0.3 + pmCardsScore * 0.2) * 100
  );

  // ── 6. Execution Speed (0–100) ────────────────────────────────────────────
  // Session completed under 45 min → 100, 60 min → 70, 90 min → 40, >90 min → 20
  // Bonus: first hidden constraint found within 15 min
  const sessionMinutes = sessionDurationSeconds / 60;
  let speedScore: number;
  if (sessionMinutes <= 45) speedScore = 1;
  else if (sessionMinutes <= 60) speedScore = 0.7;
  else if (sessionMinutes <= 90) speedScore = 0.4;
  else speedScore = 0.2;

  const firstConstraintTime = constraintEvents[0]?.payload.elapsedSeconds ?? 9999;
  const earlyDiscovery = firstConstraintTime < 900 ? 1 : 0; // within 15 min

  const executionSpeed = Math.round((speedScore * 0.8 + earlyDiscovery * 0.2) * 100);

  // ── Composite ─────────────────────────────────────────────────────────────
  const compositeScore = Math.round(
    (stakeholderMgmt * 0.20 +
     communication   * 0.15 +
     strategicThinking * 0.25 +
     conflictResolution * 0.15 +
     prioritisation  * 0.15 +
     executionSpeed  * 0.10)
  );

  return {
    stakeholderMgmt: clamp(stakeholderMgmt),
    communication:   clamp(communication),
    strategicThinking: clamp(strategicThinking),
    conflictResolution: clamp(conflictResolution),
    prioritisation:  clamp(prioritisation),
    executionSpeed:  clamp(executionSpeed),
    compositeScore:  clamp(compositeScore),
    constraintsFound,
    trustFinal,
  };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}
