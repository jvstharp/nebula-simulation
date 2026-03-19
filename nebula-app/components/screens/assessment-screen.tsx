"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ASSESSMENT_QUESTIONS } from "@/lib/data";

const T = {
  bg:       '#121212',
  surface:  '#212121',
  surface2: '#2e2c2e',
  text:     '#efefef',
  muted:    '#afa39f',
  border:   'rgba(255,255,255,0.04)',
  border2:  'rgba(255,255,255,0.08)',
  primary:  '#147b58',
  shadow1:  '0 1px 2px rgba(0,0,0,0.6)',
  shadow2:  '0 6px 18px rgba(0,0,0,0.7)',
} as const;

export function AssessmentScreen() {
  const { setScreen, setAssessmentAnswer, startSession, setActiveBrowserTab } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const q = ASSESSMENT_QUESTIONS[current];
  const isLast = current === ASSESSMENT_QUESTIONS.length - 1;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setAssessmentAnswer(current, selected);

    if (isLast) {
      startSession();
      setActiveBrowserTab('overview');
      setScreen('browser');
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const handleSkip = () => {
    startSession();
    setActiveBrowserTab('overview');
    setScreen('browser');
  };

  const progress = (current / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div style={{
      background: T.bg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '30%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,123,88,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,195,119,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 540 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 99,
            background: T.surface,
            border: `1px solid ${T.border2}`,
            fontSize: 11,
            color: T.muted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 24,
            boxShadow: T.shadow1,
          }}>
            Skill Baseline Assessment
          </div>

          <h2 style={{
            fontSize: 22,
            fontWeight: 600,
            color: T.text,
            marginBottom: 24,
            letterSpacing: '-0.01em',
          }}>
            Question {current + 1} of {ASSESSMENT_QUESTIONS.length}
          </h2>

          {/* Progress bar */}
          <div style={{
            height: 3,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 99,
            overflow: 'hidden',
            width: '100%',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: T.primary,
              borderRadius: 99,
              transition: 'width 0.3s ease',
            }} />
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
            {ASSESSMENT_QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i < current
                  ? T.primary
                  : i === current
                  ? T.primary
                  : 'rgba(255,255,255,0.1)',
                opacity: i < current ? 0.5 : 1,
                transition: 'all 0.25s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <p style={{
          fontSize: 17,
          fontWeight: 500,
          color: T.text,
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          {q.question}
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
          {q.options.map((option, i) => {
            const isSelected = selected === i;
            const isHovered = hovered === i && !isSelected;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: isSelected
                    ? `1px solid rgba(20,123,88,0.45)`
                    : isHovered
                    ? `1px solid ${T.border2}`
                    : `1px solid ${T.border}`,
                  background: isSelected
                    ? 'rgba(20,123,88,0.1)'
                    : isHovered
                    ? 'rgba(255,255,255,0.03)'
                    : T.surface,
                  color: isSelected ? T.text : isHovered ? T.text : T.muted,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: T.shadow1,
                }}
              >
                {/* Option letter badge */}
                <span style={{
                  display: 'inline-flex',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: isSelected ? 'none' : `1px solid rgba(255,255,255,0.15)`,
                  background: isSelected ? T.primary : 'transparent',
                  color: isSelected ? '#fff' : T.muted,
                  fontSize: 11,
                  fontWeight: 600,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ lineHeight: 1.5 }}>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleSkip}
            style={{
              fontSize: 12,
              color: 'rgba(175,163,159,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = T.muted)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(175,163,159,0.35)')}
          >
            Skip assessment
          </button>
          <button
            onClick={handleNext}
            disabled={selected === null}
            style={{
              padding: '10px 28px',
              borderRadius: 10,
              background: T.primary,
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: selected === null ? 'not-allowed' : 'pointer',
              opacity: selected === null ? 0.4 : 1,
              fontFamily: 'inherit',
              transition: 'background 0.15s, opacity 0.15s',
            }}
            onMouseEnter={e => { if (selected !== null) (e.currentTarget as HTMLButtonElement).style.background = '#0f5e43'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.primary; }}
          >
            {isLast ? 'Start simulation →' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  );
}
