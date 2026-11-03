import {
  AvatarId,
  DailyQuest,
  EarStyle,
  GameSettings,
  HeroClassId,
  HornStyle,
  LanguageCode,
  PlayerProfile,
  RaceConfig,
  RaceCustomization,
  RaceId,
  SkinTier,
  WeaponId,
  WingStyle,
} from './types';

const PROFILE_KEY = 'obsidian_soul_knight_profile_v4';
const SETTINGS_KEY = 'obsidian_soul_knight_settings_v4';

export const RACES: Record<RaceId, RaceConfig> = {
  human: {
    id: 'human',
    accent: '#38bdf8',
    hpBonus: 10,
    armorBonus: 5,
    manaBonus: 0,
    critBonus: 0,
    speedBonus: 0,
    dmgBonus: 0,
    defaultCustom: {
      skinColor: '#fbd38d',
      hornStyle: 'none',
      wingStyle: 'none',
      earStyle: 'human',
      eyeColor: '#38bdf8',
    },
  },
  elf: {
    id: 'elf',
    accent: '#34d399',
    hpBonus: 0,
    armorBonus: 0,
    manaBonus: 25,
    critBonus: 0.03,
    speedBonus: 0.35,
    dmgBonus: 0,
    defaultCustom: {
      skinColor: '#ffe4e6',
      hornStyle: 'dragon_antlers',
      wingStyle: 'angel_wings',
      earStyle: 'elf_long',
      eyeColor: '#10b981',
    },
  },
  demon: {
    id: 'demon',
    accent: '#f43f5e',
    hpBonus: 5,
    armorBonus: 0,
    manaBonus: 10,
    critBonus: 0.05,
    speedBonus: 0.15,
    dmgBonus: 0.08,
    defaultCustom: {
      skinColor: '#fb7185',
      hornStyle: 'demon_horns',
      wingStyle: 'bat_wings',
      earStyle: 'elf_long',
      eyeColor: '#fde047',
    },
  },
  orc: {
    id: 'orc',
    accent: '#84cc16',
    hpBonus: 28,
    armorBonus: 5,
    manaBonus: 0,
    critBonus: 0.02,
    speedBonus: 0,
    dmgBonus: 0.05,
    defaultCustom: {
      skinColor: '#4ade80',
      hornStyle: 'crown_spikes',
      wingStyle: 'none',
      earStyle: 'beast_ears',
      eyeColor: '#ef4444',
    },
  },
  undead: {
    id: 'undead',
    accent: '#c084fc',
    hpBonus: 0,
    armorBonus: 15,
    manaBonus: 20,
    critBonus: 0.04,
    speedBonus: 0.1,
    dmgBonus: 0.04,
    defaultCustom: {
      skinColor: '#e2e8f0',
      hornStyle: 'crown_spikes',
      wingStyle: 'cyber_wings',
      earStyle: 'human',
      eyeColor: '#c084fc',
    },
  },
};

export const SKIN_TONES = [
  { id: 'warm', color: '#fbd38d', label: 'Warm Peach' },
  { id: 'ivory', color: '#ffe4e6', label: 'Elf Ivory' },
  { id: 'crimson', color: '#fb7185', label: 'Demon Crimson' },
  { id: 'orc_green', color: '#4ade80', label: 'Orc Emerald' },
  { id: 'frost_blue', color: '#93c5fd', label: 'Frost Celestial' },
  { id: 'bone_ash', color: '#e2e8f0', label: 'Undead Bone' },
];

export const EYE_COLORS = [
  { id: 'cyan', color: '#38bdf8' },
  { id: 'gold', color: '#fde047' },
  { id: 'crimson', color: '#ef4444' },
  { id: 'emerald', color: '#10b981' },
  { id: 'violet', color: '#c084fc' },
];

export const HORN_STYLES: HornStyle[] = [
  'none',
  'demon_horns',
  'dragon_antlers',
  'crown_spikes',
];

export const WING_STYLES: WingStyle[] = [
  'none',
  'angel_wings',
  'bat_wings',
  'cyber_wings',
];

export const EAR_STYLES: EarStyle[] = ['human', 'elf_long', 'beast_ears'];

export const DEFAULT_RACE_CUSTOM: RaceCustomization = {
  raceId: 'human',
  ...RACES.human.defaultCustom,
};

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'q_slay_25',
    title: 'Thợ Săn Hầm Ngục / Dungeon Hunter',
    desc: 'Tiêu diệt 25 quái vật trong hầm ngục (Slay 25 foes)',
    target: 25,
    progress: 12,
    rewardGems: 180,
    claimed: false,
  },
  {
    id: 'q_open_chest',
    title: 'Khám Phá Kho Báu / Treasure Seeker',
    desc: 'Mở 1 Rương Bí Ẩn hoặc Rèn 1 Vũ Khí mới (Open Chest / Forge)',
    target: 1,
    progress: 1,
    rewardGems: 200,
    claimed: false,
  },
  {
    id: 'q_clear_floors',
    title: 'Chinh Phục Tầng Sâu / Deep Delver',
    desc: 'Vượt qua 3 phòng chiến đấu (Clear 3 combat rooms)',
    target: 3,
    progress: 1,
    rewardGems: 250,
    claimed: false,
  },
  {
    id: 'q_upgrade_stat',
    title: 'Cường Hóa Thánh Điện / Sanctuary Ascent',
    desc: 'Nâng cấp bất kỳ chỉ số vĩnh viễn nào 2 lần (Upgrade stats 2x)',
    target: 2,
    progress: 0,
    rewardGems: 160,
    claimed: false,
  },
];

export const DEFAULT_PROFILE: PlayerProfile = {
  playerName: 'Knight_01',
  avatarId: 'knight_helm',
  soulGems: 850,
  totalKills: 12,
  runsCompleted: 0,
  chestsOpened: 0,
  upgrades: {
    hpLevel: 0,
    armorLevel: 0,
    manaLevel: 0,
    dmgLevel: 0,
    goldLevel: 0,
  },
  unlockedHeroes: ['knight', 'pyromancer', 'rogue'],
  unlockedSkins: {
    knight: ['default'],
    pyromancer: ['default'],
    rogue: ['default'],
    alchemist: ['default'],
    necromancer: ['default'],
    berserker: ['default'],
  },
  selectedSkins: {
    knight: 'default',
    pyromancer: 'default',
    rogue: 'default',
    alchemist: 'default',
    necromancer: 'default',
    berserker: 'default',
  },
  raceCustom: { ...DEFAULT_RACE_CUSTOM },
  unlockedWeapons: [
    'broadsword',
    'pioneer_pistol',
    'twin_daggers',
    'blood_katana',
  ],
  selectedStarterWeapon: null,
  preRunWeapon: null,
  preRunPotion: false,
  dailyQuests: DEFAULT_DAILY_QUESTS,
};

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'vi',
  muted: false,
  bgmMuted: false,
  shakeIntensity: 'normal',
  autoAim: true,
  showDamageNumbers: true,
  controlScale: 'normal',
};

export const AVATAR_LIST: {
  id: AvatarId;
  name: string;
  title: string;
  accent: string;
}[] = [
  {
    id: 'knight_helm',
    name: 'Aegis Paladin',
    title: 'Vanguard Commander',
    accent: '#f59e0b',
  },
  {
    id: 'pyro_hood',
    name: 'Solar Archmage',
    title: 'Keeper of Embers',
    accent: '#f97316',
  },
  {
    id: 'rogue_mask',
    name: 'Phantom Assassin',
    title: 'Shadow Walker',
    accent: '#10b981',
  },
  {
    id: 'alchemist_visor',
    name: 'Plague Alchemist',
    title: 'Venom Master',
    accent: '#a3e635',
  },
  {
    id: 'dragon_crest',
    name: 'Dragon Sovereign',
    title: 'Wyrmscale Champion',
    accent: '#f43f5e',
  },
  {
    id: 'slime_crown',
    name: 'Royal Slime King',
    title: 'Dungeon Mascot',
    accent: '#38bdf8',
  },
];

function safeNum(val: unknown, fallback: number = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeUnlockedSkins(
  raw: unknown
): Record<HeroClassId, SkinTier[]> {
  const base: Record<HeroClassId, SkinTier[]> = {
    knight: ['default'],
    pyromancer: ['default'],
    rogue: ['default'],
    alchemist: ['default'],
    necromancer: ['default'],
    berserker: ['default'],
  };
  if (!raw || typeof raw !== 'object') return base;

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (typeof item === 'string') {
        const parts = item.split('_');
        const cls = parts[0] as HeroClassId;
        const tier = parts[1] as SkinTier;
        if (base[cls] && tier && !base[cls].includes(tier)) {
          base[cls].push(tier);
        }
      }
    });
    return base;
  }

  const obj = raw as Record<string, unknown>;
  (Object.keys(base) as HeroClassId[]).forEach((cls) => {
    const arr = obj[cls];
    if (Array.isArray(arr)) {
      const valid = arr.filter(
        (t): t is SkinTier =>
          t === 'default' || t === 'rare' || t === 'legendary'
      );
      base[cls] = valid.includes('default') ? valid : ['default', ...valid];
    }
  });
  return base;
}

export function loadProfile(): PlayerProfile {
  try {
    const raw =
      localStorage.getItem(PROFILE_KEY) ||
      localStorage.getItem('obsidian_soul_knight_profile_v3');
    if (!raw) {
      return structuredCloneFallback(DEFAULT_PROFILE);
    }
    const parsed = JSON.parse(raw);
    const upg = parsed?.upgrades || {};
    const selSkins = parsed?.selectedSkins || {};
    const rc = parsed?.raceCustom || {};

    const unlockedWpn: WeaponId[] = Array.isArray(parsed.unlockedWeapons)
      ? (parsed.unlockedWeapons as WeaponId[])
      : [...DEFAULT_PROFILE.unlockedWeapons];
    if (!unlockedWpn.includes('blood_katana')) {
      unlockedWpn.push('blood_katana');
    }

    return {
      playerName:
        typeof parsed.playerName === 'string' && parsed.playerName.trim()
          ? parsed.playerName
          : DEFAULT_PROFILE.playerName,
      avatarId: AVATAR_LIST.some((a) => a.id === parsed.avatarId)
        ? parsed.avatarId
        : DEFAULT_PROFILE.avatarId,
      soulGems: safeNum(parsed.soulGems, DEFAULT_PROFILE.soulGems),
      totalKills: safeNum(parsed.totalKills, DEFAULT_PROFILE.totalKills),
      runsCompleted: safeNum(parsed.runsCompleted, 0),
      chestsOpened: safeNum(parsed.chestsOpened, 0),
      upgrades: {
        hpLevel: safeNum(upg.hpLevel, 0),
        armorLevel: safeNum(upg.armorLevel, 0),
        manaLevel: safeNum(upg.manaLevel, 0),
        dmgLevel: safeNum(upg.dmgLevel ?? upg.damageLevel, 0),
        goldLevel: safeNum(upg.goldLevel ?? upg.startingGoldLevel, 0),
      },
      unlockedHeroes: Array.isArray(parsed.unlockedHeroes)
        ? (parsed.unlockedHeroes as HeroClassId[])
        : [...DEFAULT_PROFILE.unlockedHeroes],
      unlockedSkins: normalizeUnlockedSkins(parsed.unlockedSkins),
      selectedSkins: {
        knight: (selSkins.knight as SkinTier) || 'default',
        pyromancer: (selSkins.pyromancer as SkinTier) || 'default',
        rogue: (selSkins.rogue as SkinTier) || 'default',
        alchemist: (selSkins.alchemist as SkinTier) || 'default',
        necromancer: (selSkins.necromancer as SkinTier) || 'default',
        berserker: (selSkins.berserker as SkinTier) || 'default',
      },
      raceCustom: {
        raceId: RACES[rc.raceId as RaceId] ? (rc.raceId as RaceId) : 'human',
        skinColor:
          typeof rc.skinColor === 'string'
            ? rc.skinColor
            : DEFAULT_RACE_CUSTOM.skinColor,
        hornStyle: HORN_STYLES.includes(rc.hornStyle)
          ? rc.hornStyle
          : DEFAULT_RACE_CUSTOM.hornStyle,
        wingStyle: WING_STYLES.includes(rc.wingStyle)
          ? rc.wingStyle
          : DEFAULT_RACE_CUSTOM.wingStyle,
        earStyle: EAR_STYLES.includes(rc.earStyle)
          ? rc.earStyle
          : DEFAULT_RACE_CUSTOM.earStyle,
        eyeColor:
          typeof rc.eyeColor === 'string'
            ? rc.eyeColor
            : DEFAULT_RACE_CUSTOM.eyeColor,
      },
      unlockedWeapons: unlockedWpn,
      selectedStarterWeapon: parsed.selectedStarterWeapon || null,
      preRunWeapon: parsed.preRunWeapon || null,
      preRunPotion: Boolean(parsed.preRunPotion ?? parsed.preRunExtraPotion),
      dailyQuests: Array.isArray(parsed.dailyQuests)
        ? parsed.dailyQuests.map((q: DailyQuest, idx: number) => ({
            ...DEFAULT_DAILY_QUESTS[idx % DEFAULT_DAILY_QUESTS.length],
            ...q,
            progress: safeNum(q.progress, 0),
            target: safeNum(q.target, 1),
            rewardGems: safeNum(q.rewardGems, 150),
            claimed: Boolean(q.claimed),
          }))
        : DEFAULT_DAILY_QUESTS.map((q) => ({ ...q })),
    };
  } catch {
    return structuredCloneFallback(DEFAULT_PROFILE);
  }
}

function structuredCloneFallback(prof: PlayerProfile): PlayerProfile {
  return {
    ...prof,
    upgrades: { ...prof.upgrades },
    unlockedHeroes: [...prof.unlockedHeroes],
    unlockedSkins: {
      knight: [...prof.unlockedSkins.knight],
      pyromancer: [...prof.unlockedSkins.pyromancer],
      rogue: [...prof.unlockedSkins.rogue],
      alchemist: [...prof.unlockedSkins.alchemist],
      necromancer: [...prof.unlockedSkins.necromancer],
      berserker: [...prof.unlockedSkins.berserker],
    },
    selectedSkins: { ...prof.selectedSkins },
    raceCustom: { ...prof.raceCustom },
    unlockedWeapons: [...prof.unlockedWeapons],
    dailyQuests: prof.dailyQuests.map((q) => ({ ...q })),
  };
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw =
      localStorage.getItem(SETTINGS_KEY) ||
      localStorage.getItem('obsidian_soul_knight_settings_v3');
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    const validLang: LanguageCode =
      parsed.language === 'vi' ||
      parsed.language === 'en' ||
      parsed.language === 'ja' ||
      parsed.language === 'ko'
        ? parsed.language
        : 'vi';
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      language: validLang,
      bgmMuted: Boolean(parsed.bgmMuted),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}
