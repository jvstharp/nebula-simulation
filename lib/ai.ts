import type { Character, KanbanColumn, Message, SessionState } from './types';

export type TriggerType =
  | 'message_reply'
  | 'card_moved_to_inprogress'
  | 'card_moved_to_review'
  | 'card_moved_to_done'
  | 'card_advanced_autonomous';

const ASSIGNEE_INITIAL: Record<string, string> = {
  marcus: 'M',
  tom: 'T',
  priya: 'P',
  sarah: 'S',
  elena: 'E',
};

const COL_NAMES: Record<string, string> = {
  backlog: 'Backlog',
  inprogress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export interface CharacterReplyResult {
  reply: string | null;
  // null means the API call failed or the response could not be parsed — use fallback
  trustDelta: number | null;
}

export async function generateCharacterReply(
  characterId: string,
  triggerType: TriggerType,
  triggerBody: string,
  state: {
    character: Character;
    recentMessages: Message[];
    session: SessionState;
    kanbanColumns: KanbanColumn[];
  }
): Promise<CharacterReplyResult> {
  const assigneeInitial = ASSIGNEE_INITIAL[characterId];

  const myCards = state.kanbanColumns.flatMap(col =>
    col.cards
      .filter(c => c.assignee === assigneeInitial)
      .map(c => ({
        title: c.title,
        tag: c.tag,
        column: COL_NAMES[col.id] ?? col.id,
        blocked: !!c.blocked,
      }))
  );

  const recent = state.recentMessages
    .filter(m => m.from === characterId || m.to === characterId)
    .slice(-8)
    .map(m => ({
      from: m.from === 'user' ? 'PM' : state.character.name,
      body: m.body,
      channel: m.channel,
    }));

  try {
    const res = await fetch('/api/character-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        triggerType,
        triggerBody,
        recentMessages: recent,
        characterState: {
          name: state.character.name,
          title: state.character.title,
          personality: state.character.personality,
          visibleAgenda: state.character.visibleAgenda,
          trust: state.character.trust,
          emotion: state.character.emotion,
          online: state.character.online,
        },
        simulationState: {
          stage: state.session.simulationStage,
          elapsedSeconds: state.session.elapsedSeconds,
          okrs: state.session.okrs.map(o => ({
            title: o.title,
            progress: o.progress,
            status: o.status,
          })),
          myKanbanCards: myCards,
          chaosActive: state.session.chaosMode === 'chaos',
        },
      }),
    });

    if (!res.ok) return { reply: null, trustDelta: null };
    const data = await res.json();
    return {
      reply: data.reply ?? null,
      trustDelta: typeof data.trustDelta === 'number' ? data.trustDelta : null,
    };
  } catch {
    return { reply: null, trustDelta: null };
  }
}
