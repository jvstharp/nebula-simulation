"use client";

/**
 * Adaptive Soundscape Engine — v4.0
 * Web Audio API layer that manages ambient loops and notification sounds
 * tied to chaos tier state. Initialises on first user interaction to comply
 * with browser autoplay restrictions.
 */

type SoundscapeTier = 0 | 1 | 2 | 3;

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private muted = false;
  private currentTier: SoundscapeTier = 0;

  // Gain nodes
  private officeGain: GainNode | null = null;
  private tenseGain: GainNode | null = null;
  private droneGain: GainNode | null = null;

  // Audio buffers
  private buffers: Record<string, AudioBuffer> = {};

  // Active source nodes
  private officeSource: AudioBufferSourceNode | null = null;
  private tenseSource: AudioBufferSourceNode | null = null;
  private droneSource: AudioBufferSourceNode | null = null;

  // Wind-down timeout
  private windDownTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Call on first user click/keypress to unlock AudioContext.
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.officeGain = this.ctx.createGain();
      this.tenseGain  = this.ctx.createGain();
      this.droneGain  = this.ctx.createGain();

      this.officeGain.gain.value = 0.15;
      this.tenseGain.gain.value  = 0;
      this.droneGain.gain.value  = 0;

      this.officeGain.connect(this.ctx.destination);
      this.tenseGain.connect(this.ctx.destination);
      this.droneGain.connect(this.ctx.destination);

      this.initialized = true;

      // Restore mute preference from localStorage
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('nebula_mute_sounds') : null;
      if (saved === 'true') this.muted = true;

      // We use synthesized tones in MVP (no real audio assets)
      // This architecture is wired for real .mp3 assets when available.
    } catch {
      // AudioContext unavailable — degrade gracefully
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nebula_mute_sounds', String(muted));
    }
    if (!this.ctx) return;
    const master = muted ? 0 : 1;
    this.officeGain?.gain.setTargetAtTime(muted ? 0 : 0.15, this.ctx.currentTime, 0.1);
    this.tenseGain?.gain.setTargetAtTime(muted ? 0 : (this.currentTier >= 2 ? 0.12 : 0), this.ctx.currentTime, 0.1);
    this.droneGain?.gain.setTargetAtTime(muted ? 0 : (this.currentTier >= 3 ? 0.06 : 0), this.ctx.currentTime, 0.1);
    void master; // suppress unused warning
  }

  /**
   * Transition soundscape to match chaos tier.
   * tier 0 = baseline, 1 = subtle, 2 = moderate, 3 = full
   */
  setChaosState(tier: SoundscapeTier) {
    if (!this.ctx || !this.initialized) return;
    if (this.windDownTimer) {
      clearTimeout(this.windDownTimer);
      this.windDownTimer = null;
    }
    this.currentTier = tier;
    if (this.muted) return;

    const t = this.ctx.currentTime;
    switch (tier) {
      case 0:
      case 1:
        // Baseline office ambience
        this.officeGain?.gain.setTargetAtTime(0.15, t, 1);
        this.tenseGain?.gain.setTargetAtTime(0, t, 1);
        this.droneGain?.gain.setTargetAtTime(0, t, 1);
        break;
      case 2:
        // Tense variant cross-fades in (4s ramp)
        this.officeGain?.gain.setTargetAtTime(0.08, t, 1.3);
        this.tenseGain?.gain.setTargetAtTime(0.12, t, 1.3);
        this.droneGain?.gain.setTargetAtTime(0, t, 1);
        break;
      case 3:
        // Near-silence + tension drone
        this.officeGain?.gain.setTargetAtTime(0.03, t, 1);
        this.tenseGain?.gain.setTargetAtTime(0.03, t, 1);
        this.droneGain?.gain.setTargetAtTime(0.06, t, 2);
        break;
    }
  }

  /**
   * Begin 45-second wind-down back to baseline.
   */
  beginWindDown() {
    if (!this.ctx || !this.initialized) return;
    const t = this.ctx.currentTime;
    // Ramp back to baseline over 45s
    this.officeGain?.gain.linearRampToValueAtTime(0.15, t + 45);
    this.tenseGain?.gain.linearRampToValueAtTime(0, t + 45);
    this.droneGain?.gain.linearRampToValueAtTime(0, t + 45);

    this.windDownTimer = setTimeout(() => {
      this.currentTier = 0;
    }, 45000);
  }

  /**
   * Play a notification ping appropriate to the current tier.
   * In MVP we synthesize a short tone via oscillator.
   */
  playNotificationPing() {
    if (!this.ctx || !this.initialized || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Tier-appropriate frequency
      const freq = this.currentTier >= 3 ? 880 : this.currentTier >= 2 ? 660 : 440;
      osc.frequency.value = freq;
      osc.type = 'sine';

      const t = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // Degrade gracefully
    }
  }
}

// Singleton instance — created lazily on client
let _engine: SoundscapeEngine | null = null;

export function getSoundscape(): SoundscapeEngine {
  if (typeof window === 'undefined') {
    // SSR stub
    return {
      init: async () => {},
      setMuted: () => {},
      setChaosState: () => {},
      beginWindDown: () => {},
      playNotificationPing: () => {},
    } as unknown as SoundscapeEngine;
  }
  if (!_engine) _engine = new SoundscapeEngine();
  return _engine;
}
