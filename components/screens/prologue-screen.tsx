'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';

export function PrologueScreen() {
  const { setScreen, startSession, setActiveBrowserTab, prologueMessages, characters } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prologueMessages.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    prologueMessages.forEach((msg, i) => {
      timers.push(setTimeout(() => {
        setVisibleCount(i + 1);
      }, msg.delay));
    });

    // Show enter button 2.5s after last message
    const lastDelay = prologueMessages[prologueMessages.length - 1].delay + 2500;
    timers.push(setTimeout(() => setShowButton(true), lastDelay));

    // Auto-advance after 30s
    timers.push(setTimeout(() => enter(), lastDelay + 8000));

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prologueMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  function enter() {
    startSession();
    setActiveBrowserTab('email');
    setScreen('browser');
  }

  if (!prologueMessages.length) return null;

  const progress = Math.min(1, (visibleCount / prologueMessages.length));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0f', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', zIndex: 100,
    }}>
      {/* Skip */}
      <button
        onClick={enter}
        style={{
          position: 'absolute', top: 24, right: 28, fontSize: 12, color: 'rgba(255,255,255,0.35)',
          background: 'none', border: 'none', cursor: 'pointer', letterSpacing: 1,
        }}
      >
        SKIP →
      </button>

      {/* Header */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
          BEFORE YOU ARRIVED
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          🕐 7:42 AM — Internal team channel
        </div>
      </div>

      {/* Message feed */}
      <div style={{
        width: '100%', maxWidth: 540, maxHeight: '60vh', overflowY: 'auto',
        padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14,
        scrollbarWidth: 'none',
      }}>
        {prologueMessages.slice(0, visibleCount).map((msg, i) => {
          const char = characters.find(c => c.id === msg.from);
          if (!char) return null;
          return (
            <div
              key={i}
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                animation: 'fadeSlideIn 0.4s ease forwards',
                opacity: 0,
                animationDelay: '0ms',
                animationFillMode: 'forwards',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.avatar}
                alt={char.name}
                style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${char.color}55`, objectFit: 'cover', marginTop: 2,
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: char.color }}>{char.name}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(Date.now() - (prologueMessages[prologueMessages.length - 1].delay - msg.delay + 30000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{
                  fontSize: 13, color: msg.text === '...' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.82)',
                  lineHeight: 1.55, fontStyle: msg.text === '...' ? 'italic' : 'normal',
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%', background: 'rgba(255,255,255,0.25)',
          width: `${progress * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Enter button */}
      {showButton && (
        <button
          onClick={enter}
          style={{
            marginTop: 32, padding: '12px 28px', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.5,
            animation: 'fadeIn 0.5s ease forwards',
          }}
        >
          Enter Your Workspace →
        </button>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
