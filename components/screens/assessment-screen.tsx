"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment";

const T = {
  bg:       '#121212',
  surface:  '#212121',
  text:     '#efefef',
  muted:    '#afa39f',
  border:   'rgba(255,255,255,0.04)',
  border2:  'rgba(255,255,255,0.08)',
  primary:  '#147b58',
} as const;

interface Evaluation {
  score: number; feedback: string; needsFollowUp: boolean;
  followUpQuestion: string | null; passed: boolean;
}

function ScoreDots({ score }: { score: number }) {
  const col = score >= 4 ? '#22c55e' : score >= 3 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= score ? col : 'rgba(255,255,255,0.12)' }} />)}
    </div>
  );
}

export function AssessmentScreen() {
  const { setScreen, startSession, setActiveBrowserTab, setAssessmentAnswer } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const q = ASSESSMENT_QUESTIONS[current];
  const isLast = current === ASSESSMENT_QUESTIONS.length - 1;

  const callEvaluate = async (ans: string, followUpQ?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/assessment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q.id, question: q.question, answer: ans, followUpQuestion: followUpQ }),
      });
      const data = await res.json();
      setEvaluation({
        score: data.score ?? 3,
        feedback: data.feedback ?? 'Noted.',
        needsFollowUp: !followUpQ && data.needsFollowUp === true,
        followUpQuestion: data.followUpQuestion ?? null,
        passed: data.passed !== false,
      });
    } catch {
      setEvaluation({ score: 3, feedback: 'Noted.', needsFollowUp: false, followUpQuestion: null, passed: true });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const score = evaluation?.score ?? 3;
    const newScores = [...scores, score];
    setScores(newScores);
    setAssessmentAnswer(current, score);
    if (isLast) { setDone(true); return; }
    setCurrent(c => c + 1);
    setAnswer(''); setFollowUpAnswer(''); setEvaluation(null); setShowFollowUp(false);
  };

  const skip = () => { startSession(); setActiveBrowserTab('overview'); setScreen('browser'); };
  const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;

  if (done) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 99, background: T.surface, border: `1px solid ${T.border2}`, fontSize: 11, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 28 }}>Assessment Complete</div>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{avg>=4?'🎯':avg>=3?'✅':'📋'}</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: T.text, marginBottom: 12, letterSpacing: '-0.02em' }}>
            {avg>=4?'Strong baseline.':avg>=3?'Solid foundation.':'Room to grow.'}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            {scores.map((s,i) => {
              const c = s>=4?'#22c55e':s>=3?'#f59e0b':'#ef4444';
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c}18`, border: `1px solid ${c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: c }}>{s}</div>
                  <span style={{ fontSize: 9.5, color: T.muted }}>Q{i+1}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 36 }}>
            {avg>=4?"Your answers show strong stakeholder instincts and strategic thinking. The team will be watching how you apply this under pressure.":avg>=3?"You have the right instincts in most areas. Watch for moments where the obvious move isn't the right move.":"You have the foundation. The simulation will challenge your assumptions — treat it as a learning environment."}
          </p>
          <button onClick={() => { startSession(); setActiveBrowserTab('overview'); setScreen('browser'); }}
            style={{ padding: '12px 32px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Start simulation →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '25%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(20,123,88,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 99, background: T.surface, border: `1px solid ${T.border2}`, fontSize: 11, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 20 }}>Skill Baseline Assessment</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: T.text, marginBottom: 18, letterSpacing: '-0.01em' }}>Question {current+1} of {ASSESSMENT_QUESTIONS.length}</h2>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(current/ASSESSMENT_QUESTIONS.length)*100}%`, background: T.primary, borderRadius: 99, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Question */}
        <p style={{ fontSize: 17, fontWeight: 500, color: T.text, lineHeight: 1.65, marginBottom: 20 }}>{q.question}</p>

        {/* Idle: show text area */}
        {!loading && !evaluation && (
          <>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Be specific — what would you do and why? (at least 20 characters)"
              rows={5}
              style={{ width: '100%', background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12, padding: '14px 16px', fontSize: 14, color: T.text, resize: 'none' as const, fontFamily: 'inherit', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' as const, marginBottom: 20 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={skip} style={{ fontSize: 12, color: 'rgba(175,163,159,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>Skip assessment</button>
              <button onClick={() => callEvaluate(answer)} disabled={answer.trim().length < 20}
                style={{ padding: '10px 28px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: answer.trim().length < 20 ? 'not-allowed' : 'pointer', opacity: answer.trim().length < 20 ? 0.4 : 1, fontFamily: 'inherit' }}>
                Submit →
              </button>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, animation: `epulse 1s ${i*0.15}s ease-in-out infinite` }} />)}
            </div>
            <p style={{ fontSize: 13, color: T.muted }}>Evaluating your answer...</p>
            <style>{`@keyframes epulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
          </div>
        )}

        {/* Evaluation result */}
        {!loading && evaluation && !showFollowUp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: evaluation.score>=4?'rgba(34,197,94,0.06)':evaluation.score>=3?'rgba(245,158,11,0.06)':'rgba(239,68,68,0.06)', border: `1px solid ${evaluation.score>=4?'rgba(34,197,94,0.2)':evaluation.score>=3?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)'}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: evaluation.score>=4?'#22c55e':evaluation.score>=3?'#f59e0b':'#ef4444', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
                  {evaluation.score>=4?'Strong answer':evaluation.score>=3?'Adequate':'Needs more depth'}
                </span>
                <ScoreDots score={evaluation.score} />
              </div>
              <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.65, margin: 0 }}>{evaluation.feedback}</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(175,163,159,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 5 }}>Your answer</div>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{answer}</p>
            </div>

            {evaluation.needsFollowUp && evaluation.followUpQuestion ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: T.primary, fontWeight: 600, marginBottom: 6 }}>Follow-up question</div>
                  <p style={{ fontSize: 14, color: T.text, lineHeight: 1.6, margin: 0 }}>{evaluation.followUpQuestion}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowFollowUp(true)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(20,123,88,0.12)', border: `1px solid ${T.primary}40`, color: T.primary, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Answer follow-up</button>
                  <button onClick={handleNext} style={{ padding: '10px 16px', borderRadius: 10, background: 'transparent', border: `1px solid ${T.border2}`, color: T.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{isLast ? 'Skip to results' : 'Skip'}</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleNext} style={{ padding: '11px 28px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {isLast ? 'See results →' : 'Next question →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Follow-up input */}
        {showFollowUp && evaluation?.followUpQuestion && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: T.primary, fontWeight: 600, marginBottom: 6 }}>Follow-up</div>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.6, margin: 0 }}>{evaluation.followUpQuestion}</p>
            </div>
            <textarea value={followUpAnswer} onChange={e => setFollowUpAnswer(e.target.value)}
              placeholder="Be more specific this time..."
              rows={4}
              style={{ width: '100%', background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12, padding: '14px 16px', fontSize: 14, color: T.text, resize: 'none' as const, fontFamily: 'inherit', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' as const }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={handleNext} style={{ fontSize: 13, color: T.muted, background: 'none', border: 'none', cursor: 'pointer' }}>Skip</button>
              <button onClick={() => { const ans = followUpAnswer; const fq = evaluation.followUpQuestion ?? undefined; setShowFollowUp(false); setEvaluation(null); setFollowUpAnswer(''); callEvaluate(ans, fq); }}
                disabled={followUpAnswer.trim().length < 10}
                style={{ padding: '10px 24px', borderRadius: 10, background: T.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: followUpAnswer.trim().length < 10 ? 'not-allowed' : 'pointer', opacity: followUpAnswer.trim().length < 10 ? 0.4 : 1, fontFamily: 'inherit' }}>
                Submit →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
