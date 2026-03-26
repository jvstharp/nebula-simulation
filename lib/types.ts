export type CharacterId = 'sarah' | 'marcus' | 'priya' | 'tom' | 'elena';

export interface Character {
  id: CharacterId;
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
  from: CharacterId | 'user';
  to: CharacterId | 'user';
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

export type Screen = 'desktop' | 'login' | 'register' | 'onboarding' | 'assessment' | 'mission-briefing' | 'office-intro' | 'prologue' | 'board-meeting' | 'dashboard' | 'simulation' | 'replay' | 'progress' | 'admin' | 'discovery' | 'browser' | 'vault' | 'profile' | 'controlpanel';

export type AppTab = 'browser' | 'meetings' | 'drive' | 'assistant' | 'project';

export type BrowserTab = 'overview' | 'email' | 'chat' | 'project' | 'calendar' | 'meetings' | 'assistant';
