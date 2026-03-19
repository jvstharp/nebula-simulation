"use client";
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

const APP_SCREENS = new Set(['browser', 'vault', 'discovery', 'profile']);

export default function Home() {
  const { screen } = useAppStore();
  const isApp = APP_SCREENS.has(screen);

  return (
    <>
      {screen === 'login'      && <LoginScreen />}
      {screen === 'register'   && <LoginScreen />}
      {screen === 'onboarding' && <OnboardingScreen />}
      {screen === 'assessment' && <AssessmentScreen />}
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
    </>
  );
}
