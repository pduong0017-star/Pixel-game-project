export type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'BOON_SELECT'
  | 'PAUSED'
  | 'VICTORY'
  | 'GAME_OVER';

export type HeroClassId = 'knight' | 'pyromancer' | 'rogue';
export type PetId = 'cat' | 'mini_slime' | 'baby_dragon';

export interface HeroClassConfig {
  id: HeroClassId;
  name: string;
  title: string;
  description: string;
  maxHp: number;
  maxArmor: number;
  maxMana: number;
  critChance: number;
  moveSpeed: number;
  starterWeaponId: WeaponId;
  secondaryWeaponId: WeaponId;
  skillName: string;
  skillDesc: string;
  skillCooldown: number;
  accentColor: string;
}

export interface PetConfig {
  id: PetId;
  name: string;
  role: string;
  damage: number;
  attackCooldown: number;
  isRanged: boolean;
  projectileColor: string;
  accentColor: string;
}

export type WeaponId =
  | 'broadsword'
  | 'twin_daggers'
  | 'pioneer_pistol'
  | 'splitter_shotgun'
  | 'plasma_rifle'
  | 'thunder_staff'
  | 'inferno_bow';

export type WeaponType = 'melee' | 'gun' | 'staff' | 'bow';

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  type: WeaponType;
  damage: number;
  manaCost: number;
  cooldown: number;
  range: number;
  projectiles: number;
  spreadAngle: number;
  projectileSpeed: number;
  color: string;
  coreColor: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  rarityColor: string;
  piercing?: boolean;
  explosive?: boolean;
  chainLightning?: boolean;
  description: string;
}

export type TileType =
  | 'void'
  | 'floor'
  | 'floor_wood'
  | 'floor_carpet'
  | 'floor_moss'
  | 'wall'
  | 'pillar'
  | 'door_open'
  | 'door_locked'
  | 'spike_trap'
  | 'portal_pedestal';

export interface DungeonTile {
  gx: number;
  gy: number;
  type: TileType;
  explored: boolean;
  visible: boolean;
  hasTorch?: boolean;
  variant: number;
}

export type RoomKind =
  | 'LIVING_ROOM'
  | 'START_ROOM'
  | 'COMBAT_ROOM'
  | 'CHEST_ROOM'
  | 'SHOP_ROOM'
  | 'STATUE_ROOM'
  | 'BOSS_ROOM';

export interface DungeonRoom {
  id: number;
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  kind: RoomKind;
  cleared: boolean;
  locked: boolean;
  visited: boolean;
  doorTiles: { gx: number; gy: number }[];
}

export type EnemyType =
  | 'slime'
  | 'goblin'
  | 'golem'
  | 'warden_boss'
  | 'dummy';

export interface Enemy {
  id: number;
  roomId: number;
  type: EnemyType;
  name: string;
  gx: number;
  gy: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  attackRange: number;
  detectRange: number;
  aggroed: boolean;
  alertTimer: number;
  state: 'idle' | 'chase' | 'windup' | 'attack' | 'recover';
  stateTimer: number;
  windupDuration: number;
  targetGx: number;
  targetGy: number;
  facing: number;
  hitFlash: number;
  squashX: number;
  squashY: number;
  hopZ: number;
  animPhase: number;
  isBoss?: boolean;
}

export type InteractableType =
  | 'chest'
  | 'weapon_drop'
  | 'shop_item'
  | 'statue'
  | 'shrine'
  | 'lobby_hero'
  | 'lobby_pet'
  | 'dungeon_gate'
  | 'gold'
  | 'mana_orb'
  | 'hp_orb'
  | 'exp_gem'
  | 'potion';

export interface Interactable {
  id: number;
  type: InteractableType;
  gx: number;
  gy: number;
  opened: boolean;
  value: number; // gold cost or amount
  bobPhase: number;
  weaponId?: WeaponId;
  heroId?: HeroClassId;
  petId?: PetId;
  statueName?: string;
  statueBuffId?: 'paladin' | 'sorcerer' | 'berserker';
  shopKind?: 'weapon' | 'potion' | 'mana_pack';
  label?: string;
}

export interface GhostTrail {
  gx: number;
  gy: number;
  gz: number;
  spriteFacing: number;
  frameIdx: number;
  alpha: number;
  maxAlpha: number;
  tint: string;
}

export interface Projectile {
  active: boolean;
  fromPlayer: boolean;
  gx: number;
  gy: number;
  gz: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
  coreColor: string;
  piercing?: boolean;
  explosive?: boolean;
  chainLightning?: boolean;
}

export interface TelegraphZone {
  id: number;
  shape: 'circle' | 'line';
  gx: number;
  gy: number;
  endGx?: number;
  endGy?: number;
  radius: number;
  progress: number;
  color: string;
}

export interface Particle {
  active: boolean;
  gx: number;
  gy: number;
  gz: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  gravity: number;
}

export interface SlashEffect {
  gx: number;
  gy: number;
  angle: number;
  arcSpread: number;
  radius: number;
  timer: number;
  maxTimer: number;
  color: string;
  coreColor: string;
}

export interface LightningBolt {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  timer: number;
  maxTimer: number;
}

export interface FloatingText {
  id: number;
  gx: number;
  gy: number;
  gz: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

export interface BoonOption {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
}

export interface HudSnapshot {
  inLivingRoom: boolean;
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  mana: number;
  maxMana: number;
  gold: number;
  floor: number;
  maxFloors: number;
  level: number;
  xp: number;
  xpToNext: number;
  potions: number;
  maxPotions: number;
  kills: number;
  enemiesRemaining: number;
  portalOpen: boolean;
  roomLocked: boolean;
  damageDealt: number;
  heroClass: HeroClassId;
  petId: PetId;
  petName: string;
  activeWeapon: WeaponConfig;
  secondaryWeapon: WeaponConfig | null;
  statueBlessing: string | null;
  dashCooldownRatio: number;
  skillCooldownRatio: number;
  attackCooldownRatio: number;
  isInvulnerable: boolean;
  activeBoons: BoonOption[];
  bossActive: boolean;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  floorCleared: boolean;
  promptText: string | null;
  promptSubtext: string | null;
  minimapRooms: {
    id: number;
    gridX: number;
    gridY: number;
    kind: RoomKind;
    visited: boolean;
    cleared: boolean;
    isCurrent: boolean;
  }[];
}
