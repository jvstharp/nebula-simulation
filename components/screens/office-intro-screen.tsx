"use client";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

const VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-startup-office-4573-large.mp4";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";

const primary = '#147b58';
const text     = '#efefef';
const muted    = 'rgba(175,163,159,0.75)';

export function OfficeIntroScreen() {
  const { setScreen, startSession, setActiveBrowserTab } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [labelVisible,  setLabelVisible]  = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [videoFailed,   setVideoFailed]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLabelVisible(true),  900);
    const t2 = setTimeout(() => setButtonVisible(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function enter() {
    // Go to Fly on the Wall prologue — it will call startSession() and enter browser
    setScreen('prologue');
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0c0b',
      fontFamily: 'inherit', zIndex: 100, overflow: 'hidden',
    }}>
      {/* Video or fallback image */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onError={() => setVideoFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.45,
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={FALLBACK_IMG}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.25, filter: 'blur(4px) saturate(0.6)',
          }}
        />
      )}

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(10,12,11,0.35) 50%, rgba(0,0,0,0.75) 100%)',
      }} />

      {/* Skip — top right */}
      <button
        onClick={enter}
        style={{
          position: 'absolute', top: 20, right: 28, zIndex: 2,
          background: 'none', border: 'none',
          color: 'rgba(175,163,159,0.4)', fontSize: 12.5,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = muted)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(175,163,159,0.4)')}
      >
        Skip →
      </button>

      {/* Content — vertically centred */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24, textAlign: 'center', padding: '0 24px',
      }}>
        {/* NT logo mark */}
        <div
          style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: 'rgba(20,123,88,0.18)', border: '1px solid rgba(20,123,88,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, color: primary, letterSpacing: '-0.5px',
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          NT
        </div>

        {/* Company name */}
        <div
          style={{
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s ease 100ms, transform 0.7s ease 100ms',
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', color: primary, textTransform: 'uppercase', marginBottom: 10 }}>
            Nexus Technologies
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: text, lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0, maxWidth: 560 }}>
            Your workspace<br />is ready.
          </h1>
          <p style={{ fontSize: 15.5, color: muted, marginTop: 14, lineHeight: 1.7, maxWidth: 440 }}>
            72 hours on the clock. Three conflicting roadmaps. One board meeting on Monday.
          </p>
        </div>

        {/* Enter button */}
        <button
          onClick={enter}
          style={{
            padding: '15px 36px', borderRadius: 14,
            background: primary, border: 'none',
            color: '#fff', fontSize: 15.5, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: buttonVisible ? 1 : 0,
            transform: buttonVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.55s ease, transform 0.55s ease, filter 0.15s',
            boxShadow: `0 0 32px ${primary}44`,
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
          onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          Enter Nexus Technologies →
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
