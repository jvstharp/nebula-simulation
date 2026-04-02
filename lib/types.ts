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

export type Screen = 'desktop' | 'login' | 'register' | 'onboarding' | 'assessment' | 'mission-briefing' | 'office-intro' | 'prologue' | 'board-meeting' | 'dashboard' | 'simulation' | 'replay' | 'progress' | 'admin' | 'discovery' | 'browser' | 'vault' | 'profile' | 'controlpanel' | 'company-overview' | 'domain-selection' | 'enterprise-dashboard';

export type AppTab = 'browser' | 'meetings' | 'drive' | 'assistant' | 'project';

export type BrowserTab = 'overview' | 'email' | 'chat' | 'project' | 'calendar' | 'meetings' | 'assistant';

// ─── Phase 5: Domains ──────────────────────────────────────────────────────
export type SimDomain = 'pm' | 'consulting' | 'marketing' | 'data_analysis';

export const DOMAIN_LABELS: Record<SimDomain, string> = {
  pm: 'Product Management',
  consulting: 'Consulting',
  marketing: 'Marketing',
  data_analysis: 'Data & Analysis',
};

export const DOMAIN_ROLES: Record<SimDomain, string[]> = {
  pm: ['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'VP Product'],
  consulting: ['Analyst', 'Associate Consultant', 'Senior Consultant', 'Engagement Manager', 'Partner'],
  marketing: ['Marketing Coordinator', 'Brand Manager', 'Growth Lead', 'CMO'],
  data_analysis: ['Data Analyst', 'Senior Analyst', 'Analytics Manager', 'Head of BI'],
};

// ─── Phase 5: Company (DB-backed) ──────────────────────────────────────────
export interface CompanyRecord {
  id: string;
  name: string;
  industry: string;
  domain: SimDomain;
  size: string;
  tagline: string;
  challenge: string;
  videoKeyword: string;
  isStable: boolean;
  stableData: CompanyStableData | null;
  dynamicSeed: CompanyDynamicSeed | null;
  parentIndustry: string | null;
  active: boolean;
}

export interface CompanyStableData {
  orgChart: OrgChartEntry[];
  culture: string;
  marketPosition: string;
  businessPriorities: string[];
  morale: string;
  hiringNeeds: string[];
}

export interface OrgChartEntry {
  id: string;
  name: string;
  title: string;
  reportsTo: string | null;
  personality: string;
  communicationStyle: string;
  goals: string;
  frustrations: string;
  avatar: string;
}

export interface CompanyDynamicSeed {
  scenarioTemplates: string[];
  marketConditions: string[];
  internalPoliticsHooks: string[];
  budgetPressures: string[];
  crossCompanyLinks: string[];
}

// ─── Phase 5: Generated Scenario ────────────────────────────────────────────
export interface GeneratedScenarioRecord {
  id: string;
  companyId: string;
  domain: SimDomain;
  difficulty: DifficultyLevel;
  roleTitle: string;
  scenarioData: GeneratedScenarioData;
  generatedBy: string;
  usageCount: number;
  rating: number | null;
  active: boolean;
}

export interface GeneratedScenarioData {
  company: SimCompany;
  characters: Character[];
  initialMessages: Message[];
  initialOKRs: OKR[];
  initialKanban: KanbanColumn[];
  prologueMessages: { from: string; delay: number; text: string }[];
  cascadeEvents: SerializedCascadeEvent[];
  characterSecrets: Record<string, { threshold: number; secretId: string; message: string }[]>;
  constraintPatterns: Record<string, Array<{ keywords: string[]; constraint: string }>>;
  constraintLabels: Record<string, string>;
  crossCompanyReferences: CrossCompanyReference[];
  domainSpecificContext: DomainContext;
}

export interface SerializedCascadeEvent {
  id: string;
  triggerType: 'time_elapsed' | 'character_ignored' | 'trust_threshold' | 'card_state';
  triggerConfig: Record<string, unknown>;
  characterId: string;
  channel: 'email' | 'chat';
  subject?: string;
  message: string;
}

export interface CrossCompanyReference {
  sourceCompanyId: string;
  targetCompanyId: string;
  characterId: string;
  eventType: 'alumni_reference' | 'competitive_pressure' | 'partnership' | 'market_shift';
  messageTemplate: string;
  triggerCondition: { minElapsedSeconds?: number; minTrust?: number; requiredConstraint?: string };
}

export interface DomainContext {
  domain: SimDomain;
  roleTitle: string;
  primaryMetrics: string[];
  deliverables: string[];
  stakeholderDynamics: string;
  industryContext: string;
}

// ─── Phase 5: User Reputation ───────────────────────────────────────────────
export type ReputationTier = 'newcomer' | 'reliable' | 'trusted' | 'expert';

export interface UserReputationRecord {
  id: string;
  userId: string;
  companyId: string;
  domain: SimDomain;
  sessionsCompleted: number;
  avgComposite: number;
  avgTrust: number;
  bestScore: number;
  totalConstraints: number;
  skillSnapshot: SkillScores;
  reputationTier: ReputationTier;
  lastPlayedAt: Date | null;
}

export function computeReputationTier(avgComposite: number, sessionsCompleted: number): ReputationTier {
  if (sessionsCompleted >= 5 && avgComposite >= 80) return 'expert';
  if (sessionsCompleted >= 3 && avgComposite >= 65) return 'trusted';
  if (sessionsCompleted >= 1 && avgComposite >= 50) return 'reliable';
  return 'newcomer';
}

// ─── Phase 5: Enterprise ────────────────────────────────────────────────────
export type OrgPlan = 'free' | 'pro' | 'enterprise';
export type OrgRole = 'member' | 'manager' | 'admin';

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  plan: OrgPlan;
  maxSeats: number;
  features: Record<string, boolean>;
  branding: { logo?: string; primaryColor?: string; companyName?: string };
}

export interface CohortRecord {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  scenarioIds: string[];
  domains: SimDomain[];
  startsAt: Date | null;
  endsAt: Date | null;
}

export interface CohortMemberProgress {
  userId: string;
  userName: string;
  completedScenarios: number;
  totalScenarios: number;
  avgScore: number;
  skillBreakdown: SkillScores;
  lastActiveAt: Date | null;
}

export interface ManagerDashboardData {
  org: OrganizationRecord;
  cohorts: CohortRecord[];
  totalMembers: number;
  activeThisWeek: number;
  avgOrgScore: number;
  topPerformers: { userId: string; name: string; score: number }[];
  domainBreakdown: Record<SimDomain, { completed: number; avgScore: number }>;
  recentActivity: { userId: string; name: string; company: string; score: number; completedAt: Date }[];
}
