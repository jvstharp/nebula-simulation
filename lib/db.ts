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
      user_id: userId,
      scenario_id: session.scenarioId,
      session_number: session.sessionNumber,
      status: session.status,
      difficulty: session.difficulty,
      simulation_stage: session.simulationStage,
      elapsed_seconds: session.elapsedSeconds,
      credits: session.credits,
      composite_score: session.compositeScore,
      chaos_mode: session.chaosMode,
      okrs: session.okrs,
      dynamic_analytics: session.dynamicAnalytics,
      last_contacted_at: session.lastContactedAt,
      started_at: session.startedAt,
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
  userId: string,
  msg: Message
): Promise<void> {
  const { error } = await supabase.from('sim_messages').insert({
    session_id: dbSessionId,
    user_id: userId,
    from_id: msg.from,
    to_id: msg.to,
    channel: msg.channel,
    subject: msg.subject ?? null,
    body: msg.body,
    read: msg.read,
    timestamp: msg.timestamp,
  });
  if (error) console.error('[db] saveMessage error:', error.message);
}

export async function saveSessionEvent(
  dbSessionId: string,
  userId: string,
  event: ChaosEvent
): Promise<void> {
  const { error } = await supabase.from('session_events').insert({
    session_id: dbSessionId,
    user_id: userId,
    event_type: event.type,
    title: event.title,
    description: event.description,
    severity: event.severity,
    tier: event.tier,
    acknowledged: event.acknowledged,
    fired_at: event.firedAt,
  });
  if (error) console.error('[db] saveSessionEvent error:', error.message);
}

export async function completeDbSession(
  dbSessionId: string,
  userId: string,
  session: SessionState,
  portfolio: PortfolioCaseStudy
): Promise<void> {
  const skills = session.skillScores;

  const [sessionUpdate, resultsInsert, portfolioInsert] = await Promise.all([
    supabase
      .from('sim_sessions')
      .update({
        status: 'completed',
        simulation_stage: session.simulationStage,
        elapsed_seconds: session.elapsedSeconds,
        credits: session.credits,
        composite_score: session.compositeScore,
        chaos_mode: session.chaosMode,
        unlocked_secrets: session.unlockedSecrets,
        fired_cascades: session.firedCascades,
        fired_chaos_ids: session.firedChaosIds,
        okrs: session.okrs,
        dynamic_analytics: session.dynamicAnalytics,
        last_contacted_at: session.lastContactedAt,
        completed_at: new Date(),
      })
      .eq('id', dbSessionId),

    supabase.from('session_results').upsert({
      session_id: dbSessionId,
      user_id: userId,
      composite_score: session.compositeScore,
      skill_prioritisation: skills.prioritisation,
      skill_stakeholder_mgmt: skills.stakeholderMgmt,
      skill_communication: skills.communication,
      skill_conflict_resolution: skills.conflictResolution,
      skill_strategic_thinking: skills.strategicThinking,
      skill_execution_speed: skills.executionSpeed,
      debrief: session.debrief ?? [],
      decision_history: session.decisionHistory,
    }),

    supabase.from('portfolios').upsert({
      session_id: dbSessionId,
      user_id: userId,
      session_number: portfolio.sessionNumber,
      scenario_name: portfolio.scenarioName,
      session_date: portfolio.sessionDate,
      user_name: portfolio.userName,
      scenario_summary: portfolio.scenarioSummary,
      challenge: portfolio.challenge,
      key_decisions: portfolio.keyDecisions,
      skills_above_baseline: portfolio.skillsAboveBaseline,
      performance_narrative: portfolio.performanceNarrative,
      verification_id: portfolio.verificationId,
      status: portfolio.status,
    }),
  ]);

  if (sessionUpdate.error) console.error('[db] completeDbSession session update error:', sessionUpdate.error.message);
  if (resultsInsert.error) console.error('[db] completeDbSession results error:', resultsInsert.error.message);
  if (portfolioInsert.error) console.error('[db] completeDbSession portfolio error:', portfolioInsert.error.message);
}
