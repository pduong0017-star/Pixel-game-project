import {
  BoonOption,
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

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  broadsword: {
    id: 'broadsword',
    name: 'Knight Broadsword',
    type: 'melee',
    damage: 32,
    manaCost: 0,
    cooldown: 0.32,
    range: 2.4,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#f59e0b',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    description: 'Wide fan cleave (0 Mana). Destroys enemy bullets.',
  },
  twin_daggers: {
    id: 'twin_daggers',
    name: 'Shadow Twin Blades',
    type: 'melee',
    damage: 25,
    manaCost: 0,
    cooldown: 0.2,
    range: 2.1,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#10b981',
    coreColor: '#a7f3d0',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    description: 'Ultra-fast melee slashes (0 Mana). Cuts through bullets.',
  },
  pioneer_pistol: {
    id: 'pioneer_pistol',
    name: 'Pioneer Pistol',
    type: 'gun',
    damage: 18,
    manaCost: 0,
    cooldown: 0.24,
    range: 9.5,
    projectiles: 1,
    spreadAngle: 0.05,
    projectileSpeed: 14.5,
    color: '#fbbf24',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    description: 'Reliable sidearm with infinite energy (0 Mana).',
  },
  splitter_shotgun: {
    id: 'splitter_shotgun',
    name: 'Splitter Shotgun',
    type: 'gun',
    damage: 15,
    manaCost: 2,
    cooldown: 0.48,
    range: 7.5,
    projectiles: 5,
    spreadAngle: 0.42,
    projectileSpeed: 13.5,
    color: '#f97316',
    coreColor: '#fde047',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    description: 'Blasts a 5-pellet spread cone with heavy knockback (2 Mana).',
  },
  plasma_rifle: {
    id: 'plasma_rifle',
    name: 'Blue Fire Plasma SMG',
    type: 'gun',
    damage: 16,
    manaCost: 1,
    cooldown: 0.12,
    range: 10.5,
    projectiles: 1,
    spreadAngle: 0.12,
    projectileSpeed: 16.5,
    color: '#38bdf8',
    coreColor: '#e0f2fe',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    description: 'Rapid-fire plasma stream (1 Mana).',
  },
  thunder_staff: {
    id: 'thunder_staff',
    name: 'Staff of Thunder',
    type: 'staff',
    damage: 34,
    manaCost: 3,
    cooldown: 0.42,
    range: 10.0,
    projectiles: 1,
    spreadAngle: 0.02,
    projectileSpeed: 12.5,
    color: '#38bdf8',
    coreColor: '#ffffff',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    chainLightning: true,
    description: 'Fires lightning orbs that arc between nearby foes (3 Mana).',
  },
  inferno_bow: {
    id: 'inferno_bow',
    name: 'Flame Dragon Bow',
    type: 'bow',
    damage: 46,
    manaCost: 3,
    cooldown: 0.46,
    range: 11.5,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 16.0,
    color: '#f43f5e',
    coreColor: '#fde047',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    explosive: true,
    description: 'Piercing dragon arrows that detonate on impact (3 Mana).',
  },
};

export const WEAPON_POOL: WeaponId[] = [
  'splitter_shotgun',
  'plasma_rifle',
  'thunder_staff',
  'inferno_bow',
  'broadsword',
  'twin_daggers',
];

export const PETS: Record<PetId, PetConfig> = {
  cat: {
    id: 'cat',
    name: 'Chilly the Cat',
    role: 'Agile Melee Companion',
    damage: 14,
    attackCooldown: 0.9,
    isRanged: false,
    projectileColor: '#fde047',
    accentColor: '#f59e0b',
  },
  mini_slime: {
    id: 'mini_slime',
    name: 'Bloop the Slime',
    role: 'Bouncing Gel Guard',
    damage: 16,
    attackCooldown: 1.0,
    isRanged: false,
    projectileColor: '#38bdf8',
    accentColor: '#38bdf8',
  },
  baby_dragon: {
    id: 'baby_dragon',
    name: 'Ignis Dragonling',
    role: 'Ranged Fireball Pet',
    damage: 18,
    attackCooldown: 1.1,
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
    maxHp: 140,
    maxArmor: 60,
    maxMana: 200,
    critChance: 0.18,
    moveSpeed: 5.4,
    starterWeaponId: 'broadsword',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Superior Fire & Shockwave',
    skillDesc: 'Unleash a golden shockwave, restore +30 Mana, and fire a double volley.',
    skillCooldown: 5.5,
    accentColor: '#f59e0b',
  },
  pyromancer: {
    id: 'pyromancer',
    name: 'Ash Pyromancer',
    title: 'Arcane Alchemist',
    description: 'High Mana pool. Starts with Staff of Thunder + Pioneer Pistol.',
    maxHp: 100,
    maxArmor: 45,
    maxMana: 260,
    critChance: 0.22,
    moveSpeed: 5.5,
    starterWeaponId: 'thunder_staff',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Solar Cataclysm',
    skillDesc: 'Erupt 8 piercing magma bolts in all directions and restore +40 Mana.',
    skillCooldown: 5.0,
    accentColor: '#f97316',
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow Rogue',
    title: 'Assassin Marksman',
    description: 'High Crit & Speed. Starts with Shadow Twin Blades + Splitter Shotgun.',
    maxHp: 110,
    maxArmor: 45,
    maxMana: 200,
    critChance: 0.38,
    moveSpeed: 6.2,
    starterWeaponId: 'twin_daggers',
    secondaryWeaponId: 'splitter_shotgun',
    skillName: 'Phantom Blade Fan',
    skillDesc: 'Throw 6 piercing emerald kunai that crit and reset Dash cooldown.',
    skillCooldown: 4.2,
    accentColor: '#10b981',
  },
};

export const BOON_POOL: BoonOption[] = [
  {
    id: 'vitality_surge',
    name: 'Titan Wine (+20% Max HP)',
    category: 'Survival Buff',
    description: 'Increase Max HP by +20% and immediately restore 40% HP.',
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
    description: 'Restore +8 HP and +15 Mana every time you defeat an enemy.',
    accent: '#f43f5e',
  },
  {
    id: 'executioner',
    name: 'Critical Pierce (+Damage)',
    category: 'Offense Buff',
    description: '+28% Weapon Damage and +15% Critical Strike chance.',
    accent: '#f59e0b',
  },
  {
    id: 'ember_nova',
    name: 'Flame Dash Nova',
    category: 'Tactical Buff',
    description: 'Dashing triggers a fiery ring dealing 45 damage to surrounding foes.',
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
      const isCarpet = x >= 9 && x <= 14 && y >= 6 && y <= 11;
      tiles[y][x].type = isCarpet ? 'floor_carpet' : 'floor_wood';
    }
  }

  // Surround Living Room with walls & warm torches
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
    // 3 Selectable Heroes in the Living Room
    {
      id: 101,
      type: 'lobby_hero',
      gx: 6.5,
      gy: 6.5,
      opened: false,
      value: 0,
      bobPhase: 0,
      heroId: 'knight',
      label: 'Vanguard Knight',
    },
    {
      id: 102,
      type: 'lobby_hero',
      gx: 6.5,
      gy: 9.5,
      opened: false,
      value: 0,
      bobPhase: 1,
      heroId: 'pyromancer',
      label: 'Ash Pyromancer',
    },
    {
      id: 103,
      type: 'lobby_hero',
      gx: 6.5,
      gy: 12.5,
      opened: false,
      value: 0,
      bobPhase: 2,
      heroId: 'rogue',
      label: 'Shadow Rogue',
    },
    // Pet House / Companion Selector
    {
      id: 104,
      type: 'lobby_pet',
      gx: 16.5,
      gy: 6.5,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Switch Companion Pet',
    },
    // Free Starter Weapon Chest in Living Room
    {
      id: 105,
      type: 'chest',
      gx: 16.5,
      gy: 12.0,
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

  // Training Dummy in the Living Room so player can test weapons & skills!
  const enemies: Enemy[] = [
    {
      id: 901,
      roomId: 1,
      type: 'dummy',
      name: 'Training Dummy',
      gx: 16.5,
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
      targetGx: 16.5,
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
  };
}

// ============================================================================
// 2. SOUL KNIGHT MULTI-ROOM GRID DUNGEON GENERATOR
// ============================================================================
export function generateDungeonFloor(floorNum: number): GeneratedFloor {
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
        variant: (x * 17 + y * 31) % 5,
      });
    }
    tiles.push(row);
  }

  // Layout 6 connected rooms in a 3x2 grid (Soul Knight floor layout):
  // [ (0,0) CHEST_ROOM ] --- [ (1,0) COMBAT_ROOM_1 ] --- [ (2,0) SHOP / STATUE ]
  //                                    |
  // [ (0,1) START_ROOM ] --- [ (1,1) COMBAT_ROOM_2 ] --- [ (2,1) BOSS_ROOM ]
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
    const rw = def.kind === 'BOSS_ROOM' ? 13 : def.kind === 'COMBAT_ROOM' ? 13 : 11;
    const rh = def.kind === 'BOSS_ROOM' ? 11 : def.kind === 'COMBAT_ROOM' ? 11 : 9;
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

  const carveFloor = (x: number, y: number) => {
    if (x <= 1 || y <= 1 || x >= width - 2 || y >= height - 2) return;
    tiles[y][x].type =
      (x + y) % 9 === 0 ? 'floor_moss' : 'floor';
  };

  // Carve rooms
  for (const rm of rooms) {
    for (let y = rm.y; y < rm.y + rm.h; y++) {
      for (let x = rm.x; x < rm.x + rm.w; x++) {
        carveFloor(x, y);
      }
    }

    // Add tactical cover pillars inside Combat rooms
    if (rm.kind === 'COMBAT_ROOM') {
      tiles[rm.y + 2][rm.x + 3].type = 'pillar';
      tiles[rm.y + 2][rm.x + rm.w - 4].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + 3].type = 'pillar';
      tiles[rm.y + rm.h - 3][rm.x + rm.w - 4].type = 'pillar';
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
      // Horizontal corridor
      const left = a.x < b.x ? a : b;
      const right = a.x < b.x ? b : a;
      const startX = left.x + left.w;
      const endX = right.x - 1;
      const cy = Math.floor(left.cy);

      for (let x = startX; x <= endX; x++) {
        for (let dy = -1; dy <= 1; dy++) {
          carveFloor(x, cy + dy);
        }
      }
      // Door gates at entrances
      for (let dy = -1; dy <= 1; dy++) {
        tiles[cy + dy][startX].type = 'door_open';
        left.doorTiles.push({ gx: startX, gy: cy + dy });
        tiles[cy + dy][endX].type = 'door_open';
        right.doorTiles.push({ gx: endX, gy: cy + dy });
      }
    } else {
      // Vertical corridor
      const top = a.y < b.y ? a : b;
      const bottom = a.y < b.y ? b : a;
      const startY = top.y + top.h;
      const endY = bottom.y - 1;
      const cx = Math.floor(top.cx);

      for (let y = startY; y <= endY; y++) {
        for (let dx = -1; dx <= 1; dx++) {
          carveFloor(cx + dx, y);
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
          if ((x + y) % 7 === 0 && Math.random() < 0.45) {
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

  const scaleHp = 1 + (floorNum - 1) * 0.25;
  const scaleDmg = 1 + (floorNum - 1) * 0.18;

  const createEnemy = (
    roomId: number,
    type: EnemyType,
    gx: number,
    gy: number
  ): Enemy => {
    if (type === 'slime') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'slime',
        name: 'Emerald Slime',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(48 * scaleHp),
        maxHp: Math.round(48 * scaleHp),
        damage: Math.round(12 * scaleDmg),
        speed: 3.4,
        attackRange: 1.35,
        detectRange: 8.5,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.48,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
      };
    }
    if (type === 'goblin') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'goblin',
        name: 'Goblin Marksman',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(56 * scaleHp),
        maxHp: Math.round(56 * scaleHp),
        damage: Math.round(14 * scaleDmg),
        speed: 2.5,
        attackRange: 6.5,
        detectRange: 9.0,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.72,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
      };
    }
    if (type === 'golem') {
      return {
        id: nextEnemyId++,
        roomId,
        type: 'golem',
        name: 'Obsidian Golem',
        gx,
        gy,
        vx: 0,
        vy: 0,
        hp: Math.round(115 * scaleHp),
        maxHp: Math.round(115 * scaleHp),
        damage: Math.round(20 * scaleDmg),
        speed: 1.9,
        attackRange: 2.2,
        detectRange: 8.5,
        aggroed: false,
        alertTimer: 0,
        state: 'idle',
        stateTimer: 0,
        windupDuration: 0.85,
        targetGx: gx,
        targetGy: gy,
        facing: 1,
        hitFlash: 0,
        squashX: 1,
        squashY: 1,
        hopZ: 0,
        animPhase: Math.random() * 10,
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
      hp: Math.round(260 * scaleHp),
      maxHp: Math.round(260 * scaleHp),
      damage: Math.round(24 * scaleDmg),
      speed: 2.5,
      attackRange: 3.5,
      detectRange: 10.0,
      aggroed: false,
      alertTimer: 0,
      state: 'idle',
      stateTimer: 0,
      windupDuration: 0.8,
      targetGx: gx,
      targetGy: gy,
      facing: -1,
      hitFlash: 0,
      squashX: 1,
      squashY: 1,
      hopZ: 0,
      animPhase: 0,
      isBoss: true,
    };
  };

  for (const rm of rooms) {
    if (rm.kind === 'COMBAT_ROOM') {
      const count = 4 + (floorNum > 1 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const ex = rm.x + 2 + Math.random() * (rm.w - 4);
        const ey = rm.y + 2 + Math.random() * (rm.h - 4);
        if (tiles[Math.floor(ey)]?.[Math.floor(ex)]?.type === 'pillar') continue;
        const type: EnemyType =
          i === count - 1 && floorNum >= 2
            ? 'golem'
            : i % 2 === 0
            ? 'slime'
            : 'goblin';
        enemies.push(createEnemy(rm.id, type, ex, ey));
      }
    } else if (rm.kind === 'CHEST_ROOM') {
      // Weapon Chest Room + Statue of Blessing
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
      // Merchant + Shop Items + Statue
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
        createEnemy(rm.id, 'warden_boss', rm.cx + 1.5, rm.cy)
      );
      enemies.push(
        createEnemy(rm.id, 'slime', rm.cx - 2.2, rm.cy - 2.0)
      );
      enemies.push(
        createEnemy(rm.id, 'goblin', rm.cx - 2.2, rm.cy + 2.0)
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
  };
}
