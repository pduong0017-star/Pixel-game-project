import {
  BoonOption,
  DestructibleProp,
  DifficultyConfig,
  DifficultyId,
  DungeonRoom,
  DungeonTile,
  Enemy,
  EnemyType,
  GameModeId,
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
    eliteChance: 0.18,
    gemMult: 1.0,
    accent: '#34d399',
  },
  badass: {
    id: 'badass',
    name: 'Badass Mode',
    subtitle: 'Fierce Aggro & More Elites',
    hpMult: 1.45,
    dmgMult: 1.32,
    speedMult: 1.12,
    eliteChance: 0.38,
    gemMult: 1.75,
    accent: '#f59e0b',
  },
  hell: {
    id: 'hell',
    name: 'Abyssal Hell',
    subtitle: 'Nightmare Bullet Hell (+150% Gems)',
    hpMult: 1.9,
    dmgMult: 1.6,
    speedMult: 1.24,
    eliteChance: 0.58,
    gemMult: 2.5,
    accent: '#f43f5e',
  },
};

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  broadsword: {
    id: 'broadsword',
    name: 'Knight Broadsword',
    type: 'melee',
    meleeStyle: 'slash',
    canDeflect: false,
    damage: 38,
    manaCost: 0,
    cooldown: 0.25,
    range: 1.6,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#f59e0b',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    shopGemsCost: 80,
    description:
      'Chém cận chiến chuẩn xác liên hoàn 3 đòn (0 Mana). Phá đạn địch & hồi +3 Mana.',
  },
  twin_daggers: {
    id: 'twin_daggers',
    name: 'Shadow Twin Blades',
    type: 'melee',
    meleeStyle: 'slash',
    canDeflect: false,
    damage: 30,
    manaCost: 0,
    cooldown: 0.15,
    range: 1.4,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#10b981',
    coreColor: '#a7f3d0',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    shopGemsCost: 130,
    description: 'Song đao áp sát chém tốc độ cực nhanh (0 Mana). Chém tan đạn địch.',
  },
  blood_katana: {
    id: 'blood_katana',
    name: 'Muramasa Blood Katana',
    type: 'melee',
    meleeStyle: 'slash',
    canDeflect: true,
    damage: 46,
    manaCost: 0,
    cooldown: 0.19,
    range: 1.72,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#f43f5e',
    coreColor: '#fecdd3',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    shopGemsCost: 210,
    description:
      'Chém rút kiếm siêu tốc (0 Mana). PHẢN ĐÒN ĐẠN bay ngược lại kẻ địch!',
  },
  void_scythe: {
    id: 'void_scythe',
    name: 'Abyssal Void Scythe',
    type: 'melee',
    meleeStyle: 'slash',
    canDeflect: true,
    damage: 56,
    manaCost: 1,
    cooldown: 0.28,
    range: 1.9,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#a855f7',
    coreColor: '#38bdf8',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    shopGemsCost: 310,
    description:
      'Lưỡi hái tử thần quét vòng cung (1 Mana). PHẢN ĐÒN ĐẠN & hút năng lượng.',
  },
  inferno_greataxe: {
    id: 'inferno_greataxe',
    name: 'Inferno Greataxe',
    type: 'melee',
    meleeStyle: 'spin',
    canDeflect: false,
    damage: 54,
    manaCost: 1,
    cooldown: 0.32,
    range: 1.78,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#f97316',
    coreColor: '#fde047',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    shopGemsCost: 230,
    description:
      'Xoay 360° cơn lốc lửa cận chiến quét sạch quái và đạn sát người (1 Mana).',
  },
  thunder_warhammer: {
    id: 'thunder_warhammer',
    name: 'Thunder Warhammer',
    type: 'melee',
    meleeStyle: 'smash',
    canDeflect: false,
    damage: 65,
    manaCost: 2,
    cooldown: 0.38,
    range: 1.85,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 0,
    color: '#38bdf8',
    coreColor: '#fef08a',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    chainLightning: true,
    shopGemsCost: 250,
    description:
      'Đập chấn địa sấm sét làm choáng quái xung quanh & xóa đạn (2 Mana).',
  },
  dragon_lance: {
    id: 'dragon_lance',
    name: 'Dragonfire Lance',
    type: 'melee',
    meleeStyle: 'thrust',
    canDeflect: false,
    damage: 45,
    manaCost: 0,
    cooldown: 0.22,
    range: 2.15,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 15.5,
    color: '#ef4444',
    coreColor: '#fde047',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    piercing: true,
    shopGemsCost: 175,
    description: 'Đâm xuyên phá chuẩn xác với mũi thương rồng lửa (0 Mana).',
  },
  excalibur: {
    id: 'excalibur',
    name: 'Excalibur Sacred Blade',
    type: 'melee',
    meleeStyle: 'slash',
    canDeflect: true,
    damage: 66,
    manaCost: 2,
    cooldown: 0.27,
    range: 1.9,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 16.0,
    color: '#fde047',
    coreColor: '#ffffff',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    shopGemsCost: 360,
    description:
      'Thánh kiếm hoàng kim PHẢN ĐÒN ĐẠN kèm kiếm khí xuyên thấu (2 Mana).',
  },
  pioneer_pistol: {
    id: 'pioneer_pistol',
    name: 'Pioneer Pistol',
    type: 'gun',
    damage: 22,
    manaCost: 0,
    cooldown: 0.2,
    range: 9.8,
    projectiles: 1,
    spreadAngle: 0.03,
    projectileSpeed: 15.5,
    color: '#fbbf24',
    coreColor: '#fef08a',
    rarity: 'Common',
    rarityColor: '#cbd5e1',
    shopGemsCost: 70,
    description: 'Súng lục cơ bản chuẩn xác không tốn năng lượng (0 Mana).',
  },
  splitter_shotgun: {
    id: 'splitter_shotgun',
    name: 'Splitter Shotgun',
    type: 'gun',
    damage: 19,
    manaCost: 2,
    cooldown: 0.38,
    range: 8.2,
    projectiles: 5,
    spreadAngle: 0.38,
    projectileSpeed: 14.5,
    color: '#f97316',
    coreColor: '#fde047',
    rarity: 'Rare',
    rarityColor: '#38bdf8',
    shopGemsCost: 160,
    description: 'Bắn chùm 5 viên đạn ghém đẩy lùi mạnh (2 Mana).',
  },
  plasma_rifle: {
    id: 'plasma_rifle',
    name: 'Blue Fire Plasma SMG',
    type: 'gun',
    damage: 20,
    manaCost: 1,
    cooldown: 0.09,
    range: 10.8,
    projectiles: 1,
    spreadAngle: 0.09,
    projectileSpeed: 17.5,
    color: '#38bdf8',
    coreColor: '#e0f2fe',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    shopGemsCost: 220,
    description: 'Súng tiểu liên plasma tốc độ xả đạn cực đại (1 Mana).',
  },
  gatling_minigun: {
    id: 'gatling_minigun',
    name: 'Vulcan Gatling Minigun',
    type: 'gun',
    damage: 17,
    manaCost: 2,
    cooldown: 0.085,
    range: 10.5,
    projectiles: 3,
    spreadAngle: 0.22,
    projectileSpeed: 18.0,
    color: '#fbbf24',
    coreColor: '#ffffff',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    shopGemsCost: 340,
    description: 'Súng máy 3 nòng xả mưa đạn áp chế toàn phòng (2 Mana).',
  },
  sniper_railgun: {
    id: 'sniper_railgun',
    name: 'Hyperion Sniper Railgun',
    type: 'gun',
    damage: 82,
    manaCost: 3,
    cooldown: 0.45,
    range: 14.0,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 24.0,
    color: '#22d3ee',
    coreColor: '#fef08a',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    chainLightning: true,
    shopGemsCost: 350,
    description:
      'Súng bắn tỉa điện từ siêu tốc xuyên thấu mọi mục tiêu (3 Mana).',
  },
  frost_laser: {
    id: 'frost_laser',
    name: 'Aurora Cryo Cannon',
    type: 'gun',
    damage: 32,
    manaCost: 2,
    cooldown: 0.24,
    range: 11.5,
    projectiles: 2,
    spreadAngle: 0.08,
    projectileSpeed: 19.0,
    color: '#22d3ee',
    coreColor: '#ecfeff',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    piercing: true,
    shopGemsCost: 260,
    description: 'Pháo băng giá bắn 2 tia laser xuyên thấu hàng quái (2 Mana).',
  },
  thunder_staff: {
    id: 'thunder_staff',
    name: 'Staff of Thunder',
    type: 'staff',
    damage: 40,
    manaCost: 3,
    cooldown: 0.35,
    range: 10.8,
    projectiles: 1,
    spreadAngle: 0.02,
    projectileSpeed: 13.5,
    color: '#38bdf8',
    coreColor: '#ffffff',
    rarity: 'Epic',
    rarityColor: '#a855f7',
    chainLightning: true,
    shopGemsCost: 240,
    description: 'Bắn cầu sét giật dây chuyền qua nhiều mục tiêu (3 Mana).',
  },
  inferno_bow: {
    id: 'inferno_bow',
    name: 'Flame Dragon Bow',
    type: 'bow',
    damage: 55,
    manaCost: 3,
    cooldown: 0.36,
    range: 12.0,
    projectiles: 1,
    spreadAngle: 0,
    projectileSpeed: 17.0,
    color: '#f43f5e',
    coreColor: '#fde047',
    rarity: 'Legendary',
    rarityColor: '#f59e0b',
    piercing: true,
    explosive: true,
    shopGemsCost: 320,
    description: 'Cung rồng lửa bắn tên xuyên thấu phát nổ rực lửa (3 Mana).',
  },
};

export const WEAPON_POOL: WeaponId[] = [
  'blood_katana',
  'void_scythe',
  'inferno_greataxe',
  'thunder_warhammer',
  'dragon_lance',
  'excalibur',
  'splitter_shotgun',
  'plasma_rifle',
  'gatling_minigun',
  'sniper_railgun',
  'thunder_staff',
  'frost_laser',
  'inferno_bow',
  'broadsword',
  'twin_daggers',
];

export const PETS: Record<PetId, PetConfig> = {
  cat: {
    id: 'cat',
    name: 'Chilly the Cat',
    role: 'Mèo Chiến Binh (+8% Crit)',
    damage: 18,
    attackCooldown: 0.78,
    isRanged: false,
    projectileColor: '#fde047',
    accentColor: '#f59e0b',
    passiveDesc: '+8% Tỷ lệ Chí mạng cho chủ nhân',
  },
  mini_slime: {
    id: 'mini_slime',
    name: 'Bloop the Slime',
    role: 'Slime Băng Hộ Vệ (+25 Mana)',
    damage: 20,
    attackCooldown: 0.85,
    isRanged: false,
    projectileColor: '#38bdf8',
    accentColor: '#38bdf8',
    passiveDesc: '+25 Mana tối đa & làm chậm mục tiêu',
  },
  baby_dragon: {
    id: 'baby_dragon',
    name: 'Ignis Dragonling',
    role: 'Rồng Con Hỏa Diệm (+12% DMG)',
    damage: 25,
    attackCooldown: 0.86,
    isRanged: true,
    projectileColor: '#f43f5e',
    accentColor: '#f43f5e',
    passiveDesc: '+12% Sát thương vũ khí & gây Thiêu đốt',
  },
  cyber_neko: {
    id: 'cyber_neko',
    name: 'Cyber Neko X-9',
    role: 'Mèo Laser Công Nghệ (x2 Hút Vàng)',
    damage: 22,
    attackCooldown: 0.65,
    isRanged: true,
    projectileColor: '#22d3ee',
    accentColor: '#22d3ee',
    passiveDesc: 'Tăng gấp đôi bán kính hút Vàng/Mana & bắn tia Laser nhanh',
  },
};

export const HERO_CLASSES: Record<HeroClassId, HeroClassConfig> = {
  knight: {
    id: 'knight',
    name: 'Vanguard Knight',
    title: 'Hiệp Sĩ Tiên Phong',
    description: 'Máu và Giáp dày. Khởi đầu với Đại Kiếm + Súng Lục.',
    unlockCost: 0,
    maxHp: 145,
    maxArmor: 65,
    maxMana: 200,
    critChance: 0.18,
    moveSpeed: 5.6,
    starterWeaponId: 'broadsword',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Superior Shockwave (Q)',
    skillDesc: 'Phóng sóng chấn động hoàng kim, hồi +35 Mana & làm choáng quái.',
    skillCooldown: 4.5,
    ultName: 'Excalibur Judgment (E)',
    ultDesc: 'Triệu hồi 12 thanh Thánh Kiếm hoàng kim càn quét toàn bộ phòng & Bất Tử 2s!',
    ultCooldown: 10.0,
    accentColor: '#f59e0b',
    skins: {
      default: {
        id: 'knight_default',
        tier: 'default',
        name: 'Iron Vanguard',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#f59e0b',
      },
      rare: {
        id: 'knight_rare',
        tier: 'rare',
        name: 'Cobalt Templar',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 150,
        accentColor: '#38bdf8',
      },
      legendary: {
        id: 'knight_legendary',
        tier: 'legendary',
        name: 'Solar Seraphim',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 300,
        accentColor: '#fde047',
        auraColor: '#fde047',
      },
    },
  },
  pyromancer: {
    id: 'pyromancer',
    name: 'Ash Pyromancer',
    title: 'Pháp Sư Hỏa Diệm',
    description: 'Bể Mana cực lớn. Khởi đầu với Trượng Sấm Sét + Súng Lục.',
    unlockCost: 0,
    maxHp: 105,
    maxArmor: 45,
    maxMana: 260,
    critChance: 0.24,
    moveSpeed: 5.7,
    starterWeaponId: 'thunder_staff',
    secondaryWeaponId: 'pioneer_pistol',
    skillName: 'Solar Cataclysm (Q)',
    skillDesc: 'Phóng 8 cầu dung nham xuyên thấu ra mọi hướng và hồi +45 Mana.',
    skillCooldown: 4.2,
    ultName: 'Meteor Apocalypse (E)',
    ultDesc: 'Gọi mưa 16 thiên thạch hỏa ngục nổ tung toàn phòng & hồi đầy Mana!',
    ultCooldown: 10.0,
    accentColor: '#f97316',
    skins: {
      default: {
        id: 'pyromancer_default',
        tier: 'default',
        name: 'Cinder Robe',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#f97316',
      },
      rare: {
        id: 'pyromancer_rare',
        tier: 'rare',
        name: 'Frostfire Arcanist',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 150,
        accentColor: '#38bdf8',
      },
      legendary: {
        id: 'pyromancer_legendary',
        tier: 'legendary',
        name: 'Astral Archon',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 300,
        accentColor: '#e879f9',
        auraColor: '#e879f9',
      },
    },
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow Rogue',
    title: 'Sát Thủ Bóng Đêm',
    description: 'Tốc chạy & Chí mạng cao. Khởi đầu với Huyết Kiếm Katana + Shotgun.',
    unlockCost: 0,
    maxHp: 115,
    maxArmor: 45,
    maxMana: 200,
    critChance: 0.38,
    moveSpeed: 6.4,
    starterWeaponId: 'blood_katana',
    secondaryWeaponId: 'splitter_shotgun',
    skillName: 'Phantom Blade Fan (Q)',
    skillDesc: 'Phi 7 phi tiêu lục bảo xuyên thấu chí mạng và hồi ngay lượt Dash.',
    skillCooldown: 3.6,
    ultName: 'Shadow Clone Storm (E)',
    ultDesc: 'Phóng cơn lốc 18 phi tiêu xoáy 360° & xóa toàn bộ đạn địch trong phòng!',
    ultCooldown: 9.0,
    accentColor: '#10b981',
    skins: {
      default: {
        id: 'rogue_default',
        tier: 'default',
        name: 'Night Stalker',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#10b981',
      },
      rare: {
        id: 'rogue_rare',
        tier: 'rare',
        name: 'Crimson Shinobi',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 150,
        accentColor: '#f43f5e',
      },
      legendary: {
        id: 'rogue_legendary',
        tier: 'legendary',
        name: 'Cyber Ronin X',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 300,
        accentColor: '#22d3ee',
        auraColor: '#22d3ee',
      },
    },
  },
  alchemist: {
    id: 'alchemist',
    name: 'Cyber Alchemist',
    title: 'Giả Kim Thuật Sư',
    description: 'Công nghệ sinh học & băng giá. Khởi đầu với Pháo Laser Băng.',
    unlockCost: 220,
    maxHp: 125,
    maxArmor: 55,
    maxMana: 230,
    critChance: 0.26,
    moveSpeed: 5.8,
    starterWeaponId: 'frost_laser',
    secondaryWeaponId: 'dragon_lance',
    skillName: 'Alchemical Venom Nova (Q)',
    skillDesc: 'Ném 6 bình độc sinh học nổ lan, hồi +15 Giáp & +35 Mana.',
    skillCooldown: 4.2,
    ultName: 'Omega Bio-Laser Storm (E)',
    ultDesc: 'Xả 14 tia laser băng-độc giật sét dây chuyền toàn phòng + hồi 25 HP!',
    ultCooldown: 10.0,
    accentColor: '#14b8a6',
    skins: {
      default: {
        id: 'alchemist_default',
        tier: 'default',
        name: 'Bio-Hazmat Suit',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#14b8a6',
      },
      rare: {
        id: 'alchemist_rare',
        tier: 'rare',
        name: 'Nebula Chemist',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 160,
        accentColor: '#c084fc',
      },
      legendary: {
        id: 'alchemist_legendary',
        tier: 'legendary',
        name: 'Auric Plague Lord',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 320,
        accentColor: '#fde047',
        auraColor: '#a3e635',
      },
    },
  },
  necromancer: {
    id: 'necromancer',
    name: 'Void Necromancer',
    title: 'Chúa Tể Hư Không',
    description: 'Chiêu hồn bóng tối & hút sinh lực. Khởi đầu với Lưỡi Hái Hư Không.',
    unlockCost: 350,
    maxHp: 118,
    maxArmor: 60,
    maxMana: 270,
    critChance: 0.28,
    moveSpeed: 5.7,
    starterWeaponId: 'void_scythe',
    secondaryWeaponId: 'plasma_rifle',
    skillName: 'Abyssal Soul Harvest (Q)',
    skillDesc: 'Phóng 10 hồn ma hư không tự săn mục tiêu, hút +15 HP & +40 Mana.',
    skillCooldown: 4.2,
    ultName: 'Legion of the Dead (E)',
    ultDesc: 'Bùng nổ 16 đầu lâu ma giới càn quét toàn phòng & hút +30 HP +60 Mana!',
    ultCooldown: 10.0,
    accentColor: '#c084fc',
    skins: {
      default: {
        id: 'necromancer_default',
        tier: 'default',
        name: 'Lich Sovereign',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#c084fc',
      },
      rare: {
        id: 'necromancer_rare',
        tier: 'rare',
        name: 'Emerald Wraith',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 180,
        accentColor: '#34d399',
      },
      legendary: {
        id: 'necromancer_legendary',
        tier: 'legendary',
        name: 'Blood Emperor',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 350,
        accentColor: '#f43f5e',
        auraColor: '#f43f5e',
      },
    },
  },
  berserker: {
    id: 'berserker',
    name: 'Berserker Titan',
    title: 'Chiến Thần Cuồng Nộ',
    description: 'Sức mạnh hủy diệt cận chiến. Khởi đầu với Đại Kiếm Excalibur.',
    unlockCost: 450,
    maxHp: 170,
    maxArmor: 70,
    maxMana: 190,
    critChance: 0.32,
    moveSpeed: 6.1,
    starterWeaponId: 'excalibur',
    secondaryWeaponId: 'inferno_greataxe',
    skillName: 'Ragnarok Blood Rage (Q)',
    skillDesc: 'Giậm vỡ mặt đất tạo vòng chém + phóng 6 kiếm khí lửa hủy diệt.',
    skillCooldown: 4.0,
    ultName: 'Worldbreaker Cataclysm (E)',
    ultDesc: 'Bộc phát Cuồng Nộ Chiến Thần: Chém chấn địa + 14 kiếm khí hủy diệt 360°!',
    ultCooldown: 9.5,
    accentColor: '#ef4444',
    skins: {
      default: {
        id: 'berserker_default',
        tier: 'default',
        name: 'Warborn Gladiator',
        badge: 'MẶC ĐỊNH',
        rarityLabel: 'MẶC ĐỊNH',
        cost: 0,
        accentColor: '#ef4444',
      },
      rare: {
        id: 'berserker_rare',
        tier: 'rare',
        name: 'Glacial Viking',
        badge: 'HIẾM (RARE)',
        rarityLabel: 'HIẾM (RARE)',
        cost: 180,
        accentColor: '#38bdf8',
      },
      legendary: {
        id: 'berserker_legendary',
        tier: 'legendary',
        name: 'God-King Ares',
        badge: 'HUYỀN THOẠI',
        rarityLabel: 'HUYỀN THOẠI (LEGENDARY)',
        cost: 380,
        accentColor: '#fde047',
        auraColor: '#fde047',
      },
    },
  },
};

// ============================================================================
// EXPANDED 16-BOON SKILL BUFF POOL (Đa Dạng Hóa Kỹ Năng Khi Lên Cấp)
// ============================================================================
export const BOON_POOL: BoonOption[] = [
  {
    id: 'mirror_deflect',
    name: 'Mirror Blade (Deflect Bullets)',
    category: 'Soul Knight Mastery',
    description:
      'Mọi đòn chém cận chiến sẽ PHẢN XẠ đạn của quái bay ngược lại với 240% Sát thương!',
    accent: '#fde047',
  },
  {
    id: 'sword_qi_wave',
    name: 'Sword Qi Wave (Kiếm Khí)',
    category: 'Blade Mastery',
    description:
      'Mọi vũ khí cận chiến phóng thêm 1 luồng Kiếm Khí tầm xa xuyên thấu mỗi khi vung kiếm!',
    accent: '#38bdf8',
  },
  {
    id: 'multi_shot_storm',
    name: 'Twin Trigger (+Projectiles)',
    category: 'Gunner Mastery',
    description:
      'Mọi loại Súng, Cung và Trượng bắn thêm +2 viên đạn/tia phép mỗi phát bắn!',
    accent: '#f59e0b',
  },
  {
    id: 'frost_nova_crit',
    name: 'Glacial Shatter (Frost Nova)',
    category: 'Elemental Buff',
    description:
      'Đòn Chí mạng phát nổ vòng băng giá làm chậm và gây thêm +35 sát thương lan.',
    accent: '#22d3ee',
  },
  {
    id: 'explosive_rounds',
    name: 'Hellfire Warheads (Đạn Nổ)',
    category: 'Artillery Buff',
    description:
      'Mọi viên đạn và kiếm khí của bạn đều phát nổ diện rộng khi trúng mục tiêu!',
    accent: '#f97316',
  },
  {
    id: 'berserk_frenzy',
    name: 'Bloodlust Frenzy (+Speed & Crit)',
    category: 'Berserk Buff',
    description:
      'Tăng +25% Tốc độ di chuyển, +25% Tốc đánh và +20% Tỷ lệ Chí mạng.',
    accent: '#ef4444',
  },
  {
    id: 'static_shield',
    name: 'Thunder Aegis (+30 Shield)',
    category: 'Defense Buff',
    description:
      'Tăng +30 Giáp tối đa. Khi bị đánh trúng sẽ phóng sét phản công toàn bộ quái gần đó!',
    accent: '#60a5fa',
  },
  {
    id: 'ult_overcharge',
    name: 'Awakening Core (Giảm 35% CD Skill)',
    category: 'Arcane Buff',
    description:
      'Giảm 35% thời gian hồi chiêu của cả Kỹ Năng (Q) và Tuyệt Kỹ Tối Thượng (E)!',
    accent: '#c084fc',
  },
  {
    id: 'vitality_surge',
    name: 'Titan Wine (+30% Max HP)',
    category: 'Survival Buff',
    description: 'Tăng +30% Máu tối đa và hồi ngay lập tức 50% HP.',
    accent: '#4ade80',
  },
  {
    id: 'blitz_reflex',
    name: 'Firing Rate & Slash Speed +35%',
    category: 'Offense Buff',
    description: 'Tăng +35% Tốc độ bắn/chém và giảm 20% Hồi chiêu Kỹ năng.',
    accent: '#fde047',
  },
  {
    id: 'chain_arc',
    name: 'Laser & Lightning Bounce',
    category: 'Elemental Buff',
    description:
      'Mọi đòn đánh phóng tia sét dây chuyền sang 3 quái lân cận (70% DMG).',
    accent: '#38bdf8',
  },
  {
    id: 'vampiric_edge',
    name: 'Vampirism (Heal on Kill)',
    category: 'Sustenance Buff',
    description: 'Hồi +12 HP và +22 Mana mỗi khi tiêu diệt kẻ địch.',
    accent: '#f43f5e',
  },
  {
    id: 'executioner',
    name: 'Critical Pierce (+35% DMG)',
    category: 'Offense Buff',
    description: 'Tăng +35% Sát thương vũ khí và +15% Tỷ lệ Chí mạng.',
    accent: '#f59e0b',
  },
  {
    id: 'ember_nova',
    name: 'Flame Dash Nova',
    category: 'Tactical Buff',
    description:
      'Khi Lướt (Dash) tạo vòng lửa gây 65 sát thương và xóa đạn xung quanh.',
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
// 1. LIVING ROOM HUB GENERATOR
// ============================================================================
export function generateLivingRoom(): GeneratedFloor {
  const width = 26;
  const height = 20;
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
  const rw = 20;
  const rh = 14;

  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      const isCarpet = x >= 9 && x <= 15 && y >= 5 && y <= 14;
      tiles[y][x].type = isCarpet ? 'floor_carpet' : 'floor_wood';
    }
  }

  for (let y = ry - 1; y <= ry + rh; y++) {
    for (let x = rx - 1; x <= rx + rw; x++) {
      if (tiles[y][x].type === 'void') {
        tiles[y][x].type = 'wall';
        if (y === ry - 1 && (x === 6 || x === 12 || x === 18)) {
          tiles[y][x].hasTorch = true;
        }
      }
    }
  }

  tiles[ry - 1][12].type = 'door_open';
  tiles[ry - 1][13].type = 'door_open';
  tiles[ry][12].type = 'portal_pedestal';
  tiles[ry][13].type = 'portal_pedestal';

  const livingRoom: DungeonRoom = {
    id: 1,
    gridX: 0,
    gridY: 0,
    x: rx,
    y: ry,
    w: rw,
    h: rh,
    cx: 12.5,
    cy: 10,
    kind: 'LIVING_ROOM',
    cleared: true,
    locked: false,
    visited: true,
    wave: 1,
    maxWaves: 1,
    doorTiles: [],
  };

  const interactables: Interactable[] = [
    {
      id: 101,
      type: 'lobby_hero',
      gx: 5.5,
      gy: 5.2,
      opened: false,
      value: 0,
      bobPhase: 0,
      heroId: 'knight',
      label: 'Vanguard Knight',
    },
    {
      id: 102,
      type: 'lobby_hero',
      gx: 5.5,
      gy: 7.8,
      opened: false,
      value: 0,
      bobPhase: 1,
      heroId: 'pyromancer',
      label: 'Ash Pyromancer',
    },
    {
      id: 103,
      type: 'lobby_hero',
      gx: 5.5,
      gy: 10.4,
      opened: false,
      value: 0,
      bobPhase: 2,
      heroId: 'rogue',
      label: 'Shadow Rogue',
    },
    {
      id: 107,
      type: 'lobby_hero',
      gx: 5.5,
      gy: 13.0,
      opened: false,
      value: 0,
      bobPhase: 3,
      heroId: 'alchemist',
      label: 'Cyber Alchemist',
    },
    {
      id: 108,
      type: 'lobby_hero',
      gx: 8.4,
      gy: 5.2,
      opened: false,
      value: 0,
      bobPhase: 4,
      heroId: 'necromancer',
      label: 'Void Necromancer',
    },
    {
      id: 109,
      type: 'lobby_hero',
      gx: 8.4,
      gy: 13.0,
      opened: false,
      value: 0,
      bobPhase: 5,
      heroId: 'berserker',
      label: 'Berserker Titan',
    },
    {
      id: 104,
      type: 'lobby_pet',
      gx: 19.0,
      gy: 6.2,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Switch Companion Pet',
    },
    {
      id: 105,
      type: 'chest',
      gx: 19.0,
      gy: 13.2,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Starter Supply Chest',
    },
    {
      id: 106,
      type: 'dungeon_gate',
      gx: 12.5,
      gy: 3.8,
      opened: false,
      value: 0,
      bobPhase: 0,
      label: 'Enter Dungeon (1-1)',
    },
  ];

  const props: DestructibleProp[] = [
    { id: 1, roomId: 1, kind: 'crate', gx: 15.5, gy: 5.2, hp: 20, hitFlash: 0 },
    { id: 2, roomId: 1, kind: 'vase', gx: 15.5, gy: 13.8, hp: 15, hitFlash: 0 },
  ];

  const enemies: Enemy[] = [
    {
      id: 901,
      roomId: 1,
      type: 'dummy',
      name: 'Training Dummy',
      gx: 19.0,
      gy: 9.8,
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
      targetGx: 19.0,
      targetGy: 9.8,
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
    spawnGx: 12.5,
    spawnGy: 10.5,
    stairsGx: 12.5,
    stairsGy: 3.8,
    enemies,
    interactables,
    props,
  };
}

// ============================================================================
// HELPER: CREATE ENEMY INSTANCE & SPAWN MULTI-WAVE HORDE FOR A ROOM
// ============================================================================
export function createDungeonEnemy(
  id: number,
  roomId: number,
  type: EnemyType,
  gx: number,
  gy: number,
  floorNum: number,
  difficulty: DifficultyId,
  forceElite: boolean = false
): Enemy {
  const diffCfg = DIFFICULTIES[difficulty];
  const scaleHp = (1 + (floorNum - 1) * 0.25) * diffCfg.hpMult;
  const scaleDmg = (1 + (floorNum - 1) * 0.16) * diffCfg.dmgMult;
  const scaleSpd = diffCfg.speedMult;

  const isBossType =
    type === 'warden_boss' || type === 'cryo_boss' || type === 'inferno_boss';
  const isElite =
    !isBossType &&
    type !== 'dummy' &&
    (forceElite || Math.random() < diffCfg.eliteChance);
  const eliteHpMult = isElite ? 1.55 : 1.0;
  const eliteDmgMult = isElite ? 1.22 : 1.0;

  if (type === 'slime') {
    return {
      id,
      roomId,
      type: 'slime',
      name: isElite ? 'Elite King Slime' : 'Emerald Slime',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(44 * scaleHp * eliteHpMult),
      maxHp: Math.round(44 * scaleHp * eliteHpMult),
      damage: Math.round(11 * scaleDmg * eliteDmgMult),
      speed: 3.4 * scaleSpd,
      attackRange: 1.35,
      detectRange: 11.0,
      aggroed: true,
      alertTimer: 0.7,
      state: 'chase',
      stateTimer: 0,
      windupDuration: 0.42,
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
      id,
      roomId,
      type: 'goblin',
      name: isElite ? 'Elite Goblin Sharpshooter' : 'Goblin Marksman',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(52 * scaleHp * eliteHpMult),
      maxHp: Math.round(52 * scaleHp * eliteHpMult),
      damage: Math.round(13 * scaleDmg * eliteDmgMult),
      speed: 2.6 * scaleSpd,
      attackRange: 7.2,
      detectRange: 11.5,
      aggroed: true,
      alertTimer: 0.7,
      state: 'chase',
      stateTimer: 0,
      windupDuration: 0.65,
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
      id,
      roomId,
      type: 'necro_mage',
      name: isElite ? 'Arch-Lich Necromancer' : 'Skeleton Necro Mage',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(62 * scaleHp * eliteHpMult),
      maxHp: Math.round(62 * scaleHp * eliteHpMult),
      damage: Math.round(15 * scaleDmg * eliteDmgMult),
      speed: 2.3 * scaleSpd,
      attackRange: 7.8,
      detectRange: 11.5,
      aggroed: true,
      alertTimer: 0.7,
      state: 'chase',
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
      isElite,
    };
  }
  if (type === 'golem') {
    return {
      id,
      roomId,
      type: 'golem',
      name: isElite ? 'Elder Magma Titan' : 'Obsidian Golem',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(115 * scaleHp * eliteHpMult),
      maxHp: Math.round(115 * scaleHp * eliteHpMult),
      damage: Math.round(19 * scaleDmg * eliteDmgMult),
      speed: 2.05 * scaleSpd,
      attackRange: 2.2,
      detectRange: 11.0,
      aggroed: true,
      alertTimer: 0.7,
      state: 'chase',
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
  if (type === 'cryo_boss') {
    return {
      id,
      roomId,
      type: 'cryo_boss',
      name: 'Glacius, Cryo Behemoth',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(490 * scaleHp),
      maxHp: Math.round(490 * scaleHp),
      damage: Math.round(25 * scaleDmg),
      speed: 2.75 * scaleSpd,
      attackRange: 5.5,
      detectRange: 15.0,
      aggroed: true,
      alertTimer: 0.9,
      state: 'chase',
      stateTimer: 0,
      windupDuration: 0.65,
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
  }
  if (type === 'inferno_boss') {
    return {
      id,
      roomId,
      type: 'inferno_boss',
      name: 'Ignis, Inferno Archdemon',
      gx,
      gy,
      vx: 0,
      vy: 0,
      hp: Math.round(580 * scaleHp),
      maxHp: Math.round(580 * scaleHp),
      damage: Math.round(28 * scaleDmg),
      speed: 2.95 * scaleSpd,
      attackRange: 6.2,
      detectRange: 15.0,
      aggroed: true,
      alertTimer: 0.9,
      state: 'chase',
      stateTimer: 0,
      windupDuration: 0.6,
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
  }
  return {
    id,
    roomId,
    type: 'warden_boss',
    name: 'Vorgath, Obsidian Warden',
    gx,
    gy,
    vx: 0,
    vy: 0,
    hp: Math.round(420 * scaleHp),
    maxHp: Math.round(420 * scaleHp),
    damage: Math.round(23 * scaleDmg),
    speed: 2.6 * scaleSpd,
    attackRange: 4.0,
    detectRange: 14.0,
    aggroed: true,
    alertTimer: 0.9,
    state: 'chase',
    stateTimer: 0,
    windupDuration: 0.7,
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
}

export function spawnWaveEnemiesForRoom(
  rm: DungeonRoom,
  floorNum: number,
  difficulty: DifficultyId,
  tiles: DungeonTile[][],
  baseEnemyId: number,
  waveNum: number
): Enemy[] {
  const spawned: Enemy[] = [];
  // 7 to 11 enemies per wave!
  const baseCount =
    7 +
    floorNum +
    (waveNum > 1 ? 2 : 0) +
    (difficulty === 'badass' ? 2 : difficulty === 'hell' ? 4 : 0);

  let nextId = baseEnemyId;
  for (let i = 0; i < baseCount; i++) {
    let ex = rm.cx;
    let ey = rm.cy;
    for (let attempt = 0; attempt < 10; attempt++) {
      const candX = rm.x + 2.2 + Math.random() * (rm.w - 4.4);
      const candY = rm.y + 2.2 + Math.random() * (rm.h - 4.4);
      const tType = tiles[Math.floor(candY)]?.[Math.floor(candX)]?.type;
      if (tType && tType !== 'pillar' && tType !== 'spike_trap' && tType !== 'wall') {
        ex = candX;
        ey = candY;
        break;
      }
    }

    let type: EnemyType = 'slime';
    if (i === baseCount - 1 || (waveNum >= 2 && i === 0)) {
      type = 'golem';
    } else if (i % 3 === 2) {
      type = 'necro_mage';
    } else if (i % 2 === 1) {
      type = 'goblin';
    }

    const forceElite = waveNum >= 2 && i < 2;
    spawned.push(
      createDungeonEnemy(
        nextId++,
        rm.id,
        type,
        ex,
        ey,
        floorNum,
        difficulty,
        forceElite
      )
    );
  }
  return spawned;
}

// ============================================================================
// 2. EXPANDED 3x3 (9-ROOM) SPRAWLING DUNGEON GENERATOR WITH MULTI-WAVE ARENAS
// ============================================================================
export function generateDungeonFloor(
  floorNum: number,
  difficulty: DifficultyId = 'normal',
  gameMode: GameModeId = 'CAMPAIGN'
): GeneratedFloor {
  const width = 92;
  const height = 74;

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

  // 3x3 Grid of 9 Spacious Rooms (5 Combat Arenas, 1 Start, 1 Chest, 1 Shop/Statue, 1 Boss Colosseum)
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
    { id: 5, gridX: 1, gridY: 2, kind: 'COMBAT_ROOM' },
    {
      id: 6,
      gridX: 0,
      gridY: 2,
      kind: floorNum % 2 === 1 ? 'SHOP_ROOM' : 'STATUE_ROOM',
    },
    { id: 7, gridX: 2, gridY: 0, kind: 'COMBAT_ROOM' },
    { id: 8, gridX: 2, gridY: 2, kind: 'COMBAT_ROOM' },
    { id: 9, gridX: 2, gridY: 1, kind: 'BOSS_ROOM' },
  ];

  const rooms: DungeonRoom[] = [];
  const cellW = 27;
  const cellH = 22;

  const defaultMaxWaves =
    gameMode === 'ENDLESS'
      ? 3
      : gameMode === 'BOSS_RUSH'
      ? 1
      : floorNum >= 2 || difficulty !== 'normal'
      ? 3
      : 2;

  for (const def of roomDefs) {
    const rw =
      def.kind === 'BOSS_ROOM'
        ? 19
        : def.kind === 'COMBAT_ROOM'
        ? 17
        : 13;
    const rh =
      def.kind === 'BOSS_ROOM'
        ? 17
        : def.kind === 'COMBAT_ROOM'
        ? 15
        : 11;
    const cx = 16 + def.gridX * cellW;
    const cy = 14 + def.gridY * cellH;
    const rx = Math.floor(cx - rw / 2);
    const ry = Math.floor(cy - rh / 2);

    const isSafeRoom =
      def.kind === 'START_ROOM' ||
      def.kind === 'CHEST_ROOM' ||
      def.kind === 'SHOP_ROOM' ||
      def.kind === 'STATUE_ROOM' ||
      (gameMode === 'BOSS_RUSH' && def.kind === 'COMBAT_ROOM' && def.id !== 2);

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
      visited: def.kind === 'START_ROOM' || (gameMode === 'BOSS_RUSH' && isSafeRoom),
      wave: 1,
      maxWaves: def.kind === 'COMBAT_ROOM' ? defaultMaxWaves : 1,
      doorTiles: [],
    });
  }

  const carveFloor = (
    x: number,
    y: number,
    roomKind?: DungeonRoom['kind'],
    rm?: DungeonRoom
  ) => {
    if (x <= 1 || y <= 1 || x >= width - 2 || y >= height - 2) return;
    if (rm && roomKind) {
      const distCenter = Math.max(Math.abs(x - rm.cx), Math.abs(y - rm.cy));
      if (roomKind === 'BOSS_ROOM' && distCenter <= 4.5) {
        tiles[y][x].type = 'floor_carpet';
        return;
      }
      if (
        (roomKind === 'SHOP_ROOM' ||
          roomKind === 'CHEST_ROOM' ||
          roomKind === 'STATUE_ROOM') &&
        distCenter <= 3.0
      ) {
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

  for (const rm of rooms) {
    for (let y = rm.y; y < rm.y + rm.h; y++) {
      for (let x = rm.x; x < rm.x + rm.w; x++) {
        carveFloor(x, y, rm.kind, rm);
      }
    }

    if (rm.kind === 'COMBAT_ROOM') {
      tiles[rm.y + 3][rm.x + 4].type = 'pillar';
      tiles[rm.y + 3][rm.x + rm.w - 5].type = 'pillar';
      tiles[rm.y + rm.h - 4][rm.x + 4].type = 'pillar';
      tiles[rm.y + rm.h - 4][rm.x + rm.w - 5].type = 'pillar';

      tiles[Math.floor(rm.cy)][Math.floor(rm.cx) - 3].type = 'spike_trap';
      tiles[Math.floor(rm.cy)][Math.floor(rm.cx) + 3].type = 'spike_trap';

      const propCoords: [number, number, DestructibleProp['kind']][] = [
        [rm.x + 1.8, rm.y + 1.8, 'crate'],
        [rm.x + rm.w - 1.8, rm.y + 1.8, 'vase'],
        [rm.x + 1.8, rm.y + rm.h - 1.8, 'vase'],
        [rm.x + rm.w - 1.8, rm.y + rm.h - 1.8, 'crate'],
        [rm.cx - 4.2, rm.cy, 'explosive_barrel'],
        [rm.cx + 4.2, rm.cy, 'cryo_barrel'],
      ];
      for (const [px, py, pkind] of propCoords) {
        props.push({
          id: nextPropId++,
          roomId: rm.id,
          kind: pkind,
          gx: px,
          gy: py,
          hp: pkind === 'crate' ? 24 : pkind === 'vase' ? 16 : 22,
          hitFlash: 0,
        });
      }
    } else if (rm.kind === 'BOSS_ROOM') {
      tiles[rm.y + 3][rm.x + 3].type = 'pillar';
      tiles[rm.y + 3][rm.x + rm.w - 4].type = 'pillar';
      tiles[rm.y + rm.h - 4][rm.x + 3].type = 'pillar';
      tiles[rm.y + rm.h - 4][rm.x + rm.w - 4].type = 'pillar';

      props.push(
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'explosive_barrel',
          gx: rm.x + 2.2,
          gy: rm.cy - 4,
          hp: 22,
          hitFlash: 0,
        },
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'cryo_barrel',
          gx: rm.x + 2.2,
          gy: rm.cy + 4,
          hp: 22,
          hitFlash: 0,
        },
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'cryo_barrel',
          gx: rm.x + rm.w - 2.2,
          gy: rm.cy - 4,
          hp: 22,
          hitFlash: 0,
        },
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'explosive_barrel',
          gx: rm.x + rm.w - 2.2,
          gy: rm.cy + 4,
          hp: 22,
          hitFlash: 0,
        }
      );
    } else if (rm.kind === 'START_ROOM') {
      props.push(
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'vase',
          gx: rm.x + 1.8,
          gy: rm.y + 1.8,
          hp: 15,
          hitFlash: 0,
        },
        {
          id: nextPropId++,
          roomId: rm.id,
          kind: 'crate',
          gx: rm.x + rm.w - 1.8,
          gy: rm.y + 1.8,
          hp: 20,
          hitFlash: 0,
        }
      );
    }
  }

  // Connect all 9 rooms in the 3x3 grid
  const connections: [number, number][] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [2, 5],
    [5, 6],
    [3, 7],
    [5, 8],
    [2, 9],
    [7, 9],
    [8, 9],
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
  tiles[Math.floor(bossRoom.cy)][Math.floor(bossRoom.cx)].type =
    'portal_pedestal';

  const enemies: Enemy[] = [];
  const interactables: Interactable[] = [];
  let nextEnemyId = 1;
  let nextInteractId = 200;

  for (const rm of rooms) {
    if (rm.kind === 'START_ROOM' && (gameMode === 'BOSS_RUSH' || gameMode === 'ENDLESS')) {
      interactables.push({
        id: nextInteractId++,
        type: 'anvil',
        gx: rm.cx - 2.2,
        gy: rm.cy - 1.8,
        opened: false,
        value: 25,
        bobPhase: 0,
        label: 'Reforge Anvil (+1★ / +2★ / +3★)',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'chest',
        gx: rm.cx + 2.2,
        gy: rm.cy - 1.8,
        opened: false,
        value: 0,
        bobPhase: 1,
        label: 'Arena Supply Chest',
      });
    } else if (rm.kind === 'COMBAT_ROOM' && !rm.cleared) {
      const wave1 = spawnWaveEnemiesForRoom(
        rm,
        floorNum,
        difficulty,
        tiles,
        nextEnemyId,
        1
      );
      // Set initial wave enemies to idle until player enters room
      for (const e of wave1) {
        e.aggroed = false;
        e.alertTimer = 0;
        e.state = 'idle';
      }
      enemies.push(...wave1);
      nextEnemyId += wave1.length + 5;
    } else if (rm.kind === 'CHEST_ROOM') {
      interactables.push({
        id: nextInteractId++,
        type: 'chest',
        gx: rm.cx - 2.2,
        gy: rm.cy,
        opened: false,
        value: 0,
        bobPhase: 0,
        label: 'Weapon Chest',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'anvil',
        gx: rm.cx,
        gy: rm.cy - 1.8,
        opened: false,
        value: 25,
        bobPhase: 0.5,
        label: 'Reforge Anvil (+1★ / +2★ / +3★)',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'statue',
        gx: rm.cx + 2.2,
        gy: rm.cy,
        opened: false,
        value: 20,
        bobPhase: 1,
        statueName: 'Statue of the Paladin',
        statueBuffId: 'paladin',
      });
    } else if (rm.kind === 'SHOP_ROOM' || rm.kind === 'STATUE_ROOM') {
      const shopWeaponId =
        WEAPON_POOL[Math.floor(Math.random() * WEAPON_POOL.length)];
      interactables.push({
        id: nextInteractId++,
        type: 'shop_item',
        gx: rm.cx - 2.6,
        gy: rm.cy + 0.8,
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
        gy: rm.cy + 0.8,
        opened: false,
        value: 18,
        bobPhase: 1,
        shopKind: 'potion',
        label: 'Healing Vial (+50% HP)',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'shop_item',
        gx: rm.cx + 2.6,
        gy: rm.cy + 0.8,
        opened: false,
        value: 15,
        bobPhase: 2,
        shopKind: 'mana_pack',
        label: 'Energy Crystal (+120 Mana)',
      });
      interactables.push({
        id: nextInteractId++,
        type: 'anvil',
        gx: rm.cx,
        gy: rm.cy - 2.0,
        opened: false,
        value: 25,
        bobPhase: 0.5,
        label: 'Reforge Anvil (+1★ / +2★ / +3★)',
      });
    } else if (rm.kind === 'BOSS_ROOM') {
      const bossType: EnemyType =
        floorNum === 1
          ? 'warden_boss'
          : floorNum === 2
          ? 'cryo_boss'
          : 'inferno_boss';
      const boss = createDungeonEnemy(
        nextEnemyId++,
        rm.id,
        bossType,
        rm.cx + 2.5,
        rm.cy,
        floorNum,
        difficulty,
        false
      );
      boss.aggroed = false;
      boss.state = 'idle';
      enemies.push(boss);

      const bossGuards: [EnemyType, number, number][] = [
        ['necro_mage', rm.cx - 3.2, rm.cy - 3.2],
        ['necro_mage', rm.cx - 3.2, rm.cy + 3.2],
        ['goblin', rm.cx + 1.0, rm.cy - 4.0],
        ['goblin', rm.cx + 1.0, rm.cy + 4.0],
        ['golem', rm.cx - 1.5, rm.cy],
      ];
      for (const [gType, gx, gy] of bossGuards) {
        const g = createDungeonEnemy(
          nextEnemyId++,
          rm.id,
          gType,
          gx,
          gy,
          floorNum,
          difficulty,
          false
        );
        g.aggroed = false;
        g.state = 'idle';
        enemies.push(g);
      }
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
