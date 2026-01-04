"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { Howl, Howler } from "howler";

// Sound types available in the system
type SoundType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "whoosh"
  | "pop"
  | "tick"
  | "transition"
  | "reveal"
  | "ambient";

interface SoundConfig {
  src: string;
  volume?: number;
  rate?: number;
  loop?: boolean;
}

// Web Audio API synthesized sounds (no external files needed)
const createSynthSound = (type: SoundType): Howl | null => {
  // For now, return null - we'll use Web Audio API directly for synthesis
  return null;
};

// Sound context for global access
interface SoundContextType {
  play: (type: SoundType, options?: { volume?: number; rate?: number }) => void;
  setEnabled: (enabled: boolean) => void;
  isEnabled: boolean;
  setMasterVolume: (volume: number) => void;
  masterVolume: number;
}

const SoundContext = createContext<SoundContextType | null>(null);

// Web Audio API sound synthesis
class SoundSynthesizer {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.volume;
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  // Soft click sound - subtle and satisfying
  playClick(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // High frequency click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2000 * (options?.rate || 1), now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3000, now);

    gain.gain.setValueAtTime((options?.volume || 0.15) * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Soft hover sound - very subtle
  playHover(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200 * (options?.rate || 1), now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);

    gain.gain.setValueAtTime((options?.volume || 0.05) * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Success sound - ascending tones
  playSuccess(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * (options?.rate || 1), now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime((options?.volume || 0.12) * this.volume, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  }

  // Error sound - descending buzz
  playError(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200 * (options?.rate || 1), now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime((options?.volume || 0.1) * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Whoosh sound - for transitions
  playWhoosh(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // White noise with filter sweep
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime((options?.volume || 0.08) * this.volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  // Pop sound - satisfying for reveals
  playPop(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400 * (options?.rate || 1), now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    gain.gain.setValueAtTime((options?.volume || 0.2) * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Tick sound - for counters/progress
  playTick(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1800 * (options?.rate || 1), now);

    gain.gain.setValueAtTime((options?.volume || 0.08) * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // Transition sound - for page/section transitions
  playTransition(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Layered synth sweep
    [200, 400, 600].forEach((baseFreq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * (options?.rate || 1), now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.2);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.1);
      filter.frequency.exponentialRampToValueAtTime(1000, now + 0.3);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(((options?.volume || 0.06) / (i + 1)) * this.volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  // Reveal sound - magical unveil
  playReveal(options?: { volume?: number; rate?: number }) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Shimmer effect with multiple oscillators
    [800, 1000, 1200, 1500].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * (options?.rate || 1), now + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.03 + 0.2);

      gain.gain.setValueAtTime(0, now + i * 0.03);
      gain.gain.linearRampToValueAtTime((options?.volume || 0.04) * this.volume, now + i * 0.03 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.25);
    });
  }

  // Ambient drone - subtle background
  playAmbient(options?: { volume?: number; rate?: number }) {
    // Ambient is typically continuous, handled differently
    if (!this.enabled) return;
    // Implementation for ambient sounds would be more complex
    // and typically loop - skipping for now
  }
}

// Singleton synthesizer
let synthesizer: SoundSynthesizer | null = null;

const getSynthesizer = (): SoundSynthesizer => {
  if (!synthesizer) {
    synthesizer = new SoundSynthesizer();
  }
  return synthesizer;
};

// Provider component
export function SoundProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.3);

  const play = useCallback((type: SoundType, options?: { volume?: number; rate?: number }) => {
    const synth = getSynthesizer();

    switch (type) {
      case "click":
        synth.playClick(options);
        break;
      case "hover":
        synth.playHover(options);
        break;
      case "success":
        synth.playSuccess(options);
        break;
      case "error":
        synth.playError(options);
        break;
      case "whoosh":
        synth.playWhoosh(options);
        break;
      case "pop":
        synth.playPop(options);
        break;
      case "tick":
        synth.playTick(options);
        break;
      case "transition":
        synth.playTransition(options);
        break;
      case "reveal":
        synth.playReveal(options);
        break;
      case "ambient":
        synth.playAmbient(options);
        break;
    }
  }, []);

  const handleSetEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    getSynthesizer().setEnabled(enabled);
  }, []);

  const handleSetMasterVolume = useCallback((volume: number) => {
    setMasterVolume(volume);
    getSynthesizer().setVolume(volume);
  }, []);

  return (
    <SoundContext.Provider
      value={{
        play,
        setEnabled: handleSetEnabled,
        isEnabled,
        setMasterVolume: handleSetMasterVolume,
        masterVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

// Hook to use sounds
export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    // Return a no-op version if not wrapped in provider
    return {
      play: () => {},
      setEnabled: () => {},
      isEnabled: false,
      setMasterVolume: () => {},
      masterVolume: 0,
    };
  }
  return context;
}

// Convenience hooks for specific sounds
export function useClickSound() {
  const { play } = useSound();
  return useCallback((options?: { volume?: number; rate?: number }) => {
    play("click", options);
  }, [play]);
}

export function useHoverSound() {
  const { play } = useSound();
  return useCallback((options?: { volume?: number; rate?: number }) => {
    play("hover", options);
  }, [play]);
}

// Sound-enabled button wrapper
interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  clickSound?: boolean;
  hoverSound?: boolean;
}

export function SoundButton({
  children,
  clickSound = true,
  hoverSound = true,
  onClick,
  onMouseEnter,
  ...props
}: SoundButtonProps) {
  const { play } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (clickSound) play("click");
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverSound) play("hover");
    onMouseEnter?.(e);
  };

  return (
    <button onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </button>
  );
}

// Sound-enabled link wrapper
interface SoundLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  clickSound?: boolean;
  hoverSound?: boolean;
}

export function SoundLink({
  children,
  clickSound = true,
  hoverSound = true,
  onClick,
  onMouseEnter,
  ...props
}: SoundLinkProps) {
  const { play } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (clickSound) play("click");
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hoverSound) play("hover");
    onMouseEnter?.(e);
  };

  return (
    <a onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </a>
  );
}

export default SoundProvider;
