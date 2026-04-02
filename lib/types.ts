export type CharacterId = 'sarah' | 'marcus' | 'priya' | 'tom' | 'elena';

export interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  assignee: string; // 'Y' | 'M' | 'S' | 'P' | 'T' | 'E'
  priority: 'high' | 'med' | 'low';
  notes: string;
  linkedOkr?: string;
  blocked?: boolean;
}

export interface KanbanColumn {
  id: string;
  label: string;
  color: string;
  cards: KanbanCard[];
}

export interface Character {
  id: string; // CharacterId for Nexus; any string slug for other companies
  name: string;
  title: string;
  avatar: string;
  color: string;
  personality: string;
  visibleAgenda: string;
  trust: number;
  emotion: 'neutral' | 'frustrated' | 'cooperative' | 'disengaged' | 'alarmed';
  online: boolean;
}

export interface Message {
  id: string;
  from: string; // CharacterId | 'user' for Nexus; any character slug for other companies
  to: string;
  channel: 'email' | 'chat';
  subject?: string;
  body: string;
  timestamp: Date;
  read: boolean;
}


export interface OKR {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'complete' | 'missed';
  progress: number;
}

export interface ChaosEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tier: 1 | 2 | 3;
  firedAt: Date;
  acknowledged: boolean;
}

export interface PortfolioCaseStudy {
  sessionId: string;
  sessionNumber: 1 | 2 | 3;
  scenarioName: string;
  sessionDate: Date;
  userName: string;
  scenarioSummary: string;
  challenge: string;
  keyDecisions: { bullet: string }[];
  skillsAboveBaseline: { dimension: string; score: number; baselineDelta: number }[];
  performanceNarrative: string;
  verificationId: string;
  status: 'generating' | 'ready' | 'failed';
}

export interface AccessibilityPrefs {
  reduceVisualEffects: boolean;
  muteSounds: boolean;
}

export interface SimPreferences {
  displayName: string;
  experienceLevel: string;
  preferredIndustry: string;
  // legacy (used by mission-briefing-screen)
  role?: string;
  industry?: string;
  // extended profile fields (collected in AI onboarding)
  roleType?: 'student' | 'professional';
  institution?: string;
  domain?: string;
  additionalContext?: string;
}

export type SimulationStage = 'planning' | 'execution' | 'reporting';

export type DifficultyLevel = 'guided' | 'standard' | 'pressure';

export interface DebriefItem {
  timestampSeconds: number;
  decision: string;
  impact: string;
  coachNote: string;
  skill: keyof SkillScores;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DecisionNode {
  id: string;
  timestampSeconds: number;
  characterId: CharacterId;
  userMessage: string;
  characterReply: string;
  trustBefore: number;
  trustAfter: number;
}

export interface DynamicAnalytics {
  nps: number;
  trialConversion: number;
  velocity: number;
  churn: number;
  dau: number;
}

export interface SessionState {
  id: string;
  scenarioId: string;
  sessionNumber: 1 | 2 | 3;
  status: 'active' | 'paused' | 'completed';
  startedAt: Date;
  elapsedSeconds: number;
  okrs: OKR[];
  chaosLog: ChaosEvent[];
  chaosMode: 'normal' | 'chaos';
  chaosTier: 1 | 2 | 3 | null;
  chaosResolving: boolean;
  portfolio: PortfolioCaseStudy | null;
  credits: number;
  compositeScore: number;
  skillScores: SkillScores;
  simulationStage: SimulationStage;
  planScore: number | null;
  planFeedback: string | null;
  planUnlockedAt: Date | null;
  // Dynamic features
  difficulty: DifficultyLevel;
  unlockedSecrets: string[];
  firedCascades: string[];
  firedChaosIds: string[];
  lastContactedAt: Partial<Record<CharacterId, number>>;
  decisionHistory: DecisionNode[];
  dynamicAnalytics: DynamicAnalytics;
  debrief: DebriefItem[] | null;
}

export interface SkillScores {
  prioritisation: number;
  stakeholderMgmt: number;
  communication: number;
  conflictResolution: number;
  strategicThinking: number;
  executionSpeed: number;
}

export interface SimCompany {
  id: string;           // slug, e.g. "meridian-health"
  name: string;         // "Meridian Health"
  industry: string;     // "Digital Health"
  size: string;         // "220 people, Series B"
  tagline: string;      // one-line mission
  challenge: string;    // the PM challenge the user will face (2-3 sentences)
  why: string;          // why it matches the user's profile (1 sentence)
  videoKeyword: string; // used for Pexels video search e.g. "hospital technology"
}

export interface UserProfile {
  role: string;
  experienceLevel: 'junior' | 'mid' | 'senior';
  domain: string;
  chosenCompany: SimCompany | null;
}

export interface CompanyCatalogEntry {
  company: SimCompany;
  characters: Character[];
  initialMessages: Message[];
  initialOKRs: OKR[];
  initialKanban: KanbanColumn[];
  prologueMessages: { from: string; delay: number; text: string }[];
  cascadeEvents: Array<{
    id: string;
    trigger: (session: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) => boolean;
    characterId: string;
    channel: 'email' | 'chat';
    subject?: string;
    message: string;
  }>;
  characterSecrets: Record<string, { threshold: number; secretId: string; message: string }[]>;
  cardReactionMap: Record<string, {
    toInProgress: { high: string[]; mid: string[]; low: string[] };
    toReview:     { high: string[]; mid: string[]; low: string[] };
    toDone: { natural: string[]; earlyClose: string[]; low: string[] };
    toBacklog: string[];
  }>;
  replyMap: Record<string, string[]>;
  constraintPatterns: Record<string, Array<{ keywords: string[]; constraint: string }>>;
  constraintLabels: Record<string, string>;
}

export type Screen = 'desktop' | 'login' | 'register' | 'onboarding' | 'assessment' | 'mission-briefing' | 'office-intro' | 'prologue' | 'board-meeting' | 'dashboard' | 'simulation' | 'replay' | 'progress' | 'admin' | 'discovery' | 'browser' | 'vault' | 'profile' | 'controlpanel' | 'company-overview';

export type AppTab = 'browser' | 'meetings' | 'drive' | 'assistant' | 'project';

export type BrowserTab = 'overview' | 'email' | 'chat' | 'project' | 'calendar' | 'meetings' | 'assistant';
