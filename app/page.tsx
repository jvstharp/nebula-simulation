"use client";
export const dynamic = 'force-dynamic';
import { useAppStore } from "@/lib/store";
import { LoginScreen } from "@/components/screens/login-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { AssessmentScreen } from "@/components/screens/assessment-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { ReplayScreen } from "@/components/screens/replay-screen";
import { ProgressScreen } from "@/components/screens/progress-screen";
import { DesktopScreen } from "@/components/screens/desktop-screen";
import { DiscoveryScreen } from "@/components/screens/discovery-screen";
import { BrowserScreen } from "@/components/screens/browser-screen";
import { VaultScreen } from "@/components/screens/vault-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { MissionBriefingScreen } from "@/components/screens/mission-briefing-screen";
import { OfficeIntroScreen } from "@/components/screens/office-intro-screen";
import { PrologueScreen } from "@/components/screens/prologue-screen";
import { BoardMeetingScreen } from "@/components/screens/board-meeting-screen";
import { ControlPanelPopover } from "@/components/screens/control-panel-screen";
import { ChaosOverlay } from "@/components/screens/chaos-overlay";

/* ── Trust delta toast ─────────────────────────────────────────────────────── */
function TrustToast() {
  const { trustToast } = useAppStore();
  if (!trustToast) return null;
  const positive = trustToast.delta >= 0;
  const color = positive ? '#22c55e' : '#ef4444';
  const pts = Math.abs(Math.round(trustToast.delta * 100));
  const newPct = Math.round(trustToast.newTrust * 100);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 24, zIndex: 2500,
      background: 'rgba(12,12,18,0.96)',
      border: `1px solid ${color}44`,
      borderRadius: 12, padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 24px ${color}12`,
      backdropFilter: 'blur(14px)',
      animation: 'fadeIn 0.2s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 1 }}>
          {trustToast.name}
        </div>
        <div style={{ fontSize: 11, color, fontWeight: 700 }}>
          {positive ? '↑' : '↓'} Trust {positive ? '+' : '-'}{pts}pt · now {newPct}%
        </div>
      </div>
    </div>
  );
}

/* ── Constraint unlock toasts ─────────────────────────────────────────────── */
function ConstraintToasts() {
  const { constraintToasts, dismissConstraintToast } = useAppStore();
  if (!constraintToasts.length) return null;
  return (
    <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 2600, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {constraintToasts.map((t, idx) => (
        <div key={t.id} style={{
          background: 'rgba(12,12,18,0.97)',
          border: '1px solid rgba(20,123,88,0.5)',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 20px rgba(20,123,88,0.12)',
          backdropFilter: 'blur(14px)',
          animation: 'slideInRight 0.25s ease',
          maxWidth: 280,
          marginTop: idx === 0 ? 0 : 0,
          pointerEvents: 'all',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(20,123,88,0.15)', border: '1px solid rgba(20,123,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🔓</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#147b58', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Constraint Unlocked</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 1 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(175,163,159,0.7)' }}>via {t.characterName}</div>
          </div>
          <button onClick={() => dismissConstraintToast(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(175,163,159,0.4)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        </div>
      ))}
      <style>{`@keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

const APP_SCREENS = new Set(['browser', 'vault', 'discovery', 'profile']);

export default function Home() {
  const { screen } = useAppStore();
  const isApp = APP_SCREENS.has(screen);

  return (
    <>
      {screen === 'login'      && <LoginScreen />}
      {screen === 'register'   && <LoginScreen />}
      {screen === 'onboarding'       && <OnboardingScreen />}
      {screen === 'mission-briefing' && <MissionBriefingScreen />}
      {screen === 'assessment'       && <AssessmentScreen />}
      {screen === 'office-intro'     && <OfficeIntroScreen />}
      {screen === 'prologue'         && <PrologueScreen />}
      {screen === 'board-meeting'    && <BoardMeetingScreen />}
      {/* Desktop is always the background when in desktop or app mode */}
      {(screen === 'desktop' || isApp) && <DesktopScreen />}
      {screen === 'dashboard'  && <DashboardScreen />}
      {screen === 'replay'     && <ReplayScreen />}
      {screen === 'progress'   && <ProgressScreen />}
      {/* Floating app windows — rendered on top of desktop */}
      {isApp && screen === 'discovery' && <DiscoveryScreen />}
      {isApp && screen === 'browser'   && <BrowserScreen />}
      {isApp && screen === 'vault'     && <VaultScreen />}
      {isApp && screen === 'profile'   && <ProfileScreen />}
      <ControlPanelPopover />
      <ChaosOverlay />
      <TrustToast />
      <ConstraintToasts />
    </>
  );
}
