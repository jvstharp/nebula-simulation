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

export type SimulationStage = 'planning' | 'execution' | 'reporting';

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
}

export interface SkillScores {
  prioritisation: number;
  stakeholderMgmt: number;
  communication: number;
  conflictResolution: number;
  strategicThinking: number;
  executionSpeed: number;
}

export type Screen = 'desktop' | 'login' | 'register' | 'onboarding' | 'assessment' | 'dashboard' | 'simulation' | 'replay' | 'progress' | 'admin' | 'discovery' | 'browser' | 'vault' | 'profile' | 'controlpanel';

export type AppTab = 'browser' | 'meetings' | 'drive' | 'assistant' | 'project';

export type BrowserTab = 'overview' | 'email' | 'chat' | 'project' | 'calendar' | 'meetings' | 'assistant';
