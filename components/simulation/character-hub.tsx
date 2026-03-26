"use client";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { TrustMeter } from "@/components/ui/trust-meter";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@/lib/types";

const EMOTION_CONFIG: Record<string, { label: string; badge: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  neutral: { label: 'Neutral', badge: 'default' },
  frustrated: { label: 'Frustrated', badge: 'warning' },
  cooperative: { label: 'Collaborative', badge: 'success' },
  disengaged: { label: 'Disengaged', badge: 'danger' },
  alarmed: { label: 'ALARMED', badge: 'danger' },
};

function CharCard({ char }: { char: Character }) {
  const { setActiveCharacter, activeCharacter } = useAppStore();
  const emo = EMOTION_CONFIG[char.emotion] || EMOTION_CONFIG.neutral;
  const isActive = activeCharacter?.id === char.id;

  return (
    <button
      onClick={() => setActiveCharacter(isActive ? null : char)}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        isActive
          ? 'bg-white/8 border-white/20'
          : 'bg-white/3 border-white/6 hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="relative">
          <Avatar src={char.avatar} name={char.name} color={char.color} size="md" />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#161616] ${char.online ? 'bg-green-400' : 'bg-white/20'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{char.name}</div>
          <div className="text-xs text-white/40 truncate">{char.title}</div>
        </div>
        <Badge variant={emo.badge}>{emo.label}</Badge>
      </div>
      <TrustMeter score={char.trust} name={char.name} />
    </button>
  );
}

export function CharacterHub() {
  const { characters } = useAppStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3">
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">Team Status</h3>
      <div className="space-y-2.5">
        {characters.map(char => <CharCard key={char.id} char={char} />)}
      </div>
    </div>
  );
}
