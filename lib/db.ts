import { supabase } from './supabase';
import { SessionState, Message, ChaosEvent, PortfolioCaseStudy } from './types';

export async function createDbSession(
  userId: string,
  session: SessionState
): Promise<string | null> {
  const { data, error } = await supabase
    .from('sim_sessions')
    .insert({
      id: session.id,
      userId,
      scenarioId: session.scenarioId,
      status: session.status,
      stage: session.simulationStage,
      elapsedSeconds: session.elapsedSeconds,
      stateJson: {
        difficulty: session.difficulty,
        sessionNumber: session.sessionNumber,
        credits: session.credits,
        compositeScore: session.compositeScore,
        startedAt: session.startedAt,
      },
    })
    .select('id')
    .single();

  if (error) {
    console.error('[db] createDbSession error:', error.message);
    return null;
  }
  return data.id;
}

export async function saveMessage(
  dbSessionId: string,
  _userId: string,
  msg: Message
): Promise<void> {
  const { error } = await supabase.from('sim_messages').insert({
    sessionId: dbSessionId,
    from: msg.from,
    to: msg.to,
    channel: msg.channel,
    subject: msg.subject ?? null,
    body: msg.body,
    read: msg.read,
  });
  if (error) console.error('[db] saveMessage error:', error.message);
}

export async function saveSessionEvent(
  dbSessionId: string,
  _userId: string,
  event: ChaosEvent
): Promise<void> {
  const { error } = await supabase.from('session_events').insert({
    sessionId: dbSessionId,
    type: event.type,
    payload: {
      title: event.title,
      description: event.description,
      severity: event.severity,
      tier: event.tier,
      acknowledged: event.acknowledged,
      firedAt: event.firedAt,
    },
  });
  if (error) console.error('[db] saveSessionEvent error:', error.message);
}

export async function completeDbSession(
  dbSessionId: string,
  _userId: string,
  session: SessionState,
  portfolio: PortfolioCaseStudy
): Promise<void> {
  const skills = session.skillScores;

  const [sessionUpdate, resultsInsert, portfolioInsert] = await Promise.all([
    supabase
      .from('sim_sessions')
      .update({
        status: 'completed',
        stage: session.simulationStage,
        elapsedSeconds: session.elapsedSeconds,
        stateJson: {
          difficulty: session.difficulty,
          sessionNumber: session.sessionNumber,
          credits: session.credits,
          compositeScore: session.compositeScore,
          unlockedSecrets: session.unlockedSecrets,
          firedCascades: session.firedCascades,
          firedChaosIds: session.firedChaosIds,
          okrs: session.okrs,
          dynamicAnalytics: session.dynamicAnalytics,
          lastContactedAt: session.lastContactedAt,
          completedAt: new Date(),
        },
      })
      .eq('id', dbSessionId),

    supabase.from('session_results').upsert({
      sessionId: dbSessionId,
      compositeScore: session.compositeScore,
      prioritisation: skills.prioritisation,
      stakeholderMgmt: skills.stakeholderMgmt,
      communication: skills.communication,
      conflictResolution: skills.conflictResolution,
      strategicThinking: skills.strategicThinking,
      executionSpeed: skills.executionSpeed,
      debrief: session.debrief ?? [],
      decisionHistory: session.decisionHistory,
    }, { onConflict: 'sessionId' }),

    supabase.from('portfolios').upsert({
      sessionId: dbSessionId,
      status: portfolio.status,
      scenarioName: portfolio.scenarioName,
      scenarioSummary: portfolio.scenarioSummary,
      challenge: portfolio.challenge,
      keyDecisions: portfolio.keyDecisions,
      skillScores: portfolio.skillsAboveBaseline,
      performanceNarrative: portfolio.performanceNarrative,
      verificationId: portfolio.verificationId,
    }, { onConflict: 'sessionId' }),
  ]);

  if (sessionUpdate.error) console.error('[db] completeDbSession session update error:', sessionUpdate.error.message);
  if (resultsInsert.error) console.error('[db] completeDbSession results error:', resultsInsert.error.message);
  if (portfolioInsert.error) console.error('[db] completeDbSession portfolio error:', portfolioInsert.error.message);
}
