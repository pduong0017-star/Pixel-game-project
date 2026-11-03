import {
  BoonOption,
  DestructibleProp,
  DifficultyConfig,
  DifficultyId,
  DungeonRoom,
  DungeonTile,
  Enemy,
  EnemyType,
  HeroClassConfig,
  HeroClassId,
  Interactable,
  PetConfig,
  PetId,
  WeaponConfig,
  WeaponId,
} from './types';

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  normal: {
    id: 'normal',
    name: 'Normal Mode',
    subtitle: 'Balanced Dungeon Crawl',
    hpMult: 1.0,
    dmgMult: 1.0,
    speedMult: 1.0,
    eliteChance: 0.14,
    gemMult: 1.0,
    accent: '#34d399',
  },
  badass: {
    id: 'badass',
    name: 'Badass Mode',
    subtitle: 'Fierce Aggro & More Elites',
    hpMult: 1.45,
    dmgMult: 1.35,
    speedMult: 1.15,
    eliteChance: 0.35,
    gemMult: 1.75,
    accent: '#f59e0b',
  },
  hell: {
    id: 'hell',
    name: 'Abyssal Hell',
    subtitle: 'Nightmare Bullet Hell (+150% Gems)',
    hpMult: 1.95,
    dmgMult: 1.65,
    speedMult: 1.28,
    eliteChance: 0.55,
    gemMult: 2.5,
    accent: '#f43f5e',
  },
};

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  broadsword: {
    id: 'broadsword',
    name: 'Knight Broadsword',
    type: 'melee',
    damage: 34,
    manaCost: 0,
    cooldown: 0.31,
    range: 2.45,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#f59e0b',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    shopGemsCost: 80,
    description: 'Wide fan cleave (0 Mana). Destroys enemy bullets & restores +2 Mana.',
  },
  twin_daggers: {
    id: 'twin_daggers',
    name: 'Shadow Twin Blades',
    type: 'melee',
    damage: 26,
    manaCost: 0,
    cooldown: 0.19,
    range: 2.15,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#10b981',
    coreColor: '#a7f3d0',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    shopGemsCost: 140,
    description: 'Ultra-fast dual slashes (0 Mana). Cuts through enemy bullets.',
  },
  pioneer_pistol: {
    id: 'pioneer_pistol',
    name: 'Pioneer Pistol',
    type: 'gun',
    damage: 19,
    manaCost: 0,
    cooldown: 0.23,
    range: 9.5,
    projectiles: 1,
    spreadAngle: 0.04,
    projectileSpeed: 15.0,
    color: '#fbbf24',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    shopGemsCost: 70,
    description: 'Reliable sidearm with infinite energy (0 Mana).',
  },
  splitter_shotgun: {
    id: 'splitter_shotgun',
    name: 'Splitter Shotgun',
    type: 'gun',
    damage: 16,
    manaCost: 2,
    cooldown: 0.45,
    range: 7.8,
    projectiles: 5,
    spreadAngle: 0.42,
    projectileSpeed: 14.0,
    color: '#f97316',
    coreColor: '#fde047',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    shopGemsCost: 160,
    description: 'Blasts a 5-pellet spread cone with heavy knockback (2 Mana).',
  },
  plasma_rifle: {
    id: 'plasma_rifle',
    name: 'Blue Fire Gatling SMG',
    type: 'gun',
    damage: 17,
    manaCost: 1,
    cooldown: 0.11,
    range: 10.5,
    projectiles: 1,
    spreadAngle: 0.11,
    projectileSpeed: 17.0,
    color: '#38bdf8',
    coreColor: '#e0f2fe',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    shopGemsCost: 220,
    description: 'High-velocity plasma stream (1 Mana). Melts bosses rapidly.',
  },
  thunder_staff: {
    id: 'thunder_staff',
    name: 'Staff of Thunder',
    type: 'staff',
    damage: 36,
    manaCost: 3,
    cooldown: 0.4,
    range: 10.5,
    projectiles: 1,
    spreadAngle: 0.02,
    projectileSpeed: 13.0,
    color: '#38bdf8',
    coreColor: '#ffffff',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    chainLightning: true,
    shopGemsCost: 240,
    description: 'Fires lightning orbs that arc between nearby foes (3 Mana).',
  },
  frost_laser: {
    id: 'frost_laser',
    name: 'Aurora Cryo Cannon',
    type: 'gun',
    damage: 28,
    manaCost: 2,
    cooldown: 0.28,
    range: 11.5,
    projectiles: 2,
    spreadAngle: 0.08,
    projectileSpeed: 18.5,
    color: '#22d3ee',
    coreColor: '#ecfeff',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    piercing: true,
    shopGemsCost: 260,
    description: 'Twin piercing cryo beams that slice through entire lines of foes (2 Mana).',
  },
  inferno_bow: {
    id: 'inferno_bow',
    name: 'Flame Dragon Bow',
    type: 'bow',
    damage: 48,
    manaCost: 3,
    cooldown: 0.44,
    range: 11.5,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 16.5,
    color: '#f43f5e',
    coreColor: '#fde047',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    explosive: true,
    shopGemsCost: 320,
    description: 'Piercing dragon arrows that detonate in a fiery blast on impact (3 Mana).',
  },
  excalibur: {
    id: 'excalibur',
    name: 'Excalibur Sacred Blade',
    type: 'melee',
    damage: 58,
    manaCost: 2,
    cooldown: 0.34,
    range: 3.1,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 15.0,
    color: '#fde047',
    coreColor: '#ffffff',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    shopGemsCost: 360,
    description: 'Colossal golden cleave that also launches a piercing holy sword wave (2 Mana).',
  },
};

export const WEAPON_POOL: WeaponId[] = [
  'splitter_shotgun',
  'plasma_rifle',
  'thunder_staff',
  'frost_laser',
  'inferno_bow',
  'excalibur',
  'broadsword',
  'twin_daggers',
];

export const PETS: Record<PetId, PetConfig> = {
  cat: {
    id: 'cat',
    name: 'Chilly the Cat',
    role: 'Agile Melee Companion',
    damage: 15,
    attackCooldown: 0.85,
    isRanged: false,
    projectileColor: '#fde047',
    accentColor: '#f59e0b',
  },
  mini_slime: {
    id: 'mini_slime',
    name: 'Bloop the Slime',
    role: 'Bouncing Gel Guard',
    damage: 17,
    attackCooldown: 0.95,
    isRanged: false,
    projectileColor: '#38bdf8',
    accentColor: '#38bdf8',
  },
  baby_dragon: {
    id: 'baby_dragon',
    name: 'Ignis Dragonling',
    role: 'Ranged Fireball Pet',
    damage: 20,
    attackCooldown: 1.0,
    isRanged: true,
    projectileColor: '#f43f5e',
    accentColor: '#f43f5e',
  },
};

export const HERO_CLASSES: Record<HeroClassId, HeroClassConfig> = {
  knight: {
    id: 'knight',
    name: 'Vanguard Knight',
    title: 'Dual-Wield Paladin',
    description: 'High Armor & HP. Starts with Broadsword + Pioneer Pistol.',
    maxHp: 145,
    maxArmor: 65,
    maxMana: 200,
    critChance: 0.18,
    moveSpeed: 5.5,
    starterWeaponId: 'broadsword',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Superior Fire & Shockwave',
    skillDesc: 'Unleash a golden shockwave, restore +35 Mana, and fire a double volley.',
    skillCooldown: 5.2,
    accentColor: '#f59e0b',
  },
  pyromancer: {
    id: 'pyromancer',
    name: 'Ash Pyromancer',
    title: 'Arcane Elementalist',
    description: 'High Mana pool. Starts with Staff of Thunder + Pioneer Pistol.',
    maxHp: 105,
    maxArmor: 45,
    maxMana: 260,
    critChance: 0.24,
    moveSpeed: 5.6,
    starterWeaponId: 'thunder_staff',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Solar Cataclysm',
    skillDesc: 'Erupt 8 piercing magma bolts in all directions and restore +45 Mana.',
    skillCooldown: 4.8,
    accentColor: '#f97316',
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow Rogue',
    title: 'Assassin Marksman',
    description: 'High Crit & Speed. Starts with Shadow Twin Blades + Splitter Shotgun.',
    maxHp: 115,
    maxArmor: 45,
    maxMana: 200,
    critChance: 0.38,
    moveSpeed: 6.3,
    starterWeaponId: 'twin_daggers',
    secondaryWeaponId: 'splitter_shotgun',
    skillName: 'Phantom Blade Fan',
    skillDesc: 'Throw 6 piercing emerald kunai that crit and reset Dash cooldown.',
    skillCooldown: 4.0,
    accentColor: '#10b981',
  },
  alchemist: {
    id: 'alchemist',
    name: 'Cyber Alchemist',
    title: 'Venom & Cryo Specialist',
    description: 'Balanced Armor & Tech. Starts with Aurora Cryo Cannon + Broadsword.',
    maxHp: 125,
    maxArmor: 55,
    maxMana: 230,
    critChance: 0.26,
    moveSpeed: 5.8,
    starterWeaponId: 'frost_laser',
    secondaryWeaponId: 'broadsword',
    skillName: 'Alchemical Venom Nova',
    skillDesc: 'Hurl 6 explosive bio-concoctions that detonate & restore +15 Shield +35 Mana.',
    skillCooldown: 4.6,
    accentColor: '#14b8a6',
  },
};

export const BOON_POOL: BoonOption[] = [
  {
    id: 'vitality_surge',
    name: 'Titan Wine (+25% Max HP)',
    category: 'Survival Buff',
    description: 'Increase Max HP by +25% and immediately restore 45% HP.',
    accent: '#4ade80',
  },
  {
    id: 'blitz_reflex',
    name: 'Firing Rate & Speed +30%',
    category: 'Offense Buff',
    description: 'Increase Attack/Fire Rate by +30% and reduce Skill Cooldown by 20%.',
    accent: '#fde047',
  },
  {
    id: 'chain_arc',
    name: 'Laser & Lightning Bounce',
    category: 'Elemental Buff',
    description: 'All attacks arc Chain Lightning to nearby enemies for 65% damage.',
    accent: '#38bdf8',
  },
  {
    id: 'vampiric_edge',
    name: 'Vampirism (Heal on Kill)',
    category: 'Sustenance Buff',
    description: 'Restore +10 HP and +18 Mana every time you defeat an enemy.',
    accent: '#f43f5e',
  },
  {
    id: 'executioner',
    name: 'Critical Pierce (+Damage)',
    category: 'Offense Buff',
    description: '+30% Weapon Damage and +15% Critical Strike chance.',
    accent: '#f59e0b',
  },
  {
    id: 'ember_nova',
    name: 'Flame Dash Nova',
    category: 'Tactical Buff',
    description: 'Dashing triggers a fiery ring dealing 50 damage to surrounding foes.',
    accent: '#f97316',
  },
];

export interface GeneratedFloor {
  inLivingRoom: boolean;
  width: number;
  height: number;
  tiles: DungeonTile[][];
  rooms: DungeonRoom[];
  spawnGx: number;
  spawnGy: number;
  stairsGx: number;
  stairsGy: number;
  enemies: Enemy[];
  interactables: Interactable[];
  props: DestructibleProp[];
}

// ============================================================================
// 1. LIVING ROOM HUB GENERATOR (Phòng Chờ Chọn Tướng, Thú Cưng, Rương, Bia Tập)
// ============================================================================
export function generateLivingRoom(): GeneratedFloor {
  const width = 24;
  const height = 18;
  const tiles: DungeonTile[][] = [];

  for (let y = 0; y < height; y++) {
    const row: DungeonTile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        gx: x,
        gy: y,
        type: 'void',
        explored: true,
        visible: true,
        variant: (x * 13 + y * 29) % 4,
      });
    }
    tiles.push(row);
  }

  const rx = 3;
  const ry = 3;
  const rw = 18;
  const rh = 12;

  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      const isCarpet = x >= 9 && x <= 14 && y >= 5 && y <= 12;
      tiles[y][x].type = isCarpet ? 'floor_carpet' : 'floor_wood';
    }
  }

  for (let y = ry - 1; y <= ry + rh; y++) {
    for (let x = rx - 1; x <= rx + rw; x++) {
      if (tiles[y][x].type === 'void') {
        tiles[y][x].type = 'wall';
        if (y === ry - 1 && (x === 6 || x === 11 || x === 17)) {
          tiles[y][x].hasTorch = true;
        }
      }
    }
  }

  // North Dungeon Entrance Gate corridor
  tiles[ry - 1][11].type = 'door_open';
  tiles[ry - 1][12].type = 'door_open';
  tiles[ry][11].type = 'portal_pedestal';
  tiles[ry][12].type = 'portal_pedestal';

  const livingRoom: DungeonRoom = {
    id: 1,
    gridX: 0,
    gridY: 0,
    x: rx,
    y: ry,
    w: rw,
    h: rh,
    cx: 11.5,
    cy: 9,
    kind: 'LIVING_ROOM',
    cleared: true,
    locked: false,
    visited: true,
    doorTiles: [],
  };

  const interactables: Interactable[] = [
    // 4 Selectable Heroes in the Living Room
    {
      id: 101,
      type: 'lobby_hero',
      gx: 5.8,
      gy: 5.5,
      opened: false,
      value: 0,
      bobPhase: 0,
      heroId: 'knight',
      label: 'Vanguard Knight',
    },
    {
      id: 102,
      type: 'lobby_hero',
      gx: 5.8,
      gy: 8.0,
      opened: false,
      value: 0,
      bobPhase: 1,
      heroId: 'pyromancer',
      label: 'Ash Pyromancer',
    },
    {
      id: 103,
      type: 'lobby_hero',
      gx: 5.8,
      gy: 10.5,
      opened: false,
      value: 0,
      bobPhase: 2,
      heroId: 'rogue',
      label: 'Shadow Rogue',
    },
    {
      id: 107,
      type: 'lobby_hero',
      gx: 5.8,
      gy: 13.0,
      opened: false,
      value: 0,
      bobPhase: 3,
      heroId: 'alchemist',
      label: 'Cyber Alchemist',
    },
    // Pet House / Companion Selector
    {
      id: 104,
      type: 'lobby_pet',
      gx: 17.0,
      gy: 6.2,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Switch Companion Pet',
    },
    // Free Starter Weapon Chest in Living Room
    {
      id: 105,
      type: 'chest',
      gx: 17.0,
      gy: 12.2,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Starter Supply Chest',
    },
    // North Dungeon Entrance Gate
    {
      id: 106,
      type: 'dungeon_gate',
      gx: 11.5,
      gy: 3.8,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Enter Dungeon (1-1)',
    },
  ];

  // Practice props in Living Room
  const props: DestructibleProp[] = [
    { id: 1, roomId: 1, kind: 'crate', gx: 14.5, gy: 5.2, hp: 20, hitFlash: 0 },
    { id: 2, roomId: 1, kind: 'vase', gx: 14.5, gy: 12.8, hp: 15, hitFlash: 0 },
  ];

  // Training Dummy in the Living Room
  const enemies: Enemy[] = [
    {
      id: 901,
      roomId: 1,
      type: 'dummy',
      name: 'Training Dummy',
      gx: 17.0,
      gy: 9.2,
      vx: 0,
      vy: 0,
      hp: 9999,
      maxHp: 9999,
      damage: 0,
      speed: 0,
      attackRange: 0,
      detectRange: 0,
      aggroed: false,
      alertTimer: 0,
      state: 'idle',
      stateTimer: 0,
      windupDuration: 1,
      targetGx: 17.0,
      targetGy: 9.2,
      facing: -1,
      hitFlash: 0,
      squashX: 1,
      squashY: 1,
      hopZ: 0,
      animPhase: 0,
    },
  ];

  return {
    inLivingRoom: true,
    width,
    height,
    tiles,
    rooms: [livingRoom],
    spawnGx: 11.5,
    spawnGy: 9.5,
    stairsGx: 11.5,
    stairsGy: 3.8,
    enemies,
    interactables,
    props,
  };
}

// ============================================================================
// 2. SOUL KNIGHT MULTI-ROOM GRID DUNGEON GENERATOR (Enhanced Graphics & Props)
// ============================================================================
export function generateDungeonFloor(
  floorNum: number,
  difficulty: DifficultyId = 'normal'
): GeneratedFloor {
  const diffCfg = DIFFICULTIES[difficulty];
  const width = 62;
  const height = 46;

  const tiles: DungeonTile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: DungeonTile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        gx: x,
        gy: y,
        type: 'void',
        explored: false,
        visible: false,
        variant: (x * 17 + y * 31) % 6,
        trapState: 'idle',
        trapTimer: ((x + y) % 3) * 0.8,
      });
    }
    tiles.push(row);
  }

  const roomDefs: {
    id: number;
    gridX: number;
    gridY: number;
    kind: DungeonRoom['kind'];
  }[] = [
    { id: 1, gridX: 0, gridY: 1, kind: 'START_ROOM' },
    { id: 2, gridX: 1, gridY: 1, kind: 'COMBAT_ROOM' },
    { id: 3, gridX: 1, gridY: 0, kind: 'COMBAT_ROOM' },
    { id: 4, gridX: 0, gridY: 0, kind: 'CHEST_ROOM' },
    {
      id: 5,
      gridX: 2,
      gridY: 0,
      kind: floorNum % 2 === 1 ? 'SHOP_ROOM' : 'STATUE_ROOM',
    },
    { id: 6, gridX: 2, gridY: 1, kind: 'BOSS_ROOM' },
  ];

  const rooms: DungeonRoom[] = [];
  const cellW = 19;
  const cellH = 19;

  for (const def of roomDefs) {
    const rw = def.kind === 'BOSS_ROOM' ? 15 : def.kind === 'COMBAT_ROOM' ? 13 : 11;
    const rh = def.kind === 'BOSS_ROOM' ? 13 : def.kind === 'COMBAT_ROOM' ? 11 : 9;
    const cx = 10 + def.gridX * cellW;
    const cy = 11 + def.gridY * cellH;
    const rx = Math.floor(cx - rw / 2);
    const ry = Math.floor(cy - rh / 2);

    const isSafeRoom =
      def.kind === 'START_ROOM' ||
      def.kind === 'CHEST_ROOM' ||
      def.kind === 'SHOP_ROOM' ||
      def.kind === 'STATUE_ROOM';

    rooms.push({
      id: def.id,
      gridX: def.gridX,
      gridY: def.gridY,
      x: rx,
      y: ry,
      w: rw,
      h: rh,
      cx,
      cy,
      kind: def.kind,
      cleared: isSafeRoom,
      locked: false,
      visited: def.kind === 'START_ROOM',
      doorTiles: [],
    });
  }

  const carveFloor = (x: number, y: number, roomKind?: DungeonRoom['kind'], rm?: DungeonRoom) => {
    if (x <= 1 || y <= 1 || x >= width - 2 || y >= height - 2) return;
    if (rm && roomKind) {
      const distCenter = Math.max(Math.abs(x - rm.cx), Math.abs(y - rm.cy));
      if (roomKind === 'BOSS_ROOM' && distCenter <= 3.5) {
        tiles[y][x].type = 'floor_carpet';
        return;
      }
      if ((roomKind === 'SHOP_ROOM' || roomKind === 'CHEST_ROOM' || roomKind === 'STATUE_ROOM') && distCenter <= 2.5) {
        tiles[y][x].type = 'floor_carpet';
        return;
      }
      if ((x * 7 + y * 13) % 14 === 0) {
        tiles[y][x].type = 'floor_crystal';
        return;
      }
    }
    tiles[y][x].type = (x + y) % 8 === 0 ? 'floor_moss' : 'floor';
  };

  const props: DestructibleProp[] = [];
  let nextPropId = 10;

  // Carve rooms & add rich environmental details (pillars, spike traps, crates & vases)
  for (const rm of rooms) {
    for (let y = rm.y; y < rm.y + rm.h; y++) {
      for (let x = rm.x; x < rm.x + rm.w; x++) {
        carveFloor(x, y, rm.kind, rm);
      }
    }

    if (rm.kind === 'COMBAT_ROOM') {
      tiles[rm.y + 2][rm.x + 3].type = 'pillar';
      tiles[rm.y + 2][rm.x + rm.w - 4].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + 3].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + rm.w - 4].type = 'pillar';

      // Add periodic Spike Traps near center of combat room
      tiles[Math.floor(rm.cy)][Math.floor(rm.cx) - 2].type = 'spike_trap';
      tiles[Math.floor(rm.cy)][Math.floor(rm.cx) + 2].type = 'spike_trap';

      // Add destructible Wooden Crates & Ancient Vases along room corners/edges
      const propCoords: [number, number, 'crate' | 'vase'][] = [
        [rm.x + 1.5, rm.y + 1.5, 'crate'],
        [rm.x + rm.w - 1.5, rm.y + 1.5, 'vase'],
        [rm.x + 1.5, rm.y + rm.h - 1.5, 'vase'],
        [rm.x + rm.w - 1.5, rm.y + rm.h - 1.5, 'crate'],
        [rm.cx, rm.y + 1.6, 'crate'],
      ];
      for (const [px, py, pkind] of propCoords) {
        props.push({
          id: nextPropId++,
          roomId: rm.id,
          kind: pkind,
          gx: px,
          gy: py,
          hp: pkind === 'crate' ? 24 : 16,
          hitFlash: 0,
        });
      }
    } else if (rm.kind === 'BOSS_ROOM') {
      // Corner obsidian pillars & destructible supply vases in Boss Arena
      tiles[rm.y + 2][rm.x + 2].type = 'pillar';
      tiles[rm.y + 2][rm.x + rm.w - 3].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + 2].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + rm.w - 3].type = 'pillar';

      props.push(
        { id: nextPropId++, roomId: rm.id, kind: 'vase', gx: rm.x + 1.5, gy: rm.cy - 3, hp: 18, hitFlash: 0 },
        { id: nextPropId++, roomId: rm.id, kind: 'vase', gx: rm.x + 1.5, gy: rm.cy + 3, hp: 18, hitFlash: 0 },
        { id: nextPropId++, roomId: rm.id, kind: 'crate', gx: rm.x + rm.w - 1.5, gy: rm.cy - 3, hp: 24, hitFlash: 0 },
        { id: nextPropId++, roomId: rm.id, kind: 'crate', gx: rm.x + rm.w - 1.5, gy: rm.cy + 3, hp: 24, hitFlash: 0 }
      );
    } else if (rm.kind === 'START_ROOM') {
      props.push(
        { id: nextPropId++, roomId: rm.id, kind: 'vase', gx: rm.x + 1.6, gy: rm.y + 1.6, hp: 15, hitFlash: 0 },
        { id: nextPropId++, roomId: rm.id, kind: 'crate', gx: rm.x + rm.w - 1.6, gy: rm.y + 1.6, hp: 20, hitFlash: 0 }
      );
    }
  }

  // Connect rooms with 3-tile wide corridors & register iron door gate tiles at room borders
  const connections: [number, number][] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [2, 6],
  ];

  for (const [idA, idB] of connections) {
    const a = rooms.find((r) => r.id === idA)!;
    const b = rooms.find((r) => r.id === idB)!;

    if (a.gridY === b.gridY) {
      const left = a.x < b.x ? a : b;
      const right = a.x < b.x ? b : a;
      const startX = left.x + left.w;
      const endX = right.x - 1;
      const cy = Math.floor(left.cy);

      for (let x = startX; x <= endX; x++) {
        for (let dy = -1; dy <= 1; dy++) {
          carveFloor(x, cy + dy);
          if (dy === 0) tiles[cy][x].type = 'floor_carpet';
        }
      }
      for (let dy = -1; dy <= 1; dy++) {
        tiles[cy + dy][startX].type = 'door_open';
        left.doorTiles.push({ gx: startX, gy: cy + dy });
        tiles[cy + dy][endX].type = 'door_open';
        right.doorTiles.push({ gx: endX, gy: cy + dy });
      }
    } else {
      const top = a.y < b.y ? a : b;
      const bottom = a.y < b.y ? b : a;
      const startY = top.y + top.h;
      const endY = bottom.y - 1;
      const cx = Math.floor(top.cx);

      for (let y = startY; y <= endY; y++) {
        for (let dx = -1; dx <= 1; dx++) {
          carveFloor(cx + dx, y);
          if (dx === 0) tiles[y][cx].type = 'floor_carpet';
        }
      }
      for (let dx = -1; dx <= 1; dx++) {
        tiles[startY][cx + dx].type = 'door_open';
        top.doorTiles.push({ gx: cx + dx, gy: startY });
        tiles[endY][cx + dx].type = 'door_open';
        bottom.doorTiles.push({ gx: cx + dx, gy: endY });
      }
    }
  }

  // Surround all carved floors & corridors with 2.5D dungeon walls and torches
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (tiles[y][x].type === 'void') {
        let touchesFloor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nt = tiles[y + dy]?.[x + dx]?.type;
            if (nt && nt !== 'void' && nt !== 'wall') {
              touchesFloor = true;
            }
          }
        }
        if (touchesFloor) {
          tiles[y][x].type = 'wall';
          if ((x + y) % 6 === 0 && Math.random() < 0.52) {
            tiles[y][x].hasTorch = true;
          }
        }
      }
    }
  }

  const startRoom = rooms.find((r) => r.kind === 'START_ROOM')!;
  const bossRoom = rooms.find((r) => r.kind === 'BOSS_ROOM')!;
  tiles[Math.floor(bossRoom.cy)][Math.floor(bossRoom.cx)].type = 'portal_pedestal';

  const enemies: Enemy[] = [];
  const interactables: Interactable[] = [];
  let nextEnemyId = 1;
  let nextInteractId = 200;

  const scaleHp = (1 + (floorNum - 1) * 0.25) * diffCfg.hpMult;
  const scaleDmg = (1 + (floorNum - 1) * 0.18) * diffCfg.dmgMult;
  const scaleSpd = diffCfg.speedMult;

  const createEnemy = (
    roomId: number,
    type: EnemyType,
    gx: number,
    gy: number,
    forceElite: boolean = false
  ): Enemy => {
    const isElite =
      type !== 'warden_boss' &&
      type !== 'dummy' &&
      (forceElite || Math.random() < diffCfg.eliteChance);
    const eliteHpMult = isElite ? 1.65 : 1.0;
    const eliteDmgMult = isElite ? 1.25 : 1.0;

    if (type === 'slime') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'slime',
        name: isElite ? 'Elite King Slime' : 'Emerald Slime',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(48 * scaleHp * eliteHpMult),
        maxHp: Math.round(48 * scaleHp * eliteHpMult),
        damage: Math.round(12 * scaleDmg * eliteDmgMult),
        speed: 3.4 * scaleSpd,
        attackRange: 1.4,
        detectRange: 9.0,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.45,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
        isElite,
      };
    }
    if (type === 'goblin') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'goblin',
        name: isElite ? 'Elite Goblin Sharpshooter' : 'Goblin Marksman',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(56 * scaleHp * eliteHpMult),
        maxHp: Math.round(56 * scaleHp * eliteHpMult),
        damage: Math.round(14 * scaleDmg * eliteDmgMult),
        speed: 2.6 * scaleSpd,
        attackRange: 6.8,
        detectRange: 9.5,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.68,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
        isElite,
      };
    }
    if (type === 'necro_mage') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'necro_mage',
        name: isElite ? 'Arch-Lich Necromancer' : 'Skeleton Necro Mage',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(68 * scaleHp * eliteHpMult),
        maxHp: Math.round(68 * scaleHp * eliteHpMult),
        damage: Math.round(16 * scaleDmg * eliteDmgMult),
        speed: 2.3 * scaleSpd,
        attackRange: 7.5,
        detectRange: 9.5,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.78,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
        isElite,
      };
    }
    if (type === 'golem') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'golem',
        name: isElite ? 'Elder Magma Titan' : 'Obsidian Golem',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(118 * scaleHp * eliteHpMult),
        maxHp: Math.round(118 * scaleHp * eliteHpMult),
        damage: Math.round(20 * scaleDmg * eliteDmgMult),
        speed: 2.0 * scaleSpd,
        attackRange: 2.3,
        detectRange: 9.0,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.82,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
        isElite,
      };
    }
    return {
      id: nextEnemyId++,
      roomId,
      type: 'warden_boss',
      name:
        floorNum >= 3 ? 'Malakor, Abyssal Sovereign' : 'Vorgath, Dungeon Warden',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(310 * scaleHp),
      maxHp: Math.round(310 * scaleHp),
      damage: Math.round(24 * scaleDmg),
      speed: 2.6 * scaleSpd,
      attackRange: 3.8,
      detectRange: 11.0,
      aggroed: false,
      alertTimer: 0,
      state: 'idle',
      stateTimer: 0,
      windupDuration: 0.75,
      targetGx: gx,
      targetGy: gy,
      facing: -1,
      hitFlash: 0,
      squashX: 1,
      squashY: 1,
      hopZ: 0,
      animPhase: 0,
      isBoss: true,
      enraged: false,
    };
  };

  for (const rm of rooms) {
    if (rm.kind === 'COMBAT_ROOM') {
      const count = 4 + (floorNum > 1 ? 1 : 0) + (difficulty !== 'normal' ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const ex = rm.x + 2.2 + Math.random() * (rm.w - 4.4);
        const ey = rm.y + 2.2 + Math.random() * (rm.h - 4.4);
        const tileType = tiles[Math.floor(ey)]?.[Math.floor(ex)]?.type;
        if (tileType === 'pillar' || tileType === 'spike_trap') continue;
        let type: EnemyType = 'slime';
        if (i === count - 1 && floorNum >= 2) {
          type = 'golem';
        } else if (i % 3 === 2) {
          type = 'necro_mage';
        } else if (i % 2 === 1) {
          type = 'goblin';
        }
        enemies.push(createEnemy(rm.id, type, ex, ey));
      }
    } else if (rm.kind === 'CHEST_ROOM') {
      interactables.push({
        id: nextInteractId++,
        type: 'chest',
        gx: rm.cx - 1.5,
        gy: rm.cy,
        opened: false,
        value: 0,
        bobPhase: 0,
        label: 'Weapon Chest',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'statue',
        gx: rm.cx + 1.8,
        gy: rm.cy,
        opened: false,
        value: 20,
        bobPhase: 0,
        statueName: 'Statue of the Paladin',
        statueBuffId: 'paladin',
      });
    } else if (rm.kind === 'SHOP_ROOM' || rm.kind === 'STATUE_ROOM') {
      const shopWeaponId =
        WEAPON_POOL[Math.floor(Math.random() * WEAPON_POOL.length)];
      interactables.push({
        id: nextInteractId++,
        type: 'shop_item',
        gx: rm.cx - 2.2,
        gy: rm.cy + 0.5,
        opened: false,
        value: 35,
        bobPhase: 0,
        shopKind: 'weapon',
        weaponId: shopWeaponId,
        label: WEAPONS[shopWeaponId].name,
      });
      interactables.push({
        id: nextInteractId++,
        type: 'shop_item',
        gx: rm.cx,
        gy: rm.cy + 0.5,
        opened: false,
        value: 18,
        bobPhase: 1,
        shopKind: 'potion',
        label: 'Healing Vial (+50% HP)',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'shop_item',
        gx: rm.cx + 2.2,
        gy: rm.cy + 0.5,
        opened: false,
        value: 15,
        bobPhase: 2,
        shopKind: 'mana_pack',
        label: 'Energy Crystal (+120 Mana)',
      });
    } else if (rm.kind === 'BOSS_ROOM') {
      enemies.push(
        createEnemy(rm.id, 'warden_boss', rm.cx + 1.8, rm.cy)
      );
      enemies.push(
        createEnemy(rm.id, 'necro_mage', rm.cx - 2.5, rm.cy - 2.2)
      );
      enemies.push(
        createEnemy(rm.id, 'goblin', rm.cx - 2.5, rm.cy + 2.2)
      );
    }
  }

  return {
    inLivingRoom: false,
    width,
    height,
    tiles,
    rooms,
    spawnGx: startRoom.cx,
    spawnGy: startRoom.cy,
    stairsGx: bossRoom.cx,
    stairsGy: bossRoom.cy,
    enemies,
    interactables,
    props,
  };
}
