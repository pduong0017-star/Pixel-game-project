import { AvatarId, GameSettings, PlayerProfile } from './types';

const PROFILE_KEY = 'obsidian_soul_knight_profile_v2';
const SETTINGS_KEY = 'obsidian_soul_knight_settings_v2';

export const DEFAULT_PROFILE: PlayerProfile = {
  playerName: 'Knight_01',
  avatarId: 'knight_helm',
  soulGems: 500, // Starter Soul Gems so players can immediately buy upgrades or weapons!
  totalKills: 0,
  runsCompleted: 0,
  upgrades: {
    hpLevel: 0,
    armorLevel: 0,
    manaLevel: 0,
    dmgLevel: 0,
    goldLevel: 0,
  },
  preRunWeapon: null,
  preRunPotion: false,
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
      return {
        ...DEFAULT_PROFILE,
        upgrades: { ...DEFAULT_PROFILE.upgrades },
      };
    }
    const parsed = JSON.parse(raw);
    const upg = parsed?.upgrades || {};
    return {
      playerName:
        typeof parsed.playerName === 'string' && parsed.playerName.trim()
          ? parsed.playerName
          : DEFAULT_PROFILE.playerName,
      avatarId: AVATAR_LIST.some((a) => a.id === parsed.avatarId)
        ? parsed.avatarId
        : DEFAULT_PROFILE.avatarId,
      soulGems: safeNum(parsed.soulGems, DEFAULT_PROFILE.soulGems),
      totalKills: safeNum(parsed.totalKills, 0),
      runsCompleted: safeNum(parsed.runsCompleted, 0),
      upgrades: {
        hpLevel: safeNum(upg.hpLevel, 0),
        armorLevel: safeNum(upg.armorLevel, 0),
        manaLevel: safeNum(upg.manaLevel, 0),
        dmgLevel: safeNum(upg.dmgLevel ?? upg.damageLevel, 0),
        goldLevel: safeNum(upg.goldLevel ?? upg.startingGoldLevel, 0),
      },
      preRunWeapon: parsed.preRunWeapon || null,
      preRunPotion: Boolean(parsed.preRunPotion ?? parsed.preRunExtraPotion),
    };
  } catch {
    return {
      ...DEFAULT_PROFILE,
      upgrades: { ...DEFAULT_PROFILE.upgrades },
    };
  }
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
