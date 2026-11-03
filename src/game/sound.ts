// Procedural 8-Bit Retro Web Audio API Synthesizer + Chiptune BGM Sequencer

export type BgmTrack = 'title' | 'lobby' | 'dungeon' | 'boss';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public bgmMuted: boolean = false;
  private currentTrack: BgmTrack = 'title';
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

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

  // ==========================================================================
  // 8-BIT CHIPTUNE BGM SEQUENCER (Title, Lobby, Dungeon Combat, Boss Theme)
  // ==========================================================================
  public startBgm(track: BgmTrack) {
    this.currentTrack = track;
    if (this.bgmMuted || typeof window === 'undefined') {
      this.stopBgm();
      return;
    }

    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }

    const stepMs =
      track === 'boss'
        ? 135
        : track === 'dungeon'
        ? 155
        : track === 'title'
        ? 175
        : 210;

    // 16-step Chiptune Melodies & Basslines (Hz)
    const melodies: Record<BgmTrack, number[]> = {
      title: [
        440, 0, 523.25, 659.25, 587.33, 0, 523.25, 493.88,
        440, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 392,
      ],
      lobby: [
        523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46,
        523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33,
      ],
      dungeon: [
        329.63, 329.63, 392, 440, 493.88, 440, 392, 329.63,
        293.66, 329.63, 392, 493.88, 523.25, 493.88, 440, 392,
      ],
      boss: [
        440, 466.16, 440, 392, 440, 523.25, 493.88, 440,
        587.33, 554.37, 523.25, 493.88, 659.25, 587.33, 523.25, 466.16,
      ],
    };

    const basslines: Record<BgmTrack, number[]> = {
      title: [
        110, 110, 130.81, 130.81, 146.83, 146.83, 130.81, 98,
        110, 110, 164.81, 164.81, 146.83, 130.81, 110, 98,
      ],
      lobby: [
        130.81, 0, 196, 0, 146.83, 0, 220, 0,
        130.81, 0, 196, 0, 164.81, 0, 196, 0,
      ],
      dungeon: [
        82.41, 82.41, 110, 82.41, 98, 98, 123.47, 98,
        73.42, 73.42, 98, 73.42, 87.31, 98, 110, 123.47,
      ],
      boss: [
        110, 110, 116.54, 110, 98, 98, 110, 98,
        146.83, 146.83, 130.81, 123.47, 116.54, 110, 98, 82.41,
      ],
    };

    this.bgmTimer = window.setInterval(() => {
      if (this.bgmMuted) return;
      const ctx = this.ensureContext(true);
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const idx = this.bgmStep % 16;
      this.bgmStep++;

      const leadFreq = melodies[this.currentTrack][idx];
      const bassFreq = basslines[this.currentTrack][idx];

      // 1. Lead Chiptune Channel (Square / Triangle)
      if (leadFreq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = this.currentTrack === 'lobby' ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(leadFreq, now);

        const vol = this.currentTrack === 'lobby' ? 0.032 : 0.026;
        const dur = (stepMs / 1000) * 0.82;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
      }

      // 2. Bassline Channel (Triangle)
      if (bassFreq > 0) {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, now);

        const dur = (stepMs / 1000) * 0.9;
        bGain.gain.setValueAtTime(0.042, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + dur + 0.01);
      }

      // 3. Percussion Hi-Hat / Kick on Dungeon & Boss tracks
      if (
        (this.currentTrack === 'dungeon' || this.currentTrack === 'boss') &&
        idx % 2 === 0
      ) {
        const pOsc = ctx.createOscillator();
        const pGain = ctx.createGain();
        pOsc.type = 'square';
        pOsc.frequency.setValueAtTime(idx % 4 === 0 ? 95 : 880, now);
        pOsc.frequency.exponentialRampToValueAtTime(35, now + 0.03);
        pGain.gain.setValueAtTime(0.018, now);
        pGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.032);
        pOsc.connect(pGain);
        pGain.connect(ctx.destination);
        pOsc.start(now);
        pOsc.stop(now + 0.035);
      }
    }, stepMs);
  }

  public stopBgm() {
    if (this.bgmTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
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

  // Tiếng "CLANG!" kim loại đanh gọn khi chém phản đòn đạn (Soul Knight Bullet Deflect!)
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

  // Tiếng rung rương Gacha hồi hộp
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

  // Tiếng bước chân "tạch tạch" 8-bit retro
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

  // Tiếng chém kiếm "swoosh"
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

  // Tiếng bắn súng / laser / shotgun kiểu Soul Knight
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
