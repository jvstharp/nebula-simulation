import type { SerializedCascadeEvent } from './types';

export function hydrateCascadeEvents(
  serialized: SerializedCascadeEvent[]
): Array<{
  id: string;
  trigger: (session: { elapsedSeconds: number; lastContactedAt: Record<string, number>; firedCascades: string[] }) => boolean;
  characterId: string;
  channel: 'email' | 'chat';
  subject?: string;
  message: string;
}> {
  return serialized.map(event => ({
    id: event.id,
    characterId: event.characterId,
    channel: event.channel,
    subject: event.subject,
    message: event.message,
    trigger: (session) => {
      if (session.firedCascades.includes(event.id)) return false;

      const config = event.triggerConfig;
      switch (event.triggerType) {
        case 'time_elapsed':
          return session.elapsedSeconds >= ((config.minElapsedSeconds as number) ?? 300);

        case 'character_ignored': {
          const charId = (config.characterId as string) ?? event.characterId;
          const lastContact = session.lastContactedAt[charId] ?? 0;
          const ignoreThreshold = (config.ignoreThresholdSeconds as number) ?? 240;
          return session.elapsedSeconds > 60 &&
            (session.elapsedSeconds - lastContact) > ignoreThreshold;
        }

        case 'trust_threshold':
          return session.elapsedSeconds >= ((config.minElapsedSeconds as number) ?? 120);

        case 'card_state':
          return session.elapsedSeconds >= ((config.minElapsedSeconds as number) ?? 300);

        default:
          return false;
      }
    },
  }));
}
