"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { experienceToDifficulty } from "@/lib/types";
import { COMPANY_CATALOG } from "@/lib/data";

const T = {
  bg:      '#121212',
  surface: '#1c1c1c',
  text:    '#efefef',
  muted:   '#afa39f',
  border:  'rgba(255,255,255,0.07)',
  primary: '#147b58',
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(175,163,159,0.5)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

export function CompanyOverviewScreen() {
  const { userProfile, setOnboardingStep, setScreen, setScenarioLoading, startDynamicSession } = useAppStore();
  const company = userProfile?.chosenCompany;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoCredit, setVideoCredit] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [entered, setEntered] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setEntered(true);
    if (!company) return;
    const keyword = encodeURIComponent(company.videoKeyword ?? 'modern office technology');
    fetch(`/api/onboarding/video?keyword=${keyword}`)
      .then(r => r.json())
      .then(data => { if (data.url) { setVideoUrl(data.url); setVideoCredit(data.credit ?? ''); } })
      .catch(() => setVideoError(true));
  }, [company]);

  const handleContinue = async () => {
    if (!company || generating) return;
    setGenerating(true);
    setScenarioLoading(true);
    setGenerationError(null);

    try {
      // Get hardcoded characters from catalog if available
      const catalogEntry = COMPANY_CATALOG[company.id];
      const characters = catalogEntry?.characters ?? undefined;
      const difficulty = experienceToDifficulty(userProfile?.experienceLevel ?? 'mid');
      const roleTitle = userProfile?.roleTitle || 'Product Manager';

      const res = await fetch('/api/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: company.id,
          domain: 'pm',
          difficulty,
          roleTitle,
          characters,
        }),
      });

      if (!res.ok) throw new Error('Scenario generation failed');

      const data = await res.json();
      if (data.scenario) {
        startDynamicSession(data.scenario, data.scenarioId);
        setScenarioLoading(false);
        // Go to team profiles step
        setOnboardingStep(1);
        setScreen('onboarding');
      } else {
        throw new Error('No scenario returned');
      }
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate scenario');
      setScenarioLoading(false);
      setGenerating(false);
    }
  };

  const goToTeam = () => {
    setOnboardingStep(1);
    setScreen('onboarding');
  };

  if (!company) {
    // No company selected — skip straight to team
    goToTeam();
    return null;
  }

  return (
    <div style={{
      background: T.bg, minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      opacity: entered ? 1 : 0, transition: 'opacity 0.4s ease',
    }}>

      {/* Video hero */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '45vh', overflow: 'hidden', background: '#0a0a0a', flexShrink: 0 }}>
        {videoUrl && !videoError ? (
          <video
            src={videoUrl}
            autoPlay muted loop playsInline
            onError={() => setVideoError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>🏢</div>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(18,18,18,0.85) 100%)' }} />

        {/* Company name overlay */}
        <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${T.primary}22`, border: `1px solid ${T.primary}44`, borderRadius: 6, padding: '4px 10px', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.primary }}>{company.industry}</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{company.name}</h1>
        </div>

        {videoCredit && (
          <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{videoCredit}</div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '28px 24px 48px', maxWidth: 600, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.015em' }}>{company.name}</div>
            <div style={{ fontSize: 11, color: T.muted, background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 10px', whiteSpace: 'nowrap' }}>{company.size}</div>
          </div>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>&ldquo;{company.tagline}&rdquo;</p>
        </div>

        {/* Challenge */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 18px' }}>
          <SectionLabel>Your challenge</SectionLabel>
          <p style={{ fontSize: 14, color: T.text, lineHeight: 1.7, margin: 0 }}>{company.challenge}</p>
        </div>

        {/* Why it fits */}
        <div style={{ background: `${T.primary}0c`, border: `1px solid ${T.primary}25`, borderRadius: 12, padding: '16px 18px' }}>
          <SectionLabel>Why this fits you</SectionLabel>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, margin: 0 }}>{company.why}</p>
        </div>

        {/* Error message */}
        {generationError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px' }}>
            <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>Failed to generate your case study. Please try again.</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <button
            onClick={handleContinue}
            disabled={generating}
            style={{
              width: '100%', padding: '14px 28px', borderRadius: 12, background: T.primary,
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: generating ? 'wait' : 'pointer', fontFamily: 'inherit',
              letterSpacing: '-0.01em', opacity: generating ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
            }}>
            {generating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Generating your case study...
              </span>
            ) : 'Meet the team →'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(175,163,159,0.35)', marginTop: 12 }}>
            {generating ? 'This takes a few seconds — building a unique scenario for you' : "You'll get to know your colleagues before the simulation starts"}
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
