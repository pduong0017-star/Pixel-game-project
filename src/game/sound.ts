// 4-Channel Polyphonic 8-Bit Chiptune Synthesizer, Algorithmic Music Generator & Retro SFX Engine
import { MusicStyle } from './types';

export type BgmTrack = 'title' | 'lobby' | 'dungeon' | 'boss' | 'custom';

export interface ChiptunePattern {
  name: string;
  style: MusicStyle;
  bpm: number;
  lead: number[]; // 32 steps (Hz)
  arp: number[]; // 32 steps (Hz)
  bass: number[]; // 32 steps (Hz)
  drums: ('none' | 'kick' | 'snare' | 'hat' | 'kick_hat')[]; // 32 steps
}

const SCALES: Record<MusicStyle, { root: number; intervals: number[]; label: string }> = {
  heroic_minor: {
    root: 220, // A3
    intervals: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19],
    label: 'Dark Heroic Minor (Soul Knight)',
  },
  samurai_pentatonic: {
    root: 293.66, // D4 Hirajoshi
    intervals: [0, 2, 3, 7, 8, 12, 14, 15, 19, 20, 24],
    label: 'Samurai Hirajoshi (Katana Spirit)',
  },
  cyber_synth: {
    root: 164.81, // E3 Dorian
    intervals: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19],
    label: 'Cyberpunk Dorian (Synthwave)',
  },
  boss_phrygian: {
    root: 164.81, // E3 Phrygian Dominant
    intervals: [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19],
    label: 'Abyssal Phrygian (Boss Metal)',
  },
  arcade_major: {
    root: 261.63, // C4 Mixolydian
    intervals: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19],
    label: 'Retro Arcade Mixolydian (8-Bit)',
  },
};

function semiToFreq(rootHz: number, semitones: number): number {
  return Number((rootHz * Math.pow(2, semitones / 12)).toFixed(2));
}

function buildPresetPatterns(): Record<Exclude<BgmTrack, 'custom'>, ChiptunePattern> {
  return {
    title: {
      name: 'Obsidian Overture',
      style: 'heroic_minor',
      bpm: 132,
      lead: [
        440, 0, 523.25, 659.25, 587.33, 0, 523.25, 493.88,
        440, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 392,
        440, 0, 659.25, 880, 783.99, 659.25, 587.33, 523.25,
        493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440,
      ],
      arp: [
        261.63, 329.63, 440, 329.63, 293.66, 349.23, 440, 349.23,
        261.63, 329.63, 440, 523.25, 392, 329.63, 293.66, 246.94,
        261.63, 329.63, 440, 523.25, 392, 493.88, 587.33, 493.88,
        293.66, 349.23, 440, 349.23, 246.94, 329.63, 392, 329.63,
      ],
      bass: [
        110, 110, 220, 110, 146.83, 146.83, 130.81, 98,
        110, 110, 164.81, 164.81, 146.83, 130.81, 110, 98,
        110, 110, 220, 110, 196, 196, 146.83, 130.81,
        146.83, 146.83, 130.81, 130.81, 123.47, 110, 98, 82.41,
      ],
      drums: [
        'kick', 'hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'hat',
        'kick', 'hat', 'snare', 'hat', 'kick', 'snare', 'hat', 'snare',
        'kick', 'hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'hat',
        'kick', 'hat', 'snare', 'kick_hat', 'snare', 'snare', 'kick', 'snare',
      ],
    },
    lobby: {
      name: 'Sanctuary of Heroes',
      style: 'arcade_major',
      bpm: 118,
      lead: [
        523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46,
        523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33,
        659.25, 783.99, 880, 1046.5, 987.77, 880, 783.99, 659.25,
        587.33, 659.25, 783.99, 659.25, 523.25, 587.33, 523.25, 0,
      ],
      arp: [
        261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23,
        261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66,
        329.63, 392, 440, 523.25, 493.88, 440, 392, 329.63,
        293.66, 349.23, 392, 349.23, 261.63, 329.63, 392, 261.63,
      ],
      bass: [
        130.81, 0, 196, 130.81, 146.83, 0, 220, 146.83,
        130.81, 0, 196, 130.81, 164.81, 146.83, 130.81, 98,
        164.81, 0, 220, 164.81, 146.83, 0, 196, 146.83,
        146.83, 0, 196, 146.83, 130.81, 98, 130.81, 0,
      ],
      drums: [
        'kick', 'none', 'hat', 'none', 'snare', 'none', 'hat', 'kick',
        'kick', 'none', 'hat', 'none', 'snare', 'hat', 'kick', 'snare',
        'kick', 'none', 'hat', 'none', 'snare', 'none', 'hat', 'kick',
        'kick', 'hat', 'snare', 'hat', 'kick', 'snare', 'hat', 'none',
      ],
    },
    dungeon: {
      name: 'Blade & Bullet Storm',
      style: 'samurai_pentatonic',
      bpm: 152,
      lead: [
        587.33, 587.33, 659.25, 698.46, 880, 698.46, 659.25, 587.33,
        523.25, 587.33, 659.25, 880, 932.33, 880, 698.46, 659.25,
        587.33, 698.46, 880, 1174.66, 932.33, 880, 698.46, 659.25,
        587.33, 523.25, 587.33, 698.46, 659.25, 587.33, 523.25, 440,
      ],
      arp: [
        293.66, 440, 587.33, 440, 349.23, 440, 698.46, 440,
        261.63, 392, 523.25, 392, 349.23, 466.16, 698.46, 466.16,
        293.66, 440, 587.33, 880, 466.16, 440, 349.23, 329.63,
        293.66, 349.23, 440, 587.33, 329.63, 293.66, 261.63, 220,
      ],
      bass: [
        146.83, 146.83, 293.66, 146.83, 174.61, 174.61, 146.83, 130.81,
        130.81, 130.81, 261.63, 130.81, 116.54, 116.54, 130.81, 146.83,
        146.83, 146.83, 293.66, 146.83, 116.54, 116.54, 130.81, 146.83,
        146.83, 130.81, 116.54, 110, 98, 110, 130.81, 146.83,
      ],
      drums: [
        'kick', 'hat', 'snare', 'hat', 'kick', 'kick_hat', 'snare', 'hat',
        'kick', 'hat', 'snare', 'hat', 'kick', 'snare', 'kick_hat', 'snare',
        'kick', 'hat', 'snare', 'hat', 'kick', 'kick_hat', 'snare', 'hat',
        'kick', 'snare', 'kick', 'snare', 'kick', 'snare', 'snare', 'snare',
      ],
    },
    boss: {
      name: 'Wrath of the Obsidian Warden',
      style: 'boss_phrygian',
      bpm: 168,
      lead: [
        659.25, 698.46, 659.25, 587.33, 659.25, 830.61, 783.99, 698.46,
        659.25, 698.46, 830.61, 987.77, 880, 830.61, 698.46, 659.25,
        987.77, 1046.5, 987.77, 830.61, 880, 987.77, 830.61, 698.46,
        659.25, 587.33, 659.25, 830.61, 698.46, 659.25, 587.33, 523.25,
      ],
      arp: [
        329.63, 415.3, 493.88, 659.25, 349.23, 440, 523.25, 698.46,
        329.63, 415.3, 493.88, 659.25, 293.66, 349.23, 440, 587.33,
        329.63, 415.3, 493.88, 659.25, 349.23, 440, 523.25, 698.46,
        293.66, 349.23, 440, 587.33, 329.63, 415.3, 493.88, 329.63,
      ],
      bass: [
        82.41, 82.41, 164.81, 82.41, 87.31, 87.31, 174.61, 87.31,
        82.41, 82.41, 164.81, 82.41, 73.42, 73.42, 98, 110,
        82.41, 82.41, 164.81, 82.41, 110, 110, 116.54, 98,
        87.31, 87.31, 82.41, 82.41, 73.42, 82.41, 87.31, 98,
      ],
      drums: [
        'kick', 'kick_hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'kick_hat',
        'kick', 'hat', 'snare', 'kick_hat', 'kick', 'snare', 'snare', 'snare',
        'kick', 'kick_hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'kick_hat',
        'kick', 'snare', 'kick', 'snare', 'snare', 'snare', 'kick', 'snare',
      ],
    },
  };
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public bgmMuted: boolean = false;
  private currentTrack: BgmTrack = 'title';
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  // Channel toggles for Music Studio
  public channelEnabled = {
    lead: true,
    arp: true,
    bass: true,
    drums: true,
  };

  private presets = buildPresetPatterns();
  private customPattern: ChiptunePattern = {
    ...buildPresetPatterns().dungeon,
    name: 'Custom Chiptune #1',
  };

  private ensureContext(forBgm = false): AudioContext | null {
    if (!forBgm && this.muted) return null;
    if (forBgm && this.bgmMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public setBgmMuted(bgmMuted: boolean) {
    this.bgmMuted = bgmMuted;
    if (bgmMuted) {
      this.stopBgm();
    } else {
      this.startBgm(this.currentTrack);
    }
  }

  public getActivePattern(): ChiptunePattern {
    if (this.currentTrack === 'custom') return this.customPattern;
    return this.presets[this.currentTrack] || this.presets.title;
  }

  // ==========================================================================
  // ALGORITHMIC 8-BIT MUSIC GENERATOR TOOL (Máy Sáng Tác Nhạc 8-Bit Cho Game)
  // ==========================================================================
  public generateProceduralSong(
    style: MusicStyle = 'samurai_pentatonic',
    bpm: number = 148
  ): ChiptunePattern {
    const scaleCfg = SCALES[style] || SCALES.heroic_minor;
    const root = scaleCfg.root;
    const notes = scaleCfg.intervals;

    const lead: number[] = [];
    const arp: number[] = [];
    const bass: number[] = [];
    const drums: ('none' | 'kick' | 'snare' | 'hat' | 'kick_hat')[] = [];

    // Choose a 4-bar chord root progression (in scale indices)
    const progressions = [
      [0, 5, 3, 4],
      [0, 3, 5, 4],
      [0, 2, 4, 3],
      [0, 6, 5, 4],
    ];
    const prog = progressions[Math.floor(Math.random() * progressions.length)];

    let currentNoteIdx = 4;
    for (let step = 0; step < 32; step++) {
      const bar = Math.floor(step / 8);
      const chordDegree = prog[bar % 4];
      const bassSemi = notes[chordDegree % notes.length];

      // 1. Bassline (Octave -1 and Octave 0)
      if (step % 2 === 0) {
        bass.push(semiToFreq(root * 0.5, bassSemi));
      } else {
        bass.push(semiToFreq(root, bassSemi));
      }

      // 2. Arpeggio (Cycle 1 - 3 - 5 of the current chord)
      const arpOffset = [0, 2, 4, 2][step % 4];
      const arpSemi = notes[(chordDegree + arpOffset) % notes.length];
      arp.push(semiToFreq(root, arpSemi));

      // 3. Lead Melody (Motif with rhythmic rests & climax on bar 3-4)
      if (step % 8 === 7 && Math.random() < 0.45) {
        lead.push(0); // Breath rest
      } else {
        const delta = [-2, -1, 1, 1, 2, 0][Math.floor(Math.random() * 6)];
        currentNoteIdx = Math.max(
          2,
          Math.min(notes.length - 1, currentNoteIdx + delta)
        );
        if (step % 8 === 0) {
          currentNoteIdx = (chordDegree + 4) % notes.length;
        }
        lead.push(semiToFreq(root * 2, notes[currentNoteIdx]));
      }

      // 4. 8-Bit Drum Groove
      if (step >= 28) {
        drums.push(step % 2 === 0 ? 'snare' : 'kick_hat'); // Drum fill!
      } else if (step % 4 === 0) {
        drums.push('kick');
      } else if (step % 4 === 2) {
        drums.push('snare');
      } else if (step % 2 === 1) {
        drums.push(Math.random() < 0.35 ? 'kick_hat' : 'hat');
      } else {
        drums.push('hat');
      }
    }

    const generated: ChiptunePattern = {
      name: `${scaleCfg.label.split(' ')[0]} #${Math.floor(100 + Math.random() * 900)}`,
      style,
      bpm,
      lead,
      arp,
      bass,
      drums,
    };

    this.customPattern = generated;
    // Also apply to dungeon & lobby if user generates a custom soundtrack!
    this.presets.dungeon = generated;
    this.startBgm('custom');
    return generated;
  }

  public setTempoBpm(bpm: number) {
    const clamped = Math.max(85, Math.min(190, bpm));
    const pat = this.getActivePattern();
    pat.bpm = clamped;
    this.startBgm(this.currentTrack);
  }

  public startBgm(track: BgmTrack) {
    // If user created a custom track and enters dungeon, keep playing their custom track!
    if (track === 'dungeon' && this.currentTrack === 'custom') {
      track = 'custom';
    }
    this.currentTrack = track;
    if (this.bgmMuted || typeof window === 'undefined') {
      this.stopBgm();
      return;
    }

    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }

    const pattern = this.getActivePattern();
    // 16th-note step duration in ms from BPM
    const stepMs = Math.round((60000 / pattern.bpm) / 2);

    this.bgmTimer = window.setInterval(() => {
      if (this.bgmMuted) return;
      const ctx = this.ensureContext(true);
      if (!ctx || ctx.state !== 'running') return;

      const pat = this.getActivePattern();
      const now = ctx.currentTime;
      const idx = this.bgmStep % pat.lead.length;
      this.bgmStep++;

      const stepDur = stepMs / 1000;

      // 1. Lead Channel (Pulse/Square with slight pitch vibrato)
      if (this.channelEnabled.lead && pat.lead[idx] > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = pat.style === 'arcade_major' ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(pat.lead[idx], now);

        const dur = stepDur * 0.85;
        gain.gain.setValueAtTime(0.028, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
      }

      // 2. Arpeggio Harmony Channel
      if (this.channelEnabled.arp && pat.arp[idx] > 0) {
        const aOsc = ctx.createOscillator();
        const aGain = ctx.createGain();
        aOsc.type = 'square';
        aOsc.frequency.setValueAtTime(pat.arp[idx], now);
        aOsc.frequency.setValueAtTime(pat.arp[idx] * 1.25, now + stepDur * 0.45);

        const dur = stepDur * 0.78;
        aGain.gain.setValueAtTime(0.014, now);
        aGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

        aOsc.connect(aGain);
        aGain.connect(ctx.destination);
        aOsc.start(now);
        aOsc.stop(now + dur + 0.01);
      }

      // 3. Deep Sub-Bass Channel
      if (this.channelEnabled.bass && pat.bass[idx] > 0) {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(pat.bass[idx], now);

        const dur = stepDur * 0.92;
        bGain.gain.setValueAtTime(0.052, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + dur + 0.01);
      }

      // 4. 8-Bit Percussion Drum Kit (Kick / Snare / Hi-Hat)
      if (this.channelEnabled.drums) {
        const drum = pat.drums[idx];
        if (drum === 'kick' || drum === 'kick_hat') {
          const kOsc = ctx.createOscillator();
          const kGain = ctx.createGain();
          kOsc.type = 'sine';
          kOsc.frequency.setValueAtTime(145, now);
          kOsc.frequency.exponentialRampToValueAtTime(36, now + 0.065);
          kGain.gain.setValueAtTime(0.065, now);
          kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          kOsc.connect(kGain);
          kGain.connect(ctx.destination);
          kOsc.start(now);
          kOsc.stop(now + 0.075);
        }
        if (drum === 'snare') {
          // Noise burst snare
          const bufLen = Math.floor(ctx.sampleRate * 0.065);
          const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
          const ch = buf.getChannelData(0);
          for (let i = 0; i < bufLen; i++) {
            ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.4));
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.036, now);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
          src.connect(nGain);
          nGain.connect(ctx.destination);
          src.start(now);
        } else if (drum === 'hat' || drum === 'kick_hat') {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          hOsc.type = 'square';
          hOsc.frequency.setValueAtTime(1480, now);
          hOsc.frequency.exponentialRampToValueAtTime(620, now + 0.022);
          hGain.gain.setValueAtTime(0.012, now);
          hGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.024);
          hOsc.connect(hGain);
          hGain.connect(ctx.destination);
          hOsc.start(now);
          hOsc.stop(now + 0.026);
        }
      }
    }, stepMs);
  }

  public stopBgm() {
    if (this.bgmTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Export current Chiptune Track to a downloadable 16-bit PCM .WAV Blob URL!
  public exportCurrentTrackWavUrl(): string {
    const pat = this.getActivePattern();
    const sampleRate = 22050;
    const stepSec = 60 / pat.bpm / 2;
    const totalSteps = 64; // 2 full loops
    const durationSec = totalSteps * stepSec;
    const numSamples = Math.floor(sampleRate * durationSec);
    const pcm = new Float32Array(numSamples);

    for (let step = 0; step < totalSteps; step++) {
      const idx = step % 32;
      const startSample = Math.floor(step * stepSec * sampleRate);
      const endSample = Math.min(
        numSamples,
        Math.floor((step + 1) * stepSec * sampleRate)
      );
      const leadF = pat.lead[idx];
      const arpF = pat.arp[idx];
      const bassF = pat.bass[idx];
      const drum = pat.drums[idx];

      for (let s = startSample; s < endSample; s++) {
        const localT = (s - startSample) / sampleRate;
        const env = Math.exp(-localT * 6.5);
        let sample = 0;

        if (leadF > 0) {
          sample += (Math.sin(2 * Math.PI * leadF * localT) >= 0 ? 0.18 : -0.18) * env;
        }
        if (arpF > 0) {
          const f = localT > stepSec * 0.45 ? arpF * 1.25 : arpF;
          sample += (Math.sin(2 * Math.PI * f * localT) >= 0 ? 0.09 : -0.09) * env;
        }
        if (bassF > 0) {
          sample += Math.asin(Math.sin(2 * Math.PI * bassF * localT)) * 0.18 * env;
        }
        if (drum === 'snare' && localT < 0.06) {
          sample += (Math.random() * 2 - 1) * 0.16 * Math.exp(-localT * 30);
        } else if ((drum === 'kick' || drum === 'kick_hat') && localT < 0.07) {
          sample += Math.sin(2 * Math.PI * (140 - localT * 1200) * localT) * 0.25;
        }
        pcm[s] = Math.max(-0.95, Math.min(0.95, sample));
      }
    }

    // Encode WAV header
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, Math.round(pcm[i] * 32767), true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  // Tiếng "Click" cơ học đã tai khi bấm nút UI / Đổi Skin
  public playUiClick(highPitch = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(highPitch ? 820 : 620, now);
    osc.frequency.exponentialRampToValueAtTime(
      highPitch ? 1240 : 280,
      now + 0.038
    );

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Tiếng "CLANG!" kim loại đanh gọn khi chém phản đòn đạn
  public playDeflectClang() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [1318.51, 1975.53, 2637.02];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.015);
      osc.frequency.exponentialRampToValueAtTime(
        f * 1.15,
        now + idx * 0.015 + 0.14
      );

      gain.gain.setValueAtTime(0.14, now + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.015 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.015);
      osc.stop(now + idx * 0.015 + 0.16);
    });
  }

  // Tiếng bùng nổ Tuyệt Kỹ Tối Thượng (Ultimate Cast)
  public playUltimateCast() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chord = [220, 329.63, 440, 659.25, 880, 1318.51];
    chord.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(f, now + idx * 0.03);
      osc.frequency.exponentialRampToValueAtTime(f * 1.2, now + idx * 0.03 + 0.25);

      gain.gain.setValueAtTime(0.13, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.27);
    });
  }

  // Tiếng còi báo hiệu Đợt Quái Mới (Wave 2 / Wave 3 Spawn)
  public playWaveSpawn() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [329.63, 392, 493.88, 659.25];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.055);
      gain.gain.setValueAtTime(0.11, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.19);
    });
  }

  // Tiếng "Ching!" rực rỡ khi mở khóa Tướng / Skin / Nhận Kim Cương
  public playChing() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [1046.5, 1318.51, 1567.98, 2093.0];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.045);

      gain.gain.setValueAtTime(0.16, now + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.34);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.35);
    });
  }

  public playChestRoll() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220 + i * 55, now + i * 0.085);
      gain.gain.setValueAtTime(0.09, now + i * 0.085);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.085 + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.085);
      osc.stop(now + i * 0.085 + 0.075);
    }
  }

  public playFootstep() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const pitch = 120 + Math.random() * 35;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.032);

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.036);
  }

  public playSlash(heavy = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const dur = heavy ? 0.13 : 0.095;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.38));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(heavy ? 680 : 1180, now);
    filter.frequency.exponentialRampToValueAtTime(
      heavy ? 190 : 340,
      now + dur
    );
    filter.Q.value = 2.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(heavy ? 0.24 : 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  public playGunshot(kind: 'pistol' | 'shotgun' | 'plasma' | 'bow' = 'pistol') {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (kind === 'plasma') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.095);
      return;
    }

    if (kind === 'bow') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
      return;
    }

    osc.type = 'square';
    osc.frequency.setValueAtTime(kind === 'shotgun' ? 240 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(
      55,
      now + (kind === 'shotgun' ? 0.14 : 0.08)
    );
    gain.gain.setValueAtTime(kind === 'shotgun' ? 0.22 : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + (kind === 'shotgun' ? 0.14 : 0.08)
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (kind === 'shotgun' ? 0.14 : 0.08));
  }

  public playWeaponSwitch() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(780, now + 0.03);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playDoorLock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(95, now + 0.06);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playHit(crit = false, heavy = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = crit ? 'sawtooth' : 'square';

    const startFreq = crit ? 310 : heavy ? 145 : 210;
    const endFreq = crit ? 60 : 48;
    const duration = crit ? 0.14 : heavy ? 0.16 : 0.095;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gain.gain.setValueAtTime(crit ? 0.22 : 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  public playPlayerHurt() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(155, now);
    osc.frequency.setValueAtTime(110, now + 0.06);
    osc.frequency.linearRampToValueAtTime(58, now + 0.22);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playExpCoin() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.045);

    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playAggroAlert() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playPortalOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [392.0, 493.88, 587.33, 783.99, 987.77];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);
      gain.gain.setValueAtTime(0.13, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.25);
    });
  }

  public playDash() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSkillCast() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [330, 440, 660];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + idx * 0.035);
      osc.frequency.exponentialRampToValueAtTime(
        f * 1.25,
        now + idx * 0.035 + 0.14
      );

      gain.gain.setValueAtTime(0.1, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.15);
    });
  }

  public playPickup(type: 'gold' | 'potion' | 'shrine') {
    if (type === 'gold') {
      this.playExpCoin();
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes =
      type === 'potion'
        ? [523.25, 659.25, 783.99]
        : [440, 554.37, 659.25, 880];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.055);

      gain.gain.setValueAtTime(0.11, now + i * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.055);
      osc.stop(now + i * 0.055 + 0.16);
    });
  }

  public playLevelUp() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);

      gain.gain.setValueAtTime(0.1, now + idx * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.26);
    });
  }

  public playStairsDescend() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const steps = [440, 554.37, 659.25, 880];
    steps.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.14, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.18);
    });
  }

  public playBossWarning() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const t0 = now + i * 0.28;
      osc.frequency.setValueAtTime(220, t0);
      osc.frequency.linearRampToValueAtTime(520, t0 + 0.14);
      osc.frequency.linearRampToValueAtTime(196, t0 + 0.25);

      gain.gain.setValueAtTime(0.16, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.27);
    }
  }

  public playAnvilHammer() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const hits = [987.77, 1318.51, 1975.53];
    hits.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 2 ? 'triangle' : 'square';
      const t0 = now + idx * 0.085;
      osc.frequency.setValueAtTime(freq, t0);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.18, t0 + 0.14);

      gain.gain.setValueAtTime(0.18, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.17);
    });
  }

  public playGameOver(victory = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = victory
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51]
      : [311.13, 277.18, 246.94, 196.0];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = victory ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);

      gain.gain.setValueAtTime(0.14, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.35);
    });
  }
}

export const sound = new SoundEngine();
export { SCALES as MUSIC_SCALES };
