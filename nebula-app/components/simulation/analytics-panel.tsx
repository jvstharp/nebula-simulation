"use client";
import { MOCK_ANALYTICS, MOCK_NEWS } from "@/lib/data";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const CHART_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: i,
  dau: 10000 + Math.random() * 4000,
  churn: 3.5 + Math.random() * 1.5,
}));

function MetricCard({ label, value, delta, unit = '' }: { label: string; value: string | number; delta: number; unit?: string; color?: string }) {
  const positive = delta > 0;
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', padding: 12 }}>
      <div style={{ fontSize: 10, color: 'rgba(175,163,159,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: '#efefef', lineHeight: 1 }}>{value}{unit}</div>
      <div style={{ fontSize: 11, marginTop: 4, color: positive ? '#22c55e' : '#f87171' }}>
        {positive ? '↑' : '↓'} {Math.abs(delta)}{unit === '%' ? 'pp' : '%'}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: 12, gap: 16 }}>
      {/* KPI grid */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(175,163,159,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Key Metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <MetricCard label="Daily Active Users" value={MOCK_ANALYTICS.dau.value.toLocaleString()} delta={MOCK_ANALYTICS.dau.delta} />
          <MetricCard label="Monthly Churn" value={MOCK_ANALYTICS.churn.value} delta={MOCK_ANALYTICS.churn.delta} unit="%" />
          <MetricCard label="NPS Score" value={MOCK_ANALYTICS.nps.value} delta={MOCK_ANALYTICS.nps.delta} />
          <MetricCard label="Sprint Velocity" value={MOCK_ANALYTICS.velocity.value} delta={MOCK_ANALYTICS.velocity.delta} unit="%" />
        </div>
      </div>

      {/* DAU Chart */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(175,163,159,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>DAU Trend (14d)</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', padding: 12, height: 96 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#147b58" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#147b58" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="dau" stroke="#147b58" strokeWidth={1.5} fill="url(#dauGrad)" dot={false} />
              <Tooltip contentStyle={{ background: '#18181c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [Math.round(Number(v)).toLocaleString(), 'DAU']} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* News feed */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(175,163,159,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Industry News</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MOCK_NEWS.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 8, color: '#147b58', flexShrink: 0, marginTop: 3 }}>◆</span>
              <p style={{ fontSize: 11.5, color: 'rgba(175,163,159,0.65)', lineHeight: 1.5, margin: 0 }}>{n}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
