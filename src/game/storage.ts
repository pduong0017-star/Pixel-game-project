import {
  AvatarId,
  DailyQuest,
  GameSettings,
  HeroClassId,
  PlayerProfile,
  SkinTier,
  WeaponId,
} from './types';

const PROFILE_KEY = 'obsidian_soul_knight_profile_v3';
const SETTINGS_KEY = 'obsidian_soul_knight_settings_v3';

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'slay_foes',
    title: 'Thợ Săn Hầm Ngục',
    desc: 'Tiêu diệt 25 quái vật trong hầm ngục',
    target: 25,
    progress: 12,
    rewardGems: 180,
    claimed: false,
  },
  {
    id: 'open_gacha_or_forge',
    title: 'Khám Phá Kho Báu',
    desc: 'Mở 1 Rương Bí Ẩn (Gacha) hoặc Rèn 1 Vũ Khí mới',
    target: 1,
    progress: 1, // Ready to claim immediately as a welcome bonus!
    rewardGems: 200,
    claimed: false,
  },
  {
    id: 'clear_dungeon_stage',
    title: 'Chinh Phục Tầng Sâu',
    desc: 'Chiến thắng hoặc vượt qua các phòng chiến đấu (3 phòng)',
    target: 3,
    progress: 1,
    rewardGems: 250,
    claimed: false,
  },
  {
    id: 'upgrade_hero_stat',
    title: 'Cường Hóa Thánh Điện',
    desc: 'Nâng cấp bất kỳ chỉ số vĩnh viễn nào 2 lần',
    target: 2,
    progress: 0,
    rewardGems: 160,
    claimed: false,
  },
];

export const DEFAULT_PROFILE: PlayerProfile = {
  playerName: 'Knight_01',
  avatarId: 'knight_helm',
  soulGems: 750, // Starter Soul Gems to test Gacha Chest, Skins, Hero Unlocks & Armory!
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
  unlockedSkins: [
    'knight_default',
    'pyromancer_default',
    'rogue_default',
    'alchemist_default',
    'necromancer_default',
    'berserker_default',
  ],
  selectedSkins: {
    knight: 'default',
    pyromancer: 'default',
    rogue: 'default',
    alchemist: 'default',
    necromancer: 'default',
    berserker: 'default',
  },
  unlockedWeapons: ['broadsword', 'pioneer_pistol', 'twin_daggers'],
  selectedStarterWeapon: null,
  preRunWeapon: null,
  preRunPotion: false,
  dailyQuests: DEFAULT_DAILY_QUESTS,
};

export const DEFAULT_SETTINGS: GameSettings = {
  muted: false,
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

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return structuredCloneFallback(DEFAULT_PROFILE);
    }
    const parsed = JSON.parse(raw);
    const upg = parsed?.upgrades || {};
    const selSkins = parsed?.selectedSkins || {};

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
      unlockedSkins: Array.isArray(parsed.unlockedSkins)
        ? (parsed.unlockedSkins as string[])
        : [...DEFAULT_PROFILE.unlockedSkins],
      selectedSkins: {
        knight: (selSkins.knight as SkinTier) || 'default',
        pyromancer: (selSkins.pyromancer as SkinTier) || 'default',
        rogue: (selSkins.rogue as SkinTier) || 'default',
        alchemist: (selSkins.alchemist as SkinTier) || 'default',
        necromancer: (selSkins.necromancer as SkinTier) || 'default',
        berserker: (selSkins.berserker as SkinTier) || 'default',
      },
      unlockedWeapons: Array.isArray(parsed.unlockedWeapons)
        ? (parsed.unlockedWeapons as WeaponId[])
        : [...DEFAULT_PROFILE.unlockedWeapons],
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
    unlockedSkins: [...prof.unlockedSkins],
    selectedSkins: { ...prof.selectedSkins },
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
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
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
