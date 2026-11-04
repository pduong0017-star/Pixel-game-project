// Full Multi-Section Song Synthesizer, AI Song Composer (Server-Side Gemini API) & Retro SFX Engine
import { MusicStyle } from './types';

export type BgmTrack =
  | 'title'
  | 'lobby'
  | 'dungeon'
  | 'frost'
  | 'magma'
  | 'boss'
  | 'custom';

export type SongSectionName =
  | 'INTRO'
  | 'VERSE A'
  | 'VERSE B'
  | 'CHORUS'
  | 'CLIMAX';

export interface ChiptunePattern {
  name: string;
  subtitle?: string;
  style: MusicStyle;
  bpm: number;
  lead: number[]; // 128 steps (Hz)
  arp: number[]; // 128 steps (Hz)
  bass: number[]; // 128 steps (Hz)
  drums: ('none' | 'kick' | 'snare' | 'hat' | 'kick_hat' | 'crash')[]; // 128 steps
  lyrics?: string[]; // 5 lyric lines corresponding to INTRO, VERSE A, VERSE B, CHORUS, CLIMAX
}

export const MUSIC_SCALES: Record<
  MusicStyle,
  {
    root: number;
    intervals: number[];
    label: string;
    name: string;
    defaultBpm: number;
  }
> = {
  heroic_minor: {
    root: 220, // A3
    intervals: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 22, 24],
    label: 'Hào Hùng Hắc Thạch (Heroic Minor)',
    name: 'Hào Hùng Hắc Thạch (Heroic Minor)',
    defaultBpm: 136,
  },
  samurai_pentatonic: {
    root: 293.66, // D4 Hirajoshi
    intervals: [0, 2, 3, 7, 8, 12, 14, 15, 19, 20, 24],
    label: 'Kiếm Khí Samurai (Hirajoshi)',
    name: 'Kiếm Khí Samurai (Hirajoshi)',
    defaultBpm: 150,
  },
  cyber_synth: {
    root: 164.81, // E3 Dorian
    intervals: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19, 21, 24],
    label: 'Băng Giá Synthwave (Cyber Dorian)',
    name: 'Băng Giá Synthwave (Cyber Dorian)',
    defaultBpm: 142,
  },
  boss_phrygian: {
    root: 164.81, // E3 Phrygian Dominant
    intervals: [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17, 19, 20, 24],
    label: 'Cuồng Nộ Chúa Ngục (Boss Metal)',
    name: 'Cuồng Nộ Chúa Ngục (Boss Metal)',
    defaultBpm: 168,
  },
  arcade_major: {
    root: 261.63, // C4 Mixolydian
    intervals: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 24],
    label: 'Thánh Điện Bình Yên (Sanctuary Ballad)',
    name: 'Thánh Điện Bình Yên (Sanctuary Ballad)',
    defaultBpm: 118,
  },
};

function semiToFreq(rootHz: number, semitones: number): number {
  return Number((rootHz * Math.pow(2, semitones / 12)).toFixed(2));
}

// Helper to compose a full 128-step multi-section song (Intro -> Verse A -> Verse B -> Chorus -> Climax)
function composeFullSong128(opts: {
  name: string;
  subtitle: string;
  style: MusicStyle;
  bpm: number;
  verseMotif: number[]; // 16 scale indices
  chorusMotif: number[]; // 16 scale indices
  chordProgVerse: [number, number, number, number];
  chordProgChorus: [number, number, number, number];
  lyrics: [string, string, string, string, string];
}): ChiptunePattern {
  const sc = MUSIC_SCALES[opts.style] || MUSIC_SCALES.heroic_minor;
  const root = sc.root;
  const notes = sc.intervals;

  const lead: number[] = [];
  const arp: number[] = [];
  const bass: number[] = [];
  const drums: ('none' | 'kick' | 'snare' | 'hat' | 'kick_hat' | 'crash')[] = [];

  const getNote = (idx: number, octMult = 1): number => {
    if (idx < 0) return 0;
    const clamped = Math.max(0, Math.min(notes.length - 1, idx));
    return semiToFreq(root * octMult, notes[clamped]);
  };

  for (let step = 0; step < 128; step++) {
    const bar = Math.floor(step / 8); // 0..15 bars
    const stepInBar = step % 8;
    const isIntro = step < 16; // Bars 0-1
    const isVerseA = step >= 16 && step < 48; // Bars 2-5
    const isVerseB = step >= 48 && step < 80; // Bars 6-9
    const isChorus = step >= 80 && step < 112; // Bars 10-13
    // Bars 14-15 = Bridge / Climax

    const prog = isChorus ? opts.chordProgChorus : opts.chordProgVerse;
    const chordDeg = prog[bar % 4];

    // 1. BASSLINE
    if (isIntro) {
      bass.push(stepInBar === 0 || stepInBar === 4 ? getNote(chordDeg, 0.5) : 0);
    } else if (isChorus) {
      // Driving octave bass in Chorus
      bass.push(
        step % 2 === 0 ? getNote(chordDeg, 0.5) : getNote(chordDeg, 1.0)
      );
    } else {
      bass.push(
        stepInBar % 2 === 0
          ? getNote(chordDeg, 0.5)
          : stepInBar === 7
          ? getNote(chordDeg + 2, 0.5)
          : getNote(chordDeg, 1.0)
      );
    }

    // 2. ARPEGGIO / CHORD HARMONY
    const arpOffsets = isChorus ? [0, 2, 4, 7] : [0, 2, 4, 2];
    const arpDeg = chordDeg + arpOffsets[step % 4];
    arp.push(getNote(arpDeg, isChorus ? 1.5 : 1.0));

    // 3. LEAD MELODY ACROSS 5 SECTIONS
    const motifStep = step % 16;
    if (isIntro) {
      // Sparse atmospheric intro motif
      const introIdx = opts.verseMotif[motifStep];
      lead.push(step % 2 === 0 ? getNote(introIdx, 1.0) : 0);
    } else if (isVerseA) {
      const mIdx = opts.verseMotif[motifStep];
      lead.push(mIdx < 0 ? 0 : getNote(mIdx, 2.0));
    } else if (isVerseB) {
      // Harmonized variation (+2 scale degrees on odd bars)
      const baseIdx = opts.verseMotif[motifStep];
      const varIdx =
        baseIdx < 0 ? -1 : baseIdx + (bar % 2 === 1 && stepInBar >= 4 ? 2 : 0);
      lead.push(varIdx < 0 ? 0 : getNote(varIdx, 2.0));
    } else if (isChorus) {
      // Soaring Anthem Chorus
      const cIdx = opts.chorusMotif[motifStep];
      lead.push(cIdx < 0 ? 0 : getNote(cIdx, 2.0));
    } else {
      // Climax / Bridge Arpeggiated Solo
      const bridgeIdx =
        chordDeg + [4, 6, 7, 9, 7, 6, 4, 2][stepInBar];
      lead.push(getNote(bridgeIdx, 2.0));
    }

    // 4. DRUMS & SECTION TRANSITIONS
    if (step === 0 || step === 16 || step === 48 || step === 80 || step === 112) {
      drums.push('crash');
    } else if (isIntro) {
      drums.push(stepInBar === 0 ? 'kick' : stepInBar === 4 ? 'hat' : 'none');
    } else if (step >= 120) {
      // Climax drum fill
      drums.push(step % 2 === 0 ? 'snare' : 'kick_hat');
    } else if (isChorus) {
      if (stepInBar === 0 || stepInBar === 3 || stepInBar === 4) {
        drums.push('kick_hat');
      } else if (stepInBar === 2 || stepInBar === 6) {
        drums.push('snare');
      } else {
        drums.push('hat');
      }
    } else {
      if (stepInBar === 0 || stepInBar === 4) drums.push('kick');
      else if (stepInBar === 2 || stepInBar === 6) drums.push('snare');
      else drums.push('hat');
    }
  }

  return {
    name: opts.name,
    subtitle: opts.subtitle,
    style: opts.style,
    bpm: opts.bpm,
    lead,
    arp,
    bass,
    drums,
    lyrics: opts.lyrics,
  };
}

function buildPresetPatterns(): Record<
  Exclude<BgmTrack, 'custom'>,
  ChiptunePattern
> {
  return {
    title: composeFullSong128({
      name: 'Khúc Khải Hoàn Hắc Thạch (Obsidian Overture)',
      subtitle: 'Main Title Theme · Full 5-Part Song',
      style: 'heroic_minor',
      bpm: 132,
      verseMotif: [0, -1, 2, 4, 3, -1, 2, 1, 0, 2, 4, 6, 4, 3, 2, -1],
      chorusMotif: [4, 4, 6, 7, 6, 4, 3, 2, 4, 6, 7, 9, 8, 7, 6, 4],
      chordProgVerse: [0, 5, 3, 4],
      chordProgChorus: [5, 3, 0, 4],
      lyrics: [
        '♪ [Intro] Giữa bóng đêm Hắc Thạch ngàn năm ngủ vùi...',
        '♪ [Verse 1] Lưỡi kiếm thức tỉnh, ánh lửa rực cháy nơi thánh đường cổ xưa.',
        '♪ [Verse 2] Sáu vị anh hùng bước qua cổng dịch chuyển không chút chùn bước.',
        '♪ [Chorus] Tiến xuống hầm ngục sâu! Chém tan mưa đạn, khắc tên vào huyền thoại!',
        '♪ [Climax] Ánh sáng Linh Thạch bùng nổ dẫn lối chiến thắng vinh quang!',
      ],
    }),
    lobby: composeFullSong128({
      name: 'Thánh Điện Hiệp Sĩ (Sanctuary Ballad)',
      subtitle: 'Living Room Sanctuary · Full 5-Part Song',
      style: 'arcade_major',
      bpm: 118,
      verseMotif: [0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 7, 5, 4, 2, -1],
      chorusMotif: [4, 5, 7, 9, 7, 5, 4, 2, 3, 4, 5, 7, 5, 4, 2, 0],
      chordProgVerse: [0, 3, 4, 0],
      chordProgChorus: [3, 4, 2, 0],
      lyrics: [
        '♪ [Intro] Tiếng lửa bập bùng sưởi ấm đại sảnh Hiệp Sĩ...',
        '♪ [Verse 1] Nâng ly rượu mừng, mài sắc thanh đao bên đe rèn rực đỏ.',
        '♪ [Verse 2] Những người bạn đồng hành trung thành sẵn sàng sát cánh.',
        '♪ [Chorus] Nơi bình yên trước cơn bão lớn, tình huynh đệ bất diệt!',
        '♪ [Climax] Cổng hầm ngục đã mở, cùng nhau viết tiếp khúc tráng ca!',
      ],
    }),
    dungeon: composeFullSong128({
      name: 'Kiếm Khí Hầm Ngục 1-1 (Blade & Bullet Storm)',
      subtitle: 'Stage 1-1 Obsidian Crypt · Full 5-Part Song',
      style: 'samurai_pentatonic',
      bpm: 148,
      verseMotif: [2, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 5, 6, 5, 4, 3],
      chorusMotif: [5, 5, 7, 8, 7, 5, 4, 3, 5, 7, 8, 9, 8, 7, 5, 4],
      chordProgVerse: [0, 3, 2, 4],
      chordProgChorus: [3, 4, 5, 0],
      lyrics: [
        '♪ [Intro] Bước chân vang vọng giữa hầm mộ đá đen lạnh lẽo...',
        '♪ [Verse 1] Bóng tối rình rập, từng đàn quái vật lao ra từ màn sương.',
        '♪ [Verse 2] Lưỡi Katana vung lên như chớp giật, phản xạ từng viên đạn đỏ.',
        '♪ [Chorus] Bão kiếm cuồng phong! Không kẻ thù nào cản nổi bước chân hiệp sĩ!',
        '♪ [Climax] Tốc biến qua làn đạn, kết liễu mục tiêu trong chớp mắt!',
      ],
    }),
    frost: composeFullSong128({
      name: 'Băng Tuyết Vĩnh Cửu 1-2 (Crystal Frostbite)',
      subtitle: 'Stage 1-2 Frostbite Cavern · Full 5-Part Song',
      style: 'cyber_synth',
      bpm: 142,
      verseMotif: [4, -1, 6, 7, 4, 2, 3, 4, 2, 4, 6, 8, 7, 6, 4, -1],
      chorusMotif: [7, 8, 9, 7, 6, 7, 8, 6, 4, 6, 7, 9, 10, 9, 7, 6],
      chordProgVerse: [0, 2, 5, 4],
      chordProgChorus: [5, 3, 0, 4],
      lyrics: [
        '♪ [Intro] Hơi thở đóng băng giữa động pha lê xanh thẳm...',
        '♪ [Verse 1] Tinh thể băng ngân vang như tiếng đàn giữa lòng đất lạnh.',
        '♪ [Verse 2] Pháp sư hư không và chiến binh giáp sắt chắn ngang lối đi.',
        '♪ [Chorus] Băng tuyết gào thét! Ngọn lửa ý chí làm tan chảy vạn băng hà!',
        '♪ [Climax] Ánh sáng pha lê soi rọi con đường tiến xuống lõi ngục tối!',
      ],
    }),
    magma: composeFullSong128({
      name: 'Lõi Dung Nham Địa Ngục 1-3 (Inferno Core)',
      subtitle: 'Stage 1-3 Magma Core · Full 5-Part Song',
      style: 'heroic_minor',
      bpm: 158,
      verseMotif: [4, 4, 5, 4, 2, 3, 4, 0, 4, 4, 6, 5, 4, 3, 2, 1],
      chorusMotif: [7, 7, 9, 8, 7, 6, 4, 6, 7, 9, 10, 9, 8, 7, 6, 7],
      chordProgVerse: [0, 5, 6, 4],
      chordProgChorus: [5, 6, 3, 4],
      lyrics: [
        '♪ [Intro] Sức nóng dung nham sôi sục dưới từng phiến đá cổ...',
        '♪ [Verse 1] Biển lửa địa ngục cuộn trào, thử thách lòng quả cảm tối thượng.',
        '♪ [Verse 2] Kẻ yếu gục ngã, người mạnh vươn lên giữa tàn tro rực cháy.',
        '♪ [Chorus] Giữa tâm bão lửa! Tuyệt kỹ thức tỉnh quét sạch quân đoàn bóng tối!',
        '♪ [Climax] Vượt qua tầng sâu nhất, đối mặt Chúa Tể Hầm Ngục!',
      ],
    }),
    boss: composeFullSong128({
      name: 'Cuồng Nộ Hắc Vương (Wrath of the Archfiend)',
      subtitle: 'Boss Battle Anthem · Full 5-Part Song',
      style: 'boss_phrygian',
      bpm: 168,
      verseMotif: [4, 5, 4, 3, 4, 6, 5, 3, 4, 5, 6, 8, 7, 6, 5, 4],
      chorusMotif: [8, 9, 8, 6, 7, 8, 6, 5, 8, 9, 10, 9, 8, 6, 5, 4],
      chordProgVerse: [0, 1, 3, 1],
      chordProgChorus: [5, 3, 1, 0],
      lyrics: [
        '♪ [Intro] Còi báo động vang rền! Chúa tể bóng tối giáng lâm!',
        '♪ [Verse 1] Mưa đạn địa ngục phủ kín đấu trường không một góc trốn.',
        '♪ [Verse 2] Giữ vững nhịp thở, lướt qua tử thần trong tích tắc sinh tử.',
        '♪ [Chorus] Quyết chiến sinh tử! Dồn toàn lực tung đòn chí mạng kết liễu Boss!',
        '♪ [Climax] Hắc Vương sụp đổ, hào quang chiến thắng thuộc về người anh hùng!',
      ],
    }),
  };
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public bgmMuted: boolean = false;
  private currentTrack: BgmTrack = 'title';
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  // Optional external MP3/WAV audio element for uploaded or streamed songs
  private externalAudio: HTMLAudioElement | null = null;
  private externalAudioTitle: string | null = null;

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
    name: 'Bản Nhạc Tự Sáng Tác #1',
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

  public getCurrentTrackId(): BgmTrack {
    return this.currentTrack;
  }

  public getActivePattern(): ChiptunePattern {
    if (this.currentTrack === 'custom') return this.customPattern;
    return this.presets[this.currentTrack] || this.presets.title;
  }

  public getCurrentSongStatus(): {
    title: string;
    subtitle: string;
    section: SongSectionName;
    lyricLine: string;
    step: number;
    totalSteps: number;
    bpm: number;
    isExternalMp3: boolean;
  } {
    if (this.externalAudio && !this.externalAudio.paused) {
      return {
        title: this.externalAudioTitle || 'MP3 Custom Song',
        subtitle: 'File Âm Thanh Bài Hát Hoàn Chỉnh',
        section: 'CHORUS',
        lyricLine: '♫ Đang phát trực tiếp bài hát âm thanh chất lượng cao...',
        step: Math.floor((this.externalAudio.currentTime % 60) * 2),
        totalSteps: 120,
        bpm: 140,
        isExternalMp3: true,
      };
    }

    const pat = this.getActivePattern();
    const total = pat.lead.length || 128;
    const step = this.bgmStep % total;

    let section: SongSectionName = 'INTRO';
    let secIdx = 0;
    if (step >= 112) {
      section = 'CLIMAX';
      secIdx = 4;
    } else if (step >= 80) {
      section = 'CHORUS';
      secIdx = 3;
    } else if (step >= 48) {
      section = 'VERSE B';
      secIdx = 2;
    } else if (step >= 16) {
      section = 'VERSE A';
      secIdx = 1;
    }

    const defaultLyrics = [
      '♪ [Intro] Mở đầu giai điệu hầm ngục Hắc Thạch...',
      '♪ [Verse A] Nhịp trống dồn dập dẫn bước chân anh hùng...',
      '♪ [Verse B] Hoà âm biến tấu, kiếm khí rực sáng trong đêm...',
      '♪ [Chorus] Điệp khúc bùng nổ! Chiến đấu vì vinh quang tối thượng!',
      '♪ [Climax] Cao trào kết thúc, chuyển đoạn mượt mà!',
    ];

    return {
      title: pat.name,
      subtitle: pat.subtitle || MUSIC_SCALES[pat.style]?.label || 'Full Song',
      section,
      lyricLine: pat.lyrics?.[secIdx] || defaultLyrics[secIdx],
      step,
      totalSteps: total,
      bpm: pat.bpm,
      isExternalMp3: false,
    };
  }

  // Play an uploaded or streamed MP3/WAV audio file as the active BGM song
  public playExternalAudioFile(url: string, title: string) {
    this.stopBgm();
    this.externalAudioTitle = title;
    if (typeof window === 'undefined') return;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.55;
    this.externalAudio = audio;
    if (!this.bgmMuted) {
      audio.play().catch(() => {});
    }
  }

  public clearExternalAudio() {
    if (this.externalAudio) {
      this.externalAudio.pause();
      this.externalAudio.src = '';
      this.externalAudio = null;
      this.externalAudioTitle = null;
    }
  }

  // ==========================================================================
  // AI MULTI-SECTION SONG COMPOSER (Sáng Tác Bài Hát Đầy Đủ 5 Đoạn Bằng AI)
  // ==========================================================================
  public async composeAiSongFromPrompt(
    promptText: string,
    preferredStyle: MusicStyle = 'samurai_pentatonic',
    preferredBpm: number = 148
  ): Promise<ChiptunePattern> {
    this.clearExternalAudio();

    try {
      const response = await fetch('/api/music/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          preferredStyle,
          preferredBpm,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const style: MusicStyle =
          data.style && MUSIC_SCALES[data.style as MusicStyle]
            ? (data.style as MusicStyle)
            : preferredStyle;
        const bpm = Math.max(
          95,
          Math.min(185, Number(data.bpm) || preferredBpm)
        );
        const vMotif = Array.from({ length: 16 }, (_, i) =>
          typeof data.verseMotif?.[i] === 'number' ? data.verseMotif[i] : 2
        );
        const cMotif = Array.from({ length: 16 }, (_, i) =>
          typeof data.chorusMotif?.[i] === 'number' ? data.chorusMotif[i] : 6
        );
        const lyrics: [string, string, string, string, string] = [
          data.lyrics?.[0] || '♪ [Intro] Giai điệu mở màn vang lên...',
          data.lyrics?.[1] || '♪ [Verse 1] Bước vào mê cung bóng tối...',
          data.lyrics?.[2] || '♪ [Verse 2] Kiếm quang rực sáng dẫn đường...',
          data.lyrics?.[3] || '♪ [Chorus] Bùng nổ sức mạnh anh hùng bất diệt!',
          data.lyrics?.[4] || '♪ [Climax] Chiến thắng vang dội khắp hầm ngục!',
        ];

        const aiSong = composeFullSong128({
          name: data.songTitle || `AI Song: ${promptText.slice(0, 22)}`,
          subtitle: `AI Composed Song · ${bpm} BPM`,
          style,
          bpm,
          verseMotif: vMotif,
          chorusMotif: cMotif,
          chordProgVerse: [0, 5, 3, 4],
          chordProgChorus: [5, 3, 0, 4],
          lyrics,
        });

        this.customPattern = aiSong;
        this.presets.dungeon = aiSong;
        this.startBgm('custom');
        return aiSong;
      }
    } catch {
      // Fallback to algorithmic full-song composer if server request fails
    }

    return this.generateProceduralSong(preferredStyle, preferredBpm, promptText);
  }

  // ==========================================================================
  // ALGORITHMIC 128-STEP FULL SONG GENERATOR (Bản Nhạc Dài 5 Phân Đoạn)
  // ==========================================================================
  public generateProceduralSong(
    style: MusicStyle = 'samurai_pentatonic',
    bpm: number = 148,
    customTitle?: string
  ): ChiptunePattern {
    this.clearExternalAudio();
    const scaleCfg = MUSIC_SCALES[style] || MUSIC_SCALES.heroic_minor;

    const verseMotif: number[] = [];
    const chorusMotif: number[] = [];
    let vCur = 3;
    let cCur = 6;

    for (let i = 0; i < 16; i++) {
      if (i % 8 === 7 && Math.random() < 0.45) {
        verseMotif.push(-1);
      } else {
        vCur = Math.max(
          0,
          Math.min(8, vCur + [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)])
        );
        verseMotif.push(vCur);
      }

      cCur = Math.max(
        4,
        Math.min(11, cCur + [-1, 0, 1, 2, -2][Math.floor(Math.random() * 5)])
      );
      chorusMotif.push(cCur);
    }

    const generated = composeFullSong128({
      name:
        customTitle?.trim() ||
        `${scaleCfg.name.split('(')[0].trim()} #${Math.floor(
          100 + Math.random() * 899
        )}`,
      subtitle: 'Full 5-Section Procedural Song (128 Steps)',
      style,
      bpm,
      verseMotif,
      chorusMotif,
      chordProgVerse: [0, 5, 3, 4],
      chordProgChorus: [5, 3, 0, 4],
      lyrics: [
        '♪ [Intro] Giai điệu mở màn vang vọng từ vực sâu Hắc Thạch...',
        '♪ [Verse 1] Từng bước chân dấn thân vào mê cung rực lửa và băng giá.',
        '♪ [Verse 2] Lưỡi gươm phản đòn chớp nhoáng giữa muôn trùng vây hãm.',
        '♪ [Chorus] Điệp khúc anh hùng! Bùng nổ tuyệt kỹ quét sạch bóng đêm!',
        '♪ [Climax] Khúc vĩ thanh chiến thắng mở ra cánh cổng vinh quang!',
      ],
    });

    this.customPattern = generated;
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
    if (
      (track === 'dungeon' || track === 'frost' || track === 'magma') &&
      this.currentTrack === 'custom'
    ) {
      track = 'custom';
    }
    if (this.currentTrack !== track) {
      this.bgmStep = 0;
    }
    this.currentTrack = track;

    if (this.bgmMuted || typeof window === 'undefined') {
      this.stopBgm();
      return;
    }

    // If user loaded an external MP3 song, play that!
    if (this.externalAudio) {
      if (this.bgmTimer !== null) {
        window.clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
      this.externalAudio.play().catch(() => {});
      return;
    }

    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }

    const pattern = this.getActivePattern();
    const stepMs = Math.round(60000 / pattern.bpm / 2);

    this.bgmTimer = window.setInterval(() => {
      if (this.bgmMuted) return;
      const ctx = this.ensureContext(true);
      if (!ctx || ctx.state !== 'running') return;

      const pat = this.getActivePattern();
      const now = ctx.currentTime;
      const totalSteps = pat.lead.length || 128;
      const idx = this.bgmStep % totalSteps;
      const isChorus = idx >= 80 && idx < 112;
      this.bgmStep++;

      const stepDur = stepMs / 1000;

      // 1. Expressive Lead Synth (Filtered Sawtooth/Triangle + LFO Vibrato)
      if (this.channelEnabled.lead && pat.lead[idx] > 0) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = pat.style === 'arcade_major' ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(pat.lead[idx], now);

        // Subtle pitch vibrato on Chorus & held notes
        if (isChorus || idx % 2 === 0) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 5.5;
          lfoGain.gain.value = isChorus ? 4.2 : 2.2;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + stepDur * 1.15);
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isChorus ? 2800 : 2100, now);
        filter.frequency.exponentialRampToValueAtTime(750, now + stepDur * 0.95);

        const dur = stepDur * (isChorus ? 1.08 : 0.92);
        const peakGain = isChorus ? 0.036 : 0.028;
        gain.gain.setValueAtTime(0.002, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.015);
      }

      // 2. Polyphonic Chord Pad & Arpeggio Channel
      if (this.channelEnabled.arp && pat.arp[idx] > 0) {
        const aOsc = ctx.createOscillator();
        const aFilter = ctx.createBiquadFilter();
        const aGain = ctx.createGain();

        aOsc.type = isChorus ? 'sawtooth' : 'triangle';
        aOsc.frequency.setValueAtTime(pat.arp[idx], now);
        aOsc.frequency.setValueAtTime(
          pat.arp[idx] * (isChorus ? 1.5 : 1.25),
          now + stepDur * 0.48
        );

        aFilter.type = 'lowpass';
        aFilter.frequency.setValueAtTime(1650, now);

        const dur = stepDur * 0.88;
        aGain.gain.setValueAtTime(isChorus ? 0.02 : 0.015, now);
        aGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

        aOsc.connect(aFilter);
        aFilter.connect(aGain);
        aGain.connect(ctx.destination);
        aOsc.start(now);
        aOsc.stop(now + dur + 0.01);
      }

      // 3. Warm Sub-Bass Channel
      if (this.channelEnabled.bass && pat.bass[idx] > 0) {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(pat.bass[idx], now);

        const dur = stepDur * 0.95;
        bGain.gain.setValueAtTime(isChorus ? 0.062 : 0.052, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + dur + 0.01);
      }

      // 4. Full Percussion Kit (Kick / Snare / Hi-Hat / Crash)
      if (this.channelEnabled.drums) {
        const drum = pat.drums[idx];
        if (drum === 'kick' || drum === 'kick_hat' || drum === 'crash') {
          const kOsc = ctx.createOscillator();
          const kGain = ctx.createGain();
          kOsc.type = 'sine';
          kOsc.frequency.setValueAtTime(150, now);
          kOsc.frequency.exponentialRampToValueAtTime(34, now + 0.075);
          kGain.gain.setValueAtTime(0.072, now);
          kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          kOsc.connect(kGain);
          kGain.connect(ctx.destination);
          kOsc.start(now);
          kOsc.stop(now + 0.085);
        }
        if (drum === 'snare' || drum === 'crash') {
          const dur = drum === 'crash' ? 0.18 : 0.07;
          const bufLen = Math.floor(ctx.sampleRate * dur);
          const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
          const ch = buf.getChannelData(0);
          for (let i = 0; i < bufLen; i++) {
            ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.42));
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(drum === 'crash' ? 0.042 : 0.036, now);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
          src.connect(nGain);
          nGain.connect(ctx.destination);
          src.start(now);
        } else if (drum === 'hat' || drum === 'kick_hat') {
          const hOsc = ctx.createOscillator();
          const hGain = ctx.createGain();
          hOsc.type = 'square';
          hOsc.frequency.setValueAtTime(1580, now);
          hOsc.frequency.exponentialRampToValueAtTime(660, now + 0.022);
          hGain.gain.setValueAtTime(0.011, now);
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
    if (this.externalAudio) {
      this.externalAudio.pause();
    }
  }

  // Export full 128-step Song Track to a downloadable 16-bit PCM .WAV Blob URL!
  public exportCurrentTrackWavUrl(): string {
    const pat = this.getActivePattern();
    const sampleRate = 22050;
    const stepSec = 60 / pat.bpm / 2;
    const totalSteps = pat.lead.length || 128;
    const durationSec = totalSteps * stepSec;
    const numSamples = Math.floor(sampleRate * durationSec);
    const pcm = new Float32Array(numSamples);

    for (let step = 0; step < totalSteps; step++) {
      const idx = step % totalSteps;
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
        const env = Math.exp(-localT * 5.2);
        let sample = 0;

        if (leadF > 0) {
          const vibrato = Math.sin(2 * Math.PI * 5.5 * localT) * 2.5;
          sample +=
            Math.sin(2 * Math.PI * (leadF + vibrato) * localT) * 0.22 * env;
        }
        if (arpF > 0) {
          const f = localT > stepSec * 0.48 ? arpF * 1.25 : arpF;
          sample += Math.sin(2 * Math.PI * f * localT) * 0.12 * env;
        }
        if (bassF > 0) {
          sample +=
            Math.asin(Math.sin(2 * Math.PI * bassF * localT)) * 0.2 * env;
        }
        if ((drum === 'snare' || drum === 'crash') && localT < 0.08) {
          sample += (Math.random() * 2 - 1) * 0.16 * Math.exp(-localT * 28);
        } else if (
          (drum === 'kick' || drum === 'kick_hat' || drum === 'crash') &&
          localT < 0.075
        ) {
          sample +=
            Math.sin(2 * Math.PI * (145 - localT * 1200) * localT) * 0.26;
        }
        pcm[s] = Math.max(-0.95, Math.min(0.95, sample));
      }
    }

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
      osc.frequency.exponentialRampToValueAtTime(
        f * 1.2,
        now + idx * 0.03 + 0.25
      );

      gain.gain.setValueAtTime(0.13, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.27);
    });
  }

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
