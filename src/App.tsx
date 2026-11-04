import React, { useEffect, useRef, useState } from 'react';
import {
  AnvilArmoryIcon,
  BootPixelIcon,
  ChestGachaIcon,
  CoinPixelIcon,
  HeartPixelIcon,
  LockPixelIcon,
  ManaPixelIcon,
  ObsidianTitleLockup,
  PausePixelIcon,
  PixelAvatarGraphic,
  PotionPixelIcon,
  QuestScrollIcon,
  SettingsPixelIcon,
  ShieldPixelIcon,
  ShopPixelIcon,
  SkillStarIcon,
  SoulGemIcon,
  SoundIcon,
  SparkleCrownIcon,
  StairsPixelIcon,
  SwapWeaponIcon,
  SwordPixelIcon,
} from './components/Icons';
import { IsometricGameEngine } from './game/GameEngine';
import { DIFFICULTIES, HERO_CLASSES, PETS, WEAPONS } from './game/dungeonGen';
import { I18N, LANG_OPTIONS } from './game/i18n';
import { drawCustomizedHero, getSpriteBank } from './game/pixelSprites';
import { MUSIC_SCALES, sound } from './game/sound';
import {
  ACHIEVEMENT_LIST,
  AVATAR_LIST,
  DEFAULT_PROFILE,
  EAR_STYLES,
  EYE_COLORS,
  HORN_STYLES,
  RACES,
  SKIN_TONES,
  WING_STYLES,
  loadProfile,
  loadSettings,
  saveProfile,
  saveSettings,
} from './game/storage';
import {
  AvatarId,
  BoonOption,
  DifficultyId,
  EarStyle,
  EnemyType,
  GameModeId,
  GameSettings,
  GameState,
  HeroClassId,
  HornStyle,
  HudSnapshot,
  LanguageCode,
  MusicStyle,
  PermanentUpgrades,
  PetId,
  PlayerProfile,
  RaceCustomization,
  RaceId,
  SkinTier,
  WeaponId,
  WingStyle,
} from './game/types';

const SKIN_TIERS: SkinTier[] = ['default', 'rare', 'legendary'];

const INITIAL_HUD: HudSnapshot = {
  inLivingRoom: true,
  difficulty: 'normal',
  gameMode: 'CAMPAIGN',
  biomeName: 'OBSIDIAN CRYPT',
  stageBannerTimer: 0,
  bossWarningTimer: 0,
  hp: 155,
  maxHp: 155,
  armor: 70,
  maxArmor: 70,
  mana: 200,
  maxMana: 200,
  gold: 30,
  soulGemsEarned: 0,
  floor: 1,
  maxFloors: 3,
  level: 1,
  xp: 0,
  xpToNext: 60,
  potions: 2,
  maxPotions: 4,
  kills: 0,
  enemiesRemaining: 0,
  portalOpen: true,
  roomLocked: false,
  damageDealt: 0,
  heroClass: 'knight',
  skinTier: 'default',
  petId: 'cat',
  petName: 'Chilly the Cat',
  activeWeapon: WEAPONS.broadsword,
  activeWeaponUpgrade: 0,
  secondaryWeapon: WEAPONS.pioneer_pistol,
  secondaryWeaponUpgrade: 0,
  statueBlessing: null,
  dashCooldownRatio: 0,
  skillCooldownRatio: 0,
  ultCooldownRatio: 0,
  weaponSkillCooldownRatio: 0,
  attackCooldownRatio: 0,
  attackProcCount: 0,
  tutorialStep: 0,
  comboCount: 0,
  currentWave: 1,
  maxWaves: 1,
  isInvulnerable: false,
  activeBoons: [],
  bossActive: false,
  bossName: '',
  bossHp: 0,
  bossMaxHp: 1,
  floorCleared: true,
  promptText: null,
  promptSubtext: null,
  minimapRooms: [],
};

const UPGRADE_DEFINITIONS: {
  key: keyof PermanentUpgrades;
  name: string;
  desc: string;
  bonusPerLevel: string;
  baseCost: number;
  accent: string;
}[] = [
  {
    key: 'hpLevel',
    name: 'Vitality Core (+HP)',
    desc: '+15 Max HP per level for all Heroes.',
    bonusPerLevel: '+15 Max HP / Lv',
    baseCost: 80,
    accent: '#f43f5e',
  },
  {
    key: 'armorLevel',
    name: 'Aegis Plating (+Shield)',
    desc: '+8 regenerating Shield per level.',
    bonusPerLevel: '+8 Shield / Lv',
    baseCost: 90,
    accent: '#94a3b8',
  },
  {
    key: 'manaLevel',
    name: 'Arcane Reservoir (+Mana)',
    desc: '+25 Max Mana per level for guns & spells.',
    bonusPerLevel: '+25 Max Mana / Lv',
    baseCost: 75,
    accent: '#38bdf8',
  },
  {
    key: 'dmgLevel',
    name: 'Weapon Mastery (+DMG)',
    desc: '+8% All Weapon & Skill Damage per level.',
    bonusPerLevel: '+8% DMG / Lv',
    baseCost: 110,
    accent: '#f59e0b',
  },
  {
    key: 'goldLevel',
    name: 'Merchant Vault (+Gold)',
    desc: '+20 starting Gold at the start of every run.',
    bonusPerLevel: '+20 Gold / Lv',
    baseCost: 65,
    accent: '#fde047',
  },
];

// ============================================================================
// MINI PIXEL PORTRAIT CANVAS (For 6-Hero Roster Bar & Weapon Icons)
// ============================================================================
function HeroMiniPortrait({
  heroId,
  skinTier,
  locked,
  raceCustom,
}: {
  heroId: HeroClassId;
  skinTier: SkinTier;
  locked: boolean;
  raceCustom?: RaceCustomization;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.imageSmoothingEnabled = false;
    const bank = getSpriteBank();
    ctx.save();
    ctx.translate(22, 36);
    ctx.scale(0.68, 0.68);
    drawCustomizedHero(
      ctx,
      bank,
      heroId,
      skinTier,
      0,
      raceCustom,
      0,
      locked
    );
    ctx.restore();
  }, [heroId, skinTier, locked, raceCustom]);

  return (
    <canvas
      ref={ref}
      width={44}
      height={40}
      className="w-11 h-10 shrink-0 pointer-events-none"
    />
  );
}

function WeaponMiniSprite({ weaponId }: { weaponId: WeaponId }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.imageSmoothingEnabled = false;
    const bank = getSpriteBank();
    const sprite = bank.weapons[weaponId];
    if (sprite) {
      ctx.drawImage(sprite, 4, 4, 40, 22);
    }
  }, [weaponId]);

  return (
    <canvas
      ref={ref}
      width={48}
      height={30}
      className="w-12 h-7.5 shrink-0 pointer-events-none"
    />
  );
}

function EnemyMiniSprite({ enemyType }: { enemyType: EnemyType }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const bank = getSpriteBank();
    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      const t = Math.max(0, (now - start) / 1000);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.imageSmoothingEnabled = false;
      const frames = bank.enemies[enemyType] || bank.enemies.goblin;
      const idx = Math.abs(Math.floor(t * 4)) % 2;
      const sp = frames[idx] || frames[0];
      if (sp) {
        const isBoss =
          enemyType === 'warden_boss' ||
          enemyType === 'cryo_boss' ||
          enemyType === 'inferno_boss';
        const scale = isBoss ? 1.55 : 2.1;
        ctx.save();
        ctx.translate(cvs.width / 2, cvs.height - 6);
        ctx.scale(scale, scale);
        ctx.drawImage(
          sp,
          Math.round(-sp.width / 2),
          Math.round(-sp.height)
        );
        ctx.restore();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [enemyType]);

  return (
    <canvas
      ref={ref}
      width={56}
      height={52}
      className="w-14 h-13 shrink-0 pointer-events-none"
    />
  );
}

const BESTIARY_ENTRIES: {
  type: EnemyType;
  name: string;
  role: string;
  biome: string;
  hp: number;
  dmg: number;
  desc: string;
  isBoss?: boolean;
  accent: string;
}[] = [
  {
    type: 'goblin',
    name: 'Goblin Raider',
    role: 'Swarm Melee',
    biome: '1-1 Obsidian Crypt',
    hp: 65,
    dmg: 14,
    desc: 'Fast melee raider that rushes heroes in packs with jagged daggers.',
    accent: '#4ade80',
  },
  {
    type: 'slime',
    name: 'Venom Slime',
    role: 'Acid Splitter',
    biome: '1-1 Obsidian Crypt',
    hp: 95,
    dmg: 16,
    desc: 'Corrosive dungeon ooze with high resilience and close-range lunges.',
    accent: '#a3e635',
  },
  {
    type: 'necro_mage',
    name: 'Void Warlock',
    role: 'Tri-Shot Caster',
    biome: 'All Floors',
    hp: 115,
    dmg: 22,
    desc: 'Teleports and unleashes 3-way spreads of dark arcane orbs.',
    accent: '#c084fc',
  },
  {
    type: 'golem',
    name: 'Ironclad Golem',
    role: 'Heavy Bruiser',
    biome: '1-2 Frostbite Cavern',
    hp: 185,
    dmg: 26,
    desc: 'Heavily armored vanguard that absorbs punishment and crushes shields.',
    accent: '#fb923c',
  },
  {
    type: 'warden_boss',
    name: 'Vorgath, Obsidian Warden',
    role: 'Floor 1-1 Boss',
    biome: '1-1 Obsidian Crypt',
    hp: 1450,
    dmg: 34,
    desc: 'Unleashes 12-way radial bullet hell rings and aimed 3-way void bursts.',
    isBoss: true,
    accent: '#f43f5e',
  },
  {
    type: 'cryo_boss',
    name: 'Glacius, Cryo Behemoth',
    role: 'Floor 1-2 Boss',
    biome: '1-2 Frostbite Cavern',
    hp: 1850,
    dmg: 38,
    desc: 'Fires 14-way Frost Novas and 5-way Chilling Ice Shards across the cavern.',
    isBoss: true,
    accent: '#38bdf8',
  },
  {
    type: 'inferno_boss',
    name: 'Ignis, Inferno Archdemon',
    role: 'Floor 1-3 Final Boss',
    biome: '1-3 Inferno Magma Core',
    hp: 2350,
    dmg: 44,
    desc: 'Commands 16-way Hellfire Rings and rapid 5-way Magma Barrages.',
    isBoss: true,
    accent: '#f97316',
  },
];

// ============================================================================
// CINEMATIC SPLASH DIORAMA CANVAS (Hero Deflecting Boss Bullets in Real Time)
// ============================================================================
function SplashDioramaCanvas({
  heroClass,
  skinTier,
  raceCustom,
  petId,
  deflectToastText,
}: {
  heroClass: HeroClassId;
  skinTier: SkinTier;
  raceCustom: RaceCustomization;
  petId: PetId;
  deflectToastText: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const bank = getSpriteBank();
    let rafId = 0;
    const startTime = performance.now();

    const renderLoop = (now: number) => {
      const t = Math.max(0, (now - startTime) / 1000);
      const w = cvs.width;
      const h = cvs.height;

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      // Dungeon floor bridge
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.72, 195, 36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Magic circle under battle
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.45;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -t * 30;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.72, 165, 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const frameIdx = Math.abs(Math.floor(t * 4.5)) % 2;
      const heroX = 112;
      const heroY = h * 0.68;
      const bossX = w - 108;
      const bossY = h * 0.68;

      // Companion Pet
      const petSprite = (bank.pets[petId] || bank.pets.cat)[frameIdx];
      if (petSprite) {
        const petBob = Math.abs(Math.sin(t * 7)) * 5;
        ctx.save();
        ctx.translate(heroX - 48, heroY + 4 - petBob);
        ctx.scale(2.1, 2.1);
        ctx.drawImage(
          petSprite,
          Math.round(-petSprite.width / 2),
          Math.round(-petSprite.height + 4)
        );
        ctx.restore();
      }

      // Customized Hero on Left
      const heroBob = Math.abs(Math.sin(t * 4.5)) * 3;
      ctx.save();
      ctx.translate(heroX, heroY - heroBob);
      ctx.scale(2.85, 2.85);
      drawCustomizedHero(
        ctx,
        bank,
        heroClass,
        skinTier,
        frameIdx,
        raceCustom,
        t,
        false
      );
      ctx.restore();

      // High-speed Alternating Katana / Excalibur Swing & Bullet Deflection cycle
      const cycle = t % 1.2;
      const isSwinging = cycle > 0.42 && cycle < 0.78;
      const swingProg = isSwinging ? (cycle - 0.42) / 0.36 : 0;
      const swingParity = Math.floor(t / 1.2) % 2 === 0 ? 1 : -1;

      const wSprite = bank.weapons.blood_katana || bank.weapons.excalibur;
      if (wSprite) {
        ctx.save();
        ctx.translate(heroX + 20, heroY - 28 - heroBob);
        const angle = isSwinging
          ? swingParity * (-1.15 + swingProg * 2.3)
          : -0.25 + Math.sin(t * 4) * 0.1;
        ctx.rotate(angle);
        ctx.scale(2.3, swingParity * 2.3);
        ctx.drawImage(
          wSprite,
          Math.round(-wSprite.width * 0.25),
          Math.round(-wSprite.height / 2)
        );
        ctx.restore();
      }

      // Draw Crescent Slash Arc + Deflect Spark
      if (isSwinging) {
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 7 * (1 - swingProg * 0.4);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(heroX + 14, heroY - 28, 46, -1.1, 1.0);
        ctx.stroke();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(heroX + 14, heroY - 28, 42, -0.85, 0.8);
        ctx.stroke();

        // Floating "⚡ DEFLECT!" toast
        ctx.font = "700 12px 'Chakra Petch', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde047';
        ctx.fillText(
          deflectToastText,
          heroX + 46,
          heroY - 68 - swingProg * 14
        );
        ctx.restore();
      }

      // Boss (Obsidian Warden) on Right
      const bossSprite =
        bank.enemies.warden_boss?.[frameIdx] ||
        bank.enemies.warden_boss?.[0];
      if (bossSprite) {
        const bossBob = Math.abs(Math.sin(t * 3.5)) * 4;
        ctx.save();
        ctx.translate(bossX, bossY - bossBob);
        ctx.scale(-2.6, 2.6);
        ctx.drawImage(
          bossSprite,
          Math.round(-bossSprite.width / 2),
          Math.round(-bossSprite.height + 6)
        );
        ctx.restore();
      }

      // Projectile flying from Boss -> Hero, then Deflecting back to Boss!
      const bulletX =
        cycle < 0.52
          ? bossX - 30 - (cycle / 0.52) * (bossX - heroX - 75)
          : heroX + 45 + ((cycle - 0.52) / 0.68) * (bossX - heroX - 65);
      const bulletY = heroY - 28 + Math.sin(t * 12) * 4;
      const isDeflected = cycle >= 0.52;

      ctx.save();
      ctx.fillStyle = isDeflected ? '#fde047' : '#fb7185';
      ctx.beginPath();
      ctx.arc(bulletX, bulletY, isDeflected ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bulletX, bulletY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [heroClass, skinTier, raceCustom, petId, deflectToastText]);

  return (
    <canvas
      ref={canvasRef}
      width={440}
      height={155}
      className="w-[280px] h-[98px] sm:w-[370px] sm:h-[130px] pointer-events-none select-none"
    />
  );
}

// ============================================================================
// INTERACTIVE LOBBY PEDESTAL STAGE CANVAS (Hero + Race + Skin + Weapon + Pet)
// ============================================================================
function LobbyStageCanvas({
  heroClass,
  skinTier,
  raceCustom,
  isLocked,
  petId,
  weaponId,
  lockedBannerText,
  onCyclePet,
}: {
  heroClass: HeroClassId;
  skinTier: SkinTier;
  raceCustom: RaceCustomization;
  isLocked: boolean;
  petId: PetId;
  weaponId: WeaponId;
  lockedBannerText: string;
  onCyclePet: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swingTriggerRef = useRef<number>(0);
  const swingParityRef = useRef<1 | -1>(1);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const bank = getSpriteBank();
    let rafId = 0;
    const startTime = performance.now();

    const sparks = Array.from({ length: 18 }, (_, i) => ({
      x: 40 + ((i * 37) % 240),
      y: 30 + ((i * 53) % 160),
      vy: 14 + (i % 5) * 6,
      size: 2 + (i % 3),
      phase: i * 0.7,
    }));

    const renderLoop = (now: number) => {
      const t = Math.max(0, (now - startTime) / 1000);
      const w = cvs.width;
      const h = cvs.height;

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      const cx = w / 2;
      const cy = h * 0.68;

      const heroCfg = HERO_CLASSES[heroClass] || HERO_CLASSES.knight;
      const skinCfg = heroCfg.skins[skinTier] || heroCfg.skins.default;
      const primaryGlow = isLocked
        ? '#64748b'
        : skinCfg.auraColor || heroCfg.accentColor;

      // 1. Background Dungeon Arch & Flickering Torches
      const drawTorch = (tx: number, ty: number, offset: number) => {
        const flick = Math.sin(t * 14 + offset) * 2.5;
        ctx.fillStyle = '#334155';
        ctx.fillRect(tx - 4, ty, 8, 18);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx - 3, ty + 2, 6, 14);
        const grad = ctx.createRadialGradient(
          tx,
          ty - 6,
          2,
          tx,
          ty - 6,
          Math.max(10, 36 + flick * 2)
        );
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.22)');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tx, ty - 6, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(tx - 6, ty - 14 + flick * 0.5, 12, 12);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(tx - 4, ty - 11 + flick * 0.4, 8, 9);
        ctx.fillStyle = '#fef9c3';
        ctx.fillRect(tx - 2, ty - 8 + flick * 0.3, 4, 5);
      };

      drawTorch(44, 58, 0);
      drawTorch(w - 44, 58, 2.2);

      // 2. Stone Pedestal & Arcane Rune Ring
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 88, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 78, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 72, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = primaryGlow;
      ctx.lineWidth = 2;
      ctx.globalAlpha = isLocked ? 0.35 : 0.78;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -t * 24;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 60, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Legendary Skin Halo
      if (!isLocked && skinTier === 'legendary') {
        ctx.save();
        ctx.strokeStyle = skinCfg.auraColor || '#fde047';
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.7 + Math.sin(t * 6) * 0.2;
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = t * 32;
        ctx.beginPath();
        ctx.arc(cx, cy - 38, 46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Floating Ember Particles
      for (const sp of sparks) {
        const py = ((sp.y - t * sp.vy) % 175) + 175;
        const curY = py % 175;
        const curX = sp.x + Math.sin(t * 2.5 + sp.phase) * 8;
        ctx.fillStyle =
          skinTier === 'legendary' && !isLocked
            ? skinCfg.auraColor || '#fde047'
            : '#f97316';
        ctx.globalAlpha = Math.min(1, curY / 40) * 0.75;
        ctx.fillRect(Math.round(curX), Math.round(curY), sp.size, sp.size);
      }
      ctx.globalAlpha = 1;

      // 5. Companion Pet Orbiting near Hero's Feet
      const petAngle = t * 1.15;
      const petX = cx + Math.cos(petAngle) * 52;
      const petY = cy + 8 + Math.sin(petAngle) * 11;
      const petHop = Math.abs(Math.sin(t * 8.5)) * 7;
      const petFrames = bank.pets[petId] || bank.pets.cat;
      const petFrameIdx = Math.abs(Math.floor(t * 6)) % 2;
      const petSprite = petFrames[petFrameIdx] || petFrames[0];
      const petFacing = Math.sin(petAngle) >= 0 ? -1 : 1;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(petX, petY + 4, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (petSprite) {
        ctx.save();
        ctx.translate(Math.round(petX), Math.round(petY - petHop));
        ctx.scale(petFacing * 2.2, 2.2);
        ctx.drawImage(
          petSprite,
          Math.round(-petSprite.width / 2),
          Math.round(-petSprite.height + 4)
        );
        ctx.restore();
      }

      // 6. Customized Hero Sprite (with Racial Wings, Horns, Ears, Skin Tone & Eye Glow)
      const frameIdx = Math.abs(Math.floor(t * 3.2)) % 2;
      const breathScaleY = 1 + Math.sin(t * 6.4) * 0.035;
      const breathScaleX = 1 - Math.sin(t * 6.4) * 0.025;
      const heroBob = Math.abs(Math.sin(t * 3.2)) * 3;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      const heroScale = 3.1;
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy - heroBob));
      ctx.scale(heroScale * breathScaleX, heroScale * breathScaleY);
      drawCustomizedHero(
        ctx,
        bank,
        heroClass,
        skinTier,
        frameIdx,
        raceCustom,
        t,
        isLocked
      );
      ctx.restore();

      // 7. Equipped Weapon & Alternating High-Speed Slash Animation
      if (!isLocked) {
        const wSprite = bank.weapons[weaponId];
        const autoSwingCycle = t % 2.6;
        const manualElapsed = (now - swingTriggerRef.current) / 1000;
        const isSwinging = autoSwingCycle < 0.28 || manualElapsed < 0.28;
        const swingProg =
          manualElapsed < 0.28
            ? manualElapsed / 0.28
            : autoSwingCycle < 0.28
            ? autoSwingCycle / 0.28
            : 0;

        const parity =
          manualElapsed < 0.28
            ? swingParityRef.current
            : Math.floor(t / 2.6) % 2 === 0
            ? 1
            : -1;

        const swingAngle = isSwinging
          ? parity * (-1.15 + Math.sin(swingProg * Math.PI) * 2.25)
          : Math.sin(t * 3.2) * 0.12 - 0.15;

        if (wSprite) {
          ctx.save();
          ctx.translate(Math.round(cx + 22), Math.round(cy - 34 - heroBob));
          ctx.rotate(swingAngle);
          ctx.scale(2.45, parity * 2.45);
          ctx.drawImage(
            wSprite,
            Math.round(-wSprite.width * 0.28),
            Math.round(-wSprite.height / 2)
          );
          ctx.restore();
        }

        if (isSwinging) {
          ctx.save();
          ctx.strokeStyle = WEAPONS[weaponId]?.canDeflect
            ? '#fde047'
            : primaryGlow;
          ctx.lineWidth = 6.5 * (1 - swingProg * 0.45);
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.88 * (1 - swingProg * 0.35);
          ctx.beginPath();
          ctx.arc(cx + 12, cy - 34, 48, -1.1, 0.95);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + 12, cy - 34, 44, -0.9, 0.75);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        ctx.save();
        ctx.font = "700 12px 'Chakra Petch', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde047';
        ctx.fillText(lockedBannerText, cx, cy - 88);
        ctx.restore();
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [
    heroClass,
    skinTier,
    raceCustom,
    isLocked,
    petId,
    weaponId,
    lockedBannerText,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={200}
      onClick={() => {
        swingTriggerRef.current = performance.now();
        swingParityRef.current = swingParityRef.current === 1 ? -1 : 1;
        sound.playSlash(true);
        onCyclePet();
      }}
      className="w-[225px] h-[140px] sm:w-[275px] sm:h-[172px] cursor-pointer select-none"
    />
  );
}

// ============================================================================
// LIVE RACIAL CUSTOMIZER PREVIEW CANVAS (For Race Studio Modal)
// ============================================================================
function RacePreviewCanvas({
  heroClass,
  skinTier,
  raceCustom,
}: {
  heroClass: HeroClassId;
  skinTier: SkinTier;
  raceCustom: RaceCustomization;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const bank = getSpriteBank();
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.imageSmoothingEnabled = false;

      const cx = cvs.width / 2;
      const cy = cvs.height * 0.76;

      // Pedestal
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = RACES[raceCustom.raceId]?.accent || '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 48, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const frameIdx = Math.abs(Math.floor(t * 3.5)) % 2;
      const bob = Math.abs(Math.sin(t * 3.5)) * 3;
      ctx.save();
      ctx.translate(cx, cy - bob);
      ctx.scale(2.85, 2.85);
      drawCustomizedHero(
        ctx,
        bank,
        heroClass,
        skinTier,
        frameIdx,
        raceCustom,
        t,
        false
      );
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [heroClass, skinTier, raceCustom]);

  return (
    <canvas
      ref={ref}
      width={180}
      height={160}
      className="w-[155px] h-[138px] sm:w-[175px] sm:h-[155px] mx-auto pointer-events-none"
    />
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<IsometricGameEngine | null>(null);
  const dpadRef = useRef<HTMLDivElement | null>(null);
  const dpadPointerId = useRef<number | null>(null);

  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const [gameState, setGameState] = useState<GameState>('SPLASH_TITLE');
  const [selectedClass, setSelectedClass] = useState<HeroClassId>('knight');
  const [previewSkinTier, setPreviewSkinTier] = useState<SkinTier>('default');
  const [selectedPet, setSelectedPet] = useState<PetId>(
    () => loadProfile().selectedPetId || 'cat'
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyId>('normal');
  const [selectedGameMode, setSelectedGameMode] =
    useState<GameModeId>('CAMPAIGN');

  const [activeModal, setActiveModal] = useState<
    | 'NONE'
    | 'SHOP'
    | 'GACHA'
    | 'QUESTS'
    | 'AVATAR'
    | 'SETTINGS'
    | 'TUTORIAL_GUIDE'
    | 'RACE_STUDIO'
    | 'MUSIC_STUDIO'
    | 'CODEX'
  >('NONE');
  const [shopTab, setShopTab] = useState<'ARMORY' | 'UPGRADES'>('ARMORY');
  const [codexTab, setCodexTab] = useState<
    'WEAPONS' | 'BESTIARY' | 'ACHIEVEMENTS'
  >('WEAPONS');
  const [tutorialGuideTab, setTutorialGuideTab] = useState<
    'CONTROLS' | 'WEAPONS' | 'HEROES_FORGE' | 'ECONOMY'
  >('CONTROLS');

  // Full Song & AI Music Studio State
  const [musicStyle, setMusicStyle] = useState<MusicStyle>('heroic_minor');
  const [musicBpm, setMusicBpm] = useState<number>(138);
  const [musicChannels, setMusicChannels] = useState({
    lead: true,
    arp: true,
    bass: true,
    drums: true,
  });
  const [generatedTrackLabel, setGeneratedTrackLabel] = useState<string>(
    'Khúc Khải Hoàn Hắc Thạch (Full Song)'
  );
  const [aiSongPrompt, setAiSongPrompt] = useState<string>(
    'Bài hát chiến đấu Samurai hào hùng có điệp khúc bùng nổ'
  );
  const [isGeneratingSong, setIsGeneratingSong] = useState<boolean>(false);
  const [songStatus, setSongStatus] = useState(() =>
    sound.getCurrentSongStatus()
  );
  const [minimapCollapsed, setMinimapCollapsed] = useState<boolean>(false);
  const [cameraZoomPct, setCameraZoomPct] = useState<number>(86);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSongStatus(sound.getCurrentSongStatus());
    }, 350);
    return () => window.clearInterval(timer);
  }, []);

  const [gachaState, setGachaState] = useState<'IDLE' | 'SHAKING' | 'REVEALED'>(
    'IDLE'
  );
  const [gachaReward, setGachaReward] = useState<{
    type: 'skin' | 'weapon' | 'gems';
    title: string;
    subtitle: string;
    accent: string;
  } | null>(null);

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [boonChoices, setBoonChoices] = useState<BoonOption[]>([]);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Current active localization dictionary
  const t = I18N[settings.language] || I18N.vi;

  // Sync profile & settings changes to localStorage + GameEngine
  const updateAndSaveProfile = (
    updater: (prev: PlayerProfile) => PlayerProfile
  ) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveProfile(next);
      engineRef.current?.updateProfile(next);
      return next;
    });
  };

  const updateAndSaveSettings = (
    updater: (prev: GameSettings) => GameSettings
  ) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveSettings(next);
      engineRef.current?.updateSettings(next);
      return next;
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const initialProf = loadProfile();
    const initialSet = loadSettings();
    sound.setMuted(initialSet.muted);
    sound.setBgmMuted(initialSet.bgmMuted);

    const engine = new IsometricGameEngine(
      canvasRef.current,
      (newState) => setGameState(newState),
      (newHud) => setHud(newHud),
      (choices) => setBoonChoices(choices),
      (
        gemsDelta,
        killsDelta = 0,
        runWon = false,
        consumedPreRun = false,
        meta
      ) => {
        setProfile((prev) => {
          const updatedQuests = prev.dailyQuests.map((q) => {
            if (q.id === 'q_slay_25' && killsDelta > 0) {
              return {
                ...q,
                progress: Math.min(q.target, q.progress + killsDelta),
              };
            }
            if (q.id === 'q_clear_floors' && gemsDelta >= 10) {
              return {
                ...q,
                progress: Math.min(q.target, q.progress + 1),
              };
            }
            if (q.id === 'q_open_chest' && meta?.chestOpened) {
              return {
                ...q,
                progress: Math.min(q.target, q.progress + 1),
              };
            }
            return q;
          });

          const next: PlayerProfile = {
            ...prev,
            soulGems: prev.soulGems + gemsDelta,
            totalKills: prev.totalKills + killsDelta,
            runsCompleted: prev.runsCompleted + (runWon ? 1 : 0),
            bossesDefeated:
              (prev.bossesDefeated || 0) + (meta?.bossKilled ? 1 : 0),
            bestEndlessWave: Math.max(
              prev.bestEndlessWave || 0,
              meta?.endlessWave || 0
            ),
            maxWeaponUpgradeReached: Math.max(
              prev.maxWeaponUpgradeReached || 0,
              meta?.maxUpgradeLevel || 0
            ),
            chestsOpened:
              (prev.chestsOpened || 0) + (meta?.chestOpened ? 1 : 0),
            preRunWeapon: consumedPreRun ? null : prev.preRunWeapon,
            preRunPotion: consumedPreRun ? false : prev.preRunPotion,
            dailyQuests: updatedQuests,
          };
          saveProfile(next);
          engine.updateProfile(next);
          return next;
        });
      }
    );
    engine.updateProfile(initialProf);
    engine.updateSettings(initialSet);
    if (initialProf.selectedPetId) {
      engine.selectPet(initialProf.selectedPetId);
    }
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Switch Language
  const handleSelectLanguage = (lang: LanguageCode) => {
    sound.playUiClick(true);
    updateAndSaveSettings((prev) => ({
      ...prev,
      language: lang,
    }));
  };

  // Press Start on Cinematic Title Screen -> Enter Main Lobby & Start 8-Bit BGM
  const handlePressStart = (openRaceStudio: boolean = false) => {
    sound.playChing();
    sound.startBgm('lobby');
    engineRef.current?.setGameState('TITLE_MENU');
    if (openRaceStudio) {
      setActiveModal('RACE_STUDIO');
    }
  };

  // Select Hero Class in Lobby
  const handleSelectClass = (cls: HeroClassId) => {
    sound.playUiClick(true);
    setSelectedClass(cls);
    const savedSkin = profile.selectedSkins?.[cls] || 'default';
    setPreviewSkinTier(savedSkin);
    if (profile.unlockedHeroes.includes(cls)) {
      engineRef.current?.selectHeroClass(cls);
      engineRef.current?.selectSkin(savedSkin);
    }
  };

  // Unlock Locked Hero Class with Soul Gems
  const handleUnlockHero = (cls: HeroClassId) => {
    const cfg = HERO_CLASSES[cls];
    if (profile.unlockedHeroes.includes(cls)) return;
    if (profile.soulGems < cfg.unlockCost) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cfg.unlockCost,
      unlockedHeroes: [...prev.unlockedHeroes, cls],
    }));
    engineRef.current?.selectHeroClass(cls);
  };

  // Cycle Skin [ < ] and [ > ] beneath Hero Pedestal
  const handleCycleSkin = (dir: -1 | 1) => {
    sound.playUiClick(true);
    const idx = SKIN_TIERS.indexOf(previewSkinTier);
    const nextTier =
      SKIN_TIERS[(idx + dir + SKIN_TIERS.length) % SKIN_TIERS.length];
    setPreviewSkinTier(nextTier);

    const ownedSkins = profile.unlockedSkins?.[selectedClass] || ['default'];
    if (ownedSkins.includes(nextTier)) {
      updateAndSaveProfile((prev) => ({
        ...prev,
        selectedSkins: {
          ...prev.selectedSkins,
          [selectedClass]: nextTier,
        },
      }));
      engineRef.current?.selectSkin(nextTier);
    }
  };

  // Unlock Skin Tier with Soul Gems
  const handleUnlockSkin = (cls: HeroClassId, tier: SkinTier) => {
    const skinCfg = HERO_CLASSES[cls].skins[tier];
    const owned = profile.unlockedSkins?.[cls] || ['default'];
    if (owned.includes(tier)) return;
    if (profile.soulGems < skinCfg.cost) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - skinCfg.cost,
      unlockedSkins: {
        ...prev.unlockedSkins,
        [cls]: [...(prev.unlockedSkins?.[cls] || ['default']), tier],
      },
      selectedSkins: {
        ...prev.selectedSkins,
        [cls]: tier,
      },
    }));
    engineRef.current?.selectSkin(tier);
  };

  // Update Race Preset or Modular Appearance Trait
  const handleSelectRacePreset = (raceId: RaceId) => {
    sound.playUiClick(true);
    const preset = RACES[raceId].defaultCustom;
    updateAndSaveProfile((prev) => ({
      ...prev,
      raceCustom: {
        raceId,
        ...preset,
      },
    }));
  };

  const handleUpdateRaceTrait = (patch: Partial<RaceCustomization>) => {
    sound.playUiClick(true);
    updateAndSaveProfile((prev) => ({
      ...prev,
      raceCustom: {
        ...prev.raceCustom,
        ...patch,
      },
    }));
  };

  const handleRandomizeRaceCustom = () => {
    sound.playChing();
    const raceIds = Object.keys(RACES) as RaceId[];
    const randomRace = raceIds[Math.floor(Math.random() * raceIds.length)];
    const randomSkin =
      SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].color;
    const randomHorn =
      HORN_STYLES[Math.floor(Math.random() * HORN_STYLES.length)];
    const randomWing =
      WING_STYLES[Math.floor(Math.random() * WING_STYLES.length)];
    const randomEar = EAR_STYLES[Math.floor(Math.random() * EAR_STYLES.length)];
    const randomEye =
      EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].color;

    updateAndSaveProfile((prev) => ({
      ...prev,
      raceCustom: {
        raceId: randomRace,
        skinColor: randomSkin,
        hornStyle: randomHorn,
        wingStyle: randomWing,
        earStyle: randomEar,
        eyeColor: randomEye,
      },
    }));
  };

  const handleSelectPet = (petId: PetId) => {
    sound.playUiClick(true);
    setSelectedPet(petId);
    updateAndSaveProfile((prev) => ({
      ...prev,
      selectedPetId: petId,
    }));
    engineRef.current?.selectPet(petId);
  };

  const handleSelectDifficulty = (diff: DifficultyId) => {
    sound.playUiClick(true);
    setSelectedDifficulty(diff);
    engineRef.current?.selectDifficulty(diff);
  };

  const handleSelectGameMode = (mode: GameModeId) => {
    sound.playUiClick(true);
    setSelectedGameMode(mode);
    engineRef.current?.selectGameMode(mode);
  };

  const handleClaimAchievement = (achId: string) => {
    const ach = ACHIEVEMENT_LIST.find((a) => a.id === achId);
    if (!ach) return;
    if (profile.claimedAchievements?.includes(achId)) return;
    if (ach.getValue(profile) < ach.target) return;

    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems + ach.rewardGems,
      claimedAchievements: [...(prev.claimedAchievements || []), achId],
    }));
  };

  const handleEnterLivingRoom = () => {
    sound.playUiClick(true);
    const playClass = profile.unlockedHeroes.includes(selectedClass)
      ? selectedClass
      : 'knight';
    setActiveModal('NONE');
    engineRef.current?.selectGameMode(selectedGameMode);
    engineRef.current?.enterLivingRoom(playClass, selectedDifficulty);
  };

  const handleStartDungeonDirect = () => {
    sound.playUiClick(true);
    const playClass = profile.unlockedHeroes.includes(selectedClass)
      ? selectedClass
      : 'knight';
    setActiveModal('NONE');
    engineRef.current?.selectGameMode(selectedGameMode);
    engineRef.current?.startNewRun(playClass, selectedDifficulty, selectedGameMode);
  };

  const handleToggleMute = () => {
    updateAndSaveSettings((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
  };

  const handleToggleBgmMute = () => {
    updateAndSaveSettings((prev) => ({
      ...prev,
      bgmMuted: !prev.bgmMuted,
    }));
  };

  // Permanent Stat Upgrade
  const handleBuyUpgrade = (
    key: keyof PermanentUpgrades,
    baseCost: number
  ) => {
    const currentLv = profile.upgrades[key];
    if (currentLv >= 5) return;
    const cost = baseCost + currentLv * 60;
    if (profile.soulGems < cost) {
      sound.playUiClick(false);
      return;
    }

    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      upgrades: {
        ...prev.upgrades,
        [key]: prev.upgrades[key] + 1,
      },
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_upgrade_stat'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));
  };

  // Blacksmith Armory: Craft/Unlock Weapon or Equip as Starter Weapon
  const handleUnlockOrEquipWeapon = (wpnId: WeaponId) => {
    const wpn = WEAPONS[wpnId];
    const isUnlocked = profile.unlockedWeapons.includes(wpnId);

    if (isUnlocked) {
      sound.playWeaponSwitch();
      updateAndSaveProfile((prev) => ({
        ...prev,
        selectedStarterWeapon:
          prev.selectedStarterWeapon === wpnId ? null : wpnId,
        preRunWeapon: prev.selectedStarterWeapon === wpnId ? null : wpnId,
      }));
      return;
    }

    if (profile.soulGems < wpn.shopGemsCost) {
      sound.playUiClick(false);
      return;
    }

    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - wpn.shopGemsCost,
      unlockedWeapons: [...prev.unlockedWeapons, wpnId],
      selectedStarterWeapon: wpnId,
      preRunWeapon: wpnId,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_open_chest'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));
  };

  const handleBuyPreRunPotion = () => {
    const cost = 50;
    if (profile.preRunPotion || profile.soulGems < cost) return;
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      preRunPotion: true,
    }));
  };

  // Mystery Chest Gacha Roll (120 Gems)
  const handleRollGachaChest = () => {
    const CHEST_COST = 120;
    if (gachaState === 'SHAKING' || profile.soulGems < CHEST_COST) {
      sound.playUiClick(false);
      return;
    }

    sound.playChestRoll();
    setGachaState('SHAKING');
    setGachaReward(null);

    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - CHEST_COST,
      chestsOpened: (prev.chestsOpened || 0) + 1,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_open_chest'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));

    setTimeout(() => {
      sound.playChing();
      const unownedSkins: { cls: HeroClassId; tier: SkinTier }[] = [];
      (Object.keys(HERO_CLASSES) as HeroClassId[]).forEach((cls) => {
        (['rare', 'legendary'] as SkinTier[]).forEach((tier) => {
          if (!profile.unlockedSkins?.[cls]?.includes(tier)) {
            unownedSkins.push({ cls, tier });
          }
        });
      });

      const unownedWeapons = (Object.keys(WEAPONS) as WeaponId[]).filter(
        (wId) => !profile.unlockedWeapons.includes(wId)
      );

      const roll = Math.random();
      if (roll < 0.45 && unownedSkins.length > 0) {
        const pick =
          unownedSkins[Math.floor(Math.random() * unownedSkins.length)];
        const skinMeta = HERO_CLASSES[pick.cls].skins[pick.tier];
        updateAndSaveProfile((prev) => ({
          ...prev,
          unlockedSkins: {
            ...prev.unlockedSkins,
            [pick.cls]: [
              ...(prev.unlockedSkins?.[pick.cls] || ['default']),
              pick.tier,
            ],
          },
          selectedSkins: {
            ...prev.selectedSkins,
            [pick.cls]: pick.tier,
          },
        }));
        if (pick.cls === selectedClass) {
          setPreviewSkinTier(pick.tier);
        }
        setGachaReward({
          type: 'skin',
          title: `SKIN: ${skinMeta.name.toUpperCase()}`,
          subtitle: `${t.heroes[pick.cls].name} (${skinMeta.badge})`,
          accent: pick.tier === 'legendary' ? '#fde047' : '#38bdf8',
        });
      } else if (roll < 0.82 && unownedWeapons.length > 0) {
        const pickWpn =
          unownedWeapons[Math.floor(Math.random() * unownedWeapons.length)];
        const wMeta = WEAPONS[pickWpn];
        updateAndSaveProfile((prev) => ({
          ...prev,
          unlockedWeapons: [...prev.unlockedWeapons, pickWpn],
          selectedStarterWeapon: pickWpn,
          preRunWeapon: pickWpn,
        }));
        setGachaReward({
          type: 'weapon',
          title: `${t.weapons[pickWpn].name.toUpperCase()}`,
          subtitle: `${wMeta.rarity} · DMG ${wMeta.damage}`,
          accent: wMeta.rarityColor,
        });
      } else {
        const jackpotGems = 160 + Math.floor(Math.random() * 90);
        updateAndSaveProfile((prev) => ({
          ...prev,
          soulGems: prev.soulGems + jackpotGems,
        }));
        setGachaReward({
          type: 'gems',
          title: `JACKPOT: +${jackpotGems} 💎`,
          subtitle: 'Soul Gems Bonus!',
          accent: '#38bdf8',
        });
      }

      setGachaState('REVEALED');
    }, 880);
  };

  // Claim Daily Quest Reward
  const handleClaimQuest = (questId: string) => {
    const q = profile.dailyQuests.find((item) => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems + q.rewardGems,
      dailyQuests: prev.dailyQuests.map((item) =>
        item.id === questId ? { ...item, claimed: true } : item
      ),
    }));
  };

  // One-Time Starter Pack (+500 Soul Gems - Claimable Once Only)
  const handleClaimStarterPack = () => {
    if (profile.starterPackClaimed) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems + 500,
      starterPackClaimed: true,
    }));
  };

  // Daily Login Check-In Reward (Once per calendar day)
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const canClaimDailyLogin = profile.lastDailyClaimDate !== todayDateStr;
  const nextDailyStreak = (profile.dailyStreak || 0) + 1;
  const dailyLoginGemReward =
    150 + Math.min(4, (nextDailyStreak - 1) % 5) * 35;

  const handleClaimDailyLogin = () => {
    if (!canClaimDailyLogin) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => {
      const nextStreak = (prev.dailyStreak || 0) + 1;
      const reward = 150 + Math.min(4, (nextStreak - 1) % 5) * 35;
      return {
        ...prev,
        soulGems: prev.soulGems + reward,
        lastDailyClaimDate: todayDateStr,
        dailyStreak: nextStreak,
      };
    });
  };

  // Complete Interactive Living Room Tutorial (+150 Soul Gems Once)
  const handleCompleteTutorial = () => {
    sound.playChing();
    engineRef.current?.setTutorialStep(5);
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.tutorialCompleted ? prev.soulGems : prev.soulGems + 150,
      tutorialCompleted: true,
    }));
  };

  // Multi-touch Virtual D-Pad / Analog Stick handlers
  const updateJoystickFromEvent = (clientX: number, clientY: number) => {
    if (!dpadRef.current) return;
    const rect = dpadRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRadius = rect.width * 0.36;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      setKnobOffset({ x: 0, y: 0 });
      engineRef.current?.setVirtualStick(0, 0);
      return;
    }

    const clamped = Math.min(dist, maxRadius);
    const nx = dx / dist;
    const ny = dy / dist;

    setKnobOffset({ x: nx * clamped, y: ny * clamped });
    engineRef.current?.setVirtualStick(nx, ny);
  };

  const handleDpadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dpadPointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoystickFromEvent(e.clientX, e.clientY);
  };

  const handleDpadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dpadPointerId.current !== e.pointerId) return;
    e.stopPropagation();
    updateJoystickFromEvent(e.clientX, e.clientY);
  };

  const handleDpadPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dpadPointerId.current !== e.pointerId) return;
    e.stopPropagation();
    dpadPointerId.current = null;
    setKnobOffset({ x: 0, y: 0 });
    engineRef.current?.setVirtualStick(0, 0);
  };

  const classCfg = HERO_CLASSES[selectedClass];
  const localizedHero = t.heroes[selectedClass];
  const raceCfg = RACES[profile.raceCustom.raceId] || RACES.human;
  const localizedRace = t.races[profile.raceCustom.raceId] || t.races.human;

  const isHeroLocked = !profile.unlockedHeroes.includes(selectedClass);
  const currentSkinCfg = classCfg.skins[previewSkinTier];
  const isSkinOwned = (
    profile.unlockedSkins?.[selectedClass] || ['default']
  ).includes(previewSkinTier);

  const activeStarterWeaponId =
    profile.selectedStarterWeapon ||
    profile.preRunWeapon ||
    classCfg.starterWeaponId;

  const claimableQuestsCount =
    profile.dailyQuests.filter((q) => !q.claimed && q.progress >= q.target)
      .length +
    (!profile.starterPackClaimed ? 1 : 0) +
    (canClaimDailyLogin ? 1 : 0);

  const claimableAchievementsCount = ACHIEVEMENT_LIST.filter(
    (ach) =>
      !profile.claimedAchievements?.includes(ach.id) &&
      ach.getValue(profile) >= ach.target
  ).length;

  const currentAvatarInfo =
    AVATAR_LIST.find((a) => a.id === profile.avatarId) || AVATAR_LIST[0];
  const isLargeControls = settings.controlScale === 'large';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06080d] select-none">
      {/* Isolated 60fps 2.5D Pixel-Art Dungeon Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
      />

      {/* =====================================================================
          0. CINEMATIC LANDSCAPE-FIRST SPLASH SCREEN ("PRESS START" + DIORAMA)
         ===================================================================== */}
      {gameState === 'SPLASH_TITLE' && (
        <div className="absolute inset-0 z-20 flex flex-col justify-between items-center px-3 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-b from-[#06080d]/95 via-[#06080d]/82 to-[#06080d]/95 overflow-hidden">
          {/* Slim Top Bar: Brand + 4-Language Switcher + Full Song BGM/SFX Toggle */}
          <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#090b10]/95 border border-slate-800 text-xs font-pixel text-amber-300">
              <span>⚔ OBSIDIAN SOUL KNIGHTS</span>
              <span className="hidden sm:inline text-slate-500">·</span>
              <span className="hidden sm:inline text-[11px] text-emerald-400">
                ♫ {songStatus.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-[#090b10]/95 p-1 rounded-xl border border-slate-800">
                {LANG_OPTIONS.map((lang) => {
                  const active = settings.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`px-2 py-0.5 rounded-lg font-pixel text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.short}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleToggleBgmMute}
                className={`btn-3d px-2.5 py-1 rounded-xl font-pixel text-[11px] cursor-pointer ${
                  !settings.bgmMuted ? 'btn-3d-cyan' : 'btn-3d-slate'
                }`}
              >
                🎵 NHẠC {!settings.bgmMuted ? t.onLabel : t.offLabel}
              </button>

              <button
                onClick={handleToggleMute}
                className="btn-3d btn-3d-slate p-1.5 rounded-xl flex items-center justify-center cursor-pointer"
                aria-label="Toggle Sound"
              >
                <SoundIcon muted={settings.muted} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Centerpiece: 2-Column Landscape Grid (Fits 360px+ Mobile Landscape with Zero Overflow) */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-center my-auto">
            {/* Left Column (7 Cols): Title Lockup + Live Deflection Diorama */}
            <div className="md:col-span-7 flex flex-col items-center text-center">
              <div className="w-full max-w-[240px] sm:max-w-[320px] drop-shadow-[0_0_24px_rgba(245,158,11,0.3)] -mb-1">
                <ObsidianTitleLockup />
              </div>

              <div className="text-[11px] sm:text-xs font-pixel text-amber-300/90 tracking-wider mb-1.5">
                {t.splashSubtitle}
              </div>

              <div className="relative rounded-2xl bg-[#090b10]/90 border-2 border-slate-800/90 px-3 py-1.5 shadow-2xl">
                <SplashDioramaCanvas
                  heroClass={selectedClass}
                  skinTier={previewSkinTier}
                  raceCustom={profile.raceCustom}
                  petId={selectedPet}
                  deflectToastText={t.deflectToast}
                />
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono-tabular text-slate-300 mt-0.5">
                  <span
                    className="font-bold"
                    style={{ color: raceCfg.accent }}
                  >
                    [{localizedRace.name}]
                  </span>
                  <span>·</span>
                  <span className="text-amber-300 font-bold">
                    {localizedHero.name}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400">
                    {localizedRace.bonusDesc}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols): Action Launch Deck & Song Preview */}
            <div className="md:col-span-5 flex flex-col gap-2.5 w-full max-w-md mx-auto">
              <div className="p-2.5 rounded-2xl bg-[#090b10]/90 border border-slate-800 text-left">
                <div className="flex items-center justify-between text-[11px] font-pixel text-purple-300">
                  <span>♫ BÀI HÁT CHỦ ĐỀ (5 ĐOẠN)</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-amber-300 text-[10px]">
                    {songStatus.section}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 truncate mt-0.5">
                  {songStatus.title}
                </div>
                <div className="text-[11px] text-emerald-300/90 italic truncate mt-0.5">
                  {songStatus.lyricLine}
                </div>
              </div>

              <button
                onClick={() => handlePressStart(false)}
                className="btn-3d btn-3d-emerald w-full min-h-[48px] py-3 px-5 rounded-2xl font-pixel text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_26px_rgba(16,185,129,0.35)]"
              >
                <span>{t.pressStart}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sound.playChing();
                    handleEnterLivingRoom();
                  }}
                  className="btn-3d btn-3d-amber min-h-[42px] py-2 px-3 rounded-xl font-pixel text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🏰 PHÒNG CHỜ SỐNG</span>
                </button>

                <button
                  onClick={() => handlePressStart(true)}
                  className="btn-3d btn-3d-purple min-h-[42px] py-2 px-3 rounded-xl font-pixel text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.customizeHeroBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Slim Bottom Version & Audio Notice */}
          <div className="w-full max-w-6xl flex items-center justify-between text-[11px] font-mono-tabular text-slate-400">
            <span className="font-pixel">{t.versionTag}</span>
            <span className="truncate hidden sm:inline">{t.soundHint}</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          1. COMPACT LANDSCAPE LOBBY MAIN MENU (Soul Knight Style - No Clutter)
         ===================================================================== */}
      {gameState === 'TITLE_MENU' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-b from-[#06080d]/90 via-[#06080d]/55 to-[#06080d]/95 overflow-y-auto">
          {/* ================= SLIM LANDSCAPE TOP BAR ================= */}
          <div className="relative z-10 w-full max-w-6xl flex flex-wrap items-center justify-between gap-1.5 pointer-events-auto">
            {/* Zone 1 (Left): Player Profile Card */}
            <button
              onClick={() => {
                sound.playUiClick(true);
                setActiveModal('AVATAR');
              }}
              className="btn-3d btn-3d-slate flex items-center gap-2 px-2.5 py-1 rounded-xl cursor-pointer"
            >
              <PixelAvatarGraphic
                avatarId={profile.avatarId}
                className="w-7 h-7 rounded-lg border border-slate-600 shrink-0"
              />
              <div className="text-left">
                <div className="text-xs font-pixel text-amber-300 leading-tight">
                  {profile.playerName}
                </div>
                <div className="text-[10px] font-mono-tabular text-slate-300">
                  {localizedRace.name} · ☠ {profile.totalKills}
                </div>
              </div>
            </button>

            {/* Zone 2 (Center): 3 Game Modes + Difficulty Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <div className="flex items-center gap-1 bg-[#090b10]/95 p-0.5 rounded-xl border border-slate-800">
                {(
                  [
                    { id: 'CAMPAIGN', label: '🏰 VƯỢT ẢI', accent: '#38bdf8' },
                    { id: 'BOSS_RUSH', label: '💀 SĂN BOSS', accent: '#f43f5e' },
                    { id: 'ENDLESS', label: '♾️ VÔ TẬN', accent: '#c084fc' },
                  ] as { id: GameModeId; label: string; accent: string }[]
                ).map((gm) => {
                  const active = selectedGameMode === gm.id;
                  return (
                    <button
                      key={gm.id}
                      onClick={() => handleSelectGameMode(gm.id)}
                      className={`px-2 py-1 rounded-lg font-pixel text-[11px] transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-800 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      style={{ color: active ? gm.accent : undefined }}
                    >
                      {gm.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 bg-[#090b10]/95 p-0.5 rounded-xl border border-slate-800">
                {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((diffId) => {
                  const dCfg = DIFFICULTIES[diffId];
                  const active = selectedDifficulty === diffId;
                  return (
                    <button
                      key={diffId}
                      onClick={() => handleSelectDifficulty(diffId)}
                      className={`px-2 py-1 rounded-lg font-pixel text-[11px] transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-800 text-amber-300 border border-amber-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      style={{
                        color: active ? dCfg.accent : undefined,
                      }}
                    >
                      {t.difficulties[diffId].name} ({dCfg.gemMult}x💎)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone 3 (Right): Soul Gems + Music Studio + Quests + Settings + Sound */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#090b10]/95 border border-sky-500/60 text-sky-300 font-pixel text-xs">
                <SoulGemIcon className="w-4 h-4 shrink-0" />
                <span>{profile.soulGems}</span>
              </div>

              {/* Beginner Guidebook Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('TUTORIAL_GUIDE');
                }}
                className="btn-3d btn-3d-emerald px-2.5 py-1 rounded-xl font-pixel text-[11px] flex items-center gap-1 cursor-pointer"
                title="Sổ Tay Hướng Dẫn Tân Thủ & Tuyệt Kỹ Vũ Khí"
              >
                <span>📘 TÂN THỦ</span>
              </button>

              {/* Direct AI & Full Song Studio Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('MUSIC_STUDIO');
                }}
                className="btn-3d btn-3d-purple px-2.5 py-1 rounded-xl font-pixel text-[11px] flex items-center gap-1 cursor-pointer"
                title="Phòng Thu Bài Hát AI & Nhạc Nền"
              >
                <span>🎵 BÀI HÁT</span>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('QUESTS');
                }}
                className="btn-3d btn-3d-amber relative px-2.5 py-1 rounded-xl font-pixel text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <QuestScrollIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.quests}</span>
                {claimableQuestsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 border border-white text-white font-pixel text-[9px] flex items-center justify-center animate-bounce">
                    {claimableQuestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('SETTINGS');
                }}
                className="btn-3d btn-3d-slate p-1.5 rounded-xl flex items-center justify-center cursor-pointer"
                aria-label="Settings"
              >
                <SettingsPixelIcon className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleMute}
                className="btn-3d btn-3d-slate p-1.5 rounded-xl flex items-center justify-center cursor-pointer"
                aria-label="Sound"
              >
                <SoundIcon muted={settings.muted} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= COMPACT 3-COLUMN LANDSCAPE STAGE ================= */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-2 items-center my-auto py-0.5 pointer-events-auto">
            {/* LEFT DOCK (3 Cols): 4 Compact Station Buttons */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-1.5 order-2 lg:order-1">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('RACE_STUDIO');
                }}
                className="btn-3d btn-3d-emerald p-2 rounded-xl text-left flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-300 flex items-center justify-center shrink-0 font-pixel text-xs text-emerald-200">
                  ✦
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-xs text-slate-950 truncate">
                    {t.raceStudioBtn}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-900 font-bold truncate">
                    {localizedRace.name} · {t.raceStudioSub}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setGachaState('IDLE');
                  setGachaReward(null);
                  setActiveModal('GACHA');
                }}
                className="btn-3d btn-3d-purple p-2 rounded-xl text-left flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-950/90 border border-amber-300 flex items-center justify-center shrink-0">
                  <ChestGachaIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-xs text-amber-200 truncate">
                    {t.gachaChest}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-purple-100 truncate">
                    {t.gachaSub} · <span className="text-amber-300 font-bold">120 💎</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('ARMORY');
                  setActiveModal('SHOP');
                }}
                className="btn-3d btn-3d-cyan p-2 rounded-xl text-left flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-950/90 border border-cyan-200 flex items-center justify-center shrink-0">
                  <AnvilArmoryIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-xs text-slate-950 truncate">
                    {t.armory} & {t.sanctuary}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-900 font-bold truncate">
                    ⚔ {t.weapons[activeStarterWeaponId].name}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setCodexTab(
                    claimableAchievementsCount > 0 ? 'ACHIEVEMENTS' : 'WEAPONS'
                  );
                  setActiveModal('CODEX');
                }}
                className="btn-3d btn-3d-amber relative p-2 rounded-xl text-left flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-950/85 border border-amber-200 flex items-center justify-center shrink-0 font-pixel text-xs text-amber-300">
                  📖
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-xs text-slate-950 truncate">
                    SỔ TAY & THÀNH TỰU
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-900 font-bold truncate">
                    16 Vũ Khí · 3 Boss · 💎
                  </div>
                </div>
                {claimableAchievementsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 border border-white text-white font-pixel text-[9px] flex items-center justify-center animate-bounce">
                    {claimableAchievementsCount}
                  </span>
                )}
              </button>
            </div>

            {/* CENTER STAGE (6 Cols): Hero Pedestal + Skin & Pet Switcher */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <span
                  className="px-2 py-0.5 rounded font-pixel text-[11px] bg-slate-900 border"
                  style={{
                    color: raceCfg.accent,
                    borderColor: raceCfg.accent,
                  }}
                >
                  {localizedRace.name}
                </span>
                <span
                  className="font-pixel text-sm sm:text-base tracking-wider"
                  style={{
                    color: isHeroLocked ? '#94a3b8' : classCfg.accentColor,
                  }}
                >
                  {localizedHero.name.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-pixel text-[10px] border ${
                    previewSkinTier === 'legendary'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : previewSkinTier === 'rare'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800 border-slate-600 text-slate-300'
                  }`}
                >
                  {currentSkinCfg.badge}
                </span>
              </div>

              <div className="relative flex items-center justify-center">
                <LobbyStageCanvas
                  heroClass={selectedClass}
                  skinTier={previewSkinTier}
                  raceCustom={profile.raceCustom}
                  isLocked={isHeroLocked}
                  petId={selectedPet}
                  weaponId={activeStarterWeaponId}
                  lockedBannerText={t.lockedHeroBanner}
                  onCyclePet={() => {
                    const order: PetId[] = [
                      'cat',
                      'mini_slime',
                      'baby_dragon',
                      'cyber_neko',
                    ];
                    const nextPet =
                      order[(order.indexOf(selectedPet) + 1) % order.length];
                    handleSelectPet(nextPet);
                  }}
                />
              </div>

              <div className="w-full max-w-md flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 bg-[#090b10]/95 px-2 py-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleCycleSkin(-1)}
                    className="btn-3d btn-3d-slate px-2 py-0.5 rounded-lg font-pixel text-xs cursor-pointer"
                  >
                    ◀
                  </button>

                  <div className="min-w-[155px] sm:min-w-[180px] text-center px-1">
                    <div className="font-pixel text-xs text-amber-300 flex items-center justify-center gap-1">
                      {previewSkinTier === 'legendary' && (
                        <SparkleCrownIcon className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate">{currentSkinCfg.name}</span>
                    </div>
                    <div className="text-[10px] font-mono-tabular text-slate-400">
                      {isSkinOwned ? t.skinOwned : `${currentSkinCfg.cost} 💎`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCycleSkin(1)}
                    className="btn-3d btn-3d-slate px-2 py-0.5 rounded-lg font-pixel text-xs cursor-pointer"
                  >
                    ▶
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {isHeroLocked && (
                    <button
                      onClick={() => handleUnlockHero(selectedClass)}
                      className="btn-3d btn-3d-amber px-3 py-1 rounded-xl font-pixel text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <LockPixelIcon className="w-3.5 h-3.5" />
                      <span>
                        {t.unlockHero} ({classCfg.unlockCost} 💎)
                      </span>
                    </button>
                  )}

                  {!isHeroLocked && !isSkinOwned && (
                    <button
                      onClick={() =>
                        handleUnlockSkin(selectedClass, previewSkinTier)
                      }
                      className="btn-3d btn-3d-purple px-3 py-1 rounded-xl font-pixel text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <SparkleCrownIcon className="w-3.5 h-3.5" />
                      <span>
                        {t.buySkin} ({currentSkinCfg.cost} 💎)
                      </span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 bg-[#090b10]/90 px-2 py-0.5 rounded-xl border border-slate-800 text-[10px] font-mono-tabular flex-wrap justify-center">
                    <span>🐾</span>
                    {(Object.keys(PETS) as PetId[]).map((pid) => (
                      <button
                        key={pid}
                        onClick={() => handleSelectPet(pid)}
                        className={`px-1.5 py-0.5 rounded font-bold cursor-pointer ${
                          selectedPet === pid
                            ? 'bg-sky-500/25 text-sky-300 border border-sky-400/60'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {PETS[pid].name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT DOCK (3 Cols): Compact Hero Stats + Launch Buttons */}
            <div className="lg:col-span-3 flex flex-col gap-1.5 order-3">
              <div className="bg-[#090b10]/95 border border-slate-800 rounded-xl p-2.5 text-left shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                  <span className="font-pixel text-xs text-amber-400">
                    {t.heroStats}
                  </span>
                  <span className="text-[11px] font-mono-tabular text-emerald-400 font-bold">
                    CRIT{' '}
                    {Math.round(
                      (classCfg.critChance + raceCfg.critBonus) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 mb-1.5 text-center font-mono-tabular">
                  <div className="p-1 rounded-lg bg-[#111726] border border-rose-500/30">
                    <div className="text-[9px] text-rose-300">HP</div>
                    <div className="text-xs font-bold text-rose-400">
                      {classCfg.maxHp +
                        raceCfg.hpBonus +
                        profile.upgrades.hpLevel * 15}
                    </div>
                  </div>
                  <div className="p-1 rounded-lg bg-[#111726] border border-slate-600/40">
                    <div className="text-[9px] text-slate-300">GIÁP</div>
                    <div className="text-xs font-bold text-slate-200">
                      {classCfg.maxArmor +
                        raceCfg.armorBonus +
                        profile.upgrades.armorLevel * 8}
                    </div>
                  </div>
                  <div className="p-1 rounded-lg bg-[#111726] border border-sky-500/30">
                    <div className="text-[9px] text-sky-300">MANA</div>
                    <div className="text-xs font-bold text-sky-400">
                      {classCfg.maxMana +
                        raceCfg.manaBonus +
                        profile.upgrades.manaLevel * 25}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="p-1.5 rounded-lg bg-[#111726] border border-amber-500/30">
                    <div className="flex items-center justify-between text-xs font-pixel text-amber-300">
                      <span className="flex items-center gap-1 truncate">
                        <SkillStarIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{localizedHero.skillName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">[Q]</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-tight line-clamp-1 mt-0.5">
                      {localizedHero.skillDesc}
                    </p>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[#111726] border border-purple-500/40">
                    <div className="flex items-center justify-between text-xs font-pixel text-purple-300">
                      <span className="flex items-center gap-1 truncate">
                        <span>★</span>
                        <span className="truncate">{classCfg.ultName}</span>
                      </span>
                      <span className="text-[10px] text-amber-300 shrink-0">[F]</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-tight line-clamp-1 mt-0.5">
                      {classCfg.ultDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                <button
                  onClick={handleStartDungeonDirect}
                  className="btn-3d btn-3d-emerald min-h-[42px] w-full py-2 px-3 rounded-xl font-pixel text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <SwordPixelIcon className="w-4 h-4" />
                  <span>{t.startRun}</span>
                </button>

                <button
                  onClick={handleEnterLivingRoom}
                  className="btn-3d btn-3d-amber min-h-[38px] w-full py-1.5 px-3 rounded-xl font-pixel text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.enterLivingRoom}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= COMPACT 6-HERO BOTTOM ROSTER BAR ================= */}
          <div className="relative z-10 w-full max-w-6xl pointer-events-auto">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-[#090b10]/95 p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
              {(Object.keys(HERO_CLASSES) as HeroClassId[]).map((clsId) => {
                const cfg = HERO_CLASSES[clsId];
                const locHero = t.heroes[clsId];
                const isSelected = selectedClass === clsId;
                const locked = !profile.unlockedHeroes.includes(clsId);
                const equippedSkin =
                  profile.selectedSkins?.[clsId] || 'default';

                return (
                  <button
                    key={clsId}
                    onClick={() => handleSelectClass(clsId)}
                    className={`relative p-1.5 rounded-xl border flex items-center gap-1.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#161f33] border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-[#0d121d] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <HeroMiniPortrait
                        heroId={clsId}
                        skinTier={isSelected ? previewSkinTier : equippedSkin}
                        locked={locked}
                        raceCustom={profile.raceCustom}
                      />
                      {locked && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
                          <LockPixelIcon className="w-2 h-2" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="font-pixel text-xs truncate"
                        style={{
                          color: locked
                            ? '#94a3b8'
                            : isSelected
                            ? cfg.accentColor
                            : '#f8fafc',
                        }}
                      >
                        {locHero.name}
                      </div>
                      {locked ? (
                        <div className="text-[10px] font-mono-tabular text-amber-300 font-bold">
                          🔒 {cfg.unlockCost} 💎
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono-tabular text-emerald-400 truncate">
                          {t.unlocked}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 0: RACIAL & COSMETIC CHARACTER STUDIO (Phòng Tạo Chủng Tộc)
         ===================================================================== */}
      {activeModal === 'RACE_STUDIO' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/92 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#090b10] border-2 border-emerald-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-pixel text-xs sm:text-sm text-emerald-400">
                  {t.raceStudioTitle}
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-1">
                  {t.raceStudioDesc}
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer shrink-0"
              >
                {t.closeBtn}
              </button>
            </div>

            {/* Body Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 py-3 pr-1">
              {/* Left Column: Live Animated Preview & Race Passive */}
              <div className="md:col-span-4 flex flex-col items-center justify-between p-4 rounded-2xl bg-[#111726] border-2 border-slate-800">
                <div className="text-center">
                  <div
                    className="font-pixel text-xs mb-0.5"
                    style={{ color: raceCfg.accent }}
                  >
                    {localizedRace.name}
                  </div>
                  <div className="text-[11px] font-mono-tabular text-emerald-400 font-bold">
                    {localizedRace.bonusDesc}
                  </div>
                </div>

                <RacePreviewCanvas
                  heroClass={selectedClass}
                  skinTier={previewSkinTier}
                  raceCustom={profile.raceCustom}
                />

                <div className="w-full space-y-2">
                  <button
                    onClick={handleRandomizeRaceCustom}
                    className="btn-3d btn-3d-purple w-full py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                  >
                    {t.randomizeBtn}
                  </button>
                  <button
                    onClick={() => {
                      sound.playChing();
                      setActiveModal('NONE');
                    }}
                    className="btn-3d btn-3d-emerald w-full py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                  >
                    {t.saveCustomBtn}
                  </button>
                </div>
              </div>

              {/* Right Column: Modular Race & Feature Selectors */}
              <div className="md:col-span-8 space-y-3.5 text-left font-mono-tabular">
                {/* 1. Race Presets */}
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <div className="font-pixel text-[10px] text-amber-300 mb-2">
                    {t.racePresetLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(Object.keys(RACES) as RaceId[]).map((rId) => {
                      const rMeta = RACES[rId];
                      const active = profile.raceCustom.raceId === rId;
                      return (
                        <button
                          key={rId}
                          onClick={() => handleSelectRacePreset(rId)}
                          className={`p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-slate-800 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="font-pixel text-[9px] truncate"
                            style={{ color: rMeta.accent }}
                          >
                            {t.races[rId].name}
                          </div>
                          <div className="text-[9px] text-slate-300 mt-1 leading-tight">
                            {t.races[rId].bonusDesc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Skin Tone & Eye Glow Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                    <div className="font-pixel text-[10px] text-amber-300 mb-2">
                      {t.skinToneLabel}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {SKIN_TONES.map((tone) => {
                        const active =
                          profile.raceCustom.skinColor === tone.color;
                        return (
                          <button
                            key={tone.id}
                            onClick={() =>
                              handleUpdateRaceTrait({ skinColor: tone.color })
                            }
                            className={`w-8 h-8 rounded-lg border-2 transition-transform cursor-pointer ${
                              active
                                ? 'border-white scale-110 shadow-[0_0_10px_#fff]'
                                : 'border-slate-700'
                            }`}
                            style={{ backgroundColor: tone.color }}
                            title={tone.label}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                    <div className="font-pixel text-[10px] text-amber-300 mb-2">
                      {t.eyeColorLabel}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {EYE_COLORS.map((eye) => {
                        const active =
                          profile.raceCustom.eyeColor === eye.color;
                        return (
                          <button
                            key={eye.id}
                            onClick={() =>
                              handleUpdateRaceTrait({ eyeColor: eye.color })
                            }
                            className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                              active
                                ? 'border-white scale-110 shadow-[0_0_10px_#fff]'
                                : 'border-slate-700'
                            }`}
                            style={{ backgroundColor: eye.color }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Horns Style */}
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <div className="font-pixel text-[10px] text-amber-300 mb-2">
                    {t.hornStyleLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HORN_STYLES.map((hStyle: HornStyle) => {
                      const active = profile.raceCustom.hornStyle === hStyle;
                      return (
                        <button
                          key={hStyle}
                          onClick={() =>
                            handleUpdateRaceTrait({ hornStyle: hStyle })
                          }
                          className={`py-2 px-2.5 rounded-xl border font-pixel text-[9px] cursor-pointer ${
                            active
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.horns[hStyle]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Wings Style */}
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <div className="font-pixel text-[10px] text-amber-300 mb-2">
                    {t.wingStyleLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {WING_STYLES.map((wStyle: WingStyle) => {
                      const active = profile.raceCustom.wingStyle === wStyle;
                      return (
                        <button
                          key={wStyle}
                          onClick={() =>
                            handleUpdateRaceTrait({ wingStyle: wStyle })
                          }
                          className={`py-2 px-2.5 rounded-xl border font-pixel text-[9px] cursor-pointer ${
                            active
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.wings[wStyle]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Ears Style */}
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <div className="font-pixel text-[10px] text-amber-300 mb-2">
                    {t.earStyleLabel}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {EAR_STYLES.map((eStyle: EarStyle) => {
                      const active = profile.raceCustom.earStyle === eStyle;
                      return (
                        <button
                          key={eStyle}
                          onClick={() =>
                            handleUpdateRaceTrait({ earStyle: eStyle })
                          }
                          className={`py-2 px-2.5 rounded-xl border font-pixel text-[9px] cursor-pointer ${
                            active
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t.ears[eStyle]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: MYSTERY CHEST GACHA (Mở Rương Bí Ẩn - Skins, Vũ Khí, Kim Cương)
         ===================================================================== */}
      {activeModal === 'GACHA' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-purple-500 rounded-2xl p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.35)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ChestGachaIcon className="w-6 h-6" />
                <h2 className="font-pixel text-xs sm:text-sm text-amber-300">
                  {t.gachaModalTitle}
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-sky-500/40 text-sky-300 font-pixel text-xs">
                <SoulGemIcon className="w-4 h-4" />
                {profile.soulGems}
              </span>
            </div>

            <div className="relative h-44 rounded-2xl bg-gradient-to-b from-purple-950/50 to-[#0d121d] border-2 border-purple-500/40 flex flex-col items-center justify-center p-4 mb-4 overflow-hidden">
              <div
                className={`transition-transform ${
                  gachaState === 'SHAKING'
                    ? 'animate-chest-shake'
                    : 'scale-110'
                }`}
              >
                <ChestGachaIcon className="w-20 h-20 drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]" />
              </div>

              {gachaState === 'IDLE' && (
                <p className="text-xs font-mono-tabular text-purple-200 mt-3">
                  {t.gachaModalDesc}
                </p>
              )}

              {gachaState === 'SHAKING' && (
                <p className="font-pixel text-xs text-amber-300 mt-3 animate-pulse">
                  {t.gachaShaking}
                </p>
              )}

              {gachaState === 'REVEALED' && gachaReward && (
                <div className="animate-modal-pop mt-2 text-center">
                  <div
                    className="font-pixel text-xs sm:text-sm mb-1"
                    style={{ color: gachaReward.accent }}
                  >
                    ★ {gachaReward.title} ★
                  </div>
                  <div className="text-xs font-mono-tabular text-slate-200">
                    {gachaReward.subtitle}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRollGachaChest}
              disabled={gachaState === 'SHAKING' || profile.soulGems < 120}
              className="btn-3d btn-3d-amber w-full min-h-[48px] py-3 px-5 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChestGachaIcon className="w-5 h-5" />
              <span>
                {gachaState === 'SHAKING' ? t.gachaShaking : t.gachaOpenBtn}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: BLACKSMITH ARMORY (16 WEAPONS) & SANCTUARY UPGRADES
         ===================================================================== */}
      {activeModal === 'SHOP' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#090b10] border-2 border-amber-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-pixel text-xs sm:text-base text-amber-400">
                  {t.shopModalTitle}
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-1">
                  {t.shopModalSub}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-300 font-pixel text-xs">
                  <SoulGemIcon className="w-4 h-4" />
                  <span>{profile.soulGems}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick(false);
                    setActiveModal('NONE');
                  }}
                  className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 my-3">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('ARMORY');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  shopTab === 'ARMORY' ? 'btn-3d-cyan' : 'btn-3d-slate'
                }`}
              >
                {t.tabArmory}
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('UPGRADES');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  shopTab === 'UPGRADES' ? 'btn-3d-amber' : 'btn-3d-slate'
                }`}
              >
                {t.tabUpgrades}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {shopTab === 'ARMORY' ? (
                <div className="space-y-3">
                  {/* Extra Vial Supply */}
                  <div className="p-3 rounded-xl bg-[#111726] border border-rose-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PotionPixelIcon className="w-7 h-7 shrink-0" />
                      <div>
                        <div className="font-pixel text-xs text-rose-300">
                          {t.extraVialTitle}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {t.extraVialDesc}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyPreRunPotion}
                      disabled={profile.preRunPotion || profile.soulGems < 50}
                      className={`btn-3d min-h-[38px] px-4 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                        profile.preRunPotion
                          ? 'btn-3d-emerald'
                          : 'btn-3d-rose'
                      }`}
                    >
                      {profile.preRunPotion ? t.equippedBtn : '50 💎'}
                    </button>
                  </div>

                  {/* All 16 Weapons Blueprint Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                      const w = WEAPONS[wId];
                      const locW = t.weapons[wId];
                      const unlocked = profile.unlockedWeapons.includes(wId);
                      const isEquippedStarter =
                        profile.selectedStarterWeapon === wId;

                      return (
                        <div
                          key={wId}
                          className={`p-3 rounded-xl bg-[#111726] border-2 flex flex-col justify-between ${
                            isEquippedStarter
                              ? 'border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                              : 'border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <WeaponMiniSprite weaponId={wId} />
                              <div className="flex items-center gap-1">
                                {w.canDeflect && (
                                  <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300">
                                    ⚡ DEFLECT
                                  </span>
                                )}
                                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                                  {w.rarity}
                                </span>
                              </div>
                            </div>
                            <div
                              className="font-pixel text-xs truncate"
                              style={{ color: w.rarityColor }}
                            >
                              {locW.name}
                            </div>
                            <div className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                              DMG {w.damage} ·{' '}
                              <span className="text-sky-400">
                                {w.manaCost} MP
                              </span>{' '}
                              · {w.meleeStyle ? w.meleeStyle.toUpperCase() : w.type.toUpperCase()}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                              {locW.desc}
                            </p>

                            {/* Unique Weapon Passive & Active Skill Badges */}
                            <div className="mt-2 space-y-1 pt-1.5 border-t border-slate-800/90 text-[10px] font-mono-tabular">
                              {w.passiveName && (
                                <div className="text-emerald-300 leading-tight">
                                  <span className="font-bold text-emerald-400">
                                    ◆ Nội tại ({w.passiveName}):
                                  </span>{' '}
                                  <span className="text-slate-300">
                                    {w.passiveDesc}
                                  </span>
                                </div>
                              )}
                              {w.skillName && (
                                <div className="text-amber-300 leading-tight">
                                  <span className="font-bold text-amber-400">
                                    ★ Chiêu VK [C] ({w.skillName} · {w.skillEnergy || 16}MP):
                                  </span>{' '}
                                  <span className="text-slate-300">
                                    {w.skillDesc}
                                  </span>
                                </div>
                              )}
                              {(w.rarity === 'Epic' ||
                                w.rarity === 'Legendary') && (
                                <div className="text-purple-300 font-bold">
                                  ✦ Hào Quang {w.rarity}:{' '}
                                  {w.rarity === 'Legendary'
                                    ? '+20% Sát thương Chí mạng & Hồi +1 MP mỗi đòn trúng'
                                    : '+12% Sát thương Chí mạng & Vòng sáng Sử Thi'}
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleUnlockOrEquipWeapon(wId)}
                            disabled={
                              !unlocked && profile.soulGems < w.shopGemsCost
                            }
                            className={`btn-3d mt-3 min-h-[38px] w-full py-1.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer ${
                              isEquippedStarter
                                ? 'btn-3d-emerald'
                                : unlocked
                                ? 'btn-3d-cyan'
                                : 'btn-3d-amber'
                            }`}
                          >
                            {isEquippedStarter
                              ? t.equippedBtn
                              : unlocked
                              ? t.equipStartBtn
                              : `${t.forgeBtn} (${w.shopGemsCost} 💎)`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UPGRADE_DEFINITIONS.map((u) => {
                    const lv = profile.upgrades[u.key];
                    const isMax = lv >= 5;
                    const cost = u.baseCost + lv * 60;
                    const canAfford = profile.soulGems >= cost && !isMax;

                    return (
                      <div
                        key={u.key}
                        className="p-3.5 rounded-xl bg-[#111726] border-2 border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-pixel text-xs"
                              style={{ color: u.accent }}
                            >
                              {u.name}
                            </span>
                            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                              Lv.{lv}/5
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {u.desc}
                          </p>
                          <div className="text-[11px] font-mono-tabular text-emerald-400 mt-1">
                            {u.bonusPerLevel}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuyUpgrade(u.key, u.baseCost)}
                          disabled={!canAfford}
                          className={`btn-3d min-h-[42px] px-3.5 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                            isMax ? 'btn-3d-emerald' : 'btn-3d-amber'
                          }`}
                        >
                          {isMax ? t.maxedBtn : `${t.upgradeBtn} (${cost} 💎)`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: DAILY QUESTS SCROLL
         ===================================================================== */}
      {activeModal === 'QUESTS' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-lg bg-[#090b10] border-2 border-amber-400 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <QuestScrollIcon className="w-6 h-6" />
                <h2 className="font-pixel text-xs sm:text-sm text-amber-300">
                  {t.questsModalTitle}
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {/* 1. One-Time Starter Gift Pack (+500 Gems) & Daily Check-In Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#111726] border-2 border-emerald-500/60 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-xs text-emerald-300">
                        🎁 QUÀ TÂN THỦ (1 LẦN)
                      </span>
                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        +500 💎
                      </span>
                    </div>
                    <p className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                      Trợ cấp khởi đầu duy nhất 1 lần cho Hiệp Sĩ mới để mở khóa Anh Hùng hoặc Vũ Khí.
                    </p>
                  </div>
                  <button
                    onClick={handleClaimStarterPack}
                    disabled={Boolean(profile.starterPackClaimed)}
                    className={`btn-3d w-full py-2 px-3 rounded-xl font-pixel text-[10px] cursor-pointer ${
                      profile.starterPackClaimed
                        ? 'btn-3d-slate'
                        : 'btn-3d-emerald'
                    }`}
                  >
                    {profile.starterPackClaimed
                      ? '✓ ĐÃ NHẬN QUÀ TÂN THỦ'
                      : 'NHẬN NGAY +500 💎'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-950/70 to-[#111726] border-2 border-sky-500/60 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-xs text-sky-300">
                        📅 ĐIỂM DANH HÀNG NGÀY
                      </span>
                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-sky-500/20 text-amber-300">
                        Chuỗi {profile.dailyStreak || 0} ngày
                      </span>
                    </div>
                    <p className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                      Mỗi ngày vào game nhận thưởng Kim Cương (Tối đa 1 lần/ngày, chuỗi càng cao thưởng càng lớn).
                    </p>
                  </div>
                  <button
                    onClick={handleClaimDailyLogin}
                    disabled={!canClaimDailyLogin}
                    className={`btn-3d w-full py-2 px-3 rounded-xl font-pixel text-[10px] cursor-pointer ${
                      !canClaimDailyLogin ? 'btn-3d-slate' : 'btn-3d-cyan'
                    }`}
                  >
                    {!canClaimDailyLogin
                      ? '✓ HÔM NAY ĐÃ ĐIỂM DANH'
                      : `ĐIỂM DANH +${dailyLoginGemReward} 💎`}
                  </button>
                </div>
              </div>

              {profile.dailyQuests.map((q) => {
                const completed = q.progress >= q.target;
                const pct = Math.min(
                  100,
                  Math.round((q.progress / q.target) * 100)
                );
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-[#111726] border-2 border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[10px] sm:text-xs text-slate-100">
                        {q.title}
                      </div>
                      <div className="text-xs font-mono-tabular text-slate-400 mt-0.5">
                        {q.desc}
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono-tabular text-slate-400 mt-1">
                        {t.progressLabel}: {q.progress}/{q.target}
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimQuest(q.id)}
                      disabled={!completed || q.claimed}
                      className={`btn-3d min-h-[40px] px-3.5 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                        q.claimed
                          ? 'btn-3d-slate'
                          : completed
                          ? 'btn-3d-emerald'
                          : 'btn-3d-amber'
                      }`}
                    >
                      {q.claimed
                        ? t.claimedBtn
                        : completed
                        ? `${t.claimBtn} +${q.rewardGems} 💎`
                        : `+${q.rewardGems} 💎`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: AVATAR & PLAYER PROFILE
         ===================================================================== */}
      {activeModal === 'AVATAR' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-lg bg-[#090b10] border-2 border-amber-500/70 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-400">
                {t.avatarModalTitle}
              </h2>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono-tabular text-slate-400 mb-1">
                {t.nicknameLabel}
              </label>
              <input
                type="text"
                maxLength={18}
                value={profile.playerName}
                onChange={(e) =>
                  updateAndSaveProfile((prev) => ({
                    ...prev,
                    playerName: e.target.value || 'Soul Knight',
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#111726] border border-slate-700 text-slate-100 font-mono-tabular text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="mb-4">
              <div className="text-xs font-mono-tabular text-slate-400 mb-2">
                {t.chooseAvatarLabel}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVATAR_LIST.map((av) => {
                  const selected = profile.avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        sound.playUiClick(true);
                        updateAndSaveProfile((prev) => ({
                          ...prev,
                          avatarId: av.id as AvatarId,
                        }));
                      }}
                      className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#111726] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <PixelAvatarGraphic
                        avatarId={av.id}
                        className="w-10 h-10 rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-100 truncate">
                          {av.name}
                        </div>
                        <div
                          className="text-[10px] font-mono-tabular truncate"
                          style={{ color: av.accent }}
                        >
                          {av.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#111726] border border-slate-800 font-mono-tabular text-center">
              <div>
                <div className="text-[10px] text-slate-400">
                  {t.totalKillsLabel}
                </div>
                <div className="text-sm font-bold text-rose-400">
                  {profile.totalKills}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">
                  {t.runsClearedLabel}
                </div>
                <div className="text-sm font-bold text-amber-400">
                  {profile.runsCompleted}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Soul Gems</div>
                <div className="text-sm font-bold text-sky-400">
                  {profile.soulGems} 💎
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: SETTINGS (Language, 8-Bit BGM, SFX, Screen Shake, Auto-Aim)
         ===================================================================== */}
      {activeModal === 'SETTINGS' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-400">
                {t.settingsModalTitle}
              </h2>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono-tabular text-xs">
              {/* Language Selector */}
              <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div className="font-bold text-slate-200 mb-2">
                  {t.languageSetting}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {LANG_OPTIONS.map((lang) => {
                    const active = settings.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`py-2 px-2 rounded-lg font-pixel text-[9px] flex items-center justify-center gap-1 cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8-Bit Chiptune BGM Toggle & Music Studio Shortcut */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800 gap-2">
                <div>
                  <div className="font-bold text-slate-200">{t.bgmSetting}</div>
                  <div className="text-[10px] text-slate-400">
                    {t.bgmSettingDesc}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      sound.playUiClick(true);
                      setActiveModal('MUSIC_STUDIO');
                    }}
                    className="btn-3d btn-3d-purple px-2.5 py-1.5 rounded-lg font-pixel text-[9px] cursor-pointer"
                  >
                    🎵 STUDIO
                  </button>
                  <button
                    onClick={handleToggleBgmMute}
                    className={`btn-3d px-3 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                      !settings.bgmMuted ? 'btn-3d-emerald' : 'btn-3d-slate'
                    }`}
                  >
                    {!settings.bgmMuted ? t.onLabel : t.offLabel}
                  </button>
                </div>
              </div>

              {/* Web Audio SFX Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">{t.sfxSetting}</div>
                  <div className="text-[10px] text-slate-400">
                    {t.sfxSettingDesc}
                  </div>
                </div>
                <button
                  onClick={handleToggleMute}
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    !settings.muted ? 'btn-3d-emerald' : 'btn-3d-slate'
                  }`}
                >
                  {!settings.muted ? t.onLabel : t.offLabel}
                </button>
              </div>

              {/* Screen Shake */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    {t.shakeSetting}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(['off', 'normal', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        sound.playUiClick(true);
                        updateAndSaveSettings((s) => ({
                          ...s,
                          shakeIntensity: lvl,
                        }));
                      }}
                      className={`px-2.5 py-1 rounded font-bold uppercase cursor-pointer ${
                        settings.shakeIntensity === lvl
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Aim */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div className="font-bold text-slate-200">
                  {t.autoAimSetting}
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    updateAndSaveSettings((s) => ({
                      ...s,
                      autoAim: !s.autoAim,
                    }));
                  }}
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    settings.autoAim ? 'btn-3d-emerald' : 'btn-3d-slate'
                  }`}
                >
                  {settings.autoAim ? t.onLabel : t.offLabel}
                </button>
              </div>

              {/* Damage Numbers */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div className="font-bold text-slate-200">
                  {t.dmgNumberSetting}
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    updateAndSaveSettings((s) => ({
                      ...s,
                      showDamageNumbers: !s.showDamageNumbers,
                    }));
                  }}
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    settings.showDamageNumbers
                      ? 'btn-3d-emerald'
                      : 'btn-3d-slate'
                  }`}
                >
                  {settings.showDamageNumbers ? t.onLabel : t.offLabel}
                </button>
              </div>

              {/* Touch Control Scale */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div className="font-bold text-slate-200">
                  {t.touchScaleSetting}
                </div>
                <div className="flex items-center gap-1">
                  {(['normal', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        sound.playUiClick(true);
                        updateAndSaveSettings((s) => ({
                          ...s,
                          controlScale: sz,
                        }));
                      }}
                      className={`px-2.5 py-1 rounded font-bold uppercase cursor-pointer ${
                        settings.controlScale === sz
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('TUTORIAL_GUIDE');
                  }}
                  className="btn-3d btn-3d-emerald flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📘 SỔ TAY TÂN THỦ</span>
                </button>
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('CODEX');
                  }}
                  className="btn-3d btn-3d-amber py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                >
                  📖 BÁCH KHOA
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                {!profile.starterPackClaimed ? (
                  <button
                    onClick={handleClaimStarterPack}
                    className="btn-3d btn-3d-cyan flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                  >
                    🎁 QUÀ TÂN THỦ (+500 💎 · 1 LẦN)
                  </button>
                ) : (
                  <button
                    onClick={handleClaimDailyLogin}
                    disabled={!canClaimDailyLogin}
                    className={`btn-3d flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer ${
                      canClaimDailyLogin ? 'btn-3d-cyan' : 'btn-3d-slate'
                    }`}
                  >
                    {canClaimDailyLogin
                      ? `📅 ĐIỂM DANH NGÀY (+${dailyLoginGemReward} 💎)`
                      : '✓ ĐÃ NHẬN QUÀ TÂN THỦ & ĐIỂM DANH'}
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playUiClick(false);
                    updateAndSaveProfile(() => ({ ...DEFAULT_PROFILE }));
                  }}
                  className="btn-3d btn-3d-rose py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                >
                  {t.resetSaveBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5B: DUNGEON CODEX & ACHIEVEMENTS (16 Weapons, Bestiary, 8 Feats)
         ===================================================================== */}
      {activeModal === 'CODEX' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/92 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#090b10] border-2 border-amber-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-pixel text-xs sm:text-base text-amber-400">
                  📖 DUNGEON CODEX & HALL OF ACHIEVEMENTS
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-1">
                  Inspect all 16 Weapons, 8 Dungeon Foes & 3 Biome Bosses, and claim Soul Gem Feats!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-300 font-pixel text-xs">
                  <SoulGemIcon className="w-4 h-4" />
                  <span>{profile.soulGems}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick(false);
                    setActiveModal('NONE');
                  }}
                  className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>

            {/* 3 Tabs */}
            <div className="flex items-center gap-2 my-3 flex-wrap">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setCodexTab('WEAPONS');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  codexTab === 'WEAPONS' ? 'btn-3d-cyan' : 'btn-3d-slate'
                }`}
              >
                ⚔ WEAPONS ({profile.unlockedWeapons.length}/16)
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setCodexTab('BESTIARY');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  codexTab === 'BESTIARY' ? 'btn-3d-purple' : 'btn-3d-slate'
                }`}
              >
                💀 BESTIARY & 3 BOSSES
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setCodexTab('ACHIEVEMENTS');
                }}
                className={`btn-3d relative px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  codexTab === 'ACHIEVEMENTS' ? 'btn-3d-amber' : 'btn-3d-slate'
                }`}
              >
                🏆 ACHIEVEMENTS
                {claimableAchievementsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px]">
                    {claimableAchievementsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {codexTab === 'WEAPONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                    const w = WEAPONS[wId];
                    const locW = t.weapons[wId];
                    const unlocked = profile.unlockedWeapons.includes(wId);
                    return (
                      <div
                        key={wId}
                        className={`p-3 rounded-xl bg-[#111726] border-2 flex flex-col justify-between ${
                          unlocked ? 'border-slate-700' : 'border-slate-800/60 opacity-75'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <WeaponMiniSprite weaponId={wId} />
                            <span
                              className="text-[9px] font-pixel px-2 py-0.5 rounded bg-slate-900"
                              style={{ color: w.rarityColor }}
                            >
                              {w.rarity}
                            </span>
                          </div>
                          <div
                            className="font-pixel text-xs truncate"
                            style={{ color: w.rarityColor }}
                          >
                            {locW.name}
                          </div>
                          <div className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                            DMG {w.damage} · {w.manaCost} MP ·{' '}
                            {w.canDeflect ? '⚡ Deflect' : w.type.toUpperCase()}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {locW.desc}
                          </p>
                          <div className="mt-2 pt-1.5 border-t border-slate-800/80 space-y-1 text-[10px] font-mono-tabular">
                            {w.passiveName && (
                              <div className="text-emerald-300">
                                <span className="font-bold">◆ Nội tại:</span>{' '}
                                {w.passiveName} — {w.passiveDesc}
                              </div>
                            )}
                            {w.skillName && (
                              <div className="text-amber-300">
                                <span className="font-bold">★ Chiêu [C]:</span>{' '}
                                {w.skillName} ({w.skillEnergy || 16}MP) —{' '}
                                {w.skillDesc}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono-tabular">
                          <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                            {unlocked ? '✓ ĐÃ MỞ KHÓA' : `🔒 ${w.shopGemsCost} 💎`}
                          </span>
                          <span className="text-slate-400">Rèn tối đa: +3★</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {codexTab === 'BESTIARY' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {BESTIARY_ENTRIES.map((en) => (
                    <div
                      key={en.type}
                      className={`p-3 rounded-xl bg-[#111726] border-2 flex flex-col justify-between ${
                        en.isBoss
                          ? 'border-rose-500/60 shadow-[0_0_16px_rgba(244,63,94,0.18)]'
                          : 'border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <EnemyMiniSprite enemyType={en.type} />
                          <div className="text-right">
                            <span
                              className="text-[9px] font-pixel px-2 py-0.5 rounded bg-slate-900"
                              style={{ color: en.accent }}
                            >
                              {en.role}
                            </span>
                            <div className="text-[10px] font-mono-tabular text-slate-400 mt-1">
                              {en.biome}
                            </div>
                          </div>
                        </div>
                        <div
                          className="font-pixel text-xs"
                          style={{ color: en.accent }}
                        >
                          {en.name}
                        </div>
                        <div className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                          HP {en.hp} · ATK {en.dmg}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {en.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {codexTab === 'ACHIEVEMENTS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACHIEVEMENT_LIST.map((ach) => {
                    const curVal = ach.getValue(profile);
                    const completed = curVal >= ach.target;
                    const claimed = profile.claimedAchievements?.includes(ach.id);
                    const pct = Math.min(
                      100,
                      Math.round((curVal / ach.target) * 100)
                    );
                    return (
                      <div
                        key={ach.id}
                        className="p-3.5 rounded-xl bg-[#111726] border-2 border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-pixel text-xs"
                            style={{ color: ach.accent }}
                          >
                            {ach.title}
                          </div>
                          <div className="text-xs font-mono-tabular text-slate-400 mt-0.5">
                            {ach.desc}
                          </div>
                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-[10px] font-mono-tabular text-slate-400 mt-1">
                            {curVal} / {ach.target}
                          </div>
                        </div>

                        <button
                          onClick={() => handleClaimAchievement(ach.id)}
                          disabled={!completed || claimed}
                          className={`btn-3d min-h-[40px] px-3.5 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                            claimed
                              ? 'btn-3d-slate'
                              : completed
                              ? 'btn-3d-emerald'
                              : 'btn-3d-amber'
                          }`}
                        >
                          {claimed
                            ? t.claimedBtn
                            : completed
                            ? `${t.claimBtn} +${ach.rewardGems} 💎`
                            : `+${ach.rewardGems} 💎`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: SỔ TAY HƯỚNG DẪN TÂN THỦ & CƠ CHẾ CHIẾN ĐẤU
         ===================================================================== */}
      {activeModal === 'TUTORIAL_GUIDE' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/92 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#090b10] border-2 border-emerald-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h2 className="font-pixel text-sm sm:text-base text-emerald-400">
                  📘 SỔ TAY TÂN THỦ & BÍ KÍP CHIẾN ĐẤU HẮC THẠCH
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-0.5">
                  Hướng dẫn toàn diện về Điều khiển, Phản Đòn Đạn, Tuyệt Kỹ 16 Vũ Khí, Đe Rèn +3★ và Kinh Tế Kim Cương
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 4 Guide Tabs */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {(
                [
                  ['CONTROLS', '🎮 ĐIỀU KHIỂN & PHẢN ĐẠN'],
                  ['WEAPONS', '⚔️ TUYỆT KỸ 16 VŨ KHÍ & ĐỒ XỊN'],
                  ['HEROES_FORGE', '🏰 PHÒNG CHỜ, RÈN +3★ & TƯỢNG'],
                  ['ECONOMY', '💎 NHẬN KIM CƯƠNG & MỞ ĐỒ'],
                ] as const
              ).map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  onClick={() => {
                    sound.playUiClick(true);
                    setTutorialGuideTab(tabKey);
                  }}
                  className={`btn-3d px-3 py-1.5 rounded-xl font-pixel text-[10px] cursor-pointer ${
                    tutorialGuideTab === tabKey
                      ? 'btn-3d-emerald'
                      : 'btn-3d-slate'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs font-mono-tabular text-left">
              {tutorialGuideTab === 'CONTROLS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-amber-300">
                      ⌨️ BẢNG PHÍM TẮT PC & NÚT CẢM ỨNG
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>
                        • <span className="text-amber-300 font-bold">WASD / Mũi tên / Joystick Trái:</span> Di chuyển 8 hướng linh hoạt.
                      </li>
                      <li>
                        • <span className="text-amber-300 font-bold">SPACE hoặc J (Nút ĐÁNH/BẮN):</span> Tấn công thường (Giữ liệt để liên thanh).
                      </li>
                      <li>
                        • <span className="text-cyan-300 font-bold">Phím C / V / 4 (Nút CHIÊU VK):</span> Kích hoạt <span className="text-cyan-300 font-bold">Tuyệt Kỹ Vũ Khí</span> riêng của món vũ khí đang cầm!
                      </li>
                      <li>
                        • <span className="text-amber-300 font-bold">Phím Q / 1 (Nút SKILL):</span> Tung Kỹ năng Đặc trưng của Anh Hùng.
                      </li>
                      <li>
                        • <span className="text-purple-300 font-bold">Phím F / 3 (Nút ULT):</span> Đại Tuyệt Kỹ Thức Tỉnh quét sạch màn hình.
                      </li>
                      <li>
                        • <span className="text-sky-300 font-bold">SHIFT / K (Nút LƯỚT):</span> Lướt Bóng Ma (Miễn nhiễm 100% sát thương trong 0.5 giây I-Frame).
                      </li>
                      <li>
                        • <span className="text-emerald-300 font-bold">Phím R / TAB:</span> Đổi nhanh giữa Vũ khí Chính và Vũ khí Phụ.
                      </li>
                      <li>
                        • <span className="text-rose-300 font-bold">Phím H / 2:</span> Uống Bình Máu (+48% HP & +65 Mana).
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-emerald-300">
                      ⚡ CƠ CHẾ PHẢN ĐÒN ĐẠN (DEFLECT) & GIÁP HỒI PHỤC
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      1. <span className="text-amber-300 font-bold">Phản Đòn Đạn (Bullet Deflection):</span> Mọi vũ khí cận chiến mang nhãn <span className="text-amber-300">⚡ DEFLECT</span> (như Đại Kiếm, Song Đoản Đao, Huyết Nguyệt Đao, Lưỡi Hái, Excalibur) khi vung chém trúng đạn của quái hoặc Boss sẽ <span className="text-emerald-300 font-bold">biến đạn địch thành đạn vàng phản ngược lại</span> với 250% sát thương và hồi Mana!
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      2. <span className="text-sky-300 font-bold">Giáp Tự Hồi (Aegis Shield):</span> Thanh Giáp (màu bạc) sẽ chịu sát thương thay cho Máu. Chỉ cần né đòn trong 3.5 giây không bị trúng đạn, Giáp sẽ tự động hồi đầy lại!
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      3. <span className="text-purple-300 font-bold">Đòn Đánh Thứ 3 (Combo Finisher):</span> Chém cận chiến liên tiếp 3 nhịp sẽ tung đòn Kết Liễu (145% sát thương + phóng Kiếm Khí tầm xa).
                    </p>
                  </div>
                </div>
              )}

              {tutorialGuideTab === 'WEAPONS' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 via-[#111726] to-purple-950/60 border border-cyan-500/40">
                    <div className="font-pixel text-xs text-cyan-300">
                      ⚔️ CƠ CHẾ KÉP CỦA 16 VŨ KHÍ: NỘI TẠI TỰ ĐỘNG + NÚT CHIÊU VŨ KHÍ [C] + HÀO QUANG ĐỒ XỊN
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      • <span className="text-emerald-300 font-bold">Nội Tại Tự Động (Auto-Proc):</span> Mỗi loại vũ khí tự động kích hoạt hiệu ứng riêng sau mỗi 2–5 đòn đánh (bắn kiếm khí, triệu hồi thiên lôi, nổ dung nham, hút máu/mana).
                      <br />• <span className="text-amber-300 font-bold">Tuyệt Kỹ Chủ Động [Phím C / Nút CHIÊU VK]:</span> Tiêu hao một lượng nhỏ Mana để tung tuyệt chiêu đặc trưng của vũ khí đó bất cứ lúc nào!
                      <br />• <span className="text-purple-300 font-bold">Đặc Quyền Đồ Sử Thi (Epic) & Huyền Thoại (Legendary):</span> Vũ khí Epic tăng <span className="text-purple-300 font-bold">+12% Sát thương Chí mạng & Vòng sáng Tím</span>; Vũ khí Legendary tăng <span className="text-amber-300 font-bold">+20% Sát thương Chí mạng, Hồi +1 Mana mỗi đòn trúng & Hào quang Hoàng Kim</span> dưới chân!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                      const w = WEAPONS[wId];
                      return (
                        <div
                          key={wId}
                          className="p-2.5 rounded-xl bg-[#111726] border border-slate-800 flex items-start gap-2.5"
                        >
                          <WeaponMiniSprite weaponId={wId} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className="font-pixel text-xs truncate"
                                style={{ color: w.rarityColor }}
                              >
                                {t.weapons[wId].name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {w.rarity}
                              </span>
                            </div>
                            <div className="text-[10px] text-emerald-300 mt-0.5">
                              ◆ <span className="font-bold">{w.passiveName}:</span>{' '}
                              {w.passiveDesc}
                            </div>
                            <div className="text-[10px] text-amber-300 mt-0.5">
                              ★ <span className="font-bold">[C] {w.skillName} ({w.skillEnergy}MP):</span>{' '}
                              {w.skillDesc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tutorialGuideTab === 'HEROES_FORGE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-amber-300">
                      🏰 PHÒNG CHỜ SỐNG (LIVING ROOM) & ĐE RÈN +3★
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      • Trước khi bước vào Cổng Hầm Ngục 1-1, hãy ghé thăm <span className="text-amber-300 font-bold">Phòng Chờ Sống</span> để thử vũ khí lên Bù Nhìn Tập Luyện (Training Dummy).
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      • <span className="text-amber-300 font-bold">Đe Rèn Thợ Rèn (Reforge Anvil):</span> Dùng Vàng nhặt trong màn chơi để đập vũ khí lên <span className="text-amber-300 font-bold">+1★, +2★, +3★</span> (Mỗi cấp sao tăng <span className="text-emerald-300 font-bold">+22% Sát thương</span>, tối đa +66% DMG!).
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      • <span className="text-purple-300 font-bold">Tượng Thần Hộ Mệnh (Paladin Statue):</span> Khi dâng vàng cầu nguyện, mỗi lần bạn tung Kỹ năng [Q] sẽ kích hoạt Khiên Bất Tử 1.5 giây và hồi ngay +25 Giáp!
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-purple-300">
                      🦸 6 ANH HÙNG & 5 CHỦNG TỘC (RACE STUDIO)
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      • Mỗi Anh Hùng sở hữu 1 Kỹ năng riêng <span className="text-amber-300">[Q]</span> và 1 Đại Tuyệt Kỹ Thức Tỉnh <span className="text-purple-300">[F]</span>. Các Anh Hùng khóa trong Phòng Chờ cần được mở khóa chính thức tại Sảnh Chính trước khi sử dụng.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      • Bạn có thể kết hợp bất kỳ Anh Hùng nào với 5 Chủng Tộc (<span className="text-sky-300">Nhân Tộc, Tiên Tộc, Quỷ Tộc, Thiên Thần, Hư Không</span>) để nhận thêm chỉ số cộng thêm vĩnh viễn!
                    </p>
                  </div>
                </div>
              )}

              {tutorialGuideTab === 'ECONOMY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-sky-300">
                      💎 CÁCH KIẾM KIM CƯƠNG LINH HỒN MINH BẠCH
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>
                        1. <span className="text-emerald-300 font-bold">Gói Quà Tân Thủ (+500 💎):</span> Nhận 1 lần duy nhất tại mục Nhiệm Vụ hoặc Cài Đặt.
                      </li>
                      <li>
                        2. <span className="text-sky-300 font-bold">Điểm Danh Hàng Ngày (+150–290 💎/ngày):</span> Nhận thưởng mỗi ngày thực tế, duy trì chuỗi đăng nhập để tăng thưởng.
                      </li>
                      <li>
                        3. <span className="text-amber-300 font-bold">Hoàn Thành Huấn Luyện Tân Thủ (+150 💎):</span> Làm theo 4 bước hướng dẫn tại Phòng Chờ Sống.
                      </li>
                      <li>
                        4. <span className="text-purple-300 font-bold">Nhiệm Vụ Ngày, Thành Tựu & Diệt Boss:</span> Hạ gục quái tinh anh, diệt 3 Boss hầm ngục và hoàn thành Bảng Thành Tựu trong Sổ Tay.
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                    <div className="font-pixel text-xs text-amber-300">
                      📦 RƯƠNG TIẾP TẾ & KHO RÈN VŨ KHÍ
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      • <span className="text-amber-300 font-bold">Rương Tiếp Tế Phòng Chờ:</span> Chỉ rơi ra các Vũ Khí Tân Thủ cơ bản hoặc những Vũ Khí bạn <span className="text-emerald-300 font-bold">đã mở khóa</span> trong Kho Vũ Khí (không còn lỗi rơi đồ Huyền Thoại miễn phí khi chưa mở khóa).
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      • Muốn mang sẵn vũ khí Sử Thi / Huyền Thoại ngay từ đầu trận, hãy dùng Kim Cương rèn bản vẽ tại <span className="text-cyan-300 font-bold">Kho Vũ Khí</span> hoặc mở <span className="text-purple-300 font-bold">Rương Bí Ẩn (120 💎)</span>!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="text-[11px] font-mono-tabular text-slate-400">
                Mẹo: Vào <span className="text-amber-300 font-bold">Phòng Chờ Sống</span> để thực hành trực tiếp từng bước!
              </div>
              <div className="flex items-center gap-2">
                {!profile.starterPackClaimed && (
                  <button
                    onClick={handleClaimStarterPack}
                    className="btn-3d btn-3d-emerald px-3.5 py-2 rounded-xl font-pixel text-[10px] cursor-pointer"
                  >
                    🎁 NHẬN QUÀ TÂN THỦ (+500 💎)
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('NONE');
                  }}
                  className="btn-3d btn-3d-amber px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer"
                >
                  ĐÃ HIỂU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 7: AI SONG COMPOSER & FULL 5-SECTION SOUNDTRACK STUDIO
         ===================================================================== */}
      {activeModal === 'MUSIC_STUDIO' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/92 flex items-center justify-center p-2.5 sm:p-4">
          <div className="animate-modal-pop w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#090b10] border-2 border-purple-500 rounded-2xl p-3.5 sm:p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
              <div>
                <h2 className="font-pixel text-sm sm:text-base text-amber-300">
                  🎵 PHÒNG THU BÀI HÁT AI & NHẠC NỀN 5 PHÂN ĐOẠN
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-0.5">
                  Full 128-Step Multi-Section Songs (Intro → Verse A → Verse B → Chorus → Climax) + AI Composer & MP3 Player
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono-tabular text-xs">
              {/* Live Song Status, Section Progress & Synced Lyrics Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/70 via-[#111726] to-sky-950/70 border border-purple-500/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-pixel text-purple-300">
                        ĐANG PHÁT BÀI HÁT:
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-pixel text-[10px]">
                        ĐOẠN: {songStatus.section}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      ♫ {songStatus.title} ({songStatus.bpm} BPM)
                    </div>
                  </div>

                  {/* 6 Built-in Biome Full Songs */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {(
                      [
                        ['title', 'Khải Hoàn'],
                        ['lobby', 'Thánh Điện'],
                        ['dungeon', '1-1 Đá Đen'],
                        ['frost', '1-2 Băng Giá'],
                        ['magma', '1-3 Dung Nham'],
                        ['boss', 'Boss Chiến'],
                      ] as const
                    ).map(([tr, label]) => (
                      <button
                        key={tr}
                        onClick={() => {
                          sound.playUiClick(true);
                          sound.clearExternalAudio();
                          sound.startBgm(tr);
                          setGeneratedTrackLabel(label);
                        }}
                        className="btn-3d btn-3d-slate px-2 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Synced Lyric Line & 128-Step Progress Bar */}
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/90">
                  <div className="text-xs text-emerald-300 font-semibold">
                    {songStatus.lyricLine}
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-emerald-400 transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (songStatus.step / Math.max(1, songStatus.totalSteps)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Song Composer Box (Gemini AI + Instant Preset Prompts) */}
              <div className="p-3 rounded-xl bg-[#111726] border border-purple-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-amber-300">
                    ✨ SÁNG TÁC BÀI HÁT MỚI BẰNG AI (GEMINI AI SONGWRITER)
                  </span>
                  <span className="text-[10px] text-purple-300">
                    Tự động viết giai điệu 5 đoạn & lời bài hát
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiSongPrompt}
                    onChange={(e) => setAiSongPrompt(e.target.value)}
                    placeholder="Nhập chủ đề bài hát (VD: Hiệp sĩ Samurai chém tan bão tuyết)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    disabled={isGeneratingSong}
                    onClick={async () => {
                      sound.playUiClick(true);
                      setIsGeneratingSong(true);
                      const track = await sound.composeAiSongFromPrompt(
                        aiSongPrompt,
                        musicStyle,
                        musicBpm
                      );
                      setGeneratedTrackLabel(track.name);
                      setMusicBpm(track.bpm);
                      setMusicStyle(track.style);
                      setSongStatus(sound.getCurrentSongStatus());
                      setIsGeneratingSong(false);
                      sound.playChing();
                    }}
                    className="btn-3d btn-3d-purple px-4 py-2 rounded-xl font-pixel text-xs cursor-pointer shrink-0"
                  >
                    {isGeneratingSong
                      ? '⏳ ĐANG SÁNG TÁC...'
                      : '🎼 AI SÁNG TÁC BÀI HÁT'}
                  </button>
                </div>

                {/* Preset Prompt Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    'Kiếm sĩ Samurai đại chiến giữa bão tuyết',
                    'Hiệp sĩ Hắc Thạch vượt biển lửa dung nham',
                    'Bản nhạc Synthwave Cyberpunk tốc độ cao',
                    'Khúc ca khải hoàn nơi quán rượu hiệp sĩ',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAiSongPrompt(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Musical Scale, Tempo BPM & 4-Channel Mixer */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5 p-2.5 rounded-xl bg-[#111726] border border-slate-800">
                  <div className="font-pixel text-xs text-amber-300 mb-1.5">
                    ÂM GIAI CHỦ ĐẠO
                  </div>
                  <div className="space-y-1">
                    {(Object.keys(MUSIC_SCALES) as MusicStyle[]).map((stKey) => {
                      const sc = MUSIC_SCALES[stKey];
                      const active = musicStyle === stKey;
                      return (
                        <button
                          key={stKey}
                          onClick={() => {
                            sound.playUiClick(true);
                            setMusicStyle(stKey);
                            setMusicBpm(sc.defaultBpm);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                            active
                              ? 'bg-purple-950/60 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-pixel text-[11px] truncate">
                            {sc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                            {sc.defaultBpm} BPM
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-7 flex flex-col gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#111726] border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-pixel text-xs text-amber-300">
                        NHỊP ĐỘ (TEMPO)
                      </span>
                      <span className="font-bold text-sky-300">
                        {musicBpm} BPM
                      </span>
                    </div>
                    <input
                      type="range"
                      min={95}
                      max={185}
                      step={5}
                      value={musicBpm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMusicBpm(val);
                        sound.setTempoBpm(val);
                      }}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#111726] border border-slate-800">
                    <div className="font-pixel text-xs text-amber-300 mb-1.5">
                      BÀN MIXER 4 KÊNH NHẠC CỤ
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(
                        [
                          ['lead', '🎹 Giai Điệu'],
                          ['arp', '✨ Hòa Âm'],
                          ['bass', '🎸 Trầm Bass'],
                          ['drums', '🥁 Trống'],
                        ] as const
                      ).map(([chKey, label]) => {
                        const on = musicChannels[chKey];
                        return (
                          <button
                            key={chKey}
                            onClick={() => {
                              const nextVal = !on;
                              sound.channelEnabled[chKey] = nextVal;
                              setMusicChannels((prev) => ({
                                ...prev,
                                [chKey]: nextVal,
                              }));
                              sound.playUiClick(true);
                            }}
                            className={`py-1.5 px-2 rounded-lg font-pixel text-[10px] border cursor-pointer ${
                              on
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom MP3 / WAV Upload from Device */}
                  <div className="p-2.5 rounded-xl bg-[#111726] border border-sky-500/40 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-pixel text-xs text-sky-300">
                        📂 PHÁT BÀI HÁT .MP3 / .WAV TỪ MÁY CỦA BẠN
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Chọn bất kỳ file nhạc MP3/WAV nào để phát làm nhạc nền chiến đấu
                      </div>
                    </div>
                    <label className="btn-3d btn-3d-cyan px-3 py-1.5 rounded-xl font-pixel text-[11px] cursor-pointer shrink-0">
                      <span>CHỌN FILE NHẠC</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          sound.playExternalAudioFile(url, file.name);
                          setGeneratedTrackLabel(file.name);
                          setSongStatus(sound.getCurrentSongStatus());
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Footer: Procedural Full Song & WAV Download */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => {
                    const pat = sound.generateProceduralSong(
                      musicStyle,
                      musicBpm
                    );
                    setGeneratedTrackLabel(pat.name);
                    setSongStatus(sound.getCurrentSongStatus());
                  }}
                  className="btn-3d btn-3d-amber flex-1 min-h-[42px] py-2 px-4 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🎲 PHỐI NGẪU NHIÊN BÀI HÁT 5 ĐOẠN</span>
                </button>

                <button
                  onClick={() => {
                    sound.playChing();
                    const wavUrl = sound.exportCurrentTrackWavUrl();
                    const a = document.createElement('a');
                    a.href = wavUrl;
                    a.download = `obsidian-song-${musicStyle}-${musicBpm}bpm.wav`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(wavUrl), 5000);
                  }}
                  className="btn-3d btn-3d-emerald min-h-[42px] py-2 px-4 rounded-xl font-pixel text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>⬇ TẢI BÀI HÁT (.WAV)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. ULTRA-COMPACT SOUL KNIGHT LANDSCAPE HUD (90% OPEN PLAYFIELD)
         ===================================================================== */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1.5 sm:p-2.5">
          {/* TOP PERIMETER BAR (Ultra-Slim Edge-Hugged Layout) */}
          <div className="flex items-start justify-between gap-1.5">
            {/* Top-Left: Compact Soul Knight 3-Bar Status Pill (<8% Screen Area) */}
            <div className="pointer-events-auto bg-[#090b10]/82 backdrop-blur-xs border border-slate-800/90 rounded-xl p-1.5 shadow-lg w-[154px] sm:w-[178px]">
              {/* Micro Header: Avatar + Lv + Gold + Gems */}
              <div className="flex items-center justify-between gap-1 mb-1 px-0.5">
                <div className="flex items-center gap-1 min-w-0">
                  <PixelAvatarGraphic
                    avatarId={profile.avatarId}
                    className="w-4 h-4 rounded border border-slate-700 shrink-0"
                  />
                  <span className="text-[10px] font-pixel text-amber-300 truncate">
                    Lv.{hud.level}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono-tabular font-bold shrink-0">
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <CoinPixelIcon className="w-3 h-3" />
                    {hud.gold}
                  </span>
                  <span className="flex items-center gap-0.5 text-sky-300">
                    <SoulGemIcon className="w-3 h-3" />
                    {profile.soulGems}
                  </span>
                </div>
              </div>

              {/* 1. Compact HP Bar with Overlaid Text */}
              <div className="relative w-full h-3.5 bg-slate-950 rounded overflow-hidden border border-slate-800/90 mb-1">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-500 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.hp / Math.max(1, hud.maxHp))
                    )})`,
                  }}
                />
                <div className="absolute inset-0 px-1.5 flex items-center justify-between text-[10px] font-mono-tabular font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  <span className="flex items-center gap-1">
                    <HeartPixelIcon className="w-2.5 h-2.5" />
                    <span>HP</span>
                  </span>
                  <span>
                    {hud.hp}/{hud.maxHp}
                  </span>
                </div>
              </div>

              {/* 2. Compact Shield Bar with Overlaid Text */}
              <div className="relative w-full h-3.5 bg-slate-950 rounded overflow-hidden border border-slate-800/90 mb-1">
                <div
                  className="h-full bg-gradient-to-r from-slate-500 to-slate-400 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.armor / Math.max(1, hud.maxArmor))
                    )})`,
                  }}
                />
                <div className="absolute inset-0 px-1.5 flex items-center justify-between text-[10px] font-mono-tabular font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  <span className="flex items-center gap-1">
                    <ShieldPixelIcon className="w-2.5 h-2.5" />
                    <span>GIÁP</span>
                  </span>
                  <span>
                    {hud.armor}/{hud.maxArmor}
                  </span>
                </div>
              </div>

              {/* 3. Compact Mana Bar with Overlaid Text */}
              <div className="relative w-full h-3.5 bg-slate-950 rounded overflow-hidden border border-slate-800/90">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.mana / Math.max(1, hud.maxMana))
                    )})`,
                  }}
                />
                <div className="absolute inset-0 px-1.5 flex items-center justify-between text-[10px] font-mono-tabular font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  <span className="flex items-center gap-1">
                    <ManaPixelIcon className="w-2.5 h-2.5" />
                    <span>MP</span>
                  </span>
                  <span>
                    {hud.mana}/{hud.maxMana}
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Center: Slim Non-Intrusive Stage Banner / Boss Bar */}
            <div className="flex flex-col items-center gap-1 max-w-xs sm:max-w-sm w-full px-1">
              {(hud.stageBannerTimer || 0) > 0 && !hud.inLivingRoom && (
                <div className="animate-modal-pop bg-[#090b10]/90 border border-amber-400 rounded-xl px-3 py-1 text-center shadow-lg">
                  <div className="text-[10px] font-pixel text-amber-300">
                    {hud.gameMode === 'ENDLESS'
                      ? `♾️ ĐẤU TRƯỜNG VÔ TẬN · ĐỢT ${hud.floor}`
                      : hud.gameMode === 'BOSS_RUSH'
                      ? `💀 SĂN BOSS · TẦNG 1-${hud.floor}`
                      : `TẦNG 1-${hud.floor} · ${hud.biomeName}`}
                  </div>
                </div>
              )}

              {(hud.bossWarningTimer || 0) > 0 && (
                <div className="animate-bounce bg-rose-950/92 border border-rose-500 rounded-xl px-3 py-1 text-center shadow-lg">
                  <div className="text-xs font-pixel text-rose-300">
                    ⚠️ CẢNH BÁO: BOSS XUẤT HIỆN! ⚠️
                  </div>
                </div>
              )}

              {hud.inLivingRoom &&
                !profile.tutorialCompleted &&
                (hud.tutorialStep ?? 0) < 5 && (
                  <div className="pointer-events-auto w-full max-w-md bg-[#090b10]/92 border-2 border-emerald-400 rounded-xl px-3 py-2 text-left shadow-xl">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-pixel text-[10px] text-emerald-300">
                        🎓 HUẤN LUYỆN TÂN THỦ ({Math.min(4, (hud.tutorialStep ?? 0) + 1)}/4)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            sound.playUiClick(true);
                            setActiveModal('TUTORIAL_GUIDE');
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[9px] font-pixel text-amber-300 cursor-pointer"
                        >
                          📘 SỔ TAY
                        </button>
                        <button
                          onClick={handleCompleteTutorial}
                          className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-[9px] font-pixel text-emerald-200 cursor-pointer"
                        >
                          {(hud.tutorialStep ?? 0) >= 4
                            ? '🎁 NHẬN +150 💎'
                            : 'BỎ QUA (+150 💎)'}
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono-tabular text-slate-200 leading-snug">
                      {(hud.tutorialStep ?? 0) === 0 &&
                        'Bước 1: Dùng phím WASD hoặc Joystick bên trái để di chuyển quanh Phòng Chờ Sống.'}
                      {(hud.tutorialStep ?? 0) === 1 &&
                        'Bước 2: Lại gần Bù Nhìn Tập Luyện, nhấn SPACE (ĐÁNH) hoặc phím [C] (CHIÊU VK) để thử đòn đánh & tuyệt kỹ vũ khí!'}
                      {(hud.tutorialStep ?? 0) === 2 &&
                        'Bước 3: Nhấn phím [Q] để tung Kỹ Năng Anh Hùng hoặc phím [R] để Đổi Vũ Khí.'}
                      {(hud.tutorialStep ?? 0) === 3 &&
                        'Bước 4: Lại gần Rương Tiếp Tế bên trái và nhấn [E] để mở rương nhận vũ khí!'}
                      {(hud.tutorialStep ?? 0) >= 4 &&
                        '🎉 Xuất sắc! Nhấn nút [🎁 NHẬN +150 💎] hoặc bước lên Cổng Hầm Ngục phía Bắc để vào Tầng 1-1!'}
                    </div>
                  </div>
                )}

              {hud.inLivingRoom &&
                (profile.tutorialCompleted || (hud.tutorialStep ?? 0) >= 5) &&
                !hud.promptText && (
                  <div className="bg-[#090b10]/80 backdrop-blur-xs border border-slate-800 rounded-xl px-3 py-1 text-center">
                    <div className="text-xs font-pixel text-amber-400">
                      {t.livingRoomBanner}
                    </div>
                  </div>
                )}

              {hud.bossActive && (
                <div className="w-full bg-[#090b10]/90 border border-rose-500/70 rounded-xl px-2.5 py-1 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-0.5">
                    <span className="font-pixel text-rose-300 truncate">
                      💀 {hud.bossName}
                    </span>
                    <span className="text-rose-400 font-bold shrink-0">
                      {hud.bossHp}/{hud.bossMaxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-transform duration-150 origin-left"
                      style={{
                        transform: `scaleX(${Math.max(
                          0,
                          Math.min(1, hud.bossHp / Math.max(1, hud.bossMaxHp))
                        )})`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Top-Right: Collapsible Micro Minimap + Zoom + Song Studio + Pause */}
            <div className="pointer-events-auto flex items-start gap-1.5">
              {!hud.inLivingRoom && (
                <div className="bg-[#090b10]/82 backdrop-blur-xs border border-slate-800/90 rounded-xl p-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setMinimapCollapsed((prev) => !prev)}
                    className="w-full flex items-center justify-between gap-1.5 text-[10px] font-mono-tabular text-slate-300 cursor-pointer"
                    title="Nhấn để thu gọn / mở rộng Bản đồ"
                  >
                    <span className="flex items-center gap-0.5 font-bold text-purple-300">
                      <StairsPixelIcon className="w-3 h-3" />
                      {hud.gameMode === 'ENDLESS'
                        ? `W-${hud.floor}`
                        : `1-${hud.floor}`}
                    </span>
                    <span
                      className={
                        hud.roomLocked
                          ? 'text-rose-400 font-bold'
                          : hud.portalOpen
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {hud.roomLocked
                        ? `ĐỢT ${hud.currentWave}/${hud.maxWaves}`
                        : hud.portalOpen
                        ? 'CỔNG MỞ'
                        : `${hud.enemiesRemaining} Quái`}
                    </span>
                  </button>

                  {!minimapCollapsed && (
                    <div className="grid grid-cols-3 gap-0.5 w-[58px] h-[52px] sm:w-[66px] sm:h-[58px] p-1 mt-1 bg-slate-950/90 rounded border border-slate-800">
                      {[0, 1, 2].map((gy) =>
                        [0, 1, 2].map((gx) => {
                          const rm = hud.minimapRooms.find(
                            (r) => r.gridX === gx && r.gridY === gy
                          );
                          if (!rm) {
                            return (
                              <div
                                key={`${gx}-${gy}`}
                                className="rounded-xs bg-transparent"
                              />
                            );
                          }
                          let bg = 'bg-slate-800';
                          if (rm.isCurrent) bg = 'bg-sky-400';
                          else if (rm.kind === 'BOSS_ROOM')
                            bg = 'bg-rose-500/80';
                          else if (rm.kind === 'CHEST_ROOM')
                            bg = 'bg-amber-400/80';
                          else if (
                            rm.kind === 'SHOP_ROOM' ||
                            rm.kind === 'STATUE_ROOM'
                          )
                            bg = 'bg-purple-400/80';
                          else if (rm.cleared) bg = 'bg-emerald-500/60';

                          const canFastTravel =
                            !hud.roomLocked &&
                            !rm.isCurrent &&
                            (rm.cleared || rm.visited);

                          return (
                            <button
                              key={rm.id}
                              type="button"
                              disabled={!canFastTravel}
                              onClick={() => {
                                if (canFastTravel) {
                                  engineRef.current?.teleportToRoom(rm.id);
                                }
                              }}
                              className={`rounded-xs transition-transform ${bg} ${
                                rm.isCurrent ? 'ring-1 ring-white' : ''
                              } ${
                                canFastTravel
                                  ? 'cursor-pointer hover:scale-110 hover:ring-1 hover:ring-amber-300'
                                  : 'cursor-default'
                              }`}
                            />
                          );
                        })
                      )}
                    </div>
                  )}

                  {(hud.comboCount || 0) >= 2 && (
                    <div className="mt-1 px-1 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-pixel text-[9px] text-center">
                      🔥 x{hud.comboCount}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1">
                {hud.inLivingRoom && (
                  <button
                    onClick={handleStartDungeonDirect}
                    className="btn-3d btn-3d-amber h-8 px-2.5 rounded-lg font-pixel text-[11px] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    VÀO 1-1 →
                  </button>
                )}

                {/* Camera Wide-Field Zoom Button */}
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    const nextZoom =
                      engineRef.current?.cycleCameraZoom() || 0.86;
                    setCameraZoomPct(Math.round(nextZoom * 100));
                  }}
                  className="h-8 px-2 rounded-lg bg-[#090b10]/85 border border-slate-800 text-sky-300 hover:border-sky-400 font-mono-tabular text-[10px] font-bold flex items-center justify-center cursor-pointer"
                  title="Đổi góc nhìn Camera (Rộng / Chuẩn / Gần)"
                >
                  🔍{cameraZoomPct}%
                </button>

                {/* Beginner Guidebook Quick Button */}
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('TUTORIAL_GUIDE');
                  }}
                  className="w-8 h-8 rounded-lg bg-[#090b10]/85 border border-slate-800 text-emerald-300 hover:border-emerald-400 flex items-center justify-center cursor-pointer text-xs"
                  title="Mở Sổ Tay Tân Thủ & Chiêu Vũ Khí"
                >
                  📘
                </button>

                {/* Music Studio Quick Button */}
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('MUSIC_STUDIO');
                  }}
                  className="w-8 h-8 rounded-lg bg-[#090b10]/85 border border-slate-800 text-purple-300 hover:border-purple-400 flex items-center justify-center cursor-pointer text-xs"
                  title="Mở Phòng Thu Bài Hát"
                >
                  🎵
                </button>

                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('SETTINGS');
                  }}
                  className="w-8 h-8 rounded-lg bg-[#090b10]/85 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label="Settings"
                >
                  <SettingsPixelIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    engineRef.current?.setGameState('PAUSED');
                  }}
                  className="w-8 h-8 rounded-lg bg-[#090b10]/85 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label="Pause Game"
                >
                  <PausePixelIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM PERIMETER: TRANSLUCENT CORNER THUMB CONTROLS & INTERACT PILL */}
          <div className="flex items-end justify-between gap-2 pb-0.5 px-0.5">
            {/* Bottom-Left: Compact Translucent 360° Virtual Joystick */}
            <div
              ref={dpadRef}
              onPointerDown={handleDpadPointerDown}
              onPointerMove={handleDpadPointerMove}
              onPointerUp={handleDpadPointerUp}
              onPointerCancel={handleDpadPointerUp}
              className={`pointer-events-auto relative rounded-full bg-[#090b10]/55 backdrop-blur-xs border border-slate-700/80 flex items-center justify-center touch-none cursor-pointer shadow-lg ${
                isLargeControls
                  ? 'w-[124px] h-[124px] sm:w-[136px] sm:h-[136px]'
                  : 'w-[102px] h-[102px] sm:w-[114px] sm:h-[114px]'
              }`}
              aria-label="Virtual Directional Pad"
            >
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono-tabular text-slate-500/80 pointer-events-none">
                ▲
              </span>
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono-tabular text-slate-500/80 pointer-events-none">
                ▼
              </span>
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-mono-tabular text-slate-500/80 pointer-events-none">
                ◀
              </span>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-mono-tabular text-slate-500/80 pointer-events-none">
                ▶
              </span>

              <div className="w-11 h-11 rounded-full border border-slate-700/60 pointer-events-none" />

              <div
                className="absolute w-9 h-9 rounded-full bg-amber-500/85 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.45)] flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
                }}
              >
                <div className="w-2 h-2 rotate-45 bg-slate-950" />
              </div>
            </div>

            {/* Bottom-Center: Non-Blocking Contextual Interact Prompt */}
            {hud.promptText && (
              <button
                onClick={() => engineRef.current?.bufferAction('interact')}
                className="pointer-events-auto mb-1 px-3.5 py-1.5 rounded-xl bg-[#090b10]/92 border-2 border-amber-400 text-center shadow-lg hover:bg-slate-900 active:scale-95 transition-transform cursor-pointer max-w-xs sm:max-w-md"
              >
                <div className="text-xs font-pixel text-amber-300 truncate">
                  {hud.promptText}
                </div>
                {hud.promptSubtext && (
                  <div className="text-[10px] font-mono-tabular text-slate-300 truncate">
                    {hud.promptSubtext}
                  </div>
                )}
              </button>
            )}

            {/* Bottom-Right: Compact Soul Knight Action Cluster */}
            <div className="pointer-events-auto flex flex-col items-end gap-1.5">
              {/* Compact Weapon Switch Pill */}
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  engineRef.current?.bufferAction('switch_weapon');
                }}
                className="min-h-[32px] px-2.5 py-1 rounded-xl bg-[#090b10]/85 backdrop-blur-xs border border-slate-700 hover:border-amber-400 active:scale-95 flex items-center gap-2 shadow-md transition-transform cursor-pointer"
                aria-label="Switch Weapon"
              >
                <div className="text-left">
                  <div
                    className="text-[11px] font-pixel leading-tight whitespace-nowrap flex items-center gap-1"
                    style={{ color: hud.activeWeapon.rarityColor }}
                  >
                    <span>
                      {t.weapons[hud.activeWeapon.id]?.name ||
                        hud.activeWeapon.name}
                    </span>
                    {(hud.activeWeaponUpgrade || 0) > 0 && (
                      <span className="px-1 rounded bg-amber-500/25 border border-amber-400 text-amber-300 font-pixel text-[9px]">
                        +{hud.activeWeaponUpgrade}★
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] font-mono-tabular text-slate-400">
                    DMG{' '}
                    {Math.round(
                      hud.activeWeapon.damage *
                        (1 + (hud.activeWeaponUpgrade || 0) * 0.22)
                    )}{' '}
                    ·{' '}
                    <span className="text-sky-400 font-bold">
                      {hud.activeWeapon.manaCost} MP
                    </span>
                  </div>
                </div>
                <SwapWeaponIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>

              {/* Compact Ergonomic Action Buttons Row */}
              <div className="flex items-end gap-1.5 sm:gap-2">
                {/* Heal Vial Slot */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('potion');
                  }}
                  disabled={hud.potions <= 0}
                  className={`relative rounded-xl bg-[#090b10]/80 backdrop-blur-xs border border-slate-700 hover:border-rose-400 active:scale-95 flex flex-col items-center justify-center p-1 disabled:opacity-45 transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[46px] min-h-[46px]'
                      : 'min-w-[40px] min-h-[40px]'
                  }`}
                  aria-label="Use Healing Vial"
                >
                  <PotionPixelIcon className="w-4 h-4" />
                  <span className="text-[9px] font-mono-tabular text-rose-300 font-bold whitespace-nowrap">
                    {hud.potions}/{hud.maxPotions}
                  </span>
                </button>

                {/* Active Weapon Skill Slot [C] ("CHIÊU VK") */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('weapon_skill');
                  }}
                  className={`relative rounded-xl bg-[#090b10]/85 backdrop-blur-xs border border-cyan-400/85 hover:border-amber-300 active:scale-95 flex flex-col items-center justify-center p-1 overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.28)] transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[52px] min-h-[52px]'
                      : 'min-w-[46px] min-h-[46px]'
                  }`}
                  aria-label="Cast Active Weapon Skill"
                  title={`${hud.activeWeapon.skillName || 'Tuyệt Kỹ Vũ Khí'} [Phím C] (${hud.activeWeapon.skillEnergy || 16} MP)`}
                >
                  {(hud.weaponSkillCooldownRatio || 0) > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/85 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.weaponSkillCooldownRatio})`,
                      }}
                    />
                  )}
                  <span
                    className="text-[10px] font-pixel relative z-10 leading-none"
                    style={{ color: hud.activeWeapon.rarityColor }}
                  >
                    ⚔️[C]
                  </span>
                  <span className="text-[8px] font-pixel text-cyan-300 relative z-10 whitespace-nowrap mt-0.5">
                    CHIÊU VK
                  </span>
                  <span className="text-[8px] font-mono-tabular text-slate-300 relative z-10 leading-none">
                    {hud.activeWeapon.skillEnergy || 16}MP
                  </span>
                </button>

                {/* Class Skill Slot [Q] */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('skill');
                  }}
                  className={`relative rounded-xl bg-[#090b10]/80 backdrop-blur-xs border border-slate-700 hover:border-amber-400 active:scale-95 flex flex-col items-center justify-center p-1 overflow-hidden transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[50px] min-h-[50px]'
                      : 'min-w-[44px] min-h-[44px]'
                  }`}
                  aria-label="Cast Class Skill"
                >
                  {hud.skillCooldownRatio > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/80 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.skillCooldownRatio})`,
                      }}
                    />
                  )}
                  <SkillStarIcon className="w-4 h-4 relative z-10" />
                  <span className="text-[9px] font-pixel text-amber-300 relative z-10 whitespace-nowrap">
                    {t.skillLabel}
                  </span>
                </button>

                {/* Ultimate Awakening Slot [F] */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('ultimate');
                  }}
                  className={`relative rounded-xl bg-[#090b10]/80 backdrop-blur-xs border border-purple-500/80 hover:border-amber-300 active:scale-95 flex flex-col items-center justify-center p-1 overflow-hidden shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[50px] min-h-[50px]'
                      : 'min-w-[44px] min-h-[44px]'
                  }`}
                  aria-label="Cast Ultimate Awakening"
                >
                  {(hud.ultCooldownRatio || 0) > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/85 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.ultCooldownRatio})`,
                      }}
                    />
                  )}
                  <SparkleCrownIcon className="w-4 h-4 relative z-10" />
                  <span className="text-[9px] font-pixel text-purple-300 relative z-10 whitespace-nowrap">
                    ULT
                  </span>
                </button>

                {/* Dash Button */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('dash');
                  }}
                  className={`relative rounded-xl bg-[#090b10]/80 backdrop-blur-xs border border-sky-500/70 hover:border-sky-400 active:scale-95 flex flex-col items-center justify-center p-1 overflow-hidden transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[52px] min-h-[52px]'
                      : 'min-w-[46px] min-h-[46px]'
                  }`}
                  aria-label="Dash with Ghost Trail"
                >
                  {hud.dashCooldownRatio > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/85 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.dashCooldownRatio})`,
                      }}
                    />
                  )}
                  <BootPixelIcon className="w-4 h-4 relative z-10" />
                  <span className="text-[9px] font-pixel text-sky-300 relative z-10 whitespace-nowrap">
                    {t.dashLabel}
                  </span>
                </button>

                {/* Primary Fire / Strike Button */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.setAttackHeld(true);
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    engineRef.current?.setAttackHeld(false);
                  }}
                  onPointerLeave={() => {
                    engineRef.current?.setAttackHeld(false);
                  }}
                  className={`relative rounded-full bg-amber-500/95 hover:bg-amber-400 active:scale-95 border-2 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center p-1.5 transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[68px] min-h-[68px]'
                      : 'min-w-[58px] min-h-[58px]'
                  }`}
                  aria-label="Fire or Strike"
                >
                  <SwordPixelIcon className="w-5 h-5" />
                  <span className="text-[10px] font-pixel font-extrabold whitespace-nowrap">
                    {hud.activeWeapon.type === 'melee'
                      ? t.meleeStrike
                      : t.rangedFire}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. LEVEL UP / SKILL BUFF SELECTION MODAL
         ===================================================================== */}
      {gameState === 'BOON_SELECT' && (
        <div className="absolute inset-0 bg-[#06080d]/88 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-xl bg-[#090b10] border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-xs font-pixel text-amber-400 tracking-widest mb-1">
                {t.levelUpTitle} · LEVEL {hud.level}
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-100">
                {t.chooseBoonTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boonChoices.map((boon) => (
                <button
                  key={boon.id}
                  onClick={() => engineRef.current?.applyBoon(boon)}
                  className="text-left p-4 rounded-xl bg-[#111726] border-2 border-slate-800 hover:border-amber-400 active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div
                      className="text-[11px] font-mono-tabular mb-1"
                      style={{ color: boon.accent }}
                    >
                      {boon.category}
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-100 mb-2">
                      {boon.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {boon.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-xs font-pixel text-amber-300">
                    {t.pickBoonBtn}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. PAUSE MODAL
         ===================================================================== */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-[#06080d]/85 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-sm bg-[#090b10] border-2 border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="font-pixel text-lg text-amber-400 mb-1">
              {t.pauseTitle}
            </h2>
            <p className="text-xs font-mono-tabular text-slate-400 mb-5">
              1-{hud.floor} · {t.difficulties[hud.difficulty].name} ·{' '}
              {hud.gold}G · +{hud.soulGemsEarned} 💎
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('PLAYING');
                }}
                className="btn-3d btn-3d-amber min-h-[46px] w-full py-2.5 px-4 rounded-xl font-pixel text-xs cursor-pointer"
              >
                {t.resumeBtn}
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('SETTINGS');
                }}
                className="btn-3d btn-3d-slate min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.settingsModalTitle}
              </button>
              <button
                onClick={handleEnterLivingRoom}
                className="btn-3d btn-3d-cyan min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.backLivingRoomBtn}
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  engineRef.current?.setGameState('TITLE_MENU');
                }}
                className="btn-3d btn-3d-rose min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.backMainLobbyBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VICTORY / GAME OVER MODAL
         ===================================================================== */}
      {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <div className="absolute inset-0 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-xs font-mono-tabular tracking-widest mb-1 text-slate-400">
              {gameState === 'VICTORY' ? t.victorySub : t.defeatSub}
            </div>
            <h2
              className={`font-pixel text-xl sm:text-2xl mb-4 ${
                gameState === 'VICTORY' ? 'text-amber-400' : 'text-rose-500'
              }`}
            >
              {gameState === 'VICTORY' ? t.victoryTitle : t.defeatTitle}
            </h2>

            <div className="grid grid-cols-2 gap-2.5 mb-5 text-left bg-[#111726] border border-slate-800/90 rounded-xl p-4 font-mono-tabular">
              <div>
                <div className="text-[11px] text-slate-400">
                  {t.floorReachedLabel}
                </div>
                <div className="text-base font-bold text-slate-100">
                  1-{hud.floor} ({t.difficulties[hud.difficulty].name})
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">
                  {t.foesSlainLabel}
                </div>
                <div className="text-base font-bold text-slate-100">
                  {hud.kills}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">
                  {t.gemsEarnedLabel}
                </div>
                <div className="text-base font-bold text-sky-400">
                  +{hud.soulGemsEarned} 💎
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">
                  {t.totalDamageLabel}
                </div>
                <div className="text-base font-bold text-rose-400">
                  {hud.damageDealt}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('TITLE_MENU');
                }}
                className="btn-3d btn-3d-amber min-h-[46px] flex-1 py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.backMainLobbyBtn}
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('TITLE_MENU');
                  setActiveModal('GACHA');
                }}
                className="btn-3d btn-3d-purple min-h-[46px] py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.gachaChest} 💎
              </button>
              <button
                onClick={handleStartDungeonDirect}
                className="btn-3d btn-3d-emerald min-h-[46px] py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                {t.playAgainBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
