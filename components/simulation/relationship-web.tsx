'use client';
import { useAppStore } from '@/lib/store';

const CENTER = { x: 260, y: 220 };
const RADIUS = 155;

function trustColor(t: number): string {
  if (t >= 0.70) return '#22c55e';
  if (t >= 0.50) return '#f59e0b';
  return '#ef4444';
}

function trustStroke(t: number): number {
  return 1 + t * 4;
}

export function RelationshipWeb() {
  const { characters, user, session, activeCatalog } = useAppStore();

  const userNode = { x: CENTER.x, y: CENTER.y };

  // Compute positions dynamically from active character list
  const nodePositions: Record<string, { x: number; y: number }> = {};
  characters.forEach((char, i) => {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / characters.length);
    nodePositions[char.id] = {
      x: CENTER.x + RADIUS * Math.cos(angle),
      y: CENTER.y + RADIUS * Math.sin(angle),
    };
  });

  // Use catalog lateral trust if available, else empty
  const lateralTrust = (activeCatalog as any)?.lateralTrust ?? [];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginBottom: 12, textAlign: 'center' }}>
        TRUST NETWORK — LIVE
      </div>

      <svg width={520} height={440} viewBox="0 0 520 440" style={{ maxWidth: '100%' }}>
        {/* Lateral edges (character↔character) */}
        {lateralTrust.map((edge: { from: string; to: string; trust: number }, i: number) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to) return null;
          return (
            <line
              key={`lateral-${i}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={trustColor(edge.trust)}
              strokeWidth={trustStroke(edge.trust) * 0.5}
              strokeOpacity={0.25}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* User→character edges */}
        {characters.map(char => {
          const pos = nodePositions[char.id];
          if (!pos) return null;
          return (
            <line
              key={`user-${char.id}`}
              x1={userNode.x} y1={userNode.y}
              x2={pos.x} y2={pos.y}
              stroke={trustColor(char.trust)}
              strokeWidth={trustStroke(char.trust)}
              strokeOpacity={0.65}
            />
          );
        })}

        {/* Character nodes */}
        {characters.map(char => {
          const pos = nodePositions[char.id];
          if (!pos) return null;
          return (
            <g key={char.id}>
              <circle
                cx={pos.x} cy={pos.y} r={24}
                fill="#0a0a14"
                stroke={trustColor(char.trust)}
                strokeWidth={2}
                strokeOpacity={0.8}
              />
              <image
                href={char.avatar}
                x={pos.x - 22} y={pos.y - 22}
                width={44} height={44}
                clipPath={`url(#clip-${char.id})`}
              />
              <clipPath id={`clip-${char.id}`}>
                <circle cx={pos.x} cy={pos.y} r={22} />
              </clipPath>

              {/* Trust % label */}
              <text
                x={pos.x} y={pos.y + 38}
                textAnchor="middle" fontSize={10}
                fill={trustColor(char.trust)} fontWeight={600}
              >
                {Math.round(char.trust * 100)}%
              </text>
              <text
                x={pos.x} y={pos.y + 52}
                textAnchor="middle" fontSize={9}
                fill="rgba(255,255,255,0.45)"
              >
                {char.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* User center node */}
        <circle cx={userNode.x} cy={userNode.y} r={26} fill="#0a0a14" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
        {user?.avatar ? (
          <>
            <image
              href={user.avatar}
              x={userNode.x - 24} y={userNode.y - 24}
              width={48} height={48}
              clipPath="url(#clip-user)"
            />
            <clipPath id="clip-user"><circle cx={userNode.x} cy={userNode.y} r={24} /></clipPath>
          </>
        ) : (
          <text x={userNode.x} y={userNode.y + 4} textAnchor="middle" fontSize={11} fill="#fff" fontWeight={700}>
            {user?.name?.[0] ?? 'Y'}
          </text>
        )}
        <text x={userNode.x} y={userNode.y + 42} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.5)">
          You
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
        {[
          { color: '#22c55e', label: 'High trust (70%+)' },
          { color: '#f59e0b', label: 'Building (50–70%)' },
          { color: '#ef4444', label: 'Low (<50%)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 2.5, background: item.color, borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Secrets unlocked count */}
      {session && (
        <div style={{ marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
          ✦ {session.unlockedSecrets.length} of {characters.length} hidden intel items unlocked
        </div>
      )}
    </div>
  );
}
