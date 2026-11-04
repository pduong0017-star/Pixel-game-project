import {
  AvatarId,
  DailyQuest,
  EarStyle,
  GameSettings,
  HeroClassId,
  HornStyle,
  LanguageCode,
  PetId,
  PlayerProfile,
  RaceConfig,
  RaceCustomization,
  RaceId,
  SkinTier,
  WeaponId,
  WingStyle,
} from './types';

export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  target: number;
  rewardGems: number;
  accent: string;
  metric:
    | 'totalKills'
    | 'bossesDefeated'
    | 'runsCompleted'
    | 'maxWeaponUpgradeReached'
    | 'unlockedWeaponsCount'
    | 'bestEndlessWave'
    | 'chestsOpened';
  getValue: (p: PlayerProfile) => number;
}

export const ACHIEVEMENT_LIST: AchievementDef[] = [
  {
    id: 'ach_slayer_50',
    title: 'Đồ Tể Hầm Ngục I / Dungeon Slayer I',
    desc: 'Tiêu diệt tổng cộng 50 quái vật trong hầm ngục (Slay 50 foes)',
    target: 50,
    rewardGems: 250,
    accent: '#4ade80',
    metric: 'totalKills',
    getValue: (p) => p.totalKills || 0,
  },
  {
    id: 'ach_slayer_250',
    title: 'Chiến Thần Vực Thẳm / Abyssal Warlord',
    desc: 'Tiêu diệt tổng cộng 250 quái vật (Slay 250 foes)',
    target: 250,
    rewardGems: 500,
    accent: '#f43f5e',
    metric: 'totalKills',
    getValue: (p) => p.totalKills || 0,
  },
  {
    id: 'ach_boss_hunter_3',
    title: 'Kẻ Săn Đại Boss / Arch-Boss Hunter',
    desc: 'Hạ gục 3 Đại Boss canh giữ các Tầng Hầm Ngục (Defeat 3 Bosses)',
    target: 3,
    rewardGems: 400,
    accent: '#fb923c',
    metric: 'bossesDefeated',
    getValue: (p) => p.bossesDefeated || 0,
  },
  {
    id: 'ach_blacksmith_3',
    title: 'Thần Rèn Huyền Thoại / Master Blacksmith',
    desc: 'Đập vũ khí lên cấp tối đa +3 ★ tại Đe Thợ Rèn (Reforge a weapon to +3 ★)',
    target: 3,
    rewardGems: 350,
    accent: '#fde047',
    metric: 'maxWeaponUpgradeReached',
    getValue: (p) => p.maxWeaponUpgradeReached || 0,
  },
  {
    id: 'ach_collector_8',
    title: 'Bậc Thầy Vũ Khí / Master Collector',
    desc: 'Sở hữu ít nhất 8 Vũ Khí trong Xưởng Rèn (Unlock 8 Weapons)',
    target: 8,
    rewardGems: 350,
    accent: '#38bdf8',
    metric: 'unlockedWeaponsCount',
    getValue: (p) => p.unlockedWeapons?.length || 0,
  },
  {
    id: 'ach_collector_16',
    title: 'Kho Tàng Bách Binh / Grand Arsenal 16/16',
    desc: 'Mở khóa toàn bộ 16/16 Vũ Khí Huyền Thoại (Unlock all 16 Weapons)',
    target: 16,
    rewardGems: 800,
    accent: '#c084fc',
    metric: 'unlockedWeaponsCount',
    getValue: (p) => p.unlockedWeapons?.length || 0,
  },
  {
    id: 'ach_endless_5',
    title: 'Đấu Sĩ Vô Tận / Colosseum Champion',
    desc: 'Sống sót qua Đợt 5 trong chế độ Đấu Trường Vô Tận (Reach Endless Wave 5)',
    target: 5,
    rewardGems: 450,
    accent: '#a855f7',
    metric: 'bestEndlessWave',
    getValue: (p) => p.bestEndlessWave || 0,
  },
  {
    id: 'ach_victor_1',
    title: 'Chinh Phục Hắc Thạch / Obsidian Conqueror',
    desc: 'Hoàn thành chiến dịch hoặc Boss Rush 1 lần (Complete a full run)',
    target: 1,
    rewardGems: 500,
    accent: '#f59e0b',
    metric: 'runsCompleted',
    getValue: (p) => p.runsCompleted || 0,
  },
];

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
  soulGems: 350,
  totalKills: 0,
  runsCompleted: 0,
  chestsOpened: 0,
  bossesDefeated: 0,
  bestEndlessWave: 0,
  maxWeaponUpgradeReached: 0,
  claimedAchievements: [],
  starterPackClaimed: false,
  lastDailyClaimDate: '',
  dailyStreak: 0,
  tutorialCompleted: false,
  selectedPetId: 'cat',
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
      bossesDefeated: safeNum(parsed.bossesDefeated, 0),
      bestEndlessWave: safeNum(parsed.bestEndlessWave, 0),
      maxWeaponUpgradeReached: safeNum(parsed.maxWeaponUpgradeReached, 0),
      claimedAchievements: Array.isArray(parsed.claimedAchievements)
        ? parsed.claimedAchievements.filter((x: unknown) => typeof x === 'string')
        : [],
      starterPackClaimed: Boolean(parsed.starterPackClaimed),
      lastDailyClaimDate:
        typeof parsed.lastDailyClaimDate === 'string'
          ? parsed.lastDailyClaimDate
          : '',
      dailyStreak: safeNum(parsed.dailyStreak, 0),
      tutorialCompleted: Boolean(parsed.tutorialCompleted),
      selectedPetId:
        parsed.selectedPetId === 'cat' ||
        parsed.selectedPetId === 'mini_slime' ||
        parsed.selectedPetId === 'baby_dragon' ||
        parsed.selectedPetId === 'cyber_neko'
          ? (parsed.selectedPetId as PetId)
          : 'cat',
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
    claimedAchievements: [...(prof.claimedAchievements || [])],
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
